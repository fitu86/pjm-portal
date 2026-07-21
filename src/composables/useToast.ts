import { ref } from 'vue';

interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}

const toasts = ref<Toast[]>([]);
let id = 0;

export function useToast() {
  const show = (
    message: string,
    type: Toast['type'] = 'info',
    duration = 3000
  ) => {
    const toast: Toast = { id: id++, message, type, duration };
    toasts.value.push(toast);
    
    if (duration > 0) {
      setTimeout(() => remove(toast.id), duration);
    }
  };
  
  const remove = (toastId: number) => {
    const index = toasts.value.findIndex(t => t.id === toastId);
    if (index > -1) {
      toasts.value.splice(index, 1);
    }
  };
  
  return {
    toasts,
    success: (msg: string) => show(msg, 'success'),
    error: (msg: string) => show(msg, 'error'),
    warning: (msg: string) => show(msg, 'warning'),
    info: (msg: string) => show(msg, 'info'),
    remove,
  };
}
