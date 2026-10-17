# Arquitetura

## Execucao

- `bun run dev` inicia o Vite com MSW por padrao.
- `VITE_ENABLE_MOCKS=false` desativa o worker para apontar a aplicacao a uma API externa.
- `bun run build` executa o typecheck e gera o build de producao.
- `bun run test` executa os cenarios Playwright em Chromium desktop e mobile.

## Dados e cache

O Axios concentra as chamadas REST em `src/lib/api-client.ts`. O catalogo usa TanStack Query e o worker MSW responde a listagem de NFTs. O pedido usa `POST /api/orders` com `Idempotency-Key`; o handler devolve o mesmo snapshot para repeticoes da mesma tentativa. O recibo e salvo localmente somente depois da resposta de sucesso.

A chave de cache do catalogo inclui os parametros de pagina e tamanho da consulta atuais. Eventos realtime atualizam o cache por recurso, e versoes menores ou duplicadas sao descartadas.

## Mocking

MSW e iniciado por configuracao no bootstrap e pode ser usado no build de demonstracao. Os handlers REST ficam em `src/mocks/handlers.ts`. O estado de idempotencia dos pedidos vive no worker durante a sessao do navegador; recarregar o cenario restaura o estado inicial das fixtures.

## Tempo real

O cliente usa `socket.io-client` em `src/lib/socket.ts`, com transporte WebSocket. Durante o desenvolvimento, `@mswjs/socket.io-binding` adapta conexoes `msw/ws`; o binding nao oferece salas, namespaces ou broadcast completos. Eventos carregam `resourceId` e `version`. O cliente mantem a maior versao por recurso e publica somente eventos novos para a interface.

## Limites atuais

A simulacao ainda precisa expandir os contratos de sessao, perfil, carteiras, carrinho, cotacao e estados pendente/recusado de pedidos. Tambem faltam cenarios de falha configuraveis, reconexao com reconciliacao REST e auditoria Lighthouse versionada.
