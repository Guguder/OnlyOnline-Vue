<template>
  <div class="w-screen h-screen overflow-hidden flex flex-col">
    <TopBar :title="problem.title" @back="goBack" />
    <div class="flex-1 overflow-hidden bg-gray-100 p-4 min-h-0">
      <a-spin :spinning="loading" class="h-full shadow-lg rounded-lg">
        <split-pane
          direction="horizontal"
          :default-ratio="40"
          :min-size="36"
          :current-ratio="splitRatio"
          @update:ratio="handleRatioChange"
          class="h-full"
        >
          <template #first>
            <div
              class="h-[calc(100vh-theme(space.20))] w-full bg-white rounded-lg shadow-sm overflow-hidden flex flex-col relative"
            >
              <!-- 展开按钮 -->
              <menu-unfold-outlined
                v-if="isCollapsed"
                class="absolute right-2 top-2 text-gray-400 cursor-pointer hover:text-gray-600 z-10"
                @click="expandPanel"
              />

              <div
                class="transition-all duration-300 h-full"
                :class="[isCollapsed ? 'opacity-0' : 'opacity-100']"
              >
                <!-- 标签按钮组 -->
                <div
                  :class="[
                    'border-b border-gray-100 transition-all duration-300',
                    isCollapsed
                      ? 'invisible'
                      : 'flex items-center p-1 justify-between',
                  ]"
                >
                  <div class="flex items-center">
                    <a-button
                      v-for="tab in tabs"
                      :key="tab.key"
                      type="text"
                      :class="[
                        'flex items-center gap-1 hover:border-transparent transition-all duration-300',
                        isMinWidth
                          ? '!px-0 justify-center'
                          : '!px-3 !h-8 !py-2',
                        activeTab === tab.key
                          ? 'text-gray-900 font-medium'
                          : 'text-gray-400',
                      ]"
                      @click="activeTab = tab.key"
                    >
                      <component :is="tab.icon" />
                      <span v-if="!isMinWidth">{{ tab.label }}</span>
                    </a-button>
                  </div>
                  <!-- 收缩按钮 -->
                  <a-button
                    v-if="!isMinWidth"
                    type="text"
                    class="!px-2 text-gray-400 hover:text-gray-600"
                    @click="collapsePanel"
                  >
                    <menu-fold-outlined />
                  </a-button>
                </div>

                <!-- 内容区域 -->
                <div
                  class="flex-1 overflow-auto"
                  :class="{ invisible: isCollapsed }"
                >
                  <div v-if="activeTab === 'description'" class="p-4">
                    题目描述内容
                  </div>
                  <div v-else-if="activeTab === 'solution'" class="p-4">
                    题解内容
                  </div>
                  <div v-else-if="activeTab === 'history'" class="p-4">
                    答题记录内容
                  </div>
                </div>
              </div>

              <!-- 折叠时的垂直菜单 -->
              <div
                v-if="isCollapsed"
                class="absolute inset-0 flex flex-col items-center pt-12 gap-4"
              >
                <a-button
                  v-for="tab in tabs"
                  :key="tab.key"
                  type="text"
                  :class="[
                    'flex items-center justify-center !px-2',
                    activeTab === tab.key ? 'text-gray-900' : 'text-gray-400',
                  ]"
                  @click="activeTab = tab.key"
                >
                  <component :is="tab.icon" />
                </a-button>
              </div>
            </div>
          </template>
          <template #second>
            <split-pane
              direction="vertical"
              :default-ratio="70"
              :min-size="36"
              :current-ratio="verticalSplitRatio"
              @update:ratio="handleVerticalRatioChange"
              class="h-[calc(100vh-theme(space.20)-0.5rem)]"
            >
              <template #first>
                <div
                  class="w-full h-full bg-white rounded-lg shadow-sm overflow-hidden flex flex-col relative"
                >
                  <!-- 展开按钮放在右上角 -->
                  <menu-unfold-outlined
                    v-if="isVerticalCollapsed"
                    class="absolute right-2 top-2 text-gray-400 cursor-pointer hover:text-gray-600 z-10"
                    @click="expandVerticalPanel"
                  />

                  <div
                    class="transition-all duration-300 h-full"
                    :class="[isVerticalCollapsed ? 'opacity-0' : 'opacity-100']"
                  >
                    <!-- 标签按钮组 -->
                    <div
                      :class="[
                        'border-b border-gray-100 transition-all duration-300',
                        isVerticalCollapsed
                          ? 'invisible'
                          : 'flex items-center p-1 justify-between',
                      ]"
                    >
                      <div class="flex items-center">
                        <a-button
                          type="text"
                          class="px-3 text-gray-900 font-medium flex items-center gap-2 hover:bg-gray-100"
                        >
                          <code-outlined />
                          <span>代码</span>
                        </a-button>
                      </div>
                      <!-- 收缩按钮 -->
                      <a-button
                        type="text"
                        class="!px-2 text-gray-400 hover:text-gray-600"
                        @click="collapseVerticalPanel"
                      >
                        <menu-fold-outlined />
                      </a-button>
                    </div>

                    <!-- 编辑器内容区域 -->
                    <div
                      class="flex-1 overflow-auto"
                      :class="{ invisible: isVerticalCollapsed }"
                    >
                      编辑器内容
                    </div>
                  </div>

                  <!-- 折叠时的占位内容 -->
                  <div
                    v-if="isVerticalCollapsed"
                    class="absolute inset-0 flex items-center justify-center"
                  >
                    <code-outlined class="text-gray-400" />
                  </div>
                </div>
              </template>
              <template #second>
                <div
                  class="w-full h-full bg-white rounded-lg shadow-sm overflow-hidden flex flex-col relative"
                >
                  <!-- 下半部分展开按钮 -->
                  <menu-unfold-outlined
                    v-if="isBottomCollapsed"
                    class="absolute right-2 top-2 text-gray-400 cursor-pointer hover:text-gray-600 z-10"
                    @click="expandBottomPanel"
                  />

                  <div
                    class="transition-all duration-300 h-full"
                    :class="[isBottomCollapsed ? 'opacity-0' : 'opacity-100']"
                  >
                    <!-- 标签按钮组 -->
                    <div
                      class="border-b border-gray-100 flex items-center p-1 justify-between"
                    >
                      <div class="flex items-center">
                        <a-button
                          v-for="tab in resultTabs"
                          :key="tab.key"
                          type="text"
                          :class="[
                            'px-3 flex items-center gap-2 hover:bg-gray-100',
                            bottomActiveTab === tab.key
                              ? 'text-gray-900 font-medium'
                              : 'text-gray-400',
                          ]"
                          @click="bottomActiveTab = tab.key"
                        >
                          <component :is="tab.icon" />
                          <span>{{ tab.label }}</span>
                        </a-button>
                      </div>
                      <!-- 收缩按钮 -->
                      <a-button
                        type="text"
                        class="!px-2 text-gray-400 hover:text-gray-600"
                        @click="collapseBottomPanel"
                      >
                        <menu-fold-outlined />
                      </a-button>
                    </div>

                    <!-- 内容区域 -->
                    <div
                      class="flex-1 overflow-auto"
                      :class="{ invisible: isBottomCollapsed }"
                    >
                      <div v-if="bottomActiveTab === 'testcase'" class="p-4">
                        测试用例内容
                      </div>
                      <div v-else-if="bottomActiveTab === 'result'" class="p-4">
                        测试结果内容
                      </div>
                    </div>
                  </div>

                  <!-- 折叠时的占位图标 -->
                  <div
                    v-if="isBottomCollapsed"
                    class="absolute inset-0 flex items-center justify-center"
                  >
                    <experiment-outlined class="text-gray-400" />
                  </div>
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
import TopBar from "../../components/TopBar.vue";
import { ref, computed, onBeforeUnmount } from "vue";
import { useRoute, useRouter } from "vue-router";
import {
  LeftOutlined,
  BugOutlined,
  PlayCircleOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  SnippetsOutlined, // 替换 FileTextOutlined
  UserOutlined,
  CaretRightOutlined,
  RetweetOutlined,
  ArrowLeftOutlined,
  PauseOutlined,
  ReadOutlined,
  SolutionOutlined,
  HistoryOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  DatabaseOutlined,
  CodeOutlined,
  ConsoleSqlOutlined,
  ExperimentOutlined,
  CheckSquareOutlined,
} from "@ant-design/icons-vue";
import { Spin, Button, Space, Avatar } from "ant-design-vue"; // 移除 Tabs 相关的导入
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

