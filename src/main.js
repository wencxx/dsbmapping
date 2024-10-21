import { createApp } from 'vue'
import './index.css'
import router from './router/index.js'
import App from './App.vue'
import { Icon } from '@iconify/vue/dist/iconify.js'
import { createPinia } from 'pinia'
import { useAuthStore } from './store';

const pinia = createPinia()

const app = createApp(App)
app.use(pinia)

const authStore = useAuthStore();
authStore.initializeAuthListener();

app.use(router)
app.component('Icon', Icon)
app.mount('#app')