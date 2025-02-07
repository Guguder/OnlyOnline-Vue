<template>
  <div>
    <template v-for="(comment, index) in comments" :key="comment.id">
      <div class="group space-y-3">
        <!-- 上部分：用户信息行 -->
        <div class="flex items-center gap-3">
          <a-avatar :src="comment.userAvatar" :size="36" />
          <span class="font-medium text-gray-900">{{ comment.userName }}</span>
          <span class="text-sm text-gray-400 ml-auto">{{
            formatTimeAgo(comment.createTime)
          }}</span>
        </div>

        <!-- 中部分：评论内容 -->
        <div
          class="text-gray-600 leading-relaxed pl-4"
          v-html="formatComment(comment.content)"
        ></div>

        <!-- 下部分：操作按钮 -->
        <div class="flex items-center">
          <a-button
            type="text"
            class="flex items-center text-gray-500 hover:text-blue-500"
            @click="$emit('like', comment)"
          >
            <LikeOutlined :class="{ 'text-blue-500': comment.isLiked }" />
            <span class="text-sm">{{ comment.likes }}</span>
          </a-button>

          <a-button
            v-if="comment.replies?.length"
            type="text"
            class="flex items-center text-gray-500 hover:text-blue-500"
            @click="handleToggleReplies(comment)"
          >
            <MessageOutlined />
            <span class="text-sm">{{ comment.replies.length }}</span>
          </a-button>

          <a-button
            type="text"
            class="flex items-center text-gray-500 hover:text-blue-500"
            @click="handleReply(comment)"
          >
            <CommentOutlined />
          </a-button>

          <div
            class="ml-auto opacity-0 transition-opacity group-hover:opacity-100"
          >
            <template v-if="comment.isOwner">
              <a-button
                type="text"
                class="text-gray-500 hover:text-blue-500"
                @click="$emit('edit', comment)"
              >
                <EditOutlined />
              </a-button>
              <a-button
                type="text"
                class="text-gray-500 hover:text-red-500"
                @click="$emit('delete', comment)"
              >
                <DeleteOutlined />
              </a-button>
            </template>
          </div>
        </div>

        <!-- 父评论的回复输入框 -->
        <div v-if="activeReplyId === comment.id" class="pl-8 pt-2">
          <div class="flex gap-3">
            <a-avatar :src="userAvatar" :size="32" />
            <div
              class="flex-1 border border-gray-200 rounded-lg overflow-hidden bg-white"
            >
              <a-textarea
                v-model:value="replyContent"
                :placeholder="
                  replyToUser ? `回复 @${replyToUser}...` : '发表你的回复...'
                "
                :auto-size="{ minRows: 3, maxRows: 6 }"
                class="comment-textarea"
              />
              <!-- 回复输入框按钮部分 - 修改 padding -->
              <div class="flex justify-between items-center px-3 py-1">
                <div>
                  <a-button
                    type="text"
                    class="text-gray-500 hover:text-blue-500"
                    @click="insertCodeInReply"
                  >
                    <CodeOutlined />
                  </a-button>
                </div>
                <div class="flex gap-2">
                  <a-button
                    type="text"
                    class="text-gray-400 hover:text-gray-600"
                    @click="toggleReplyPreview"
                  >
                    {{ isReplyPreview ? "编辑" : "预览" }}
                  </a-button>
                  <a-button
                    type="text"
                    :class="[
                      'transition-colors',
                      replyContent
                        ? 'text-gray-700 hover:text-gray-900'
                        : 'text-gray-400',
                    ]"
                    @click="submitReply(comment)"
                  >
                    回复
                  </a-button>
                </div>
              </div>
              <!-- 回复预览区域 -->
              <div v-if="isReplyPreview" class="p-4 border-t border-gray-100">
                <div v-html="formattedReplyPreview"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- 展开的子评论区域 -->
        <div
          v-if="expandedComments[comment.id] && comment.replies?.length"
          class="pl-8 pt-2"
        >
          <template
            v-for="(reply, replyIndex) in comment.replies"
            :key="reply.id"
          >
            <div class="group space-y-3">
              <!-- 回复的用户信息行 -->
              <div class="flex items-center gap-3">
                <a-avatar :src="reply.userAvatar" :size="32" />
                <span class="font-medium text-gray-900">{{
                  reply.userName
                }}</span>
                <span class="text-sm text-gray-400 ml-auto">{{
                  formatTimeAgo(reply.createTime)
                }}</span>
              </div>
              <!-- 回复的内容 -->
              <div
                class="text-gray-600 leading-relaxed pl-4"
                v-html="formatComment(reply.content)"
              ></div>
              <!-- 回复的操作按钮 -->
              <div class="flex items-center">
                <a-button
                  type="text"
                  class="flex items-center gap-1 text-gray-500 hover:text-blue-500"
                  @click="$emit('like', reply)"
                >
                  <LikeOutlined :class="{ 'text-blue-500': reply.isLiked }" />
                  <span class="text-sm">{{ reply.likes }}</span>
                </a-button>

                <a-button
                  type="text"
                  class="flex items-center gap-1 text-gray-500 hover:text-blue-500"
                  @click="handleReply(reply, comment)"
                >
                  <CommentOutlined />
                </a-button>

                <div
                  class="ml-auto opacity-0 transition-opacity group-hover:opacity-100"
                >
                  <template v-if="reply.isOwner">
                    <a-button
                      type="text"
                      class="text-gray-500 hover:text-blue-500"
                      @click="$emit('edit', reply)"
                    >
                      <EditOutlined />
                    </a-button>
                    <a-button
                      type="text"
                      class="text-gray-500 hover:text-red-500"
                      @click="$emit('delete', reply)"
                    >
                      <DeleteOutlined />
                    </a-button>
                  </template>
                </div>
              </div>

              <!-- 子回复的输入框 - 移动到这里 -->
              <div v-if="activeReplyId === reply.id" class="pt-2">
                <div class="flex gap-3">
                  <a-avatar :src="userAvatar" :size="32" />
                  <div
                    class="flex-1 border border-gray-200 rounded-lg overflow-hidden bg-white"
                  >
                    <a-textarea
                      v-model:value="replyContent"
                      :placeholder="
                        replyToUser
                          ? `回复 @${replyToUser}...`
                          : '发表你的回复...'
                      "
                      :auto-size="{ minRows: 3, maxRows: 6 }"
                      class="comment-textarea"
                    />
                    <!-- 回复输入框按钮部分 - 修改 padding -->
                    <div class="flex justify-between items-center px-3 py-1">
                      <div>
                        <a-button
                          type="text"
                          class="text-gray-500 hover:text-blue-500"
                          @click="insertCodeInReply"
                        >
                          <CodeOutlined />
                        </a-button>
                      </div>
                      <div class="flex gap-2">
                        <a-button
                          type="text"
                          class="text-gray-400 hover:text-gray-600"
                          @click="toggleReplyPreview"
                        >
                          {{ isReplyPreview ? "编辑" : "预览" }}
                        </a-button>
                        <a-button
                          type="text"
                          :class="[
                            'transition-colors',
                            replyContent
                              ? 'text-gray-700 hover:text-gray-900'
                              : 'text-gray-400',
                          ]"
                          @click="submitReply(comment)"
                        >
                          回复
                        </a-button>
                      </div>
                    </div>
                    <!-- 回复预览区域 -->
                    <div
                      v-if="isReplyPreview"
                      class="p-4 border-t border-gray-100"
                    >
                      <div v-html="formattedReplyPreview"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <a-divider
              v-if="reply !== comment.replies[comment.replies.length - 1]"
              class="my-2"
            />
          </template>
        </div>
      </div>
      <a-divider v-if="index !== comments.length - 1" class="my-3" />
    </template>
  </div>
