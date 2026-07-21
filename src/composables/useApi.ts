import axios, { type AxiosInstance } from 'axios';
import { useAuthStore } from '@/stores/auth';

let apiInstance: AxiosInstance | null = null;

export function useApi() {
  if (!apiInstance) {
    apiInstance = axios.create({
      baseURL: import.meta.env.VITE_API_URL || '/api',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor
    apiInstance.interceptors.request.use((config) => {
      const authStore = useAuthStore();
      if (authStore.token) {
        config.headers.Authorization = `Bearer ${authStore.token}`;
      }
      return config;
    });

    // Response interceptor
    apiInstance.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          const authStore = useAuthStore();
          authStore.logout();
        }
        return Promise.reject(error);
      }
    );
  }

  return apiInstance;
}
