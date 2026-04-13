# designviewer

A browser for [DESIGN.md](https://getdesign.md/what-is-design-md) design systems. Browse, search, and preview design tokens and components from brands that publish a `DESIGN.md` file.

## Features

- Browse all brands from [getdesign.md](https://getdesign.md)
- Filter by category (AI Tools, Developer Tools, SaaS, etc.)
- Full-text search across name, description, and category
- Preview rendered design systems with light/dark theme toggle
- View raw DESIGN.md content with full markdown rendering (tables, GFM)
- Fully static — no server required

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) >= 18
- [pnpm](https://pnpm.io/)

### Setup

```bash
# Install dependencies
pnpm install

# Sync brand data from getdesign.md
pnpm sync

# Start development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
pnpm build
```

Produces a static site in `out/` that can be deployed to any static hosting provider.

## Data Sync

Brand data is fetched from [getdesign.md](https://getdesign.md) and the [awesome-design-md](https://github.com/VoltAgent/awesome-design-md) repository.

```bash
# Incremental sync (only fetches new/changed brands)
pnpm sync

# Full re-fetch
pnpm sync --force
```

This generates:
- `data/brands.json` — brand metadata (name, category, stats)
- `data/brands/{slug}/DESIGN.md` — raw markdown (via `getdesign` CLI)
- `data/brands/{slug}/preview.html` — light theme preview
- `data/brands/{slug}/preview-dark.html` — dark theme preview

## Tech Stack

- [Next.js](https://nextjs.org/) 16 (static export)
- [React](https://react.dev/) 19
- [Tailwind CSS](https://tailwindcss.com/) v4
- [TypeScript](https://www.typescriptlang.org/)

## License

MIT
