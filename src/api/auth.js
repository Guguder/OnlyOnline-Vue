import request from '../utils/request'

export const auth = {
    // 用户注册
    register({ username, password, checkPassword }) {
        return request({
            url: '/user/account/register',
            method: 'post',
            data: {
                username,
                password,
                checkPassword
            }
        })
    },

    // 用户登录
    login({ username, password }) {
        return request({
            url: '/user/account/login',
            method: 'post',
            data: {
                username,
                password
            }
        })
    },

    // 获取用户信息
    getUserInfo() {
        return request({
            url: '/user/info',
            method: 'get'
        })
    }
}
