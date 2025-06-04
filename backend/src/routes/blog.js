const express = require('express');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();

// Get all blog posts
router.get('/posts', async (req, res) => {
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

// Create a blog post
router.post('/posts', async (req, res) => {
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

// Get a single blog post
router.get('/posts/:id', async (req, res) => {
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

// Update a blog post
router.put('/posts/:id', async (req, res) => {
  const { title, content, tags, category } = req.body;
  const authorId = req.body.authorId;

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
    res.json(updatedPost);
  } catch (err) {
    console.error('Error updating blog post:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete a blog post
router.delete('/posts/:id', async (req, res) => {
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

// Create a comment
router.post('/posts/:id/comments', async (req, res) => {
  const { content, authorId } = req.body;
  const postId = req.params.id;

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

// Delete a comment
router.delete('/comments/:id', async (req, res) => {
  const { authorId } = req.body;

  try {
    // First get the user to check if they're an admin
    const user = await prisma.user.findUnique({
      where: { id: authorId },
      select: { role: true }
    });

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    // Get the comment
    const comment = await prisma.comment.findUnique({
      where: { id: req.params.id },
      select: { authorId: true }
    });

    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    // Allow deletion if user is admin or the author of the comment
    if (user.role !== 'ADMIN' && comment.authorId !== authorId) {
      return res.status(403).json({ error: 'Not authorized to delete this comment' });
    }

    await prisma.comment.delete({
      where: { id: req.params.id }
    });
    res.status(204).send();
  } catch (err) {
    console.error('Error deleting comment:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router; 