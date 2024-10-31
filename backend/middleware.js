const jwt = require('jsonwebtoken');
// Secret key for JWT
const JWT_SECRET = process.env.JWT_SECRET;

// Middleware to verify JWT
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.sendStatus(403);
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : authHeader
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};


//Middleware for ADMIN

const authenticateAdmin = (req, res, next) => {
  authenticateToken(req, res, () => {
    if (req.user.role !== "ADMIN") {
      return res.sendStatus(403)
    } else {
      next()
    }
  })
}

module.exports = {authenticateToken, authenticateAdmin}