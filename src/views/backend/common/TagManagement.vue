<template>
  <div class="h-full flex flex-col">
    <div class="flex-1 flex flex-col min-h-0 overflow-hidden">
      <!-- 固定区域：标题、搜索、按钮组 -->
      <div class="flex-shrink-0">
        <!-- 顶部标题 -->
        <div class="flex justify-between items-center px-5 pt-4">
          <span class="text-xl font-bold text-gray-800">标签管理</span>
        </div>

        <!-- 搜索区域 -->
        <div class="px-5 pt-6">
          <div class="flex flex-wrap items-center gap-4">
            <SearchInput label="名称" width="220px" labelClass="font-medium">
              <template #input>
                <a-input
                  v-model:value="searchQuery.name"
                  placeholder="请输入标签名称"
                  :style="{ width: '220px' }"
                />
              </template>
            </SearchInput>
            <SearchInput label="状态" width="220px">
              <template #input>
                <a-select
                  v-model:value="searchQuery.status"
                  placeholder="请选择状态"
                  :options="statusOptions"
                  :style="{ width: '220px' }"
                />
              </template>
            </SearchInput>
            <SearchInput label="颜色" width="220px">
              <template #input>
                <a-input
                  v-model:value="searchQuery.color"
                  placeholder="请选择颜色"
                  :style="{ width: '220px' }"
                />
              </template>
            </SearchInput>
            <!-- 搜索按钮 -->
            <button
              class="px-4 py-1.5 bg-[#A855F7] text-white rounded-lg shadow-sm hover:bg-[#9333EA]"
              @click="search"
            >
              搜索
            </button>
            <button
              class="px-4 py-1.5 bg-gray-400 text-white rounded-lg shadow-sm hover:bg-gray-500"
              @click="reset"
            >
              重置
            </button>
          </div>
        </div>

        <!-- 按钮组 -->
        <div class="flex items-center gap-3 px-5 py-5">
          <!-- 新增按钮（绿色） -->
          <button
            class="px-5 py-1.5 bg-green-500 text-white rounded-lg shadow-sm hover:bg-green-600"
            @click="openModal"
          >
            新增
          </button>

          <!-- 修改按钮（蓝色） -->
          <button
            class="px-5 py-1.5 bg-blue-500 text-white rounded-lg shadow-sm hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
            @click="edit"
            :disabled="!selectedRows.length"
          >
            修改
          </button>

          <!-- 删除按钮（红色） -->
          <button
            class="px-5 py-1.5 bg-red-500 text-white rounded-lg shadow-sm hover:bg-red-600"
            @click="deleteItem"
          >
            删除
          </button>

          <!-- 批量删除按钮（深红色） -->
          <button
            class="px-4 py-1.5 bg-red-700 text-white rounded-lg shadow-sm hover:bg-red-800"
            @click="batchDelete"
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
import SearchInput from "../../../components/common/SearchInput.vue";
import CommonTable from "../../../components/common/CommonTable.vue";
import {
  Pagination as APagination,
  Input as AInput,
  Select as ASelect,
  Form as AForm,
  FormItem as AFormItem,
  message,
} from "ant-design-vue";
import BaseModal from "../../../components/common/BaseModal.vue";

// 修改表格列配置，交换顺序并调整宽度
const columns = [
  { key: "name", title: "标签名称", width: "30%" },
  { key: "color", title: "标签颜色", width: "30%" },
  { key: "status", title: "状态", width: "20%" },
  { key: "actions", title: "操作", width: "20%" },
];

// 行点击处理
const handleRowClick = (row) => {
  console.log("行点击:", row);
};

