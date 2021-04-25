const express = require('express');
const { getAllCards, deleteCard, createCard } = require('../controllers/cards');

const cardsRoutes = express.Router();

cardsRoutes.get('/', getAllCards);

cardsRoutes.post('/', createCard);

cardsRoutes.delete('/:cardId', deleteCard);

module.exports = cardsRoutes;
