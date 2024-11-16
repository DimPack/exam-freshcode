'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    const customers = [];
    const currentDate = new Date();

    for (let i = 1; i <= 20; i++) {
      customers.push({
        firstName: `Customer${i}`,
        lastName: `Lastname${i}`,
        displayName: `customer_${i}`,
        password: 'hashed_password',
        email: `customer${i}@example.com`,
        avatar: `https://example.com/avatar${i}.jpg`,
        role: 'customer',
        balance: Math.random() * 1000,
        accessToken: `access_token_${i}`,
        rating: (Math.random() * 5).toFixed(2),
      });
    }

    await queryInterface.bulkInsert('Users', customers, {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', { role: 'customer' }, {});
  }
};
