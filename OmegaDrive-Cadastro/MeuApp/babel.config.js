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
            "@": "./", // base raiz do projeto
            "@app": "./app",
            "@services": "./app/services",
            "@login": "./app/Login",
            "@cadastro": "./app/Cadastro",
            "@components": "./components",
            "@styles": "./Style",
            "@site": "./Site",
          },
        },
      ],
    ],
  };
};
