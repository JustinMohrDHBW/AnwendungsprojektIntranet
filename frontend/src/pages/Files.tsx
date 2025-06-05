import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import * as fileApi from '../api/files';
import type { File } from '../api/files';

const Files: React.FC = () => {
  const { currentUser } = useAuth();
  const [files, setFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [searchCategory, setSearchCategory] = useState('');
  const [fileMetadata, setFileMetadata] = useState({
    description: '',
    category: '',
    tags: ''
  });

  useEffect(() => {
    loadFiles();
  }, []);

  const loadFiles = async () => {
    try {
      const fetchedFiles = await fileApi.getFiles();
      setFiles(fetchedFiles);
    } catch (err) {
      setError('Failed to load files');
      console.error('Error loading files:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchCategory.trim()) {
      loadFiles();
      return;
    }

    try {
      setIsLoading(true);
      const searchResults = await fileApi.searchFiles(searchCategory);
      setFiles(searchResults);
    } catch (err) {
      setError('Failed to search files');
      console.error('Error searching files:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !fileInputRef.current?.files?.[0]) return;

    try {
      const file = fileInputRef.current.files[0];
      const tags = fileMetadata.tags.split(',').map(tag => tag.trim()).filter(Boolean);
      
      const uploadedFile = await fileApi.uploadFile(file, {
        description: fileMetadata.description || undefined,
        category: fileMetadata.category || undefined,
        tags,
        uploaderId: currentUser.id
      });

      setFiles(prev => [uploadedFile, ...prev]);
      setFileMetadata({ description: '', category: '', tags: '' });
      setShowUploadForm(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err) {
      setError('Failed to upload file');
      console.error('Error uploading file:', err);
    }
  };

  const handleDownload = async (file: File) => {
    try {
      const blob = await fileApi.downloadFile(file.id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.name;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      setError('Failed to download file');
      console.error('Error downloading file:', err);
    }
  };

  const handleDelete = async (fileId: string) => {
    if (!currentUser) return;

    try {
      await fileApi.deleteFile(fileId, currentUser.id);
      setFiles(prev => prev.filter(file => file.id !== fileId));
    } catch (err) {
      setError('Failed to delete file');
      console.error('Error deleting file:', err);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">File Manager</h1>
        {currentUser && (
          <button
            onClick={() => setShowUploadForm(!showUploadForm)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
          >
            {showUploadForm ? 'Cancel' : 'Upload File'}
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Search Bar */}
      <div className="mb-6">
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Search by category..."
            value={searchCategory}
            onChange={(e) => setSearchCategory(e.target.value)}
            className="flex-1 shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleSearch();
              }
            }}
          />
          <button
            onClick={handleSearch}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
          >
            Search
          </button>
          {searchCategory && (
            <button
              onClick={() => {
                setSearchCategory('');
                loadFiles();
              }}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {showUploadForm && (
        <form onSubmit={handleFileUpload} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-8">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="file">
              Choose File
            </label>
            <input
              ref={fileInputRef}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="file"
              type="file"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
              Description
            </label>
            <textarea
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="description"
              value={fileMetadata.description}
              onChange={e => setFileMetadata(prev => ({ ...prev, description: e.target.value }))}
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
              value={fileMetadata.category}
              onChange={e => setFileMetadata(prev => ({ ...prev, category: e.target.value }))}
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
              value={fileMetadata.tags}
              onChange={e => setFileMetadata(prev => ({ ...prev, tags: e.target.value }))}
              placeholder="e.g., document, report, presentation"
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
            >
              Upload
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {files.map(file => (
          <div
            key={file.id}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-semibold mb-2">{file.name}</h2>
                {file.description && (
                  <p className="text-gray-600 mb-2">{file.description}</p>
                )}
                <p className="text-sm text-gray-500">Size: {formatFileSize(file.size)}</p>
              </div>
              {file.category && (
                <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded">
                  {file.category}
                </span>
              )}
            </div>

            {file.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {file.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-gray-100 text-gray-600 text-sm px-2 py-1 rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <div className="flex items-center justify-between text-sm text-gray-500">
              <div className="flex items-center space-x-4">
                <span>By {file.uploader.firstName} {file.uploader.lastName}</span>
                <span>{new Date(file.createdAt).toLocaleDateString()}</span>
              </div>
            </div>

            <div className="flex justify-end space-x-2 mt-4">
              <button
                onClick={() => handleDownload(file)}
                className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition-colors"
              >
                Download
              </button>
              {currentUser && (currentUser.id === file.uploaderId || currentUser.role === 'ADMIN') && (
                <button
                  onClick={() => handleDelete(file.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors"
                >
                  Delete
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Files; 