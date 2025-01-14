<template>
<div class="flex flex-col items-center">
  <div class="flex gap-2">
    <!-- 贡献图表 -->
    <div
        class="grid grid-flow-col gap-1"
        role="grid"
        aria-label="贡献活动图表"
    >
      <div
          v-for="(week, weekIndex) in contributionData"
          :key="weekIndex"
          class="grid grid-rows-7 gap-1"
          role="row"
      >
        <div
            v-for="(day, dayIndex) in week"
            :key="`${weekIndex}-${dayIndex}`"
            :style="{
              width: `${cellSize}px`,
              height: `${cellSize}px`
            }"
            class="rounded-sm"
            :class="[
              day.isFuture ? 'invisible' : (day.count > 0 ? 'bg-green-500' : 'bg-gray-100')
            ]"
            role="gridcell"
        >
          <a-tooltip overlayClassName="heatmap-tooltip">
            <template #title>
              <span>{{ formatDate(day.date) }} {{ day.count > 0 ? '已完成' : '未完成' }}</span>
            </template>
            <div class="w-full h-full"></div>
          </a-tooltip>
        </div>
      </div>
    </div>
  </div>
  <!-- 月份显示 -->
  <div class="grid grid-cols-3 w-full mt-3 px-6">
    <div v-for="month in displayMonths" 
        :key="month" 
        class="text-[16] text-gray-600 text-center">  <!-- 将 text-xs 改为 text-sm -->
      {{ month }}月
    </div>
  </div>
</div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { Tooltip as ATooltip } from 'ant-design-vue'

// 添加 props 定义
const props = defineProps({
  completionData: {
    type: Array,
    required: true,
    default: () => []
  },
  cellSize: {
    type: Number,
    default: 12
  }
})

// 修改数据生成函数
const generateMockData = () => {
  const weeks = 17
  const data = []
  const today = new Date()
  
  // 计算起始日期（从今天往前推到最近的周一）
  const startDate = new Date(today)
  const todayDayOfWeek = today.getDay()
  // 调整到本周一：0是周日，1是周一，所以要特殊处理
  const daysToMonday = todayDayOfWeek === 0 ? 6 : todayDayOfWeek - 1
  startDate.setDate(today.getDate() - daysToMonday) // 调整到本周一
  startDate.setDate(startDate.getDate() - (weeks - 1) * 7) // 再往前推指定的周数

  for (let w = 0; w < weeks; w++) {
    const week = []
    for (let d = 0; d < 7; d++) {
      const currentDate = new Date(startDate)
      currentDate.setDate(startDate.getDate() + (w * 7 + d))
      const dateString = currentDate.toISOString().split('T')[0]
      
      const completionItem = props.completionData.find(item => item.Date === dateString)
      const isFuture = currentDate > today

      week.push({
        date: dateString,
        count: completionItem?.isDo === "true" ? 1 : 0,
        isFuture
      })
    }
    data.push(week)
  }

  return data
}

// 添加日期格式化函数
const formatDate = (dateString) => {
  const date = new Date(dateString)
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  return `${year}年${month}月${day}日`
}

// 修改月份计算逻辑
const displayMonths = computed(() => {
  const today = new Date()
  const currentDate = today.getDate()
  const currentMonth = today.getMonth() + 1 // JavaScript 月份从0开始
  
  // 如果当前日期超过16号，显示到当前月
  // 否则显示到上个月
  const endMonth = currentDate > 16 ? currentMonth : currentMonth - 1
  
  let months = []
  for (let i = 2; i >= 0; i--) {
    let month = endMonth - i
    // 如果月份小于1，需要加12来获取上一年的月份
    if (month <= 0) {
      month = month + 12
    }
    months.push(month)
  }
  
  return months
})

// 状态
const contributionData = ref([])

// 组件挂载时生成模拟数据
onMounted(() => {
  contributionData.value = generateMockData()
})
</script>

<style scoped>
.ant-tooltip {
  font-size: 12px;
}

:global(.heatmap-tooltip) {
  font-size: 11px !important;
}

:global(.heatmap-tooltip .ant-tooltip-inner) {
  background-color: white !important;
  color: #666 !important;
  padding: 4px 8px !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  text-align: center !important;
  min-height: 24px !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
}

:global(.heatmap-tooltip .ant-tooltip-arrow) {
  --antd-arrow-background-color: white !important;
}

:global(.heatmap-tooltip .ant-tooltip-arrow::before) {
  background-color: white !important;
}

:global(.heatmap-tooltip .ant-tooltip-arrow::after) {
  background-color: white !important;
}
</style>