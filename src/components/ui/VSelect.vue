<template>
  <div class="v-select">
    <label v-if="label" class="block text-sm font-medium text-gray-700 mb-1">
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>

    <select
      :value="modelValue"
      :required="required"
      :disabled="disabled"
      class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
      @change="handleChange"
    >
      <option v-if="placeholder" value="">{{ placeholder }}</option>
      <option
        v-for="option in options"
        :key="getOptionValue(option)"
        :value="getOptionValue(option)"
      >
        {{ getOptionLabel(option) }}
      </option>
    </select>
  </div>
</template>

<script setup lang="ts">
interface Option {
  value: any;
  label: string;
}

interface Props {
  modelValue: any;
  label?: string;
  placeholder?: string;
  options: (Option | string | number)[];
  required?: boolean;
  disabled?: boolean;
}

defineProps<Props>();

const emit = defineEmits<{
  'update:modelValue': [value: any];
}>();

const handleChange = (e: Event) => {
  emit('update:modelValue', (e.target as HTMLSelectElement).value);
};

const getOptionValue = (option: Option | string | number) => {
  return typeof option === 'object' ? option.value : option;
};

const getOptionLabel = (option: Option | string | number) => {
  return typeof option === 'object' ? option.label : String(option);
};
</script>
