# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Documentation site for [MEV-Boost](https://github.com/flashbots/mev-boost), the open-source middleware for Ethereum validators to access a competitive block-building market via proposer-builder separation (PBS). The live site is at https://mev-boost.org.

## Tech Stack

- **Docusaurus 3.9** (with v4 future flag enabled) — static site generator
- **React 19** with MDX for documentation pages
- **Mermaid** diagrams via `@docusaurus/theme-mermaid`
- **Client-side search** via `@easyops-cn/docusaurus-search-local`
- Requires **Node.js >= 20**

## Commands

- `npm install` — install dependencies
- `npm start` — start local dev server with hot reload
- `npm run build` — build static site to `build/`
- `npm run serve` — serve the production build locally
- `npm run clear` — clear Docusaurus cache (`.docusaurus/`)

## Architecture

### Routing

Docs are served from the root (`/`) instead of `/docs/` — configured via `routeBasePath: '/'` in `docusaurus.config.js`. The blog is disabled.

### Content Structure

- `docs/` — all documentation pages as Markdown/MDX files. The landing page is `docs/index.mdx`.
- `sidebars.js` — manually defined sidebar with categories: Getting Started, Configuration, Help, Ecosystem, Reference.
- `docusaurus.config.js` — site config including navbar, footer, themes, Prism languages (`bash`, `ini`, `yaml`, `json`), and mermaid settings.

### Customization

- `src/css/custom.css` — custom theme styles (Flashbots branding, dark mode)
- `src/components/Hero/` — custom hero component used on the landing page
- `src/pages/` — custom pages (currently empty)
- `static/img/` — images and favicon

### Key Config Details

- `onBrokenLinks: 'throw'` — the build will fail on any broken internal links
- `editUrl` points to `https://github.com/flashbots/mev-boost.org/tree/main/` for "Edit this page" links
- Deployment targets GitHub Pages under the `flashbots` org
