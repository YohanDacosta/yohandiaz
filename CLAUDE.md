# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` - Start development server at localhost:4321
- `npm run build` - Build production site to `./dist/`
- `npm run preview` - Preview production build locally
- `npm run astro` - Run Astro CLI commands (e.g., `npm run astro add`, `npm run astro check`)

## Architecture

This is an Astro 6.x project using the "basics" starter template.

**Key directories:**
- `src/pages/` - File-based routing (`.astro` files become routes)
- `src/layouts/` - Reusable page layouts
- `src/components/` - Astro components
- `src/assets/` - Images and assets processed by Astro
- `public/` - Static assets served as-is

**Astro component structure:**
- Frontmatter (between `---` fences) runs at build time on the server
- Template below frontmatter renders HTML
- `<style>` tags are scoped to the component by default

**Configuration:**
- `astro.config.mjs` - Astro configuration
- `tsconfig.json` - Extends `astro/tsconfigs/strict`
- Requires Node.js >= 22.12.0
