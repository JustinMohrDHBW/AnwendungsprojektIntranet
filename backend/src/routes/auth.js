const express = require('express');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();

// Login endpoint
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  
  console.log('Login attempt:', { username }); // Debug log
  
  try {
    const user = await prisma.user.findFirst({
      where: {
        username: username,
        password: password
      },
      select: {
        id: true,
        username: true,
        firstName: true,
        lastName: true,
        role: true,
        personalnummer: true,
        abteilung: true,
      }
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Store user info in session
    req.session.user = user;
    await req.session.save();
    
    res.json(user);
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Logout endpoint
router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Logout error:', err);
      return res.status(500).json({ error: 'Error during logout' });
    }
    res.clearCookie('connect.sid');
    res.json({ message: 'Logged out successfully' });
  });
});

// Get current user endpoint
router.get('/me', async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.session.user.id },
      select: {
        id: true,
        username: true,
        firstName: true,
        lastName: true,
        role: true,
        personalnummer: true,
        abteilung: true,
      }
    });

    if (!user) {
      req.session.destroy();
      res.clearCookie('connect.sid');
      return res.status(401).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (err) {
    console.error('Error fetching current user:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Register endpoint
router.post('/register', async (req, res) => {
  const { username, password, firstName, lastName, role = 'USER' } = req.body;

  try {
    const user = await prisma.user.create({
      data: {
        username,
        password, // In a real app, you would hash this password
        firstName,
        lastName,
        role,
      },
      select: {
        id: true,
        username: true,
        firstName: true,
        lastName: true,
        role: true,
        personalnummer: true,
        abteilung: true,
      }
    });

    // Log in the user after registration
    req.session.user = user;

    res.status(201).json(user);
  } catch (err) {
    console.error('Registration error:', err);
    if (err.code === 'P2002') {
      res.status(400).json({ error: 'Username already exists' });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});

module.exports = router; 