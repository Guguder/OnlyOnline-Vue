<!-- TopBar.vue -->
<template>
  <div class="w-full px-4 pt-2 flex items-center">
    <!-- 左侧区域 -->
    <div class="flex items-center gap-4 flex-1">
      <left-outlined
        class="text-gray-500 cursor-pointer hover:text-gray-700 w-4"
        @click="$emit('back')"
      />
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
      <!-- 计时器按钮组容器 -->
      <Timer />
      <a-button type="text" class="flex items-center justify-center !px-2">
        <template #icon><snippets-outlined /></template>
      </a-button>
      <a-avatar
        :size="32"
        src="https://api.dicebear.com/7.x/miniavs/svg?seed=1"
      />
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
} from "@ant-design/icons-vue";
import { Button, Avatar } from "ant-design-vue";
import Timer from "./Timer.vue";

defineProps({
  title: {
    type: String,
    required: true,
  },
});

defineEmits(["back"]);
</script>
