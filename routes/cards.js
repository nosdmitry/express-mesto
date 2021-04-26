const express = require('express');
const {
  getAllCards, deleteCard, createCard, likeCard, dislikeCard,
} = require('../controllers/cards');

const cardsRoutes = express.Router();

cardsRoutes.get('/', getAllCards);

cardsRoutes.post('/', createCard);

cardsRoutes.delete('/:cardId', deleteCard);

cardsRoutes.put('/:cardId/likes', likeCard);

cardsRoutes.delete('/:cardId/likes', dislikeCard);

module.exports = cardsRoutes;
