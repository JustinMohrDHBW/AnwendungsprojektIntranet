const express = require('express');
const cors = require('cors');
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);
const { Pool } = require('pg');
const { PrismaClient } = require('@prisma/client');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;

const app = express();
const port = 3001;
const prisma = new PrismaClient();

// Create PostgreSQL pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || "postgresql://admin:password123@postgres:5432/intranet_db?schema=public"
});

// Import routes
const authRoutes = require('./routes/auth');
const blogRoutes = require('./routes/blog');
const fileRoutes = require('./routes/files');
const usersRoutes = require('./routes/users');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads');
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
  },
  fileFilter: (req, file, cb) => {
    // Add any file type restrictions here
    cb(null, true);
  }
});

const corsOptions = {
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  optionsSuccessStatus: 204,
  preflightContinue: false
};

// CORS Configuration - must be before other middleware
app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Enable pre-flight for all routes

// Session configuration
app.use(session({
  store: new pgSession({
    pool,
    tableName: 'session'
  }),
  secret: 'your-secret-key', // In production, use a proper secret from environment variables
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    sameSite: 'lax'
  }
}));

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/auth', authRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/files', fileRoutes);
app.use('/users', usersRoutes);

// Test endpoint
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Intranet API' });
});

// Get all users
app.get('/api/users', async (req, res) => {
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
    res.json(users);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Authentication Routes
app.post('/auth/login', async (req, res) => {
  const { username, password } = req.body;
  
  console.log('Login attempt:', { username, password }); // Debug log
  
  try {
    // First, find the user by username only to debug
    const userCheck = await prisma.user.findFirst({
      where: {
        username: username
      }
    });
    
    console.log('Found user:', userCheck); // Debug log

    // Now try the actual login
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

    console.log('Login result:', user); // Debug log

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    res.json(user);
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/auth/logout', (req, res) => {
  res.json({ message: 'Logged out successfully' });
});

app.get('/auth/me', async (req, res) => {
  // In a real application, you would verify the session/token here
  // For now, we'll just return a mock response
  try {
    const user = await prisma.user.findFirst({
      where: {
        username: 'john-doe'
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
    res.json(user);
  } catch (err) {
    console.error('Error fetching current user:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Example endpoint to fetch data from PostgreSQL
app.get('/api/items', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM items');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Blog Routes
app.get('/api/blog/posts', async (req, res) => {
  try {
    const posts = await prisma.blogPost.findMany({
      include: {
        author: {
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
    res.json(posts);
  } catch (err) {
    console.error('Error fetching blog posts:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/blog/posts', async (req, res) => {
  const { title, content, tags = [], category } = req.body;
  const authorId = req.body.authorId; // In a real app, this would come from the session

  try {
    const post = await prisma.blogPost.create({
      data: {
        title,
        content,
        tags,
        category,
        author: {
          connect: { id: authorId }
        }
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
          }
        }
      }
    });
    res.status(201).json(post);
  } catch (err) {
    console.error('Error creating blog post:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/blog/posts/:id', async (req, res) => {
  try {
    const post = await prisma.blogPost.findUnique({
      where: { id: req.params.id },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
          }
        },
        comments: {
          include: {
            author: {
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
        }
      }
    });
    
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    res.json(post);
  } catch (err) {
    console.error('Error fetching blog post:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/api/blog/posts/:id', async (req, res) => {
  const { title, content, tags, category } = req.body;
  const authorId = req.body.authorId; // In a real app, this would come from the session

  try {
    // Check if user is the author
    const post = await prisma.blogPost.findUnique({
      where: { id: req.params.id },
      select: { authorId: true }
    });

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    if (post.authorId !== authorId) {
      return res.status(403).json({ error: 'Not authorized to edit this post' });
    }

    const updatedPost = await prisma.blogPost.update({
      where: { id: req.params.id },
      data: {
        title,
        content,
        tags,
        category
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
          }
        }
      }
    });
    res.json(updatedPost);
  } catch (err) {
    console.error('Error updating blog post:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/api/blog/posts/:id', async (req, res) => {
  const authorId = req.body.authorId;

  try {
    // First get the user to check if they're an admin
    const user = await prisma.user.findUnique({
      where: { id: authorId },
      select: { role: true }
    });

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    // Get the post
    const post = await prisma.blogPost.findUnique({
      where: { id: req.params.id },
      select: { authorId: true }
    });

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Allow deletion if user is admin or the author of the post
    if (user.role !== 'ADMIN' && post.authorId !== authorId) {
      return res.status(403).json({ error: 'Not authorized to delete this post' });
    }

    await prisma.blogPost.delete({
      where: { id: req.params.id }
    });
    res.status(204).send();
  } catch (err) {
    console.error('Error deleting blog post:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Comment Routes
app.post('/api/blog/posts/:postId/comments', async (req, res) => {
  const { content } = req.body;
  const authorId = req.body.authorId; // In a real app, this would come from the session
  const postId = req.params.postId;

  try {
    const comment = await prisma.comment.create({
      data: {
        content,
        author: {
          connect: { id: authorId }
        },
        post: {
          connect: { id: postId }
        }
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
          }
        }
      }
    });
    res.status(201).json(comment);
  } catch (err) {
    console.error('Error creating comment:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// File Routes
app.post('/api/files/upload', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  try {
    const metadata = JSON.parse(req.body.metadata);
    const { uploaderId, description, tags = [], category } = metadata;

    // Get file information
    const fileInfo = {
      name: req.file.originalname,
      path: req.file.path,
      mimeType: req.file.mimetype,
      size: req.file.size,
      description,
      tags,
      category,
      uploaderId
    };

    // Save file information to database
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

app.get('/api/files', async (req, res) => {
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

app.get('/api/files/:id/download', async (req, res) => {
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

app.delete('/api/files/:id', async (req, res) => {
  const uploaderId = req.body.uploaderId;

  try {
    // First get the user to check if they're an admin
    const user = await prisma.user.findUnique({
      where: { id: uploaderId },
      select: { role: true }
    });

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    // Get the file
    const file = await prisma.file.findUnique({
      where: { id: req.params.id }
    });

    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }

    // Allow deletion if user is admin or the uploader
    if (user.role !== 'ADMIN' && file.uploaderId !== uploaderId) {
      return res.status(403).json({ error: 'Not authorized to delete this file' });
    }

    // Delete the physical file
    await fs.unlink(file.path);

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

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
}); 