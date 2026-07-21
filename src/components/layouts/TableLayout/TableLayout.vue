<template>
  <div class="p-4 bg-white rounded-lg shadow">
    <div v-if="$slots.actions" class="mb-4 flex justify-end">
      <slot name="actions"></slot>
    </div>
    <div v-if="loading" class="text-center py-4">Loading...</div>
    <table v-else class="min-w-full divide-y divide-gray-200">
      <thead class="bg-gray-50">
        <tr>
          <th
            v-if="selectable"
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            <input type="checkbox" :checked="allSelected" @change="toggleAll" />
          </th>
          <th
            v-for="field in fields"
            :key="field.key"
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            {{ field.label }}
          </th>
          <th
            v-if="$slots.rowActions"
            class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            Actions
          </th>
        </tr>
      </thead>
      <tbody class="bg-white divide-y divide-gray-200">
        <tr
          v-for="item in items"
          :key="item.id"
          :class="{ 'cursor-pointer hover:bg-gray-100': clickable }"
          @click="rowClicked(item)"
        >
          <td v-if="selectable" class="px-6 py-4 whitespace-nowrap">
            <input type="checkbox" :checked="isSelected(item)" @change="toggleItem(item)" />
          </td>
          <td
            v-for="field in fields"
            :key="field.key"
            class="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
          >
            {{ item[field.key] }}
          </td>
          <td
            v-if="$slots.rowActions"
            class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium"
          >
            <slot name="rowActions" :item="item"></slot>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';

interface Field {
  key: string;
  label: string;
  display?: string; // e.g., 'text', 'badge', 'date'
}

const props = defineProps<{
  fields: Field[];
  items: any[];
  loading?: boolean;
  selectable?: boolean;
  clickable?: boolean;
}>();

const emit = defineEmits<{
  (e: 'row-click', item: any): void;
  (e: 'selection-change', selectedItems: Set<any>): void;
}>();

const selected = ref<Set<any>>(new Set());

const allSelected = computed(() => {
  return props.items.length > 0 && props.items.every((item) => selected.value.has(item));
});

watch(
  () => props.items,
  (newItems) => {
    // If items change, re-evaluate selection to remove items no longer present
    const newSelected = new Set<any>();
    selected.value.forEach((sItem) => {
      if (newItems.some((newItem) => newItem.id === sItem.id)) {
        // Assuming 'id' is unique identifier
        newSelected.add(sItem);
      }
    });
    selected.value = newSelected;
    emit('selection-change', selected.value);
  },
  { deep: true }
);

const toggleAll = () => {
  if (allSelected.value) {
    selected.value.clear();
  } else {
    props.items.forEach((item) => selected.value.add(item));
  }
  emit('selection-change', selected.value);
};

const isSelected = (item: any) => {
  return selected.value.has(item);
};

const toggleItem = (item: any) => {
  if (isSelected(item)) {
    selected.value.delete(item);
  } else {
    selected.value.add(item);
  }
  emit('selection-change', selected.value);
};

const rowClicked = (item: any) => {
  if (props.clickable) {
    emit('row-click', item);
  }
};
</script>
