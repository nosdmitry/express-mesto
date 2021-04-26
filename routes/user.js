const express = require('express');
const {
  getUsers, getUsersById, createUser, updateUserProfile, updateUserAvatar,
} = require('../controllers/users');

const userRoutes = express.Router();

userRoutes.get('/', getUsers);

userRoutes.get('/:userId', getUsersById);

userRoutes.post('/', createUser);

userRoutes.patch('/me', updateUserProfile);

userRoutes.patch('/me/avatar', updateUserProfile);

module.exports = userRoutes;
