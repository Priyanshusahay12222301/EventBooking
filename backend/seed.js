require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Event = require('./models/Event');

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB for seeding');

    // Clear existing data
    await User.deleteMany({});
    await Event.deleteMany({});

    // Create admin user
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@eventbooking.com',
      password: 'admin123', // will be hashed by pre-save hook
      role: 'admin'
    });

    // Create sample events
    const events = await Event.create([
      {
        title: 'React Conference 2025',
        description: 'Learn about the latest React features and best practices',
        date: '2025-12-15',
        time: '09:00 AM',
        location: 'Tech Center, Downtown',
        price: 50,
        totalSeats: 100,
        availableSeats: 100,
        createdBy: admin._id
      },
      {
        title: 'Node.js Workshop',
        description: 'Hands-on workshop covering Node.js and Express',
        date: '2025-12-20',
        time: '02:00 PM',
        location: 'Code Academy',
        price: 30,
        totalSeats: 50,
        availableSeats: 50,
        createdBy: admin._id
      },
      {
        title: 'MongoDB Atlas Training',
        description: 'Complete guide to MongoDB Atlas cloud database',
        date: '2025-12-25',
        time: '10:00 AM',
        location: 'Online',
        price: 0,
        totalSeats: 200,
        availableSeats: 200,
        createdBy: admin._id
      }
    ]);

    console.log('Seed data created:');
    console.log('Admin user:', admin.email, '/ password: admin123');
    console.log('Events created:', events.length);

    process.exit(0);
  } catch (error) {
    console.error('Seed failed:', error);
    process.exit(1);
  }
}

seed();