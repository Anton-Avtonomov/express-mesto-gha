const jwt = require('jsonwebtoken');
const AuthorizationError = require('../errors/AuthorizationError');

module.exports = (req, res, next) => {
  const { authorization } = req.headers; // достаём авторизационный заголовок
  if (!authorization || !authorization.startsWith('Bearer ')) { // убеждаемся, что нет авуторизации и token начинается с Bearer
    throw new AuthorizationError('Необходима авторизация!');
  } else {
    // Если пользователь авторизован
    const token = authorization.replace('Bearer ', ''); // извлечём токен без 'приставки' Bearer
    // верификация
    let payload;
    try { // верификация токена
      payload = jwt.verify(token, 'some-secret-key');
    } catch (err) {
      next(err);
    }
    req.user = payload;
    return next();
  }
};
