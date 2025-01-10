<template>
  <div class="markdown-content" v-html="renderedMarkdown"></div>
</template>

<script setup>
import { ref, watch } from "vue";
import MarkdownIt from "markdown-it";

const props = defineProps({
  content: {
    type: String,
    required: true,
  },
  options: {
    type: Object,
    default: () => ({ html: true, linkify: true }),
  },
});

const md = new MarkdownIt(props.options);
const renderedMarkdown = ref("");

// 渲染 Markdown 内容
const renderMarkdown = (content) => {
  renderedMarkdown.value = md.render(content || '');
};

// 监听内容变化
watch(() => props.content, (newContent) => {
  renderMarkdown(newContent);
}, { immediate: true });

// 监听配置变化
watch(() => props.options, (newOptions) => {
  Object.assign(md.options, newOptions);
  renderMarkdown(props.content);
}, { deep: true });
</script>

<style scoped>
.markdown-content {
  font-size: 16px;
  line-height: 1.5;
  color: #333;
}

.markdown-content h1,
.markdown-content h2,
.markdown-content h3 {
  margin-top: 1rem;
  margin-bottom: 0.5rem;
}

.markdown-content p {
  margin-bottom: 1rem;
}
</style>
