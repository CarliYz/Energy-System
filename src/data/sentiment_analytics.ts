export type SentimentVolumePoint = {
  date: string;
  open: number; // Volume at start of day
  close: number; // Volume at close of day
  high: number;
  low: number;
  negativeVolumePct: number; // Line chart overlay
};

export type AspectDistribution = {
  aspectEn: string;
  aspectCn: string;
  ratio: number; // percent
  polarity: 'positive' | 'negative' | 'neutral';
};

export type WordCloudLabel = {
  text: string;
  textEn: string;
  textZh: string;
  weight: number; // frequency
  x: number; // Centered offset coordinate %-equivalent OR raw px
  y: number;
  angle: number; // 0 or -30
  sentiment: 'positive' | 'negative' | 'neutral';
};

export type PathwayItem = {
  sourceEn: string;
  sourceZh: string;
  targetEn: string;
  targetZh: string;
  value: number;
  color: string;
};

export type FlowLink = {
  source: string;
  target: string;
  value: number;
  color: string;
};

export type SocialPlatformPoint = {
  name: string;
  value: number;
  velocity: number; // YoY % change
  sparkline: number[]; // 24-hour trace values
  topPosts: {
    user: string;
    text: string;
    weight: number;
  }[];
};

export const SENTIMENT_VOLUME_30D: SentimentVolumePoint[] = [
  { date: '04-28', open: 3200, close: 3450, high: 3600, low: 3100, negativeVolumePct: 45 },
  { date: '04-29', open: 3450, close: 3300, high: 3500, low: 3200, negativeVolumePct: 48 },
  { date: '04-30', open: 3300, close: 3650, high: 3800, low: 3250, negativeVolumePct: 52 },
  { date: '05-01', open: 3650, close: 3900, high: 4100, low: 3500, negativeVolumePct: 55 },
  { date: '05-02', open: 3900, close: 3800, high: 4000, low: 3700, negativeVolumePct: 51 },
  { date: '05-03', open: 3800, close: 4120, high: 4300, low: 3750, negativeVolumePct: 49 },
  { date: '05-04', open: 4120, close: 4050, high: 4200, low: 3900, negativeVolumePct: 54 },
  { date: '05-05', open: 4050, close: 3880, high: 4100, low: 3780, negativeVolumePct: 60 },
  { date: '05-06', open: 3880, close: 4230, high: 4400, low: 3800, negativeVolumePct: 58 },
  { date: '05-07', open: 4230, close: 4600, high: 4800, low: 4100, negativeVolumePct: 62 },
  { date: '05-08', open: 4600, close: 4420, high: 4700, low: 4300, negativeVolumePct: 65 },
  { date: '05-09', open: 4420, close: 4180, high: 4500, low: 4000, negativeVolumePct: 58 },
  { date: '05-10', open: 4180, close: 4550, high: 4700, low: 4100, negativeVolumePct: 52 },
  { date: '05-11', open: 4550, close: 4800, high: 5000, low: 4400, negativeVolumePct: 56 },
  { date: '05-12', open: 4800, close: 4650, high: 4900, low: 4500, negativeVolumePct: 59 },
  { date: '05-13', open: 4650, close: 4980, high: 5100, low: 4550, negativeVolumePct: 61 },
  { date: '05-14', open: 4980, close: 5300, high: 5505, low: 4800, negativeVolumePct: 65 },
  { date: '05-15', open: 5300, close: 5120, high: 5400, low: 5000, negativeVolumePct: 62 },
  { date: '05-16', open: 5120, close: 5450, high: 5600, low: 5055, negativeVolumePct: 59 },
  { date: '05-17', open: 5450, close: 5820, high: 6000, low: 5300, negativeVolumePct: 64 },
  { date: '05-18', open: 5820, close: 5700, high: 5900, low: 5500, negativeVolumePct: 66 },
  { date: '05-19', open: 5700, close: 6100, high: 6300, low: 5600, negativeVolumePct: 70 },
  { date: '05-20', open: 6100, close: 5950, high: 6200, low: 5800, negativeVolumePct: 68 },
  { date: '05-21', open: 5950, close: 6400, high: 6600, low: 5900, negativeVolumePct: 72 },
  { date: '05-22', open: 6400, close: 6330, high: 6500, low: 6200, negativeVolumePct: 69 },
  { date: '05-23', open: 6330, close: 6710, high: 6900, low: 6250, negativeVolumePct: 65 },
  { date: '05-24', open: 6710, close: 7200, high: 7500, low: 6600, negativeVolumePct: 73 },
  { date: '05-25', open: 7200, close: 7550, high: 7700, low: 7000, negativeVolumePct: 77 },
  { date: '05-26', open: 7550, close: 7890, high: 8200, low: 7400, negativeVolumePct: 79 },
  { date: '05-27', open: 7890, close: 8320, high: 8500, low: 7750, negativeVolumePct: 81 },
];

