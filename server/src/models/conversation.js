'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Conversation extends Model {
    static associate(models) {
      Conversation.hasMany(models.Message, { foreignKey: 'conversationId', as: 'messages' });    }
  }

  Conversation.init(
    {
      favoriteList: {
        type: DataTypes.ARRAY(DataTypes.BOOLEAN),
        defaultValue: [false, false],
        validate: {
          isArrayOfBooleans(value) {
            if (!Array.isArray(value) || !value.every(item => typeof item === 'boolean')) {
              throw new Error('Favorite list must be an array of booleans');
            }
          },
        },
      },
      blackList: {
        type: DataTypes.ARRAY(DataTypes.BOOLEAN),
        defaultValue: [false, false],
        validate: {
          isArrayOfBooleans(value) {
            if (!Array.isArray(value) || !value.every(item => typeof item === 'boolean')) {
              throw new Error('Black list must be an array of booleans');
            }
          },
        },
      },
      participants: {
        type: DataTypes.ARRAY(DataTypes.INTEGER),
        allowNull: false,
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