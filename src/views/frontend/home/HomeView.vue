<template>
  <div
    class="w-screen min-h-screen flex justify-center gap-[20px] mt-[20px] mb-[40px]"
  >
    <div class="w-[840px] flex flex-col gap-5">
      <div class="w-full h-[300px] rounded-2xl overflow-hidden relative">
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
            <img
              src="/banner1.jpg"
              alt="banner1"
              class="w-full h-full object-cover"
            />
          </div>
          <div class="carousel-item">
            <img
              src="/banner2.jpg"
              alt="banner2"
              class="w-full h-full object-cover"
            />
          </div>
          <div class="carousel-item">
            <img
              src="/banner3.jpg"
              alt="banner3"
              class="w-full h-full object-cover"
            />
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
                    : 'bg-transparent text-[#737373] hover:text-[#1A1A1A]',
                ]"
              >
                {{ btn.name }}
              </button>
            </div>
            <div class="mx-5 h-[1px] bg-[#E5E5E5]"></div>
          </div>

          <!-- 文章列表区域 -->
          <div class="p-5">
            <div class="grid divide-y divide-gray-200">
              <div class="w-full overflow-hidden">
                <HomePostCard
                  v-for="article in articles"
                  :key="article.id"
                  :article="article"
                  class="first:pt-0 pt-4"
                  @click="handlePostClick(article.id)"
                />
              </div>
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
import { LeftOutlined, RightOutlined } from "@ant-design/icons-vue";
import CustomCalendar from "../../../components/home/Calendar.vue";
import HomePostCard from "../../../components/home/HomePostCard.vue";
import { ref, onMounted } from "vue";
import { post } from "../../../api/frontend/post";
import { topic } from "../../../api/frontend/topic"; // 添加topic api引入
import { useRouter } from "vue-router"; // 添加路由导入

const router = useRouter(); // 添加路由实例

// 将mockDetails改为响应式数据
const mockDetails = ref([]);

// 获取每日话题列表
const getDailyTopicList = async () => {
  try {
    const res = await topic.getDailyTopicList();
    if (res.code === 200) {
      // 转换数据格式以匹配现有结构，添加 topicId 和 isDone
      mockDetails.value = res.data.map((item) => ({
        Date: item.date,
        Question: item.title,
        topicId: item.topicId,
        isDone: item.isDone, // 添加 isDone 字段
      }));
    }
  } catch (error) {
    console.error("获取每日话题失败:", error);
  }
};

// 修改按钮数据，添加id和更有意义的名称
const buttons = [
  { id: 1, name: "推荐" },
  { id: 2, name: "最多点赞" },
  { id: 3, name: "最多收藏" },
  { id: 4, name: "最多评论" },
];

// 添加响应式状态来跟踪当前选中的按钮
const activeButton = ref(1); // 默认选中第一个按钮

// 文章数据改为响应式空数组
const articles = ref([]);

// 获取文章列表方法
const getArticles = async () => {
  try {
    const res = await post.getHomePostList({
      pageNumber: 1,
      pageSize: 10,
    });
    if (res.code === 200) {
      // 修改这里，从 data.data 中获取文章列表
      articles.value = res.data.data;
    }
  } catch (error) {
    console.error("获取文章列表失败:", error);
  }
};

// 修改点击事件处理函数，添加获取文章的逻辑
const handleButtonClick = async (buttonId) => {
  activeButton.value = buttonId;
  await getArticles();
};

// 修改跳转方法，使用完整的路由路径
const handlePostClick = (id) => {
  router.push({
    path: `/post/${id}`, // 修改这里，使用path而不是name
  });
};

// 组件挂载时获取文章列表
onMounted(async () => {
  await Promise.all([getArticles(), getDailyTopicList()]);
});

// 添加完成情况数据
const completionData = [
  {
    Date: "2025-01-01",
    isDo: "true",
  },
  {
    Date: "2025-01-02",
    isDo: "true",
  },
  {
    Date: "2025-01-13",
    isDo: "true",
  },
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
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

/* 移除之前的样式，使用新的样式 */
.custom-calendar td:hover .rounded-full {
  background-color: #ebf5ff;
  color: #2563eb;
}
</style>
