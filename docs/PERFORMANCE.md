# Performance — V3.9999

## Estado actual

La aplicación mantiene el payload local pequeño y descarga la mayor parte del arte cinematográfico desde URLs remotas. No incorpora frameworks ni widgets sociales de terceros en runtime.

- assets locales: ~100 KB en la auditoría final;
- `public/` completo: < 1 MB antes de build final;
- Hub usa un único loop `requestAnimationFrame`, limita DPR/densidad y pausa la escena detrás de la conversación;
- Service Worker usa network-first para navegación/scripts/styles;
- Vercel revalida shell mutable y permite cache largo en `/assets/` locales;
- redes sociales usan links directos, no embeds con trackers.

## Deuda conocida

El peso fuente está concentrado en:

- `styles.css` (~320 KB);
- `views.js` (~170 KB);
- `library-data.js` (~45 KB).

V4 debe modularizar incrementalmente después de estabilizar Auth/DB y contar con visual regression tests.

## Producción

Antes de tráfico real ejecutar sobre el deploy:

- Lighthouse mobile + desktop;
- Core Web Vitals;
- waterfall de imágenes remotas;
- pruebas de red lenta;
- CDN propio/versionado para arte principal;
- profiling de Hub en teléfonos de gama media;
- lazy loading por universo si crece el bundle.
