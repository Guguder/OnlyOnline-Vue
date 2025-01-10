<template>
  <div class="bg-white rounded-2xl p-6">
    <div class="text-center mb-6">
      <h2 class="text-xl font-bold text-gray-900">欢迎回来</h2>
      <p class="text-sm text-gray-500 mt-2">登录账号以获取完整功能</p>
    </div>
    
    <div class="flex flex-col gap-4">
      <a-button type="primary" class="h-10" block @click="showLoginModal">
        立即登录
      </a-button>
      <p class="text-xs text-gray-500 text-center">
        还没有账号？<a href="#" class="text-blue-500 hover:text-blue-600" @click.prevent="showLoginModal">立即注册</a>
      </p>
    </div>
  </div>
</template>

<script setup>
import { useLoginModal } from '../../stores/useLoginModal'

const { showLoginModal } = useLoginModal()
</script>
