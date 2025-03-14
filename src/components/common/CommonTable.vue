<template>
  <div class="bg-white flex flex-col flex-grow">
    <div class="flex-1 overflow-auto min-h-0">
      <table class="w-full">
        <colgroup>
          <col v-if="selectable" style="width: 16px" />
          <col
            v-for="(column, index) in columns"
            :key="column.key"
            :style="{
              width: column.action ? '120px' : column.width || 'auto',
              minWidth: column.action ? '120px' : undefined,
            }"
          />
        </colgroup>
        <thead class="bg-gray-50">
          <tr class="h-12">
            <th v-if="selectable" class="px-1 w-6 text-center">
              <input
                type="checkbox"
                class="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                :checked="isAllSelected"
                :indeterminate="isIndeterminate"
                @change="toggleSelectAll"
              />
            </th>
            <th
              v-for="column in columns"
              :key="column.key"
              class="px-4 text-left text-sm font-bold text-black uppercase tracking-wider truncate"
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
            <td v-if="selectable" class="px-1 w-6 text-center" @click.stop>
              <input
                type="checkbox"
                class="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                :checked="selectedRows.includes(item.id)"
                @change="toggleSelect(item)"
              />
            </td>
            <td
              v-for="column in columns"
              :key="column.key"
              class="px-4 truncate"
            >
              <slot :name="column.key" :row="item">
                {{ item[column.key] }}
              </slot>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

const props = defineProps({
  columns: {
    type: Array,
    required: true,
  },
  data: {
    type: Array,
    required: true,
  },
  selectable: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["row-click", "selection-change"]);

const selectedRows = ref([]);

const isAllSelected = computed(() => {
  return (
    props.data.length > 0 && selectedRows.value.length === props.data.length
  );
});

const isIndeterminate = computed(() => {
  return (
    selectedRows.value.length > 0 &&
    selectedRows.value.length < props.data.length
  );
});

const toggleSelectAll = (e) => {
  const checked = e.target.checked;
  selectedRows.value = checked ? props.data.map((item) => item.id) : [];
  emit("selection-change", selectedRows.value);
};

const toggleSelect = (row) => {
  const index = selectedRows.value.indexOf(row.id);
  if (index === -1) {
    selectedRows.value.push(row.id);
  } else {
    selectedRows.value.splice(index, 1);
  }
  emit("selection-change", selectedRows.value);
};

const handleRowClick = (row) => {
  emit("row-click", row);
};
</script>

<style scoped>
table {
  border-collapse: separate;
  border-spacing: 0;
}

th,
td {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  vertical-align: middle;
}

.truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

td {
  max-width: 0; /* 添加这一行以确保单元格内容能够正确截断 */
}
</style>
