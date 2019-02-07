const { verify } = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const authHeader = req.get('Authorization');
  if (!authHeader) {
    req.isAuth = false;
    return next();
  }
  const authToken = authHeader.slpit(' ')[1];
  if (!authToken || authToken === '') {
    req.isAuth = false;
    return next();
  }
  try {
    const decodedToken = verify(authToken, process.env.PRIVATE_KEY);
    if (!decodedToken) {
      req.isAuth = false;
      return next();
    }
    req.isAuth = true;
    req.userId = decodedToken.userId;
    return next();
  } catch (error) {
    req.isAuth = false;
    return next();
  }
};
