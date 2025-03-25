<template>
  <PostDetailSkeleton v-show="loading"/>
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
            <ChevronLeft class="w-6 h-6"/>
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
            <img :src="post.avatar" class="w-10 h-10 rounded-full"/>
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
                <Share2 class="w-4 h-4"/>
                <span class="text-[15px]">分享</span>
              </button>
            </div>
            <!-- 回复按钮样式调整 -->
            <button
                @click="showReplyForm(null, false)"
                class="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-1.5 text-sm"
            >
              <MessageSquare class="w-4 h-4"/>
              <span>评论</span>
            </button>
          </div>
        </div>
      </div>

      <!-- 评论导航 -->
      <div
          class="w-full bg-white rounded-2xl p-2 flex items-center justify-between"
      >
        <div class="text-gray-900 font-medium pl-2">
          共 {{ post.replyNum }} 条评论
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
            <Flame v-if="commentSort === 'hot'" class="w-4 h-4"/>
            <TrendingUp v-else class="w-4 h-4"/>
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
            <Clock v-if="commentSort === 'new'" class="w-4 h-4"/>
            <History v-else class="w-4 h-4"/>
            New
          </button>
        </div>
      </div>

      <!-- 评论列表卡片 -->
      <div class="w-full bg-white rounded-2xl p-5">
        <CommentList
            :comments="comments"
            :loading="commentsLoading"
            @reply="handleCommentReply"
            @like="handleCommentLike"
            @expand="handleExpandComment"
        />
        <!-- 添加分页器 -->
        <div class="mt-4 flex justify-center" v-if="total > 0">
          <a-pagination
              v-model:current="currentPage"
              :total="total"
              :pageSize="pageSize"
              @change="handlePageChange"
          />
        </div>
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
              {{ post.participantNum }}
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
  <div v-if="isReplyVisible" class="fixed bottom-0 left-0 right-0 bg-white shadow-lg transform transition-transform duration-300"
       :class="isReplyVisible ? 'translate-y-0' : 'translate-y-full'">
    <div class="max-w-screen-xl mx-auto px-4 pb-4 pt-2">
      <!-- 添加工具栏 -->
      <div class="flex items-center gap-3 mb-2 px-2 py-1 border-b">
        <button
            class="p-1.5 hover:bg-gray-100 rounded-lg text-gray-600"
            @click="showEmojiPicker = !showEmojiPicker"
        >
          <Smile class="w-5 h-5"/>
        </button>
        <!-- <button class="p-1.5 hover:bg-gray-100 rounded-lg text-gray-600">
          <Image class="w-5 h-5"/>
        </button>
        <button class="p-1.5 hover:bg-gray-100 rounded-lg text-gray-600">
          <Link class="w-5 h-5"/>
        </button> -->
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
        <div class="flex-1">
          <!-- 仅当回复评论时（type === 2）才显示前缀 -->
          <div v-if="isShowReply" class="mb-2 ml-1 text-sm text-gray-500">
            回复 {{ currentReply.toAuthor }}：
          </div>
          <div class="flex items-start gap-4"> <!-- 新增这个包装层 -->
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
    </div>
  </div>
</template>

<script setup>
import {ref, onMounted, computed, nextTick} from "vue"; // 添加 computed 导入
import {useRoute, useRouter} from "vue-router";
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
import {formatNumber} from "../../../utils/format.js";
import CommentList from "../../../components/comment/CommentList.vue";
import {withAuth} from "../../../utils/authGuard.js";
import {post} from "../../../api/frontend/post.js";
import Vditor from "vditor";
import "vditor/dist/index.css";
import {message} from "ant-design-vue";
import PostDetailSkeleton from "../../../components/skeleton/PostDetailSkeleton.vue";

const route = useRoute();
const router = useRouter();

// 修改 post 的默认值结构，添加 accountId 字段
const post = ref({
  id: "",
  accountId: "", // 添加帖子作者的账号ID
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
  replyNum: 0, // 添加评论数量字段
  participantNum: 1, // 添加参与人数字段
  statistics: {
    favorites: 0,
    participants: 0,
    views: 3100, // 保留默认值
  },
});

const loading = ref(true);
const vditorReady = ref(false);
const dataReady = ref(false);
const isShowReply = ref(false);

