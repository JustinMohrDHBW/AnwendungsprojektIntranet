import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import type { User } from '../api/auth';

interface EmployeeEditFormProps {
  employee: User;
  onSave: (updatedEmployee: Partial<User>) => Promise<void>;
  onCancel: () => void;
}

const EmployeeEditForm: React.FC<EmployeeEditFormProps> = ({
  employee,
  onSave,
  onCancel,
}) => {
  const { hasPermission } = useAuth();
  const [formData, setFormData] = useState({
    name: employee.employeeData?.name || '',
    abteilung: employee.employeeData?.abteilung || '',
    personalnummer: employee.employeeData?.personalnummer || '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  if (!hasPermission(employee.id)) {
    return (
      <div className="text-red-600 p-4 bg-red-100 rounded">
        You don't have permission to edit this employee's data.
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await onSave({
        employeeData: formData,
      });
    } catch (err) {
      setError('Failed to save changes. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="text-red-600 p-4 bg-red-100 rounded">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Name
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          disabled={isLoading}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Abteilung
        </label>
        <input
          type="text"
          value={formData.abteilung}
          onChange={(e) => setFormData({ ...formData, abteilung: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          disabled={isLoading}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Personalnummer
        </label>
        <input
          type="text"
          value={formData.personalnummer}
          onChange={(e) => setFormData({ ...formData, personalnummer: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          disabled={isLoading}
        />
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          disabled={isLoading}
        >
          Cancel
        </button>
        <button
          type="submit"
          className={`px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md ${
            isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
          }`}
          disabled={isLoading}
        >
          {isLoading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </form>
  );
};

export default EmployeeEditForm; 