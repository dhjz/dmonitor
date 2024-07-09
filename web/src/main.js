import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import ElementPlus from 'element-plus'
import locale from 'element-plus/es/locale/lang/zh-cn'
import 'element-plus/dist/index.css'
import App from './App.vue'
import router from './router'
import modal from './utils/modal';
import FloatMenu from '@/components/FloatMenu.vue';

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.config.globalProperties.$modal = modal

app.component('FloatMenu', FloatMenu)

// 使用element-plus 并且设置全局的大小
app.use(ElementPlus, {
  locale: locale,
  // 支持 large、default、small
  size: 'default'
})

app.mount('#app')
