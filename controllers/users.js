const Users = require('../models/user');// импортируем модуль схемы юзера
const NotFoundError = require('../errors/NotFoundError'); // 404
const BadRequestError = require('../errors/BadRequestError'); // 400

module.exports.getUsers = (req, res, next) => {
  Users.find({})
    .then((user) => {
      res.status(200).send(user);
    })
    .catch(() => next(new NotFoundError('Запрашиваемый пользователь не найден')));
};

module.exports.getUserById = (req, res, next) => {
  Users.findById(req.user._id)
    .orFail(() => next(new NotFoundError('Пользователь с указанными ID в базе не найден!')))
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('В запросе переданы некорректные данные ID пользователя!'));
      }
      next(err);
    });
};

module.exports.updateProfile = (req, res, next) => {
  const { name, about } = req.body;

  Users.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .orFail(new Error('NotValidId'))
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.message === 'NotValidId') {
        next(new NotFoundError('Пользователь не найден!'));
      } else if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные профиля!'));
      } else { next(err); }
    });
};

module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;

  Users.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .orFail(new Error('NotValidId'))
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.message === 'NotValidId') {
        next(new NotFoundError('Пользователь с указанным ID в базе не найден!'));
      } else if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректная ссылка на изображения аватара!'));
      } else { next(err); }
    });
};
