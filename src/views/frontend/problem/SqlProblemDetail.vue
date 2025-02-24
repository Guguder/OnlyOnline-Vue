<template>
  <div class="w-screen h-screen overflow-hidden flex flex-col">
    <TopBar :title="problem.title" @back="goBack" />
    <div class="flex-1 overflow-hidden bg-gray-100 p-2 min-h-0">
      <a-spin :spinning="loading" class="h-full">
        <split-pane
          direction="horizontal"
          :default-ratio="40"
          :min-size="36"
          :current-ratio="splitRatio"
          @update:ratio="handleRatioChange"
          class="h-full"
        >
          <template #first>
            <sql-content
              v-model="activeTab"
              :tabs="tabs"
              :is-collapsed="isCollapsed"
              :is-min-width="isMinWidth"
              :is-liked="problem.isLiked"
              :is-starred="problem.isStarred"
              :stats="{
                likeCount: problem.likeCount,
                commentCount: problem.commentCount,
                starCount: problem.starCount,
              }"
              @collapse="collapsePanel"
              @expand="expandPanel"
              @like="handleLike"
              @comment="handleComment"
              @star="handleStar"
            >
              <template #default="{ activeTab }">
                <div v-if="activeTab === 'description'" class="p-4">
                  <problem-description
                    ref="descriptionRef"
                    :problem="problem"
                    :is-discussion-expanded="isDiscussionExpanded"
                  />
                </div>
                <div v-else-if="activeTab === 'solution'" class="p-4">
                  题解内容
                </div>
                <div v-else-if="activeTab === 'history'" class="p-2">
                  <SubmissionHistory :submissions="mockSubmissions" />
                </div>
                <div v-if="activeTab === 'testcase'" class="h-full">
                  <TestCasePanel :test-cases="testCases" />
                </div>
              </template>
            </sql-content>
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
                <sql-editor
                  v-model:value="editorValue"
                  :is-collapsed="isVerticalCollapsed"
                  @collapse="collapseVerticalPanel"
                  @expand="expandVerticalPanel"
                >
                  <div class="h-full w-full">
                    <textarea
                      v-model="editorValue"
                      class="w-full h-full p-4 resize-none border-none outline-none"
                    ></textarea>
                  </div>
                </sql-editor>
              </template>
              <template #second>
                <sql-result-panel
                  :is-collapsed="isBottomCollapsed"
                  v-model="bottomActiveTab"
                  :tabs="resultTabs"
                  @collapse="collapseBottomPanel"
                  @expand="expandBottomPanel"
                >
                  <template #default="{ activeTab }">
                    <div class="h-full">
                      <div v-if="activeTab === 'testcase'" class="h-full">
                        <TestCasePanel :test-cases="testCases" />
                      </div>
                      <div v-else-if="activeTab === 'result'" class="h-full">
                        <TestResultPanel :results="testResult" />
                      </div>
                    </div>
                  </template>
                </sql-result-panel>
              </template>
            </split-pane>
          </template>
        </split-pane>
      </a-spin>
    </div>
  </div>
</template>

