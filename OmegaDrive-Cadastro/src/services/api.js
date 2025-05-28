// src/services/api.js (ou similar)
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:4000", // Backend porta 4000
});

export default api;
