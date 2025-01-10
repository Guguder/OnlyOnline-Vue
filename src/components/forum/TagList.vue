<template>
  <div class="px-5 py-3 transition-all duration-300">
    <div class="max-w-[800px]">
      <div class="flex flex-wrap gap-3">
        <a-tag
          v-for="tag in tags"
          :key="tag.text"
          :color="selectedTags.includes(tag) ? tag.color : undefined"
          class="cursor-pointer whitespace-nowrap mb-3"
          :class="{ 'tag-selected': isSelected(tag) }"
          @click="handleTagClick(tag)"
        >
          {{ tag.text }}
        </a-tag>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Tag as ATag } from 'ant-design-vue'


const isSelected = (tag) => {
  return selectedTags.value.some(t => t.text === tag.text);
};
const props = defineProps({
  tags: {
    type: Array,
    required: true
  }
})

const selectedTags = ref([]);
const emit = defineEmits(['update:selectedTags'])

const handleTagClick = (tag) => {
  const index = selectedTags.value.findIndex(t => t.text === tag.text);
  if (index > -1) {
    selectedTags.value.splice(index, 1);
  } else {
    selectedTags.value.push(tag);
  }
  emit('update:selectedTags', selectedTags.value);
};
</script>

<style scoped>
.ant-tag:hover {
  opacity: 0.8;
}

.tag-selected {
  border-color: #ff0000 !important;
  border: 1px solid;
}

</style>
