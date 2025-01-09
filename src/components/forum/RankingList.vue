<template>
  <div class="w-full rounded-2xl bg-white p-5">
    <h2 class="text-xl font-bold mb-4 text-gray-900">{{ title }}</h2>
    <div class="space-y-4">
      <div v-for="(user, index) in rankings" 
           :key="user.id"
           class="flex items-center justify-between hover:bg-gray-50 p-2 rounded-lg transition-colors">
        <div class="flex items-center gap-3">
          <!-- 排名序号 -->
          <span :class="[
            'w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium',
            getRankingStyle(index)
          ]">{{ index + 1 }}</span>
          
          <!-- 用户头像 -->
          <img :src="user.avatar" 
               :alt="user.name" 
               class="w-8 h-8 rounded-full object-cover"
               @error="handleAvatarError">
          
          <!-- 用户名称 -->
          <span class="text-gray-700">{{ user.name }}</span>
        </div>
        
        <!-- 解题数量 -->
        <span class="text-blue-500 font-medium">{{ user.solved }}题</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  title: {
    type: String,
    default: '题解榜'
  },
  rankings: {
    type: Array,
    required: true,
    default: () => []
  }
});

// 处理头像加载失败
const handleAvatarError = (e) => {
  e.target.src = 'https://via.placeholder.com/32'; // 设置默认头像
};

// 获取排名样式
const getRankingStyle = (index) => {
  if (index === 0) return 'bg-yellow-500 text-white';
  if (index === 1) return 'bg-gray-300 text-white';
  if (index === 2) return 'bg-yellow-600 text-white';
  return 'bg-gray-100 text-gray-500';
};
</script>

<style scoped>
.hover\:bg-gray-50:hover {
  background-color: rgba(249, 250, 251, 0.8);
}
</style>
