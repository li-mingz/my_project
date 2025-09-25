import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'

const pinia = createPinia();
// createApp(App).mount('#app');
const app = createApp(App);
app.use(pinia)
app.mount('#app')
