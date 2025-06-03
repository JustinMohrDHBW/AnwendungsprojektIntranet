const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');

const app = express();
const port = 3001;
const prisma = new PrismaClient();

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.use(express.json());

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

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
}); 