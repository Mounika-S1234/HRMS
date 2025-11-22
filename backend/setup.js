#!/usr/bin/env node

// backend/setup.js
// Run this script to set up the database

const fs = require('fs');
const path = require('path');

console.log('\n🔧 HRMS Database Setup Script\n');

// Check .env file
const envPath = path.join(__dirname, '.env');
if (!fs.existsSync(envPath)) {
  console.error('❌ .env file not found at:', envPath);
  console.log('Creating .env file...\n');
  
  const envContent = `NODE_ENV=development
PORT=5000

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASS=postgres
DB_NAME=hrms_db

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_12345
`;
  
  fs.writeFileSync(envPath, envContent);
  console.log('✅ .env file created with default values');
  console.log('   Update DB credentials if needed!\n');
} else {
  console.log('✅ .env file exists\n');
}

// Check if models exist
const modelsDir = path.join(__dirname, 'src', 'models');
const models = fs.readdirSync(modelsDir).filter(f => f.endsWith('.js') && f !== 'index.js' && f !== 'associations.js');
console.log(`✅ Found ${models.length} model files:`);
models.forEach(m => console.log(`   - ${m}`));

// Check package.json
const pkgPath = path.join(__dirname, 'package.json');
if (fs.existsSync(pkgPath)) {
  console.log('\n✅ package.json found\n');
} else {
  console.error('❌ package.json not found!\n');
}

console.log('✅ Setup check completed!\n');
console.log('Next steps:');
console.log('1. Make sure PostgreSQL is running');
console.log('2. Create database: CREATE DATABASE hrms_db;');
console.log('3. Run: npm install');
console.log('4. Run: npm start\n');
