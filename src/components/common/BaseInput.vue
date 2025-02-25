<template>
  <div class="flex flex-col sm:flex-row items-center gap-2">
    <label v-if="label" class="block text-black font-bold text-base mb-1">
      {{ label }}&nbsp;
    </label>
    <div
      class="flex items-center px-3 py-1.5 border border-gray-300 rounded-lg bg-white shadow-sm"
      :style="{ width: width }"
    >
      <slot name="input">
        <input
          type="text"
          class="border-none outline-none bg-transparent text-gray-800 text-sm w-full"
          :placeholder="placeholder"
          :value="modelValue"
          @input="$emit('update:modelValue', $event.target.value)"
        />
      </slot>
    </div>
  </div>
</template>

<script setup>
defineProps({
  // 输入框标签
  label: {
    type: String,
    default: "",
  },
  // v-model绑定值
  modelValue: {
    type: String,
    default: "",
  },
  // 输入框宽度
  width: {
    type: String,
    default: "220px",
  },
  // 输入框宽度
  inputWidth: {
    type: String,
    default: "180px",
  },
  // 占位符文本
  placeholder: {
    type: String,
    default: "请输入",
  },
});

defineEmits(["update:modelValue"]);
</script>
