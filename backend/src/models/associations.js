// backend/src/models/associations.js

// Import all models and the Sequelize instance
const { Organisation, User, Employee, Team, Log, EmployeeTeam, sequelize } = require('./index');

// --- 1. Define Associations ---

// Organisation Associations
Organisation.hasMany(User, { foreignKey: 'organisation_id', onDelete: 'CASCADE' });
Organisation.hasMany(Employee, { foreignKey: 'organisation_id', onDelete: 'CASCADE' });
Organisation.hasMany(Team, { foreignKey: 'organisation_id', onDelete: 'CASCADE' });
Organisation.hasMany(Log, { foreignKey: 'organisation_id', onDelete: 'CASCADE' });

// User Associations (Admin users who belong to an org)
User.belongsTo(Organisation, { foreignKey: 'organisation_id' });
User.hasMany(Log, { foreignKey: 'user_id' }); // Users perform actions that are logged

// Employee Associations
Employee.belongsTo(Organisation, { foreignKey: 'organisation_id' });

// Team Associations
Team.belongsTo(Organisation, { foreignKey: 'organisation_id' });

// --- Many-to-Many: Employee <-> Team ---
Employee.belongsToMany(Team, {
    through: EmployeeTeam,
    foreignKey: 'employee_id',
    otherKey: 'team_id',
});
Team.belongsToMany(Employee, {
    through: EmployeeTeam,
    foreignKey: 'team_id',
    otherKey: 'employee_id',
});


// Export models with associations defined
module.exports = {
    Organisation,
    User,
    Employee,
    Team,
    Log,
    EmployeeTeam,
    sequelize // Also export sequelize instance for transactions
};