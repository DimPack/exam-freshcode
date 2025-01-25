'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Message extends Model {
    static associate(models) {
      Message.belongsTo(models.User, {
        foreignKey: 'senderId',
        targetKey: 'id',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });

      Message.belongsTo(models.Conversation, {
        foreignKey: 'conversationId',
        targetKey: 'id',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
    }
  }

  Message.init(
    {
      senderId: {
        field: 'sender_id',
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
          model: 'Users',
          key: 'id',
          validate: {
            notNull: { msg: 'Sender ID cannot be null' },
            isInt: { msg: 'Sender ID must be an integer' },
          },
        },
      },
      body: {
        allowNull: false,
        type: DataTypes.TEXT,
        validate: {
          notEmpty: true,
          notNull: {
            msg: 'Message body cannot be null',
          },
        },
      },
      conversationId: {
        field: 'conversation_id',
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
          model: 'Conversations',
          key: 'id',
          validate: {
            notNull: { msg: 'Conversations ID cannot be null' },
            isInt: { msg: 'Conversations ID must be an integer' },
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
      modelName: 'Message',
      tableName: 'messages',
      underscored: true,
    }
  );

  return Message;
};
