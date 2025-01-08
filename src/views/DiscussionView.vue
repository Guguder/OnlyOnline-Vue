<template>
  <div class="w-screen min-h-screen flex justify-center gap-[20px] mt-[20px] mb-[40px]">
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
              selectedCard === index ? 'active' : ''
            ]"
          >
            <div class="card-content">
              <div class="icon-wrapper">
                <component
                    :is="card.icon"
                    :class="[
                    'w-8 h-8',
                    selectedCard === index ? 'text-white' : card.iconColor
                  ]"
                />
              </div>
              <span
                  :class="[ 
                  'text-lg font-medium',
                  selectedCard === index ? 'text-white' : 'text-gray-700'
                ]"
              >
                {{ card.title }}
              </span>
            </div>
          </div>

          <!-- 右侧小卡片容器 -->
          <div class="col-span-3 sm:col-span-1 flex sm:flex-col justify-between h-[140px]">
            <!-- 添加高度和justify-between -->
            <div
                v-for="(card, index) in cards.slice(3)"
                :key="index + 3"
                @click="selectCard(index + 3)"
                :class="[
                'card-container small-card transition-all duration-300 w-full',
                selectedCard === index + 3 ? 'active' : ''
              ]"
            >
              <div class="card-content">
                <div class="icon-wrapper small-icon">
                  <component
                      :is="card.icon"
                      :class="[
                      'w-6 h-6',
                      selectedCard === index + 3 ? 'text-white' : card.iconColor
                    ]"
                  />
                </div>
                <span
                    :class="[ 
                    'text-base font-medium',
                    selectedCard === index + 3 ? 'text-white' : 'text-gray-700'
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
        <div class="p-5 flex items-center justify-between border-b border-gray-100">
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
                  : 'text-gray-500 hover:text-gray-900'
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
              <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4"/>
              <input
                  type="text"
                  placeholder="搜索文章"
                  class="w-full pl-10 pr-4 py-2 bg-[#F2F3F4] rounded-lg text-sm"
              >
            </div>
            <button
                class="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg text-sm flex items-center transition-colors">
              <PencilLine class="h-4 w-4 mr-2"/>
              发起讨论
            </button>
          </div>
        </div>

        <!-- 修改标签筛选区域 -->
        <div class="flex flex-wrop px-2 py-3 border-b border-gray-100">
          <div class="max-w-[800px] transition-all duration-500 ease-in-out" 
               :style="{ 
                 maxHeight: isExpanded ? '800px' : '42px',
                 opacity: isExpanded ? '1' : '0.95',
               }"
               style="overflow: hidden;">
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
          </div>
        </div>
      </div>
    </div>

    <!-- 右侧登录区域 -->
    <div class="w-[340px]">
      <div class="sticky top-5 w-full">
        <LoginCard/>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref, computed, onMounted, nextTick, watch, onUnmounted} from 'vue'
import LoginCard from '../components/LoginCard.vue'
import PostCard from '../components/PostCard.vue'
import {
  FileText,
  Users,
  MessageCircle,
  Share2,
  PenLine,
  Search,
  PencilLine,
  ChevronDown
} from 'lucide-vue-next'
import TopicListButton from "../components/TopicListButton.vue";
import {Tag as ATag} from 'ant-design-vue'
import FilterTags from '../components/FilterTags.vue'

const selectedCard = ref(null)

const cards = [
  {
    title: '求职面试',
    icon: FileText,
    iconColor: 'text-[#2196f3]',
    activeColor: '#2196f3'
  },
  {
    title: '职场与内推',
    icon: Users,
    iconColor: 'text-[#4caf50]',
    activeColor: '#4caf50'
  },
  {
    title: '技术交流',
    icon: MessageCircle,
    iconColor: 'text-[#9c27b0]',
    activeColor: '#9c27b0'
  },
  {
    title: '学习分享',
    icon: Share2,
    iconColor: 'text-[#ff9800]',
    activeColor: '#ff9800'
  },
  {
    title: '意见反馈',
    icon: PenLine,
    iconColor: 'text-[#00bcd4]',
    activeColor: '#00bcd4'
  }
]

