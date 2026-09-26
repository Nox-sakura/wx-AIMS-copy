// app.js
// 全局应用入口，负责登录态检查与全局数据维护

const { getAuthInfo, clearAuth } = require('./utils/storage')

App({
  globalData: {
    patientId: null,      // 绑定成功后写入，格式如 "P20240001"
    openId: null,         // 微信 openId（真实接入后由后端返回）
    phone: null,          // 脱敏手机号，格式 "138****8888"
    patientName: null,    // 脱敏姓名，格式 "李**"
    isLoggedIn: false,
    token: null,
  },

  onLaunch() {
    this._checkLoginStatus()
  },

  /**
   * 检查本地缓存的登录态
   * 已绑定 → 写入 globalData，跳转首页
   * 未绑定 → 停留登录页（entryPagePath 已设为 login）
   */
  _checkLoginStatus() {
    const authInfo = getAuthInfo()
    if (authInfo && authInfo.patientId && authInfo.token) {
      this.globalData.patientId   = authInfo.patientId
      this.globalData.phone       = authInfo.phone
      this.globalData.patientName = authInfo.patientName
      this.globalData.token       = authInfo.token
      this.globalData.isLoggedIn  = true

      // 已登录则直接跳转消息首页
      wx.switchTab({ url: '/pages/index/index' })
    }
    // 未登录：entryPagePath 已指向 login，无需额外跳转
  },

  /**
   * 供登录页绑定成功后调用，写入全局状态
   * @param {object} authInfo - { patientId, phone, patientName, token, bindTime }
   */
  setAuthInfo(authInfo) {
    this.globalData.patientId   = authInfo.patientId
    this.globalData.phone       = authInfo.phone
    this.globalData.patientName = authInfo.patientName
    this.globalData.token       = authInfo.token
    this.globalData.isLoggedIn  = true
  },

  /**
   * 登出，清除全局状态与本地缓存
   */
  logout() {
    this.globalData.patientId   = null
    this.globalData.phone       = null
    this.globalData.patientName = null
    this.globalData.token       = null
    this.globalData.isLoggedIn  = false
    clearAuth()
  },
})
