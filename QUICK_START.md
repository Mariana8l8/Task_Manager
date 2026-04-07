# 🚀 Quick Start Guide

## ⚡ 5-Minute Setup

### Prerequisites
- Node.js installed (v16+)
- MongoDB running (see options below)

### MongoDB Setup (Choose One)

#### Option A: MongoDB Community (Windows) - Easiest
1. Download: https://www.mongodb.com/try/download/community-edition
2. Run installer, choose "Install MongoDB as Windows Service"
3. Done! MongoDB starts automatically. Use `.env` as-is.

#### Option B: MongoDB Atlas (Cloud - No Installation, Free)
1. Go to: https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create a cluster (click "Create" in UI)
4. Create database user: admin / password
5. Add IP whitelist: 0.0.0.0/0 (for development)
6. Get connection string from "Connect" → "Drivers"
7. Update `.env`:
   ```
   MONGODB_URI=mongodb+srv://admin:password@cluster.mongodb.net/task-manager?retryWrites=true&w=majority
   ```

#### Option C: Docker
Run in project root:
```bash
docker-compose up -d
```

---

## 🎯 Start Application

### Terminal 1: Backend
```bash
cd server
npm install
npm run dev
```
✅ Backend ready on `http://localhost:5000`

### Terminal 2: Frontend (new terminal)
```bash
cd client/client
npm install
npm run dev
```
✅ Frontend ready on `http://localhost:5173`

### Open in Browser
```
http://localhost:5173
```

---

## 🔑 Test Credentials

Register a new account or use any credentials.

Example:
- **Username:** testuser
- **Email:** test@example.com
- **Password:** password123

---

## ❌ Troubleshooting

### "MongoDB connection error"
**Solution:** Start MongoDB
- Windows: Run `mongod` or start MongoDB Service
- Mac: `brew services start mongodb-community`
- Docker: `docker-compose up -d`
- Cloud: Update MongoDB Atlas connection string in `.env`

See `MONGODB_SETUP.md` for detailed instructions.

### "Port 5173/5000 already in use"
- Backend: Change PORT in `server/.env`
- Frontend: Vite will automatically use next port

### "Token expired" 
- Tokens last 7 days
- Clear localStorage and re-login

### Still stuck?
1. Check `README.md` for full documentation
2. Check `MONGODB_SETUP.md` for MongoDB help
3. Verify both servers are running
4. Check browser console (F12) for errors

---

## 📚 Key Files

- `server/src/index.js` - Backend server
- `client/client/src/App.tsx` - Frontend app
- `server/.env` - Backend config
- `README.md` - Full documentation
- `MONGODB_SETUP.md` - Database setup guide

---

## 🎉 You're Done!

Your Task Manager is ready. Register, login, and create tasks! 🚀
