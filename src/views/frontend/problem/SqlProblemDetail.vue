<template>
  <div v-if="hasData" class="w-screen h-screen overflow-hidden flex flex-col">
    <TopBar :title="problem.title" @back="goBack" />
    <div class="flex-1 overflow-hidden bg-gray-100 px-2 min-h-0">
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
  <div
    v-else-if="!loading"
    class="w-full h-full flex items-center justify-center"
  >
    <span class="text-gray-500">暂无数据</span>
  </div>
</template>

<script setup>
import SqlContent from "../../../components/SqlContent.vue";
import SqlEditor from "../../../components/SqlEditor.vue";
import TopBar from "../../../components/TopBar.vue";
import { ref, computed, nextTick, watch, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { topic } from "../../../api/frontend/topic";
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

const loading = ref(true);
const route = useRoute();
const problem = ref({});

// 移除原来的静态 testCases 数据，改为响应式引用
const testCases = ref([]);

// 移除原来的静态 testResult 数据，改为响应式引用
const testResult = ref([]);

// 修改获取题目详情的处理逻辑
const fetchProblemDetail = async () => {
  try {
    loading.value = true;
    const response = await topic.getTopicDetail(route.params.id);

    if (response.code === 200 && response.data) {
      const apiData = response.data;

      // 处理测试用例数据，包含输入和期望输出
      testCases.value = apiData.testTopicList || [];

      console.log("testCases:", testCases.value);

      // 处理测试结果数据
      testResult.value =
        apiData.testTopicList?.map((testTopic) => ({
          status: "待执行",
          executionTime: 0,
          testCase: testTopic.inputList?.map((input) => ({
            name: input.tableName,
            columns: Object.keys(input.data[0] || {}),
            data: input.data,
          })),
          output: {
            headers: testTopic.outputList?.[0]?.columns || [],
            rows: testTopic.outputList?.[0]?.data || [],
          },
        })) || [];

      // 转换数据结构
      const transformedData = {
        id: apiData.id,
        title: apiData.title || "SQL题目",
        difficulty: apiData.difficulty,
        description: apiData.content || "",
        tables:
          apiData.topicTableList?.map((table) => ({
            name: table.name,
            description: table.description,
            columns: table.columnList?.map((col) => ({
              name: col.name,
              type: col.type,
              description: col.description,
            })),
          })) || [],
        examples:
          apiData.testTopicList?.length > 0
            ? [
                {
                  // 只取第一条测试用例
                  input: apiData.testTopicList[0].inputList?.reduce(
                    (acc, input) => {
                      acc[input.tableName] = input.data;
                      return acc;
                    },
                    {}
                  ),
                  output: apiData.testTopicList[0].outputList || [],
                },
              ]
            : [],
        passCount: apiData.passNum || 0,
        submitCount: apiData.submitNum || 0,
        isLiked: apiData.isThumb || false,
        isStarred: apiData.isFavour || false,
        likeCount: apiData.thumbNum || 0,
        commentCount: 0,
        starCount: apiData.favourNum || 0,
        tags: apiData.tagList || [],
        hints: [],
      };

      console.log("处理后的数据:", transformedData); // 添加调试日志
      problem.value = transformedData;
    } else {
      console.error("API响应异常:", response);
    }
  } catch (error) {
    console.error("获取题目详情失败:", error);
  } finally {
    loading.value = false;
  }
};

// 在组件挂载时获取题目详情
onMounted(() => {
  fetchProblemDetail();
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

// 添加防止空数据渲染的计算属性
const hasData = computed(() => {
  return problem.value && Object.keys(problem.value).length > 0;
});
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
