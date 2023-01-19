const usersRoutes = require('express').Router();
const auth = require('../middlewares/auth');
const {
  getUsers,
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

usersRoutes.patch('/me', auth, validationUpdateUserInfo, updateProfile);

usersRoutes.patch('/me/avatar', auth, validationUpdateUserAvatar, updateAvatar);

usersRoutes.get('/:userId', auth, validationFindUserById, getUserById);

module.exports = usersRoutes;
