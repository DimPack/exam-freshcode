'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const contests = [];

    // Функція для створення випадкової дати протягом 2024 року
    const getRandomDateIn2024 = () => {
      const start = new Date(2024, 0, 1); // Початок 2024 року
      const end = new Date(2024, 11, 31); // Кінець 2024 року
      return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    };

    for (let i = 1; i <= 30; i++) {
      const data = getRandomDateIn2024();
      contests.push({
        id: i,
        contestType: ['name', 'tagline', 'logo'][Math.floor(Math.random() * 3)],
        fileName: `file${i}.jpg`,
        originalFileName: `original_file${i}.jpg`,
        title: `Contest Title ${i}`,
        typeOfName: `Type of Name ${i}`,
        industry: `Industry ${i}`,
        focusOfWork: `Focus of Work ${i}`,
        targetCustomer: `Target Customer ${i}`,
        styleName: `Style Name ${i}`,
        nameVenture: `Name Venture ${i}`,
        typeOfTagline: `Type of Tagline ${i}`,
        status: ['active', 'inactive', 'completed'][Math.floor(Math.random() * 3)],
        brandStyle: `Brand Style ${i}`,
        prize: (Math.random() * 1000 + 500).toFixed(2),
        createdAt: data,
        priority: Math.floor(Math.random() * 5) + 1,
        orderId: `ORD-${1000 + i}`,
        userId: Math.floor(Math.random() * 20) + 6,
      });
    }

    await queryInterface.bulkInsert('Contests', contests, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Contests', null, {});
  }
};
