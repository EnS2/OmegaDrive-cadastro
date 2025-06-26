import React from "react";
import { View, StyleSheet } from "react-native";
import LoginScreen from "./Login/LoginScreen";

export default function App() {
  return (
    <View style={styles.container}>
      <LoginScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
});
