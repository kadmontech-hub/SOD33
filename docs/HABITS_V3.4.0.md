# Hábitos SØD V3.4.0

La pantalla fue implementada desde tres referencias visuales aprobadas por producto.

## Principio
Hábitos es el loop cotidiano de SØD. La interfaz prioriza una lectura inmediata del día y evita convertir la continuidad en una mecánica compulsiva.

## Estado local
La maqueta usa `habitSystem` del store actual:
- `habits`
- `checkins`
- `routine`
- `goals`

Estos objetos son deliberadamente simples para poder migrarlos en V4 a un backend persistente sin reconstruir la UI.

## Contratos futuros sugeridos
- `habit.created`
- `habit.completed`
- `habit.uncompleted`
- `routine.block_created`
- `routine.block_updated`
- `routine.block_deleted`
- `goal.created`
- `goal.updated`
- `goal.completed`

V3.4.0 no envía estos eventos a un backend; solamente deja la UI y el modelo local preparados.
