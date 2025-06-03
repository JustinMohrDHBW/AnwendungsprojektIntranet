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
        createdAt: true,
      },
    });
    res.json(users);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update user (admin only)
router.put('/:id', isAdmin, async (req, res) => {
  const { id } = req.params;
  const { firstName, lastName, role, personalnummer, abteilung } = req.body;

  try {
    const user = await prisma.user.update({
      where: { id },
      data: {
        firstName,
        lastName,
        role,
        personalnummer,
        abteilung,
      },
      select: {
        id: true,
        username: true,
        firstName: true,
        lastName: true,
        role: true,
        personalnummer: true,
        abteilung: true,
        createdAt: true,
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

module.exports = router; 