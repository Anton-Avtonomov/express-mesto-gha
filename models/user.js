// Подключаем базу данных MongoDB
const mongoose = require('mongoose');
// Подключаем Валидатор
const validator = require('validator');

// Создаю схему для пользователя(валидация)
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    validate: {
      validator: (value) => validator.isEmail(value),
      message: 'Введён некорректный email!',
    },
    unique: true,
  },
  password: {
    type: String,
    required: true,
    select: false, // Скрывает поле при запроссах(не отправляет!)
  },
  name: {
    type: String,
    default: 'Жак-Ив Кусто',
    minlength: 2,
    maxlength: 30,
  },
  about: {
    type: String,
    default: 'Исследователь',
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: {
      validator: (value) => validator.isURL(value),
      message: 'Введен некорректный URL!',
    },
  },
});

// Экспортируем модель юзера
module.exports = mongoose.model('user', userSchema);
