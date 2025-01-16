<template>
  <div class="w-screen h-screen overflow-hidden flex flex-col">
    <!-- 顶部信息栏 -->
    <div class="w-full px-4 pt-2 flex items-center">
      <!-- 左侧区域 -->
      <div class="flex items-center gap-4 flex-1">
        <a-button
          type="text"
          class="flex items-center justify-center !px-2"
          @click="goBack"
        >
          <template #icon><left-outlined /></template>
        </a-button>
        <div class="flex items-center gap-2">
          <span class="text-gray-500">SQL题库</span>
          <span class="text-gray-300">/</span>
          <h1 class="text-base font-medium text-gray-700">
            {{ problem.title }}
          </h1>
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
        <div class="relative">
          <!-- 背景容器 -->
          <div
            class="bg-gray-100 transition-all duration-300 rounded-lg overflow-hidden"
            :class="[showTimerControls ? 'w-[108px]' : 'w-8']"
          >
            <!-- 默认时钟按钮 -->
            <a-button
              v-show="!showTimerControls"
              type="text"
              class="flex items-center justify-center !px-2 hover:bg-gray-200"
              @click="toggleTimer"
            >
              <template #icon><clock-circle-outlined /></template>
            </a-button>

            <!-- 计时器控制按钮组 -->
            <div
              v-show="showTimerControls"
              class="flex items-center justify-between"
            >
              <a-button
                type="text"
                class="hover:bg-gray-200"
                @click="toggleTimer"
              >
                <template #icon><left-outlined /></template>
              </a-button>
              <a-button
                type="text"
                class="hover:bg-gray-200"
                @click="togglePause"
              >
                <template #icon>
                  <pause-outlined v-if="isRunning" />
                  <caret-right-outlined v-else />
                </template>
              </a-button>
              <a-button
                type="text"
                class="hover:bg-gray-200"
                @click="resetTimer"
              >
                <template #icon><redo-outlined /></template>
              </a-button>
            </div>
          </div>
        </div>

        <a-button type="text" class="flex items-center justify-center !px-2">
          <template #icon><file-text-outlined /></template>
        </a-button>
        <a-avatar
          :size="32"
          src="https://api.dicebear.com/7.x/miniavs/svg?seed=1"
        />
      </div>
    </div>

    <!-- 主体内容区 -->
    <div class="flex-1 overflow-hidden bg-gray-100 p-4 min-h-0">
      <a-spin :spinning="loading" class="h-full shadow-lg rounded-2xl">
        <split-pane direction="horizontal" :default-ratio="40" class="h-full">
          <template #first>
            <div
              class="h-[calc(100vh-theme(space.24))] w-full bg-white rounded-2xl p-4 shadow-sm overflow-auto"
            >
              <!-- 添加 overflow-auto 使内容可滚动 -->
              <div>asd</div>
            </div>
          </template>
          <template #second>
            <split-pane
              direction="vertical"
              :default-ratio="70"
              class="h-[calc(100vh-theme(space.24)-0.5rem)]"
            >
              <template #first>
                <div
                  class="w-full h-full bg-white rounded-2xl p-4 shadow-sm overflow-auto"
                ></div>
              </template>
              <template #second>
                <div
                  class="w-full h-full bg-white rounded-2xl p-4 shadow-sm overflow-auto"
                >
                  <!-- 下半部分内容 -->
                </div>
              </template>
            </split-pane>
          </template>
        </split-pane>
      </a-spin>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onBeforeUnmount } from "vue";
import { useRoute, useRouter } from "vue-router";
import {
  LeftOutlined,
  BugOutlined,
  PlayCircleOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  FileTextOutlined,
  UserOutlined,
  CaretRightOutlined,
  RedoOutlined,
  ArrowLeftOutlined,
  PauseOutlined,
} from "@ant-design/icons-vue";
import { Spin, Button, Space, Avatar } from "ant-design-vue";
import SplitPane from "../../components/SplitPane.vue";

const loading = ref(false);
const route = useRoute();
const problemId = route.params.id;

// 模拟SQL题目数据
const mockSqlProblem = {
  1: {
    id: 1,
    title: "员工工资最高值",
    difficulty: "简单",
    description: "查找薪水最高的员工。返回他们的姓名和薪水。",
    tables: [
      {
        name: "Employees",
        columns: [
          { name: "id", type: "int", description: "员工ID" },
          { name: "name", type: "varchar(50)", description: "员工姓名" },
          { name: "salary", type: "decimal(10,2)", description: "薪水" },
          { name: "departmentId", type: "int", description: "部门ID" },
        ],
        sampleData: [
          { id: 1, name: "Joe", salary: 70000, departmentId: 1 },
          { id: 2, name: "Jim", salary: 90000, departmentId: 1 },
          { id: 3, name: "Henry", salary: 80000, departmentId: 2 },
        ],
      },
      {
        name: "Departments",
        columns: [
          { name: "id", type: "int", description: "部门ID" },
          { name: "name", type: "varchar(50)", description: "部门名称" },
        ],
        sampleData: [
          { id: 1, name: "IT" },
          { id: 2, name: "Sales" },
        ],
      },
    ],
  },
};

const problem = ref(mockSqlProblem[problemId] || {});
const queryResult = ref(null);

const getDifficultyClass = computed(() => {
  const baseClasses = "px-3 py-1 rounded-full text-sm font-medium";
  switch (problem.value.difficulty) {
    case "简单":
      return `${baseClasses} bg-green-100 text-green-600`;
    case "中等":
      return `${baseClasses} bg-yellow-100 text-yellow-600`;
    case "困难":
      return `${baseClasses} bg-red-100 text-red-600`;
    default:
      return baseClasses;
  }
});

const router = useRouter();
const goBack = () => {
  router.back();
};

// 计时器状态
const showTimerControls = ref(false);
const isRunning = ref(false);
const time = ref(0);
let timerInterval = null;

// 切换计时器控制面板
const toggleTimer = () => {
  showTimerControls.value = !showTimerControls.value;
  if (!showTimerControls.value && isRunning.value) {
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

// 组件销毁时清理
onBeforeUnmount(() => {
  if (timerInterval) {
    clearInterval(timerInterval);
  }
});
</script>

<style scoped>
:deep(.ant-btn) {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

/* 添加自定义悬停样式 */
:deep(.ant-btn:hover) {
  color: rgba(0, 0, 0, 0.88) !important; /* 保持原本的文字颜色 */
  border-color: #d9d9d9 !important; /* 保持原本的边框颜色 */
}

/* 移除其他不需要的样式 */
:deep(.ant-radio-button-wrapper) {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

:deep(.ant-radio-button-wrapper span) {
  display: inline-flex;
  align-items: center;
}

/* 添加过渡效果 */
.transition-all {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.transform {
  transform-origin: center;
}

.scale-100 {
  transform: scale(1);
}
</style>
