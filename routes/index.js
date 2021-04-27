const express = require('express');
const cardsRoutes = require('./cards');
const { handleError } = require('./errors');
const userRoutes = require('./user');

const routes = express.Router();

routes.use('/users', userRoutes);

routes.use('/cards', cardsRoutes);

routes.get('*', handleError);

exports.routes = routes;
