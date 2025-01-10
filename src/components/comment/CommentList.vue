<template>
  <div class="space-y-6">
    <div v-for="comment in comments" :key="comment.id" class="comment-item">
      <!-- 主评论 -->
      <div class="flex gap-3">
        <img :src="comment.avatar" class="w-10 h-10 rounded-full flex-shrink-0">
        <div class="flex-1">
          <div class="flex items-center justify-between mb-1">
            <div class="flex items-center gap-2">
              <span class="font-medium text-sm">{{ comment.author }}</span>
              <span class="text-xs text-gray-500">{{ comment.createTime }}</span>
            </div>
            <div class="flex items-center gap-2">
              <!-- 点赞按钮 -->
              <button 
                @click="$emit('like', comment)"
                class="flex items-center gap-1 text-sm text-gray-500 hover:text-blue-500"
                :class="{ 'text-blue-500': comment.isLiked }"
              >
                <ThumbsUp class="w-4 h-4" :fill="comment.isLiked ? 'currentColor' : 'none'"/>
                <span>{{ comment.likes }}</span>
              </button>
              <!-- 回复按钮 -->
              <button 
                @click="$emit('reply', comment)"
                class="flex items-center gap-1 text-sm text-gray-500 hover:text-blue-500"
              >
                <MessageSquare class="w-4 h-4"/>
                <span>回复</span>
              </button>
            </div>
          </div>
          <div class="text-sm text-gray-900">{{ comment.content }}</div>
          
          <!-- 回复列表 -->
          <div v-if="comment.replies && comment.replies.length > 0" class="mt-4 space-y-4">
            <div 
              v-for="reply in comment.replies" 
              :key="reply.id"
              class="flex gap-3 pl-4 border-l-2 border-gray-100"
            >
              <img :src="reply.avatar" class="w-8 h-8 rounded-full flex-shrink-0">
              <div class="flex-1">
                <div class="flex items-center justify-between mb-1">
                  <div class="flex items-center gap-2">
                    <span class="font-medium text-sm">{{ reply.author }}</span>
                    <span class="text-xs text-gray-500">{{ reply.createTime }}</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <button 
                      @click="$emit('like', reply)"
                      class="flex items-center gap-1 text-sm text-gray-500 hover:text-blue-500"
                      :class="{ 'text-blue-500': reply.isLiked }"
                    >
                      <ThumbsUp class="w-4 h-4" :fill="reply.isLiked ? 'currentColor' : 'none'"/>
                      <span>{{ reply.likes }}</span>
                    </button>
                    <button 
                      @click="$emit('reply', reply)"
                      class="flex items-center gap-1 text-sm text-gray-500 hover:text-blue-500"
                    >
                      <MessageSquare class="w-4 h-4"/>
                      <span>回复</span>
                    </button>
                  </div>
                </div>
                <div class="text-sm text-gray-900">{{ reply.content }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ThumbsUp, MessageSquare } from 'lucide-vue-next'

defineProps({
  comments: {
    type: Array,
    required: true
  }
})

defineEmits(['reply', 'like'])
</script>

<style scoped>
.comment-item:not(:last-child) {
  border-bottom: 1px solid #E5E5E5;
  padding-bottom: 1.5rem;
}
</style>
