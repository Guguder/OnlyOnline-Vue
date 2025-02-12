import request from '../utils/request'

export const blog = {
    // 发布博客
    createPost(data) {
        return request({
            url: '/blog/post',
            method: 'post',
            data
        })
    },
    // 获取文章列表
    getPostList(params) {
        return request({
            url: '/blog/post/list',
            method: 'get',
            params
        })
    },
    // 获取帖子详情
    getPostDetail(id) {
        return request({
            url: `/blog/post/info/${id}`,
            method: 'get'
        })
    }
}
