// mock/reminders.js
// 用药/随访提醒 Mock 数据
// 注意：内容来自医生医嘱，不含模型数据

const reminders = [
  {
    id: 'RMD-001',
    type: 'medication',          // medication | followup | rest
    title: '黄体酮注射液',
    detail: '40mg 肌肉注射，每日两次（09:00 / 21:00）',
    startDate: '2026-03-20',
    endDate: '2026-04-10',
    times: ['09:00', '21:00'],
    active: true,
  },
  {
    id: 'RMD-002',
    type: 'followup',
    title: '门诊复查',
    detail: '请于 2026-10-02（周五）上午 09:00 前往生殖医学科门诊',
    startDate: '2026-10-02',
    endDate: '2026-10-02',
    times: ['09:00'],
    active: true,
  },
  {
    id: 'RMD-003',
    type: 'medication',
    title: '叶酸片',
    detail: '0.4mg 口服，每日一次（早餐后）',
    startDate: '2026-03-01',
    endDate: '2026-05-01',
    times: ['08:00'],
    active: true,
  },
  {
    id: 'RMD-004',
    type: 'rest',
    title: '休养提醒',
    detail: '取卵后一周内避免剧烈运动，注意观察OHSS症状（腹胀、尿少）',
    startDate: '2026-03-20',
    endDate: '2026-03-27',
    times: [],
    active: false,   // 已过期
  },
]

module.exports = { reminders }
