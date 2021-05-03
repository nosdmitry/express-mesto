const express = require('express');
const {
  getUsers, getUsersById, createUser, updateUserProfile,
} = require('../controllers/users');
const auth = require('../middlewares/auth');

const userRoutes = express.Router();

userRoutes.get('/', auth, getUsers);

userRoutes.get('/:userId', getUsersById);

userRoutes.post('/', createUser);

userRoutes.patch('/me', updateUserProfile);

userRoutes.patch('/me/avatar', updateUserProfile);

module.exports = userRoutes;
