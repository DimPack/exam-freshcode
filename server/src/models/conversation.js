'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Conversation extends Model {
    static associate(models) {
      // Зв’язок із таблицею Messages
      Conversation.hasMany(models.Message, {
        foreignKey: 'conversationId',
        as: 'messages',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
    }
  }
  Conversation.init(
    {
      favoriteList: {
        field: 'favorite_list',
        allowNull: false,
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        validate: {
          notNull: {
            msg: 'Favorite list cannot be null',
          },
          isBoolean(value) {
            if (typeof value !== 'boolean') {
              throw new Error('Favorite list must be a boolean');
            }
          },
        },
      },
      blackList: {
        field: 'black_list',
        allowNull: false,
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        validate: {
          notNull: {
            msg: 'Black list cannot be null',
          },
          isBoolean(value) {
            if (typeof value !== 'boolean') {
              throw new Error('Black list must be a boolean');
            }
          },
        },
      },
      participants: {
        allowNull: false,
        type: DataTypes.ARRAY(DataTypes.INTEGER), // Виправлення типу на масив
        validate: {
          notEmpty: true,
          isArray(value) {
            if (!Array.isArray(value)) {
              throw new Error('Participants must be an array of integers');
            }
          },
        },
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
