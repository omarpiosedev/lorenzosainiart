# Pattern di Scaling Desktop-First

Implementare e documentare nel repo un pattern di scaling desktop-first: una sezione (poster/hero) viene progettata su una canvas desktop fissa (es. 1440×900 px). Tutti gli elementi dentro quella canvas sono posizionati in px. In runtime, l'intera canvas viene scalata uniformemente per adattarsi a qualunque larghezza/altezza disponibile, senza riposizionamenti interni — come fa Framer.

## Risultato atteso

- Il layout interno resta identico (proporzioni, offset, dimensioni), sia su desktop che su mobile
- Niente CLS: lo spazio verticale è riservato con aspect-ratio
- Possibilità di scegliere il comportamento di adattamento: contain / cover / width

## Concetti chiave (da applicare nel codice esistente)

### Canvas di design (desktop-first)

- Scegli `designWidth` e `designHeight` dalla versione desktop (es. 1440×900)
- Tutti i figli del poster sono posizionati in px rispetto a questa canvas: `position:absolute; left/top/width/height` in px

### Wrapper scalante

- Un wrapper misura lo spazio disponibile e applica una `transform: scale()` uniforme all'intera canvas
- Il wrapper espone una `aspect-ratio: designWidth/designHeight` per riservare spazio e prevenire layout shift

### Modalità di adattamento