const activeTab = ref("description"); // 添加选项卡激活状态

// 定义标签页配置
const tabs = [
  { key: "description", label: "题目描述", icon: ReadOutlined },
  { key: "solution", label: "题解", icon: SolutionOutlined },
  { key: "history", label: "答题记录", icon: HistoryOutlined },
];

// 添加宽度检测
const isMinWidth = computed(() => {
  // 这里可以通过DOM或其他方式获取实际宽度
  // 暂时使用一个固定值进行演示
  return (
    document.querySelector(".split-pane > div:first-child")?.offsetWidth <= 80
  );
});

// 面板状态管理
const initialRatio = 40;
const splitRatio = ref(initialRatio);
const isCollapsed = computed(() => {
  return splitRatio.value <= 5; // 当比例小于5%时认为是折叠状态
});

// 处理分割比例变化
const handleRatioChange = (ratio) => {
  splitRatio.value = ratio;
};

// 展开面板
const expandPanel = () => {
  splitRatio.value = initialRatio;
};

// 收缩面板
const collapsePanel = () => {
  // 将宽度设置为最小值36px对应的百分比
  const containerWidth =
    document.querySelector(".split-pane")?.offsetWidth || 1000;
  const minRatio = (36 / containerWidth) * 100;
  splitRatio.value = minRatio;
};

