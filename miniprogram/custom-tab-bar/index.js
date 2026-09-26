// custom-tab-bar/index.js
Component({
  data: {
    selected: 0,
    unreadCount: 0,
    tabs: [
      { label: '消息', icon: '💬', path: '/pages/index/index'           },
      { label: '报告', icon: '📋', path: '/pages/reports/list'          },
      { label: '小芽', icon: '🌱', path: '/pages/assistant/assistant'   },
      { label: '我的', icon: '👤', path: '/pages/profile/profile'       },
    ],
  },

  methods: {
    onTabTap(e) {
      const { index, path } = e.currentTarget.dataset
      if (index === this.data.selected) return
      this.setData({ selected: index })
      wx.switchTab({ url: path })
    },

    // 供各页面在 onShow 时调用，同步选中状态与未读数
    // 用法：在每个 Tab 页的 onShow 中调用：
    //   const tabBar = this.getTabBar()
    //   if (tabBar) tabBar.setData({ selected: N, unreadCount: X })
  },
})
