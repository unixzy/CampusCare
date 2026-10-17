const express = require('express');
const db = require('../config/db');

const router = express.Router();

const MESSAGES = {
  approved: 'Technician approved. They can now log in.',
  deactivated: 'Account deactivated.',
  reactivated: 'Account reactivated.',
  self: 'You cannot deactivate your own account.',
  admin: 'Admin accounts cannot be changed here.',
  invalid: 'That action is not valid for this user.',
  notfound: 'User not found.',
};

// List users (filter: all | technicians | pending)
router.get('/', (req, res) => {
  const filter = ['all', 'technicians', 'pending'].includes(req.query.filter) ? req.query.filter : 'all';
  let where = '';
  if (filter === 'technicians') where = "WHERE role = 'technician'";
  if (filter === 'pending') where = "WHERE status = 'pending'";

  const users = db
    .prepare(`SELECT id, name, email, role, specialty, status FROM users ${where} ORDER BY id`)
    .all();
  const pendingCount = db.prepare("SELECT COUNT(*) AS n FROM users WHERE status = 'pending'").get().n;

  res.render('admin-users', {
    users,
    filter,
    pendingCount,
    message: MESSAGES[req.query.msg] || null,
  });
});

// Shared helper: load the target user or redirect with an error
function loadTarget(req, res) {
  const id = parseInt(req.params.id, 10);
  const target = Number.isInteger(id) ? db.prepare('SELECT * FROM users WHERE id = ?').get(id) : null;
  if (!target) {
    res.redirect('/admin/users?msg=notfound');
    return null;
  }
  return target;
}

router.post('/:id/approve', (req, res) => {
  const target = loadTarget(req, res);
  if (!target) return;
  if (target.status !== 'pending') return res.redirect('/admin/users?msg=invalid');
  db.prepare("UPDATE users SET status = 'active' WHERE id = ?").run(target.id);
  res.redirect('/admin/users?msg=approved');
});

router.post('/:id/deactivate', (req, res) => {
  const target = loadTarget(req, res);
  if (!target) return;
  if (target.id === req.session.user.id) return res.redirect('/admin/users?msg=self');
  if (target.role === 'admin') return res.redirect('/admin/users?msg=admin');
  if (target.status === 'inactive') return res.redirect('/admin/users?msg=invalid');
  db.prepare("UPDATE users SET status = 'inactive', available = 0 WHERE id = ?").run(target.id);
  res.redirect('/admin/users?msg=deactivated');
});

router.post('/:id/reactivate', (req, res) => {
  const target = loadTarget(req, res);
  if (!target) return;
  if (target.status !== 'inactive') return res.redirect('/admin/users?msg=invalid');
  db.prepare("UPDATE users SET status = 'active' WHERE id = ?").run(target.id);
  res.redirect('/admin/users?msg=reactivated');
});

module.exports = router;