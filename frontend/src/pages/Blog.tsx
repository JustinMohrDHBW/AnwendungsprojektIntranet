import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import * as blogApi from '../api/blog';
import type { BlogPost, Comment } from '../api/blog';

const Blog: React.FC = () => {
  const { currentUser } = useAuth();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    category: '',
    tags: ''
  });
  const [newComments, setNewComments] = useState<{ [key: string]: string }>({});
  const [expandedComments, setExpandedComments] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      const fetchedPosts = await blogApi.getBlogPosts();
      setPosts(fetchedPosts);
    } catch (err) {
      setError('Failed to load blog posts');
      console.error('Error loading posts:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    try {
      const tags = newPost.tags.split(',').map(tag => tag.trim()).filter(Boolean);
      const createdPost = await blogApi.createBlogPost({
        title: newPost.title,
        content: newPost.content,
        category: newPost.category || undefined,
        tags,
        authorId: currentUser.id
      });
      setPosts(prev => [createdPost, ...prev]);
      setNewPost({ title: '', content: '', category: '', tags: '' });
      setShowCreateForm(false);
    } catch (err) {
      setError('Failed to create blog post');
      console.error('Error creating post:', err);
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (!currentUser) return;

    try {
      await blogApi.deleteBlogPost(postId, currentUser.id);
      setPosts(prev => prev.filter(post => post.id !== postId));
    } catch (err) {
      setError('Failed to delete blog post');
      console.error('Error deleting post:', err);
    }
  };

  const handleCreateComment = async (postId: string) => {
    if (!currentUser || !newComments[postId]) return;

    try {
      const comment = await blogApi.createComment(postId, {
        content: newComments[postId],
        authorId: currentUser.id
      });
      
      setPosts(prev => prev.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            comments: [comment, ...(post.comments || [])]
          };
        }
        return post;
      }));
      
      // Clear the comment input
      setNewComments(prev => ({ ...prev, [postId]: '' }));
    } catch (err) {
      setError('Failed to create comment');
      console.error('Error creating comment:', err);
    }
  };

  const handleDeleteComment = async (postId: string, commentId: string) => {
    if (!currentUser) return;

    try {
      await blogApi.deleteComment(commentId, currentUser.id);
      setPosts(prev => prev.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            comments: post.comments?.filter(comment => comment.id !== commentId) || []
          };
        }
        return post;
      }));
    } catch (err) {
      setError('Failed to delete comment');
      console.error('Error deleting comment:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Company Blog</h1>
        {currentUser && (
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
          >
            {showCreateForm ? 'Cancel' : 'Create New Post'}
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {showCreateForm && (
        <form onSubmit={handleCreatePost} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-8">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
              Title
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="title"
              type="text"
              value={newPost.title}
              onChange={e => setNewPost(prev => ({ ...prev, title: e.target.value }))}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="content">
              Content
            </label>
            <textarea
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-32"
              id="content"
              value={newPost.content}
              onChange={e => setNewPost(prev => ({ ...prev, content: e.target.value }))}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="category">
              Category
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="category"
              type="text"
              value={newPost.category}
              onChange={e => setNewPost(prev => ({ ...prev, category: e.target.value }))}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="tags">
              Tags (comma-separated)
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="tags"
              type="text"
              value={newPost.tags}
              onChange={e => setNewPost(prev => ({ ...prev, tags: e.target.value }))}
              placeholder="e.g., news, update, announcement"
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
            >
              Create Post
            </button>
          </div>
        </form>
      )}

      <div className="space-y-8">
        {posts.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <div className="text-gray-400 text-6xl mb-4">📝</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No Blog Posts Yet</h3>
            <p className="text-gray-500">Be the first to share news and updates with your colleagues!</p>
          </div>
        ) : (
          posts.map(post => (
            <article
              key={post.id}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-2xl font-semibold mb-2">{post.title}</h2>
                  <p className="text-gray-600 mb-4">{post.content}</p>
                </div>
                {post.category && (
                  <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded">
                    {post.category}
                  </span>
                )}
              </div>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {post.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-gray-100 text-gray-600 text-sm px-2 py-1 rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              
              <div className="flex items-center justify-between text-sm text-gray-500 mb-6">
                <div className="flex items-center space-x-4">
                  <span>By {post.author.firstName} {post.author.lastName}</span>
                  <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                </div>
                
                {currentUser && (currentUser.id === post.authorId || currentUser.role === 'ADMIN') && (
                  <button
                    onClick={() => handleDeletePost(post.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Delete
                  </button>
                )}
              </div>

              {/* Comments Section */}
              <div className="border-t pt-4">
                <div 
                  className="flex items-center justify-between cursor-pointer mb-4"
                  onClick={() => setExpandedComments(prev => ({
                    ...prev,
                    [post.id]: !prev[post.id]
                  }))}
                >
                  <h3 className="text-lg font-semibold">
                    Comments {post.comments?.length ? `(${post.comments.length})` : ''}
                  </h3>
                  <svg
                    className={`w-5 h-5 text-gray-500 transform transition-transform ${
                      expandedComments[post.id] ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
                
                {expandedComments[post.id] && (
                  <>
                    {/* Comment Form */}
                    {currentUser && (
                      <div className="mb-6">
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={newComments[post.id] || ''}
                            onChange={e => setNewComments(prev => ({ ...prev, [post.id]: e.target.value }))}
                            placeholder="Write a comment..."
                            className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <button
                            onClick={() => handleCreateComment(post.id)}
                            disabled={!newComments[post.id]}
                            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Comment
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Comments List */}
                    <div className="space-y-4">
                      {post.comments?.map(comment => (
                        <div key={comment.id} className="bg-gray-50 rounded-lg p-4">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <p className="text-gray-800 mb-2">{comment.content}</p>
                              <div className="text-sm text-gray-500">
                                <span>{comment.author.firstName} {comment.author.lastName}</span>
                                <span className="mx-2">•</span>
                                <span>{new Date(comment.createdAt).toLocaleDateString()}</span>
                              </div>
                            </div>
                            {currentUser && (currentUser.id === comment.authorId || currentUser.role === 'ADMIN') && (
                              <button
                                onClick={() => handleDeleteComment(post.id, comment.id)}
                                className="text-red-500 hover:text-red-700 text-sm ml-4"
                              >
                                Delete
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                      {!post.comments?.length && (
                        <p className="text-gray-500 text-center py-4">No comments yet</p>
                      )}
                    </div>
                  </>
                )}
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
};

export default Blog; 