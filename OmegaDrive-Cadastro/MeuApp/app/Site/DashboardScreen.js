/* eslint-disable import/no-unresolved */
import React, { useEffect, useState, useCallback } from "react";
import { View, Text, TouchableOpacity, ScrollView, Alert } from "react-native";
import { Car, Plus, Pencil, Trash2 } from "lucide-react-native";
import CalendarPicker from "react-native-calendar-picker";
import ModalRegistro from "@components/ModalRegistro";
import {
  buscarRegistrosDoDia,
  salvarRegistro,
  deletarRegistro,
} from "@services/api";
import styles from "@styles/DashboardStyles";
// seu StyleSheet separado

const formatarDataBR = (data) =>
  data instanceof Date && !isNaN(data)
    ? data.toLocaleDateString("pt-BR")
    : "Data inválida";

const formatarDataExtensa = (data) =>
  data instanceof Date && !isNaN(data)
    ? data
        .toLocaleDateString("pt-BR", {
          weekday: "long",
          day: "numeric",
          month: "long",
        })
        .toLowerCase()
    : "Data inválida";

const getKm = (a, b) =>
  a !== null && a !== undefined ? a : b !== null && b !== undefined ? b : 0;

const ordenarHorarios = (h1, h2) => {
  if (!h1 && !h2) return "-- → --";
  if (!h1) return `-- → ${h2}`;
  if (!h2) return `${h1} → --`;

  const [h1h, h1m] = h1.split(":").map(Number);
  const [h2h, h2m] = h2.split(":").map(Number);
  const t1 = h1h * 60 + h1m;
  const t2 = h2h * 60 + h2m;

  return t1 <= t2 ? `${h1} → ${h2}` : `${h2} → ${h1}`;
};

