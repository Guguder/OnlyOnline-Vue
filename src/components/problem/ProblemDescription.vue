<template>
  <div
    class="problem-description overflow-y-auto custom-scrollbar flex flex-col h-full"
  >
    <div class="flex-1">
      <!-- 题号和标题 -->
      <div class="flex items-center gap-3 mb-4">
        <span class="text-gray-500 text-lg">#1001</span>
        <h1 class="text-2xl font-semibold">{{ problem.title }}</h1>
      </div>

      <!-- 标签区域 -->
      <div
        class="flex flex-wrap items-center gap-2 mb-6"
        v-if="problem.tags?.length"
      >
        <a-tag v-for="tag in problem.tags" :key="tag" class="!m-0">{{
          tag
        }}</a-tag>
      </div>

      <!-- 数据库表信息 -->
      <div
        v-for="(table, index) in problem.tables"
        :key="table.name"
        class="mb-6"
      >
        <!-- 表标题 -->
        <div class="text-base font-medium mb-2">
          表{{ index + 1 }}：{{ table.name }}
        </div>

        <!-- 表格内容区域（带左侧边框） -->
        <div class="pl-4 border-l-[4px] border-gray-200">
          <!-- 表格 -->
          <div class="table-container mb-3">
            <div class="terminal-table-wrapper">
              <!-- 表头 -->
              <div class="table-header">
                <div class="col-name">列名</div>
                <div class="col-type">类型</div>
                <div class="col-desc">说明</div>
              </div>
              <!-- 数据行 -->
              <div
                v-for="column in table.columns"
                :key="column.name"
                class="table-row"
              >
                <div class="col-name">{{ column.name }}</div>
                <div class="col-type">{{ column.type }}</div>
                <div class="col-desc">{{ column.description }}</div>
              </div>
            </div>
          </div>

          <!-- 表格说明区域 -->
          <div class="text-sm text-gray-600" v-if="table.description">
            <div class="list-disc">
              <div>{{ table.description }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 题目描述 -->
      <div class="mb-6">
        <div class="text-gray-700 whitespace-pre-wrap">
          {{ problem.description }}
        </div>
      </div>

      <!-- 示例区域 -->
      <div class="mb-6 space-y-6">
        <div v-for="example in problem.examples" :key="example.id">
          <!-- 示例标题 -->
          <div class="text-base font-medium mb-2">示例 {{ example.id }}:</div>

          <!-- 示例内容区域（带左侧边框） -->
          <div class="pl-4 border-l-[4px] border-gray-200">
            <!-- 输入数据 -->
            <div class="space-y-4 mb-2">
              <div class="text-sm font-medium text-gray-600 mb-1">输入：</div>
              <div
                v-for="(tableData, tableName) in example.input"
                :key="tableName"
                class="mb-2"
              >
                <div class="text-sm mb-2">{{ tableName }} =</div>
                <div class="table-container">
                  <div class="terminal-table-wrapper">
                    <div class="terminal-table">
                      <!-- 表头 -->
                      <div class="table-header">
                        <div
                          v-for="(_, key) in tableData[0]"
                          :key="key"
                          class="table-cell"
                        >
                          {{ key }}
                        </div>
                      </div>
                      <!-- 数据行 -->
                      <div
                        v-for="(row, index) in tableData"
                        :key="index"
                        class="table-row"
                      >
                        <div
                          v-for="(value, key) in row"
                          :key="key"
                          class="table-cell"
                        >
                          {{ value }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 输出数据 -->
            <div class="space-y-4">
              <div class="text-sm font-medium text-gray-600 mb-2">输出：</div>
              <div class="table-container">
                <div class="terminal-table-wrapper">
                  <div class="terminal-table">
                    <!-- 表头 -->
                    <div class="table-header">
                      <div
                        v-for="(_, key) in example.output[0]"
                        :key="key"
                        class="table-cell"
                      >
                        {{ key }}
                      </div>
                    </div>
                    <!-- 数据行 -->
                    <div
                      v-for="(row, index) in example.output"
                      :key="index"
                      class="table-row"
                    >
                      <div
                        v-for="(value, key) in row"
                        :key="key"
                        class="table-cell"
                      >
                        {{ value }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 提交信息 -->
      <div class="flex items-center gap-4 text-sm text-gray-500 py-3 border-y">
        <span>
          <span class="opacity-75 text-xs">通过次数：</span>
          <span class="font-medium text-black">{{
            formattedStats.passCount
          }}</span>
        </span>
        <span>
          <span class="opacity-75 text-xs">提交次数：</span>
          <span class="font-medium text-black">{{
            formattedStats.submitCount
          }}</span>
        </span>
        <span>
          <span class="opacity-75 text-xs">通过率：</span>
          <span class="font-medium text-black">{{
            formattedStats.passRate
          }}</span>
        </span>
      </div>

      <!-- 讨论区折叠面板 -->
      <div class="border-b discussion-section" id="discussion-section">
        <!-- 折叠面板头部 -->
        <div
          class="flex items-center justify-between cursor-pointer py-3"
          @click="toggleComments"
        >
          <div class="flex items-center gap-2">
            <span class="font-bold">讨论</span>
            <span class="text-sm text-gray-500 font-bold"
              >({{ props.problem.commentCount }})</span
            >
          </div>
          <component
            :is="isCommentsExpanded ? UpOutlined : DownOutlined"
            class="text-gray-400 mr-2"
          />
        </div>

        <!-- 折叠面板内容 -->
        <div
          v-show="isCommentsExpanded"
          class="py-4 space-y-6 discussion-section"
        >
          <!-- 评论输入区域 - 更新类名 -->
          <div
            class="border border-gray-200 rounded-lg overflow-hidden bg-white"
          >
            <a-textarea
              v-model:value="commentContent"
              placeholder="发表你的评论..."
              :auto-size="{ minRows: 4, maxRows: 6 }"
              class="comment-textarea"
            />
            <div class="flex justify-between items-center px-3 py-2">
              <div>
                <a-button
                  type="text"
                  class="text-gray-500 hover:text-blue-500"
                  @click="insertCode"
                >
                  <CodeOutlined />
                </a-button>
              </div>
              <div class="flex gap-2">
                <a-button
                  type="text"
                  class="text-gray-400 hover:text-gray-600"
                  @click="togglePreview"
                >
                  {{ isPreview ? "编辑" : "预览" }}
                </a-button>
                <a-button
                  type="text"
                  :class="[
                    'transition-colors',
                    commentContent
                      ? 'text-gray-700 hover:text-gray-900'
                      : 'text-gray-400',
                  ]"
                  @click="submitComment"
                >
                  发布
                </a-button>
              </div>
            </div>

            <!-- 预览区域 -->
            <div v-if="isPreview" class="p-4 border-t border-gray-100">
              <div v-html="formattedPreview"></div>
            </div>
          </div>

          <!-- 评论列表 - 更新类名 -->
          <CommentList
            :comments="comments"
            @like="likeComment"
            @toggle-replies="toggleReplies"
            @reply="showReplyInput"
            @edit="editComment"
            @delete="deleteComment"
          />
        </div>
      </div>
      <div class="text-xs pt-12 text-right">@ OnlyOnline</div>
    </div>
  </div>
</template>

<script setup>
import { computed, watch, ref, nextTick } from "vue";
import { Tag } from "ant-design-vue";
import { formatNumber, formatPercent } from "../../utils/format";
import { formatTimeAgo } from "../../utils/dateUtils";
import {
  LikeOutlined,
  CommentOutlined,
  StarOutlined,
  DownOutlined,
  UpOutlined,
  CodeOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons-vue";
import CommentList from "../comment/CommentList.vue";

const props = defineProps({
  isDiscussionExpanded: {
    type: Boolean,
    default: false,
  },
  problem: {
    type: Object,
    required: true,
    default: () => ({
      isLiked: false,
      isStarred: false,
      likeCount: 0,
      commentCount: 0,
      starCount: 0,
    }),
  },
  commentFocused: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["comment-scroll", "update:isDiscussionExpanded"]);

// 计算通过率
const passRate = computed(() => {
  if (!props.problem.submitCount) return 0;
  return Math.round(
    (props.problem.passCount / props.problem.submitCount) * 100
  );
});

// 添加文本填充函数
const padEnd = (text, length) => {
  return (text + " ".repeat(length)).slice(0, length);
};

const padCenter = (text, length) => {
  const spaces = length - text.length;
  const padLeft = Math.floor(spaces / 2);
  const padRight = spaces - padLeft;
  return " ".repeat(padLeft) + text + " ".repeat(padRight);
};

// 格式化后的统计数据
const formattedStats = computed(() => ({
  passCount: formatNumber(props.problem.passCount),
  submitCount: formatNumber(props.problem.submitCount),
  passRate: formatPercent(passRate.value),
}));

// 修改讨论区展开状态的处理
const isCommentsExpanded = ref(false);

// 监听 props 中的 isDiscussionExpanded 变化
watch(
  () => props.isDiscussionExpanded,
  (newValue) => {
    if (isCommentsExpanded.value !== newValue) {
      isCommentsExpanded.value = newValue;
    }
  },
  { immediate: true }
);

// 修改 toggleComments 方法，增加触发父组件状态更新
const toggleComments = () => {
  const newValue = !isCommentsExpanded.value;
  isCommentsExpanded.value = newValue;
  emit("update:isDiscussionExpanded", newValue);
};

// 评论相关的状态
const commentContent = ref("");
const showCodeEditor = ref(false);
const codeLanguage = ref("sql");
const codeContent = ref("");

// 修改模拟的评论数据
const comments = ref([
  {
    id: 1,
    userName: "用户1",
    userAvatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=1",
    content:
      "这是一条很长的评论内容，用来测试多行文本的显示效果。\n\n`SELECT * FROM users WHERE id > 100;`\n\n这是代码后面的内容。",
    createTime: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    likes: 5,
    isLiked: false,
    isOwner: true,
    replies: [
      {
        id: 11,
        userName: "用户2",
        content: "这是一条回复",
        createTime: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        likes: 5,
        isLiked: false,
        isOwner: true,
      },
    ],
  },
  {
    id: 2,
    userName: "用户2",
    userAvatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=2",
    content: "这是另一条评论",
    createTime: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    likes: 3,
    isLiked: true,
    isOwner: false,
    replies: [],
  },
]);

// 评论相关方法
const toggleCodeEditor = () => {
  showCodeEditor.value = !showCodeEditor.value;
};

const submitComment = () => {
  // 实现评论提交逻辑
};

const likeComment = (comment) => {
  comment.isLiked = !comment.isLiked;
  comment.likes += comment.isLiked ? 1 : -1;
};

const toggleReplies = (comment) => {
  comment.showReplies = !comment.showReplies;
};

const showReplyInput = (comment) => {
  // 实现显示回复输入框的逻辑
};

// 添加代码块插入方法
const commentTextarea = ref(null);
const insertCodeBlock = () => {
  const textarea = commentTextarea.value.resizableTextArea.textArea;
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const content = commentContent.value;

  // 插入代码块标记
  const newContent =
    content.substring(0, start) +
    "``" +
    content.substring(start, end) +
    "``" +
    content.substring(end);
  commentContent.value = newContent;

  // 设置光标位置
  nextTick(() => {
    textarea.focus();
    textarea.setSelectionRange(start + 2, end + 2);
  });
};

// 编辑评论
const editComment = (comment) => {
  // 实现编辑评论的逻辑
};

const deleteComment = async (comment) => {
  // 实现删除评论的逻辑
};

// 添加预览相关的状态和方法
const isPreview = ref(false);

const togglePreview = () => {
  isPreview.value = !isPreview.value;
};

// 格式化预览内容，处理代码块
const formattedPreview = computed(() => {
  if (!commentContent.value) return "";

  // 使用正则表达式匹配 `code` 形式的代码块
  return commentContent.value.replace(
    /`([^`]+)`/g,
    '<code class="inline-code">$1</code>'
  );
});

// 插入代码符号
const insertCode = () => {
  commentContent.value = commentContent.value + "``";
};

// 添加新的计算属性
const problemDescriptionRef = ref(null);
</script>

<style scoped>
.problem-description {
  max-width: 100%;
  overflow-x: auto;
  height: 100%;
  overflow-y: auto;
  scroll-behavior: smooth;
}

table {
  border-collapse: collapse;
}

th,
td {
  border: 1px solid #e5e7eb;
}

.font-mono {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
}

/* 自定义滚动条样式 */
.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: #d1d5db transparent;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #d1d5db;
  border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: #9ca3af;
}

/* 题目描述样式 */
.whitespace-pre-wrap {
  white-space: pre-wrap;
}

/* 标签样式覆盖 */
:deep(.ant-tag) {
  display: inline-flex;
  align-items: center;
  height: 24px;
  padding: 0 8px;
}

/* 表格容器响应式样式 */
.table-container {
  position: relative;
  width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: thin;
  scrollbar-color: #cbd5e1 #f1f5f9;
}

/* Webkit浏览器的滚动条样式 */
.table-container::-webkit-scrollbar {
  height: 6px; /* 水平滚动条高度 */
  width: 6px; /* 垂直滚动条宽度 */
}

.table-container::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 3px;
}

.table-container::-webkit-scrollbar-thumb {
  background-color: #cbd5e1;
  border-radius: 3px;
  transition: background-color 0.2s ease;
}

.table-container::-webkit-scrollbar-thumb:hover {
  background-color: #94a3b8;
}

/* 修改滚动提示样式 */
.table-container::after {
  content: "";
  position: absolute;
  top: 0;
  right: 0;
  width: 24px;
  height: 100%;
  background: linear-gradient(
    to left,
    rgba(241, 245, 249, 0.9) 0%,
    rgba(241, 245, 249, 0.5) 50%,
    transparent 100%
  );
  opacity: 0;
  transition: opacity 0.2s ease;
  pointer-events: none;
}

.table-container:hover::after {
  opacity: 1;
}

/* 确保滚动条在深色主题下也清晰可见 */
@media (prefers-color-scheme: dark) {
  .table-container {
    scrollbar-color: #475569 #1e293b;
  }

  .table-container::-webkit-scrollbar-track {
    background: #1e293b;
  }

  .table-container::-webkit-scrollbar-thumb {
    background-color: #475569;
  }

  .table-container::-webkit-scrollbar-thumb:hover {
    background-color: #64748b;
  }

  .table-container::after {
    background: linear-gradient(
      to left,
      rgba(30, 41, 59, 0.9) 0%,
      rgba(30, 41, 59, 0.5) 50%,
      transparent 100%
    );
  }
}

/* 终端风格表格样式 */
.terminal-table-wrapper {
  display: inline-block;
  min-width: min-content;
  max-width: 100%;
  padding: 0.5rem;
  background: transparent;
  border: 2px dashed #d1d5db;
  border-radius: 0.375rem;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 0.875rem;
  line-height: 1.2;
}

/* 表格本体样式 */
.terminal-table {
  display: table;
  width: auto;
  border-collapse: separate;
  border-spacing: 0;
  color: #374151;
}

.table-header {
  display: table-row;
  font-weight: 600;
  border-bottom: 2px dashed #d1d5db;
}

.table-row {
  display: table-row;
}

.table-header > div,
.table-row > div {
  display: table-cell;
  padding: 0.375rem 0.75rem; /* 减小单元格内边距 */
  white-space: nowrap;
  border-right: 2px dashed #d1d5db;
  position: relative;
}

/* 为表头添加底部虚线 */
.table-header > div {
  border-bottom: 2px dashed #d1d5db;
}

/* 移除最后一列的右边框 */
.table-header > div:last-child,
.table-row > div:last-child {
  border-right: none;
}

/* 修改列宽设置 */
.col-name {
  width: 1%; /* 使用1%让列宽由内容决定 */
  min-width: 120px;
  white-space: nowrap;
}

.col-type {
  width: 1%;
  min-width: 100px;
  .table-row > div {
    padding: 0.25rem 0.5rem;
  }
}

/* 添加滚动条指示 */
.table-container::after {
  content: "";
  position: absolute;
  bottom: 0;
  right: 0;
  width: 40px;
  height: 100%;
  background: linear-gradient(to left, rgba(255, 255, 255, 0.8), transparent);
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.2s;
}

.table-container:hover::after {
  opacity: 1;
}

/* 移除之前的 ASCII 表格相关样式 */
.ascii-table {
  display: none;
}

/* 表格说明区域样式 */
.list-disc {
  list-style-type: disc;
}

.list-disc > li {
  padding-left: 0.5rem;
  line-height: 1.5;
}

.list-inside {
  list-style-position: inside;
}

.space-y-1 > * + * {
  margin-top: 0.25rem;
}

/* 示例表格样式补充 */
.table-cell {
  display: table-cell;
  padding: 0.375rem 0.75rem;
  white-space: nowrap;
  border-right: 2px dashed #d1d5db;
}

.table-cell:last-child {
  border-right: none;
}

.terminal-table-wrapper {
  margin-bottom: 0; /* 覆盖之前的margin-bottom */
}

/* 优化示例区域间距 */
.space-y-6 > * + * {
  margin-top: 2rem;
}

/* 确保表格标题和内容之间的间距一致 */
.text-sm.mb-2 {
  margin-bottom: 0.5rem;
}

/* 底部操作栏按钮样式 */
button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
}

button:hover {
  background-color: rgba(0, 0, 0, 0.04);
}

/* 评论区样式 */
.comment-input-area {
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 1rem;
}

.comment-item {
  padding: 1rem;
  border-radius: 0.5rem;
  background-color: #f9fafb;
  transition: background-color 0.2s;
}

.comment-item:hover {
  background-color: #f3f4f6;
}

.replies-list {
  border-left: 2px solid #e5e7eb;
}

.reply-item {
  padding: 0.5rem;
  background-color: #ffffff;
  border-radius: 0.375rem;
}

/* 代码块样式 */
pre {
  margin: 0;
  padding: 0.5rem;
  background-color: #f8f9fa;
  border-radius: 0.25rem;
  overflow-x: auto;
}

code {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 0.875rem;
}

/* 新增样式 */
.comment-item {
  background-color: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.comment-item:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

/* 代码块样式优化 */
pre {
  margin: 0;
  padding: 0.75rem;
  background-color: #f8f9fa;
  border-radius: 0.375rem;
  border: 1px solid #e5e7eb;
}

code {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 0.875rem;
  line-height: 1.5;
}

/* 按钮样式优化 */
:deep(.ant-btn-text) {
  padding: 4px 8px;
  color: #6b7280;
}

:deep(.ant-btn-text:hover) {
  color: #3b82f6;
  background-color: rgba(59, 130, 246, 0.04);
}

/* 评论输入框样式优化 */
.comment-input-box {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
  background-color: #ffffff;
}

.comment-textarea {
  border: none;
  resize: none;
  padding: 16px;
}

.comment-textarea :deep(.ant-input) {
  border: none;
  box-shadow: none !important;
  padding: 0;
  background-color: transparent;
}

.comment-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4px 12px; /* 减小上下内边距 */
  background-color: transparent; /* 移除背景色 */
}

.toolbar-right {
  display: flex;
  gap: 4px; /* 减小按钮间距 */
}

.icon-btn {
  padding: 2px 8px;
  color: #6b7280;
}

.icon-btn:hover {
  color: #3b82f6;
  background-color: #f3f4f6;
}

.preview-btn {
  padding: 2px 12px;
  color: #6b7280;
}

.preview-btn:hover {
  color: #374151;
  background-color: #f3f4f6;
}

/* 发布按钮样式 */
.submit-btn {
  padding: 2px 16px;
  color: #9ca3af !important; /* 默认灰色 */
  transition: all 0.2s ease;
}

.submit-btn-active {
  color: #374151 !important; /* 有内容时的深灰色 */
}

.submit-btn-active:hover {
  background-color: #f3f4f6;
}

/* 预览区域样式 */
.preview-content {
  padding: 16px;
  background-color: #ffffff;
  border-top: 1px solid #f3f4f6; /* 更浅的分隔线 */
}

/* 行内代码块样式 */
:deep(.inline-code) {
  background-color: #f3f4f6;
  padding: 2px 6px;
  border-radius: 4px;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 0.875rem;
}

/* 覆盖输入框点击效果 */
.comment-textarea :deep(.ant-input),
.comment-textarea :deep(.ant-input:hover),
.comment-textarea :deep(.ant-input:focus),
.comment-textarea :deep(.ant-input:active) {
  border: none !important;
  box-shadow: none !important;
  outline: none !important;
  background-color: transparent !important;
}

/* 评论样式重构 */
.comment-item {
  padding: 16px 0;
  border-bottom: 1px solid #e5e7eb;
  transition: background-color 0.2s ease;
}

.comment-item:first-child {
  padding-top: 0;
}

.comment-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.username {
  font-weight: 500;
  color: #374151;
}

.time {
  font-size: 0.875rem;
  color: #9ca3af;
  margin-left: auto;
}

.comment-content {
  padding-left: 48px; /* 头像大小36px + gap 12px */
  margin-bottom: 12px;
}

.comment-content .text {
  color: #4b5563;
  line-height: 1.6;
  margin-bottom: 12px;
}

/* 统一代码块样式 */
.code-block {
  margin: 12px 0;
}

.code-block pre {
  background-color: #f3f4f6;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  padding: 12px 16px;
  margin: 0;
  overflow-x: auto;
}

.code-block code {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 0.875rem;
  color: #374151;
  line-height: 1.5;
}

/* 评论操作按钮样式 */
.comment-actions {
  padding-left: 48px;
  display: flex;
  align-items: center;
  gap: 16px;
}

.action-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px;
  color: #6b7280;
  transition: all 0.2s ease;
}

.action-btn:hover {
  color: #3b82f6;
  background-color: transparent;
}

.count {
  font-size: 0.875rem;
  color: inherit;
}

.hidden-actions {
  margin-left: auto;
  display: flex;
  gap: 8px;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.comment-item:hover .hidden-actions {
  opacity: 1;
}

.delete:hover {
  color: #ef4444 !important;
}

.comment-textarea:focus,
.comment-textarea:focus-within {
  box-shadow: none !important;
  border-color: #d9d9d9 !important; /* 或者设为其他颜色 */
}
</style>
