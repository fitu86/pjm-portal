<template>
  <VInput
    v-model="model"
    :label="field.name"
    :placeholder="options.placeholder"
    :maxlength="options.maxLength"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import VInput from '@/components/ui/VInput.vue';

interface Props {
  modelValue: string;
  field: { name: string; key: string };
  options: {
    placeholder?: string;
    maxLength?: number;
  };
}

const props = defineProps<Props>();

const emit = defineEmits<{
  'update:modelValue': [value: string];
}>();

const model = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});
</script>
