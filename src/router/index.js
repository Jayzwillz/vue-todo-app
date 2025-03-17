import { createRouter, createWebHistory } from 'vue-router';
import TodoList from '../views/TodoList.vue';
import TodoDetail from '../views/TodoDetail.vue';
import NotFound from '../views/NotFound.vue';

const routes = [
  { path: '/', component: TodoList },
  { path: '/todo/:id', component: TodoDetail, props: true },
  { path: '/:pathMatch(.*)*', component: NotFound }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
