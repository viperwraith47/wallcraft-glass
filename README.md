# WLLPR — Glass Wallpaper Generator

A fully client-side wallpaper generator that runs entirely in the browser — no backend round-trips required for the core experience. Choose from **29 palettes** and **32 patterns** to create beautiful desktop and mobile wallpapers, then export them as high-resolution PNGs.


## Features

- **29 curated color palettes** — from Aurora and Cyberpunk to Pastel Dream and Volcanic
- **32 unique patterns** — aurora fields, Bauhaus geometry, concentric rings, waves, hexagons, crystals, crosshatch, and more
- **Dual preview** — see your wallpaper on a desktop monitor and phone mockup side by side
- **Export as PNG** — download at 1920×1080 (desktop) or 1170×2532 (iPhone 14 Pro Max)
- **Randomize** — one-click random palette + pattern combination
- **Glassmorphism UI** — frosted glass panels, bezels, and interactive hover effects
- **Fully responsive** — works on mobile and desktop
- **Dark mode** — native dark/light theme support

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Build & Dev | Vite 7, Bun, TypeScript 5.9 |
| UI | React 19, React Router v7, Tailwind v4, Shadcn UI (new-york) |
| Animations | Framer Motion |
| Icons | Lucide React |
| 3D (optional) | Three.js |
| Backend (optional) | Convex + Convex Auth (email OTP, anonymous) |
| Lint & Format | ESLint 9, Prettier 3 |
| Self-Hosting | Deno + Hono (`main.ts`) |

---

## Quick Start

### Prerequisites

