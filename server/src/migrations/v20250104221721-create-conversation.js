'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('conversations', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      favoriteList: {
        field: 'favorite_list',
        type: Sequelize.ARRAY(Sequelize.BOOLEAN),
        defaultValue: [false]
      },
      blackList: {
        field: 'black_list',
        type: Sequelize.ARRAY(Sequelize.BOOLEAN),
        defaultValue: [false]
      },
      participants: {
        allowNull: false,
        type: Sequelize.ARRAY(Sequelize.INTEGER),
      },
      createdAt: {
        field: 'created_at',
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        field: 'updated_at',
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('conversations');
  }
};
