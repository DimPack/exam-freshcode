'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const offers = [];
    const currentDate = new Date();

    for (let i = 0; i < 20; i++) {
      offers.push({
        userId: 23,
        contestId: 2,
        text: `Offer #${i + 1} description text.`,
        fileName: null,
        originalFileName: null,
        status: 'pending'
      });
    }

    await queryInterface.bulkInsert('Offers', offers, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Offers', null, {});
  }
};
