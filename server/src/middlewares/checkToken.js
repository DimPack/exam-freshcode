const jwt = require('jsonwebtoken');
const CONSTANTS = require('../constants');
const TokenError = require('../errors/TokenError');
const userQueries = require('../controllers/queries/userQueries');

module.exports.checkAuth = async (req, res, next) => {
  const authorizationHeader = req.headers.authorization;

  if (!authorizationHeader) {
    req.user = null;
    return next();
  }

  try {
    const tokenData = jwt.verify(authorizationHeader, CONSTANTS.JWT_SECRET);
    const foundUser = await userQueries.findUser({ id: tokenData.userId });

    if (!foundUser) {
      req.user = null;
      return next();
    }

    req.user = foundUser;
    next();
  } catch (err) {
    req.user = null;
    return next();
  }
};

module.exports.checkToken = async (req, res, next) => {
  const authorizationHeader = req.headers.authorization;
  if (!authorizationHeader) {
    req.tokenData = null;
    return next();
  }

  try {
    const token = authorizationHeader;
    req.tokenData = jwt.verify(token, CONSTANTS.JWT_SECRET);
    next();
  } catch (err) {
    req.tokenData = null;
    next();
  }
};


