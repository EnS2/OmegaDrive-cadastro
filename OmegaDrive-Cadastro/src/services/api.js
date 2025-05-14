import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:4000", // API rodando localmente
});

export default api;
