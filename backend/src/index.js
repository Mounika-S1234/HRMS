require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const { connectDB } = require('./db'); // Import connectDB from db.js

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.send('HRMS Backend is running!');
});

// Connect to the database and start the server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
});
