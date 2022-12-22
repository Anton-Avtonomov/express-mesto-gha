/* eslint-disable no-underscore-dangle */
const Cards = require('../models/card');

// Запрос получения карточки
exports.getCards = (req, res) => {
  console.log(req.body);
  // find - фильтр
  Cards.find({})
    .then((card) => {
      if (card) {
        res.status(201).send({ data: card });
      } else {
        res.status(400).send({ message: 'Запрашиваемая карточка не найдена!' });
      }
    })
    .catch(() => {
      res.status(500).send({ message: 'Произошла ошибка!' });
    })
    .finally(() => {
      console.log(`req.body = ${req.body}, result = ${res}`);
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
      if (err) {
        res.status(400).send(err.message);
      } else {
        res.status(500).send('Произошла ошибка!');
      }
    });
};

exports.deleteCard = (req, res) => {
  Cards.delete({})
    .then((card) => {
      res.status(201).send(card);
    })
    .catch((err) => {
      if (err) {
        res.status(404).send({ message: 'Карточка с указанным ID не найдена!' });
      } else {
        res.status(500).send({ message: 'Произошла ошибка!' });
      }
    });
};

exports.likeCard = (res, req) => {
  const owner = req.user._id;

  Cards.findByIdAndUpdate(
    req.params.cardId,
    owner,
    { $addToSet: { likes: req.user._id } },

    { new: true },
  )
    .then((card) => {
      res.status(200).send({ data: card });
    })
    .catch((err) => {
      if (err) {
        res.status(404).send({ message: 'Переданы некорректные данные для функции лайка.' });
      } else {
        res.status(500).send({ message: 'Произошла ошибка' });
      }
    });
};

exports.dislikeCard = (res, req) => {
  const owner = req.user._id;

  Cards.findByIdAndUpdate(
    req.params.cardId,
    owner,
    { $pull: { likes: req.user._id } },

    { new: true },
  )
    .then((card) => {
      res.status(200).send({ data: card });
    })
    .catch((err) => {
      if (err) {
        res.status(404).send({ message: 'Переданы некорректные данные для функции лайка.' });
      } else {
        res.status(500).send({ message: 'Произошла ошибка' });
      }
    });
};
