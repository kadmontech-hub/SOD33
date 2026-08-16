# SØD V3.9999 — Route Map

## Rutas canónicas visibles

| Ruta | Responsabilidad |
|---|---|
| `/` | Landing / entrada |
| `/identidad-local` | identidad local temporal |
| `/onboarding` | calibración OUN |
| `/hub` | Hub Central |
| `/experiencia` | Hablar con SØD fullscreen |
| `/biblioteca` | Libros + Videos |
| `/semillas` | presentación de Semillas |
| `/semillas/mercado` | Mercado Elementos |
| `/semillas/tesoros` | colección personal adquirida |
| `/habitos` | Tracker / Rutina / Metas |
| `/dashboard` | Métricas |
| `/dashboard/suenos` | Mapa de Sueños |
| `/dashboard/comunidad` | Comunidad preview / Eventos |
| `/tools` | Ajustes / Navegación / Suscripción |

## Alias de compatibilidad

| Ruta heredada | Converge en |
|---|---|
| `/entrar` | identidad local |
| `/registro` | identidad local |
| `/observatorio` | Dashboard / Métricas |
| `/coleccion` | Semillas / Tesoros |
| `/configuracion` | Tools |

## Rutas profundas preservadas

- `/semillas/:seedId`
- `/elementos`
- `/elementos/:elemento`
- `/elementos/:elemento/:numero`

Se conservan porque la lectura profunda de Elementos sigue siendo parte del modelo Semillas.

## Rutas legacy no promovidas en la navegación principal

- `/journey`
- `/bitacora`
- `/codigos`
- `/marketplace`
- `/perfil`
- `/privacidad`
- `/admin`
- `/universos/:slug`

Estas rutas siguen disponibles para compatibilidad/prototipado pero **no definen la arquitectura visible V3 final**. V4 deberá decidir si se migran, integran o eliminan definitivamente.

## Regla de navegación V3 final

No agregar un destino al header/Hub por existir técnicamente. Una función solo obtiene navegación principal cuando es un destino conceptual único del producto.
