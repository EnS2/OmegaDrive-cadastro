import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import LoginScreen from "./Login/LoginScreen";
import CadastroScreen from "./Cadastro/CadastroScreen";
import DashboardScreen from "./Site/DashboardScreen";
// Caminho corrigido

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Cadastro" component={CadastroScreen} />
      <Stack.Screen name="Dashboard" component={DashboardScreen} />
    </Stack.Navigator>
  );
}
