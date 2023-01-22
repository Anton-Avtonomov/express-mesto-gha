/* eslint-disable no-console */
const Cards = require('../models/card');
const NotFoundError = require('../errors/NotFoundError'); // 404
const BadRequestError = require('../errors/BadRequestError'); // 400
const ForbiddenError = require('../errors/ForbiddenError'); // 403

// Запрос получения карточки
module.exports.getCards = (req, res, next) => {
  Cards.find({}) // find - фильтр
    .then((card) => {
      res.status(200).send({ data: card });
    })
    .catch((err) => next(err)); // Передаю ошибку в централизованный обработчик ошибок
};

// Запрос создания карточки
module.exports.createCard = (req, res, next) => {
  // Достаем свойства из запроса
  const owner = req.user._id;
  const { name, link } = req.body;

  Cards.create({ name, link, owner })
    .then((card) => {
      res.status(201).send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Ошибка валидации отправленных данных!'));
      } else { next(err); }
    });
};

module.exports.deleteCardById = (req, res, next) => {
  Cards.findById(req.params.cardId)
    .orFail(() => {
      throw new NotFoundError('Карточка не найдена!');
    })
    .then((card) => {
      if (!card.owner.equals(req.user._id)) {
        return next(new ForbiddenError('Вы не можете удалить чужую карточку!'));
      }
      return card.remove()
        .then(() => {
          res.send({ message: 'Карточка удалена!' });
        });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Неверный формат ID!'));
      } else {
        next(err);
      }
    });
};

module.exports.likeCard = (req, res, next) => {
  Cards.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true }, // передать в ответ обновленный объект
  )
    .orFail(() => {
      throw new NotFoundError('Карточка не найдена!');
    }) // Если вернется пустой ответ
    .then((card) => {
      res.status(200).send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Неверный формат ID!'));
      } else {
        next(err);
      }
    });
};

module.exports.dislikeCard = (req, res, next) => {
  Cards.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true }, // передать в ответ обновленный объект
  )
    .orFail(new NotFoundError(`Карточка с указанным ID: '${req.params}' не найдена!`))
    .then((card) => {
      res.status(200).send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Неверный формат ID!'));
      } else {
        next(err);
      }
    });
};
