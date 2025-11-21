// backend/src/models/team.js - CORRECT FUNCTIONAL EXPORT
module.exports = (sequelize, DataTypes) => {
    const Team = sequelize.define('Team', {
        id: { 
            type: DataTypes.UUID, // Using UUID to be consistent with Organisation/Employee
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        organisation_id: { 
            type: DataTypes.UUID, 
            allowNull: false
        },
        name: { type: DataTypes.STRING(255), allowNull: false },
        description: { type: DataTypes.TEXT },
        // Sequelize adds createdAt/updatedAt if timestamps: true (default)
        // You can remove created_at if using Sequelize timestamps
    }, { 
        tableName: 'teams',
        timestamps: true // Set to true if you want Sequelize's defaults
    });
    return Team;
};