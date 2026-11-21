const bcrypt = require('bcryptjs');
const { withConn } = require('../_lib/db');
const { idDesdeRequest } = require('../_lib/session');
const { esAdmin } = require('../_lib/auth');

const RE_CODIGO = /^[A-Za-z0-9_-]{3,30}$/;

module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  let yo;
  try { yo = idDesdeRequest(req); } catch (e) { console.error(e.message); return res.status(500).json({ error: 'Error del servidor.' }); }
  if (!yo) return res.status(401).json({ error: 'No autenticado' });
  if (req.method !== 'GET' && !(req.headers['content-type'] || '').includes('application/json'))
    return res.status(415).json({ error: 'Formato no válido' });

  const b = req.body || {};
  try {
    const out = await withConn(async (conn) => {
      if (!(await esAdmin(conn, yo))) return [403, { error: 'Sin permiso' }];

      if (req.method === 'GET') {
        const r = await conn.execute(
          `SELECT id, codigo, nombre, correo, estado, es_admin,
                  TO_CHAR(fecha_ingreso,'YYYY-MM-DD') AS ingreso,
                  TO_CHAR(ultimo_acceso,'YYYY-MM-DD HH24:MI') AS acceso
             FROM miembros ORDER BY id DESC`);
        return [200, { miembros: r.rows.map((x) => ({
          id: x.ID, codigo: x.CODIGO, nombre: x.NOMBRE, correo: x.CORREO, estado: x.ESTADO,
          admin: x.ES_ADMIN === 1, ingreso: x.INGRESO, acceso: x.ACCESO })) }];
      }

      if (req.method === 'POST') {
        const codigo = String(b.codigo || '').trim();
        const nombre = String(b.nombre || '').trim().slice(0, 120);
        const correo = String(b.correo || '').trim().slice(0, 160) || null;
        const clave = String(b.clave || '');
        if (!RE_CODIGO.test(codigo)) return [400, { error: 'Código: 3 a 30 letras, números, - o _.' }];
        if (!nombre) return [400, { error: 'Falta el nombre.' }];
        if (clave.length < 8 || clave.length > 100) return [400, { error: 'La contraseña debe tener entre 8 y 100 caracteres.' }];
        const hash = await bcrypt.hash(clave, 12);
        try {
          await conn.execute(
            `INSERT INTO miembros (codigo, nombre, correo, password_hash) VALUES (:c, :n, :e, :h)`,
            { c: codigo, n: nombre, e: correo, h: hash }, { autoCommit: true });
        } catch (e) {
          if (e.errorNum === 1) return [409, { error: 'Ese código ya existe.' }];
          throw e;
        }
        return [201, { ok: true }];
      }

      if (req.method === 'PATCH') {
        const id = Number(b.id);
        if (!Number.isInteger(id)) return [400, { error: 'Miembro no válido.' }];
        if (b.estado !== undefined) {
          if (!['ACTIVO', 'INACTIVO'].includes(b.estado)) return [400, { error: 'Estado no válido.' }];
          if (id === yo && b.estado === 'INACTIVO') return [400, { error: 'No puedes desactivarte a ti mismo.' }];
          await conn.execute(
            `UPDATE miembros SET estado = :e, intentos_fallidos = 0, bloqueado_hasta = NULL WHERE id = :id`,
            { e: b.estado, id }, { autoCommit: true });
        }
        if (b.clave !== undefined) {
          const clave = String(b.clave);
          if (clave.length < 8 || clave.length > 100) return [400, { error: 'La contraseña debe tener entre 8 y 100 caracteres.' }];
          const hash = await bcrypt.hash(clave, 12);
          await conn.execute(
            `UPDATE miembros SET password_hash = :h, intentos_fallidos = 0, bloqueado_hasta = NULL WHERE id = :id`,
            { h: hash, id }, { autoCommit: true });
        }
        return [200, { ok: true }];
      }

      return [405, { error: 'Método no permitido' }];
    });
    return res.status(out[0]).json(out[1]);
  } catch (e) {
    console.error('admin error:', e.message);
    return res.status(500).json({ error: 'Error del servidor.' });
  }
};
