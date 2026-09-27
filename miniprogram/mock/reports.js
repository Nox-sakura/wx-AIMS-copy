// mock/reports.js
// 报告 Mock 数据（患者端脱敏版本）
// 所有字段均经过脱敏处理，禁止出现模型置信度数值与技术参数

const reports = [
  {
    id: 'RPT-P001-001',
    patientId: 'P20240001',
    embryoNo: 'E-01-A',
    grade: 2,                         // 数字 1–4，用于 grade-badge 组件
    gradeLabel: '二级胚胎',
    gradeDesc: '胚胎整体形态良好，卵裂球大小轻度不均一，碎片化比例约14%，在可接受范围内。发育速率基本符合 D3 时序，建议作为备选移植胚胎。',
    assessDate: '2026-09-26',
    assessTime: '18:05',
    doctor: '李医生',                 // 不展示完整职称，仅展示姓氏+职业称谓
    status: 'approved',               // approved（已终审）| pending（审核中）
    read: false,

    // 关键指标
    keyPoints: [
      { label: '细胞均一性', value: '轻度不均一' },
      { label: '发育速率',   value: '基本符合 D3 时序' },
      { label: '碎片化比例', value: '14%' },
      { label: '综合建议',   value: '备选移植胚胎' },
    ],

    // 形态学指标展示
    concepts: [
      { nameEn: 'symmetrical blastomeres',      nameCn: '卵裂球对称性',   direction: 'pos', qualitative: '基本良好' },
      { nameEn: 'clear cytoplasm',              nameCn: '细胞质清晰度',   direction: 'pos', qualitative: '较清晰' },
      { nameEn: 'uniform cell size',            nameCn: '细胞大小均一性', direction: 'pos', qualitative: '轻度不均一' },
      { nameEn: 'intact zona pellucida',        nameCn: '透明带完整性',   direction: 'pos', qualitative: '连续、完整' },
      { nameEn: 'rapid cleavage rate',          nameCn: '分裂速率',       direction: 'pos', qualitative: '基本符合 D3 时序' },
      { nameEn: 'minimal metabolic debris',     nameCn: '代谢碎屑',       direction: 'pos', qualitative: '少量' },
      { nameEn: 'smooth membrane boundaries',   nameCn: '膜边界平滑度',   direction: 'pos', qualitative: '基本光滑' },
      { nameEn: 'minor fragmentation',          nameCn: '碎片化程度',     direction: 'neg', qualitative: '14%' },
      { nameEn: 'pronounced vacuolation',       nameCn: '空泡化程度',     direction: 'neg', qualitative: '未见' },
      { nameEn: 'disorganized cell structures', nameCn: '细胞结构紊乱',   direction: 'neg', qualitative: '未见' },
    ],

    // 医嘱与建议（纯操作指令，不重复 gradeDesc 的结论）
    doctorNote: '胚胎整体质量良好，碎片化约 14%，在可接受范围内。请于 2026-10-02 上午 9:00 返院复查，届时讨论移植方案。等待期间遵医嘱用药，避免剧烈运动，如有不适及时就医。',
  },

  {
    id: 'RPT-P001-002',
    patientId: 'P20240001',
    embryoNo: 'E-03-B',
    grade: 2,
    gradeLabel: '二级胚胎',
    gradeDesc: '胚胎质量良好，具有较高移植潜力，可作为备选胚胎。',
    assessDate: '2026-03-15',
    doctor: '王医生',
    status: 'approved',
    read: true,

    keyPoints: [
      { label: '细胞均一性', value: '基本均一' },
      { label: '发育速率',   value: '略慢' },
      { label: '碎片化比例', value: '少量（10–25%）' },
      { label: '综合建议',   value: '可用于移植' },
    ],

    concepts: [
      { nameEn: 'symmetrical blastomeres',      nameCn: '卵裂球对称性',   direction: 'pos', qualitative: '基本良好' },
      { nameEn: 'clear cytoplasm',              nameCn: '细胞质清晰度',   direction: 'pos', qualitative: '良好' },
      { nameEn: 'uniform cell size',            nameCn: '细胞大小均一性', direction: 'pos', qualitative: '基本均一' },
      { nameEn: 'intact zona pellucida',        nameCn: '透明带完整性',   direction: 'pos', qualitative: '完整' },
      { nameEn: 'rapid cleavage rate',          nameCn: '分裂速率',       direction: 'pos', qualitative: '略慢' },
      { nameEn: 'minimal metabolic debris',     nameCn: '代谢碎屑',       direction: 'pos', qualitative: '少量' },
      { nameEn: 'smooth membrane boundaries',   nameCn: '膜边界平滑度',   direction: 'pos', qualitative: '基本光滑' },
      { nameEn: 'minor fragmentation',          nameCn: '碎片化程度',     direction: 'neg', qualitative: '轻微' },
      { nameEn: 'pronounced vacuolation',       nameCn: '空泡化程度',     direction: 'neg', qualitative: '未见' },
      { nameEn: 'disorganized cell structures', nameCn: '细胞结构紊乱',   direction: 'neg', qualitative: '未见' },
    ],

    doctorNote: '',
  },

  // P-2024-0002 的报告
  {
    id: 'RPT-P002-001',
    patientId: 'P-2024-0002',
    embryoNo: 'E-01-A',
    grade: 2,
    gradeLabel: '二级胚胎',
    gradeDesc: '形态学良好，均一性轻度偏差，建议作为备选移植',
    assessDate: '2026-04-01',
    doctor: '李医生',
    status: 'approved',
    read: false,

    keyPoints: [
      { label: '细胞均一性', value: '良好' },
      { label: '发育速率',   value: '略慢' },
      { label: '碎片化比例', value: '少量（10–25%）' },
      { label: '综合建议',   value: '可用于移植' },
    ],

    concepts: [
      { nameEn: 'symmetrical blastomeres',      nameCn: '卵裂球对称性',   direction: 'pos', qualitative: '基本良好' },
      { nameEn: 'clear cytoplasm',              nameCn: '细胞质清晰度',   direction: 'pos', qualitative: '良好' },
      { nameEn: 'uniform cell size',            nameCn: '细胞大小均一性', direction: 'pos', qualitative: '基本均一' },
      { nameEn: 'intact zona pellucida',        nameCn: '透明带完整性',   direction: 'pos', qualitative: '完整' },
      { nameEn: 'rapid cleavage rate',          nameCn: '分裂速率',       direction: 'pos', qualitative: '略慢' },
      { nameEn: 'minimal metabolic debris',     nameCn: '代谢碎屑',       direction: 'pos', qualitative: '少量' },
      { nameEn: 'smooth membrane boundaries',   nameCn: '膜边界平滑度',   direction: 'pos', qualitative: '基本光滑' },
      { nameEn: 'minor fragmentation',          nameCn: '碎片化程度',     direction: 'neg', qualitative: '轻微' },
      { nameEn: 'pronounced vacuolation',       nameCn: '空泡化程度',     direction: 'neg', qualitative: '未见' },
      { nameEn: 'disorganized cell structures', nameCn: '细胞结构紊乱',   direction: 'neg', qualitative: '未见' },
    ],

    doctorNote: '',
  },
]

module.exports = { reports }
