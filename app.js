// Импортируем модули
const express = require('express');
const mongoose = require('mongoose');
const usersRoutes = require('./routes/users');
const cardsRoutes = require('./routes/cards');

// Создаем приложение!
const app = express();

// Подключаем мидлвар для обработки req.body!
app.use(express.json());

// Добавляем в каждый запрос(req) поле user с полем _id
app.use((req, res, next) => {
  req.user = {
    _id: '63a16a8c35787a894250e061',
  };

  next();
});

// Марштуризация
app.use('/users', usersRoutes);
app.use('/cards', cardsRoutes);

// Проверка сервера
app.get('/', (req, res) => {
  res.send('Приложение работает!');
});


// Подключаемся к серверу mongo!
mongoose.set('strictQuery', true);
mongoose.connect('mongodb://localhost:27017/mestodb');

// Указываем порт для сервера
const { PORT = 3000 } = process.env;


//Устанавливаем слушатель порта!
app.listen(PORT, () => {
  // Проверка сервера
  console.log(`Сервер запущен на порту: ${PORT}, в ${new Date}`);
});
