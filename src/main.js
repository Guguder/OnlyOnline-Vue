import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style.css'
import App from './App.vue'
import naive from 'naive-ui'
import router from "./router";

// 引入字体
import 'vfonts/Lato.css'
import 'vfonts/FiraCode.css'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia) // 在使用其他插件之前先使用 Pinia

// 添加全局路由守卫
router.beforeEach((to, from, next) => {
  // 每次路由切换时重置加载状态
  if (app._instance) {
    app._instance.exposed.isLoading = true;
  }
  next();
});

router.afterEach(() => {
  // 路由切换完成后延迟关闭加载状态
  setTimeout(() => {
    if (app._instance) {
      app._instance.exposed.isLoading = false;
    }
  }, 300);
});

app.use(naive).use(router).mount('#app')
