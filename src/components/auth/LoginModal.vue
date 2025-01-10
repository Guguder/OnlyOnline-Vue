<template>
  <n-modal
    v-model:show="isVisible"
    :mask-closable="false"
    preset="dialog"
    style="width: 400px"
    :show-icon="false"
  >
    <div class="p-4">
      <!-- 标题区域 -->
      <div class="text-center mb-6">
        <h2 class="text-2xl font-bold">{{ isLogin ? '欢迎回来' : '创建账号' }}</h2>
        <p class="text-gray-500 mt-2">{{ isLogin ? '登录你的账号继续' : '快速注册开始体验' }}</p>
      </div>

      <!-- 表单区域 -->
      <n-form
        ref="formRef"
        :model="formData"
        @submit.prevent="handleSubmit"
      >
        <n-form-item
          label="用户名"
          path="username"
          :rule="{
            required: true,
            message: '请输入用户名'
          }"
        >
          <n-input
            v-model:value="formData.username"
            placeholder="请输入用户名"
          >
            <template #prefix>
              <User class="h-5 w-5 text-gray-400" />
            </template>
          </n-input>
        </n-form-item>

        <n-form-item
          label="密码"
          path="password"
          :rule="{
            required: true,
            message: '请输入密码'
          }"
        >
          <n-input
            v-model:value="formData.password"
            type="password"
            placeholder="请输入密码"
          >
            <template #prefix>
              <Lock class="h-5 w-5 text-gray-400" />
            </template>
          </n-input>
        </n-form-item>

        <n-form-item
          v-if="!isLogin"
          label="确认密码"
          path="confirmPassword"
          :rule="{
            required: true,
            validator: validateConfirmPassword,
            message: '两次输入的密码不一致'
          }"
        >
          <n-input
            v-model:value="formData.confirmPassword"
            type="password"
            placeholder="请确认密码"
          >
            <template #prefix>
              <Lock class="h-5 w-5 text-gray-400" />
            </template>
          </n-input>
        </n-form-item>

        <div class="mt-6">
          <n-button
            type="primary"
            block
            :loading="loading"
            @click="handleSubmit"
          >
            {{ isLogin ? '登录' : '注册' }}
          </n-button>
        </div>
      </n-form>

      <!-- 切换登录/注册 -->
      <div class="text-center mt-4">
        <n-button
          text
          @click="toggleMode"
        >
          {{ isLogin ? '还没有账号？点击注册' : '已有账号？点击登录' }}
        </n-button>
      </div>
    </div>
  </n-modal>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { User, Lock } from 'lucide-vue-next'
import { useAuthStore } from '../../stores/auth'
import { useLoginModalStore } from '../../stores/useLoginModal'

const loginModalStore = useLoginModalStore()
const authStore = useAuthStore()
const isVisible = computed({
  get: () => loginModalStore.isVisible,
  set: (value) => {
    if (!value) loginModalStore.hide()
  }
})
const isLogin = ref(true)
const loading = ref(false)

const formData = reactive({
  username: '',
  password: '',
  confirmPassword: ''
})

// 验证确认密码
const validateConfirmPassword = async (rule, value) => {
  if (value !== formData.password) {
    throw new Error('两次输入的密码不一致')
  }
}

// 切换登录/注册模式
const toggleMode = () => {
  isLogin.value = !isLogin.value
  formData.username = ''
  formData.password = ''
  formData.confirmPassword = ''
}

// 处理表单提交
const handleSubmit = async (values) => {
  loading.value = true
  try {
    if (isLogin.value) {
      await authStore.login(values)
    } else {
      await authStore.register(values)
    }
    loginModalStore.hide()
  } catch (error) {
    console.error('Authentication error:', error)
  } finally {
    loading.value = false
  }
}

// 取消处理
const handleCancel = () => {
  loginModalStore.hide()
}
</script>
