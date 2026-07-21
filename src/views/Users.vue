<template>
  <DefaultLayout>
    <VCard title="Users List">
      <TableLayout
        :fields="fields"
        :items="items"
        :loading="loading"
        selectable
        clickable
        @row-click="handleRowClick"
        @selection-change="handleSelectionChange"
      >
        <template #actions>
          <VButton @click="handleCreate"> Create New User </VButton>
        </template>

        <template #rowActions="{ item }">
          <VButton @click="handleEdit(item)">Edit</VButton>
          <VButton @click="handleDelete(item)">Delete</VButton>
        </template>
      </TableLayout>
    </VCard>
  </DefaultLayout>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useCollection } from '@/composables/useCollection';
import DefaultLayout from '@/layouts/DefaultLayout.vue';
import VCard from '@/components/ui/VCard.vue';
import VButton from '@/components/ui/VButton.vue';
import TableLayout from '@/components/layouts/TableLayout/TableLayout.vue';

interface User {
  id: string;
  name: string;
  email: string;
  status: string;
  created_at: string;
}

const fields = [
  { key: 'name', label: 'Name', display: 'text' },
  { key: 'email', label: 'Email', display: 'text' },
  { key: 'status', label: 'Status', display: 'badge' },
  { key: 'created_at', label: 'Created At', display: 'date' },
];

const { items, loading, fetch } = useCollection<User>('/users'); // Assuming '/users' is the API endpoint for users

onMounted(() => {
  fetch();
});

const handleRowClick = (item: User) => {
  console.log('Row clicked:', item);
  // Implement navigation or detail view logic
};

const handleSelectionChange = (selected: Set<User>) => {
  console.log('Selected items:', Array.from(selected));
  // Implement bulk actions logic
};

const handleCreate = () => {
  console.log('Create new user');
  // Implement create new user logic
};

const handleEdit = (item: User) => {
  console.log('Edit user:', item);
  // Implement edit user logic
};

const handleDelete = (item: User) => {
  console.log('Delete user:', item);
  // Implement delete user logic
};
</script>
