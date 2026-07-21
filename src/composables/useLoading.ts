import { ref } from 'vue';

const globalLoading = ref(false);

export function useLoading() {
  const loading = ref(false);

  const withLoading = async <T>(fn: () => Promise<T>): Promise<T> => {
    loading.value = true;
    globalLoading.value = true;
    
    try {
      return await fn();
    } finally {
      loading.value = false;
      globalLoading.value = false;
    }
  };

  return {
    loading,
    globalLoading,
    withLoading,
  };
}