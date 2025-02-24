<template>
  <div class="bg-white rounded-lg shadow overflow-x-auto">
    <table class="w-full">
      <thead class="bg-gray-50">
        <tr class="h-12">
          <th
            v-for="column in columns"
            :key="column.key"
            class="px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            {{ column.title }}
          </th>
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-200">
        <tr
          v-for="(item, index) in data"
          :key="item.id"
          :class="[
            index % 2 === 0 ? 'bg-white h-12' : 'bg-[#F7F8FA] h-12',
            'hover:bg-gray-50 cursor-pointer',
          ]"
          @click="handleRowClick(item)"
        >
          <td
            v-for="column in columns"
            :key="column.key"
            class="px-4 whitespace-nowrap"
          >
            <slot :name="column.key" :row="item">
              {{ item[column.key] }}
            </slot>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
const props = defineProps({
  // 表格列配置
  columns: {
    type: Array,
    required: true,
    // [{key: 'name', title: '名称'}]
  },
  // 表格数据
  data: {
    type: Array,
    required: true,
  },
});

const emit = defineEmits(["row-click"]);

// 行点击处理
const handleRowClick = (row) => {
  emit("row-click", row);
};
</script>

<style scoped>
table {
  border-collapse: separate;
  border-spacing: 0;
}

thead th:first-child {
  border-top-left-radius: 0.5rem;
}

thead th:last-child {
  border-top-right-radius: 0.5rem;
}

tbody tr:last-child td:first-child {
  border-bottom-left-radius: 0.5rem;
}

tbody tr:last-child td:last-child {
  border-bottom-right-radius: 0.5rem;
}
</style>
