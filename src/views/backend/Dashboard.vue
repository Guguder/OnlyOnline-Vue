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
  <div class="dashboard">
    <a-typography-title level="3" :style="{ marginBottom: '24px' }">
      仪表盘
    </a-typography-title>
    <a-row :gutter="[16, 16]">
      <a-col :span="8">
        <a-card hoverable>
          <template #cover>
            <div class="stat-card">
              <UserOutlined class="stat-icon" />
              <div class="stat-content">
                <div class="stat-value">125</div>
                <div class="stat-label">总用户数</div>
              </div>
            </div>
          </template>
        </a-card>
      </a-col>
      // ... 其他统计卡片
    </a-row>
  </div>
</template>

<script setup>
import { reactive } from "vue";

const formState = reactive({
  siteName: "",
});
</script>

<style scoped>
.dashboard {
  min-height: 100%;
}

.stat-card {
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 16px;
}

.stat-icon {
  font-size: 48px;
  color: #1890ff;
}

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: 24px;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.85);
  line-height: 1.4;
}

.stat-label {
  font-size: 14px;
  color: rgba(0, 0, 0, 0.45);
}
</style>
