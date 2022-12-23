/* eslint-disable no-console */
// Импортируем модули
const express = require('express');
const mongoose = require('mongoose');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const usersRoutes = require('./routes/users');
const cardsRoutes = require('./routes/cards');

// Создаем приложение!
const app = express();

const limitter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the RateLimit-* headers
  legacyHeaders: false, // Disable the X-RateLimit-* headers
});

// Подключаем мидлвар для обработки req.body!
app.use(express.json());
app.use(limitter);
app.use(helmet());

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
// app.get('/', (req, res) => {
//   res.send('Приложение работает!');
// });
// Или app.use
app.all('*', (req, res) => {
  res.status(404).send({ message: `Указанный адрес: 'http://localhost:3000${req.url}' - не найден!` });
});

// Подключаемся к серверу mongo!
mongoose.set('strictQuery', true);
mongoose.connect('mongodb://localhost:27017/mestodb');

// Указываем порт для сервера
const { PORT = 3000 } = process.env;

// Устанавливаем слушатель порта!
app.listen(PORT, () => {
  // Проверка сервера
  console.log(`Сервер запущен на порту: ${PORT}, в ${new Date()}`);
});
