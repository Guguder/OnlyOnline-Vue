<template>
  <div
    class="w-screen min-h-screen flex justify-center gap-[20px] mt-[20px] mb-[40px]"
  >
    <!-- 左侧内容区域 -->
    <div class="w-[840px] flex flex-col gap-5">
      <!-- 讨论分类卡片 -->
      <div class="w-full bg-white rounded-2xl p-5">
        <!-- 修改这里的布局结构 -->
        <div class="grid grid-cols-4 gap-4">
          <!-- 左侧三个大卡片 -->
          <div
            v-for="(card, index) in cards.slice(0, 3)"
            :key="index"
            @click="selectCard(index)"
            :class="[
              'card-container transition-all duration-300',
              selectedCard === index + 1 ? 'active' : '',
            ]"
          >
            <div class="card-content">
              <div class="icon-wrapper">
                <component
                  :is="card.icon"
                  :class="[
                    'w-8 h-8',
                    selectedCard === index + 1 ? 'text-white' : card.iconColor,
                  ]"
                />
              </div>
              <span
                :class="[
                  'text-lg font-medium',
                  selectedCard === index + 1 ? 'text-white' : 'text-gray-700',
                ]"
              >
                {{ card.title }}
              </span>
            </div>
          </div>

          <!-- 右侧小卡片容器 -->
          <div
            class="col-span-3 sm:col-span-1 flex sm:flex-col justify-between h-[140px]"
          >
            <!-- 添加高度和justify-between -->
            <div
              v-for="(card, index) in cards.slice(3)"
              :key="index + 3"
              @click="selectCard(index + 3)"
              :class="[
                'card-container small-card transition-all duration-300 w-full',
                selectedCard === index + 4 ? 'active' : '',
              ]"
            >
              <div class="card-content">
                <div class="icon-wrapper small-icon">
                  <component
                    :is="card.icon"
                    :class="[
                      'w-6 h-6',
                      selectedCard === index + 4
                        ? 'text-white'
                        : card.iconColor,
                    ]"
                  />
                </div>
                <span
                  :class="[
                    'text-base font-medium',
                    selectedCard === index + 4 ? 'text-white' : 'text-gray-700',
                  ]"
                >
                  {{ card.title }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 文章区域 - 修正了位置和结构 -->
      <div class="w-full rounded-2xl bg-white">
        <!-- 头部区域：标签页和搜索 -->
        <div
          class="p-5 flex items-center justify-between border-b border-gray-100"
        >
          <!-- 标签页 -->
          <div class="flex gap-8">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              @click="currentTab = tab.id"
              :class="[
                'text-base transition-colors relative py-2',
                currentTab === tab.id
                  ? 'text-blue-500 font-medium'
                  : 'text-gray-500 hover:text-gray-900',
              ]"
            >
              {{ tab.name }}
              <!-- 活动标签的下划线 -->
              <div
                v-if="currentTab === tab.id"
                class="absolute bottom-0 left-0 w-full h-0.5 bg-blue-500 rounded-full"
              ></div>
            </button>
          </div>

          <!-- 右侧搜索和按钮 -->
          <div class="flex items-center gap-4">
            <div class="relative w-[240px]">
              <input
                v-model="searchTitle"
                type="text"
                placeholder="搜索文章"
                class="w-full px-4 pr-10 py-2 bg-[#F2F3F4] rounded-lg text-sm"
                @keyup.enter="handleSearch"
              />
              <button
                class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                @click="handleSearch"
              >
                <Search class="h-4 w-4" />
              </button>
            </div>
            <button
              @click="showPostModal = true"
              class="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg text-sm flex items-center transition-colors"
            >
              <PencilLine class="h-4 w-4 mr-2" />
              发起讨论
            </button>
          </div>
        </div>

        <!-- 修改标签筛选区域 -->
        <div class="flex flex-wrop px-2 py-3 border-b border-gray-100">
          <div
            class="w-[800px] min-h-[42px] transition-all duration-500 ease-in-out"
            :style="{
              maxHeight: isExpanded ? '800px' : '42px',
              opacity: isExpanded ? '1' : '0.95',
            }"
            style="overflow: hidden"
          >
            <FilterTags
              :tags="filterTags"
              v-model:selectedTags="selectedTags"
              :is-expanded="isExpanded"
            />
          </div>
          <div class="py-3 pr-4">
            <ChevronDown
              @click="toggleExpand"
              class="w-5 h-5 text-gray-400 cursor-pointer hover:text-gray-600 transition-all duration-500"
              :class="{ 'transform rotate-180': isExpanded }"
            />
          </div>
        </div>

        <!-- 文章列表 -->
        <div class="p-4">
          <div class="w-full overflow-hidden">
            <PostCard
              v-for="article in articles"
              :key="article.id"
              :post="article"
              class="w-full mb-2 last:mb-0"
            />

            <!-- 添加分页组件 -->
            <div class="flex justify-center mt-6">
              <a-pagination
                v-model:current="pageNumber"
                v-model:pageSize="pageSize"
                :total="total"
                :show-total="(total) => `共 ${total} 条`"
                @change="handlePageChange"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 右侧登录区域 -->
    <div class="w-[340px] flex flex-col gap-5">
      <!-- 修改这里：只在未登录时显示 LoginCard -->
      <LoginCard v-if="!authStore.isAuthenticated" />
      <div class="sticky top-[10px]">
        <MustReadList :list="mustReadList" />
      </div>
    </div>
  </div>

  <!-- 简化后的 PostModal 使用 -->
  <PostModal v-model="showPostModal" @publish="handlePostPublished" />
