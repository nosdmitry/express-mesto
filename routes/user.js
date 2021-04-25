const express = require('express');
const { getUsers, getUsersById, createUser } = require('../controllers/users');

const userRoutes = express.Router();

userRoutes.get('/', getUsers);

userRoutes.get('/:userId', getUsersById);

userRoutes.post('/', createUser);

module.exports = userRoutes;
