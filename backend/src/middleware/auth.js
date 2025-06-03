const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const authenticateToken = async (req, res, next) => {
  try {
    // Check if user is in session
    if (!req.session.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    // Set the user from the session
    req.user = req.session.user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  authenticateToken
}; 