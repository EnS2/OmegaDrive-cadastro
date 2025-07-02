/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  StyleSheet,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Omega from "../../assets/Omega.png";
import { login } from "../services/api"; // função da sua API

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Verifica se já tem token salvo
  useEffect(() => {
    const verificarToken = async () => {
      const token = await AsyncStorage.getItem("token");
      if (token) {
        navigation.navigate("Dashboard");
      }
    };
    verificarToken();
  }, []);

  async function handleLogin() {
    try {
      const resposta = await login(email, password);

      if (resposta.token) {
        await AsyncStorage.setItem("token", resposta.token);
        navigation.navigate("Dashboard");
        Alert.alert("Sucesso", "Login realizado com sucesso!");
      } else {
        Alert.alert("Erro", "Credenciais inválidas.");
      }
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      Alert.alert("Erro", "Login falhou. Verifique suas credenciais.");
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Image source={Omega} style={styles.logo} resizeMode="cover" />
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

        <TouchableOpacity
          style={styles.linkButton}
          onPress={() => navigation.navigate("Cadastro")}
        >
          <Text style={styles.linkText}>Criar Novo Usuário?</Text>
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
    width: "90%",
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
    marginBottom: 10,
    alignSelf: "center",
    borderRadius: 40,
    overflow: "hidden",
    backgroundColor: "#fff",
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
    borderRadius: 999,
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
