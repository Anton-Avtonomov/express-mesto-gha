/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable no-console */
/* eslint-disable consistent-return */
/* eslint-disable no-array-constructor */
const Cards = require('../models/card');
const NotFoundError = require('../errors/NotFoundError'); // 404
const BadRequestError = require('../errors/BadRequestError'); // 400
const ForbiddenError = require('../errors/ForbiddenError'); // 403

// Запрос получения карточки
exports.getCards = (req, res, next) => {
  Cards.find({}) // find - фильтр
    .then((card) => {
      res.status(200).send({ data: card });
      next(new BadRequestError('Запрашиваемая карточка не найдена!'));
    })
    .catch((err) =>
      // console.log(`Имя ошибки: '${err.name}', текст ошибки: '${err.message}'`);
      next(err)); // Передаю ошибку в централизованный обработчик ошибок
  // .finally(() => {
  //   console.log('Получен запрос на получение карточек');
  // });
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
      res.status(201).send({ data: card });
    })
    .catch((err) => {
      // console.log(`Имя ошибки: '${err.name}', текст ошибки: '${err.message}'`);
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Ошибка валидации отправленных данных!'));
      }
      next(err);
    });
  // .finally(() => {
  //   console.log('Получен запрос на создание карточки!');
  // });
};

exports.deleteCardById = (req, res, next) => {
  const { cardId } = req.params;
  Cards.findById(cardId)
    .orFail(() => {
      throw new NotFoundError('Карточка не найдена');
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
    .catch(next);
  // .finally(() => {
  //   console.log('Получен запрос на удаление карточки!');
  // });
};

exports.likeCard = (req, res, next) => {
  Cards.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true }, // передать в ответ обновленный объект
  )
    .orFail(new Error('NotFoundCardId')) // Если вернется пустой ответ
    .then((card) => {
      res.status(200).send({ data: card });
    })
    .catch((err) => {
      // console.log(`Имя ошибки: '${err.name}', текст ошибки: '${err.message}'`);
      if (err.name === 'CastError') {
        return next(new BadRequestError('Переданы некорректные данные для добавления лайка!'));
      } if (err.message === 'NotFound') {
        return next(new NotFoundError('ID карточки не найден!'));
      }
      next(err);
    });
  // .finally(() => {
  //   console.log('Получен запрос на добавление LIKE!');
  // });
};

exports.dislikeCard = (req, res, next) => {
  Cards.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true }, // передать в ответ обновленный объект
  )
    .then((card) => {
      res.status(200).send({ data: card });
    })
    .catch((err) => {
      // console.log(`Имя ошибки: '${err.name}', текст ошибки: '${err.message}'`);
      if (err.name === 'CastError') {
        return next(new BadRequestError('Переданы некорректные данные для функции лайка!'));
      }
      if (err.message === 'NotFound') {
        next(new NotFoundError(`Карточка с указанным ID: '${req.params}' не найдена!`));
      }
      next(err);
    });
  // .finally(() => {
  //   console.log('Получен запрос на удаления LIKE!');
  // });
};
