const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Check for a Bearer token
  
    if (token == null) {
      return res.status(401).json({ error: 'Authentication required' });
    }
  
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json({ error: 'Invalid token' });
      }
  
      // If the token is valid, you can access user information
      req.user = user;
      next();
    });
}

module.exports = authenticateToken;
