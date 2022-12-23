/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable no-console */
/* eslint-disable no-underscore-dangle */
const Cards = require('../models/card');

// Запрос получения карточки
exports.getCards = (req, res) => {
  console.log(req.body);
  // find - фильтр
  Cards.find({})
    .then((card) => {
      if (card) {
        return res.status(200).send({ data: card });
      }
      return res.status(400).send({ message: 'Запрашиваемая карточка не найдена!' });
    })
    .catch(() =>
      // console.log(`Имя ошибки: '${err.name}', текст ошибки: '${err.message}'`);
      res.status(500).send({ message: 'Произошла ошибка!' }))
    .finally(() => {
      console.log('Получен запрос на получение карточек');
    });
};

// Запрос создания карточки
exports.createCard = (req, res) => {
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
        res.status(400).send({ message: 'Ошибка валидации отправленных данных!' });
      } else {
        res.status(500).send({ message: 'Произошла ошибка!' });
      }
    })
    .finally(() => {
      console.log('Получен запрос на создание карточки');
    });
};

exports.deleteCard = (req, res) => {
  Cards.deleteMany({})
    .orFail(new Error('NotFoundCardId'))
    .then((card) => {
      res.status(200).send(card);
    })
    .catch((err) => {
      console.log(`Имя ошибки: '${err.name}', текст ошибки: '${err.message}'`);
      if (err.message === 'NotFoundCardId') {
        return res.status(404).send({ message: 'Карточка с указанным ID  не найдена!' });
      }
      if (err.name === 'CastError') {
        return res.status(400).send({ message: 'кастомная ошибка!' });
      }
      return res.status(500).send({ message: 'Произошла ошибка!' });
    })
    .finally(() => {
      console.log('Получен запрос на удаление карточки');
    });
};

exports.likeCard = (req, res) => {
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
        return res.status(400).send({ message: 'Переданы некорректные данные для добавления лайка!' });
      }
      if (err.message === 'NotFound') {
        return res.status(404).send({ message: 'ID карточки не найден!' });
      }
      return res.status(500).send({ message: 'Произошла ошибка!' });
    })
    .finally(() => {
      console.log('Получен запрос на добавление LIKE');
    });
};

exports.dislikeCard = (req, res) => {
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
        return res.status(400).send({ message: 'Переданы некорректные данные для функции лайка.' });
      }
      if (err.message === 'NotFound') {
        return res.status(404).send({ message: `Карточка с указанным ID: '${req.params}' не найдена!` });
      }
      return res.status(500).send({ message: 'Произошла ошибка' });
    })
    .finally(() => {
      console.log('Получен запрос на удаления LIKE');
    });
};
