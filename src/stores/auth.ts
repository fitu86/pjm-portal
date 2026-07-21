import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useApi } from '@/composables/useApi';
import { setAccessToken } from '@/lib/directus/client';

export const useAuthStore = defineStore('auth', () => {
  const api = useApi();
  const token = ref<string | null>(localStorage.getItem('auth_token'));
  const user = ref<any>(null);

  const isAuthenticated = computed(() => !!token.value);

  function syncToken(t: string | null) {
    token.value = t;
    setAccessToken(t);
  }

  const login = async (email: string, password: string) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const accessToken = response.data.data.access_token;
      localStorage.setItem('auth_token', accessToken);
      syncToken(accessToken);
      await fetchUser();
    } catch {
      throw new Error('Credenciales inválidas');
    }
  };

  const logout = () => {
    syncToken(null);
    user.value = null;
    localStorage.removeItem('auth_token');
  };

  if (token.value) {
    setAccessToken(token.value);
  }

  const fetchUser = async () => {
    if (!token.value) return;

    try {
      const response = await api.get('/users/me');
      user.value = response.data;
    } catch {
      logout();
    }
  };

  return {
    token,
    user,
    isAuthenticated,
    login,
    logout,
    fetchUser,
  };
});
