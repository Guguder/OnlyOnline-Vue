<template>
  <div
    class="w-screen min-h-screen flex justify-center gap-[20px] mt-[20px] mb-[40px]"
  >
    <!-- 左侧内容区域 -->
    <div class="w-[840px]">
      <!-- 问题卡片容器 -->
      <div class="w-full bg-white rounded-2xl p-5">
        <!-- 学习计划区域 -->
        <h2 class="text-2xl font-bold text-gray-700 mb-6 text-left">
          学习计划
        </h2>
        <div class="grid grid-cols-3 gap-4 mb-8">
          <QuestionBank
            v-for="(card, index) in cardDataList"
            :key="index"
            :cardData="card"
            class="w-full"
          />
        </div>
        <!-- 分隔线 -->
        <div class="my-6 h-[1px] bg-[#E5E5E5]"></div>

        <!-- 顶部导航 -->
        <div class="flex flex-wrap gap-2">
          <button
            v-for="nav in navItems"
            :key="nav.id"
            :class="[
              'px-5 py-2 rounded-full text-sm font-medium transition-colors',
              currentNav === nav.id
                ? 'bg-gray-900 text-white'
                : 'bg-[#F2F3F4] hover:bg-gray-100 text-gray-900',
            ]"
            @click="handleNavClick(nav.id)"
          >
            <div class="flex items-center">
              <span v-if="nav.id === 'all'" class="w-4 h-4 mr-2">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M9 4H5a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1Z"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M9 14H5a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1Z"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M19 14h-4a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1Z"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M19 4h-4a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1Z"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </span>
              <span v-else :class="nav.iconClass" class="mr-2">{{
                nav.icon
              }}</span>
              {{ nav.text }}
            </div>
          </button>
        </div>
        <!-- 子导航 -->
        <div class="flex flex-wrap items-center mt-4 gap-2">
          <div class="flex-none">
            <TopicListButton
              text="题单"
              :options="questionSetOptions"
              :isOpen="currentOpenDropdown === 'questionSet'"
              @toggle="handleDropdownToggle('questionSet')"
              @select="handleQuestionSetSelect"
            />
          </div>
          <div class="flex-none">
            <TopicListButton
              text="难度"
              :options="difficultyOptions"
              :isOpen="currentOpenDropdown === 'difficulty'"
              v-model="selectedDifficulty"
              @toggle="handleDropdownToggle('difficulty')"
              @select="handleDifficultySelect"
            />
          </div>
          <div class="flex-none">
            <TopicListButton
              text="状态"
              :options="statusOptions"
              :isOpen="currentOpenDropdown === 'status'"
              @toggle="handleDropdownToggle('status')"
              @select="handleStatusSelect"
            />
          </div>
          <div class="flex-none">
            <TopicListButton
              text="标签"
              :options="tagOptions"
              :isOpen="currentOpenDropdown === 'tag'"
              @toggle="handleDropdownToggle('tag')"
              @select="handleTagSelect"
            />
          </div>
          <div class="flex-1 min-w-[200px]">
            <div class="relative">
              <Search
                class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4"
              />
              <input
                type="text"
                placeholder="搜索题目、编号或内容"
                class="w-full pl-10 pr-4 py-2 bg-[#F2F3F4] rounded-lg text-sm"
              />
            </div>
          </div>
          <button
            class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm flex items-center transition-colors"
          >
            <Shuffle class="h-4 w-4 mr-1" />
            随机一题
          </button>
        </div>
        <!-- 将原来的题目列表替换为新组件 -->
        <div class="mt-6">
          <!-- 添加这个包装 div 来增加间距 -->
          <ProblemList :problems="problems" />
        </div>
      </div>
    </div>

    <!-- 右侧区域 - 使用新的排行榜组件 -->
    <div class="w-[340px]">
      <div class="sticky top-5 w-full">
        <RankingList :rankings="rankingList" />
      </div>
    </div>
  </div>
</template>

<script setup>
import TopicListButton from "../../../components/topics/TopicListButton.vue";
import QuestionBank from "../../../components/topics/TopicsBank.vue";
import RankingList from "../../../components/forum/RankingList.vue";
import ProblemList from "../../../components/topics/TopicList.vue";
import { Search, Shuffle, CheckCircle2, Circle, Lock } from "lucide-vue-next";
import { ref, onMounted } from "vue";
import { getBankList } from '../../../api/bank.js';

const problems = ref([
  {
    id: 1,
    status: "none",
    title: "175. 组合两个表",
    solutions: "1523",
    passRate: "92.5%",
    difficulty: "简单",
    type: "sql", // 添加类型标识
  },
  {
    id: 2,
    status: "none",
    title: "176. 第二高的薪水",
    solutions: "2634",
    passRate: "85.3%",
    difficulty: "中等",
    type: "sql",
  },
  {
    id: 3,
    status: "none",
    title: "177. 第N高的薪水",
    solutions: "1835",
    passRate: "74.7%",
    difficulty: "中等",
    type: "sql",
  },
  {
    id: 4,
    status: "none",
    title: "178. 分数排名",
    solutions: "1326",
    passRate: "60.5%",
    difficulty: "中等",
    type: "sql",
  },
  {
    id: 5,
    status: "none",
    title: "180. 连续出现的数字",
    solutions: "958",
    passRate: "55.9%",
    difficulty: "困难",
    type: "sql",
  },
]);
// 修改 cardDataList 的定义为响应式引用
const cardDataList = ref([]);

