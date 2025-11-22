// backend/src/middlewares/authMiddleware.js

const jwt = require('jsonwebtoken');

// JWT secret from .env
const JWT_SECRET = process.env.JWT_SECRET;

exports.authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // No Authorization header or wrong format
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      message: 'Authentication required: No token provided.'
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    // Decode and verify token
    const payload = jwt.verify(token, JWT_SECRET);

    // Attach decoded values to request
    req.user = {
      userId: payload.userId,
      orgId: payload.orgId
    };

    next(); // Proceed to the route

  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        message: 'Token expired. Please log in again.'
      });
    }

    console.error("JWT Verification Error:", error.message);

    return res.status(401).json({
      message: 'Invalid or malformed token.'
    });
  }
};
