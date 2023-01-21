/* eslint-disable consistent-return */
const bcrypt = require('bcrypt'); // импортируем модуль хеширования
const jwt = require('jsonwebtoken'); // импортируем модуль jsonwebtoken
const Users = require('../models/user');// импортируем модуль схемы юзера
const AuthorizationError = require('../errors/AuthorizationError'); // 401
const BadRequestError = require('../errors/BadRequestError'); // 400
const ConflictError = require('../errors/ConflictError'); // 409

exports.login = (req, res, next) => {
  const { email, password } = req.body;
  Users.findOne({ email }).select('+password') // Ищем пользователя в БД по email  и Добавляем user поле .password!
    .then((user) => {
      if (!user) {
        return Promise.reject(new AuthorizationError('Пользователь не зарегистрирован!'));
        // throw new AuthorizationError('Неправильные почта или пароль!');
      }
      bcrypt.compare(password, user.password) // Сравниваем пароль с данными БД
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new AuthorizationError('Неправильная почта или пароль!'));
          }
          const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' }); // Создаём JWT на 7 дней
          res.status(200).cookie('jwt', token, {
            maxAge: 3600000 * 24 * 7, // Задаём срок хранения кука в неделю час * 24 * 7дней
            httpOnly: true, // Запрещаем доступ к куку из JS
          })
            .send({ message: 'Успешная аунтификация, кук с JWT создан и отправлен!', jwt: token }); // если у ответа нет тела, можно использовать метод .end();
        });
    })
    .catch((err) => {
      next(err);
    });
};

exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, 10) // Хеширование пароля
    .then((hash) => {
      Users.create({
        name, about, avatar, email, password: hash,
      })
        .then(() => res.status(201).send({
          data: {
            email, name, about, avatar, // Отправляем все кроме пароля!
          },
        }))
        .catch((err) => {
          if (err.code === 11000) {
            next(new ConflictError(`Пользователь с указанными email: ${req.body.email} уже существует!`));
          } else if (err.name === 'ValidationError') {
            next(new BadRequestError('Введены некорректные данные Юзера!'));
          } else { next(err); }
        });
    }).catch(next);
};
