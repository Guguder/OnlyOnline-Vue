<template>
  <a-space direction="vertical" :style="containerStyle">
    <a-layout style="width: 100%; min-height: 100vh;">
      <a-layout-header :style="headerStyle">
        <div class="header-container">
          <div class="logo-container">
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
            <a-button>登录</a-button>
          </div>
        </div>
      </a-layout-header>
      <a-layout-content :style="contentStyle">
        <div class="content-container">
          <router-view />
        </div>
      </a-layout-content>
      <a-layout-footer :style="footerStyle">Footer</a-layout-footer>
    </a-layout>
  </a-space>
</template>

<script setup>
import { h, ref } from 'vue';
import { 
  HomeOutlined, 
  BookOutlined, 
  MessageOutlined, 
  InfoCircleOutlined 
} from '@ant-design/icons-vue';
import { useRouter } from 'vue-router';

const current = ref(['home']);
const items = ref([
  {
    key: '/',           // 修改key与路由路径匹配
    icon: () => h(HomeOutlined),
    label: '主页',
  },
  {
    key: '/problems',   // 修改key与路由路径匹配
    icon: () => h(BookOutlined),
    label: '题库',
  },
  {
    key: '/discussion', // 修改key与路由路径匹配
    icon: () => h(MessageOutlined),
    label: '讨论',
  },
  {
    key: '/about',      // 修改key与路由路径匹配
    icon: () => h(InfoCircleOutlined),
    label: '关于',
  }
]);

// 添加路由监听
const router = useRouter();
const handleSelect = (key) => {
  router.push(key);
};

const containerStyle = {
  width: '100%',
  display: 'block',
  margin: 0,
  padding: 0,
}

const layoutStyle = {
  height: '100vh',
}

const headerStyle = {
  textAlign: 'center',
  color: '#fff',
  height: 64,
  paddingInline: 50,
  lineHeight: '64px',
  backgroundColor: '#fff',
  padding: '0 20px',
  // borderBottom: '2px solid #ccc',
};

const contentStyle = {
  textAlign: 'center',
  minHeight: 120,
  lineHeight: '120px',
  color: '#fff',
  backgroundColor: '#28A7D5',
};
const footerStyle = {
  textAlign: 'center',
  color: '#fff',
  backgroundColor: '#108ee9',
};
</script>

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
  height: 100%;
  margin: 0 auto;
}

.header-container .ant-menu {
  flex: 1;
  border: none;
}

.logo-container {
  user-select: none;  /* 禁止选中 */
  -webkit-user-select: none;  /* Safari 支持 */
  -moz-user-select: none;     /* Firefox 支持 */
  -ms-user-select: none;      /* IE/Edge 支持 */
}

.logo-container img {
  height: 40px;  /* 可以根据需要调整图片大小 */
  width: auto;
  display: block;
}

.menu-container {
  display: flex;
  align-items: center;
  gap: 20px;  /* 菜单和按钮之间的间距 */
}

.menu-container .ant-menu {
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