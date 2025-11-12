const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI;
    if (!uri) {
      console.warn('MONGO_URI not set in environment - running without database');
      return;
    }
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('MongoDB connected successfully');
  } catch (err) {
    console.error('Failed to connect to MongoDB:', err.message);
    console.warn('Continuing without database - API endpoints may not work');
    // Don't exit, allow server to start without DB
  }
};

module.exports = connectDB;