// 修改获取帖子详情的方法
const fetchPostDetail = async () => {
  try {
    dataReady.value = false;
    vditorReady.value = false;
    const id = route.params.id;

    // 1. 获取帖子详情
    const result = await post.getPostDetail(id);
    // 2. 获取评论列表以获取总数
    const replyResult = await post.getReplyList({
      postId: id,
      pageNumber: 1,
      pageSize: 5,
    });

    if (result.code === 200) {
      const data = result.data;
      post.value = {
        ...post.value,
        id: data.id,
        accountId: data.accountId,
        title: data.title,
        content: data.content,
        author: data.nickname,
        avatar: data.avatar,
        createTime: data.createTime,
        replyNum: parseInt(data.replyNum) || 0,
        participantNum: parseInt(data.participantNum) || 1,
        likes: data.thumbNum || 0,
        stars: data.favourNum || 0,
        views: 3100,
        isLiked: data.isThumb || false,
        isFavorited: data.isFavour || false,
        tags:
            data.tagsList?.map((tag) => ({
              text: tag.name,
              color: tag.color,
            })) || [],
        statistics: {
          favorites: data.favourNum || 0,
          participants: data.replyList?.length || 0,
          views: 3100,
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

  // 然后获取帖子详情
  await Promise.all([fetchPostDetail(), fetchComments()]);
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

// 修改回复相关的状态
const currentReply = ref({
  type: 1,
  toAccountId: null,
  toAuthor: '',
  rootId: null,  // 根评论ID
  replyToId: null // 添加直接回复的评论ID
});

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

// 添加日志用于调试
const showReplyForm = (replyTo = null, showReplyFlag = false) => {
  console.log('showReplyForm called with:', { replyTo, showReplyFlag });

  if (replyTo && typeof replyTo === 'object') {
    console.log('回复评论，完整数据:', replyTo);

    // 回复评论
    currentReply.value = {
      type: 2,
      toAccountId: replyTo.accountId, // 使用当前被回复评论的作者ID
      toAuthor: replyTo.author,       // 使用当前被回复评论的作者名
      rootId: replyTo.rootId || replyTo.id, // 如果是子评论就用rootId，否则用当前评论id
      replyToId: replyTo.id // 保存实际回复的评论ID
    };

    console.log('设置的回复数据:', currentReply.value);
  } else {
    // 直接评论帖子
    currentReply.value = {
      type: 1,
      toAccountId: post.value.accountId,
      toAuthor: '',
      rootId: null,
      replyToId: null
    };
  }
  replyContent.value = '';
  isReplyVisible.value = true;
  isShowReply.value = showReplyFlag;
};

// 修改提交回复的方法
const handleSubmitReply = withAuth(async () => {
  if (!replyContent.value.trim()) {
    message.warning("请输入回复内容");
    return;
  }

  try {
    let replyData;
    if (currentReply.value.type === 2) {
      // 子评论参数结构
      replyData = {
        postId: parseInt(route.params.id),
        content: replyContent.value.trim(),
        type: 2,
        toAccountId: currentReply.value.toAccountId, // 使用实际被回复者的ID
        rootId: currentReply.value.rootId,
        replyToId: currentReply.value.replyToId // 添加实际回复的评论ID
      };
      console.log('发送回复数据:', replyData); // 添加日志
    } else {
      // 普通回复参数结构
      replyData = {
        postId: parseInt(route.params.id),
        content: replyContent.value.trim(),
        type: 1,
        toAccountId: currentReply.value.toAccountId,
      };
    }

    const result = await post.sendReply(replyData);

    if (result.code === 200) {
      message.success("回复成功");
      hideReplyForm();
      
      // 保存当前页码和展开状态
      const currentExpandedIds = new Set(expandedCommentIds.value);
      const currentPageNum = currentPage.value;
      
      // 重新加载评论列表
      await fetchComments();
      
      // 恢复页码
      if (currentPageNum !== currentPage.value) {
        currentPage.value = currentPageNum;
        await fetchComments();
      }

      // 如果是子评论，立即展开父评论的子评论列表
      if (currentReply.value.type === 2 && currentReply.value.rootId) {
        const parentComment = comments.value.find(c => c.id === currentReply.value.rootId);
        if (parentComment && !parentComment.isExpanded) {
          await handleExpandComment(parentComment, true); // 添加 force 参数
        }
      }
    } else {
      message.error("回复失败，请稍后重试");
    }
  } catch (error) {
    console.error("回复发送失败:", error);
    message.error("回复发送失败，请稍后重试");
  }
});

// 修改评论回复处理方法
const handleCommentReply = (comment, showReplyFlag) => {
  showReplyForm(comment, showReplyFlag);
};

// 添加插入表情的方法
const insertEmoji = (emoji) => {
  replyContent.value += emoji;
};

// 添加隐藏回复框的方法
const hideReplyForm = () => {
  isReplyVisible.value = false;
  showEmojiPicker.value = false;
  replyContent.value = "";
};

// 修改处理返回按钮点击的方法
const handleBack = () => {
  // 如果有上一页历史记录，就返回上一页
  if (window.history.length > 1) {
    router.back()
  } else {
    // 如果没有历史记录（比如直接通过链接访问），则返回讨论页面
    router.push('/forum')
  }
}

// 修改评论相关的数据定义
const commentCount = computed(() => total.value);
const comments = ref([]);

// 添加一个Set来记录已展开的评论ID
const expandedCommentIds = ref(new Set());

// 修改获取评论列表的方法
const fetchComments = async () => {
  commentsLoading.value = true;
  try {
    const result = await post.getReplyList({
      postId: route.params.id,
      pageNumber: currentPage.value,
      pageSize: pageSize.value,
    });

    if (result.code === 200) {
      const newComments = result.data.data?.map((reply) => ({
        id: reply.id,
        author: reply.nickname,
        avatar: reply.avatar || "default-avatar-url",
        content: reply.content,
        createTime: reply.createTime,
        likes: reply.thumbNum || 0,
        isLiked: reply.isThumb || false,
        accountId: reply.accountId,
        childReplyNum: parseInt(reply.childReplyNum) || 0,
        isExpanded: expandedCommentIds.value.has(reply.id)
      })) || [];

      // 自动展开所有记录为展开状态的评论
      for (const comment of newComments) {
        if (expandedCommentIds.value.has(comment.id)) {
          await handleExpandComment(comment, true);
        }
      }

      comments.value = newComments;
      total.value = parseInt(result.data.total) || 0;
    }
  } catch (error) {
    console.error("获取评论列表失败:", error);
    message.error("获取评论列表失败");
  } finally {
    commentsLoading.value = false;
  }
};

// 修改处理展开评论的方法
const handleExpandComment = async (comment, force = false) => {
  try {
    // 如果是强制展开或当前未展开
    if (force || !comment.isExpanded) {
      const result = await post.getChildReplyList(comment.id);
      if (result.code === 200) {
        comment.childReplies = result.data.map(reply => ({
          id: reply.id,
          author: reply.nickname,
          toAuthor: reply.toNickname,
          avatar: reply.avatar || "default-avatar-url",
          content: reply.content,
          createTime: reply.createTime,
          likes: reply.thumbNum || 0,
          isLiked: reply.isThumb || false,
          accountId: reply.accountId,
          toAccountId: reply.toAccountId,
          rootId: comment.id // 添加根评论ID
        }));
        // 添加到已展开集合
        expandedCommentIds.value.add(comment.id);
        comment.isExpanded = true;
      }
    } else if (!force) {
      // 从已展开集合中移除（仅在非强制模式下）
      expandedCommentIds.value.delete(comment.id);
      comment.isExpanded = false;
    }
  } catch (error) {
    console.error("获取子评论失败:", error);
    message.error("获取子评论失败");
  }
};

// 处理页码变化
const handlePageChange = (page) => {
  currentPage.value = page;
  fetchComments();
};

// 添加评论相关的数据
const commentSort = ref("hot"); // 'hot' 或 'new'
const currentPage = ref(1);
const pageSize = ref(5);
const total = ref(0);
const commentsLoading = ref(false);

onMounted(async () => {
  loading.value = true;
  dataReady.value = false;
  vditorReady.value = false;

  // 然后获取帖子详情
  await Promise.all([fetchPostDetail(), fetchComments()]);
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

/* 添加不可选中样式 */
.select-none {
  user-select: none;
  -webkit-user-select: none;
}

/* 删除之前的回复框前缀相关样式 */
/* .bg-gray-50 {
  border-top-left-radius: 0.5rem;
  border-top-right-radius: 0.5rem;
  border-bottom: 1px solid #e5e7eb;
} */

textarea::placeholder {
  color: #9CA3AF;
}
</style>
