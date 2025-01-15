<template>
  <div
    class="w-screen min-h-screen flex flex-col items-center gap-[20px] mt-[20px] mb-[40px]"
  >
    <!-- Header Section -->
    <div class="w-[1200px] rounded-2xl px-6 pt-6">
      <div class="w-full">
        <div class="flex items-center gap-4">
          <a-avatar :size="64" :src="avatarUrl" />
          <div>
            <h1 class="text-2xl font-bold">咕</h1>
            <p class="text-gray-500">MgGUCFVB7R</p>
            <p class="text-gray-600">全站排名 100,000</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Content Section -->
    <div class="w-[1200px] flex justify-center gap-[20px] items-start">
      <div class="w-[300px] bg-white rounded-2xl p-6">
        <div class="sticky top-5 w-full space-y-6">
          <!-- 个人信息卡片 -->
          <div class="space-y-4">
            <div class="flex items-center gap-2 text-gray-600">
              <svg
                class="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              <span>全栈开发工程师</span>
            </div>
            <div class="flex items-center gap-2 text-gray-600">
              <svg
                class="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <span>深圳市</span>
            </div>
            <div class="flex items-center gap-2 text-gray-600">
              <svg
                class="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span>已加入 365 天</span>
            </div>
          </div>

          <!-- 操作按钮 -->
          <button
            class="w-full bg-green-50 text-green-600 py-2 rounded-lg hover:bg-green-100 transition-colors"
            @click="switchView('edit')"
          >
            编辑个人资料
          </button>

          <!-- 收藏/点赞信息 -->
          <div class="flex flex-col space-y-4">
            <div
              class="w-full p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
              :class="{ 'bg-gray-100': currentView === 'collections' }"
              @click="switchView('collections')"
            >
              <div class="flex items-center gap-3">
                <svg
                  class="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                  />
                </svg>
                <div class="flex-1">
                  <div class="flex items-center justify-between">
                    <div class="font-bold text-gray-700">我的收藏</div>
                    <div
                      class="px-2 py-0.5 bg-green-50 rounded text-green-600 font-medium text-sm"
                    >
                      128
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              class="w-full p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
              :class="{ 'bg-gray-100': currentView === 'likes' }"
              @click="switchView('likes')"
            >
              <div class="flex items-center gap-3">
                <svg
                  class="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
                <div class="flex-1">
                  <div class="flex items-center justify-between">
                    <div class="font-bold text-gray-700">我的点赞</div>
                    <div
                      class="px-2 py-0.5 bg-green-50 rounded text-green-600 font-medium text-sm"
                    >
                      42
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 求职相关 -->
          <div class="space-y-4">
            <div class="text-gray-600">定制你的理想工作机会</div>
            <div
              class="bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
            >
              填写求职意向
            </div>
            <div
              class="bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
            >
              完善简历信息
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧内容区域 -->
      <div class="w-[880px] flex flex-col gap-4">
        <!-- 默认内容 -->
        <div v-if="currentView === 'default'">
          <div class="grid grid-cols-2 gap-4">
            <!-- 第一个卡片：解题进度 -->
            <div class="bg-white rounded-2xl p-6">
              <div class="flex flex-col gap-6">
                <!-- 进度展示区域 -->
                <div class="flex items-center justify-between">
                  <!-- 仪表盘进度 -->
                  <div class="flex flex-col items-center w-[250px]">
                    <a-tooltip>
                      <template #title>
                        <div class="text-center">
                          已完成 {{ totalSolved }}/{{ totalProblems }} 题
                        </div>
                      </template>
                      <a-progress
                        type="dashboard"
                        :percent="progressPercentage"
                        :stroke-color="{
                          '0%': '#add8e6',
                          '100%': '#8a2be2',
                        }"
                        :gap-degree="75"
                        :gap-position="'bottom'"
                        :size="150"
                      />
                    </a-tooltip>
                  </div>

                  <!-- 右侧难度统计卡片 -->
                  <div class="w-[140px] pl-4">
                    <div class="flex flex-col space-y-3">
                      <!-- 简单题统计 -->
                      <div
                        class="flex items-center justify-between p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <span class="text-sm text-gray-500">简单</span>
                        <span class="text-base font-bold text-green-600">
                          {{ easyProgress.solved }}/{{ easyProgress.total }}
                        </span>
                      </div>

                      <!-- 中等题统计 -->
                      <div
                        class="flex items-center justify-between p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <span class="text-sm text-gray-500">中等</span>
                        <span class="text-base font-bold text-yellow-600">
                          {{ mediumProgress.solved }}/{{ mediumProgress.total }}
                        </span>
                      </div>

                      <!-- 困难题统计 -->
                      <div
                        class="flex items-center justify-between p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <span class="text-sm text-gray-500">困难</span>
                        <span class="text-base font-bold text-red-600">
                          {{ hardProgress.solved }}/{{ hardProgress.total }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 第二个卡片：数据统计 -->
            <div class="bg-white rounded-2xl p-4 flex items-center">
              <!-- 添加flex和垂直居中 -->
              <div class="grid grid-cols-2 gap-3 w-full">
                <div
                  class="flex flex-col items-center p-3 bg-gray-50 rounded-lg transition-colors hover:bg-gray-100"
                >
                  <span class="text-gray-500 text-sm">阅读总数</span>
                  <span class="text-lg font-bold text-gray-700">2,156</span>
                </div>
                <div
                  class="flex flex-col items-center p-3 bg-gray-50 rounded-lg transition-colors hover:bg-gray-100"
                >
                  <span class="text-gray-500 text-sm">获得点赞</span>
                  <span class="text-lg font-bold text-gray-700">328</span>
                </div>
                <div
                  class="flex flex-col items-center p-3 bg-gray-50 rounded-lg transition-colors hover:bg-gray-100"
                >
                  <span class="text-gray-500 text-sm">获得收藏</span>
                  <span class="text-lg font-bold text-gray-700">156</span>
                </div>
                <div
                  class="flex flex-col items-center p-3 bg-gray-50 rounded-lg transition-colors hover:bg-gray-100"
                >
                  <span class="text-gray-500 text-sm">积分</span>
                  <span class="text-lg font-bold text-gray-700">1,280</span>
                </div>
              </div>
            </div>
          </div>

          <!-- 第三行单独区域 -->
          <div class="bg-white rounded-2xl p-6 mt-4">
            <div class="flex flex-col gap-4">
              <div class="flex items-center justify-between">
                <h3 class="text-lg font-medium text-gray-900">
                  本年共计提交 300 次
                </h3>
                <div class="flex items-center gap-3">
                  <a-select
                    v-model:value="selectedYear"
                    class="w-[100px]"
                    :options="yearOptions"
                    @change="handleYearChange"
                  />
                  <a-select
                    v-model:value="recordType"
                    class="w-[80px]"
                    :options="recordTypeOptions"
                    @change="handleRecordTypeChange"
                  />
                </div>
              </div>
              <ContributionPlot
                class="w-full"
                :completion-data="completionData"
                :cell-size="10"
                :year="selectedYear"
                :record-type="recordType"
              />
            </div>
          </div>
          <!-- 第四行单独区域 6 -->
          <div class="bg-white rounded-2xl p-6 mt-4">
            <div class="flex flex-col gap-4">
              <!-- 按钮组 -->
              <div class="flex gap-3">
                <button
                  v-for="tab in tabs"
                  :key="tab.key"
                  class="px-4 py-2 rounded-md transition-all duration-200 font-medium"
                  :class="{
                    'bg-blue-500 text-white shadow-sm hover:bg-blue-600':
                      currentTab === tab.key,
                    'bg-gray-100 text-gray-600 hover:bg-gray-200':
                      currentTab !== tab.key,
                  }"
                  @click="currentTab = tab.key"
                >
                  {{ tab.label }}
                </button>
              </div>

              <!-- 内容区域 -->
              <div class="min-h-[200px] pt-4">
                <!-- 做题记录 -->
                <div v-if="currentTab === 'submissions'" class="space-y-4">
                  <div
                    v-for="record in submissionRecords"
                    :key="record.id"
                    class="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <div class="flex items-center gap-4">
                      <div
                        :class="
                          record.status === 'accepted'
                            ? 'text-blue-500'
                            : 'text-red-500'
                        "
                      >
                        {{ record.status === "accepted" ? "通过" : "未通过" }}
                      </div>
                      <div class="text-gray-700">{{ record.problemTitle }}</div>
                    </div>
                    <div class="text-gray-500">{{ record.submitTime }}</div>
                  </div>
                </div>

                <!-- 题解 -->
                <div v-if="currentTab === 'solutions'" class="space-y-4">
                  <div
                    v-for="solution in solutionList"
                    :key="solution.id"
                    class="p-4 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <div class="flex justify-between items-center">
                      <h3 class="font-medium text-gray-900">
                        {{ solution.title }}
                      </h3>
                      <span class="text-gray-500 text-sm">{{
                        solution.createTime
                      }}</span>
                    </div>
                    <p class="text-gray-600 mt-2">{{ solution.description }}</p>
                  </div>
                </div>

                <!-- 讨论 -->
                <div v-if="currentTab === 'discussions'" class="space-y-4">
                  <div
                    v-for="discussion in discussionList"
                    :key="discussion.id"
                    class="p-4 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <div class="flex justify-between items-center">
                      <h3 class="font-medium text-gray-900">
                        {{ discussion.title }}
                      </h3>
                      <span class="text-gray-500 text-sm">{{
                        discussion.createTime
                      }}</span>
                    </div>
                    <p class="text-gray-600 mt-2">{{ discussion.content }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 收藏/点赞内容 -->
        <UserInteractions
          v-else-if="['likes', 'collections'].includes(currentView)"
          :type="currentView"
          class="bg-white rounded-2xl p-6"
          @close="currentView = 'default'"
        />

        <!-- 编辑资料 -->
        <EditProfile
          v-else-if="currentView === 'edit'"
          class="bg-white rounded-2xl p-6"
          @close="currentView = 'default'"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import * as echarts from "echarts";
import UserInteractions from "../components/UserInteractions.vue";
import EditProfile from "../components/EditUserInfo.vue";
import ContributionPlot from "../components/ContributionPlot.vue";

// 解题进度数据
const easyProgress = ref({
  solved: 30,
  total: 100,
  percentage: computed(() => Math.round((30 / 100) * 100)),
});

const mediumProgress = ref({
  solved: 20,
  total: 80,
  percentage: computed(() => Math.round((20 / 80) * 100)),
});

const hardProgress = ref({
  solved: 10,
  total: 40,
  percentage: computed(() => Math.round((10 / 40) * 100)),
});

// 计算总进度
const totalProgress = computed(() => {
  const totalSolved =
    easyProgress.value.solved +
    mediumProgress.value.solved +
    hardProgress.value.solved;
  const total =
    easyProgress.value.total +
    mediumProgress.value.total +
    hardProgress.value.total;
  return Math.round((totalSolved / total) * 100);
});

const leftProgress = ref(0.6); // 60%
const middleProgress = ref(0.4); // 40%
const rightProgress = ref(0.2); // 20%

const leftSolved = ref(30);
const leftTotal = ref(50);
const middleSolved = ref(20);
const middleTotal = ref(50);
const rightSolved = ref(10);
const rightTotal = ref(50);

const solved = computed(
  () => leftSolved.value + middleSolved.value + rightSolved.value
);
const total = computed(
  () => leftTotal.value + middleTotal.value + rightTotal.value
);

// 根据进度返回颜色
const getColorByProgress = (progress) => {
  if (progress >= 0.65) return "#52c41a"; // 绿色
  if (progress >= 0.33) return "#faad14"; // 黄色
  return "#ff4d4f"; // 红色
};

// 修改计算弧长的方法
const getArcLength = (progress, maxLength) =>
  `${progress * maxLength} ${maxLength}`;

const currentView = ref("default"); // 'default', 'likes', 'collections', 'edit'

const switchView = (view) => {
  currentView.value = currentView.value === view ? "default" : view;
};

const avatarUrl = ref(
  "https://srv.carbonads.net/static/30242/4f7f59796c5dda8f5dfc63a40583dfde7cebb050"
);

// 添加贡献数据
const completionData = ref([
  // 示例数据
  { Date: "2024-01-01", isDo: "true" },
  { Date: "2024-01-02", isDo: "true" },
  // ...more data
]);

// 年份选择相关
const currentYear = new Date().getFullYear();
const selectedYear = ref(currentYear);
const yearOptions = Array.from({ length: 3 }, (_, i) => ({
  value: currentYear - i,
  label: `${currentYear - i}年`,
}));

const handleYearChange = (year) => {
  selectedYear.value = year;
  // 这里可以触发数据重新获取
  // fetchContributionData(year);
};

// 记录类型选择相关
const recordType = ref("problems");
const recordTypeOptions = [
  { value: "problems", label: "提交" },
  { value: "logins", label: "登录" },
];

const handleRecordTypeChange = (type) => {
  recordType.value = type;
  // 这里可以触发对应类型的数据重新获取
  // fetchContributionData(selectedYear.value, type);
};

const currentTab = ref("submissions");
const tabs = [
  { key: "submissions", label: "做题记录" },
  { key: "solutions", label: "题解" },
  { key: "discussions", label: "讨论" },
];

// 模拟数据
const submissionRecords = ref([
  {
    id: 1,
    status: "accepted",
    problemTitle: "两数之和",
    submitTime: "2024-01-15 14:30",
  },
  {
    id: 2,
    status: "wrong",
    problemTitle: "三数之和",
    submitTime: "2024-01-14 16:20",
  },
]);

const solutionList = ref([
  {
    id: 1,
    title: "两数之和的最优解法",
    createTime: "2024-01-10",
    description: "使用哈希表可以将时间复杂度降至O(n)...",
  },
]);

const discussionList = ref([
  {
    id: 1,
    title: "动态规划问题讨论",
    createTime: "2024-01-08",
    content: "关于如何理解状态转移方程...",
  },
]);

// 在 script setup 中添加或修改以下计算属性
const totalSolved = computed(
  () =>
    easyProgress.value.solved +
    mediumProgress.value.solved +
    hardProgress.value.solved
);

const totalProblems = computed(
  () =>
    easyProgress.value.total +
    mediumProgress.value.total +
    hardProgress.value.total
);

const progressPercentage = computed(() =>
  Math.round((totalSolved.value / totalProblems.value) * 100)
);
</script>

<style scoped>
:deep(.ant-tooltip) {
  font-size: 12px;
}

:deep(.ant-select) {
  width: unset !important;
}
</style>
