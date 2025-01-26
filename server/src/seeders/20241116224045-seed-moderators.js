'use strict';

const bcrypt = require('bcrypt');

module.exports = {
  async up(queryInterface, Sequelize) {
    const moderators = [];
    const currentDate = new Date();

    for (let i = 1; i <= 5; i++) {
      const hashedPassword = await bcrypt.hash(`passwordModerator${i}`, 10);

      moderators.push({
        firstName: `Moderator${i}`,
        lastName: `Lastname${i}`,
        displayName: `moderator_${i}`,
        password: hashedPassword,
        email: `moderator${i}@gmail.com`,
        avatar: `anon.png`,
        role: 'moderator',
        balance: parseFloat((Math.random() * 1000).toFixed(2)),
        accessToken: null,
        rating: 0,
        createdAt: currentDate,
        updatedAt: currentDate,
      });
    }

    await queryInterface.bulkInsert('Users', moderators, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', { role: 'moderator' }, {});
  },
};
