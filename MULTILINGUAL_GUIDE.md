# 🌍 Guida Layout Multilingua - Lorenzo Saini Portfolio

**Problema:** Le traduzioni italiane sono ~20-30% più lunghe dell'inglese, causando layout rotti, bottoni che esplodono, testi overflow, e spacing inconsistente.

**Soluzione:** Layout language-agnostic usando utility CSS, Tailwind responsive, e best practices.

---

## 📋 Indice

1. [Principi Fondamentali](#principi-fondamentali)
2. [Utility CSS Disponibili](#utility-css-disponibili)
3. [Pattern per Componenti Comuni](#pattern-per-componenti-comuni)
4. [Tailwind Utilities Essenziali](#tailwind-utilities-essenziali)
5. [Checklist Pre-Implementazione](#checklist-pre-implementazione)
6. [Esempi Pratici](#esempi-pratici)

---

## 🎯 Principi Fondamentali

### ✅ DO (Fare)
- **Usa larghezze fluide** invece di fisse (`w-auto`, `min-w-fit` invece di `w-[200px]`)
- **Padding dinamico** invece di larghezze rigide
- **Grid/Flex auto-fit** invece di colonne fisse
- **Line-clamp per testi lunghi** invece di overflow
- **Testa in entrambe le lingue** (IT + EN) su mobile e desktop
- **Usa `text-wrap: balance`** per titoli (previene orphans)
- **Usa `text-wrap: pretty`** per paragrafi (migliore leggibilità)

### ❌ DON'T (Evitare)
- ❌ Larghezze fisse sui bottoni (`w-[200px]`)
- ❌ Grid con colonne fisse (`grid-cols-3` senza responsive)
- ❌ Overflow hidden senza ellipsis
- ❌ `white-space: nowrap` su testi lunghi senza truncation
- ❌ Hardcoded spacing basato su testo inglese
- ❌ Assunzioni sulla lunghezza del testo

---

## 🛠️ Utility CSS Disponibili

Tutte disponibili in `src/styles/global.css`:

### Text Truncation & Line Clamping
```css
.text-truncate-safe    /* Single-line con ellipsis */
.text-clamp-2          /* Tronca dopo 2 righe */
.text-clamp-3          /* Tronca dopo 3 righe */
```

**Esempio:**
```tsx
<p className="text-clamp-2">
  {t('longDescription')} {/* Tronca dopo 2 righe */}
</p>
```

### Word Breaking & Wrapping
```css
.text-wrap-balanced    /* Per titoli - previene orphans */
.text-wrap-pretty      /* Per paragrafi - migliore leggibilità */
.text-break-words      /* Rompe parole lunghe per evitare overflow */
```

**Esempio:**
```tsx
<h1 className="text-wrap-balanced">
  {t('hero.title')} {/* Wrapping bilanciato */}
</h1>

<p className="text-wrap-pretty">
  {t('hero.description')} {/* Wrapping ottimizzato */}
</p>
```

### Flexible Buttons
```css
.btn-fluid            /* Button che si adatta al testo */
.btn-fluid-wrap       /* Button che può andare su più righe */
```

**Esempio:**
```tsx
{/* ❌ Male - larghezza fissa */}
<button className="w-[200px]">{t('cta')}</button>

{/* ✅ Bene - si adatta al testo */}
<button className="btn-fluid">{t('cta')}</button>
```

### Adaptive Containers
```css
.container-adaptive   /* Container che si adatta al contenuto */
.flex-adaptive        /* Flex con wrap automatico */
.grid-auto-fit        /* Grid auto-fit responsive */
.grid-auto-fill       /* Grid auto-fill responsive */
```

**Esempio:**
```tsx
{/* Grid che si adatta al contenuto */}
<div className="grid-auto-fit" style={{ '--min-col-width': '250px' }}>
  <Card title={t('card1.title')} />
  <Card title={t('card2.title')} />
  <Card title={t('card3.title')} />
</div>
```

### Language-Specific Overrides
```css
.text-compact         /* Riduce font size per IT */
.heading-compact      /* Riduce heading size per IT */
.mobile-compact       /* Riduce size mobile per IT */
```

**Esempio:**
```tsx
{/* Automaticamente più piccolo in italiano */}
<h2 className="text-2xl heading-compact">
  {t('section.title')}
</h2>
```

---

## 🧩 Pattern per Componenti Comuni

### 1. Bottoni / CTA
```tsx
// ❌ MALE - larghezza fissa
<button className="w-[200px] px-6 py-3">
  {t('cta.button')}
</button>

// ✅ BENE - larghezza fluida
<button className="btn-fluid min-w-fit px-6 py-3">
  {t('cta.button')}
</button>

// ✅ OTTIMO - responsive + fluido
<button className="btn-fluid px-4 py-2 md:px-6 md:py-3">
  {t('cta.button')}
</button>
```

### 2. Card Grid
```tsx
// ❌ MALE - colonne fisse
<div className="grid grid-cols-3 gap-4">
  <Card title={t('card1')} />
  <Card title={t('card2')} />
  <Card title={t('card3')} />
</div>

// ✅ BENE - responsive breakpoints
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  <Card title={t('card1')} />
  <Card title={t('card2')} />
  <Card title={t('card3')} />
</div>

// ✅ OTTIMO - auto-fit con custom utility
<div className="grid-auto-fit" style={{ '--min-col-width': '280px', '--grid-gap': '1rem' }}>
  <Card title={t('card1')} />
  <Card title={t('card2')} />
  <Card title={t('card3')} />
</div>
```

### 3. Titoli / Headings
```tsx
// ❌ MALE - nessun wrapping control
<h1 className="text-4xl">
  {t('hero.title')}
</h1>

// ✅ BENE - balanced wrapping
<h1 className="text-4xl text-wrap-balanced">
  {t('hero.title')}
</h1>

// ✅ OTTIMO - responsive + balanced + compact per IT
<h1 className="text-3xl md:text-4xl lg:text-5xl text-wrap-balanced heading-compact">
  {t('hero.title')}
</h1>
```

### 4. Descrizioni / Paragrafi
```tsx
// ❌ MALE - overflow senza controllo
<p className="text-base">
  {t('description')}
</p>

// ✅ BENE - line-clamp
<p className="text-base text-clamp-3">
  {t('description')}
</p>

// ✅ OTTIMO - pretty wrapping + responsive clamp
<p className="text-sm md:text-base text-wrap-pretty line-clamp-2 md:line-clamp-3">
  {t('description')}
</p>
```

### 5. Navigation Items
```tsx
// ❌ MALE - fixed width
<nav className="flex gap-4">
  <a className="w-[100px]">{t('nav.home')}</a>
  <a className="w-[100px]">{t('nav.about')}</a>
  <a className="w-[100px]">{t('nav.contact')}</a>
</nav>

// ✅ BENE - auto width
<nav className="flex gap-4">
  <a className="px-4 py-2">{t('nav.home')}</a>
  <a className="px-4 py-2">{t('nav.about')}</a>
  <a className="px-4 py-2">{t('nav.contact')}</a>
</nav>

// ✅ OTTIMO - adaptive flex + responsive
<nav className="flex-adaptive">
  <a className="px-3 py-2 md:px-4 md:py-2 text-truncate-safe">
    {t('nav.home')}
  </a>
  <a className="px-3 py-2 md:px-4 md:py-2 text-truncate-safe">
    {t('nav.about')}
  </a>
</nav>
```

### 6. Form Labels & Inputs
```tsx
// ❌ MALE - label troppo stretto
<label className="w-[120px]">
  {t('form.email')}
</label>

// ✅ BENE - label fluido
<label className="min-w-fit whitespace-nowrap">
  {t('form.email')}
</label>

// ✅ OTTIMO - responsive layout
<div className="flex flex-col md:flex-row md:items-center gap-2">
  <label className="min-w-fit md:w-auto">
    {t('form.email')}
  </label>
  <input className="flex-1" type="email" />
</div>
```

---

## 🎨 Tailwind Utilities Essenziali

### Text Overflow & Truncation
```tsx
{/* Single line truncate */}
<p className="truncate">{t('text')}</p>

{/* Multi-line clamp */}
<p className="line-clamp-2">{t('text')}</p>
<p className="line-clamp-3">{t('text')}</p>

{/* Responsive clamp */}
<p className="line-clamp-2 md:line-clamp-4">{t('text')}</p>
```

### Word Breaking
```tsx
{/* Normal wrapping */}
<p className="break-normal">{t('text')}</p>

{/* Break long words */}
<p className="break-words">{t('text')}</p>

{/* Break anywhere (aggressive) */}
<p className="break-all">{t('text')}</p>
```

### Whitespace Control
```tsx
{/* Allow wrapping */}
<p className="whitespace-normal">{t('text')}</p>

{/* No wrap */}
<p className="whitespace-nowrap">{t('text')}</p>

{/* Preserve whitespace */}
<p className="whitespace-pre-wrap">{t('text')}</p>
```

### Responsive Grid
```tsx
{/* Mobile first responsive grid */}
<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
  {/* items */}
</div>

{/* Auto-fit responsive */}
<div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-4">
  {/* items */}
</div>
```

### Responsive Flex
```tsx
{/* Responsive flex direction */}
<div className="flex flex-col md:flex-row gap-4">
  {/* items */}
</div>

{/* Flex wrap */}
<div className="flex flex-wrap gap-4">
  {/* items */}
</div>
```

### Width Utilities
```tsx
{/* Auto width */}
<div className="w-auto">{t('text')}</div>

{/* Fit content */}
<div className="w-fit">{t('text')}</div>

{/* Min width */}
<div className="min-w-fit">{t('text')}</div>

{/* Responsive width */}
<div className="w-full md:w-auto">{t('text')}</div>
```

---

## ✅ Checklist Pre-Implementazione

Prima di implementare un nuovo componente o sezione:

- [ ] **Design Review**: Il layout funziona con testo ~30% più lungo?
- [ ] **Bottoni**: Hanno `min-w-fit` o `btn-fluid` invece di larghezze fisse?
- [ ] **Grid/Flex**: Usano responsive breakpoints o auto-fit?
- [ ] **Testi Lunghi**: Hanno `line-clamp` o `truncate`?
- [ ] **Titoli**: Usano `text-wrap-balanced` o `text-wrap-pretty`?
- [ ] **Mobile**: Testato su viewport stretto (375px)?
- [ ] **Italian Test**: Cambiato locale a `/it/*` e verificato?
- [ ] **Overflow**: Nessun contenuto esce dai container?

---

## 💡 Esempi Pratici

### Hero Section
```tsx
export default function HeroSection() {
  const t = useTranslations('HomePage.hero');

  return (
    <section className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-4xl mx-auto text-center">
        {/* ✅ Titolo con balanced wrapping + responsive + compact IT */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-wrap-balanced heading-compact mb-6">
          {t('title')}
        </h1>

        {/* ✅ Sottotitolo con pretty wrapping + clamp */}
        <p className="text-lg md:text-xl text-wrap-pretty line-clamp-3 md:line-clamp-none mb-8">
          {t('subtitle')}
        </p>

        {/* ✅ CTA button fluido */}
        <button className="btn-fluid bg-black text-white px-8 py-4 rounded-lg hover:bg-gray-800 transition-colors">
          {t('cta')}
        </button>
      </div>
    </section>
  );
}
```

### Services Grid
```tsx
export default function ServicesSection() {
  const t = useTranslations('HomePage.services');

  const services = ['photography', 'videomaking', 'dronefootage'] as const;

  return (
    <section className="py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* ✅ Titolo sezione */}
        <h2 className="text-3xl md:text-4xl font-bold text-center text-wrap-balanced heading-compact mb-12">
          {t('title')}
        </h2>

        {/* ✅ Grid auto-fit responsive */}
        <div className="grid-auto-fit" style={{ '--min-col-width': '280px', '--grid-gap': '2rem' }}>
          {services.map((service) => (
            <div key={service} className="container-adaptive p-6 border rounded-lg">
              {/* ✅ Service title con balanced wrap */}
              <h3 className="text-xl md:text-2xl font-semibold mb-3 text-wrap-balanced">
                {t(`${service}.title`)}
              </h3>

              {/* ✅ Description con clamp */}
              <p className="text-sm md:text-base text-wrap-pretty line-clamp-3">
                {t(`${service}.description`)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

### Navigation Bar
```tsx
export default function Navigation() {
  const t = useTranslations('Navigation');
  const items = ['home', 'portfolio', 'about', 'contact'] as const;

  return (
    <nav className="flex-adaptive items-center justify-between px-4 py-3">
      {/* Logo */}
      <a href="/" className="font-bold text-xl">
        {t('logo')}
      </a>

      {/* Nav items - responsive */}
      <ul className="flex-adaptive gap-4">
        {items.map((item) => (
          <li key={item}>
            <a className="px-3 py-2 hover:bg-gray-100 rounded transition-colors text-truncate-safe">
              {t(`items.${item}`)}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
```

### Card Component
```tsx
interface CardProps {
  title: string;
  description: string;
  cta: string;
}

export default function Card({ title, description, cta }: CardProps) {
  return (
    <div className="container-adaptive border rounded-lg p-6 flex flex-col gap-4">
      {/* ✅ Title con balanced wrap + clamp */}
      <h3 className="text-xl font-semibold text-wrap-balanced line-clamp-2">
        {title}
      </h3>

      {/* ✅ Description con pretty wrap + clamp */}
      <p className="text-sm text-gray-600 text-wrap-pretty line-clamp-3 flex-1">
        {description}
      </p>

      {/* ✅ CTA button fluido */}
      <button className="btn-fluid self-start px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition-colors">
        {cta}
      </button>
    </div>
  );
}
```

---

## 🔍 Debug & Testing

### Visual Test Checklist
Testa ogni componente con questi passaggi:

1. **English (`/en/*`):**
   - Desktop (1920px): Layout ok?
   - Tablet (768px): Layout ok?
   - Mobile (375px): Layout ok?

2. **Italian (`/it/*`):**
   - Desktop (1920px): Testo più lungo causa problemi?
   - Tablet (768px): Overflow? Bottoni rotti?
   - Mobile (375px): Testo leggibile? Layout stabile?

3. **Edge Cases:**
   - Cosa succede con traduzioni MOLTO lunghe?
   - Il layout si rompe con traduzioni corte?

### Browser DevTools
```js
// Apri console browser e testa dinamicamente
document.documentElement.lang = 'it'; // Cambia a italiano
document.documentElement.lang = 'en'; // Cambia a inglese

// Simula testo lungo
document.querySelector('.test').textContent = 'Testo molto molto molto lungo che potrebbe rompere il layout';
```

---

## 📚 Risorse

- [Tailwind CSS - Responsive Design](https://tailwindcss.com/docs/responsive-design)
- [Tailwind CSS - Line Clamp](https://tailwindcss.com/docs/line-clamp)
- [Tailwind CSS - Text Overflow](https://tailwindcss.com/docs/text-overflow)
- [next-intl - Usage](https://next-intl-docs.vercel.app/docs/usage)
- [MDN - text-wrap](https://developer.mozilla.org/en-US/docs/Web/CSS/text-wrap)
- [MDN - overflow-wrap](https://developer.mozilla.org/en-US/docs/Web/CSS/overflow-wrap)

---

## 🚀 Quick Wins

**Applica queste fix subito per miglioramenti immediati:**

1. **Tutti i bottoni:** Aggiungi `btn-fluid` o `min-w-fit`
2. **Tutti i titoli:** Aggiungi `text-wrap-balanced heading-compact`
3. **Tutti i paragrafi:** Aggiungi `text-wrap-pretty`
4. **Descrizioni lunghe:** Aggiungi `line-clamp-2` o `line-clamp-3`
5. **Grid fisse:** Converti a `grid-auto-fit` o responsive breakpoints
6. **Test italiano:** Apri `/it/home` e verifica ogni sezione

---

**Ultimo aggiornamento:** {{ date }}
**Autore:** Claude Code (basato su Context7 docs)
