/* eslint-disable import/no-unresolved */
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  StyleSheet,
} from "react-native";

import Omega from "@assets/Omega.png"; // usando alias
import { cadastrar } from "@services/api"; // usando alias

export default function CadastroScreen({ navigation }) {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  async function handleCadastro() {
    try {
      if (!nome || !email || !senha) {
        Alert.alert("Atenção", "Preencha todos os campos.");
        return;
      }

      await cadastrar({ nome, email, senha });

      Alert.alert("Sucesso", "Usuário cadastrado com sucesso!", [
        {
          text: "OK",
          onPress: () => navigation.navigate("Login"),
        },
      ]);
    } catch (error) {
      console.error("Erro no cadastro:", error.message);
      Alert.alert("Erro", error.message || "Falha ao cadastrar usuário.");
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Image source={Omega} style={styles.logo} resizeMode="cover" />
        <Text style={styles.title}>Grupo Omega</Text>
        <Text style={styles.header}>Cadastro de Usuários</Text>

        <TextInput
          placeholder="Nome"
          placeholderTextColor="#bbb"
          style={styles.input}
          value={nome}
          onChangeText={setNome}
        />
        <TextInput
          placeholder="E-mail"
          placeholderTextColor="#bbb"
          style={styles.input}
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          placeholder="Senha"
          placeholderTextColor="#bbb"
          style={styles.input}
          secureTextEntry
          value={senha}
          onChangeText={setSenha}
        />

        <TouchableOpacity style={styles.button} onPress={handleCadastro}>
          <Text style={styles.buttonText}>Cadastrar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.linkButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.linkText}>Voltar para Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1B1B2F",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    backgroundColor: "#2E2E4D",
    padding: 30,
    borderRadius: 16,
    width: "85%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 10,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    overflow: "hidden",
    backgroundColor: "#fff",
    marginBottom: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 6,
  },
  header: {
    fontSize: 18,
    color: "#fff",
    marginBottom: 20,
    fontWeight: "bold",
  },
  input: {
    width: "100%",
    backgroundColor: "#3B3B5C",
    borderRadius: 999,
    paddingVertical: 14,
    paddingHorizontal: 20,
    marginBottom: 14,
    color: "#fff",
  },
  button: {
    width: "100%",
    backgroundColor: "#5A5CFF",
    padding: 14,
    borderRadius: 999,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  linkButton: {
    marginTop: 20,
    borderWidth: 1,
    borderColor: "#5A5CFF",
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 999,
  },
  linkText: {
    color: "#8A8DFF",
    textDecorationLine: "none",
    fontSize: 14,
  },
});
