const { withConn } = require('./_lib/db');
const { idDesdeRequest } = require('./_lib/session');

module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  let id;
  try { id = idDesdeRequest(req); } catch (e) { console.error(e.message); return res.status(500).json({ error: 'Error del servidor.' }); }
  if (!id) return res.status(401).json({ error: 'No autenticado' });

  try {
    const data = await withConn(async (conn) => {
      const u = await conn.execute(
        `SELECT id, codigo, nombre, correo, es_admin, TO_CHAR(fecha_ingreso,'YYYY-MM-DD') AS ingreso
           FROM miembros WHERE id = :id AND estado = 'ACTIVO'`, { id });
      if (!u.rows.length) return null;
      const c = await conn.execute(
        `SELECT titulo, descripcion, url, pilar, TO_CHAR(fecha,'YYYY-MM-DD') AS fecha
           FROM contenido_miembros WHERE publicado = 1 ORDER BY fecha DESC, id DESC`);
      const x = u.rows[0];
      return {
        miembro: { id: x.ID, codigo: x.CODIGO, nombre: x.NOMBRE, correo: x.CORREO, es_admin: x.ES_ADMIN === 1, ingreso: x.INGRESO },
        contenido: c.rows.map((r) => ({ titulo: r.TITULO, descripcion: r.DESCRIPCION, url: r.URL, pilar: r.PILAR, fecha: r.FECHA })),
      };
    });
    if (!data) return res.status(401).json({ error: 'No autenticado' });
    return res.status(200).json(data);
  } catch (e) {
    console.error('me error:', e.message);
    return res.status(500).json({ error: 'Error del servidor.' });
  }
};
