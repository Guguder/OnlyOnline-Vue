import request from '@/utils/request'

export const tagApi = {
  // 获取标签列表
  getList(params) {
    return request({
      url: '/tags/list',
      method: 'get',
      params
    })
  },

  // 创建标签
  create(data) {
    return request({
      url: '/tags/',
      method: 'post',
      data
    })
  },

  // 更新标签
  update(data) {
    return request({
      url: '/tags/',
      method: 'put',
      data
    })
  },

  // 删除标签
  delete(id) {
    return request({
      url: `/tags/delete/${id}`,
      method: 'delete'
    })
  },

  // 批量删除标签
  batchDelete(ids) {
    return request({
      url: '/tags/batch-delete',
      method: 'delete',
      data: {ids}
    })
  },

  // 添加获取标签详情的方法
  getInfo: (id) => {
    return request({
      url: `/tags/info/${id}`,
      method: 'get'
    });
  }
}
