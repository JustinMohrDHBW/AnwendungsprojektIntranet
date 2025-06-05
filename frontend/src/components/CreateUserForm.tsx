import React, { useState } from 'react';
import axios from 'axios';

interface CreateUserFormProps {
  onUserCreated: () => void;
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  username?: string;
  password?: string;
  personalnummer?: string;
  abteilung?: string;
  phone?: string;
}

interface UserFormData {
  firstName: string;
  lastName: string;
  username: string;
  password: string;
  role: 'USER' | 'ADMIN';
  personalnummer: string;
  abteilung: string;
  phone?: string;
}

const CreateUserForm: React.FC<CreateUserFormProps> = ({ onUserCreated }) => {
  const [formData, setFormData] = useState<UserFormData>({
    firstName: '',
    lastName: '',
    username: '',
    password: '',
    role: 'USER',
    personalnummer: '',
    abteilung: '',
    phone: ''
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const generatePersonalNummer = async (): Promise<string> => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/users/next-personnel-number`, {
        withCredentials: true
      });
      return response.data.nextPersonnelNumber;
    } catch (err) {
      console.error('Error generating personnel number:', err);
      throw new Error('Failed to generate personnel number');
    }
  };

  const validateForm = async (): Promise<boolean> => {
    const errors: FormErrors = {};
    let isValid = true;

    // First Name validation
    if (!formData.firstName.trim()) {
      errors.firstName = 'First name is required';
      isValid = false;
    } else if (formData.firstName.length < 2) {
      errors.firstName = 'First name must be at least 2 characters';
      isValid = false;
    }

    // Last Name validation
    if (!formData.lastName.trim()) {
      errors.lastName = 'Last name is required';
      isValid = false;
    } else if (formData.lastName.length < 2) {
      errors.lastName = 'Last name must be at least 2 characters';
      isValid = false;
    }

    // Username validation
    if (!formData.username.trim()) {
      errors.username = 'Username is required';
      isValid = false;
    } else if (formData.username.length < 3) {
      errors.username = 'Username must be at least 3 characters';
      isValid = false;
    }

    // Password validation
    if (!formData.password) {
      errors.password = 'Password is required';
      isValid = false;
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
      isValid = false;
    }

    // Personnel Number validation
    if (formData.personalnummer && !/^E\d{3}$/.test(formData.personalnummer)) {
      errors.personalnummer = 'Personnel number must be in format E followed by 3 digits (e.g., E001)';
      isValid = false;
    }

    // Department validation
    if (!formData.abteilung) {
      errors.abteilung = 'Department is required';
      isValid = false;
    }

    // Phone validation
    if (formData.phone && !/^\+49\s[1-9]\d{2}\s\d{7}$/.test(formData.phone)) {
      errors.phone = 'Phone must be in format +49 XXX XXXXXXX';
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for the field being edited
    setFormErrors(prev => ({
      ...prev,
      [name]: undefined
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!await validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // If no personnel number is provided, generate one
      const dataToSubmit: Partial<UserFormData> = { ...formData };
      if (!dataToSubmit.personalnummer) {
        try {
          dataToSubmit.personalnummer = await generatePersonalNummer();
        } catch (err) {
          setError('Failed to generate personnel number. Please try again or enter manually.');
          setIsLoading(false);
          return;
        }
      }

      // Remove empty phone number before submission
      if (!dataToSubmit.phone?.trim()) {
        delete dataToSubmit.phone;
      }

      await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/users`, dataToSubmit, {
        withCredentials: true
      });
      
      setFormData({
        firstName: '',
        lastName: '',
        username: '',
        password: '',
        role: 'USER',
        personalnummer: '',
        abteilung: '',
        phone: ''
      });
      
      onUserCreated();
    } catch (err) {
      setError('Failed to create user. Please try again.');
      console.error('Error creating user:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const departments = [
    'Management',
    'Development',
    'Product',
    'UX Design',
    'Marketing',
    'Sales',
    'HR',
    'Finance'
  ];

  const getInputClassName = (fieldName: string) => {
    const baseClasses = "w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500";
    return `${baseClasses} ${
      formErrors[fieldName as keyof FormErrors]
        ? 'border-red-500 bg-red-50'
        : 'border-gray-300'
    }`;
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold mb-4">Create New User</h3>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            First Name
          </label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            className={getInputClassName('firstName')}
          />
          {formErrors.firstName && (
            <p className="mt-1 text-sm text-red-600">{formErrors.firstName}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Last Name
          </label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            className={getInputClassName('lastName')}
          />
          {formErrors.lastName && (
            <p className="mt-1 text-sm text-red-600">{formErrors.lastName}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Username
          </label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className={getInputClassName('username')}
          />
          {formErrors.username && (
            <p className="mt-1 text-sm text-red-600">{formErrors.username}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className={getInputClassName('password')}
          />
          {formErrors.password && (
            <p className="mt-1 text-sm text-red-600">{formErrors.password}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Role
          </label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="USER">User</option>
            <option value="ADMIN">Admin</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Personnel Number
          </label>
          <input
            type="text"
            name="personalnummer"
            value={formData.personalnummer}
            onChange={handleChange}
            placeholder="e.g., E010"
            className={getInputClassName('personalnummer')}
          />
          {formErrors.personalnummer && (
            <p className="mt-1 text-sm text-red-600">{formErrors.personalnummer}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Department
          </label>
          <select
            name="abteilung"
            value={formData.abteilung}
            onChange={handleChange}
            className={getInputClassName('abteilung')}
          >
            <option value="">Select Department</option>
            {departments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
          {formErrors.abteilung && (
            <p className="mt-1 text-sm text-red-600">{formErrors.abteilung}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="+49 176 1234567"
            className={getInputClassName('phone')}
          />
          {formErrors.phone && (
            <p className="mt-1 text-sm text-red-600">{formErrors.phone}</p>
          )}
        </div>
      </div>

      <div className="mt-6">
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
            isLoading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isLoading ? 'Creating...' : 'Create User'}
        </button>
      </div>
    </form>
  );
};

export default CreateUserForm; 