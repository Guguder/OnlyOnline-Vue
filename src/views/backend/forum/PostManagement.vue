<template>
  <div class="h-full flex flex-col">
    <div class="flex-1 flex flex-col min-h-0 overflow-hidden">
      <!-- 固定区域：标题、搜索、按钮组 -->
      <div class="flex-shrink-0">
        <!-- 顶部标题 -->
        <div class="flex justify-between items-center px-5 pt-4">
          <span class="text-xl font-bold text-gray-800">帖子管理</span>
        </div>

        <!-- 搜索区域 -->
        <div class="px-5 pt-6">
          <a-form layout="inline" :model="searchQuery">
            <a-form-item label="帖子标题">
              <a-input
                v-model:value="searchQuery.title"
                placeholder="请输入帖子标题"
                allow-clear
                :style="{ width: '220px' }"
              />
            </a-form-item>
            <a-form-item label="帖子分类">
              <a-select
                v-model:value="searchQuery.category"
                placeholder="请选择分类"
                :options="categoryOptions"
                allow-clear
                :style="{ width: '220px' }"
              />
            </a-form-item>
            <a-form-item label="帖子状态">
              <a-select
                v-model:value="searchQuery.status"
                placeholder="请选择状态"
                :options="statusOptions"
                allow-clear
                :style="{ width: '220px' }"
              />
            </a-form-item>
            <a-form-item>
              <a-space>
                <a-button type="primary" @click="search">搜索</a-button>
                <a-button @click="reset">重置</a-button>
              </a-space>
            </a-form-item>
          </a-form>
        </div>

        <!-- 按钮组 -->
        <div class="flex items-center gap-3 px-5 py-5">
          <!-- 修改按钮（蓝色） -->
          <button
            class="px-5 py-1.5 bg-blue-500 text-white rounded-lg shadow-sm hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
            @click="edit"
            :disabled="!selectedRows.length || selectedRows.length > 1"
          >
            修改
          </button>

          <!-- 批量删除按钮（深红色） -->
          <button
            class="px-4 py-1.5 bg-red-700 text-white rounded-lg shadow-sm hover:bg-red-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
            @click="batchDelete"
            :disabled="!selectedRows.length"
          >
            批量删除
          </button>
        </div>
      </div>

      <!-- 可滚动的列表区域 -->
      <div class="flex-1 min-h-0 px-5 overflow-y-auto custom-scrollbar">
        <CommonTable
          :columns="columns"
          :data="posts"
          :selectable="true"
          @selection-change="handleSelectionChange"
        >
          <!-- 标题列 -->
          <template #title="{ row }">
            <div class="fixed-width-cell" :title="row.title">
              {{ row.title }}
            </div>
          </template>
          <!-- 作者列 -->
          <template #author="{ row }">
            <div class="flex items-center gap-2">
              <a-avatar :size="24" :src="row.avatar" />
              <span>{{ row.nickname }}</span>
            </div>
          </template>
          <!-- 标签列 -->
          <template #tags="{ row }">
            <div class="flex flex-wrap gap-1">
              <a-tag
                v-for="tag in row.tagsList"
                :key="tag.id"
                :color="tag.color"
              >
                {{ tag.name }}
              </a-tag>
            </div>
          </template>
          <!-- 状态列 -->
          <template #status="{ row }">
            <a-tag :color="getStatusColor(row.status)">
              {{ getStatusText(row.status) }}
            </a-tag>
          </template>
          <!-- 创建时间列 -->
          <template #createTime="{ row }">
            {{ row.createTime }}
          </template>
          <!-- 操作列 -->
          <template #actions="{ row }">
            <div class="flex gap-2">
              <button
                class="text-blue-600 hover:text-blue-800"
                @click.stop="handleDetail(row)"
              >
                详情
              </button>
              <button
                class="text-blue-600 hover:text-blue-800"
                @click.stop="handleEdit(row)"
              >
                编辑
              </button>
              <button
                class="text-red-600 hover:text-red-800"
                @click.stop="handleDelete(row.id)"
              >
                删除
              </button>
            </div>
          </template>
        </CommonTable>
      </div>

      <!-- 固定在底部的分页 -->
      <div
        class="flex-shrink-0 flex justify-end items-center gap-4 px-2 py-2.5 bg-white border-t"
      >
        <span class="text-sm text-gray-600"> 共 {{ total }} 条 </span>
        <a-pagination
          v-model:current="currentPage"
          :total="total"
          :pageSize="pageSize"
          @change="handlePageChange"
          @showSizeChange="handleSizeChange"
        />
      </div>
    </div>

    <!-- 使用新的模态框组件 -->
    <BaseModal
      v-model="showModal"
      :title="isEdit ? '编辑帖子' : '新增帖子'"
      width="800px"
      @confirm="handleSubmit"
      @close="closeModal"
    >
      <a-form :model="formData" layout="vertical" :style="{ width: '100%' }">
        <div class="space-y-4">
          <!-- 标题 -->
          <a-form-item
            label="标题"
            :rules="[
              { required: true, message: '标题不能为空' },
              { max: 32, message: '标题最多32个字符' },
            ]"
          >
            <a-input
              v-model:value="formData.title"
              placeholder="请输入帖子标题"
              :maxlength="32"
              show-count
            />
          </a-form-item>

          <!-- 内容 -->
          <a-form-item
            label="内容"
            :rules="[{ required: true, message: '内容不能为空' }]"
          >
            <a-textarea
              v-model:value="formData.content"
              placeholder="请输入帖子内容"
              :auto-size="{ minRows: 4, maxRows: 8 }"
            />
          </a-form-item>

          <div class="grid grid-cols-2 gap-x-4">
            <!-- 话题分类 -->
            <a-form-item
              label="话题分类"
              :rules="[{ required: true, message: '请选择话题分类' }]"
            >
              <a-select
                v-model:value="formData.category"
                placeholder="请选择话题分类"
                :options="categoryOptions"
              />
            </a-form-item>

            <!-- 帖子类型 -->
            <a-form-item label="帖子类型">
              <a-select
                v-model:value="formData.type"
                placeholder="请选择帖子类型"
                :options="[
                  { label: '普通帖子', value: 1 },
                  { label: '精华帖子', value: 2 },
                  { label: '置顶帖子', value: 3 },
                ]"
              />
            </a-form-item>
          </div>

          <!-- 标签选择 -->
          <a-form-item label="标签">
            <a-select
              v-model:value="formData.tagsList"
              mode="multiple"
              placeholder="请选择标签"
              :options="tagsOptions"
              :max-tag-count="3"
            />
          </a-form-item>

          <!-- 是否匿名 -->
          <a-form-item label="匿名设置">
            <a-switch
              v-model:checked="formData.isAnonymous"
              :checked-value="1"
              :unchecked-value="0"
              checked-children="匿名"
              un-checked-children="实名"
            />
          </a-form-item>
        </div>
      </a-form>
    </BaseModal>

    <!-- 新增帖子详情模态框 -->
    <a-modal
      v-model:visible="showDetailModal"
      title="帖子详情"
      :footer="null"
      width="800px"
    >
      <template v-if="postDetail">
        <div class="space-y-4">
          <!-- 帖子标题 -->
          <div class="text-xl font-bold">{{ postDetail.title }}</div>

          <!-- 作者信息 -->
          <div class="flex items-center gap-2">
            <a-avatar :size="32" :src="postDetail.avatar" />
            <span class="font-medium">{{ postDetail.nickname }}</span>
            <span class="text-gray-500">{{ postDetail.createTime }}</span>
          </div>

          <!-- 标签 -->
          <div class="flex gap-2">
            <a-tag
              v-for="tag in postDetail.tagsList"
              :key="tag.id"
              :color="tag.color"
            >
              {{ tag.name }}
            </a-tag>
          </div>

          <!-- 内容 -->
          <div class="bg-gray-50 p-4 rounded-lg">
            <p class="whitespace-pre-wrap">{{ postDetail.content }}</p>
          </div>

          <!-- 统计信息 -->
          <div class="flex gap-4 text-gray-500">
            <span>回复数：{{ postDetail.replyNum }}</span>
            <span>参与人数：{{ postDetail.participantNum }}</span>
            <span v-if="postDetail.thumbNum"
              >点赞数：{{ postDetail.thumbNum }}</span
            >
            <span v-if="postDetail.favourNum"
              >收藏数：{{ postDetail.favourNum }}</span
            >
          </div>
        </div>
      </template>
    </a-modal>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { postApi } from "@/api/backend/postManagement.js";
