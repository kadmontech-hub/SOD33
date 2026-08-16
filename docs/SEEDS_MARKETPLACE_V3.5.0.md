# SØD V3.5.0 — Semillas Marketplace

## Objetivo
Convertir `/semillas` en una experiencia de exploración de colecciones inspirada en marketplaces premium de activos digitales, sin fingir todavía una economía on-chain.

## Arquitectura funcional
- Mercado: búsqueda, orden, filtros, grilla/lista, detalle y estados descubierta/latente.
- Tesoros: exhibición de 8 Semillas de alta profundidad, comparador y sinergia de colección.
- Colección activa: `Elementos · Genesis`.
- Taxonomía canónica: Tierra, Agua, Viento, Fuego y Éter.
- 33 Semillas por elemento, 165 en total.

## Rarezas
Distribución por cada fuerza:
- 14 Comunes
- 8 Infrecuentes
- 5 Raras
- 3 Épicas
- 2 Legendarias
- 1 Fundacional

Total global:
- 70 Comunes
- 40 Infrecuentes
- 25 Raras
- 15 Épicas
- 10 Legendarias
- 5 Fundacionales

## Estados
`Descubierta` se obtiene del estado local `collection.seeds`. `Latente` es cualquier Semilla no incorporada al recorrido.

## Economía / blockchain
V3.5.0 no implementa precio, wallet, compra, transferencia, mint ni contrato. La interfaz queda preparada para una futura capa de registro digital, pero no presenta claims financieros ni comportamientos falsos.

## UX
- Appbar específica de Semillas.
- Sidebar desktop y drawer mobile.
- Búsqueda instantánea.
- Filtros por rareza, elemento, estado y resonancia mínima.
- Orden por colección, reciente, resonancia, rareza y nombre.
- Grilla y lista.
- Carga progresiva de 24 tarjetas.
- Modal de detalle.
- Comparación de hasta 3 Tesoros.
- Placeholder para video canónico “¿Qué son las Semillas SØD?”.

## Fuente de datos
`public/js/seed-market-data.js` centraliza la taxonomía y los 165 registros de marketplace para evitar duplicación en `views.js`.
