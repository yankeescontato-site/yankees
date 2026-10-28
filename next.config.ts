import type { NextConfig } from "next";

const config: NextConfig = {
  async redirects() {
    return [
      { source: "/quem-somos", destination: "/quemsomos", permanent: true },
      { source: "/imoveis-prontos", destination: "/imoveis-venda", permanent: true },
      // Ainda sem blog e favoritos no site novo: temporário até migrar os artigos.
      { source: "/blog", destination: "/", permanent: false },
      { source: "/artigo/:caminho*", destination: "/", permanent: false },
      { source: "/favoritos", destination: "/", permanent: false },
    ];
  },
};

export default config;
