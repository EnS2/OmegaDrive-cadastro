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
    },
    extensions: [".js", ".jsx", ".ts", ".tsx", ".json"],
  },
  server: {
    port: 5173,
    open: true,
    strictPort: true,
    proxy: {
      // Proxy para encaminhar requisições /api para backend Express na porta 4000
      "/api": {
        target: "http://localhost:4000",
        changeOrigin: true,
        secure: false,
        // rewrite remove o /api do caminho para combinar com as rotas do backend
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});
