/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { Car, Plus } from "lucide-react-native";
import { Calendar } from "react-native-calendars";
import RegistroCard from "../../components/RegistroCard";
import ModalRegistro from "../../components/ModalRegistro";

import {
  buscarRegistrosDoDia,
  deletarRegistro,
  salvarRegistro,
} from "../services/api";

// Helpers de data
const formatarData = (date) =>
  date.toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

const formatarDataSelecionada = (date) => {
  if (!date) return "";
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(date.getDate()).padStart(2, "0")}`;
};

const parseDataComHoraMeioDia = (iso) => {
  if (!iso) return null;
  const partes = iso.split("-");
  return new Date(
    Number(partes[0]),
    Number(partes[1]) - 1,
    Number(partes[2]),
    12
  );
};

const DashboardScreen = () => {
  const [selectedDate, setSelectedDate] = useState(() => {
    const hoje = new Date();
    hoje.setHours(12, 0, 0, 0);
    return hoje;
  });

  const [mostrarModal, setMostrarModal] = useState(false);
  const [registroEditando, setRegistroEditando] = useState(null);
  const [registros, setRegistros] = useState([]);
  const [kmTotal, setKmTotal] = useState(0);

  useEffect(() => {
    carregarRegistros();
  }, [selectedDate]);

  // ✅ FUNÇÃO CORRIGIDA: horários agora estão na ordem correta
  const carregarRegistros = async () => {
    try {
      const dataStr = formatarDataSelecionada(selectedDate);
      const resposta = await buscarRegistrosDoDia(dataStr);

      const convertidos = resposta.map((r) => {
        const iso = r.dataISO || r.dataMarcada || r.data;
        const dataCorrigida = parseDataComHoraMeioDia(iso);

        return {
          ...r,
          data: dataCorrigida,

          // ✅ Início agora realmente representa o horário de ida
          horarioInicio:
            r.horarioInicio ||
            r.horario_inicio ||
            r.horaRetorno ||
            r.horaEntrada ||
            "",

          // ✅ Fim agora representa o horário de volta/saída
          horarioFim:
            r.horarioFim || r.horario_fim || r.horaSaida || r.hora_saida || "",
        };
      });

      setRegistros(convertidos);

      const soma = convertidos.reduce((acc, r) => {
        const ida = parseFloat(r.kmIda ?? r.kmInicial ?? 0);
        const volta = parseFloat(r.kmVolta ?? r.kmFinal ?? 0);
        const diff = volta - ida;
        return acc + (isNaN(diff) ? 0 : diff);
      }, 0);

      setKmTotal(soma);
    } catch (err) {
      Alert.alert("Erro", "Não foi possível carregar os registros.");
    }
  };

  const handleSalvar = async (registro) => {
    try {
      const dataMarcada = formatarDataSelecionada(selectedDate);
      const payload = { ...registro, dataMarcada };

      let salvo;
      if (registroEditando) {
        salvo = await salvarRegistro(registroEditando, payload);
      } else {
        salvo = await salvarRegistro(null, payload);
      }

      setMostrarModal(false);
      setRegistroEditando(null);
      carregarRegistros();
    } catch (err) {
      Alert.alert("Erro", "Erro ao salvar registro.");
    }
  };

  const handleExcluir = async (id) => {
    Alert.alert("Confirmar", "Deseja excluir este registro?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: async () => {
          try {
            await deletarRegistro(id);
            carregarRegistros();
          } catch {
            Alert.alert("Erro", "Não foi possível excluir o registro.");
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Car color="#fff" size={32} />
        <View style={{ marginLeft: 12 }}>
          <Text style={styles.titulo}>Grupo Ômega</Text>
          <Text style={styles.subtitulo}>Controle de KM</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.sidebar}>
          <Text style={styles.dataTexto}>{formatarData(selectedDate)}</Text>
          <Calendar
            onDayPress={(day) => {
              const [year, month, dayNum] = day.dateString
                .split("-")
                .map(Number);
              const d = new Date(year, month - 1, dayNum, 12, 0, 0, 0);
              setSelectedDate(d);
            }}
            markedDates={{
              [formatarDataSelecionada(selectedDate)]: {
                selected: true,
                marked: true,
                selectedColor: "#7b2ff7",
              },
            }}
            theme={{
              todayTextColor: "#9333ea",
              arrowColor: "#9333ea",
              selectedDayTextColor: "#fff",
              selectedDayBackgroundColor: "#7b2ff7",
            }}
          />

          <View style={styles.resumo}>
            <Text style={styles.resumoTitulo}>Resumo do Dia</Text>
            <Text>Total de Viagens: {registros.length}</Text>
            <Text>KM Total: {kmTotal} km</Text>
          </View>
        </View>

        <View style={styles.section}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              setRegistroEditando(null);
              setMostrarModal(true);
            }}
          >
            <Plus color="#fff" size={18} />
            <Text style={[styles.buttonText, { marginLeft: 8 }]}>
              Novo Registro
            </Text>
          </TouchableOpacity>

          {registros.length === 0 ? (
            <Text style={{ marginTop: 20 }}>Nenhum registro.</Text>
          ) : (
            registros.map((r) => (
              <RegistroCard
                key={r.id}
                registro={r}
                onEditar={() => {
                  setRegistroEditando(r);
                  setMostrarModal(true);
                }}
                onExcluir={() => handleExcluir(r.id)}
              />
            ))
          )}
        </View>
      </ScrollView>

      <ModalRegistro
        visible={mostrarModal}
        onClose={() => {
          setMostrarModal(false);
          setRegistroEditando(null);
        }}
        onSalvar={handleSalvar}
        dataSelecionada={selectedDate}
        registro={registroEditando}
      />
    </View>
  );
};

export default DashboardScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f4f4",
  },
  topBar: {
    backgroundColor: "#7b2ff7",
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  titulo: {
    fontSize: 20,
    color: "#fff",
    fontWeight: "bold",
  },
  subtitulo: {
    fontSize: 14,
    color: "#e0e0e0",
  },
  content: {
    padding: 16,
  },
  sidebar: {
    marginBottom: 24,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    elevation: 3,
  },
  dataTexto: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
    color: "#333",
  },
  resumo: {
    marginTop: 20,
  },
  resumoTitulo: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 4,
    color: "#4b0082",
  },
  section: {
    marginTop: 16,
  },
  button: {
    flexDirection: "row",
    backgroundColor: "#9333ea",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
