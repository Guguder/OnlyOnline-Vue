<template>
  <div id="vditor" class="w-full"></div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import Vditor from 'vditor';
import 'vditor/dist/index.css';

const vditor = ref(null);

onMounted(() => {
  vditor.value = new Vditor('vditor', {
    height: '100vh',
    width: '100%',
    mode: 'ir',
    toolbarConfig: {
      pin: true,
    },
    toolbar: [
      'emoji', 'headings', 'bold', 'italic', 'strike', '|', 'line', 
      'quote', 'list', 'ordered-list', 'check', 'outdent', 'indent', 
      'code', 'inline-code', 'insert-after', 'insert-before', 'undo', 
      'redo', 'upload', 'link', 'table', 'edit-mode', 'both', 'preview',
      'fullscreen', 'outline', 'help', 'br'
    ],
    cache: {
      enable: false,
    },
    preview: {
      actions:  []
    },
    after: () => {
      vditor.value.setValue('Hello!');
    },
    customRenderHandler: () => {
  const style = document.createElement('style');
  style.textContent = `
    .vditor-toolbar, .vditor-sv, .vditor-ir {
      padding-left: 10px !important;
    }
  `;
  document.head.appendChild(style);
},
    input: (value) => {
      console.log('当前编辑器内容:', value);
    }
  });
});

// 添加获取内容的方法
const getContent = () => {
  if (vditor.value) {
    return vditor.value.getValue();
  }
  return '';
};

// 暴露方法供父组件调用
defineExpose({
  getContent
});

</script>

<style>
.vditor-toolbar,
.vditor-sv,
.vditor-ir {
  padding-left: 10px !important;
  background-color: #FAFBFC;
}

/* 使用更高优先级覆盖原样式 */
.vditor-reset[contenteditable="true"],
.vditor-reset[contenteditable="true"]:hover,
.vditor-reset[contenteditable="true"]:focus {
  padding: 0px !important;
}

/* 确保预览模式也不会有额外padding */
.vditor-preview {
  padding: 10px !important;
}
</style>