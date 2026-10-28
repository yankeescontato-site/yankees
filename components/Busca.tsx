"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Seta } from "./Icones";
import { FAIXAS, STATUS, type Status } from "@/lib/base";

export default function Busca({ cidades }: { cidades: string[] }) {
  const router = useRouter();
  const [status, setStatus] = useState<Status>("lancamento");
  const [cidade, setCidade] = useState("");
  const [quartos, setQuartos] = useState("");
  const [faixa, setFaixa] = useState("");

  function buscar(e: React.FormEvent) {
    e.preventDefault();
    const q = new URLSearchParams();
    if (cidade) q.set("cidade", cidade);
    if (quartos) q.set("quartos", quartos);
    if (faixa && status !== "aluguel") q.set("valor", faixa);
    router.push(`${STATUS[status].rota}${q.size ? `?${q}` : ""}`);
  }

  return (
    <form className="busca" onSubmit={buscar}>
      <label><span>Momento</span>
        <select value={status} onChange={(e) => setStatus(e.target.value as Status)}>
          {(Object.keys(STATUS) as Status[]).map((s) => <option key={s} value={s}>{STATUS[s].plural}</option>)}
        </select>
      </label>
      <label><span>Cidade</span>
        <select value={cidade} onChange={(e) => setCidade(e.target.value)}>
          <option value="">Todo o litoral</option>
          {cidades.map((c) => <option key={c}>{c}</option>)}
        </select>
      </label>
      <label><span>Quartos</span>
        <select value={quartos} onChange={(e) => setQuartos(e.target.value)}>
          <option value="">Qualquer</option>
          {[1, 2, 3, 4].map((n) => <option key={n} value={n}>{n} ou mais</option>)}
        </select>
      </label>
      <label><span>Valor</span>
        <select value={faixa} onChange={(e) => setFaixa(e.target.value)} disabled={status === "aluguel"}>
          <option value="">Qualquer</option>
          {FAIXAS.map(([nome], n) => <option key={nome} value={n}>{nome}</option>)}
        </select>
      </label>
      <button className="btn btn-azul" type="submit">Buscar <Seta /></button>
    </form>
  );
}
