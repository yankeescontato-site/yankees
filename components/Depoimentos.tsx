"use client";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Estrela, Seta } from "./Icones";

export type Depoimento = { nome: string; de: string; texto: string; nota?: number };

const INTERVALO = 4000;

/**
 * Carrossel que avança um depoimento a cada 4 s e volta ao início sem salto visível.
 * Paralaxe em camadas: mapa ao fundo segue a rolagem mais devagar (--s) e, dentro de cada card,
 * texto e aspas andam em ritmos diferentes conforme a distância do centro (--d).
 */
export default function Depoimentos({ lista }: { lista: Depoimento[] }) {
  const [indice, setIndice] = useState(0);
  const [animar, setAnimar] = useState(true);
  const [pausado, setPausado] = useState(false);
  const raiz = useRef<HTMLDivElement>(null);
  const trilho = useRef<HTMLDivElement>(null);

  // depende de indice para que um clique nas setas reinicie a contagem dos 4 s
  useEffect(() => {
    if (pausado) return;
    const t = setTimeout(() => { setAnimar(true); setIndice((i) => i + 1); }, INTERVALO);
    return () => clearTimeout(t);
  }, [pausado, indice]);

  // laço de animação só enquanto o carrossel está na tela; escreve variáveis CSS direto no DOM
  useEffect(() => {
    const el = raiz.current;
    const tr = trilho.current;
    if (!el || !tr) return;
    let quadro = 0;
    let visivel = false;

    const atualizar = () => {
      const caixa = el.getBoundingClientRect();
      const meioTela = innerHeight / 2;
      // -1 quando o carrossel está entrando por baixo, +1 saindo por cima
      const s = Math.max(-1, Math.min(1, (meioTela - (caixa.top + caixa.height / 2)) / (innerHeight / 2 + caixa.height / 2)));
      el.style.setProperty("--s", s.toFixed(4));

      const meio = caixa.left + caixa.width / 2;
      for (const card of tr.children as unknown as HTMLElement[]) {
        const c = card.getBoundingClientRect();
        if (c.right < caixa.left - c.width || c.left > caixa.right + c.width) continue;
        const d = Math.max(-1.5, Math.min(1.5, (c.left + c.width / 2 - meio) / caixa.width));
        card.style.setProperty("--d", d.toFixed(4));
        card.style.setProperty("--a", Math.min(1, Math.abs(d)).toFixed(4));
      }
      if (visivel) quadro = requestAnimationFrame(atualizar);
    };

    const obs = new IntersectionObserver(([e]) => {
      visivel = e.isIntersecting;
      cancelAnimationFrame(quadro);
      if (visivel) quadro = requestAnimationFrame(atualizar);
    }, { rootMargin: "200px 0px" });
    obs.observe(el);
    return () => { obs.disconnect(); cancelAnimationFrame(quadro); };
  }, []);

  // passou do último original: quando o deslize termina, volta à cópia equivalente sem animação
  // (a lista está duplicada no trilho). Temporizador em vez de transitionend, que falha com a aba oculta.
  useEffect(() => {
    if (indice < lista.length) return;
    const t = setTimeout(() => { setAnimar(false); setIndice((i) => i - lista.length); }, 850);
    return () => clearTimeout(t);
  }, [indice, lista.length]);

  const ir = (n: number) => { setAnimar(true); setIndice(n); };
  const proximo = () => ir(indice + 1);
  // antes do primeiro: salta sem animação para a cópia do primeiro e então desliza para o último
  function anterior() {
    if (indice > 0) return ir(indice - 1);
    setAnimar(false);
    setIndice(lista.length);
    requestAnimationFrame(() => requestAnimationFrame(() => ir(lista.length - 1)));
  }

  return (
    <div ref={raiz} className="depo-carrossel" onMouseEnter={() => setPausado(true)} onMouseLeave={() => setPausado(false)} onFocus={() => setPausado(true)} onBlur={() => setPausado(false)}>
      <img className="depo-mapa" src="/brand/mapa-pontilhado-branco.svg" alt="" aria-hidden="true" />
      <button className="depo-seta ant" onClick={anterior} aria-label="Avaliação anterior"><Seta /></button>
      <button className="depo-seta prox" onClick={proximo} aria-label="Próxima avaliação"><Seta /></button>
      <div className="depo-janela">
        <div
          ref={trilho}
          className="depo-trilho"
          // o deslocamento é calculado no CSS a partir de --i, então vale para qualquer largura de tela
          style={{ "--i": indice, transition: animar ? undefined : "none" } as CSSProperties}
        >
          {[...lista, ...lista].map((d, n) => (
            <figure key={n} className="depo" aria-hidden={n >= lista.length || undefined}>
              <span className="depo-aspas" aria-hidden="true">“</span>
              <div className="depo-camada">
                <blockquote>{d.texto}</blockquote>
                <footer>
                  <div className="depo-nome">
                    <b>{d.nome}</b>
                    <span className="estrelas" role="img" aria-label={`${d.nota ?? 5} de 5 estrelas`}>
                      {Array.from({ length: d.nota ?? 5 }, (_, k) => <Estrela key={k} />)}
                    </span>
                  </div>
                  <span>{d.de}</span>
                </footer>
              </div>
            </figure>
          ))}
        </div>
      </div>
      <div className="depo-pontos" role="tablist" aria-label="Depoimentos">
        {lista.map((d, n) => (
          <button key={d.nome} role="tab" aria-selected={indice % lista.length === n} aria-label={`Depoimento de ${d.nome}`} onClick={() => ir(n)} />
        ))}
      </div>
    </div>
  );
}
