import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// ===== CONFIGURAÇÕES =====
const LOCAL_IP = "10.0.0.197"; // IP do seu PC
const PORT = 4000;
export const BASE_URL = `http://${LOCAL_IP}:${PORT}`;
console.log("API será usada em:", BASE_URL);

// ===== INSTÂNCIA AXIOS =====
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  timeout: 30000, // Timeout aumentado para testes
});

// ===== INTERCEPTOR SEGURO =====
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      config.headers["x-plataforma"] = "mobile";
      console.log(
        `[Axios] Requisição: ${config.method.toUpperCase()} ${config.url}`
      );
      console.log("Headers:", config.headers);
    } catch (err) {
      console.log("[Axios] Erro no interceptor:", err.message);
    }
    return config;
  },
  (error) => {
    console.log("[Axios] Erro no request interceptor:", error.message);
    return Promise.reject(error);
  }
);

// ===== FUNÇÕES AUXILIARES =====
const formatarDataParaBackend = (data) => {
  const d = new Date(data);
  if (isNaN(d.getTime())) throw new Error("Data inválida");
  const ano = d.getFullYear();
  const mes = String(d.getMonth() + 1).padStart(2, "0");
  const dia = String(d.getDate()).padStart(2, "0");
  return `${ano}-${mes}-${dia}`;
};

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

// ===== FUNÇÕES DE API =====
export const salvarRegistro = async (id, dados) => {
  const payload = adaptarPayloadParaBackend(dados);
  try {
    const response = id
      ? await api.put(`/registrar/${id}`, payload)
      : await api.post("/registrar", payload);
    return response.data;
  } catch (err) {
    console.log("[API] Erro salvarRegistro:", err.message);
    throw err;
  }
};

export const buscarRegistrosDoDia = async (data) => {
  const dataFormatada = formatarDataParaBackend(data);
  try {
    const response = await api.get(`/registrar?data=${dataFormatada}`);
    return response.data;
  } catch (err) {
    console.log("[API] Erro buscarRegistrosDoDia:", err.message);
    throw err;
  }
};

export const deletarRegistro = async (id) => {
  try {
    await api.delete(`/registrar/${id}`);
  } catch (err) {
    console.log("[API] Erro deletarRegistro:", err.message);
    throw err;
  }
};

export const login = async (email, password) => {
  try {
    const response = await api.post("/login", { email, password });
    return response.data;
  } catch (err) {
    console.log("[API] Erro login:", err.message);
    throw err;
  }
};

export const cadastrar = async ({ name, email, password }) => {
  try {
    const response = await api.post("/cadastro", { name, email, password });
    return response.data;
  } catch (err) {
    console.log("[API] Erro cadastrar:", err.message);
    throw err;
  }
};

export default api;
