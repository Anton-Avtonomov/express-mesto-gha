const bcrypt = require('bcrypt');
const Users = require('../models/user');

exports.getUsers = (req, res) => {
  Users.find({})
    .then((user) => res.send(user))
    .catch(() => {
      // console.log(`Имя ошибки: '${err.name}', текст ошибки: '${err.message}'`);
      res.status(500).send({ message: 'Запрашиваемый пользователь не найден' });
    })
    .finally(() => {
      console.log('Получен запрос на получение списка пользователей');
    });
};

exports.getUserById = (req, res) => {
  Users.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: 'Пользователь с указанными ID в базе не найден!' });
      }
      return res.status(200).send(user);
    })
    .catch((err) => {
      // Проверка
      // console.log(`Имя ошибки: '${err.name}', текст ошибки: '${err.message}'`);
      if (err.name === 'CastError') {
        return res.status(400).send({ message: 'В запросе переданы некорректные данные ID пользователя!' });
      }
      return res.status(500).send({ message: 'Произошла ошибка!' });
    })
    .finally(() => {
      console.log('Получен запрос на получение данных пользователя');
    });
};

exports.createUser = (req, res) => {
  // Хеширование пароля
  bcrypt.hash(req.body.password, 10)
    .then((hash) => Users.create({
      name: req.body.name,
      about: req.body.about,
      avatar: req.body.avatar,
      email: req.body.email,
      password: hash,
    }))
  // user - ответ сервера
    .then((user) => {
      res.status(201).send(user);
    })
    .catch((err) => {
      // Проверка
      // console.log(`Имя ошибки: '${err.name}', текст ошибки: '${err.message}'`);
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: 'Переданы некорректные данные Юзера!' });
      }
      if (err.message === 'NotFound') {
        return res.status(404).send({ message: 'Пользователь с указанными данными уже существует!' });
      }
      return res.status(500).send({ message: 'Произошла ошибка!' });
    })
    .finally(() => {
      console.log('Получен запрос на создание пользователя');
    });
};

exports.updateProfile = (req, res) => {
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
        return res.status(404).send({ message: 'Переданы некорректные данные профиля!' });
      }
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: 'Ошибка валидации' });
      }
      return res.status(500).send({ message: 'Произошла ошибка!' });
    })
    .finally(() => {
      console.log('Получен запрос на изменение данных карточки LIKE');
    });
};

exports.updateAvatar = (req, res) => {
  const owner = req.user._id;
  const { avatar } = req.body;

  Users.findByIdAndUpdate(owner, { avatar }, { new: true, runValidators: true })
    .orFail(new Error('NotValidId'))
    .then((user) => res.status(200).send(user))
    .catch((err) => {
    // Проверка
      console.log(`Имя ошибки: '${err.name}', текст ошибки: '${err.message}'`);
      if (err.message === 'NotValidId') {
        return res.status(404).send({ message: 'Пользователь с указанным ID в базе не найден!' });
      }
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: 'Переданы некорректная ссылка на изображения аватара!' });
      }
      return res.status(500).send({ message: 'Произошла ошибка!' });
    })
    .finally(() => {
      console.log('Получен запрос на изменение автара пользователя');
    });
};
