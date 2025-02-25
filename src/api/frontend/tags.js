import request from '../../utils/request.js'

export const tags = {
    // 获取所有标签列表
    getTagsList() {
        return request({
            url: '/tags/all/list',
            method: 'get'
        })
    }
}
