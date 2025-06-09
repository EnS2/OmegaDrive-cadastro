import axios from "axios";

// Base da API - via proxy do Vite para backend (ex: http://localhost:4000)
const BASE_URL = "/api";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  timeout: 5000,
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

// Adapta o payload do frontend para o backend
const adaptarPayloadParaBackend = (payloadFrontend) => ({
  condutor: payloadFrontend.condutor,
  rgCondutor: payloadFrontend.rgCondutor,
  dataMarcada: payloadFrontend.dataMarcada,
  horaInicio: payloadFrontend.horaInicio || null,
  horaSaida: payloadFrontend.horaSaida || null,
  destino: payloadFrontend.destino || null,
  kmIda: isNaN(Number(payloadFrontend.kmIda))
    ? 0
    : Number(payloadFrontend.kmIda),
  kmVolta: isNaN(Number(payloadFrontend.kmVolta))
    ? 0
    : Number(payloadFrontend.kmVolta),
  observacoes: payloadFrontend.observacoes || null,
  editadoPor: payloadFrontend.editadoPor || null,
  veiculo: payloadFrontend.veiculo,
  placa: payloadFrontend.placa,
});

/**
 * Salva ou atualiza um registro
 * @param {Object} registro - Se tiver `id`, será update
 * @param {Object} payloadFrontend - Dados do formulário
 */
export const salvarRegistro = async (registro, payloadFrontend) => {
  try {
    const payloadBackend = adaptarPayloadParaBackend(payloadFrontend);

    const response = registro?.id
      ? await api.put(`/registrar/${registro.id}`, payloadBackend)
      : await api.post("/registrar", payloadBackend);

    return response.data;
  } catch (error) {
    const msg = error.response?.data?.message || error.message;
    console.error("Erro ao salvar registro:", msg);
    throw new Error(msg);
  }
};

/**
 * Busca todos os registros do dia
 */
export const buscarRegistrosDoDia = async () => {
  try {
    const response = await api.get("/registrar");
    return response.data;
  } catch (error) {
    const msg = error.response?.data?.message || error.message;
    console.error("Erro ao buscar registros:", msg);
    throw new Error(msg);
  }
};

/**
 * Deleta um registro por ID
 * @param {string} id - ID do registro
 */
export const deletarRegistro = async (id) => {
  try {
    await api.delete(`/registrar/${id}`);
  } catch (error) {
    const msg = error.response?.data?.message || error.message;
    console.error("Erro ao deletar registro:", msg);
    throw new Error(msg);
  }
};

/**
 * Realiza login do usuário
 * @param {{ email: string, password: string }} credentials
 */
export const login = async ({ email, password }) => {
  try {
    const response = await api.post("/login", { email, password });
    return response.data;
  } catch (error) {
    const msg = error.response?.data?.message || error.message;
    console.error("Erro no login:", msg);
    throw new Error(msg);
  }
};

/**
 * Realiza cadastro de usuário
 * @param {{ name: string, email: string, password: string }} userInfo
 */
export const cadastrar = async ({ name, email, password }) => {
  try {
    const response = await api.post("/cadastro", { name, email, password });
    return response.data;
  } catch (error) {
    const msg = error.response?.data?.message || error.message;
    console.error("Erro no cadastro:", msg);
    throw new Error(msg);
  }
};

export default api;
