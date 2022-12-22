// Подключаем базу данных MongoDB
const mongoose = require('mongoose');

const { Schema } = mongoose;

// Создаю схему для пользователя(валидация)
const userSchema = new Schema({
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
  },
});

// Экспортируем модель юзера
module.exports = mongoose.model('user', userSchema);
