<template>
  <div class="w-screen min-h-screen flex justify-center gap-[20px] mt-[20px] mb-[40px]">
    <div class="w-[840px] flex flex-col gap-5">
      <div class="w-full h-[300px] rounded-2xl overflow-hidden relative">
        <a-carousel arrows autoplay class="h-full">
          <template #prevArrow>
            <div class="custom-arrow prev">
              <left-outlined/>
            </div>
          </template>
          <template #nextArrow>
            <div class="custom-arrow next">
              <right-outlined/>
            </div>
          </template>
          <div class="carousel-item">
            <img src="/banner1.jpg" alt="banner1" class="w-full h-full object-cover"/>
          </div>
          <div class="carousel-item">
            <img src="/banner2.jpg" alt="banner2" class="w-full h-full object-cover"/>
          </div>
          <div class="carousel-item">
            <img src="/banner3.jpg" alt="banner3" class="w-full h-full object-cover"/>
          </div>
        </a-carousel>
      </div>
      <!-- 文章区域 -->
      <div class="w-full">
        <div class="w-full rounded-2xl bg-white">
          <!-- 按钮组容器 -->
          <div class="bg-white rounded-t-2xl">
            <div class="p-5 flex gap-2">
              <button 
                v-for="btn in buttons" 
                :key="btn.name"
                @click="handleButtonClick(btn.id)"
                :class="[
                  'px-4 py-1.5 text-sm transition-colors outline-none focus:outline-none border-none hover:border-none focus:border-none rounded-[4px]',
                  activeButton === btn.id 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-transparent text-[#737373] hover:text-[#1A1A1A]'
                ]"
              >
                {{ btn.name }}
              </button>
            </div>
            <div class="mx-5 h-[1px] bg-[#E5E5E5]"></div>
          </div>

          <!-- 文章列表区域 -->
          <div class="p-5">
            <div class="grid divide-y divide-gray-200"> <!-- 移除 overflow-hidden -->
              <ArticleCard
                  v-for="article in articles"
                  :key="article.id"
                  :article="article"
                  class="first:pt-0 pt-4"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="w-[340px]">
      <div class="sticky top-5 w-full">
        <div class="w-full border-[#d9d9d9] rounded-2xl bg-white">
          <CustomCalendar 
            :day-details="mockDetails"
            :completion-data="completionData"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {LeftOutlined, RightOutlined} from '@ant-design/icons-vue';
import CustomCalendar from '../../components/home/Calendar.vue';
import ArticleCard from '../../components/home/HomePostCard.vue';
import { ref } from 'vue';

// 修改为数组格式的模拟数据
const mockDetails = [
  {
    Date: "2025-01-01",
    Question: "Vue3的组合式API有哪些优势？请详细说明。"
  },
  {
    Date: "2025-01-02",
    Question: "说说你对Vue3中ref和reactive的理解？"
  },
  {
    Date: "2025-01-03",
    Question: "Vue3中的生命周期钩子有哪些变化？"
  },
  {
    Date: "2025-01-04",
    Question: "什么是Vue3的响应式原理？"
  },
  {
    Date: "2025-01-05",
    Question: "Vue3中的Teleport组件是什么？"
  },
  // ...其他数据项...
];

// 修改按钮数据，添加id和更有意义的名称
const buttons = [
  { id: 1, name: '推荐' },
  { id: 2, name: '最多点赞' },
  { id: 3, name: '最多收藏' },
  { id: 4, name: '最多评论' }
];

// 添加响应式状态来跟踪当前选中的按钮
const activeButton = ref(1); // 默认选中第一个按钮

// 修改点击事件处理函数
const handleButtonClick = (buttonId) => {
  activeButton.value = buttonId;
  console.log(`选中了按钮: ${buttons.find(btn => btn.id === buttonId)?.name}`);
};

