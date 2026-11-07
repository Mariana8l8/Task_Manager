// Local entry point. On Vercel the platform serves src/app.js directly.
import 'dotenv/config';
import app from './app.js';
import connectDB from './db.js';

const PORT = process.env.PORT || 5001;
const MAX_ATTEMPTS = 3;

const connectWithRetry = async () => {
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
    try {
      await connectDB();
      console.log('✅ MongoDB connected successfully');
      return;
    } catch (error) {
      console.error(`❌ Attempt ${attempt}: ${error.message}`);
      if (attempt === MAX_ATTEMPTS) {
        process.exit(1);
      }
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
  }
};

await connectWithRetry();

const server = app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use`);
  } else {
    console.error(err);
  }
});
