import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import type { User } from '../api/auth';
import * as authApi from '../api/auth';
import CreateUserForm from '../components/CreateUserForm';
import EditUserForm from '../components/EditUserForm';

const AdminPanel: React.FC = () => {
  const { currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const loadUsers = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/users`, {
        credentials: 'include'
      });
      const data = await response.json();
      
      // Sort users by role (ADMIN first) and then by lastName
      const sortedUsers = [...data].sort((a, b) => {
        // First sort by role
        if (a.role === 'ADMIN' && b.role !== 'ADMIN') return -1;
        if (a.role !== 'ADMIN' && b.role === 'ADMIN') return 1;
        
        // Then sort by lastName
        return a.lastName.localeCompare(b.lastName);
      });
      
      setUsers(sortedUsers);
    } catch (err) {
      setError('Failed to load users');
      console.error('Error loading users:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm('Sind Sie sicher, dass Sie diesen Benutzer löschen möchten?')) {
      return;
    }

    setDeleteError(null);
    setIsDeleting(userId);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/users/${userId}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to delete user');
      }

      // Remove user from the list
      setUsers(users.filter(user => user.id !== userId));
    } catch (err) {
      console.error('Error deleting user:', err);
      setDeleteError('Failed to delete user. Please try again.');
    } finally {
      setIsDeleting(null);
    }
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setShowCreateForm(false);
  };

  const handleUserUpdated = () => {
    loadUsers();
    setEditingUser(null);
  };

  if (!currentUser || currentUser.role !== 'ADMIN') {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-red-600 text-xl">Access Denied</div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin Panel</h1>
        {!editingUser && (
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            {showCreateForm ? 'Hide Form' : 'Add New User'}
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {deleteError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {deleteError}
        </div>
      )}

      {editingUser && (
        <div className="mb-8">
          <EditUserForm
            user={editingUser}
            onUserUpdated={handleUserUpdated}
            onCancel={() => setEditingUser(null)}
          />
        </div>
      )}

      {showCreateForm && !editingUser && (
        <div className="mb-8">
          <CreateUserForm onUserCreated={() => {
            loadUsers();
            setShowCreateForm(false);
          }} />
        </div>
      )}

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="grid grid-cols-1 gap-6 p-6">
          {/* User Management Section */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">User Management</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Personalnummer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Username
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Department
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Phone
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.personalnummer || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{user.username}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {user.firstName} {user.lastName}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          user.role === 'ADMIN' 
                            ? 'bg-purple-100 text-purple-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.abteilung || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.phone || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button 
                          className="text-indigo-600 hover:text-indigo-900 mr-4"
                          onClick={() => handleEditUser(user)}
                        >
                          Edit
                        </button>
                        {user.role !== 'ADMIN' && (
                          <button 
                            className={`text-red-600 hover:text-red-900 ${isDeleting === user.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                            onClick={() => handleDeleteUser(user.id)}
                            disabled={isDeleting === user.id}
                          >
                            {isDeleting === user.id ? 'Deleting...' : 'Delete'}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* System Statistics Section */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">System Statistics</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-blue-800 text-lg font-semibold">Total Users</div>
                <div className="text-3xl font-bold text-blue-900">{users.length}</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-green-800 text-lg font-semibold">Active Users</div>
                <div className="text-3xl font-bold text-green-900">
                  {users.filter(user => user.role === 'USER').length}
                </div>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="text-purple-800 text-lg font-semibold">Administrators</div>
                <div className="text-3xl font-bold text-purple-900">
                  {users.filter(user => user.role === 'ADMIN').length}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel; 