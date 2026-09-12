const bcrypt = require('bcrypt');
const { Counsellor, sequelize } = require('../models');

async function seed() {
  try {
    await sequelize.authenticate();
    
    const email = 'ig@gmail.com';
    const password = await bcrypt.hash('password', 10);
    
    const [counsellor, created] = await Counsellor.findOrCreate({
      where: { email },
      defaults: { 
        name: 'IG Counsellor',
        passwordHash: password,
        counsellorId: 'COUN-IG-01'
      }
    });
    
    if (created) {
      console.log('Counsellor created successfully: ig@gmail.com / password123');
    } else {
      console.log('Counsellor already exists. Updating password...');
      await counsellor.update({ passwordHash: password });
      console.log('Password reset to: password123');
    }
  } catch (error) {
    console.error('Error seeding counsellor:', error);
  } finally {
    process.exit(0);
  }
}

seed();
