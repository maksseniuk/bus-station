import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'BusLines',
    component: () => import(/* webpackChunkName: "bus-lines" */ '../views/BusLines.vue')
  },
  {
    path: '/stops',
    name: 'BusStops',
    component: () => import(/* webpackChunkName: "bus-stops" */ '../views/BusStops.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
