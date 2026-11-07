import mongoose from 'mongoose';

let connectionPromise = null;

// Serverless instances handle many requests, so one connection is reused
// between them. A failed attempt is forgotten so the next request can retry.
const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return;
  }

  if (!connectionPromise || mongoose.connection.readyState === 0) {
    const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error('MONGO_URI is not configured');
    }

    connectionPromise = mongoose
      .connect(mongoUri, { serverSelectionTimeoutMS: 5000 })
      .catch((error) => {
        connectionPromise = null;
        throw error;
      });
  }

  await connectionPromise;
};

export default connectDB;
