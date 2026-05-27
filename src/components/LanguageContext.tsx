import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'zh';

const DICTIONARY: Record<string, string> = {
  // Menu items
  'Act I · Panoramic Risk Sensing': '第一幕：全景安全风险感知',
  'Act II · Pre-emptive Warning': '第二幕：物理行为早期预警',
  'Act III · Closed-Loop Attribution': '第三幕：多源穿透行为归因',
  'Act IV · Audit & Brief': '第四幕：呈阅公文与流程审计',
  'Intelligence Modules': '智能研判决策组件',
  'Minister Dashboard': '部长专属决策总控大屏',
  'National Energy Grid': '国家能源与电能骨干网',
  'Regional Facilities': '阿克套区域设施工业遥测',
  'Facility Profile': '高频SCADA物联网物理测点',
  'Pipeline Time-Series': '气体输送管线高频时序分析',
  'Enterprise Reporting': '三口径多源异构偏差归集',
  'Sentiment & Opinion': '里海利益链及宏观舆情监测',
  'Workflow Attribution': '多智能体自组织联合判归',
  'Commercial Graph': '客商空壳穿透与利益图谱',
  'Regulatory Effectiveness': '反规避监管惩戒效能评估',
  'Anti-Evasion Enforcement Efficacy': '反规避监督惩戒效能评估',
  'Life-Cycle Audit Trail': '全周期全泳道大闭环数字审计',
  'Minister Brief': '起草呈阅公文及报告编辑器',
  'Real-Time Sensing': '网路状态感知',

  // Top header elements
  'AI Statecraft': '能源监管决策AI',
  'For Minister': '部长专属内线系统',
  'Energy': '能源国家安全保障',
  'Scenario': '监管分析场景',
  'National Fuel & Energy Oversight — 2026.Q2': '国家燃气与能源储备及安全自检分析看板 — 2026.Q2',
  'Field': '外勤实勘口径',
  'Analyst': '智能体审计口径',
  'Executive': '部长决策口径',
  'Reset System': '系统全局状态重置',
  'LATENCY': '中央网管信号时延',
  'INGEST': '遥测传感器实时吞吐数据量',
  'Secure Enclave Active': '安全隐私硬件机密计算通道激活',
  'Operator Minister_Office': '当前操作员: 部长办公室秘书处安全网口',

  // UI Common Elements
  'Context: National Energy Grid': '当前视图: 国家能源网络图谱',
  'Live': '实时监控',
  'Pre-Event': '事前研判',
  'Traceability': '全流程追溯',
  'LAST SYNC': '最后数据同步时间',
  'NEXT REFRESH': '离下次基线重算还有',
  
  'ELECTRICITY': '电网网络',
  'OIL & GAS': '石油与天然气网络',
  'COAL': '煤炭交通网络',
  'HEATING (PENDING)': '集中供热和热力管网 (待接入)',

  // Page: NationalGrid.tsx
  'GRID CAPACITY INDEX': '国家能源流综合承载力指数',
  'ACTIVE TELEMETRY NODES': '在线遥测传感器节点口径',
  'CRITICAL ANOMALIES (24H)': '24小时紧急物理安全告警',
  'TOTAL ENERGY LOAD': '当前跨区总输出负荷 (MW)',
  'PEAK VS BASELINE': '尖峰负荷偏离安全裕度值',
  'ACTIVE EVENT STREAM - NATIONAL INTEGRATION': '实时安全监测事件流 — 统一调度中心',
  'SYSTEM STATUS': '总控制台状态',
  'FILTER CATEGORY': '地图展示图层',
  'ALL': '展示全部图层',
  'THERMAL': '火力发电厂',
  'HYDRO': '大型水能枢纽',
  'SOLAR': '大型光伏基地',
  'WIND': '兆瓦级风电场',
  'SUBSTATIONS': '超高压变电网',
  'OIL FIELD': '主力高位原油田',
  'GAS FIELD': '深层天然气开发中心',
  'REFINERY': '大型烃类提炼厂',
  'COAL MINE': '超大型露天煤矿',
  'MINE MOUTH': '大型坑口火力电站',
  'URANIUM': '铀矿采纯井区',
  'COAL RAIL': '电气化重载煤联专线',
  'MAP CONTROLS': '地图图幅控制',
  'CENTER KAZAKHSTAN': '回到哈萨克斯坦幅面中心',
  'TOGGLE LABELS': '切换物理位置名称标签',
  'LATENCY BASE': '遥测网物理时差',
  
  // Page: RegionalFacilities
  'Region Focus': '区域重点监测口径',
  'Regional Level Overview': '区域整体设施遥测口径一览',
  'Telemetry Heatmap': '阿克套物理空间SCADA温压流速热力图',
  'Active Anomalies': '未决设备运行超偏离异动告警',
  'Sensor Ingestion': '传感器每秒遥测信号吞吐速率',
  'SCADA Active Sensors': 'SCADA 系统活跃物理测点数量',
  'ACTIVE SENSORS': '活跃遥测节点 (个)',
  'HEALTH HIGHLIGHTS': '机组关键核心部件健康度（平均）',
  'SCADA INTEGRITY': '数采物理网数据包完整性',
  'CRITICAL WARNINGS': '重载测位严重越限次数',
  'MAP LAYOUT': '阿克套压缩阀站及管网物理连接拓扑图',
  'MAP SENSING': '阿克套实时工业物联遥测诊断看板',
  'SENSOR STREAMS': '高频SCADA测定波动率监测 (实时)',
  'DEVICE TELEMETRY DEVIATION': '设备现场采集流偏离额定物理基线值',
  'ALERTS AND ANOMALIES': '阿克套管线与站房运行异常诊断',
  'PHYSICAL DISCOVERY DETAIL': 'SCADA物理通道和工艺流程穿透详情',

  // Page: PipelineTimeSeries.tsx
  'Anomaly Stream Analysis': '燃气通过速率高频时序建模与早期诊断',
  'Statistical & ML baseline detection models': '基于无参数核密度与深度学习混合神经网络的残差比对算法群',
  'Active Anomalies Queue': '全场景设备物理自检与泄漏早期风险排队',
  'COMPRESSED TELEMETRY FLUX': '往复式压力机气压变化高频信号 (1Hz 采样)',
  'ALGORITHM DEVIATION COMPARISON': '多模型自适应物理量预测值与实际值残差比对',
  'LLM PROMPT VERIFICATION': '时序异常智能体认知链及文本审查证据要素',
  'CASE DETAIL SUMMARY': '外勤实勘及物理取证文字总结一览',
  'SIMILAR HISTORIC CASE': '往年历史高维图模式相似越权瞒报档案',
  'SIMILARITY': '事件图拓扑及波动相似度',
  'COMPRESSED SCADA SENSORS': '往复气相动力机组运行物理测点一览',
  'Algorithm Models': '残差评估算法选型',
  'Active Base': '活跃高频采样偏离',
  
  // Page: EnterpriseReporting.tsx
  'PAGE 2.2 · CROSS-SYSTEM CONSISTENCY VERIFICATION': '大屏 2.2 · 多套异构系统实物量与财务核定值一致性比对',
  'IDENTITY GRAPH · PHYSICAL RECONCILIATION': '图谱层：物理流量自相矛盾多口径异常核准关系网图',
  '6 source systems · 7 physical identities · breach edges weighted by deviation': '6重系统口径交叉核实 · 红色箭头代表偏差超过18%的违约漏报瞒报行为',
  'CRITICAL ≥ 18%': '红色重大瞒报嫌疑 (偏差 ≥ 18%)',
  'WARNING 5% - 15%': '橙色中度偏离基线 (偏离 5% - 15%)',
  'NOMINAL < 5%': '绿色正常合理物理测量波动 (< 5%)',
  'ANALYST NARRATIVE · CASE SUMMARY': '主审审计专家 · 案件案情和证据线索全景综述',
  'RECONCILIATION DETAIL MATRIX': '口径差交叉审计矩阵 (SCADA物理表 ↔ 贸易交接表 ↔ 企业财务和纳税申报比对)',
  'CROSS SYSTEM TELEMETRY': '三口径实际吞吐历史同步追溯曲线',
  'AUDIT DECISION ACTIONS': '全智能体决策与审理行动预案指令集',
  'DISCREPANCY MATRIX': '多源异构偏差归集映射矩阵',

  // Page: WorkflowAttribution.tsx
  'MULTI-AGENT ROOT CAUSE ATTRIBUTION WORKFLOW': '全景审计多智能体联合研判与定性归因决策工作流 (Case-2026-001)',
  'ACTIVE COOPERATING SPECIALISTS (6 LANES)': '多维度研判专家级智能体矩阵 (六条独立审计验证流一同归集)',
  'AGENTS SUMMARY': '各专业大模型智能体判定明细一览',
  'MASTER CONVERGENCE': '主智能体审计证据综合判定及部门处置决策',
  'MASTER VERDICT': '主智能体最终归因审理书',
  'PRIMARY ROOT CAUSE': '第一根本案由',
  'SECONDARY CAUSE': '第二间接促成因子',
  'TERTIARY CAUSE': '其他审计参考信息',
  'RECOMMENDED DECISION ACTIONS': '推荐采取的联合监管和实地执法指令（一键下达）',
  'EVIDENCE SYNTHESIS': '综合研判证据要素及贝叶斯信念演进演化路径',
  'COGNITIVE STEPS': '大模型多步自适应事实回溯流程',
  
  // Page: KnowledgeGraph.tsx
  'KNOWLEDGE GRAPH MINING': '里海非法控股及财务穿透知识图谱挖掘系统',
  'CO-CONSPIRACY RISK DISCOVERY & MULTI-HOP PATH INTEGRITY': '利益穿透：关联非法瞒产企业、虚构咨询空壳境外利益输送链深度多步追踪',
  'DISCOVER RISK PATHS': '已穿透识别的高危瞒产网络隐藏关联链',
  'SEARCH ENTITIES': '搜索实体名称或标识符',
  'TOTAL NODES': '图谱节点总数',
  'TOTAL EDGES': '连接关系总数',
  'RISK PATHWAY CHIPS': '已被红色标识的高危隐蔽控股利益输送链条',
  'ONTOLOGY CONFIG': '实体及关联关系图例说明',
  'SELECTED NODE PROPERTIES': '已选中关联实体物理档案与工商财税穿透数据',
  'PHYSICAL PROFILE': '物理物联指纹和业务行为关联分析',

  // Page: EventAudit.tsx
  'Lifecycle Audit Trail — 2D Process × Level Swimlane': '多维度全景业务进程二维泳道图 — 监管行动 × 属地监管层级',
  'AUDIT PROCESS STATUS LENS': '行政处罚、核准、查验进度实时审理轨迹',
  'AUDIT NODES MAP': '审理轨迹涉及的物联、财务及涉案节点拓扑',
  'ACTIVE AUDIT CASE': '当前正在接受穿透式合规核查的瞒产关联案件',
  'SWIMLANE VISUALIZER': '二维垂直泳道审计事件关联推演图谱',

  // Page: ReportGeneration.tsx
  'AUDIT STATEMENT BUILDER': '智能决策报告一键生成与合规评定引擎',
  'AUTOMATED DOCUMENTATION EXECUTIVE REPORT': '基于全链条多源证据与智能体裁决自动排版生成部长呈阅件陈述说明书',
  'GENERATE EXECUTIVE BRIEF': '一键智能排版生成部长呈阅公文',
  'DOCUMENT METRICS': '本次生成公文的字数核算及合规模拟评价指标',
  'WORD COUNT': '自动排版字数(字)',
  'COMPLIANCE RATING': '证据完备度及公文合规等级',
  'CONFIDENCE SCORE': '审计报告逻辑自洽指数',
  'GENERATED REPORT CONTENT': '自动一键智能排版的呈阅报告内容 (支持导出 PDF 及 Markdown 原始代码)',
  'DOWNLOAD PDF': '签字导出 PDF 正式呈阅件',
  'COPY MARKDOWN': '复制公文 Markdown 方便二次编辑',
  'RE-GENERATE STATEMENT': '重新优化大语言模型表达语句并重新生成',

  // Database / Entity names translate
  'Western Caspian Energy LLC': '西里海能源有限责任公司',
  'Western Caspian — Unreported night production (2025-09)': '西里海能源 — 夜间超额未申报生产案 (2025-09)',
  'Western Caspian — Unreported night production': '西里海能源 — 夜间超额违法生产与申报漏报案件',
  'Unreported Night Production': '未申报夜间偷产超产行为',
  'Night-time throughput +40.4% over 6 working days': '夜间管线燃气吞吐数据持续6日异常越限飙升+40.4%',
  'Active attribution case': '当前未决归因侦查案 (CASE-2026-001)',
  'Aktau Main Compressor': '阿克套物理首站一级压气厂房',
  'Uzen Oilfield Central': '乌津油田中央生产场站',
  'Uzen Compressor': '乌津物理增压站机组房',
  'Compressor Unit-2C filing': '关于外购往复余热余压压机Unit-2C补登注册报备申请',
  '2025 violation case': '2025年度恶意逃避物理数采合规案',
  'Caspi Holdings Ltd.': '卡斯比境外投资控股有限公司（空壳）',
  'Atyrau Trade & Logistics LLC': '阿特劳综合贸易与仓储物流有限责任公司',
  'Caspian Audit Partners': '里海国际联合财务审计师合伙人企业',
  'Aktau Custody Transfer': '阿克套港外贸出口能源交接与分输结算站',
  'Cash transfer 480M KZT': '大额异常境外咨询协议资金划转 4.8亿坚戈（KZT）',
  'Mangistau Petrochemical JSC': '曼吉斯套联合石化重金属化学工业股份公司',
  'Mangistau Petrochem Plant': '曼吉斯套石化基地炼化一分厂',
  'B. T. Iskakov': 'B. T. 伊斯卡科夫（总经理）',
  '2025 petrochem violation': '2025曼吉斯套石化夜间常压釜虚假报送案',
  'Pending warning': '阿特劳物流危化海关扣押未决黄色警告案',
  'Overturned clean report': '撤销第三方出具的无保留意见审计合规证书',
  'Fine 185M KZT': '对石化公司瞒报超产开具 1.85亿坚戈 环保合规罚金',
  'On-site inspection found unit': '外勤组现场实物测绘查获未申报特种压缩机组',
  'Tax-production discrepancy': 'Q1大中型企业纳税记录同SCADA物理折算严重背离标志',
  'Customs export +12% gap': '霍尔果斯海关实际物理输出流量与全省统计缺口+12%',
  'Shared metering node': '共轨高危共享工业自用阀门计量节点 (METER-AKT-044)',
  'Load-splitting pattern': '基于12月 load-profile 表明存在严重的跨关联方对冲瞒报特征',
  'Petrochem Sub-station 7': '曼吉斯套重化工一分厂第7机组变电配电站',
  'Caspian Coastal Wind': '里海沿岸兆瓦级清洁风能发电基地',
  'Uzen Main trunk': '乌津气水分离与物理分输主管网',
  'Aktau Sea Port Oil Terminal': '阿克套出海口万吨纯碱原油混输码头',
  'Caspi Bitum Refinery': '卡斯比中哈合资沥青原油二次精炼厂',
  'Aktau Export Custody Transfer': '阿克套外贸出口计量交收核验总表测位',
  'Uzen Compressor Station': '乌津地层回注与分相高压压气合建主站',
  'Karazhanbas Heavy Oil Field': '卡拉詹巴斯百米超特稠油电加热开采示范基地',
  'MAEK Desalination Plant': 'MAEK 大型工业循环水与海水提纯总厂',
  'Aktau MAEK CHP': '阿克套 MAEK 天然气高效汽轮热电联产电厂房',

  // Common types
  'ENTERPRISE': '工商企业实体',
  'Enterprise': '工商企业实体',
  'FACILITY': '核心工业设施',
  'Facility': '工业物理设施',
  'PERSON': '关键控制人员',
  'Person': '关键控制人员',
  'EVENT': '运行遥测异动事件',
  'Event': '物联异常告警事件',
  'CASE': '安全合规案件',
  'Case': '安全合规案件',
  'METER': '流量计计量装置',
  'Meter': '工业级高物理吞吐表',
  'SHELL': '纸面空壳虚控股实体',
  'Shell Company': '境外套利空壳实体',
  'AUDIT_FIRM': '第三方会计师所',
  'Audit Firm': '联合审计师事务所',
  'APPLICATION': '申报注册申请文本',
  'Application': '依申请权合规自检案',
  'TRANSACTION': '境内外大额转账交易',
  'Transaction': '异常资金离境事件',

  // Risk levels
  'CRITICAL': '严重违背违约',
  'WARNING': '中度警示偏差',
  'NORMAL': '基线正常波动',
  'FLAG': '异常告警拦截',
  'NOMINAL': '名义自检正常',
  'ACTIVE': '实时在线入流',
  'INFERRED': '大语言模型穿透推断',

  // Extra common data fields
  'registered': '工商设立注册日期',
  'head_office': '总部法律注册地点',
  'employees': '年度参保在册员工数',
  'industry': '国家行业细分板块',
  'detected_at': 'AI行为分析模型预警具体时间',
  'severity': '自适应危害危害严重评级',
  'commissioned': '竣工投入工业生产年份',
  'design_capacity': '国家规划设计额定日产量',
  'role': '工商登记中担任核心职务',
  'tenure_since': '法定代表人签字生效日期',
  'submitted': '电子件完备上传时间',
  'throughput_kw': '物理增能气吞吐增量',
  'occurred': '事实异常状态开始时间',
  'closed': '结案及部门归档日期',
  'fine_kzt': '行政惩治没收罚金 (KZT坚戈)',
  'violation_type': '违纪偷产瞒报具体行为认定',
  'jurisdiction': '公司设立国别与控股地缘',
  'declared_activity': '登记核准业务范围',
  'ai_flag': 'AI专家分类算法认定状态',
  'shareholder_disclosure': '穿透穿刺控股合规披露状态',
  'audits_completed_for_anchor': '针对涉事重点企业的核查审计频数',
  'coords': '国家GPS地理定位坐标',
  'amount_kzt': '涉林流向资金总额 (KZT坚戈)',
  'operator': '物理设备拥有者与具体经营商',
  'date': '出账和对账单汇款具体日期',
  'currency': '贸易清算约定币种',
  'licensed': '国家审计资格评定年份',
  'context': '处罚历史违规案情认定公文',
  'case': '审计关联案件卷宗',
  'issued': '行政处罚送达时间',
  'conducted_at': '实物测绘及外勤现场取证具体时间',
  'finding': '现场查明关键铁证具体描述',
  'for_entity': '涉案合规核心企业主代码',
  'detected': '比对时间',
  'tax_revenue_overage_pct': '财务大表税额超产瞒产背离度',
  'export_overage_pct': '海关统计实际货运量瞒超度',
  'registered_to': '共用计量表双方注册人代码',
  'discovery_method': 'AI判定及证据交叉匹配具体方案',
  'ai_confidence': '专家大模型逻辑穿透置信系数',
  'served_by_meter': '对应能源供应物理测距代码',
  
  // Specific page phrases - EventAudit.tsx columns & swimlanes
  'APPROVAL': '1-许可初审与在批',
  'REPORTING': '2-自主报送自检',
  'INSPECTION': '3-物理测绘与外勤',
  'SANCTION': '4-惩戒与合规履历',
  'RECTIFICATION': '5-问题项治理整改',
  'REVIEW': '6-多源物理交叉核对',
  'approval on hold ◀': '暂缓许可审批 ◀',
  'redo independence ◀': '独立性穿透重审 ◀',
  'compel re-report ◀': '下发强制纠偏核查令 ◀',
  
  // More specific ones
  'SUCTION PRESSURE DRIFT': '吸气测位压力高物理超差偏离',
  'METER TEMPERATURE OVERHEAD': '物联传感器测量腔异常高温偏离',
  'FLOW PULSING FREQUENCY ANOMALY': '主管网非稳态多声学脉冲超振报警',
  'Suction pressure exceeds baseline': '压力机吸口端常态气压越过理论基线极限',
  'Piston vibration peaks high': '动力气缸物理一阶往复不平衡力偏高',
  
  'Statistical (Rolling Mean ± 2σ)': '滑动残差统计法 (24H滑动均值 ± 2σ偏离)',
  '24-hour rolling mean ± 2 standard deviations.': '基于最近24小时滚动物理测量基准，计算两倍标准差偏离临界值。',
  'Kernel Density Estimator': 'KDE 非参数物理场核密度估计模型',
  'Learns non-parametric telemetry probability density.': '直接从遥测采样波形特征曲面学习多维高阶条件密流行。',
  'LSTM Network Regression': '深度双向循环神经网络时序预测基线',
  'Enables auto-regressive prediction with P90 warning borders.': '借助两层Bi-LSTM和前馈核估计重构高频P90动力运行可信范围。',
  
  'EVIDENCE GAINED: +40% THROUGHPUT UNEXPLAINED': '突破性物证：夜间管网天然气流量异常增加+40%（属于虚报名义能力）。',
  'PHYSICAL DISCOVERY: COMPRESSOR CATED AT STATION 7': '物理实勘：发现第7站存在未经环境主管审批擅自抢跑投运的往复式压机。',
  'MAPPING PATH RELATES TRANS TO SHELL': '追踪结论：还原出不正常咨询协议资金跨境支付链，多步穿透指向境外虚构套利通道。',
  'REGULATORY MATCH SIMILARITY IDENTIFIED': '模式认定：被调查企业时序瞒报特征，同2025年瞒报偷产结案卷宗，特征拓扑重合度达 0.91。',

  // Agent & Specializations Translations
  'Approval Agent': '许可生命周期分析智能体',
  'License/permit application & approval lifecycle analysis': '排污许可证、取水许可、特种设备操作等申报审批链实时比对',
  'Reporting Agent': '企业主动自评报送核验证书智能体',
  'Periodic enterprise self-report data cross-check': '跨月度自评报送吞吐量同外贸结算、SCADA实打实读数的对齐校验',
  'Inspection Agent': '移动外勤与特种实物现场测绘智能体',
  'On-site & remote inspection record analysis': '合规现场查验日志、外设特种装备运行小时、遥感成像的多维融合比对',
  'Sanction Agent': '历史合规履历及征信惩戒分析智能体',
  'Historical violation & sanction pattern matching': '调取多经营主体五年内由于擅自超产、虚假申报被省市部门惩戒档案',
  'Rectification Agent': '环境治理与整改事项闭环追踪智能体',
  'Mandated rectification execution tracking': '深度监管下达的关停、限期整改限流指令在SCADA中的闭环自愈轨迹监控',
  'Review Agent': '多源交叉融合审议终裁验证智能体',
  'Cross-departmental audit & multi-year pattern review': '合并多级海关出口、大型贸易伙伴进购、以及税务申报的宏观级联审计',
  'Master Audit Agent': '主审联合自组织研判合规研判总控智能体',
  'Cross-lane evidence synthesis & root-cause attribution': '串联激活多泳道物物对比铁证链路，实施贝叶斯自组织证据链拓扑会聚研判',

  // Headlines and descriptions from Case 001 Attribution reasoning
  'Pre-approval commissioning of new compressor unit suspected': '涉嫌在国家正式审批许可前私自抢跑投运新动力辅机机组',
  'APP-2026-0078 (Unit-2C registration) pending approval for 75+ days': '申报件 APP-2026-0078 (Unit-2C 压气辅机注册) 已滞留于省审批库中超 75+ 天',
  'Review window exceeded by 15 days (Article 22)': '根据省能源条例第 22 条，审批时效已超越规定法定窗口期 15 天',
  'Unit-2C design throughput (+6 MMcm/d) matches observed +40% night surge': 'Unit-2C 部分设计额定每秒通量 (+6 MMcm) 完美咬合了本次夜间 +40% 流量飙极限',
  'Enterprise has financial incentive to start operations pre-approval': '受外贸油价刺激，企业具有极其深厚的抢跑生产体外循环套利的主观商业动机',

  'Systematic under-reporting widening over 4 months': '自主报送与物联数采偏离差值近 4 个月内呈系统性、喇叭口式增宽一览',
  'Mar 2026: reported variance 3.2% (within tolerance)': '2026-03：账期内自评报送偏差为 3.2% (属于合理传感器计量抖动范围限制)',
  'Apr 2026: variance jumped to 8.4% — first auto-flag': '2026-04：自主报表偏差阶跃式增宽至 8.4% — 触发报警平台自动黄色挂旗',
  'May 2026: variance reached +20.4% — sustained': '2026-05：偏差偏离极值增至 +20.4% — 且在过去30日内无任何收敛迹象',
  'Pattern matches 2025 violation (CASE-2025-088) fingerprint': '本期逃逸行为演进指纹与 2025 年度查处的同类型恶意漏报严重度指纹重合比达 0.94',

  'Field inspection confirmed Unit-2C active with zero telemetry logs': '省外勤监察大队现场实物标定 Unit-2C 处于高功率运转，但遥测数采信号输出为零',
  'No telemetry logs received from Unit-2C since 2026-05-15': '自 2026-05-15 起物联中枢未接收到该机组对应的任何一帧能耗遥测',
  'Exhaust gas temperature logs show constant high thermal load': '红外遥感与辅助锅炉温度场特征证实，该变压辅机长期处于最大热动力负荷',
  'Enterprise has a history of \'meter downtime\' during peak exports': '涉案企业在往年历史出口高点期间，多次恶意上报“流量传感器雷击下线故障”',

  'Repeat-offender pattern — 0.87 similarity to 2025 violation': '极高危重犯违法行为重组特征 — 与 2025 违规通告比对相似高位达 0.87',
  'CASE-2025-088 closed only 6 months ago — short recidivism interval': '瞒报漏税案 (CASE-2025-088) 结案仅 6 个月 — 重犯违纪潜伏区间极短',
  'Current pattern matches 2025 case fingerprint at 0.87 similarity': '当前的物理波形残差拓扑完全重构了2025年违法行为的全部高阶流控特征',
  'Same enterprise, same facility, same modus operandi (night production)': '同属西里海能源、同一个地理增压首站、完全一致的深夜流量拉平偷产作案手法',

  'Q2 2026 audit dismissed material evidence': '2026年第二季度强制复核审计报告选择性过滤或瞒报了核心物证线索',
  'Q4 2025 audit: passed (compliant)': '2025年第四季度强制复和：无保留通过 (符合监管推荐指标体系等)',
  'Q1 2026 audit: passed (compliant)': '2026年第一季度强制复和：无保留通过 (符合监管推荐指标体系等)',
  'Q2 2026 audit: noted +14% electricity step-jump, dismissed as seasonal': '2026年二季季复：指出用电跃升+14%，但被执业会所强行解释为企业换季生产正常波动',
  'Same auditor across all 3 audits — potential independence concern': '前后三期审计复核均指向同一经办合伙人，具有极高且清晰的跨利益合谋不自律迹象',

  'Tax-production inconsistency consistent with covert production': '财务纳税大表同物资产能高度冲突，指纹模型高度契合隐秘偷产定性结论',
  'Q1 2026 declared revenue 18% above production-implied basis': '2026年一季度纳税发票开具额度高出其 SCADA 折算的名义产能量基线 18%',
  'Cross-dept review flagged but did not escalate': '跨部门关联复评曾经启动过黄色预审，但不知何故被降级未形成稽查函件',
  'Inconsistency aligns with hypothesis of unreported production': '财务过度纳税与物理超额消耗无法自圆其说，唯一的科学理论假说就是体外瞒产',
  'Pattern repeats across customs declarations (export volume +12%)': '同样的行为在阿克套海关对霍尔果斯口岸的原生出口交收表（超产 +12%）再次重现',

  // Master verdict keys
  'UNREPORTED CAPACITY EXPANSION': '未申报特种设备容量扩产抢跑违规',
  'SCADA decoupling from physical energy limits.': 'SCADA 数据采集线与真实电网消耗物理脱钩拦截',
  'Estimated loss from unlevied generation fees.': '未缴自备电厂容量规费引致的国家财政税流失',
  'Formal audit triggered for Case 2026-001.': '已针对 CASE-2026-001 发起联合反规避与偷产专项多重审计命令',
  'ESCALATE TO MoE + KEGOC': '极速呈提至国家能源部与国家电网公司',
  'Estimated volume delta: +28.4MMcm (365 days)': '预估十二个月内累计逃逸偷产物理增量：+28.4百万立方',
  'Atyrau Logistics -> Western Caspian cashflow concerns': '阿特劳离境物流 ↔ 西里海能源大额公对公异常流向疑云',
  'Inferred 0.91 match to 2025-081 infraction.': 'AI 指纹比对同 2025-081 超期瞒报特征重合指标为 0.91',
  'Caspian Audit Partners - Audit independence failure.': '第三方里海联合会计师事务所执业独立性实质丧失',

  // Graph and AI Report keys
  'STARTING POINT': '研判起点（第一始发点）',
  'Potential coordinated regulatory-evasion network detected': '深度穿透：已识别到高隐蔽、跨关联实体的多物合谋逃差网图',
  'COORDINATED_EVASION_NETWORK_PROBABLE': '极大概率存在多方控股合谋与物理对冲瞒漏产风险',
  'FINDING 1 — HIDDEN OWNERSHIP': '穿透发现 1 — 控股利益隐秘输送及空壳嵌套',
  'FINDING 2 — PATTERN MATCH ACROSS LINKED ENTITY': '穿透发现 2 — 历史瞒报违约模式同构型',
  'FINDING 3 — ABNORMAL CASHFLOW': '穿透发现 3 — 异常跨境公对私与协议资金流向',
  'FINDING 4 — AUDIT INDEPENDENCE': '穿透发现 4 — 独立审计师合谋及信用受损',
  'FINDING 5 — SMOKING GUN: SHARED METER': '穿透发现 5 — 铁证物证：多经营主体共轨物理计量计',
};

