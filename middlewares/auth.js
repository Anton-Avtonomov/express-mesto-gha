const jwt = require('jsonwebtoken');
const AuthorizationError = require('../errors/AuthorizationError');

module.exports = (req, res, next) => {
  // const { authorization } = req.headers; // достаём авторизационный заголовок
  const authorization = req.cookies.jwt;
  if (!authorization) { // убеждаемся, что нет авторизации и token начинается с Bearer
    throw new AuthorizationError('Необходима авторизация!');
  }
  // Если пользователь авторизован
  // const token = authorization.replace('Bearer ', ''); // извлечём токен без 'приставки' Bearer
  // верификация
  let payload;
  try { // верификация токена
    payload = jwt.verify(authorization.replace('Bearer ', ''), 'some-secret-key');
  } catch (err) {
    next(err);
  }
  req.user = payload;
  return next();
};
