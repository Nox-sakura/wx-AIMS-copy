// components/grade-badge/grade-badge.js
Component({
  properties: {
    grade: {
      type: Number,
      value: 1,
    },
    size: {
      type: String,
      value: 'medium',   // 'small' | 'medium' | 'large'
    },
  },

  data: {
    labelMap: {
      1: 'Grade 1',
      2: 'Grade 2',
      3: 'Grade 3',
      4: 'Grade 4',
    },
  },
})
