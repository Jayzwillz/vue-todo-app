<script setup>
import { useRoute } from 'vue-router';
import { useTodoStore } from '../stores/todoStore';

const route = useRoute();
const todoStore = useTodoStore();
const todo = todoStore.todos.find(t => t.id == route.params.id);
</script>

<template>
  <div v-if="todo" class="max-w-2xl mx-auto mt-4 p-6 bg-gray-800 text-gray-300 rounded-lg shadow-md">
    <h1 class="text-3xl font-bold text-white">{{ todo.title }}</h1>
    <p class="mt-2 text-lg">
      Status: 
      <span 
        :class="todo.completed ? 'text-green-400' : 'text-yellow-400'"
        class="font-semibold"
      >
        {{ todo.completed ? 'Completed' : 'Pending' }}
      </span>
    </p>
  </div>

  <div v-else class="text-center mt-10 text-gray-400">
    <p class="text-lg">Todo not found.</p>
  </div>
</template>
