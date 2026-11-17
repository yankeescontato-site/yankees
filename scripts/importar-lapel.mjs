// Busca no Lapel (CRM) os imóveis e os artigos do blog e grava data/imoveis.json e
// data/artigos.json antes de cada build. Roda sozinho no "prebuild". O Lapel chama o
// Deploy Hook da Vercel quando um imóvel ou artigo muda, então o site sempre sai com os
// dados do momento.
// Variáveis (na Vercel): LAPEL_FEED_URL (feed dos imóveis) e LAPEL_FEED_KEY. O feed do blog
// é o mesmo endereço terminando em /artigos (ou LAPEL_BLOG_URL). Sem elas, mantém os arquivos.
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const URL_IMOVEIS = process.env.LAPEL_FEED_URL;
const URL_BLOG = process.env.LAPEL_BLOG_URL || URL_IMOVEIS?.replace(/\/imoveis\/?$/, "/artigos");
const CHAVE = process.env.LAPEL_FEED_KEY;

if (!URL_IMOVEIS || !CHAVE) {
  console.log("Lapel: LAPEL_FEED_URL/LAPEL_FEED_KEY ausentes, mantendo data/imoveis.json e data/artigos.json.");
  process.exit(0);
}

async function buscar(url, campo) {
  let ultimoErro;
  for (let tentativa = 1; tentativa <= 3; tentativa++) {
    try {
      const r = await fetch(url, { headers: { "x-lapel-key": CHAVE }, signal: AbortSignal.timeout(30000) });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const lista = (await r.json())[campo];
      if (!Array.isArray(lista)) throw new Error(`resposta sem a lista de ${campo}`);
      return lista;
    } catch (e) {
      ultimoErro = e;
      console.warn(`Lapel: ${campo}, tentativa ${tentativa} falhou (${e.message}).`);
      await new Promise((ok) => setTimeout(ok, 3000 * tentativa));
    }
  }
  // Falha o build: a Vercel mantém no ar a versão anterior do site, com os dados de antes.
  console.error(`Lapel: não deu para ler ${campo} (${ultimoErro?.message}). Build cancelado.`);
  process.exit(1);
}

const [imoveis, artigos] = await Promise.all([buscar(URL_IMOVEIS, "imoveis"), buscar(URL_BLOG, "artigos")]);
await fs.writeFile(path.join(RAIZ, "data", "imoveis.json"), JSON.stringify(imoveis, null, 1) + "\n");
await fs.writeFile(path.join(RAIZ, "data", "artigos.json"), JSON.stringify(artigos, null, 2) + "\n");
console.log(`Lapel: ${imoveis.length} imóveis e ${artigos.length} artigos gravados.`);
