// backend/src/initdb.js
// This script initializes the database tables automatically

require('dotenv').config();
const { sequelize } = require('./db');

const initializeDatabase = async () => {
  try {
    console.log('🔄 Synchronizing database schema...');
    
    // This will create all tables defined in models if they don't exist
    await sequelize.sync({ alter: false });
    
    console.log('✅ Database schema synchronized successfully!');
    console.log('📊 Tables created:');
    console.log('  - organisations');
    console.log('  - users');
    console.log('  - employees');
    console.log('  - teams');
    console.log('  - employee_teams');
    console.log('  - logs');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Database initialization failed:', error.message);
    process.exit(1);
  }
};

// Call the function
initializeDatabase();
