export type EnterpriseRecord = {
  id: string;                        // e.g. 'ENT-KZ-AKT-0091'
  nameCn: string;                    // e.g. '西里海能源合资有限公司'
  nameEn: string;                    // e.g. 'Western Caspian Energy LLC'
  taxId: string;                     // BIN / Tax ID
  legalRep: string;
  registeredCapital: string;         // e.g. 'KZT 8.4B'
  established: string;               // e.g. '2008-03-12'
  industry: string;                  // e.g. '上游油气勘探与开采'
  hqAddress: string;
  
  // 股权穿透 / Ownership Structure
  shareholders: {
    name: string;
    pct: number;
    type: 'state' | 'foreign' | 'private';
    ultimateBeneficiary?: string;
  }[];

  // 业务产能 / Operational Capacity
  capacity: {
    metric: string;                  // e.g. '原油日产量' or '炼油加工能力'
    value: string;
    unit: string;
    yoy: number;                     // YoY %
  }[];

  // 关联企业 (图谱节点) / Related Entities
  relatedEntities: {
    id: string;
    name: string;
    relation: string;                // e.g. '上游设备供应', '股东方', '下游买家'
    riskLevel: 'low' | 'mid' | 'high';
  }[];

  // 历史合规事件 / Compliance History
  complianceHistory: {
    date: string;
    category: '环保' | '安全' | '财税' | '反垄断' | '审批';
    severity: 'low' | 'mid' | 'high';
    summary: string;
    status: 'closed' | 'open' | 'reviewing';
  }[];

  // 监管打分 / Regulatory Score
  scoreOverall: number;              // 0-100
  scoreBreakdown: {
    compliance: number;
    safety: number;
    financial: number;
    esg: number;
  };

  // 风险标签 / Risk Flags
  riskTags: string[];
};

