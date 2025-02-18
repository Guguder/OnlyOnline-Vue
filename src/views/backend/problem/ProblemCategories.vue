<template>
  <div class="problem-categories">
    <div class="page-header">
      <a-typography-title level="3">题目分类</a-typography-title>
      <a-button type="primary">新增分类</a-button>
    </div>
    <a-table :columns="columns" :data-source="[]">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <a-space>
            <a-button type="link" size="small">编辑</a-button>
            <a-button type="link" size="small" danger>删除</a-button>
          </a-space>
        </template>
      </template>
    </a-table>
  </div>
</template>

<script setup>
const columns = [
  {
    title: "分类名称",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "题目数量",
    dataIndex: "count",
    key: "count",
    width: 120,
  },
  {
    title: "操作",
    key: "action",
    width: 150,
    align: "center",
  },
];
</script>

<style scoped>
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}
</style>
