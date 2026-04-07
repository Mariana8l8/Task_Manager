# Task Manager - Full Stack Application

A complete full-stack Task Manager application built with **Node.js + Express** (backend) and **React + Vite** (frontend), featuring JWT authentication and MongoDB database.

## 🛠 Tech Stack

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication
- **bcrypt** - Password hashing

### Frontend
- **React** - UI library
- **Vite** - Build tool
- **TypeScript** - Type safety
- **Axios** - HTTP client
- **React Router** - Client-side routing

## 📁 Project Structure

```
root/
├── server/
│   ├── src/
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   └── Task.js
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   └── taskController.js
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   └── taskRoutes.js
│   │   ├── middleware/
│   │   │   └── authMiddleware.js
│   │   └── index.js
│   ├── .env
│   ├── .env.example
│   └── package.json
├── client/
│   ├── client/
│   │   ├── src/
│   │   │   ├── pages/
│   │   │   │   ├── Login.tsx
│   │   │   │   ├── Register.tsx
│   │   │   │   └── Tasks.tsx
│   │   │   ├── services/
│   │   │   │   └── api.ts
│   │   │   ├── styles/
│   │   │   │   ├── Auth.css
│   │   │   │   └── Tasks.css
│   │   │   ├── types/
│   │   │   │   └── index.ts
│   │   │   ├── App.tsx
│   │   │   ├── main.tsx
│   │   │   ├── index.css
│   │   │   └── App.css
│   │   ├── index.html
│   │   ├── vite.config.ts
│   │   ├── tsconfig.json
│   │   └── package.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v16 or higher)
- **npm** (v8 or higher)
- **MongoDB** (local or Atlas cloud)

### Installation

1. **Clone or navigate to the project directory**
   ```bash
   cd Test_Manager
   ```

2. **Install Backend Dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Install Frontend Dependencies**
   ```bash
   cd ../client/client
   npm install
   ```

### Configuration

1. **Backend Environment Setup**
   - Copy `.env.example` to `.env` in the server directory
   - Update MongoDB URI and JWT secret if needed
   ```bash
   cd server
   # Edit .env file with your configuration
   ```

   **Example .env file:**
   ```
   MONGODB_URI=mongodb://localhost:27017/task-manager
   JWT_SECRET=your_super_secret_jwt_key_here_change_in_production
   PORT=5000
   NODE_ENV=development
   ```

2. **Frontend Configuration**
   - The frontend is pre-configured to use `http://localhost:5000` for API calls
   - No additional configuration needed

### Running the Application

#### Start MongoDB (if running locally)
```bash
# On Windows (if using MongoDB community edition)
mongod
```

#### Terminal 1: Start Backend Server
```bash
cd server
npm run dev
```
The backend will run on `http://localhost:5000`

#### Terminal 2: Start Frontend Development Server
```bash
cd client/client
npm run dev
```
The frontend will run on `http://localhost:5173`

### Access the Application
Open your browser and navigate to: `http://localhost:5173`

## 📋 API Endpoints

### Authentication

#### Register User
```
POST /api/auth/register
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "password123",
  "passwordConfirm": "password123"
}

Response: { token, user }
```

#### Login User
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}

Response: { token, user }
```

### Tasks (Requires Authentication)

#### Get All Tasks
```
GET /api/tasks
Authorization: Bearer <token>

Response: { tasks: Task[] }
```

#### Create Task
```
POST /api/tasks
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Complete project",
  "description": "Finish the full-stack application"
}

Response: { task: Task }
```

#### Delete Task
```
DELETE /api/tasks/:id
Authorization: Bearer <token>

Response: { message: "Task deleted successfully" }
```

## 🔐 Authentication Flow

1. **User Registration**
   - User enters username, email, password
   - Password is hashed with bcrypt
   - User is created in MongoDB
   - JWT token is returned

2. **User Login**
   - User enters email and password
   - Password is verified against hashed password
   - JWT token is issued with 7-day expiration
   - Token is stored in localStorage

3. **Authenticated Requests**
   - Frontend sends token in Authorization header: `Bearer <token>`
   - Backend middleware verifies token
   - User ID is extracted from token and attached to request
   - Only user's own tasks are accessible

## 🛡️ Security Features

- **Password Hashing**: bcrypt with salt rounds (10)
- **JWT Authentication**: 7-day token expiration
- **CORS**: Configured for frontend at `http://localhost:5173`
- **Middleware Protection**: All task routes require authentication
- **User Isolation**: Users can only access their own tasks

## 📝 Features

- ✅ User registration and login
- ✅ JWT-based authentication
- ✅ Create tasks
- ✅ View all user tasks
- ✅ Delete tasks
- ✅ Persistent token storage in localStorage
- ✅ Automatic logout on token expiration
- ✅ Error handling and validation

## 🐛 Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running
- Check MONGODB_URI in .env file
- For local MongoDB: `mongodb://localhost:27017/task-manager`
- For MongoDB Atlas: `mongodb+srv://username:password@cluster.mongodb.net/task-manager`

### CORS Errors
- Frontend must run on `http://localhost:5173`
- Backend CORS is configured to accept requests from this origin
- Check that both servers are running on correct ports

### Token Expiration
- Tokens expire after 7 days
- User will be automatically logged out
- User must login again to continue

### Port Already in Use
- Backend (5000): Change PORT in .env file
- Frontend (5173): Vite will automatically use next available port

## 🚢 Production Deployment

### Backend Deployment
1. Set `NODE_ENV=production`
2. Update MONGODB_URI for production database
3. Generate secure JWT_SECRET
4. Use environment variables for sensitive data
5. Deploy to Heroku, AWS, DigitalOcean, etc.

### Frontend Deployment
1. Build the frontend: `npm run build`
2. Deploy the `dist/` folder to:
   - Vercel
   - Netlify
   - GitHub Pages
   - AWS S3 + CloudFront
3. Update API_BASE_URL to production backend URL

## 📚 Code Quality

- ✅ Clean architecture (controllers/services separation)
- ✅ No code duplication
- ✅ Clear naming conventions
- ✅ Async/await for all async operations
- ✅ Proper error handling with try/catch
- ✅ HTTP status code conventions
- ✅ TypeScript for frontend type safety
- ✅ Middleware pattern for auth protection

## 📄 License

MIT

---

**For questions or issues, please refer to the code comments or check the API endpoints documentation above.**
