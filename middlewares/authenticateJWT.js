const jwt = require('jsonwebtoken');

const authenticateJWT = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return res
      .status(401)
      .json({
        status: 'fail',
      });
  }

    jwt.verify(token, process.env.JWT_SECRET, (error, data) => {
      if (error) {
        return res
          .status(401)
          .json({
            status: 'fail',
          });
      }
      req.userId = data.id;
      next();
    });
};

module.exports = authenticateJWT