<template>
  <Transition name="fade">
    <div v-if="modelValue" class="fixed inset-0 z-50">
      <!-- 背景遮罩 -->
      <div class="absolute inset-0 bg-black/50" @click="closeModal"></div>

      <!-- 模态框内容 -->
      <div class="fixed inset-0 bg-white">
        <!-- 头部导航栏 -->
        <div class="h-16 px-6 border-b border-gray-200 flex items-center justify-between">
          <!-- 左侧关闭按钮 -->
          <button 
            @click="closeModal"
            class="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X class="h-6 w-6 text-gray-500" />
          </button>
          
          <!-- 右侧功能区 -->
          <div class="flex items-center gap-4">
            <!-- 复制按钮 -->
            <button 
              @click="copyContent"
              class="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              复制内容
            </button>

            <!-- 匿名开关 - 使用 a-checkbox -->
            <a-checkbox v-model:checked="isAnonymous" class="text-sm text-gray-600">
              匿名
            </a-checkbox>

            <!-- 暂存按钮 -->
            <button 
              @click="saveDraft"
              class="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              暂存草稿
            </button>

            <!-- 发布按钮 -->
            <button 
              @click="publishPost"
              class="px-4 py-2 text-sm text-white bg-purple-500 hover:bg-purple-600 rounded-lg transition-colors"
            >
              发布
            </button>
          </div>
        </div>

        <!-- 内容区域 -->
        <div class="h-[calc(100vh-64px)] overflow-y-auto">
          <div class="w-[90%] max-w-[1400px] mx-auto py-6">
            <slot></slot>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref } from 'vue';
import { X } from 'lucide-vue-next';
import { Checkbox as ACheckbox } from 'ant-design-vue';

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  }
});

const emit = defineEmits(['update:modelValue']);

const isAnonymous = ref(false);

const closeModal = () => {
  emit('update:modelValue', false);
};

const saveDraft = () => {
  // 实现暂存功能
  console.log('保存草稿');
};

const publishPost = () => {
  // 实现发布功能，这里可以看到 isAnonymous 的值
  console.log('发布文章', { isAnonymous: isAnonymous.value });
};

// 添加复制功能
const copyContent = async () => {
  try {
    // 获取编辑器内容（需要通过 ref 或其他方式获取 Vditor 组件实例）
    const content = document.querySelector('#vditor')?.querySelector('.vditor-reset')?.textContent || '';
    await navigator.clipboard.writeText(content);
    // 这里可以添加一个成功提示
    alert('复制成功！');
  } catch (err) {
    console.error('复制失败:', err);
    alert('复制失败，请重试');
  }
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 删除原有的 toggle 相关样式 */
</style>
