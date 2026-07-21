<template>
  <div class="v-checkbox flex items-center">
    <input
      :id="id"
      type="checkbox"
      :checked="modelValue"
      :required="required"
      :disabled="disabled"
      class="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
      @change="handleChange"
    />
    <label v-if="label" :for="id" class="ml-2 block text-sm text-gray-900 cursor-pointer">
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  modelValue: boolean;
  label?: string;
  required?: boolean;
  disabled?: boolean;
}

defineProps<Props>();

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
}>();

const id = computed(() => `checkbox-${Math.random().toString(36).substring(2, 9)}`);

const handleChange = (e: Event) => {
  emit('update:modelValue', (e.target as HTMLInputElement).checked);
};
</script>
