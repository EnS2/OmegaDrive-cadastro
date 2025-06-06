import axios from "axios";

const BASE_URL = "/api";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  timeout: 5000,
});

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

const adaptarPayloadParaBackend = (payloadFrontend) => ({
  condutor: payloadFrontend.condutor,
  rgCondutor: payloadFrontend.rgCondutor,
  dataMarcada: payloadFrontend.dataMarcada,
  horaInicio: payloadFrontend.horaInicio || null,
  horaSaida: payloadFrontend.horaSaida || null,
  destino: payloadFrontend.destino || null,
  kmIda: Number(payloadFrontend.kmIda),
  kmVolta: Number(payloadFrontend.kmVolta),
  observacoes: payloadFrontend.observacoes || null,
  editadoPor: payloadFrontend.editadoPor || null,
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
    console.error(
      "Erro ao salvar registro:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const buscarRegistrosDoDia = async () => {
  try {
    const response = await api.get("/registrar");
    return response.data;
  } catch (error) {
    console.error(
      "Erro ao buscar registros:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const deletarRegistro = async (id) => {
  try {
    await api.delete(`/registrar/${id}`);
  } catch (error) {
    console.error(
      "Erro ao deletar registro:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const login = async ({ email, senha }) => {
  try {
    const response = await api.post("/auth/login", { email, senha });
    return response.data;
  } catch (error) {
    console.error("Erro no login:", error.response?.data || error.message);
    throw error;
  }
};

export const cadastrar = async ({ nome, email, senha }) => {
  try {
    const response = await api.post("/auth/register", { nome, email, senha });
    return response.data;
  } catch (error) {
    console.error("Erro no cadastro:", error.response?.data || error.message);
    throw error;
  }
};

export default api;
