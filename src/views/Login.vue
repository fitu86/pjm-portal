<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">Portal</h2>
        <p class="mt-2 text-center text-sm text-gray-600">Inicia sesión en tu cuenta</p>
      </div>

      <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
        <div class="rounded-md shadow-sm space-y-4">
          <VInput
            v-model="credentials.email"
            type="email"
            label="Correo electrónico"
            placeholder="usuario@ejemplo.com"
            required
          />

          <VInput
            v-model="credentials.password"
            type="password"
            label="Contraseña"
            placeholder="••••••••"
            required
          />
        </div>

        <div v-if="error" class="text-red-600 text-sm text-center">
          {{ error }}
        </div>

        <VButton type="submit" :loading="loading" class="w-full" variant="primary">
          Iniciar sesión
        </VButton>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import VInput from '@/components/ui/VInput.vue';
import VButton from '@/components/ui/VButton.vue';

const router = useRouter();
const authStore = useAuthStore();

const credentials = ref({
  email: '',
  password: '',
});

const loading = ref(false);
const error = ref('');

const handleLogin = async () => {
  loading.value = true;
  error.value = '';

  try {
    await authStore.login(credentials.value.email, credentials.value.password);
    router.push('/');
  } catch (err: any) {
    error.value = err.message || 'Error al iniciar sesión';
  } finally {
    loading.value = false;
  }
};
</script>
