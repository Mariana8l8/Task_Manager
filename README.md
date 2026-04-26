# Task Manager (React + Node + MongoDB)

Full-stack task manager with JWT authentication, RBAC (`user` / `admin`), admin panel, and task productivity features.

## Tech Stack
- Frontend: React, TypeScript, Vite, Axios, React Router
- Backend: Node.js, Express, Mongoose, JWT, bcrypt
- Database: MongoDB

## Main Features
- JWT auth: register, login, session check (`/api/auth/me`)
- RBAC: role-based access (`user`, `admin`)
- User tasks:
  - create, edit, delete
  - mark completed
  - reorder (up/down)
  - filter (all/active/completed)
  - search
  - sort (position/newest/oldest/title)
- Admin panel:
  - users list with search and pagination
  - change role
  - block/unblock user
  - delete user
  - platform stats

## Quick Start
```bash
cd server && npm install
cd ../client && npm install
```

Create env:
```bash
cp server/.env.example server/.env
cp client/.env.example client/.env
```

Run backend:
```bash
cd server
npm run dev
```

Run frontend:
```bash
cd client
npm run dev
```

Frontend: `http://localhost:5173`  
Backend: `http://localhost:5001`

## Create First Admin
1. Register a regular user from UI.
2. Promote user:
```bash
cd server
npm run make-admin -- user@example.com
```

## API Summary
Base URL: `/api`

Auth:
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`

Tasks (authenticated user/admin):
- `GET /api/tasks`
- `POST /api/tasks`
- `PATCH /api/tasks/:id`
- `PATCH /api/tasks/:id/move`
- `DELETE /api/tasks/:id`

Admin only:
- `GET /api/admin/users?page=1&limit=10&search=`
- `GET /api/admin/users/:id`
- `PATCH /api/admin/users/:id/role`
- `PATCH /api/admin/users/:id/status`
- `DELETE /api/admin/users/:id`
- `GET /api/admin/stats`

Health:
- `GET /api/health`

## JWT Structure
JWT payload contains:
- `userId`
- `role`
- `iat`, `exp`

## Quality Checks
Backend:
```bash
cd server
npm run check
```

Frontend:
```bash
cd client
npm run lint
npm run build
```

## Security Note
Current implementation stores JWT in `localStorage` (acceptable for this pet-project).  
For production, prefer `httpOnly` secure cookies + refresh-token rotation + CSRF protection.

## Next Improvements
- Transactional reorder to reduce race conditions
- Integration tests for full auth/admin/task flows
- CI pipeline (lint + build + tests)
