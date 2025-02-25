import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { auth } from '../api/frontend/auth.js'
import { message } from 'ant-design-vue'

export const useAuthStore = defineStore('auth', () => {
  const isAuthenticated = ref(false)
  const userInfo = ref(null) // 现在 userInfo 将包含 role 字段
  const loading = ref(true)  // 添加 loading 状态
  const error = ref(null)    // 添加 error 状态
  const initialized = ref(false)  // 添加初始化标志

  // 初始化检查登录状态
  const checkAuthStatus = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await fetch('/api/auth/status') // 替换为实际的API端点
      if (!response.ok) throw new Error('Auth check failed')
      const data = await response.json()
      isAuthenticated.value = data.isAuthenticated
      userInfo.value = data.userInfo
    } catch (err) {
      error.value = err.message
      isAuthenticated.value = false
      userInfo.value = null
    } finally {
      loading.value = false
    }
  }

  // 登录方法
  const login = async (credentials) => {
    loading.value = true
    error.value = null
    try {
      const response = await auth.login(credentials)
      if (response.code === 200) {
        const token = response.data
        localStorage.setItem('token', token)
        await fetchUserInfo()
        isAuthenticated.value = true  // 确保设置登录状态
        message.success('登录成功')
        return response
      } else {
        throw new Error(response.msg || '登录失败')
      }
    } catch (err) {
      error.value = err.message
      isAuthenticated.value = false
      message.error(err.message || '登录失败')
      throw err
    } finally {
      loading.value = false
    }
  }

  // 获取用户信息方法
  const fetchUserInfo = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await auth.getUserInfo()
      if (response.code === 200) {
        userInfo.value = response.data
        isAuthenticated.value = true  // 如果成功获取用户信息，设置登录状态
        console.log('获取到的用户信息：', response.data)
        return response.data
      } else {
        throw new Error(response.msg || '获取用户信息失败')
      }
    } catch (err) {
      error.value = err.message
      isAuthenticated.value = false
      userInfo.value = null
      console.error('获取用户信息失败：', err)
      message.error(err.message || '获取用户信息失败')
      throw err
    } finally {
      loading.value = false
    }
  }

  // 修改初始化方法
  const initialize = async () => {
    if (initialized.value) return // 如果已经初始化过，直接返回
    
    if (localStorage.getItem('token')) {
      try {
        await fetchUserInfo()
        isAuthenticated.value = true  // 初始化成功后设置登录状态
      } catch (err) {
        console.error('初始化时获取用户信息失败：', err)
        isAuthenticated.value = false
        localStorage.removeItem('token') // 如果获取用户信息失败，清除 token
      }
    } else {
      isAuthenticated.value = false
    }
    
    initialized.value = true  // 标记初始化完成
  }

  // 登出方法
  const logout = () => {
    isAuthenticated.value = false
    userInfo.value = null
    error.value = null
    localStorage.removeItem('token')
  }

  // 清除错误状态
  const clearError = () => {
    error.value = null
  }

  // 添加判断是否为管理员的 getter
  const isAdmin = computed(() => userInfo.value?.role === 0)

  return {
    isAuthenticated,
    userInfo,
    loading,
    error,
    login,
    logout,
    checkAuthStatus,
    clearError,
    initialize,
    isAdmin,
    initialized,  // 导出初始化状态
  }
})
