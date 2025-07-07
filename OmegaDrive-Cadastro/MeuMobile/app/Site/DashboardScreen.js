/* eslint-disable no-unused-vars */
// DashboardScreen.jsx - React Native
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

const formatarData = (date) =>
  new Date(date).toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

const DashboardScreen = () => {
  const [selectedDate, setSelectedDate] = useState(() => {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    return hoje;
  });

  const [mostrarModal, setMostrarModal] = useState(false);
  const [registroEditando, setRegistroEditando] = useState(null);
  const [registros, setRegistros] = useState([]);
  const [kmTotal, setKmTotal] = useState(0);

  useEffect(() => {
    carregarRegistros();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate]);

  const carregarRegistros = async () => {
    try {
      const dataStr = selectedDate.toISOString().split("T")[0];
      const resposta = await buscarRegistrosDoDia(dataStr);
      const convertidos = resposta.map((r) => ({
        ...r,
        data: new Date(r.dataMarcada || r.data || selectedDate),
      }));
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
      let salvo;
      if (registroEditando) {
        salvo = await salvarRegistro(registro.id, registro);
      } else {
        salvo = await salvarRegistro(null, registro);
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

  const formatarDataSelecionada = selectedDate.toISOString().split("T")[0];

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
              const d = new Date(day.dateString);
              d.setHours(0, 0, 0, 0);
              setSelectedDate(d);
            }}
            markedDates={{
              [formatarDataSelecionada]: {
                selected: true,
                marked: true,
                selectedColor: "#7b2ff7",
              },
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
                onEditar={(reg) => {
                  setRegistroEditando(reg);
                  setMostrarModal(true);
                }}
                onExcluir={handleExcluir}
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
