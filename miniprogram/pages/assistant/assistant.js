// pages/assistant/assistant.js
const { api } = require('../../utils/api')

let msgIdCounter = 0
function genId() { return `msg_${++msgIdCounter}` }

Page({
  data: {
    questions: [],          // 快捷问题列表
    messages: [],           // 对话记录 [{ id, role: 'user'|'bot', text }]
    inputText: '',
    isTyping: false,
    showQuickButtons: true, // 仅在初始状态或最后一条是bot消息时显示
    scrollTop: 0,
  },

  onLoad() {
    this._loadQuestions()
  },

  onShow() {
    // 同步自定义 TabBar 选中状态
    const tabBar = this.getTabBar()
    if (tabBar) tabBar.setData({ selected: 2 })
  },

  // ── 加载预设问题 ──────────────────────────────────

  async _loadQuestions() {
    try {
      const res = await api.getQuestions()
      if (res.success) {
        this.setData({ questions: res.data || [] })
      }
    } catch (e) {
      // 静默失败，快捷问题区留空即可
    }
  },

  // ── 点击快捷问题 ──────────────────────────────────

  onQuickTap(e) {
    const question = e.currentTarget.dataset.question
    if (!question || this.data.isTyping) return
    this._sendMessage(question)
  },

  // ── 自由输入 ──────────────────────────────────────

  onInput(e) {
    this.setData({ inputText: e.detail.value })
  },

  onSend() {
    const text = this.data.inputText.trim()
    if (!text || this.data.isTyping) return
    this.setData({ inputText: '' })
    this._sendMessage(text)
  },

  _scrollToBottom() {
    this.setData({ scrollTop: this.data.scrollTop + 100000 })
  },

  // ── 核心：发送消息并获取回答 ──────────────────────

  async _sendMessage(text) {
    // 1. 追加用户消息到列表
    const userMsg = { id: genId(), role: 'user', text }
    const messages = [...this.data.messages, userMsg]
    this.setData({
      messages,
      isTyping: true,
      showQuickButtons: false,  // 对话开始后隐藏快捷问题
    }, () => this._scrollToBottom())

    try {
      // 2. 调用接口（先尝试预设QA，不匹配时走自由对话）
      const res = await api.askPreset(text)
      const answerText = res.success
        ? res.data.answer
        : '抱歉，暂时无法回答您的问题，请稍后再试或咨询主治医师。'

      // 3. 追加助手回答
      const botMsg = { id: genId(), role: 'bot', text: answerText }
      this.setData({
        messages: [...this.data.messages, botMsg],
        isTyping: false,
        showQuickButtons: true,  // 助手回答后重新显示快捷问题
      }, () => this._scrollToBottom())
    } catch (e) {
      const errMsg = { id: genId(), role: 'bot', text: '网络异常，请检查网络连接后重试。' }
      this.setData({
        messages: [...this.data.messages, errMsg],
        isTyping: false,
        showQuickButtons: true,
      }, () => this._scrollToBottom())
    }
  },
})
