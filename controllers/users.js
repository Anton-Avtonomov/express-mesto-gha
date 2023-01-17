/* eslint-disable consistent-return */
/* eslint-disable no-console */
const Users = require('../models/user');// импортируем модуль схемы юзера
const NotFoundError = require('../errors/NotFoundError'); // 404
const RequestError = require('../errors/BadRequestError'); // 400

exports.getUsers = (req, res, next) => {
  Users.find({})
    .then((user) => res.send(user))
    .catch(() => {
      // console.log(`Имя ошибки: '${err.name}', текст ошибки: '${err.message}'`);
      next(new NotFoundError('Запрашиваемый пользователь не найден!'));
    });
  // .finally(() => {
  //   console.log('Получен запрос на получение списка пользователей');
  // });
};

exports.getUserById = (req, res, next) => {
  Users.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        next(new NotFoundError('Пользователь с указанными ID в базе не найден!'));
      }
      console.log(req.params);
      return res.status(200).send(user);
    })
    .catch((err) => {
      // Проверка
      // console.log(`Имя ошибки: '${err.name}', текст ошибки: '${err.message}'`);
      if (err.name === 'CastError') {
        next(new RequestError('В запросе переданы некорректные данные ID пользователя!'));
      }
      next(err);
    });
  // .finally(() => {
  //   console.log('Получен запрос на получение данных пользователя!');
  // });
};

exports.updateProfile = (req, res, next) => {
  const { name, about } = req.body;

  Users.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    // Если ответ будет пустым конструкция orFail перекинет в блок catch
    .orFail(new Error('NotValidId'))
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      // Проверка
      console.log(`Имя ошибки: '${err.name}', текст ошибки: '${err.message}'`);
      if (err.message === 'NotValidId') {
        next(new NotFoundError('Пользователь не найден!'));
      }
      if (err.name === 'ValidationError') {
        next(new RequestError('Переданы некорректные данные профиля!'));
      }
      next(err);
    });
  // .finally(() => {
  //   console.log('Получен запрос на изменение данных профиля!');
  // });
};

exports.updateAvatar = (req, res, next) => {
  const owner = req.user._id;
  const { avatar } = req.body;

  Users.findByIdAndUpdate(owner, { avatar }, { new: true, runValidators: true })
    .orFail(new Error('NotValidId'))
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      // console.log(`Имя ошибки: '${err.name}', текст ошибки: '${err.message}'`); // Проверка
      if (err.message === 'NotValidId') {
        next(new NotFoundError('Пользователь с указанным ID в базе не найден!'));
      }
      if (err.name === 'ValidationError') {
        next(new RequestError('Переданы некорректная ссылка на изображения аватара!'));
      }
      next(err);
    });
  // .finally(() => {
  //   console.log('Получен запрос на изменение автара пользователя!');
  // });
};
