require('dotenv').config();
const express = require('express');
const session = require('express-session');
const path = require('path');
require('./config/db');
const { requireRole } = require('./middleware/auth');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { httpOnly: true },
  })
);

// Make the logged-in user available in every EJS view
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

app.get('/', (req, res) => {
  const user = req.session.user;
  if (!user) return res.redirect('/login');
  res.redirect(`/${user.role}/dashboard`);
});

app.use('/', require('./routes/auth'));
app.use('/requester', requireRole('requester'), require('./routes/requester'));
app.use('/technician', requireRole('technician'), require('./routes/technician'));
app.use('/admin', requireRole('admin'), require('./routes/admin'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`CampusCare running at http://localhost:${PORT}`));