// utils/api.js
// 统一网络请求封装
// 切换 USE_MOCK 为 false 即可接入真实后端，无需修改业务代码

const USE_MOCK = true
const BASE_URL = 'https://your-hospital-api.com'  // 预留真实接入点

const { getMockResponse } = require('../mock/router')

/**
 * 统一请求函数
 * @param {string} method - 'GET' | 'POST'
 * @param {string} path   - 接口路径，如 '/api/auth/bind'
 * @param {object} data   - 请求体或查询参数
 * @returns {Promise<object>}
 */
function request(method, path, data = {}) {
  if (USE_MOCK) {
    return getMockResponse(path, data)
  }

  const token = wx.getStorageSync('token') || ''

  return new Promise((resolve, reject) => {
    wx.request({
      url: BASE_URL + path,
      method,
      data,
      header: {
        'Authorization': token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json',
      },
      success(res) {
        if (res.statusCode === 200) {
          resolve(res.data)
        } else if (res.statusCode === 401) {
          // Token 失效，清除登录态跳回登录页
          wx.removeStorageSync('authInfo')
          wx.removeStorageSync('token')
          wx.reLaunch({ url: '/pages/login/login' })
          reject(new Error('登录已过期，请重新登录'))
        } else {
          reject(new Error(res.data?.message || `请求失败 (${res.statusCode})`))
        }
      },
      fail(err) {
        reject(new Error('网络连接失败，请检查网络设置'))
      },
    })
  })
}

/**
 * API 端点集合
 * 所有业务代码通过此对象调用，禁止直接使用 wx.request
 */
const api = {
  // ── 身份验证 ──────────────────────────────────────
  /** 发送手机验证码 */
  sendSms: (phone) =>
    request('POST', '/api/auth/sms', { phone }),

  /** 验证手机号+验证码，绑定患者ID */
  bind: (phone, code, patientId) =>
    request('POST', '/api/auth/bind', { phone, code, patientId }),

  // ── 消息中心 ──────────────────────────────────────
  /** 拉取消息列表（倒序，含已读/未读状态） */
  getMessages: () =>
    request('GET', '/api/patient/messages'),

  /** 标记消息为已读 */
  markRead: (messageId) =>
    request('POST', `/api/patient/messages/${messageId}/read`),

  // ── 报告 ──────────────────────────────────────────
  /** 拉取报告列表（倒序） */
  getReports: (patientId) =>
    request('GET', '/api/patient/reports', { patientId }),

  /** 拉取单份报告详情（脱敏） */
  getReportById: (id) =>
    request('GET', `/api/patient/reports/${id}`),

  // ── 合规日志 ──────────────────────────────────────
  /** 记录患者查看报告行为（合规要求） */
  logAccess: (reportId) =>
    request('POST', '/api/log/access', { reportId }),

  // ── 推送 ──────────────────────────────────────────
  /** 提交订阅消息授权结果 */
  submitSubscribeResult: (subscribeResult) =>
    request('POST', '/api/notify/subscribe', { subscribeResult }),

  // ── 助手 ──────────────────────────────────────────
  /** 获取预设快捷问题列表 */
  getQuestions: () =>
    request('GET', '/api/assistant/questions'),

  /** 预设QA查询 */
  askPreset: (question) =>
    request('POST', '/api/assistant/preset', { question }),

  /** 自由对话（Mock阶段用fallback，真实接入时对接AI接口） */
  chat: (message, history) =>
    request('POST', '/api/assistant/chat', { message, history }),

  // ── 提醒 ──────────────────────────────────────────
  /** 获取用药/随访提醒列表 */
  getReminders: () =>
    request('GET', '/api/patient/reminders'),
}

module.exports = { api }
