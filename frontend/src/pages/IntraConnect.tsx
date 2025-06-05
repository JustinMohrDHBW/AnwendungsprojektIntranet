import React, { useState, useMemo, useEffect } from 'react';
import * as employeesApi from '../api/employees';
import type { Employee } from '../api/employees';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const IntraConnect: React.FC = () => {
  const { isLoggedIn, login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  // Search states
  const [searchPersonalnummer, setSearchPersonalnummer] = useState('');
  const [searchDepartment, setSearchDepartment] = useState('');
  const [searchName, setSearchName] = useState('');
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsLoggingIn(true);

    try {
      const success = await login(username, password);
      if (!success) {
        setLoginError('Invalid username or password');
      } else {
        navigate('/');
      }
    } catch (err) {
      setLoginError('An error occurred during login');
    } finally {
      setIsLoggingIn(false);
    }
  };

  useEffect(() => {
    loadEmployees();
  }, []);

    const loadEmployees = async () => {
      try {
        const data = await employeesApi.getEmployees();
        setEmployees(data);
      } catch (err) {
        setError('Failed to load employees');
        console.error('Error loading employees:', err);
      } finally {
        setIsLoading(false);
      }
    };

  // Get unique departments for the dropdown
  const departments = useMemo(() => {
    return [...new Set(employees.map(emp => emp.department))];
  }, [employees]);

  // Filter employees based on search criteria
  const filteredEmployees = useMemo(() => {
    return employees.filter(employee => {
      const matchPersonalnummer = employee.personalnummer.toLowerCase()
        .includes(searchPersonalnummer.toLowerCase());
      const matchDepartment = searchDepartment === '' || 
        employee.department === searchDepartment;
      const matchName = employee.name.toLowerCase()
        .includes(searchName.toLowerCase());

      return matchPersonalnummer && matchDepartment && matchName;
    });
  }, [employees, searchPersonalnummer, searchDepartment, searchName]);

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Welcome to IntraConnect
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Please log in to access the employee directory
            </p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleLogin}>
            {loginError && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                {loginError}
              </div>
            )}
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="username" className="sr-only">
                  Username
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={isLoggingIn}
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoggingIn}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                  isLoggingIn ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                disabled={isLoggingIn}
              >
                {isLoggingIn ? 'Signing in...' : 'Sign in'}
              </button>
            </div>
          </form>
        </div>
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
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Employee Directory</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Search Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label htmlFor="personalnummer" className="block text-sm font-medium text-gray-700 mb-2">
              Personalnummer
            </label>
            <input
              type="text"
              id="personalnummer"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchPersonalnummer}
              onChange={(e) => setSearchPersonalnummer(e.target.value)}
              placeholder="z.B. EMP001"
            />
          </div>

          <div>
            <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-2">
              Abteilung
            </label>
            <select
              id="department"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchDepartment}
              onChange={(e) => setSearchDepartment(e.target.value)}
            >
              <option value="">Alle Abteilungen</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Name
            </label>
            <input
              type="text"
              id="name"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              placeholder="Name eingeben"
            />
          </div>
        </div>
      </div>
      
      {/* Results Count */}
      <div className="mb-4 text-gray-600">
        {filteredEmployees.length} Mitarbeiter gefunden
      </div>

      {/* Employee Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEmployees.map(employee => (
          <div 
            key={employee.id}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-xl font-bold text-gray-600">
                {`${employee.firstName[0]}${employee.lastName ? employee.lastName[0] : ''}`}
              </div>
              <div className="ml-4">
                <h2 className="text-xl font-semibold">{employee.name}</h2>
                <p className="text-gray-600">{employee.position}</p>
                <p className="text-sm text-gray-500">#{employee.personalnummer}</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <p className="text-gray-600">
                <span className="font-medium">Abteilung:</span> {employee.department}
              </p>
              <p className="text-gray-600">
                <span className="font-medium">Email:</span>{' '}
                <a href={`mailto:${employee.email}`} className="text-blue-600 hover:underline">
                  {employee.email}
                </a>
              </p>
              <p className="text-gray-600">
                <span className="font-medium">Telefon:</span>{' '}
                {employee.phone === 'Keine Telefonnummer hinterlegt' ? (
                  <span className="text-gray-500 italic">{employee.phone}</span>
                ) : (
                <a href={`tel:${employee.phone}`} className="text-blue-600 hover:underline">
                  {employee.phone}
                </a>
                )}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* No Results Message */}
      {filteredEmployees.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500 text-lg">
            Keine Mitarbeiter gefunden. Bitte ändern Sie Ihre Suchkriterien.
          </p>
        </div>
      )}
    </div>
  );
};

export default IntraConnect; 