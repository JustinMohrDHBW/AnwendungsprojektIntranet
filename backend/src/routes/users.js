const express = require('express');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();

// Middleware to check if user is admin
const isAdmin = (req, res, next) => {
  if (!req.session.user || req.session.user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Access denied' });
  }
  next();
};

// Get all users (admin only)
router.get('/', isAdmin, async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        firstName: true,
        lastName: true,
        role: true,
        personalnummer: true,
        abteilung: true,
        phone: true,
      }
    });
    res.json(users);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new user
router.post('/', isAdmin, async (req, res) => {
  try {
    const {
      username,
      password,
      firstName,
      lastName,
      role,
      personalnummer,
      abteilung,
      phone
    } = req.body;

    // Validate required fields
    if (!username || !password || !firstName || !lastName) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Check if username already exists
    const existingUser = await prisma.user.findUnique({
      where: { username }
    });

    if (existingUser) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    // Create new user
    const newUser = await prisma.user.create({
      data: {
        username,
        password, // In a real application, this should be hashed
        firstName,
        lastName,
        role: role || 'USER',
        personalnummer,
        abteilung,
        phone
      },
      select: {
        id: true,
        username: true,
        firstName: true,
        lastName: true,
        role: true,
        personalnummer: true,
        abteilung: true,
        phone: true,
      }
    });

    res.status(201).json(newUser);
  } catch (err) {
    console.error('Error creating user:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update user (admin only)
router.put('/:id', isAdmin, async (req, res) => {
  const { id } = req.params;
  const { firstName, lastName, username, password, abteilung, phone } = req.body;

  try {
    // Check if username already exists (if username is being changed)
    if (username) {
      const existingUser = await prisma.user.findFirst({
        where: {
          username,
          id: { not: id } // Exclude current user from check
        }
      });

      if (existingUser) {
        return res.status(400).json({ error: 'Username already exists' });
      }
    }

    // Prepare update data
    const updateData = {
      ...(firstName && { firstName }),
      ...(lastName && { lastName }),
      ...(username && { username }),
      ...(password && { password }), // In a real app, this should be hashed
      ...(abteilung && { abteilung }),
      ...(phone !== undefined && { phone }) // Allow empty string to clear phone
    };

    // Update user
    const user = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        username: true,
        firstName: true,
        lastName: true,
        role: true,
        personalnummer: true,
        abteilung: true,
        phone: true,
      },
    });
    res.json(user);
  } catch (err) {
    console.error('Error updating user:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete user (admin only)
router.delete('/:id', isAdmin, async (req, res) => {
  const { id } = req.params;

  try {
    // Prevent deleting admin users
    const user = await prisma.user.findUnique({ where: { id } });
    if (user.role === 'ADMIN') {
      return res.status(400).json({ error: 'Cannot delete admin users' });
    }

    await prisma.user.delete({ where: { id } });
    res.status(204).send();
  } catch (err) {
    console.error('Error deleting user:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get next available personnel number
router.get('/next-personnel-number', isAdmin, async (req, res) => {
  try {
    // Get the highest personnel number
    const lastUser = await prisma.user.findFirst({
      where: {
        personalnummer: {
          startsWith: 'E'
        }
      },
      orderBy: {
        personalnummer: 'desc'
      }
    });

    let nextNumber;
    if (!lastUser || !lastUser.personalnummer) {
      // If no users exist with personnel numbers, start with E001
      nextNumber = 'E001';
    } else {
      // Extract the number part and increment it
      const currentNumber = parseInt(lastUser.personalnummer.substring(1));
      nextNumber = `E${String(currentNumber + 1).padStart(3, '0')}`;
    }

    res.json({ nextPersonnelNumber: nextNumber });
  } catch (err) {
    console.error('Error generating next personnel number:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router; 