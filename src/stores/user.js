import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useUserStore = defineStore('user', () => {
  const isLogin = ref(false)
  const userInfo = ref(null)

  // 设置登录状态
  const setLoginState = (state) => {
    isLogin.value = state
  }

  // 设置用户信息
  const setUserInfo = (info) => {
    userInfo.value = info
  }

  return {
    isLogin,
    userInfo,
    setLoginState,
    setUserInfo
  }
})
