const NotFoundError = require('../errors/NotFoundError');

module.exports.handleError = async (req, res, next) => {
  try {
    throw new NotFoundError('Страница не найдена.');
  } catch (err) {
    next(err);
  }
};