export const SENTIMENT_ASPECTS: AspectDistribution[] = [
  { aspectEn: 'Utility Bill Price Hike (Almaty)', aspectCn: '一类民生用电价格上涨担忧', ratio: 38, polarity: 'negative' },
  { aspectEn: 'Mangystau Grid Intermittent Deficit', aspectCn: '曼吉斯套小电网稳定性诉求', ratio: 24, polarity: 'negative' },
  { aspectEn: 'CPC Transport Capacity Sabotage', aspectCn: 'CPC管道袭扰地缘安全恐慌与溢价', ratio: 18, polarity: 'negative' },
  { aspectEn: 'Green Wind Expansion (Mangystau Project)', aspectCn: '对超级低碳风力投产的正面预期', ratio: 12, polarity: 'positive' },
  { aspectEn: 'National Refinery Laser Sniffer Mandate', aspectCn: '对全省炼油厂进行环保刚性激光特检', ratio: 8, polarity: 'neutral' },
];

// Spirally arranged cloud labels (centered offset X%, Y% relative to canvas center 0,0)
export const WORD_CLOUD_LABELS: WordCloudLabel[] = [
  { text: '一类民生用电涨幅 +35%', textZh: '一类民生用电涨幅 +35%', textEn: 'Livelihood Tariff Hike +35%', weight: 48, x: 0, y: 0, angle: 0, sentiment: 'negative' },
  { text: 'Atyrau 4号阀站受突袭', textZh: 'Atyrau 4号阀站受突袭', textEn: 'Atyrau Valve Station 4 Ambushed', weight: 40, x: -120, y: -45, angle: 0, sentiment: 'negative' },
  { text: '断电停运 (Grid Crash)', textZh: '断电停运 (Grid Crash)', textEn: 'Grid Outage / Crash', weight: 34, x: 130, y: 40, angle: -30, sentiment: 'negative' },
  { text: 'CPC管道溢价波及', textZh: 'CPC管道溢价波及', textEn: 'CPC Pipeline Price Spillover', weight: 32, x: 100, y: -75, angle: 0, sentiment: 'negative' },
  { text: '里海输油阻尼大', textZh: '里海输油阻尼大', textEn: 'Caspian Oil Transport Damping', weight: 30, x: -140, y: 55, angle: -30, sentiment: 'negative' },
  { text: '1200亿风电项目投建', textZh: '1200亿风电项目投建', textEn: '120B KZT Wind Project', weight: 28, x: -60, y: -100, angle: 0, sentiment: 'positive' },
  { text: '瞒报油品漏油扣罚', textZh: '瞒报油品漏油扣罚', textEn: 'Unreported Oil Spill Penalty', weight: 26, x: 70, y: 105, angle: 0, sentiment: 'negative' },
  { text: '系统高频SCADA核实', textZh: '系统高频SCADA核实', textEn: 'High-Frequency SCADA Audit', weight: 24, x: -160, y: -110, angle: -30, sentiment: 'neutral' },
  { text: '物理流量多口径一致性', textZh: '物理流量多口径一致性', textEn: 'Physical Flow Audit Integrity', weight: 22, x: 180, y: -100, angle: 0, sentiment: 'neutral' },
  { text: '电费上涨 +35%', textZh: '电费上涨 +35%', textEn: 'Tariff Rate Increase +35%', weight: 22, x: -15, y: 80, angle: 0, sentiment: 'negative' },
  { text: '反虚开发票欺诈', textZh: '反虚开发票欺诈', textEn: 'Anti-Billing Fraud', weight: 21, x: 130, y: -30, angle: -30, sentiment: 'neutral' },
  { text: '低耗能绿色转型', textZh: '低耗能绿色转型', textEn: 'Low-Carbon Green Transition', weight: 20, x: 45, y: -50, angle: 0, sentiment: 'positive' },
  { text: '哈国生态部配额卡死', textZh: '哈国生态部配额卡死', textEn: 'Ecology Ministry Quota Freeze', weight: 19, x: -80, y: 40, angle: -30, sentiment: 'negative' },
  { text: '火炬乱燃特惩 $40/T', textZh: '火炬乱燃特惩 $40/T', textEn: 'Gas Flaring Penalty $40/T', weight: 18, x: -30, y: -150, angle: 0, sentiment: 'negative' },
  { text: '无证生产高危主体', textZh: '无证生产高危主体', textEn: 'Unlicensed High-risk Operators', weight: 17, x: 30, y: 140, angle: -30, sentiment: 'negative' },
  { text: '特遣派驻实勘现场', textZh: '特遣派驻实勘现场', textEn: 'Urgent Field Taskforce Envoy', weight: 16, x: -110, y: 110, angle: 0, sentiment: 'neutral' },
  { text: '中德直驱机组到位', textZh: '中德直驱机组到位', textEn: 'CN-DE Direct Drive Turbines', weight: 15, x: 140, y: 90, angle: 0, sentiment: 'positive' },
  { text: '里海风场并网投产', textZh: '里海风场并网投产', textEn: 'Caspian Wind On-Grid', weight: 14, x: -130, y: -10, angle: -30, sentiment: 'positive' },
  { text: '偷盗漏电开采矿机', textZh: '偷盗漏电开采矿机', textEn: 'Power Theft Crypto Mining', weight: 13, x: 180, y: 30, angle: 0, sentiment: 'negative' },
  { text: '智催督导告诫令速达', textZh: '智催督导告诫令速达', textEn: 'Intelligent Advisory Dispatch', weight: 12, x: 30, y: -120, angle: -30, sentiment: 'neutral' },
];

