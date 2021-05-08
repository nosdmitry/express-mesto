const jwt = require('jsonwebtoken');
const NotAuthorizedError = require('../errors/NotAuthorizedError');

const JWT_SECRET_PHRASE = 'ww3lm;sdAjmodS;ei72f';

module.exports = async (req, res, next) => {
  // const token = req.headers.authorization;
  const token = req.cookies.userToken;

  let payload;

  try {
    if (!token) {
      throw new NotAuthorizedError('Отказано в доступе. Необходима авторизация.');
    }
    payload = jwt.verify(token, JWT_SECRET_PHRASE);
  } catch (err) {
    next(err);
  }
  req.user = payload;
  next();
};
