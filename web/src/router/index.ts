import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/LoginView.vue'
import CCEPView from '@/views/CCEPView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/',
      name: 'ccep',
      component: CCEPView,
      redirect: '/evaluation',
      children: [
        {
          path: '/evaluation',
          name: 'evaluation',
          // route level code-splitting
          // this generates a separate chunk (About.[hash].js) for this route
          // which is lazy-loaded when the route is visited.
          component: () => import('../views/evaluation/EvaluationView.vue')
        },
        {
          path: '/system',
          name: 'system',
          // route level code-splitting
          // this generates a separate chunk (About.[hash].js) for this route
          // which is lazy-loaded when the route is visited.
          component: () => import('../views/system/SystemView.vue')
        },
      ]
    },

  ]
})

export default router
