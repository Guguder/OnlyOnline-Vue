import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    redirect: '/home'  // 添加重定向
  },
  {
    path: '/home',     // 添加 home 路由
    name: 'Home',
    component: () => import('../views/home/HomeView.vue'),
    meta: { menu: '/home' }
  },
  {
    path: '/topics',
    name: 'Topics',
    component: () => import('../views/topics/TopicsView.vue'),
    meta: { menu: '/topics' }
  },
  {
    path: '/forum',
    name: 'Forum',
    component: () => import('../views/forum/ForumView.vue'),
    meta: { menu: '/forum' }
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('../views/orther/AboutView.vue'),
    meta: { menu: '/about' }
  },
  {
    path: '/post/:id',
    name: 'PostDetail',
    component: () => import('../views/topics/PostDetailView.vue')
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
