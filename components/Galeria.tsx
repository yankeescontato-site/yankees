"use client";
import { useCallback, useEffect, useState } from "react";
import { foto } from "@/lib/base";

export default function Galeria({ fotos, titulo }: { fotos: string[]; titulo: string }) {
  const [atual, setAtual] = useState<number | null>(null);
  const passo = useCallback((d: number) => setAtual((a) => (a == null ? a : (a + d + fotos.length) % fotos.length)), [fotos.length]);

  useEffect(() => {
    const abrir = (e: Event) => setAtual((e as CustomEvent<number>).detail ?? 0);
    window.addEventListener("abrir-galeria", abrir);
    return () => window.removeEventListener("abrir-galeria", abrir);
  }, []);

  useEffect(() => {
    if (atual == null) return;
    const tecla = (e: KeyboardEvent) => {
      if (e.key === "Escape") setAtual(null);
      if (e.key === "ArrowRight") passo(1);
      if (e.key === "ArrowLeft") passo(-1);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", tecla);
    return () => { document.body.style.overflow = ""; window.removeEventListener("keydown", tecla); };
  }, [atual, passo]);

  const visiveis = fotos.slice(0, 9);

  return (
    <>
      <div className="mosaico">
        {visiveis.map((f, n) => (
          <button key={f} onClick={() => setAtual(n)} aria-label={`Abrir foto ${n + 1}`}>
            <img src={foto(f, n === 0 ? 1600 : 800)} alt={`${titulo}, foto ${n + 1}`} loading="lazy" />
          </button>
        ))}
      </div>
      {fotos.length > visiveis.length && (
        <button className="btn btn-linha" style={{ marginTop: 16 }} onClick={() => setAtual(0)}>
          Ver as {fotos.length} fotos
        </button>
      )}
      {atual != null && (
        <div className="lightbox" role="dialog" aria-label={`Fotos de ${titulo}`}>
          <div className="lb-topo">
            <span className="num">{atual + 1} / {fotos.length}</span>
            <button onClick={() => setAtual(null)} aria-label="Fechar">×</button>
          </div>
          <div className="lb-palco">
            <img src={foto(fotos[atual])} alt={`${titulo}, foto ${atual + 1}`} />
            <button className="lb-nav ant" onClick={() => passo(-1)} aria-label="Anterior">‹</button>
            <button className="lb-nav prox" onClick={() => passo(1)} aria-label="Próxima">›</button>
          </div>
          <div className="lb-miniaturas">
            {fotos.map((f, n) => (
              <button key={f} className={n === atual ? "atual" : ""} onClick={() => setAtual(n)} aria-label={`Foto ${n + 1}`}>
                <img src={foto(f, 200)} alt="" loading="lazy" />
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

export function BotaoGaleria({ total }: { total: number }) {
  return (
    <button className="btn btn-linha-claro ver-fotos" onClick={() => window.dispatchEvent(new CustomEvent("abrir-galeria", { detail: 0 }))}>
      Ver {total} fotos
    </button>
  );
}
