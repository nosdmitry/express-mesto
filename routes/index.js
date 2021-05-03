const express = require('express');
const { createUser, login } = require('../controllers/users');
const auth = require('../middlewares/auth');
const cardsRoutes = require('./cards');
const { handleError } = require('./errors');
const userRoutes = require('./user');

const routes = express.Router();

routes.post('/signin', login);

routes.post('/signup', createUser);

routes.use('/users', auth, userRoutes);

routes.use('/cards', auth, cardsRoutes);

routes.get('*', handleError);

exports.routes = routes;
