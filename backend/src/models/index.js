// backend/src/models/index.js - Fully corrected model loading logic
'use strict';

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);

const { sequelize } = require('../db');

const db = {};

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
        const modelDefiner = require(path.join(__dirname, file));
        
        let model;
        if (typeof modelDefiner === 'function') {
            model = modelDefiner(sequelize, Sequelize.DataTypes);
        } else {
            modelDefiner.init(sequelize, Sequelize.DataTypes);
            model = modelDefiner;
        }
        db[model.name] = model;
    });

module.exports = {
    ...db,
    sequelize,
    Sequelize
};