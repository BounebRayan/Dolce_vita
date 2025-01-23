const mongoose = require('mongoose');

const mongoURI = process.env.mongoURI;

// Function to connect to MongoDB
const connectToDB = async (options) => {
  try {
    await mongoose.connect(mongoURI, options);
  } catch (error) {
    console.error('Failed to connect to the database:', error);
    process.exit(1);
  }
};

module.exports = connectToDB;