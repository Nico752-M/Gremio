const { cookieBorrar } = require('./_lib/session');
module.exports = (req, res) => {
  res.setHeader('Set-Cookie', cookieBorrar());
  res.status(200).json({ ok: true });
};
