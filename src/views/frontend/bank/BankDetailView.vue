<template>
  <div class="relative">
    <!-- 上半区格子背景 -->
    <div
      class="absolute top-0 left-0 right-0 h-[280px] bg-grid-pattern z-[1]"
    ></div>
    <!-- 中间渐变过渡区 -->
    <div
      class="absolute top-[210px] left-0 right-0 h-[140px] z-[2]"
      style="
        background: linear-gradient(
          to bottom,
          rgba(255, 255, 255, 0) 0%,
          rgba(255, 255, 255, 1) 50%,
          rgba(255, 255, 255, 1) 100%
        );
      "
    ></div>

    <!-- 下半区白色背景 -->
    <div
      class="absolute top-[350px] left-0 right-0 bottom-0 bg-white z-[1]"
    ></div>

    <!-- 主要内容 - 提高z-index确保在渐变层之上 -->
    <div
      class="w-screen min-h-screen flex flex-col items-center gap-[20px] relative z-[3]"
    >
      <!-- 上半区 -->
      <div class="w-[1020px] flex flex-col gap-5 mt-[20px]">
        <BankInfoCard :bank-detail="bankDetail" />
      </div>

      <!-- 下半区 -->
      <div class="w-[1020px] flex justify-between gap-[20px] mb-[40px]">
        <!-- 左侧内容区域 -->
        <div class="w-[720px] flex flex-col gap-4">
          <a-spin :spinning="loading">
            <BankProblemList
              v-for="topicGroup in topicList"
              :key="topicGroup.type"
              :type="topicGroup.type"
              :bank-topic-item-vo-list="topicGroup.bankTopicItemVoList"
            />
          </a-spin>
        </div>

        <!-- 右侧内容区域 -->
        <div class="w-[280px]">
          <!-- 题库概述卡片 -->
          <div class="rounded-2xl px-3 py-3">
            <h2 class="text-lg font-semibold text-gray-900 mb-4">题库概述</h2>
            <div class="rounded-lg">
              <div
                v-for="(line, index) in getOverviewLines"
                :key="index"
                class="flex items-start gap-2 mb-2"
              >
                <div class="w-1.5 h-1.5 rounded-full bg-gray-400 mt-2"></div>
                <p class="text-gray-700 text-sm flex-1">{{ line }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { getBankDetail } from "../../../api/frontend/bank.js";
import { ref, onMounted, computed } from "vue";
import { useRoute } from "vue-router";
import BankProblemList from "./BankProblemList.vue";
import BankInfoCard from "./BankInfoCard.vue";
import { topic } from "../../../api/frontend/topic"; // 修改导入方式

const route = useRoute();
const loading = ref(false); // 添加 loading ref
const bankDetail = ref(null);
const topicList = ref([]);

// 获取题库详情
const fetchBankDetail = async (bankId) => {
  try {
    const result = await getBankDetail(bankId);
    if (result.code === 200) {
      bankDetail.value = result.data;
    }
  } catch (error) {
    console.error("获取题库详情失败:", error);
  }
};

// 获取题目列表
const fetchTopicList = async () => {
  try {
    loading.value = true;
    const response = await topic.getTopicListByBankId(route.params.id);
    console.log("题库列表响应:", response); // 添加调试日志

    if (response.code === 200) {
      // 确保数据结构正确
      const data = response.data || [];
      console.log("处理前的题库数据:", data); // 添加调试日志

      // 如果后端返回的不是数组，需要处理成数组
      topicList.value = Array.isArray(data)
        ? data
        : [
            {
              type: "查询",
              bankTopicItemVoList: Array.isArray(data.bankTopicItemVoList)
                ? data.bankTopicItemVoList
                : [],
            },
          ];

      console.log("处理后的题库数据:", topicList.value); // 添加调试日志
    }
  } catch (error) {
    console.error("获取题目列表失败:", error);
  } finally {
    loading.value = false;
  }
};

// 处理概述文本，将其分割成数组
const getOverviewLines = computed(() => {
  if (!bankDetail.value?.overview) return [];
  return bankDetail.value.overview
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
});

onMounted(() => {
  const bankId = route.params.id;
  fetchBankDetail(bankId);
  fetchTopicList(bankId);
});
</script>

<style scoped>
.bg-grid-pattern {
  background-color: #f8fdff;
  background-image: linear-gradient(to right, #e4e7e9 1px, transparent 1px),
    linear-gradient(to bottom, #e4e7e9 1px, transparent 1px);
  background-size: 20px 20px;
}
</style>
