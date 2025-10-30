# CLAUDE.md - Lorenzo Saini Portfolio

## 🚨 CRITICAL: Context7 MCP First

**YOU MUST use Context7 MCP for EVERY coding request before implementation:**

**When to use Context7 (ALWAYS):**
- ✅ Before implementing ANY feature, component, or fix
- ✅ When working with ANY library (Next.js, GSAP, Tailwind, next-intl, etc.)
- ✅ When debugging or troubleshooting issues
- ✅ When considering new dependencies
- ✅ For modern best practices (October 2025)

**How to use:**
1. `mcp__context7__resolve-library-id` - Find the library (e.g., "next.js", "gsap")
2. `mcp__context7__get-library-docs` - Get latest docs, patterns, examples
3. Apply modern best practices from Context7 results

**Examples:**
- "Before adding GSAP animation, check Context7 for React 19 patterns..."
- "Query Context7 for Next.js 16 App Router best practices..."
- "Get latest Tailwind CSS 4 utilities from Context7..."
- "Verify next-intl API in Context7 before modifying i18n..."

**Available Skills & Agents:**
- Always check which specialized skills (gsap-nextjs, gsap-react, nextjs-fullstack) are available
- Use relevant agents when appropriate for the task

---

## Project Overview

Portfolio website for creative work (photography, video, art) with multi-language support and sophisticated GSAP animations.

## Tech Stack

- Next.js 16 (App Router) + React 19 + TypeScript (strict mode)
- Tailwind CSS 4 with custom fluid design tokens
- GSAP + Lenis smooth scrolling
- next-intl (Italian primary, English secondary)
- Vitest + Playwright + Storybook

## Commands

```bash
# Development
npm run dev              # Dev server + Spotlight (default port 3000)
npm run dev:next         # Next.js only (no Spotlight)

# Build & Test
npm run build            # Production build
npm run test             # Vitest unit tests
npm run test:e2e         # Playwright E2E (first run: npx playwright install)
npm run storybook        # Storybook on :6006

# Code Quality
npm run lint:fix         # Auto-fix linting
npm run check:types      # TypeScript check
npm run check:deps       # Find unused deps (knip)
npm run check:i18n       # Validate translations (IMPORTANT: run before commits)

# Utilities
npm run build-stats      # Bundle analyzer
npm run commit           # Conventional commits CLI
```

## File Structure

```
src/
├── app/[locale]/          # All pages (home, aboutme, portfolio, blog, contact)
│   └── layout.tsx         # Root layout + metadata
├── components/
│   ├── ui/                # GSAP-animated components
│   │   ├── NavBar.tsx     # Circular morphing animations (reference for GSAP patterns)
│   │   ├── LoadingScreen.tsx + CameraIris.tsx  # Cinematic iris transition
│   │   ├── focus/         # Focus components
│   │   └── GSAPScrollReveal.tsx
│   └── seo/               # JSON-LD structured data
├── libs/                  # I18n.ts, I18nRouting.ts, I18nNavigation.ts
├── locales/               # en.json, it.json (keep in sync!)
├── styles/global.css      # Design tokens + custom fonts
└── utils/AppConfig.ts     # Centralized config (locales, URLs)
```

## Styling Rules

**Custom Fonts** (in `/public/assets/fonts/`):
- Lavener (primary), Will (secondary), Effloresce It (decorative)

**Fluid Design Tokens** (defined in `global.css`):
- Typography: `--text-sm` to `--text-4xl`
- Spacing: `--space-1` to `--space-16`
- iOS safe areas: `.safe-top`, `.safe-bottom`, `.safe-left`, `.safe-right`
- IMPORTANT: `.poster` class disables fluid tokens for fixed-size content

**CSS Approach**:
- Use Tailwind utilities first
- Mobile-first breakpoints: base (mobile) → `768px` (tablet) → `1024px` (desktop)
- Avoid hardcoded pixels - use CSS variables
- Test iOS Safari carefully - horizontal overflow is specifically fixed

