<template>
  <div class="user-management">
    <a-typography-title level="2">用户管理</a-typography-title>
    <a-table :columns="columns" :data-source="[]">
      <template #headerCell="{ column }">
        <template v-if="column.key === 'action'">
          <span>操作</span>
        </template>
      </template>
    </a-table>
  </div>
</template>

<script setup>
const columns = [
  {
    title: "用户名",
    dataIndex: "username",
    key: "username",
  },
  {
    title: "邮箱",
    dataIndex: "email",
    key: "email",
  },
  {
    title: "角色",
    dataIndex: "role",
    key: "role",
  },
  {
    title: "操作",
    key: "action",
  },
];
</script>
