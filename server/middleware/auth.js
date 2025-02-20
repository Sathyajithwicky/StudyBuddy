const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    console.log('Received token:', token); // Debug log

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded token:', decoded); // Debug log

    if (!decoded.user || !decoded.user.id) {
      console.log('Invalid token structure:', decoded); // Debug log
      return res.status(401).json({ 
        message: 'Invalid token structure',
        decoded 
      });
    }

    req.user = decoded.user;
    console.log('User set in request:', req.user); // Debug log
    next();
  } catch (err) {
    console.error('Token verification error:', err);
    res.status(401).json({ message: 'Token is not valid' });
  }
}; 