</template>

<script setup>
import { ref, computed, onMounted, nextTick, watch, onUnmounted } from "vue";
import { useAuthStore } from "@/stores/auth"; // 修改为使用 auth store
import { tags } from "../../../api/frontend/tags.js";
import { post } from "../../../api/frontend/post.js";
import LoginCard from "../../../components/forum/NowLoginCard.vue";
import PostCard from "../../../components/forum/PostCard.vue";
import {
  FileText,
  Users,
  MessageCircle,
  Share2,
  PenLine,
  Search,
  PencilLine,
  ChevronDown,
  X,
} from "lucide-vue-next";
import TopicListButton from "../../../components/topics/TopicListButton.vue";
import FilterTags from "../../../components/forum/TagList.vue";
import MustReadList from "../../../components/forum/MustReadList.vue";
import PostModal from "../../../components/forum/PostModal.vue";
import { message } from "ant-design-vue"; // 引入消息提示组件
import { useRouter, useRoute } from "vue-router";
import { Pagination as APagination } from "ant-design-vue";

const router = useRouter();
const route = useRoute();

const authStore = useAuthStore(); // 修改为使用 auth store

const selectedCard = ref(Number(route.params.category) || 1);

const cards = [
  {
    title: "求职面试",
    icon: FileText,
    iconColor: "text-[#2196f3]",
    activeColor: "#2196f3",
  },
  {
    title: "职场与内推",
    icon: Users,
    iconColor: "text-[#4caf50]",
    activeColor: "#4caf50",
  },
  {
    title: "技术交流",
    icon: MessageCircle,
    iconColor: "text-[#9c27b0]",
    activeColor: "#9c27b0",
  },
  {
    title: "学习分享",
    icon: Share2,
    iconColor: "text-[#ff9800]",
    activeColor: "#ff9800",
  },
  {
    title: "意见反馈",
    icon: PenLine,
    iconColor: "text-[#00bcd4]",
    activeColor: "#00bcd4",
  },
];

const selectCard = (index) => {
  const categoryId = index + 1;
  selectedCard.value = categoryId;

  // 重置分页到第一页
  pageNumber.value = 1;

  // 更新路由并获取对应分类的文章
  router.push({
    name: "Forum",
    params: { category: categoryId },
  });
};

// 添加路由监听
watch(
  () => route.params.category,
  (newCategory) => {
    if (newCategory) {
      selectedCard.value = Number(newCategory);
    } else {
      selectedCard.value = 1; // 默认选中第一个
    }
  }
);

// 标签页数据
const tabs = [
  { id: "latest", name: "最新" },
  { id: "hot", name: "最热" },
  { id: "following", name: "关注" },
];

const currentTab = ref("latest");

// 文章列表相关状态 - 移动到顶部并保持简洁
const articles = ref([]);
const pageNumber = ref(1);
const pageSize = ref(10);
const total = ref(0);
const loading = ref(false);

// 添加搜索相关状态
const searchTitle = ref("");