const selectCard = (index) => {
  selectedCard.value = selectedCard.value === index ? null : index
}

// 标签页数据
const tabs = [
  {id: 'latest', name: '最新'},
  {id: 'hot', name: '最热'},
  {id: 'following', name: '关注'}
];

const currentTab = ref('latest');

// 文章列表数据
const articles = ref([
  {
    id: 1,
    avatar: "https://pic.leetcode.cn/1699000361-IIuoOH-%E9%9B%B6%E8%B5%B7%E6%AD%A5%E5%AD%A6%E7%AE%97%E6%B3%95.png",
    title: "求助 | 非科班转码求助",
    content: "大佬们，我是中上游985的非科班研究生，目前研一，研究方向和计算机沾点边，但关系不大，毕业想转码，老师管得严，要求发论文，放实习不太可能（如果在研一下发了文章，暑假去实习稍微能谈一下），目前在自学语言...",
    tags: [
      {text: '求职', color: 'blue'},
      {text: '秋招', color: 'purple'},
      {text: '应届', color: 'cyan'}
    ],
    likes: 12,
    views: 2700,
    comments: 75,
    stars: 15
  },
  {
    id: 2,
    avatar: "https://pic.leetcode.cn/1699000361-IIuoOH-%E9%9B%B6%E8%B5%B7%E6%AD%A5%E5%AD%A6%E7%AE%97%E6%B3%95.png",
    title: "分享 | 前端面试题总结",
    content: "最近参加了几家大厂的面试，总结了一些常见的前端面试题，包括Vue、React、JavaScript基础等，希望对大家有帮助...",
    tags: [
      {text: '面试', color: 'pink'},
      {text: '前端', color: 'orange'},
      {text: '经验分享', color: 'green'}
    ],
    likes: 45,
    views: 3500,
    comments: 120,
    stars: 89
  }
]);

// 添加标签选项数据
const filterTags = ref([
  {text: '前端开发', color: 'blue'},
  {text: '后端开发', color: 'green'},
  {text: '面试经验', color: 'purple'},
  {text: '实习', color: 'orange'},
  {text: '校招', color: 'cyan'},
  {text: '职业发展', color: 'magenta'},
  {text: '算法', color: 'red'},
  {text: '系统设计', color: 'volcano'},
  {text: '开源项目', color: 'geekblue'},
  {text: '前端框架', color: 'lightblue'},
  {text: '微服务架构', color: 'lime'},
  {text: '大数据处理', color: 'gold'},
  {text: '机器学习', color: 'brown'},
  {text: '深度学习', color: 'gray'},
  {text: 'NLP', color: 'orange'},
  {text: '云计算', color: 'teal'},
  {text: 'DevOps', color: 'cyan'},
  {text: '区块链', color: 'purple'},
  {text: '嵌入式开发', color: 'green'},
  {text: '性能优化', color: 'blue'},
  {text: '软件测试', color: 'geekblue'},
  {text: '项目管理', color: 'magenta'},
  {text: '产品思维', color: 'volcano'},
  {text: '数据分析', color: 'cyan'},
  {text: '人工智能', color: 'red'},
  {text: '图像识别', color: 'pink'},
  {text: '网络安全', color: 'gold'},
  {text: '操作系统', color: 'green'},
  {text: '数据库优化', color: 'volcano'},
  {text: 'Web3', color: 'lightpurple'},
  {text: '创业经验', color: 'lime'},
  {text: '开源贡献', color: 'geekblue'},
]);

// 选中的标签
const selectedTags = ref([]);

// 添加展开状态控制
const isExpanded = ref(false);

// 添加切换函数
const toggleExpand = () => {
  isExpanded.value = !isExpanded.value;
};

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
  border-radius: 10px;
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
</style>

