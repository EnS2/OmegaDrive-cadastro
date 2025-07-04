import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Modal,
} from "react-native";
// Para o calendário, recomendo instalar: react-native-calendars
// import { Calendar } from 'react-native-calendars';

// Você pode usar @expo/vector-icons para ícones ou react-native-lucide
// import { Car, Plus, Pencil, Trash2 } from "react-native-lucide";

import ModalRegistro from "@/components/ModalRegistro";
import {
  salvarRegistro,
  buscarRegistrosDoDia,
  deletarRegistro,
} from "@/services/api";

const formatarDataBR = (data) =>
  data ? new Date(data).toLocaleDateString("pt-BR") : "Data inválida";

const formatarDataExtensa = (data) =>
  data
    .toLocaleDateString("pt-BR", {
      weekday: "long",
      day: "numeric",
      month: "long",
    })
    .toLowerCase();

const getKm = (a, b) => (a != null ? a : b != null ? b : 0);

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

export default function Dashboard() {
  const [selectedDate, setSelectedDate] = useState(() => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return now;
  });
  const [mostrarModal, setMostrarModal] = useState(false);
  const [registroEditando, setRegistroEditando] = useState(null);
  const [registros, setRegistros] = useState([]);
  const [totalViagens, setTotalViagens] = useState(0);
  const [kmTotal, setKmTotal] = useState(0);

  // Carregar registros quando selectedDate muda
  useEffect(() => {
    const carregarRegistros = async () => {
      try {
        const dataFormatada = selectedDate.toISOString().split("T")[0];
        const resposta = await buscarRegistrosDoDia(dataFormatada);
        const registrosConvertidos = resposta.map((r) => ({
          ...r,
          data: new Date(r.dataMarcada || r.data || selectedDate),
        }));
        setRegistros(registrosConvertidos);
      } catch (error) {
        console.error(error);
        Alert.alert("Erro", "Erro ao carregar registros do servidor");
        setRegistros([]);
      }
    };
    carregarRegistros();
  }, [selectedDate]);

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

  const onDateChange = (date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    setSelectedDate(d);
  };

  const validarRegistro = (registro) => {
    const { veiculo, condutor, rgCondutor, kmIda, kmVolta, horaSaida } =
      registro;
    if (!veiculo || !condutor || !rgCondutor || !kmIda || !kmVolta || !horaSaida) {
      Alert.alert("Erro", "Preencha todos os campos obrigatórios.");
      return false;
    }
    return true;
  };

  const handleSalvarRegistro = async (registro) => {
    if (!validarRegistro(registro)) return;

    try {
      let salvo;
      if (registroEditando) {
        salvo = await salvarRegistro(registro.id, {
          ...registro,
          dataMarcada: selectedDate.toISOString().split("T")[0],
        });
      } else {
        salvo = await salvarRegistro(null, {
          ...registro,
          dataMarcada: selectedDate.toISOString().split("T")[0],
        });
      }

      const novoRegistro = {
        ...salvo,
        data: new Date(salvo.dataMarcada || salvo.data),
      };

      if (registroEditando) {
        setRegistros((prev) =>
          prev.map((r) => (r.id === novoRegistro.id ? novoRegistro : r))
        );
        Alert.alert("Sucesso", "Registro atualizado.");
      } else {
        setRegistros((prev) => [...prev, novoRegistro]);
        Alert.alert("Sucesso", "Registro adicionado.");
      }

      setMostrarModal(false);
      setRegistroEditando(null);
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Erro ao salvar o registro.");
    }
  };

  const handleExcluirRegistro = async (id) => {
    Alert.alert(
      "Confirmar exclusão",
      "Deseja excluir este registro?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              await deletarRegistro(id);
              setRegistros((prev) => prev.filter((r) => r.id !== id));
              Alert.alert("Sucesso", "Registro excluído.");
            } catch (error) {
              console.error(error);
              Alert.alert("Erro", "Erro ao excluir o registro.");
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  // Placeholder simples para calendário (você pode usar react-native-calendars)
  // Exemplo: mostrar a data e botões para avançar/voltar data

  return (
    <View style={styles.container}>
      {/* Top bar */}
      <View style={styles.topBar}>
        {/* Ícone de carro */}
        <Text style={styles.carIcon}>🚗</Text>
        <View>
          <Text style={styles.title}>Grupo Ômega</Text>
          <Text style={styles.subtitle}>Controle de KM</Text>
        </View>
      </View>

      <View style={styles.mainContent}>
        {/* Sidebar */}
        <View style={styles.sidebar}>
          <View style={styles.calendarSummaryCard}>
            <Text style={styles.sectionTitle}>Calendário</Text>
            <Text style={styles.selectedDateText}>
              {formatarDataExtensa(selectedDate)}
            </Text>

            {/* Calendário substituído por botões */}
            <View style={styles.calendarButtons}>
              <TouchableOpacity
                onPress={() => {
                  const d = new Date(selectedDate);
                  d.setDate(d.getDate() - 1);
                  onDateChange(d);
                }}
                style={styles.dateButton}
              >
                <Text>◀</Text>
              </TouchableOpacity>

              <Text style={styles.selectedDateTextShort}>
                {formatarDataBR(selectedDate)}
              </Text>

              <TouchableOpacity
                onPress={() => {
                  const d = new Date(selectedDate);
                  d.setDate(d.getDate() + 1);
                  onDateChange(d);
                }}
                style={styles.dateButton}
              >
                <Text>▶</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.resumoContainer}>
              <Text style={styles.sectionTitle}>Resumo do Dia</Text>
              <Text style={styles.selectedDateText}>{formatarDataBR(selectedDate)}</Text>
              <View style={styles.resumoDados}>
                <ResumoItem label="Viagens" valor={totalViagens} />
                <ResumoItem label="KM Total" valor={`${kmTotal} km`} />
              </View>
            </View>
          </View>
        </View>

        {/* Registros */}
        <View style={styles.recordsSection}>
          <TouchableOpacity
            style={styles.newRecordButton}
            onPress={() => {
              setRegistroEditando(null);
              setMostrarModal(true);
            }}
          >
            <Text style={styles.newRecordButtonText}>+ Adicionar Registro</Text>
          </TouchableOpacity>

          <ScrollView style={styles.registrosDoDia}>
            <Text style={styles.sectionTitle}>Registros do Dia</Text>
            {registros.length === 0 ? (
              <Text>Nenhum registro encontrado.</Text>
            ) : (
              registros.map((r) => (
                <RegistroCard
                  key={r.id}
                  registro={r}
                  onEditar={() => {
                    setRegistroEditando(r);
                    setMostrarModal(true);
                  }}
                  onExcluir={() => handleExcluirRegistro(r.id)}
                />
              ))
            )}
          </ScrollView>
        </View>
      </View>

      {mostrarModal && (
        <Modal visible={mostrarModal} animationType="slide" transparent={false}>
          <ModalRegistro
            dataSelecionada={selectedDate}
            onClose={() => {
              setMostrarModal(false);
              setRegistroEditando(null);
            }}
            onSalvar={handleSalvarRegistro}
            registro={registroEditando}
          />
        </Modal>
      )}
    </View>
  );
}

