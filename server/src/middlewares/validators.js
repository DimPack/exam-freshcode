const schems = require('../validationSchemes/schems');
const ServerError = require('../errors/ServerError');
const BadRequestError = require('../errors/BadRequestError');

module.exports.validateRegistrationData = async (req, res, next) => {
  const validationResult = await schems.registrationSchem.isValid(req.body);
  if (!validationResult) {
    return next(new BadRequestError('Invalid data for registration'));
  } else {
    next();
  }
};

module.exports.validateLogin = async (req, res, next) => {
  const validationResult = await schems.loginSchem.isValid(req.body);
  if (validationResult) {
    next();
  } else {
    return next(new BadRequestError('Invalid data for login'));
  }
};

module.exports.validateContestCreation = async (req, res, next) => {
  try {
    const validationPromises = req.body.contests.map((contest) =>
      schems.contestSchem.validate(contest, { abortEarly: false })
    );

    await Promise.all(validationPromises);
    next();
  } catch (error) {
    if (error.errors) {
      const errorMessage = error.errors.join(', ');
      return next(new BadRequestError(`Validation failed: ${errorMessage}`));
    }
    next(error);
  }
};
