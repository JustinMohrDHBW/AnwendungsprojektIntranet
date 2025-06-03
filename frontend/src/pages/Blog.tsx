import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import * as blogApi from '../api/blog';
import type { BlogPost } from '../api/blog';

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
        {posts.map(post => (
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
            
            <div className="flex items-center justify-between text-sm text-gray-500">
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
          </article>
        ))}
      </div>
    </div>
  );
};

export default Blog; 