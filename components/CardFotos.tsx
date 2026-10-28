"use client";
import { useState } from "react";
import { foto } from "@/lib/base";

/** Fotos do card com setas; as imagens só são baixadas quando a pessoa chega nelas. */
export default function CardFotos({ fotos, alt, prioridade }: { fotos: string[]; alt: string; prioridade: boolean }) {
  const [atual, setAtual] = useState(0);
  const [vistas, setVistas] = useState(() => new Set([0]));

  // as setas ficam dentro do link do card: não podem abrir o imóvel
  function passar(e: React.MouseEvent, direcao: 1 | -1) {
    e.preventDefault();
    e.stopPropagation();
    const volta = (k: number) => (k + fotos.length) % fotos.length;
    setAtual((a) => {
      const n = volta(a + direcao);
      // já carrega a seguinte para a próxima troca ser instantânea
      setVistas((v) => new Set(v).add(n).add(volta(n + direcao)));
      return n;
    });
  }

  return (
    <>
      {fotos.map((f, n) =>
        vistas.has(n) ? (
          <img key={f} src={foto(f, 1000)} alt={n === 0 ? alt : ""} className={n === atual ? "atual" : undefined}
            loading={n === 0 && prioridade ? "eager" : "lazy"} />
        ) : null
      )}
      {fotos.length > 1 && (
        <>
          <button className="card-seta ant" onClick={(e) => passar(e, -1)} aria-label="Foto anterior">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true"><path d="M15 5l-7 7 7 7" /></svg>
          </button>
          <button className="card-seta prox" onClick={(e) => passar(e, 1)} aria-label="Próxima foto">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true"><path d="M9 5l7 7-7 7" /></svg>
          </button>
          <span className="card-pontos" aria-hidden="true">
            {fotos.map((f, n) => <i key={f} className={n === atual ? "atual" : undefined} />)}
          </span>
        </>
      )}
    </>
  );
}
