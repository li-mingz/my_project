import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import './assets/fonts.css';
import router from './router' // 导入路由配置
import App from './App.vue'

const pinia = createPinia();
// createApp(App).mount('#app');
const app = createApp(App);
app.use(pinia)
app.use(ElementPlus)
app.use(router)
app.mount('#app')
