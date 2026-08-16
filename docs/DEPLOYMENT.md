# Deployment — V3.9999

## Vercel (recomendado para esta carcasa)

- `npm run build` copia `public/` a `dist/`.
- `vercel.json` sirve el SPA y mantiene `/api/*.mjs` como Functions.
- JS/CSS/HTML/SW usan revalidación para evitar mezclar iteraciones.
- `/assets/` locales pueden usar cache largo porque son archivos versionados del shell.

## Node local / self-host

`server.mjs` existe para desarrollo, smoke tests y hosts Node 20+.

```bash
HOST=0.0.0.0 PORT=4173 npm start
```

El servidor local no reemplaza la futura persistencia cloud. El estado principal V3 vive en el navegador.

## HTTPS

En producción usar HTTPS; es necesario para la experiencia PWA completa y APIs de dispositivo fuera de localhost.

## V4

Cuando se conecten Supabase/Auth/LLM, agregar variables de entorno únicamente en el runtime correspondiente. Secret/service-role y claves LLM nunca deben llegar al bundle del navegador.
