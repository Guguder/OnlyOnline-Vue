import request from '@/utils/request'

export const postApi = {
  // 获取帖子列表
  getList(params) {
    return request({
      url: '/blog/post/list',
      method: 'get',
      params
    })
  },

  // 删除帖子
  delete(id) {
    return request({
      url: `/blog/post/${id}`,
      method: 'delete'
    })
  },

  // 批量删除帖子
  batchDelete(ids) {
    return request({
      url: '/blog/post/batch',
      method: 'delete',
      data: ids
    })
  },

  // 获取帖子详情
  getInfo(id) {
    return request({
      url: `/blog/post/info/${id}`,
      method: 'get'
    })
  }
}
