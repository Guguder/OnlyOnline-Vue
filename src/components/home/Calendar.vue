<template>
  <div class="custom-calendar rounded-2xl bg-white p-4">
    <div class="text-xl font-bold mb-1 text-gray-900 text-left pl-2 pt-1">每日一题</div>
    <table class="w-full border-separate border-spacing-0">
      <thead>
      <tr>
        <th v-for="day in ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']" :key="day"
            class="py-3 text-center text-gray-600 text-sm">
          {{ day }}
        </th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="week in calendar" :key="week[0].date">
        <td v-for="day in week" :key="day.date"
            class="text-center relative group cursor-pointer h-[40px]"
            @click="handleDateClick(day)">
          <div :class="[
              'w-8 h-8 mx-auto flex items-center justify-center rounded-full',  // 这里修改尺寸
              'text-gray-900 transition-all duration-200 text-sm hover:bg-blue-50',
              {
                'opacity-0': !day.dayOfMonth,
                'bg-blue-500 text-white hover:bg-blue-600': day.isToday
              }
            ]">
            {{ day.dayOfMonth }}
          </div>
          <!-- 悬停提示 -->
          <div v-if="getQuestionByDate(day.date)"
               class="absolute hidden group-hover:block bg-white shadow-xl rounded-lg p-4 z-50 w-[280px] left-1/2 transform -translate-x-1/2 mt-2 pointer-events-none">
            <div class="text-blue-600 text-sm mb-2">{{ formatDate(day.date) }}</div>
            <div class="text-gray-800 text-sm leading-6">{{ getQuestionByDate(day.date) }}</div>
          </div>
        </td>
      </tr>
      </tbody>
    </table>
    <!-- 分割线 -->
    <div class="my-2 h-[1px] bg-[#E5E5E5]"></div>
    <div class="flex items-center justify-center gap-12 pt-2 pb-4">
      <div class="flex flex-col items-center flex-1">
        <div class="text-sm text-gray-500 mt-1">连续提交</div>
        <div class="flex justify-center w-full items-center">
          <span class="text-xl font-bold text-gray-800">{{ continuousSubmit }}</span>
          <span class="text-sm text-gray-500 ml-1 flex items-center">天</span>
        </div>
      </div>

      <div class="flex flex-col items-center flex-1">
        <div class="text-sm text-gray-500 mt-1">本月解决</div>
        <div class="flex justify-center w-full items-center">
          <span class="text-xl font-bold text-gray-800">{{ monthSolved }}</span>
          <span class="text-sm text-gray-500 ml-1 flex items-center">题</span>
        </div>
      </div>

      <div class="flex flex-col items-center flex-1">
        <div class="text-sm text-gray-500 mt-1">每日一题</div>
        <div class="flex justify-center w-full items-center">
          <span class="text-xl font-bold text-gray-800">{{ dailyStreak }}</span>
          <span class="text-sm text-gray-500 ml-1 flex items-center">连胜</span>
        </div>
      </div>
    </div>
    <div class="w-full">  <!-- 添加容器 -->
      <ActivityHeatmap
        :completion-data="completionData"
        :cell-size="14"
      />
    </div>
  </div>
</template>

<script setup>
import {ref, computed, onMounted, onUnmounted} from 'vue';
import dayjs from 'dayjs';
import ActivityHeatmap from "./ActivityHeatmap.vue";

const continuousSubmit = ref(0)
const monthSolved = ref(0)
const dailyStreak = ref(0)

// 修改 props 的类型定义
const props = defineProps({
  dayDetails: {
    type: Array,
    required: true
  },
  completionData: {
    type: Array,
    required: true,
    default: () => []
  }
});

// 当前日期的响应式引用
const currentDate = ref(dayjs());
let timer = null;

// 更新当前日期
const updateCurrentDate = () => {
  currentDate.value = dayjs();
  calendar.value = generateCalendar();
};

// 格式化日期显示
const formatDate = (date) => {
  return dayjs(date).format('YYYY年MM月DD日');
};

// 生成日历数据
const generateCalendar = () => {
  const now = currentDate.value;
  const startOfMonth = now.startOf('month');
  const endOfMonth = now.endOf('month');
  const startDay = startOfMonth.day();

  const calendar = [];
  let currentWeek = [];

  // 填充月初空白日期
  for (let i = 0; i < startDay; i++) {
    currentWeek.push({date: '', dayOfMonth: '', isToday: false});
  }

  // 填充当月日期
  for (let day = 1; day <= endOfMonth.date(); day++) {
    const date = startOfMonth.date(day).format('YYYY-MM-DD');
    currentWeek.push({
      date,
      dayOfMonth: day,
      isToday: date === now.format('YYYY-MM-DD')
    });

    if (currentWeek.length === 7) {
      calendar.push(currentWeek);
      currentWeek = [];
    }
  }

  // 填充月末空白日期
  if (currentWeek.length > 0) {
    while (currentWeek.length < 7) {
      currentWeek.push({date: '', dayOfMonth: '', isToday: false});
    }
    calendar.push(currentWeek);
  }

  return calendar;
};

// 组件挂载时启动定时器
onMounted(() => {
  // 立即生成一次日历
  calendar.value = generateCalendar();

  // 设置定时器，每分钟更新一次
  timer = setInterval(() => {
    updateCurrentDate();
  }, 60000); // 每分钟更新一次
});

// 组件卸载时清除定时器
onUnmounted(() => {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
});

const calendar = ref([]);

// 添加根据日期获取问题的方法
const getQuestionByDate = (date) => {
  if (!date) return null;
  const questionItem = props.dayDetails.find(item => item.Date === date);
  return questionItem ? questionItem.Question : null;
};

// 修改点击事件处理
const handleDateClick = (day) => {
  const question = getQuestionByDate(day.date);
  if (day.date && question) {
    console.log(`今天是：${day.date}，题目：${question}`);
  }
};

</script>

<style scoped>
.custom-calendar {
}

.custom-calendar th {
  font-weight: 500;
  height: 40px;
}

/* 调整单元格样式 */
.custom-calendar td {
  border-radius: 9999px;
  transition: all 0.2s;
  vertical-align: middle;
  padding: 0;
}

/* 悬浮框相关样式 */
.group-hover\:block {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
  display: none;
}

.group:hover .group-hover\:block {
  display: block;
}

.group {
  position: relative;
  z-index: 1;
}

.group:hover {
  z-index: 10;
}

.group-hover\:block .text-gray-900,
.group-hover\:block .text-gray-600 {
  margin: 0;
  line-height: 1.5;
}

/* 日期单元格交互样式 */
.custom-calendar td:hover .rounded-full:not(.bg-blue-500) {
  background-color: #EBF5FF;
  color: #2563EB;
}

/* 悬浮提示小三角 */
.group:hover .group-hover\:block::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 50%;
  transform: translateX(-50%);
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  border-top: 4px solid #1f2937;
}

</style>
