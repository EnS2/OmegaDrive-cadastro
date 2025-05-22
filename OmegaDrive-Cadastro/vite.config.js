import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";

// Suporte para __dirname e __filename em ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@components": path.resolve(__dirname, "src/components"),
      "@pages": path.resolve(__dirname, "src/pages"),
      "@services": path.resolve(__dirname, "src/services"),
      "@assets": path.resolve(__dirname, "src/assets"),
      "@layout": path.resolve(__dirname, "src/layout"),
      "@motion": path.resolve(__dirname, "src/motion"),
    },
  },
  server: {
    port: 5173, // Você pode mudar a porta aqui, se desejar
    open: true, // Abre automaticamente o navegador ao rodar o projeto
  },
});
