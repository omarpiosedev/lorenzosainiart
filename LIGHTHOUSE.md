# Lighthouse CI - Performance Testing

Questo progetto usa **Lighthouse CI** per monitoraggio automatico delle performance e quality gates nel CI/CD.

---

## 📦 Installazione

```bash
# Globale (consigliato per uso locale)
npm install -g @lhci/cli

# Oppure usa gli script npm (installa automaticamente)
npm run lhci
```

---

## 🚀 Comandi Disponibili

### Testing Locale

```bash
# Full performance audit (desktop preset)
npm run perf:test

# Mobile audit (3G throttling)
npm run perf:mobile

# Desktop audit esplicito
npm run lhci:desktop
```

### Comandi Granulari

```bash
# Solo raccolta dati (no assertion)
npm run lhci:collect

# Solo verifica assertion (su dati già raccolti)
npm run lhci:assert

# Upload report a temporary storage
npm run lhci:upload
```

---

## 📊 Performance Budgets

I limiti definiti in `lighthouserc.json`:

### Resource Budgets
| Tipo | Budget | Note |
|------|--------|------|
| JavaScript | 400 KB | Include GSAP, React, Next.js |
| Images | 800 KB | Portfolio fotografico (WebP/AVIF) |
| CSS | 50 KB | Tailwind CSS ottimizzato |
| Fonts | 150 KB | Lavener + Effloresce (WOFF2) |
| **Total** | **1.5 MB** | Tutte le risorse |

### Core Web Vitals Targets
| Metric | Target | Livello |
|--------|--------|---------|
| First Contentful Paint | < 1500ms | Error |
| Largest Contentful Paint | < 2500ms | Error |
| Cumulative Layout Shift | < 0.1 | Error |
| Total Blocking Time | < 300ms | Warning |
| Speed Index | < 3000ms | Warning |
| Time to Interactive | < 3500ms | Warning |

### Category Scores
| Categoria | Min Score | Livello |
|-----------|-----------|---------|
| Performance | 85/100 | Error |
| Accessibility | 95/100 | Warning |
| SEO | 95/100 | Error |
| Best Practices | 90/100 | Warning |

---

## 🔧 Configurazione

### lighthouserc.json

Il file di configurazione principale contiene:

**Pagine testate:**
- `/it` (homepage italiana)
- `/it/portfolio`
- `/it/aboutme`
- `/it/contact`
- `/it/blog`
- `/en` (homepage inglese)
- `/en/portfolio`

**Settings:**
- **numberOfRuns**: 3 (mediana usata per ridurre varianza)
- **Preset**: Desktop (40ms RTT, 10Mbps, CPU 1x)
- **Aggregation methods**:
  - `median-run`: usa il valore mediano (performance)
  - `optimistic`: usa il miglior valore (FCP, LCP, TBT)
  - `pessimistic`: usa il peggior valore (CLS, accessibility, SEO)

**Assertions disabilitate:**
- `uses-responsive-images`: off (portfolio con immagini ad alta risoluzione)
- `offscreen-images`: off (lazy loading gestito manualmente)
- `unused-javascript`: off (GSAP caricato globalmente)
- `bf-cache`: off (Next.js App Router gestisce automaticamente)

---

## 🤖 CI/CD Integration

### GitHub Actions Workflow

Il workflow `.github/workflows/lighthouse-ci.yml` esegue automaticamente su:
- **Pull Request** verso `main`
- **Push** su `main`

**Features:**
- ✅ Riutilizza cache build Next.js (veloce)
- ✅ Upload report come artifacts (30 giorni retention)
- ✅ Commento automatico su PR con scores
- ✅ Timeout 15 minuti

### Setup Secrets (Opzionale)

Per abilitare il Lighthouse CI server (storico performance):

```bash
# 1. Crea account su https://lhci.dev (oppure self-hosted)
# 2. Aggiungi secret in GitHub Settings > Secrets
LHCI_GITHUB_APP_TOKEN=<your-token>
```

Senza token, i report sono caricati su **temporary public storage** (7 giorni).

---

## 📈 Workflow Tipico

### 1. Sviluppo Locale

```bash
# Sviluppa feature
npm run dev

# Verifica performance prima del commit
npm run perf:test

# Fix eventuali regressioni
# ...

# Commit
npm run commit
```

