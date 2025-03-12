<template>
  <div
    class="h-[calc(100vh-56px)] w-full bg-white rounded-lg shadow-sm overflow-hidden flex flex-col relative"
  >
    <!-- 展开按钮 -->
    <menu-unfold-outlined
      v-if="isCollapsed"
      class="absolute right-2 top-2 text-gray-400 cursor-pointer hover:text-gray-600 z-10"
      @click="$emit('expand')"
    />

    <div
      class="transition-all duration-300 flex-1 flex flex-col overflow-hidden"
      :class="[isCollapsed ? 'opacity-0' : 'opacity-100']"
    >
      <!-- 标签按钮组 - 固定在顶部 -->
      <div
        :class="[
          'border-b border-gray-100 transition-all duration-300 flex-shrink-0',
          isCollapsed ? 'invisible' : 'flex items-center p-1 justify-between',
        ]"
      >
        <div class="flex items-center">
          <a-button
            v-for="tab in tabs"
            :key="tab.key"
            type="text"
            :class="[
              'flex items-center gap-1 hover:border-transparent',
              isMinWidth ? '!px-0 justify-center' : '!px-3 !h-8 !py-2',
              modelValue === tab.key
                ? 'text-gray-900 font-medium'
                : 'text-gray-400',
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

      <!-- 修改内容区域的滚动配置 -->
      <div class="flex-1 overflow-y-auto custom-scrollbar">
        <slot :active-tab="modelValue"></slot>
      </div>
    </div>

    <!-- 折叠时的垂直菜单 -->
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

    <!-- 底部操作栏 -->
    <div class="flex items-center p-1 border-t border-gray-100">
      <!-- 点赞按钮 -->
      <a-button
        type="text"
        class="!px-3 !h-8 !py-2 flex items-center text-gray-400"
        @click="$emit('like')"
      >
        <component
          :is="isLiked ? LikeFilled : LikeOutlined"
          class="mr-0.5"
          :class="isLiked ? 'text-gray-600' : ''"
        />
        <span class="text-xs">{{ formatNumber(stats.likeCount) }}</span>
      </a-button>

      <!-- 讨论按钮 -->
      <a-button
        type="text"
        class="!px-3 !h-8 !py-2 flex items-center"
        :class="false ? 'text-gray-900 font-medium' : 'text-gray-400'"
        @click="$emit('comment')"
      >
        <comment-outlined class="mr-0.5" />
        <span class="text-xs">{{ formatNumber(stats.commentCount) }}</span>
      </a-button>

      <!-- 分隔线 -->
      <div class="h-4 w-px bg-gray-200 mx-1"></div>

      <!-- 收藏按钮 -->
      <a-tooltip placement="top">
        <template #title>收藏</template>
        <a-button
          type="text"
          class="!px-3 !h-8 !py-2 flex items-center text-gray-400"
          @click="$emit('star')"
        >
          <component
            :is="isStarred ? StarFilled : StarOutlined"
            :class="isStarred ? 'text-gray-600' : ''"
          />
        </a-button>
      </a-tooltip>

      <!-- 分享按钮 -->
      <a-tooltip placement="top">
        <template #title>分享</template>
        <a-button
          type="text"
          class="!px-3 !h-8 !py-2 flex items-center text-gray-400"
          @click="$emit('share')"
        >
          <share-alt-outlined />
        </a-button>
      </a-tooltip>

      <!-- 反馈按钮 -->
      <a-tooltip placement="top">
        <template #title>反馈</template>
        <a-button
          type="text"
          class="!px-3 !h-8 !py-2 flex items-center text-gray-400"
          @click="$emit('feedback')"
        >
          <question-circle-outlined />
        </a-button>
      </a-tooltip>

      <!-- 为后续按钮预留分隔线和位置 -->
      <template v-if="hasExtraButtons">
        <div class="h-4 w-px bg-gray-200 mx-1"></div>
        <slot name="extra-buttons"></slot>
      </template>
    </div>
  </div>
</template>

<script setup>
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  LikeOutlined,
  LikeFilled,
  CommentOutlined,
  StarOutlined,
  StarFilled,
  ShareAltOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons-vue";
import { computed } from "vue";
import { formatNumber } from "../utils/format";

const props = defineProps({
  modelValue: String,
  tabs: {
    type: Array,
    required: true,
  },
  isCollapsed: {
    type: Boolean,
    default: false,
  },
  isMinWidth: {
    type: Boolean,
    default: false,
  },
  isLiked: Boolean,
  isStarred: Boolean,
  stats: {
    type: Object,
    default: () => ({
      likeCount: 0,
      commentCount: 0,
      starCount: 0,
    }),
  },
  hasExtraButtons: {
    type: Boolean,
    default: false,
  },
});

defineEmits([
  "update:modelValue",
  "collapse",
  "expand",
  "like",
  "comment",
  "star",
  "share",
  "feedback",
]);
</script>

<style scoped>
/* 自定义滚动条样式 */
.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: #d1d5db transparent;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #d1d5db;
  border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: #9ca3af;
}
</style>