import CommonTable from "../../../components/common/CommonTable.vue";
import {
  Pagination as APagination,
  Input as AInput,
  Select as ASelect,
  Form as AForm,
  FormItem as AFormItem,
  Space as ASpace,
  Button as AButton,
  message,
  Modal as AModal,
  Avatar as AAvatar,
  Tag as ATag,
  Switch as ASwitch,
  Textarea as ATextarea,
} from "ant-design-vue";

const columns = [
  { key: "title", title: "标题", width: "200px" },
  { key: "author", title: "作者", width: "150px" },
  { key: "tags", title: "标签", width: "200px" },
  { key: "status", title: "状态", width: "100px" },
  { key: "createTime", title: "创建时间", width: "160px" },
  { key: "actions", title: "操作", width: "200px" },
];

// 修改搜索状态对象
const searchQuery = ref({
  title: "",
  category: undefined,
  status: undefined,
});

const categoryOptions = [
  { label: "问答", value: 1 },
  { label: "分享", value: 2 },
  { label: "讨论", value: 3 },
];

const statusOptions = [
  { label: "待审核", value: 1 },
  { label: "已发布", value: 2 },
  { label: "已下架", value: 3 },
];

// 获取状态文本
const getStatusText = (status) => {
  switch (status) {
    case 1:
      return "待审核";
    case 2:
      return "已发布";
    case 3:
      return "已下架";
    default:
      return "未知状态";
  }
};

