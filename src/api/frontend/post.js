import request from '../../utils/request.js'

export const post = {
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
            url: `/blog/post/detail/${id}`,
            method: 'get'
        })
    },
    // 发送回复
    sendReply(data) {
        return request({
            url: '/reply',
            method: 'post',
            data
        })
    },
    // 获取评论列表
    getReplyList(params) {
        return request({
            url: '/reply/list',
            method: 'get',
            params: {
                type: 1,
                rootId: '',
                pageSize: 5,
                ...params
            }
        })
    },
    // 获取子评论列表
    getChildReplyList(replyId) {
        return request.get(`/reply/child/list?replyId=${replyId}`);
    },
    // 获取首页文章列表
    getHomePostList(params) {
        return request({
            url: '/blog/post/home/list',
            method: 'get',
            params
        })
    }
}
