// Verifica que el usuario de la sesión sea un administrador activo.
async function esAdmin(conn, id) {
  const r = await conn.execute(
    `SELECT 1 FROM miembros WHERE id = :id AND estado = 'ACTIVO' AND es_admin = 1`, { id });
  return r.rows.length > 0;
}
module.exports = { esAdmin };
