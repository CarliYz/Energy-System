// src/data/audit/procurement_swimlane.ts
export type ProcStep = {
  col: 1|2|3|4|5;        // 哪一列
  subCol: 0|1|2;         // 列内子步骤 (3 步)
  role: 'ministry' | 'review' | 'bidder';
  status: 'ok' | 'wip' | 'anomaly' | 'na';
  action: string;
  time: string;
  owner: string;
  score?: number;
  anomalyDetail?: {
    summary: string;
    relatedEntity?: string;       // ENT-...
    suggestedAction: string;
  };
};

export const procurementSwimlane: ProcStep[] = [
  // --- COLUMN 1: 招标 Tender (col: 1, subCol: 0, 1, 2) ---
  { col: 1, subCol: 0, role: 'ministry', status: 'ok', action: '招标立项审批', time: '2026-03-01 09:30', owner: '能源部规划司', score: 98 },
  { col: 1, subCol: 0, role: 'review', status: 'ok', action: '合规性预审', time: '2026-03-02 11:20', owner: '内控监察处', score: 95 },
  { col: 1, subCol: 0, role: 'bidder', status: 'na', action: '无涉入动作', time: '—', owner: '未进入候选阶段' },

  { col: 1, subCol: 1, role: 'ministry', status: 'ok', action: '招标公告核对', time: '2026-03-05 14:00', owner: '采购中心审批岗', score: 92 },
  { col: 1, subCol: 1, role: 'review', status: 'ok', action: '公告格式校验', time: '2026-03-05 15:30', owner: '三方合规律师', score: 90 },
  { col: 1, subCol: 1, role: 'bidder', status: 'ok', action: '网上公告查阅', time: '2026-03-06 09:00', owner: '12 家候选承包商', score: 97 },

  { col: 1, subCol: 2, role: 'ministry', status: 'ok', action: '报名资格初核', time: '2026-03-12 16:30', owner: '采购执行办公室', score: 89 },
  { col: 1, subCol: 2, role: 'review', status: 'ok', action: '背景穿透审查', time: '2026-03-14 10:00', owner: '联合审计组', score: 91 },
  { col: 1, subCol: 2, role: 'bidder', status: 'ok', action: '提交参与意向书', time: '2026-03-12 11:15', owner: '投标单位授权代表', score: 93 },

  // --- COLUMN 2: 报价 Bidding (col: 2, subCol: 0, 1, 2) ---
  { col: 2, subCol: 0, role: 'ministry', status: 'ok', action: '投标包安全接收', time: '2026-03-20 18:00', owner: '中央采购档案馆', score: 96 },
  { col: 2, subCol: 0, role: 'review', status: 'ok', action: '双盲密匙校验', time: '2026-03-21 09:30', owner: '金监局信安科', score: 98 },
  { col: 2, subCol: 0, role: 'bidder', status: 'ok', action: '上传加密报价书', time: '2026-03-20 15:20', owner: '全网投标候选人', score: 95 },

  { col: 2, subCol: 1, role: 'ministry', status: 'ok', action: '要件形式审查', time: '2026-03-25 11:00', owner: '能源部法规处', score: 91 },
  { col: 2, subCol: 1, role: 'review', status: 'ok', action: '资质印签二次复核', time: '2026-03-25 14:15', owner: '外部持牌公证处', score: 94 },
  { col: 2, subCol: 1, role: 'bidder', status: 'ok', action: '报价保证书提交', time: '2026-03-23 10:00', owner: '财务担保银行', score: 92 },

  { col: 2, subCol: 2, role: 'ministry', status: 'ok', action: '全网在线公开唱标', time: '2026-03-28 10:00', owner: '采购局纪监委员', score: 90 },
  { col: 2, subCol: 2, role: 'review', status: 'ok', action: '唱标偏离比对监控', time: '2026-03-28 11:30', owner: 'AI 风控专家引擎', score: 88 },
  { col: 2, subCol: 2, role: 'bidder', status: 'ok', action: '现场开标确认签字', time: '2026-03-28 12:00', owner: '法定授权出席人', score: 91 },

  // --- COLUMN 3: 评标 Evaluate (col: 3, subCol: 0, 1, 2) ---
  { col: 3, subCol: 0, role: 'ministry', status: 'ok', action: '专家抽取及封存', time: '2026-04-10 08:00', owner: '专家库管理办公室', score: 97 },
  { col: 3, subCol: 0, role: 'review', status: 'ok', action: '评审场所隔离屏蔽', time: '2026-04-10 08:30', owner: '现场保卫纪检组', score: 99 },
  { col: 3, subCol: 0, role: 'bidder', status: 'na', action: '不参与技术评分', time: '—', owner: '技术方案锁定中' },

  { col: 3, subCol: 1, role: 'ministry', status: 'anomaly', action: '技术评分异常修订', time: '2026-04-18 14:32', owner: '评审委员会主席 Aigerim K.', score: 47, anomalyDetail: { summary: '技术评分在二审时发生恶意修正，人为跳越加分幅值 (+18 分)，疑似暗箱操作指定中标资格。', relatedEntity: 'ENT-KZ-AKT-0091', suggestedAction: '立刻冻结该采购批次所有评标进展，没收评审日志，交纪检督察处理' } },
  { col: 3, subCol: 1, role: 'review', status: 'wip', action: '暗箱评分雷达核查', time: '2026-04-18 15:00', owner: '部机关纪委特调组', score: 62 },
  { col: 3, subCol: 1, role: 'bidder', status: 'na', action: '隔离答疑接收', time: '—', owner: '阿克套管道设备工程部' },

  { col: 3, subCol: 2, role: 'ministry', status: 'ok', action: '商务报价综合比对', time: '2026-04-20 16:30', owner: '能源部预算司', score: 85 },
  { col: 3, subCol: 2, role: 'review', status: 'ok', action: '成本对标价格审核', time: '2026-04-21 10:00', owner: '总会计师公会代表', score: 90 },
  { col: 3, subCol: 2, role: 'bidder', status: 'ok', action: '答辩及特殊项澄述', time: '2026-04-20 14:00', owner: '总承包技术骨干', score: 92 },

  // --- COLUMN 4: 筛选 Shortlist (col: 4, subCol: 0, 1, 2) ---
  { col: 4, subCol: 0, role: 'ministry', status: 'ok', action: '候选短名单初评审定', time: '2026-05-02 09:30', owner: '能源部规划司长室', score: 94 },
  { col: 4, subCol: 0, role: 'review', status: 'ok', action: '排除同类围标复审', time: '2026-05-02 11:00', owner: 'AI反垄断监测软件', score: 91 },
  { col: 4, subCol: 0, role: 'bidder', status: 'ok', action: '补充提交履历证明', time: '2026-05-03 14:00', owner: '3 家短名单候选体', score: 95 },

  { col: 4, subCol: 1, role: 'ministry', status: 'ok', action: '复审核定推荐报告', time: '2026-05-10 16:00', owner: '主管副司长专题会', score: 88 },
  { col: 4, subCol: 1, role: 'review', status: 'anomaly', action: '评审合规性穿透检查', time: '2026-05-11 10:30', owner: '国家审计联合工作组', score: 35, anomalyDetail: { summary: "核查发现2名外部工程院评审专家与投标人 Atyrau Power LLC 存在隐性一致行动人股权或巨额资金往来，且为旁系亲属利益。", relatedEntity: "ENT-KZ-ATY-0203", suggestedAction: "对该2名专家实施业界禁准黑名单，启动司法问责程序并作废其一切技术评分评分" } },
  { col: 4, subCol: 1, role: 'bidder', status: 'wip', action: '备选资金重验', time: '—', owner: 'Atyrau 备选财团' },

  { col: 4, subCol: 2, role: 'ministry', status: 'ok', action: '拟定首位候选公示案', time: '2026-05-15 15:00', owner: '新闻宣传发言科', score: 93 },
  { col: 4, subCol: 2, role: 'review', status: 'ok', action: '公示异议举报登记', time: '2026-05-15 16:30', owner: '驻部派纪检信访处', score: 90 },
  { col: 4, subCol: 2, role: 'bidder', status: 'ok', action: '接受社会信誉质询', time: '2026-05-16 09:00', owner: '第一中标备选联合体', score: 96 },

  // --- COLUMN 5: 签约 Award (col: 5, subCol: 0, 1, 2) ---
  { col: 5, subCol: 0, role: 'ministry', status: 'ok', action: '中标通知印发签章', time: '2026-05-20 10:00', owner: '能源部法律政策局', score: 95 },
  { col: 5, subCol: 0, role: 'review', status: 'ok', action: '正式公告网发审计', time: '2026-05-20 11:30', owner: '三方网络认证中心', score: 97 },
  { col: 5, subCol: 0, role: 'bidder', status: 'ok', action: '正式接手中标通知书', time: '2026-05-20 14:00', owner: '中标联合体财团', score: 98 },

  { col: 5, subCol: 1, role: 'ministry', status: 'ok', action: '特殊商业合同谈判', time: '2026-05-24 10:00', owner: '主管司长特约工作会', score: 89 },
  { col: 5, subCol: 1, role: 'review', status: 'ok', action: '反商业贿赂合议起草', time: '2026-05-24 11:30', owner: '部法制监察中心', score: 91 },
  { col: 5, subCol: 1, role: 'bidder', status: 'anomaly', action: '资审实质谈判核对异常', time: '2026-05-25 14:32', owner: '西里海工业发展有限公司', score: 42, anomalyDetail: { summary: "谈判过程中，该投标人拒绝提供分包辅泵及二级压力机组供应链层级穿透细节，涉嫌刻意包庇不合规黑市设备源头、掩饰母公司隐藏亏空。", relatedEntity: 'ENT-KZ-ALM-1011', suggestedAction: '限期48小时整改披露，否则将扣留投标保证金，废止其第一顺序承签地位并实施联合监管。' } },

  { col: 5, subCol: 2, role: 'ministry', status: 'wip', action: '国家工程最终督办落章', time: '—', owner: '能源部部党组签发室' },
  { col: 5, subCol: 2, role: 'review', status: 'wip', action: '合同原件离线加密存档', time: '—', owner: '高密保密处' },
  { col: 5, subCol: 2, role: 'bidder', status: 'wip', action: '签署最终总承包合同', time: '—', owner: '联合财团代表董事会' },
];
