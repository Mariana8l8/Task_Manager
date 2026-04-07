# MongoDB Setup Guide

## Option 1: MongoDB Atlas (Cloud - Recommended for Development)

MongoDB Atlas is free and requires no local installation.

### Steps:
1. Go to https://www.mongodb.com/cloud/atlas
2. Click "Start free"
3. Create an account with email
4. Create a new project
5. Create a cluster (free tier available)
6. Go to "Security" → "Database Access" → Create a database user
   - Username: `admin`
   - Password: `your-secure-password`
7. Go to "Network Access" → Add IP Address → "0.0.0.0/0" (for development)
8. Click "Connect" on your cluster
9. Choose "Drivers" → "Node.js"
10. Copy the connection string

### Connection String Format:
```
mongodb+srv://username:password@cluster.mongodb.net/task-manager?retryWrites=true&w=majority
```

### Update .env:
```
MONGODB_URI=mongodb+srv://admin:your-password@cluster.mongodb.net/task-manager?retryWrites=true&w=majority
```

---

## Option 2: Local MongoDB Installation

### Windows:
1. Download MongoDB Community Server: https://www.mongodb.com/try/download/community
2. Run the installer
3. Choose "Install as a Service"
4. MongoDB will start automatically
5. Keep default: `mongodb://localhost:27017/task-manager`

### macOS:
```bash
# Using Homebrew
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community

# Keep default: mongodb://localhost:27017/task-manager
```

### Linux (Ubuntu):
```bash
sudo apt-get install -y mongodb

# Keep default: mongodb://localhost:27017/task-manager
```

---

## Option 3: Docker (If you have Docker installed)

Create `docker-compose.yml` in the root directory:

```yaml
version: '3.8'

services:
  mongodb:
    image: mongo:latest
    container_name: task-manager-db
    ports:
      - "27017:27017"
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: password
    volumes:
      - mongodb_data:/data/db

volumes:
  mongodb_data:
```

Then run:
```bash
docker-compose up -d
```

Update .env:
```
MONGODB_URI=mongodb://admin:password@localhost:27017/task-manager?authSource=admin
```

---

## Option 4: MongoDB Community Edition (Windows - Easiest)

1. Download: https://www.mongodb.com/try/download/community-edition-windows
2. Run installer and choose "Install MongoDB as a Windows Service"
3. MongoDB starts automatically on port 27017
4. Keep `.env` as is: `mongodb://localhost:27017/task-manager`

---

## Testing Your Connection

Once you've set up MongoDB, test with:

```bash
# In the server directory
npm run dev
```

You should see: `✅ MongoDB connected successfully`

If you see `❌ MongoDB connection error:`, check:
1. MongoDB is running
2. Connection string in `.env` is correct
3. Credentials (if using Atlas) are accurate
4. Network access is allowed (Atlas: 0.0.0.0/0 for development)

---

## Quick Fix for Windows Users

If you don't want to install MongoDB locally, the easiest way is **MongoDB Atlas** (Option 1).

It's free and cloud-based - just need an email to sign up! ✨
