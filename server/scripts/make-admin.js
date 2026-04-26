import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../src/models/User.js';

dotenv.config();

const run = async () => {
  const email = process.argv[2] || process.env.ADMIN_EMAIL;

  if (!email) {
    console.error('Usage: npm run make-admin -- user@example.com');
    process.exit(1);
  }

  const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;

  if (!mongoUri) {
    console.error('MONGO_URI is not configured');
    process.exit(1);
  }

  await mongoose.connect(mongoUri);

  const normalizedEmail = String(email).trim().toLowerCase();
  const user = await User.findOne({ email: normalizedEmail });

  if (!user) {
    console.error(`User not found: ${normalizedEmail}`);
    process.exit(1);
  }

  user.role = 'admin';
  user.isActive = true;
  await user.save();

  console.log(`User promoted to admin: ${user.email}`);
  await mongoose.disconnect();
};

run().catch(async (error) => {
  console.error(error.message);
  try {
    await mongoose.disconnect();
  } catch {
    // ignore
  }
  process.exit(1);
});
