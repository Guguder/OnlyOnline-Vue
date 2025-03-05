<template>
  <div>
    <!-- 返回按钮 - 移到最外层 -->
    <div class="flex justify-between mb-4 mr-12">
      <button
        class="p-1.5 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
        @click="handleBack"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-4 w-4 text-gray-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>
      <button
        class="p-1.5 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-4 w-4 text-gray-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          />
        </svg>
      </button>
    </div>

    <div class="flex items-center justify-between px-12 pt-4 pb-12">
      <!-- 左侧图标区域 - 减小尺寸 -->
      <div class="w-[200px]">
        <div class="relative w-36 h-36">
          <div
            class="absolute inset-0 bg-gradient-to-r from-[#00FFB3] to-[#00BFFF] rounded-2xl transform rotate-45 translate-x-3 translate-y-3"
          ></div>
          <div
            class="relative bg-white rounded-2xl w-full h-full flex items-center justify-center shadow-lg"
          >
            <span
              class="text-5xl font-bold bg-gradient-to-r from-[#00FFB3] to-[#00BFFF] text-transparent bg-clip-text"
              >{{ bankDetail?.iconCode }}</span
            >
          </div>
        </div>
      </div>

      <!-- 右侧内容区域 - 调整间距 -->
      <div class="flex-1 ml-6">
        <!-- 文字内容区域 - 减小字体和间距 -->
        <div>
          <h1 class="text-2xl font-bold mb-3">{{ bankDetail?.name }}</h1>
          <div class="mb-6 text-gray-600 flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
            <span class="text-sm">{{ bankDetail?.description }}</span>
          </div>

          <!-- 开始按钮 - 减小尺寸 -->
          <button
            class="bg-black text-white px-6 py-2 rounded-full hover:bg-gray-800 transition-colors text-base font-medium flex items-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
              />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            开始
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";

// 更新props定义
const props = defineProps({
  bankDetail: {
    type: Object,
    default: () => ({
      name: "题库标题",
      description: "题库描述",
      iconCode: "TOP",
    }),
  },
});

const router = useRouter();

const handleBack = () => {
  router.back();
};
</script>
