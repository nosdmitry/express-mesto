const NotAuthorizedError = require('../errors/NotAuthorizedError');
const NotCorrectDataError = require('../errors/NotCorrectDataError');
const NotFoundError = require('../errors/NotFoundError');
const { Cards } = require('../models/cards');

module.exports.getAllCards = async (req, res, next) => {
  try {
    const cards = await Cards.find({})
      .populate('owner');
    res.send(await cards);
  } catch (err) {
    next(err);
  }
};

module.exports.createCard = async (req, res, next) => {
  try {
    const card = await Cards({ ...req.body, owner: req.user._id });
    res.status(200).send(await card.save());
  } catch (err) {
    next(err);
  }
};

module.exports.deleteCard = async (req, res, next) => {
  try {
    const card = await Cards.findById(req.params.cardId);
    if (!card) {
      throw new NotFoundError('Карточка с указанным _id не найдена.');
    }
    if (card.owner._id.toString() === req.user._id) {
      card.deleteOne();
      res.status(200).send({ message: 'Успешно удалено' });
    } else {
      throw new NotAuthorizedError('Можно удалять только свои катрочки.');
    }
  } catch (err) {
    if (err.name === 'CastError') {
      next(new NotCorrectDataError('Переданы некорректные данные.'));
    }
    next(err);
  }
};

module.exports.likeCard = async (req, res, next) => {
  try {
    const like = await Cards.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    );
    if (!like) {
      throw new NotFoundError('Карточка не найдена.');
    }
    res.status(200).send(like);
  } catch (err) {
    if (err.name === 'CastError') {
      next(new NotCorrectDataError('Переданы некорректные данные для постановки/снятии лайка.'));
    }
    next(err);
  }
};

module.exports.dislikeCard = async (req, res, next) => {
  try {
    const dislike = await Cards.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    );
    if (!dislike) {
      throw new NotFoundError('Карточка не найдена.');
    }
    res.status(200).send(dislike);
  } catch (err) {
    if (err.name === 'CastError') {
      next(new NotCorrectDataError('Переданы некорректные данные для постановки/снятии лайка.'));
    }
    next(err);
  }
};
