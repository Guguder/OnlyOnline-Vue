<template>
  <div class="h-full w-full bg-white rounded-lg shadow-sm overflow-hidden flex flex-col relative">
    <!-- 调整工具栏与左侧区域一致 -->
    <div class="border-b border-gray-100 flex items-center justify-between p-1">
      <div class="flex items-center">
        <a-button
          type="text"
          class="!px-3 !h-8 !py-2 flex items-center gap-1 text-gray-900 font-medium"
        >
          <code-outlined />
          <span>代码编辑器</span>
        </a-button>
      </div>
      <a-button
        type="text"
        class="!px-2 !h-8 !py-2 text-gray-400 hover:text-gray-600"
        @click="$emit(isCollapsed ? 'expand' : 'collapse')"
      >
        <component :is="isCollapsed ? DownOutlined : UpOutlined" />
      </a-button>
    </div>

    <!-- 编辑器内容区 - 只有这里会折叠 -->
    <div 
      class="transition-all duration-300"
      :class="[
        isCollapsed ? 'h-0' : 'flex-1',
        'overflow-hidden relative'
      ]"
    >
      <div class="absolute inset-0" ref="editorContainer"></div>
    </div>

    <!-- 状态栏 - 始终显示 -->
    <div class="h-6 flex-none border-t border-gray-100 bg-white text-xs text-gray-500 flex items-center px-3 justify-end">
      <span>行 {{ cursorPosition.lineNumber }}, 列 {{ cursorPosition.column }}</span>
    </div>
  </div>
</template>

<script setup>
import * as monaco from 'monaco-editor'
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { CodeOutlined, UpOutlined, DownOutlined } from '@ant-design/icons-vue'

const props = defineProps({
  isCollapsed: Boolean,
  value: {
    type: String,
    default: '-- 在这里编写你的SQL查询\nSELECT * FROM Employees;'
  }
})

const emit = defineEmits(['update:value', 'collapse', 'expand'])

const editorContainer = ref(null)
const editorInstance = ref(null)
const cursorPosition = ref({ lineNumber: 1, column: 1 })

// SQL 关键字列表
const keywords = [
  "SELECT", "FROM", "WHERE", "INSERT", "UPDATE", "DELETE", "CREATE", "DROP", "ALTER", "TABLE",
  // ...其他关键字
]

// 编辑器配置
const editorOptions = {
  value: props.value,
  language: 'sql',
  theme: 'vs',
  minimap: { enabled: false },
  fontSize: 14,
  lineNumbers: 'on',
  roundedSelection: false,
  scrollBeyondLastLine: false,
  readOnly: false,
  automaticLayout: true,
  tabSize: 2,
  folding: false,
  wordWrap: 'on',
  contextmenu: false,
  renderLineHighlight: 'none',
  hideCursorInOverviewRuler: true,
  overviewRulerBorder: false,
  scrollbar: {
    vertical: 'visible',
    horizontal: 'visible',
    verticalScrollbarSize: 8,
    horizontalScrollbarSize: 8,
  },
  glyphMargin: false,
  lineDecorationsWidth: 8,
  lineNumbersMinChars: 3,
  padding: { top: 4, bottom: 4 },
}

// 初始化编辑器
const initEditor = () => {
  if (!editorContainer.value) {
    console.error("Editor container not found");
    return;
  }

  try {
    const editor = monaco.editor.create(editorContainer.value, {
      ...editorOptions,
      automaticLayout: true,
    });

    monaco.languages.registerCompletionItemProvider('sql', {
      provideCompletionItems: () => ({
        suggestions: keywords.map(keyword => ({
          label: keyword,
          kind: monaco.languages.CompletionItemKind.Keyword,
          insertText: keyword,
        }))
      })
    });

    editorInstance.value = editor;
    
    editor.onDidChangeModelContent(() => {
      emit('update:value', editor.getValue());
    });

    editor.onDidChangeCursorPosition((e) => {
      cursorPosition.value = {
        lineNumber: e.position.lineNumber,
        column: e.position.column
      };
    });

    const resizeObserver = new ResizeObserver(() => editor.layout());
    resizeObserver.observe(editorContainer.value);

    return () => {
      resizeObserver.disconnect();
      editor.dispose();
    };
  } catch (error) {
    console.error('Error initializing editor:', error);
  }
};

onMounted(async () => {
  try {
    const cleanup = initEditor();
    if (cleanup) {
      onBeforeUnmount(cleanup);
    }
  } catch (error) {
    console.error('Error in onMounted:', error);
  }
});
</script>

<style scoped>
/* 保持原有的编辑器相关样式 */
:deep(.monaco-editor) {
  width: 100% !important;
  height: 100% !important;
  padding: 0;
}

:deep(.monaco-editor .overflow-guard) {
  width: 100% !important;
  height: 100% !important;
}

:deep(.monaco-editor .decorationsOverviewRuler) {
  display: none !important;
}

:deep(.monaco-editor .margin) {
  background: white !important;
}

:deep(.monaco-editor .line-numbers) {
  color: #999 !important;
  font-size: 12px !important;
}

:deep(.monaco-editor .scrollbar) {
  opacity: 0.6;
}

:deep(.monaco-editor .scrollbar:hover) {
  opacity: 0.8;
}

:deep(.ant-btn) {
  border: none;
  padding: 0;
}

:deep(.ant-btn:hover) {
  background-color: transparent;
}

/* 添加过渡效果 */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
}
</style>
