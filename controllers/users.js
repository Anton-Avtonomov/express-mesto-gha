const Users = require('../models/user');

exports.getUsers = (req, res) => {
  Users.find({})
    .then((user) => res.send(user))
    .catch(() => res.status(500).send({ message: 'Запрашиваемый пользователь не найден' }));
};

exports.getUserById = (req, res) => {
  Users.findById(req.params.userId)
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({message: 'Переданы некорректные данные юзера!'})
      }
      if (err.message === 'NotFound') {
        return res.status(404).send({message: 'Пользователь с указанными данными не найден!'})
      }
      return res.status(500).send({message: 'Произошла ошибка!'})
    })
};

exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  Users.create({ name, about, avatar })
  // user - ответ сервера
    .then((user) => {
      res.status(200).send(user)
    })
    .catch((err) => {
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
    .then((user) => {
     res.status(200).send(user);
  })
  .catch((err) => {
    if (err.name === 'ValidationError') {
      return res.status(400).send({message: 'Переданы некорректные данные профиля!'})
    }
    if (err.message === 'NotFound') {
      return res.status(404).send({message: 'Пользователь по указанному ID не найден!'})
    }
    return res.status(500).send({message: 'Произошла ошибка!'})
  });
};

exports.updateAvatar = (req, res) => {
  const owner = req.user._id;
  const avatar = req.body.avatar;

  Users.findByIdAndUpdate(owner, {avatar}, {new: true})
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({message: 'Переданы некорректные данные аватара!'})
      }
      if (err.message === 'NotFound') {
        return res.status(404).send({message: 'Пользователь с указанным ID не найден!'})
      }
      return res.status(500).send({message: 'Произошла ошибка!'})
    });
};