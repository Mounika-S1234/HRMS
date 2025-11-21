// backend/src/models/index.js - Fully corrected model loading logic
'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';

const config = require(__dirname + '/../../config/config.json')[env]; 

// --- FIX IS HERE ---
// You must explicitly define the db object used to store models
const db = {}; 
// --- END FIX ---

let sequelize;
if (config.use_env_variable) {
    sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
    sequelize = new Sequelize(config.database, config.username, config.password, config);
}

fs
    .readdirSync(__dirname)
    .filter(file => {
        return (
            file.indexOf('.') !== 0 &&
            file !== basename &&
            file.slice(-3) === '.js' &&
            file.indexOf('.test.js') === -1 &&
            file !== 'associations.js' // Exclude our associations file
        );
    })
    .forEach(file => {
        // ... (Your existing model loading logic)
        const modelDefiner = require(path.join(__dirname, file));
        
        let model;
        if (typeof modelDefiner === 'function') {
            model = modelDefiner(sequelize, Sequelize.DataTypes);
        } else {
            modelDefiner.init(sequelize, Sequelize.DataTypes);
            model = modelDefiner;
        }
        // This line now works because db is defined:
        db[model.name] = model;
    });

// --- DO NOT RUN ASSOCIATIONS HERE ---

// Export all initialized models and the sequelize instance
module.exports = {
    ...db,
    sequelize,
    Sequelize
};