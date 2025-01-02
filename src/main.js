import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import naive from 'naive-ui'
import router from "./router";
import store from "./store";

// 引入字体
import 'vfonts/Lato.css'
import 'vfonts/FiraCode.css'

createApp(App).use(naive).use(store).use(router).mount('#app')
