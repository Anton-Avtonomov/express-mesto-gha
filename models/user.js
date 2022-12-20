// Подключаем базу данных MongoDB
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Создаю схему для пользователя(валидация)
const userSchema = new Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    required: true,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
  },
});

// Экспортируем модель юзера
module.exports = mongoose.model('user', userSchema);
