// utils/storage.js
// wx.Storage 统一封装 + 合规访问日志

const KEYS = {
  AUTH_INFO:   'authInfo',
  TOKEN:       'token',
  ACCESS_LOGS: 'accessLogs',
}

// ── 登录态 ────────────────────────────────────────────

/**
 * 读取本地缓存的绑定信息
 * @returns {object|null} authInfo 或 null
 */
function getAuthInfo() {
  return wx.getStorageSync(KEYS.AUTH_INFO) || null
}

/**
 * 保存绑定信息到本地缓存
 * @param {object} authInfo - { patientId, phone, patientName, token, bindTime }
 */
function saveAuthInfo(authInfo) {
  wx.setStorageSync(KEYS.AUTH_INFO, authInfo)
  wx.setStorageSync(KEYS.TOKEN, authInfo.token)
}

/**
 * 清除所有登录态（登出或解绑时调用）
 */
function clearAuth() {
  wx.removeStorageSync(KEYS.AUTH_INFO)
  wx.removeStorageSync(KEYS.TOKEN)
}

// ── 合规访问日志 ──────────────────────────────────────
// 合规要求：记录患者每次查看报告的时间、患者ID、报告ID

/**
 * 记录患者查看报告行为
 * 本地最多保留最近 100 条，防止 Storage 溢出
 * @param {string} reportId
 */
function logReportAccess(reportId) {
  const authInfo = getAuthInfo()
  const logs = wx.getStorageSync(KEYS.ACCESS_LOGS) || []

  logs.push({
    reportId,
    patientId: authInfo?.patientId || 'unknown',
    time: new Date().toISOString(),
  })

  // 只保留最近 100 条
  wx.setStorageSync(KEYS.ACCESS_LOGS, logs.slice(-100))
}

/**
 * 获取访问日志（供"我的"页面展示）
 * @returns {Array}
 */
function getAccessLogs() {
  return wx.getStorageSync(KEYS.ACCESS_LOGS) || []
}

module.exports = {
  getAuthInfo,
  saveAuthInfo,
  clearAuth,
  logReportAccess,
  getAccessLogs,
}
