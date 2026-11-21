// Uso: node --env-file=.env scripts/crear-miembro.js CODIGO "Nombre Apellido" correo@ejemplo.com "ClaveTemporal"
const bcrypt = require('bcryptjs');
const { withConn } = require('../api/_lib/db');

(async () => {
  const [codigo, nombre, correo, clave] = process.argv.slice(2);
  if (!codigo || !nombre || !clave) {
    console.error('Uso: node --env-file=.env scripts/crear-miembro.js CODIGO "Nombre" correo "Clave"');
    process.exit(1);
  }
  if (clave.length < 8) { console.error('La contraseña debe tener al menos 8 caracteres.'); process.exit(1); }
  const hash = await bcrypt.hash(clave, 12);
  await withConn((conn) =>
    conn.execute(
      `INSERT INTO miembros (codigo, nombre, correo, password_hash) VALUES (:c, :n, :e, :h)`,
      { c: codigo.trim(), n: nombre.trim(), e: correo || null, h: hash },
      { autoCommit: true }
    )
  );
  console.log(`Miembro ${codigo} creado.`);
})().catch((e) => { console.error('Error:', e.message); process.exit(1); });
