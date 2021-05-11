const express = require('express');
const { celebrate, Joi } = require('celebrate');
const { createUser, login } = require('../controllers/users');
const auth = require('../middlewares/auth');
const cardsRoutes = require('./cards');
const { handleError } = require('./errors');
const userRoutes = require('./user');

const routes = express.Router();

routes.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required().min(2),
  }),
}), login);

routes.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required().min(2),
  }),
}), createUser);

routes.use('/users', auth, userRoutes);

routes.use('/cards', auth, cardsRoutes);

routes.get('*', handleError);

exports.routes = routes;
