/* eslint-disable no-unused-vars */
// DashboardScreen.jsx
import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ScrollView,
  Modal,
  Alert,
} from "react-native";
import CalendarPicker from "react-native-calendar-picker";
import { Car, Plus } from "lucide-react-native";

import ModalRegistro from "../../components/ModalRegistro.jsx";

import {
  salvarRegistro,
  buscarRegistrosDoDia,
  deletarRegistro,
} from "../services/api";

const formatarDataExtensa = (data) => {
  return new Date(data).toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
};

const DashboardScreen = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [registros, setRegistros] = useState([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [registroEditando, setRegistroEditando] = useState(null);
  const [totalViagens, setTotalViagens] = useState(0);
  const [kmTotal, setKmTotal] = useState(0);

  const carregarRegistros = useCallback(async () => {
    try {
      const resposta = await buscarRegistrosDoDia(selectedDate);
      setRegistros(resposta);
    } catch (error) {
      console.error("Erro ao buscar registros:", error);
    }
  }, [selectedDate]);

  useEffect(() => {
    carregarRegistros();
  }, [carregarRegistros]);

  useEffect(() => {
    setTotalViagens(registros.length);
    const somaKm = registros.reduce((total, r) => {
      const inicio = parseFloat(r.kmIda ?? 0);
      const fim = parseFloat(r.kmVolta ?? 0);
      return total + (isNaN(fim - inicio) ? 0 : fim - inicio);
    }, 0);
    setKmTotal(somaKm);
  }, [registros]);

  const handleSalvarRegistro = async (registro) => {
    try {
      const salvo = await salvarRegistro(registroEditando?.id ?? null, {
        ...registro,
        dataMarcada: selectedDate,
      });

      setMostrarModal(false);
      setRegistroEditando(null);
      await carregarRegistros();
    } catch (error) {
      console.error("Erro ao salvar registro:", error);
    }
  };

  const handleExcluirRegistro = async (id) => {
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
            console.error("Erro ao excluir registro:", error);
          }
        },
      },
    ]);
  };

  const RegistroCard = ({ registro }) => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{registro.veiculo}</Text>
      <Text>Condutor: {registro.condutor}</Text>
      <Text>
        KM Ida: {registro.kmIda} | KM Volta: {registro.kmVolta}
      </Text>
      <Text>Destino: {registro.destino}</Text>
      <Text>Hora Saída: {registro.horaSaida}</Text>
      <Text>Observações: {registro.observacoes}</Text>
      <View style={styles.cardButtons}>
        <TouchableOpacity
          onPress={() => {
            setRegistroEditando(registro);
            setMostrarModal(true);
          }}
        >
          <Text style={styles.editBtn}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleExcluirRegistro(registro.id)}>
          <Text style={styles.deleteBtn}>Excluir</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Car color="#000" size={32} />
        <Text style={styles.headerText}>Controle de KM</Text>
      </View>

      <CalendarPicker
        onDateChange={(date) => setSelectedDate(new Date(date))}
        selectedStartDate={selectedDate}
        locale="pt-br"
      />

      <Text style={styles.dateLabel}>{formatarDataExtensa(selectedDate)}</Text>

      <View style={styles.summary}>
        <Text>Total de Viagens: {totalViagens}</Text>
        <Text>KM Total: {kmTotal} km</Text>
      </View>

      <TouchableOpacity
        style={styles.addBtn}
        onPress={() => {
          setRegistroEditando(null);
          setMostrarModal(true);
        }}
      >
        <Plus color="#fff" size={20} />
        <Text style={styles.addBtnText}>Adicionar Registro</Text>
      </TouchableOpacity>

      <FlatList
        data={registros}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <RegistroCard registro={item} />}
        scrollEnabled={false}
      />

      <Modal visible={mostrarModal} animationType="slide">
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
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#f9fafb",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
  },
  dateLabel: {
    fontSize: 18,
    color: "#374151",
    marginVertical: 12,
  },
  summary: {
    backgroundColor: "#e0e7ff",
    padding: 12,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  addBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#4f46e5",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    justifyContent: "center",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  addBtnText: {
    color: "#fff",
    marginLeft: 8,
    fontWeight: "600",
    fontSize: 16,
  },
  card: {
    backgroundColor: "#ffffff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  cardTitle: {
    fontWeight: "700",
    fontSize: 16,
    marginBottom: 6,
    color: "#111827",
  },
  cardButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 12,
    gap: 20,
  },
  editBtn: {
    color: "#2563eb",
    fontWeight: "600",
  },
  deleteBtn: {
    color: "#dc2626",
    fontWeight: "600",
  },
});

export default DashboardScreen;
