'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Catalog extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Catalog.init(
    {
      userId: {
        field: 'user_id',
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      catalogName: {
        field: 'catalog_name',
        allowNull: false,
        unique: true,
        type: DataTypes.STRING,
      },
      chats: { allowNull: false, type: DataTypes.INTEGER },
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
