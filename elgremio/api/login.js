const bcrypt = require('bcryptjs');
const { withConn } = require('./_lib/db');
const { crearToken, cookieSesion } = require('./_lib/session');

const MAX_INTENTOS = 5;
const BLOQUEO_MIN = 15;
// Hash falso: así tardamos lo mismo exista o no el código (evita enumerar usuarios).
const DUMMY = bcrypt.hashSync('no-existe', 10);

module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método no permitido' });

  const codigo = String((req.body && req.body.codigo) || '').trim().slice(0, 30);
  const clave = String((req.body && req.body.clave) || '').slice(0, 200);
  if (!codigo || !clave) return res.status(400).json({ error: 'Ingresa tu código y contraseña.' });

  try {
    const resultado = await withConn(async (conn) => {
      const r = await conn.execute(
        `SELECT id, password_hash, estado, intentos_fallidos,
                CASE WHEN bloqueado_hasta > SYSTIMESTAMP THEN 1 ELSE 0 END AS bloqueado
           FROM miembros WHERE codigo = :c`,
        { c: codigo }
      );
      const m = r.rows[0];
      if (m && m.BLOQUEADO === 1) return { bloqueado: true };

      const ok = await bcrypt.compare(clave, m ? m.PASSWORD_HASH : DUMMY);
      if (!m || !ok || m.ESTADO !== 'ACTIVO') {
        if (m) {
          await conn.execute(
            `UPDATE miembros
                SET intentos_fallidos = intentos_fallidos + 1,
                    bloqueado_hasta = CASE WHEN intentos_fallidos + 1 >= :max
                      THEN SYSTIMESTAMP + NUMTODSINTERVAL(:min, 'MINUTE') ELSE bloqueado_hasta END
              WHERE id = :id`,
            { max: MAX_INTENTOS, min: BLOQUEO_MIN, id: m.ID },
            { autoCommit: true }
          );
        }
        return { ok: false };
      }
      await conn.execute(
        `UPDATE miembros SET intentos_fallidos = 0, bloqueado_hasta = NULL, ultimo_acceso = SYSTIMESTAMP WHERE id = :id`,
        { id: m.ID },
        { autoCommit: true }
      );
      return { ok: true, id: m.ID };
    });

    if (resultado.bloqueado)
      return res.status(429).json({ error: `Demasiados intentos. Intenta de nuevo en ${BLOQUEO_MIN} minutos.` });
    if (!resultado.ok) return res.status(401).json({ error: 'Código o contraseña incorrectos.' });

    res.setHeader('Set-Cookie', cookieSesion(crearToken(resultado.id)));
    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error('login error:', e.message);
    return res.status(500).json({ error: 'Error del servidor. Intenta más tarde.' });
  }
};
