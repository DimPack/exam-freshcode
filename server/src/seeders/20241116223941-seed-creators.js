'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    const creators = [];
    const currentDate = new Date();

    for (let i = 1; i <= 15; i++) {
      creators.push({
        firstName: `Creator${i}`,
        lastName: `Lastname${i}`,
        displayName: `creator_${i}`,
        password: 'hashed_password',
        email: `creator${i}@example.com`,
        avatar: `https://example.com/avatar_creator${i}.jpg`,
        role: 'creator',
        balance: Math.random() * 2000,
        accessToken: `access_token_creator_${i}`,
        rating: (Math.random() * 5).toFixed(2),
      });
    }

    await queryInterface.bulkInsert('Users', creators, {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', { role: 'creator' }, {});
  }
};
