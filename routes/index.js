const express = require('express');
const { createUser, login } = require('../controllers/users');
const cardsRoutes = require('./cards');
const { handleError } = require('./errors');
const userRoutes = require('./user');

const routes = express.Router();

routes.post('/signin', login);

routes.post('/signup', createUser);

routes.use('/users', userRoutes);

routes.use('/cards', cardsRoutes);

routes.get('*', handleError);

exports.routes = routes;
