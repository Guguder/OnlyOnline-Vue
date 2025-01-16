<template>
  <div
    class="split-pane relative"
    :class="direction === 'horizontal' ? 'flex' : 'flex flex-col'"
    ref="container"
  >
    <div class="first-pane" :style="firstPaneStyle">
      <slot name="first" />
    </div>

    <div
      class="splitter-handle hover:bg-purple-200 group"
      :class="
        direction === 'horizontal'
          ? 'w-2 cursor-col-resize'
          : 'h-2 cursor-row-resize'
      "
      @mousedown="startResize"
    >
      <div
        class="splitter-line opacity-0 group-hover:opacity-100 transition-opacity"
        :class="
          direction === 'horizontal'
            ? 'w-[6px] h-full mx-auto'
            : 'h-[6px] w-full my-auto'
        "
      ></div>
    </div>

    <div class="second-pane" :style="secondPaneStyle">
      <slot name="second" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";

const props = defineProps({
  direction: {
    type: String,
    default: "horizontal",
  },
  defaultRatio: {
    type: Number,
    default: 50,
  },
  minSize: {
    type: Number,
    default: 10,
  },
});

const container = ref(null);
const splitRatio = ref(props.defaultRatio);
let startPosition = 0;
let startRatio = 0;
let containerSize = 0;
let rafId = null;

// 计算面板样式
const firstPaneStyle = computed(() => {
  const flexBasis = `${splitRatio.value}%`;
  return {
    flexBasis,
    flexGrow: 0,
    flexShrink: 0,
  };
});

const secondPaneStyle = computed(() => {
  const flexBasis = `${100 - splitRatio.value}%`;
  return {
    flexBasis,
    flexGrow: 0,
    flexShrink: 0,
  };
});

const startResize = (e) => {
  e.preventDefault();
  startPosition = props.direction === "horizontal" ? e.clientX : e.clientY;
  startRatio = splitRatio.value;
  containerSize =
    props.direction === "horizontal"
      ? container.value.offsetWidth
      : container.value.offsetHeight;

  document.addEventListener("mousemove", handleResize, { passive: true });
  document.addEventListener("mouseup", stopResize);
  document.body.classList.add("select-none");
};

const handleResize = (e) => {
  if (rafId) {
    cancelAnimationFrame(rafId);
  }

  rafId = requestAnimationFrame(() => {
    const currentPosition =
      props.direction === "horizontal" ? e.clientX : e.clientY;
    const delta = ((currentPosition - startPosition) / containerSize) * 100;
    let newRatio = startRatio + delta;

    // 限制最小尺寸
    newRatio = Math.min(Math.max(newRatio, props.minSize), 100 - props.minSize);

    // 四舍五入到小数点后两位，减少不必要的更新
    splitRatio.value = Math.round(newRatio * 100) / 100;
  });
};

const stopResize = () => {
  if (rafId) {
    cancelAnimationFrame(rafId);
  }
  document.removeEventListener("mousemove", handleResize);
  document.removeEventListener("mouseup", stopResize);
  document.body.classList.remove("select-none");
};

onMounted(() => {
  splitRatio.value = props.defaultRatio;
});

onBeforeUnmount(() => {
  if (rafId) {
    cancelAnimationFrame(rafId);
  }
  document.removeEventListener("mousemove", handleResize);
  document.removeEventListener("mouseup", stopResize);
});
</script>

<style scoped>
.split-pane {
  width: 100%;
  min-height: 0; /* 添加这行 */
  background: transparent;
  display: flex;
}

.first-pane,
.second-pane {
  overflow: auto;
  position: relative;
  min-height: 0; /* 添加这行 */
}

.splitter-handle {
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;
  z-index: 10;
  flex-shrink: 0;
}

.splitter-line {
  background-color: transparent;
  transition: all 0.2s;
}

.splitter-handle:hover .splitter-line,
.group-hover .splitter-line {
  background-color: rgb(130, 2, 251);
}

/* 自定义滚动条样式 */
.first-pane::-webkit-scrollbar,
.second-pane::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

.first-pane::-webkit-scrollbar-thumb,
.second-pane::-webkit-scrollbar-thumb {
  background: #e2e8f0;
  border-radius: 3px;
}

.first-pane::-webkit-scrollbar-track,
.second-pane::-webkit-scrollbar-track {
  background: transparent;
}
</style>
