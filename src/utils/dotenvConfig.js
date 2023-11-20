import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

export default {
  PORT: process.env.PORT,
  MONGODB_URI: process.env.MONGODB_URI,
  // Add other environment variables you need
};