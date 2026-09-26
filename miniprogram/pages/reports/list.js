// pages/reports/list.js
const { api } = require('../../utils/api')

Page({
  data: {
    reports: [],
    loading: true,
  },

  onLoad() {
    this._loadReports()
  },

  onShow() {
    this._loadReports()
    // 同步自定义 TabBar 选中状态
    const tabBar = this.getTabBar()
    if (tabBar) tabBar.setData({ selected: 1 })
  },

  async _loadReports() {
    this.setData({ loading: true })
    try {
      const app = getApp()
      const patientId = app.globalData.patientId
      const res = await api.getReports(patientId)
      if (res.success) {
        // 按评估日期倒序
        const reports = (res.data || []).sort(
          (a, b) => new Date(b.assessDate) - new Date(a.assessDate)
        )
        this.setData({ reports })
      }
    } catch (e) {
      wx.showToast({ title: '加载失败，请重试', icon: 'none' })
    } finally {
      this.setData({ loading: false })
    }
  },

  onReportTap(e) {
    const { id } = e.currentTarget.dataset
    wx.navigateTo({
      url: `/pages/reports/detail?id=${id}`,
    })
  },
})
