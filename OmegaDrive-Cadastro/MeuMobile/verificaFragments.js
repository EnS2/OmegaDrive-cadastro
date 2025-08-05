const fs = require("fs");
const path = require("path");

// Extensões que vamos inspecionar
const EXTENSOES_VALIDAS = [".js", ".jsx", ".tsx", ".ts"];

// Procura recursivamente os arquivos da pasta
function buscarArquivos(dir, arquivos = []) {
  fs.readdirSync(dir).forEach((arquivo) => {
    const caminhoAbsoluto = path.join(dir, arquivo);

    if (fs.statSync(caminhoAbsoluto).isDirectory()) {
      buscarArquivos(caminhoAbsoluto, arquivos);
    } else if (EXTENSOES_VALIDAS.includes(path.extname(arquivo))) {
      arquivos.push(caminhoAbsoluto);
    }
  });

  return arquivos;
}

// Verifica se o arquivo contém uso incorreto de Fragment com style
function verificarFragmentosComStyle(caminhoArquivo) {
  const conteudo = fs.readFileSync(caminhoArquivo, "utf8");

  const padraoFragmentStyle = /<React\.Fragment[^>]*style\s*=/;
  const padraoShortFragmentStyle = /<>\s*style\s*=/;

  if (
    padraoFragmentStyle.test(conteudo) ||
    padraoShortFragmentStyle.test(conteudo)
  ) {
    console.log(`⚠️  Possível uso incorreto em: ${caminhoArquivo}`);
  }
}

// Executa verificação no projeto
function verificarProjeto() {
  const pastaRaiz = process.cwd();
  const arquivos = buscarArquivos(pastaRaiz);

  console.log("🔍 Verificando fragmentos com style...\n");

  arquivos.forEach(verificarFragmentosComStyle);

  console.log("\n✅ Verificação concluída.");
}

verificarProjeto();
