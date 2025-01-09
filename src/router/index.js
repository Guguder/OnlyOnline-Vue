import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    redirect: '/home'  // 添加重定向
  },
  {
    path: '/home',     // 添加 home 路由
    name: 'Home',
    component: () => import('../views/HomeView.vue'),
    meta: { menu: '/home' }
  },
  {
    path: '/problems',
    name: 'Problems',
    component: () => import('../views/ProblemsView.vue'),
    meta: { menu: '/problems' }
  },
  {
    path: '/discussion',
    name: 'Discussion',
    component: () => import('../views/DiscussionView.vue'),
    meta: { menu: '/discussion' }
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('../views/AboutView.vue'),
    meta: { menu: '/about' }
  },
  {
    path: '/article/:id',
    name: 'ArticleDetail',
    component: () => import('../views/ArticleDetailView.vue')
  },
  // 添加通配符路由在最后
  {
    path: '/:pathMatch(.*)*',
    redirect: '/home'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
