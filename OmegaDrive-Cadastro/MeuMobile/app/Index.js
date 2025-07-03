import { createNativeStackNavigator } from "@react-navigation/native-stack";

import LoginScreen from "./Login/LoginScreen";
import CadastroScreen from "./Cadastro/CadastroScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Cadastro" component={CadastroScreen} />
    </Stack.Navigator>
  );
}