<script setup>
import SqlContent from "../../../components/SqlContent.vue";
import SqlEditor from "../../../components/SqlEditor.vue";
import TopBar from "../../../components/TopBar.vue";
import { ref, computed, nextTick, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import {
  ReadOutlined,
  SolutionOutlined,
  HistoryOutlined,
  ExperimentOutlined,
  CheckSquareOutlined,
  CommentOutlined,
} from "@ant-design/icons-vue";
import { Spin } from "ant-design-vue";
import SplitPane from "../../../components/SplitPane.vue";
import SqlResultPanel from "../../../components/SqlResultPanel.vue";
import ProblemDescription from "../../../components/problem/ProblemDescription.vue";
import SubmissionHistory from "../../../components/problem/SubmissionHistory.vue";
import TestCasePanel from "../../../components/problem/TestCasePanel.vue";
import TestResultPanel from "../../../components/problem/TestResultPanel.vue";

const loading = ref(false);
const route = useRoute();
const problem = ref({
  id: route.params.id,
  title: "按部门统计员工最高薪资",
  difficulty: "中等",
  description:
    "请编写一个 SQL 查询，找出每个部门工资最高的员工。要求返回他们的姓名、薪水以及所在部门名称。结果按部门名称升序排列。",
  passCount: 12345,
  submitCount: 23456,
  tags: ["数据库", "SQL", "GROUP BY", "JOIN", "聚合函数"],
  tables: [
    {
      name: "Employees",
      description: "员工信息表 - 存储了公司所有员工的基本信息",
      columns: [
        { name: "id", type: "INT", description: "员工ID（主键）" },
        { name: "name", type: "VARCHAR(50)", description: "员工姓名" },
        { name: "salary", type: "DECIMAL(10,2)", description: "月薪" },
        {
          name: "department_id",
          type: "INT",
          description: "所属部门ID（外键）",
        },
        { name: "hire_date", type: "DATE", description: "入职日期" },
      ],
    },
    {
      name: "Departments",
      description: "部门信息表 - 存储了公司的部门信息",
      columns: [
        { name: "id", type: "INT", description: "部门ID（主键）" },
        { name: "name", type: "VARCHAR(50)", description: "部门名称" },
        { name: "manager_id", type: "INT", description: "部门主管ID" },
        { name: "location", type: "VARCHAR(100)", description: "部门位置" },
      ],
    },
  ],
  expectedOutput: [
    { 部门: "市场部", 员工姓名: "王五", 最高薪资: 22000.0 },
    { 部门: "研发部", 员工姓名: "李四", 最高薪资: 28000.0 },
  ],
  difficulty_level: 3,
  time_limit: 1000,
  memory_limit: 256,
  created_at: "2023-01-15",
  updated_at: "2023-12-20",
  author: "admin",
  source: "内部原创",
  hints: [
    "考虑使用 JOIN 语句连接两个表",
    "可以使用 GROUP BY 和聚合函数",
    "注意处理 NULL 值的情况",
  ],
  examples: [
    {
      id: 1,
      input: {
        Employees: [
          {
            id: 1,
            name: "张三",
            salary: 25000,
            department_id: 1,
            hire_date: "2021-01-15",
          },
          {
            id: 2,
            name: "李四",
            salary: 28000,
            department_id: 1,
            hire_date: "2020-11-20",
          },
          {
            id: 3,
            name: "王五",
            salary: 22000,
            department_id: 2,
            hire_date: "2021-03-10",
          },
        ],
        Departments: [
          { id: 1, name: "研发部", manager_id: 2, location: "北京" },
          { id: 2, name: "市场部", manager_id: 4, location: "上海" },
        ],
      },
      output: [
        { department_name: "市场部", employee_name: "王五", max_salary: 22000 },
        { department_name: "研发部", employee_name: "李四", max_salary: 28000 },
      ],
    },
  ],
  isLiked: false,
  isStarred: false,
  likeCount: 1234,
  commentCount: 56,
  starCount: 789,
});

const router = useRouter();
const goBack = () => router.back();

// 左侧内容面板相关
const activeTab = ref("description");
const tabs = [
  { key: "description", label: "题目描述", icon: ReadOutlined },
  { key: "solution", label: "题解", icon: SolutionOutlined },
  { key: "history", label: "答题记录", icon: HistoryOutlined },
];

// 面板宽度检测
const isMinWidth = computed(
  () =>
    document.querySelector(".split-pane > div:first-child")?.offsetWidth <= 80
);

// 左侧面板折叠控制
const initialRatio = 40;
const splitRatio = ref(initialRatio);
const isCollapsed = computed(() => splitRatio.value <= 5);

const handleRatioChange = (ratio) => (splitRatio.value = ratio);
const expandPanel = () => (splitRatio.value = initialRatio);
const collapsePanel = () => {
  const containerWidth =
    document.querySelector(".split-pane")?.offsetWidth || 1000;
  splitRatio.value = (42 / containerWidth) * 100; // 修改为42px
};

// 垂直分割相关
const initialVerticalRatio = 70;
const verticalSplitRatio = ref(initialVerticalRatio);
const isVerticalCollapsed = computed(() => verticalSplitRatio.value <= 10);
const isBottomCollapsed = computed(() => 100 - verticalSplitRatio.value <= 10);

const handleVerticalRatioChange = (ratio) => (verticalSplitRatio.value = ratio);

// 面板展开/收起处理函数
const expandVerticalPanel = () =>
  (verticalSplitRatio.value = initialVerticalRatio);
const collapseVerticalPanel = () => {
  const containerHeight =
    document.querySelector(".split-pane .split-pane")?.offsetHeight || 1000;
  verticalSplitRatio.value = (42 / containerHeight) * 100; // 修改为42px
};

const expandBottomPanel = () =>
  (verticalSplitRatio.value = 100 - initialBottomRatio);
const collapseBottomPanel = () => {
  const containerHeight =
    document.querySelector(".split-pane .split-pane")?.offsetHeight || 1000;
  verticalSplitRatio.value = 100 - (42 / containerHeight) * 100; // 修改为42px
};

// 结果区域配置
const initialBottomRatio = 30;
const bottomActiveTab = ref("testcase"); // 确保这个值与 tabs 中的 key 对应
const resultTabs = [
  { key: "testcase", label: "测试用例", icon: ExperimentOutlined },
  { key: "result", label: "测试结果", icon: CheckSquareOutlined },
];

// 添加一个监听器来处理标签切换
watch(bottomActiveTab, (newVal) => {
  console.log("切换到:", newVal); // 用于调试
});

// 编辑器值
const editorValue = ref("-- 在这里编写你的SQL查询\nSELECT * FROM Employees;");

// 添加交互处理函数
const handleLike = () => {
  problem.value.isLiked = !problem.value.isLiked;
  // TODO: 调用API处理点赞
};

// 添加展开讨论区的状态
const isDiscussionExpanded = ref(false);

// 修改评论按钮点击处理函数
const handleComment = async () => {
  const descriptionEl = descriptionRef.value?.$el;

  // 如果讨论区已展开，则关闭
  if (isDiscussionExpanded.value) {
    isDiscussionExpanded.value = false;
    return;
  }

  // 如果不在描述页面，先切换到描述页面
  if (activeTab.value !== "description") {
    activeTab.value = "description";
    await nextTick();
  }

  // 展开讨论区
  isDiscussionExpanded.value = true;

  // 等待DOM更新后滚动到讨论区
  await nextTick();
  const discussionEl = descriptionEl?.querySelector(".discussion-section");
  if (discussionEl) {
    discussionEl.scrollIntoView({ behavior: "smooth" });
  }
};

const handleStar = () => {
  problem.value.isStarred = !problem.value.isStarred;
  // TODO: 调用API处理收藏
};

// 添加滚动到讨论区的方法
const descriptionRef = ref(null);

// 添加模拟的提交记录数据
const mockSubmissions = ref([
  {
    id: 1,
    status: "执行通过",
    executionTime: 100,
    memoryUsage: 5.2,
    language: "mysql",
    submitTime: "2024-01-20 10:30:00",
    note: "优化了索引使用",
  },
  {
    id: 2,
    status: "超出时间",
    executionTime: 150,
    memoryUsage: 6.1,
    language: "mysql",
    submitTime: "2024-01-20 10:25:00",
    note: "初次提交",
  },
  {
    id: 3,
    status: "编译出错",
    executionTime: 2000,
    memoryUsage: 5.8,
    language: "mysql",
    submitTime: "2024-01-20 10:20:00",
    note: "需要优化查询性能",
  },
]);

// 添加测试用例数据
const testCases = [
  [
    {
      name: "Employees",
      columns: ["id", "name", "salary", "department_id", "hire_date"],
      data: [
        {
          id: 1,
          name: "张三",
          salary: 25000,
          department_id: 1,
          hire_date: "2021-01-15",
        },
        {
          id: 2,
          name: "李四",
          salary: 28000,
          department_id: 1,
          hire_date: "2020-11-20",
        },
        {
          id: 3,
          name: "王五",
          salary: 22000,
          department_id: 2,
          hire_date: "2021-03-10",
        },
      ],
    },
    {
      name: "Departments",
      columns: ["id", "name", "manager_id", "location"],
      data: [
        { id: 1, name: "研发部", manager_id: 2, location: "北京" },
        { id: 2, name: "市场部", manager_id: 4, location: "上海" },
      ],
    },
  ],
  [
    {
      name: "Employees",
      columns: ["id", "name", "salary", "department_id", "hire_date"],
      data: [
        {
          id: 1,
          name: "Jack",
          salary: 15000,
          department_id: 1,
          hire_date: "2021-01-15",
        },
        {
          id: 2,
          name: "Tom",
          salary: 18000,
          department_id: 1,
          hire_date: "2020-11-20",
        },
        {
          id: 3,
          name: "Mary",
          salary: 12000,
          department_id: 2,
          hire_date: "2021-03-10",
        },
      ],
    },
    {
      name: "Departments",
      columns: ["id", "name", "manager_id", "location"],
      data: [
        { id: 1, name: "IT", manager_id: 2, location: "New York" },
        { id: 2, name: "HR", manager_id: 4, location: "Boston" },
      ],
    },
  ],
];

// 修改测试结果数据
const testResult = ref([
  {
    status: "执行通过",
    executionTime: 125,
    testCase: testCases[0], // 引用对应的测试用例数据
    output: {
      headers: ["department_name", "employee_name", "max_salary"],
      rows: [
        { department_name: "市场部", employee_name: "王五", max_salary: 22000 },
        { department_name: "研发部", employee_name: "李四", max_salary: 28000 },
      ],
    },
  },
  {
    status: "执行错误",
    executionTime: 0,
    testCase: testCases[1],
    error: "ERROR 1054 (42S22): Unknown column 'xxx' in 'field list'",
  },
]);
</script>

<style scoped>
/* 只保留必要的样式 */
:deep(.ant-btn) {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

:deep(.ant-btn:hover) {
  color: rgba(0, 0, 0, 0.88) !important;
  border-color: transparent !重要;
}

:deep(.ant-btn.text-gray-400:hover) {
  color: rgb(75, 85, 99) !important;
  background-color: rgb(243, 244, 246);
}

:deep(.ant-btn.text-gray-900:hover) {
  color: rgb(17, 24, 39) !important;
  background-color: rgb(243, 244, 246);
}

/* 移除可能影响布局的样式 */
.transition-all {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>
