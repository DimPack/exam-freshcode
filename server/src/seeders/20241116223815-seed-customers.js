'use strict';

const bcrypt = require('bcrypt');

module.exports = {
  async up(queryInterface, Sequelize) {
    const customers = [];
    const currentDate = new Date();

    for (let i = 1; i <= 20; i++) {
      const hashedPassword = await bcrypt.hash(`passwordCustomer${i}`, 10);

      customers.push({
        firstName: `Customer${i}`,
        lastName: `Lastname${i}`,
        displayName: `customer_${i}`,
        password: hashedPassword,
        email: `customer${i}@gmail.com`,
        avatar: `anon.png`,
        role: 'customer',
        balance: parseFloat((Math.random() * 1000).toFixed(2)),
        accessToken: null,
        rating: 0,
        createdAt: currentDate,
        updatedAt: currentDate,
      });
    }

    await queryInterface.bulkInsert('Users', customers, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', { role: 'customer' }, {});
  },
};
