<template>
  <header class="h-12 border-b border-strong bg-surface flex items-center justify-between px-4">
    <div class="flex items-center gap-3">
      <AppBreadcrumb />
    </div>
    <div class="flex items-center gap-3">
      <AppSearch />
      <span class="text-sm text-muted hidden sm:inline">{{ userName }}</span>
      <button
        class="text-sm px-2 py-1 rounded hover:bg-surface-elevated text-gray-400 hover:text-danger transition-colors"
        @click="handleLogout"
      >
        Salir
      </button>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';
import AppBreadcrumb from './AppBreadcrumb.vue';
import AppSearch from './AppSearch.vue';

const authStore = useAuthStore();
const router = useRouter();

const userName = computed(() => {
  const user = authStore.user as Record<string, unknown> | null;
  if (!user) return '';
  return (user.first_name as string) || (user.email as string) || '';
});

async function handleLogout() {
  await authStore.logout();
  router.push('/login');
}
</script>
