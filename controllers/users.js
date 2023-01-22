const Users = require('../models/user');// импортируем модуль схемы юзера
const NotFoundError = require('../errors/NotFoundError'); // 404
const BadRequestError = require('../errors/BadRequestError'); // 400

module.exports.getUsers = (req, res, next) => {
  Users.find({})
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      next(err);
    });
};
// не смог придумать как переиспользовать метод getusers
module.exports.getUserInfo = (req, res, next) => {
  Users.findById(req.user._id)
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      next(err);
    });
};

module.exports.getUserById = (req, res, next) => {
  Users.findById(req.params.userId)
    .orFail(() => {
      throw new NotFoundError('Пользователь с указанными ID в базе не найден!');
    })
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('В запросе переданы некорректные данные ID пользователя!'));
      } else {
        next(err);
      }
    });
};

module.exports.updateProfile = (req, res, next) => {
  const { name, about } = req.body;

  Users.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .orFail(() => {
      throw new NotFoundError('Пользователь не найден!');
    })
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные профиля!'));
      } else { next(err); }
    });
};

module.exports.updateAvatar = (req, res, next) => {
  Users.findByIdAndUpdate(
    req.user._id,
    { avatar: req.body.avatar },
    { new: true, runValidators: true },
  )
    // Что ищем, на что меняем, в ответе отправлять сразу измененный объект поле валидации схемы
    .orFail(() => {
      throw new NotFoundError('Пользователь не найден!');
    })
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректная ссылка на изображения аватара!'));
      } else { next(err); }
    });
};
