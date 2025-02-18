<template>
  <a-layout-header :style="headerStyle">
    <div class="header-container">
      <div class="logo-container" @click="handleLogoClick">
        <img src="/logo.png" alt="logo" />
      </div>
      <div class="nav-menu">
        <a-menu
          style="font-weight: 600; font-size: 16px"
          v-model:selectedKeys="current"
          mode="horizontal"
          :items="items"
          @select="({ key }) => handleSelect(key)"
        />
      </div>
      <div class="login-container">
        <div class="search-wrapper">
          <div class="search-inner" :class="{ expanded: isExpanded }">
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
        <a-button
          type="text"
          class="icon-btn relative"
          shape="square"
          @click="handleNotificationClick"
        >
          <BellOutlined />
          <span v-show="hasNotification" class="notification-dot"></span>
        </a-button>
        <div class="flex items-center fire-container">
          <a-button type="text" class="icon-btn fire-btn" shape="square">
            <FireOutlined />
          </a-button>
          <span class="fire-count cursor-pointer">0</span>
        </div>

        <!-- 用户未登录显示登录按钮，登录后显示头像 -->
        <template v-if="!authStore.isAuthenticated || authStore.loading">
          <a-button @click="showLoginModal">登录</a-button>
        </template>
        <template v-else-if="authStore.userInfo">
          <a-dropdown :trigger="['click']">
            <a-avatar
              :size="32"
              class="cursor-pointer hover:opacity-80 transition-opacity"
              :src="authStore.userInfo?.avatar || '默认头像URL'"
            />
            <template #overlay>
              <a-menu>
                <a-menu-item key="profile" @click="handleProfileClick">
                  <div class="menu-item-content">
                    <UserOutlined />
                    <span>个人中心</span>
                  </div>
                </a-menu-item>
                <a-menu-item
                  v-if="authStore.userInfo?.role === 0"
                  key="backend"
                  @click="goToBackend"
                >
                  <div class="menu-item-content">
                    <SettingOutlined />
                    <span>后台管理</span>
                  </div>
                </a-menu-item>
                <a-menu-divider />
                <a-menu-item key="logout" @click="handleLogout">
                  <div class="menu-item-content">
                    <LogoutOutlined />
                    <span>退出登录</span>
                  </div>
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </template>
      </div>
    </div>
  </a-layout-header>
</template>

<script setup>
import { ref, onMounted, watchEffect } from "vue";
import { useRouter, useRoute } from "vue-router";
import {
  SearchOutlined,
  FireOutlined,
  BellOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
} from "@ant-design/icons-vue";
import { useLoginModal } from "../../stores/useLoginModal";
import { useAuthStore } from "../../stores/auth";

const router = useRouter();
const route = useRoute();
const { showLoginModal } = useLoginModal();
const authStore = useAuthStore();

const current = ref([]);
const isExpanded = ref(false);
const searchQuery = ref("");
const hasNotification = ref(true);

const items = ref([
  { key: "/home", label: "主页" },
  { key: "/topics", label: "题库" },
  { key: "/forum", label: "讨论" },
  { key: "/about", label: "关于" },
]);

const headerStyle = {
  color: "#fff",
  height: 64,
  paddingInline: 50,
  lineHeight: "64px",
  backgroundColor: "#fff",
  padding: "0 20px",
};

// Methods
const syncMenuWithRoute = () => {
  current.value = [route.path];
};

const handleSelect = (key) => {
  router.push(key);
};

const handleLogoClick = () => {
  router.push("/home");
};

const handleSearchClick = () => {
  if (isExpanded.value) {
    handleSearch();
  } else {
    isExpanded.value = true;
  }
};

const handleSearch = () => {
  if (!searchQuery.value.trim()) return;
  console.log("搜索:", searchQuery.value);
};

const handleSearchBlur = () => {
  // 可以添加失焦处理逻辑
};

const handleNotificationClick = () => {
  hasNotification.value = false;
  router.push("/notifications");
};

const handleProfileClick = () => {
  router.push("/personal-center");
};

