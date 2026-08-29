const bcrypt = require('bcrypt');
const { Admin, sequelize } = require('../models');

async function seed() {
  try {
    await sequelize.authenticate();
    
    const email = 'admin@spinfyot.com';
    const password = await bcrypt.hash('admin123', 10);
    
    const [admin, created] = await Admin.findOrCreate({
      where: { email },
      defaults: { password }
    });
    
    if (created) {
      console.log('Admin created successfully: admin@spinfyot.com / admin123');
    } else {
      console.log('Admin already exists.');
    }
  } catch (error) {
    console.error('Error seeding admin:', error);
  } finally {
    process.exit(0);
  }
}

seed();
