# SØD V3.2.0 — Coded Conversation Window

## Objetivo
Eliminar la dependencia visual del background remoto del chat y garantizar una jerarquía estable entre Hub, panel, mensajes, historial y controles.

## Capas
1. Hub panorámico existente.
2. Scrim/blur de foco.
3. Panel codeado.
4. Stream de mensajes.
5. Drawers y controles.

No existe una imagen del chat por encima del DOM.

## Modos
### Floating
Se abre desde el Hub sin navegación. Usa transición 3D de profundidad y conserva el estado del Hub.

### Fullscreen
Ruta `/experiencia`. Incluye sidebar izquierda con nueva conversación, conversación actual, historial local y retorno al Hub.

## Backend boundary
La UI mantiene el contrato `/api/dialogue` con `conversationId`, `clientMessageId`, `message` y Bearer token opcional. Codex puede sustituir el backend sin rediseñar la interfaz.
