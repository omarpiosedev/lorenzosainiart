# CLAUDE.md - Lorenzo Saini Portfolio

## 🚨 CRITICAL: Context7 MCP First
**Always analyze mi project, how i use GSAP, the GSAP plugin
**Always use context7 (minimun 15000 token) when I need code generation, setup or configuration steps, or
library/API documentation. This means you should automatically use the Context7 MCP
tools to resolve library id and get library docs without me having to explicitly ask.

**Examples:**
- "Before adding GSAP animation, check Context7 for React 19 patterns..."
- "Query Context7 for Next.js 16 App Router best practices..."
- "Get latest Tailwind CSS 4 utilities from Context7..."
- "Verify next-intl API in Context7 before modifying i18n..."

**Available Skills & Agents:**
- Always check which specialized skills (gsap-nextjs, gsap-react, nextjs-fullstack) are available
- Use relevant agents when appropriate for the task

---

## 🖼️ CRITICAL: Layout Cloning from Images

**When receiving an image with a request to clone/recreate the layout:**

**YOU MUST perform deep visual analysis:**
- ✅ Analyze exact positions and spacing between all elements
- ✅ Measure proportions and size relationships (widths, heights, aspect ratios)
- ✅ Identify ALL visual elements (text, images, icons, shapes, colors, shadows, borders)
- ✅ Study layout structure (grid, flexbox, absolute positioning, z-index layers)
- ✅ Note typography details (font sizes, weights, line heights, letter spacing)
- ✅ Identify color palette and opacity values
- ✅ Recreate the layout 1:1 pixel-perfect where requested

**DO NOT:**
- ❌ Provide generic layout suggestions instead of exact recreation
- ❌ Approximate positions or sizes ("about here", "roughly this size")
- ❌ Skip details or elements from the image
- ❌ Make assumptions about unspecified visual aspects
- ❌ Use placeholder content when exact content is visible

**Workflow:**
1. **Deep Analysis**: Thoroughly analyze the image (positions, sizes, proportions, elements, spacing, colors)
2. **Element Inventory**: List all identified elements with their exact properties
3. **1:1 Implementation**: Create the exact layout using project's tech stack (Tailwind, GSAP, fluid tokens)

---

## 🎯 MANDATORY WORKFLOW: Plan → Code → Review

**YOU MUST follow this workflow for EVERY task:**

### Phase 1: PLANNING (Investigate First - Zero Hallucinations)
**Command**: *"Create implementation plan. DO NOT write code yet."*
- ✅ Read relevant files BEFORE answering questions
- ✅ Verify claims by examining actual code
- ✅ List ALL files that will be modified
- ✅ Identify edge cases and potential issues
- ✅ Create step-by-step implementation checklist
- ❌ NEVER make claims about code without verification

### Phase 2: IMPLEMENTATION (Complete Code Only)
- ✅ Production-ready implementations
- ✅ Comprehensive error handling
- ✅ Security validation embedded
- ❌ ZERO placeholders or TODO comments
- ❌ ZERO mock implementations
- ❌ ZERO incomplete code

### Phase 3: QUALITY REVIEW (Before Completion)
```bash
npm run lint:fix          # Fix linting issues
npm run check:types       # TypeScript validation
npm run check:i18n        # Translation validation
```

**IMPORTANT - Runtime Verification:**
After implementing complex code changes (new features, refactoring, component logic), ALWAYS use MCP Next.js DevTools to verify runtime behavior:
- ✅ Start dev server and use `nextjs_runtime` MCP tools to check for errors and logs
- ✅ Verify no runtime errors, compilation issues, or console warnings
- ❌ Skip this step ONLY for trivial changes (e.g., image sizes, spacing, colors, simple text edits)

**When to use MCP verification:**
- New components or features
- GSAP animation implementations
- Data fetching or API integration
- State management changes
- Routing or i18n modifications



## 🚫 ANTI-PATTERNS (ABSOLUTELY FORBIDDEN)

**Implementation Failures:**
- ❌ TODO comments or "implement later" notes
- ❌ Placeholder functions or mock data
- ❌ Incomplete error handling
- ❌ Hardcoded values that should be configurable
- ❌ console.log statements in production code

**Communication Waste:**
- ❌ Restating requirements unnecessarily
- ❌ Generic advice without specifics
- ❌ Agreement phrases consuming tokens ("You're absolutely right...")
- ❌ Explaining obvious concepts

**Quality Violations:**
- ❌ Bypassing linter rules
- ❌ Ignoring TypeScript errors
- ❌ Skipping code review

## 🔒 QUALITY GATES (ALL Must Pass)

Before considering ANY task complete:
1. ✅ No linter errors (`npm run lint:fix`)
2. ✅ No TypeScript errors (`npm run check:types`)
3. ✅ Translations validated (`npm run check:i18n`)
4. ✅ Code reviewed against project patterns
5. ✅ Production-ready error handling present
6. ✅ No security vulnerabilities introduced



## Project Overview

Portfolio website for creative work (photography, video, art) with multi-language support and sophisticated GSAP animations.

## Tech Stack

- Next.js 16 (App Router) + React 19 + TypeScript (strict mode)
- Tailwind CSS 4 with custom fluid design tokens
- GSAP animations
- next-intl (Italian primary, English secondary)
- Vitest + Playwright + Storybook


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
- Lavener (primary), Effloresce It (decorative)

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

## Testing (Optional)

- **Unit Tests**: `npm run test` (Vitest + V8 coverage)
- **E2E Tests**: `npm run test:e2e` (Playwright)
- **Storybook**: `npm run storybook` on port 6006 for isolated component dev

## Next.js Config

- React Compiler v1.0 ENABLED - no manual `useMemo`/`useCallback` needed
- Production: removes console logs, optimizes images (WebP/AVIF)
- GSAP imports optimized via `experimental.optimizePackageImports`
- Bundle analyzer: `npm run build-stats`
- Env: `NEXT_PUBLIC_SITE_URL` for production

## Code Standards & Git Workflow

**Before ANY commit:**
- ✅ Query Context7 for latest library best practices
- ✅ Follow MANDATORY WORKFLOW (Plan → Code → Review)
- ✅ Pass ALL quality gates (lint, types, i18n)
- ✅ Conventional Commits format (use `npm run commit`)
- ✅ New branch per feature/fix
- ✅ Preview in Storybook before integration (UI components)

**Always:**
- TypeScript strict mode - interfaces for all props
- GSAP patterns from `NavBar.tsx` as reference
- Fluid design tokens, NEVER hardcoded pixels
- iOS Safari compatibility verified for UI changes

## Security & Performance

**Security:**
- SQL injection prevention (validate inputs)
- XSS/CSRF protection (sanitize user data)
- Auth/authz validation
- Never commit: credentials, API keys, debug logs exposing data

**Performance:**
- GSAP: `transform`/`opacity` only (GPU-accelerated)
- Bundle: monitor with `npm run build-stats`



---
