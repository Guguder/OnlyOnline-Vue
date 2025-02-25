import request from '../../utils/request.js'

export const user = {
    // 更新用户信息
    updateUserInfo(data) {
        return request({
            url: '/user/info/update',  // 修改为正确的接口路径
            method: 'put',
            data
        })
    }
}
