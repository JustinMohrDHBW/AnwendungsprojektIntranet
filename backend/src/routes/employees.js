const express = require('express');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();

// Get all employees
router.get('/', async (req, res) => {
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
      }
    });

    // Transform the data to match the Employee interface
    const employees = users.map(user => ({
      id: user.id,
      personalnummer: user.personalnummer || `EMP${String(user.id).padStart(3, '0')}`,
      name: `${user.firstName} ${user.lastName}`,
      position: user.role === 'ADMIN' ? 'Administrator' : 'Employee',
      department: user.abteilung || 'Unassigned',
      email: `${user.username}@company.com`,
      phone: '+49 123 456789' // You might want to add a phone field to your user model
    }));

    res.json(employees);
  } catch (err) {
    console.error('Error fetching employees:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Search employees
router.get('/search', async (req, res) => {
  const { name, department, personalnummer } = req.query;

  try {
    const users = await prisma.user.findMany({
      where: {
        OR: [
          { firstName: { contains: name, mode: 'insensitive' } },
          { lastName: { contains: name, mode: 'insensitive' } },
        ],
        abteilung: department ? { equals: department, mode: 'insensitive' } : undefined,
        personalnummer: personalnummer ? { equals: personalnummer } : undefined,
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

    const employees = users.map(user => ({
      id: user.id,
      personalnummer: user.personalnummer || `EMP${String(user.id).padStart(3, '0')}`,
      name: `${user.firstName} ${user.lastName}`,
      position: user.role === 'ADMIN' ? 'Administrator' : 'Employee',
      department: user.abteilung || 'Unassigned',
      email: `${user.username}@company.com`,
      phone: '+49 123 456789'
    }));

    res.json(employees);
  } catch (err) {
    console.error('Error searching employees:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router; 