import { useToast } from './useToast';

export function useErrorHandler() {
  const toast = useToast();

  const handleError = (error: any, customMessage?: string) => {
    console.error('Error:', error);

    let message = customMessage || 'Ocurrió un error inesperado';

    if (error.response) {
      // Error de respuesta del servidor
      message = error.response.data?.message || `Error ${error.response.status}`;
    } else if (error.request) {
      // Error de red
      message = 'Error de conexión. Verifica tu internet.';
    }

    toast.error(message);
  };

  return { handleError };
}
