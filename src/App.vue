<template>
  <div v-if="isLoading" class="loading-overlay">
    <div class="loading-content">
      <a-spin size="large" />
      <span class="mt-4 text-gray-600">加载中...</span>
    </div>
  </div>

  <router-view v-show="!isLoading" />
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useAuthStore } from "./stores/auth";

const isLoading = ref(true);
const authStore = useAuthStore();

onMounted(async () => {
  await authStore.initialize(); // 在应用启动时初始化用户状态
  setTimeout(() => {
    isLoading.value = false;
  }, 300);
});
</script>

<style>
.app-container {
  min-height: 100vh;
  background-color: #f5f5f7;
}

.no-padding {
  padding: 0 !important;
  margin: 0 !important;
}

/* 添加过渡动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.content-container {
  display: flex;
  justify-content: center;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
}

.content-container.p-0 {
  max-width: none;
  padding: 0;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html,
body {
  height: 100%;
  width: 100%;
  margin: 0;
  padding: 0;
}

/* 添加 v-cloak 样式 */
[v-cloak] {
  display: none;
}

.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.loading-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
