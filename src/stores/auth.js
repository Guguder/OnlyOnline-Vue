import { defineStore } from 'pinia'
import { auth } from '../api/auth'
import { message } from 'ant-design-vue'

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null,
        token: localStorage.getItem('token') || null,
        userInfo: null // 添加用户信息状态
    }),

    actions: {
        async login(credentials) {
            try {
                const response = await auth.login(credentials)
                if (response.code === 200) {
                    const token = response.data
                    this.token = token
                    localStorage.setItem('token', token)
                    // 登录成功后立即获取用户信息
                    await this.fetchUserInfo()
                    message.success('登录成功')
                    return response
                } else {
                    throw new Error(response.msg || '登录失败')
                }
            } catch (error) {
                message.error(error.message || '登录失败')
                throw error
            }
        },

        // 修改获取用户信息的方法
        async fetchUserInfo() {
            try {
                const response = await auth.getUserInfo()
                if (response.code === 200) { // 改为判断 200
                    this.userInfo = response.data
                    console.log('获取到的用户信息：', response.data) // 添加这行打印
                    return response.data
                } else {
                    throw new Error(response.msg || '获取用户信息失败')
                }
            } catch (error) {
                console.error('获取用户信息失败：', error) // 添加错误打印
                message.error(error.message || '获取用户信息失败')
                throw error
            }
        },

        // 新增初始化方法
        async initialize() {
            if (this.token) {
                try {
                    await this.fetchUserInfo()
                } catch (error) {
                    console.error('初始化时获取用户信息失败：', error)
                }
            }
        },

        // 更新登出方法，清除用户信息
        logout() {
            this.user = null
            this.token = null
            this.userInfo = null
            localStorage.removeItem('token')
        },
    },

    // 添加 getters
    getters: {
        isAuthenticated: (state) => !!state.token,
        getUserInfo: (state) => state.userInfo
    }
})
