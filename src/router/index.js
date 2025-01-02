import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ProblemsView from '../views/ProblemsView.vue'
import DiscussionView from '../views/DiscussionView.vue'
import AboutView from '../views/AboutView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/problems',
      name: 'problems',
      component: ProblemsView
    },
    {
      path: '/discussion',
      name: 'discussion',
      component: DiscussionView
    },
    {
      path: '/about',
      name: 'about',
      component: AboutView
    }
  ]
})

export default router
