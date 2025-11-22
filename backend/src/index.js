require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const cors = require('cors');
const { errorHandler } = require('./middlewares/errorHandler');

// Import routes
const authRoutes = require('./routes/auth');
const employeeRoutes = require('./routes/employees');
const teamRoutes = require('./routes/teams');
const logsRoutes = require('./routes/logs');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
  res.send('HRMS Backend is running!');
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/logs', logsRoutes);

// Error handling middleware (must be last)
app.use(errorHandler);

// Initialize database and start server
async function startServer() {
  try {
    // Import and initialize database connection
    const { connectDB, sequelize } = require('./db');
    await connectDB();
    
    // Import models and associations AFTER db is initialized
    require('./models/associations');
    
    // Synchronize database schema
    await sequelize.sync({ alter: false });
    console.log('✅ Database tables synchronized');
    
    // Start listening
    app.listen(PORT, () => {
      console.log(`🚀 Server listening on port ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message || error);
    process.exit(1);
  }
}

// Start the server
startServer();
