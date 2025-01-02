<template>
  <div class="w-screen h-screen flex justify-center gap-[20px] mt-[40px] mb-[40px]">
    <div class="w-[800px] h-screen rounded-2xl bg-gray-200">
      <div class="w-[800px] h-[300px] rounded-2xl overflow-hidden relative">
        <a-carousel arrows autoplay class="h-full">
          <template #prevArrow>
            <div class="custom-arrow prev">
              <left-outlined />
            </div>
          </template>
          <template #nextArrow>
            <div class="custom-arrow next">
              <right-outlined />
            </div>
          </template>
          <div class="carousel-item">
            <img src="/banner1.jpg" alt="banner1" class="w-full h-full object-cover" />
          </div>
          <div class="carousel-item">
            <img src="/banner2.jpg" alt="banner2" class="w-full h-full object-cover" />
          </div>
          <div class="carousel-item">
            <img src="/banner3.jpg" alt="banner3" class="w-full h-full object-cover" />
          </div>
        </a-carousel>
      </div>
    </div>
    <div class="w-[380px] h-screen rounded-2xl bg-gray-200">
      <div class="w-[380px] border border-[#d9d9d9] rounded-2xl">
        <CustomCalendar :day-details="mockDetails" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { LeftOutlined, RightOutlined } from '@ant-design/icons-vue';
import CustomCalendar from '../components/CustomCalendar.vue';

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
  height: 300px;  /* 与父容器高度相同 */
  line-height: 300px;
  text-align: center;
  background: #364d79;
  overflow: hidden;
}

:deep(.slick-slide) {
  pointer-events: none;  /* 修复可能的点击事件问题 */
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
  border: 1px solid #e2e8f0;
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