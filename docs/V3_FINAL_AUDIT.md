# SØD V3.9999 — Auditoría final pre‑backend

## Alcance

La auditoría busca responder una pregunta: **¿la carcasa V3 puede entrar a V4 sin que el equipo tenga que reconstruir el producto para conectar Auth, DB, memoria y LLM?**

## Quality Gates automáticos

La suite `npm run validate` incluye:

- syntax/check;
- safe access / ausencia de credential collection falsa;
- dominio SØD;
- assets y visual mappings;
- Biblioteca;
- Videoteca;
- conversación;
- arquitectura del producto;
- Hábitos;
- Semillas;
- Dashboard;
- shell final;
- navegación;
- mobile CSS;
- referencias de assets locales;
- accesibilidad estática del shell;
- stress de estado local;
- stress de conversación;
- guardrails de API;
- rutas runtime;
- stress HTTP runtime;
- Hub panorama;
- Hub floating icons;
- API smoke;
- Vercel configuration.

## Stress testing

### Estado local

La prueba realiza cientos de mutaciones y fuerza un estado mayor al recorrido normal: decenas de sueños, catálogo completo de Semillas y múltiples cambios antes de serializar/resetear.

Objetivo: detectar corrupción estructural, errores de merge/persistencia y límites obvios del store local.

### Conversación

Se simulan 120 turnos secuenciales (240 mensajes user/assistant), validando IDs, payload estructurado, continuidad y reset.

El test además impide introducir accidentalmente campos sensibles/políticas incorrectas como `userId`, provider o memory controlada por cliente.

### Runtime

La suite levanta `server.mjs` real y solicita rutas principales/assets/API. El stress runtime dispara 180 requests distribuidos entre 12 destinos y exige respuestas correctas.

## Mobile / desktop

La V3 contiene una capa específica de normalización mobile y tests contra regresiones conocidas:

- inputs con tamaño táctil/legible;
- layouts de Dashboard reflow;
- Semillas a una columna en teléfono;
- Hábitos sin `min-width` gigante heredado;
- conversación fullscreen adaptativa;
- Library responsive;
- Hub responsive existente.

### Limitación de este entorno

Se intentó QA visual automatizado con Chromium headless en el contenedor. El binario se bloquea por limitaciones del runtime/DBus y no produce screenshots dentro del timeout, incluso con flags headless/sandbox reducidos. Por integridad, **visual browser QA no se marca como PASS** en esta auditoría. La validación automática cubre CSS/rutas/runtime, pero antes de producción debe ejecutarse Playwright/Cypress/Lighthouse en CI o sobre el deploy real.

## Performance / tamaño

En la auditoría previa al empaquetado:

- payload local de `public/`: **732.345 bytes (~715,2 KB)** en la medición final previa al ZIP;
- assets locales: **101.199 bytes (~98,8 KB)**;
- imágenes pesadas principales: remotas;
- no se integran widgets sociales de terceros que añadan trackers o JS externo.

Archivos fuente más grandes conocidos:

- `public/styles.css`: 328.685 bytes (~321 KB) fuente / ~64 KB gzip estimado;
- `public/js/views.js`: 174.441 bytes (~170 KB) fuente / ~47 KB gzip estimado;
- `public/js/library-data.js`: ~46 KB fuente / ~11 KB gzip estimado.

Son deuda de modularización, no un bloqueo para conectar backend.

## Seguridad V3

- CSP presente;
- `X-Frame-Options: DENY`;
- `nosniff`;
- Referrer Policy;
- Permissions Policy;
- HSTS en Vercel;
- body size guard en servidor local;
- sanitización básica;
- rate limiting de prototipo;
- no passwords;
- scan explícito de patrones de secretos: **0 hits**;
- `npm audit --omit=dev`: **0 vulnerabilidades**;
- `.env.example` contiene nombres de variables, no secretos;
- Supabase secret/service role reservado al servidor futuro.

## Cache/PWA

- Service Worker versionado por release.
- navegación/scripts/styles usan network-first en SW.
- Vercel revalida `index.html`, JS, CSS y SW.
- servidor local final alinea JS/CSS/SW con `must-revalidate`.
- banner automático de instalación eliminado.

## Resultado esperado

La V3 final puede probarse como producto local y deployarse a Vercel. El siguiente trabajo sustantivo debe ser backend V4, no crear más shells paralelos.

## Auditoría de recursos remotos

Se intentó verificar en lote las URLs de Imgur desde el contenedor. La red saliente del runtime no resolvió las solicitudes dentro de los timeouts, por lo que **no se marca la disponibilidad remota como PASS**. El shell incluye manejo de fallo para imágenes remotas y los assets críticos permanecen versionados como URLs en el catálogo. Antes de producción, CI/deploy debe ejecutar un link checker con salida a internet o migrar arte crítico a CDN propio.
