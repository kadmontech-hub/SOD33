# SØD V3.3.1 — Runtime Stability

Esta iteración conserva la arquitectura V3.3 y refuerza su comportamiento de despliegue.

## Garantías de esta entrega
- El Hub mantiene Semillas, Dashboard, Hábitos y Biblioteca como portales laterales.
- Hablar con SØD permanece en el núcleo central y en `/experiencia`.
- Biblioteca mantiene Libros/Videos y agrega Eventos.
- Semillas funciona como marketplace de colecciones; Elementos contiene cinco familias de 33 piezas.
- Hábitos incluye Tracker, Rutina y Metas con persistencia local.
- Dashboard incluye Métricas, Mapa de Sueños y Comunidad.
- Tools incluye Ajustes, Navegación y Suscripción.
- OUN conserva landing, acceso seguro, onboarding y ayudas del Hub.
- Service Worker y assets de código usan política anti-stale durante desarrollo.
- El test `runtime-routes.mjs` inicia el servidor real y verifica las rutas principales vía HTTP.

## Backend / LLM
El cerebro de SØD continúa desacoplado de la UI. La interfaz preserva `/api/dialogue` como contrato de integración y no crea memoria, Semillas o Códigos automáticamente.
