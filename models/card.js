const mongoose = require('mongoose');

const validator = require('validator');

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  link: {
    type: String,
    required: true,
    validate: {
      validator: (value) => validator.isURL(value),
      message: 'Ошибка Валидации, введен некорректный URL!',
    },
  },
  owner: {
    ref: 'user',
    type: mongoose.Types.ObjectId,
    required: true,
  },
  likes: [{
    ref: 'user',
    type: mongoose.Types.ObjectId,
    default: [],
  }],
  createAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('cards', cardSchema); // cards - название коллекции в
