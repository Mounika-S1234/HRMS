// backend/src/models/employeeTeam.js (Corrected)

module.exports = (sequelize, DataTypes) => {
    // Note: The primary keys here should match the types in your tables (UUID or INTEGER)
    const EmployeeTeam = sequelize.define('EmployeeTeam', {
        id: { 
            type: DataTypes.INTEGER, 
            primaryKey: true, 
            autoIncrement: true 
        },
        employee_id: { 
            type: DataTypes.UUID, // Assuming you use UUIDs based on employee.js
            allowNull: false
        },
        team_id: { 
            type: DataTypes.UUID, // Assuming you use UUIDs for teams
            allowNull: false
        },
        assigned_at: { 
            type: DataTypes.DATE, 
            defaultValue: DataTypes.NOW 
        },
    }, { 
        tableName: 'employee_teams',
        timestamps: false // Typically, join tables don't need timestamps
    });

    return EmployeeTeam;
};