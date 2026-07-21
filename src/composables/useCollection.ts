import { ref, computed } from 'vue';
import { useApi } from './useApi';

export interface QueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sort?: string;
  filter?: Record<string, any>;
}

export function useCollection<T = any>(endpoint: string) {
  const api = useApi();

  const items = ref<T[]>([]);
  const total = ref(0);
  const loading = ref(false);
  const error = ref<Error | null>(null);

  const fetch = async (params: QueryParams = {}) => {
    loading.value = true;
    error.value = null;

    try {
      const response = await api.get(endpoint, { params });
      items.value = response.data.data || response.data;
      total.value = response.data.total || items.value.length;
    } catch (err) {
      error.value = err as Error;
    } finally {
      loading.value = false;
    }
  };

  const create = async (data: Partial<T>) => {
    loading.value = true;
    try {
      const response = await api.post(endpoint, data);
      items.value.push(response.data);
      total.value++;
      return response.data;
    } catch (err) {
      error.value = err as Error;
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const update = async (id: string | number, data: Partial<T>) => {
    loading.value = true;
    try {
      const response = await api.patch(`${endpoint}/${id}`, data);
      const index = items.value.findIndex((item: any) => item.id === id);
      if (index !== -1) {
        items.value[index] = response.data;
      }
      return response.data;
    } catch (err) {
      error.value = err as Error;
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const remove = async (id: string | number) => {
    loading.value = true;
    try {
      await api.delete(`${endpoint}/${id}`);
      items.value = items.value.filter((item: any) => item.id !== id);
      total.value--;
    } catch (err) {
      error.value = err as Error;
      throw err;
    } finally {
      loading.value = false;
    }
  };

  return {
    items: computed(() => items.value),
    total: computed(() => total.value),
    loading: computed(() => loading.value),
    error: computed(() => error.value),
    fetch,
    create,
    update,
    remove,
  };
}
