import axios from 'axios';

export interface User {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'user';
  employeeData?: {
    personalnummer: string;
    name: string;
    abteilung: string;
  };
}

export const generateDefaultCredentials = (firstName: string, lastName: string) => {
  const username = `${firstName.toLowerCase()}-${lastName.toLowerCase()}`;
  const password = username;
  return { username, password };
};

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001',
  withCredentials: true,
});

export const login = async (username: string, password: string): Promise<User> => {
  const response = await api.post('/auth/login', { username, password });
  return response.data;
};

export const logout = async (): Promise<void> => {
  await api.post('/auth/logout');
};

export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const response = await api.get('/auth/me');
    return response.data;
  } catch (error) {
    return null;
  }
};

export const createUser = async (firstName: string, lastName: string, role: 'admin' | 'user' = 'user'): Promise<User> => {
  const { username, password } = generateDefaultCredentials(firstName, lastName);
  const response = await api.post('/auth/register', {
    username,
    password,
    firstName,
    lastName,
    role,
  });
  return response.data;
}; 