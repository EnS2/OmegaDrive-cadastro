import axios from "axios";

// Criação da instância do axios
const api = axios.create({
  baseURL: "http://localhost:4000", // Altere se necessário
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  timeout: 5000,
});

// Interceptor para incluir o token JWT automaticamente em todas as requisições
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // ou sessionStorage
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Função para criar um novo registro
export const salvarRegistro = async (registro, payload) => {
  try {
    const response = await api.post("/registro/registrar", payload);
    console.log("Registro criado:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Erro ao salvar registro:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export default api;
