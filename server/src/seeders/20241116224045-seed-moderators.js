'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    const moderators = [];
    const currentDate = new Date();

    for (let i = 1; i <= 5; i++) {
      moderators.push({
        firstName: `Moderator${i}`,
        lastName: `Lastname${i}`,
        displayName: `moderator_${i}`,
        password: 'hashed_password',
        email: `moderator${i}@example.com`,
        avatar: `https://example.com/avatar_moderator${i}.jpg`,
        role: 'moderator',
        balance: Math.random() * 1000,
        accessToken: `access_token_moderator_${i}`,
        rating: (Math.random() * 5).toFixed(2),
      });
    }

    await queryInterface.bulkInsert('Users', moderators, {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', { role: 'moderator' }, {});
  }
};
