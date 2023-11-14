import { createRouter, createWebHistory, createWebHashHistory  } from 'vue-router'

const router = createRouter({
  // history: createWebHistory(import.meta.env.BASE_URL),
  history: createWebHashHistory(), // 'web'
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/monitor/index.vue')
    },
  ]
})

export default router
