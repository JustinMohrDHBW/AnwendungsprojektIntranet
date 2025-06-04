import axios from 'axios';

export interface User {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  role: 'ADMIN' | 'USER';
  personalnummer?: string;
  abteilung?: string;
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
  headers: {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  }
});

// Add request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    console.log('API Request:', {
      url: config.url,
      method: config.method,
      headers: config.headers,
      data: config.data
    });
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for error logging
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Only log unexpected errors
    if (error.response) {
      if (error.response.status !== 401) {
        console.error('API Error Response:', {
          status: error.response.status,
          data: error.response.data,
          headers: error.response.headers,
        });
      }
    } else if (error.request) {
      console.error('API Request Error:', error.request);
    } else {
      console.error('API Error:', error.message);
    }
    return Promise.reject(error);
  }
);

export const login = async (username: string, password: string): Promise<User> => {
  try {
    console.log('Login attempt:', { username });
    const response = await api.post('/auth/login', { username, password });
    
    if (response.status === 401) {
      throw new Error('Invalid credentials');
    }
    
    console.log('Login successful:', response.data);
    return response.data;
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
};

export const logout = async (): Promise<void> => {
  await api.post('/auth/logout');
};

export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const response = await api.get('/auth/me');
    return response.data;
  } catch (error: any) {
    // Don't log errors for expected unauthorized states
    if (error?.response?.status !== 401) {
      console.error('Failed to get current user:', error);
    }
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