const ResumoItem = ({ label, valor }) => (
  <View style={styles.resumoCard}>
    <Text style={styles.resumoLabel}>{label}</Text>
    <Text style={styles.resumoValor}>{valor}</Text>
  </View>
);

const RegistroCard = ({ registro, onEditar, onExcluir }) => (
  <View style={styles.registroCard}>
    <View style={styles.registroHeader}>
      <Text>🚗 {registro.veiculo || "Veículo não informado"}</Text>
      <Text>📅 {formatarDataBR(registro.data)}</Text>
    </View>

    <View style={styles.registroBody}>
      <View style={styles.dadosCondutor}>
        <Text style={styles.smallText}>🧑 {registro.condutor || "Condutor não informado"}</Text>
        <Text style={styles.smallText}>🆔 RG: {registro.rg || "Não informado"}</Text>
        {registro.editadoPor && <Text style={styles.smallText}>✏️ {registro.editadoPor}</Text>}

        {registro.destino && (
          <Text>
            <Text style={{ fontWeight: "bold" }}>Destino: </Text>
            {registro.destino}
          </Text>
        )}
        {(registro.horaSaida || registro.horaInicio) && (
          <Text>
            <Text style={{ fontWeight: "bold" }}>Horário: </Text>
            {ordenarHorarios(registro.horaSaida, registro.horaInicio)}
          </Text>
        )}
        {registro.observacoes && (
          <Text>
            <Text style={{ fontWeight: "bold" }}>Observações: </Text>
            {registro.observacoes}
          </Text>
        )}
      </View>
      <View style={styles.dadosKm}>
        <View>
          <Text style={{ fontWeight: "bold" }}>Inicial</Text>
          <Text>{getKm(registro.kmIda, registro.kmInicial)} km</Text>
        </View>
        <View>
          <Text style={{ fontWeight: "bold" }}>Final</Text>
          <Text>{getKm(registro.kmVolta, registro.kmFinal)} km</Text>
        </View>
      </View>
    </View>

    <View style={styles.registroActions}>
      <TouchableOpacity style={styles.btnEditar} onPress={onEditar}>
        <Text>✏️ Editar</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.btnExcluir} onPress={onExcluir}>
        <Text>🗑 Excluir</Text>
      </TouchableOpacity>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },
  carIcon: { fontSize: 24, marginRight: 10 },
  title: { fontSize: 20, fontWeight: "bold" },
  subtitle: { fontSize: 14, color: "#666" },
  mainContent: { flex: 1, flexDirection: "row" },
  sidebar: {
    width: 300,
    padding: 12,
    borderRightWidth: 1,
    borderColor: "#ddd",
  },
  calendarSummaryCard: { marginBottom: 12 },
  sectionTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 6 },
  selectedDateText: { fontSize: 16, marginBottom: 8 },
  calendarButtons: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  dateButton: {
    padding: 8,
    borderWidth: 1,
    borderColor: "#888",
    borderRadius: 4,
    marginHorizontal: 12,
  },
  selectedDateTextShort: { fontSize: 16, width: 100, textAlign: "center" },
  resumoContainer: { marginTop: 16 },
  resumoDados: { flexDirection: "row", justifyContent: "space-between" },
  resumoCard: {
    padding: 10,
    backgroundColor: "#eee",
    borderRadius: 6,
    marginRight: 8,
    flex: 1,
    alignItems: "center",
  },
  resumoLabel: { fontWeight: "bold", marginBottom: 4 },
  resumoValor: { fontSize: 16 },
  recordsSection: { flex: 1, padding: 12 },
  newRecordButton: {
    backgroundColor: "#007bff",
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 6,
    alignItems: "center",
    marginBottom: 16,
  },
  newRecordButtonText: { color: "#fff", fontWeight: "bold" },
  registrosDoDia: { flex: 1 },
  registroCard: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 12,
    marginBottom: 12,
    backgroundColor: "#fafafa",
  },
  registroHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  registroBody: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  dadosCondutor: { flex: 2, marginRight: 10 },
  smallText: { fontSize: 12, color: "#555" },
  dadosKm: {
    flex: 1,
    justifyContent: "space-between",
  },
  registroActions: {
    marginTop: 12,
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  btnEditar: {
    marginRight: 12,
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: "#ffc107",
    borderRadius: 4,
  },
  btnExcluir: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: "#dc3545",
    borderRadius: 4,
  },
});
