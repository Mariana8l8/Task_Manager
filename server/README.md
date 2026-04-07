# Task Manager API - Backend

Node.js + Express backend for the Task Manager application with MongoDB database and JWT authentication.

## 🚀 Quick Start

### Prerequisites
- Node.js v16+
- npm v8+
- MongoDB (local or Atlas)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```bash
cp .env.example .env
```

3. Update `.env` with your configuration:
```
MONGODB_URI=mongodb://localhost:27017/task-manager
JWT_SECRET=your_secret_key
PORT=5000
NODE_ENV=development
```

4. Start the server:
```bash
npm run dev
```

The server will run on `http://localhost:5000`

## 📁 Directory Structure

- `src/models` - Mongoose schemas (User, Task)
- `src/controllers` - Route handlers (auth, tasks)
- `src/routes` - API routes
- `src/middleware` - Custom middleware (JWT auth)
- `src/index.js` - Server entry point

## 🔌 API Endpoints

All task endpoints require JWT authentication.

### Auth
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Tasks
- `GET /api/tasks` - Get all user tasks
- `POST /api/tasks` - Create new task
- `DELETE /api/tasks/:id` - Delete task

### Health Check
- `GET /api/health` - Server health check

## 🔐 Authentication

All requests to `/api/tasks` must include:
```
Authorization: Bearer <token>
```

The token is returned after login/register and expires in 7 days.

## 📦 Dependencies

- **express** - Web framework
- **mongoose** - MongoDB ODM
- **jsonwebtoken** - JWT token creation
- **bcrypt** - Password hashing
- **cors** - Cross-origin resource sharing
- **dotenv** - Environment variables

## 🎯 Features

- ✅ User registration with email validation
- ✅ Secure login with bcrypt password hashing
- ✅ JWT-based authentication
- ✅ Create/read/delete tasks
- ✅ User-isolated tasks
- ✅ Error handling with proper status codes
- ✅ Async/await throughout
- ✅ MongoDB integration

## 📝 Environment Variables

```
MONGODB_URI       - MongoDB connection string
JWT_SECRET        - Secret for JWT signing
PORT              - Server port (default: 5000)
NODE_ENV          - Environment (development/production)
```

## 🧪 Testing

Endpoints can be tested with curl, Postman, or any HTTP client.

### Register Example
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"user","email":"user@example.com","password":"pass123","passwordConfirm":"pass123"}'
```

### Login Example
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"pass123"}'
```

### Get Tasks (replace TOKEN)
```bash
curl -X GET http://localhost:5000/api/tasks \
  -H "Authorization: Bearer TOKEN"
```

## 💡 Code Quality

- Async/await for all asynchronous operations
- Proper error handling with try/catch blocks
- HTTP status codes (201, 400, 401, 404, 500)
- Clean separation of concerns
- No callback hell
- Input validation
- Secure password hashing

## 🚢 Production Checklist

- [ ] Set NODE_ENV to production
- [ ] Use strong JWT_SECRET
- [ ] Update MONGODB_URI for production DB
- [ ] Configure CORS for frontend domain
- [ ] Add rate limiting
- [ ] Enable HTTPS
- [ ] Set secure MongoDB credentials
- [ ] Add request validation middleware
- [ ] Implement logging
- [ ] Set up error tracking

---

For more information, see the main [README.md](../README.md)