export const PLATFORM_MONITORING: SocialPlatformPoint[] = [
  {
    name: 'Telegram Groups',
    value: 62450,
    velocity: 28.4,
    sparkline: [240, 270, 290, 310, 305, 340, 420, 520, 680, 750, 780, 810, 860, 940, 1100, 1250, 1340, 1420, 1680, 1890, 2120, 2450, 2680, 2950],
    topPosts: [
      { user: 'kz_energy_patriot', text: '阿拉木图民用生活电费本月怎么直接多出来+35%？连个征求意见会都没有？！', weight: 890 },
      { user: 'west_caspian_leaker', text: '听说阿特劳4号泵站遇袭后很多重质重组管道开始间歇性减震降温，会不会引发全省网架解节？', weight: 720 },
      { user: 'atyr_worker_union', text: '母公司KMG突然说要在厂里部署激光探嗅仪器，严查哪怕0.5吨的排气，我们作业量直接翻倍！', weight: 512 }
    ]
  },
  {
    name: 'VKontakte (VK)',
    value: 38120,
    velocity: 14.2,
    sparkline: [120, 140, 135, 150, 175, 190, 210, 225, 260, 310, 340, 370, 395, 410, 440, 480, 520, 590, 610, 670, 720, 790, 840, 920],
    topPosts: [
      { user: 'kaz_ecology_monitor', text: '西里海LLC被挂了环保红牌，他们以前虚开那么多纳税和排放 disclosures 看来是掩耳盗铃。', weight: 450 },
      { user: 'tynge_news_agency', text: '国家重金规划的1200亿风场一期已打桩就位！期待摆脱纯化石调峰！', weight: 390 }
    ]
  },
  {
    name: 'X (Twitter)',
    value: 15800,
    velocity: 8.5,
    sparkline: [40, 45, 52, 60, 58, 62, 70, 85, 92, 110, 125, 140, 145, 160, 185, 210, 240, 275, 290, 310, 345, 390, 420, 450],
    topPosts: [
      { user: 'reuters_caspian_desk', text: 'Armed altercation reported near CPC corridor splits, pressure imbalance observed across grid nodes.', weight: 610 }
    ]
  },
  {
    name: 'Facebook & Locals',
    value: 8230,
    velocity: -2.1,
    sparkline: [15, 18, 20, 22, 19, 21, 24, 25, 28, 31, 35, 38, 41, 40, 43, 46, 50, 55, 59, 62, 66, 69, 73, 75],
    topPosts: [
      { user: 'almaty_biz_daily', text: '地方大工业大用热核定的发贴与网频调节仍存温温公差，不至于导致严重断电脱落。', weight: 190 }
    ]
  }
];

