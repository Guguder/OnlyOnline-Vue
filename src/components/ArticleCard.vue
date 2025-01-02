<template>
  <div class="w-full bg-white p-4 flex gap-4">
    <!-- 左侧头像区域 -->
    <div class="w-12 flex-shrink-0">
      <img :src="article.avatar" alt="avatar" class="w-12 h-12 rounded-full"/>
    </div>

    <!-- 右侧内容区域 -->
    <div class="flex-1 flex flex-col justify-between min-w-0">
      <div class="flex flex-col w-full">
        <span class="text-sm leading-none text-gray-800 text-left mb-2">{{ article.nickname }}</span>
        <h2 class="text-base font-semibold leading-tight text-[#000000] text-left mb-2 truncate">{{
            article.title
          }}</h2>
        <p class="text-sm leading-normal text-gray-600 text-left truncate max-w-[590px]">
          {{ article.content }}
        </p>

      </div>

      <!-- 互动按钮区域 -->
      <div class="flex items-center text-gray-400 mt-3 pl-0">
        <!-- 点赞 -->
        <div class="flex items-center mr-6">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24"
               stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"/>
          </svg>
          <span class="text-xs">{{ article.likes }}</span>
        </div>

        <!-- 评论 -->
        <div class="flex items-center mr-6">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24"
               stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
          </svg>
          <span class="text-xs">{{ article.comments }}</span>
        </div>

        <!-- 收藏 -->
        <div class="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24"
               stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/>
          </svg>
          <span class="text-xs">{{ article.favorites }}</span>
        </div>
      </div>
    </div>

    <!-- 右侧图片区域（如果有） -->
    <div v-if="article.image" class="w-24 flex-shrink-0"> <!-- 添加固定宽度 -->
      <img
          :src="article.image"
          :alt="article.title"
          class="w-24 h-24 object-cover rounded-lg"
          @error="handleImageError"
      />
    </div>
  </div>
</template>

<script setup>
import {ref} from 'vue';

const props = defineProps({
  article: {
    type: Object,
    required: true,
    default: () => ({
      id: '',
      avatar: '',
      nickname: '',
      title: '',
      content: '',
      image: null,
      likes: 0,
      comments: 0,
      favorites: 0
    })
  }
});

// 处理图片加载失败
const handleImageError = (e) => {
  e.target.style.display = 'none';
};
</script>

<style scoped>
.truncate {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>