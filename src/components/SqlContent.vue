<template>
  <div class="h-[calc(100vh-theme(space.20))] w-full bg-white rounded-lg shadow-sm overflow-hidden flex flex-col relative">
    <!-- 简化展开按钮 -->
    <div 
      v-show="isCollapsed" 
      class="absolute right-0 top-0 w-9 z-20 h-10 flex items-center justify-center border-b border-gray-100"
    >
      <menu-unfold-outlined
        class="text-gray-400 cursor-pointer hover:text-gray-600"
        @click="$emit('expand')"
      />
    </div>

    <!-- 内容区域 -->
    <div 
      class="h-full"
      :class="[isCollapsed ? 'hidden' : 'block']"
    >
      <div :class="[
        'border-b border-gray-100',
        isCollapsed ? 'invisible' : 'flex items-center p-1 justify-between',
      ]">
        <div class="flex items-center">
          <a-button
            v-for="tab in tabs"
            :key="tab.key"
            type="text"
            :class="[
              'flex items-center gap-1 hover:border-transparent',
              isMinWidth ? '!px-0 justify-center' : '!px-3 !h-8 !py-2',
              modelValue === tab.key ? 'text-gray-900 font-medium' : 'text-gray-400',
            ]"
            @click="$emit('update:modelValue', tab.key)"
          >
            <component :is="tab.icon" />
            <span v-if="!isMinWidth">{{ tab.label }}</span>
          </a-button>
        </div>
        <!-- 收缩按钮 -->
        <a-button
          v-if="!isMinWidth"
          type="text"
          class="!px-2 text-gray-400 hover:text-gray-600"
          @click="$emit('collapse')"
        >
          <menu-fold-outlined />
        </a-button>
      </div>

      <div class="flex-1 overflow-auto">
        <slot :active-tab="modelValue"></slot>
      </div>
    </div>

    <!-- 简化后的垂直菜单 -->
    <div 
      v-show="isCollapsed" 
      class="absolute right-0 top-10 w-9 flex flex-col items-center py-3 border-l border-gray-100 bg-white"
    >
      <a-button
        v-for="tab in tabs"
        :key="tab.key"
        type="text"
        :class="[
          'w-9 h-9 flex items-center justify-center mb-2',
          modelValue === tab.key ? 'text-gray-900' : 'text-gray-400',
        ]"
        @click="$emit('update:modelValue', tab.key)"
      >
        <component :is="tab.icon" />
      </a-button>
    </div>
  </div>
</template>

<script setup>
import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons-vue'
import { computed } from 'vue'

const props = defineProps({
  modelValue: String,
  tabs: {
    type: Array,
    required: true
  },
  isCollapsed: {
    type: Boolean,
    default: false
  },
  isMinWidth: {
    type: Boolean,
    default: false
  }
})

defineEmits(['update:modelValue', 'collapse', 'expand'])
</script>

<style scoped>
/* 精简的按钮样式 */
:deep(.ant-btn) {
  border: none;
  padding: 0;
}

:deep(.ant-btn:hover) {
  background-color: transparent;
  color: rgb(75, 85, 99);
}
</style>
