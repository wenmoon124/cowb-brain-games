# BrainVerse — Brain Operating System

The world's best browser-based brain health platform combining cognitive training, brain relaxation, brain age assessment, and educational content.

**Domain:** [cowb.cc](https://cowb.cc)

## Quick Start

### Prerequisites

- **Node.js** `>= 20`
- **pnpm** `>= 9`

### Install & Run

```bash
pnpm install
pnpm dev
```

This will concurrently start the Next.js frontend (`apps/web`) and the Cloudflare Workers API (`workers/api`) in development mode.

## Project Structure

This is a pnpm workspace monorepo:

```
brainverse/
├── apps/
│   └── web/                  # Next.js frontend
├── workers/
│   └── api/                  # Cloudflare Workers API
└── packages/
    ├── shared/               # Shared types & utilities
    ├── core/                 # Core domain logic
    ├── brain-engine/         # Cognitive training engine
    ├── game-engine/          # Game framework & mechanics
    ├── growth-engine/        # Progression & analytics
    ├── content-engine/       # Educational content engine
    └── ui/                   # Shared UI component library
```

## Tech Stack

- **Frontend:** Next.js, TypeScript, TailwindCSS, Shadcn UI
- **Backend:** Cloudflare Workers
- **Storage:** Cloudflare D1 (SQL), KV (key-value), R2 (objects)
- **Observability:** Cloudflare Analytics
- **Security:** Cloudflare Turnstile

## Development Commands

| Command            | Description                                                  |
| ------------------ | ------------------------------------------------------------ |
| `pnpm dev`         | Start web and API dev servers concurrently                  |
| `pnpm build`       | Build all packages and apps recursively                     |
| `pnpm test`        | Run tests across all packages recursively                   |
| `pnpm typecheck`   | Run TypeScript type checking across the workspace           |
| `pnpm lint`        | Lint all packages recursively                               |
| `pnpm format`      | Format the codebase with Prettier                           |
| `pnpm db:migrate`  | Run D1 database migrations (via `@brainverse/api`)          |

## Deployment

See [`docs/deployment.md`](docs/deployment.md) for detailed deployment instructions covering both the web frontend and the API worker.

## Links

- [PROJECT.md](PROJECT.md)
- [AGENTS.md](AGENTS.md)
- [context/](context/)
- [specs/](specs/)
- [docs/](docs/)
