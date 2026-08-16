# SØD V4 — Handoff Contract

Este documento fija qué puede cambiar el backend sin romper el frontend V3.9999 y qué contratos deben preservarse.

## 1. Auth

### V3

`sessionProvider` devuelve guest/local y no solicita credenciales.

### V4

Reemplazar el provider detrás de la misma frontera:

- `getSession()`
- `getAccessToken()`

Resultado esperado mínimo:

```js
{
  authenticated: true,
  accessToken: '...',
  syncEnabled: true,
  user: { id: '...' }
}
```

Nunca introducir un formulario de email/password que no esté conectado a Auth real.

## 2. Conversaciones

El frontend llama:

```js
api.dialogue({
  conversationId,
  clientMessageId,
  message,
  accessToken
})
```

El servidor debe devolver como mínimo:

```js
{
  id,
  conversationId,
  clientMessageId,
  reply,
  mode
}
```

### Requisitos V4

- idempotencia por `clientMessageId`;
- ownership por usuario autenticado;
- conversaciones persistentes;
- paginación de mensajes;
- retry seguro;
- rate limiting;
- no confiar en `userId` enviado por cliente.

## 3. Memoria

V3 no implementa memoria longitudinal real.

V4 debe separar:

- Identity
- History
- Evolution
- Preferences
- Temporal context

La conversación no debe escribir memoria permanente de forma directa. El LLM propone eventos/candidatos y una capa de política valida qué se conserva.

## 4. SØD Brain

Adapter recomendado:

`UI → Conversation Service → Retrieval/Memory → Cognitive Constitution → LLM → structured events → policy → persistence`

No permitir que el modelo cree automáticamente Semillas o Códigos por cada intercambio.

## 5. Hábitos

V3 usa estado local.

V4 deberá persistir entidades equivalentes a:

- habits
- habit_checkins
- routine_blocks
- goals
- goal_progress_events

Los check-ins deben usar fecha/zona horaria explícita.

## 6. Semillas

### Operativo al comenzar V4

- Elementos: 165 Semillas.
- Animales / Sodiaco: metadata prototype, `coming-soon`.
- Tesoros = Semillas incorporadas por el usuario.

Backend sugerido:

- seed_collections
- seeds
- user_seeds
- seed_integration_events

No asumir blockchain. Si se tokeniza en el futuro, agregar una capa separada (`tokenId`, chain, contract, metadataURI) sin convertirla en requisito del dominio base.

## 7. Biblioteca

V3:

- books
- videos
- local video signals

V4:

- library_items
- user_library_progress
- favorites/bookmarks si se decide mantenerlos.

**Eventos no pertenecen a Biblioteca.**

## 8. Comunidad / Eventos

V3 expone Comunidad como preview y enlaces oficiales.

V4 deberá decidir la primera unidad social real antes de activar métricas públicas. Posibles entidades:

- community_profiles
- circles
- memberships
- events
- event_registrations
- connections

Hasta entonces no publicar conteos inventados.

## 9. Dashboard

Dashboard debe consumir datos derivados; no convertirse en dueño de Hábitos, Semillas o Biblioteca.

Métricas deben venir de eventos/datos reales del usuario.

## 10. Migración local → cloud

Al introducir Auth:

1. detectar estado local preexistente;
2. pedir consentimiento para importarlo;
3. migrar con idempotencia;
4. mostrar exactamente qué se importó;
5. no sobrescribir datos cloud más recientes silenciosamente.

## 11. Seguridad

- Supabase RLS obligatoria para tablas user-owned.
- Secret/service role solo servidor.
- Validación de input servidor.
- autorización derivada de sesión, nunca de IDs del cliente.
- logs sin contenido sensible innecesario.
- CSP y headers existentes deben preservarse/revisarse al agregar proveedores.