- [Bun](https://bun.sh/) (package manager)
- [Deno](https://deno.land/) (for production server, optional)
- [Node.js](https://nodejs.org/) ≥ 18

### Install & Run

```bash
# Install dependencies
bun install

# Start dev server (Vite on port 3000 + Deno prod server on port 8000)
bun start

# Stop all servers
bun stop
```

Or use the macOS double-clickable scripts:

```bash
./start.command    # Start dev + prod servers
./stop.command     # Stop all servers
```

### Other Commands

```bash
bun run dev        # Vite dev server only (port 3000)
bun run build      # Type-check + production build → dist/
bun run preview    # Serve built dist/ locally
bun run lint       # ESLint
bun run format     # Prettier --write
```

### Production Server

The built output can be served with Deno + Hono:

```bash
bun run build
deno run -A main.ts
```

This serves the `dist/` directory as a static SPA on **http://localhost:8000**.

---

## Project Structure

```
.
├── main.ts                    # Deno + Hono static server
├── index.html                 # Vite HTML entry
├── src/
│   ├── main.tsx               # React root, router setup
│   ├── index.css              # Tailwind v4 theme (oklch color tokens)
│   ├── pages/
│   │   ├── WallpaperGenerator.tsx   # Main wallpaper generator page
│   │   ├── Landing.tsx             # Landing page
│   │   ├── Auth.tsx                # Authentication page
│   │   └── NotFound.tsx            # 404 page
│   ├── components/
│   │   └── ui/                # Shadcn UI primitives
│   ├── hooks/
│   │   ├── use-auth.ts        # Convex auth hook
│   │   └── use-mobile.ts      # Mobile detection hook
│   ├── lib/
│   │   ├── palettes.ts        # 30 curated color palettes
│   │   ├── patterns.tsx        # 32 SVG pattern renderers
│   │   ├── export.ts           # PNG export via @zumer/snapdom
│   │   ├── utils.ts            # Utility functions
│   │   └── vly-integrations.ts # VLY integration layer
│   └── convex/                 # Convex backend (auth, users, schema)
├── isolate/                    # Standalone PWA bundle
├── start.command               # macOS start script
└── stop.command                # macOS stop script
```

---

## Palettes (29)

| Palette | Primary | Secondary | Accent | Background |
|---------|---------|-----------|--------|------------|
| Aurora | `#FF6BA8` | `#7B5FFF` | `#3FE0E0` | `#0A0A1F` |
| Ocean | `#1E7AFF` | `#00C9C9` | `#A8F0FF` | `#04111F` |
| Sunset | `#FF6A3D` | `#FFB347` | `#FFE8B0` | `#1A0930` |
| Forest | `#2BB96E` | `#7CE0A0` | `#E8FFCE` | `#08241B` |
| Sakura | `#FF92C2` | `#FFC4D8` | `#5A1F45` | `#1B0518` |
| Cosmic | `#5B4FFF` | `#9D4FFF` | `#E0BFFF` | `#08051A` |
| Mono Light | `#1A1A1A` | `#3A3A3A` | `#8A8A8A` | `#F2EFE6` |
| Mono Dark | `#F2F2F2` | `#BFBFBF` | `#666666` | `#0A0A0A` |
| Earth | `#C97B4A` | `#E8C18A` | `#3A4A2E` | `#1B130A` |
| Citrus | `#FFD23F` | `#9FE870` | `#FF7A59` | `#0F1A04` |
| Lavender Mist | `#A48BE3` | `#DCC8F7` | `#F7E8A0` | `#F9F6F2` |
| Midnight | `#3B82F6` | `#1E40AF` | `#93C5FD` | `#050816` |
| Coral Reef | `#FF7E5F` | `#FEB47B` | `#FFD56F` | `#1A0E2E` |
| Mint | `#4ADE80` | `#A7F3D0` | `#FBCFE8` | `#042F1A` |
| Ember | `#EF4444` | `#F97316` | `#FCD34D` | `#1A0808` |
| Electric | `#D946EF` | `#06B6D4` | `#FDF4FF` | `#08001A` |
| Olive Grove | `#84CC16` | `#A16207` | `#D4D4A8` | `#1A1F08` |
| Storm | `#64748B` | `#94A3B8` | `#CBD5E1` | `#0F172A` |
| Rose Gold | `#F472B6` | `#FCD34D` | `#FBCFE8` | `#1B0F1A` |
| Ice | `#7DD3FC` | `#E0F2FE` | `#FFFFFF` | `#0F172A` |
| Cyberpunk | `#FF2D7B` | `#00F0FF` | `#FACC15` | `#0A0014` |
| Tropical | `#FF6B35` | `#00C49A` | `#FFD166` | `#0B1A12` |
| Rose Quartz | `#D4618C` | `#C9B1D0` | `#F5E6F0` | `#1A0F15` |
| Nebula | `#8B5CF6` | `#3B82F6` | `#F472B6` | `#0C0520` |
| Desert | `#D4A574` | `#E8C9A0` | `#C2724D` | `#1A120A` |
| Frost | `#A5B4FC` | `#C7D2FE` | `#E0E7FF` | `#0F172A` |
| Volcanic | `#DC2626` | `#F97316` | `#FBBF24` | `#1C0800` |
| Pastel Dream | `#F9A8D4` | `#A5F3FC` | `#FDE68A` | `#1E1B2E` |
| Slate | `#64748B` | `#94A3B8` | `#E2E8F0` | `#0F172A` |

---

## Patterns (32)

| Pattern | Description |
|---------|-------------|
| Aurora | Soft color fields |
| Bauhaus | Geometric primitives |
| Concentric | Layered rings |
| Waves | Layered sine curves |
| Bricks | Offset rectangle mosaic |
| Dots | Focal dot grid |
| Stripes | Wide diagonal stripes |
| Orbs | Floating spheres |
| Particles | Deterministic dots |
| Mesh | Blurred color mesh |
| Lattice | Crosshatched lines |
| Horizon | Sun arc |
| Spiral | Logarithmic spiral |
| Blob | Macro organic form |
| Triangles | Tessellated triangles |
| Chevron | Repeating V |
| Halftone | Print-style dot gradient |
| Mosaic | Irregular tile fragments |
| Plasma | Wave interference |
| Ribbons | Flowing Bezier bands |
| Trellis | Diamond lattice |
| Stipple | Radial dot scatter |
| Topographic | Wavy contour rings |
| Pixel | Chunky pixel blocks |
| Diamond | Rotated square grid |
| Hexagon | Honeycomb grid |
| Zigzag | Sharp zigzag lines |
| Crystals | Angular gem shards |
| Burst | Radial ray burst |
| Crosshatch | Diagonal line weave |
| Cascade | Waterfall drops |
| Topaz | Faceted gem cuts |

---

## Architecture

The wallpaper generator is **entirely client-side** — patterns are rendered as SVG strings in the browser, and PNG export uses `@zumer/snapdom` to capture the DOM. No API calls are needed for the core experience.

### Adding a Palette

Palettes are defined in `src/lib/palettes.ts`. Each palette has `primary`, `secondary`, `accent`, and `background` colors:

```ts
{
  id: "my-palette",
  name: "My Palette",
  primary: "#FF0000",
  secondary: "#00FF00",
  accent: "#0000FF",
  background: "#000000",
}
```

### Adding a Pattern

Patterns are defined in `src/lib/patterns.tsx`. Each pattern has a `renderSvg(w, h, palette)` function that returns SVG markup:

```ts
{
  id: "my-pattern",
  name: "My Pattern",
  description: "Description text",
  renderSvg: (w, h, p) => {
    return `<svg>...</svg>`;
  },
}
```

---

## Convex Setup (Optional)

The auth scaffolding uses Convex with email OTP and anonymous users. Environment variables:

| Variable | Where |
|----------|-------|
| `VITE_CONVEX_URL` | Client |
| `CONVEX_DEPLOYMENT` | Server |
| `JWKS` | Convex backend |
| `JWT_PRIVATE_KEY` | Convex backend |
| `SITE_URL` | Convex backend |

**Do not modify** `src/convex/auth.config.ts`, `src/convex/auth.ts`, or `src/convex/auth/emailOtp.ts`.

---

## License

No License!
