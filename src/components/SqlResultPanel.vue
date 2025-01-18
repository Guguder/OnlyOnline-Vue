<template>
  <div class="h-full w-full bg-white rounded-lg shadow-sm overflow-hidden flex flex-col relative">
    <!-- 工具栏 -->
    <div class="border-b border-gray-100 flex items-center justify-between p-1" ref="toolbarRef">
      <div class="flex items-center">
        <a-button
          v-for="tab in tabs"
          :key="tab.key"
          type="text"
          :class="[
            'flex items-center gap-1 hover:border-transparent',
            '!px-3 !h-8 !py-2',
            modelValue === tab.key ? 'text-gray-900 font-medium' : 'text-gray-400',
          ]"
          @click="$emit('update:modelValue', tab.key)"
        >
          <component :is="tab.icon" />
          <span>{{ tab.label }}</span>
        </a-button>
      </div>
      <a-button
        type="text"
        class="!px-2 !h-8 !py-2 text-gray-400 hover:text-gray-600"
        @click="$emit(isCollapsed ? 'expand' : 'collapse')"
      >
        <component :is="isCollapsed ? UpOutlined : DownOutlined" />
      </a-button>
    </div>

    <!-- 内容区域 - 设置最小高度 -->
    <div 
      class="transition-all duration-300"
      :style="{ minHeight: toolbarHeight + 'px' }"
      :class="[
        isCollapsed ? 'h-[var(--toolbar-height)]' : 'flex-1',
        'overflow-hidden relative'
      ]"
    >
      <slot :active-tab="modelValue"></slot>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { UpOutlined, DownOutlined } from '@ant-design/icons-vue'

defineProps({
  modelValue: String,
  tabs: {
    type: Array,
    required: true
  },
  isCollapsed: {
    type: Boolean,
    default: false
  }
})

defineEmits(['update:modelValue', 'collapse', 'expand'])

const toolbarRef = ref(null)
const toolbarHeight = ref(0)

onMounted(() => {
  toolbarHeight.value = toolbarRef.value.offsetHeight
})
</script>

<style scoped>
:deep(.ant-btn) {
  border: none;
  padding: 0;
}

:deep(.ant-btn:hover) {
  background-color: transparent;
}

/* 过渡动画 */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0.2, 0.2, 1);
  transition-duration: 300ms;
}
</style>
