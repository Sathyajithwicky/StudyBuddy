const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = (req, res, next) => {
  console.log('Auth middleware processing request to:', req.originalUrl);
  
  // Get token from header
  const authHeader = req.header('Authorization');
  console.log('Authorization header:', authHeader);
  
  const token = authHeader?.replace('Bearer ', '');

  // Check if no token
  if (!token) {
    console.error('No token provided');
    return res.status(401).json({ 
      success: false,
      message: 'No token, authorization denied' 
    });
  }

  try {
    // Verify token
    console.log('Verifying token...');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Token verified, user:', decoded.user);
    
    // Add user from payload to request
    req.user = decoded.user;

    // Only check for admin role on admin-specific routes
    if (req.baseUrl === '/api/users' && req.method === 'GET' && req.path === '/' && req.user.role !== 'admin') {
      console.error('Non-admin user attempted to access admin route');
      return res.status(403).json({ 
        success: false,
        message: 'Access denied. Admin only.' 
      });
    }

    next();
  } catch (err) {
    console.error('Token verification failed:', err.message);
    res.status(401).json({ 
      success: false,
      message: 'Token is not valid',
      error: err.message
    });
  }
}; 