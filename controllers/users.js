const Users = require('../models/user');

exports.getUsers = (req, res) => {
  Users.find({})
    .then((user) => res.send(user))
    .catch(() => {
      // console.log(`Имя ошибки: '${err.name}', текст ошибки: '${err.message}'`);
      res.status(500).send({ message: 'Запрашиваемый пользователь не найден' })
    });
};

exports.getUserById = (req, res) => {
  Users.findById(req.params.userId)
    .then((user) => {
    if (!user) {
      return res.status(404).send({message: 'Пользователь с указанными ID в базе не найден!'})
    }
    return res.status(201).send(user)})
    .catch((err) => {
      // Проверка
      // console.log(`Имя ошибки: '${err.name}', текст ошибки: '${err.message}'`);
      if (err.name === 'CastError') {
        return res.status(400).send({message: 'В запросе переданы некорректные данные ID пользователя!'})
      }
      return res.status(500).send({message: 'Произошла ошибка!'})
    })
};

exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  Users.create({ name, about, avatar })
  // user - ответ сервера
    .then((user) => {
      res.status(201).send(user)
    })
    .catch((err) => {
      // Проверка
      // console.log(`Имя ошибки: '${err.name}', текст ошибки: '${err.message}'`);
      console.log(err.name)
      if (err.name === 'ValidationError') {
        return res.status(400).send({message: 'Переданы некорректные данные Юзера!'})
      }
      if (err.message === 'NotFound') {
        return res.status(404).send({message: 'Пользователь с указанными данными уже существует!'})
      }
      return res.status(500).send({message: 'Произошла ошибка!'})
    });
};

exports.updateProfile = (req, res) => {
  const {name, about} = req.body;

  Users.findByIdAndUpdate(req.user._id, { name, about }, { new: true })
  // Если ответ будет пустым конструкция orFail перекинет в блок catch
  .orFail(new Error('NotValidId'))
  .then((user) => {
     res.status(201).send(user);
  })
  .catch((err) => {
    // Проверка
    // console.log(`Имя ошибки: '${err.name}', текст ошибки: '${err.message}'`);
    if (err.message === 'NotValidId') {
      return res.status(400).send({message: 'Переданы некорректные данные профиля!'})
    }
    return res.status(500).send({message: 'Произошла ошибка!'})
  });
};

exports.updateAvatar = (req, res) => {
  const owner = req.user._id;
  const avatar = req.body.avatar;

  Users.findByIdAndUpdate(owner, {avatar}, {new: true})
    .orFail(new Error('NotValidLinkAvatar'))
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
    // Проверка
    // console.log(`Имя ошибки: '${err.name}', текст ошибки: '${err.message}'`);
      if (err.message === 'NotValidLinkAvatar') {
        return res.status(400).send({message: 'Переданы некорректная ссылка на изображения аватара!'})
      }
      return res.status(500).send({message: 'Произошла ошибка!'})
    });
};