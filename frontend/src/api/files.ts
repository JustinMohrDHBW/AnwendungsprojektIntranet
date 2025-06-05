import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001',
  withCredentials: true,
});

export interface File {
  id: string;
  name: string;
  path: string;
  mimeType: string;
  size: number;
  createdAt: string;
  updatedAt: string;
  uploaderId: string;
  description?: string;
  tags: string[];
  category?: string;
  uploader: {
    id: string;
    username: string;
    firstName: string;
    lastName: string;
  };
}

export const uploadFile = async (
  file: globalThis.File,
  metadata: {
    description?: string;
    tags?: string[];
    category?: string;
    uploaderId: string;
  }
): Promise<File> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('metadata', JSON.stringify(metadata));

  const response = await api.post('/api/files/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const getFiles = async (): Promise<File[]> => {
  const response = await api.get('/api/files');
  return response.data;
};

export const deleteFile = async (id: string, uploaderId: string): Promise<void> => {
  await api.delete(`/api/files/${id}`, { data: { uploaderId } });
};

export const downloadFile = async (id: string): Promise<Blob> => {
  const response = await api.get(`/api/files/${id}/download`, {
    responseType: 'blob',
  });
  return response.data;
}; 

export const searchFiles = async (category: string): Promise<File[]> => {
  const response = await api.get('/api/files/search', {
    params: { category }
  });
  return response.data;
}; 