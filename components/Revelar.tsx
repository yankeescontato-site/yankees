"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

/** Liga a animação de entrada (.rv → .visivel) quando o elemento aparece na tela. */
export default function Revelar() {
  const pathname = usePathname();
  useEffect(() => {
    // ?captura mostra tudo de uma vez (para prints de página inteira)
    if (location.search.includes("captura")) {
      document.documentElement.classList.add("captura");
      document.querySelectorAll(".rv").forEach((el) => el.classList.add("visivel"));
    }
    const obs = new IntersectionObserver(
      (itens) => itens.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("visivel"); obs.unobserve(e.target); } }),
      { rootMargin: "0px 0px -8% 0px" }
    );
    const observar = () => document.querySelectorAll(".rv:not(.visivel)").forEach((el) => obs.observe(el));
    observar();
    const mut = new MutationObserver(observar);
    mut.observe(document.body, { childList: true, subtree: true });
    return () => { obs.disconnect(); mut.disconnect(); };
  }, [pathname]);
  return null;
}
