'use strict';

const bcrypt = require('bcrypt');

module.exports = {
  async up(queryInterface, Sequelize) {
    const admins = [];
    const currentDate = new Date();

    for (let i = 1; i <= 5; i++) {
      const hashedPassword = await bcrypt.hash(`passwordAdmin${i}`, 10);

      admins.push({
        firstName: `Admin${i}`,
        lastName: `Lastname${i}`,
        displayName: `admin_${i}`,
        password: hashedPassword,
        email: `admin${i}@gmail.com`,
        avatar: `anon.png`,
        role: 'admin',
        balance: parseFloat((Math.random() * 1000).toFixed(2)),
        accessToken: null,
        rating: 0,
        createdAt: currentDate,
        updatedAt: currentDate,
      });
    }

    await queryInterface.bulkInsert('Users', admins, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', { role: 'admin' }, {});
  },
};
