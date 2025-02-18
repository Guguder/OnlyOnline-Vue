<template>
  <div class="tag-form">
    <div class="form-header">
      <h2>{{ isEdit ? "编辑标签" : "新增标签" }}</h2>
      <button class="close-btn" @click="$emit('close')">×</button>
    </div>
    <div class="form-body">
      <div class="form-group">
        <label>标签名称</label>
        <input
          v-model="formData.name"
          type="text"
          placeholder="请输入标签名称"
        />
      </div>
      <div class="form-group">
        <label>标签颜色</label>
        <div class="color-picker">
          <input v-model="formData.color" type="color" />
          <span class="color-value">{{ formData.color }}</span>
        </div>
      </div>
      <div class="form-group">
        <label>描述</label>
        <textarea
          v-model="formData.description"
          placeholder="请输入标签描述"
        ></textarea>
      </div>
    </div>
    <div class="form-footer">
      <button class="btn-cancel" @click="$emit('close')">取消</button>
      <button class="btn-submit" @click="handleSubmit">确定</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { tagApi } from "../../api/tagManagement";

const props = defineProps({
  tag: {
    type: Object,
    default: () => ({}),
  },
  isEdit: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["close", "success"]);

const formData = ref({
  name: "",
  color: "#1890ff",
  description: "",
});

onMounted(() => {
  if (props.isEdit) {
    formData.value = { ...props.tag };
  }
});

const handleSubmit = async () => {
  try {
    if (props.isEdit) {
      await tagApi.update(props.tag.id, formData.value);
    } else {
      await tagApi.create(formData.value);
    }
    emit("success");
    emit("close");
  } catch (error) {
    console.error("保存失败:", error);
  }
};
</script>

<style scoped>
.tag-form {
  background: white;
  border-radius: 8px;
  width: 100%;
  max-width: 480px;
}

.form-header {
  padding: 16px 24px;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.form-body {
  padding: 24px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: #1f2937;
  font-weight: 500;
}

input[type="text"],
textarea {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  transition: all 0.3s;
}

textarea {
  height: 80px;
  resize: vertical;
}

.color-picker {
  display: flex;
  align-items: center;
  gap: 12px;
}

.color-value {
  font-family: monospace;
}

.form-footer {
  padding: 16px 24px;
  border-top: 1px solid #f0f0f0;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

button {
  padding: 8px 16px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-cancel {
  background: #f3f4f6;
  color: #374151;
}

.btn-submit {
  background: #2563eb;
  color: white;
}

.btn-cancel:hover {
  background: #e5e7eb;
}

.btn-submit:hover {
  background: #1d4ed8;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  color: #9ca3af;
  cursor: pointer;
  padding: 0;
}

.close-btn:hover {
  color: #6b7280;
}
</style>