// 获取状态标签颜色
const getStatusColor = (status) => {
  switch (status) {
    case 1:
      return "warning";
    case 2:
      return "success";
    case 3:
      return "error";
    default:
      return "default";
  }
};

// 状态
const posts = ref([]);
// 行点击处理
const handleRowClick = (row) => {
  console.log("行点击:", row);
};

// 状态
const currentPage = ref(1);
const totalPages = ref(1);
const total = ref(0);
const showModal = ref(false);
const isEdit = ref(false);
const formData = ref({
  title: "",
  content: "",
  category: undefined,
  type: 1,
  isAnonymous: 0,
  tagsList: [],
});
const pageSize = ref(7);

// 添加加载状态
const loading = ref(false);

// 方法定义
const handleSearch = () => {
  currentPage.value = 1;
  loadData();
};

const handlePageChange = (page) => {
  currentPage.value = page;
  loadData();
};

const handleSizeChange = (current, size) => {
  pageSize.value = size;
  currentPage.value = 1;
  loadData();
};

const openModal = () => {
  isEdit.value = false;
  formData.value = {
    title: "",
    content: "",
    category: undefined,
    type: 1,
    isAnonymous: 0,
    tagsList: [],
  };
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  formData.value = {
    title: "",
    content: "",
    category: undefined,
    type: 1,
    isAnonymous: 0,
    tagsList: [],
  };
};

// 修改直接编辑按钮的处理方法
const handleEdit = (tag) => {
  isEdit.value = true;
  // 确保status是字符串类型
  formData.value = {
    ...tag,
    status: String(tag.status), // 强制转换为字符串
  };
  showModal.value = true;
  console.log("编辑数据:", formData.value); // 添加日志便于调试
};

// 修改单个删除方法
const handleDelete = async (id) => {
  AModal.confirm({
    title: "确认删除",
    content: "确定要删除这条帖子吗？",
    okText: "确定",
    cancelText: "取消",
    async onOk() {
      try {
        await postApi.delete(id);
        message.success("删除成功");
        await loadData();
      } catch (error) {
        console.error("删除失败:", error);
        message.error("删除失败");
      }
    },
  });
};

const handleSubmit = async () => {
  try {
    // 验证表单数据
    if (!formData.value.name) {
      message.warning("请输入标签名称");
      return;
    }
    if (!formData.value.color) {
      message.warning("请选择标签颜色");
      return;
    }

    // 构造请求数据
    const submitData = {
      name: formData.value.name,
      color: formData.value.color,
      status: parseInt(formData.value.status), // 确保status是数字类型
    };

    if (isEdit.value) {
      // 修改操作需要id
      submitData.id = formData.value.id;
      await postApi.update(submitData);
      message.success("修改成功");
    } else {
      // 新增操作
      await postApi.create(submitData);
      message.success("新增成功");
    }

    showModal.value = false;
    await loadData(); // 刷新列表
  } catch (error) {
    console.error("操作失败:", error);
    message.error(error.message || "操作失败");
  }
};

