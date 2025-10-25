const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Missing MongoDB URI environment variable');
}

// Function to connect to MongoDB
const connectToDB = async (options) => {
  try {
    await mongoose.connect(MONGODB_URI, options);
  } catch (error) {
    console.error('Failed to connect to the database:', error);
    process.exit(1);
  }
};

module.exports = connectToDB;