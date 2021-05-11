const { celebrate, Joi } = require('celebrate');
const express = require('express');
const {
  getAllCards, deleteCard, createCard, likeCard, dislikeCard,
} = require('../controllers/cards');
const auth = require('../middlewares/auth');

const cardsRoutes = express.Router();

cardsRoutes.get('/', auth, getAllCards);

cardsRoutes.post('/', auth, celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string().required().pattern(/(https?:\/\/)(w{3}\.)?(((\d{1,3}\.){3}\d{1,3})|((\w-?)+\.(\w\w)))/),
  }),
}), createCard);

cardsRoutes.delete('/:cardId', auth, celebrate({
  body: Joi.object().keys({
    cardId: Joi.string().max(5),
  }),
}), deleteCard);

cardsRoutes.put('/:cardId/likes', auth, likeCard);

cardsRoutes.delete('/:cardId/likes', auth, dislikeCard);

module.exports = cardsRoutes;
