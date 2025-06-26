import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const BASE_URL = "http://192.168.0.100:4000/api"; // <- IP da sua máquina ou domínio

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  timeout: 10000,
});

api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem("token"); // busca o token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const formatarDataParaBackend = (dateValue) => {
  const date = new Date(dateValue);
  const ano = date.getFullYear();
  const mes = String(date.getMonth() + 1).padStart(2, "0");
  const dia = String(date.getDate()).padStart(2, "0");
  return `${ano}-${mes}-${dia}`;
};

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

export const buscarRegistrosDoDia = async (data) => {
  try {
    const dataFormatada = formatarDataParaBackend(data);
    const response = await api.get(`/registrar?data=${dataFormatada}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || error.message);
  }
};

export const deletarRegistro = async (id) => {
  try {
    await api.delete(`/registrar/${id}`);
  } catch (error) {
    throw new Error(error.response?.data?.error || error.message);
  }
};

export const login = async ({ email, password }) => {
  try {
    const response = await api.post("/login", { email, password });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || error.message);
  }
};

export const cadastrar = async ({ name, email, password }) => {
  try {
    const response = await api.post("/cadastro", { name, email, password });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || error.message);
  }
};

export default api;
