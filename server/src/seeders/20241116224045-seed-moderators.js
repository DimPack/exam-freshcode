'use strict';

const bcrypt = require('bcrypt');

module.exports = {
  async up(queryInterface, Sequelize) {
    const moderators = [];
    const currentDate = new Date();

    moderators.push({
      firstName: `Moderator1`,
      lastName: `Lastname1`,
      displayName: `moderator_1`,
      password: hashedPassword,
      email: `moderator1@gmail.com`,
      avatar: `anon.png`,
      role: 'moderator',
      balance: parseFloat((Math.random() * 1000).toFixed(2)),
      accessToken: null,
      rating: 0,
      createdAt: currentDate,
      updatedAt: currentDate,
    });
    

    await queryInterface.bulkInsert('Users', moderators, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', { role: 'moderator' }, {});
  },
};
