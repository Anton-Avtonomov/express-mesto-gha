const Users = require('../models/user');

exports.getUsers = (req, res) => {
  Users.find({})
    .then((user) => res.send({ data: user }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка!' }));
};

exports.getUserById = (req, res) => {
  Users.findById(req.params.userId)
    .then((user) => res.status(200).send(user))
    .catch(() => {
      res.status(500).send({ message: 'Запрашиваемый пользователь не найден!' })
    })
};

exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  Users.create({ name, about, avatar })
    .then((user) => {
      res.status(200).send(user)
    })
    .catch(() => {
      res.status(500).send('Произошла ошибка!');
    });
};

exports.updateProfile = (req, res) => {
  const {name, about} = req.body;

  Users.findByIdAndUpdate(req.user._id, { name, about }, { new: true })
    .then((user) => {
    res.status(200).send(user);
  })
  .catch(() => {
  res.status(500).send({ message: 'Произошла ошибка!' })
  });
};

exports.updateAvatar = (req, res) => {
  const owner = req.user._id;
  const avatar = req.body.avatar;

  Users.findByIdAndUpdate(owner, {avatar}, {new: true})
    .then((user) => {
      res.status(200).send(user);
    })
    .catch(() => {
      res.status(500).send({ message: 'Произошла ошибка!' });
    });
}
