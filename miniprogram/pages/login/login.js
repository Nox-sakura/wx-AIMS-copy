// pages/login/login.js
const { api } = require('../../utils/api')
const { saveAuthInfo } = require('../../utils/storage')

// 订阅消息模板 ID（真实接入时替换为审核通过的模板ID）
const SUBSCRIBE_TMPL_IDS = [
  'TEMPLATE_ID_REPORT_PLACEHOLDER',
  'TEMPLATE_ID_NOTE_PLACEHOLDER',
  'TEMPLATE_ID_MED_PLACEHOLDER',
]

Page({
  data: {
    currentStep: 1,

    // Step 1
    phone: '',
    code: '',
    smsText: '获取验证码',
    smsDisabled: false,
    smsCountdown: 0,
    step1Valid: false,

    // Step 2
    patientId: '',
    loading: false,

    // 通用
    errorMsg: '',
  },

  // ── Step 1：手机号输入 ────────────────────────────

  onPhoneInput(e) {
    const phone = e.detail.value
    this.setData({ phone, errorMsg: '' })
    this._validateStep1(phone, this.data.code)
  },

  onCodeInput(e) {
    const code = e.detail.value
    this.setData({ code, errorMsg: '' })
    this._validateStep1(this.data.phone, code)
  },

  _validateStep1(phone, code) {
    const phoneValid = /^1[3-9]\d{9}$/.test(phone)
    const codeValid = code.length === 6
    this.setData({ step1Valid: phoneValid && codeValid })
  },

  // ── 发送验证码 ────────────────────────────────────

  async onSendSms() {
    const { phone, smsDisabled } = this.data
    if (smsDisabled) return

    if (!/^1[3-9]\d{9}$/.test(phone)) {
      this.setData({ errorMsg: '请输入正确的手机号' })
      return
    }

    this.setData({ smsDisabled: true, errorMsg: '' })

    try {
      const res = await api.sendSms(phone)
      if (res.success) {
        this._startCountdown(60)
        wx.showToast({ title: '验证码已发送', icon: 'success' })
      } else {
        this.setData({ errorMsg: res.message || '发送失败，请重试', smsDisabled: false })
      }
    } catch (e) {
      this.setData({ errorMsg: e.message || '网络异常，请重试', smsDisabled: false })
    }
  },

  _startCountdown(seconds) {
    this.setData({ smsCountdown: seconds, smsText: `${seconds}s 后重发` })
    this._countdownTimer = setInterval(() => {
      const remaining = this.data.smsCountdown - 1
      if (remaining <= 0) {
        clearInterval(this._countdownTimer)
        this.setData({ smsCountdown: 0, smsText: '重新获取', smsDisabled: false })
      } else {
        this.setData({ smsCountdown: remaining, smsText: `${remaining}s 后重发` })
      }
    }, 1000)
  },

  onUnload() {
    // 页面卸载时清理定时器
    if (this._countdownTimer) clearInterval(this._countdownTimer)
  },

  // ── Step 1 → Step 2 ──────────────────────────────

  onNextStep() {
    if (!this.data.step1Valid) return
    this.setData({ currentStep: 2, errorMsg: '' })
  },

  onBack() {
    this.setData({ currentStep: 1, errorMsg: '' })
  },

  // ── Step 2：患者ID输入 ────────────────────────────

  onPatientIdInput(e) {
    this.setData({ patientId: e.detail.value.trim(), errorMsg: '' })
  },

  // ── 完成绑定 ──────────────────────────────────────

  async onBind() {
    const { phone, code, patientId, loading } = this.data
    if (!patientId || loading) return

    this.setData({ loading: true, errorMsg: '' })

    try {
      const res = await api.bind(phone, code, patientId)

      if (!res.success) {
        this.setData({ errorMsg: res.message || '绑定失败，请检查患者ID', loading: false })
        return
      }

      // 保存登录态
      saveAuthInfo(res.data)

      // 写入全局状态
      const app = getApp()
      app.setAuthInfo(res.data)

      // 绑定成功后请求订阅消息授权
      // 此时机最自然：用户刚完成绑定，心理上处于高配合度状态
      this._requestSubscribeMessage()

    } catch (e) {
      this.setData({ errorMsg: e.message || '网络异常，请重试', loading: false })
    }
  },

  /**
   * 请求订阅消息授权
   * 必须在用户点击操作后同步调用，不得在页面加载时调用
   */
  _requestSubscribeMessage() {
    wx.requestSubscribeMessage({
      tmplIds: SUBSCRIBE_TMPL_IDS,
      success: (res) => {
        // 提交授权结果到后端（供推送时判断是否有权限）
        api.submitSubscribeResult(res).catch(() => {})
        // 无论是否授权均跳转首页
        this._navigateToHome()
      },
      fail: () => {
        // 用户拒绝授权，直接跳转，不阻断流程
        this._navigateToHome()
      },
    })
  },

  _navigateToHome() {
    this.setData({ loading: false })
    wx.switchTab({ url: '/pages/index/index' })
  },
})
