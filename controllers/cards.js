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
        res.status(404).send({ message: `Карточка с ID '${req.url}' не найдена!` });
      } else {
        res.status(500).send({ message: 'Произошла ошибка!' });
      }
    })
    .finally(() => {
      console.log('Получен запрос на удаление карточки');
    });
};

exports.likeCard = (res, req) => {
  const owner = req.params.cardId;
  console.log(req.params);

  Cards.findByIdAndUpdate(
    req.params.cardId,
    owner,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )

    .then((card) => {
      res.status(201).send({ data: card });
    })
    .catch((err) => {
      console.log(`Имя ошибки: '${err.name}', текст ошибки: '${err.message}'`);
      if (err) {
        res.status(404).send({ message: 'Переданы некорректные данные для функции лайка!' });
      } else {
        res.status(500).send({ message: 'Произошла ошибка!' });
      }
    })
    .finally(() => {
      console.log('Получен запрос на добавление LIKE');
    });
};

exports.dislikeCard = (res, req) => {
  const owner = req.params.cardId;

  Cards.findByIdAndUpdate(
    req.params.cardId,
    owner,
    { $pull: { likes: req.user._id } },

    { new: true },
  )
    .then((card) => {
      res.status(201).send({ data: card });
    })
    .catch((err) => {
      console.log(`Имя ошибки: '${err.name}', текст ошибки: '${err.message}'`);
      if (err) {
        res.status(404).send({ message: 'Переданы некорректные данные для функции лайка.' });
      } else {
        res.status(500).send({ message: 'Произошла ошибка' });
      }
    })
    .finally(() => {
      console.log('Получен запрос на удаления LIKE');
    });
};
