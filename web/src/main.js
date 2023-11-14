import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import 'element-plus/dist/index.css'
import App from './App.vue'
import router from './router'
import modal from './utils/modal';

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.config.globalProperties.$modal = modal

app.mount('#app')
