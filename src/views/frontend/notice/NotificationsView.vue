<template>
  <div class="w-full max-w-[1200px] min-h-[calc(100vh-100px)] mx-auto my-5 mb-12 p-4 bg-white rounded-lg shadow-sm">
    <div class="flex items-center px-4"> <!-- 添加左右内边距 -->
        <a-tabs v-model:activeKey="activeTab" class="flex-1">
          <template #rightExtra>
            <div class="space-x-2">
              <a-button type="text" @click="toggleExpand" class="icon-btn">
                <div class="icon-wrapper">
                  <transition name="fade" mode="out-in">
                    <expand-alt-outlined v-if="!isAllExpanded" key="expand" />
                    <shrink-outlined v-else key="shrink" />
                  </transition>
                </div>
              </a-button>
              <a-button type="text" @click="markAllAsRead">全部已读</a-button>
              <a-button type="text" @click="handleBack">返回</a-button>
            </div>
          </template>
          <a-tab-pane key="system">
            <template #tab>
              <div class="inline-flex items-center">
                <bell-outlined />
                <span>通知</span>
              </div>
            </template>
          </a-tab-pane>
          <a-tab-pane key="activity">
            <template #tab>
              <div class="inline-flex items-center">
                <thunderbolt-outlined />
                <span>动态</span>
              </div>
            </template>
          </a-tab-pane>
        </a-tabs>
    </div>
    <div class="px-4"> <!-- 添加左右内边距 -->
      <a-collapse v-model:activeKey="activeKey">
        <a-collapse-panel v-for="notification in filteredNotifications" 
                         :key="notification.id">
          <template #header>
            <span>{{ notification.title }}</span>
          </template>
          <template #extra>
            <div class="flex items-center gap-2">
              <span class="text-sm text-gray-500">{{ notification.formattedTime }}</span>
              <div class="w-2 h-2">
                <div v-if="!notification.isRead" class="w-full h-full rounded-full bg-red-500"></div>
              </div>
            </div>
          </template>
          <p>{{ notification.content }}</p>
        </a-collapse-panel>
      </a-collapse>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { BellOutlined, ThunderboltOutlined, ExpandAltOutlined, ShrinkOutlined } from '@ant-design/icons-vue';
import { formatTimeAgo } from '../../../utils/dateUtils.js';

const activeTab = ref('system');

const notifications = ref([
  {
    id: 1,
    title: '系统通知',
    content: '欢迎使用OnlyOnline在线练题系统！',
    time: '2025-01-12 10:31:00',
    avatar: '/notification-avatar.png',
    type: 'system',
    isRead: false,
    isExpanded: true  // 这条消息默认展开
  },
  {
    id: 2,
    title: '题目更新',
    content: '你关注的题目有新的解答',
    time: '2023-12-19T15:45:00',
    avatar: '/notification-avatar.png',
    type: 'system',
    isRead: true,
    isExpanded: true
  },
  {
    id: 3,
    title: '新动态',
    content: '你关注的用户发布了新的题解',
    time: '2023-12-18T08:20:00',
    avatar: '/notification-avatar.png',
    type: 'activity',
    isRead: false,
    isExpanded: false
  }
]);

// 根据 isExpanded 状态设置初始展开的面板
const activeKey = ref(
  notifications.value
    .filter(notification => notification.isExpanded)
    .map(notification => notification.id)
);

const formattedNotifications = computed(() => {
  return notifications.value.map(notification => ({
    ...notification,
    formattedTime: formatTimeAgo(new Date(notification.time))
  }));
});

const filteredNotifications = computed(() => {
  return formattedNotifications.value.filter(item => item.type === activeTab.value);
});

const markAllAsRead = () => {
  notifications.value = notifications.value.map(notification => ({
    ...notification,
    isRead: true
  }));
};

const isAllExpanded = ref(false);

const toggleExpand = () => {
  isAllExpanded.value = !isAllExpanded.value;
  if (isAllExpanded.value) {
    activeKey.value = filteredNotifications.value.map(notification => notification.id);
  } else {
    activeKey.value = [];
  }
};

const router = useRouter();

const handleBack = () => {
  router.back();
};
</script>

<style scoped>
:deep(.anticon) {
  font-size: 16px;
}

:deep(.ant-collapse) {
  background: transparent;
  border: none;
}

:deep(.ant-collapse-item) {
  background: white;
  border: none;
  border-bottom: 1px solid #f0f0f0;
}

:deep(.ant-collapse-header) {
  padding: 12px 16px !important;
}

:deep(.ant-collapse-content) {
  border-top: none;
}

:deep(.ant-collapse-content-box) {
  padding: 8px 16px !important; /* 减小内容区域的内边距 */
}

:deep(.ant-collapse-content-box p) {
  margin-bottom: 0; /* 移除段落的下边距 */
  line-height: 1.5; /* 优化行高 */
}

:deep(.ant-btn) {
  display: inline-flex;
  align-items: center;
}

.icon-btn {
  height: 36px;
  width: 36px;
  padding: 0 !important;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
}

.icon-wrapper :deep(.anticon) {
  font-size: 20px;  /* 增加图标大小 */
}

/* 图标切换动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

.fade-enter-to,
.fade-leave-from {
  opacity: 1;
  transform: scale(1);
}
</style>
