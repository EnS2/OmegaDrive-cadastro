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
            "@": "./",                        // Raiz do projeto
            "@app": "./app",                  // Pasta app principal
            "@login": "./app/Login",          // Telas de login
            "@cadastro": "./app/Cadastro",    // Telas de cadastro
            "@site": "./app/Site",            // Outras telas
            "@styles": "./app/Site/Style",    // Estilos customizados
            "@services": "./app/services",    // API e serviços
            "@components": "./components",    // Componentes reutilizáveis
            "@assets": "./assets",            // Imagens e mídias
            "@constants": "./constants",      // Constantes do projeto
            "@hooks": "./hooks",              // Hooks customizados
          },
        },
      ],
    ],
  };
};
