// Busca os imóveis no Lapel (CRM) e grava data/imoveis.json antes de cada build.
// Roda sozinho no "prebuild". O Lapel chama o Deploy Hook da Vercel quando um imóvel muda,
// então o site sempre sai com os dados do momento.
// Variáveis (na Vercel): LAPEL_FEED_URL e LAPEL_FEED_KEY. Sem elas, mantém o arquivo atual
// (o importador antigo da OAWEB continua valendo até a troca).
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const ARQUIVO = path.join(RAIZ, "data", "imoveis.json");
const URL_FEED = process.env.LAPEL_FEED_URL;
const CHAVE = process.env.LAPEL_FEED_KEY;

if (!URL_FEED || !CHAVE) {
  console.log("Lapel: LAPEL_FEED_URL/LAPEL_FEED_KEY ausentes, mantendo data/imoveis.json.");
  process.exit(0);
}

let ultimoErro;
for (let tentativa = 1; tentativa <= 3; tentativa++) {
  try {
    const r = await fetch(URL_FEED, { headers: { "x-lapel-key": CHAVE }, signal: AbortSignal.timeout(30000) });
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    const { imoveis } = await r.json();
    if (!Array.isArray(imoveis)) throw new Error("resposta sem a lista de imóveis");
    await fs.writeFile(ARQUIVO, JSON.stringify(imoveis, null, 1) + "\n");
    console.log(`Lapel: ${imoveis.length} imóveis gravados.`);
    process.exit(0);
  } catch (e) {
    ultimoErro = e;
    console.warn(`Lapel: tentativa ${tentativa} falhou (${e.message}).`);
    await new Promise((ok) => setTimeout(ok, 3000 * tentativa));
  }
}
// Falha o build: a Vercel mantém no ar a versão anterior do site, com os dados de antes.
console.error(`Lapel: não deu para ler os imóveis (${ultimoErro?.message}). Build cancelado.`);
process.exit(1);
