<template>
  <div class="w-screen min-h-screen flex justify-center gap-[20px] mt-[20px] mb-[40px]">
    <div class="w-[840px] bg-white rounded-2xl p-6">
      <h1 class="text-2xl font-bold text-gray-900 mb-4">{{ article.title }}</h1>
      
      <!-- 作者信息 -->
      <div class="flex items-center gap-3 mb-6">
        <img :src="article.avatar" class="w-10 h-10 rounded-full">
        <div class="flex flex-col">
          <span class="text-sm font-medium">{{ article.author }}</span>
          <span class="text-xs text-gray-500">{{ article.createTime }}</span>
        </div>
      </div>
      
      <!-- 文章内容 -->
      <div class="prose max-w-none">
        {{ article.content }}
      </div>
      
      <!-- 底部数据 -->
      <div class="flex items-center gap-6 mt-8 pt-4 border-t">
        <div class="flex items-center gap-2 text-gray-500">
          <Eye class="w-4 h-4"/>
          <span>{{ formatNumber(article.views) }}</span>
        </div>
        <div class="flex items-center gap-2 text-gray-500">
          <ThumbsUp class="w-4 h-4"/>
          <span>{{ formatNumber(article.likes) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { Eye, ThumbsUp } from 'lucide-vue-next'
import { formatNumber } from '../../utils/format.js'

const route = useRoute()
const articleId = route.params.id

// 模拟文章数据
const article = ref({
  id: articleId,
  title: '2024年前端面试路线图',
  author: '技术派',
  avatar: 'https://pic.leetcode.cn/1699000361-IIuoOH-%E9%9B%B6%E8%B5%B7%E6%AD%A5%E5%AD%A6%E7%AE%97%E6%B3%95.png',
  createTime: '2024-01-15 10:00',
  content: `这是一篇详细的前端面试指南...
  
1. JavaScript基础
- 变量和类型
- 作用域和闭包
- 原型和继承
- 异步编程

2. 框架掌握
- Vue3核心原理
- React最佳实践
- 状态管理方案

3. 工程化
- Webpack配置
- Vite使用
- CI/CD流程

...更多内容`,
  views: 12000,
  likes: 3200
})

// 后续可以在这里调用API获取文章详情
onMounted(() => {
  console.log('获取文章详情:', articleId)
})
</script>
