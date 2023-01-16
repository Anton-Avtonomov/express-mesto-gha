const usersRoutes = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const auth = require('../middlewares/auth');
const {
  getUsers, getUserById, updateAvatar, updateProfile,
} = require('../controllers/users');

usersRoutes.get('/', auth, getUsers);

usersRoutes.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    about: Joi.string().min(2).max(30).required(),
  }).unknown(true), // Разрешаем запросу иметь другие поля
}), auth, updateProfile);

usersRoutes.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    link: Joi.string().min(12),
  }),
}), auth, updateAvatar);

usersRoutes.get('/:userId', celebrate({
  body: Joi.object().keys({
    userId: Joi.string().required().length(24).hex(),
  }),
}), auth, getUserById);

module.exports = usersRoutes;
