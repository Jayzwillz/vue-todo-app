import { defineStore } from 'pinia';
import { ref, computed, watch } from 'vue';

export const useTodoStore = defineStore('todoStore', () => {
  const todos = ref([]);
  const currentPage = ref(1);
  const todosPerPage = 10;

  // Fetch todos (Load from localStorage or API)
  const fetchTodos = async () => {
    const savedTodos = JSON.parse(localStorage.getItem('todos'));
    if (savedTodos && savedTodos.length > 0) {
      todos.value = savedTodos; // Load saved todos
    } else {
      const response = await fetch('https://jsonplaceholder.typicode.com/todos');
      const data = await response.json();
      todos.value = data.slice(0, 200);
      saveTodos(); // Save fetched todos
    }
  };

  // Save todos to localStorage
  const saveTodos = () => {
    localStorage.setItem('todos', JSON.stringify(todos.value));
  };

  // Add Todo
  const addTodo = (newTodo) => {
    todos.value.unshift(newTodo); // Add at the top
    saveTodos();
  };

  // Delete Todo
  const deleteTodo = (id) => {
    todos.value = todos.value.filter(todo => todo.id !== id);
    saveTodos();
  };

  // Update Todo Completion
  const updateTodo = (updatedTodo) => {
    const index = todos.value.findIndex(todo => todo.id === updatedTodo.id);
    if (index !== -1) {
      todos.value[index] = updatedTodo;
      saveTodos();
    }
  };

  // Pagination Computations
  const totalPages = computed(() => Math.ceil(todos.value.length / todosPerPage));

  const setPage = (page) => {
    currentPage.value = page;
  };

  // Watch for changes and save automatically
  watch(todos, saveTodos, { deep: true });

  return { 
    todos, fetchTodos, addTodo, deleteTodo, updateTodo, 
    currentPage, todosPerPage, totalPages, setPage 
  };
});
