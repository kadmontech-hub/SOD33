# SØD V3.9999 — Final Pre‑Backend Shell

## Finalización global

- Arquitectura visible congelada en cuatro mundos del Hub: Biblioteca, Semillas, Hábitos y Dashboard.
- SØD central conserva la conversación; Tools vive exclusivamente en la tuerca.
- Navegación principal curada bajo la regla “una función, un lugar, una razón”.
- Flujo OUN alineado a Landing → acceso local → calibración → Hub → primera conversación.
- PWA conservada sin banner automático; instalación disponible desde Tools.
- Cache de JS/CSS/SW en modo revalidación durante esta etapa para evitar mezclas de versiones.

## Biblioteca

- Queda definida como **Libros + Videos**.
- Eventos fueron retirados de Biblioteca y pasan a Comunidad como única fuente conceptual.

## Semillas

- `/semillas` es la presentación narrativa del producto.
- Mercado/Tesoros solo se abren desde el gateway flotante.
- Elementos: colección operativa, 165 Semillas (5 × 33).
- Animales y Sodiaco permanecen modelados pero visualmente relegados a `Próximamente`.
- Mercado incorpora localmente; Tesoros muestra únicamente Elementos incorporados.
- No se simulan precios, wallets ni mint.

## Hábitos

- Tracker, Rutina y Metas siguen funcionales localmente.
- Capa mobile normalizada para evitar escalas y min-width heredados.

## Dashboard

- Sidebar redundante eliminada.
- Métricas, Mapa de Sueños y Comunidad son rutas internas dedicadas.
- Comunidad reducida a preview honesto: Telegram, evento, círculos futuros y redes oficiales.
- El evento real del prototipo usa `https://i.imgur.com/AkMzntZ.png`.

## Tools

- Ajustes funcionales locales.
- Navegación canónica del producto.
- Premium como intención futura sin precios inventados.
- Instalación PWA manual cuando el navegador expone `beforeinstallprompt`.

## QA

- Nuevos audits de navegación, mobile CSS y shell final.
- Stress de estado local.
- Stress de conversación.
- Stress de rutas/runtime.
- Clean ZIP validation obligatoria.

## Handoff

V4 comienza con Supabase/Auth, conversaciones persistentes, memoria y SØD Brain sin reconstruir la carcasa visual.
