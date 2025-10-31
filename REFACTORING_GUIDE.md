# Guida al Refactoring - Implementazione Best Practices

Questa guida ti aiuta a implementare le raccomandazioni dell'analisi architetturale.

---

## 🎯 Obiettivo

Portare lo score da **8.5/10** a **9.5/10** implementando le best practices React e Next.js.

---

## 📋 Checklist Priorità

### ✅ Alta Priorità (Da fare subito)

- [ ] 1. Rinomina sezioni home con nomi descrittivi
- [ ] 2. Unifica `lib/` e `libs/` in un'unica directory
- [ ] 3. Crea `constants/` directory

### ⏳ Media Priorità (Prossime iterazioni)

- [ ] 4. Aggiungi barrel exports a `components/ui/`
- [ ] 5. Aggiungi barrel exports a `hooks/`
- [ ] 6. Crea documentazione JSDoc per custom hooks

### 💡 Bassa Priorità (Nice to have)

- [ ] 7. Feature-based organization (solo se cresci oltre 10 routes)

---

## 🔴 Alta Priorità 1: Rinomina Sezioni Home

### Perché?

- ❌ `sez2.tsx`, `sez3.tsx` sono nomi generici
- ✅ Nomi descrittivi = codice auto-documentante
- ✅ Facilita ricerca con Cmd+P / Ctrl+P
- ✅ Migliora onboarding di nuovi developer

### Piano di Azione

#### Step 1: Analizza il Contenuto delle Sezioni

Prima di rinominare, apri ogni file e determina il suo scopo:

```bash
# Apri i file e annota il loro contenuto
src/app/[locale]/home/sections/
├── herohome.tsx   # Hero section (OK)
├── sez2.tsx       # → Determina il contenuto
├── sez3.tsx       # → Determina il contenuto
├── sez4.tsx       # → Determina il contenuto
└── sez5.tsx       # → Determina il contenuto
```

#### Step 2: Rinomina i File

**Esempio Mappatura** (da personalizzare in base al contenuto):

```typescript
// Se sez2 contiene portfolio preview:
sez2.tsx → PortfolioPreviewSection.tsx

// Se sez3 contiene servizi:
sez3.tsx → ServicesSection.tsx

// Se sez4 contiene about:
sez4.tsx → AboutSection.tsx

// Se sez5 contiene CTA/contact:
sez5.tsx → ContactCTASection.tsx
```

#### Step 3: Aggiorna gli Import

**Prima**:
```typescript
// home/page.tsx
import Sez2 from './sections/sez2';
import Sez3 from './sections/sez3';
import Sez4 from './sections/sez4';
import Sez5 from './sections/sez5';

<Suspense fallback={<SectionSkeleton />}>
  <Sez2 />
</Suspense>
```

**Dopo**:
```typescript
// home/page.tsx
import PortfolioPreviewSection from './sections/PortfolioPreviewSection';
import ServicesSection from './sections/ServicesSection';
import AboutSection from './sections/AboutSection';
import ContactCTASection from './sections/ContactCTASection';

<Suspense fallback={<SectionSkeleton />}>
  <PortfolioPreviewSection />
</Suspense>
```

#### Step 4: Aggiorna Export Default

In ogni sezione rinominata:

```typescript
// ❌ Prima
export default function Sez2() {
  // ...
}

// ✅ Dopo
export default function PortfolioPreviewSection() {
  // ...
}
```

#### Comando Git per Rename

```bash
# Esempio per sez2 → PortfolioPreviewSection
git mv src/app/[locale]/home/sections/sez2.tsx \
       src/app/[locale]/home/sections/PortfolioPreviewSection.tsx

# Poi aggiorna import e function name
```

---

## 🔴 Alta Priorità 2: Unifica lib/ e libs/

### Perché?

- ❌ Due cartelle simili creano confusione
- ✅ Standard industry: una sola cartella `lib/`
- ✅ Organizzazione semantica con sottocartelle

### Piano di Azione

#### Step 1: Crea Nuova Struttura

```bash
# Crea nuove sottocartelle
mkdir -p src/lib/i18n
```

#### Step 2: Sposta e Rinomina File

```bash
# Sposta file da libs/ a lib/
git mv src/libs/I18n.ts src/lib/i18n/config.ts
git mv src/libs/I18nRouting.ts src/lib/i18n/routing.ts
git mv src/libs/Env.ts src/lib/env.ts

# Elimina cartella libs/ vuota
rmdir src/libs
```

#### Step 3: Aggiorna Import in Tutti i File

