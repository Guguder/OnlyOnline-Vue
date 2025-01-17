<template>
  <div
    class="split-pane relative flex"
    :class="direction === 'horizontal' ? 'flex-row' : 'flex-col'"
    @mousemove="handleMouseMove"
    @mouseup="handleMouseUp"
    @mouseleave="handleMouseUp"
  >
    <div :style="firstPaneStyle" class="overflow-hidden">
      <slot name="first"></slot>
    </div>
    <div
      class="splitter-trigger select-none"
      :class="
        direction === 'horizontal'
          ? 'w-1 cursor-col-resize hover:bg-gray-300'
          : 'h-1 cursor-row-resize hover:bg-gray-300'
      "
      @mousedown="handleMouseDown"
    ></div>
    <div :style="secondPaneStyle" class="overflow-hidden">
      <slot name="second"></slot>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";

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
    default: 40,
  },
  currentRatio: {
    type: Number,
    default: null,
  },
});

const emit = defineEmits(["update:ratio"]);

const isDragging = ref(false);
const splitRatio = ref(props.currentRatio ?? props.defaultRatio);
let startPos = 0;
let startRatio = 0;

const firstPaneStyle = computed(() => ({
  [props.direction === "horizontal"
    ? "width"
    : "height"]: `${splitRatio.value}%`,
  minWidth: props.direction === "horizontal" ? `${props.minSize}px` : undefined,
  minHeight: props.direction === "vertical" ? `${props.minSize}px` : undefined,
}));

const secondPaneStyle = computed(() => ({
  flex: 1,
}));

const handleMouseDown = (e) => {
  isDragging.value = true;
  startPos = props.direction === "horizontal" ? e.clientX : e.clientY;
  startRatio = splitRatio.value;
  e.preventDefault();
};

const handleMouseMove = (e) => {
  if (!isDragging.value) return;

  const pos = props.direction === "horizontal" ? e.clientX : e.clientY;
  const delta = pos - startPos;

  const containerSize =
    props.direction === "horizontal"
      ? e.currentTarget.offsetWidth
      : e.currentTarget.offsetHeight;

  const deltaRatio = (delta / containerSize) * 100;
  let newRatio = startRatio + deltaRatio;

  // 确保不小于最小宽度
  const minRatio = (props.minSize / containerSize) * 100;
  newRatio = Math.max(minRatio, Math.min(100 - minRatio, newRatio));

  splitRatio.value = newRatio;
  emit("update:ratio", newRatio);
};

const handleMouseUp = () => {
  isDragging.value = false;
};

// 监听外部比例变化
watch(
  () => props.currentRatio,
  (newRatio) => {
    if (newRatio !== null) {
      splitRatio.value = newRatio;
    }
  }
);
</script>

<style scoped>
.split-pane {
  width: 100%;
  height: 100%;
}

.splitter-trigger {
  transition: background-color 0.2s;
}
</style>
