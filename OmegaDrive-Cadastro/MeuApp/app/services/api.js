import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// IP da sua máquina (sem /api no final)
const BASE_URL = "http://10.10.20.117:4000";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  timeout: 10000,
});

// Interceptador: inclui token JWT em todas as requisições
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

// Formata data como yyyy-mm-dd
const formatarDataParaBackend = (data) => {
  const d = new Date(data);
  const ano = d.getFullYear();
  const mes = String(d.getMonth() + 1).padStart(2, "0");
  const dia = String(d.getDate()).padStart(2, "0");
  return `${ano}-${mes}-${dia}`;
};

// Mapeia os campos do frontend para o backend
const adaptarPayloadParaBackend = (dados) => ({
  rgCondutor: dados.rgCondutor,
  dataMarcada: formatarDataParaBackend(dados.dataMarcada),
  horaInicio: dados.horaInicio || null,
  horaSaida: dados.horaSaida || null,
  destino: dados.destino || null,
  kmIda: isNaN(Number(dados.kmIda)) ? 0 : Number(dados.kmIda),
  kmVolta: isNaN(Number(dados.kmVolta)) ? 0 : Number(dados.kmVolta),
  observacao: dados.observacoes || null,
  veiculo: dados.veiculo,
  placa: dados.placa,
});

// Cria ou atualiza um registro
export const salvarRegistro = async (registro, dados) => {
  try {
    const payload = adaptarPayloadParaBackend(dados);
    const response = registro?.id
      ? await api.put(`/registrar/${registro.id}`, payload)
      : await api.post("/registrar", payload);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || error.message);
  }
};

// Busca registros de um dia específico
export const buscarRegistrosDoDia = async (data) => {
  try {
    const dataFormatada = formatarDataParaBackend(data);
    const response = await api.get(`/registrar?data=${dataFormatada}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || error.message);
  }
};

// Exclui um registro por ID
export const deletarRegistro = async (id) => {
  try {
    await api.delete(`/registrar/${id}`);
  } catch (error) {
    throw new Error(error.response?.data?.error || error.message);
  }
};

// Login
export const login = async ({ email, password }) => {
  try {
    const response = await api.post("/login", { email, password });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || error.message);
  }
};

// Cadastro
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
