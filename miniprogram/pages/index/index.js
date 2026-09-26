// pages/index/index.js
const { api } = require('../../utils/api')

Page({
  data: {
    messages: [],
    unreadCount: 0,
    loading: true,
  },

  onLoad() {
    this._loadMessages()
  },

  onShow() {
    // 每次切换到首页时刷新（确保从详情页返回后未读状态已同步）
    this._loadMessages()
    // 同步自定义 TabBar 选中状态
    const tabBar = this.getTabBar()
    if (tabBar) tabBar.setData({ selected: 0, unreadCount: this.data.unreadCount })
  },

  async _loadMessages() {
    this.setData({ loading: true })
    try {
      const res = await api.getMessages()
      if (res.success) {
        const messages = res.data || []
        // 按时间戳倒序排列
        messages.sort((a, b) => b.timestamp - a.timestamp)
        const unreadCount = messages.filter(m => !m.read).length
        this.setData({ messages, unreadCount })
        // 更新原生 TabBar 角标（兼容）
        if (unreadCount > 0) {
          wx.setTabBarBadge({ index: 0, text: String(unreadCount) })
        } else {
          wx.removeTabBarBadge({ index: 0 })
        }
        // 同步自定义 TabBar 未读数
        const tabBar = this.getTabBar()
        if (tabBar) tabBar.setData({ unreadCount })
      }
    } catch (e) {
      wx.showToast({ title: '加载失败，请重试', icon: 'none' })
    } finally {
      this.setData({ loading: false })
    }
  },

  // 点击消息卡片
  async onMessageTap(e) {
    const { item } = e.detail

    // 标记已读（不等待结果，乐观更新）
    if (!item.read) {
      this._markRead(item.id)
    }

    // 根据消息类型跳转
    if (item.type === 'report' && item.reportId) {
      wx.navigateTo({
        url: `/pages/reports/detail?id=${item.reportId}`,
      })
    } else {
      // 医嘱和提醒：展示详情 Toast（第五阶段完善）
      wx.showModal({
        title: item.title,
        content: item.summary,
        showCancel: false,
        confirmText: '知道了',
      })
    }
  },

  // 标记全部已读
  async onMarkAllRead() {
    const { messages } = this.data
    const unread = messages.filter(m => !m.read)
    if (unread.length === 0) return

    // 乐观更新 UI
    const updated = messages.map(m => ({ ...m, read: true }))
    this.setData({ messages: updated, unreadCount: 0 })
    wx.removeTabBarBadge({ index: 0 })

    // 调用接口（Mock阶段直接成功）
    for (const msg of unread) {
      api.markRead(msg.id).catch(() => {})
    }
  },

  // 标记单条已读（本地更新）
  _markRead(messageId) {
    const messages = this.data.messages.map(m =>
      m.id === messageId ? { ...m, read: true } : m
    )
    const unreadCount = messages.filter(m => !m.read).length
    this.setData({ messages, unreadCount })

    if (unreadCount > 0) {
      wx.setTabBarBadge({ index: 0, text: String(unreadCount) })
    } else {
      wx.removeTabBarBadge({ index: 0 })
    }

    api.markRead(messageId).catch(() => {})
  },
})
