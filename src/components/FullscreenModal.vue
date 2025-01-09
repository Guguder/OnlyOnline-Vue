<template>
  <Transition
    enter-active-class="animate-modal-enter"
    leave-active-class="animate-modal-leave"
  >
    <div v-if="modelValue" class="fixed inset-0 z-50 bg-white">
      <!-- 关闭按钮 -->
      <button 
        @click="$emit('update:modelValue', false)"
        class="absolute left-6 top-6 p-2 rounded-full hover:bg-gray-100 transition-colors opacity-0 animate-fade-in"
      >
        <X class="w-6 h-6 text-gray-600"/>
      </button>
      
      <!-- 内容插槽 -->
      <div class="w-full h-full pt-20 opacity-0 animate-content-enter">
        <slot></slot>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { X } from 'lucide-vue-next'

defineProps({
  modelValue: {
    type: Boolean,
    required: true
  }
})

defineEmits(['update:modelValue'])
</script>
