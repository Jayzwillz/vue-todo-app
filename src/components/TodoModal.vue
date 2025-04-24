<template>
    <div
      class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      @click.self="$emit('close')"
    >
      <div class="bg-gray-900 rounded-lg p-6 w-full max-w-md shadow-lg">
        <h2 class="text-xl font-bold text-white mb-4">Create New Todo</h2>
  
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <input
            v-model="form.title"
            type="text"
            placeholder="Todo Title"
            class="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
  
          <input
            v-model="form.dueDate"
            type="date"
            class="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
  
          <input
            v-model="form.dueTime"
            type="time"
            class="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
  
          <div class="flex justify-end gap-2">
            <button
              type="button"
              @click="$emit('close')"
              class="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-500 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-400 transition"
            >
              Add Todo
            </button>
          </div>
        </form>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue';
  
  const emit = defineEmits(['close', 'submit']);
  
  const form = ref({
    title: '',
    dueDate: '',
    dueTime: '',
  });
  
  const handleSubmit = () => {
    if (form.value.title && form.value.dueDate && form.value.dueTime) {
      emit('submit', {
        ...form.value,
        id: Date.now(),
        completed: false,
      });
      emit('close');
      form.value = { title: '', dueDate: '', dueTime: '' };
    }
  };
  </script>
  