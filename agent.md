# AGENT INSTRUCTIONS – 3-Player Online Card Game (81-card variant)

## Project Layout

- /engine : pure TypeScript game logic, no IO
- /server : NestJS WebSocket gateway + Redis
- /web : Vite + React front-end
- /infra : render.yaml, docker, terraform (no secrets)

## Coding Conventions

- TypeScript strict mode everywhere (`"strict": true`)
- Prefer functional, immutable data in /engine
- Lint: ESLint + Prettier; run `pnpm lint --fix` before every commit
- Format with Prettier default rules (80-col)

## AI-Generated Code Rules

1. Follow the open issues’ acceptance criteria exactly.
2. Never hard-code connection strings or credentials.
3. For new deps, update the correct package.json workspace.
4. All PRs must include unit tests for core logic.

## Branch / PR Workflow

- Create a branch `feat/<ticket-id>` (e.g. `feat/1-3-state-machine`)
- Open a PR that auto-closes the GitHub issue (`Fixes #1-3`)
- Pass CI (`pnpm lint && pnpm test`) before merge.

## License

- All AI-generated code inherits MIT license (see LICENSE file).

_End of agent instructions._
