import axios from "axios";

// Base da API (usa proxy do Vite)
const BASE_URL = "/api";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  timeout: 10000,
});

// Interceptador: inclui JWT e a origem web
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    config.headers["x-plataforma"] = "web";
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Formata uma data em YYYY-MM-DD respeitando o fuso horário America/Sao_Paulo
 * @param {string|Date} dateValue
 * @returns {string}
 */
const formatarDataParaBackend = (dateValue) => {
  if (!dateValue) return "";

  const formatter = new Intl.DateTimeFormat("sv-SE", {
    timeZone: "America/Sao_Paulo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  const parts = formatter.formatToParts(new Date(dateValue));
  const ano = parts.find((p) => p.type === "year")?.value;
  const mes = parts.find((p) => p.type === "month")?.value;
  const dia = parts.find((p) => p.type === "day")?.value;

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
  horaInicio: dados.horaInicio || "",
  horaSaida: dados.horaSaida || "",
  destino: dados.destino || null,
  kmIda: isNaN(Number(dados.kmIda)) ? 0 : Number(dados.kmIda),
  kmVolta: isNaN(Number(dados.kmVolta)) ? 0 : Number(dados.kmVolta),
  observacao: dados.observacao || null,
  veiculo: dados.veiculo || "",
  placa: dados.placa || "",
});

/**
 * Salva ou atualiza um registro
 * @param {object|null} registro - Objeto registro com id, ou null para criar novo
 * @param {object} dados - Dados do formulário
 * @returns {Promise<object>}
 */
export const salvarRegistro = async (registro, dados) => {
  try {
    const payload = adaptarPayloadParaBackend(dados);
    const response =
      registro && registro.id
        ? await api.put(`/registrar/${registro.id}`, payload)
        : await api.post("/registrar", payload);
    return response.data;
  } catch (error) {
    const msg = error?.response?.data?.error || error.message;
    console.error("Erro ao salvar registro:", msg);
    throw new Error(msg);
  }
};

/**
 * Busca registros por data
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
 * Faz login
 * @param {{email: string, password: string}} credentials
 * @returns {Promise<object>}
 */
export const login = async ({ email, password }) => {
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
 * Cadastra novo usuário
 * @param {{name: string, email: string, password: string}} dados
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
