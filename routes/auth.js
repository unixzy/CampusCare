const express = require('express');
const router = express.Router();

router.get('/login', (req, res) => res.send('Login page - TODO'));
router.get('/signup', (req, res) => res.send('Signup page - TODO'));

router.post('/logout', (req, res) => {
  req.session.destroy(() => res.redirect('/login'));
});

module.exports = router;