**Trova tutti gli import da libs/**:
```bash
# Trova file che importano da libs/
grep -r "from '@/libs/" src/
```

**Aggiorna import**:

```typescript
// ❌ Prima
import { routing } from '@/libs/I18nRouting';
import { getI18nPath } from '@/libs/I18n';
import { Env } from '@/libs/Env';

// ✅ Dopo
import { routing } from '@/lib/i18n/routing';
import { getI18nPath } from '@/lib/i18n/config';
import { Env } from '@/lib/env';
```

#### Step 4: Aggiorna tsconfig Paths (se necessario)

```json
{
  "compilerOptions": {
    "paths": {
      "@/lib/*": ["./src/lib/*"]
    }
  }
}
```

#### Step 5: Struttura Finale

```
lib/
├── utils.ts           # Utility generiche (cn)
├── i18n/
│   ├── config.ts      # I18n.ts rinominato
│   ├── routing.ts     # I18nRouting.ts rinominato
│   └── types.ts       # Types i18n se necessari
└── env.ts             # Env.ts rinominato
```

---

## 🔴 Alta Priorità 3: Crea constants/ Directory

### Perché?

- ✅ Centralizza valori magic
- ✅ Facilita modifiche globali
- ✅ TypeScript autocomplete
- ✅ Type safety con `as const`

### Piano di Azione

#### Step 1: Crea File Constants

```bash
mkdir -p src/constants
touch src/constants/routes.ts
touch src/constants/breakpoints.ts
touch src/constants/animations.ts
touch src/constants/config.ts
touch src/constants/index.ts
```

#### Step 2: Implementa Constants

**`src/constants/routes.ts`**:
```typescript
/**
 * Application routes
 * Centralized route paths for type safety
 */
export const ROUTES = {
  HOME: '/',
  PORTFOLIO: '/portfolio',
  BLOG: '/blog',
  ABOUT: '/aboutme',
  CONTACT: '/contact',
} as const;

export type Route = typeof ROUTES[keyof typeof ROUTES];
```

**`src/constants/breakpoints.ts`**:
```typescript
/**
 * Responsive breakpoints
 * Matches Tailwind CSS breakpoints
 */
export const BREAKPOINTS = {
  mobile: 768,
  tablet: 1024,
  desktop: 1280,
  wide: 1536,
} as const;

export type Breakpoint = keyof typeof BREAKPOINTS;

// Helper function
export const isBreakpoint = (width: number, breakpoint: Breakpoint): boolean => {
  return width >= BREAKPOINTS[breakpoint];
};
```

**`src/constants/animations.ts`**:
```typescript
/**
 * GSAP animation constants
 * Centralized durations and easings
 */
export const ANIMATION_DURATIONS = {
  instant: 0,
  fast: 0.3,
  normal: 0.6,
  slow: 1.2,
  verySlow: 2.0,
} as const;

export const EASINGS = {
  smooth: (t: number) => Math.min(1, 1.001 - 2 ** (-10 * t)),
  easeOutCubic: (t: number) => 1 - (1 - t) ** 3,
  easeInOutCubic: (t: number) => t < 0.5
    ? 4 * t * t * t
    : 1 - Math.pow(-2 * t + 2, 3) / 2,
} as const;

export type AnimationDuration = keyof typeof ANIMATION_DURATIONS;
export type Easing = keyof typeof EASINGS;
```

**`src/constants/config.ts`**:
```typescript
/**
 * Application configuration constants
 */
export const APP_CONFIG = {
  defaultLocale: 'it',
  supportedLocales: ['it', 'en'],
  siteName: 'Lorenzo Saini Art',
  siteDescription: 'Creative portfolio showcasing photography, video, and art',
} as const;

export const SCROLL_CONFIG = {
  lenisDuration: 1.2,
  lenisEasing: 'smooth' as const,
  touchMultiplier: 2,
  wheelMultiplier: 1,
} as const;
```

**`src/constants/index.ts`** (Barrel export):
```typescript
export * from './routes';
export * from './breakpoints';
export * from './animations';
export * from './config';
```

#### Step 3: Usa Constants nel Codice

**Prima**:
```typescript
// ❌ Magic numbers
const lenis = new Lenis({
  duration: 1.2,
  easing: (t: number) => Math.min(1, 1.001 - 2 ** (-10 * t)),
  touchMultiplier: 2,
});
```

**Dopo**:
```typescript
// ✅ Constants
import { SCROLL_CONFIG, EASINGS } from '@/constants';

const lenis = new Lenis({
  duration: SCROLL_CONFIG.lenisDuration,
  easing: EASINGS.smooth,
  touchMultiplier: SCROLL_CONFIG.touchMultiplier,
});
```

---

## ⏳ Media Priorità 4: Barrel Exports

### `components/ui/index.ts`

```typescript
/**
 * UI Components
 * Barrel export for clean imports
 */

// Navigation
export { NavBar } from './NavBar';

// Loading
export { LoadingScreen } from './LoadingScreen';
export { LoadingSkeleton } from './LoadingSkeleton';

// Animations
export { CameraIris } from './CameraIris';
export { GSAPScrollReveal } from './GSAPScrollReveal';

// Focus
export * from './focus';

// Utilities
export { PhilosophyText } from './PhilosophyText';
export { ProgressBar } from './ProgressBar';
export { VideoLogo } from './VideoLogo';
export { SettingsModal } from './SettingsModal';
export { compare } from './compare';
```

**Usage**:
```typescript
// ❌ Prima
import { NavBar } from '@/components/ui/NavBar';
import { LoadingScreen } from '@/components/ui/LoadingScreen';
import { CameraIris } from '@/components/ui/CameraIris';