// 垂直分割面板状态管理
const initialVerticalRatio = 70;
const verticalSplitRatio = ref(initialVerticalRatio);
const isVerticalCollapsed = computed(() => {
  return verticalSplitRatio.value <= 10; // 调整折叠阈值
});

// 处理垂直分割比例变化
const handleVerticalRatioChange = (ratio) => {
  verticalSplitRatio.value = ratio;
};

// 展开垂直面板
const expandVerticalPanel = () => {
  verticalSplitRatio.value = initialVerticalRatio;
};

// 收缩垂直面板
const collapseVerticalPanel = () => {
  const containerHeight =
    document.querySelector(".split-pane .split-pane")?.offsetHeight || 1000;
  const minRatio = (40 / containerHeight) * 100;
  verticalSplitRatio.value = minRatio;
};

// 结果区域配置
const resultTabs = [
  { key: "testcase", label: "测试用例", icon: ExperimentOutlined },
  { key: "result", label: "测试结果", icon: CheckSquareOutlined },
];

// 垂直方向的底部面板状态
const initialBottomRatio = 30; // 30%的高度
const bottomSplitRatio = ref(initialBottomRatio);
const isBottomCollapsed = computed(() => {
  return 100 - verticalSplitRatio.value <= 10; // 反向计算，因为是从底部收起
});

// 展开底部面板
const expandBottomPanel = () => {
  verticalSplitRatio.value = 100 - initialBottomRatio;
};

// 收缩底部面板
const collapseBottomPanel = () => {
  const containerHeight =
    document.querySelector(".split-pane .split-pane")?.offsetHeight || 1000;
  const minRatio = (40 / containerHeight) * 100;
  verticalSplitRatio.value = 100 - minRatio; // 反向设置，使底部高度为40px
};

// 组件销毁时清理
onBeforeUnmount(() => {
  if (timerInterval) {
    clearInterval(timerInterval);
  }
});

// 添加底部选项卡状态
const bottomActiveTab = ref("testcase");
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

/* 调整计时器容器宽度 */
.bg-gray-100.transition-all {
  width: auto;
  min-width: 32px;
}

:deep(.ant-btn.bg-gray-100) {
  background-color: rgb(243, 244, 246);
  border-color: rgb(229, 231, 235);
}

:deep(.ant-btn.bg-gray-100:hover) {
  background-color: rgb(229, 231, 235);
}

/* 移除原有的下方蓝色边框样式 */
:deep(.ant-btn.text-blue-500) {
  position: relative;
}

:deep(.ant-btn.text-blue-500:hover) {
  color: rgb(59, 130, 246) !important;
}

/* 更新选中按钮的悬停样式 */
:deep(.ant-btn.text-gray-900:hover) {
  color: rgb(17, 24, 39) !important;
}

/* 更新按钮悬停样式 */
:deep(.ant-btn:hover) {
  border-color: transparent !important;
}

:deep(.ant-btn.text-gray-400:hover) {
  color: rgb(75, 85, 99) !important; /* gray-600 */
  background-color: rgb(243, 244, 246); /* gray-100 */
}

:deep(.ant-btn.text-gray-900:hover) {
  color: rgb(17, 24, 39) !important;
  background-color: rgb(243, 244, 246);
}

/* 折叠动画 */
.opacity-0 {
  transition: opacity 0.2s;
}
</style>
