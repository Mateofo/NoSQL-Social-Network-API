const connection = require('../config/connection');
const { User, Thought} = require('../models')

connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

connection.once('open', async () => {
  console.log('Connected to MongoDB.')

  try {
    // Clear existing data
    await Thought.deleteMany({});
    await User.deleteMany({});

    // Seed new data
    const users = [
      {
        username: 'mateo',
        email: 'mateo@email.com',
      },
    ];

    await User.collection.insertMany(users);

    console.table(users);
    console.info('Seeding completed!');
  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {

    connection.close();
    console.log('MongoDB connection closed.');
    process.exit(0);
  }
});




