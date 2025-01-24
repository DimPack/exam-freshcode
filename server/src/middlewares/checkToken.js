const jwt = require('jsonwebtoken');
const CONSTANTS = require('../constants');
const TokenError = require('../errors/TokenError');
const userQueries = require('../controllers/queries/userQueries');

// module.exports.checkAuth = async (req, res, next) => {
//   const authorizationHeader = req.headers.authorization;
//   if (!authorizationHeader) {
//     req.user = null;
//     return next();
//   }

//   try {
//     const token = authorizationHeader
//     if (!token) {
//       return next(new TokenError('Token is missing or malformed.'));
//     }

//     const tokenData = jwt.verify(token, CONSTANTS.JWT_SECRET);
    
//     const foundUser = await userQueries.findUser({ id: tokenData.userId });
//     if (!foundUser) {
//       return next(new TokenError('User not found. (checkAuth)'));
//     }

//     req.user = {
//       firstName: foundUser.firstName,
//       lastName: foundUser.lastName,
//       role: foundUser.role,
//       id: foundUser.id,
//       avatar: foundUser.avatar,
//       displayName: foundUser.displayName,
//       balance: foundUser.balance,
//       email: foundUser.email,
//     };

//     next();
//   } catch (err) {
//     console.error('Error during token verification:', err);
//     req.user = null;
//     return next();
//   }
// };

module.exports.checkAuth = async (req, res, next) => {
  const authorizationHeader = req.headers.authorization;
  if (!authorizationHeader) {
    req.user = null;
    return next();
  }
  try {
    const tokenData = jwt.verify(authorizationHeader, CONSTANTS.JWT_SECRET);
    const foundUser = await userQueries.findUser({ id: tokenData.userId });
    res.send({
      firstName: foundUser.firstName,
      lastName: foundUser.lastName,
      role: foundUser.role,
      id: foundUser.id,
      avatar: foundUser.avatar,
      displayName: foundUser.displayName,
      balance: foundUser.balance,
      email: foundUser.email,
    });
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


