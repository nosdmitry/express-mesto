const { User } = require('../models/user');

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
    const user = new User(req.body);
    res.status(200).send(await user.save());
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.status(400).send({ message: 'Переданы некорректные данные при создании пользователя.' });
    } else {
      res.status(500).send({ message: 'Серверная ошибка.' });
    }
  }
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
