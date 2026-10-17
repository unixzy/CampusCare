const express = require('express');
const router = express.Router();

router.get('/dashboard', (req, res) => res.send('Technician dashboard - TODO'));

module.exports = router;