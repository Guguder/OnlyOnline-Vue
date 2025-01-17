<template>
  <div class="relative">
    <div
      class="bg-gray-100 transition-all duration-300 rounded-lg overflow-hidden"
      :class="[showControls ? 'w-[160px]' : 'w-8']"
    >
      <a-button
        v-show="!showControls"
        type="text"
        class="flex items-center justify-center !px-2 hover:bg-gray-200"
        @click="toggleTimer"
      >
        <template #icon><clock-circle-outlined /></template>
      </a-button>

      <div v-show="showControls" class="flex items-center">
        <a-button
          type="text"
          class="!w-8 !px-1 hover:bg-gray-200 !rounded-r-none bg-gray-100"
          @click="toggleTimer"
        >
          <template #icon><left-outlined /></template>
        </a-button>
        <div class="flex items-center">
          <a-button
            type="text"
            class="!px-2 hover:bg-gray-200 !rounded-none bg-gray-100"
            @click="togglePause"
          >
            <template #icon>
              <pause-outlined v-if="isRunning" />
              <caret-right-outlined v-else />
            </template>
            <span class="ml-1 font-mono text-sm">{{ formattedTime }}</span>
          </a-button>
        </div>
        <a-button
          type="text"
          class="!px-2 hover:bg-gray-200 !rounded-l-none bg-gray-100"
          @click="resetTimer"
        >
          <template #icon><retweet-outlined /></template>
        </a-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onBeforeUnmount } from "vue";
import {
  ClockCircleOutlined,
  LeftOutlined,
  PauseOutlined,
  CaretRightOutlined,
  RetweetOutlined,
} from "@ant-design/icons-vue";
import { Button } from "ant-design-vue";

// 计时器状态
const showControls = ref(false);
const isRunning = ref(false);
const time = ref(0);
let timerInterval = null;

// 切换计时器控制面板
const toggleTimer = () => {
  showControls.value = !showControls.value;
  if (!showControls.value && isRunning.value) {
    stopTimer();
  }
};

// 开始/暂停计时
const togglePause = () => {
  if (isRunning.value) {
    stopTimer();
  } else {
    startTimer();
  }
};

// 开始计时
const startTimer = () => {
  isRunning.value = true;
  timerInterval = setInterval(() => {
    time.value++;
  }, 1000);
};

// 停止计时
const stopTimer = () => {
  isRunning.value = false;
  if (timerInterval) {
    clearInterval(timerInterval);
  }
};

// 重置计时器
const resetTimer = () => {
  stopTimer();
  time.value = 0;
};

// 格式化时间
const formattedTime = computed(() => {
  const hours = Math.floor(time.value / 3600);
  const minutes = Math.floor((time.value % 3600) / 60);
  const seconds = time.value % 60;

  const pad = (num) => num.toString().padStart(2, "0");

  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
});

// 组件销毁时清理
onBeforeUnmount(() => {
  if (timerInterval) {
    clearInterval(timerInterval);
  }
});
</script>
