# El Gremio

Sitio web con zona de agremiados.

- `index.html` — página de inicio.
- `miembros.html` — login y portal de agremiados (usa `portal-extra.css/js` para las secciones adicionales).
- `admin.html` — panel de administración (crear y gestionar miembros).
- `demo.html` — vista previa del portal con datos de ejemplo, sin backend (solo para mostrar).
- `api/` — funciones serverless (login, logout, me, admin/miembros). Requieren Oracle (`oracledb`) y `SESSION_SECRET` (mín. 32 caracteres).
- `scripts/crear-miembro.js` — crea miembros desde la terminal.

## Editar el contenido del portal
Todo el contenido (video, WhatsApp, eventos, galería, aliados, testimonios, recursos, anuncio, preguntas frecuentes) está en el bloque `CONFIG` al inicio de `portal-extra.js`. Las fotos se suben a `img/`.