export const enterpriseKB: EnterpriseRecord[] = [
  {
    id: 'ENT-KZ-AKT-0091',
    nameCn: '西里海能源合资有限公司',
    nameEn: 'Western Caspian Energy LLC',
    taxId: 'BIN 080340012345',
    legalRep: 'Bauyrzhan A. · 巴吾尔詹·阿曼诺夫',
    registeredCapital: 'KZT 8.4B',
    established: '2008-03-12',
    industry: '上游油气勘探与开采',
    hqAddress: '哈萨克斯坦曼吉斯套州 · 阿克套市 · Ozenmunaygas 工业园 BLK-12',
    shareholders: [
      { name: 'KazMunayGas E&P', pct: 51, type: 'state', ultimateBeneficiary: 'Samruk-Kazyna 主权基金' },
      { name: 'Sinopec International (中石化国际)', pct: 24, type: 'foreign', ultimateBeneficiary: '中国国资委' },
      { name: 'Caspian Holdings BV', pct: 18, type: 'foreign', ultimateBeneficiary: '荷兰 NL-BV / 实控人未披露' },
      { name: '管理层持股平台', pct: 7, type: 'private' },
    ],
    capacity: [
      { metric: '原油日产量', value: '38.4', unit: 'kbpd', yoy: -3.2 },
      { metric: '天然气伴生产量', value: '124', unit: 'mmcfd', yoy: 1.4 },
      { metric: '已探明储量', value: '482', unit: 'Mbbl', yoy: 0 },
      { metric: '采收率', value: '38.6', unit: '%', yoy: 0.4 },
    ],
    relatedEntities: [
      { id: 'ENT-KZ-AKT-0124', name: '阿克套燃气配气公司', relation: '下游伴生气买家', riskLevel: 'low' },
      { id: 'ENT-CN-BJ-7081', name: '中石化国际服务北京', relation: '设备与技术服务', riskLevel: 'mid' },
      { id: 'ENT-NL-AMS-2210', name: 'Caspian Holdings BV', relation: '股东方·离岸架构', riskLevel: 'high' },
      { id: 'ENT-KZ-MAN-0173', name: '曼吉斯套油田服务', relation: '主力油服承包商', riskLevel: 'mid' },
    ],
    complianceHistory: [
      { date: '2024-09-12', category: '环保', severity: 'mid', summary: '油泥处置厂排污超标 12%，已限期整改', status: 'closed' },
      { date: '2025-04-03', category: '财税', severity: 'high', summary: '关联交易转移定价异常，启动专项审计', status: 'open' },
      { date: '2025-11-28', category: '安全', severity: 'mid', summary: '一级增压站离心叶片缺陷预警', status: 'reviewing' },
      { date: '2026-03-15', category: '审批', severity: 'low', summary: '增产作业许可证延期申请', status: 'closed' },
    ],
    scoreOverall: 64,
    scoreBreakdown: { compliance: 58, safety: 71, financial: 52, esg: 75 },
    riskTags: ['离岸股东穿透异常', '关联交易高频', '设备老化预警'],
  },
  {
    id: 'ENT-KZ-AST-0102',
    nameCn: '哈萨克国家石油天然气集团',
    nameEn: 'KazMunayGas (KMG)',
    taxId: 'BIN 020240001092',
    legalRep: 'Askhat K. · 阿斯哈特·哈塞诺夫',
    registeredCapital: 'KZT 120.5B',
    established: '2002-02-20',
    industry: '国家核心石油与天然气综合体',
    hqAddress: '哈萨克斯坦阿斯塔纳市 · 努尔若尔大道 19 号国家能源中心大厦',
    shareholders: [
      { name: 'Samruk-Kazyna JSC', pct: 87.4, type: 'state', ultimateBeneficiary: '哈萨克斯坦共和国政府' },
      { name: 'National Bank of Kazakhstan (央行信托)', pct: 9.6, type: 'state', ultimateBeneficiary: '哈萨克斯坦国家主权基金储备' },
      { name: '公众流通股 (KASE)', pct: 3.0, type: 'private' }
    ],
    capacity: [
      { metric: '总油气产量', value: '486.2', unit: 'kboe/d', yoy: 2.1 },
      { metric: '原油加工能力', value: '310.5', unit: 'kbpd', yoy: 1.5 },
      { metric: '长途管输周转量', value: '74.2', unit: 'Bnt.km', yoy: 3.8 },
      { metric: '新能源投建规模', value: '1.2', unit: 'GW', yoy: 120 },
    ],
    relatedEntities: [
      { id: 'ENT-KZ-ATY-0118', name: '阿特劳裂解联合炼化厂', relation: '控股子公司(重整炼油)', riskLevel: 'low' },
      { id: 'ENT-KZ-AKT-0124', name: '阿克套燃气配气公司', relation: '全资输配送网', riskLevel: 'low' },
      { id: 'ENT-KZ-ALM-0156', name: '国家电网 KEGOC', relation: '主力高压自备接入配合', riskLevel: 'low' }
    ],
    complianceHistory: [
      { date: '2025-01-10', category: '环保', severity: 'low', summary: '克恩亚克大工业区常规排硫检查正常', status: 'closed' },
      { date: '2025-08-15', category: '审批', severity: 'low', summary: '批准田吉兹新井伴生气回注一期开发许可', status: 'closed' },
      { date: '2026-02-28', category: '安全', severity: 'low', summary: '里海管道 CPC 阀站定期设备安全巡检', status: 'closed' }
    ],
    scoreOverall: 94,
    scoreBreakdown: { compliance: 96, safety: 93, financial: 91, esg: 95 },
    riskTags: ['国家级战略支柱', '合规状况极佳', '资产稳健型'],
  },
  {
    id: 'ENT-KZ-ATY-0118',
    nameCn: '阿特劳裂解联合炼化厂',
    nameEn: 'Atyrau Refinery JSC',
    taxId: 'BIN 931040004921',
    legalRep: 'Galymzhan Z. · 加林江·朱桑巴耶夫',
    registeredCapital: 'KZT 42.1B',
    established: '1945-09-08',
    industry: '下游油品冶炼与石油化工生产',
    hqAddress: '哈萨克斯坦阿特劳州 · 阿特劳市 · 加巴杜林街 1 号',
    shareholders: [
      { name: 'KazMunayGas Refineries', pct: 99.1, type: 'state', ultimateBeneficiary: 'Samruk-Kazyna 主权基金' },
      { name: '零散大众股权', pct: 0.9, type: 'private' }
    ],
    capacity: [
      { metric: '原油一次加工能力', value: '110.4', unit: 'kbpd', yoy: -0.5 },
      { metric: '高标准燃料产出率', value: '78.2', unit: '%', yoy: 1.2 },
      { metric: '二氧化硫总排量', value: '14.2', unit: 'Kt/year', yoy: -6.4 },
      { metric: '设备开工负荷率', value: '92.5', unit: '%', yoy: 2.1 }
    ],
    relatedEntities: [
      { id: 'ENT-KZ-AST-0102', name: '哈萨克国家石油天然气集团', relation: '主要母公司 / 业务核定端', riskLevel: 'low' },
      { id: 'ENT-KZ-MAN-0173', name: '曼吉斯套油田服务', relation: '外协维修作业商', riskLevel: 'mid' }
    ],
    complianceHistory: [
      { date: '2025-04-18', category: '环保', severity: 'high', summary: '夜间违规超排非甲烷总烃，处以 1.2亿坚戈环保罚金', status: 'closed' },
      { date: '2025-10-09', category: '安全', severity: 'mid', summary: '重整二次蒸汽压力过大限压熔断故障', status: 'closed' },
      { date: '2026-04-12', category: '环保', severity: 'mid', summary: '污泥污水二次处理净化站设备老化渗漏审查', status: 'open' }
    ],
    scoreOverall: 70,
    scoreBreakdown: { compliance: 68, safety: 72, financial: 78, esg: 62 },
    riskTags: ['老旧化装置频发', '有重度污染排放风险', '环保高密度督办'],
  },
  {
    id: 'ENT-KZ-AKT-0124',
    nameCn: '阿克套燃气配气公司',
    nameEn: 'Aktau Gas Distribution Co.',
    taxId: 'BIN 050341009182',
    legalRep: 'Mukhtar S. · 穆赫塔尔·萨杜瓦卡索夫',
    registeredCapital: 'KZT 12.8B',
    established: '2005-06-15',
    industry: '中游主干天然气转驳与城市燃气供送',
    hqAddress: '哈萨克斯坦曼吉斯套州 · 阿克套市 · 第四工业微区 24 号',
    shareholders: [
      { name: 'KazTransGas Aimak', pct: 75.0, type: 'state', ultimateBeneficiary: '哈国能 KMG' },
      { name: 'Mangystau Energy Private Capital', pct: 25.0, type: 'private', ultimateBeneficiary: '曼吉斯套地方实业财团' }
    ],
    capacity: [
      { metric: '长途输气接管能力', value: '400', unit: 'k.m3/h', yoy: 4.5 },
      { metric: '城市管道接客户数', value: '180', unit: 'K households', yoy: 6.2 },
      { metric: '冬季应急储运能力', value: '12.0', unit: 'M.m3', yoy: 0 },
      { metric: '天然气平均漏失率', value: '0.24', unit: '%', yoy: -4.0 }
    ],
    relatedEntities: [
      { id: 'ENT-KZ-AKT-0091', name: '西里海能源合资有限公司', relation: '地方中游配气采购伙伴', riskLevel: 'mid' },
      { id: 'ENT-KZ-AST-0102', name: '哈萨克国家石油天然气集团', relation: '母公司管理指导', riskLevel: 'low' }
    ],
    complianceHistory: [
      { date: '2024-12-22', category: '安全', severity: 'mid', summary: '城区高压减压站工艺压差异常报警波动', status: 'closed' },
      { date: '2025-06-14', category: '反垄断', severity: 'mid', summary: '加气站商业加价违规突破最高零位限价调查', status: 'closed' },
      { date: '2026-03-30', category: '审批', severity: 'low', summary: '第三连接线新建核准变更登记', status: 'closed' }
    ],
    scoreOverall: 82,
    scoreBreakdown: { compliance: 85, safety: 80, financial: 84, esg: 79 },
    riskTags: ['民生价格限制强', '管网高压监护', '配合平稳度佳'],
  },
  {
    id: 'ENT-KZ-ALM-0156',
    nameCn: 'KEGOC 国家电网',
    nameEn: 'KEGOC State Grid Corp',
    taxId: 'BIN 971040003182',
    legalRep: 'Nabi A. · 纳比·艾特扎诺夫',
    registeredCapital: 'KZT 85.0B',
    established: '1997-07-11',
    industry: '全国骨干电网运营与联络跨国调度',
    hqAddress: '哈萨克斯坦阿斯塔纳市 · 陶克里克街 59 号',
    shareholders: [
      { name: 'Samruk-Kazyna Sovereign Fund', pct: 90.0, type: 'state', ultimateBeneficiary: '哈萨克斯坦主权基金管理机构' },
      { name: '小额流通证券 (KASE)', pct: 10.0, type: 'private' }
    ],
    capacity: [
      { metric: '骨干输电线路总长', value: '27.4', unit: 'K.km', yoy: 1.1 },
      { metric: '变压器总容量', value: '38.6', unit: 'GVA', yoy: 2.5 },
      { metric: '电网联络潮流负荷', value: '18.4', unit: 'GW', yoy: 4.2 },
      { metric: '网损率指标率', value: '4.82', unit: '%', yoy: -1.2 }
    ],
    relatedEntities: [
      { id: 'ENT-KZ-AST-0189', name: '萨马鲁克能源股份公司', relation: '主网入网电能供应商', riskLevel: 'low' },
      { id: 'ENT-KZ-AST-0102', name: '哈萨克国家石油天然气集团', relation: '联合物理供能配合方', riskLevel: 'low' }
    ],
    complianceHistory: [
      { date: '2025-01-20', category: '安全', severity: 'mid', summary: '南北联络主通道由于严寒发生瞬间闪络过电流', status: 'closed' },
      { date: '2025-07-02', category: '审批', severity: 'low', summary: '克孜勒奥尔达新建220kV双线开工核准', status: 'closed' },
      { date: '2026-05-18', category: '安全', severity: 'mid', summary: '地方配电网大量自建非法矿机盗电致使网频负偏置', status: 'open' }
    ],
    scoreOverall: 88,
    scoreBreakdown: { compliance: 92, safety: 85, financial: 89, esg: 86 },
    riskTags: ['大网平衡主力', '地缘联络高密', '非干预智调度'],
  },
  {
    id: 'ENT-KZ-MAN-0173',
    nameCn: '曼吉斯套油田服务有限责任公司',
    nameEn: 'Mangystau Oilfield Services LLP',
    taxId: 'BIN 100412001928',
    legalRep: 'Yerbolat T. · 叶尔波拉特·特列科夫',
    registeredCapital: 'KZT 2.6B',
    established: '2010-04-03',
    industry: '中小型油气田装备技术及实物维护服务',
    hqAddress: '哈萨克斯坦曼吉斯套州 · 扎瑙岑市 · 第一大街 104号',
    shareholders: [
      { name: 'Caspian Inter-Agencies Direct', pct: 60.0, type: 'private', ultimateBeneficiary: '海外避税群岛实控人 / 壳架构' },
      { name: '管理团队本地持股', pct: 40.0, type: 'private' }
    ],
    capacity: [
      { metric: '井架实备配套装置', value: '14', unit: 'sets', yoy: -12.5 },
      { metric: '主力泥浆清洗吞吐', value: '45.0', unit: 'Kt/year', yoy: -8.0 },
      { metric: '常规巡检技术总人数', value: '312', unit: 'persons', yoy: -4.5 },
      { metric: '装备老旧缺陷率', value: '12.8', unit: '%', yoy: 14.5 }
    ],
    relatedEntities: [
      { id: 'ENT-KZ-AKT-0091', name: '西里海能源合资有限公司', relation: '核心承包业务甲流方', riskLevel: 'high' },
      { id: 'ENT-KZ-ATY-0118', name: '阿特劳裂解联合炼化厂', relation: '业务分包往来', riskLevel: 'mid' }
    ],
    complianceHistory: [
      { date: '2024-11-15', category: '财税', severity: 'high', summary: '开具无真实业务背景之虚假结算发票冲抵利得税', status: 'closed' },
      { date: '2025-05-20', category: '安全', severity: 'high', summary: '扎瑙岑联合车间操作工起重机钢绳断裂重大亡人事故', status: 'closed' },
      { date: '2026-02-14', category: '财税', severity: 'high', summary: '12个月内连续三次未能如期结汇及转让定价避税', status: 'open' }
    ],
    scoreOverall: 55,
    scoreBreakdown: { compliance: 42, safety: 50, financial: 48, esg: 80 },
    riskTags: ['离岸股东失联', '发票欺诈事件', '存在财务抽逃行为'],
  },
  {
    id: 'ENT-KZ-AST-0189',
    nameCn: '萨马鲁克能源股份公司',
    nameEn: 'Samruk-Energy JSC',
    taxId: 'BIN 071140001891',
    legalRep: 'Kuanysh B. · 库阿尼什·别克别托夫',
    registeredCapital: 'KZT 48.6B',
    established: '2007-11-28',
    industry: '国家统一发能机组投资与矿山开采组合',
    hqAddress: '哈萨克斯坦阿斯塔纳市 · 卡班拜巴特尔大道 17 号',
    shareholders: [
      { name: 'Samruk-Kazyna National Welfare Fund', pct: 100.0, type: 'state', ultimateBeneficiary: '哈萨克斯坦共和国政府' }
    ],
    capacity: [
      { metric: '总装机容量规模', value: '6200', unit: 'MW', yoy: 3.5 },
      { metric: '年实际发电量', value: '31.4', unit: 'B.kWh', yoy: 2.1 },
      { metric: '露天碎煤实际开采', value: '45.2', unit: 'Mt/year', yoy: 0.8 },
      { metric: '绿电水风在投总量', value: '880', unit: 'MW', yoy: 34.0 }
    ],
    relatedEntities: [
      { id: 'ENT-KZ-ALM-0156', name: 'KEGOC 国家电网公司', relation: '上网主干关电网关联', riskLevel: 'low' },
      { id: 'ENT-KZ-ATY-0118', name: '阿特劳裂解联合炼化厂', relation: '大工业购销供电主力对象', riskLevel: 'low' }
    ],
    complianceHistory: [
      { date: '2025-02-12', category: '环保', severity: 'mid', summary: '埃基巴斯图兹第三火电厂粉尘高空逸出率超标2.1%', status: 'closed' },
      { date: '2025-09-18', category: '安全', severity: 'mid', summary: '矿区重卡传送皮带机械铰链绞指安全责任故障', status: 'closed' },
      { date: '2026-04-03', category: '财税', severity: 'low', summary: '增值税出口退税延时自核清查', status: 'closed' }
    ],
    scoreOverall: 61,
    scoreBreakdown: { compliance: 65, safety: 70, financial: 55, esg: 54 },
    riskTags: ['严重碳高排实能', '重工业高危险度', '煤炭联动敏感'],
  },
  {
    id: 'ENT-KZ-AKT-0204',
    nameCn: '北里海作业公司 (NCOC)',
    nameEn: 'North Caspian Operating Co. (NCOC)',
    taxId: 'BIN 080640003102',
    legalRep: 'Giancarlo R. · 詹卡洛·鲁尤',
    registeredCapital: 'KZT 95.4B',
    established: '2008-06-25',
    industry: '境外超级大财团里海联合油田特许开采',
    hqAddress: '哈萨克斯坦阿特劳市 · 斯马古洛夫街 1号',
    shareholders: [
      { name: 'KMG (哈萨克国家油)', pct: 16.8, type: 'state', ultimateBeneficiary: 'Samruk-Kazyna' },
      { name: 'Eni / Shell / Total / ExxonMobil 各', pct: 16.8, type: 'foreign', ultimateBeneficiary: '意大利/英荷/法国/美国跨国跨界巨擘' },
      { name: '中石油 CNPC', pct: 8.3, type: 'foreign', ultimateBeneficiary: '中国国资委' },
      { name: '日本 Inpex', pct: 7.5, type: 'foreign', ultimateBeneficiary: '日本 METI' }
    ],
    capacity: [
      { metric: '卡沙甘超巨井日产', value: '380', unit: 'kbpd', yoy: 5.2 },
      { metric: '海流高压气回注量', value: '420', unit: 'mmcfd', yoy: 12.0 },
      { metric: '平台海洋防溢处理', value: '100', unit: '%', yoy: 0 },
      { metric: '硫磺高毒物堆存率', value: '1.24', unit: 'Mt', yoy: -8.0 }
    ],
    relatedEntities: [
      { id: 'ENT-KZ-AST-0102', name: '哈萨克国家石油天然气集团', relation: '大股东方业务直托', riskLevel: 'low' },
      { id: 'ENT-KZ-ATY-0118', name: '阿特劳裂解联合炼化厂', relation: '上游重质高含硫原油供应', riskLevel: 'low' }
    ],
    complianceHistory: [
      { date: '2024-10-30', category: '环保', severity: 'mid', summary: '卡沙甘特大海上油气溢散指纹自净处理迟滞罚息', status: 'closed' },
      { date: '2025-05-18', category: '安全', severity: 'low', summary: 'D群特大海洋钢结构锚链物理力学振荡自修复合格', status: 'closed' },
      { date: '2026-01-22', category: '审批', severity: 'low', summary: '二期深海气高压回收连接线新许可获生态部通过', status: 'closed' }
    ],
    scoreOverall: 87,
    scoreBreakdown: { compliance: 90, safety: 88, financial: 85, esg: 85 },
    riskTags: ['国际顶级财团', '开采工程技术极高', '环境特级监护面'],
  }
];

export function findEnterpriseById(id: string): EnterpriseRecord | null {
  return enterpriseKB.find(e => e.id === id) || null;
}
