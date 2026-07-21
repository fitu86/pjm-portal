<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold text-gray-800 dark:text-white">Portal</h1>
    <p class="text-gray-600 dark:text-gray-400 mt-2">This is the home page. Here's some example content and components:</p>

    <div class="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
      <VCard title="Example Card" class="col-span-1">
        <p class="text-gray-700 dark:text-gray-300 mb-4">
          This is an example of a `VCard` component. You can put any content inside it.
          Below are some interactive examples using other components.
        </p>
        <VButton @click="showToast" variant="primary" class="mr-2">Show Success Toast</VButton>
        <VButton @click="simulateLoading" :loading="loading" variant="secondary">
          <span v-if="!loading">Simulate Loading</span>
          <span v-else>Loading...</span>
        </VButton>
      </VCard>

      <VCard title="Data Display" class="col-span-1">
        <p class="text-gray-700 dark:text-gray-300 mb-4">
          Here you can see how data could be displayed using other modular components.
        </p>
        <div class="flex items-center space-x-2 mb-2">
          <VIcon name="UserIcon" class="text-blue-500" />
          <p class="text-gray-700 dark:text-gray-300">User Name: John Doe</p>
        </div>
        <div class="flex items-center space-x-2">
          <VBadge color="green">Active</VBadge>
          <VBadge color="red">Inactive</VBadge>
        </div>
      </VCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import VCard from '@/components/ui/VCard.vue';
import VButton from '@/components/ui/VButton.vue';
import VIcon from '@/components/ui/VIcon.vue';
import VBadge from '@/components/ui/VBadge.vue';
import { useToast } from '@/composables/useToast';
import { useLoading } from '@/composables/useLoading';

const { success } = useToast();
const { loading, withLoading } = useLoading();

const showToast = () => {
  success('This is a success message from the Home page!');
};

const simulateLoading = async () => {
  await withLoading(async () => {
    // Simulate an API call or long running task
    await new Promise((resolve) => setTimeout(resolve, 2000));
    success('Loading simulation complete!');
  });
};
</script>