export default function DashboardScreen() {
  const [selectedDate, setSelectedDate] = useState(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  });
  const [mostrarModal, setMostrarModal] = useState(false);
  const [registroEditando, setRegistroEditando] = useState(null);
  const [registros, setRegistros] = useState([]);
  const [totalViagens, setTotalViagens] = useState(0);
  const [kmTotal, setKmTotal] = useState(0);

  const carregarRegistros = useCallback(async () => {
    try {
      const dataFormatada = selectedDate.toISOString().split("T")[0];
      const resposta = await buscarRegistrosDoDia(dataFormatada);
      const registrosConvertidos = resposta.map((r) => ({
        ...r,
        data: new Date(r.dataMarcada || r.data || selectedDate),
      }));
      setRegistros(registrosConvertidos);
    } catch (error) {
      console.error("Erro ao carregar registros:", error);
      setRegistros([]);
    }
  }, [selectedDate]);

  useEffect(() => {
    carregarRegistros();
  }, [carregarRegistros]);

  useEffect(() => {
    setTotalViagens(registros.length);
    const somaKm = registros.reduce((total, r) => {
      const inicio = parseFloat(r.kmIda ?? r.kmInicial ?? 0);
      const fim = parseFloat(r.kmVolta ?? r.kmFinal ?? 0);
      const diferenca = fim - inicio;
      return total + (isNaN(diferenca) ? 0 : diferenca);
    }, 0);
    setKmTotal(somaKm);
  }, [registros]);

  const validarRegistro = (registro) => {
    const { veiculo, condutor, rgCondutor, kmIda, kmVolta, horaSaida } =
      registro;

    // kmIda e kmVolta podem ser 0? Se sim, só verifica se não é null/undefined.
    if (
      !veiculo ||
      !condutor ||
      !rgCondutor ||
      kmIda == null ||
      kmVolta == null ||
      !horaSaida
    ) {
      Alert.alert("Erro", "Preencha todos os campos obrigatórios.");
      return false;
    }
    return true;
  };

  const handleSalvarRegistro = async (registro) => {
    if (!validarRegistro(registro)) return;

    try {
      const idParaSalvar = registroEditando ? registro.id : null;

      const salvo = await salvarRegistro(idParaSalvar, {
        ...registro,
        dataMarcada: selectedDate.toISOString().split("T")[0],
      });

      const novoRegistro = {
        ...salvo,
        data: new Date(salvo.dataMarcada || salvo.data),
      };

      setRegistros((prev) => {
        if (registroEditando) {
          return prev.map((r) => (r.id === novoRegistro.id ? novoRegistro : r));
        } else {
          return [...prev, novoRegistro];
        }
      });

      setMostrarModal(false);
      setRegistroEditando(null);
    } catch (error) {
      console.error("Erro ao salvar registro:", error);
      Alert.alert("Erro", "Não foi possível salvar o registro.");
    }
  };

  const handleExcluirRegistro = (id) => {
    Alert.alert("Excluir", "Deseja excluir este registro?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: async () => {
          try {
            await deletarRegistro(id);
            setRegistros((prev) => prev.filter((r) => r.id !== id));
          } catch (error) {
            console.error("Erro ao excluir:", error);
            Alert.alert("Erro", "Não foi possível excluir o registro.");
          }
        },
      },
    ]);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Car size={32} color="#fff" />
        <View style={styles.headerTexts}>
          <Text style={styles.title}>Grupo Ômega</Text>
          <Text style={styles.subtitle}>Controle de KM</Text>
        </View>
      </View>

      <Text style={styles.dateLabel}>{formatarDataExtensa(selectedDate)}</Text>

      <CalendarPicker
        onDateChange={(date) => {
          const d = new Date(date);
          d.setHours(0, 0, 0, 0);
          setSelectedDate(d);
        }}
        selectedStartDate={selectedDate}
        weekdays={["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"]}
        months={[
          "Janeiro",
          "Fevereiro",
          "Março",
          "Abril",
          "Maio",
          "Junho",
          "Julho",
          "Agosto",
          "Setembro",
          "Outubro",
          "Novembro",
          "Dezembro",
        ]}
        previousTitle="Anterior"
        nextTitle="Próximo"
        todayBackgroundColor="#ddd"
        selectedDayColor="#4a90e2"
      />

      <View style={styles.summaryBox}>
        <Text style={styles.summaryTitle}>
          Resumo do Dia - {formatarDataBR(selectedDate)}
        </Text>
        <Text>Viagens: {totalViagens}</Text>
        <Text>KM Total: {kmTotal} km</Text>
      </View>

      <TouchableOpacity
        style={styles.newRecordButton}
        onPress={() => {
          setRegistroEditando(null);
          setMostrarModal(true);
        }}
      >
        <Plus size={18} color="#fff" />
        <Text style={styles.newRecordText}>Adicionar Registro</Text>
      </TouchableOpacity>

      <Text style={styles.recordsTitle}>Registros do Dia</Text>

      {registros.length === 0 ? (
        <Text style={{ marginTop: 10 }}>Nenhum registro encontrado.</Text>
      ) : (
        registros.map((r) => (
          <View key={r.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardHeaderText}>
                🚗 {r.veiculo || "Sem veículo"}
              </Text>
              <Text style={styles.cardHeaderText}>
                {formatarDataBR(r.data)}
              </Text>
            </View>

            <View style={styles.cardBody}>
              <Text style={styles.condutorText}>
                🧑 {r.condutor || "Condutor não informado"}
              </Text>
              <Text style={styles.condutorText}>
                🆔 RG: {r.rg || "Não informado"}
              </Text>
              {r.destino && (
                <Text style={styles.condutorText}>Destino: {r.destino}</Text>
              )}
              {(r.horaSaida || r.horaInicio) && (
                <Text style={styles.condutorText}>
                  Horário: {ordenarHorarios(r.horaSaida, r.horaInicio)}
                </Text>
              )}
              <View style={styles.kmBox}>
                <View style={styles.kmItem}>
                  <Text style={styles.kmLabel}>KM Inicial</Text>
                  <Text style={styles.kmValue}>
                    {getKm(r.kmIda, r.kmInicial)}
                  </Text>
                </View>
                <View style={styles.kmItem}>
                  <Text style={styles.kmLabel}>KM Final</Text>
                  <Text style={styles.kmValue}>
                    {getKm(r.kmVolta, r.kmFinal)}
                  </Text>
                </View>
              </View>
              {r.observacoes && (
                <Text style={styles.observacoes}>Obs: {r.observacoes}</Text>
              )}
            </View>

            <View style={styles.actions}>
              <TouchableOpacity
                style={[styles.actionButton, styles.editButton]}
                onPress={() => {
                  setRegistroEditando(r);
                  setMostrarModal(true);
                }}
              >
                <Pencil size={16} color="#fff" />
                <Text style={[styles.actionText, styles.editText]}>Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, styles.deleteButton]}
                onPress={() => handleExcluirRegistro(r.id)}
              >
                <Trash2 size={16} color="#fff" />
                <Text style={[styles.actionText, styles.deleteText]}>
                  Excluir
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ))
      )}

      {mostrarModal && (
        <ModalRegistro
          dataSelecionada={selectedDate}
          registro={registroEditando}
          onClose={() => {
            setMostrarModal(false);
            setRegistroEditando(null);
          }}
          onSalvar={handleSalvarRegistro}
        />
      )}
    </ScrollView>
  );
}
