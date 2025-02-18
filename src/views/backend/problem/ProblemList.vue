<template>
  <div class="problem-list">
    <div class="page-header">
      <a-typography-title level="3">题目列表</a-typography-title>
      <a-button type="primary">新增题目</a-button>
    </div>
    <a-table
      :columns="columns"
      :data-source="[]"
      :pagination="{ pageSize: 10 }"
    >
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
    title: "ID",
    dataIndex: "id",
    key: "id",
    width: 80,
  },
  {
    title: "题目名称",
    dataIndex: "title",
    key: "title",
  },
  {
    title: "难度",
    dataIndex: "difficulty",
    key: "difficulty",
    width: 100,
  },
  {
    title: "分类",
    dataIndex: "category",
    key: "category",
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
