<template>
  <div class="flex min-h-screen bg-background">
    <AppSidebar
      :collapsed="sidebarCollapsed"
      :pending-tasks="pendingTasks"
      :open-risks="openRisks"
      @toggle="sidebarCollapsed = !sidebarCollapsed"
    />
    <div
      :class="[
        'flex-1 flex flex-col transition-all duration-200',
        sidebarCollapsed ? 'ml-16' : 'ml-60',
      ]"
    >
      <AppHeader />
      <main class="flex-1 p-4 overflow-auto">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import AppSidebar from '@/components/common/AppSidebar.vue';
import AppHeader from '@/components/common/AppHeader.vue';

defineProps<{
  pendingTasks?: number;
  openRisks?: number;
}>();

const sidebarCollapsed = ref(false);
</script>
