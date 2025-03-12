<template>
  <div class="bg-white h-full flex flex-col">
    <div class="flex-1 overflow-y-auto min-h-0">
      <!-- 测试用例选择按钮 -->
      <div class="px-4 py-2 flex gap-2">
        <button
          v-for="(_, index) in testCases"
          :key="index"
          class="px-3 py-1.5 rounded text-sm font-medium transition-colors"
          :class="[
            currentIndex === index
              ? 'bg-gray-100 text-gray-900'
              : 'text-gray-600 hover:bg-gray-50',
          ]"
          @click="currentIndex = index"
        >
          Case {{ index + 1 }}
        </button>
      </div>

      <div class="px-4 py-2 space-y-6">
        <!-- 输入数据 -->
        <div v-for="table in currentCase.inputList" :key="table.tableName">
          <div class="text-sm font-medium text-gray-900 mb-2">
            {{ table.tableName }} =
          </div>
          <div class="table-container">
            <div class="terminal-table-wrapper">
              <div class="terminal-table">
                <!-- 表头 -->
                <div class="table-header">
                  <div
                    v-for="(col, index) in Object.keys(table.data[0] || {})"
                    :key="index"
                    class="table-cell"
                  >
                    {{ col }}
                  </div>
                </div>
                <!-- 数据行 -->
                <div
                  v-for="(row, index) in table.data"
                  :key="index"
                  class="table-row"
                >
                  <div
                    v-for="(value, col) in row"
                    :key="col"
                    class="table-cell"
                  >
                    {{ value }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 输出数据 -->
        <div class="text-sm font-medium text-gray-900 mb-2">结果：</div>
        <div class="table-container">
          <div class="terminal-table-wrapper">
            <div class="terminal-table">
              <!-- 先获取所有列名（从 outputList 的第一项获取字段名） -->
              <div v-if="currentCase.outputList.length > 0">
                <div class="table-header">
                  <div
                    v-for="(col, index) in Object.keys(
                      currentCase.outputList[0]
                    )"
                    :key="index"
                    class="table-cell"
                  >
                    {{ col }}
                  </div>
                </div>

                <!-- 遍历所有 outputList 数据，合并到一个表格 -->
                <div
                  v-for="(row, rowIndex) in currentCase.outputList"
                  :key="rowIndex"
                  class="table-row"
                >
                  <div
                    v-for="(value, col) in row"
                    :key="col"
                    class="table-cell"
                  >
                    {{ value }}
                  </div>
                </div>
              </div>
              <div v-else class="text-gray-500 text-sm">暂无数据</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

// 修改 props 定义，确保 testCases 的数据结构包含 input 和 output
const props = defineProps({
  testCases: {
    type: Array,
    required: true,
    default: () => [
      {
        inputList: [],
        outputList: [],
      },
    ],
  },
});

// 确保正确使用 props 中的数据
const currentIndex = ref(0);
const currentCase = computed(() => {
  return (
    props.testCases[currentIndex.value] || { inputList: [], outputList: [] }
  );
});
</script>

<style scoped>
/* 终端风格表格样式 */
.table-container {
  position: relative;
  width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: thin;
  scrollbar-color: #cbd5e1 #f1f5f9;
}

.terminal-table-wrapper {
  display: inline-block;
  min-width: min-content;
  max-width: 100%;
  padding: 0.5rem;
  background: transparent;
  border: 2px dashed #d1d5db;
  border-radius: 0.375rem;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 0.875rem;
  line-height: 1.2;
}

.terminal-table {
  display: table;
  width: auto;
  border-collapse: separate;
  border-spacing: 0;
  color: #374151;
}

.table-header {
  display: table-row;
  font-weight: 600;
}

.table-row {
  display: table-row;
}

.table-header > div,
.table-row > div {
  display: table-cell;
  padding: 0.375rem 0.75rem;
  white-space: nowrap;
  border-right: 2px dashed #d1d5db;
}

.table-header > div {
  border-bottom: 2px dashed #d1d5db;
}

.table-header > div:last-child,
.table-row > div:last-child {
  border-right: none;
}

/* 滚动条样式 */
.table-container::-webkit-scrollbar {
  height: 6px;
  width: 6px;
}

.table-container::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 3px;
}

.table-container::-webkit-scrollbar-thumb {
  background-color: #cbd5e1;
  border-radius: 3px;
  transition: background-color 0.2s ease;
}

.table-container::-webkit-scrollbar-thumb:hover {
  background-color: #94a3b8;
}

/* 整体容器滚动条样式 */
.overflow-y-auto {
  scrollbar-width: thin;
  scrollbar-color: rgba(0, 0, 0, 0.3) transparent;
}

.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: transparent;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.3);
  border-radius: 3px;
}
</style>
