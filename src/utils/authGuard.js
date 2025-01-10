import { useAuthStore } from '../stores/auth'

// 创建需要登录的操作守卫
export const withAuth = (callback, { vm = null } = {}) => {
  return (...args) => {
    const authStore = useAuthStore()
    
    if (!authStore.isAuthenticated) {
      // 获取全局挂载的登录模态框组件
      const loginModal = vm?.$refs.loginModal || window.$loginModal
      if (loginModal) {
        loginModal.show()
        return
      }
    }
    
    return callback(...args)
  }
}
