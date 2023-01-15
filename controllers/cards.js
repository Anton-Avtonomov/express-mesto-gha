/* eslint-disable consistent-return */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable no-console */
/* eslint-disable no-underscore-dangle */
const Cards = require('../models/card');
const NotFoundError = require('../errors/NotFoundError'); // 404
const RequestError = require('../errors/RequestError'); // 400

// Запрос получения карточки
exports.getCards = (req, res, next) => {
  console.log(req.body);
  // find - фильтр
  Cards.find({})
    .then((card) => {
      if (card) {
        return res.status(200).send({ data: card });
      }
      next(new RequestError('Запрашиваемая карточка не найдена!'));
    })
    .catch(() =>
      // console.log(`Имя ошибки: '${err.name}', текст ошибки: '${err.message}'`);
      next())
    .finally(() => {
      console.log('Получен запрос на получение карточек');
    });
};

// Запрос создания карточки
exports.createCard = (req, res, next) => {
// Достаем свойства из запроса
  const owner = req.user._id;
  const { name, link } = req.body;
  // Проверка
  console.log(name, link, req.user._id);

  Cards.create({ name, link, owner })
    .then((card) => {
      Cards.find({}).populate(['owner', 'likes']);
      res.status(201).send(card);
    })
    .catch((err) => {
      // console.log(`Имя ошибки: '${err.name}', текст ошибки: '${err.message}'`);
      if (err.name === 'ValidationError') {
        next(new RequestError('Ошибка валидации отправленных данных!'));
      } else {
        next();
      }
    })
    .finally(() => {
      console.log('Получен запрос на создание карточки');
    });
};

exports.deleteCard = (req, res, next) => {
  Cards.deleteMany({})
    .orFail(new Error('NotFoundCardId'))
    .then((card) => {
      res.status(200).send(card);
    })
    .catch((err) => {
      console.log(`Имя ошибки: '${err.name}', текст ошибки: '${err.message}'`);
      if (err.message === 'NotFoundCardId') {
        next(new NotFoundError('Карточка с указанным ID  не найдена!'));
      }
      if (err.name === 'CastError') {
        next(new RequestError('кастомная ошибка!'));
      }
      next();
    })
    .finally(() => {
      console.log('Получен запрос на удаление карточки');
    });
};

exports.likeCard = (req, res, next) => {
  Cards.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true }, // передать в ответ обновленный объект
  )
    .then((card) => {
      res.status(201).send({ data: card });
    })
    .catch((err) => {
      console.log(`Имя ошибки: '${err.name}', текст ошибки: '${err.message}'`);
      if (err.name === 'CastError') {
        next(new RequestError('Переданы некорректные данные для добавления лайка!'));
      }
      if (err.message === 'NotFound') {
        next(new NotFoundError('ID карточки не найден!'));
      }
      next();
    })
    .finally(() => {
      console.log('Получен запрос на добавление LIKE');
    });
};

exports.dislikeCard = (req, res, next) => {
  Cards.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true }, // передать в ответ обновленный объект
  )
    .orFail(new Error('NotFound'))
    .then((card) => {
      res.status(201).send({ data: card });
    })
    .catch((err) => {
      console.log(`Имя ошибки: '${err.name}', текст ошибки: '${err.message}'`);
      if (err.name === 'CastError') {
        next(new RequestError('Переданы некорректные данные для функции лайка!'));
      }
      if (err.message === 'NotFound') {
        next(new NotFoundError(`Карточка с указанным ID: '${req.params}' не найдена!`));
      }
      next();
    })
    .finally(() => {
      console.log('Получен запрос на удаления LIKE');
    });
};
