CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('requester','technician','admin')),
  specialty TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','pending','inactive')),
  available INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT (datetime('now','localtime'))
);

CREATE TABLE IF NOT EXISTS requests (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  requester_id INTEGER NOT NULL REFERENCES users(id),
  building TEXT NOT NULL,
  room TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  is_safety INTEGER NOT NULL DEFAULT 0,
  priority TEXT CHECK (priority IN ('Low','Medium','High')),
  status TEXT NOT NULL DEFAULT 'Submitted'
    CHECK (status IN ('Submitted','Assigned','In Progress','On Hold','Completed')),
  technician_id INTEGER REFERENCES users(id),
  admin_note TEXT,
  completion_notes TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now','localtime')),
  completed_at TEXT
);

CREATE TABLE IF NOT EXISTS request_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  request_id INTEGER NOT NULL REFERENCES requests(id),
  status TEXT NOT NULL,
  note TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now','localtime'))
);