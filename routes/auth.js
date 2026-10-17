const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../config/db');

const router = express.Router();
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// ---------- LOGIN ----------
router.get('/login', (req, res) => {
  if (req.session.user) return res.redirect('/');
  let success = null;
  if (req.query.registered === 'requester') success = 'Account created. You can log in now.';
  if (req.query.registered === 'technician')
    success = 'Account created. An administrator must approve it before you can log in.';
  res.render('login', { error: null, success, form: {} });
});

router.post('/login', (req, res) => {
  const email = (req.body.email || '').trim().toLowerCase();
  const password = req.body.password || '';
  const role = req.body.role || '';
  const form = { email, role };

  if (!email || !password) {
    return res.status(400).render('login', { error: 'Email and password are required.', success: null, form });
  }

  const found = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  if (!found || !bcrypt.compareSync(password, found.password_hash) || found.role !== role) {
    return res.status(401).render('login', { error: 'Invalid email, password, or role.', success: null, form });
  }
  if (found.status === 'pending') {
    return res.status(403).render('login', { error: 'Your account is waiting for administrator approval.', success: null, form });
  }
  if (found.status === 'inactive') {
    return res.status(403).render('login', { error: 'Your account has been deactivated.', success: null, form });
  }

  req.session.user = { id: found.id, name: found.name, email: found.email, role: found.role };
  res.redirect(`/${found.role}/dashboard`);
});

// ---------- SIGNUP ----------
router.get('/signup', (req, res) => {
  if (req.session.user) return res.redirect('/');
  res.render('signup', { errors: [], form: { role: 'requester' } });
});

router.post('/signup', (req, res) => {
  const name = (req.body.name || '').trim();
  const email = (req.body.email || '').trim().toLowerCase();
  const role = req.body.role || '';
  const specialty = (req.body.specialty || '').trim();
  const password = req.body.password || '';
  const confirm = req.body.confirm_password || '';
  const form = { name, email, role, specialty };
  const errors = [];

  if (name.length < 2 || name.length > 100) errors.push('Full name must be 2 to 100 characters.');
  if (!EMAIL_RE.test(email)) errors.push('Enter a valid email address.');
  // Only these two roles can self-register. Admin accounts can never be created here.
  if (!['requester', 'technician'].includes(role)) errors.push('Choose Requester or Technician.');
  if (role === 'technician' && !specialty) errors.push('Specialty is required for technicians.');
  if (specialty.length > 50) errors.push('Specialty must be 50 characters or fewer.');
  if (password.length < 8) errors.push('Password must be at least 8 characters.');
  if (password !== confirm) errors.push('Passwords do not match.');

  if (errors.length === 0) {
    const exists = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
    if (exists) errors.push('That email is already registered.');
  }

  if (errors.length > 0) {
    return res.status(400).render('signup', { errors, form });
  }

  const status = role === 'technician' ? 'pending' : 'active';
  db.prepare(
    `INSERT INTO users (name, email, password_hash, role, specialty, status)
     VALUES (?, ?, ?, ?, ?, ?)`
  ).run(name, email, bcrypt.hashSync(password, 10), role, role === 'technician' ? specialty : null, status);

  res.redirect(`/login?registered=${role}`);
});

// ---------- LOGOUT ----------
router.post('/logout', (req, res) => {
  req.session.destroy(() => res.redirect('/login'));
});

module.exports = router;