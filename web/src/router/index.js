import { createRouter, createWebHistory, createWebHashHistory  } from 'vue-router'
import { getStorage, setStorage } from '@/utils';

const router = createRouter({
  // history: createWebHistory(import.meta.env.BASE_URL),
  history: createWebHashHistory(), // 'web'
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/monitor/index.vue')
    },
    {
      path: '/redis',
      name: 'redis',
      component: () => import('@/views/redis/index.vue')
    },
  ]
})

const CURR_ROUTE_PATH = 'CURR_ROUTE_PATH'

router.afterEach((to) => {
  console.log(to.fullPath);
  setStorage(CURR_ROUTE_PATH, to.fullPath)
})

setTimeout(() => {
  if (getStorage(CURR_ROUTE_PATH)) {
    router.push(getStorage(CURR_ROUTE_PATH))
  }
})

export default router
