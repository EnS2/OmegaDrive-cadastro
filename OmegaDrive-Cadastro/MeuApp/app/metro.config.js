const path = require("path");
const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

config.resolver.extraNodeModules = {
  "@": path.resolve(__dirname),
  "@app": path.resolve(__dirname, "app"),
  "@services": path.resolve(__dirname, "app/services"),
  "@login": path.resolve(__dirname, "app/Login"),
  "@cadastro": path.resolve(__dirname, "app/Cadastro"),
  "@components": path.resolve(__dirname, "components"),
  "@styles": path.resolve(__dirname, "app/Site/Style"), // ✅ atualizado aqui
  "@site": path.resolve(__dirname, "app/Site"),
};

module.exports = config;
