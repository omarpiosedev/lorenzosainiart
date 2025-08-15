# CLAUDE.md
@desktop_first_scaling_pattern.md
This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a portfolio website built with Next.js 15+ and based on a comprehensive boilerplate. It features a multi-language portfolio showcasing creative work including photography, video, and art projects. The site is configured for Lorenzo Saini's art portfolio with Italian and English localization.

## Key Technologies & Architecture

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript with strict type checking
- **Styling**: Tailwind CSS 4 with custom fluid design system
- **Animations**: GSAP for complex UI animations
- **Internationalization**: next-intl with Italian (default) and English support
- **Security**: Arcjet for bot protection and WAF
- **Testing**: Vitest for unit tests, Playwright for E2E testing
- **Deployment**: Optimized for production with bundle analysis

## Essential Development Commands

### Development
```bash
npm run dev          # Start development server with Turbopack and Spotlight
npm run dev:next     # Start only Next.js dev server
npm run dev:spotlight # Start Spotlight error monitoring
```

### Building & Testing
```bash
npm run build        # Production build
npm start           # Start production server
npm run test         # Run unit tests with Vitest
npm run test:e2e     # Run E2E tests with Playwright
npm run storybook    # Start Storybook on port 6006
```

### Code Quality
```bash
npm run lint         # Check for linting errors
npm run lint:fix     # Auto-fix linting issues
npm run check:types  # TypeScript type checking
npm run check:deps   # Check for unused dependencies
npm run check:i18n   # Validate translation completeness
```

### Database & Analysis
```bash
npm run build-stats  # Analyze bundle size with visual output
npm run clean        # Clean .next, out, and coverage directories
npm run commit       # Interactive commit message generator
```

## Architecture & File Structure

### Core Application Structure
- **`src/app/[locale]/`**: App Router pages with internationalization
  - Dynamic locale routing for Italian (`it`) and English (`en`)
  - Layout.tsx defines global metadata and navigation structure
  - Each page directory contains route-specific components

### Key Directories
- **`src/components/`**: Reusable React components
  - `ui/NavBar.tsx`: Complex animated navigation with GSAP
  - `reactsbits/`: Third-party component integrations
- **`src/libs/`**: Library configurations (I18n, environment, routing)
- **`src/locales/`**: Translation files (en.json, it.json)
- **`src/styles/`**: Global CSS with fluid design tokens
- **`src/utils/`**: Utility functions and app configuration

### Important Configuration Files
- **`next.config.ts`**: Next.js configuration with bundle analyzer and i18n
- **`src/utils/AppConfig.ts`**: Central app configuration (locales, URLs)
- **`src/libs/I18nRouting.ts`**: Internationalization routing setup

## Design System & Styling

### Fluid Design System
The project uses a sophisticated fluid design system defined in `global.css`:
- Responsive typography scale (--step-0 through --step-3)
- Fluid spacing scale (--space-2 through --space-4)
- Viewport-based scaling between 360px and 1280px
- Custom Lavener font for branding

### Animation System
- **GSAP**: Primary animation library for complex interactions
- **NavBar Component**: Features sophisticated hover animations with circular morphing
- **Responsive**: All animations adapt to different screen sizes

### CSS Architecture
- **Tailwind CSS 4**: Modern utility-first framework
- **Custom Design Tokens**: Fluid responsive values
- **Component-Scoped Styles**: CSS variables for component theming
- **Poster System**: Special scaling system for fixed-size content

## Internationalization (i18n)

### Configuration
- **Default Locale**: Italian (`it`)
- **Supported Locales**: Italian (`it`), English (`en`)
- **URL Structure**: Always prefixed with locale (e.g., `/it/portfolio`, `/en/portfolio`)
- **Translation Files**: `src/locales/en.json` and `src/locales/it.json`

### Key Files
- **`src/libs/I18n.ts`**: Core i18n configuration
- **`src/libs/I18nRouting.ts`**: Routing configuration
- **`src/libs/I18nNavigation.ts`**: Navigation helpers

## Testing Strategy

### Unit Testing (Vitest)
- **Location**: Alongside source code (`*.test.ts`, `*.test.tsx`)
- **Framework**: Vitest with React Testing Library replacement
- **Coverage**: V8 coverage reporting

### E2E Testing (Playwright)
- **Location**: `tests/e2e/` directory
- **File Pattern**: `*.e2e.ts`
- **Features**: Cross-browser testing, visual regression testing
- **Setup**: `npx playwright install` for first-time setup

### Storybook
- **Port**: 6006
- **Features**: UI component development, accessibility testing
- **Integration**: Vite-based with Next.js integration

## Security & Performance

### Security Features
- **Arcjet Integration**: Bot detection and WAF protection
- **TypeScript**: Strict type checking with comprehensive rules
- **Environment Variables**: T3 Env for type-safe environment handling

### Performance Optimizations
- **Turbopack**: Fast development builds
- **Bundle Analyzer**: Built-in bundle analysis with `npm run build-stats`
- **Next.js 15**: Latest optimizations including React 19 support
- **Image Optimization**: Next.js automatic image optimization

## Development Guidelines

### Code Quality Standards
- **ESLint**: Antfu configuration with Next.js and Tailwind rules
- **TypeScript**: Strict mode with comprehensive type checking
- **Prettier**: Code formatting (integrated with ESLint)
- **Conventional Commits**: Required commit message format

### Component Development
- Use TypeScript interfaces for all component props
- Follow existing animation patterns when adding GSAP animations
- Maintain responsive design using the fluid design system
- Test components in Storybook before integration

### Internationalization Best Practices
- Always add new text content to both translation files
- Use the `useTranslations` hook for dynamic content
- Test locale switching functionality
- Validate translations with `npm run check:i18n`

## Deployment & Production

### Environment Setup
- **Development**: Runs on `http://localhost:3000`
- **Production URL**: Configure `NEXT_PUBLIC_SITE_URL` environment variable
- **Database**: Optional - supports DrizzleORM with PostgreSQL

### Build Process
- **Production Build**: `npm run build`
- **Bundle Analysis**: `npm run build-stats` for optimization insights
- **Type Checking**: Automatic during build process
- **Asset Optimization**: Automatic with Next.js

### Performance Monitoring
- **Spotlight**: Local development error monitoring
- **Bundle Analyzer**: Built-in bundle size analysis
- **Core Web Vitals**: Optimized for performance metrics
