// backend/src/models/user.js - CORRECT FUNCTIONAL EXPORT
module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        id: { 
            type: DataTypes.UUID, // Using UUID to be consistent
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        organisation_id: { 
            type: DataTypes.UUID, 
            allowNull: false
        },
        email: { type: DataTypes.STRING(255), unique: true, allowNull: false },
        password_hash: { type: DataTypes.STRING(255), allowNull: false },
        name: { type: DataTypes.STRING(255) },
        // Remove created_at if using Sequelize timestamps
    }, { 
        tableName: 'users',
        timestamps: true
    });
    return User;
};