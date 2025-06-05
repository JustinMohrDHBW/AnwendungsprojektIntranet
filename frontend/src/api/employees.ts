import axios from 'axios';
import type { User } from './auth';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001',
  withCredentials: true,
});

export interface Employee {
  id: string | number;
  personalnummer: string;
  firstName: string;
  lastName: string;
  name: string;
  position: string;
  department: string;
  email: string;
  phone: string;
}

export const getEmployees = async (): Promise<Employee[]> => {
  const response = await api.get('/api/employees');
  return response.data;
};

export const getEmployee = async (id: string): Promise<User> => {
  const response = await api.get(`/employees/${id}`);
  return response.data;
};

export const updateEmployee = async (id: string, data: Partial<User>): Promise<User> => {
  const response = await api.patch(`/employees/${id}`, data);
  return response.data;
};

export const searchEmployees = async (query: {
  name?: string;
  department?: string;
  personalnummer?: string;
}): Promise<Employee[]> => {
  const response = await api.get('/api/employees/search', { params: query });
  return response.data;
}; 