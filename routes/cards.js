// Подключение роутов
const cardRoutes = require('express').Router();

// Импорт функций запросов API
const {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');

// Маршрут получения карточек
cardRoutes.get('/', getCards);

// Маршрут создания карточки
cardRoutes.post('/', createCard);

// Маршрут удаления карточки
cardRoutes.delete('/:cardId', deleteCard);

// Маршрут Like карточки
cardRoutes.put('/:cardId/likes', likeCard);

// Маршрут Dislike карточки
cardRoutes.delete('/:cardId/likes', dislikeCard);

// Экспортируем модуль
module.exports = cardRoutes;