const translateText = (text: string, language: Language): string => {
  if (language === 'en' || !text) return text;
  
  const trimmed = text.trim();
  
  // Check direct match
  if (DICTIONARY[trimmed]) {
    return DICTIONARY[trimmed];
  }
  
  if (DICTIONARY[text]) {
    return DICTIONARY[text];
  }

  // Exact but case-insensitive search
  for (const [enKey, zhVal] of Object.entries(DICTIONARY)) {
    if (trimmed.toLowerCase() === enKey.toLowerCase()) {
      return zhVal;
    }
  }

  // Common dynamic translations / prefixes
  const lower = trimmed.toLowerCase();
  if (lower.startsWith('latency:')) {
    const value = trimmed.substring(8).trim();
    return `遥测响应延迟: ${value}`;
  }
  if (lower.startsWith('ingest:')) {
    const value = trimmed.substring(7).trim();
    return `每秒采集通量: ${value}`;
  }
  if (lower.startsWith('last sync:')) {
    const value = trimmed.substring(10).trim();
    return `最后同步时间: ${value}`;
  }
  if (lower.startsWith('next refresh:')) {
    const value = trimmed.substring(13).trim();
    return `离基线分析算法重算还有: ${value}`;
  }
  
  // Look for sub-sentence matches for headers
  let replaced = text;
  for (const [enKey, zhVal] of Object.entries(DICTIONARY)) {
    if (enKey.length > 5 && text.includes(enKey)) {
      replaced = replaced.replace(new RegExp(enKey, 'g'), zhVal);
    }
  }

  return replaced;
};

