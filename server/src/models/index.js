const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const configPath = path.join(__dirname, '..', 'config', 'postgresConfig.json');
const config = require(configPath)[env];
const db = {};

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js'
    );
  })
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(
      sequelize,
      Sequelize.DataTypes
    );
    db[model.name] = model;
  });

db['Contests'].belongsTo(db['Users'], {
  foreignKey: 'userId',
  sourceKey: 'id',
});
db['Contests'].hasMany(db['Offers'], {
  foreignKey: 'contestId',
  targetKey: 'id',
});

db['Users'].hasMany(db['Offers'], { foreignKey: 'userId', targetKey: 'id' });
db['Users'].hasMany(db['Contests'], { foreignKey: 'userId', targetKey: 'id' });
db['Users'].hasMany(db['Ratings'], { foreignKey: 'userId', targetKey: 'id' });
db['Offers'].belongsTo(db['Users'], { foreignKey: 'userId', sourceKey: 'id' });
db['Offers'].belongsTo(db['Contests'], { foreignKey: 'contestId', sourceKey: 'id'});
db['Offers'].hasOne(db['Ratings'], { foreignKey: 'offerId', targetKey: 'id' });
db['Ratings'].belongsTo(db['Users'], { foreignKey: 'userId', targetKey: 'id' });
db['Ratings'].belongsTo(db['Offers'], { foreignKey: 'offerId', targetKey: 'id'});

db['Users'].hasMany(db['Catalog'], { foreignKey: 'userId', targetKey: 'id',});
db['Catalog'].belongsTo(db['Users'], { foreignKey: 'userId', targetKey: 'id' });

db['Message'].belongsTo(db['Users'], { foreignKey: 'senderId', as: 'sender' });
db['Users'].hasMany(db['Message'], { foreignKey: 'senderId', as: 'messages' });

db['Conversation'].hasMany(db['Message'], { foreignKey: 'conversationId', as: 'messages', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
db['Message'].belongsTo(db['Conversation'], { foreignKey: 'conversationId', as: 'conversation' });

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;