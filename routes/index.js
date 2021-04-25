const express = require('express');
const cardsRoutes = require('./cards');
const userRoutes = require('./user');

const routes = express.Router();

routes.use('/users', userRoutes);

routes.use('/cards', cardsRoutes);

exports.routes = routes;
