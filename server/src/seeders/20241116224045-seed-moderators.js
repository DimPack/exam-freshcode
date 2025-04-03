'use strict';

const bcrypt = require('bcryptjs');

module.exports = {
  async up(queryInterface, Sequelize) {
    console.log('Starting seed for moderators...');
    const moderators = [];
    console.log('Hashing password...');
    const hashedPassword = await bcrypt.hash('passwordModerator1', 5);
    console.log('Password hashed successfully.');

    const currentDate = new Date();

    console.log('Preparing moderator data...');
    moderators.push({
      firstName: 'Moderator1',
      lastName: 'Lastname1',
      displayName: 'moderator_1',
      password: hashedPassword,
      email: 'moderator1@gmail.com',
      avatar: 'anon.png',
      role: 'moderator',
      balance: parseFloat((Math.random() * 1000).toFixed(2)),
      accessToken: null,
      rating: 0,
      createdAt: currentDate,
      updatedAt: currentDate,
    });

    console.log('Inserting moderators into Users table...');
    await queryInterface.bulkInsert('Users', moderators, {});
    console.log('Seed completed successfully.');
  },

  async down(queryInterface, Sequelize) {
    console.log('Deleting moderators from Users table...');
    await queryInterface.bulkDelete('Users', { role: 'moderator' }, {});
    console.log('Rollback completed successfully.');
  },
};