/* eslint-disable consistent-return */
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const { authorization } = req.headers; // достаём авторизационный заголовок
  if (!authorization || !authorization.startsWith('Bearer ')) { // убеждаемся, что он есть или начинается с Bearer
    return res
      .status(401)
      .send({ message: 'Необходима авторизация' });
  }
  const token = authorization.replace('Bearer ', ''); // извлечём токен без 'приставки' Bearer
  // верификация
  let payload;
  try { // попытка верифицировать токен
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    return res.status(401).send({ message: 'Необходима авторизация' });
  }
  req.user = payload;
  next();
};
