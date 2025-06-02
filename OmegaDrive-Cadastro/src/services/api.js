import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:4000", // Ajuste para sua URL real da API
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  timeout: 5000,
});

// Interceptador para incluir token de autenticação no header, se existir
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

// Função para criar ou atualizar registro
export const salvarRegistro = async (registro, payload) => {
  try {
    let response;

    if (registro && registro.id) {
      // Atualiza registro existente via PUT
      response = await api.put(`/registro/${registro.id}`, payload);
    } else {
      // Cria novo registro via POST
      response = await api.post("/registro/registrar", payload);
    }

    return response.data; // Retorna os dados da resposta da API
  } catch (error) {
    console.error(
      "Erro ao salvar registro:",
      error.response?.data || error.message
    );
    throw error; // Propaga erro para ser tratado no componente
  }
};

// Função para listar registros filtrando por data
export const listarRegistros = async (data) => {
  try {
    const response = await api.get(`/registro?data=${data}`);
    return response.data;
  } catch (error) {
    console.error(
      "Erro ao listar registros:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// Função para deletar registro pelo id
export const deletarRegistro = async (id) => {
  try {
    const response = await api.delete(`/registro/${id}`);
    return response.data;
  } catch (error) {
    console.error(
      "Erro ao deletar registro:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export default api;
