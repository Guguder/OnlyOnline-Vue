<template>
  <div
    class="w-full bg-white p-4 flex gap-4 cursor-pointer transition-all duration-200 ease-in-out hover:shadow-md hover:bg-opacity-50 hover:bg-blue-50 select-none relative"
    @click="handleCardClick"
  >
    <!-- 左侧头像区域 -->
    <div class="w-12 flex-shrink-0">
      <img :src="article.avatar" alt="avatar" class="w-12 h-12 rounded-full" />
    </div>

    <!-- 右侧内容区域 -->
    <div class="flex-1 flex flex-col justify-between min-w-0">
      <div class="flex flex-col w-full">
        <span class="text-sm leading-none text-gray-800 text-left mb-2">{{
          article.nickname
        }}</span>
        <h2
          class="text-base font-semibold leading-tight text-[#000000] text-left mb-2 truncate"
        >
          {{ article.title }}
        </h2>
        <p
          class="text-sm leading-normal text-gray-600 text-left truncate max-w-[590px]"
        >
          {{ article.content }}
        </p>
      </div>

      <!-- 互动按钮区域 -->
      <div
        class="flex items-center text-gray-400 mt-3 pl-0 relative z-10"
        @click.stop
      >
        <!-- 点赞 -->
        <div class="flex items-center mr-6 cursor-pointer group">
          <div
            class="p-1.5 rounded-full group-hover:bg-blue-100 transition-all duration-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4 group-hover:text-blue-500 transition-colors duration-200"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
              />
            </svg>
          </div>
          <span
            class="text-xs group-hover:text-blue-500 transition-colors duration-200"
            >{{ article.thumbNum || 0 }}</span
          >
        </div>

        <!-- 评论 -->
        <div class="flex items-center mr-6 cursor-pointer group">
          <div
            class="p-1.5 rounded-full group-hover:bg-blue-100 transition-all duration-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4 group-hover:text-blue-500 transition-colors duration-200"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          </div>
          <span
            class="text-xs group-hover:text-blue-500 transition-colors duration-200"
            >{{ article.replyNum || 0 }}</span
          >
        </div>

        <!-- 收藏 -->
        <div class="flex items-center cursor-pointer group">
          <div
            class="p-1.5 rounded-full group-hover:bg-blue-100 transition-all duration-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4 group-hover:text-blue-500 transition-colors duration-200"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
              />
            </svg>
          </div>
          <span
            class="text-xs group-hover:text-blue-500 transition-colors duration-200"
            >{{ article.favourNum || 0 }}</span
          >
        </div>
      </div>
    </div>

    <!-- 右侧图片区域（如果有） -->
    <div v-if="article.imageUrl" class="w-24 flex-shrink-0">
      <img
        :src="article.imageUrl"
        :alt="article.title"
        class="w-24 h-24 object-cover rounded-lg"
        @error="handleImageError"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router"; // 添加路由导入

const router = useRouter(); // 获取路由实例
const props = defineProps({
  article: {
    type: Object,
    required: true,
    default: () => ({
      id: "",
      avatar: "",
      nickname: "",
      title: "",
      content: "",
      imageUrl: null,
      thumbNum: 0,
      replyNum: 0,
      favourNum: 0,
      isAnonymous: 0,
    }),
  },
});

const emit = defineEmits(["click"]);

// 处理卡片点击
const handleCardClick = () => {
  emit("click");
  router.push({
    path: `/post/${props.article.id}`, // 修改为路径方式跳转
  });
};

// 处理图片加载失败
const handleImageError = (e) => {
  e.target.style.display = "none";
};
</script>

<style scoped>
.truncate {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 优化点击效果 */
.cursor-pointer:active {
  transform: translateY(1px);
  background-color: rgba(59, 130, 246, 0.1);
}

/* 确保内容在悬浮卡片之上 */
.relative {
  isolation: isolate;
}
</style>
