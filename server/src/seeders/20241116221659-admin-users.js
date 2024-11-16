'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Users', [
      {
        firstName: 'John',
        lastName: 'Doe',
        displayName: 'johnny',
        password: 'hashed_password1',
        email: 'john.doe@example.com',
        avatar: 'https://example.com/avatar1.jpg',
        role: 'admin',
        balance: 1000.0,
        accessToken: 'access_token_1',
        rating: 4.5,
      },
      {
        firstName: 'Jane',
        lastName: 'Smith',
        displayName: 'jane_admin',
        password: 'hashed_password2',
        email: 'jane.smith@example.com',
        avatar: 'https://example.com/avatar2.jpg',
        role: 'admin',
        balance: 1200.0,
        accessToken: 'access_token_2',
        rating: 4.8,
      },
      {
        firstName: 'Alice',
        lastName: 'Johnson',
        displayName: 'alice_j',
        password: 'hashed_password3',
        email: 'alice.johnson@example.com',
        avatar: 'https://example.com/avatar3.jpg',
        role: 'admin',
        balance: 1500.0,
        accessToken: 'access_token_3',
        rating: 4.9,
      },
      {
        firstName: 'Bob',
        lastName: 'Brown',
        displayName: 'bobby',
        password: 'hashed_password4',
        email: 'bob.brown@example.com',
        avatar: 'https://example.com/avatar4.jpg',
        role: 'admin',
        balance: 800.0,
        accessToken: 'access_token_4',
        rating: 4.6,
      },
      {
        firstName: 'Eve',
        lastName: 'Taylor',
        displayName: 'eve_t',
        password: 'hashed_password5',
        email: 'eve.taylor@example.com',
        avatar: 'https://example.com/avatar5.jpg',
        role: 'admin',
        balance: 1100.0,
        accessToken: 'access_token_5',
        rating: 4.7,
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', { role: 'admin' }, {});
  }
};
