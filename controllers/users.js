const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models/user');
const NotFoundError = require('../errors/NotFoundError');
const NotAuthorizedError = require('../errors/NotAuthorizedError');
const NotCorrectDataError = require('../errors/NotCorrectDataError');
const NotUniqDataError = require('../errors/NotUniqDataError');
const NotCorrectPasswordError = require('../errors/NotCorrectPasswordError');

const UNIQUE_EMAIL_ERROR = 11000;
const SOLT_ROUNDS = 10;
const JWT_SECRET_PHRASE = 'ww3lm;sdAjmodS;ei72f';

module.exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find({});
    res.status(200).send(await users);
  } catch (err) {
    next(err);
  }
};

module.exports.getUsersById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId);
    if(!user) {
      throw new NotFoundError('Пользователь по указанному _id не найден.');
    }
    res.status(200).send(await user);
  } catch (err) {
    next(err);
  }
};

module.exports.getUserInfo = async (req, res, next) => {
  try {
    console.log(req.cookies.userToken);
    const user = await User.findById(req.user._id);
    if(!user) {
      throw new NotAuthorizedError('Доступ запрещён. Необходимо зарегестрироваться');
    }
    res.status(200).send(await user);
  } catch (err) {
    next(err);
  }
}

module.exports.createUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!validator.isEmail(email)) {
      throw new NotCorrectDataError('Некорректный email!!!.');
    }
    await bcrypt.hash(password, SOLT_ROUNDS)
      .then((hash) => {
        return User.create({ ...req.body, password: hash });
      })
      .then((createUser) => {
        createUser.password = '';
        res.status(200).send(createUser);
      });
  } catch (err) {
    if (err.code === UNIQUE_EMAIL_ERROR) {
      next(new NotUniqDataError('Пользователь с указаной почтой уже зарегистрирован.'));
    }
    next(err);
  }
};

module.exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new NotCorrectDataError('Не передан email или пароль.');
    }
    if (!validator.isEmail(email)) {
      throw new NotCorrectDataError('Некорректный email');
    }
    await User.findOne({ email }).select('+password')
      .then((user) => {
        if (!user) {
          throw new NotCorrectPasswordError('Неправлиьный email или пароль.');
        }
        bcrypt.compare(password, user.password)
          .then((matched) => {
            if (!matched) {
              throw new NotCorrectPasswordError('Неправлиьный email или пароль.');
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
          .catch(next);
      })
      .catch(next);
    } catch (err) {
      next(err);
    }
};

module.exports.updateUserProfile = async (req, res, next) => {
  try {
    const user = User.findOneAndUpdate({
      _id: req.user._id,
    }, { ...req.body }, {
      new: true, runValidators: true,
    })
    if(!user) {
      throw new NotCorrectDataError('Переданы некорректные данные при обновлении пользователя.');
    }
    res.status(200).send(await user);
  } catch (err) {
    next(err);
  }
};
