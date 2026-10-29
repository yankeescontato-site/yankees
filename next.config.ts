import type { NextConfig } from "next";

// Política de conteúdo: o navegador só carrega o que vem destas origens.
// Scripts inline continuam liberados porque o Next os usa para montar as páginas estáticas;
// o que fica bloqueado é qualquer script, iframe ou imagem de origem desconhecida.
const CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: https://www.buscaimoveisbrasil.com.br",
  "font-src 'self'",
  "connect-src 'self'",
  "frame-src https://maps.google.com https://www.google.com",
  "frame-ancestors 'none'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "upgrade-insecure-requests",
].join("; ");

const SEGURANCA = [
  { key: "Content-Security-Policy", value: CSP },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
];

const config: NextConfig = {
  poweredByHeader: false,
  async headers() {
    // em desenvolvimento o Next precisa de eval e websocket; a política vale só no site publicado
    if (process.env.NODE_ENV !== "production") return [];
    return [{ source: "/:caminho*", headers: SEGURANCA }];
  },
  async redirects() {
    return [
      { source: "/quem-somos", destination: "/quemsomos", permanent: true },
      { source: "/imoveis-prontos", destination: "/imoveis-venda", permanent: true },
      // Favoritos ainda não existe no site novo: temporário.
      { source: "/favoritos", destination: "/", permanent: false },
    ];
  },
};

export default config;
