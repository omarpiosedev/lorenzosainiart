# Scripts di Ottimizzazione

## optimize-images.js

Script per ottimizzare automaticamente tutte le immagini del progetto.

### Installazione

```bash
npm install --save-dev sharp
```

### Utilizzo

```bash
node scripts/optimize-images.js
```

### Cosa fa

1. **Scansiona** tutte le immagini in `public/assets/images`
2. **Crea backup** degli originali in `public/assets/images/_originals`
3. **Ottimizza** ogni immagine:
   - Ridimensiona a max 2000px di larghezza (sufficiente per Retina)
   - Converte in formato WebP
   - Applica quality 80 (ottimale per portfolio fotografico)
   - Salta immagini già ottimizzate (< 500KB)

### Benefici Attesi

- **Riduzione file size**: 70-85%
- **Performance**:
  - FCP migliorato del 50-70%
  - LCP migliorato del 60-80%
  - Banda risparmiata: ~25MB → ~5MB

### Sicurezza

- ✅ Crea backup automatici degli originali
- ✅ Non modifica file già ottimizzati
- ✅ Processa in modo non distruttivo

### Output di Esempio

```
🖼️  Image Optimization Script

📁 Source: /public/assets/images
💾 Backups: /public/assets/images/_originals
📏 Max width: 2000px
🎨 Quality: 80%

Found 42 images

✅ Frame (5.5MB)
   5.50 MB → 890 KB (saved 83.8%)

✅ 3cfea3cd-fcb1-4a0b-86c0-322695c02749_rw_38401bac.webp
   3.70 MB → 780 KB (saved 78.9%)

⏭️  Skipped (already small): background.webp (367 KB)

📊 Summary:
Total original size: 32.00 MB
Total optimized size: 5.20 MB
Total savings: 26.80 MB (83.8%)

Optimized: 38 | Skipped: 4 | Errors: 0

✨ Done! Originals backed up to: /public/assets/images/_originals
```

### Note

- Lo script è **idempotent**: puoi eseguirlo multiple volte senza problemi
- I backup vengono sovrascritti se riesegui lo script
- Puoi ripristinare gli originali copiandoli da `_originals`
