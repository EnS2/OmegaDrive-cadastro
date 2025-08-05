module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      [
        "module-resolver",
        {
          extensions: [".js", ".jsx", ".ts", ".tsx", ".json"],
          alias: {
            "@": "./",
            "@app": "./App",
            "@login": "./App/Login",
            "@cadastro": "./App/Cadastro",
            "@site": "./App/Site",
            "@styles": "./App/Site/Style",
            "@services": "./App/Services", // ✅ CORRIGIDO
            "@components": "./components",
            "@assets": "./assets",
            "@constants": "./constants",
            "@hooks": "./hooks",
          },
        },
      ],
    ],
  };
};
