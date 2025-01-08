<template>
  <div class="w-full">
    <!-- Header with avatar and title -->
    <div class="px-4 py-2 flex items-center gap-3">
      <div class="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
        <img
            :src="post.avatar"
            alt="User avatar"
            class="w-full h-full object-cover"
        />
      </div>
      <div class="flex-1 min-w-0 overflow-hidden">
        <h2 class="text-lg font-medium text-gray-900 truncate">{{ post.title }}</h2>
        <div class="flex gap-0.5 mt-1 flex-wrap">
          <a-tag
            v-for="tag in post.tags"
            :key="tag.text"
            :color="tag.color"
          >
            {{ tag.text }}
          </a-tag>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="px-4 py-2 max-w-full" style="max-width: 800px; word-break: break-word;">
      <p class="text-gray-700 text-sm leading-relaxed line-clamp-2">
        {{ post.content }}
      </p>
    </div>

    <!-- Footer with metrics -->
    <div class="px-4 py-3 flex items-center gap-6">
      <button class="flex items-center gap-1.5 text-gray-500 hover:text-gray-700">
        <ThumbsUp class="w-4 h-4"/>
        <span class="text-sm">{{ formatNumber(post.likes) }}</span>
      </button>

      <div class="flex items-center gap-1.5 text-gray-500">
        <Eye class="w-4 h-4"/>
        <span class="text-sm">{{ formatNumber(post.views) }}</span>
      </div>

      <button class="flex items-center gap-1.5 text-gray-500 hover:text-gray-700">
        <MessageCircle class="w-4 h-4"/>
        <span class="text-sm">{{ formatNumber(post.comments) }}</span>
      </button>

      <button class="flex items-center gap-1.5 text-gray-500 hover:text-gray-700">
        <Star class="w-4 h-4"/>
        <span class="text-sm">{{ formatNumber(post.stars) }}</span>
      </button>
    </div>

        <!-- Divider -->
        <div class="my-2 h-[1px] bg-[#E5E5E5]"></div>
  </div>
</template>

<script setup>
import { Tag as ATag } from 'ant-design-vue'
import { ThumbsUp, Eye, MessageCircle, Star } from 'lucide-vue-next'
import { formatNumber } from '../utils/format'

defineProps({
  post: {
    type: Object,
    required: true
  }
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  word-wrap: break-word;
  word-break: break-word;
  max-width: 100%;
}

p {
  overflow-wrap: break-word;
  word-wrap: break-word;
  word-break: break-word;
  hyphens: auto;
}

:deep(.ant-tag) {
  border-radius: 10px;
  padding: 0 10px;
}
</style>