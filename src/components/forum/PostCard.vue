<template>
  <!-- 外层容器添加分割线 -->
  <div class="border-b border-gray-100">
    <!-- 内容区域添加圆角和内边距 -->
    <div
      class="w-full mx-2 my-1 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
      @click="goToDetail"
    >
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
          <h2 class="text-lg font-medium text-gray-900 truncate">
            {{ post.title }}
          </h2>
          <div class="flex gap-0.5 mt-1 flex-wrap">
            <a-tag
              v-for="tag in post.tags"
              :key="tag.text"
              :color="tag.color"
              style="margin-right: 8px"
            >
              {{ tag.text }}
            </a-tag>
          </div>
        </div>
      </div>

      <!-- Content -->
      <div
        class="px-4 py-2 max-w-full"
        style="max-width: 800px; word-break: break-word"
      >
        <p class="text-gray-700 text-sm leading-relaxed line-clamp-2">
          {{ post.content }}
        </p>
      </div>

      <!-- Footer with metrics -->
      <div class="px-4 py-3 flex items-center gap-6">
        <button
          class="flex items-center gap-1.5 text-gray-500 hover:text-gray-700"
        >
          <ThumbsUp class="w-4 h-4" />
          <span class="text-sm">{{ formatNumber(post.likes) }}</span>
        </button>

        <div class="flex items-center gap-1.5 text-gray-500">
          <Eye class="w-4 h-4" />
          <span class="text-sm">{{ formatNumber(post.views) }}</span>
        </div>

        <button
          class="flex items-center gap-1.5 text-gray-500 hover:text-gray-700"
        >
          <MessageCircle class="w-4 h-4" />
          <span class="text-sm">{{ formatNumber(post.comments) }}</span>
        </button>

        <button
          class="flex items-center gap-1.5 text-gray-500 hover:text-gray-700"
        >
          <Star class="w-4 h-4" />
          <span class="text-sm">{{ formatNumber(post.stars) }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Tag as ATag } from "ant-design-vue";
import { ThumbsUp, Eye, MessageCircle, Star } from "lucide-vue-next";
import { formatNumber } from "../../utils/format.js";
import { useRouter } from "vue-router";

const router = useRouter();
const props = defineProps({
  // 修改这里：正确声明 props
  post: {
    type: Object,
    required: true,
  },
});

const goToDetail = () => {
  router.push({
    name: "PostDetail",
    params: { id: props.post.id },
  });
};
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

/* 删除原有的分割线样式 */
</style>
