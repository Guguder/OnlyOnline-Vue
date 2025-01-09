<template>
  <div class="min-h-screen bg-gray-50 p-4">
    <!-- 顶部导航 - 使用更精确的圆角和内边距 -->
    <div class="bg-white rounded-lg shadow p-4 mb-4">
      <div class="flex flex-wrap gap-3">
        <button class="bg-gray-900 text-white px-5 py-2 rounded-full text-sm font-medium">
          <div class="flex items-center">
            <svg class="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 4H5a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M9 14H5a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M19 14h-4a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M19 4h-4a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            全部题目
          </div>
        </button>
        <button class="bg-gray-50 hover:bg-gray-100 px-5 py-2 rounded-full text-sm font-medium transition-colors">
          <div class="flex items-center">
            <span class="text-orange-500 mr-2">⚡</span>
            算法
          </div>
        </button>
        <button class="bg-gray-50 hover:bg-gray-100 px-5 py-2 rounded-full text-sm font-medium transition-colors">
          <div class="flex items-center">
            <span class="text-blue-500 mr-2">📊</span>
            数据库
          </div>
        </button>
        <button class="bg-gray-50 hover:bg-gray-100 px-5 py-2 rounded-full text-sm font-medium transition-colors">
          <div class="flex items-center">
            <span class="text-green-500 mr-2">$</span>
            Shell
          </div>
        </button>
        <button class="bg-gray-50 hover:bg-gray-100 px-5 py-2 rounded-full text-sm font-medium transition-colors">
          <div class="flex items-center">
            <span class="text-purple-500 mr-2">⚙</span>
            多线程
          </div>
        </button>
        <button class="bg-gray-50 hover:bg-gray-100 px-5 py-2 rounded-full text-sm font-medium transition-colors">
          <div class="flex items-center">
            <span class="text-blue-400 mr-2">
              <span class="font-semibold">JS</span>
            </span>
            JavaScript
          </div>
        </button>
        <button class="bg-gray-50 hover:bg-gray-100 px-5 py-2 rounded-full text-sm font-medium transition-colors">
          <div class="flex items-center">
            <span class="text-blue-600 mr-2">🐼</span>
            pandas
          </div>
        </button>
      </div>

      <!-- 子导航 -->
      <div class="flex flex-wrap items-center mt-4 gap-2">
        <div class="flex-none">
          <button class="flex items-center bg-gray-50 hover:bg-gray-100 px-4 py-2 rounded-lg text-sm">
            题单
            <ChevronDown class="h-4 w-4 ml-1" />
          </button>
        </div>
        <div class="flex-none">
          <button class="flex items-center bg-gray-50 hover:bg-gray-100 px-4 py-2 rounded-lg text-sm">
            难度
            <ChevronDown class="h-4 w-4 ml-1" />
          </button>
        </div>
        <div class="flex-none">
          <button class="flex items-center bg-gray-50 hover:bg-gray-100 px-4 py-2 rounded-lg text-sm">
            状态
            <ChevronDown class="h-4 w-4 ml-1" />
          </button>
        </div>
        <div class="flex-none">
          <button class="flex items-center bg-gray-50 hover:bg-gray-100 px-4 py-2 rounded-lg text-sm">
            标签
            <ChevronDown class="h-4 w-4 ml-1" />
          </button>
        </div>
        <div class="flex-1 min-w-[200px]">
          <div class="relative">
            <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
                type="text"
                placeholder="搜索题目、编号或内容"
                class="w-full pl-10 pr-4 py-2 bg-gray-50 rounded-lg text-sm"
            >
          </div>
        </div>
        <button class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm flex items-center transition-colors">
          <Shuffle class="h-4 w-4 mr-1" />
          随机一题
        </button>
      </div>
    </div>

    <!-- 题目列表 -->
    <div class="bg-white rounded-lg shadow overflow-x-auto">
      <table class="w-full">
        <thead class="bg-gray-50">
        <tr>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">状态</th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">题目</th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">题解</th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">通过率</th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">难度</th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">出题频率</th>
        </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
        <tr v-for="problem in problems" :key="problem.id" class="hover:bg-gray-50">
          <td class="px-6 py-4 whitespace-nowrap">
            <CheckCircle2 v-if="problem.status === 'done'" class="h-5 w-5 text-green-500" />
            <Circle v-else class="h-5 w-5 text-gray-300" />
          </td>
          <td class="px-6 py-4 whitespace-nowrap">{{ problem.title }}</td>
          <td class="px-6 py-4 whitespace-nowrap">{{ problem.solutions }}</td>
          <td class="px-6 py-4 whitespace-nowrap">{{ problem.passRate }}</td>
          <td class="px-6 py-4 whitespace-nowrap">
              <span :class="{
                'text-green-500': problem.difficulty === '简单',
                'text-yellow-500': problem.difficulty === '中等',
                'text-red-500': problem.difficulty === '困难'
              }">{{ problem.difficulty }}</span>
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
            <Lock class="h-4 w-4 text-gray-400" />
          </td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import {
  ChevronDown,
  Search,
  Shuffle,
  CheckCircle2,
  Circle,
  Lock
} from 'lucide-vue-next'

const problems = ref([
  {
    id: 1,
    status: 'done',
    title: '3019. 按键变更的次数',
    solutions: '127',
    passRate: '84.0%',
    difficulty: '简单'
  },
  {
    id: 2,
    status: 'none',
    title: '1. 两数之和',
    solutions: '26363',
    passRate: '54.5%',
    difficulty: '简单'
  },
  {
    id: 3,
    status: 'none',
    title: '2. 两数相加',
    solutions: '14535',
    passRate: '44.7%',
    difficulty: '中等'
  },
  {
    id: 4,
    status: 'none',
    title: '3. 无重复字符的最长子串',
    solutions: '17326',
    passRate: '40.5%',
    difficulty: '中等'
  },
  {
    id: 5,
    status: 'none',
    title: '4. 寻找两个正序数组的中位数',
    solutions: '8358',
    passRate: '42.9%',
    difficulty: '困难'
  }
])
</script>
<style scoped>
</style>