# Site Yankees (yankeesitapema.com.br)

Site novo da Yankees Negócios Imobiliários em Next.js, no Manual de Estética Yankees (azul #001E7F, cinza #8D8D8D, branco, Inter), em modo escuro.

## Rodar

```bash
npm install
npm run dev        # http://localhost:3100
npm run build      # gera as páginas estáticas
```

## Imóveis: cadastro continua na OAWEB

A Yankees cadastra, edita e remove imóveis no painel da OAWEB, como sempre. O site novo lê o site público da OAWEB e guarda tudo em `data/imoveis.json`:

```bash
npm run importar
```

- **Automático:** `.github/workflows/importar-imoveis.yml` roda a importação a cada 3 horas. Se algo mudou, salva o JSON no repositório e a Vercel publica de novo.
- **Fotos:** vêm do servidor da própria OAWEB (`buscaimoveisbrasil.com.br`), então não dependem do domínio da Yankees.
- **Trava:** se a leitura falhar em algum imóvel, ou vier menos de 60% dos imóveis da última vez, nada é alterado e o site continua como estava.
- **Quando o domínio for para o site novo:** o site da OAWEB precisa continuar acessível em outro endereço. Coloque esse endereço na variável `OAWEB_URL` (no GitHub: Settings > Secrets and variables > Actions > Variables).

As URLs de imóvel e de categoria são as mesmas do site antigo (`/imovel/<id>/<slug>`, `/imoveis-lancamento` etc.), para não perder posição no Google.

## Pendências

- Descobrir em que endereço o site da OAWEB fica no ar depois da troca do domínio.
- Blog e favoritos: hoje redirecionam para a home.
- Criar o repositório no GitHub, publicar na Vercel e apontar o domínio no Registro.br.
