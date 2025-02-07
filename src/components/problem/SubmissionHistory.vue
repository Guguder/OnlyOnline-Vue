<template>
  <div class="bg-white">
    <table class="w-full max-w-2xl">
      <thead class="bg-gray-50">
        <tr class="h-12">
          <th class="px-4 text-left tracking-wider w-[120px] relative">
            <!-- 添加 relative 和固定宽度 -->
            <div class="flex items-center h-full pr-8">
              <!-- 修改这里，移除 justify-between -->
              <span
                class="text-sm font-semibold truncate"
                :class="
                  selectedStatus
                    ? getTextColorClass(selectedStatus)
                    : 'text-gray-500'
                "
              >
                {{
                  selectedStatus ? getStatusLabel(selectedStatus) : "所有状态"
                }}
              </span>
              <div class="absolute right-4 top-1/2 -translate-y-[55%]">
                <!-- 添加容器div -->
                <a-dropdown
                  v-model:visible="dropdownVisible"
                  trigger="click"
                  placement="bottomRight"
                >
                  <down-outlined
                    class="text-gray-400 hover:text-gray-600 cursor-pointer transform transition-all"
                    :class="{
                      'rotate-180': dropdownVisible,
                      'text-blue-500': selectedStatus,
                    }"
                  />
                  <template #overlay>
                    <a-menu class="min-w-[120px]">
                      <a-menu-item
                        v-for="status in statusOptions"
                        :key="status.value"
                        @click="handleStatusSelect(status.value)"
                      >
                        <div class="flex items-center gap-2">
                          <div
                            :class="[status.color, 'w-2 h-2 rounded-full']"
                          ></div>
                          <span
                            :class="{
                              'text-blue-500': selectedStatus === status.value,
                            }"
                          >
                            {{ status.label }}
                          </span>
                        </div>
                      </a-menu-item>
                    </a-menu>
                  </template>
                </a-dropdown>
              </div>
            </div>
          </th>
          <th
            class="min-w-[100px] px-4 text-left text-sm font-semibold text-gray-900"
          >
            执行用时
          </th>
          <th
            class="min-w-[100px] px-4 text-left text-sm font-semibold text-gray-900"
          >
            消耗内存
          </th>
          <th
            class="min-w-[100px] px-4 text-left text-sm font-semibold text-gray-900"
          >
            提交时间
          </th>
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-200">
        <tr
          v-for="(record, index) in filteredRecords"
          :key="record.id"
          :class="[
            index % 2 === 0 ? 'bg-white' : 'bg-[#F7F8FA]',
            'h-12 hover:bg-gray-50',
          ]"
        >
          <td class="px-4 whitespace-nowrap w-[120px]">
            <div class="flex items-center gap-2 overflow-hidden">
              <span
                class="text-sm truncate"
                :class="getTextColorClass(record.status)"
                >{{ getStatusLabel(record.status) }}</span
              >
            </div>
          </td>
          <td class="px-4 whitespace-nowrap text-sm text-gray-600">
            {{ record.executionTime }} ms
          </td>
          <td class="px-4 whitespace-nowrap text-sm text-gray-600">
            {{ record.memoryUsage }} MB
          </td>
          <td class="px-4 whitespace-nowrap text-sm text-gray-600">
            {{ formatTime(record.submitTime) }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { DownOutlined, CheckOutlined } from "@ant-design/icons-vue";
import dayjs from "dayjs";

const props = defineProps({
  submissions: {
    type: Array,
    default: () => [],
  },
});

const statusOptions = [
  { label: "所有状态", value: "", color: "bg-gray-400" },
  { label: "执行通过", value: "SUCCESS", color: "bg-green-500" },
  { label: "错误解答", value: "WRONG_ANSWER", color: "bg-red-500" },
  { label: "执行超时", value: "TIMEOUT", color: "bg-yellow-500" },
  { label: "编译错误", value: "COMPILE_ERROR", color: "bg-orange-500" },
];

const selectedStatus = ref("");
const dropdownVisible = ref(false);

const handleStatusSelect = (value) => {
  selectedStatus.value = value;
  dropdownVisible.value = false; // 选择后关闭下拉框
  // 这里可以添加调用API的逻辑
};

// 移除筛选逻辑，直接展示所有数据
const filteredRecords = computed(() => props.submissions);

const getStatusColor = (status) => {
  const option = statusOptions.find((opt) => opt.value === status);
  return option?.color || "bg-gray-400";
};

// 新增获取文字颜色的工具函数
const getTextColorClass = (status) => {
  const colorMap = {
    SUCCESS: "text-green-600",
    WRONG_ANSWER: "text-red-600",
    TIMEOUT: "text-yellow-600",
    COMPILE_ERROR: "text-orange-600",
  };
  return colorMap[status] || "text-gray-500";
};

const getStatusLabel = (status) => {
  return statusOptions.find((opt) => opt.value === status)?.label || "状态";
};

const formatTime = (time) => dayjs(time).format("YYYY-MM-DD HH:mm:ss");
</script>

<style scoped>
table {
  border-collapse: separate;
  border-spacing: 0;
}

thead th:first-child {
  border-top-left-radius: 0.5rem;
}

thead th:last-child {
  border-top-right-radius: 0.5rem;
}

tbody tr:last-child td:first-child {
  border-bottom-left-radius: 0.5rem;
}

tbody tr:last-child td:last-child {
  border-bottom-right-radius: 0.5rem;
}

:deep(.ant-dropdown-menu) {
  @apply rounded-lg shadow-lg border border-gray-100 py-1;
}

:deep(.ant-dropdown-menu-item) {
  @apply px-3 py-2 text-sm;
}

:deep(.ant-dropdown-menu-item:hover) {
  @apply bg-gray-50;
}

/* 优化下拉菜单样式 */
:deep(.ant-dropdown) {
  @apply mt-1;
}

:deep(.ant-dropdown-menu) {
  @apply rounded-lg shadow-lg border border-gray-100 py-1 min-w-[140px];
}

:deep(.ant-dropdown-menu-item) {
  @apply px-3 py-2 text-sm;
}

:deep(.ant-dropdown-menu-item:hover) {
  @apply bg-gray-50;
}

:deep(.ant-dropdown-menu-item-selected) {
  @apply bg-blue-50;
}

/* 添加图标旋转动画 */
.rotate-180 {
  transform: rotate(180deg);
}

:deep(.status-menu) {
  @apply rounded-lg shadow-lg border border-gray-100 py-1 min-w-[120px] mt-1;
}

:deep(.ant-dropdown-menu-item) {
  @apply px-3 py-2 text-sm transition-colors;
}

:deep(.ant-dropdown-menu-item:hover) {
  @apply bg-gray-50 text-gray-900;
}

.transform {
  transition: transform 0.2s ease;
}

/* 添加状态文字颜色类 */
.text-green-500 {
  @apply text-green-600;
}
.text-red-500 {
  @apply text-red-600;
}
.text-yellow-500 {
  @apply text-yellow-600;
}
.text-orange-500 {
  @apply text-orange-600;
}
</style>
