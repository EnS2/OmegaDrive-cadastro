import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// IP do backend - use o IP correto da sua máquina
const BASE_URL = "http://10.10.20.117:4000";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  timeout: 10000,
});

// Interceptor para incluir token JWT em todas as requisições
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

// Função para formatar data para yyyy-mm-dd (backend espera neste formato)
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
  observacoes: dados.observacoes || null,
  veiculo: dados.veiculo,
  placa: dados.placa,
});

// Criar ou atualizar registro
export const salvarRegistro = async (id, dados) => {
  try {
    const payload = adaptarPayloadParaBackend(dados);
    const response = id
      ? await api.put(`/registrar/${id}`, payload)
      : await api.post("/registrar", payload);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || error.message);
  }
};

// Buscar registros de um dia
export const buscarRegistrosDoDia = async (data) => {
  try {
    const dataFormatada = formatarDataParaBackend(data);
    const response = await api.get(`/registrar?data=${dataFormatada}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || error.message);
  }
};

// Deletar registro por ID
export const deletarRegistro = async (id) => {
  try {
    await api.delete(`/registrar/${id}`);
  } catch (error) {
    throw new Error(error.response?.data?.error || error.message);
  }
};

// Login - recebe email e password separados
export const login = async (email, password) => {
  try {
    const response = await api.post("/login", { email, password });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || error.message);
  }
};

// Cadastro - recebe objeto com nome, email e senha
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
