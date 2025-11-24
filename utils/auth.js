const jwt = require('jsonwebtoken');
const User = require('../models/user');

function getTokenFromReq(req) {
  if (req.cookies && req.cookies.accessToken) return req.cookies.accessToken;
  const auth = req.get('authorization');
  if (auth && auth.toLowerCase().startsWith('bearer ')) return auth.substring(7);
  return null;
}

const authenticateToken = (req, res, next) => {
  const token = getTokenFromReq(req);
  if (!token) return res.status(401).json({ error: 'token missing' });
  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = decoded;
    return next();
  } catch (err) {
    return res.status(401).json({ error: 'token invalid' });
  }
};

// Middleware para proteger rutas API (devuelve JSON 401/403)
const requireAdminApi = async (req, res, next) => {
  const token = getTokenFromReq(req);
  if (!token) return res.status(401).json({ error: 'token missing' });
  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(401).json({ error: 'user not found' });
    if (!user.admin) return res.status(403).json({ error: 'access denied' });
    req.user = { id: user.id, email: user.email, admin: user.admin };
    return next();
  } catch (err) {
    return res.status(401).json({ error: 'token invalid' });
  }
};

// Middleware para proteger páginas estáticas (redirige a login si no está autorizado)
const requireAdminPage = async (req, res, next) => {
  const token = getTokenFromReq(req);
  if (!token) return res.redirect('/login/');
  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.redirect('/login/');
    if (!user.admin) return res.redirect('/login/');
    req.user = { id: user.id, email: user.email, admin: user.admin };
    return next();
  } catch (err) {
    return res.redirect('/login/');
  }
};

module.exports = {
  authenticateToken,
  requireAdminApi,
  requireAdminPage,
};
