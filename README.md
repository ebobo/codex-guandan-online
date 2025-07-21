# codex-guandan-online

This monorepo hosts the online Guandan card game. It uses **pnpm** workspaces with separate `web` and `server` packages.

- **web** – Vite + React + TypeScript front-end
- **server** – NestJS back end

Install dependencies and run linters/tests:

```bash
pnpm install
pnpm lint --fix
pnpm test
```

## Playing Locally

Start the NestJS server and the Vite dev server in separate terminals:

```bash
pnpm --filter server start:dev
pnpm --filter web dev
```

Open <http://localhost:5173> in your browser to play with the front-end. The
back end listens on <http://localhost:3000>.

## Running Tests

All packages share the same test command:

```bash
pnpm lint --fix
pnpm test
```
