# Deploy SØD V3.9999 en GitHub + Vercel

## Antes de subir

```bash
npm run validate
```

La V3 final **no requiere secretos** para funcionar. `.env.example` solo documenta las variables que necesitará V4.

## GitHub + Vercel Dashboard

1. Descomprimí el ZIP.
2. Subí **el contenido raíz** al repositorio (`package.json`, `vercel.json`, `public/`, etc.).
3. En Vercel: **Add New → Project**.
4. Importá el repositorio.
5. Dejá que Vercel use `vercel.json`:
   - Build: `npm run build`
   - Output: `dist`
6. Deploy.

## Git CLI

```bash
git init
git add .
git commit -m "SØD V3.9999 final pre-backend shell"
git branch -M main
git remote add origin https://github.com/TU-USUARIO/TU-REPO.git
git push -u origin main
```

## Desarrollo local

```bash
npm install
npm run dev
```

Abrí `http://127.0.0.1:4173`.

## Persistencia V3

La experiencia de usuario se guarda en este dispositivo mediante `localStorage` / `sessionStorage`. `/api/dialogue` y `/api/health` siguen disponibles como adapter/API de prototipo.

No hay cuenta cloud, sync cross-device ni memoria longitudinal real. Eso comienza en V4.

## Si el navegador muestra una versión anterior

V3.9999 revalida `index.html`, JS, CSS y `sw.js`. Si venís de muchas iteraciones anteriores, un hard reload o limpiar el Service Worker viejo puede acelerar la transición, pero no debería ser necesario en instalaciones nuevas.