// 获取文章列表
const fetchArticles = async (category) => {
  try {
    loading.value = true;
    const result = await post.getPostList({
      category: category,
      pageNumber: pageNumber.value,
      pageSize: pageSize.value,
      title: searchTitle.value, // 添加标题搜索参数
    });

    if (result.code === 200) {
      const { data: pageData } = result;
      articles.value = pageData.data.map((item) => ({
        id: item.id,
        avatar: item.avatar,
        title: item.title,
        content: item.content,
        tags: item.tagsList.map((tag) => ({
          text: tag.name,
          color: tag.color.toLowerCase(),
        })),
        likes: item.thumbNum || 0,
        views: 0, // API中没有这个字段
        comments: item.replyList?.length || 0,
        stars: item.favourNum || 0,
        createTime: item.createTime,
        isAnonymous: item.isAnonymous === 1,
        nickname: item.nickname,
      }));
      total.value = parseInt(pageData.total);
    }
  } catch (error) {
    console.error("获取文章列表失败:", error);
    message.error("获取文章列表失败");
  } finally {
    loading.value = false;
  }
};

// 添加搜索处理函数，添加防抖
let searchTimer;
const handleSearch = () => {
  if (searchTimer) clearTimeout(searchTimer);

  searchTimer = setTimeout(() => {
    pageNumber.value = 1; // 重置到第一页
    fetchArticles(selectedCard.value);
  }, 300);
};

// 修改标签选项数据的定义和初始化
const filterTags = ref([]);

// 修改获取标签的函数
const fetchTags = async () => {
  try {
    const result = await tags.getTagsList();
    if (result.code === 200) {
      // 转换数据格式以匹配现有的使用方式
      filterTags.value = result.data.map((tag) => ({
        text: tag.name,
        color: tag.color.toLowerCase(), // 确保颜色代码小写
        id: tag.id,
      }));
    }
  } catch (error) {
    console.error("获取标签失败:", error);
  }
};

// 修改 onMounted 钩子，添加标签数据获取
onMounted(async () => {
  await authStore.initialize();
  fetchTags(); // 获取标签数据
});

// 选中的标签
const selectedTags = ref([]);

// 添加展开状态控制
const isExpanded = ref(false);

// 添加切换函数
const toggleExpand = () => {
  isExpanded.value = !isExpanded.value;
};

// 修改必读榜假数据
const mustReadList = ref([
  {
    id: 1,
    avatar:
      "https://pic.leetcode.cn/1699000361-IIuoOH-%E9%9B%B6%E8%B5%B7%E6%AD%A5%E5%AD%A6%E7%AE%97%E6%B3%95.png",
    title: "2024年前端面试路线图",
    views: 12000,
    likes: 3200,
    isRead: false,
  },
  {
    id: 2,
    avatar:
      "https://pic.leetcode.cn/1699000361-IIuoOH-%E9%9B%B6%E8%B5%B7%E6%AD%A5%E5%AD%A6%E7%AE%97%E6%B3%95.png",
    title: "Vue3 + TypeScript 完整项目实战",
    views: 8500,
    likes: 2100,
    isRead: true,
  },
  {
    id: 3,
    avatar:
      "https://pic.leetcode.cn/1699000361-IIuoOH-%E9%9B%B6%E8%B5%B7%E6%AD%A5%E5%AD%A6%E7%AE%97%E6%B3%95.png",
    title: "零基础入门算法 - 系列教程",
    views: 7800,
    likes: 1900,
    isRead: false,
  },
  {
    id: 4,
    avatar:
      "https://pic.leetcode.cn/1699000361-IIuoOH-%E9%9B%B6%E8%B5%B7%E6%AD%A5%E5%AD%A6%E7%AE%97%E6%B3%95.png",
    title: "后端开发必学的设计模式",
    views: 6500,
    likes: 1500,
    isRead: true,
  },
  {
    id: 5,
    avatar:
      "https://pic.leetcode.cn/1699000361-IIuoOH-%E9%9B%B6%E8%B5%B7%E6%AD%A5%E5%AD%A6%E7%AE%97%E6%B3%95.png",
    title: "深入理解 React 原理",
    views: 5900,
    likes: 1300,
    isRead: false,
  },
]);

// 添加模态框控制状态
const showPostModal = ref(false);

// 添加发布成功的处理函数
const handlePostPublished = () => {
  // 可以在这里刷新文章列表
  showPostModal.value = false;
};

// 修改标签选项数据结构
const allTags = computed(() => {
  return filterTags.value.map((tag) => ({
    label: tag.text,
    value: tag.id,
    color: tag.color,
  }));
});

// 过滤标签 - 修改计算属性
const filteredTags = computed(() => {
  if (!tagSearchQuery.value) {
    // 当搜索框为空时，返回所有未选择的标签
    return allTags.value.filter(
      (tag) =>
        !selectedSearchTags.value.some(
          (selected) => selected.value === tag.value
        )
    );
  }
  // 当有搜索内容时，在未选择的标签中进行搜索
  return allTags.value.filter(
    (tag) =>
      tag.label.toLowerCase().includes(tagSearchQuery.value.toLowerCase()) &&
      !selectedSearchTags.value.some((selected) => selected.value === tag.value)
  );
});

