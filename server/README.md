# Task Manager API

Express + MongoDB API with JWT authentication and RBAC.

## Run
```bash
npm install
cp .env.example .env
npm run dev
```

Default URL: `http://localhost:5001`

## Environment Variables
- `MONGO_URI`
- `JWT_SECRET`
- `PORT`
- `NODE_ENV`
- `CORS_ORIGIN`
- `ADMIN_EMAIL` (optional for helper script)

## Promote User to Admin
```bash
npm run make-admin -- user@example.com
```

## Access Model
- `authenticateJWT`: validates token and active account
- `authorizeRoles('admin')`: protects admin endpoints

## Endpoints
Base prefix: `/api`

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`

### Tasks (authenticated)
- `GET /api/tasks`
- `POST /api/tasks`
- `PATCH /api/tasks/:id`
- `PATCH /api/tasks/:id/move`
- `DELETE /api/tasks/:id`

### Admin (admin role only)
- `GET /api/admin/users`
- `GET /api/admin/users/:id`
- `PATCH /api/admin/users/:id/role`
- `PATCH /api/admin/users/:id/status`
- `DELETE /api/admin/users/:id`
- `GET /api/admin/stats`

## Scripts
- `npm run dev`
- `npm run start`
- `npm run test`
- `npm run check`
- `npm run make-admin -- <email>`

## Notes
- JWT payload includes `userId` and `role`.
- Admin cannot delete/deactivate/demote own account.
- `Task` model contains indexes for `userId`, `position`, `isCompleted`.
