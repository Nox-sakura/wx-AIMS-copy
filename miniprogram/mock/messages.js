// mock/messages.js
// 消息中心 Mock 数据 — 白艳丽治疗时间线
// type: 'report'（评估报告）| 'note'（医嘱）| 'reminder'（随访提醒）

const messages = [

  // ── 2026-09-26（最新） ─────────────────────────────

  {
    id: 'MSG-006',
    type: 'reminder',
    title: '随访提醒',
    summary: '本次胚胎评级已完成，请于 2026-10-02（周五）上午 9:00 返院复查，了解后续移植计划，请携带本次报告。',
    reportId: null,
    time: '2026-09-26 18:07',
    timestamp: 1790417220000,
    read: false,
  },

  {
    id: 'MSG-005',
    type: 'report',
    title: '您有一份新的评估报告',
    summary: '您的胚胎 D3 评级报告已生成，请进入「报告」页面查看详情。如有疑问请咨询智能助手或联系主治医生。',
    reportId: 'RPT-P001-001',
    time: '2026-09-26 18:05',
    timestamp: 1790417100000,
    read: false,
  },

  // ── 2026-03-31 ────────────────────────────────────

  {
    id: 'MSG-003',
    type: 'note',
    title: '医嘱通知',
    summary: '取卵完成，获卵5枚，已行常规IVF授精，胚胎培养中，D3评级结果待出。',
    reportId: null,
    time: '2026-03-31 08:00',
    timestamp: 1743379200000,
    read: true,
  },

  // ── 2026-03-28 ────────────────────────────────────

  {
    id: 'MSG-002',
    type: 'note',
    title: '医嘱通知',
    summary: '卵泡监测：优势卵泡5枚，卵泡直径达标，安排2026-03-31取卵。',
    reportId: null,
    time: '2026-03-28 09:00',
    timestamp: 1743123600000,
    read: true,
  },

  // ── 2026-03-17 ────────────────────────────────────

  {
    id: 'MSG-001',
    type: 'note',
    title: '医嘱通知',
    summary: '初次就诊，制定促排卵方案：拮抗剂方案，Gn 200IU/日起始，监测卵泡发育。',
    reportId: null,
    time: '2026-03-17 09:00',
    timestamp: 1742209200000,
    read: true,
  },

]

/**
 * 标记指定消息为已读
 */
function markMessageRead(messageId) {
  const msg = messages.find(m => m.id === messageId)
  if (msg) msg.read = true
}

module.exports = { messages, markMessageRead }
