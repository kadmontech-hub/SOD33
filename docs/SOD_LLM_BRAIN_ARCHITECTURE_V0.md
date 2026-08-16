# SØD Brain — arquitectura de integración V0

Este documento define el borde entre la experiencia actual y el futuro cerebro LLM. No implementa un modelo ni inventa memoria persistente.

## Capas previstas
1. **Session / Identity** — autenticación real futura, usuario, dispositivo y consentimiento.
2. **Conversation Orchestrator** — conversación continua, idempotencia por `clientMessageId` y recuperación de errores.
3. **Cognitive Constitution** — modos Explorer, Mirror, Cartographer, Philosopher, Challenger, Mentor y Witness; separación entre hechos, interpretaciones, emociones, hipótesis, valores, incertidumbre y decisiones.
4. **Memory** — Identity, History, Evolution, Preferences y Temporal Context; todo revisable y olvidable.
5. **Knowledge / Retrieval** — Biblioteca, eventos, Elementos y contenido editorial sin convertir conocimiento recuperado en verdad sobre el usuario.
6. **Transformation Gate** — Semillas y Códigos solo se conectan cuando existe evidencia de integración; nunca por cada mensaje.
7. **Safety / Boundaries** — no decide por el usuario, no diagnostica, no reemplaza profesionales, no inventa recuerdos y no exagera certeza.
8. **Observability** — trazas técnicas, latencia, errores y versiones de prompt; nunca analytics invasivos sobre introspección privada.

## Contrato actual preservado
`api.dialogue({ conversationId, clientMessageId, message, accessToken })`

La futura implementación puede usar Supabase para Auth/persistencia y un proveedor LLM intercambiable sin rehacer la UI.
