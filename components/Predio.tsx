/* Prédio desenhado das páginas de aviso (404 e obrigado): 13 andares com 4 apartamentos.
   O apartamento 404 (4º andar, unidade 4) é o destaque, ligado à ficha ao lado:
   - "vazio": janela apagada e tracejada, o endereço que não existe;
   - "aceso": a última janela a acender, o próximo endereço do cliente. */
const ANDARES = 13;
const TOPO = 70;
const ALTURA_ANDAR = 34;
const X_PREDIO = 60;
const LARGURA_PREDIO = 240;
const JANELA = { l: 44, a: 20, vao: 12 };
const X_JANELA0 = X_PREDIO + (LARGURA_PREDIO - (4 * JANELA.l + 3 * JANELA.vao)) / 2;
const BASE = TOPO + ANDARES * ALTURA_ANDAR;

const yAndar = (andar: number) => TOPO + (ANDARES - andar) * ALTURA_ANDAR;
const Y_ALVO = yAndar(4) + 7;
const X_ALVO = X_JANELA0 + 3 * (JANELA.l + JANELA.vao);

export default function Predio({ modo, rotulo }: { modo: "vazio" | "aceso"; rotulo: string }) {
  const janelas = [];
  for (let andar = ANDARES; andar >= 1; andar--) {
    for (let u = 1; u <= 4; u++) {
      if (andar === 4 && u === 4) continue;
      const acesa = (andar * 7 + u * 13) % 5 < 2;
      const x = X_JANELA0 + (u - 1) * (JANELA.l + JANELA.vao);
      const y = yAndar(andar) + 7;
      janelas.push(
        <rect
          key={`${andar}-${u}`}
          className={acesa ? "aviso-luz" : "aviso-janela"}
          style={acesa ? ({ "--d": `${0.5 + ((ANDARES - andar) * 4 + u) * 0.035}s` } as React.CSSProperties) : undefined}
          x={x} y={y} width={JANELA.l} height={JANELA.a} rx="1.5"
        />,
      );
    }
  }
  const lajes = Array.from({ length: ANDARES - 1 }, (_, n) => yAndar(n + 1));

  return (
    <svg className="aviso-svg" viewBox="0 0 520 600" role="img" aria-label={rotulo}>
      {/* prédios vizinhos, mais distantes */}
      <rect className="aviso-vizinho" x="4" y="300" width="44" height={BASE - 300} rx="2" />
      <rect className="aviso-vizinho aviso-vizinho-2" x="306" y="368" width="38" height={BASE - 368} rx="2" />

      {/* torre principal */}
      <rect className="aviso-cobertura" x="140" y="44" width="80" height="26" rx="3" />
      <line className="aviso-antena" x1="180" y1="16" x2="180" y2="44" />
      <rect className="aviso-torre" x={X_PREDIO} y={TOPO} width={LARGURA_PREDIO} height={BASE - TOPO} rx="4" />
      {lajes.map((y) => (
        <line key={y} className="aviso-laje" x1={X_PREDIO - 6} y1={y} x2={X_PREDIO + LARGURA_PREDIO + 6} y2={y} />
      ))}
      {janelas}

      {/* o apartamento em destaque */}
      <rect className="aviso-alvo-halo" x={X_ALVO - 5} y={Y_ALVO - 5} width={JANELA.l + 10} height={JANELA.a + 10} rx="4" />
      <rect className={modo === "aceso" ? "aviso-alvo aviso-alvo-aceso" : "aviso-alvo"} x={X_ALVO} y={Y_ALVO} width={JANELA.l} height={JANELA.a} rx="1.5" />
      {modo === "vazio" && (
        <text className="aviso-alvo-num" x={X_ALVO + JANELA.l / 2} y={Y_ALVO + 14} textAnchor="middle">404</text>
      )}
      <path className="aviso-guia" d={`M${X_ALVO + JANELA.l + 6} ${Y_ALVO + JANELA.a / 2} H 352`} />
      <circle className="aviso-ponto" cx="352" cy={Y_ALVO + JANELA.a / 2} r="3" />

      {/* chão e mar */}
      <line className="aviso-chao" x1="0" y1={BASE} x2="520" y2={BASE} />
      <path className="aviso-mar" d={`M0 ${BASE + 22} q 32 -8 65 0 t 65 0 t 65 0 t 65 0 t 65 0 t 65 0 t 65 0 t 65 0`} />
      <path className="aviso-mar aviso-mar-2" d={`M0 ${BASE + 44} q 32 -7 65 0 t 65 0 t 65 0 t 65 0 t 65 0 t 65 0 t 65 0 t 65 0`} />
      <path className="aviso-mar aviso-mar-3" d={`M0 ${BASE + 64} q 32 -6 65 0 t 65 0 t 65 0 t 65 0 t 65 0 t 65 0 t 65 0 t 65 0`} />
    </svg>
  );
}
