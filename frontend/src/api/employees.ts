import axios from 'axios';
import type { User } from './auth';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  withCredentials: true,
});

export const getEmployees = async (): Promise<User[]> => {
  const response = await api.get('/employees');
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
  abteilung?: string;
  personalnummer?: string;
}): Promise<User[]> => {
  const response = await api.get('/employees/search', { params: query });
  return response.data;
}; 