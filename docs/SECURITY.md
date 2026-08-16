# Security — V3.9999

V3 es un prototipo local-first sin cuentas reales. La seguridad final de identidad/datos comienza en V4, pero la carcasa ya incorpora fronteras básicas:

- Content Security Policy;
- `X-Frame-Options: DENY`;
- `X-Content-Type-Options: nosniff`;
- Referrer Policy;
- Permissions Policy;
- HSTS en Vercel;
- `frame-ancestors 'none'`;
- sanitización básica de strings;
- body limit en servidor local;
- rate limiting básico de prototipo;
- no collection de contraseñas;
- `.env.example` sin valores secretos.

## V4 obligatorio

- TLS administrado por plataforma;
- Auth real;
- Supabase RLS en toda tabla user-owned;
- autorización derivada de sesión;
- secret/service role solo en server runtime;
- rate limiting durable/distribuido;
- protección de endpoints administrativos;
- backup/restore probado;
- auditoría/logs con minimización de datos;
- revisión CSRF/CORS según estrategia de Auth;
- threat model antes de producción pública.
