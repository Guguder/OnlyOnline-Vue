import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const isAuthenticated = ref(false)
  const user = ref(null)
  const token = ref(localStorage.getItem('token'))

  // 登录方法
  const login = async (credentials) => {
    try {
      // TODO: 实现实际的登录API调用
      console.log('Login with:', credentials)
      // 模拟登录成功
      const response = {
        token: 'fake-token',
        user: {
          id: 1,
          username: credentials.username
        }
      }
      
      setAuthData(response)
      return response
    } catch (error) {
      console.error('Login failed:', error)
      throw error
    }
  }

  // 注册方法
  const register = async (userData) => {
    try {
      // TODO: 实现实际的注册API调用
      console.log('Register with:', userData)
      // 模拟注册成功
      const response = {
        token: 'fake-token',
        user: {
          id: 1,
          username: userData.username
        }
      }
      
      setAuthData(response)
      return response
    } catch (error) {
      console.error('Registration failed:', error)
      throw error
    }
  }

  // 登出方法
  const logout = () => {
    localStorage.removeItem('token')
    isAuthenticated.value = false
    user.value = null
    token.value = null
  }

  // 设置认证数据
  const setAuthData = (data) => {
    token.value = data.token
    user.value = data.user
    isAuthenticated.value = true
    localStorage.setItem('token', data.token)
  }

  return {
    isAuthenticated,
    user,
    token,
    login,
    register,
    logout,
    setAuthData
  }
})
