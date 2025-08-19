# Metodo Scaling - Sistemi di Scalabilità Lorenzo Saini Art

Documentazione completa dei sistemi di scaling utilizzati nel portfolio di Lorenzo Saini. Questo documento analizza i diversi approcci di scalabilità implementati per garantire un'esperienza ottimale su tutti i dispositivi.

## Indice
1. [Panoramica Generale](#panoramica-generale)
2. [Hero Section - Sistema di Scaling Dinamico](#hero-section---sistema-di-scaling-dinamico)
3. [Sezione 3 - Sistema Responsivo Standard](#sezione-3---sistema-responsivo-standard)
4. [Sezione 4 - Sistema di Scaling Proporzionale](#sezione-4---sistema-di-scaling-proporzionale)
5. [Componenti di Scaling Specializzati](#componenti-di-scaling-specializzati)
6. [Sistema CSS Globale](#sistema-css-globale)
7. [Best Practices e Linee Guida](#best-practices-e-linee-guida)

---

## Panoramica Generale

Il progetto utilizza **4 sistemi di scaling principali**:

1. **Dynamic Mathematical Scaling** (Hero) - Calcolo matematico in real-time
2. **Responsive Design Standard** (Sezione 3) - Tailwind CSS con breakpoints
3. **Proportional Viewport Scaling** (Sezione 4) - Coordinate assolute basate su viewport
4. **Component-Based Scaling** (Utilities) - Componenti riutilizzabili specializzati

---

## Hero Section - Sistema di Scaling Dinamico

**File**: `src/app/[locale]/home/sections/herohome.tsx`

### Caratteristiche Principali
- **Scaling matematico real-time** basato sul viewport
- **Breakpoint dynamici** con design specifici per device
- **Prevenzione zoom manuale** con soglie intelligenti
- **Animazioni GSAP coordinate** con il sistema di scaling

### Sistema di Breakpoints

```typescript
// Mobile: design verticale ottimizzato
if (currentWidth < 768) {
  baseWidth = 375; // iPhone standard width
  baseHeight = 800; // Altezza ottimizzata per mobile
  currentBreakpoint = 'mobile';
}
// Tablet: design intermedio
else if (currentWidth < 1024) {
  baseWidth = 1024;
  baseHeight = 768;
  currentBreakpoint = 'tablet';
}
// Desktop: design orizzontale
else {
  baseWidth = 1920;
  baseHeight = 1080;
  currentBreakpoint = 'desktop';
}
```

### Calcolo del Scaling

```typescript
const scaleX = currentWidth / baseWidth;
const scaleY = currentHeight / baseHeight;
const newScale = Math.max(scaleX, scaleY); // Usa la scala maggiore per coprire tutto
```

### Prevenzione Zoom Manuale

```typescript
// Rileva zoom manuale vs cambio orientamento
if (initialViewport) {
  const widthDiff = Math.abs(currentWidth - initialViewport.width) / initialViewport.width;
  const heightDiff = Math.abs(currentHeight - initialViewport.height) / initialViewport.height;

  // Se differenza > 10% ma aspect ratio simile = zoom manuale
  if ((widthDiff > 0.1 || heightDiff > 0.1)
    && Math.abs((currentWidth / currentHeight) - (initialViewport.width / initialViewport.height)) < 0.1) {
    // Ignora il ricalcolo
  }
}
```

### Implementazione del Scaling

```typescript
// Container scalato
<div style={{
  width: `${baseWidth}px`,
  height: `${baseHeight}px`,
  transform: `scale(${scale * 1.02})`, // +2% per margin di sicurezza
  transformOrigin: 'center center',
  left: '50%',
  top: '50%',
  marginLeft: `-${baseWidth / 2}px`,
  marginTop: `-${baseHeight / 2}px`,
}}>
```

### Vantaggi
- ✅ **Perfetto controllo visivo** su tutti i dispositivi
- ✅ **Prevenzione zoom accidentale** con soglie intelligenti
- ✅ **Animazioni coordinate** con il sistema di scaling
- ✅ **Performance ottimizzata** con calcoli matematici precisi

### Svantaggi
- ❌ **Complessità elevata** nel codice
- ❌ **Debugging difficile** per problemi di scaling
- ❌ **Dependenza da JavaScript** per il calcolo real-time

---

## Sezione 3 - Sistema Responsivo Standard

**File**: `src/app/[locale]/home/sections/sez3.tsx`

### Caratteristiche Principali
- **Tailwind CSS responsive** con breakpoints standard
- **Grid layout flessibile** che si adatta ai contenuti
- **Typography scaling** graduale per readability
- **Componenti self-contained** senza dipendenze esterne

### Breakpoints Utilizzati

```css
/* Base styles = Mobile (fino a 767px) */
/* md: Tablet (768px+) */
/* lg: Desktop (1024px+) */
/* xl: Large Desktop (1280px+) */
```

### Layout Responsivo

```jsx
<div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-20">
  {/* Left Column - Contenuto principale */}
  <div className="space-y-8 lg:space-y-10">
    {/* Typography responsiva */}
    <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold">

  {/* Right Column - Service Cards */}
  <div className="space-y-6 lg:space-y-8">
    {/* Cards con immagini e contenuto */}
```

### Typography Scaling

```jsx
// Titolo principale
className = 'text-4xl md:text-5xl lg:text-6xl font-bold';

// Sottotitolo
className = 'text-base md:text-lg text-gray-800';

// Contenuto cards
className = 'text-sm lg:text-base text-gray-700';
```

### Spacing System

```jsx
// Spaziatura verticale progressiva
className = 'space-y-8 lg:space-y-10';

// Gap tra colonne
className = 'gap-8 lg:gap-20';

// Padding interno
className = 'px-4 md:px-8 lg:px-16 pt-24 pb-16 md:py-20 lg:py-24';
```

### Vantaggi
- ✅ **Semplicità e manutenibilità** con Tailwind CSS
- ✅ **Performance nativa** senza JavaScript custom
- ✅ **Accessibilità garantita** con breakpoints standard
- ✅ **Cross-browser compatibility** eccellente

### Svantaggi
- ❌ **Controllo visivo limitato** rispetto al scaling matematico
- ❌ **Potenziali problemi di consistenza** su dispositivi edge-case
- ❌ **Difficoltà nel mantenere proporzioni esatte** del design

---

## Sezione 4 - Sistema di Scaling Proporzionale

**File**: `src/app/[locale]/home/sections/sez4.tsx`

### Caratteristiche Principali
- **Coordinate assolute** basate su design 1920x1080
- **Scaling proporzionale** con unità viewport (vw/vh)
- **Layout dual** desktop vs mobile/tablet
- **Aspect ratio fissi** per mantenere proporzioni

### Sistema Desktop - Coordinate Assolute

```jsx
// Design base: 1920x1080px
// Tutte le posizioni e dimensioni in percentuali viewport

// Esempio: Benefits Button
style={{
  top: '8.33vh',    // 90px / 1080px
  left: '47.14vw',  // 905px / 1920px
  width: '5.73vw',  // 110px / 1920px
  height: '3.98vh', // 43px / 1080px
}}

// Esempio: Title
style={{
  top: '13.89vh',   // 150px / 1080px
  left: '38.54vw',  // 740px / 1920px
  width: '22.86vw', // 439px / 1920px
  height: '8.33vh', // 90px / 1080px
}}
```

### Typography Proporzionale

```jsx
// Font size che scala con la larghezza viewport
style={{
  fontSize: '3.33vw', // 64px / 1920px = 3.33vw
}}

// Font size per elementi più piccoli
style={{
  fontSize: '1.25vw', // Proporzionale per sottotitoli
}}
```

### Cards con Scaling Proporzionale

```jsx
// Card Equipment - Dimensioni precise
style={{
  top: '40.56vh',   // Posizione Y
  left: '40.78vw',  // Posizione X
  width: '21.20vw', // Larghezza proporzionale
  height: '48.23vh', // Altezza proporzionale
}}

// Elementi interni alla card - Anche loro proporzionali
style={{
  top: '3.24vh',    // 35px / 1080px
  left: '1.61vw',   // 31px / 1920px
  width: '17.97vw', // 345px / 1920px
  height: '8.24vh', // 89px / 1080px
}}
```

### Sistema Mobile - Aspect Ratio

```jsx
// Layout mobile con aspect ratio fissi
<div className="xl:hidden"> {/* Nascosto su desktop */}

  {/* Cards con aspect ratio mantenuto */}
  <div style={{ aspectRatio: '352/522' }}>
    {/* Contenuto con percentuali relative alla card */}
    <div style={{
      top: '6.7%',    // 35px / 522px della card
      left: '7.7%',   // 27px / 352px della card
      width: '84.7%', // 298px / 352px della card
      height: '17%',  // 89px / 522px della card
    }}>
```

### Vantaggi
- ✅ **Proporzioni perfette** mantenute su tutti i viewport
- ✅ **Design pixel-perfect** fedele al mockup originale
- ✅ **Performance eccellente** con CSS puro
- ✅ **Scaling fluido** senza JavaScript

### Svantaggi
- ❌ **Rigidità del layout** difficile da modificare
- ❌ **Calcoli manuali complessi** per ogni elemento
- ❌ **Problemi potenziali** su viewport molto stretti/larghi
- ❌ **Manutenzione difficile** per modifiche al design

---

## Componenti di Scaling Specializzati

### ScaleToFit Component

**File**: `src/components/ui/ScaleToFit.tsx`

```typescript
type ScaleToFitProps = {
  designWidth: number; // Larghezza di design
  designHeight: number; // Altezza di design
  mode: 'contain' | 'cover'; // Modalità di scaling
};

// Calcolo automatico del scaling
const scaleX = containerWidth / designWidth;
const scaleY = containerHeight / designHeight;

// Modalità contain: scala per far stare tutto
const newScale = Math.min(scaleX, scaleY);

// Modalità cover: scala per riempire tutto
const newScale = Math.max(scaleX, scaleY);
```

**Quando usare**:
- ✅ Poster e contenuti con dimensioni fisse
- ✅ Componenti che devono mantenere aspect ratio esatto
- ✅ Contenuti che non devono mai "rompersi" visivamente

### MobileScaler Component

**File**: `src/components/ui/MobileScaler.tsx`

```typescript
type Props = {
  mobileWidth: number;   // Design width per mobile
  mobileHeight: number;  // Design height per mobile
  maxWidth: number;      // Soglia oltre cui non scalare (default: 768px)
};

// Scaling solo sotto la soglia
if (viewportWidth <= maxWidth) {
  const scaleX = viewportWidth / mobileWidth;
  const scaleY = viewportHeight / mobileHeight;
  const finalScale = Math.min(scaleX, scaleY); // Scala minima
} else {
  // Su desktop: rendering normale senza scaling
  return <>{children}</>;
}
```

**Quando usare**:
- ✅ Componenti che devono scaling solo su mobile
- ✅ Contenuti con design specifico per mobile
- ✅ Performance ottimizzata evitando calcoli inutili su desktop

### PosterCanvas Component

**File**: `src/components/ui/PosterCanvas.tsx`

```typescript
// Wrapper semplificato per ScaleToFit
<section className="poster fullbleed min-h-screen">
  <ScaleToFit designWidth={w} designHeight={h} mode={mode}>
    {children}
  </ScaleToFit>
</section>
```

**Quando usare**:
- ✅ Contenuti poster con classe CSS `.poster`
- ✅ Sezioni fullscreen che devono scalare uniformemente
- ✅ Quando serve la classe `.fullbleed` per layout edge-to-edge

---

## Sistema CSS Globale

**File**: `src/styles/global.css`

### Prevenzione Overflow

```css
/* Previeni scroll orizzontale globale */
html,
body {
  overflow-x: hidden;
  max-width: 100vw;
  margin: 0 !important;
  padding: 0 !important;
}

/* Force fullscreen sections */
.w-screen {
  width: 100vw !important;
  margin-left: 0 !important;
  margin-right: 0 !important;
}
```

### Sistema di Variabili

```css
:root {
  /* Typography Scale */
  --text-sm: 14px;
  --text-base: 16px;
  --text-lg: 18px;
  --text-xl: 20px;
  --text-2xl: 24px;
  --text-3xl: 32px;
  --text-4xl: 40px;

  /* Spacing Scale */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-6: 24px;
  --space-8: 32px;
  --space-12: 48px;
  --space-16: 64px;
}
```

### Sistema Poster

```css
/* Sistema per contenuti con scaling fisso */
.poster {
  /* Wrapper per ScaleToFit - non toccare */
}

/* Dentro al poster tutto è in px */
.poster :where(h1, h2, h3, p, button, span, small) {
  font-size: inherit; /* Usa px espliciti */
  letter-spacing: normal;
}
```

### Utility Fullbleed

```css
/* Utility per vero full-bleed senza overflow laterale */
.fullbleed {
  position: relative;
  width: 100vw;
  margin-left: calc(-50vw + 50%);
  margin-right: calc(-50vw + 50%);
}
```

### Ottimizzazioni iOS Safari

```css
@supports (-webkit-touch-callout: none) {
  /* Fix per la barra degli indirizzi dinamica */
  .min-h-screen {
    min-height: 100vh;
    min-height: -webkit-fill-available;
  }

  /* Supporto per safe areas */
  .safe-top {
    padding-top: var(--safe-area-inset-top);
  }
  .safe-bottom {
    padding-bottom: var(--safe-area-inset-bottom);

  /* Prevent horizontal scroll bounce */
  body {
    overscroll-behavior-x: none;
  }
}
```

---

## Best Practices e Linee Guida

### Quando Usare Quale Sistema

#### 🎯 Dynamic Mathematical Scaling (Hero Style)
**Usa quando**:
- Design molto specifico con positioning pixel-perfect
- Controllo totale necessario su tutti i breakpoints
- Animazioni complesse coordinate con layout
- Performance JavaScript non è critica

**Non usare quando**:
- Contenuto principalmente testuale
- Layout semplici che beneficiano di responsive standard
- Team senza esperienza JavaScript avanzata

#### 📱 Responsive Design Standard (Sezione 3 Style)
**Usa quando**:
- Contenuto principalmente testuale e cards
- Layout che deve adattarsi al contenuto
- Accessibilità e SEO sono priorità
- Performance e semplicità sono critiche

**Non usare quando**:
- Design richiede positioning preciso
- Proportions devono essere esatte
- Layout troppo complesso per grid/flexbox standard

#### 📐 Proportional Viewport Scaling (Sezione 4 Style)
**Usa quando**:
- Design con layout molto specifico e fisso
- Positioning assoluto necessario
- Proportions devono essere mantenute perfettamente
- Performance CSS è priorità

**Non usare quando**:
- Contenuto dinamico o variabile
- Layout devono adattarsi al contenuto
- Accessibilità è priorità critica

#### 🔧 Component-Based Scaling (Utilities)
**Usa quando**:
- Riutilizzo di pattern di scaling
- Logica di scaling complessa da astrarre
- Sistemi modulari e componibili
- Testing e manutenzione sono priorità

### Regole di Ottimizzazione

#### Performance
1. **Evita ricalcoli continui** - Usa debouncing/throttling per resize events
2. **Hardware acceleration** - Usa `transform` invece di modificare `width/height`
3. **Will-change property** - Per animazioni di scaling
4. **ResizeObserver** invece di `window.resize` quando possibile

#### Accessibilità
1. **Respect user preferences** - `prefers-reduced-motion`
2. **Touch target sizes** - Minimo 44px per elementi interattivi
3. **Text scaling** - Supporta zoom del browser fino a 200%
4. **Focus indicators** - Mantenuti durante scaling

#### Browser Support
1. **Feature detection** - Usa `@supports` per CSS avanzate
2. **Fallback graceful** - Sistema base che funziona ovunque
3. **Testing cross-browser** - Safari, Firefox, Chrome, Edge
4. **Mobile browsers** - iOS Safari, Chrome Mobile, Samsung Internet

### Debugging e Testing

#### Strumenti Consigliati
1. **Browser DevTools** - Responsive mode e device simulation
2. **Real device testing** - Specialmente iOS Safari
3. **Performance monitoring** - Layout thrashing detection
4. **Accessibility testing** - Screen readers e zoom

#### Common Issues
1. **iOS Safari viewport bugs** - Usa viewport dinamiche con fallback
2. **Zoom accidentale** - Implementa detection come in Hero
3. **Text overflow** - Testa con contenuti lunghi
4. **Touch interactions** - Verifica che rimangano utilizzabili

---

## Conclusioni

Il portfolio Lorenzo Saini implementa **4 sistemi di scaling complementari**, ognuno ottimizzato per use cases specifici:

1. **Hero Dynamic Scaling** - Controllo totale per sezioni critiche
2. **Standard Responsive** - Affidabilità per contenuti standard
3. **Proportional Viewport** - Precision per layout complessi
4. **Component Utilities** - Riusabilità e astrazione

La **combinazione di questi sistemi** garantisce:
- ✅ **Esperienza ottimale** su tutti i dispositivi
- ✅ **Performance bilanciata** tra controllo e velocità
- ✅ **Manutenibilità** con pattern chiari e documentati
- ✅ **Scalabilità** del codice per future evoluzioni

**Raccomandazione**: Inizia sempre con il sistema più semplice (Responsive Standard) e migra verso sistemi più complessi solo quando necessario per il design specifico.
