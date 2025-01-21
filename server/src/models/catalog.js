'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Catalog extends Model {
    static associate(models) {
      Catalog.belongsTo(models.User, {
        foreignKey: 'userId',
        targetKey: 'id',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
    }
  }
  Catalog.init(
    {
      userId: {
        field: 'user_id',
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
          model: 'Users',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        validate: {
          notNull: {
            msg: 'User ID cannot be null',
          },
          isInt: {
            msg: 'User ID must be an integer',
          },
        },
      },
      catalogName: {
        field: 'catalog_name',
        allowNull: false,
        unique: true,
        type: DataTypes.STRING,
        validate: {
          notEmpty: {
            msg: 'Catalog name cannot be empty',
          },
          len: {
            args: [1, 255],
            msg: 'Catalog name must be between 1 and 255 characters',
          },
        },
      },
      chats: {
        allowNull: false,
        type: DataTypes.ARRAY(DataTypes.INTEGER),
        validate: {
          notEmpty: {
            msg: 'Chats array cannot be empty',
          },
          isArray(value) {
            if (!Array.isArray(value)) {
              throw new Error('Chats must be an array of integers');
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
      modelName: 'Catalog',
      tableName: 'catalogs',
      underscored: true,
    }
  );
  return Catalog;
};
