const { Appointment, sequelize } = require('./models');

async function seedAppointments() {
  try {
    await sequelize.authenticate();
    console.log('Connected to DB');

    const mockAppointments = [
      {
        name: 'Aarav Sharma',
        email: 'aarav.sharma@example.com',
        phoneNumber: '+91 9876543210',
        classType: 'Master of Data Science, USA',
        sourcePage: '/study-in-usa',
        status: 'New'
      },
      {
        name: 'Priya Patel',
        email: 'priya.patel99@example.com',
        phoneNumber: '+91 8765432109',
        classType: 'MBA, UK',
        sourcePage: '/study-in-uk',
        status: 'New'
      },
      {
        name: 'Rohan Gupta',
        email: 'rohan.g@example.com',
        phoneNumber: '+91 7654321098',
        classType: 'Bachelor of Computer Science, Canada',
        sourcePage: '/study-in-canada',
        status: 'New'
      },
      {
        name: 'Neha Singh',
        email: 'neha.singh.study@example.com',
        phoneNumber: '+91 6543210987',
        classType: 'Master of Public Health, Australia',
        sourcePage: '/study-in-australia',
        status: 'New'
      },
      {
        name: 'Vikram Desai',
        email: 'vikram.d@example.com',
        phoneNumber: '+91 9988776655',
        classType: 'Ph.D. in Engineering, Germany',
        sourcePage: '/study-in-germany',
        status: 'New'
      }
    ];

    for (const appt of mockAppointments) {
      await Appointment.create(appt);
    }
    
    console.log('Successfully seeded 5 mock appointments!');
    process.exit(0);
  } catch (error) {
    console.error('Failed to seed:', error);
    process.exit(1);
  }
}

seedAppointments();
