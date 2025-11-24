const logoutRouter = require('express').Router();

logoutRouter.post('/', (req, res) => {
  res.clearCookie('accessToken', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
  });
  return res.status(200).json({ message: 'Logout exitoso' });
});

module.exports = logoutRouter;
