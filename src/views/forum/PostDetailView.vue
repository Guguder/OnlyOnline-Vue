<template>
  <PostDetailSkeleton v-show="loading" />
  <div
    v-show="!loading"
    class="w-screen min-h-screen flex justify-center gap-[20px] mt-[20px] mb-[40px]"
  >
    <!-- 左侧内容区域 -->
    <div class="w-[700px] flex flex-col gap-2">
      <!-- 文章详情卡片 -->
      <div class="w-full bg-white rounded-2xl">
        <!-- 移动页头到卡片内部 -->
        <div class="flex items-center justify-between pl-3 pr-6 py-4">
          <!-- 左侧返回按钮 -->
          <button
            @click="handleBack"
            class="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ChevronLeft class="w-6 h-6" />
          </button>

          <!-- 右侧面包屑 -->
          <a-breadcrumb>
            <a-breadcrumb-item>讨论区</a-breadcrumb-item>
            <a-breadcrumb-item>技术交流</a-breadcrumb-item>
            <a-breadcrumb-item>帖子详情</a-breadcrumb-item>
          </a-breadcrumb>
        </div>
        <div class="mx-5 h-[1px] bg-[#E5E5E5]"></div>
        <div class="px-5 pt-6 pb-2">
          <h1 class="text-2xl font-bold text-gray-900 mb-4">
            {{ post.title }}
          </h1>

          <!-- 作者信息 -->
          <div class="flex items-center gap-3 mb-2">
            <img :src="post.avatar" class="w-10 h-10 rounded-full" />
            <div class="flex flex-col">
              <span class="text-sm font-medium">{{ post.author }}</span>
              <span class="text-xs text-gray-500">{{ post.createTime }}</span>
            </div>
          </div>

          <!-- 文章内容 -->
          <div class="prose max-w-none">
            <div id="vditor-preview" class="vditor-reset"></div>
          </div>

          <!-- 底部数据 -->
          <div class="flex items-center justify-between mt-6 pt-2 border-t">
            <div class="flex items-center">
              <!-- 点赞按钮 -->
              <button
                @click="toggleLike"
                class="action-btn"
                :class="post.isLiked ? 'text-blue-500' : 'text-gray-500'"
              >
                <ThumbsUp
                  class="w-4 h-4"
                  :fill="post.isLiked ? 'currentColor' : 'none'"
                />
                <span class="text-[15px]">{{ formatNumber(post.likes) }}</span>
              </button>
              <!-- 收藏按钮 -->
              <button
                @click="toggleFavorite"
                class="action-btn"
                :class="post.isFavorited ? 'text-yellow-500' : 'text-gray-500'"
              >
                <Star
                  class="w-4 h-4"
                  :fill="post.isFavorited ? 'currentColor' : 'none'"
                />
                <span class="text-[15px]">收藏</span>
              </button>
              <!-- 分享按钮 -->
              <button @click="shareArticle" class="action-btn text-gray-500">
                <Share2 class="w-4 h-4" />
                <span class="text-[15px]">分享</span>
              </button>
            </div>
            <!-- 回复按钮样式调整 -->
            <button
              @click="showReplyForm"
              class="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-1.5 text-sm"
            >
              <MessageSquare class="w-4 h-4" />
              <span>回复</span>
            </button>
          </div>
        </div>
      </div>

      <!-- 评论导航 -->
      <div
        class="w-full bg-white rounded-2xl p-2 flex items-center justify-between"
      >
        <div class="text-gray-900 font-medium pl-2">
          共 {{ commentCount }} 条评论
        </div>
        <div class="flex gap-2">
          <button
            @click="commentSort = 'hot'"
            :class="[
              'px-3 py-1.5 rounded-lg text-sm transition-colors flex items-center gap-1.5',
              commentSort === 'hot'
                ? 'bg-gray-100 text-gray-900'
                : 'text-gray-500 hover:bg-gray-50',
            ]"
          >
            <Flame v-if="commentSort === 'hot'" class="w-4 h-4" />
            <TrendingUp v-else class="w-4 h-4" />
            Hot
          </button>
          <button
            @click="commentSort = 'new'"
            :class="[
              'px-3 py-1.5 rounded-lg text-sm transition-colors flex items-center gap-1.5',
              commentSort === 'new'
                ? 'bg-gray-100 text-gray-900'
                : 'text-gray-500 hover:bg-gray-50',
            ]"
          >
            <Clock v-if="commentSort === 'new'" class="w-4 h-4" />
            <History v-else class="w-4 h-4" />
            New
          </button>
        </div>
      </div>

      <!-- 评论列表卡片 -->
      <div class="w-full bg-white rounded-2xl p-5">
        <CommentList
          :comments="comments"
          @reply="handleCommentReply"
          @like="handleCommentLike"
        />
      </div>
    </div>

    <!-- 右侧区域 -->
    <div class="w-[300px] flex flex-col gap-5">
      <div class="bg-white rounded-2xl p-5">
        <!-- 统计数据展示 -->
        <div class="flex flex-col gap-4">
          <div class="flex items-center justify-between">
            <span class="text-gray-500">收藏次数</span>
            <div class="bg-gray-50 px-3 py-1 rounded text-gray-900 font-bold">
              {{ statistics.favorites }}
            </div>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-gray-500">参与人数</span>
            <div class="bg-gray-50 px-3 py-1 rounded text-gray-900 font-bold">
              {{ statistics.participants }}
            </div>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-gray-500">浏览次数</span>
            <div class="bg-gray-50 px-3 py-1 rounded text-gray-900 font-bold">
              {{ statistics.views }}
            </div>
          </div>
          <div class="mx-0.5 h-[1px] bg-[#E5E5E5]"></div>
          <!-- 添加标签展示区域 -->
          <div class="flex flex-col gap-2">
            <span class="text-gray-500">相关标签</span>
            <div class="flex flex-wrap gap-2 mt-2">
              <a-tag
                v-for="tag in post.tags"
                :key="tag.text"
                :color="tag.color"
              >
                {{ tag.text }}
              </a-tag>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- 修改回复输入框部分 -->
  <div
    v-if="isReplyVisible"
    class="fixed bottom-0 left-0 right-0 bg-white shadow-lg transform transition-transform duration-300"
    :class="isReplyVisible ? 'translate-y-0' : 'translate-y-full'"
  >
    <div class="max-w-screen-xl mx-auto p-4">
      <!-- 添加工具栏 -->
      <div class="flex items-center gap-3 mb-2 px-2 py-1 border-b">
        <button
          class="p-1.5 hover:bg-gray-100 rounded-lg text-gray-600"
          @click="showEmojiPicker = !showEmojiPicker"
        >
          <Smile class="w-5 h-5" />
        </button>
        <button class="p-1.5 hover:bg-gray-100 rounded-lg text-gray-600">
          <Image class="w-5 h-5" />
        </button>
        <button class="p-1.5 hover:bg-gray-100 rounded-lg text-gray-600">
          <Link class="w-5 h-5" />
        </button>
      </div>

      <!-- 表情选择面板 -->
      <div
        v-if="showEmojiPicker"
        class="absolute bottom-full left-4 bg-white border rounded-lg shadow-lg p-2 mb-2"
      >
        <div class="grid grid-cols-8 gap-1">
          <button
            v-for="emoji in emojis"
            :key="emoji"
            @click="insertEmoji(emoji)"
            class="p-2 hover:bg-gray-100 rounded text-xl"
          >
            {{ emoji }}
          </button>
        </div>
      </div>

      <div class="flex gap-4">
        <textarea
          v-model="replyContent"
          placeholder="写下你的评论..."
          class="flex-1 min-h-[100px] p-3 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
        ></textarea>
        <div class="flex flex-col gap-2">
          <button
            @click="handleSubmitReply"
            class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            发送
          </button>
          <button
            @click="hideReplyForm"
            class="bg-gray-100 text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-200"
          >
            取消
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, nextTick } from "vue"; // 添加 computed 导入
import { useRoute, useRouter } from "vue-router";
import {
  ThumbsUp,
  Star,
  Share2,
  MessageSquare,
  ChevronLeft,
  Smile,
  Image,
  Link,
  Flame,
  TrendingUp,
  Clock,
  History,
} from "lucide-vue-next";
import { formatNumber } from "../../utils/format.js";
import CommentList from "../../components/comment/CommentList.vue";
import { withAuth } from "../../utils/authGuard.js";
import { blog } from "../../api/blog";
import Vditor from "vditor";
import "vditor/dist/index.css";
import { message } from "ant-design-vue";
import PostDetailSkeleton from "../../components/skeleton/PostDetailSkeleton.vue";

