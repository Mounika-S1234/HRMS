// backend/src/middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');

// JWT_SECRET is accessed via environment variables loaded by index.js
const JWT_SECRET = process.env.JWT_SECRET;

exports.authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authentication required: No token provided.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    // payload: { userId: user.id, orgId: user.organisation_id }
    const payload = jwt.verify(token, JWT_SECRET); 
    
    // Attach user and organization info to the request object
    req.user = { 
      userId: payload.userId, 
      orgId: payload.orgId 
    };
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired. Please log in again.' });
    }
    console.error("JWT Verification Error:", error.message);
    return res.status(401).json({ message: 'Invalid or malformed token.' });
  }
};