const translateObject = <T,>(obj: T, language: Language): T => {
  if (language === 'en' || !obj) return obj;
  
  if (typeof obj === 'string') {
    return translateText(obj, language) as unknown as T;
  }
  
  if (Array.isArray(obj)) {
    return obj.map(item => translateObject(item, language)) as unknown as T;
  }
  
  if (typeof obj === 'object') {
    // Return a deeply translated copy of the object
    const copy = { ...obj } as any;
    for (const key in copy) {
      if (typeof copy[key] === 'string') {
        const keysToTranslate = [
          'label', 'name', 'title', 'subtitle', 'properties', 'detail', 
          'headline', 'description', 'specialization',
          'primary_cause', 'secondary_cause', 'tertiary_cause', 'action_id', 'owner',
          'rationale', 'direction', 'evidence', 'suggested_action', 'text', 'sub', 
          'label_en', 'name_en', 'role', 'violation_type', 'jurisdiction', 
          'declared_activity', 'finding', 'context', 'discovery_method', 'headline_en',
          'severity', 'value', 'desc', 'heading', 'body', 'natural_language'
        ];
        
        // Check if we should translate this text key
        const shouldTranslate = keysToTranslate.includes(key) || 
                                key.startsWith('name') || 
                                key.startsWith('label') || 
                                key.startsWith('title') || 
                                key.startsWith('desc');
                                
        // Do not translate technical IDs or pure numbers
        if (shouldTranslate && !/^[A-Z0-9_-]+-[A-Z0-9_-]+$/.test(copy[key])) {
          copy[key] = translateText(copy[key], language);
        }
      } else if (typeof copy[key] === 'object' && copy[key] !== null) {
        copy[key] = translateObject(copy[key], language);
      }
    }
    return copy;
  }
  
  return obj;
};

interface LanguageContextProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  objT: <T,>(obj: T) => T;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Read initial language from localStorage or default to English
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('app_lang');
    return (saved === 'zh' || saved === 'en') ? saved : 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('app_lang', lang);
  };

  const t = (key: string) => translateText(key, language);
  const objT = <T,>(obj: T) => translateObject(obj, language);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, objT }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
