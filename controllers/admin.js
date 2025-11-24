const adminRouter = require('express').Router();
const { requireAdminApi } = require('../utils/auth');

// Ruta de prueba protegida para verificar que el usuario es admin
adminRouter.get('/check', requireAdminApi, (req, res) => {
  return res.json({ ok: true, user: req.user });
});

module.exports = adminRouter;
