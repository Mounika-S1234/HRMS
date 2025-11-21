// backend/src/models/log.js - CORRECT FUNCTIONAL EXPORT
module.exports = (sequelize, DataTypes) => {
    const Log = sequelize.define('Log', {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        // NOTE: Changed INTEGER references to UUID to match Org/Employee ID types if they are UUID
        organisation_id: { type: DataTypes.UUID, allowNull: false }, 
        user_id: { type: DataTypes.UUID, allowNull: true }, 
        action: { type: DataTypes.STRING(255), allowNull: false },
        meta: { type: DataTypes.JSONB, allowNull: true },
        timestamp: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    }, { 
        tableName: 'logs', 
        timestamps: false 
    });
    return Log;
};