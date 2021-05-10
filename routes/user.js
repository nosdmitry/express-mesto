const express = require('express');
const { celebrate, Joi, Segments } = require('celebrate');
const {
  getUsers, getUsersById, createUser, updateUserProfile, getUserInfo,
} = require('../controllers/users');
const auth = require('../middlewares/auth');

const userRoutes = express.Router();

userRoutes.get('/', auth, getUsers);

userRoutes.get('/me', auth, getUserInfo);

userRoutes.get('/:userId', auth, getUsersById);

userRoutes.post('/', auth, createUser);

userRoutes.patch('/me', auth, celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  })
}), updateUserProfile);

userRoutes.patch('/me/avatar', auth, celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().pattern(/(https?:\/\/)(w{3}\.)?(((\d{1,3}\.){3}\d{1,3})|((\w-?)+\.(\w\w)))/),
  }),
}), updateUserProfile);

module.exports = userRoutes;
