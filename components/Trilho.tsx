"use client";
import { useEffect, useRef, useState } from "react";
import { Seta } from "./Icones";

/** Faixa horizontal de cards com setas nas laterais; o arraste/toque continua funcionando. */
export default function Trilho({ children }: { children: React.ReactNode }) {
  const faixa = useRef<HTMLDivElement>(null);
  const [inicio, setInicio] = useState(true);
  const [fim, setFim] = useState(false);

  useEffect(() => {
    const el = faixa.current;
    if (!el) return;
    const medir = () => {
      setInicio(el.scrollLeft <= 4);
      setFim(el.scrollLeft + el.clientWidth >= el.scrollWidth - 4);
    };
    medir();
    el.addEventListener("scroll", medir, { passive: true });
    window.addEventListener("resize", medir);
    return () => { el.removeEventListener("scroll", medir); window.removeEventListener("resize", medir); };
  }, []);

  // anda o equivalente a um card (largura do primeiro + espaço)
  function andar(direcao: 1 | -1) {
    const el = faixa.current;
    const [a, b] = (el?.children ?? []) as unknown as HTMLElement[];
    if (!el || !a) return;
    const passo = b ? b.offsetLeft - a.offsetLeft : a.offsetWidth;
    el.scrollBy({ left: direcao * passo, behavior: "smooth" });
  }

  return (
    <div className="trilho-caixa">
      <button className="depo-seta trilho-seta ant" onClick={() => andar(-1)} disabled={inicio} aria-label="Anteriores"><Seta /></button>
      <button className="depo-seta trilho-seta prox" onClick={() => andar(1)} disabled={fim} aria-label="Próximos"><Seta /></button>
      <div ref={faixa} className="trilho">{children}</div>
    </div>
  );
}