// 修改搜索状态对象
const searchQuery = ref({
  name: "",
  status: "",
  color: "",
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

// 添加状态选项数据
const statusOptions = [
  { label: "全部", value: "" },
  { label: "启用", value: "1" },
  { label: "停用", value: "0" },
];

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

const handleEdit = (tag) => {
  isEdit.value = true;
  formData.value = { ...tag };
  showModal.value = true;
};

const handleDelete = async (id) => {
  try {
    await tagApi.delete(id);
    await loadData();
    // 可以添加成功提示
  } catch (error) {
    console.error("删除失败:", error);
    // 可以添加错误提示
  }
};

const handleSubmit = async () => {
  try {
    if (isEdit.value) {
      await tagApi.update(formData.value.id, formData.value);
    } else {
      await tagApi.create(formData.value);
    }
    showModal.value = false;
    await loadData();
    // 可以添加成功提示
  } catch (error) {
    console.error("操作失败:", error);
    // 可以添加错误提示
  }
};

const loadData = async () => {
  try {
    const params = {
      pageNumber: currentPage.value,
      pageSize: pageSize.value,
      name: searchQuery.value.name || undefined,
      status: searchQuery.value.status || undefined,
      color: searchQuery.value.color || undefined,
    };

    const response = await tagApi.getList(params);
    // 修改这里来匹配后端返回的数据结构
    tags.value = response.data.data;
    total.value = parseInt(response.data.total);
    currentPage.value = parseInt(response.data.pageNumber);
    pageSize.value = parseInt(response.data.pageSize);
    totalPages.value = parseInt(response.data.totalPages);
  } catch (error) {
    console.error("加载失败:", error);
  }
};

// 添加选择变化处理函数
const handleSelectionChange = (selected) => {
  selectedRows.value = selected;
};

// 添加选中行数据存储
const selectedRows = ref([]);

// 搜索方法
const search = () => {
  currentPage.value = 1;
  loadData();
};

// 重置方法
const reset = () => {
  searchQuery.value = {
    name: "",
    status: "",
    color: "",
  };
  currentPage.value = 1;
  loadData();
};

// 添加批量删除方法
const batchDelete = async () => {
  if (selectedRows.value.length === 0) {
    // 可以添加提示：请选择要删除的项
    return;
  }

  try {
    const ids = selectedRows.value.map((row) => row.id);
    await tagApi.batchDelete(ids);
    await loadData();
    // 可以添加成功提示
  } catch (error) {
    console.error("批量删除失败:", error);
    // 可以添加错误提示
  }
};

// 修改按钮点击处理
const edit = () => {
  if (selectedRows.value.length === 0) {
    // 使用 ant-design-vue 的消息提示
    message.warning("请选择要修改的数据");
    return;
  }

  if (selectedRows.value.length > 1) {
    message.warning("只能选择一条数据进行修改");
    return;
  }

  // 获取选中的数据
  const selectedRow = selectedRows.value[0];
  // 设置为编辑模式
  isEdit.value = true;
  // 数据回显
  formData.value = {
    id: selectedRow.id,
    name: selectedRow.name,
    status: selectedRow.status.toString(), // 转换为字符串
    color: selectedRow.color,
  };
  // 打开模态框
  showModal.value = true;
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

:deep(.ant-table-wrapper) {
  height: 100%;
}

:deep(.ant-table) {
  height: 100%;
}

/* 模态框内容样式 */
:deep(.ant-modal-content) {
  padding: 24px;
}

:deep(.ant-modal-header) {
  padding: 0 0 16px 0;
  border-bottom: 1px solid #f0f0f0;
}

:deep(.ant-modal-footer) {
  margin-top: 24px;
  padding: 16px 0 0 0;
  border-top: 1px solid #f0f0f0;
}

/* 模态框动画样式 */
:deep(.custom-modal .ant-modal) {
  top: 50%;
  padding-bottom: 0;
  transform-origin: center;
}

:deep(.zoom-enter-active),
:deep(.zoom-leave-active) {
  transition: all 0.2s ease;
}

:deep(.zoom-enter-from),
:deep(.zoom-leave-to) {
  opacity: 0;
  transform: scale(0.5);
}

:deep(.zoom-enter-to),
:deep(.zoom-leave-from) {
  opacity: 1;
  transform: scale(1);
}

/* 遮罩层动画 */
:deep(.fade-enter-active),
:deep(.fade-leave-active) {
  transition: opacity 0.2s ease;
}

:deep(.fade-enter-from),
:deep(.fade-leave-to) {
  opacity: 0;
}

:deep(.fade-enter-to),
:deep(.fade-leave-from) {
  opacity: 1;
}

/* 重写模态框动画和样式 */
:deep(.tag-modal .ant-modal) {
  transform-origin: center !important;
  animation: zoomIn 0.2s ease-out !important;
}

:deep(.tag-modal .ant-modal-mask) {
  animation: fadeIn 0.2s ease-out !important;
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
/* 调整表单项样式 */
:deep(.ant-form-item) {
  margin-bottom: 12px;
}

:deep(.ant-form-item-label) {
  padding-bottom: 4px;
}

:deep(
    .ant-form-item-required:not(.ant-form-item-required-mark-optional)
  )::before {
  display: none;
}

:deep(
    .ant-form-item-label
      > label.ant-form-item-required:not(
        .ant-form-item-required-mark-optional
      )::after
  ) {
  content: "*";
  color: #ff4d4f;
  margin-left: 4px;
}

/* 调整表单标签样式 */
:deep(.ant-form-item-label > label) {
  font-weight: 500; /* 设置标签文字加粗 */
}

/* 调整表单项布局样式 */
:deep(.ant-form-inline .ant-form-item-label) {
  min-width: 80px;
  text-align: right;
  padding-right: 8px;
}

:deep(.ant-form-inline .ant-form-item) {
  display: flex;
  margin-bottom: 16px;
  width: 100%;
}

:deep(.ant-form-inline .ant-form-item-control) {
  width: 220px;
}

/* 保持标签加粗 */
:deep(.ant-form-item-label > label) {
  font-weight: 500;
}

/* 调整表单布局样式 */
:deep(.ant-form-item) {
  margin-bottom: 16px;
  display: flex !重要;
  flex-direction: row !重要;
}

:deep(.ant-form-item-label) {
  padding-right: 12px;
  line-height: 32px;
  flex-shrink: 0;
  white-space: nowrap;
}

:deep(.ant-form-item-label > label) {
  font-weight: 500;
  height: 32px;
  margin-bottom: 0;
}

:deep(.ant-form-item-control) {
  flex: none !重要;
  width: auto !重要;
}

/* 移除之前的 inline form 相关样式 */
/* 删除之前的表单布局相关样式... */

/* 添加新的样式 */
:deep(.ant-table-cell) {
  vertical-align: middle !important;
}
</style>
