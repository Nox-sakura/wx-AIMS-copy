// pages/reports/detail.js
const { api } = require('../../utils/api')
const { logReportAccess } = require('../../utils/storage')

Page({
  data: {
    report: null,
    positiveConcepts: [],
    negativeConcepts: [],
    loading: true,
  },

  onLoad(options) {
    const { id } = options
    if (id) {
      this._loadReport(id)
    } else {
      this.setData({ loading: false })
    }
  },

  async _loadReport(id) {
    this.setData({ loading: true })
    try {
      const res = await api.getReportById(id)
      if (res.success && res.data) {
        const report = res.data

        // 拆分正向/负向概念
        const positiveConcepts = report.concepts.filter(c => c.direction === 'pos')
        const negativeConcepts = report.concepts.filter(c => c.direction === 'neg')

        this.setData({ report, positiveConcepts, negativeConcepts })

        // 合规要求：记录患者访问行为
        logReportAccess(id)

        // 同时上报到后端（不阻断页面加载）
        api.logAccess(id).catch(() => {})

        // 动态设置导航栏标题
        wx.setNavigationBarTitle({
          title: `${report.gradeLabel} · ${report.assessDate}`,
        })
      } else {
        this.setData({ report: null })
      }
    } catch (e) {
      wx.showToast({ title: '加载失败，请重试', icon: 'none' })
    } finally {
      this.setData({ loading: false })
    }
  },

  onGoAssistant() {
    wx.switchTab({ url: '/pages/assistant/assistant' })
  },
})
