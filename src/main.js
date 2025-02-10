import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style.css'
import App from './App.vue'
import naive from 'naive-ui'
import router from "./router"
import { useAuthStore } from './stores/auth'

// 引入字体
import 'vfonts/Lato.css'
import 'vfonts/FiraCode.css'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(naive)
app.use(router)

// 移到 pinia 初始化之后
const authStore = useAuthStore()
// 等待 DOM 挂载后再初始化
app.mount('#app')

// 初始化用户信息
authStore.initialize()

// 移除原有的路由守卫，改为更简单的版本
router.beforeEach((to, from, next) => {
  next()
})
