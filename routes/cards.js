const express = require('express');
const {
  getAllCards, deleteCard, createCard, likeCard, dislikeCard,
} = require('../controllers/cards');
const auth = require('../middlewares/auth');

const cardsRoutes = express.Router();

cardsRoutes.get('/', auth, getAllCards);

cardsRoutes.post('/', auth, createCard);

cardsRoutes.delete('/:cardId', auth, deleteCard);

cardsRoutes.put('/:cardId/likes', auth, likeCard);

cardsRoutes.delete('/:cardId/likes', auth, dislikeCard);

module.exports = cardsRoutes;
