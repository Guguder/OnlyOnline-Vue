<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="modelValue"
        class="fixed inset-0 z-50 flex items-center justify-center"
      >
        <div
          class="absolute inset-0 bg-black bg-opacity-50"
          @click="handleClickMask"
        ></div>
        <div
          class="relative transform transition-all modal-content bg-white rounded-lg shadow-xl max-w-[90vw] max-h-[90vh] overflow-hidden"
          :style="{ width }"
        >
          <!-- 头部 -->
          <div class="px-6 py-4 border-b border-gray-200">
            <div class="flex items-center justify-between">
              <h3 class="text-xl font-bold text-gray-900">{{ title }}</h3>
              <button
                class="p-1 hover:bg-gray-100 transition-colors rounded"
                @click="handleClose"
              >
                <svg
                  class="w-5 h-5 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="square"
                    stroke-linejoin="miter"
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>

          <!-- 内容区域 -->
          <div class="px-6 py-5 max-h-[calc(90vh-180px)] overflow-y-auto">
            <slot></slot>
          </div>

          <!-- 底部按钮 -->
          <div
            class="px-6 py-4 border-t border-gray-200 flex justify-end gap-3 bg-gray-50"
          >
            <slot name="footer">
              <button
                class="px-5 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                @click="handleClose"
              >
                取消
              </button>
              <button
                class="px-5 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                @click="handleConfirm"
              >
                确定
              </button>
            </slot>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  title: {
    type: String,
    default: "",
  },
  closeOnClickMask: {
    type: Boolean,
    default: true,
  },
  width: {
    type: String,
    default: "680px",
  },
});

const emit = defineEmits(["update:modelValue", "confirm", "close"]);

const handleClose = () => {
  emit("update:modelValue", false);
  emit("close");
};

const handleConfirm = () => {
  emit("confirm");
};

const handleClickMask = () => {
  if (props.closeOnClickMask) {
    handleClose();
  }
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease-out;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.modal-content {
  animation: modalPop 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
}

/* 按钮样式优化 */
button {
  font-size: 14px;
  font-weight: 500;
}

@keyframes modalPop {
  0% {
    opacity: 0;
    transform: scale(0.95);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

/* 优化滚动条样式 */
.overflow-y-auto {
  scrollbar-width: thin;
  scrollbar-color: rgba(0, 0, 0, 0.2) transparent;
}

.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: transparent;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 3px;
}
</style>
