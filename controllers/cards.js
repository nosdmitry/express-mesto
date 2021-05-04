const { Cards } = require('../models/cards');

module.exports.getAllCards = async (req, res) => {
  try {
    const cards = await Cards.find({})
      .populate('owner');
    res.send(await cards);
  } catch (err) {
    res.status(500).send({ message: 'Серверная ошибка.' });
  }
};

module.exports.createCard = async (req, res) => {
  try {
    const card = await Cards({ ...req.body, owner: req.user._id })
    res.status(200).send(await card.save());
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.status(400).send({ message: 'Введены некорректные данные.' });
    } else {
      res.status(500).send({ message: 'Серверная ошибка.' });
    }
  }
};

module.exports.deleteCard = async (req, res) => {
  try {
    const card = await Cards.findById(req.params.cardId)
      .orFail(new Error('NoValidId'));
    if (card.owner._id == req.user._id) {
      card.deleteOne();
      res.status(200).send({ message: 'Успешно удалено' });
    } else {
      res.status(403).send({ message: 'Можно удалять только свои катрочки.' });
    }
  } catch (err) {
    if (err.name === 'CastError') {
      res.status(400).send({ message: 'Переданы некорректные данные.' });
    } else if (err.message === 'NoValidId') {
      res.status(404).send({ message: 'Карточка с указанным _id не найдена.' });
    } else {
      res.status(500).send({ message: 'Серверная ошибка.' });
    }
  }
};

module.exports.likeCard = async (req, res) => {
  try {
    const like = await Cards.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    )
      .orFail(new Error('NoValidId'));
    res.status(200).send(like);
  } catch (err) {
    if (err.name === 'CastError') {
      res.status(400).send({ message: 'Переданы некорректные данные для постановки/снятии лайка.' });
    } else if (err.message === 'NoValidId') {
      res.status(404).send({ message: 'Карточка не найдена.' });
    } else {
      res.status(500).send({ message: 'Серверная ошибка.' });
    }
  }
};

module.exports.dislikeCard = async (req, res) => {
  try {
    const dislike = await Cards.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    )
      .orFail(new Error('NoValidId'));
    res.status(200).send(dislike);
  } catch (err) {
    if (err.name === 'CastError') {
      res.status(400).send({ message: 'Переданы некорректные данные для постановки/снятии лайка.' });
    } else if (err.message === 'NoValidId') {
      res.status(404).send({ message: 'Карточка не найдена.' });
    } else {
      res.status(500).send({ message: 'Серверная ошибка.' });
    }
  }
};
