// backend/src/models/organisation.js - CORRECT FUNCTIONAL EXPORT

module.exports = (sequelize, DataTypes) => {
    const Organisation = sequelize.define('Organisation', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        // ... any other organization fields
    }, {
        tableName: 'organisations',
        timestamps: true,
    });
    
    return Organisation;
};