</template>

<script setup>
import {
  LikeOutlined,
  CommentOutlined,
  MessageOutlined,
  EditOutlined,
  DeleteOutlined,
  CodeOutlined,
} from "@ant-design/icons-vue";
import { formatTimeAgo } from "../../utils/dateUtils";
import { computed, ref } from "vue";

const props = defineProps({
  comments: {
    type: Array,
    required: true,
  },
  userAvatar: {
    // 添加用户头像属性
    type: String,
    required: true,
  },
});

const emit = defineEmits([
  "like",
  "toggle-replies",
  "reply",
  "edit",
  "delete",
  "submit-reply",
]);

// 格式化评论内容
const formatComment = (content) => {
  if (!content) return "";

  return content
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line)
    .map((line) =>
      line.replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>')
    )
    .join("<br>");
};

// 用于追踪每个评论的展开状态
const expandedComments = ref({});

// 处理评论展开/收起
const handleToggleReplies = (comment) => {
  expandedComments.value[comment.id] = !expandedComments.value[comment.id];
};

const activeReplyId = ref(null);
const replyContent = ref("");
const replyToUser = ref(""); // 添加回复对象状态

// 添加预览相关的状态
const isReplyPreview = ref(false);

// 格式化预览内容
const formattedReplyPreview = computed(() => {
  if (!replyContent.value) return "";
  return formatComment(replyContent.value);
});

// 切换预览状态
const toggleReplyPreview = () => {
  isReplyPreview.value = !isReplyPreview.value;
};

// 处理回复按钮点击
const handleReply = (targetComment, parentComment = null) => {
  // 如果点击的是当前已打开的回复框，则关闭它
  if (activeReplyId.value === targetComment.id) {
    activeReplyId.value = null;
    replyContent.value = "";
    replyToUser.value = "";
    isReplyPreview.value = false;
  } else {
    // 否则打开新的回复框
    activeReplyId.value = targetComment.id; // 直接使用目标评论的ID
    replyContent.value = "";
    replyToUser.value = targetComment.userName;
    isReplyPreview.value = false;
  }
};

// 取消回复
const cancelReply = () => {
  activeReplyId.value = null;
  replyContent.value = "";
  replyToUser.value = "";
  isReplyPreview.value = false; // 重置预览状态
};

// 提交回复
const submitReply = (comment) => {
  if (!replyContent.value.trim()) return;

  // 触发父组件的回复事件
  emit("submit-reply", {
    parentId: comment.id,
    content: replyContent.value,
    replyToUser: replyToUser.value,
    isSubReply: !!replyToUser.value, // 添加标记是否为子回复
  });

  // 清空并关闭输入框
  cancelReply();
};

// 插入代码符号
const insertCodeInReply = () => {
  replyContent.value += "``";
};
</script>

<style scoped>
.group:hover .group-hover\:opacity-100 {
  opacity: 1;
}

/* 行内代码块样式 */
:deep(.inline-code) {
  background-color: #f3f4f6;
  padding: 2px 6px;
  border-radius: 4px;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 0.875rem;
}

/* 回复输入框样式 */
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

.comment-textarea:focus,
.comment-textarea:focus-within {
  box-shadow: none !important;
  border-color: #d9d9d9 !important; /* 或者设为其他颜色 */
}

/* 取消按钮样式 */
:deep(.ant-btn-text.hover\:text-gray-600:hover) {
  color: #4b5563;
  background-color: #f3f4f6;
}

/* 按钮区域样式优化 */
:deep(.ant-btn-text) {
  height: 28px; /* 减小按钮高度 */
  line-height: 28px;
  padding: 0 8px;
}
</style>
