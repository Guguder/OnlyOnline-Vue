<template>
  <!-- 使用 flex 布局，让内容区和分页分别在顶部和底部 -->
  <div class="flex flex-col min-h-full">
    <!-- 主内容区域 -->
    <div class="flex-1">
      <div>
        <div class="flex justify-between items-center p-5">
          <span class="text-xl font-bold text-gray-800">标签管理</span>
        </div>

        <!-- 搜索区域 -->
        <div class="px-5 py-3">
          <div class="flex flex-wrap items-center gap-4">
            <SearchInput
              label="名称"
              v-model="searchQuery.name"
              placeholder="请输入标签名称"
              width="220px"
            />
            <SearchInput
              label="状态"
              v-model="searchQuery.status"
              placeholder="请输入状态"
              width="220px"
            />
            <SearchInput
              label="颜色"
              v-model="searchQuery.color"
              placeholder="请选择颜色"
              width="220px"
            />
            <!-- 搜索按钮 -->
            <button
              class="px-4 py-2 bg-[#A855F7] text-white rounded-lg shadow-sm hover:bg-[#9333EA]"
              @click="search"
            >
              搜索
            </button>
            <button
              class="px-4 py-2 bg-gray-400 text-white rounded-lg shadow-sm hover:bg-gray-500"
              @click="reset"
            >
              重置
            </button>
          </div>
        </div>
        <!-- 按钮组 -->
        <div class="flex items-center gap-3 px-5 py-3">
          <!-- 新增按钮（绿色） -->
          <button
            class="px-5 py-1.5 bg-green-500 text-white rounded-lg shadow-sm hover:bg-green-600"
            @click="add"
          >
            新增
          </button>

          <!-- 修改按钮（蓝色） -->
          <button
            class="px-5 py-1.5 bg-blue-500 text-white rounded-lg shadow-sm hover:bg-blue-600"
            @click="edit"
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

        <!-- 标签列表 -->
        <div class="mb-4">
          <CommonTable 
            :columns="columns" 
            :data="tags" 
            :selectable="true"
            @row-click="handleRowClick"
            @selection-change="handleSelectionChange"
          >
            <!-- 颜色列自定义渲染 -->
            <template #color="{ row }">
              <span
                class="inline-block w-6 h-6 rounded mr-2"
                :style="{ backgroundColor: row.color }"
              ></span>
              {{ row.color }}
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

        <!-- 弹窗 -->
        <div
          v-if="showModal"
          class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
        >
          <div class="bg-white rounded-lg max-w-md w-full p-6">
            <div class="flex justify-between items-center mb-4">
              <h3 class="text-lg font-medium">
                {{ isEdit ? "编辑标签" : "新增标签" }}
              </h3>
              <button class="text-gray-500 hover:text-gray-700" @click="closeModal">
                ×
              </button>
            </div>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >标签名称</label
                >
                <input
                  type="text"
                  v-model="formData.name"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >标签颜色</label
                >
                <input
                  type="color"
                  v-model="formData.color"
                  class="w-full h-10 p-1 border border-gray-300 rounded-md"
                />
              </div>
              <div class="flex justify-end gap-2 mt-6">
                <button
                  class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                  @click="closeModal"
                >
                  取消
                </button>
                <button
                  class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  @click="handleSubmit"
                >
                  确定
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 分页组件放在底部 -->
    <div class="flex justify-end items-center gap-4 mt-6 bg-white p-4 rounded-lg">
      <span class="text-sm text-gray-600">
        共 {{ total }} 条
      </span>
      <a-pagination
        v-model:current="currentPage"
        :total="total"
        :pageSize="pageSize"
        show-quick-jumper
        show-size-changer
        :pageSizeOptions="['10', '20', '50', '100']"
        @change="handlePageChange"
        @showSizeChange="handleSizeChange"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { tagApi } from "../../../api/tagManagement";
import SearchInput from "../../../components/common/SearchInput.vue";
import CommonTable from "../../../components/common/CommonTable.vue";
import { Pagination as APagination } from 'ant-design-vue';

// 表格列配置
const columns = [
  { key: "name", title: "标签名称" },
  { key: "color", title: "颜色" },
  { key: "count", title: "使用次数" },
  { key: "actions", title: "操作" },
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
  color: "#1890ff",
});
const pageSize = ref(10);

// 模拟数据
const mockTags = [
  {
    id: 1,
    name: "JavaScript",
    color: "#F7DF1E",
    count: 125,
  },
  {
    id: 2,
    name: "Vue.js",
    color: "#4FC08D",
    count: 89,
  },
  {
    id: 3,
    name: "React",
    color: "#61DAFB",
    count: 76,
  },
  {
    id: 4,
    name: "TypeScript",
    color: "#3178C6",
    count: 92,
  },
  {
    id: 5,
    name: "Node.js",
    color: "#339933",
    count: 67,
  },
];

// 方法定义
const handleSearch = () => {
  currentPage.value = 1;
  loadData();
};

const handlePageChange = (page, size) => {
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
  formData.value = { name: "", color: "#1890ff" };
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
};

const handleEdit = (tag) => {
  isEdit.value = true;
  formData.value = { ...tag };
  showModal.value = true;
};

const handleDelete = async (id) => {
  if (confirm("确定要删除此标签吗？")) {
    await tagApi.delete(id);
    loadData();
  }
};

const handleSubmit = async () => {
  try {
    if (isEdit.value) {
      await tagApi.update(formData.value.id, formData.value);
    } else {
      await tagApi.create(formData.value);
    }
    closeModal();
    loadData();
  } catch (error) {
    console.error("操作失败:", error);
  }
};

const loadData = async () => {
  try {
    // 这里应该调用实际的API，并传入分页参数
    const params = {
      page: currentPage.value,
      pageSize: pageSize.value,
      ...searchQuery.value
    };
    
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 500));
    tags.value = mockTags;
    total.value = mockTags.length;
  } catch (error) {
    console.error("加载失败:", error);
  }
};

// 添加选择变化处理函数
const handleSelectionChange = (selectedIds) => {
  console.log('选中的行 ID:', selectedIds);
};

onMounted(() => {
  loadData();
});
</script>

<style scoped>
:deep(.ant-pagination-options) {
  margin-left: 8px;
}
</style>
