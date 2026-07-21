import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { VueQueryPlugin } from '@tanstack/vue-query';
import router from './router';
import App from './App.vue';
import './style.css';
import { registerBaseComponents } from './components/registry';

const app = createApp(App);
registerBaseComponents(app);
app.use(createPinia());
app.use(VueQueryPlugin);
app.use(router);
app.mount('#app');
