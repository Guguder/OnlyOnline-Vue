<template>
  <div class="h-full flex flex-col">
    <div class="flex-1 flex flex-col min-h-0 overflow-hidden">
      <!-- 固定区域：标题、搜索、按钮组 -->
      <div class="flex-shrink-0">
        <!-- 顶部标题 -->
        <div class="flex justify-between items-center px-5 pt-4">
          <span class="text-xl font-bold text-gray-800">标签管理</span>
        </div>

        <!-- 搜索区域 - 使用 Ant Design Form -->
        <div class="px-5 pt-6">
          <a-form layout="inline" :model="searchQuery">
            <a-form-item label="标签名称">
              <a-input
                v-model:value="searchQuery.name"
                placeholder="请输入标签名称"
                allow-clear
                :style="{ width: '220px' }"
              />
            </a-form-item>
            <a-form-item label="状态">
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
          <!-- 新增按钮 -->
          <button
            class="px-5 py-1.5 bg-green-500 text-white rounded-lg shadow-sm hover:bg-green-600"
            @click="openModal"
          >
            新增
          </button>

          <!-- 修改按钮 -->
          <button
            class="px-5 py-1.5 bg-blue-500 text-white rounded-lg shadow-sm hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
            @click="edit"
            :disabled="!selectedRows.length || selectedRows.length > 1"
          >
            修改
          </button>

          <!-- 批量删除按钮 -->
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
          :data="tags"
          :selectable="true"
          @row-click="handleRowClick"
          @selection-change="handleSelectionChange"
        >
          <!-- 修改列模板，添加固定宽度和省略样式 -->
          <template #name="{ row }">
            <div class="fixed-width-cell" :title="row.name">
              {{ row.name }}
            </div>
          </template>
          <!-- 颜色列自定义渲染 -->
          <template #color="{ row }">
            <div class="flex items-center">
              <span
                class="inline-block w-6 h-6 rounded"
                :style="{ backgroundColor: row.color }"
              ></span>
              <span class="ml-2 leading-6">{{ row.color }}</span>
            </div>
          </template>
          <!-- 状态列自定义渲染 -->
          <template #status="{ row }">
            <div class="flex items-center">
              <span
                class="inline-block w-2 h-2 rounded-full mr-2"
                :class="row.status === 1 ? 'bg-green-500' : 'bg-gray-400'"
              ></span>
              <span
                :class="row.status === 1 ? 'text-green-600' : 'text-gray-600'"
              >
                {{ row.status === 1 ? "启用" : "停用" }}
              </span>
            </div>
          </template>
          <!-- 操作列自定义渲染 -->
          <template #actions="{ row }">
            <div class="flex gap-2">
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
      :title="isEdit ? '编辑标签' : '新增标签'"
      width="680px"
      @confirm="handleSubmit"
      @close="closeModal"
    >
      <a-form :model="formData" :style="{ width: '100%' }">
        <div class="grid grid-cols-2 gap-x-4 gap-y-2">
          <a-form-item label="标签名称">
            <a-input
              v-model:value="formData.name"
              placeholder="请输入标签名称"
              :style="{ width: '220px' }"
            />
          </a-form-item>
          <a-form-item label="标签状态">
            <a-select
              v-model:value="formData.status"
              :options="[
                { label: '启用', value: '1' },
                { label: '停用', value: '0' },
              ]"
              :style="{ width: '220px' }"
            />
          </a-form-item>
          <a-form-item label="标签颜色">
            <a-input
              v-model:value="formData.color"
              type="color"
              :style="{ width: '220px', cursor: 'pointer' }"
            />
          </a-form-item>
        </div>
      </a-form>
    </BaseModal>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { tagApi } from "@/api/backend/tagManagement.js";
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
} from "ant-design-vue";
import BaseModal from "../../../components/common/BaseModal.vue";

const columns = [
  { key: "name", title: "标签名称", width: "200px" },
  { key: "color", title: "标签颜色", width: "160px" },
  { key: "status", title: "状态", width: "120px" },
  { key: "actions", title: "操作", width: "120px" },
];

// 行点击处理
const handleRowClick = (row) => {
  console.log("行点击:", row);
};

// 修改搜索状态对象
const searchQuery = ref({
  name: "",
  status: undefined,
});

// 状态
const tags = ref([]);
const currentPage = ref(1);
const totalPages = ref(1);
const total = ref(0);
const showModal = ref(false);
const isEdit = ref(false);
const formData = ref({
  name: "",
  status: "1", // 默认启用
  color: "#843e87", // 修改默认颜色
});
const pageSize = ref(7);

// 修改状态选项数据
const statusOptions = [
  { label: "启用", value: "1" },
  { label: "停用", value: "0" },
];

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
  formData.value = { name: "", status: "1", color: "#843e87" }; // 修改默认颜色
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  formData.value = { name: "", status: "1", color: "#843e87" }; // 修改默认颜色
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
    content: "确定要删除这条数据吗？",
    okText: "确定",
    cancelText: "取消",
    async onOk() {
      try {
        await tagApi.delete(id);
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
      await tagApi.update(submitData);
      message.success("修改成功");
    } else {
      // 新增操作
      await tagApi.create(submitData);
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
      name: searchQuery.value.name || undefined,
      status: searchQuery.value.status || undefined,
    };

    const response = await tagApi.getList(params);
    tags.value = response.data.data;
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

// 添加选择变化处理函数
const handleSelectionChange = (selected) => {
  console.log("选择变化，选中的数据:", selected);
  selectedRows.value = selected;
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
    name: "",
    status: undefined,
  };
  currentPage.value = 1;
  loadData();
};

// 修改批量删除方法
const batchDelete = async () => {
  if (selectedRows.value.length === 0) {
    message.warning("请选择要删除的数据");
    return;
  }

  // 添加调试日志
  console.log("selectedRows.value:", selectedRows.value);

  AModal.confirm({
    title: "确认删除",
    content: `确定要删除这 ${selectedRows.value.length} 条数据吗？`,
    okText: "确定",
    cancelText: "取消",
    async onOk() {
      try {
        // 直接使用选中的值，因为它们本身就是id
        const ids = Array.from(selectedRows.value).map((id) => parseInt(id));
        console.log("收集到的ids:", ids);

        if (ids.length === 0) {
          message.error("未能获取到有效的ID");
          return;
        }

        await tagApi.batchDelete(ids);
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
    const response = await tagApi.getInfo(selectedRow.id);

    if (response.data.code === 200) {
      // 设置为编辑模式
      isEdit.value = true;
      // 数据回显
      formData.value = {
        id: response.data.data.id,
        name: response.data.data.name,
        status: String(response.data.data.status), // 强制转换为字符串
        color: response.data.data.color,
      };
      // 打开模态框
      showModal.value = true;
    } else {
      message.error(response.data.msg || "获取标签信息失败");
    }
  } catch (error) {
    console.error("获取标签信息失败:", error);
    message.error("获取标签信息失败");
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
