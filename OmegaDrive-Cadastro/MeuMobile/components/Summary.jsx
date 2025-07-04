import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function SummaryScreen({ route }) {
  // Recebe trips pelo parâmetro da rota
  const trips = route.params?.trips || [];

  const totalKm = trips.reduce((acc, t) => acc + (t.endKm - t.startKm), 0);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Resumo</Text>
      <Text style={styles.text}>Total de viagens: {trips.length}</Text>
      <Text style={styles.text}>Total de KM rodados: {totalKm} km</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#fff",
    justifyContent: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
  },
  text: {
    fontSize: 18,
    marginBottom: 8,
  },
});