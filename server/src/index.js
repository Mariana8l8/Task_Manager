import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

import authRoutes from './routes/authRoutes.js';
import taskRoutes from './routes/taskRoutes.js';

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  })
);

// MongoDB Connection with retry logic
const connectDB = async (retryCount = 0) => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 5000,
    });
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error(`❌ MongoDB connection error: ${error.message}`);
    
    if (retryCount < 3) {
      console.log(`⏳ Retrying connection in 5 seconds... (attempt ${retryCount + 1}/3)`);
      setTimeout(() => connectDB(retryCount + 1), 5000);
    } else {
      console.error('✗ Failed to connect to MongoDB after 3 attempts');
      console.log('\n📌 MongoDB Setup Guide:');
      console.log('   1. For local MongoDB: Install and start MongoDB service');
      console.log('   2. For MongoDB Atlas (Free Cloud):');
      console.log('      - Go to: https://www.mongodb.com/cloud/atlas');
      console.log('      - Create free account and cluster');
      console.log('      - Get connection string and update .env');
      console.log('\nCurrent MONGODB_URI:', process.env.MONGODB_URI);
      process.exit(1);
    }
  }
};

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({ message: 'Server is running' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal server error' });
});

// Start server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();