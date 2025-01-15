<template>
  <div class="flex flex-col w-full">
    <!-- 贡献图表 -->
    <div class="flex">
      <div class="flex gap-[2px]">
        <div
          v-for="(month, monthIndex) in contributionData"
          :key="monthIndex"
          class="flex gap-[2px]"
          :style="{ marginRight: monthIndex < 11 ? '6px' : '0' }"
        >
          <div
            v-for="(week, weekIndex) in month"
            :key="`${monthIndex}-${weekIndex}`"
            class="grid grid-rows-7 gap-[2px]"
          >
            <div
              v-for="(day, dayIndex) in week"
              :key="`${monthIndex}-${weekIndex}-${dayIndex}`"
              :style="{
                width: `${cellSize}px`,
                height: `${cellSize}px`,
                visibility: day.visible ? 'visible' : 'hidden',
              }"
              class="rounded-[2px] transition-colors duration-200"
              :class="getContributionClass(day.count)"
            >
              <a-tooltip>
                <template #title>
                  {{ formatDate(day.date) }}
                  {{ getTooltipText(day.count) }}
                </template>
                <div class="w-full h-full"></div>
              </a-tooltip>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 月份标题 -->
    <div class="flex mt-2">
      <div
        v-for="(month, monthIndex) in months"
        :key="month"
        :style="{
          width: `${getMonthWidth(month)}px`,
          marginRight: monthIndex < 11 ? '6px' : '0',
          textAlign: 'center',
          paddingRight: monthIndex < 11 ? '6px' : '0', // 补偿右边距的影响
        }"
        class="text-[14px] text-gray-500"
      >
        {{ month }}月
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { Tooltip as ATooltip } from "ant-design-vue";

const props = defineProps({
  year: {
    type: Number,
    required: true,
  },
  recordType: {
    type: String,
    required: true,
    validator: (value) => ["problems", "logins"].includes(value),
  },
});

const cellSize = 10; // 减小格子尺寸
const months = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];

// 根据贡献数量返回对应的颜色类名
const getContributionClass = (count) => {
  if (count === 0) return "bg-gray-100";
  if (count <= 3) return "bg-green-100";
  if (count <= 6) return "bg-green-300";
  if (count <= 9) return "bg-green-500";
  return "bg-green-700";
};

// 修改计算每月宽度的方法
const getMonthWidth = (month) => {
  const date = new Date(new Date().getFullYear(), parseInt(month) - 1, 1);
  const daysInMonth = new Date(
    date.getFullYear(),
    date.getMonth() + 1,
    0
  ).getDate();
  const firstDay = date.getDay();
  const weeksInMonth = Math.ceil((daysInMonth + firstDay) / 7);
  return weeksInMonth * (cellSize + 2); // 使用格子大小加间距
};

// 格式化日期
const formatDate = (date) => {
  return new Date(date).toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  });
};

// 修改生成年度数据方法，使用传入的年份
const generateYearData = () => {
  const data = [];
  const targetYear = props.year;

  // 遍历每个月
  for (let month = 0; month < 12; month++) {
    const monthData = [];
    const date = new Date(targetYear, month, 1);
    const daysInMonth = new Date(targetYear, month + 1, 0).getDate();
    const firstDayOfMonth = date.getDay();

    // 创建月份数据结构
    let currentWeek = Array(7).fill(null);
    let weekData = [];

    // 填充月初空白天数
    for (let i = 0; i < firstDayOfMonth; i++) {
      currentWeek[i] = { visible: false };
    }

    // 填充实际日期
    for (let day = 1; day <= daysInMonth; day++) {
      const currentDate = new Date(targetYear, month, day);
      const dayOfWeek = currentDate.getDay();

      currentWeek[dayOfWeek] = {
        date: currentDate,
        count: Math.floor(Math.random() * 12), // 示例数据
        visible: true,
      };

      // 当周完成或月末，推入新的周数据
      if (dayOfWeek === 6 || day === daysInMonth) {
        weekData.push([...currentWeek]);
        currentWeek = Array(7).fill({ visible: false });
      }
    }

    monthData.push(...weekData);
    data.push(monthData);
  }

  return data;
};

const getTooltipText = (count) => {
  if (props.recordType === "problems") {
    return count > 0 ? `完成 ${count} 个题目` : "未完成题目";
  }
  return count > 0 ? `登录 ${count} 次` : "未登录";
};

const contributionData = ref([]);

// 监听年份变化
watch(
  () => props.year,
  () => {
    contributionData.value = generateYearData();
  }
);

onMounted(() => {
  contributionData.value = generateYearData();
});
</script>

<style scoped>
.contribution-cell {
  transition: all 0.2s ease;
}

.contribution-cell:hover {
  transform: scale(1.1);
}

:deep(.contribution-grid) {
  width: 100%;
  overflow-x: auto;
}

/* 添加月份文字居中样式 */
.text-xs {
  white-space: nowrap;
  display: inline-block;
}
</style>
