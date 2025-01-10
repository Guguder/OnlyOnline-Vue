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
app.use(naive).use(router).mount('#app')
