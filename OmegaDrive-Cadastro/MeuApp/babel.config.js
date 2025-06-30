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
            "@": "./MeuApp",
            "@services": "./MeuApp/app/services",
            "@login": "./MeuApp/app/Login",
            "@cadastro": "./MeuApp/app/Cadastro",
          },
        },
      ],
    ],
  };
};
