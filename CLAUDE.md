# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**WLLPR** (wallcraft-glass) is a fully client-side wallpaper generator that runs in the browser — no backend round-trips are required for the core experience. The project is built on a Vite + React 19 + TypeScript stack with Convex available for auth and persistence, and ships a Deno + Hono static server (`main.ts`) for self-hosting the built `dist/` output.

Live demo: https://wallcraft.freebuff.app/

## Tech Stack

- **Build/dev**: Vite 7, Bun (package manager), TypeScript 5.9
- **UI**: React 19, React Router v7, Tailwind v4, Shadcn UI (new-york style, lucide icons), Framer Motion, Three.js
- **Backend (optional)**: Convex + Convex Auth (email OTP, anonymous)
- **Lint/format**: ESLint 9, Prettier 3
- **Self-hosting**: Deno + Hono (`main.ts`)
- **Integration layer**: `@vly-ai/integrations` (gated by `VLY_INTEGRATION_KEY`, see `integrations.md`)

## Common Commands

All commands use **Bun** as the package manager.

```bash
bun install              # install dependencies
bun run dev              # start Vite dev server (frontend only)
bun run build            # type-check with tsc, then build with vite → dist/
bun run preview          # serve the built dist/ locally
bun run lint             # eslint .
bun run format           # prettier --write .
```

`main.ts` is a Deno Hono server that serves the built `dist/` directory as a static SPA. Run it with Deno separately (it is not part of the npm scripts).

## Architecture

```
.
├── main.ts                  # Deno Hono static server (self-host entrypoint)
├── index.html               # Vite HTML entry
├── src/
│   ├── main.tsx             # React root, router setup, instrumentation
│   ├── instrumentation.tsx  # Global instrumentation provider (wraps app)
│   ├── index.css            # Tailwind v4 + oklch color tokens (theme source of truth)
│   ├── pages/               # Route components (Landing, WallpaperGenerator, Auth, NotFound)
│   ├── components/          # App-level components + ui/ (shadcn primitives)
│   ├── hooks/               # use-auth, use-mobile
│   ├── lib/                 # utils, palettes, patterns, export, vly-integrations
│   ├── convex/              # Convex backend (schema, auth, users, http)
│   └── types/               # global type declarations
└── isolate/                 # Standalone PWA isolate (assets, manifest, logo)
```

### Key Architectural Notes

- **Client-side first**: the wallpaper generator (`src/pages/WallpaperGenerator.tsx`) and pattern library (`src/lib/patterns.tsx`) run entirely in the browser. There is no API call to render or export wallpapers.
- **Export pipeline**: `src/lib/export.ts` wraps `@zumer/snapdom` to capture generated DOM nodes as PNG. The export surface is the canvas/DOM node, not a backend render.
- **Patterns & palettes**: `src/lib/patterns.tsx` (~27KB) and `src/lib/palettes.ts` are the data layer of the generator — new patterns/palettes are added by extending these files.
- **Router**: React Router v7 (note: `react-router`, **not** `react-router-dom`). Route components are lazy-loaded in `src/main.tsx`. Add new routes by importing the page in `src/main.tsx` and registering the `<Route>`.
- **Convex auth**: the auth scaffolding (`src/convex/auth/`, `src/convex/auth.ts`, `src/convex/auth.config.ts`, `src/convex/users.ts`, `src/convex/schema.ts`) is provided by the VLY template. Email OTP config is in `src/convex/auth/emailOtp.ts`. Use the `useAuth` hook from `src/hooks/use-auth.ts` on the frontend and `getCurrentUser` from `src/convex/users.ts` on the backend. **Do not modify** the auth.config.ts, auth.ts, or emailOtp.ts files.
- **Path alias**: `@/` resolves to `src/` (set in both `vite.config.ts` and `tsconfig.app.json`). Convex imports use `@/convex/...` paths including generated files like `@/convex/_generated/server` and `@/convex/_generated/api`.
- **Instrumentation**: `src/instrumentation.tsx` wraps the app in `InstrumentationProvider`. The `RouteSyncer` inside `main.tsx` posts `iframe-route-change` messages to `window.parent`, indicating the app is designed to run inside an iframe wrapper (likely the VLY host).
- **Theming**: Tailwind v4 oklch CSS variables in `src/index.css` are the single source of truth for colors. Switch theme by toggling the `dark`/`light` class on a parent. Avoid hardcoded colors — use the CSS variable tokens.
- **Chunk splitting**: vite.config.ts manually chunks vendor code (`react-vendor`, `convex-vendor`, `radix-ui`, `framer-motion`, `charts`, `forms`). When adding a large dep, decide whether to add it to a manual chunk or let it bundle.

