<template>
  <Transition name="fade">
    <div v-if="modelValue" class="fixed inset-0 z-50">
      <!-- 背景遮罩 -->
      <div class="absolute inset-0 bg-black/50" @click="closeModal"></div>

      <!-- 模态框内容 -->
      <div class="fixed inset-0 bg-white">
        <!-- 头部导航栏 -->
        <div
          class="h-16 px-6 border-b border-gray-200 flex items-center justify-between"
        >
          <!-- 左侧关闭按钮 -->
          <button
            @click="closeModal"
            class="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X class="h-6 w-6 text-gray-500" />
          </button>

          <!-- 右侧功能区 -->
          <div class="flex items-center gap-4">
            <!-- 复制按钮 -->
            <button
              @click="copyContent"
              class="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              复制内容
            </button>

            <!-- 匿名开关 - 使用 a-checkbox -->
            <a-checkbox
              v-model:checked="isAnonymous"
              :open="isAnonymous"
              class="text-sm text-gray-600"
            >
              匿名
            </a-checkbox>

            <!-- 暂存按钮 -->
            <button
              @click="saveDraft"
              class="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              暂存草稿
            </button>

            <!-- 发布按钮 -->
            <button
              @click="publishPost"
              class="px-4 py-2 text-sm text-white bg-purple-500 hover:bg-purple-600 rounded-lg transition-colors"
            >
              发布
            </button>
          </div>
        </div>

        <!-- 内容区域 -->
        <div class="h-[calc(100vh-64px)] overflow-y-auto">
          <div class="w-[90%] max-w-[1400px] mx-auto py-6">
            <div class="space-y-6">
              <!-- 标题输入框 -->
              <div class="flex flex-col gap-2 relative">
                <input
                  type="text"
                  v-model="postTitle"
                  maxlength="20"
                  placeholder="此处输入标题"
                  class="w-full py-2 text-base font-medium border-0 focus:outline-none"
                  @focus="isTitleFocused = true"
                  @blur="isTitleFocused = false"
                />
                <div class="relative h-[1px] bg-gray-200 overflow-hidden">
                  <div
                    class="absolute inset-x-1/2 h-[2px] bg-purple-500 transition-all duration-300 ease-out"
                    :class="{ 'inset-x-0': isTitleFocused }"
                  ></div>
                </div>
              </div>

              <!-- 话题和标签区域 -->
              <div class="flex flex-col gap-4">
                <div class="flex items-start gap-4">
                  <TopicListButton
                    text="所属话题"
                    :options="postCategoryOptions"
                    :isOpen="currentOpenDropdown === 'postCategory'"
                    @toggle="handleDropdownToggle('postCategory')"
                    @select="handlePostCategorySelect"
                  />

                  <!-- 标签搜索输入框 -->
                  <div class="w-[120px] relative tag-search-container">
                    <div class="relative">
                      <input
                        v-model="tagSearchQuery"
                        placeholder="搜索标签..."
                        class="w-full px-3 py-2 bg-gray-50 rounded-lg text-sm border border-gray-200 focus:outline-none focus:border-purple-500"
                        @focus="isTagSearchFocused = true"
                      />
                      <button
                        v-show="tagSearchQuery"
                        @click="clearTagSearch"
                        class="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        <X class="w-4 h-4" />
                      </button>
                    </div>

                    <!-- 标签搜索下拉列表 -->
                    <div
                      v-if="isTagSearchFocused && filteredTags.length > 0"
                      class="absolute left-0 right-0 top-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 max-h-[200px] overflow-y-auto z-50"
                    >
                      <div
                        v-for="tag in filteredTags"
                        :key="tag.value"
                        @click.stop="addTag(tag)"
                        class="px-4 py-2 hover:bg-gray-50 cursor-pointer text-sm"
                      >
                        {{ tag.label }}
                      </div>
                    </div>
                  </div>

                  <!-- 已选标签展示 -->
                  <div class="relative flex items-center h-[36px]">
                    <div class="flex flex-wrap gap-4 justify-center">
                      <div
                        v-for="tag in selectedTags"
                        :key="tag.value"
                        class="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-600 rounded text-sm"
                      >
                        {{ tag.label }}
                        <button
                          @click="removeTag(tag)"
                          class="hover:text-blue-800"
                        >
                          <X class="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 编辑器区域 -->
              <div>
                <Vditor ref="editorRef" @mounted="handleEditorMounted" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { X } from "lucide-vue-next";
import { message } from "ant-design-vue";
import TopicListButton from "../topics/TopicListButton.vue";
import {
  FileText,
  Users,
  MessageCircle,
  Share2,
  PenLine,
} from "lucide-vue-next";
import { blog } from "../../api/blog";
import { tags } from "../../api/tags";
import { Checkbox as ACheckbox } from "ant-design-vue"; // 确保引入了 Checkbox

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(["update:modelValue", "publish"]);

