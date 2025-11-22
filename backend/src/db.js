const { Sequelize } = require("sequelize");
const path = require("path");
require("dotenv").config();

let sequelize;

// Use SQLite by default, or PostgreSQL if DB_HOST is explicitly set
if (process.env.DB_HOST && process.env.DB_HOST.trim()) {
  console.log('🐘 Using PostgreSQL...');
  sequelize = new Sequelize(
    process.env.DB_NAME || 'hrms_db',
    process.env.DB_USER || 'postgres',
    process.env.DB_PASS || 'postgres',
    {
      host: process.env.DB_HOST,
      dialect: "postgres",
      port: process.env.DB_PORT || 5432
    }
  );
} else {
  console.log('📁 Using SQLite...');
  const dbPath = path.join(__dirname, '..', '..', 'hrms.sqlite');
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: dbPath,
    logging: false,
  });
}

async function connectDB() {
  try {
    await sequelize.authenticate();
    const dbType = process.env.DB_HOST && process.env.DB_HOST.trim() ? 'PostgreSQL' : 'SQLite';
    console.log(`✅ ${dbType} database connected successfully.`);
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
    
    // If PostgreSQL fails, try SQLite as fallback
    if (process.env.DB_HOST && process.env.DB_HOST.trim()) {
      console.log('📁 Falling back to SQLite...');
      const dbPath = path.join(__dirname, '..', '..', 'hrms.sqlite');
      sequelize = new Sequelize({
        dialect: 'sqlite',
        storage: dbPath,
        logging: false,
      });
      
      try {
        await sequelize.authenticate();
        console.log('✅ SQLite database connected successfully.');
      } catch (fallbackError) {
        console.error('❌ SQLite fallback also failed:', fallbackError.message);
        process.exit(1);
      }
    } else {
      process.exit(1);
    }
  }
}

module.exports = { sequelize, connectDB };
