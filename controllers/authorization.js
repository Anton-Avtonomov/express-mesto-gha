/* eslint-disable no-console */
/* eslint-disable consistent-return */
const bcrypt = require('bcrypt'); // импортируем модуль хеширования
const jwt = require('jsonwebtoken'); // импортируем модуль jsonwebtoken
const Users = require('../models/user');// импортируем модуль схемы юзера
const NotFoundError = require('../errors/NotFoundError'); // 404
const AuthorizationError = require('../errors/AuthorizationError'); // 401
const RequestError = require('../errors/BadRequestError'); // 400

exports.login = (req, res, next) => {
  const { email, password } = req.body;
  // Ищем пользователя в БД по email
  Users.findOne({ email }).select('+password') // Добавляем user поле .password!
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error('Неправильные почта или пароль!'));
      }
      return bcrypt.compare(password, user.password) // Сравниваем пароль с данными БД
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new Error('Неправильные почта или пароль!'));
          }
          const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' }); // Создаём JWT на 7 дней
          res.status(201)
            .cookie('jwt', token, {
              maxAge: 3600000 * 24 * 7, // Задаём срок хранения кука в неделю час * 24 * 7дней
              httpOnly: true, // Запрещаем доступ к куку из JS
            })
            // .end(); // если у ответа нет тела, можно использовать метод end
            .send({ message: 'Успешная аунтификация, кук с JWT создан и отправлен!', jwt: token }); // тело ответа
        })
        .catch((err) => {
          next(new AuthorizationError(`Ошибка авторизации! : '${err}'`));
        });
      // .finally(() => {
      //   console.log('Получен запрос на АВТОРИЗАЦИЮ!');
      // });
    });
};

exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  // Хеширование пароля
  bcrypt.hash(password, 10)
    .then((hash) => Users.create({
      name, about, avatar, email, password: hash,
    }))
    .then(() => res.status(201).send({ //
      data: {
        email, name, about, avatar, // Отправляем все кроме пароля!
      },
    }))
    // console.log(`Пользователь создан и присвоен ObjectId: '${user._id}'`);
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new RequestError('Переданы некорректные данные Юзера!'));
      }
      if (err.message === 'NotFound') {
        next(new NotFoundError('Пользователь с указанными данными уже существует!'));
      }
      next(err);
    });
  // .finally(() => {
  //   console.log('Получен запрос на создание пользователя!');
  // });
};
