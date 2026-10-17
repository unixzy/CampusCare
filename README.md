# CampusCare - Campus Maintenance Request System

CampusCare lets students, faculty and staff report campus maintenance problems and track them until they are fixed. A maintenance admin assigns and prioritizes requests, and technicians update the job status.

## Team Members
- Relleve, Jillian Mae G.
- Tabornal, Russel Jade
- Tanay, Euniece I.

## Assigned System
Campus Maintenance Request System (Midterm Project, Round 1)

## Features
- Signup and login with sessions and logout
- Three roles: requester, technician, admin
- Technician accounts require admin approval before they can log in
- Admin Manage Users page: approve, deactivate, reactivate accounts
- Deactivated users lose access immediately
- Role-based access control (restricted pages return 403 or redirect to login)
- Input validation with clear error messages
- Passwords hashed with bcrypt
- Requester: submit requests, tracking number, view own requests *(update when merged)*
- Admin: request queue, set priority, assign technician, reports *(update when merged)*
- Technician: view assigned jobs, update status and completion notes *(update when merged)*

## Technologies
Node.js, Express, EJS, SQLite (better-sqlite3), express-session, bcryptjs, dotenv, HTML, CSS, JavaScript, Git and GitHub

## Installation
```bash
git clone <repository-url>
cd campuscare
npm install
```

## Configuration
Copy the example file and edit it:
```bash
# Windows
copy .env.example .env
# Mac/Linux
cp .env.example .env
```
Set `SESSION_SECRET` in `.env` to any long random text. `.env` is never committed.

## Database Setup
The SQLite database (`campuscare.db`) is created automatically on first run from `db/schema.sql`. Load the test accounts with:
```bash
npm run seed
```
To reset the database, stop the server, delete `campuscare.db`, then run `npm run seed` again.

## How to Run
```bash
npm run dev     # development (auto-restart)
npm start       # normal start
```
Open http://localhost:3000

## Test Accounts
| Role | Email | Password |
|---|---|---|
| Admin | admin@campus.edu | Admin123! |
| Requester | requester@campus.edu | Requester123! |
| Technician (active) | annecruz@campus.edu | Tech123! |
| Technician (pending approval) | markreyes@campus.edu | Tech123! |

These are demo accounts for testing only.

## Project Structure