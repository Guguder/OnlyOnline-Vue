<template>
  <div class="flex flex-col gap-4">
    <div v-if="comments.length === 0" class="text-center text-gray-500 py-8">
      暂无评论
    </div>
    <div v-for="comment in comments" :key="comment.id">
      <!-- 评论作者信息 -->
      <div class="flex items-start gap-3">
        <img
            :src="comment.avatar"
            class="w-10 h-10 rounded-full"
            @error="handleAvatarError"
        />
        <div class="flex-1">
          <div class="flex items-center gap-2">
            <span class="font-medium">{{ comment.author }}</span>
            <span class="text-sm text-gray-500">{{ comment.createTime }}</span>
          </div>
          <!-- 评论内容 -->
          <p class="mt-2 text-gray-700">{{ comment.content }}</p>
          <!-- 评论操作 -->
          <div class="mt-2 flex items-center gap-3">
            <button
                @click="$emit('like', comment)"
                class="flex items-center gap-1 text-sm text-gray-500 hover:text-blue-500"
                :class="{ 'text-blue-500': comment.isLiked }"
            >
              <ThumbsUp
                  class="w-4 h-4"
                  :fill="comment.isLiked ? 'currentColor' : 'none'"
              />
              <span>{{ comment.likes }}</span>
            </button>
            <!-- 修改展开子评论按钮样式 -->
            <button
                v-if="comment.childReplyNum > 0"
                @click="$emit('expand', comment)"
                class="flex items-center gap-1 text-xs text-gray-500 hover:text-blue-500 transition-colors"
            >
              <span>展开 {{ comment.childReplyNum }} 条回复</span>
              <ChevronDown
                  class="w-4 h-4 transition-transform duration-200"
                  :class="{ 'rotate-180': comment.isExpanded }"
              />
            </button>
            <button
              @click="$emit('reply', comment, true)"
              class="flex items-center gap-1 text-xs text-gray-500 hover:text-blue-500"
            >
              <span>回复</span>
            </button>


          </div>

          <!-- 优化子评论区域样式 -->
          <div
              v-if="comment.isExpanded && comment.childReplies?.length"
              class="mt-4 ml-6 pl-4 border-l-2 border-gray-100 space-y-4"
          >
            <div
                v-for="childReply in comment.childReplies"
                :key="childReply.id"
                class="relative"
            >
              <div class="flex items-start gap-3">
                <img
                    :src="childReply.avatar"
                    class="w-8 h-8 rounded-full"
                    @error="handleAvatarError"
                />
                <div class="flex-1">
                  <div class="flex items-center flex-wrap gap-1.5 text-sm">
                    <span class="font-medium text-gray-900">{{ childReply.author }}</span>
                    <span class="text-gray-400">回复</span>
                    <span class="font-medium text-gray-900">{{ childReply.toAuthor }}</span>
                    <span class="text-gray-400 text-xs">{{ childReply.createTime }}</span>
                  </div>
                  <p class="mt-1.5 text-gray-700 text-sm leading-relaxed">{{ childReply.content }}</p>
                  <!-- 添加子评论操作按钮 -->
                  <div class="mt-2 flex items-center gap-3">
                    <button
                        @click="$emit('like', childReply)"
                        class="flex items-center gap-1 text-xs text-gray-500 hover:text-blue-500"
                        :class="{ 'text-blue-500': childReply.isLiked }"
                    >
                      <ThumbsUp
                          class="w-3 h-3"
                          :fill="childReply.isLiked ? 'currentColor' : 'none'"
                      />
                      <span>{{ childReply.likes || 0 }}</span>
                    </button>
                    <button
                        @click="$emit('reply', {
                          id: childReply.id,
                          accountId: childReply.accountId,
                          author: childReply.author,
                          rootId: comment.id  // 传递根评论ID
                        }, true)"
                        class="flex items-center gap-1 text-xs text-gray-500 hover:text-blue-500"
                    >
                      <span>回复</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ThumbsUp, MessageSquare, ChevronDown} from "lucide-vue-next";

defineProps({
  comments: {
    type: Array,
    required: true,
    default: () => [],
  },
});

// 修改emit类型定义，添加更多细节
defineEmits(["like", "reply", "expand"]);

// 处理头像加载失败
const handleAvatarError = (e) => {
  e.target.src = "https://api.dicebear.com/7.x/bottts/svg?seed=default"; // 默认头像
};
</script>

<style scoped>
/* 优化动画效果 */
.transform {
  transition: all 0.2s ease-in-out;
}

.border-l-2 {
  position: relative;
  transition: all 0.3s ease;
}

/* 添加子评论左侧边框渐变效果 */
.border-l-2 {
  border-image: linear-gradient(to bottom, #e5e7eb 0%, #e5e7eb 100%) 1;
}

/* 优化间距和层级 */
.space-y-4 > * + * {
  margin-top: 1rem;
}
</style>
