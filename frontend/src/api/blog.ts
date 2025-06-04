import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001',
  withCredentials: true,
});

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
  authorId: string;
  tags: string[];
  category?: string;
  author: {
    id: string;
    username: string;
    firstName: string;
    lastName: string;
  };
  comments?: Comment[];
}

export interface Comment {
  id: string;
  content: string;
  createdAt: string;
  authorId: string;
  postId: string;
  author: {
    id: string;
    username: string;
    firstName: string;
    lastName: string;
  };
}

export const getBlogPosts = async (): Promise<BlogPost[]> => {
  const response = await api.get('/api/blog/posts');
  return response.data;
};

export const getBlogPost = async (id: string): Promise<BlogPost> => {
  const response = await api.get(`/api/blog/posts/${id}`);
  return response.data;
};

export const createBlogPost = async (data: {
  title: string;
  content: string;
  tags?: string[];
  category?: string;
  authorId: string;
}): Promise<BlogPost> => {
  const response = await api.post('/api/blog/posts', data);
  return response.data;
};

export const updateBlogPost = async (
  id: string,
  data: {
    title?: string;
    content?: string;
    tags?: string[];
    category?: string;
    authorId: string;
  }
): Promise<BlogPost> => {
  const response = await api.put(`/api/blog/posts/${id}`, data);
  return response.data;
};

export const deleteBlogPost = async (id: string, authorId: string): Promise<void> => {
  await api.delete(`/api/blog/posts/${id}`, { data: { authorId } });
};

export const createComment = async (
  postId: string,
  data: {
    content: string;
    authorId: string;
  }
): Promise<Comment> => {
  const response = await api.post(`/api/blog/posts/${postId}/comments`, data);
  return response.data;
};

export const deleteComment = async (commentId: string, authorId: string): Promise<void> => {
  await api.delete(`/api/blog/comments/${commentId}`, { data: { authorId } });
}; 