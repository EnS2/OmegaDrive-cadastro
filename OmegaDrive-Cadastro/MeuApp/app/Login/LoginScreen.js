// app/Login/LoginScreen.js

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

import Omega from "../../assets/Omega.png";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin() {
    try {
      Alert.alert("Sucesso", "Login realizado com sucesso!");
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      Alert.alert("Erro", "Login falhou. Verifique suas credenciais.");
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Image source={Omega} style={styles.logo} resizeMode="contain" />
        <Text style={styles.title}>Grupo Omega</Text>
        <Text style={styles.header}>Login</Text>

        <TextInput
          placeholder="E-mail"
          placeholderTextColor="#555"
          style={styles.input}
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />

        <TextInput
          placeholder="Senha"
          placeholderTextColor="#555"
          style={styles.input}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Entrar</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.linkButton}>
          <Text style={styles.linkText}>Criar Novo Usuário?</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1B1B2F", // fundo da tela
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    backgroundColor: "#2E2E4D", // card
    padding: 30,
    borderRadius: 16,
    width: "90%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 10,
  },
  logo: {
    width: 60,
    height: 60,
    marginBottom: 10,
    alignSelf: "center",
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
  },
  input: {
    width: "100%",
    backgroundColor: "#EEF1FF",
    borderRadius: 999, // bem arredondado
    paddingVertical: 14,
    paddingHorizontal: 20,
    marginBottom: 14,
    color: "#000",
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
  },
  linkText: {
    color: "#8A8DFF",
    textDecorationLine: "underline",
    fontSize: 14,
  },
});
