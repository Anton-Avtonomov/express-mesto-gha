// Подключение роутов
const cardRoutes = require('express').Router();
const { celebrate, Joi } = require('celebrate');


// Импорт функций запросов API
const {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');

// Маршрут получения карточек
cardRoutes.get('/', getCards);

// Маршрут создания карточки
cardRoutes.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2),
    link: Joi.string().required(),
  }),
}), createCard);

// Маршрут удаления карточки
cardRoutes.delete('/:cardId', celebrate({
  params: {
    cardId: Joi.string().required(),
  },
}), deleteCard);

// Маршрут Like карточки
cardRoutes.put('/:cardId/likes', celebrate({
  params: {
    cardId: Joi.string().required(),
  },
}), likeCard);

// Маршрут Dislike карточки
cardRoutes.delete('/:cardId/likes', celebrate({
  params: {
    cardId: Joi.string().required(),
  },
}), dislikeCard);

// Экспортируем модуль
module.exports = cardRoutes;
