import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// IP do backend - ajuste conforme sua rede
const BASE_URL = "http://10.10.20.117:4000";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  timeout: 10000,
});

// Interceptor: inclui JWT e identificação da plataforma
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    config.headers["x-plataforma"] = "mobile";
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Formata uma data no padrão yyyy-mm-dd
 * @param {string|Date} data
 * @returns {string}
 */
const formatarDataParaBackend = (data) => {
  const d = new Date(data);
  if (isNaN(d.getTime())) {
    throw new Error("Data inválida");
  }
  const ano = d.getFullYear();
  const mes = String(d.getMonth() + 1).padStart(2, "0");
  const dia = String(d.getDate()).padStart(2, "0");
  return `${ano}-${mes}-${dia}`;
};

/**
 * Prepara payload para envio ao backend
 * @param {object} dados
 * @returns {object}
 */
const adaptarPayloadParaBackend = (dados) => ({
  rgCondutor: dados.rgCondutor || "",
  dataMarcada: formatarDataParaBackend(dados.dataMarcada),
  horaInicio: dados.horaInicio || null,
  horaSaida: dados.horaSaida || null,
  destino: dados.destino || null,
  kmIda: isNaN(Number(dados.kmIda)) ? 0 : Number(dados.kmIda),
  kmVolta: isNaN(Number(dados.kmVolta)) ? 0 : Number(dados.kmVolta),
  observacao: dados.observacao || null,
  veiculo: dados.veiculo || "",
  placa: dados.placa || "",
});

/**
 * Cria ou atualiza um registro
 * @param {string|null} id - ID do registro (ou null para criar)
 * @param {object} dados - Dados do formulário
 * @returns {Promise<object>}
 */
export const salvarRegistro = async (id, dados) => {
  try {
    const payload = adaptarPayloadParaBackend(dados);
    const response = id
      ? await api.put(`/registrar/${id}`, payload)
      : await api.post("/registrar", payload);
    return response.data;
  } catch (error) {
    const msg = error?.response?.data?.error || error.message;
    console.error("Erro ao salvar registro:", msg);
    throw new Error(msg);
  }
};

/**
 * Busca registros de um dia
 * @param {string|Date} data
 * @returns {Promise<object[]>}
 */
export const buscarRegistrosDoDia = async (data) => {
  try {
    const dataFormatada = formatarDataParaBackend(data);
    const response = await api.get(`/registrar?data=${dataFormatada}`);
    return response.data;
  } catch (error) {
    const msg = error?.response?.data?.error || error.message;
    console.error("Erro ao buscar registros:", msg);
    throw new Error(msg);
  }
};

/**
 * Deleta um registro por ID
 * @param {string} id
 * @returns {Promise<void>}
 */
export const deletarRegistro = async (id) => {
  try {
    await api.delete(`/registrar/${id}`);
  } catch (error) {
    const msg = error?.response?.data?.error || error.message;
    console.error("Erro ao deletar registro:", msg);
    throw new Error(msg);
  }
};

/**
 * Realiza login do usuário
 * @param {string} email
 * @param {string} password
 * @returns {Promise<object>}
 */
export const login = async (email, password) => {
  try {
    const response = await api.post("/login", { email, password });
    return response.data;
  } catch (error) {
    const msg = error?.response?.data?.error || error.message;
    console.error("Erro no login:", msg);
    throw new Error(msg);
  }
};

/**
 * Cadastra um novo usuário
 * @param {{ name: string, email: string, password: string }} dados
 * @returns {Promise<object>}
 */
export const cadastrar = async ({ name, email, password }) => {
  try {
    const response = await api.post("/cadastro", { name, email, password });
    return response.data;
  } catch (error) {
    const msg = error?.response?.data?.error || error.message;
    console.error("Erro no cadastro:", msg);
    throw new Error(msg);
  }
};

export default api;