### 2. Pull Request

```bash
# Crea PR
git push origin feature/my-feature

# GitHub Actions esegue automaticamente:
# - Build Next.js
# - Lighthouse CI audit
# - Commento su PR con risultati
```

### 3. Review Report

Il bot commenta su PR con:
- Scores per categoria (Performance, A11y, SEO, Best Practices)
- Core Web Vitals (FCP, LCP, CLS, TBT)
- Link ad artifacts per report dettagliato

**Esempio commento:**
```markdown
## 🔦 Lighthouse Performance Report

### Scores
| Category | Score |
|----------|-------|
| 🟢 Performance | **92**/100 |
| 🟢 Accessibility | **98**/100 |
| 🟢 Best Practices | **95**/100 |
| 🟢 SEO | **100**/100 |

### Core Web Vitals
| Metric | Value | Target |
|--------|-------|--------|
| First Contentful Paint | **1200ms** | < 1800ms |
| Largest Contentful Paint | **2100ms** | < 2500ms |
| Cumulative Layout Shift | **0.05** | < 0.1 |
| Total Blocking Time | **180ms** | < 300ms |
```

---

## 🛠️ Troubleshooting

### "startServerCommand failed to start within 30 seconds"

```bash
# Verifica che il build sia completato
npm run build

# Testa start manualmente
npm run start

# Se funziona, aumenta timeout in lighthouserc.json:
"startServerReadyTimeout": 60000  # 60 secondi
```

### "Assertion failed: performance score below threshold"

```bash
# Identifica il problema
npm run lhci:collect  # genera report senza assertion

# Apri report HTML
open .lighthouseci/*/lhr-*.html

# Cerca sezioni "Opportunities" e "Diagnostics"
# Tipici problemi:
# - Immagini non ottimizzate (usa next/image priority)
# - JavaScript bundle troppo grande (dynamic import)
# - Render-blocking resources (font preload)
```

### "Image budget exceeded"

```bash
# Verifica dimensioni immagini
npm run build-stats

# Ottimizza immagini
npm run optimize:images

# Usa formati moderni
<Image src="..." format={['webp', 'avif']} />
```

---

## 🎯 Best Practices per Questo Progetto

### 1. Immagini Above-the-Fold

```tsx
// Hero images con priority
<Image src={hero} priority quality={90} />
```

### 2. GSAP Animations

```tsx
// Lazy load animazioni below-fold
const GSAPAnimation = dynamic(() => import('./Animation'), {
  ssr: false,
  loading: () => <Skeleton />
});
```

### 3. Font Loading

```tsx
// Già ottimizzato con next/font/local
display: 'swap'  // evita FOIT
preload: true    // carica prioritario
```

### 4. Cache Components (Next.js 16)

```tsx
async function Gallery() {
  "use cache";  // riduce TTFB
  const photos = await getPhotos();
  return <PhotoGrid photos={photos} />;
}
```

---

## 📚 Risorse

- [Lighthouse CI Docs](https://github.com/GoogleChrome/lighthouse-ci)
- [Core Web Vitals](https://web.dev/vitals/)
- [Next.js Performance](https://nextjs.org/docs/app/building-your-application/optimizing)
- [Chrome DevTools](https://developer.chrome.com/docs/devtools/performance/)

---

## 🔄 Maintenance

### Aggiornare Lighthouse CI

```bash
# Verifica versione corrente
lhci --version

# Aggiorna globalmente
npm update -g @lhci/cli

# Aggiorna in GitHub Actions (lighthouse-ci.yml)
# Modifica: npm install -g @lhci/cli@0.16.x
```

### Modificare Budget

Edita `lighthouserc.json` → sezione `budgets`:

```json
{
  "resourceType": "image",
  "budget": 800  // ← aumenta/diminuisci in KB
}
```

### Aggiungere/Rimuovere Pagine

Edita `lighthouserc.json` → sezione `url`:

```json
"url": [
  "http://localhost:3000/it",
  "http://localhost:3000/it/new-page"  // ← aggiungi
]
```

---

**Ultimo aggiornamento:** Novembre 2025
**Next.js:** 16.0.1
**Lighthouse CI:** 0.15.x
