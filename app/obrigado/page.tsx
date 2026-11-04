import type { Metadata } from "next";
import Link from "next/link";
import { Seta, Whats } from "@/components/Icones";
import Predio from "@/components/Predio";
import { STATUS, linkWhats } from "@/lib/base";

// Página de agradecimento após um contato (formulários, anúncios, landing pages).
// Fora do Google: só faz sentido para quem acabou de falar com a Yankees.
export const metadata: Metadata = {
  title: "Obrigado pelo contato",
  description: "Recebemos seu contato. Um corretor da Yankees vai falar com você em breve.",
  robots: { index: false, follow: false },
};

const PASSOS = [
  { t: "Recebemos seu contato", d: "Sua mensagem já chegou à nossa equipe em Meia Praia." },
  { t: "Um corretor entende seu objetivo", d: "Morar, passar temporadas ou investir: cada perfil pede imóveis diferentes." },
  { t: "Você recebe uma curadoria", d: "Só as opções que fazem sentido para você, sem lista interminável." },
];

export default function Obrigado() {
  return (
    <section className="aviso aviso-obrigado">
      <img className="aviso-mapa" src="/brand/mapa-pontilhado-azul.svg" alt="" aria-hidden="true" />
      <div className="wrap aviso-grid">
        <div className="aviso-texto">
          <span className="eyebrow sobe">Contato recebido</span>
          <h1 className="aviso-numero aviso-palavra sobe d1">
            <span>Obri</span><b>gado.</b>
          </h1>
          <p className="aviso-titulo sobe d1">Seu próximo endereço <b>já está mais perto.</b></p>
          <p className="lead sobe d2">
            Um corretor da Yankees vai falar com você em breve. Atendemos todos os dias, 24 horas. Enquanto isso, que tal conhecer o que acabou de chegar?
          </p>
          <ol className="aviso-passos sobe d2">
            {PASSOS.map((p, n) => (
              <li key={p.t}>
                <span className="num">{String(n + 1).padStart(2, "0")}</span>
                <div><strong>{p.t}</strong><small>{p.d}</small></div>
              </li>
            ))}
          </ol>
          <div className="aviso-acoes sobe d3">
            <Link className="btn btn-azul" href={STATUS.lancamento.rota}>Ver lançamentos <Seta /></Link>
            <Link className="btn btn-linha" href="/">Voltar para a página inicial</Link>
          </div>
          <a
            className="aviso-ajuda sobe d3"
            href={linkWhats("Olá! Acabei de entrar em contato pelo site da Yankees e gostaria de adiantar o atendimento.")}
            target="_blank"
            rel="noopener"
          >
            <span className="aviso-ajuda-icone"><Whats /></span>
            Quer adiantar? <u>Chame um corretor no WhatsApp.</u>
          </a>
        </div>

        <div className="aviso-arte sobe d2">
          <div className="aviso-cena">
            <Predio modo="aceso" rotulo="Ilustração de um edifício em que a última janela acaba de acender" />
            <aside className="aviso-ficha" aria-label="Ficha do seu atendimento">
              <span className="aviso-ficha-ref">Seu atendimento</span>
              <strong>Seu próximo endereço começa aqui.</strong>
              <dl>
                <div><dt>Status</dt><dd>Em andamento</dd></div>
                <div><dt>Idiomas</dt><dd>PT · EN · ES</dd></div>
                <div><dt>Experiência</dt><dd>13 anos · 15+ países</dd></div>
              </dl>
            </aside>
          </div>
        </div>
      </div>
    </section>
  );
}
