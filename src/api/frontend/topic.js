import request from '../../utils/request.js'

export const topic = {
    // 获取题库题目列表
    getTopicListByBankId(bankId) {
        return request({
            url: `/topic/bank/${bankId}`,
            method: 'get'
        })
    },

    // 获取题目详情
    getTopicDetail(topicId) {
        return request({
            url: `/topic/info/${topicId}`,
            method: 'get'
        })
    },

    // 提交题目答案
    submitTopicAnswer(topicId, answer) {
        return request({
            url: `/topic/${topicId}/submit`,
            method: 'post',
            data: answer
        })
    },

    // 获取提交历史
    getSubmissionHistory(topicId) {
        return request({
            url: `/topic/${topicId}/submissions`,
            method: 'get'
        })
    }
}

// 移除其他可能的导出
