<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useTodoStore } from '../stores/todoStore';
import { useRouter } from 'vue-router';

// const { totalPages } = todoStore; // Add this line
const todoStore = useTodoStore();
const router = useRouter();
const searchQuery = ref('');
const filterStatus = ref('all');
const newTodo = ref('');

// Fetch todos on mount
onMounted(() => {
  todoStore.fetchTodos();
});

// Computed: Filtered Todos
const filteredTodos = computed(() => {
  return todoStore.todos
    .filter(todo => {
      if (filterStatus.value === 'completed') return todo.completed;
      if (filterStatus.value === 'pending') return !todo.completed;
      return true;
    })
    .filter(todo => todo.title.toLowerCase().includes(searchQuery.value.toLowerCase()));
});

// Computed: Paginated Todos (Now Uses `filteredTodos`)
const paginatedTodos = computed(() => {
  const start = (todoStore.currentPage - 1) * todoStore.todosPerPage;
  return filteredTodos.value.slice(start, start + todoStore.todosPerPage);
});

// Watch for Filter/Search Changes & Reset Pagination
watch([searchQuery, filterStatus], () => {
  todoStore.setPage(1); // Reset to first page on filter/search change
});

// Add New Todo
const addTodo = () => {
  if (!newTodo.value.trim()) return;
  const newTask = {
    id: Date.now(),
    title: newTodo.value.trim(),
    completed: false
  };
  todoStore.addTodo(newTask);
  newTodo.value = '';
};

// Toggle Todo Completion
const toggleCompletion = (todo) => {
  todoStore.updateTodo({ ...todo, completed: !todo.completed });
};

// Delete Todo
const deleteTodo = (todoId) => {
  todoStore.deleteTodo(todoId);
};

// Change Page
const changePage = (page) => {
  if (page >= 1 && page <= todoStore.totalPages) {
    todoStore.setPage(page);
  }
};

const visiblePages = computed(() => {
  const total = todoStore.totalPages;
  const current = todoStore.currentPage;
  const maxVisible = 5; // Show only 5 pages at a time
  const pages = [];

  let start = Math.max(1, current - Math.floor(maxVisible / 2));
  let end = Math.min(total, start + maxVisible - 1);

  if (end - start < maxVisible - 1) {
    start = Math.max(1, end - maxVisible + 1);
  }

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  return pages;
});

</script>

<template>
  <div class="max-w-3xl mx-auto mt-4 p-6 bg-gray-900 text-gray-300 rounded-lg shadow-md todo-container">
    <h1 class="text-2xl font-bold text-center text-white mb-6">Todo List</h1>

    <!-- Add Todo Section -->
    <div class="flex flex-col sm:flex-row gap-2 mb-6">
      <input
        v-model="newTodo"
        type="text"
        placeholder="Add new todo..."
        class="w-full sm:flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
      <button
        @click="addTodo"
        class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-400 transition w-full sm:w-auto"
      >
        Add
      </button>
    </div>

    <!-- Search & Filter Section -->
    <div class="flex flex-col sm:flex-row sm:justify-between gap-4 mb-6">
      <input 
        v-model="searchQuery" 
        type="text" 
        placeholder="Search todos..." 
        class="w-full sm:w-2/3 px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      <select 
        v-model="filterStatus"
        class="w-full sm:w-1/3 px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
      >
        <option value="all">All</option>
        <option value="completed">Completed</option>
        <option value="pending">Pending</option>
      </select>
    </div>

    <!-- Todos List -->
    <ul v-if="paginatedTodos.length" class="space-y-4">
      <li 
        v-for="todo in paginatedTodos" 
        :key="todo.id" 
        class="bg-gray-800 p-4 rounded-md shadow-md hover:bg-gray-700 transition flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2"
      >
        <div class="flex items-center gap-2">
          <input
            type="checkbox"
            :checked="todo.completed"
            @change="toggleCompletion(todo)"
            class="cursor-pointer"
          />
          <button 
            @click="router.push(`/todo/${todo.id}`)" 
            class="text-blue-400 hover:text-blue-300 font-medium break-words max-w-[200px] sm:max-w-none text-left"
          >
            {{ todo.title }}
          </button>
        </div>
        <div class="flex flex-wrap gap-2">
          <button 
            @click="toggleCompletion(todo)"
            class="px-3 py-1 text-sm rounded-md text-white"
            :class="todo.completed ? 'bg-green-500' : 'bg-yellow-500'"
          >
            {{ todo.completed ? 'Completed' : 'Pending' }}
          </button>
          <button
            @click="deleteTodo(todo.id)"
            class="bg-red-500 px-3 py-1 text-sm rounded-md hover:bg-red-400 transition"
          >
            Delete
          </button>
        </div>
      </li>
    </ul>

    <p v-else class="text-center text-red-400">No todos found.</p>

    <!-- Pagination -->
    <div v-if="todoStore.totalPages > 1" class="flex flex-wrap justify-center mt-6 items-center gap-2">
      
      <!-- Prev Button -->
      <button 
        @click="changePage(todoStore.currentPage - 1)" 
        :disabled="todoStore.currentPage === 1"
        class="px-4 py-2 rounded-md border transition bg-gray-700 text-gray-300 border-gray-600 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        ‹ Prev
      </button>

      <!-- Dynamic Page Numbers -->
      <div class="flex flex-wrap gap-2">
        <button 
          v-for="page in visiblePages" 
          :key="page" 
          @click="changePage(page)"
          :class="[ 
            'px-4 py-2 rounded-md border transition', 
            todoStore.currentPage === page 
              ? 'bg-blue-500 text-white border-blue-400' 
              : 'bg-gray-700 text-gray-300 border-gray-600 hover:bg-gray-600' 
          ]"
        >
          {{ page }}
        </button>
      </div>

      <!-- Next Button -->
      <button 
        @click="changePage(todoStore.currentPage + 1)" 
        :disabled="todoStore.currentPage === todoStore.totalPages"
        class="px-4 py-2 rounded-md border transition bg-gray-700 text-gray-300 border-gray-600 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Next ›
      </button>

    </div>
  </div>
</template>