const route = useRoute();
const router = useRouter();

// 修改post的默认值结构
const post = ref({
  id: "",
  title: "",
  content: "",
  author: "",
  avatar: "",
  createTime: "",
  likes: 0,
  stars: 0,
  views: 3100, // 保留默认值，因为API中没有这个字段
  isLiked: false,
  isFavorited: false,
  tags: [],
  statistics: {
    favorites: 0,
    participants: 0,
    views: 3100, // 保留默认值
  },
});

const loading = ref(true);
const vditorReady = ref(false);
const dataReady = ref(false);

// 修改获取帖子详情的方法
const fetchPostDetail = async () => {
  try {
    dataReady.value = false;
    vditorReady.value = false;
    const id = route.params.id;
    await new Promise((resolve) => setTimeout(resolve, 300));
    const result = await blog.getPostDetail(id);
    if (result.code === 200) {
      const data = result.data;
      post.value = {
        id: data.id,
        title: data.title,
        content: data.content,
        author: data.nickname,
        avatar: data.avatar,
        createTime: data.createTime,
        // 处理可能为null的字段，使用默认值
        likes: data.thumbNum || 0,
        stars: data.favourNum || 0,
        views: 3100, // 保持默认值
        isLiked: data.isThumb || false,
        isFavorited: data.isFavour || false,
        // 转换标签数据结构
        tags:
          data.tagsList?.map((tag) => ({
            text: tag.name,
            color: tag.color,
          })) || [],
        // 统计信息
        statistics: {
          favorites: data.favourNum || 0,
          participants: data.replyList?.length || 0,
          views: 3100, // 保持默认值
        },
      };

      dataReady.value = true;

      // 使用 nextTick 确保 DOM 更新后再初始化 Vditor
      await nextTick();
      const vditorElement = document.getElementById("vditor-preview");
      if (vditorElement) {
        try {
          await Vditor.preview(vditorElement, data.content, {
            markdown: {
              breaks: true,
            },
            after: () => {
              vditorReady.value = true;
              checkLoadingStatus();
            },
          });
        } catch (error) {
          console.error("Vditor preview error:", error);
          // 即使 Vditor 出错也允许显示其他内容
          vditorReady.value = true;
          checkLoadingStatus();
        }
      } else {
        console.error("Vditor element not found");
        // 如果找不到 Vditor 元素也允许显示其他内容
        vditorReady.value = true;
        checkLoadingStatus();
      }
    }
  } catch (error) {
    console.error("获取帖子详情失败:", error);
    message.error("获取帖子详情失败");
    // 出错时也要关闭加载状态
    loading.value = false;
  }
};

