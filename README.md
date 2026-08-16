# SØD Ecosystem V3.9999 — Final Pre‑Backend Shell

Esta es la **carcasa visual y funcional final de la etapa V3**. El objetivo de esta versión no es simular un backend que todavía no existe, sino cerrar el producto frontend antes de comenzar V4: arquitectura, navegación, loops locales, responsive, seguridad básica, pruebas, stress testing y contratos de integración.

## Estado

- **Frontend/product shell:** cerrado para handoff a V4.
- **Persistencia V3:** local (`localStorage` / `sessionStorage`).
- **Auth real:** pendiente V4.
- **Conversaciones persistentes:** pendiente V4.
- **Memoria longitudinal:** pendiente V4.
- **LLM real / Cognitive Constitution:** pendiente V4.
- **Comunidad real:** pendiente V4; V3 usa preview explícito + enlaces oficiales.
- **Economía / wallet / mint de Semillas:** no implementado ni simulado falsamente.

## Arquitectura visible congelada

El Hub tiene exactamente cuatro mundos visibles:

1. **Biblioteca** — Libros + Videos.
2. **Semillas** — presentación narrativa + Mercado Elementos + Tesoros adquiridos.
3. **Hábitos** — Tracker + Rutina + Metas.
4. **Dashboard** — Métricas + Mapa de Sueños + Comunidad preview.

El núcleo central **SØD** abre la conversación. La tuerca abre **Tools**.

## Primera experiencia canónica

`Landing → Acceso local → Onboarding/Calibración → Hub → Hablar con SØD → primera acción → exploración`

V3 no solicita email ni contraseña. La pantalla de acceso local existe únicamente como frontera temporal hasta Supabase Auth.

## Ejecutar

```bash
npm install
npm run validate
npm start
```

Servidor local por defecto: `http://127.0.0.1:4173`.

## Rutas principales

- `/hub`
- `/experiencia`
- `/biblioteca`
- `/semillas`
- `/semillas/mercado`
- `/semillas/tesoros`
- `/habitos`
- `/dashboard`
- `/dashboard/suenos`
- `/dashboard/comunidad`
- `/tools`

Ver:

- `docs/V3_FINAL_PRODUCT_MAP.md`
- `docs/ROUTE_MAP_V3.9999.md`
- `docs/V3_FINAL_AUDIT.md`
- `docs/V4_HANDOFF_CONTRACT.md`
- `docs/V3_TECH_DEBT_AND_FUTURE.md`

## Principio de curaduría

> **Una función, un lugar, una razón.**

La V3 final elimina accesos repetidos, separa responsabilidades entre universos y evita features falsas o métricas que aparenten infraestructura que todavía no existe.