## GSAP Animations (React 19 Compatible)

**CRITICAL RULES:**
- ALWAYS use `useGSAP` hook from `@gsap/react` - NEVER raw `useEffect`
- Import: `import { useGSAP } from '@gsap/react'`
- Store timelines in refs: `useRef<gsap.core.Timeline[]>()`
- Use `gsap.context()` for scoped queries
- Cleanup is automatic via useGSAP hook

**Pattern Example:**
```tsx
const tlRef = useRef<gsap.core.Timeline>();
useGSAP(() => {
  tlRef.current = gsap.timeline({ /* config */ });
  // animations...
}, { dependencies: [...] });
```

**Animation Performance:**
- Animate `transform` and `opacity` only (GPU accelerated)
- Avoid `width`, `height`, `top`, `left`
- Test on mobile devices
- See `NavBar.tsx` for complex animation reference

## i18n (next-intl)

**Configuration:**
- Primary locale: Italian (`it`)
- Secondary: English (`en`)
- URL format: ALWAYS includes locale prefix (e.g., `/it/portfolio`, `/en/portfolio`)
- Files: `src/locales/en.json` + `src/locales/it.json`

**IMPORTANT Workflow:**
1. Add keys to BOTH `en.json` AND `it.json` simultaneously
2. Use `const t = useTranslations('namespace')` in components
3. Run `npm run check:i18n` BEFORE every commit
4. Navigation components auto-strip locale for path comparison

## Testing

- **Unit Tests**: `*.test.ts[x]` alongside source, run `npm run test` (Vitest + V8 coverage)
- **E2E Tests**: `tests/e2e/*.e2e.ts`, run `npm run test:e2e` (Playwright - install first)
- **Storybook**: `npm run storybook` on port 6006 for isolated component dev

## Next.js Config

- React Compiler v1.0 ENABLED - no manual `useMemo`/`useCallback` needed
- Production: removes console logs, optimizes images (WebP/AVIF)
- GSAP imports optimized via `experimental.optimizePackageImports`
- Bundle analyzer: `npm run build-stats`
- Env: `NEXT_PUBLIC_SITE_URL` for production

## Code Standards

**TypeScript:**
- Strict mode enabled
- Interfaces for all component props
- Run `npm run check:types` before commits

**Commits:**
- Conventional Commits required - use `npm run commit` for CLI helper
- Run `npm run check:i18n` before every commit

**Component Dev:**
- Test in Storybook before integration
- Follow GSAP patterns from `NavBar.tsx`
- Use fluid design tokens, not hardcoded pixels
- iOS Safari testing is critical

## Quick Workflows

**⚠️ FIRST STEP for ALL workflows: Query Context7 for latest best practices!**

**Add New Page:**
1. **Check Context7** for Next.js 16 page patterns first
2. Create `src/app/[locale]/your-page/page.tsx`
3. Add translations to `en.json` + `it.json`
4. Add link to NavBar items
5. Test `/it/your-page` and `/en/your-page`

**Add GSAP Animation:**
1. **Check Context7** for GSAP + React 19 latest patterns first
2. Apply modern pattern:
```tsx
import { useGSAP } from '@gsap/react';
const tlRef = useRef<gsap.core.Timeline>();
useGSAP(() => {
  tlRef.current = gsap.timeline();
  // your animations
}, { dependencies: [] });
```

**Add Translation:**
1. **Check Context7** for next-intl latest API first
2. Add to `locales/en.json` + `locales/it.json`
3. Use: `const t = useTranslations('namespace')` → `{t('key')}`
4. Validate: `npm run check:i18n`

## Key Files

- `next.config.ts` - Next.js config (i18n, bundle analyzer)
- `src/utils/AppConfig.ts` - Locales + URLs config
- `src/styles/global.css` - Design tokens, fonts, iOS fixes
- `src/components/ui/NavBar.tsx` - GSAP animation reference
