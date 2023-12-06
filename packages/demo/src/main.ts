import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import { createWebHashHistory, createRouter, setupDataFetchingGuard } from 'vue-router/auto';

const router = createRouter({
  history: createWebHashHistory(),
});

setupDataFetchingGuard(router);

createApp(App).use(router).mount('#app');
