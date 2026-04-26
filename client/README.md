# Task Manager Frontend

React + TypeScript + Vite frontend for Task Manager.

## Run
```bash
npm install
npm run dev
```

Default URL: `http://localhost:5173`

## Environment
Optional `.env`:
```bash
VITE_API_BASE_URL=http://localhost:5001/api
```

## Routes
- `/login`
- `/register`
- `/tasks` (authenticated)
- `/admin` (admin only)

## Features
User:
- CRUD tasks
- Complete/uncomplete
- Move up/down
- Filter (all/active/completed)
- Search tasks
- Sort tasks

Admin:
- Dashboard with stats
- Users management table
- Change role
- Block/unblock
- Delete user

## API used by frontend
- `POST /auth/register`
- `POST /auth/login`
- `GET /auth/me`
- `GET /tasks`
- `POST /tasks`
- `PATCH /tasks/:id`
- `PATCH /tasks/:id/move`
- `DELETE /tasks/:id`
- `GET /admin/users`
- `GET /admin/stats`
- `PATCH /admin/users/:id/role`
- `PATCH /admin/users/:id/status`
- `DELETE /admin/users/:id`

All routes are resolved against `VITE_API_BASE_URL`.

## Scripts
- `npm run dev`
- `npm run lint`
- `npm run build`
- `npm run preview`

## Security Note
JWT is stored in `localStorage` in this project. For production consider `httpOnly` cookies.
