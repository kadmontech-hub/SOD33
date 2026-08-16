# PROJECT STATUS — SØD V3.9999 FINAL PRE‑BACKEND SHELL

**Estado:** frontend/product shell finalizado y auditado para comenzar V4.

## Congelado para el handoff

- Hub: 4 mundos + núcleo SØD + Tools.
- Hablar con SØD: ventana flotante en Hub + vista fullscreen, contrato API estructurado.
- Biblioteca: Libros + Videos. Eventos ya no pertenecen a Biblioteca.
- Semillas: landing de significado; Elementos operativo; Animales y Sodiaco `Próximamente`; Mercado/Tesoros detrás del gateway flotante.
- Hábitos: Tracker / Rutina / Metas con persistencia local.
- Dashboard: Métricas / Mapa de Sueños / Comunidad con reducción de ruido y rutas dedicadas.
- Comunidad: preview reducido, evento real provisto por el proyecto y enlaces sociales oficiales; sin métricas sociales falsas.
- Tools: Ajustes / Navegación / Suscripción futura; instalación PWA manual.
- Mobile + desktop: capa responsive dedicada y pruebas automáticas contra regressions conocidas.

## Lo que V3 deliberadamente NO finge

- autenticación online;
- cuentas multiusuario;
- sincronización entre dispositivos;
- base de datos cloud;
- memoria longitudinal de SØD;
- comunidad social real;
- estadísticas de usuarios reales;
- precios, wallet, mint o blockchain;
- LLM productivo real.

`/api/dialogue` permanece en modo `scripted` como adapter temporal. V4 lo reemplaza detrás del mismo contrato de frontend.

## Quality Gate

La Definition of Done exige `npm run validate`, tests de dominio, navegación, mobile CSS, estado local, conversación, rutas runtime, requests concurrentes, seguridad básica, Vercel y validación desde ZIP extraído en limpio.

El detalle completo vive en `docs/V3_FINAL_AUDIT.md`.
