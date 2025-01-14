<template>
  <div class="w-screen min-h-screen flex flex-col items-center gap-[20px] mt-[20px] mb-[40px]">
    <!-- Header Section -->
    <div class="w-[1200px] rounded-2xl p-6">
      <div class="w-full">
        <div class="flex items-center gap-4">
          <img src="https://srv.carbonads.net/static/30242/4f7f59796c5dda8f5dfc63a40583dfde7cebb050" alt="Avatar" class="w-16 h-16 rounded-full" />
          <div>
            <h1 class="text-2xl font-bold">咕</h1>
            <p class="text-gray-500">MgGUCFVB7R</p>
            <p class="text-gray-600">全站排名 100,000</p>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Content Section -->
    <div class="w-[1200px] flex justify-center gap-[20px] items-start">
      <div class="w-[300px] bg-white rounded-2xl p-6">
        <div class="sticky top-5 w-full space-y-6">
          <!-- 数据统计网格 -->
          <div class="grid grid-cols-2 gap-4">
            <div class="bg-gray-50 p-4 rounded-lg text-center">
              <div class="text-gray-500 text-sm">阅读总数</div>
              <div class="text-xl font-bold text-gray-700 mt-1">2,156</div>
            </div>
            <div class="bg-gray-50 p-4 rounded-lg text-center">
              <div class="text-gray-500 text-sm">获得点赞</div>
              <div class="text-xl font-bold text-gray-700 mt-1">328</div>
            </div>
            <div class="bg-gray-50 p-4 rounded-lg text-center">
              <div class="text-gray-500 text-sm">获得收藏</div>
              <div class="text-xl font-bold text-gray-700 mt-1">156</div>
            </div>
            <div class="bg-gray-50 p-4 rounded-lg text-center">
              <div class="text-gray-500 text-sm">积分</div>
              <div class="text-xl font-bold text-gray-700 mt-1">1,280</div>
            </div>
          </div>

          <!-- 关注信息 -->
          <div class="flex justify-between p-4 bg-gray-50 rounded-lg">
            <div class="text-center">
              <div class="font-bold">关注了</div>
              <div class="text-gray-600">42</div>
            </div>
            <div class="text-center">
              <div class="font-bold">关注者</div>
              <div class="text-gray-600">128</div>
            </div>
          </div>

          <!-- 个人信息卡片 -->
          <div class="space-y-4">
            <div class="flex items-center gap-2 text-gray-600">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span>全栈开发工程师</span>
            </div>
            <div class="flex items-center gap-2 text-gray-600">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>深圳市</span>
            </div>
            <div class="flex items-center gap-2 text-gray-600">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>已加入 365 天</span>
            </div>
          </div>

          <!-- 操作按钮 -->
          <button class="w-full bg-green-50 text-green-600 py-2 rounded-lg mb-4 hover:bg-green-100 transition-colors">
            编辑个人资料
          </button>

          <!-- 求职相关 -->
          <div class="space-y-4">
            <div class="text-gray-600">定制你的理想工作机会</div>
            <div class="bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
              填写求职意向
            </div>
            <div class="bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
              完善简历信息
            </div>
          </div>
        </div>
      </div>
      <div class="w-[880px] flex flex-col gap-4">
        <div class="grid grid-cols-2 gap-4">
          <!-- 第一个卡片：解题进度 -->
          <div class="bg-white rounded-2xl">
            <div class="flex items-start gap-6">
              <!-- Echarts图表区域 -->
              <div class="relative flex-[7]">
                <div ref="chartRef" class="w-full h-[200px]"></div> <!-- 将高度从 150px 改为 200px -->
              </div>
              
              <!-- 右侧数据展示 -->
              <div class="flex flex-col gap-4 flex-[3] min-w-[120px]">
                <div class="flex items-center justify-between">
                  <div class="text-sm text-gray-500">简单</div>
                  <div class="text-lg font-bold text-green-600">0/50</div>
                </div>
                <div class="flex items-center justify-between">
                  <div class="text-sm text-gray-500">中等</div>
                  <div class="text-lg font-bold text-yellow-500">0/50</div>
                </div>
                <div class="flex items-center justify-between">
                  <div class="text-sm text-gray-500">困难</div>
                  <div class="text-lg font-bold text-red-500">0/50</div>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-white rounded-2xl p-6">
            <div class="text-gray-500">内容区域 2</div>
          </div>
          <div class="bg-white rounded-2xl p-6">
            <div class="text-gray-500">内容区域 3</div>
          </div>
          <div class="bg-white rounded-2xl p-6">
            <div class="text-gray-500">内容区域 4</div>
          </div>
        </div>
        
        <!-- 第三行单独区域 -->
        <div class="bg-white rounded-2xl p-6">
          <div class="text-gray-500">内容区域 5</div>
        </div>
      </div>
    </div>
  </div>
</template>
  
<script setup>
import { ref, computed, onMounted } from 'vue'
import * as echarts from 'echarts'

const chartRef = ref(null)

onMounted(() => {
  const chart = echarts.init(chartRef.value)
  
  const option = {
    series: [
      {
        name: 'Access From',
        type: 'pie',
        center: ['50%', '50%'], // 确保图表居中
        radius: ['60%', '75%'], // 增大默认的饼图尺寸
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 8
        },
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 18, // 减小悬停时的文字大小
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        data: [
          { value: 1048, name: '中等' },
          { value: 735, name: '困难' },
          { value: 580, name: '简单' }
        ]
      }
    ]
  }
  
  chart.setOption(option)
})

const leftProgress = ref(0.6)    // 60%
const middleProgress = ref(0.4)  // 40%
const rightProgress = ref(0.2)   // 20%

const leftSolved = ref(30)
const leftTotal = ref(50)
const middleSolved = ref(20)
const middleTotal = ref(50)
const rightSolved = ref(10)
const rightTotal = ref(50)

const solved = computed(() => leftSolved.value + middleSolved.value + rightSolved.value)
const total = computed(() => leftTotal.value + middleTotal.value + rightTotal.value)

// 根据进度返回颜色
const getColorByProgress = (progress) => {
  if (progress >= 0.65) return '#52c41a'    // 绿色
  if (progress >= 0.33) return '#faad14'    // 黄色
  return '#ff4d4f'                          // 红色
}

// 修改计算弧长的方法
const getArcLength = (progress, maxLength) => `${progress * maxLength} ${maxLength}`
</script>