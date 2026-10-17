const bcrypt = require('bcryptjs');
const db = require('../config/db');

const users = [
  ['Admin User', 'admin@campus.edu', 'Admin123!', 'admin', null, 'active'],
  ['Requester User', 'requester@campus.edu', 'Requester123!', 'requester', null, 'active'],
  ['Anne Cruz', 'annecruz@campus.edu', 'Tech123!', 'technician', 'Electrical', 'active'],
  ['Mark Reyes', 'markreyes@campus.edu', 'Tech123!', 'technician', 'Plumbing', 'pending'],
];

const insert = db.prepare(
  `INSERT OR IGNORE INTO users (name, email, password_hash, role, specialty, status)
   VALUES (?, ?, ?, ?, ?, ?)`
);

for (const [name, email, password, role, specialty, status] of users) {
  insert.run(name, email, bcrypt.hashSync(password, 10), role, specialty, status);
}

console.log('Seed complete. Test accounts are ready.');