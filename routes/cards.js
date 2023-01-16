const cardRoutes = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const auth = require('../middlewares/auth');
const {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards'); // Импорт функций запросов API

// Маршрут получения карточек
cardRoutes.get('/', auth, getCards);

// Маршрут создания карточки
cardRoutes.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().length(24),
  }),
}), auth, createCard);

// Маршрут удаления карточки
cardRoutes.delete('/:cardId', celebrate({
  params: {
    cardId: Joi.string().required().length(24).hex(), // строка\обязательна.длиной 24 символа\
  },
}), auth, deleteCard);

// Маршрут Like карточки
cardRoutes.put('/:cardId/likes', celebrate({
  params: {
    cardId: Joi.string().required().length(24).hex(),
  },
}), auth,  likeCard);

// Маршрут Dislike карточки
cardRoutes.delete('/:cardId/likes', celebrate({
  params: {
    cardId: Joi.string().required().length(24).hex(),
  },
}), auth, dislikeCard);

// Экспортируем модуль
module.exports = cardRoutes;
