<template>
  <div class="space-y-4">
    <div class="flex items-center gap-2">
      <button
        class="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        @click="$emit('close')"
      >
        <svg
          class="w-5 h-5 text-gray-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>
      <h2 class="text-lg font-medium">
        {{ type === "likes" ? "我的点赞" : "我的收藏" }}
      </h2>
    </div>

    <!-- 内容区域 -->
    <div class="mt-4">
      <!-- 这里添加具体的列表内容 -->
      <div class="space-y-4">
        <div v-for="i in 5" :key="i" class="p-4 bg-gray-50 rounded-lg">
          {{ type === "likes" ? "点赞内容" : "收藏内容" }} {{ i }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  type: {
    type: String,
    required: true,
    validator: (value) => ["likes", "collections"].includes(value),
  },
});

defineEmits(["close"]);
</script>
