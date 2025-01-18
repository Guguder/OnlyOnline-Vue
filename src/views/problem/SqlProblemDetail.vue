<template>
  <div class="w-screen h-screen overflow-hidden flex flex-col">
    <TopBar :title="problem.title" @back="goBack" />
    <div class="flex-1 overflow-hidden bg-gray-100 p-4 min-h-0">
      <a-spin :spinning="loading" class="h-full shadow-lg rounded-lg">
        <split-pane
          direction="horizontal"
          :default-ratio="40"
          :min-size="36"
          :current-ratio="splitRatio"
          @update:ratio="handleRatioChange"
          class="h-full"
        >
          <template #first>
            <sql-content
              v-model="activeTab"
              :tabs="tabs"
              :is-collapsed="isCollapsed"
              :is-min-width="isMinWidth"
              @collapse="collapsePanel"
              @expand="expandPanel"
            >
              <template #default="{ activeTab }">
                <div v-if="activeTab === 'description'" class="p-4">
                  题目描述内容
                </div>
                <div v-else-if="activeTab === 'solution'" class="p-4">
                  题解内容
                </div>
                <div v-else-if="activeTab === 'history'" class="p-4">
                  答题记录内容
                </div>
              </template>
            </sql-content>
          </template>
          
          <template #second>
            <split-pane
              direction="vertical"
              :default-ratio="70"
              :min-size="36"
              :current-ratio="verticalSplitRatio"
              @update:ratio="handleVerticalRatioChange"
              class="h-[calc(100vh-theme(space.20)-0.5rem)]"
            >
              <template #first>
                <sql-editor
                  v-model:value="editorValue"
                  :is-collapsed="isVerticalCollapsed"
                  @collapse="collapseVerticalPanel"
                  @expand="expandVerticalPanel"
                >
                  <div class="h-full w-full">
                    <textarea
                      v-model="editorValue"
                      class="w-full h-full p-4 resize-none border-none outline-none"
                    ></textarea>
                  </div>
                </sql-editor>
              </template>
              <template #second>
                <sql-result-panel
                  :is-collapsed="isBottomCollapsed"
                  v-model="bottomActiveTab"
                  :tabs="resultTabs"
                  @collapse="collapseBottomPanel"
                  @expand="expandBottomPanel"
                >
                  <template #default="{ activeTab }">
                    <div v-if="activeTab === 'testcase'" class="p-4">
                      测试用例内容
                    </div>
                    <div v-else-if="activeTab === 'result'" class="p-4">
                      测试结果内容
                    </div>
                  </template>
                </sql-result-panel>
              </template>
            </split-pane>
          </template>
        </split-pane>
      </a-spin>
    </div>
  </div>
</template>

<script setup>
import SqlContent from '../../components/SqlContent.vue'
import SqlEditor from '../../components/SqlEditor.vue'
import TopBar from "../../components/TopBar.vue"
import { ref, computed } from "vue"
import { useRoute, useRouter } from "vue-router"
import {
  ReadOutlined,
  SolutionOutlined,
  HistoryOutlined,
  ExperimentOutlined,
  CheckSquareOutlined,
} from "@ant-design/icons-vue"
import { Spin } from "ant-design-vue"
import SplitPane from "../../components/SplitPane.vue"
import SqlResultPanel from '../../components/SqlResultPanel.vue'

const loading = ref(false)
const route = useRoute()
const problem = ref({
  id: route.params.id,
  title: "SQL题目",
  difficulty: "中等",
  description: ""
})

const router = useRouter()
const goBack = () => router.back()

// 左侧内容面板相关
const activeTab = ref("description")
const tabs = [
  { key: "description", label: "题目描述", icon: ReadOutlined },
  { key: "solution", label: "题解", icon: SolutionOutlined },
  { key: "history", label: "答题记录", icon: HistoryOutlined },
]

// 面板宽度检测
const isMinWidth = computed(() => 
  document.querySelector(".split-pane > div:first-child")?.offsetWidth <= 80
)

// 左侧面板折叠控制
const initialRatio = 40
const splitRatio = ref(initialRatio)
const isCollapsed = computed(() => splitRatio.value <= 5)

const handleRatioChange = ratio => splitRatio.value = ratio
const expandPanel = () => splitRatio.value = initialRatio
const collapsePanel = () => {
  const containerWidth = document.querySelector(".split-pane")?.offsetWidth || 1000
  splitRatio.value = (42 / containerWidth) * 100  // 修改为42px
}

// 垂直分割相关
const initialVerticalRatio = 70
const verticalSplitRatio = ref(initialVerticalRatio)
const isVerticalCollapsed = computed(() => verticalSplitRatio.value <= 10)
const isBottomCollapsed = computed(() => 100 - verticalSplitRatio.value <= 10)

const handleVerticalRatioChange = ratio => verticalSplitRatio.value = ratio

// 面板展开/收起处理函数
const expandVerticalPanel = () => verticalSplitRatio.value = initialVerticalRatio
const collapseVerticalPanel = () => {
  const containerHeight = document.querySelector('.split-pane .split-pane')?.offsetHeight || 1000
  verticalSplitRatio.value = (42 / containerHeight) * 100  // 修改为42px
}

const expandBottomPanel = () => verticalSplitRatio.value = 100 - initialBottomRatio
const collapseBottomPanel = () => {
  const containerHeight = document.querySelector('.split-pane .split-pane')?.offsetHeight || 1000
  verticalSplitRatio.value = 100 - (42 / containerHeight) * 100  // 修改为42px
}

// 结果区域配置
const initialBottomRatio = 30
const bottomActiveTab = ref("testcase")
const resultTabs = [
  { key: "testcase", label: "测试用例", icon: ExperimentOutlined },
  { key: "result", label: "测试结果", icon: CheckSquareOutlined },
]

// 编辑器值
const editorValue = ref('-- 在这里编写你的SQL查询\nSELECT * FROM Employees;')
</script>

<style scoped>
/* 基础按钮样式 */
:deep(.ant-btn) {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

:deep(.ant-btn:hover) {
  color: rgba(0, 0, 0, 0.88) !important;
  border-color: transparent !important;
}

/* 按钮状态样式 */
:deep(.ant-btn.text-gray-400:hover) {
  color: rgb(75, 85, 99) !important;
  background-color: rgb(243, 244, 246);
}

:deep(.ant-btn.text-gray-900:hover) {
  color: rgb(17, 24, 39) !important;
  background-color: rgb(243, 244, 246);
}

/* 过渡动画 */
.transition-all {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* 容器基础样式 */
.flex-1.flex.flex-col.overflow-hidden {
  min-height: 0;
  height: 100%;
  position: relative;
}

/* 状态栏样式 */
.h-6.flex-none {
  z-index: 51;
  position: relative;
  background-color: #f9fafb;
  border-top: 1px solid #e5e7eb;
  font-family: Consolas, Monaco, monospace;
}
</style>
