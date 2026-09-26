// mock/router.js
// Mock 路由分发器，根据 path 返回对应 Mock 数据

const { mockAuth } = require('./auth')
const { messages } = require('./messages')
const { reports }  = require('./reports')
const { presetQA, fallbackAnswer } = require('./chatbot')
const { reminders } = require('./reminders')

/**
 * 根据请求路径路由到对应 Mock 处理函数
 * 返回 Promise，模拟真实网络延迟（300–600ms）
 */
function getMockResponse(path, data) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        const result = dispatch(path, data)
        resolve(result)
      } catch (e) {
        reject(new Error(e.message || 'Mock 数据错误'))
      }
    }, 400)
  })
}

function dispatch(path, data) {
  // 身份验证
  if (path === '/api/auth/sms')  return mockAuth.sendSms(data.phone)
  if (path === '/api/auth/bind') return mockAuth.bind(data.phone, data.code, data.patientId)

  // 消息中心
  if (path === '/api/patient/messages') {
    // 只返回当前登录患者的消息（Mock 阶段返回全部）
    return { success: true, data: messages }
  }

  // 报告
  if (path === '/api/patient/reports') {
    // 根据 data.patientId 过滤（Mock阶段接收patientId参数）
    const filtered = data.patientId
      ? reports.filter(r => r.patientId === data.patientId)
      : reports
    return { success: true, data: filtered }
  }

  if (path.startsWith('/api/patient/reports/')) {
    const id = path.replace('/api/patient/reports/', '')
    const report = reports.find(r => r.id === id)
    if (!report) return { success: false, message: '报告不存在' }
    return { success: true, data: report }
  }

  // 日志（写入即成功）
  if (path === '/api/log/access') return { success: true }
  if (path === '/api/notify/subscribe') return { success: true }
  // 标记消息已读，真正修改内存中的 messages 状态以确保 onShow 刷新时数据同步
  if (path.includes('/read')) {
    const { markMessageRead } = require('./messages')
    const parts = path.split('/')
    const msgId = parts[parts.length - 2]  // 取倒数第二段
    markMessageRead(msgId)
    return { success: true }
  }

  // 助手：获取预设问题列表
  if (path === '/api/assistant/questions') {
    return { success: true, data: Object.keys(presetQA) }
  }

  // 助手：预设QA查询
  if (path === '/api/assistant/preset') {
    const answer = presetQA[data.question] ?? fallbackAnswer
    return { success: true, data: { answer, isPreset: !!presetQA[data.question] } }
  }

  // 助手：自由对话（Mock阶段用fallback兜底，真实接入时替换为AI接口）
  if (path === '/api/assistant/chat') {
    const answer = presetQA[data.message] ?? fallbackAnswer
    return { success: true, data: { answer } }
  }

  // 用药提醒列表
  if (path === '/api/patient/reminders') {
    return { success: true, data: reminders }
  }

  throw new Error(`未找到 Mock 路由：${path}`)
}

module.exports = { getMockResponse }
