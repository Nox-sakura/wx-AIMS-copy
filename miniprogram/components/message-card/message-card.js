// components/message-card/message-card.js
Component({
  properties: {
    item: {
      type: Object,
      value: {},
    },
  },

  data: {
    iconMap: {
      report:   '🔬',
      note:     '📋',
      reminder: '💊',
    },
  },

  methods: {
    onTap() {
      // 触发父页面的点击事件，传递完整消息对象
      this.triggerEvent('tap', { item: this.properties.item })
    },
  },
})
