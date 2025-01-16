<template>
  <!-- 添加加载遮罩 -->
  <div v-if="isLoading" class="loading-overlay">
    <div class="loading-content">
      <n-spin size="large" />
      <span class="mt-4 text-gray-600">加载中...</span>
    </div>
  </div>

  <!-- 主要内容 -->
  <a-space v-show="!isLoading" direction="vertical" :style="containerStyle">
    <a-layout style="width: 100%; min-height: 100vh">
      <HeaderNavbar v-if="!hideNavigation" />

      <a-layout-content :style="contentStyle">
        <div class="content-container" :class="{ 'p-0': hideNavigation }">
          <router-view />
        </div>
      </a-layout-content>

      <a-layout-footer v-if="!hideNavigation">
        <Footer />
      </a-layout-footer>
    </a-layout>
    <login-modal />
  </a-space>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import { NSpin } from "naive-ui";
import Footer from "./components/Footer.vue";
import LoginModal from "./components/auth/LoginModal.vue";
import HeaderNavbar from "./components/layout/HeaderNavbar.vue";

const route = useRoute();
const isLoading = ref(true);

// 计算属性来检查是否需要隐藏导航
const hideNavigation = computed(() => route.meta.hideNavAndFooter);

onMounted(() => {
  // 添加一个短暂的延迟来确保路由元信息已经准备好
  setTimeout(() => {
    isLoading.value = false;
  }, 300);
});

const containerStyle = {
  width: "100%",
  display: "block",
  margin: 0,
  padding: 0,
};

const contentStyle = {
  backgroundColor: "#F5F5F7",
};
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
