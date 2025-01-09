<template>
  <Transition
    enter-active-class="animate-modal-enter"
    leave-active-class="animate-modal-leave"
  >
    <div v-if="modelValue" class="fixed inset-0 z-50 bg-white">
      <!-- 关闭按钮 -->
      <button 
        @click="$emit('update:modelValue', false)"
        class="absolute left-6 top-6 p-2 rounded-full hover:bg-gray-100 transition-colors opacity-0 animate-fade-in"
      >
        <X class="w-6 h-6 text-gray-600"/>
      </button>
      
      <!-- 发布内容区域 -->
      <div class="w-full h-full pt-20 opacity-0 animate-content-enter">
        <div class="max-w-[1000px] mx-auto">
          <div class="bg-white rounded-2xl p-6">
            <!-- 标题输入 -->
            <input 
              v-model="articleForm.title"
              type="text"
              placeholder="请输入文章标题..."
              class="w-full text-2xl font-medium outline-none border-b pb-4 mb-6 focus:border-purple-500 transition-colors"
            >
            
            <!-- 话题选择 -->
            <div class="mb-6 space-y-3">
              <label class="text-sm text-gray-600">选择话题：</label>
              <div class="flex gap-3">
                <button
                  v-for="topic in topics"
                  :key="topic.value"
                  @click="articleForm.topic = topic.value"
                  :class="[
                    'px-4 py-2 rounded-lg text-sm transition-colors',
                    articleForm.topic === topic.value
                      ? 'bg-purple-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  ]"
                >
                  {{ topic.label }}
                </button>
              </div>
            </div>
            
            <!-- 标签选择 -->
            <div class="mb-6 space-y-3">
              <label class="text-sm text-gray-600">添加标签：</label>
              <div class="flex flex-wrap gap-2">
                <a-tag
                  v-for="tag in tags"
                  :key="tag.text"
                  :color="selectedTags.includes(tag) ? tag.color : undefined"
                  class="cursor-pointer px-3 py-1"
                  @click="toggleTag(tag)"
                >
                  {{ tag.text }}
                </a-tag>
              </div>
            </div>

            <!-- 文本编辑区 -->
            <div class="mb-6">
              <textarea
                v-model="articleForm.content"
                placeholder="请输入文章内容..."
                class="w-full h-[500px] p-4 text-base border rounded-lg resize-none focus:border-purple-500 outline-none transition-colors"
              ></textarea>
            </div>

            <!-- 底部操作区 -->
            <div class="flex items-center justify-between pt-4 border-t">
              <div class="flex items-center gap-3">
                <Switch
                  v-model:checked="articleForm.isAnonymous"
                  class="bg-gray-200"
                />
                <span class="text-sm text-gray-600">匿名发布</span>
              </div>
              
              <div class="flex gap-4">
                <button class="px-6 py-2 rounded-lg text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors">
                  保存草稿
                </button>
                <button
                  @click="handlePublish"
                  class="px-6 py-2 rounded-lg text-white bg-purple-500 hover:bg-purple-600 transition-colors"
                >
                  发布文章
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { X } from 'lucide-vue-next'
import { Tag as ATag, Switch, message } from 'ant-design-vue'

defineProps({
  modelValue: {
    type: Boolean,
    required: true
  }
})

defineEmits(['update:modelValue'])

const articleForm = reactive({
  title: '',
  topic: '',
  content: '',
  isAnonymous: false,
  tags: []
})

const topics = [
  { label: '学习分享', value: 'study' },
  { label: '求职面试', value: 'job' },
  { label: '职场与内推', value: 'career' },
  { label: '技术交流', value: 'tech' },
  { label: '意见反馈', value: 'feedback' }
]

const tags = ref([
  { text: '前端开发', color: 'blue' },
  { text: '后端开发', color: 'green' },
  { text: '面试经验', color: 'purple' },
  { text: '实习', color: 'orange' }
])

const selectedTags = ref([])

const toggleTag = (tag) => {
  const index = selectedTags.value.indexOf(tag)
  if (index > -1) {
    selectedTags.value.splice(index, 1)
  } else {
    selectedTags.value.push(tag)
  }
  articleForm.tags = selectedTags.value.map(t => t.text)
}

const handlePublish = () => {
  if (!articleForm.title.trim()) {
    return message.warning('请输入文章标题')
  }
  if (!articleForm.topic) {
    return message.warning('请选择文章话题')
  }
  if (!articleForm.content.trim()) {
    return message.warning('请输入文章内容')
  }
  if (selectedTags.value.length === 0) {
    return message.warning('请至少选择一个标签')
  }
  
  console.log('发布文章:', {
    ...articleForm,
    tags: selectedTags.value
  })
}
</script>

<style scoped>
// ...keep existing animation styles...
</style>
