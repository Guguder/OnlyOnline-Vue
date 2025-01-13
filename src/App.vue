<template>
  <a-space direction="vertical" :style="containerStyle">
    <a-layout style="width: 100%; min-height: 100vh;">
      <a-layout-header :style="headerStyle">
        <div class="header-container">
          <div class="logo-container" @click="handleLogoClick">
            <img src="/logo.png" alt="logo" />
          </div>
          <div class="menu-container">
            <a-menu
                style="font-weight: 600;font-size: 16px"
                v-model:selectedKeys="current"
                mode="horizontal"
                :items="items"
                @select="({ key }) => handleSelect(key)"
            />
            <a-button @click="showLoginModal">登录</a-button>
          </div>
        </div>
      </a-layout-header>
      <a-layout-content :style="contentStyle">
        <div class="content-container">
          <router-view />
        </div>
      </a-layout-content>
      <a-layout-footer>
        <Footer></Footer>
      </a-layout-footer>
    </a-layout>
    <login-modal />
  </a-space>
</template>

<script setup>
import { h, ref, onMounted } from 'vue';
import { 
  HomeOutlined, 
  BookOutlined, 
  MessageOutlined, 
  InfoCircleOutlined 
} from '@ant-design/icons-vue';
import { useRouter, useRoute } from 'vue-router';
import Footer from "./components/Footer.vue";
import LoginModal from "./components/auth/LoginModal.vue";
import { useLoginModal } from './stores/useLoginModal'

const router = useRouter();
const route = useRoute();

// 只使用路由路径作为选中项
const current = ref([]);

// 在组件挂载时同步路由状态
onMounted(() => {
  syncMenuWithRoute();
});

// 同步菜单选中状态与路由
const syncMenuWithRoute = () => {
  // 修改判断逻辑
  current.value = [route.path];
};

// 监听路由变化，修改判断逻辑
router.afterEach((to) => {
  current.value = [to.path];
});

const items = ref([
  {
    key: '/home',
    // icon: () => h(HomeOutlined),
    label: '主页',
  },
  {
    key: '/topics',   // 修改key与路由路径匹配
    // icon: () => h(BookOutlined),
    label: '题库',
  },
  {
    key: '/forum', // 修改key与路由路径匹配
    // icon: () => h(MessageOutlined),
    label: '讨论',
  },
  {
    key: '/about',      // 修改key与路由路径匹配
    // icon: () => h(InfoCircleOutlined),
    label: '关于',
  }
]);

// 添加路由监听
const handleSelect = (key) => {
  router.push(key);
};

// 添加点击Logo跳转到首页的功能
const handleLogoClick = () => {
  router.push('/home');  // 修改为 /home
};

// 登录模态框引用
const { showLoginModal } = useLoginModal()

const containerStyle = {
  width: '100%',
  display: 'block',
  margin: 0,
  padding: 0,
}

const headerStyle = {
  color: '#fff',
  height: 64,
  paddingInline: 50,
  lineHeight: '64px',
  backgroundColor: '#fff',
  padding: '0 20px',
};

const contentStyle = {
  backgroundColor: '#F5F5F7',
};
</script>

<style >
.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  height: 100%;
  margin: 0 auto;
}

.content-container {
  display: flex;
  justify-content: center;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
}

.header-container :deep(.ant-menu) {
  flex: 1;
  border: none;
}

.logo-container {
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
}

.logo-container img {
  height: 40px;
  width: auto;
  display: block;
}

.menu-container {
  display: flex;
  align-items: center;
  gap: 20px;
}

.menu-container :deep(.ant-menu) {
  background: transparent;
  border: none;
  line-height: 64px;
}

:deep(.ant-menu-item) {
  font-weight: 600;
  font-size: 16px;
  color: #fff !important;
}

:deep(.ant-menu-item-selected) {
  background-color: transparent !important;
}

:deep(.ant-menu-item:hover) {
  color: #1890ff !important;
}
</style>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  height: 100%;
  width: 100%;
  margin: 0;
  padding: 0;
}
</style>