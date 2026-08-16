# SØD Universe Architecture — V3.3.0

## OUN — Onboarding User New

Entrada conceptual:

1. Landing
2. Acceso local / Auth futura
3. Onboarding
4. Helps contextuales
5. Hub Central

La V3.3.0 conserva el acceso local seguro del MVP. La autenticación real se conecta más adelante desde el backend canónico.

## Hub Central

Portales laterales activos:

- Hábitos
- Biblioteca
- Semillas
- Dashboard

El núcleo central conserva **Hablar con SØD**. La conversación ya no ocupa un portal duplicado.

## Biblioteca

Tres solapas:

- Libros
- Videos
- Eventos

Eventos utiliza contenido placeholder hasta conectar fechas, venues, ticketing y calendario.

## Semillas

Semillas se reorganiza como marketplace de colecciones.

Colección activa inicial:

- Elementos
  - Tierra — 33
  - Agua — 33
  - Viento — 33
  - Fuego — 33
  - Éter — 33

Total inicial: 165 Semillas de la colección Elementos.

La arquitectura blockchain/mint sigue desacoplada. La UI no afirma que exista un contrato desplegado.

## Hábitos

Loop diario con tres solapas:

- Tracker
- Rutina
- Metas

El estado se persiste localmente durante esta etapa de maqueta.

## Dashboard

Evolución del antiguo Observatorio:

- Métricas
- Mapa de Sueños
- Comunidad

Las métricas combinan señales reales locales y placeholders explícitos donde aún no existe tracking de backend.

## Tools

La tuerca abre:

- Ajustes
- Navegación
- Suscripciones

## SØD Brain

El cerebro LLM permanece como capa independiente del frontend. La experiencia de conversación y sus contratos se conservan para conectar posteriormente:

- Supabase Auth
- conversaciones persistentes
- memoria longitudinal
- LLM/provider
- SØD Cognitive Constitution
