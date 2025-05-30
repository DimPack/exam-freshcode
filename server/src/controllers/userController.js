const CONSTANTS = require('../constants');
const bd = require('../models');
const moment = require('moment');
const { v4: uuid } = require('uuid');
const controller = require('../socketInit');
const userQueries = require('./queries/userQueries');
const bankQueries = require('./queries/bankQueries');
const ratingQueries = require('./queries/ratingQueries');

function getQuery (offerId, userId, mark, isFirst, transaction) {
  const getCreateQuery = () => ratingQueries.createRating({
    offerId,
    mark,
    userId,
  }, transaction);
  const getUpdateQuery = () => ratingQueries.updateRating({ mark },
    { offerId, userId }, transaction);
  return isFirst ? getCreateQuery : getUpdateQuery;
}

module.exports.changeMark = async (req, res, next) => {
  let sum = 0;
  let avg = 0;
  let transaction;
  const { isFirst, offerId, mark, creatorId } = req.body;
  const userId = req.tokenData.userId;
  try {
    transaction = await bd.sequelize.transaction(
      { isolationLevel: bd.Sequelize.Transaction.ISOLATION_LEVELS.READ_UNCOMMITTED });
    const query = getQuery(offerId, userId, mark, isFirst, transaction);
    await query();
    const offersArray = await bd.Ratings.findAll({
      include: [
        {
          model: bd.Offers,
          required: true,
          where: { userId: creatorId },
        },
      ],
      transaction,
    });
    for (let i = 0; i < offersArray.length; i++) {
      sum += offersArray[ i ].dataValues.mark;
    }
    avg = sum / offersArray.length;

    await userQueries.updateUser({ rating: avg }, creatorId, transaction);
    transaction.commit();
    controller.getNotificationController().emitChangeMark(creatorId);
    res.send({ userId: creatorId, rating: avg });
  } catch (err) {
    transaction.rollback();
    next(err);
  }
};

module.exports.payment = async (req, res, next) => {
  let transaction;
  try {
    transaction = await bd.sequelize.transaction();
    await bankQueries.updateBankBalance({
      balance: bd.sequelize.literal(`
                CASE
            WHEN "cardNumber"='${ req.body.number.replace(/ /g,
    '') }' AND "cvc"='${ req.body.cvc }' AND "expiry"='${ req.body.expiry }'
                THEN "balance"-${ req.body.price }
            WHEN "cardNumber"='${ CONSTANTS.SQUADHELP_BANK_NUMBER }' AND "cvc"='${ CONSTANTS.SQUADHELP_BANK_CVC }' AND "expiry"='${ CONSTANTS.SQUADHELP_BANK_EXPIRY }'
                THEN "balance"+${ req.body.price } END
        `),
    },
    {
      cardNumber: {
        [ bd.Sequelize.Op.in ]: [
          CONSTANTS.SQUADHELP_BANK_NUMBER,
          req.body.number.replace(/ /g, ''),
        ],
      },
    },
    transaction);
    const orderId = uuid();
    req.body.contests.forEach((contest, index) => {
      const prize = index === req.body.contests.length - 1 ? Math.ceil(
        req.body.price / req.body.contests.length)
        : Math.floor(req.body.price / req.body.contests.length);
      contest = Object.assign(contest, {
        status: index === 0 ? 'active' : 'pending',
        userId: req.tokenData.userId,
        priority: index + 1,
        orderId,
        createdAt: moment().format('YYYY-MM-DD HH:mm'),
        prize,
      });
    });
    await bd.Contests.bulkCreate(req.body.contests, transaction);
    transaction.commit();
    res.send();
  } catch (err) {
    transaction.rollback();
    next(err);
  }
};

module.exports.updateUser = async (req, res, next) => {
  try {
    if (req.file) {
      req.body.avatar = req.file.filename;
    }
        console.log(req.tokenData);
        
    const updatedUser = await userQueries.updateUser(req.body,
      req.tokenData.userId);
    res.send({
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      displayName: updatedUser.displayName,
      avatar: updatedUser.avatar,
      email: updatedUser.email,
      balance: updatedUser.balance,
      role: updatedUser.role,
      id: updatedUser.id,
    });
  } catch (err) {
    next(err);
  }
};

module.exports.cashout = async (req, res, next) => {
  let transaction;
  try {
    transaction = await bd.sequelize.transaction();
    const updatedUser = await userQueries.updateUser(
      { balance: bd.sequelize.literal('balance - ' + req.body.sum) },
      req.tokenData.userId, transaction);
    await bankQueries.updateBankBalance({
      balance: bd.sequelize.literal(`CASE 
                WHEN "cardNumber"='${ req.body.number.replace(/ /g,
    '') }' AND "expiry"='${ req.body.expiry }' AND "cvc"='${ req.body.cvc }'
                    THEN "balance"+${ req.body.sum }
                WHEN "cardNumber"='${ CONSTANTS.SQUADHELP_BANK_NUMBER }' AND "expiry"='${ CONSTANTS.SQUADHELP_BANK_EXPIRY }' AND "cvc"='${ CONSTANTS.SQUADHELP_BANK_CVC }'
                    THEN "balance"-${ req.body.sum }
                 END
                `),
    },
    {
      cardNumber: {
        [ bd.Sequelize.Op.in ]: [
          CONSTANTS.SQUADHELP_BANK_NUMBER,
          req.body.number.replace(/ /g, ''),
        ],
      },
    },
    transaction);
    transaction.commit();
    res.send({ balance: updatedUser.balance });
  } catch (err) {
    transaction.rollback();
    next(err);
  }
};

module.exports.getUser = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    res.status(200).json({
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      role: req.user.role,
      id: req.user.id,
      avatar: req.user.avatar,
      displayName: req.user.displayName,
      balance: req.user.balance,
      email: req.user.email,
    });
  } catch (err) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

