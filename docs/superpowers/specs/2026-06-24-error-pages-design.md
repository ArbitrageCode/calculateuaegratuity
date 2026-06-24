# Error Pages Design

**Date:** 2026-06-24
**Scope:** Add a custom 404 page to calculateuaegratuity.com (Astro SSG)

## Overview

Create `src/pages/404.astro` — a single branded 404 page. No new components. No server-side changes.

## File

`src/pages/404.astro` — Astro's built-in convention: the framework automatically serves this file for any unmatched route when deployed to static hosts (Netlify, Vercel, etc.).

## Structure

Wraps `Layout.astro` directly, matching the pattern used by `/about`, `/faq`, and other content pages.

## Content

- **Eyebrow:** `404` — `font-mono text-mute uppercase tracking-widest` (matches page-label pattern site-wide)
- **Headline:** "Page not found." — `text-[32px] sm:text-[40px] font-semibold leading-[1.1] tracking-[-1.5px] text-ink`
- **Body:** "The page you're looking for doesn't exist or has been moved." — `text-[18px] text-body leading-[1.6]`
- **CTA:** "Go to Calculator →" link to `/` — inline-styled as a primary pill button (`bg-ink text-on-primary`)

## SEO

- Title: `"404 — Page Not Found | UAE Gratuity Calculator"`
- Description: `"This page doesn't exist. Return to the UAE Gratuity Calculator."`
- `noindex` via `<meta name="robots" content="noindex">` injected through Layout's `<slot name="head" />`

## Constraints

- No new components or abstractions
- Reuses all existing design tokens from `global.css`
- Dark mode works automatically via `Layout.astro`
- UAE flag stripe and nav/footer included via layout
