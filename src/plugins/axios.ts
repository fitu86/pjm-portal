import axios from 'axios';
import { useErrorHandler } from '@/composables/useErrorHandler';

const instance = axios.create({
  baseURL: '/api', // Assuming your API is under /api endpoint
  timeout: 1000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Optional: Add a request interceptor
instance.interceptors.request.use(
  (config) => {
    // You can modify the config here, e.g., add auth token
    // const token = localStorage.getItem('authToken');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Optional: Add a response interceptor
instance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const { handleError } = useErrorHandler(); // Instantiate the handler
    handleError(error); // Use the handler for global error management
    return Promise.reject(error);
  }
);

export default instance;