// Modal 状态
const isAnonymous = ref(false);
const postTitle = ref("");
const isTitleFocused = ref(false);

// 编辑器相关
const editorRef = ref(null);
const vditorInstance = ref(null);

// 话题分类选项
const postCategoryOptions = ref([
  { label: "求职面试", value: 1, icon: FileText, iconColor: "text-[#2196f3]" },
  { label: "职场与内推", value: 2, icon: Users, iconColor: "text-[#4caf50]" },
  {
    label: "技术交流",
    value: 3,
    icon: MessageCircle,
    iconColor: "text-[#9c27b0]",
  },
  { label: "学习分享", value: 4, icon: Share2, iconColor: "text-[#ff9800]" },
  { label: "意见反馈", value: 5, icon: PenLine, iconColor: "text-[#00bcd4]" },
]);

// 话题选择相关
const currentOpenDropdown = ref(null);
const selectedCategory = ref(null);

// 标签相关
const tagSearchQuery = ref("");
const isTagSearchFocused = ref(false);
const selectedTags = ref([]);
const filterTags = ref([]);

// 计算属性
const allTags = computed(() => {
  return filterTags.value.map((tag) => ({
    label: tag.text,
    value: tag.id,
    color: tag.color,
  }));
});

const filteredTags = computed(() => {
  if (!tagSearchQuery.value) {
    return allTags.value.filter(
      (tag) =>
        !selectedTags.value.some((selected) => selected.value === tag.value)
    );
  }
  return allTags.value.filter(
    (tag) =>
      tag.label.toLowerCase().includes(tagSearchQuery.value.toLowerCase()) &&
      !selectedTags.value.some((selected) => selected.value === tag.value)
  );
});

// 方法
const closeModal = () => {
  emit("update:modelValue", false);
};

const handleDropdownToggle = (dropdownId) => {
  currentOpenDropdown.value =
    currentOpenDropdown.value === dropdownId ? null : dropdownId;
};

const handlePostCategorySelect = (item) => {
  selectedCategory.value = item;
};

const handleEditorMounted = (vdt) => {
  vditorInstance.value = vdt;
};

const addTag = (tag) => {
  if (selectedTags.value.length < 8) {
    selectedTags.value.push(tag);
    tagSearchQuery.value = "";
    document.querySelector('input[placeholder="搜索标签..."]')?.focus();
  }
};

const removeTag = (tag) => {
  selectedTags.value = selectedTags.value.filter((t) => t.value !== tag.value);
};

const clearTagSearch = () => {
  tagSearchQuery.value = "";
  document.querySelector('input[placeholder="搜索标签..."]')?.focus();
};

const handleClickOutside = (event) => {
  const tagSearchContainer = document.querySelector(".tag-search-container");
  if (tagSearchContainer && !tagSearchContainer.contains(event.target)) {
    isTagSearchFocused.value = false;
  }
};

const fetchTags = async () => {
  try {
    const result = await tags.getTagsList();
    if (result.code === 200) {
      filterTags.value = result.data.map((tag) => ({
        text: tag.name,
        color: tag.color.toLowerCase(),
        id: tag.id,
      }));
    }
  } catch (error) {
    console.error("获取标签失败:", error);
  }
};

const publishPost = async () => {
  try {
    const editorContent = editorRef.value?.getContent();

    // 数据验证
    if (!postTitle.value?.trim()) {
      message.warning("请输入标题");
      return;
    }
    if (!selectedCategory.value) {
      message.warning("请选择所属话题");
      return;
    }
    if (!selectedTags.value?.length) {
      message.warning("请至少选择一个标签");
      return;
    }
    if (!editorContent) {
      message.warning("请输入内容");
      return;
    }

    message.loading("发布中...", 0);

    const postData = {
      photoList: [],
      isAnonymous: isAnonymous.value ? 1 : 0,
      tagsList: selectedTags.value.map((tag) => Number(tag.value)),
      title: postTitle.value.trim(),
      type: selectedCategory.value.value,
      content: editorContent.trim(),
    };

    const result = await blog.createPost(postData);

    if (result.code === 200) {
      message.destroy();
      message.success("发布成功");
      resetForm();
      closeModal();
    } else {
      throw new Error(result.msg || "发布失败");
    }
  } catch (error) {
    message.destroy();
    message.error(error.message || "发布失败，请重试");
    console.error("发布失败:", error);
  }
};

const resetForm = () => {
  postTitle.value = "";
  selectedTags.value = [];
  selectedCategory.value = null;
  window.vditor?.setValue?.("");
};

// 生命周期钩子
onMounted(() => {
  document.addEventListener("click", handleClickOutside);
  fetchTags();
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 删除原有的 toggle 相关样式 */
</style>
