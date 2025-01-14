import { createRouter, createWebHistory } from 'vue-router'
import PersonalCenter from '../views/PersonalCenter.vue'

const routes = [
  {
    path: '/',
    redirect: '/home'  // 添加重定向
  },
  {
    path: '/home',     // 添加 home 路由
    name: 'home',
    component: () => import('../views/home/HomeView.vue'),
    meta: { menu: '/home' }
  },
  {
    path: '/topics',
    name: 'topics',
    component: () => import('../views/topics/TopicsView.vue'),
    meta: { menu: '/topics' }
  },
  {
    path: '/forum',
    name: 'forum',
    component: () => import('../views/forum/ForumView.vue'),
    meta: { menu: '/forum' }
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('../views/other/AboutView.vue'),
    meta: { menu: '/about' }
  },
  {
    path: '/post/:id',
    name: 'PostDetail',
    component: () => import('../views/topics/PostDetailView.vue')
  },
  {
    path: '/notifications',
    name: 'notifications',
    component: () => import('../views/NotificationsView.vue'),
    meta: { 
      requiresAuth: true,  // 需要登录才能访问
      title: '消息通知'
    }
  },
  {
    path: '/personal-center',
    name: 'PersonalCenter',
    component: PersonalCenter,
    meta: {
      title: '个人中心'
    }
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
