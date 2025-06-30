import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// IP real da sua máquina (sem /api no final)
const BASE_URL = "http://10.10.20.117:4000";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  timeout: 10000,
});

// Interceptador para enviar token JWT automaticamente
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Utilitário: formata data como "yyyy-mm-dd"
const formatarDataParaBackend = (dateValue) => {
  const date = new Date(dateValue);
  const ano = date.getFullYear();
  const mes = String(date.getMonth() + 1).padStart(2, "0");
  const dia = String(date.getDate()).padStart(2, "0");
  return `${ano}-${mes}-${dia}`;
};

// Adapta os campos do frontend para o backend
const adaptarPayloadParaBackend = (payloadFrontend) => ({
  rgCondutor: payloadFrontend.rgCondutor,
  dataMarcada: formatarDataParaBackend(payloadFrontend.dataMarcada),
  horaInicio: payloadFrontend.horaInicio || null,
  horaSaida: payloadFrontend.horaSaida || null,
  destino: payloadFrontend.destino || null,
  kmIda: isNaN(Number(payloadFrontend.kmIda))
    ? 0
    : Number(payloadFrontend.kmIda),
  kmVolta: isNaN(Number(payloadFrontend.kmVolta))
    ? 0
    : Number(payloadFrontend.kmVolta),
  observacao: payloadFrontend.observacoes || null,
  veiculo: payloadFrontend.veiculo,
  placa: payloadFrontend.placa,
});

// Cria ou atualiza um registro
export const salvarRegistro = async (registro, payloadFrontend) => {
  try {
    const payloadBackend = adaptarPayloadParaBackend(payloadFrontend);
    const response = registro?.id
      ? await api.put(`/registrar/${registro.id}`, payloadBackend)
      : await api.post("/registrar", payloadBackend);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || error.message);
  }
};

// Lista registros de uma data
export const buscarRegistrosDoDia = async (data) => {
  try {
    const dataFormatada = formatarDataParaBackend(data);
    const response = await api.get(`/registrar?data=${dataFormatada}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || error.message);
  }
};

// Exclui registro por ID
export const deletarRegistro = async (id) => {
  try {
    await api.delete(`/registrar/${id}`);
  } catch (error) {
    throw new Error(error.response?.data?.error || error.message);
  }
};

// Login de usuário
export const login = async ({ email, password }) => {
  try {
    const response = await api.post("/login", { email, password });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || error.message);
  }
};

// Cadastro de usuário - envia campos com os nomes esperados pelo backend
export const cadastrar = async ({ nome, email, senha }) => {
  try {
    const response = await api.post("/cadastro", {
      name: nome,
      email,
      password: senha,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || error.message);
  }
};

export default api;
