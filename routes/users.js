const usersRoutes = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getUsers, getUserById, updateAvatar, updateProfile,
} = require('../controllers/users');

usersRoutes.get('/', getUsers);

usersRoutes.get('/:userId', getUserById);

usersRoutes.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
}), updateProfile);

usersRoutes.patch('/me/avatar', updateAvatar);

module.exports = usersRoutes;
