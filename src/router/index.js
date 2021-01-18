import { createRouter, createWebHistory } from 'vue-router'
import Three from '../views/Three.vue'

const routes = [
  {
    path: '/',
    name: 'Three',
    component: Three
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
