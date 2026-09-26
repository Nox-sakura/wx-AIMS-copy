// pages/profile/profile.js
const { api } = require('../../utils/api')
const { getAuthInfo, clearAuth, getAccessLogs } = require('../../utils/storage')

Page({
  data: {
    patientId: '',
    patientName: '',
    phone: '',
    reminders: [],
    accessLogs: [],
    accessLogCount: 0,
    showLogs: false,
  },

  onLoad() {
    this._loadProfile()
    this._loadReminders()
    this._loadAccessLogs()
  },

  onShow() {
    // 每次进入刷新访问日志数量
    this._loadAccessLogs()
    // 同步自定义 TabBar 选中状态
    const tabBar = this.getTabBar()
    if (tabBar) tabBar.setData({ selected: 3 })
  },

  // ── 读取绑定信息 ──────────────────────────────────

  _loadProfile() {
    // 优先从 globalData 读取，回退到 Storage
    const app = getApp()
    const gd = app.globalData

    if (gd.isLoggedIn) {
      this.setData({
        patientId:   gd.patientId   || '',
        patientName: gd.patientName || '患者',
        phone:       gd.phone       || '',
      })
    } else {
      const authInfo = getAuthInfo()
      if (authInfo) {
        this.setData({
          patientId:   authInfo.patientId   || '',
          patientName: authInfo.patientName || '患者',
          phone:       authInfo.phone       || '',
        })
      }
    }
  },

  // ── 用药提醒 ──────────────────────────────────────

  async _loadReminders() {
    try {
      const res = await api.getReminders()
      if (res.success) {
        this.setData({ reminders: res.data || [] })
      }
    } catch (e) {
      // 静默失败
    }
  },

  // ── 访问日志（本地存储，合规用途） ───────────────

  _loadAccessLogs() {
    const logs = getAccessLogs()
    // 倒序（最新在前），格式化时间显示
    const formatted = [...logs].reverse().map(log => ({
      ...log,
      time: log.time
        ? new Date(log.time).toLocaleString('zh-CN', {
            year: 'numeric', month: '2-digit', day: '2-digit',
            hour: '2-digit', minute: '2-digit', hour12: false,
          }).replace(/\//g, '-')
        : '未知时间',
    }))
    this.setData({
      accessLogs: formatted,
      accessLogCount: formatted.length,
    })
  },

  // ── 菜单点击 ──────────────────────────────────────

  onViewAccessLogs() {
    this.setData({ showLogs: true })
  },

  onCloseLog() {
    this.setData({ showLogs: false })
  },

  onOpenNotifySettings() {
    // 跳转系统通知设置（微信不支持直接跳转，引导用户手动操作）
    wx.showModal({
      title: '消息通知设置',
      content: '请前往手机「设置 > 通知」，找到本小程序并开启通知权限，以确保及时收到评估报告推送。',
      showCancel: false,
      confirmText: '知道了',
    })
  },

  onViewPrivacy() {
    wx.showModal({
      title: '隐私说明',
      content: '您的报告数据存储于辽宁妇婴医院自有服务器，不经微信服务器保存。本小程序不收集您的位置信息，仅使用手机号用于身份验证。如有疑问，请联系医院信息科。',
      showCancel: false,
      confirmText: '我知道了',
    })
  },

  onContact() {
    // 微信客服功能（需在小程序后台配置客服）
  },

  // ── 解除绑定 ──────────────────────────────────────

  onUnbind() {
    wx.showModal({
      title: '解除绑定',
      content: '解绑后将清除本设备的登录状态，需重新验证手机号和患者ID才能查看报告。确认解绑？',
      confirmText: '确认解绑',
      confirmColor: '#E74C3C',
      cancelText: '取消',
      success: (res) => {
        if (res.confirm) {
          // 清除登录态
          const app = getApp()
          app.logout()
          clearAuth()

          // 跳回登录页
          wx.reLaunch({ url: '/pages/login/login' })
        }
      },
    })
  },
})
