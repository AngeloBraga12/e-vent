# E-vent

Painel front-end para organização e acompanhamento de eventos, desenvolvido como projeto de portfólio.

A aplicação demonstra um dashboard responsivo com gerenciamento de eventos no navegador, indicadores derivados do estado, busca, filtros e formulários de criação e edição.

## Demonstração técnica

- React + TypeScript
- Vite
- Hooks e estado derivado com `useState`, `useEffect` e `useMemo`
- Persistência de dados com `localStorage`
- Criação e edição de eventos
- Exclusão com confirmação
- Alteração de status diretamente na lista
- Busca por evento ou local
- Filtro por status
- Validação nativa de formulário
- Layout responsivo para desktop e mobile
- Controles com estados acessíveis e suporte a `Escape` para fechar o modal
- GitHub Actions para validação TypeScript e build

## Funcionalidades

- Resumo de eventos, confirmações e participantes
- Cadastro de novos eventos
- Edição de eventos existentes
- Exclusão de eventos
- Ciclo de status: Planejado → Confirmado → Concluído → Planejado
- Busca e filtros combináveis
- Estado vazio quando nenhum resultado corresponde à pesquisa
- Persistência local entre sessões no mesmo navegador
- Interface responsiva

## Executar localmente

```bash
npm install
npm run dev
```

Para validar o projeto e gerar a versão de produção:

```bash
npm run lint
npm run build
```

## Estrutura

```text
src/
├── App.tsx       # interface, estado e regras da aplicação
├── main.tsx      # entrada do React
└── styles.css    # layout e responsividade
```

## Contexto

Projeto criado para demonstrar evolução prática em desenvolvimento Web e Front-end, com foco em React, TypeScript, organização de código, gerenciamento de estado, persistência no navegador e construção de interfaces responsivas.

Não há backend ou autenticação. Os dados são armazenados apenas no `localStorage` do navegador.

## Autor

**Angelo Braga**  
Técnico em Informática · Desenvolvimento Web / Front-end

- GitHub: https://github.com/AngeloBraga12
- Portfólio: https://portifolio-angelobraga.netlify.app/
- LinkedIn: https://www.linkedin.com/in/angelo-braga-5747b4192/
