import request from '../utils/request'

export const tagApi = {
  // 获取标签列表
  getList(params) {
    return request({
      url: '/api/tags',
      method: 'get',
      params
    })
  },

  // 创建标签
  create(data) {
    return request({
      url: '/api/tags',
      method: 'post',
      data
    })
  },

  // 更新标签
  update(id, data) {
    return request({
      url: `/api/tags/${id}`,
      method: 'put',
      data
    })
  },

  // 删除标签
  delete(id) {
    return request({
      url: `/api/tags/${id}`,
      method: 'delete'
    })
  },

  // 批量删除标签
  batchDelete(ids) {
    return request({
      url: '/api/tags/batch',
      method: 'delete',
      data: { ids }
    })
  }
}
