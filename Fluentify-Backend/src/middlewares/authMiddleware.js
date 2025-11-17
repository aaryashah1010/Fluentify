import jwt from 'jsonwebtoken';
import { ERRORS } from '../utils/error.js';

const JWT_SECRET = process.env.JWT_SECRET;

function authMiddleware(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.split(' ')[1];
  
  if (!token) {
    return next(ERRORS.NO_TOKEN_PROVIDED);
  }
  
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        return next(ERRORS.TOKEN_EXPIRED);
      }
      return next(ERRORS.INVALID_AUTH_TOKEN);
    }
    req.user = user;
    console.log(`🔐 Auth: User ${user.id} (${user.email}) authenticated - Role: ${user.role}`);
    next();
  });
}

// Middleware to check for admin role
export const adminOnly = (req, res, next) => {
  // Check if user exists and has admin role
  if (req.user?.role === 'admin') {
    return next();
  }
  return res.status(403).json({ 
    success: false,
    message: 'Forbidden: Admin access required' 
  });
};

export default authMiddleware;
