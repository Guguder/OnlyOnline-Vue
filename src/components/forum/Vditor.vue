<template>
  <div id="vditor" class="w-full"></div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import Vditor from "vditor";
import "vditor/dist/index.css";

const vditor = ref(null);
const vditorInstance = ref(null);

onMounted(() => {
  vditor.value = new Vditor("vditor", {
    height: "100vh",
    width: "100%",
    mode: "ir",
    toolbarConfig: {
      pin: true,
    },
    toolbar: [
      "emoji",
      "headings",
      "bold",
      "italic",
      "strike",
      "|",
      "line",
      "quote",
      "list",
      "ordered-list",
      "check",
      "outdent",
      "indent",
      "code",
      "inline-code",
      "insert-after",
      "insert-before",
      "undo",
      "redo",
      "upload",
      "link",
      "table",
      "edit-mode",
      "both",
      "preview",
      "fullscreen",
      "outline",
      "help",
      "br",
    ],
    cache: {
      enable: false,
    },
    preview: {
      actions: [],
    },
    after: () => {
      vditor.value.setValue("Hello!");
      vditorInstance.value = vditor.value;
      window.vditor = vditorInstance.value;
      emit("mounted", vditorInstance.value);
    },
    customRenderHandler: () => {
      const style = document.createElement("style");
      style.textContent = `
    .vditor-toolbar, .vditor-sv, .vditor-ir {
      padding-left: 10px !important;
    }
  `;
      document.head.appendChild(style);
    },
    input: (value) => {
      console.log("当前编辑器内容:", value);
    },
  });
});

// 添加获取内容的方法
const getContent = () => {
  if (vditor.value) {
    return vditor.value.getValue();
  }
  return "";
};

// 暴露方法供父组件调用
defineExpose({
  getContent,
  setContent: (content) => vditorInstance.value?.setValue(content),
});
</script>

<style>
.vditor-toolbar,
.vditor-sv,
.vditor-ir {
  padding-left: 10px !important;
  background-color: #fafbfc;
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

/* 增加菜单栏文字颜色和对比度 */
.vditor-toolbar {
  color: #1f2937 !important; /* 使用更深的文字颜色 */
}

/* 增加菜单项hover效果 */
.vditor-toolbar button:hover {
  background-color: #f3f4f6 !important;
}

/* 增加图标颜色对比度 */
.vditor-toolbar svg {
  color: #4b5563 !important; /* 使用更深的图标颜色 */
  opacity: 0.9;
}

/* 激活状态的按钮样式 */
.vditor-toolbar .vditor-menu--current {
  background-color: #e5e7eb !important;
}

.vditor-toolbar .vditor-menu--current svg {
  color: #2563eb !important; /* 使用蓝色突出显示激活状态 */
}

/* 分隔符样式优化 */
.vditor-toolbar .vditor-toolbar__divider {
  border-color: #e5e7eb !important;
}

/* 下拉菜单文字样式 */
.vditor-hint {
  color: #374151 !important;
  background-color: white !important;
  border: 1px solid #e5e7eb !important;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1) !important;
}
</style>
