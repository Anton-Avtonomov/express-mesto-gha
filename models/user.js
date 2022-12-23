// Подключаем базу данных MongoDB
const mongoose = require('mongoose');

const validator = require('validator');

// Создаю схему для пользователя(валидация)
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  about: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    required: true,
    validate: {
      validator: (value) => validator.isURL(value),
      message: 'Введен некорректный URL!',
    },
  },
});

// Экспортируем модель юзера
module.exports = mongoose.model('user', userSchema);
