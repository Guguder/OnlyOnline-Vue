import request from '../utils/request'

export const blog = {
    // 发布博客
    createPost(data) {
        return request({
            url: '/blog/post',
            method: 'post',
            data
        })
    }
}
