<template>
  <div class="system-settings">
    <a-typography-title level="2">系统设置</a-typography-title>
    <a-form :model="formState" layout="vertical">
      <a-form-item label="网站名称" name="siteName">
        <a-input v-model:value="formState.siteName" />
      </a-form-item>
      <a-form-item>
        <a-button type="primary">保存设置</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup>
import { reactive } from "vue";

const formState = reactive({
  siteName: "",
});
</script>