// 文章数据
const articles = [
{
    id: 1,
    avatar: "https://pic.leetcode.cn/1699000361-IIuoOH-%E9%9B%B6%E8%B5%B7%E6%AD%A5%E5%AD%A6%E7%AE%97%E6%B3%95.png?x-oss-process=image%2Fformat%2Cwebp",
    nickname: "John Doe",
    title: "如何学习 Vue 3？",
    content: "Vue 3 提供了全新的组合式 API，使用它可以更方便地构建复杂组件，Vue 3 提供了全新的组合式 API，使用它可以更方便地构建复杂组件Vue 3 提供了全新的组合式 API，使用它可以更方便地构建复杂组件Vue 3 提供了全新的组合式 API，使用它可以更方便地构建复杂组件Vue 3 提供了全新的组合式 API，使用它可以更方便地构建复杂组件Vue 3 提供了全新的组合式 API，使用它可以更方便地构建复杂组件Vue 3 提供了全新的组合式 API，使用它可以更方便地构建复杂组件",
    image: "https://pic.leetcode.cn/1699000361-IIuoOH-%E9%9B%B6%E8%B5%B7%E6%AD%A5%E5%AD%A6%E7%AE%97%E6%B3%95.png?x-oss-process=image%2Fformat%2Cwebp",
    likes: 123,
    comments: 45,
    favorites: 67
  },
  {
    id: 2,
    avatar: "https://pic.leetcode.cn/1699000361-IIuoOH-%E9%9B%B6%E8%B5%B7%E6%AD%A5%E5%AD%A6%E7%AE%97%E6%B3%95.png?x-oss-process=image%2Fformat%2Cwebp",
    nickname: "Jane Smith",
    title: "前端开发的 5 大技巧",
    content: "提升前端开发效率的 5 大技巧，从代码优化到工具选择",
    image: "https://pic.leetcode.cn/1699000361-IIuoOH-%E9%9B%B6%E8%B5%B7%E6%AD%A5%E5%AD%A6%E7%AE%97%E6%B3%95.png?x-oss-process=image%2Fformat%2Cwebp",
    likes: 89,
    comments: 34,
    favorites: 22
  },
  {
    id: 3,
    avatar: "https://pic.leetcode.cn/1699000361-IIuoOH-%E9%9B%B6%E8%B5%B7%E6%AD%A5%E5%AD%A6%E7%AE%97%E6%B3%95.png?x-oss-process=image%2Fformat%2Cwebp",
    nickname: "CoderX",
    title: "JavaScript 性能优化指南",
    content: "在大型项目中，JavaScript 性能优化至关重要，以下是一些核心策略",
    image: null,
    likes: 76,
    comments: 12,
    favorites: 34
  },
  {
    id: 4,
    avatar: "https://pic.leetcode.cn/1699000361-IIuoOH-%E9%9B%B6%E8%B5%B7%E6%AD%A5%E5%AD%A6%E7%AE%97%E6%B3%95.png?x-oss-process=image%2Fformat%2Cwebp",
    nickname: "CoderX",
    title: "探索现代 Web 开发趋势",
    content: "现代 Web 开发趋势涵盖微前端、服务端渲染等技术，这是一次深度分析",
    image: "https://pic.leetcode.cn/1699000361-IIuoOH-%E9%9B%B6%E8%B5%B7%E6%AD%A5%E5%AD%A6%E7%AE%97%E6%B3%95.png?x-oss-process=image%2Fformat%2Cwebp",
    likes: 98,
    comments: 28,
    favorites: 49
  },
  {
    id: 5,
    avatar: "https://pic.leetcode.cn/1699000361-IIuoOH-%E9%9B%B6%E8%B5%B7%E6%AD%A5%E5%AD%A6%E7%AE%97%E6%B3%95.png?x-oss-process=image%2Fformat%2Cwebp",
    nickname: "DevGuru",
    title: "构建高效团队的秘密",
    content: "团队协作对项目成功至关重要，本篇文章提供了一些建议和技巧",
    image: "https://pic.leetcode.cn/1699000361-IIuoOH-%E9%9B%B6%E8%B5%B7%E6%AD%A5%E5%AD%A6%E7%AE%97%E6%B3%95.png?x-oss-process=image%2Fformat%2Cwebp",
    likes: 132,
    comments: 56,
    favorites: 87
  }
];

// 添加完成情况数据
const completionData = [
  {
    Date: "2025-01-01",
    isDo: "true"
  },
  {
    Date: "2025-01-02",
    isDo: "true"
  },
  {
    Date: "2025-01-13",
    isDo: "true"
  }
];

</script>

<style scoped>
/* 轮播图容器样式 */
:deep(.ant-carousel) {
  height: 100%;
}

:deep(.slick-slider),
:deep(.slick-list),
:deep(.slick-track) {
  height: 100%;
}

.carousel-item {
  height: 300px; /* 与父容器高度相同 */
  line-height: 300px;
  text-align: center;
  background: #364d79;
  overflow: hidden;
}

:deep(.slick-slide) {
  pointer-events: none; /* 修复可能的点击事件问题 */
}

:deep(.slick-slide.slick-active) {
  pointer-events: auto;
}

/* 箭头样式 */
:deep(.slick-prev),
:deep(.slick-next) {
  z-index: 2;
  width: 40px;
  height: 40px;

  &::before {
    font-size: 24px;
  }
}

:deep(.slick-dots) {
  bottom: 12px;

  li {
    button {
      background: #fff;
      opacity: 0.7;

      &:hover {
        opacity: 1;
      }
    }

    &.slick-active {
      button {
        background: #1890ff;
        opacity: 1;
      }
    }
  }
}

/* 自定义箭头样式 */
.custom-arrow {
  position: absolute;
  z-index: 1;
  top: 50%;
  transform: translateY(-50%);
  width: 35px;
  height: 35px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
}

.custom-arrow:hover {
  background: rgba(0, 0, 0, 0.5);
}

.custom-arrow.prev {
  left: 10px;
}

.custom-arrow.next {
  right: 10px;
}

.custom-arrow :deep(svg) {
  font-size: 20px;
  color: #fff;
}

.custom-calendar {
  /* 移除边框样式 */
}

.custom-calendar th {
  font-weight: 500;
}

.custom-calendar td {
  border-radius: 9999px;
  transition: all 0.2s;
}

/* 确保弹出提示框在其他元素之上 */
.group:hover .group-hover\:block {
  display: block;
}

/* 提示框样式 */
.group-hover\:block {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

/* 移除之前的样式，使用新的样式 */
.custom-calendar td:hover .rounded-full {
  background-color: #EBF5FF;
  color: #2563EB;
}
</style>