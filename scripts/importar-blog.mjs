// Importa os artigos do blog publicado na OAWEB para data/artigos.json.
// O texto passa por uma lista fechada de tags permitidas antes de ir para o site (nada de script,
// estilo, iframe ou atributo além do href dos links). Uso: node scripts/importar-blog.mjs
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const BASE = (process.env.OAWEB_URL || "https://www.yankeesitapema.com.br").replace(/\/$/, "");
const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const ARQUIVO = path.join(RAIZ, "data", "artigos.json");
const MINIMO_RELATIVO = 0.6;

async function baixarHtml(url) {
  const r = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
  if (!r.ok) throw new Error(`${r.status} ${url}`);
  return new TextDecoder("latin1").decode(await r.arrayBuffer());
}

const ENTIDADES = { nbsp: " ", amp: "&", quot: '"', apos: "'", lt: "<", gt: ">", ndash: "–", mdash: "—", hellip: "…", ldquo: "“", rdquo: "”", lsquo: "‘", rsquo: "’" };
const decodificar = (s) =>
  s.replace(/&(#x?[0-9a-f]+|[a-z]+);/gi, (m, e) =>
    e[0] === "#" ? String.fromCodePoint(parseInt(e.slice(e[1] === "x" ? 2 : 1), e[1] === "x" ? 16 : 10)) : ENTIDADES[e.toLowerCase()] ?? m
  );
const escapar = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const textoPuro = (html) => decodificar(html.replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim();

// tag de origem -> tag publicada (o que não estiver aqui é descartado, mantendo só o texto)
const PERMITIDAS = { p: "p", br: "br", h1: "h2", h2: "h2", h3: "h3", h4: "h3", h5: "h3", h6: "h3", strong: "strong", b: "strong", em: "em", i: "em", ul: "ul", ol: "ol", li: "li", a: "a", blockquote: "blockquote", div: "p" };
const DESCARTAR_COM_CONTEUDO = /<(script|style|iframe|object|embed|noscript|svg|form)[\s\S]*?<\/\1>/gi;

function sanear(html) {
  let saida = "";
  for (const [, fecha, tag, attrs, texto] of html.replace(DESCARTAR_COM_CONTEUDO, "").matchAll(/<(\/?)([a-zA-Z0-9]+)([^>]*)>|([^<]+)/g)) {
    if (texto != null) { saida += escapar(decodificar(texto)); continue; }
    const nova = PERMITIDAS[tag.toLowerCase()];
    if (!nova) continue;
    if (nova === "br") { saida += "<br>"; continue; }
    if (nova === "a" && !fecha) {
      const href = decodificar(attrs.match(/href\s*=\s*["']([^"']*)["']/i)?.[1] ?? "").trim();
      const valido = /^https?:\/\/[^\s"'<>]+$/i.test(href) || /^\/[^\s"'<>]*$/.test(href);
      saida += valido ? `<a href="${escapar(href)}"${href.startsWith("/") ? "" : ' target="_blank" rel="noopener noreferrer"'}>` : "<a>";
      continue;
    }
    saida += fecha ? `</${nova}>` : `<${nova}>`;
  }
  return saida
    .replace(/(<p>\s*)+/g, "<p>").replace(/(\s*<\/p>)+/g, "</p>")
    .replace(/<p>(\s|<br>)*/g, "<p>").replace(/(\s|<br>)*<\/p>/g, "</p>")
    // linha em branco dentro do parágrafo vira novo parágrafo; <br> solto entre parágrafos sai
    .replace(/(\s*<br>){2,}\s*/g, "</p><p>")
    .replace(/<\/p>(\s|<br>)+/g, "</p>")
    .replace(/<p>(\s|<br>)*/g, "<p>").replace(/(\s|<br>)*<\/p>/g, "</p>")
    .replace(/<p><\/p>/g, "")
    // o site antigo salvou aspas curvas como "?": "?Arquitetura Viva?" volta a ser “Arquitetura Viva”
    .replace(/(^|[\s>:(])\?([^?<]{1,400}?)\?(?=[\s<.,;:)!]|$)/g, "$1“$2”")
    .replace(/(^|[\s>:(])\?(?=[A-ZÁÉÍÓÚÂÊÔÃÕ])/g, "$1“")
    .replace(/ \? /g, " — ") // travessão que também virou "?"
    .replace(/\?(?=\.)/g, "”") // "?." é fim de citação, não pergunta
    // parágrafo curto sem pontuação final costuma ser um intertítulo do texto original
    .replace(/<p>([^<]{4,90}?)<\/p>/g, (m, t) => (/[.!?:;,]$/.test(t.trim()) ? m : `<h2>${t.trim()}</h2>`))
    .trim();
}

async function listarArtigos() {
  const vistos = new Map();
  for (let p = 1; p <= 40; p++) {
    const html = await baixarHtml(p === 1 ? `${BASE}/blog` : `${BASE}/blog&page=${p}`);
    const achados = [...html.matchAll(/\/artigo\/(\d+)\/([a-z0-9-]+)/g)].filter(([, id]) => !vistos.has(id));
    if (!achados.length) break;
    for (const [, id, slug] of achados) vistos.set(id, slug);
  }
  return vistos;
}

function lerArtigo(html, id, slug) {
  const bloco = html.match(/class="blog-1 blog-big">[\s\S]*?<div class="detail">([\s\S]*?)<\/div>\s*<\/div>\s*<\/div>\s*<div class="col-lg-4/)?.[1];
  if (!bloco) throw new Error("estrutura do artigo não encontrada");
  const titulo = textoPuro(bloco.match(/<h3>([\s\S]*?)<\/h3>/)?.[1] ?? "").replace(/\.$/, "");
  const corpo = sanear(bloco.replace(/<h3>[\s\S]*?<\/h3>/, ""));
  const resumo = textoPuro(corpo.replace(/<h2>[\s\S]*?<\/h2>/g, " "));
  if (!/^\d{1,8}$/.test(id) || !/^[a-z0-9-]{1,200}$/.test(slug) || !titulo || resumo.length < 80) throw new Error("artigo fora do padrão");
  return { id, slug, titulo: titulo.slice(0, 200), resumo: resumo.slice(0, 220).replace(/\s\S*$/, "") + "…", corpo: corpo.slice(0, 60000) };
}

const anteriores = JSON.parse(await fs.readFile(ARQUIVO, "utf8").catch(() => "[]"));
const lista = await listarArtigos();
console.log(`${lista.size} artigos encontrados em ${BASE}/blog`);

let falhas = 0;
const artigos = [];
for (const [id, slug] of lista) {
  try {
    artigos.push(lerArtigo(await baixarHtml(`${BASE}/artigo/${id}/${slug}`), id, slug));
  } catch (e) {
    falhas++;
    console.warn(`✗ ${id} ${slug}: ${e.message}`);
  }
}
artigos.sort((a, b) => Number(b.id) - Number(a.id));

if (falhas > 0 || artigos.length < anteriores.length * MINIMO_RELATIVO) {
  console.error(`Importação do blog abortada: ${artigos.length} lidos, ${falhas} falhas (antes eram ${anteriores.length}). Nada foi alterado.`);
  process.exit(1);
}
await fs.writeFile(ARQUIVO, JSON.stringify(artigos, null, 2) + "\n");
console.log(`data/artigos.json: ${artigos.length} artigos`);