// 检查加载状态
const checkLoadingStatus = () => {
  if (dataReady.value && vditorReady.value) {
    // 添加短暂延迟确保平滑过渡
    setTimeout(() => {
      loading.value = false;
    }, 100);
  }
};

// 在组件挂载时获取数据
onMounted(async () => {
  loading.value = true;
  dataReady.value = false;
  vditorReady.value = false;

  // 先滚动到顶部
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });

  // 然后获取帖子详情
  await fetchPostDetail();
});

// 添加统计数据
const statistics = computed(() => ({
  favorites: post.value?.statistics.favorites || 0,
  participants: post.value?.statistics.participants || 0,
  views: post.value?.statistics.views || 0,
}));

// 添加交互状态
const isLiked = ref(false);
const isFavorited = ref(false);

// 添加回复框相关的响应式变量
const isReplyVisible = ref(false);
const replyContent = ref("");

// 添加表情相关的响应式变量
const showEmojiPicker = ref(false);
const emojis = [
  "😀",
  "😂",
  "🤣",
  "😊",
  "😍",
  "🤔",
  "😎",
  "😭",
  "👍",
  "❤️",
  "🎉",
  "✨",
  "🔥",
  "💯",
  "🤝",
  "👏",
];

// 点赞功能
const toggleLike = withAuth(() => {
  isLiked.value = !isLiked.value;
  if (isLiked.value) {
    post.value.likes++;
  } else {
    post.value.likes--;
  }
  // TODO: 调用后端API
});

