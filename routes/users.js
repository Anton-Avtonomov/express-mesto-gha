const usersRoutes = require('express').Router();

const {
  getUsers, createUser, getUserById, updateAvatar, updateProfile,
} = require('../controllers/users');

usersRoutes.get('/', getUsers);

usersRoutes.post('/', createUser);

usersRoutes.get('/:userId', getUserById);

usersRoutes.patch('/me', updateProfile);

usersRoutes.patch('/me/avatar', updateAvatar);

module.exports = usersRoutes;
