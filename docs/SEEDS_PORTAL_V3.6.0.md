# Semillas Portal V3.6.0

## Objetivo

Separar la **propuesta de valor** de Semillas de su mecánica de adquisición.

La primera pregunta de la experiencia deja de ser “¿qué puedo conseguir?” y pasa a ser “¿qué es esto, por qué existe y cómo puede integrarse a mi recorrido?”.

## Arquitectura

### `/semillas`
Portal narrativo.

1. Hero cinematográfico fullscreen.
2. Qué es una Semilla.
3. Cómo funciona: Descubrir → Incorporar → Integrar → Cultivar.
4. Casos de uso en vida: claridad, hábitos e identidad.
5. Colecciones: Elementos, Animales, Sodiaco.
6. Integración con SØD, Hábitos, Dashboard y Códigos.
7. Diferencia Mercado / Tesoros.
8. CTA final.

### Gateway omnipresente

Único selector visible de Mercado/Tesoros.

- Mercado → `/semillas/mercado`
- Tesoros → `/semillas/tesoros`
- Volver a Semillas → `/semillas`

La NAV superior del universo no contiene Mercado ni Tesoros.

## Hero audiovisual

La estructura está preparada para recibir un video definitivo. Hasta disponer del asset, la landing utiliza una composición cinematográfica codeada con arte existente de las tres colecciones.

## Semántica

- Mercado = posibilidades disponibles para explorar.
- Tesoros = Semillas que el usuario ya incorporó.
- Integración = significado que una Semilla empieza a adquirir dentro del recorrido.

No se presentan precios, wallet, mint ni claims de propiedad on-chain mientras esa infraestructura no exista.
