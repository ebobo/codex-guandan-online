# codex-guandan-online

This monorepo hosts the online Guandan card game. It uses **pnpm** workspaces with separate packages:

- **web** – Vite + React + TypeScript front-end
- **server** – NestJS WebSocket API
- **engine** – pure TypeScript game logic shared by both

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

## Architecture

The **server** exposes a WebSocket gateway under `/ws`. Client actions are sent
as Socket.IO events which are validated with **Zod** DTOs. Room and game state
is persisted in Redis with a 24‑hour TTL so reconnecting clients can resume
play. The **engine** package contains the pure game logic used by both the
server and future clients.

### Socket Events

- `createRoom` – create a new lobby
- `joinRoom` – join an existing lobby
- `startGame` – deal cards and begin play
- `playCards` – submit a move
- `sync` – fetch current state after reconnect
- `chat` – send a lobby chat message

## Running Tests

All packages share the same test command:

```bash
pnpm lint --fix
pnpm test
```
