<template>
  <div class="bg-white h-full flex flex-col">
    <div class="flex-1 overflow-y-auto min-h-0">
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
        <div class="space-y-4">
          <div class="text-sm font-medium text-gray-600 mb-2">输入：</div>
          <div v-for="table in currentCase.inputList" :key="table.tableName">
            <div class="text-sm font-medium text-gray-900 mb-2">
              {{ table.tableName }} =
            </div>
            <div
              class="overflow-x-auto border-2 border-dashed border-gray-300 p-2 rounded-md"
            >
              <table class="table-auto text-sm text-gray-900">
                <thead>
                  <tr class="font-semibold border-b-2 border-gray-300">
                    <th
                      v-for="col in getTableColumns(table.data)"
                      :key="col"
                      class="px-3 py-1 text-left"
                    >
                      {{ col }}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(row, index) in table.data"
                    :key="index"
                    class="border-b border-gray-200"
                  >
                    <td
                      v-for="col in getTableColumns(table.data)"
                      :key="col"
                      class="px-3 py-1"
                    >
                      {{ row[col] }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- 输出数据 -->
        <div class="space-y-4">
          <div class="text-sm font-medium text-gray-600 mb-2">输出：</div>
          <div
            class="overflow-x-auto border-2 border-dashed border-gray-300 p-2 rounded-md"
          >
            <table class="table-auto text-sm text-gray-900">
              <thead>
                <tr class="font-semibold border-b-2 border-gray-300">
                  <th
                    v-for="col in getTableColumns(currentCase.outputList)"
                    :key="col"
                    class="px-3 py-1 text-left"
                  >
                    {{ col }}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(row, index) in currentCase.outputList"
                  :key="index"
                  class="border-b border-gray-200"
                >
                  <td
                    v-for="col in getTableColumns(currentCase.outputList)"
                    :key="col"
                    class="px-3 py-1"
                  >
                    {{ row[col] }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

const props = defineProps({
  testCases: {
    type: Array,
    required: true,
    default: () => [
      {
        inputList: [{ tableName: "", data: [] }],
        outputList: [],
      },
    ],
  },
});

const getTableColumns = (data) => {
  if (!Array.isArray(data) || data.length === 0) return [];
  return Object.keys(data[0] || {});
};

const currentIndex = ref(0);
const currentCase = computed(() => {
  return (
    props.testCases[currentIndex.value] || { inputList: [], outputList: [] }
  );
});
</script>
