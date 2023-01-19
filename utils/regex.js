const { BadRequestError } = require('../errors/BadRequestError');

function validateUrl(url) {
  const regex = /^https?:\/\/(www\.)?[a-zA-Z\d]+\.[\w\-._~:/?#[\]@!$&'()*+,;=]{2,}#?$/g;
  if (regex.test(url)) {
    return url;
  }
  throw new Error('Невалидная ссылка!');
}

const validateId = (id) => {
  const regex = /^[0-9a-f]{24}$/;
  if (regex.test(id)) {
    return id;
  }
  throw new BadRequestError('Передан некорретный id!');
};

module.exports = { validateUrl, validateId };
