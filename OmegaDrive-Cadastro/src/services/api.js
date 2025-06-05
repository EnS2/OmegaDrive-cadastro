import axios from "axios";

// Criação da instância do Axios
const api = axios.create({
  baseURL: "/api", // Vite irá redirecionar isso para http://localhost:4000
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  timeout: 5000,
});

// Interceptor para incluir o token JWT no cabeçalho
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

// Adapta o payload do frontend para os nomes esperados no backend
const adaptarPayloadParaBackend = (payloadFrontend) => {
  return {
    rgCondutor: payloadFrontend.condutor,
    dataMarcada: payloadFrontend.dataMarcada,
    horaInicio: payloadFrontend.horaInicio || null,
    horaSaida: payloadFrontend.horaVolta,
    destino: payloadFrontend.destino || null,
    kmIda: Number(payloadFrontend.kmIda),
    kmVolta: Number(payloadFrontend.kmVolta),
    observacao: payloadFrontend.observacao || null,
    veiculo: payloadFrontend.veiculo,
    placa: payloadFrontend.placa,
  };
};

// Função para salvar ou atualizar um registro
export const salvarRegistro = async (registro, payloadFrontend) => {
  try {
    const payloadBackend = adaptarPayloadParaBackend(payloadFrontend);

    let response;
    if (registro && registro.id) {
      response = await api.put(`/registrar/${registro.id}`, payloadBackend);
    } else {
      response = await api.post("/registrar", payloadBackend);
    }

    return response.data;
  } catch (error) {
    console.error(
      "Erro ao salvar registro:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// Função para obter registros do dia
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

// Função para deletar registro
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

// =====================
// Login e Cadastro
// =====================

// Login
export const login = async ({ email, senha }) => {
  try {
    const response = await api.post("/auth/login", { email, senha });
    return response.data;
  } catch (error) {
    console.error("Erro no login:", error.response?.data || error.message);
    throw error;
  }
};

// Cadastro
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
