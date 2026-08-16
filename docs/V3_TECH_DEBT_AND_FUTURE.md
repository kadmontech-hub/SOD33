# V3.9999 — Deuda técnica y decisiones futuras

La V3 final prioriza estabilidad del producto y handoff. No todo debe modularizarse antes del backend.

## Deuda conocida aceptada

### `public/js/views.js` monolítico

Es el archivo JS de mayor tamaño (~170 KB). Funciona, pero V4 debería dividir vistas por dominio:

- hub
- conversation
- library
- seeds
- habits
- dashboard
- tools
- onboarding

### `public/styles.css` monolítico

Supera ~320 KB fuente. Gran parte corresponde a iteraciones históricas y overrides acumulativos. La cascada final está testeada, pero V4 debería migrar a hojas por dominio o una estrategia de componentes/tokens.

**No hacer esta refactorización al mismo tiempo que Auth/DB.** Primero congelar tests visuales/regresión y después modularizar incrementalmente.

### Rutas legacy

Varias rutas históricas permanecen accesibles aunque no aparezcan en la navegación principal. Revisar y retirar con redirects/migraciones después de confirmar que no existen deep links públicos necesarios.

### Assets remotos

Gran parte del universo visual usa Imgur. Esto mantiene el repo liviano, pero producción debería considerar CDN propio/versionado para disponibilidad, control de cache y observabilidad.

### Datos demo

- Comunidad: preview explícito.
- Animales/Sodiaco: metadata futura.
- algunos contenidos/portadas: placeholders.

Nunca confundir datos demo con actividad real.

## Antes de producción pública masiva

- tests E2E con navegador soportado (Playwright/Cypress);
- visual regression snapshots desktop/mobile;
- Lighthouse / Web Vitals en deploy real;
- Sentry/observabilidad o equivalente;
- CDN de imágenes;
- policy de backups;
- threat model y revisión Auth/RLS;
- rate limiting distribuido si el runtime escala horizontalmente;
- accessibility audit con tooling de browser;
- soporte explícito de timezones para hábitos/eventos.

## Regla para V4

No reabrir diseño global salvo una necesidad de backend demostrable. La carcasa V3.9999 debe funcionar como contrato visual mientras se reemplaza persistencia local por servicios reales.
