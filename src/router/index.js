import { createRouter, createWebHistory } from 'vue-router'
import PersonalCenter from '../views/frontend/user/PersonalCenter.vue'
import { useAuthStore } from '../stores/auth'
import { message } from 'ant-design-vue'

const routes = [
  {
    path: '/',
    component: () => import('@/layouts/FrontendLayout.vue'),
    children: [
      {
        path: '',
        redirect: '/home'
      },
      {
        path: 'home',
        name: 'home',
        component: () => import('../views/frontend/home/HomeView.vue'),
        meta: { menu: '/home' }
      },
      {
        path: 'topics',
        name: 'topics',
        component: () => import('../views/frontend/topics/TopicsView.vue'),
        meta: { menu: '/topics' }
      },
      {
        path: 'forum/:category?',
        name: 'Forum',
        component: () => import('../views/frontend/forum/ForumView.vue'),
        props: (route) => ({
          selectedCategory: Number(route.params.category) || 1
        }),
      },
      {
        path: 'about',
        name: 'about',
        component: () => import('../views/frontend/other/AboutView.vue'),
        meta: { menu: '/about' }
      },
      {
        path: 'forum/post/:id',
        name: 'PostDetail',
        component: () => import('../views/frontend/forum/PostDetailView.vue'),
        props: true
      },
      {
        path: '/post/:id',
        name: 'PostDetail',
        component: () => import('../views/frontend/forum/PostDetailView.vue')
      },
      {
        path: 'notifications',
        name: 'notifications',
        component: () => import('../views/frontend/notice/NotificationsView.vue'),
        meta: { 
          requiresAuth: true,
          title: '消息通知'
        }
      },
      {
        path: 'personal-center',
        name: 'PersonalCenter',
        component: PersonalCenter,
        meta: {
          title: '个人中心'
        }
      },
      {
        path: 'problem/:id',
        name: 'SqlProblemDetail',
        component: () => import('../views/frontend/problem/SqlProblemDetail.vue'),
        meta: {
          hideNavAndFooter: true
        }
      },
      {
        path: 'bank/detail/:id',
        name: 'BankDetail',
        component: () => import('../views/frontend/bank/BankDetailView.vue')
      },
      {
        path: ':pathMatch(.*)*',
        redirect: '/home'
      }
    ]
  },
  {
    path: '/backend',
    component: () => import('@/layouts/BackendLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        redirect: '/backend/dashboard'
      },
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/backend/Dashboard.vue')
      },
      {
        path: 'users',
        name: 'UserManagement',
        component: () => import('@/views/backend/UserManagement.vue')
      },
      {
        path: 'problems',
        name: 'ProblemList',
        component: () => import('@/views/backend/problem/ProblemList.vue')
      },
      {
        path: 'problem-categories',
        name: 'ProblemCategories',
        component: () => import('@/views/backend/problem/ProblemCategories.vue')
      },
      {
        path: 'posts',
        name: 'PostManagement',
        component: () => import('@/views/backend/forum/PostManagement.vue')
      },
      {
        path: 'comments',
        name: 'CommentManagement',
        component: () => import('@/views/backend/forum/CommentManagement.vue')
      },
      {
        path: 'tags',
        name: 'TagManagement',
        component: () => import('@/views/backend/common/TagManagement.vue')
      },
      {
        path: 'settings',
        name: 'SystemSettings',
        component: () => import('@/views/backend/SystemSettings.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return { top: 0 }
  }
})

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  
  // 确保用户信息已经初始化
  if (!authStore.initialized) {
    await authStore.initialize()
  }
  
  // 如果是访问后台页面
  if (to.path.startsWith('/backend')) {
    // 检查是否已登录且是管理员
    if (!authStore.isAuthenticated) {
      message.error('请先登录')
      next('/home')
      return
    }
    
    // 检查是否是管理员
    if (authStore.userInfo?.role !== 0) {
      message.error('无权访问')
      next('/home')
      return
    }
  }
  
  next()
})

export default router