// 处理退出登录
const handleLogout = () => {
  authStore.logout();
  router.push("/home");
};

const goToBackend = () => {
  router.push("/backend");
};

// 监听路由变化
router.afterEach((to) => {
  current.value = [to.path];
});

onMounted(() => {
  syncMenuWithRoute();

  // 添加全局点击事件处理器来关闭搜索框
  document.addEventListener("click", (e) => {
    const target = e.target;
    const searchContainer = document.querySelector(".search-wrapper");
    if (searchContainer && !searchContainer.contains(target)) {
      isExpanded.value = false;
    }
  });
});

// 在 script setup 中添加 watchEffect 以监听登录状态
watchEffect(() => {
  // 当 authStore.error 存在时，确保显示登录按钮
  if (authStore.error) {
    console.error("Authentication error:", authStore.error);
    // 可以选择清理错误状态
    // authStore.clearError();
  }
});
</script>

<style scoped>
.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  height: 100%;
  margin: 0 auto;
  gap: 40px;
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
  justify-content: flex-start;
  padding-left: 0;
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
  font-size: 18px;
  width: 40px;
  height: 40px;
  padding: 0 !important;
  transition: all 0.3s ease;
  background: transparent !important;
  color: #666;
}

.icon-btn:hover {
  color: #1890ff;
  background-color: rgba(0, 0, 0, 0.02);
}

.icon-btn:has(> .anticon-fire):hover {
  color: #ff4d4f !important;
  background-color: rgba(255, 77, 79, 0.1);
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
  background: transparent;
  border-radius: 20px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.search-inner.expanded {
  width: 240px;
  background: #f5f5f5;
}

.search-icon {
  z-index: 2;
  background: transparent;
}

.search-input {
  position: absolute;
  left: 36px;
  flex: 1;
  border: none;
  background: transparent;
  width: 0;
  padding: 0;
  opacity: 0;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.expanded .search-input {
  position: relative;
  left: 0;
  width: 200px;
  padding: 4px 11px 4px 2px;
  opacity: 1;
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
  gap: 0;
}

.fire-count {
  font-size: 13px;
  color: #666;
  margin-left: -8px;
  margin-top: 5px;
  font-weight: 500;
  min-width: 16px;
  position: relative;
  cursor: pointer;
  user-select: none;
}

.icon-btn:has(> .anticon-fire):hover + .fire-count {
  color: #ff4d4f;
}

:deep(.ant-menu-item) {
  font-weight: 600;
  font-size: 16px;
  color: #333 !important;
}

:deep(.ant-menu-item-selected) {
  background-color: transparent !important;
}

:deep(.ant-menu-item:hover) {
  color: #1890ff !important;
}

:deep(.ant-input) {
  border: none !important;
  box-shadow: none !important;
  padding-left: 2px !important;
  padding-right: 11px !important;
}

:deep(.ant-input:focus) {
  border: none !important;
  box-shadow: none !important;
}

/* 添加头像样式 */
:deep(.ant-avatar) {
  cursor: pointer;
  border: 2px solid transparent;
  transition: all 0.3s ease;
}

:deep(.ant-avatar:hover) {
  border-color: #1890ff;
  transform: scale(1.05);
}

/* 下拉菜单样式 */
:deep(.ant-dropdown-menu) {
  padding: 4px;
  border-radius: 8px;
}

:deep(.ant-dropdown-menu-item) {
  padding: 8px 16px;
  border-radius: 4px;
}

:deep(.ant-dropdown-menu-item .anticon) {
  margin-right: 8px;
}

/* 添加新的样式 */
.menu-item-content {
  display: flex;
  align-items: center;
  gap: 8px;
}

:deep(.ant-dropdown-menu-item) {
  padding: 8px 16px;
  border-radius: 4px;
}

:deep(.ant-dropdown-menu-item .anticon) {
  margin-right: 0; /* 移除图标的默认右边距 */
  font-size: 16px; /* 统一图标大小 */
}
</style>
