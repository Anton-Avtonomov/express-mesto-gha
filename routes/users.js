const usersRoutes = require('express').Router();

const {
  getUsers,
  getUserInfo,
  getUserById,
  updateAvatar,
  updateProfile,
} = require('../controllers/users');

const {
  validationUpdateUserAvatar,
  validationUpdateUserInfo,
  validationFindUserById,
} = require('../middlewares/joi');

usersRoutes.get('/', getUsers);

usersRoutes.get('/me', getUserInfo);

usersRoutes.patch('/me', validationUpdateUserInfo, updateProfile);

usersRoutes.patch('/me/avatar', validationUpdateUserAvatar, updateAvatar);

usersRoutes.get('/:userId', validationFindUserById, getUserById);

module.exports = usersRoutes;
