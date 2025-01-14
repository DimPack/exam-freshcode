'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Conversation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Conversation.init(
    {
      favoriteList: {
        field: 'favorite_list',
        allowNull: false,
        type: DataTypes.BOOLEAN,
      },
      blackList: {
        field: 'black_list',
        allowNull: false,
        type: DataTypes.BOOLEAN,
      },
      participants: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      createdAt: {
        field: 'created_at',
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        field: 'updated_at',
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: 'Conversation',
      tableName: 'conversations',
      underscored: true,
    }
  );
  return Conversation;
};
