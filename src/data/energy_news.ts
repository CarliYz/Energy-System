// src/data/energy_news.ts

export type NewsSeverity = 'HIGH' | 'MED' | 'LOW';

export interface NewsItem {
  id: string;
  time: string; // HH:mm format
  severity: NewsSeverity;
  region: string;
  title: string;
  summary: string;
  relatedCase?: string;
  impactKpi?: string;
  kpiImpacts?: { name: string; change: number }[];
  fullText?: string;
}

export const energyNews: { domestic: NewsItem[]; international: NewsItem[] } = {
  domestic: [
    {
      id: 'n_d_001',
      time: '06:42',
      severity: 'HIGH',
      region: 'Aktau',
      title: '阿克套压缩站 02 检测到压力异常',
      summary: 'SCADA物理监测压力大幅失衡越限，已自动联动 EventAudit 立案 CASE-2026-001。',
      relatedCase: 'CASE-2026-001',
      impactKpi: 'gas_throughput',
      kpiImpacts: [
        { name: '往复气相压力', change: 24 },
        { name: '管线通过速率', change: -12 },
        { name: '日输送量', change: -8 }
      ],
      fullText: '阿克套首站高频SCADA物联网传感器于今日清晨检测到2号压力容器吸气压力非稳态剧烈偏离。中央控制室实时核准后触发大模型自组织研判，发现其物理参数严重跃升。该事件具有明确的超产、瞒产抢跑嫌疑，系统决定将其作为关键实物量疑点，联动流程审计泳道建立一号专项案件 CASE-2026-001。'
    },
    {
      id: 'n_d_002',
      time: '06:15',
      severity: 'MED',
      region: 'Almaty',
      title: '阿拉木图燃气价格政策调整引发公众讨论',
      summary: '地方能源局计划于下季度微调民用液化气补贴，社交网络舆情监控指标出现明显波动。',
      impactKpi: 'sentiment_sentiment',
      kpiImpacts: [
        { name: '民生情绪负极性', change: 18 },
        { name: '社媒讨论热度', change: 35 }
      ],
      fullText: '阿拉木图市阿基马特（市政府）联合自然资源部发布《关于第二季度公用事业供暖与民用燃气阶梯费率核定草案》。根据对今日网络社交媒体的自动舆情监测，该价格政策调整意向引发部分网民强烈关切，在多个本地Telegram群组和TikTok端形成集中讨论热潮，舆情恐慌极性上升。'
    },
    {
      id: 'n_d_003',
      time: '05:30',
      severity: 'MED',
      region: 'Aktobe',
      title: '阿克纠宾炼油厂例行检修进度汇报',
      summary: '1号重整加热炉完成碳盘查及热效率调测，预计将于 48 小时后正式复工注入主管网。',
      impactKpi: 'refinery_throughput',
      kpiImpacts: [
        { name: '提炼日负荷', change: 0 },
        { name: '热能转换效率', change: 3.2 }
      ],
      fullText: '作为哈萨克斯坦西部重要的油气化工提炼基地，阿克纠宾炼化厂今日向能源部提报其1号重整装置年度碳减排改进与大修验收日志。经核动力传感器和烟气流速雷达实时比对，其本次调试期间申报能耗曲线与真实电网消耗、热效参数高度自洽。'
    },
    {
      id: 'n_d_004',
      time: '04:12',
      severity: 'LOW',
      region: 'Kashagan',
      title: '卡沙甘深海油田储储量与开采寿命月报',
      summary: '最新探明断块二次地质物理成像完成，评估其可采周期在现有速率下可向上修正 1.2 年。',
      impactKpi: 'oil_production',
      kpiImpacts: [
        { name: '剩余可采寿命', change: 6.8 },
        { name: '探明总储量', change: 2.1 }
      ],
      fullText: '哈萨克斯坦沙甘国家石油联营体提报新一轮储层地层学数字测绘。采用超深多道三维物发声学波阻抗技术，探明其一号缝洞储集体边界向外延伸了 45 米，按目前的开采节奏测算，静态服务寿命可以延长至少1.2年，增强了中长期战略供需的自给安全边界。'
    },
    {
      id: 'n_d_005',
      time: '03:45',
      severity: 'HIGH',
      region: 'Nur-Sultan',
      title: '国家骨干电网电降频率短暂偏离 ±0.4Hz',
      summary: '北部超重工业区突发负荷阶跃，国家电网（KEGOC）紧急调度南水北电调节系统。',
      impactKpi: 'grid_stability',
      kpiImpacts: [
        { name: '国家电网自给率', change: -5.4 },
        { name: '高峰备用负荷率', change: -15 }
      ],
      fullText: '今日清晨，国家骨干输电网500千伏主变断路器侧，遥测到频率短暂下跌至49.6赫兹，偏离差值达±0.4Hz触碰高危安全裕度。由于北部特种冶金基地突发自备发电机组掉线，国家电网调度中心在 3 秒钟内自动激活阿克套和南区级联调峰系统进行对冲调峰。'
    },
    {
      id: 'n_d_006',
      time: '02:20',
      severity: 'LOW',
      region: 'Atyrau',
      title: '阿特劳高位原油储槽碳减排及甲烷泄漏微量监测',
      summary: '手持光谱外勤监察组配合高光谱红外卫星核对，确认甲烷背景值回落到安全常开指标。',
      impactKpi: 'methane_emissions',
      kpiImpacts: [
        { name: '甲烷泄漏速率', change: -45 },
        { name: '绿能环评评级', change: 12 }
      ],
      fullText: '为配合国家最新的温室气体及碳排核查规范，阿特劳原油储运罐区与哈环境安全监理大队联动进行了拉网式物理成像检测。结果证实经过上期对3号储油浮顶阀实施泄放口闭环自愈阀件升级后，气相高光谱背景数据中的烃类流失较本月基准暴跌。'
    },
    {
      id: 'n_d_007',
      time: '01:50',
      severity: 'HIGH',
      region: 'Karachaganak',
      title: '卡拉恰甘纳克集气汇流阀体异常异动诊断',
      summary: '高频流量计数据显示分相波动存在喇叭口式增宽，疑有多点联合盗气瞒报，待进一步取证。',
      impactKpi: 'gas_discrepancy',
      kpiImpacts: [
        { name: '多口径偏差度', change: 14.5 },
        { name: '涉案嫌疑指数', change: 25 }
      ],
      fullText: '主管网数字汇流总表检测到名义输入同贸易交接表记录背离差值系统性扩张。大模型审查系统认为卡拉恰甘纳克西部3号共享计量支线存在严重的财务-物联网不匹配特异波动特征，疑似存在关联交易逃碳、偷产漏洞，指令要求现场外勤立刻实施行动。'
    },
    {
      id: 'n_d_008',
      time: '01:10',
      severity: 'MED',
      region: 'Uzen',
      title: '乌津油田增压机组 Unit-2B 高温气缸预警',
      summary: '二阶振动监测触发黄色警告信号，远程控制中心启动降功率限流机制。',
      impactKpi: 'compressor_health',
      kpiImpacts: [
        { name: '机组健康寿命', change: -15 },
        { name: '出气喉排量', change: -5 }
      ],
      fullText: 'SCADA反馈乌津地层回注压缩阀站动力活塞出现超出常态包络的异响波动，轴向偏摆加剧。为防止轴瓦热负荷过度熔毁引发气爆连锁爆炸，现场管理平台执行自愈操作控制，已对进入机组的介质流量主动降额10%，待专项检测工程师持生命周期维护表到场。'
    },
    {
      id: 'n_d_009',
      time: '00:40',
      severity: 'LOW',
      region: 'Pavlodar',
      title: '巴甫洛达尔石化成功引入重残芳烃绿色二次深加工线',
      summary: '本国原油自给精炼转化效率上升 1.8%，多环芳烃残留降低 35%。',
      impactKpi: 'refinement_rate',
      kpiImpacts: [
        { name: '精制综合油品率', change: 8 },
        { name: '工业固体废物量', change: -35 }
      ],
      fullText: '巴甫洛达尔精炼集团今日提报全新国产催化重整芳烃收率报告。这套由哈萨克斯坦化工科技院独立改造升级的工艺体系经过热试运行检验，能将原本极难转化的杂质石脑油深度降解为车用高辛烷值汽油，降低了对国外添加剂进口的依赖度。'
    },
    {
      id: 'n_d_010',
      time: '00:15',
      severity: 'MED',
      region: 'Mangistau',
      title: '曼吉斯套北部输配电高负荷跌落异常预警',
      summary: '3家特种重金属冶炼和高耗电矿场在同一瞬间拉电脱网，负荷瞬降 120MW。',
      impactKpi: 'load_variation',
      kpiImpacts: [
        { name: '网路电力供需差', change: 28 },
        { name: '暂态电压波动度', change: 8.5 }
      ],
      fullText: '国家电网中变配侧于午夜监测到超宽幅无功负荷脱离跃度。通过对该属地大型冶金企业的SCADA物理消耗表审计，发现存在疑似逃避高阶电费惩罚性费率而进行的联动串谋式人工限电拔线，已锁定涉事大客户名单转交国资监督和财务部门稽查。'
    }
  ],
  international: [
    {
      id: 'n_i_001',
      time: '05:55',
      severity: 'HIGH',
      region: 'USA · Texas',
      title: '得州 AI 数据中心电力需求同比 +47%',
      summary: '得州电网（ERCOT）负荷告急，恐拉动全球 LNG 出口价格急升，影响进口配额。',
      impactKpi: 'lng_price',
      kpiImpacts: [
        { name: '全球液化气标杆价', change: 16.5 },
        { name: '美口岸装船速率', change: 8.2 }
      ],
      fullText: '得克萨斯电力可靠性委员会（ERCOT）发布紧急电力供给警告：由于奥斯汀和休斯敦新建的多家吉瓦级AI超级数据中心和Token矿场同时开机，得州电网峰值在气温升高前暴拉+47%。这一巨大需求极大地消耗了原本发往欧亚的LNG气源，预期将在一周内拉动现货天然气结算价跳涨。'
    },
    {
      id: 'n_i_002',
      time: '05:15',
      severity: 'HIGH',
      region: 'Iran · Hormuz',
      title: '伊朗霍尔木兹海峡国际能源运输通道出现延误',
      summary: '由于海区电子对抗和GPS干扰层级在夜间极具攀升，导致多艘三十万吨超级油轮延迟交割。',
      impactKpi: 'cooper_rent_price',
      kpiImpacts: [
        { name: '地中海到货离港价', change: 11.2 },
        { name: '海运物流保障险', change: 48 }
      ],
      fullText: '海事卫星监测证实霍尔木兹通道附近，商船普遍反馈大范围的诱骗欺骗GPS信号和AIS失真。受地缘政治风波和地区冲突风险溢出，伦敦保费上调。这导致了亚洲经该海峡中转的传统原油供应在实货层面发生短缺预期，推高了哈萨克斯坦面向欧盟的管道替代气溢价。'
    },
    {
      id: 'n_i_003',
      time: '04:40',
      severity: 'HIGH',
      region: 'Ukraine · Europe',
      title: '俄乌输欧天然气边境中转点发生管体冲击报警',
      summary: '乌克兰苏贾（Sudzha）唯一正常通气的分输首站录得瞬态逆向压差，局部流量停摆。',
      impactKpi: 'gas_price',
      kpiImpacts: [
        { name: '欧洲 TTF 燃气价格', change: 22.4 },
        { name: '哈气输意德供货额', change: 14.8 }
      ],
      fullText: '苏贾首站压力数据今日剧烈波动并闪现紧急报警。由于沿线变电配电物理侧遭遇未知电磁干涉，局部管道气体控制阀意外紧急锁定，过境气源一度重置为零。作为欧洲目前唯一的东部管道生命线受损，直接拉动次日 TTF 天然气期货价格指数暴拉超 22%。'
    },
    {
      id: 'n_i_004',
      time: '03:12',
      severity: 'MED',
      region: 'Saudi Arabia',
      title: 'OPEC+ 闭门财长会透露将落实第三阶段减产',
      summary: '沙特重申将协同各联盟国削减体外日产150万桶直到四季度结束，强力捍卫油价。',
      impactKpi: 'brent_crude',
      kpiImpacts: [
        { name: '布伦特原油收盘', change: 4.8 },
        { name: '本国油税边际价值', change: 11.1 }
      ],
      fullText: '沙特阿拉伯能源大臣于利雅得非正式向核心原油出口伙伴重组口径：多国计划强力落实对超出国家上限的自发配额执行深度扣除惩戒。该意图使布伦特一跃稳住2026年第二季度的地板底线价，本国油气巨头如 KazMunayGas 后续财务报表的现金流预计也随之改善。'
    },
    {
      id: 'n_i_005',
      time: '02:50',
      severity: 'LOW',
      region: 'China',
      title: '中国提报第一季度 LNG 进口到港总量破新高',
      summary: '华东及沿海储罐群全容量负荷运行，拉运吞吐增长证实对哈管道天然气长协履约依赖极强。',
      impactKpi: 'china_export_gas',
      kpiImpacts: [
        { name: '向东出口管道通量', change: 5.4 },
        { name: '长协履约结算系数', change: 1.2 }
      ],
      fullText: '中国海关总署最新提报一季度液化天然气大表：其LNG实际进口重度偏高。虽然现货海运到货充裕，但为防范太平洋霍尔木兹及马六甲海峡的瞬态地缘拦截，其依然在长三角等工业重核区域大幅调用哈萨克斯坦的陆路管道输入，这极大地保障了我国的西线长协流向稳定性。'
    },
    {
      id: 'n_i_006',
      time: '02:05',
      severity: 'MED',
      region: 'EU · Brussels',
      title: '欧盟碳边境关税（CBAM）最新评定细则生效',
      summary: '针对从非欧盟地进口的重金属和初级化石能源制成品，必须强制合并真实的碳指纹证书。',
      impactKpi: 'cbam_compliance',
      kpiImpacts: [
        { name: '铝/钢出口碳成本', change: 35 },
        { name: '绿色清洁电费价', change: 18.2 }
      ],
      fullText: '布鲁塞尔CBAM评定委员会宣布对第三国出口商的边境申报数据开展更为严厉的非现场审计审查。如果没有提供基于SCADA物理在线流和可信审计师背书的碳减排报告，出口链将被征收每吨 75 欧元的碳排调节和清算代币。这一举措极大刺激了哈萨克斯坦出口企业推进绿色重构的研发投入。'
    },
    {
      id: 'n_i_007',
      time: '01:35',
      severity: 'HIGH',
      region: 'Iraq',
      title: '伊拉克北部拜伊吉（Baiji）炼油基地遭无人机袭击',
      summary: '突发未知烈度爆炸引致一号原油常减压机组群剧烈燃烧，两小时内全部瘫痪停摆。',
      impactKpi: 'iraq_refine_cap',
      kpiImpacts: [
        { name: '中东汽油成品率', change: -35 },
        { name: '原油出口现货价', change: 7.4 }
      ],
      fullText: '巴格达国防监视雷达反馈数架隐身游荡自爆机低空躲过防空网，精准命中了拜伊吉大型重质石油精练塔罐。基地现场黑烟高耸，由于主力重整催化区彻底烧毁，预计该国国内在未来三个月内将丧失近三分之一的基础柴油转换产能，从而加剧了波斯湾对哈成品油进购的对冲性竞标。'
    },
    {
      id: 'n_i_008',
      time: '01:12',
      severity: 'LOW',
      region: 'Brazil',
      title: '巴西超大型盐下油田 Libra 新采油轮成功联机投运',
      summary: 'FPSO（深海浮式采油轮）开始注入生产，首期释放日均 15 万桶轻质原油开采配额。',
      impactKpi: 'latin_supply',
      kpiImpacts: [
        { name: '南美沿海生产指数', change: 12.5 },
        { name: '全球原油供应溢出度', change: 1.8 }
      ],
      fullText: '巴西石油公司宣布深水Libra超大盐下含油层第二阶段采油调试首创佳绩，利用海底多相高阻回注泵成功实现了名义峰值的安全抽取。大洋洲和拉丁美洲油气高负荷供给能够有效稀释中东动荡带来的情绪溢价，使得北美西海岸整体能用指数波动保持在安全区间。'
    },
    {
      id: 'n_i_009',
      time: '00:50',
      severity: 'MED',
      region: 'Japan',
      title: '福岛一号及新潟电厂核能发电机组重启进度遭遇反抗',
      summary: '环保政党和本地居民因冷却水稀释问题举行拉网式街头抗议，重启日程被无限期延迟。',
      impactKpi: 'japan_coal_demand',
      kpiImpacts: [
        { name: '远东重载动力煤价', change: 8.4 },
        { name: '日国LNG长协超购率', change: 6.2 }
      ],
      fullText: '东京都原子能规制保障厅接到地方递呈，针对重启新潟刈羽变电核能进行暂缓抗辩。由于民众在冬季用电到来前对复苏核反应堆怀极深反感，日本各主力电力巨头不得不继续在世界现货大盘狂揽天然气和高卡动力煤，这使得哈萨克斯坦北部煤炭铁路线后续出省吞吐保持满载。'
    },
    {
      id: 'n_i_010',
      time: '00:25',
      severity: 'LOW',
      region: 'Norway',
      title: '挪威国家油气公司（Equinor）部署北海风电电解高纯氢示范首成功',
      summary: '250兆瓦深海离岸机组直连质子膜电解槽，正式注入该国面向英国的主输氢母网。',
      impactKpi: 'green_hydrogen',
      kpiImpacts: [
        { name: '北海绿氢名义产率', change: 15 },
        { name: '英国燃气依存度', change: -2.3 }
      ],
      fullText: '挪威完成了革命性“深海风电直接电解液态氢”物理管汇安全试验。利用巨型多风力发电设备直接在海上升压转换电解高纯水，免除了陆上输电的超偏离损耗。所生成的绿氢混入欧洲大陆天然气干线，代表了全球在降低工业传统碳指纹技术方向上的又一个巨大物理跨越。'
    }
  ]
};