// 收藏功能
const toggleFavorite = () => {
  isFavorited.value = !isFavorited.value;
  // TODO: 调用后端API
};

// 分享功能
const shareArticle = () => {
  // TODO: 实现分享逻辑，可以调用系统分享API或显示分享弹窗
  console.log("分享文章");
};

// 回复功能
const showReplyForm = () => {
  isReplyVisible.value = true;
};

// 添加隐藏回复框的方法，同时关闭表情选择器
const hideReplyForm = () => {
  isReplyVisible.value = false;
  showEmojiPicker.value = false;
  replyContent.value = ""; // 清空回复内容
};

// 添加提交回复的方法
const handleSubmitReply = withAuth(() => {
  if (!replyContent.value.trim()) {
    return;
  }
  console.log("提交回复:", replyContent.value);
  // TODO: 调用后端API提交回复
  hideReplyForm(); // 提交后关闭回复框
});

// 添加插入表情的方法
const insertEmoji = (emoji) => {
  replyContent.value += emoji;
};

// 处理返回按钮点击
const handleBack = () => {
  router.push("/forum");
};

// 添加评论相关的数据
const commentCount = computed(() => post.value.statistics.participants);
const commentSort = ref("hot"); // 'hot' 或 'new'

// 评论数据
const comments = ref([
  {
    id: 1,
    author: "张三",
    avatar:
      "https://pic.leetcode.cn/1699000361-IIuoOH-%E9%9B%B6%E8%B5%B7%E6%AD%A5%E5%AD%A6%E7%AE%97%E6%B3%95.png",
    content: "这篇文章写得很好!😀",
    createTime: "2024-01-15 10:30",
    likes: 12,
    isLiked: false,
    replies: [
      {
        id: 3,
        author: "李四",
        avatar:
          "https://pic.leetcode.cn/1699000361-IIuoOH-%E9%9B%B6%E8%B5%B7%E6%AD%A5%E5%AD%A6%E7%AE%97%E6%B3%95.png",
        content: "同意楼上的观点",
        createTime: "2024-01-15 11:00",
        likes: 3,
        isLiked: false,
      },
    ],
  },
  {
    id: 2,
    author: "王五",
    avatar:
      "https://pic.leetcode.cn/1699000361-IIuoOH-%E9%9B%B6%E8%B5%B7%E6%AD%A5%E5%AD%A6%E7%AE%97%E6%B3%95.png",
    content: "学到了很多，感谢分享！",
    createTime: "2024-01-15 12:00",
    likes: 8,
    isLiked: false,
    replies: [],
  },
]);

// 处理评论回复
const handleCommentReply = (comment) => {
  showReplyForm();
  replyContent.value = `@${comment.author} `;
};

// 处理评论点赞
const handleCommentLike = (comment) => {
  comment.isLiked = !comment.isLiked;
  comment.likes += comment.isLiked ? 1 : -1;
};

onMounted(() => {
  console.log("帖子详情页面加载完成，ID:", route.params.id);
});
</script>

<style scoped>
/* 删除原来的页头相关样式 */
/* 保留其他样式 */

/* 添加 Vditor 预览样式调整 */
:deep(.vditor-reset) {
  padding: 0;
  font-size: 16px;
  line-height: 1.6;
}

/* 简化的按钮样式 */
.action-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  border-radius: 0.375rem;
}

/* 添加输入框动画效果 */
.transform {
  will-change: transform;
}

/* 添加阴影效果 */
.shadow-lg {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

/* 添加表情选择器样式 */
.grid-cols-8 {
  grid-template-columns: repeat(8, minmax(0, 1fr));
}

.prose {
  max-width: none;
  color: #374151;
  line-height: 1.6;
}
</style>
