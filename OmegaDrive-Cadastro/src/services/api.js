import axios from "axios";

// Base da API - usa proxy do Vite (ex: http://localhost:4000)
const BASE_URL = "/api";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  timeout: 10000, // Aumentado de 5000ms para 10000ms
});

// Interceptador para incluir token JWT no cabeçalho
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Função que formata data para 'YYYY-MM-DD'
const formatarDataParaBackend = (dateValue) => {
  const date = new Date(dateValue);
  const ano = date.getFullYear();
  const mes = String(date.getMonth() + 1).padStart(2, "0");
  const dia = String(date.getDate()).padStart(2, "0");
  return `${ano}-${mes}-${dia}`;
};

// Converte os dados do frontend para o formato aceito pelo backend
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

/**
 * Salva ou atualiza um registro
 * @param {Object|null} registro - Objeto com `id` se for edição
 * @param {Object} payloadFrontend - Dados do formulário
 * @returns {Promise<Object>} Registro salvo ou atualizado
 */
export const salvarRegistro = async (registro, payloadFrontend) => {
  try {
    const payloadBackend = adaptarPayloadParaBackend(payloadFrontend);

    const response = registro?.id
      ? await api.put(`/registrar/${registro.id}`, payloadBackend)
      : await api.post("/registrar", payloadBackend);

    return response.data;
  } catch (error) {
    const msg = error.response?.data?.error || error.message;
    console.error("Erro ao salvar registro:", msg);
    throw new Error(msg);
  }
};

/**
 * Busca os registros do dia selecionado
 * @param {string|Date} data - Data no formato Date ou string
 * @returns {Promise<Array>} Lista de registros
 */
export const buscarRegistrosDoDia = async (data) => {
  try {
    const dataFormatada = formatarDataParaBackend(data);
    const response = await api.get(`/registrar?data=${dataFormatada}`);
    return response.data;
  } catch (error) {
    const msg = error.response?.data?.error || error.message;
    console.error("Erro ao buscar registros:", msg);
    throw new Error(msg);
  }
};

/**
 * Exclui um registro por ID
 * @param {string} id - ID do registro
 */
export const deletarRegistro = async (id) => {
  try {
    await api.delete(`/registrar/${id}`);
  } catch (error) {
    const msg = error.response?.data?.error || error.message;
    console.error("Erro ao deletar registro:", msg);
    throw new Error(msg);
  }
};

/**
 * Realiza login do usuário
 * @param {{ email: string, password: string }} credentials
 * @returns {Promise<Object>} Dados do usuário e token
 */
export const login = async ({ email, password }) => {
  try {
    const response = await api.post("/login", { email, password });
    return response.data;
  } catch (error) {
    const msg = error.response?.data?.error || error.message;
    console.error("Erro no login:", msg);
    throw new Error(msg);
  }
};

/**
 * Cadastra novo usuário
 * @param {{ name: string, email: string, password: string }} userInfo
 * @returns {Promise<Object>} Dados do usuário criado
 */
export const cadastrar = async ({ name, email, password }) => {
  try {
    const response = await api.post("/cadastro", { name, email, password });
    return response.data;
  } catch (error) {
    const msg = error.response?.data?.error || error.message;
    console.error("Erro no cadastro:", msg);
    throw new Error(msg);
  }
};

export default api;
