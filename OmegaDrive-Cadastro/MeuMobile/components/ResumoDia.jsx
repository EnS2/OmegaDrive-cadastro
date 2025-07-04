import React from "react";
import { View, Text, StyleSheet } from "react-native";

const ResumoDia = ({ totalKm, totalRegistros }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Resumo do Dia</Text>
      <View style={styles.dados}>
        <View style={styles.card}>
          <Text style={styles.label}>Total Registros</Text>
          <Text style={styles.valor}>{totalRegistros}</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.label}>Total Km</Text>
          <Text style={styles.valor}>{totalKm}</Text>
        </View>
      </View>
    </View>
  );
};

export default ResumoDia;

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    gap: 8,
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  titulo: {
    fontSize: 16,
    fontWeight: "600",
    color: "#6b21a8",
    marginBottom: 8,
  },
  dados: {
    flexDirection: "row",
    gap: 16,
  },
  card: {
    backgroundColor: "#fff",
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    minWidth: 90,
    textAlign: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 4,
    elevation: 2,
  },
  label: {
    fontSize: 13,
    color: "#666",
    marginBottom: 4,
  },
  valor: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#4b0082",
  },
});