const jwt = require('jsonwebtoken');

const JWT_SECRET_PHRASE = 'ww3lm;sdAjmodS;ei72f';

module.exports = (req, res, next) => {
  // const token = req.headers.authorization;
  const token = req.cookie.userToken;
  let payload;
  if (!token) {
    res.status(403).send({ message: 'Необхадима авторизация' });
  }
  try {
    payload = jwt.verify(token, JWT_SECRET_PHRASE);
  } catch (err) {
    return res.status(403).send({ message: 'Отказано в доступе.' });
  }
  req.user = payload;
  next();
  return null;
};
