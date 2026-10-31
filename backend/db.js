const mongoose = require('mongoose');

/**
 * Connect to MongoDB Atlas
 * Connects to the 'student_management' database
 */
const connectDB = async () => {
  // Support both MONGO_URI and MONGODB_URI environment variables
  const uri = process.env.MONGO_URI || process.env.MONGODB_URI;

  if (!uri) {
    throw new Error('Database connection string is missing in environment variables (MONGO_URI or MONGODB_URI).');
  }

  try {
    const conn = await mongoose.connect(uri, {
      dbName: 'student_management',
    });
    console.log(`[Database] MongoDB Atlas Connected Successfully!`);
    console.log(`[Database] Host: ${conn.connection.host}`);
    console.log(`[Database] Database Name: ${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error(`[Database Error] MongoDB Atlas connection error: ${error.message}`);
    throw error;
  }
};

module.exports = connectDB;