## Frontend Conventions

From the project README — these are enforced:

- **Pages** go under `src/pages/`, **components** under `src/components/`. Shadcn primitives in `src/components/ui/` are the default for UI building blocks.
- Always mobile-responsive, light + dark mode compatible.
- **No nested cards, no shadows** — use a thin border instead.
- **No skeletons** — use the `loader2` spinner for loading states.
- Add `cursor-pointer` to clickable elements (not default in shadcn).
- Use `tracking-tight font-bold` for title text.
- Wrap pages in a container to keep them centered on wide screens.
- **Dashboard pages** (protected) need a sidebar; **landing pages** need a navbar. The logo on either bar should be clickable and link to `/`.
- **Animate with Framer Motion** — import `motion` and wrap animated components. Apply to landing pages, app pages, buttons, list rendering, fades/slides.
- **Landing page style**: should fit a theme (neo-brutalist, retro, neumorphism, glass morphism, etc.), with a "Get Started" CTA that switches to "Dashboard" or "Profile" for authenticated users.
- **Toasts**: use `sonner` (`import { toast } from "sonner"`). The `<Toaster />` is mounted in `src/main.tsx`.
- **Dialogs** must be scrollable so content isn't cut off. Prefer a Dialog over a new page when possible.

## Convex Conventions

- **Schema** lives in `src/convex/schema.ts`. `_id` and `_creationTime` are added automatically — do not include them in queries or index `_creationTime` (it is already indexed).
- **`schemaValidation: false`** in the schema definition.
- **"use node" actions** are required for anything calling out to the network (e.g., `vly` integrations, AI, email, payments — see `integrations.md`). `use node` files cannot contain queries/mutations; call out to internal queries/mutations defined in other files.
- **`crud` helper**: use `convex-helpers/server/crud` for standard create/read/update/destroy on a table, then expose the generated functions for use from actions.
- **Types**: document IDs are `Id<"TableName">` (not `string`); full documents are `Doc<"TableName">`. Always handle null/undefined for query results.
- **No return type validators** on Convex functions.
- **Environment**: `VITE_CONVEX_URL` and `CONVEX_DEPLOYMENT` are project-specific. Server-side env (e.g., `JWKS`, `JWT_PRIVATE_KEY`, `SITE_URL`) is only accessible to the Convex backend.

## VLY Integrations

`@vly-ai/integrations` is configured via `vlyPlugin()` in `vite.config.ts` and exposes AI, email, and payment helpers behind `src/lib/vly-integrations.ts`. The integration key is `VLY_INTEGRATION_KEY` (auto-injected at deploy time). Use these only inside Convex actions with `"use node"`. See `integrations.md` for the full API surface and error-handling pattern.

## Self-Hosting

`main.ts` is a small Deno + Hono server that serves the Vite `dist/` build (with SPA fallback to `index.html`). To self-host:

```bash
bun run build
deno run -A main.ts
```

The `isolate/` directory contains a separate PWA-style bundle (assets, manifest, logo.svg) — this appears to be a self-contained embed of the generator.

## Linting / Formatting

- ESLint config: `eslint.config.js` (flat config). Ignores `dist/`. Includes `@eslint/js` recommended, `typescript-eslint` recommended, `eslint-plugin-react-hooks`, `eslint-plugin-react-refresh`, and `eslint-config-prettier`.
- Prettier: empty config (`{}`) — uses defaults. Run `bun run format` before committing.
