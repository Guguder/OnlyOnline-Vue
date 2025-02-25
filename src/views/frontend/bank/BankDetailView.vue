<template>
  <div class="w-screen min-h-screen flex justify-center gap-[20px] mt-[20px] mb-[40px]">
    <div class="w-[840px]">
      <!-- 面包屑导航 -->
      <div class="text-sm text-gray-500 mb-4">
        <router-link to="/topics" class="hover:text-blue-500">题库</router-link>
        <span class="mx-2">/</span>
        <span class="text-gray-900">{{ bankDetail?.name }}</span>
      </div>

      <!-- 题库详情卡片 -->
      <div class="bg-white rounded-2xl p-6">
        <!-- 头部区域 -->
        <div class="flex items-start gap-6 mb-8">
          <!-- 图标 -->
          <div v-if="bankDetail?.iconUrl" class="w-16 h-16 rounded-lg">
            <img :src="bankDetail.iconUrl" :alt="bankDetail.name" class="w-full h-full object-cover rounded-lg"/>
          </div>
          <div v-else class="w-16 h-16 rounded-lg flex items-center justify-center"
               :class="{
                 'bg-blue-700': bankDetail?.iconCode === 'BAS',
                 'bg-green-700': bankDetail?.iconCode === 'HGH',
                 'bg-red-700': bankDetail?.iconCode === 'HOT',
                 'bg-yellow-700': bankDetail?.iconCode === 'OPT',
                 'bg-purple-700': bankDetail?.iconCode === 'AGG',
                 'bg-indigo-700': bankDetail?.iconCode === 'DES'
               }">
            <span class="text-xl font-bold text-white">{{ bankDetail?.iconCode }}</span>
          </div>

          <!-- 标题和描述 -->
          <div class="flex-1">
            <h1 class="text-2xl font-bold text-gray-900 mb-2">{{ bankDetail?.name }}</h1>
            <p class="text-gray-600">{{ bankDetail?.description }}</p>
          </div>
        </div>

        <!-- 概述内容 -->
        <div class="mb-8">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">题库概述</h2>
          <div class="bg-gray-50 rounded-lg p-6">
            <p class="text-gray-700 whitespace-pre-wrap">{{ bankDetail?.overview }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { getBankDetail } from '../../../api/frontend/bank.js';
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const bankDetail = ref(null);

const fetchBankDetail = async (bankId) => {
  try {
    const result = await getBankDetail(bankId);
    if (result.code === 200) {
      bankDetail.value = result.data;
    }
  } catch (error) {
    console.error('获取题库详情失败:', error);
  }
};

onMounted(() => {
  const bankId = route.params.id;
  fetchBankDetail(bankId);
});
</script>
