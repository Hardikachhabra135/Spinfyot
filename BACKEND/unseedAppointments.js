const { Appointment, sequelize } = require('./models');

async function unseedAppointments() {
  try {
    await sequelize.authenticate();
    console.log('Connected to DB');

    const emailsToDelete = [
      'aarav.sharma@example.com',
      'priya.patel99@example.com',
      'rohan.g@example.com',
      'neha.singh.study@example.com',
      'vikram.d@example.com'
    ];

    const result = await Appointment.destroy({
      where: {
        email: emailsToDelete
      }
    });
    
    console.log(`Successfully removed ${result} mock appointments!`);
    process.exit(0);
  } catch (error) {
    console.error('Failed to remove:', error);
    process.exit(1);
  }
}

unseedAppointments();