const loadData = async () => {
  loading.value = true;
  try {
    const params = {
      pageNumber: currentPage.value,
      pageSize: pageSize.value,
      title: searchQuery.value.title || undefined,
      category: searchQuery.value.category || undefined,
      status: searchQuery.value.status || undefined,
    };

    const response = await postApi.getList(params);
    posts.value = response.data.data;
    total.value = parseInt(response.data.total);
    currentPage.value = parseInt(response.data.pageNumber);
    pageSize.value = parseInt(response.data.pageSize);
    totalPages.value = parseInt(response.data.totalPages);
  } catch (error) {
    console.error("加载失败:", error);
  } finally {
    loading.value = false;
  }
};

// 修改选择变化处理函数，存储完整的行数据而不是仅存储 id
const handleSelectionChange = (selected) => {
  console.log("选择变化，选中的数据:", selected);
  // 通过选中的id从posts中找到完整的行数据
  selectedRows.value = posts.value.filter((post) => selected.includes(post.id));
};

// 修改表格选择编辑按钮的处理方法
const edit = async () => {
  if (selectedRows.value.length === 0) {
    message.warning("请选择要修改的数据");
    return;
  }

  if (selectedRows.value.length > 1) {
    message.warning("只能选择一条数据进行修改");
    return;
  }

  try {
    // 获取选中的数据
    const selectedRow = selectedRows.value[0];
    // 调用获取详情接口
    const response = await postApi.getInfo(selectedRow.id);
    console.log("获取到的数据:", response); // 添加调试日志

    if (response.data) {
      // 修改判断条件
      // 设置为编辑模式
      isEdit.value = true;
      // 数据回显
      formData.value = {
        ...response.data, // 直接使用返回的数据
        status: String(response.data.status), // 确保 status 是字符串类型
      };
      // 打开模态框
      showModal.value = true;
    } else {
      message.error("获取帖子信息失败");
    }
  } catch (error) {
    console.error("获取帖子信息失败:", error);
    message.error("获取帖子信息失败");
  }
};

// 添加选中行数据存储
const selectedRows = ref([]);

// 搜索方法
const search = () => {
  currentPage.value = 1;
  loadData();
};

// 重置方法修改
const reset = () => {
  searchQuery.value = {
    title: "",
    category: undefined,
    status: undefined,
  };
  currentPage.value = 1;
  loadData();
};

// 修改批量删除方法
const batchDelete = async () => {
  if (selectedRows.value.length === 0) {
    message.warning("请选择要删除的帖子");
    return;
  }

  AModal.confirm({
    title: "确认删除",
    content: `确定要删除这 ${selectedRows.value.length} 条帖子吗？`,
    okText: "确定",
    cancelText: "取消",
    async onOk() {
      try {
        const ids = selectedRows.value.map((row) => row.id);
        await postApi.batchDelete(ids);
        message.success("批量删除成功");
        await loadData();
        selectedRows.value = [];
      } catch (error) {
        console.error("批量删除失败:", error);
        message.error("批量删除失败");
      }
    },
  });
};

// 新增状态和方法
const showDetailModal = ref(false);
const postDetail = ref(null);

// 处理详情按钮点击
const handleDetail = async (row) => {
  try {
    const response = await postApi.getInfo(row.id);
    // 修改判断逻辑，直接使用 response.data
    postDetail.value = response.data;
    showDetailModal.value = true;
  } catch (error) {
    console.error("获取详情失败:", error);
    message.error("获取详情失败");
  }
};

onMounted(() => {
  loadData();
});
</script>

<style scoped>
/* 自定义滚动条样式 */
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 6px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #d4d4d4;
  border-radius: 6px;
  transition: all 0.2s ease;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}

/* 火狐浏览器滚动条样式 */
.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: #d4d4d4 #f1f1f1;
  height: 100%;
  padding: 1px; /* 防止边界问题 */
}
@keyframes zoomIn {
  from {
    opacity: 0;
    transform: scale(0.3);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* 关闭动画 */
:deep(.tag-modal.ant-modal-wrap-rtl .ant-modal) {
  animation: zoomOut 0.2s ease-in !important;
}

@keyframes zoomOut {
  from {
    opacity: 1;
    transform: scale(1);
  }
  to {
    opacity: 0;
    transform: scale(0.3);
  }
}

/* 调整表单标签样式 */
:deep(.ant-form-item-label > label) {
  font-weight: 500; /* 设置标签文字加粗 */
}

/* 保持标签加粗 */
:deep(.ant-form-item-label > label) {
  font-weight: 500;
}

:deep(.ant-form-item-label > label) {
  font-weight: 500;
  height: 32px;
  margin-bottom: 0;
}

.fixed-width-cell {
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: block;
}

:deep(.ant-table-thead > tr > th) {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
