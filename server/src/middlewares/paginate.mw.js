const constants = require('../constants');
const { LIMIT_PAGINATION } = constants;
module.exports.paginate = async (req, res, next) => {
  try {
    const {
      query: { page, amount },
    } = req;
    const limit = amount > LIMIT_PAGINATION.MIN && amount <= LIMIT_PAGINATION.MAX ? amount : LIMIT_PAGINATION.MIN;
    const offset = page > 1 ? (page - 1) * limit : 0;

    req.pagination = {
      limit,
      offset,
    };
    next();
  } catch (error) {
    next(error);
  }
};
