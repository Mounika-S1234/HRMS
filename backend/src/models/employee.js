// backend/src/models/employee.js - CORRECT FUNCTIONAL EXPORT

module.exports = (sequelize, DataTypes) => {
    // sequelize is now guaranteed to be defined here!
    const Employee = sequelize.define('Employee', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        organisation_id: {
            type: DataTypes.UUID, // Assuming UUID is consistent
            allowNull: false,
        },
        first_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        last_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
            validate: {
                isEmail: true,
            },
        },
        job_title: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        // ... include any other fields you have
    }, {
        tableName: 'employees',
        timestamps: true,
    });
    
    // Associations (if any) go here, or remain in associations.js
    
    return Employee;
};