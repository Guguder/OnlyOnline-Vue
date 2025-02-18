<template>
  <div class="post-management">
    <a-typography-title level="3">帖子管理</a-typography-title>
    <a-table
      :columns="columns"
      :data-source="[]"
      :pagination="{ pageSize: 10 }"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <a-space>
            <a-button type="link" size="small">查看</a-button>
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
    title: "标题",
    dataIndex: "title",
    key: "title",
    ellipsis: true,
  },
  {
    title: "作者",
    dataIndex: "author",
    key: "author",
    width: 120,
  },
  {
    title: "发布时间",
    dataIndex: "createTime",
    key: "createTime",
    width: 180,
  },
  {
    title: "状态",
    dataIndex: "status",
    key: "status",
    width: 100,
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
  margin-bottom: 24px;
}
</style>
