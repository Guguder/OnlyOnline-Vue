<template>
  <div class="bg-white rounded-2xl p-5">
    <div class="flex items-center justify-between mb-4">
      <span class="text-lg font-medium">必读榜</span>
      <div class="flex gap-0.5">
        <button 
          v-for="period in periods" 
          :key="period.value"
          @click="currentPeriod = period.value"
          :class="[
            'px-2 py-1 text-sm rounded-lg transition-colors',
            currentPeriod === period.value
              ? 'bg-purple-500 text-white'
              : 'text-gray-500 hover:bg-gray-100'
          ]"
        >
          {{ period.label }}
        </button>
      </div>
    </div>
    
    <div class="space-y-4">
      <div 
        v-for="(item, index) in list" 
        :key="item.id"
        class="flex items-start gap-3 group cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
      >
        <!-- 修改序号样式和对齐方式 -->
        <div class="flex-shrink-0 w-6 h-6 rounded-lg bg-gray-100 flex items-center justify-center text-sm self-center" 
             :class="index < 3 ? 'bg-purple-500 text-white' : 'text-gray-500'">
          {{ index + 1 }}
        </div>
        
        <!-- 头像 -->
        <div class="flex-shrink-0 w-10 h-10 rounded-lg overflow-hidden">
          <img :src="item.avatar" alt="avatar" class="w-full h-full object-cover">
        </div>
        
        <!-- 内容区 -->
        <div class="flex-1 min-w-0" @click="goToArticle(item.id)">
          <h3 class="text-sm font-medium text-gray-900 truncate group-hover:text-purple-500 cursor-pointer">
            {{ item.title }}
          </h3>
          <!-- 修改阅读量和点赞量的显示 -->
          <p class="text-xs text-gray-500 mt-1 cursor-pointer">
            {{ formatNumber(item.views) }}阅读 · {{ formatNumber(item.likes) }}点赞
          </p>
        </div>
        
        <!-- 修改未读标记的位置 -->
        <div 
          v-if="!item.isRead"
          class="flex-shrink-0 w-2.5 h-2.5 bg-red-500 self-center rounded"
        ></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { formatNumber } from '../../utils/format.js'  // 导入格式化函数
import { useRouter } from 'vue-router'

const props = defineProps({
  list: {
    type: Array,
    required: true,
    // 定义期望的数据结构
    validator: (value) => {
      return value.every(item => 
        'id' in item && 
        'title' in item && 
        'views' in item && 
        'likes' in item && 
        'avatar' in item && 
        'isRead' in item
      )
    }
  }
})

const periods = [
  { label: '日', value: 'day' },
  { label: '周', value: 'week' },
  { label: '月', value: 'month' }
]

const currentPeriod = ref('day')

const router = useRouter()

const goToArticle = (id) => {
  router.push(`/article/${id}`)
}
</script>

<style scoped>
.rounded-lg {
  transition: all 0.2s ease;
}

.group:hover .text-gray-900 {
  color: var(--purple-500);
}
</style>
