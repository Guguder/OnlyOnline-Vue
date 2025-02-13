import { createRouter, createWebHistory } from 'vue-router'
import PersonalCenter from '../views/user/PersonalCenter.vue'

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
    path: '/forum/:category?', // 可选参数，默认为1
    name: 'Forum',
    component: () => import('../views/forum/ForumView.vue'),
    props: (route) => ({
      selectedCategory: Number(route.params.category) || 1
    }),
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('../views/other/AboutView.vue'),
    meta: { menu: '/about' }
  },
  {
    path: '/forum/post/:id',  // 确保路径格式正确
    name: 'PostDetail',
    component: () => import('../views/forum/PostDetailView.vue'),
    props: true  // 启用 props 传递参数
  },
  {
    path: '/notifications',
    name: 'notifications',
    component: () => import('../views/notice/NotificationsView.vue'),
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
  {
    path: '/problem/:id',
    name: 'SqlProblemDetail',
    component: () => import('../views/problem/SqlProblemDetail.vue'),
    meta: {
      hideNavAndFooter: true  // 已经设置了隐藏导航栏和页脚的标记
    }
  },
  {
    path: '/bank/detail/:id',
    name: 'BankDetail',
    component: () => import('../views/bank/BankDetailView.vue')
  },
  // 添加通配符路由在最后
  {
    path: '/:pathMatch(.*)*',
    redirect: '/home'
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  // 添加 scrollBehavior 配置
  scrollBehavior(to, from, savedPosition) {
    // 始终滚动到顶部
    return { top: 0 }
  }
})

export default router
