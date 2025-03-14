<!-- TopBar.vue -->
<template>
  <div class="w-full px-4 py-2 flex items-center">
    <!-- 左侧区域 -->
    <div class="flex items-center gap-4 flex-1">
      <a-button
        type="text"
        class="flex items-center justify-center !px-2"
        @click="$emit('back')"
      >
        <template #icon
          ><left-outlined
            class="text-gray-500 cursor-pointer hover:text-gray-700 w-4"
        /></template>
      </a-button>
      <div class="flex items-center gap-2">
        <span class="text-gray-500">SQL题库</span>
        <span class="text-gray-300">/</span>
        <h1 class="text-base font-medium text-gray-700">{{ title }}</h1>
      </div>
    </div>

    <!-- 中间按钮组 -->
    <div class="flex-1 flex justify-center">
      <div class="inline-flex">
        <a-button
          class="!rounded-r-none flex items-center bg-gray-100 border-gray-300 hover:bg-gray-200"
        >
          <bug-outlined />
          <span class="ml-1">调试</span>
        </a-button>
        <a-button
          class="!rounded-none flex items-center border-l-0 bg-gray-100 border-gray-300 hover:bg-gray-200"
        >
          <caret-right-outlined />
          <span class="ml-1">运行</span>
        </a-button>
        <a-button
          class="!rounded-l-none flex items-center border-l-0 bg-gray-100 border-gray-300 hover:bg-gray-200"
        >
          <check-circle-outlined />
          <span class="ml-1">提交</span>
        </a-button>
      </div>
    </div>

    <!-- 右侧工具栏 -->
    <div class="flex-1 flex justify-end items-center gap-2">
      <Timer />
      <a-button type="text" class="flex items-center justify-center !px-2">
        <template #icon><snippets-outlined /></template>
      </a-button>

      <!-- 复用 HeaderNavbar 的头像模块 -->
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
</template>

<script setup>
import {
  LeftOutlined,
  BugOutlined,
  CaretRightOutlined,
  CheckCircleOutlined,
  SnippetsOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
} from "@ant-design/icons-vue";
import { Button, Avatar, Dropdown, Menu } from "ant-design-vue";
import Timer from "./Timer.vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth";
import { useLoginModal } from "../stores/useLoginModal";

const router = useRouter();
const authStore = useAuthStore();
const { showLoginModal } = useLoginModal();

defineProps({
  title: {
    type: String,
    required: true,
  },
});

defineEmits(["back"]);

const handleProfileClick = () => {
  router.push("/personal-center");
};

const handleLogout = () => {
  authStore.logout();
  router.push("/home");
};

const goToBackend = () => {
  router.push("/backend");
};
</script>

<style scoped>
/* 复用 HeaderNavbar 的头像样式 */
:deep(.ant-avatar) {
  cursor: pointer;
  border: 2px solid transparent;
  transition: all 0.3s ease;
}

:deep(.ant-avatar:hover) {
  border-color: #1890ff;
  transform: scale(1.05);
}

.menu-item-content {
  display: flex;
  align-items: center;
  gap: 8px;
}

:deep(.ant-dropdown-menu) {
  padding: 4px;
  border-radius: 8px;
}

:deep(.ant-dropdown-menu-item) {
  padding: 8px 16px;
  border-radius: 4px;
}
</style>
