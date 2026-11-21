const crypto = require('crypto');

const COOKIE = 'gremio_sesion';
const DURACION = 60 * 60 * 8; // 8 horas

function secreto() {
  const s = process.env.SESSION_SECRET;
  if (!s || s.length < 32) throw new Error('SESSION_SECRET falta o es muy corto');
  return s;
}

const firmar = (body) => crypto.createHmac('sha256', secreto()).update(body).digest('base64url');

function crearToken(miembroId) {
  const body = Buffer.from(JSON.stringify({ id: miembroId, exp: Math.floor(Date.now() / 1000) + DURACION })).toString('base64url');
  return body + '.' + firmar(body);
}

function leerToken(token) {
  if (!token || !token.includes('.')) return null;
  const [body, sig] = token.split('.');
  const esperado = firmar(body);
  const a = Buffer.from(sig), b = Buffer.from(esperado);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  try {
    const p = JSON.parse(Buffer.from(body, 'base64url').toString());
    return p.exp > Math.floor(Date.now() / 1000) ? p : null;
  } catch (_) { return null; }
}

function idDesdeRequest(req) {
  const raw = req.headers.cookie || '';
  const m = raw.split(';').map((c) => c.trim()).find((c) => c.startsWith(COOKIE + '='));
  const p = m ? leerToken(m.slice(COOKIE.length + 1)) : null;
  return p ? p.id : null;
}

const cookieSesion = (token) =>
  `${COOKIE}=${token}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=${DURACION}`;
const cookieBorrar = () => `${COOKIE}=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0`;

module.exports = { crearToken, idDesdeRequest, cookieSesion, cookieBorrar };