// 修改添加标签的逻辑,移除对isTagSearchFocused的操作
const addTag = (tag) => {
  if (selectedSearchTags.value.length < 8) {
    selectedSearchTags.value.push(tag);
    tagSearchQuery.value = "";
    // 添加这一行来保持输入框的焦点
    document.querySelector('input[placeholder="搜索标签..."]')?.focus();
  }
};

// 修改移除标签的逻辑，移除焦点相关代码
const removeTag = (tag) => {
  selectedSearchTags.value = selectedSearchTags.value.filter(
    (t) => t.value !== tag.value
  );
};

// 添加清空搜索功能
const clearTagSearch = () => {
  tagSearchQuery.value = "";
  // 保持焦点状态，这样下拉框不会关闭
  document.querySelector('input[placeholder="搜索标签..."]')?.focus();
};

// 添加缺失的引用变量
const tagSearchQuery = ref("");
const selectedSearchTags = ref([]);

// 监听分类变化
watch(
  () => route.params.category,
  (newCategory) => {
    if (newCategory) {
      fetchArticles(newCategory);
    } else {
      fetchArticles(1); // 默认加载第一个分类
    }
  },
  { immediate: true }
);

// 分页相关逻辑
const handlePageChange = (page, pageSize) => {
  pageNumber.value = page;
  pageSize.value = pageSize;
  fetchArticles(selectedCard.value);
};

// 监听分页变化
watch([pageNumber, pageSize], () => {
  fetchArticles(selectedCard.value);
});
</script>

<style scoped>
.card-container {
  width: 100%; /* 修改为100%宽度 */
  height: 140px;
  background: white;
  border-radius: 16px;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.card-container:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.card-content {
  height: 100%;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: 1rem;
}

.icon-wrapper {
  padding: 8px;
  border-radius: 12px;
  background: rgba(0, 0, 0, 0.04);
  display: flex;
  align-items: center;
  justify-content: center;
}

.card-container.active {
  color: white;
}

.card-container.active .icon-wrapper {
  background: rgba(255, 255, 255, 0.2);
}

.card-container.active:nth-child(1) {
  background-color: #2196f3;
}

.card-container.active:nth-child(2) {
  background-color: #4caf50;
}

.card-container.active:nth-child(3) {
  background-color: #9c27b0;
}

.small-card:nth-child(1).active {
  background-color: #ff9800;
}

.small-card:nth-child(2).active {
  background-color: #00bcd4;
}

.small-card {
  height: 64px; /* 调整为64px，(140px - 12px) / 2 */
  width: 100%; /* 修改为100%宽度 */
}

.small-card .card-content {
  padding: 0.75rem 1rem;
  flex-direction: row;
  align-items: center;
  gap: 0.75rem;
}

.small-card .icon-wrapper {
  padding: 6px;
}

/* 删除以下样式，因为不再需要 */
.flex {
  min-width: max-content;
}

.card-container:last-child {
  margin-right: 0;
}

/* 添加标签悬停效果和圆角 */
:deep(.ant-tag) {
  padding: 0 10px;
  margin-right: 0; /* 覆盖 ant-design-vue 的默认外边距 */
  margin-bottom: 0; /* 覆盖 ant-design-vue 的默认外边距 */
}

.ant-tag:hover {
  opacity: 0.8;
}

/* 添加过渡动画样式 */
.flex-wrap {
  transition: all 0.3s ease-in-out;
}

/* 优化过渡动画 */
.transition-all {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* 添加输入框动画相关样式 */
.title-input-container {
  position: relative;
}

.focus-line {
  transform-origin: center;
}

/* 修改动画线条的过渡效果 */
.bg-purple-500 {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* 添加分页样式 */
:deep(.ant-pagination) {
  margin: 16px 0;
}

:deep(.ant-pagination-item-active) {
  border-color: #9333ea;

  a {
    color: #9333ea;
  }
}

:deep(.ant-pagination-item:hover) {
  border-color: #9333ea;

  a {
    color: #9333ea;
  }
}

/* 添加搜索按钮悬停效果 */
.search-button:hover {
  @apply text-gray-600;
}

/* 添加标签区域的样式 */
.w-[800px] {
  /* 防止内容加载时的布局抖动 */
  overflow: hidden;
  width: 800px;
  min-height: 42px;
}
</style>
