const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models/user');

const UNIQUE_EMAIL_ERROR = 11000;
const SOLT_ROUNDS = 10;
const JWT_SECRET_PHRASE = 'ww3lm;sdAjmodS;ei72f';

module.exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).send(await users);
  } catch (err) {
    res.status(500).send({ message: 'Серверная ошибка.' });
  }
};

module.exports.getUsersById = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
      .orFail(new Error('NoValidId'));
    res.status(200).send(await user);
  } catch (err) {
    if (err.message === 'NoValidId') {
      res.status(404).send({ message: 'Пользователь по указанному _id не найден.' });
    } else if (err.name === 'CastError') {
      res.status(400).send({ message: 'Невалидный id' });
    } else {
      res.status(500).send({ message: 'Серверная ошибка.' });
    }
  }
};

module.exports.getUserInfo = async (req, res) => {
  try {
    console.log(req.cookies.userToken);
    const user = await User.findById(req.user._id)
      .orFail(new Error('NoAuthorize'));
    res.status(200).send(await user);
  } catch (err) {
    if (err.message === 'NoAuthorize') {
      res.status(403).send({ message: 'Ошибка регистрации.' });
    } else {
      res.status(500).send({ message: 'Серверная ошибка.' });
    }
  }
}

module.exports.createUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!validator.isEmail(email)) {
      return res.status(400).send({ message: 'Некорректный email' });
    }
    await bcrypt.hash(password, SOLT_ROUNDS)
      .then((hash) => User.create({ ...req.body, password: hash }))
      .then((createUser) => res.status(200).send(createUser));
  } catch (err) {
    if (err.code === UNIQUE_EMAIL_ERROR) {
      res.status(409).send({ message: 'Пользователь с указаной почтой уже зарегистрирован.' });
    } else if (err.name === 'ValidationError') {
      res.status(400).send({ message: 'Переданы некорректные данные при создании пользователя.' });
    } else {
      res.status(500).send({ message: 'Серверная ошибка.' });
    }
  }
  return null;
};

module.exports.login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).send({ message: 'Не передан email или пароль.' });
  }
  if (!validator.isEmail(email)) {
    return res.status(400).send({ message: 'Некорректный email' });
  }
  await User.findOne({ email })
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error('Неправлиьный email или пароль.'));
      }
      bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new Error('Неправлиьный email или пароль.'));
          }
          const token = jwt.sign(
            { _id: user._id },
            JWT_SECRET_PHRASE,
            { expiresIn: 3600000 * 24 * 7 },
          );
          res.cookie('userToken', token, {
            maxAge: 3600000 * 24 * 7,
            httpOnly: true,
            sameSite: true,
          }).status(200).send({ message: 'Вход выполнен успешно.' });
        })
        .catch((err) => res.status(401).send({ message: err.message }));
    })
    .catch((err) => res.status(401).send({ message: err.message }));
};

module.exports.updateUserProfile = async (req, res) => {
  try {
    const user = User.findOneAndUpdate({
      _id: req.user._id,
    }, { ...req.body }, {
      new: true, runValidators: true,
    })
      .orFail(new Error('NoValidId'));
    res.status(200).send(await user);
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.status(400).send({ message: 'Переданы некорректные данные при обновлении пользователя.' });
    } else if (err.message === 'NoValidId') {
      res.status(404).send({ message: 'Пользователь с указанным _id не найден.' });
    } else {
      res.status(500).send({ message: 'Серверная ошибка.' });
    }
  }
};
