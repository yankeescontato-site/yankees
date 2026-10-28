import type { Metadata } from "next";
import { Email, Telefone, Whats } from "@/components/Icones";
import { CELULAR, EMAIL, ENDERECO, TELEFONE, linkWhats } from "@/lib/imoveis";

export const metadata: Metadata = { title: "Contato", description: "Fale com a Yankees Negócios Imobiliários em Itapema/SC." };

export default function Contato() {
  return (
    <>
      <section className="topo-pagina">
        <div className="wrap">
          <span className="eyebrow sobe">Contato</span>
          <h1 className="display sobe d1">Vamos <b>conversar.</b></h1>
          <p className="lead sobe d2">Atendemos em português, inglês e espanhol, de segunda a sábado, das 9h às 18h.</p>
        </div>
      </section>
      <section className="secao" style={{ paddingTop: 64 }}>
        <div className="wrap">
          <div className="contato-grid rv">
            <a href={linkWhats("Olá! Vim pelo site da Yankees.")} target="_blank" rel="noopener">
              <span className="contato-icone whats"><Whats /></span>
              <span><small>WhatsApp</small><strong>{CELULAR}</strong></span>
            </a>
            <a href="tel:+554734300636">
              <span className="contato-icone"><Telefone /></span>
              <span><small>Telefone</small><strong>{TELEFONE}</strong></span>
            </a>
            <a href={`mailto:${EMAIL}`}>
              <span className="contato-icone"><Email /></span>
              <span><small>E-mail</small><strong>{EMAIL}</strong></span>
            </a>
          </div>
          <div className="im-bloco rv">
            <h2 style={{ fontSize: 12, fontWeight: 600, letterSpacing: ".22em", textTransform: "uppercase", color: "var(--texto-2)", marginBottom: 20 }}>{ENDERECO}</h2>
            <iframe className="mapa" loading="lazy" title="Mapa da Yankees" src="https://maps.google.com/maps?q=Yankees%20Neg%C3%B3cios%20Imobili%C3%A1rios%20Itapema&hl=pt&z=16&output=embed" />
          </div>
        </div>
      </section>
    </>
  );
}
