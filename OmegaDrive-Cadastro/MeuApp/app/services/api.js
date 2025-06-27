import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const BASE_URL = "http://192.168.0.100:4000/api"; // IP do seu backend

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  timeout: 10000,
});

// Interceptador para enviar token JWT em todas as requisições se existir
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

// Função para formatar data no padrão ISO yyyy-mm-dd para backend
const formatarDataParaBackend = (dateValue) => {
  const date = new Date(dateValue);
  const ano = date.getFullYear();
  const mes = String(date.getMonth() + 1).padStart(2, "0");
  const dia = String(date.getDate()).padStart(2, "0");
  return `${ano}-${mes}-${dia}`;
};

// Adapta o payload do frontend para o formato esperado pelo backend
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

// Salvar registro: cria ou atualiza dependendo se registro.id existe
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

// Buscar registros por data
export const buscarRegistrosDoDia = async (data) => {
  try {
    const dataFormatada = formatarDataParaBackend(data);
    const response = await api.get(`/registrar?data=${dataFormatada}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || error.message);
  }
};

// Deletar registro por id
export const deletarRegistro = async (id) => {
  try {
    await api.delete(`/registrar/${id}`);
  } catch (error) {
    throw new Error(error.response?.data?.error || error.message);
  }
};

// Função de login, enviando email e password para backend
export const login = async ({ email, password }) => {
  try {
    const response = await api.post("/login", { email, password });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || error.message);
  }
};

// Função de cadastro, adaptada para os campos do frontend: nome, email, senha
export const cadastrar = async ({ nome, email, senha }) => {
  try {
    const response = await api.post("/cadastro", { nome, email, senha });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || error.message);
  }
};

export default api;