// JSON 数据
// const cardDataList = [
//   {
//     icon: "TOP",
//     title: "面试经典 150 题",
//     description: "123",
//   },
//   {
//     icon: "NEW",
//     title: "高频算法精选",
//     description: "收录近几年面试的高频算法问题算法问题算法问题算法问题算法问题",
//   },
//   {
//     icon: "HOT",
//     title: "热门框架深度剖析",
//     description:
//       "从源码角度理解热门框架，提升核心竞争力心竞争力心竞争力心竞争力心竞争力",
//   },
//   {
//     icon: "JS",
//     title: "JavaScript 面试指南",
//     description:
//       "从基础到进阶，深入探讨 JavaScript 面试问题面试问题面试问题面试问题面试问题",
//   },
//   {
//     icon: "DB",
//     title: "数据库面试解析",
//     description: "系统性学习数据库基础与高级操作",
//   },
// ];

// 排行榜数据
const rankingList = [
  {
    id: 1,
    name: "张三",
    avatar:
      "https://pic.leetcode.cn/1699000361-IIuoOH-%E9%9B%B6%E8%B5%B7%E6%AD%A5%E5%AD%A6%E7%AE%97%E6%B3%95.png",
    solved: 158,
  },
  {
    id: 2,
    name: "李四",
    avatar:
      "https://pic.leetcode.cn/1699000361-IIuoOH-%E9%9B%B6%E8%B5%B7%E6%AD%A5%E5%AD%A6%E7%AE%97%E6%B3%95.png",
    solved: 145,
  },
  {
    id: 3,
    name: "王五",
    avatar:
      "https://pic.leetcode.cn/1699000361-IIuoOH-%E9%9B%B6%E8%B5%B7%E6%AD%A5%E5%AD%A6%E7%AE%97%E6%B3%95.png",
    solved: 142,
  },
  {
    id: 4,
    name: "赵六",
    avatar:
      "https://pic.leetcode.cn/1699000361-IIuoOH-%E9%9B%B6%E8%B5%B7%E6%AD%A5%E5%AD%A6%E7%AE%97%E6%B3%95.png",
    solved: 138,
  },
  {
    id: 5,
    name: "钱七",
    avatar:
      "https://pic.leetcode.cn/1699000361-IIuoOH-%E9%9B%B6%E8%B5%B7%E6%AD%A5%E5%AD%A6%E7%AE%97%E6%B3%95.png",
    solved: 125,
  },
];

// 当前选中的导航项
const currentNav = ref("all");

// 导航数据
const navItems = [
  { id: "all", text: "全部题目" },
  { id: "algorithm", text: "算法", icon: "⚡", iconClass: "text-orange-500" },
  { id: "database", text: "数据库", icon: "📊", iconClass: "text-blue-500" },
  { id: "shell", text: "Shell", icon: "$", iconClass: "text-green-500" },
  { id: "concurrent", text: "多线程", icon: "⚙", iconClass: "text-purple-500" },
  {
    id: "javascript",
    text: "JavaScript",
    icon: "JS",
    iconClass: "text-blue-400",
  },
];

// 下拉菜单选项数据
const questionSetOptions = ref([
  { label: "热门 TOP 100", value: "hot100" },
  { label: "精选 TOP 面试题", value: "interview" },
  { label: "LeetCode 精选", value: "leetcode" },
]);

const difficultyOptions = ref([
  { label: "简单", value: "easy" },
  { label: "中等", value: "medium" },
  { label: "困难", value: "hard" },
]);

const statusOptions = ref([
  { label: "已解答", value: "solved" },
  { label: "未开始", value: "todo" },
  { label: "尝试过", value: "attempted" },
]);

// const tagOptions = ref([
// ]);

const tagOptions = ref([
  { label: "数组", value: "array" },
  { label: "字符串", value: "string" },
  { label: "动态规划", value: "dp" },
  { label: "树", value: "tree" },
  { label: "贪心", value: "greedy" },
]);

// 处理选择事件
const handleQuestionSetSelect = (item) => {
  console.log("选择题单:", item);
};

const handleDifficultySelect = (item) => {
  console.log("选择难度:", item);
};

const handleStatusSelect = (item) => {
  console.log("选择状态:", item);
};

const handleTagSelect = (item) => {
  console.log("选择标签:", item);
};

// 处理导航点击
const handleNavClick = (navId) => {
  currentNav.value = navId;
};

// 添加当前打开的下拉框 ID
const currentOpenDropdown = ref(null);

// 修改处理函数，添加日志输出以便调试
const handleDropdownToggle = (dropdownId) => {
  console.log("Current:", currentOpenDropdown.value, "Clicked:", dropdownId);
  currentOpenDropdown.value =
    currentOpenDropdown.value === dropdownId ? null : dropdownId;
};

// 添加选中值的响应式引用
const selectedDifficulty = ref("");
const selectedStatus = ref("");
const selectedTag = ref("");
const selectedQuestionSet = ref("");

onMounted(async () => {
  await fetchBankList();
});

const fetchBankList = async () => {
  try {
    const result = await getBankList();
    if (result.code === 200) {
      cardDataList.value = result.data.data;
    }
  } catch (error) {
    console.error('获取题库列表失败:', error);
  }
};
</script>
