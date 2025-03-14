<template>
  <a-layout class="layout-container">
    <a-layout-sider
      v-model:collapsed="collapsed"
      :trigger="null"
      collapsible
      class="sidebar"
    >
      <div class="logo">
        <span v-if="!collapsed">后台管理系统</span>
        <span v-else>后台</span>
      </div>
      <a-menu
        v-model:selectedKeys="selectedKeys"
        v-model:openKeys="openKeys"
        mode="inline"
        @select="handleMenuSelect"
        class="border-r-0"
      >
        <a-sub-menu key="system">
          <template #icon><SettingOutlined /></template>
          <template #title>系统管理</template>
          <a-menu-item key="/backend/dashboard">
            <template #icon><DashboardOutlined /></template>
            仪表盘
          </a-menu-item>
          <a-menu-item key="/backend/users">
            <template #icon><UserOutlined /></template>
            用户管理
          </a-menu-item>
        </a-sub-menu>

        <a-sub-menu key="problem">
          <template #icon><BookOutlined /></template>
          <template #title>题目管理</template>
          <a-menu-item key="/backend/problems">
            <template #icon><OrderedListOutlined /></template>
            题目列表
          </a-menu-item>
          <a-menu-item key="/backend/problem-categories">
            <template #icon><AppstoreOutlined /></template>
            题目分类
          </a-menu-item>
        </a-sub-menu>

        <a-sub-menu key="forum">
          <template #icon><CommentOutlined /></template>
          <template #title>讨论管理</template>
          <a-menu-item key="/backend/posts">
            <template #icon><FileTextOutlined /></template>
            帖子管理
          </a-menu-item>
          <a-menu-item key="/backend/comments">
            <template #icon><MessageOutlined /></template>
            评论管理
          </a-menu-item>
        </a-sub-menu>

        <a-sub-menu key="common">
          <template #icon><ControlOutlined /></template>
          <template #title>通用管理</template>
          <a-menu-item key="/backend/tags">
            <template #icon><TagsOutlined /></template>
            标签管理
          </a-menu-item>
        </a-sub-menu>
      </a-menu>
    </a-layout-sider>
    <a-layout>
      <a-layout-header class="header">
        <menu-unfold-outlined
          v-if="collapsed"
          class="trigger"
          @click="() => (collapsed = !collapsed)"
        />
        <menu-fold-outlined
          v-else
          class="trigger"
          @click="() => (collapsed = !collapsed)"
        />
        <div class="header-right">
          <a-dropdown :trigger="['click']">
            <a-avatar
              :size="32"
              class="cursor-pointer hover:opacity-80 transition-opacity"
              :src="authStore.userInfo?.avatar || '默认头像URL'"
            />
            <template #overlay>
              <a-menu>
                <a-menu-item key="return" @click="backToHome">
                  <div class="menu-item-content">
                    <HomeOutlined />
                    <span>返回平台</span>
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
        </div>
      </a-layout-header>
      <a-layout-content class="content">
        <div class="content-wrapper h-full">
          <router-view></router-view>
        </div>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script setup>
import { ref, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useAuthStore } from "../stores/auth";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DashboardOutlined,
  UserOutlined,
  SettingOutlined,
  HomeOutlined,
  LogoutOutlined,
  BookOutlined,
  CommentOutlined,
  ControlOutlined,
  OrderedListOutlined,
  AppstoreOutlined,
  FileTextOutlined,
  MessageOutlined,
  TagsOutlined,
} from "@ant-design/icons-vue";

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

// 根据路径获取应该展开的菜单键值
const getOpenKey = (path) => {
  if (path.includes("/backend/dashboard") || path.includes("/backend/users")) {
    return "system";
  } else if (path.includes("/backend/problem")) {
    return "problem";
  } else if (
    path.includes("/backend/posts") ||
    path.includes("/backend/comments")
  ) {
    return "forum";
  } else if (path.includes("/backend/tags")) {
    return "common";
  }
  return "";
};

const collapsed = ref(false);
const selectedKeys = ref([route.path]);
const openKeys = ref([getOpenKey(route.path)]);

const handleLogout = () => {
  authStore.logout();
  router.push("/home");
};

const backToHome = () => {
  router.push("/home");
};

const handleMenuSelect = ({ key }) => {
  router.push(key);
};

// 监听路由变化，更新选中菜单
watch(
  () => route.path,
  (newPath) => {
    selectedKeys.value = [newPath];
    const openKey = getOpenKey(newPath);
    if (openKey && !openKeys.value.includes(openKey)) {
      openKeys.value = [openKey];
    }
  }
);
</script>

<style scoped>
.layout-container {
  height: 100vh;
  background: #f0f2f5;
}

.sidebar {
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
}

.logo {
  height: 64px;
  padding: 16px;
  color: rgba(0, 0, 0, 0.85);
  font-size: 16px;
  text-align: center;
  background: #fff;
  border-bottom: 1px solid #f0f0f0;
  overflow: hidden;
}

.header {
  background: #fff;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  position: relative;
  z-index: 10;
}

.trigger {
  padding: 0 24px;
  font-size: 16px;
  cursor: pointer;
  transition: color 0.3s;
  color: rgba(0, 0, 0, 0.65);
}

.trigger:hover {
  color: #1890ff;
}

.header-right {
  padding-right: 24px;
}

.content {
  margin: 8px;
  padding: 0;
  background: transparent;
  min-height: 280px;
  height: calc(100vh - 80px); /* 减去头部高度和间距 */
  overflow: hidden;
}

.content-wrapper {
  background: #fff;
  border-radius: 2px;
  height: 100%;
  overflow: hidden;
}

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
  margin-right: 0;
  font-size: 16px;
}

:deep(.ant-avatar) {
  cursor: pointer;
  border: 2px solid transparent;
  transition: all 0.3s ease;
}

:deep(.ant-avatar:hover) {
  border-color: #1890ff;
  transform: scale(1.05);
}

:deep(.ant-menu) {
  border-right: none;
  padding: 8px;
}

:deep(.ant-menu-item) {
  height: 40px;
  line-height: 40px;
  margin: 4px 0 !important;
  padding: 0 16px !important;
  border-radius: 4px;
}

:deep(.ant-menu-item:hover) {
  color: #1890ff;
  background: #e6f7ff;
}

:deep(.ant-menu-item-selected) {
  color: #1890ff !important;
  background: #e6f7ff !important;
  font-weight: 500;
}

:deep(.ant-menu-item-selected::after) {
  display: none !important;
}

:deep(.ant-menu-item .anticon) {
  font-size: 16px;
  min-width: 16px;
  color: rgba(0, 0, 0, 0.65);
}

:deep(.ant-menu-item-selected .anticon) {
  color: #1890ff;
}

:deep(.ant-layout-sider-children) {
  display: flex;
  flex-direction: column;
  height: 100%;
}

:deep(.ant-menu-inline) {
  flex: 1;
}

:deep(.ant-layout-content) {
  overflow-y: auto;
  overflow-x: hidden;
}

:deep(.ant-menu-sub .ant-menu-item) {
  padding-left: 48px !important;
}

:deep(.ant-menu-submenu-title) {
  margin: 4px 8px !important;
  border-radius: 4px;
}

:deep(.ant-menu-submenu-title:hover) {
  color: #1890ff !important;
  background: #e6f7ff !important;
}
</style>
