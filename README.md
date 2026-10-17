# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  # Kurio NFT Marketplace

  Marketplace de NFTs construído com React, TypeScript, Vite, Tailwind CSS, React Query e MSW.

  ## Executar localmente

  ```bash
  bun install
  bun run dev
  ```

  O app fica disponível em `http://localhost:5173`.

  ## Comandos

  - `bun run dev`: servidor de desenvolvimento com MSW.
  - `bun run build`: verificação TypeScript e build de produção.
  - `bun run lint`: ESLint.
  - `bun run test`: smoke tests Playwright.

  ## Fluxos implementados

  - Catálogo com busca, abas, paginação, coleção, rede, preço e ordenação.
  - Mercado com busca, filtros, ordenação e carrinho.
  - Detalhe de NFT com quantidade, favoritos e limite de estoque.
  - Carrinho persistido localmente.
  - Checkout validado e criação de pedido mockado.
  - Confirmação dinâmica baseada no pedido criado.
  - Cadastro, login e sessão mockados em `localStorage`.

  ## Limitações do mock

  Os NFTs, autenticação, carteira e pedidos são locais para desenvolvimento. A senha e os dados de sessão não devem ser usados assim em produção. A próxima integração deve substituir `src/lib/orders.ts`, `src/lib/auth.ts` e `src/lib/cart.ts` por endpoints autenticados e validação server-side.

