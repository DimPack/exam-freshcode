'use strict';

const bcrypt = require('bcrypt');

module.exports = {
  async up(queryInterface, Sequelize) {
    const creators = [];
    const currentDate = new Date();

    for (let i = 1; i <= 15; i++) {
      const hashedPassword = await bcrypt.hash(`passwordCreator${i}`, 10);

      creators.push({
        firstName: `Creator${i}`,
        lastName: `Lastname${i}`,
        displayName: `creator_${i}`,
        password: hashedPassword,
        email: `creator${i}@gmail.com`,
        avatar: `anon.png`,
        role: 'creator',
        balance: parseFloat((Math.random() * 1000).toFixed(2)),
        accessToken: null,
        rating: 0,
        createdAt: currentDate,
        updatedAt: currentDate,
      });
    }

    await queryInterface.bulkInsert('Users', creators, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', { role: 'creator' }, {});
  },
};
