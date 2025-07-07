import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const RegistroCard = ({ registro, onEditar, onExcluir }) => {
  const dataValida =
    registro.data instanceof Date && !isNaN(registro.data)
      ? registro.data.toLocaleDateString("pt-BR")
      : "Data inválida";

  const kmInicial = parseFloat(registro.kmInicial ?? registro.kmIda ?? 0);
  const kmFinal = parseFloat(registro.kmFinal ?? registro.kmVolta ?? 0);
  const kmTotal = !isNaN(kmFinal - kmInicial) ? kmFinal - kmInicial : "--";

  return (
    <View style={styles.card}>
      {/* Cabeçalho */}
      <View style={styles.header}>
        <Text style={styles.emoji}>🚗</Text>
        <Text style={styles.title}>
          {registro.veiculo || "Veículo não informado"}
        </Text>
        <Text style={styles.date}>📅 {dataValida}</Text>
      </View>

      {/* Corpo */}
      <View style={styles.body}>
        <View style={styles.section}>
          <Text style={styles.text}>
            <Text style={styles.bold}>Condutor:</Text>{" "}
            {registro.condutor || "Desconhecido"}
          </Text>
          <Text style={styles.text}>
            <Text style={styles.bold}>RG:</Text>{" "}
            {registro.rgCondutor || registro.rg || "N/A"}
          </Text>

          {registro.destino && (
            <Text style={styles.text}>
              <Text style={styles.bold}>Destino:</Text> {registro.destino}
            </Text>
          )}

          {(registro.horaSaida || registro.horaRetorno) && (
            <Text style={styles.text}>
              <Text style={styles.bold}>Horário:</Text>{" "}
              {registro.horaSaida || "--"} → {registro.horaRetorno || "--"}
            </Text>
          )}

          {registro.observacao && (
            <Text style={styles.text}>
              <Text style={styles.bold}>Observações:</Text>{" "}
              {registro.observacao}
            </Text>
          )}
        </View>

        {/* KM Info */}
        <View style={styles.kmSection}>
          <View style={styles.kmBox}>
            <Text style={styles.bold}>Inicial</Text>
            <Text>{isNaN(kmInicial) ? "--" : `${kmInicial} km`}</Text>
          </View>
          <View style={styles.kmBox}>
            <Text style={styles.bold}>Final</Text>
            <Text>{isNaN(kmFinal) ? "--" : `${kmFinal} km`}</Text>
          </View>
          <View style={styles.kmBox}>
            <Text style={styles.bold}>Total</Text>
            <Text>{isNaN(kmTotal) ? "--" : `${kmTotal} km`}</Text>
          </View>
        </View>

        {/* Botões */}
        <View style={styles.buttons}>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => onEditar(registro)}
          >
            <Text style={styles.buttonText}>Editar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => onExcluir(registro.id)}
          >
            <Text style={styles.buttonText}>Excluir</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default RegistroCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#F0F0F0",
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    marginBottom: 8,
  },
  emoji: {
    fontSize: 18,
    marginRight: 6,
  },
  title: {
    fontWeight: "bold",
    flex: 1,
    fontSize: 16,
  },
  date: {
    fontSize: 12,
    color: "#555",
  },
  body: {
    marginTop: 8,
  },
  section: {
    marginBottom: 8,
  },
  text: {
    marginBottom: 4,
    fontSize: 14,
    color: "#333",
  },
  bold: {
    fontWeight: "bold",
  },
  kmSection: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 10,
  },
  kmBox: {
    alignItems: "center",
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
  editButton: {
    backgroundColor: "#4D90FE",
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  deleteButton: {
    backgroundColor: "#E53935",
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
});

