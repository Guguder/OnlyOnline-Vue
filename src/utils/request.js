import axios from 'axios'
import { message } from 'ant-design-vue'

const request = axios.create({
    baseURL: '/api',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json'
    }
})

// 请求拦截器
request.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token')
        if (token) {
            // 使用 Bearer 认证方案
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

// 响应拦截器
request.interceptors.response.use(
    (response) => {
        // 直接返回响应数据
        const { code, data, msg } = response.data
        // 修改判断逻辑，包含0和200两种成功状态码
        if (code === 0 || code === 200) {
            return { code, data, msg }
        } else {
            // 非 200 状态码处理
            message.error(msg || '请求失败')
            return Promise.reject(new Error(msg || '请求失败'))
        }
    },
    (error) => {
        message.error(error.response?.data?.msg || '请求失败')
        return Promise.reject(error)
    }
)

export default request