- **contain** (default): mostra sempre tutto il poster, con possibili bande
- **cover**: riempie il contenitore e taglia eventuali bordi
- **width**: scala esclusivamente sulla larghezza (utile quando l'altezza del contenitore è gestita altrove)

### Full-bleed

- Per avere edge-to-edge, assicurarsi che il wrapper non sia dentro un container con max-width/padding
- Se il layout globale usa un container centrato, usare una utility fullbleed (vedi sotto) per uscire dai vincoli del parent

## API da aggiungere (componente riutilizzabile)

### app/components/ScaleToFit.tsx

```tsx
'use client';
import { useLayoutEffect, useMemo, useRef, useState } from 'react';

type Props = {
  designWidth: number; // px desktop
  designHeight: number; // px desktop
  mode?: 'contain' | 'cover' | 'width';
  roundScale?: boolean; // riduce shimmering del testo (default true)
  children: React.ReactNode; // elementi assoluti in px dentro la canvas
};

export default function ScaleToFit({
  designWidth,
  designHeight,
  mode = 'contain',
  roundScale = true,
  children,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) {
      return;
    }

    let raf = 0;
    const ro = new ResizeObserver(([entry]) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const { width: w, height: h } = entry.contentRect;
        const sx = w / designWidth;
        const sy = h / designHeight;
        let s
          = mode === 'cover'
            ? Math.max(sx, sy)
            : mode === 'width'
              ? sx
              : Math.min(sx, sy);
        if (roundScale) {
          s = Math.round(s * 1000) / 1000;
        }
        setScale(s);
      });
    });

    ro.observe(el);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [designWidth, designHeight, mode, roundScale]);

  const transform = useMemo(() => `translateZ(0) scale(${scale})`, [scale]);

  return (
    <div
      ref={ref}
      style={{
        position: 'relative',
        width: '100%',
        aspectRatio: `${designWidth}/${designHeight}`, // riserva spazio, evita CLS
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          width: designWidth,
          height: designHeight,
          transform,
          transformOrigin: 'top left',
          willChange: 'transform',
        }}
      >
        {children}
      </div>
    </div>
  );
}
```

### Utility facoltativa per vero full-bleed

```css
/* globals.css */
.fullbleed {
  position: relative;
  left: 50%;
  right: 50%;
  margin-left: -50vw;
  margin-right: -50vw;
  width: 100vw;
}

body {
  margin: 0; /* evita i 8px default */
}
```

## Linee guida d'uso (integrare dove serve nel codice esistente)

1. Avvolgere la sezione poster in `<ScaleToFit designWidth=... designHeight=... mode="contain|cover|width">`

2. All'interno, usare una canvas con `position:relative; width:designWidth; height:designHeight;` e tutto in px:

```tsx
<ScaleToFit designWidth={1440} designHeight={900} mode="contain">
  <div style={{ position: 'relative', width: 1440, height: 900 }}>
    <h1 style={{ position: 'absolute', left: 120, top: 80, fontSize: 300 }}>
      TITOLO
    </h1>
    {/* altri elementi assoluti in px */}
  </div>
</ScaleToFit>;
```

3. Se la pagina ha un wrapper centrato con limiti: applicare `className="fullbleed"` al section del poster

4. Per mobile che taglia: usare `mode="contain"` (non "cover"), ed evitare wrapper genitori con altezza forzata (vh) che riducono lo spazio verticale utile

5. Per l'effetto Framer sotto il fade, la sezione successiva può salire con un piccolo `margin-top: -72px` (valore da calibrare)

## Best practice & performance

- **Asset retina**: immagini ≥ 1.5× della dimensione di design; su `<Image>` usare `priority` se above-the-fold e `sizes="100vw"` quando opportuno
- **Testo morbido a scale frazionarie**: lascia `roundScale=true` (scala arrotondata a 3 decimali)
- **Hydration**: il componente è client-only; non spostarlo in Server Components
- **Reattività**: la scala è calcolata da un solo ResizeObserver + requestAnimationFrame → nessun ricalcolo per ogni child
- **Accessibilità**: non usare transform per elementi focusabili separati dal poster; i controlli interattivi principali è meglio metterli fuori dal poster o garantire contrasto e area clic corretti

## QA / Checklist

- [ ] Ridimensionando tra 360–1920 px, layout interno identico (nessun riposizionamento)
- [ ] Nessun padding/margine laterale non voluto (se sì, usare `.fullbleed`)
- [ ] Nessun CLS durante il caricamento (grazie ad aspect-ratio)
- [ ] Mobile con `mode="contain"` non taglia elementi critici
- [ ] Immagini nitide anche su display densi (asset adeguati)
- [ ] Nessun warning Next/Image per LCP (usare `priority` quando serve)

## Nota decisionale (perché desktop-first)

Framer ragiona su un frame di design fisso (desktop), poi scala tutto il frame.

Questo approccio evita branch di layout multipli, garantisce coerenza visiva e riduce la complessità CSS/JS.

Con questo, il repo avrà un pattern stabile e documentato per creare poster/hero pixel-perfect che scalano come in Framer. Utilizza il componente in qualunque sezione dove serve l'effetto "poster che si ridimensiona tutto insieme".

1. Piccoli ritocchi CSS (qualità e coerenza)
   /_ dentro al poster, testi super stabili _/
   .poster \* {
   text-rendering: optimizeLegibility;
   -webkit-font-smoothing: antialiased;
   -moz-osx-font-smoothing: grayscale;
   }

/_ line-height neutro (decidi tu a px quando serve) _/
.poster :where(h1,h2,h3,p,button,span,small) {
line-height: normal;
}

/_ anti-banding per i gradient fade (meno “strisce”) _/
.poster .fade-soft {
filter: blur(0.1px);
}

/_ sicurezza su iOS notch quando fai full-bleed fixed elements _/
.safe-bottom {
padding-bottom: env(safe-area-inset-bottom);
}

2. PosterCanvas (tiny wrapper per non ripeterti)
   // app/components/PosterCanvas.tsx
   'use client';
   import ScaleToFit from './ScaleToFit';

type PosterCanvasProps = {
w: number; // designWidth
h: number; // designHeight
mode?: 'contain'|'cover'|'width';
className?: string; // es: "fullbleed"
children: React.ReactNode; // TUTTO in px
};

export default function PosterCanvas({ w, h, mode='contain', className, children }: PosterCanvasProps){
return (

<section className={className ?? ''} style={{ padding: 0, margin: 0 }}>
<ScaleToFit designWidth={w} designHeight={h} mode={mode}>
<div className="poster" style={{ position:'relative', width:w, height:h }}>
{children}
</div>
</ScaleToFit>
</section>
);
}

Uso:

<PosterCanvas w={1440} h={900} className="fullbleed">
  <h1 style={{ position:'absolute', left:120, top:80, fontSize:300, fontWeight:900 }}>TITOLO</h1>
  {/* altri layer assoluti in px */}
  <div className="fade-soft" style={{
    position:'absolute', left:0, right:0, bottom:0, height:300,
    background:'linear-gradient(180deg,rgba(255,255,255,0) 0%, rgba(255,255,255,.9) 45%, #fff 85%)'
  }} />
</PosterCanvas>

3. Accorgimenti immagini (nitidezza & LCP)

Asset ≥ 1.5× della dimensione di design (retina safe).

next/image sopra-la-piega:

<Image src="/hero.png" alt="" width={820} height={980} priority sizes="100vw"
style={{ position:'absolute', left:…, top:…, objectFit:'cover' }} />

4. Sovrapporre la sezione dopo (look Framer)
<section style={{ marginTop: '-72px' /* regola 48–120px */ }}>
  {/* nav pills / rating / testo */}
</section>

5. Debug veloce quando qualcosa “non torna”

Poster non edge-to-edge ➝ c’è un parent con max-width/padding → aggiungi .fullbleed a quel section.

Elementi che “saltano” su mobile ➝ dentro .poster controlla di non avere vw, rem, clamp(), sm:, md: ecc.

Testo un filo soft ➝ lascia roundScale: true in ScaleToFit (già impostato).

6. Accessibilità & motion

Contrasto: verifica che testi/CTA sul poster rispettino WCAG.

Se aggiungi animazioni, rispetta prefers-reduced-motion:

@media (prefers-reduced-motion: reduce) {
.poster \* { transition-duration: 0.01ms !important; animation-duration: 0.01ms !important; }
}

7. Mini-checklist finale

Dentro .poster: solo px per posizioni, font, spazi.

ScaleToFit con mode="contain" (o cover se accetti tagli).

section.fullbleed se la pagina ha container centrati.

Immagini retina + priority per hero.

Sezione successiva sovrapposta con margin-top negativo per il “fade”.
