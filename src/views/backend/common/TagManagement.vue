<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <span class="text-xl font-bold text-gray-800">标签管理</span>
    </div>

    <!-- 搜索区域 -->
    <div class="mb-6 p-4">
      <div class="flex flex-wrap items-center gap-x-6 gap-y-4">
        <!-- 标签名称输入框 -->
        <div class="flex items-center gap-2">
          <label class="w-24 text-base text-gray-700 text-right"
            >标签名称：</label
          >
          <input
            type="text"
            v-model="searchQuery"
            placeholder="输入标签名称"
            class="w-[180px] px-3 py-2 text-base border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            @keyup.enter="handleSearch"
          />
        </div>

        <!-- 分类筛选下拉框 -->
        <div class="flex items-center gap-2">
          <label class="w-24 text-base text-gray-700 text-right"
            >分类筛选：</label
          >
          <div class="relative w-[180px]">
            <select
              v-model="selectedCategory"
              class="block appearance-none w-full px-3 py-2 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">所有分类</option>
              <option value="category1">分类1</option>
              <option value="category2">分类2</option>
            </select>
            <!-- 自定义下拉箭头 -->
            <div
              class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2 text-gray-500"
            >
              <svg class="h-4 w-4 fill-current" viewBox="0 0 20 20">
                <path d="M5.5 7l4.5 4.5 4.5-4.5z"></path>
              </svg>
            </div>
          </div>
        </div>

        <!-- 搜索按钮 -->
        <div class="flex items-center gap-2">
          <button
            class="w-[180px] px-3 py-2 text-base bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            @click="handleSearch"
          >
            搜索
          </button>
        </div>
      </div>
    </div>

    <!-- 标签列表 -->
    <div class="overflow-x-auto">
      <table class="min-w-full">
        <thead>
          <tr class="bg-gray-50">
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              标签名称
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              颜色
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              使用次数
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              操作
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="tag in tags" :key="tag.id" class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap">
              {{ tag.name }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span
                class="inline-block w-6 h-6 rounded mr-2"
                :style="{ backgroundColor: tag.color }"
              ></span>
              {{ tag.color }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              {{ tag.count }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex gap-2">
                <button
                  class="text-blue-600 hover:text-blue-800"
                  @click="handleEdit(tag)"
                >
                  编辑
                </button>
                <button
                  class="text-red-600 hover:text-red-800"
                  @click="handleDelete(tag.id)"
                >
                  删除
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 分页 -->
    <div class="flex justify-between items-center mt-6">
      <span class="text-sm text-gray-700"> 共 {{ total }} 条记录 </span>
      <div class="flex gap-2">
        <button
          class="px-3 py-1 rounded border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="currentPage === 1"
          @click="handlePageChange(currentPage - 1)"
        >
          上一页
        </button>
        <button
          class="px-3 py-1 rounded border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="currentPage === totalPages"
          @click="handlePageChange(currentPage + 1)"
        >
          下一页
        </button>
      </div>
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
</template>

<script setup>
import { ref, onMounted } from "vue";
import { tagApi } from "../../../api/tagManagement";

// 状态
const searchQuery = ref("");
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

// 方法定义
const handleSearch = () => {
  currentPage.value = 1;
  loadData();
};

const handlePageChange = (page) => {
  currentPage.value = page;
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
    const res = await tagApi.getList({
      page: currentPage.value,
      query: searchQuery.value,
    });
    tags.value = res.data.list;
    total.value = res.data.total;
    totalPages.value = res.data.totalPages;
  } catch (error) {
    console.error("加载失败:", error);
  }
};

onMounted(() => {
  loadData();
});
</script>
