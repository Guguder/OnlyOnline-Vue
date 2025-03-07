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
                v-model="searchQuery"
                @input="handleSearch"
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
          <!-- 调整分页组件样式 -->
          <div class="flex justify-center items-center py-6">
            <a-pagination
              v-model:current="currentPage"
              v-model:pageSize="pageSize"
              :total="total"
              :default-page-size="20"
              :page-size-options="['10', '20', '30', '50']"
              show-size-changer
              class="pagination-custom"
              @change="handleCurrentChange"
              @showSizeChange="handleSizeChange"
            />
          </div>
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
import { Pagination as APagination } from "ant-design-vue";
import { ref, onMounted } from "vue";
import { getBankList } from "../../../api/frontend/bank.js";
import { getTopicList } from "../../../api/frontend/topic.js";

// 分页相关的响应式变量
const currentPage = ref(1);
const pageSize = ref(20);
const total = ref(0);
const searchQuery = ref("");
const problems = ref([]); // 保留这个声明

// 获取题目列表
const fetchTopicList = async () => {
  try {
    const params = {
      pageNumber: currentPage.value,
      pageSize: pageSize.value,
      keyword: searchQuery.value,
    };
    const result = await getTopicList(params);
    if (result.code === 200) {
      // 转换数据格式以匹配组件需求
      problems.value = result.data.data.map((item) => ({
        id: item.id,
        status: "none",
        title: item.title,
        solutions: item.solutionNum.toString(),
        passRate: item.passingRate + "%",
        difficulty: ["简单", "中等", "困难"][item.difficulty],
        type: "sql", // 可以根据实际情况调整
      }));
      total.value = parseInt(result.data.total);
    }
  } catch (error) {
    console.error("获取题目列表失败:", error);
  }
};

// 处理页码变化
const handleCurrentChange = (page) => {
  currentPage.value = page;
  fetchTopicList();
};

// 处理每页数量变化
const handleSizeChange = (size) => {
  pageSize.value = size;
  currentPage.value = 1; // 重置到第一页
  fetchTopicList();
};

// 处理搜索
const handleSearch = () => {
  currentPage.value = 1; // 重置到第一页
  fetchTopicList();
};

onMounted(() => {
  fetchTopicList();
});

// 修改 cardDataList 的定义为响应式引用
const cardDataList = ref([]);

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
    console.error("获取题库列表失败:", error);
  }
};
</script>

<style scoped>
/* 覆盖 Ant Design Vue 的分页图标样式 */
:deep(.ant-pagination) .anticon {
  display: flex;
  align-items: center;
  justify-content: center;
}

:deep(.ant-pagination-item-link) {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