// Audience multi-level Bezier flow linkages
export const AUDIENCE_FLOW_LINKS: FlowLink[] = [
  // Tier 1 (Social Buzz Source) -> Tier 2 (Intermediate Concern Node / 涉物理节点)
  { source: 'Telegram Groups', target: '电费上涨 +35%', value: 38400, color: '#D8454C' },
  { source: 'Telegram Groups', target: '网关跳闸断能恐慌', value: 18200, color: '#E89518' },
  { source: 'Telegram Groups', target: 'KMG激光环保激光特检', value: 5850, color: '#2AB3A6' },
  { source: 'VKontakte (VK)', target: '电费上涨 +35%', value: 16100, color: '#D8454C' },
  { source: 'VKontakte (VK)', target: '西里海瞒产脱网起诉舆情', value: 22020, color: '#E89518' },
  { source: 'X (Twitter)', target: '阿特劳管道突袭伴随漏油', value: 15800, color: '#D8454C' },

  // Tier 2 -> Tier 3 (Underlying Cause / Ministerial Risk Categorization)
  { source: '电费上涨 +35%', target: '民生大宗基础负荷保障红区', value: 54500, color: '#D8454C' },
  { source: '网关跳闸断能恐慌', target: '物理输送系统防务安全威胁', value: 18200, color: '#E89518' },
  { source: 'KMG激光环保激光特检', target: '中下游重污染碳配限制规制', value: 5850, color: '#2AB3A6' },
  { source: '阿特劳管道突袭伴随漏油', target: '物理输送系统防务安全威胁', value: 15800, color: '#D8454C' },
  { source: '西里海瞒产脱网起诉舆情', target: '反关联交易及洗钱偷税稽查', value: 22020, color: '#E89518' },
];

export const SPREAD_PATHWAYS: PathwayItem[] = [
  // Propagation Path mapping
  { 
    sourceZh: '阿拉木图生活用电超标贴点', 
    sourceEn: 'Almaty Tariffs Complaints', 
    targetZh: 'Telegram大V二次解调引用', 
    targetEn: 'Telegram Influencer Re-Quotes', 
    value: 65, 
    color: '#D8454C' 
  },
  { 
    sourceZh: 'Telegram大V二次解调引用', 
    sourceEn: 'Telegram Influencer Re-Quotes', 
    targetZh: '地方新闻网商业快讯面覆盖', 
    targetEn: 'Local News Coverage', 
    value: 50, 
    color: '#D8454C' 
  },
  { 
    sourceZh: '地方新闻网商业快讯面覆盖', 
    sourceEn: 'Local News Coverage', 
    targetZh: '跨国媒体地缘地平线转载', 
    targetEn: 'Transnational Media Echoes', 
    value: 35, 
    color: '#D8454C' 
  },

  { 
    sourceZh: '阿特劳泵站遇武装袭扰', 
    sourceEn: 'Atyrau Pump Incident Outery', 
    targetZh: 'X快讯及路透现场微宏遥测配对', 
    targetEn: 'X Alerts & Reuters Telemetry Match', 
    value: 85, 
    color: '#D8454C' 
  },
  { 
    sourceZh: 'X快讯及路透现场微宏遥测配对', 
    sourceEn: 'X Alerts & Reuters Telemetry Match', 
    targetZh: '全球石油即期期货溢价波动舆论', 
    targetEn: 'Oil Futures Premium Speculation', 
    value: 72, 
    color: '#E89518' 
  },

  { 
    sourceZh: '1200亿风能启动舆论', 
    sourceEn: '120B KZT Wind Project Launch', 
    targetZh: '萨马鲁克本地绿色宣推', 
    targetEn: 'Samruk-Kazyna Green Buzz', 
    value: 45, 
    color: '#2FA862' 
  },
  { 
    sourceZh: '萨马鲁克本地绿色宣推', 
    sourceEn: 'Samruk-Kazyna Green Buzz', 
    targetZh: 'ESG绿色社会信托增值流入', 
    targetEn: 'ESG Green Inflows Surge', 
    value: 38, 
    color: '#2FA862' 
  }
];

export const keywordCloud = WORD_CLOUD_LABELS;
