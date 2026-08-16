# V3.9999 — Placeholder Registry

Un placeholder puede existir en la V3 final si cumple tres reglas:

1. no se presenta como dato real;
2. no bloquea navegación/funcionalidad principal;
3. tiene una frontera clara para reemplazo en V4 o una etapa posterior.

## Infraestructura pendiente

| Área | Estado V3 | Reemplazo |
|---|---|---|
| Auth | identidad local sin credenciales | Supabase Auth |
| Conversación | `/api/dialogue` scripted | LLM + Conversation Service |
| Historial | session/local preview | conversaciones persistentes |
| Memoria | no longitudinal | Memory/Retrieval + policy |
| Multiusuario | no existe | DB + RLS |
| Sincronización | no cross-device | cloud persistence |
| Comunidad | preview explícito | perfiles/círculos/conexiones reales |
| Premium | intención local sin precio | billing real cuando se defina |
| Blockchain | no existe | opcional; capa separada si se decide |

## Contenido pendiente

- Animales y Sodiaco: colecciones `Próximamente`; metadata de desarrollo, no catálogo activo.
- Comunidad: círculos son teasers y no comunidades con miembros reales.
- Evento: la pieza visual y link de Telegram son reales/provistos; registro/asistencia siguen siendo señal local.
- Semillas Elementos: estructura 5×33 está congelada; contenido/artes pueden requerir curaduría editorial posterior.
- Biblioteca: parte del catálogo usa portadas placeholder livianas donde no existe asset curado.
- Universe/Journey legacy: textos de prácticas son material de prototipo hasta decidir su rol V4.
- Códigos legacy: las reliquias demo no representan historia real del usuario salvo Códigos creados explícitamente en local.

## Visuales remotos

La V3 usa URLs remotas para mantener el repositorio pequeño. La UI maneja fallos visuales sin romper navegación. Producción debe evaluar CDN propio/versionado.

## Regla permanente

Un placeholder nunca debe convertirse por accidente en una métrica “live”, una memoria atribuida al usuario, una transacción, un usuario real o una integración externa que no existe.
