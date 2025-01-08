<template>
  <div class="relative">
    <button 
      @click="handleClick()"
      class="flex items-center px-4 py-2 rounded-lg text-sm transition-colors"
      :class="[
        disabled 
          ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
          : selectedValue
            ? 'bg-blue-50 text-blue-600 hover:bg-blue-100 cursor-pointer'
            : 'bg-[#F2F3F4] hover:bg-gray-100 text-gray-900 cursor-pointer',
        { 'bg-gray-100': isOpen && !disabled }
      ]"
    >
      {{ text }}
      <ChevronDown 
        class="h-4 w-4 ml-1 transition-transform duration-200"
        :class="[
          { 'transform rotate-180': isOpen },
          disabled ? 'text-gray-400' : selectedValue ? 'text-blue-600' : 'text-gray-900'
        ]"
      />
    </button>
    
    <div v-if="isOpen && !disabled" 
         class="absolute z-10 min-w-[80px] whitespace-nowrap mt-2 py-2 bg-white rounded-lg shadow-lg border border-gray-100">
      <div v-for="item in options" 
           :key="item.value"
           @click="handleSelect(item)"
           class="px-4 py-2 text-sm hover:bg-gray-50 cursor-pointer flex items-center justify-between"
           :class="[
             selectedValue === item.value 
               ? 'bg-blue-50 text-blue-600' 
               : 'text-gray-900'
           ]">
        <span>{{ item.label }}</span>
        <Check v-if="selectedValue === item.value" class="h-4 w-4 text-blue-500" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ChevronDown, Check } from 'lucide-vue-next';
import { computed, ref, watch } from 'vue';

const props = defineProps({
  text: {
    type: String,
    required: true
  },
  options: {
    type: Array,
    default: () => null
  },
  isOpen: {
    type: Boolean,
    default: false
  },
  modelValue: {
    type: String,
    default: ''
  }
});

const selectedValue = ref(props.modelValue);

// 监听 modelValue 的变化
watch(() => props.modelValue, (newVal) => {
  selectedValue.value = newVal;
});

const disabled = computed(() => {
  return !props.options || props.options.length === 0;
});

const emit = defineEmits(['select', 'toggle', 'update:modelValue']);

const handleClick = () => {
  if (!disabled.value) {
    emit('toggle');
  }
};

const handleSelect = (item) => {
  if (!disabled.value) {
    // 如果当前选中的是已选中项，则取消选中
    if (selectedValue.value === item.value) {
      selectedValue.value = '';
      emit('select', null);
      emit('update:modelValue', '');
    } else {
      selectedValue.value = item.value;
      emit('select', item);
      emit('update:modelValue', item.value);
    }
    emit('toggle'); // 选择后关闭下拉框
  }
};
</script>
