const Users = require('../models/user');// импортируем модуль схемы юзера
const NotFoundError = require('../errors/NotFoundError'); // 404
const BadRequestError = require('../errors/BadRequestError'); // 400

exports.getUsers = (req, res, next) => {
  Users.find({})
    .then((user) => res.staus(200).send(user))
    .catch(() => next(new NotFoundError('Запрашиваемый пользователь не найден')));
};

exports.getUserById = (req, res, next) => {
  Users.findById(req.params.userId)
    .orFail(() => next(new NotFoundError('Пользователь с указанными ID в базе не найден!')))
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('В запросе переданы некорректные данные ID пользователя!'));
      } else { next(err); }
    });
};

exports.updateProfile = (req, res, next) => {
  const { name, about } = req.body;
  const owner = req.user._id;

  Users.findByIdAndUpdate(owner, { name, about }, { new: true, runValidators: true })
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

exports.updateAvatar = (req, res, next) => {
  const owner = req.user._id;
  const { avatar } = req.body;

  Users.findByIdAndUpdate(owner, { avatar }, { new: true, runValidators: true })
    .orFail(new Error('NotValidId'))
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.message === 'NotValidId') {
        next(new NotFoundError('Пользователь с указанным ID в базе не найден!'));
      } else if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректная ссылка на изображения аватара!'));
      } else { next(err); }
    });
}; // final
