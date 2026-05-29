export type NewsCategory = 'conflict' | 'investment' | 'policy';

export type GlobalNewsItem = {
  id: string;
  scope: 'domestic' | 'overseas';
  source: string;       // KazTAG / Tengrinews / Kazinform / Bloomberg ...
  sourceZh: string;     // Chinese translation for source
  sourceUrl: string;    // kaztag.kz / cctv.com
  severity: 'critical' | 'medium' | 'low';
  severityLabel: 'CRITICAL' | 'MED' | 'LOW';
  region: string;
  regionZh: string;     // Chinese translation for region
  timeAgo: string;
  timeAgoZh: string;    // Chinese translation for time ago
  title: string;
  titleZh: string;      // Chinese title
  fullText: string;
  fullTextZh: string;   // Chinese full text
  image: string;        // Visual image depicting the news item
  kpiImpact?: { kpi: string; kpiZh: string; deltaPct: number }[];
};

export const GLOBAL_ENERGY_NEWS: GlobalNewsItem[] = [
  // --- DOMESTIC NEWS ---
  {
    id: 'DOM-NEWS-001',
    scope: 'domestic',
    source: 'KazTAG',
    sourceZh: '哈通社',
    sourceUrl: 'kaztag.kz',
    severity: 'critical',
    severityLabel: 'CRITICAL',
    region: 'Pavlodar / KEGOC Control',
    regionZh: '巴甫洛达尔 / KEGOC 调度中心',
    timeAgo: '15 min ago',
    timeAgoZh: '15 分钟前',
    title: 'KEGOC State Grid System Detects Transient Frequency Deviation Beyond Safe Decimals',
    titleZh: '国家电网运营调度中心 (KEGOC) 监测到电网频率发生严重的瞬态偏移报警',
    fullText: 'The State Grid Operational Control Center (KEGOC) has issued a yellow-grade technical bulletin after primary interconnectors near Pavlodar industrial zone registered transient cycle drops. Sudden loading spikes from unauthorized data mining farms are believed to have triggered the trip, requiring fast starter gas response and temporary residential peak shaving.',
    fullTextZh: '哈国电网运营调度中心 (KEGOC) 在巴甫洛达尔工业区附近的骨干高压线路测得瞬态频率骤降后，已紧急印发黄色级别技术告警。初步研判显示，部分非法数据中心突发负荷飙升是导致自动断路的主因，调度系统已紧急开启快速燃气轮机组备用点火，并由属地网局实施临时居民峰谷错峰调荷。',
    image: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=500&auto=format&fit=crop',
    kpiImpact: [
      { kpi: 'Grid Frequency Stability (Hz)', kpiZh: '大电网频率瞬态稳定偏差 (Hz)', deltaPct: -1.2 },
      { kpi: 'Starter Gas Reserve Usage', kpiZh: '重型快速启动备用气源调配量', deltaPct: 8.4 }
    ]
  },
  {
    id: 'DOM-NEWS-002',
    scope: 'domestic',
    source: 'Tengrinews',
    sourceZh: '腾格里新闻网',
    sourceUrl: 'tengrinews.kz',
    severity: 'medium',
    severityLabel: 'MED',
    region: 'Almaty Municipality',
    regionZh: '阿拉木图市公用事业局',
    timeAgo: '1 hour ago',
    timeAgoZh: '1 小时前',
    title: 'Almaty Municipal Committee Concludes Public Hearing Over 35% Gas Heating Tariffs Adjustment',
    titleZh: '阿拉木图市政委员会听证确立将集中供热暖气费单价调高 35% 听证草案',
    fullText: 'Public heating utilities of Almaty successfully delivered audit briefs defending the proposed 35% seasonal surcharge for commercial and residential buildings. Civil representatives petitioned for subsidized buffers, stating the price hikes violate basic winter life support lines. Security details remained high near the town hall during negotiations.',
    fullTextZh: '阿拉木图地方公共供暖企业向市政听证会正式提交审计呈批，为其拟议中的商业和住宅供暖费全季 35% 价格上调方案提供财务合理性辩护。市民阶层及低收入代表联名提交请愿书，抗议价格上涨突破基本民生底线，并提请国家财政划转补贴缓压。听证磋商期间，大楼附近安保维持高位。',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&auto=format&fit=crop',
    kpiImpact: [
      { kpi: 'Utility Bill Price Hike Metric', kpiZh: '集中供暖及能耗账单跃升系数', deltaPct: 35.0 },
      { kpi: 'Social Discontent Score', kpiZh: '当地居民负面舆动扩散指数', deltaPct: 12.8 }
    ]
  },
  {
    id: 'DOM-NEWS-003',
    scope: 'domestic',
    source: 'Kazinform',
    sourceZh: '哈通社中文网',
    sourceUrl: 'inform.kz',
    severity: 'low',
    severityLabel: 'LOW',
    region: 'Atyrau Basin (Block E)',
    regionZh: '阿特劳次盆地中区 (Block E)',
    timeAgo: '3 hours ago',
    timeAgoZh: '3 小时前',
    title: 'KMG Exploration Drills Prolific Sweet Oil Well Deeps, Confirming Massive Caspian Sub-salt Reservoirs',
    titleZh: '哈燃料天然气集团 (KMG) 勘探钻获高产轻质甜油溢入流，侧面侧证盐下储量',
    fullText: 'KazMunayGas (KMG) exploration rigs have completed an advanced sub-salt appraisal test in the Atyrau region. Core sampling confirms light sweet oil grades at high hydrostatic pressures, promising long-term recovery curves that outclass previous regional forecasts by 15% with zero additional H2S extraction penalties.',
    fullTextZh: '哈国油气开发集团 (KMG) 勘探钻机在阿特劳主力沉积岩盆地外侧顺利完成了深井盐下油气资源多点物探评价。岩芯抽样结果证实储层含有大量低粘度、低硫轻质甜原油，长线可采地质储量及采收率较之前官方审定基准超出 15%，且无需额外负担酸性剧毒硫化氢二次脱硫设备折旧成本。',
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=500&auto=format&fit=crop',
    kpiImpact: [
      { kpi: 'Caspian Proven Reserves Index', kpiZh: '里海本属盆地探明油藏储备修正', deltaPct: 4.5 },
      { kpi: 'National Oil Export Potential', kpiZh: '国家长期原油外运商贸上限空间', deltaPct: 1.8 }
    ]
  },
  {
    id: 'DOM-NEWS-004',
    scope: 'domestic',
    source: 'Astana Times',
    sourceZh: '阿斯塔纳时报',
    sourceUrl: 'astanatimes.com',
    severity: 'medium',
    severityLabel: 'MED',
    region: 'Astana Headquarters',
    regionZh: '阿斯塔纳总部枢纽',
    timeAgo: '5 hours ago',
    timeAgoZh: '5 小时前',
    title: 'KMG Re-signs Long-term Strategic Crude Export Supply Pact With China Sinopec Group',
    titleZh: '哈萨克国家油气 (KMG) 正式与中国石化集团长签未来四年战略原油管网外运排期',
    fullText: 'A high-level trade council in Astana finalized KMG’s strategic crude oil supply renewal with China’s Sinopec Group. The updated agreement secure firm allocation schedules for the next 48 months with premium pricing indexes tied to the Brent-to-WTI crack spread, ensuring absolute cash flow liquidity for KZ upstream pipelines.',
    fullTextZh: '位于阿斯塔纳的国家商业理事重臣最终核准了 KMG 与中国中石化集团的战略供货长协合同一揽子草案。新签订的长期供销纲要锁定了未来 48 个月内硬性原油管道物理输量以及港口轮渡发运排表，调峰计价采用更适配布伦特现货的宽幅裂解公式，可有力锁定哈国上游外发骨干干线的现金流收益。',
    image: 'https://images.unsplash.com/photo-1521791136368-1a46827d0575?w=500&auto=format&fit=crop',
    kpiImpact: [
      { kpi: 'Strategic Export Long-Term Revenue', kpiZh: '国家长周期战略油气商售总应收款', deltaPct: 5.2 },
      { kpi: 'China Pipeline Throughput Rate', kpiZh: '对华大口径物理长输管线平均管道压力', deltaPct: 2.3 }
    ]
  },
  {
    id: 'DOM-NEWS-005',
    scope: 'domestic',
    source: 'Khabar 24',
    sourceZh: '哈巴尔24电视台',
    sourceUrl: '24.kz',
    severity: 'low',
    severityLabel: 'LOW',
    region: 'Aktau Port Terminal',
    regionZh: '阿克套港口总发运区',
    timeAgo: '8 hours ago',
    timeAgoZh: '8 小时前',
    title: 'Aktau Port LNG Re-gasification Monthly Throughput Exceeds Winter Peak Surcharges by 14.5%',
    titleZh: '阿克套海港LNG转运与再气化液位刷新冬季以来月度吞吐量记录 +14.5%',
    fullText: 'The Port of Aktau LNG dispatch logs confirmed a strong mid-quarter throughput surge. Tanker scheduling software optimized turnaround delays down to 18 hours per vessel, driving record volume swaps to regional distribution rings. Increased dry gas supply lines effectively stabilized Mangystau’s local gas turbine grids.',
    fullTextZh: '阿克套国际商港液化气站（LNG）周调度日报核实，由于对船期排表软件引进了基于AI的多因子离港算法，使单船实际平均在港装卸作业时耗由原先26小时压减至 18 小时。日吞吐能力的阶跃大大提升了该转运走廊向曼吉斯套、西哈萨克斯坦等腹地民用和工业多路中联高压阀室并网注气的速率，有效提振了西电网主力热力燃气涡轮机组的安全裕度。',
    image: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=500&auto=format&fit=crop',
    kpiImpact: [
      { kpi: 'Aktau Port LNG Daily Throughput', kpiZh: '阿克套港LNG每日气化输送总量 (千吨)', deltaPct: 14.5 },
      { kpi: 'West-Grid Peak Supply Margin', kpiZh: '西哈萨克斯坦主力供热点火回馈容量', deltaPct: 6.2 }
    ]
  },
  {
    id: 'DOM-NEWS-006',
    scope: 'domestic',
    source: 'Kazinform',
    sourceZh: '哈萨克行业新闻网',
    sourceUrl: 'inform.kz',
    severity: 'low',
    severityLabel: 'LOW',
    region: 'Astana Policy Center',
    regionZh: '阿斯塔纳绿色转型办公室',
    timeAgo: '12 hours ago',
    timeAgoZh: '12 小时前',
    title: 'Ministry of National Economy Formally Registers 2030 Renewable Energy Roadmap Mandates',
    titleZh: '哈萨克国家经济部正式发布《2030国家清洁能源并网与跨区碳平衡交易试点暂行条例》',
    fullText: 'The Cabinet of Ministers officially adopted the 2030 Green Transition Roadmap. The decree establishes automatic tax concessions for modern heavy wind equipment imports while mandating traditional coal power plants in Karaganda and Ekibastuz to purchase a minimum 15% clean offset from Western solar/wind grids starting next season.',
    fullTextZh: '哈内阁联席委员会审议并正式核发《2030 绿色低碳开发纲要》。该指令首次自顶向下确定：对于直接购买或租赁兆瓦级风机、重型长寿命电池等装备的开发主体，推行专项增值税全额退税；同时硬性勒令卡拉干达、巴甫洛达尔及埃基巴斯图兹的超高排放纯燃煤机组，自下半年核算窗口起，其必购绿碳抵消指标不得低于全省并网总负荷的 15%。',
    image: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=500&auto=format&fit=crop',
    kpiImpact: [
      { kpi: 'Carbon Intensity Decapital', kpiZh: '跨区供电全域等效二氧化碳排量减幅', deltaPct: -3.8 },
      { kpi: 'Green Capex Investment Inflows', kpiZh: '绿色清洁电力重装备民间资本流入量', deltaPct: 15.0 }
    ]
  },

  // --- OVERSEAS NEWS ---
  {
    id: 'OVER-NEWS-001',
    scope: 'overseas',
    source: 'CNN',
    sourceZh: '有线电视新闻网 (CNN)',
    sourceUrl: 'cnn.com',
    severity: 'critical',
    severityLabel: 'CRITICAL',
    region: 'Natanz, Iran / Middle East',
    regionZh: '伊朗纳坦兹核基地 / 地缘局势',
    timeAgo: '28 min ago',
    timeAgoZh: '28 分钟前',
    title: 'US Joint Command Confirms Precision Air Strike Deployed on Iran Natanz Nuclear Facets',
    titleZh: '中东战云激起：美军大黄蜂编队夜间定点空袭伊朗纳坦兹重水核电机组厂房',
    fullText: 'A sudden wave of stealth fighters completed high-altitude precision penetrations targeting underground power and heavy enrichment facilities near Natanz. Regional anti-air divisions responded with retaliatory battery dumps. Geopolitical crude futures spiked immediately over fears of wider Persian Gulf supply lane restrictions.',
    fullTextZh: '中东突发：美军驻海外多支夜战隐形中队对伊朗纳坦兹要害的高防护核研发与地下动力厂房，实施了长达8分钟的外科手术式导弹突防摧毁。波斯湾防空师随即向空中倾泻大量拦截防空弹。全球布伦特、WTI原油即期期货价格在开盘后5分钟内狂拉，多国商业同盟紧急研判霍尔木兹海峡全面停航的对冲保险规画。',
    image: 'https://images.unsplash.com/photo-1599728518742-5baefe286b24?w=500&auto=format&fit=crop',
    kpiImpact: [
      { kpi: 'Global Brent Spot Index', kpiZh: '全球即期原油海运基本运价指数 (运价元/吨)', deltaPct: 4.2 },
      { kpi: 'Kazakh Export Price Negotiation Leverage', kpiZh: '哈国原油由于红海改道获得的长焦溢价', deltaPct: 1.8 }
    ]
  },
  {
    id: 'OVER-NEWS-002',
    scope: 'overseas',
    source: 'Reuters',
    sourceZh: '路透社',
    sourceUrl: 'reuters.com',
    severity: 'medium',
    severityLabel: 'MED',
    region: 'Vienna / Austria',
    regionZh: '维也纳 / OPEC+ 秘书处',
    timeAgo: '2 hours ago',
    timeAgoZh: '2 小时前',
    title: 'OPEC+ Ministerial Council Decides to Extend Existing 2.2M bpd Voluntary Production Cuts',
    titleZh: '维也纳卡特尔部长联席会官宣：现有每日 220 万桶限产红线将被迫延长',
    fullText: 'The Vienna cartel session agreed to extend voluntary oil supply restrictions until the end of Q3. Leading fuel exporters cited mounting storage gains across East-Asia. The extension provides a strong base floor for medium-grade CPC blend prices despite slight commercial friction reported by several member state representatives.',
    fullTextZh: 'OPEC+ 轮值理事大会在一致表决中，达成关于将原定本月到期的每日 220 万桶原油自愿限产配额再度向后硬性顺延六个月。沙特、伊拉克和安哥拉等代表强调，近期海上漂浮油船在美洲、亚洲卸港延阻明显（有短期需求冷缩预警）。此次展期虽然招致个别小国财政部长的不满，但为CPC拼混油价提供了厚实的长期地板防御阻尼。',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=500&auto=format&fit=crop',
    kpiImpact: [
      { kpi: 'Global Supply Buffer Volatility', kpiZh: '世界闲置原油边际流动供给容纳空间', deltaPct: -2.1 },
      { kpi: 'KZ Oil Export Premium MoM', kpiZh: '哈萨克斯坦重混原油长协装船溢价', deltaPct: 1.5 }
    ]
  },
  {
    id: 'OVER-NEWS-003',
    scope: 'overseas',
    source: 'CCTV',
    sourceZh: '央视网新闻',
    sourceUrl: 'cctv.com',
    severity: 'low',
    severityLabel: 'LOW',
    region: 'Beijing / China',
    regionZh: '北京 / 中国国家发展改革委',
    timeAgo: '4 hours ago',
    timeAgoZh: '4 小时前',
    title: 'State Council of China Approves KZT 120B High-Voltage Smart Power Core Interconnection Belt',
    titleZh: '中方批准建设千亿级西北柔性特高压直流智慧电网网络，计划向中亚国家并网联供',
    fullText: 'China finalized structural capital injections to construct ultra-high-voltage smart grid channels spanning northwestern provinces. The mega infrastructure facilitates clean wind delivery to coastal hubs while forming technical hookups with the central Asian energy grid system, optimizing cross-border power balance pools.',
    fullTextZh: '中国发改委及国家电网会商通过全新特大型特高压（UHV）直流智能电网西北大跨步并网规划，投资核定过高。该重点互联基建可就近接入西北大规模沙漠风光电池群并输往沿海工业区，同时预留了中亚区域、哈萨克斯坦电网变压换流对并直连插口，在寒潮季节开启多边应急跨国调频相互反哺。',
    image: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=500&auto=format&fit=crop',
    kpiImpact: [
      { kpi: 'UHV Interconnection Flow Peak', kpiZh: '跨区域柔性特高压并网直供设计峰值 (MVA)', deltaPct: 11.2 },
      { kpi: 'KZ Clean Grid Off-take Rate', kpiZh: '哈国西北部富余余热/绿色并网吸纳系数', deltaPct: 4.5 }
    ]
  },
  {
    id: 'OVER-NEWS-004',
    scope: 'overseas',
    source: 'Bloomberg',
    sourceZh: '彭博商业周刊',
    sourceUrl: 'bloomberg.com',
    severity: 'medium',
    severityLabel: 'MED',
    region: 'Brussels / European Union',
    regionZh: '布鲁塞尔 / 欧盟理事会',
    timeAgo: '5 hours ago',
    timeAgoZh: '5 小时前',
    title: 'European Union Releases Q3 CBAM Carbon Tariff Draft Mandates For Metallurgical Imports',
    titleZh: '欧盟定案第三阶段 CBAM 边界高耗能重污染惩罚关税，独联体钢铁冶金业承压',
    fullText: 'The European Commission published the final transition rules for the Carbon Border Adjustment Mechanism (CBAM). Non-reformed metallurgical and chemical production hubs face up to €82 per ton tariffs, forcing Eastern partners to accelerate laser emission audits and verification systems to avoid painful trade margin decay.',
    fullTextZh: '欧盟碳关税（CBAM）过渡执行指南最终敲定发布。未能升级低排放冶金、特种肥料、深加工水泥等矿冶重工业外包出口商，未来面临可能高达每吨82欧元的刚性“排碳进口关税”。这将逼迫中亚钢铁企业及中上游厂矿紧急追加基于LIDAR排放计量的微观现场数采合规传感器设施。',
    image: 'https://images.unsplash.com/photo-1605007493699-af65834f8a02?w=500&auto=format&fit=crop',
    kpiImpact: [
      { kpi: 'CBAM Compliance Tech Expense', kpiZh: '硬性低碳及微观合规自诊断软硬设投入折现支出', deltaPct: 18.2 },
      { kpi: 'European Export Profit Margins', kpiZh: '原冶炼高碳金属输欧最终实际结算毛利率', deltaPct: -4.5 }
    ]
  },
  {
    id: 'OVER-NEWS-005',
    scope: 'overseas',
    source: 'Al Jazeera',
    sourceZh: '半岛电视台',
    sourceUrl: 'aljazeera.com',
    severity: 'critical',
    severityLabel: 'CRITICAL',
    region: 'Red Sea Straits',
    regionZh: '红海南亚交汇海峡',
    timeAgo: '8 hours ago',
    timeAgoZh: '8 小时前',
    title: 'Armed Drone Fleet Targets Heavy Class LNG Tanker, Forcing Extended Maritime Route Diversions',
    titleZh: '突发无人机群重创红海巨型重载液化天然气货船，逼迫全球班轮改道好望角',
    fullText: 'A high-speed swarm of kamikaze drones successfully breached regional security rings, hitting a commercial liquefied natural gas carrier in deep-water straits. Most shipping alliances instantly halted direct passes, routing fuel carriers around Africa’s Cape of Good Hope, creating massive shipping premium overcharges.',
    fullTextZh: '红海突发：高阶制导自杀无人机突破联合海上驱逐护盾防线，以一阶俯冲精准撞坏美商一艘万吨干式多舱LNG（液化气）巨型混运运输轮的主推进排烟口。多大巨头包括马士基、地中海航运在内迅速下达全改线禁运红海指令，折头南下绕行南非好望角，直接导致全球即期特种危险化学品运力即时暴发超差危机。',
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=500&auto=format&fit=crop',
    kpiImpact: [
      { kpi: 'Ocean Freight Spot Surcharge Rate', kpiZh: '远洋即期外贸保赔船期滞港滞箱附加费指数', deltaPct: 28.0 },
      { kpi: 'Regional LNG Spot Price Tick', kpiZh: '西欧近端液化气到岸（FOB）即时市场挂牌溢价', deltaPct: 8.5 }
    ]
  },
  {
    id: 'OVER-NEWS-006',
    scope: 'overseas',
    source: 'Reuters',
    sourceZh: '路透社驻亚洲分部',
    sourceUrl: 'reuters.com',
    severity: 'low',
    severityLabel: 'LOW',
    region: 'Beijing / Astana Pivot',
    regionZh: '北京 / 阿斯塔纳 油气联络线办公处',
    timeAgo: '1 day ago',
    timeAgoZh: '1 天前',
    title: 'Central Asia-China Pipeline Route-D Starts Front-End EPC Bidding Cycles',
    titleZh: '中亚-中国天然气骨干管线 D 线大通道工程于国内与中亚多国联合开启前置设计及采购总包招标',
    fullText: 'Major pipeline EPC syndicates have formally opened front-end engineering design and procurement tenders for the long-awaited Route-D connector. Once built, this branch will add 30 billion cubic meters of natural gas throughput annually, feeding China’s main high-pressure industrial rings from fields across Kazakhstan and Turkmenistan.',
    fullTextZh: '千呼万唤的中亚输气干线 D 线工程（横贯塔、乌等，多端哈萨克复并接入）今日在哈首府联合印发一阶段基础工程深化设计与全线重合金长输管道阀室采购的 EPC 全球公开联合招标细制。此标志性丝路纽带建成后，将向中国西部至长三角日夜滚注 300 亿标准立方米长合干线路网天然气。',
    image: 'https://images.unsplash.com/photo-1535732759880-bbd5c7265e3f?w=500&auto=format&fit=crop',
    kpiImpact: [
      { kpi: 'KZ-China Pipeline Capacity', kpiZh: '中国-中亚联合多口径大通量输气系统总体容积荷载', deltaPct: 30.0 },
      { kpi: 'Samo-Gas Investment Volume', kpiZh: '首批上游多期油藏及联合压气井口建设投资中方拨货比例', deltaPct: 12.0 }
    ]
  }
];
