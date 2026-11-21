const oracledb = require('oracledb');
oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

// Abre una conexión (modo thin, sin Instant Client), ejecuta fn y siempre la cierra.
async function withConn(fn) {
  const conn = await oracledb.getConnection({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    connectString: process.env.DB_CONNECT_STRING,
  });
  try {
    return await fn(conn);
  } finally {
    try { await conn.close(); } catch (_) {}
  }
}

module.exports = { withConn, oracledb };
