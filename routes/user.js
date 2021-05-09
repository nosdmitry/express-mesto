const express = require('express');
const {
  getUsers, getUsersById, createUser, updateUserProfile, getUserInfo,
} = require('../controllers/users');
const auth = require('../middlewares/auth');

const userRoutes = express.Router();

userRoutes.get('/', auth, getUsers);

userRoutes.get('/me', auth, getUserInfo);

userRoutes.get('/:userId', auth, getUsersById);

userRoutes.post('/', auth, createUser);

userRoutes.patch('/me', auth, updateUserProfile);

userRoutes.patch('/me/avatar', auth, updateUserProfile);

module.exports = userRoutes;
