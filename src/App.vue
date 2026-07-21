<template>
  <div class="dark">
    <div id="app" class="font-sans antialiased min-h-screen bg-background text-gray-200">
      <router-view />
      <VToast />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import VToast from '@/components/ui/VToast.vue';

const router = useRouter();
const authStore = useAuthStore();

function onUnauthorized() {
  authStore.logout();
  router.push({ name: 'login' });
}

onMounted(() => window.addEventListener('pjm:unauthorized', onUnauthorized));
onUnmounted(() => window.removeEventListener('pjm:unauthorized', onUnauthorized));
</script>
