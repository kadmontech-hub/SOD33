# SØD V3.9999 — Feature Matrix

Leyenda:

- **LOCAL**: funcional y persistente en este dispositivo.
- **READ**: funcional como experiencia de lectura/navegación.
- **PREVIEW**: interfaz honesta sin backend real.
- **V4**: frontera preparada; requiere backend.

| Área | Feature | Estado V3 | Handoff |
|---|---|---:|---|
| Entrada | Landing | READ | conservar |
| Entrada | Identidad local | LOCAL | reemplazar por Auth |
| Entrada | Onboarding/calibración | LOCAL | sincronizar perfil |
| Hub | Panorama / portales | READ | conservar |
| Hub | Helps contextuales | LOCAL | opcional server-driven |
| SØD | Chat overlay | LOCAL + API scripted | V4 Conversation Service |
| SØD | Chat fullscreen | LOCAL + API scripted | V4 Conversation Service |
| SØD | Historial local preview | LOCAL | V4 threads persistentes |
| SØD | Memoria longitudinal | V4 | Supabase + policy layer |
| Biblioteca | Libros / búsqueda / categorías | READ | progreso cloud futuro |
| Biblioteca | PDF reader/download | READ | conservar |
| Biblioteca | Videos / filtros / playback | READ/LOCAL signal | progreso cloud |
| Biblioteca | Eventos | — | pertenece a Comunidad |
| Semillas | Landing narrativa | READ | conservar |
| Semillas | Mercado Elementos | READ/LOCAL | seed catalog DB |
| Semillas | Incorporar a recorrido | LOCAL | user_seeds |
| Semillas | Tesoros | LOCAL | user_seeds |
| Semillas | Elementos 5×33 | READ | catálogo canónico |
| Semillas | Animales | PREVIEW próximamente | curar después |
| Semillas | Sodiaco | PREVIEW próximamente | curar después |
| Semillas | Wallet/precio/mint | V4/FUTURO | no requisito del dominio |
| Hábitos | Tracker | LOCAL | habit_checkins |
| Hábitos | Rutina editable | LOCAL | routine_blocks |
| Hábitos | Metas/progreso | LOCAL | goals/events |
| Dashboard | Métricas | LOCAL derivadas | analytics reales |
| Dashboard | Mapa de Sueños | LOCAL | vision_board cloud |
| Dashboard | Comunidad | PREVIEW | social graph V4+ |
| Comunidad | Evento | LOCAL save + link real | events/registrations |
| Comunidad | Redes oficiales | READ | links directos |
| Tools | Ajustes | LOCAL | perfil cloud opcional |
| Tools | Navegación | READ | conservar |
| Tools | Premium interest | LOCAL | billing/subscription futura |
| Tools | Instalación PWA manual | READ | conservar |
| Legacy | Journey / Bitácora / Códigos / Perfil | LOCAL/READ | decidir migración V4 |
