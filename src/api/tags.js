import request from '../utils/request'

export const tags = {
    // 获取所有标签列表
    getTagsList() {
        return request({
            url: '/tags/list',
            method: 'get'
        })
    }
}
