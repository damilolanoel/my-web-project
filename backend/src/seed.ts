import { connectDB } from './config/database';
import User from './models/User';

// Seed data based on frontend data.ts
const seedData = async () => {
  try {
    // Clear existing data
    await User.deleteMany({});

    // Seed users
    const users = [
      {
        username: 'admin',
        email: 'admin@bookeythrift.com',
        password: 'admin123', // Will be hashed
        role: 'admin',
        firstName: 'Admin',
        lastName: 'User',
        phoneNumber: '+234 800 000 0000',
        isActive: true
      },
      {
        username: 'adebayo',
        email: 'adebayo@email.com',
        password: 'pass123',
        role: 'user',
        firstName: 'Adebayo',
        lastName: 'Oluwaseun',
        phoneNumber: '+234 801 234 5678',
        isActive: true
      },
      {
        username: 'blessing',
        email: 'blessing@email.com',
        password: 'pass123',
        role: 'user',
        firstName: 'Blessing',
        lastName: 'Okafor',
        phoneNumber: '+234 802 345 6789',
        isActive: true
      },
      {
        username: 'chidera',
        email: 'chidera@email.com',
        password: 'pass123',
        role: 'user',
        firstName: 'Chidera',
        lastName: 'Nwosu',
        phoneNumber: '+234 803 456 7890',
        isActive: true
      },
      {
        username: 'damilola',
        email: 'damilola@email.com',
        password: 'pass123',
        role: 'user',
        firstName: 'Damilola',
        lastName: 'Adesanya',
        phoneNumber: '+234 804 567 8901',
        isActive: true
      },
      {
        username: 'emeka',
        email: 'emeka@email.com',
        password: 'pass123',
        role: 'user',
        firstName: 'Emeka',
        lastName: 'Eze',
        phoneNumber: '+234 805 678 9012',
        isActive: true
      },
      {
        username: 'fatima',
        email: 'fatima@email.com',
        password: 'pass123',
        role: 'user',
        firstName: 'Fatima',
        lastName: 'Ibrahim',
        phoneNumber: '+234 806 789 0123',
        isActive: true
      },
      {
        username: 'gbenga',
        email: 'gbenga@email.com',
        password: 'pass123',
        role: 'user',
        firstName: 'Gbenga',
        lastName: 'Adeyemi',
        phoneNumber: '+234 807 890 1234',
        isActive: true
      },
      {
        username: 'halima',
        email: 'halima@email.com',
        password: 'pass123',
        role: 'user',
        firstName: 'Halima',
        lastName: 'Mohammed',
        phoneNumber: '+234 808 901 2345',
        isActive: true
      },
      {
        username: 'ikenna',
        email: 'ikenna@email.com',
        password: 'pass123',
        role: 'user',
        firstName: 'Ikenna',
        lastName: 'Obi',
        phoneNumber: '+234 809 012 3456',
        isActive: true
      },
      {
        username: 'jumoke',
        email: 'jumoke@email.com',
        password: 'pass123',
        role: 'user',
        firstName: 'Jumoke',
        lastName: 'Balogun',
        phoneNumber: '+234 810 123 4567',
        isActive: true
      }
    ];

    for (const userData of users) {
      await User.create(userData);
    }

    console.log('Database seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

connectDB().then(() => {
  seedData();
});