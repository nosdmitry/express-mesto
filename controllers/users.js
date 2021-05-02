const validator = require('validator');
const bcrypt = require('bcrypt');
const { User } = require('../models/user');

const UNIQUE_EMAIL_ERROR = 11000;
const SOLT_ROUNDS = 10;

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

module.exports.login = (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).send({ message: 'Не передан email или пароль.' });
  }
  if (!validator.isEmail(email)) {
    return res.status(400).send({ message: 'Некорректный email' });
  }
  User.findOne({ email })
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error('Неправлиьный email или пароль.'));
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new Error('Неправлиьный email или пароль.'));
          }
          return res.status(200).send({ message: 'Got it!' });
        })
        .catch((err) => res.status(401).send({ message: err.message }));
    })
    .catch((err) => res.status(401).send({ message: err.message }));
  return null;
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
