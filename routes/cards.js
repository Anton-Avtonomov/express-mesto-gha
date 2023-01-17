const cardRoutes = require('express').Router();
// const auth = require('../middlewares/auth');
const {
  getCards, createCard, deleteCardById, likeCard, dislikeCard,
} = require('../controllers/cards'); // Импорт функций запросов API
const {
  validationCreateCards,
  validationDeleteCard,
  validationLikeCard,
  validationDislikeCard,
} = require('../middlewares/joi');

// Маршрут получения карточек
cardRoutes.get('/', getCards);

// Маршрут создания карточки
cardRoutes.post('/', validationCreateCards, createCard);

// Маршрут удаления карточки
cardRoutes.delete('/:cardId', validationDeleteCard, deleteCardById);

// Маршрут Like карточки
cardRoutes.put('/:cardId/likes', validationLikeCard, likeCard);

// Маршрут Dislike карточки
cardRoutes.delete('/:cardId/likes', validationDislikeCard, dislikeCard);

// Экспортируем модуль
module.exports = cardRoutes;
