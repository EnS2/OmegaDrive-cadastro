import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";

// Suporte para __dirname em módulos ES (ESM)
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
      // Adicione outros atalhos se necessário
    },
    extensions: [".js", ".jsx", ".ts", ".tsx", ".json"], // ajuda na resolução automática
  },
  server: {
    port: 5173, // Porta customizada
    open: true, // Abre o navegador automaticamente
    strictPort: true, // Se a porta 5173 estiver ocupada, erro em vez de escolher outra
  },
});
