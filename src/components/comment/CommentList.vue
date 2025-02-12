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
          <div class="mt-2 flex items-center gap-4">
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
            <button
              @click="$emit('reply', comment)"
              class="flex items-center gap-1 text-sm text-gray-500 hover:text-blue-500"
            >
              <MessageSquare class="w-4 h-4" />
              <span>回复</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ThumbsUp, MessageSquare } from "lucide-vue-next";

defineProps({
  comments: {
    type: Array,
    required: true,
    default: () => [],
  },
});

defineEmits(["like", "reply"]);

// 处理头像加载失败
const handleAvatarError = (e) => {
  e.target.src = "https://api.dicebear.com/7.x/bottts/svg?seed=default"; // 默认头像
};
</script>

<style scoped>
/* 移除之前的样式 */
</style>
