"use client";
import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Card from "./Card";
import { FAIXAS, type Resumo as Imovel } from "@/lib/base";

const ORDENS: Record<string, (a: Imovel, b: Imovel) => number> = {
  destaque: (a, b) => b.nFotos - a.nFotos,
  "menor-preco": (a, b) => (a.preco ?? Infinity) - (b.preco ?? Infinity),
  "maior-preco": (a, b) => (b.preco ?? 0) - (a.preco ?? 0),
  area: (a, b) => (b.areaPrivativa ?? 0) - (a.areaPrivativa ?? 0),
};

export default function Listagem({ lista, aluguel = false }: { lista: Imovel[]; aluguel?: boolean }) {
  const params = useSearchParams();
  const [cidade, setCidade] = useState(params.get("cidade") ?? "");
  const [bairro, setBairro] = useState(params.get("bairro") ?? "");
  const [quartos, setQuartos] = useState(Number(params.get("quartos") ?? 0));
  const [faixa, setFaixa] = useState(params.has("valor") ? Number(params.get("valor")) : -1);
  const [ordem, setOrdem] = useState("destaque");

  const cidades = useMemo(() => [...new Set(lista.map((i) => i.cidade).filter(Boolean))].sort() as string[], [lista]);
  const bairros = useMemo(
    () => [...new Set(lista.filter((i) => !cidade || i.cidade === cidade).map((i) => i.bairro).filter(Boolean))].sort() as string[],
    [lista, cidade]
  );

  const filtrados = useMemo(() => {
    const [, min, max] = FAIXAS[faixa] ?? [, 0, Infinity];
    return lista
      .filter((i) => !cidade || i.cidade === cidade)
      .filter((i) => !bairro || i.bairro === bairro)
      .filter((i) => !quartos || Math.max(i.dormitorios ?? 0, i.suites ?? 0) >= quartos)
      .filter((i) => faixa < 0 || (i.preco != null && i.preco >= min && i.preco < max))
      .sort(ORDENS[ordem]);
  }, [lista, cidade, bairro, quartos, faixa, ordem]);

  return (
    <>
      <div className="filtros">
        <div className="wrap filtros-in">
          <label>Cidade
            <select value={cidade} onChange={(e) => { setCidade(e.target.value); setBairro(""); }}>
              <option value="">Todas</option>
              {cidades.map((c) => <option key={c}>{c}</option>)}
            </select>
          </label>
          <label>Bairro
            <select value={bairro} onChange={(e) => setBairro(e.target.value)}>
              <option value="">Todos</option>
              {bairros.map((b) => <option key={b}>{b}</option>)}
            </select>
          </label>
          <label>Quartos
            <select value={quartos} onChange={(e) => setQuartos(+e.target.value)}>
              <option value={0}>Qualquer</option>
              {[1, 2, 3, 4].map((n) => <option key={n} value={n}>{n}+</option>)}
            </select>
          </label>
          {!aluguel && (
            <label>Valor
              <select value={faixa} onChange={(e) => setFaixa(+e.target.value)}>
                <option value={-1}>Qualquer</option>
                {FAIXAS.map(([nome], n) => <option key={nome} value={n}>{nome}</option>)}
              </select>
            </label>
          )}
          <label>Ordenar
            <select value={ordem} onChange={(e) => setOrdem(e.target.value)}>
              <option value="destaque">Destaques</option>
              <option value="menor-preco">Menor valor</option>
              <option value="maior-preco">Maior valor</option>
              <option value="area">Maior área</option>
            </select>
          </label>
          <span className="total"><b>{filtrados.length}</b> {filtrados.length === 1 ? "imóvel" : "imóveis"}</span>
        </div>
      </div>
      <section className="secao" style={{ paddingTop: 56 }}>
        <div className="wrap">
          {filtrados.length ? (
            <div className="grade">
              {filtrados.map((i, n) => <Card key={i.id} i={i} prioridade={n < 3} />)}
            </div>
          ) : (
            <p className="vazio">Nenhum imóvel com esses filtros. Fale com um corretor: temos opções fora do site.</p>
          )}
        </div>
      </section>
    </>
  );
}
