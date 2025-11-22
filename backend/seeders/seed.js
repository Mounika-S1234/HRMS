// backend/seeders/seed.js
const bcrypt = require('bcryptjs');
const { sequelize, Organisation, User, Employee, Team, EmployeeTeam, Log } = require('../src/models/associations');

async function seedDatabase(){
  try {
    await sequelize.authenticate();
    console.log('✓ Database connection established');

    // Sync all models
    await sequelize.sync({ alter: true });
    console.log('✓ Database synced');

    // Clear existing data
    await EmployeeTeam.destroy({ where: {} });
    await Employee.destroy({ where: {} });
    await Team.destroy({ where: {} });
    await User.destroy({ where: {} });
    await Organisation.destroy({ where: {} });
    await Log.destroy({ where: {} });
    console.log('✓ Cleared existing data');

    // Create organisation
    const org = await Organisation.create({
      name: 'Test Company'
    });
    console.log(`✓ Created organisation: ${org.name}`);

    // Create admin user
    const adminPassword = await bcrypt.hash('password123', 10);
    const adminUser = await User.create({
      organisation_id: org.id,
      name: 'Admin User',
      email: 'admin@testcompany.com',
      password_hash: adminPassword
    });
    console.log(`✓ Created admin user: ${adminUser.email}`);

    // Create test user
    const testPassword = await bcrypt.hash('password123', 10);
    const testUser = await User.create({
      organisation_id: org.id,
      name: 'Test User',
      email: 'mounikasm08@gmail.com',
      password_hash: testPassword
    });
    console.log(`✓ Created test user: ${testUser.email}`);

    // Create employees
    const employees = await Employee.bulkCreate([
      {
        organisation_id: org.id,
        first_name: 'Alice',
        last_name: 'Johnson',
        email: 'alice@testcompany.com',
        phone: '555-0001'
      },
      {
        organisation_id: org.id,
        first_name: 'Bob',
        last_name: 'Smith',
        email: 'bob@testcompany.com',
        phone: '555-0002'
      },
      {
        organisation_id: org.id,
        first_name: 'Carol',
        last_name: 'White',
        email: 'carol@testcompany.com',
        phone: '555-0003'
      }
    ]);
    console.log(`✓ Created ${employees.length} employees`);

    // Create teams
    const teams = await Team.bulkCreate([
      {
        organisation_id: org.id,
        name: 'Engineering',
        description: 'Software development team'
      },
      {
        organisation_id: org.id,
        name: 'Marketing',
        description: 'Marketing and communications team'
      },
      {
        organisation_id: org.id,
        name: 'Sales',
        description: 'Sales and business development team'
      }
    ]);
    console.log(`✓ Created ${teams.length} teams`);

    // Assign employees to teams
    await EmployeeTeam.create({
      employee_id: employees[0].id,
      team_id: teams[0].id
    });
    await EmployeeTeam.create({
      employee_id: employees[1].id,
      team_id: teams[0].id
    });
    await EmployeeTeam.create({
      employee_id: employees[2].id,
      team_id: teams[1].id
    });
    console.log('✓ Assigned employees to teams');

    // Create sample logs
    await Log.create({
      organisation_id: org.id,
      user_id: adminUser.id,
      action: 'org_created',
      meta: { orgName: org.name }
    });
    await Log.create({
      organisation_id: org.id,
      user_id: adminUser.id,
      action: 'user_created',
      meta: { userId: testUser.id, email: testUser.email }
    });
    console.log('✓ Created sample logs');

    console.log('\n✅ Database seeding completed successfully!');
    console.log('\nTest Credentials:');
    console.log('  Email: mounikasm08@gmail.com');
    console.log('  Password: password123');
    console.log('\nAdmin Credentials:');
    console.log('  Email: admin@testcompany.com');
    console.log('  Password: password123');

    await sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    await sequelize.close();
    process.exit(1);
  }
}

seedDatabase();
