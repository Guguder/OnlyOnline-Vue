<template>
  <div class="bg-white rounded-lg p-3 border border-gray-100 hover:shadow-md transition-shadow flex gap-4 cursor-pointer">
    <!-- 左侧LOGO区域 - 添加flex居中 -->
    <div class="flex-shrink-0 flex items-center">
      <div class="w-12 h-12 rounded-lg flex items-center justify-center" 
           :class="{
             'bg-blue-700': cardData.icon === 'TOP',
             'bg-green-700': cardData.icon === 'NEW',
             'bg-red-700': cardData.icon === 'HOT',
             'bg-yellow-700': cardData.icon === 'JS',
             'bg-purple-700': cardData.icon === 'DB'
           }">
        <span class="text-base font-bold text-white">
          {{ cardData.icon }}
        </span>
      </div>
    </div>
    
    <!-- 右侧内容区域 -->
    <div class="flex-1 min-w-0 flex flex-col justify-center">
      <div class="space-y-1.5">  <!-- 增加间距 -->
        <h3 class="text-base font-semibold text-gray-900 text-left truncate">{{ cardData.title }}</h3>
        <a-popover
          placement="bottom"
          trigger="hover"
          :mouseEnterDelay="0.5"
          :overlayStyle="{ width: '100%', maxWidth: '250px' }"
          overlayClassName="question-bank-popover"
        >
          <template #content>
            <div class="text-sm text-gray-600 whitespace-pre-wrap break-words leading-5">
              {{ cardData.description }}
            </div>
          </template>
          <p class="text-sm text-gray-600 text-left truncate cursor-help">
            {{ cardData.description }}
          </p>
        </a-popover>
      </div>
    </div>
  </div>
</template>

<script setup>
// 接收父组件传入的数据
defineProps({
  cardData: {
    type: Object,
    required: true,
    default: () => ({
      icon: "ICON",
      title: "标题",
      description: "描述内容",
    }),
  },
});
</script>

<style scoped>
.group {
  position: relative;
}

.group:hover .group-hover\:block {
  animation: fadeIn 0.2s ease forwards;
  animation-delay: 0.7s;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    visibility: hidden;
  }
  to {
    opacity: 1;
    visibility: visible;
  }
}

.group-hover\:block {
  opacity: 0;
  visibility: hidden;
}

:deep(.question-bank-popover) {
  width: 100%;
}

:deep(.question-bank-popover .ant-popover-inner) {
  width: 100%;
}

:deep(.question-bank-popover .ant-popover-inner-content) {
  padding: 12px;
}
</style>
