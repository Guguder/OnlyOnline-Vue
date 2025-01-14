<template>
  <a-space direction="vertical" :style="containerStyle">
    <a-layout style="width: 100%; min-height: 100vh;">
      <a-layout-header :style="headerStyle">
        <div class="header-container">
          <div class="logo-container" @click="handleLogoClick">
            <img src="/logo.png" alt="logo" />
          </div>
          <div class="nav-menu">
            <a-menu
                style="font-weight: 600;font-size: 16px"
                v-model:selectedKeys="current"
                mode="horizontal"
                :items="items"
                @select="({ key }) => handleSelect(key)"
            />
          </div>
          <div class="login-container">
            <div class="search-wrapper">
              <div class="search-inner" :class="{ 'expanded': isExpanded }">
                <a-button
                    type="text"
                    class="icon-btn search-icon"
                    @click="handleSearchClick"
                >
                  <SearchOutlined />
                </a-button>
                <a-input
                    v-show="isExpanded"
                    v-model:value="searchQuery"
                    placeholder="搜索..."
                    class="search-input"
                    @blur="handleSearchBlur"
                />
              </div>
            </div>
            <a-button type="text" class="icon-btn relative" shape="square" @click="handleNotificationClick">
              <BellOutlined />
              <span v-show="hasNotification" class="notification-dot"></span>
            </a-button>
            <div class="flex items-center fire-container">
              <a-button type="text" class="icon-btn fire-btn" shape="square">
                <FireOutlined />
              </a-button>
              <span class="fire-count cursor-pointer">0</span>
            </div>
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
  InfoCircleOutlined,
  SearchOutlined,
  FireOutlined,
  BellOutlined
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

const isExpanded = ref(false);
const searchQuery = ref('');

const toggleSearch = () => {
  isExpanded.value = !isExpanded.value;
};

const handleSearchBlur = () => {
  // 移除失焦处理逻辑
};

const hasNotification = ref(true);

const handleNotificationClick = () => {
  hasNotification.value = false;
};

// 修改搜索相关的逻辑
const handleSearchClick = () => {
  if (isExpanded.value) {
    // 如果已展开，则执行搜索
    handleSearch();
  } else {
    // 如果未展开，则展开搜索框
    isExpanded.value = true;
  }
};

// 添加搜索处理函数
const handleSearch = () => {
  if (!searchQuery.value.trim()) return;
  // 这里添加你的搜索逻辑
  console.log('搜索:', searchQuery.value);
};

// 添加全局点击事件处理器来关闭搜索框
onMounted(() => {
  document.addEventListener('click', (e) => {
    const target = e.target;
    const searchContainer = document.querySelector('.search-wrapper');
    // 如果点击目标不在搜索容器内，则关闭搜索框
    if (searchContainer && !searchContainer.contains(target)) {
      isExpanded.value = false;
    }
  });
});

</script>

<style >
.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  height: 100%;
  margin: 0 auto;
  gap: 40px;  /* 添加间距 */
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

.nav-menu {
  flex: 1;
}

.nav-menu :deep(.ant-menu) {
  background: transparent;
  border: none;
  line-height: 64px;
  justify-content: flex-start;  /* 菜单项左对齐 */
  padding-left: 0;  /* 确保没有额外的内边距 */
}

.login-container {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 8px;
}

.icon-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;  /* 调小图标尺寸 */
  width: 40px;
  height: 40px;
  padding: 0 !important;
  transition: all 0.3s ease;
  background: transparent !important;
  color: #666;  /* 设置默认颜色为浅灰色 */
}

.icon-btn:hover {
  color: #1890ff;
  background-color: rgba(0, 0, 0, 0.02);  /* 减小hover背景色透明度 */
}

.icon-btn:has(> .anticon-fire):hover {
  color: #ff4d4f !important;  /* 火焰图标hover时显示红色 */
  background-color: rgba(255, 77, 79, 0.1);  /* 添加浅红色背景 */
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

.search-wrapper {
  position: relative;
  height: 40px;
  overflow: hidden;
}

.search-inner {
  position: relative;
  display: flex;
  align-items: center;
  width: 40px;
  background: transparent;  /* 初始状态透明 */
  border-radius: 20px; /* 改为更大的圆角 */
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.search-inner.expanded {
  width: 240px;  /* 从 280px 减小到 240px */
  background: #f5f5f5;  /* 展开时才显示背景色 */
}

.search-icon {
  z-index: 2;
  background: transparent;
}

.search-input {
  position: absolute;
  left: 36px;  /* 缩小左边距 */
  flex: 1;
  border: none;
  background: transparent;
  width: 0;
  padding: 0;
  opacity: 0;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.search-input:focus {
  outline: none;
  box-shadow: none;
}

.search-input :deep(.ant-input) {
  border: none !important;
  box-shadow: none !important;
  padding-left: 2px !important;  /* 调整输入框组件的内部左边距 */
  padding-right: 11px !important;
}

.search-input :deep(.ant-input:focus) {
  border: none !important;
  box-shadow: none !important;
}

.expanded .search-input {
  position: relative;
  left: 0;
  width: 200px;  /* 从 240px 减小到 200px */
  padding: 4px 11px 4px 2px;  /* 缩小展开后的左内边距 */
  opacity: 1;
}

.notification-badge {
  position: absolute;
  top: 4px;
  right: 4px;
  min-width: 16px;
  height: 16px;
  padding: 0 4px;
  font-size: 12px;
  line-height: 16px;
  background: #ff4d4f;
  border-radius: 10px;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
}

.notification-dot {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 8px;
  height: 8px;
  background: #ff4d4f;
  border-radius: 50%;
  display: block;
}

.fire-container {
  display: flex;
  align-items: center;
  gap: 0;  /* 移除间距 */
}

.fire-btn {
  cursor: pointer;
}

.fire-count {
  font-size: 13px;
  color: #666;
  margin-left: -8px;  /* 更大的负边距让数字更靠左 */
  margin-top: 5px;   /* 向下偏移一点 */
  font-weight: 500;
  min-width: 16px;
  position: relative;  /* 添加相对定位以支持更精确的位置控制 */
  cursor: pointer;  /* 添加鼠标手型 */
  user-select: none;  /* 防止文本被选中 */
}

.icon-btn:has(> .anticon-fire):hover + .fire-count {
  color: #ff4d4f;
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