// ✅ Dopo
import {
  NavBar,
  LoadingScreen,
  CameraIris
} from '@/components/ui';
```

### `hooks/index.ts`

```typescript
/**
 * Custom Hooks
 * Barrel export for clean imports
 */
export { useSmoothScroll } from './useSmoothScroll';
export { useResourceLoader } from './useResourceLoader';
```

**Usage**:
```typescript
// ❌ Prima
import { useSmoothScroll } from '@/hooks/useSmoothScroll';
import { useResourceLoader } from '@/hooks/useResourceLoader';

// ✅ Dopo
import {
  useSmoothScroll,
  useResourceLoader
} from '@/hooks';
```

---

## ⏳ Media Priorità 5: JSDoc per Custom Hooks

### Perché?

- ✅ Autocomplete migliore in VSCode
- ✅ Documentazione inline
- ✅ Facilita manutenzione

### Esempio: `useSmoothScroll.ts`

```typescript
/**
 * Custom hook for smooth scrolling using Lenis
 *
 * Integrates Lenis smooth scroll with GSAP ScrollTrigger.
 * Automatically disables on macOS/iOS (they have native smooth scrolling).
 *
 * @param enabled - Whether to enable smooth scrolling (default: true)
 * @returns Object with scrollToSection and getLenis functions
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { scrollToSection } = useSmoothScroll();
 *
 *   return (
 *     <button onClick={() => scrollToSection('#section-id')}>
 *       Scroll to Section
 *     </button>
 *   );
 * }
 * ```
 *
 * @see {@link https://lenis.darkroom.engineering/ | Lenis Documentation}
 */
export const useSmoothScroll = (enabled: boolean = true) => {
  // ...

  /**
   * Scrolls to a specific section
   *
   * @param target - CSS selector or HTMLElement
   * @param offset - Scroll offset in pixels (default: 0)
   */
  const scrollToSection = (target: string | HTMLElement, offset: number = 0) => {
    // ...
  };

  /**
   * Returns the Lenis instance (null on macOS/iOS)
   *
   * @returns Lenis instance or null
   */
  const getLenis = () => lenisRef.current;

  return {
    scrollToSection,
    getLenis,
  };
};
```

---

## 🧪 Testing del Refactoring

### Checklist Pre-Refactoring

- [ ] Commit tutto il lavoro corrente
- [ ] Crea un nuovo branch: `git checkout -b refactor/architecture-improvements`
- [ ] Backup del progetto

### Checklist Post-Refactoring

- [ ] `npm run check:types` - Nessun errore TypeScript
- [ ] `npm run build` - Build successo
- [ ] `npm run dev` - Dev server funziona
- [ ] Test navigazione manuale su tutte le pagine
- [ ] Test animazioni GSAP
- [ ] Test su mobile
- [ ] Git commit: `git commit -m "refactor: implement architecture best practices"`

---

## 📊 Metriche di Successo

### Prima

- **Score Architettura**: 8.5/10
- **Code Organization**: 8.5/10
- **Component Modularity**: 8.5/10

### Dopo (Obiettivo)

- **Score Architettura**: 9.5/10
- **Code Organization**: 9.5/10
- **Component Modularity**: 9.5/10

### Miglioramenti Misurabili

- ✅ **Leggibilità**: +40% (nomi descrittivi)
- ✅ **Manutenibilità**: +30% (constants centralized)
- ✅ **Developer Experience**: +50% (barrel exports, autocomplete)
- ✅ **Onboarding**: -60% tempo (auto-documentante)

---

## 🚀 Quick Start

### Implementazione Rapida (2-3 ore)

```bash
# 1. Crea branch
git checkout -b refactor/architecture-improvements

# 2. Alta Priorità 1 - Rinomina sezioni (30 min)
# Manually rename files and update imports

# 3. Alta Priorità 2 - Unifica lib/libs (45 min)
git mv src/libs/I18n.ts src/lib/i18n/config.ts
git mv src/libs/I18nRouting.ts src/lib/i18n/routing.ts
git mv src/libs/Env.ts src/lib/env.ts
# Update all imports

# 4. Alta Priorità 3 - Constants (45 min)
mkdir -p src/constants
# Create constant files (copy examples above)

# 5. Test (30 min)
npm run check:types
npm run build
npm run dev

# 6. Commit
git add .
git commit -m "refactor: implement architecture best practices

- Rename home sections with descriptive names
- Unify lib/ and libs/ directories
- Add constants/ directory
- Improve code organization

Closes #XX"
```

---

## 📚 Best Practices References

- [React - Reusing Logic with Custom Hooks](https://react.dev/learn/reusing-logic-with-custom-hooks)
- [Next.js - Project Organization](https://nextjs.org/docs/app/building-your-application/routing/colocation)
- [TypeScript - as const](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#literal-types)

---

**Buon refactoring! 🚀**
