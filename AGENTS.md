<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Design Viewer — Agent Guide

## Project Overview

A static Next.js site that aggregates and displays DESIGN.md design systems from [getdesign.md](https://getdesign.md). Users can browse brands, filter by category, search, and view design previews with light/dark theme support.

## Tech Stack

- **Framework**: Next.js 16 with static export (`output: "export"`)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS v4 (via `@tailwindcss/postcss`)
- **Package Manager**: pnpm
- **Font**: Geist Mono (loaded via `next/font/google`)

## Project Structure

```
src/
  app/
    layout.tsx          # Root layout with header
    page.tsx            # Home — brand index
    [brand]/page.tsx    # Brand detail (statically generated)
  components/
    BrandIndex.tsx      # Client-side search + category filter
    BrandTable.tsx      # Brand list table
    BrandRow.tsx        # Individual brand row
    BrandAvatar.tsx     # Brand avatar (img or inline SVG)
    BrandHeader.tsx     # Brand header (avatar, title, description)
    BrandDetail.tsx     # Preview/design tab view
    ControlBar.tsx      # Tab + theme toggle controls
    PreviewFrame.tsx    # iframe for preview HTML
    DesignContent.tsx   # Rendered DESIGN.md markdown (react-markdown + remark-gfm)
    SearchBar.tsx       # Search input
    CategorySidebar.tsx # Category filter sidebar
  lib/
    brands.ts           # Data access (reads from data/)
scripts/
  sync.mjs              # Fetches brand data from getdesign.md
data/
  brands.json           # Brand metadata (auto-generated)
  brands/{slug}/        # Per-brand files (auto-generated)
    DESIGN.md           # Raw markdown (via getdesign CLI)
    preview.html
    preview-dark.html
```

## Key Commands

```bash
pnpm dev          # Start dev server
pnpm build        # Static export to out/
pnpm lint         # ESLint
pnpm sync         # Sync brand data from getdesign.md
pnpm sync --force # Re-fetch all brands (ignore cache)
```

## Architecture Notes

- **Static generation**: All brand pages are pre-rendered via `generateStaticParams()`. No server-side runtime.
- **Data flow**: `scripts/sync.mjs` scrapes getdesign.md homepage + awesome-design-md README -> writes `data/brands.json` + per-brand files (preview HTML + DESIGN.md via `getdesign` CLI) -> Next.js reads at build time via `src/lib/brands.ts`.
- **Incremental sync**: Uses content hashing (`_hash` field) to skip unchanged brands.
- **Client components**: `BrandIndex` and `BrandDetail` are client components for interactive search/filter and tab switching.
- **Preview rendering**: Brand previews are rendered in iframes via `srcdoc` to isolate styles.

## Conventions

- Use `@/` path alias for imports from `src/`.
- Dark background theme (`#0a0a0a` bg, `#ededed` text).
- Monospace font via `var(--font-mono)` CSS variable.
- All content in English.
