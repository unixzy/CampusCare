const db = require('../config/db');

function requireLogin(req, res, next) {
  if (!req.session.user) return res.redirect('/login');
  next();
}

function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.session.user) return res.redirect('/login');

    // Re-check the database so deactivated users lose access immediately
    const current = db
      .prepare('SELECT role, status FROM users WHERE id = ?')
      .get(req.session.user.id);
    if (!current || current.status !== 'active') {
      return req.session.destroy(() => res.redirect('/login'));
    }

    if (!roles.includes(current.role)) {
      return res.status(403).send('403 - You are not allowed to view this page.');
    }
    next();
  };
}

module.exports = { requireLogin, requireRole };