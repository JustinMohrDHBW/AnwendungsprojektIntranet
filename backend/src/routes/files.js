const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const { PrismaClient } = require('@prisma/client');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads');
    try {
      await fs.mkdir(uploadDir, { recursive: true });
      cb(null, uploadDir);
    } catch (error) {
      cb(error);
    }
  },
  filename: (req, file, cb) => {
    // Create a unique filename with original name and timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  }
});

// Upload a file
router.post('/upload', authenticateToken, upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  try {
    const metadata = JSON.parse(req.body.metadata || '{}');
    const fileInfo = {
      name: req.file.originalname,
      path: req.file.path,
      mimeType: req.file.mimetype,
      size: req.file.size,
      description: metadata.description,
      tags: metadata.tags || [],
      category: metadata.category,
      uploaderId: req.user.id
    };

    const file = await prisma.file.create({
      data: fileInfo,
      include: {
        uploader: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
          }
        }
      }
    });

    res.status(201).json(file);
  } catch (err) {
    console.error('Error uploading file:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all files
router.get('/', authenticateToken, async (req, res) => {
  try {
    const files = await prisma.file.findMany({
      include: {
        uploader: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    res.json(files);
  } catch (err) {
    console.error('Error fetching files:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Download a file
router.get('/:id/download', authenticateToken, async (req, res) => {
  try {
    const file = await prisma.file.findUnique({
      where: { id: req.params.id }
    });

    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }

    res.download(file.path, file.name);
  } catch (err) {
    console.error('Error downloading file:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete a file
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    // First get the file to check ownership
    const file = await prisma.file.findUnique({
      where: { id: req.params.id },
      include: { uploader: true }
    });

    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }

    // Check if user is authorized to delete the file
    if (file.uploaderId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Not authorized to delete this file' });
    }

    // Delete the physical file
    try {
      await fs.unlink(file.path);
    } catch (unlinkError) {
      console.error('Error deleting physical file:', unlinkError);
      // Continue with database deletion even if physical file deletion fails
    }

    // Delete the database record
    await prisma.file.delete({
      where: { id: req.params.id }
    });

    res.status(204).send();
  } catch (err) {
    console.error('Error deleting file:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router; 