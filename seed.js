const mongoose = require('mongoose');
const User = require('./models/user.model'); // adjust path if needed

async function seed() {
  await mongoose.connect("mongodb://localhost:27017/Graduation");

  const testUser = await User.create({
    name: 'Test Manager',
    email: 'testmanager@example.com',
    password: 'TempPass123!',
    confirmPassword: 'TempPass123!',
    role: 'manager',
    // add team/managerId fields here if your schema requires them at creation
  });

  console.log('Created:', testUser);
  await mongoose.disconnect();
}

seed();