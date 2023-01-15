/* eslint-disable consistent-return */
/* eslint-disable no-console */
const bcrypt = require('bcrypt'); // импортируем модуль хеширования
const jwt = require('jsonwebtoken'); // импортируем модуль jsonwebtoken
const Users = require('../models/user');// импортируем модуль схемы юзера
const NotFoundError = require('../errors/NotFoundError'); // 404
const AuthError = require('../errors/AuthError'); // 401
const RequestError = require('../errors/RequestError'); // 400

exports.getUsers = (req, res, next) => {
  Users.find({})
    .then((user) => res.send(user))
    .catch(() => {
      // console.log(`Имя ошибки: '${err.name}', текст ошибки: '${err.message}'`);
      next(new NotFoundError('Запрашиваемый пользователь не найден!'));
    })
    .finally(() => {
      console.log('Получен запрос на получение списка пользователей');
    });
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
      next();
    })
    .finally(() => {
      console.log('Получен запрос на получение данных пользователя');
    });
};

exports.createUser = (req, res, next) => {
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
      // console.log(`Пользователь создан и присвоен ObjectId: '${user._id}'`);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new RequestError('Переданы некорректные данные Юзера!'));
      }
      if (err.message === 'NotFound') {
        next(new NotFoundError('Пользователь с указанными данными уже существует!'));
      }
      next();
    })
    .finally(() => {
      console.log('Получен запрос на создание пользователя');
    });
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
      next();
    })
    .finally(() => {
      console.log('Получен запрос на изменение данных карточки LIKE');
    });
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
      next();
    })
    .finally(() => {
      console.log('Получен запрос на изменение автара пользователя');
    });
};

exports.login = (req, res, next) => {
  const { email, password } = req.body;
  // Ищем пользователя в БД по email
  Users.findOne({ email }).select('+password') // Добавляем user поле .password!
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error('Неправильные почта или пароль'));
      }
      return bcrypt.compare(password, user.password) // Сравниваем пароль с данными БД
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new Error('Неправильные почта или пароль'));
          }
          const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' }); // Создаём JWT на 7 дней
          res.status(201)
            .cookie('jwt', token, {
              maxAge: 3600000 * 24 * 7, // Задаём срок хранения кука в неделю час * 24 * 7дней
              httpOnly: true, // Запрещаем доступ к куку из JS
            })
            // .end(); // если у ответа нет тела, можно использовать метод end
            .send({ message: 'Успешная аунтификация, кук с JWT создан и отправлен!' }); // тело ответа
        })
        .catch((err) => {
          next(new AuthError(`Ошибка авторизации! : '${err}'`));
        });
    });
};
