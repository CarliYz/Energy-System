// src/data/project_operations.ts

export interface ProcurementNode {
  id: string;
  stageIdx: number; // 0 to 4 (Tender, Bidding, Evaluate, Shortlist, Award)
  roleIdx: number;  // 0: Ministry (Gov), 1: Expert/Audit (Panel), 2: Bidder (Corp)
  label: string;
  label_zh: string;
  date: string;
  status: 'green' | 'yellow' | 'red';
  owner: string;
  owner_zh: string;
  score: number;
  details: string;
  details_zh: string;
}

export interface ProjectExecutionNode {
  stageIdx: number; // 0 to 7 (Contract, Investment, Budget, Funding, Execution, Payment, Change, Remediation)
  date: string;
  status: 'green' | 'yellow' | 'red';
  score: number;
  desc: string;
  desc_zh: string;
  cost?: string;
  owner?: string;
  owner_zh?: string;
  riskSummary?: string;
  riskSummary_zh?: string;
  attribution?: string;
  attribution_zh?: string;
  suggestedAction?: string;
  suggestedAction_zh?: string;
}

export interface ProjectOperationItem {
  id: string;
  name: string;
  name_zh: string;
  type: 'PPP' | 'EPC' | 'BOT';
  nodes: ProjectExecutionNode[];
}

export const procurementData = {
  kpi: {
    total: 847, // $847M
    signed: 612, // $612M
    anomaly: 3,
    source: 'SK e-Procurement Platform · Read-Only Supervisor Link'
  },
  stages: ['Tender', 'Bidding', 'Evaluate', 'Shortlist', 'Award'],
  stages_zh: ['招标', '报价', '评标', '供应商筛选', '中标签约'],
  roles: ['Ministry of Energy', 'Expert / Legal / Audit', 'Bidders (Corporations)'],
  roles_zh: ['国家能源部', '评审专家 / 法律 / 监察', '投标企业群体'],
  nodes: [
    // Stage 0: Tender (招标)
    {
      id: 'p_t_01', stageIdx: 0, roleIdx: 0,
      label: 'Tendering Approval', label_zh: '采购预算立项审批',
      date: '2026-03-01', status: 'green', owner: 'MoE Budget Dept', owner_zh: '部规划财务司', score: 98,
      details: 'Approved under Project-2026-X1.', details_zh: '立项审批程序完备，符合能效建设预算限额。'
    },
    {
      id: 'p_t_02', stageIdx: 0, roleIdx: 1,
      label: 'Specifications Audit', label_zh: '招标文件与参数合规审计',
      date: '2026-03-05', status: 'green', owner: 'Central Anti-Monopoly', owner_zh: '反垄断合规工作组', score: 95,
      details: 'No proprietary barriers found.', details_zh: '未指明特定排他性技术指标，通过垄断排查审核。'
    },
    {
      id: 'p_t_03', stageIdx: 0, roleIdx: 2,
      label: 'Bidder Registration', label_zh: '供应商公网报名与登记',
      date: '2026-03-10', status: 'green', owner: '7 registered bidders', owner_zh: '7家申报合规企业群体', score: 90,
      details: 'All qualified through tax gateway.', details_zh: '报名的7家实体均具备法定安全资质和税收常态认证。'
    },

    // Stage 1: Bidding (报价)
    {
      id: 'p_b_01', stageIdx: 1, roleIdx: 2,
      label: 'Encrypted Submission', label_zh: '密盘投标文件电子回执',
      date: '2026-03-20', status: 'green', owner: 'Crypto Gateway', owner_zh: '数字国资加密网关', score: 100,
      details: 'All hashes matched secure keys.', details_zh: '采用国密双重锁密。5家入围最终报价，哈希一致。'
    },
    {
      id: 'p_b_02', stageIdx: 1, roleIdx: 0,
      label: 'Formal Entry Opening', label_zh: '名义形式审查与开标唱标',
      date: '2026-03-22', status: 'green', owner: 'Central Procurement Office', owner_zh: '采购中心常务组', score: 93,
      details: 'All submissions sealed and validated.', details_zh: '全流程录像，开标唱标会无一人退场或质疑。'
    },
    {
      id: 'p_b_03', stageIdx: 1, roleIdx: 1,
      label: 'Suspicious Collusive Bid Defending', label_zh: '围标串标物理指纹库比对',
      date: '2026-03-23', status: 'red', owner: 'AI Audit Agent', owner_zh: '智能自组织审计系统', score: 42,
      details: 'Alert: bid price similarity reaches 99.4% between 2 suppliers.',
      details_zh: '高危告警：2家投标人提交文档的源元数据作者物理指纹重合度 99.4%，涉嫌围标串标。'
    },

    // Stage 2: Evaluate (评标)
    {
      id: 'p_e_01', stageIdx: 2, roleIdx: 1,
      label: 'Technical Evaluation panel', label_zh: '技术委员会闭门打分',
      date: '2026-03-28', status: 'green', owner: 'KZ Tech Experts Academy', owner_zh: '哈工程院能源技术专家组', score: 96,
      details: 'Double-blind ranking completed.', details_zh: '针对方案进行了双盲密评，1号设备能耗因子最高。'
    },
    {
      id: 'p_e_02', stageIdx: 2, roleIdx: 0,
      label: 'Commercial Price Benchmarking', label_zh: '商务报价测算偏离差拉平',
      date: '2026-03-30', status: 'yellow', owner: 'MoE Estimating Bureau', owner_zh: '能司工程造价监理处', score: 78,
      details: 'Alert: Price of bid-C is 24% below budget curve.',
      details_zh: '中度警示：C标段报价偏离财政基准预算低-24%，需警惕质量缩水和后期加费套路。'
    },
    {
      id: 'p_e_03', stageIdx: 2, roleIdx: 1,
      label: 'Evaluator Independence Review', label_zh: '评委专家利益冲突复核',
      date: '2026-03-31', status: 'red', owner: 'KMG Joint Panel', owner_zh: '风控监察特别调查组', score: 38,
      details: 'Evaluator A. S. had hidden consultancy link to bidder 3.',
      details_zh: '严重越规：评审专家 A. S. 在两年前曾领受3号Bidder相关的外部空壳顾问费。'
    },

    // Stage 3: Shortlist (供应商筛选)
    {
      id: 'p_s_01', stageIdx: 3, roleIdx: 1,
      label: 'Unified Screening Report', label_zh: '多方案优选筛选报告出具',
      date: '2026-04-05', status: 'green', owner: 'Procurement Board', owner_zh: '联办采购审查委员会', score: 94,
      details: 'Shortlist reduced to top-3 prime bids.', details_zh: '剔除利益关联选项和高偏离非理性价，确立排名前三名单。'
    },
    {
      id: 'p_s_02', stageIdx: 3, roleIdx: 0,
      label: 'Shortlist Public Notice', label_zh: '拟中标候选企业公网公示',
      date: '2026-04-08', status: 'green', owner: 'MoE Media Portal', owner_zh: '能源部门户公报网', score: 97,
      details: 'Active for 7 statutory days.', details_zh: '上网公示7个法定工作日，公示期无任何同业实名控诉。'
    },
    {
      id: 'p_s_03', stageIdx: 3, roleIdx: 2,
      label: 'Protest Filing & Resolution', label_zh: '同业异议答辩与抗辩处理',
      date: '2026-04-15', status: 'green', owner: 'MoE Resolution Board', owner_zh: '异议申诉处理专属委员会', score: 92,
      details: 'Resolved no merit in claim for bid 4.', details_zh: '驳回了4号投标人由于非必要流程技术格式错产生的申诉。'
    },

    // Stage 4: Award (中标签约)
    {
      id: 'p_a_01', stageIdx: 4, roleIdx: 0,
      label: 'Award Notification Delivery', label_zh: '发出中标确认通知书',
      date: '2026-04-20', status: 'green', owner: 'MoE Secretariat', owner_zh: '能部事务办公室秘书处', score: 99,
      details: 'Sent legally binding award confirmation.', details_zh: '依法向优胜投标企业递送签字生效的中标签发公函。'
    },
    {
      id: 'p_a_02', stageIdx: 4, roleIdx: 1,
      label: 'SLA Negotiation', label_zh: '商务细则与惩罚条款谈判',
      date: '2026-04-25', status: 'green', owner: 'MoE Legal Director', owner_zh: '首席法律顾问处', score: 95,
      details: 'Set +40% late completion fine clause.', details_zh: '约束工期超限溢价条款，设置重度延迟处罚限额。'
    },
    {
      id: 'p_a_03', stageIdx: 4, roleIdx: 2,
      label: 'Contract Final Signing', label_zh: '三方合同多边盖印签署',
      date: '2026-04-30', status: 'green', owner: 'MoE & Winners Group', owner_zh: '能部部长签字厅 & 联合体', score: 100,
      details: 'Sign-off complete. Case closed.', details_zh: '一号长协合规流顺利交付结案。自动归档入库。'
    }
  ] as ProcurementNode[]
};

export const executionTimelineData = {
  kpi: {
    active: 36,
    invested: 12.4, // $12.4B
    risky: 4,
    payable: 87 // $87M
  },
  stages: [
    'Contract Signing', 'Investment Close', 'Budget Approval', 'Funding Inplace',
    'Construction/Execution', 'Payment Milestones', 'Change Management', 'Remediation Review'
  ],
  stages_zh: [
    '合同签署', '投资立项', '预算批复', '资金到位', '建设/履约', '付款节点', '施工变更', '纠偏复核'
  ],
  projects: [
    {
      id: 'ppp_almaty_solar',
      name: 'Almaty Northern Solar PPP (800MW)',
      name_zh: '阿拉木图北部 800MW 光伏综合一体化 PPP 项目',
      type: 'PPP',
      nodes: [
        { stageIdx: 0, date: '2025-01-15', status: 'green', score: 98, desc: 'SLA standard contract signed', desc_zh: '首阶段多边公私合营PPP特许协议盖印章。' },
        { stageIdx: 1, date: '2025-03-10', status: 'green', score: 95, desc: 'Equity financial close achieved', desc_zh: '联合体各股东股本权益按时解封落定。' },
        { stageIdx: 2, date: '2025-05-15', status: 'green', score: 93, desc: 'State treasury budget baseline set', desc_zh: '通过国家发展改革委特批主建预算，入库。' },
        { stageIdx: 3, date: '2025-08-01', status: 'green', score: 94, desc: 'Consortium bank syndication inplace', desc_zh: '亚投行与本国银团联合首期信用额度划账。' },
        { stageIdx: 4, date: '2026-01-20', status: 'green', score: 91, desc: '1st stage panel assembly completed', desc_zh: '一期光伏阵列箱变物理吊装完备，测点在线。' },
        { stageIdx: 5, date: '2026-04-10', status: 'yellow', score: 76, desc: 'Partial operations feed delayed slightly', desc_zh: '局部网能负压波动较大，第二批贴单稍有迟延。', cost: '$4.2M', owner: 'Joint Venture MoF', owner_zh: '合资集团财政合伙人' },
        { stageIdx: 6, date: '2026-05-12', status: 'green', score: 92, desc: 'Optimized tracking mount design update', desc_zh: '优化主动跟踪托架结构设计，通过造价补登。' },
        { stageIdx: 7, date: '2026-05-25', status: 'green', score: 95, desc: 'Baseline output matching normal range', desc_zh: '现场实际发电功率符合设计预期，运行正常。' }
      ]
    },
    {
      id: 'epc_aktau_lng',
      name: 'Aktau LNG Terminal Conversion EPC',
      name_zh: '阿克套港港区原油及 LNG 贸易中转加气站改扩建 EPC 标段',
      type: 'EPC',
      nodes: [
        { stageIdx: 0, date: '2025-02-12', status: 'green', score: 95, desc: 'Engineering EPC master contract signed', desc_zh: '中哈工程勘察设计院正式签署联合EPC承包合同。' },
        { stageIdx: 1, date: '2025-04-01', status: 'green', score: 97, desc: 'State development bank guarantees issued', desc_zh: '哈萨克斯坦国发银行正式开具境外承揽履约保函。' },
        { stageIdx: 2, date: '2025-06-20', status: 'green', score: 94, desc: 'Approved baseline gas processing cost', desc_zh: '通过能部二级设计和测定费用概算总复核。' },
        { stageIdx: 3, date: '2025-09-15', status: 'yellow', score: 82, desc: 'Subcontract payment pending VAT check', desc_zh: '分包商发票涉及一笔异常进项增值税待核实。' },
        { stageIdx: 4, date: '2026-02-10', status: 'green', score: 90, desc: 'Compressor structural base concrete cast', desc_zh: '压缩车间主机座超大承台混凝土整体浇筑验收。' },
        { stageIdx: 5, date: '2026-05-10', status: 'red', score: 35,
          desc: 'Milestone pay delayed 47 days. Total $12M over limit.',
          desc_zh: '5期节点款超规停拨大红色预警：工程拖延47天未结、预算严重超支 $12M。',
          cost: '$12.0M', owner: 'Mangystau Treasury Dept', owner_zh: '曼吉斯套州财政厅国库科',
          riskSummary: 'EPC contractor claims severe delays due to geological anomaly in bedrock; filed extra $4.5M claim.',
          riskSummary_zh: 'EPC总承包商宣称基岩大裂隙和盐渍地质异动导致沉箱开挖迟延，向发包方单方索赔 2.1亿坚戈（$4.5M），导致付款冻结。',
          attribution: 'Local fiscal liquidity bottleneck and uncoordinated contractor claim dispute.',
          attribution_zh: '地方财政流动性拨付链瓶颈、工程签证多头无序与总承包商纠偏纠纷。',
          suggestedAction: 'Escalate to Prime Minister Office and deploy special audit trail report for procurement consistency.',
          suggestedAction_zh: '提请联合呈阅件。极速上报总理办公室风控大案，一键启动采购一致性专项跟踪分析。' }
      ]
    },
    {
      id: 'bot_atyrau_power',
      name: 'Atyrau Gas Turbine Life-Extension BOT',
      name_zh: '阿特劳高效重型燃气轮机组改型增能与寿命延长 BOT 项目',
      type: 'BOT',
      nodes: [
        { stageIdx: 0, date: '2024-11-01', status: 'green', score: 96, desc: 'Joint BOT concession agreement enacted', desc_zh: '能源部同合资外国资本签署为期25年的特许经营BOT协议。' },
        { stageIdx: 1, date: '2024-12-15', status: 'green', score: 92, desc: 'Foreign equity financing matched target', desc_zh: '外国财团股本对公账户交割注入到位，满足首设基数。' },
        { stageIdx: 2, date: '2025-02-18', status: 'green', score: 90, desc: 'Project cost budget approved', desc_zh: '国家计划委核定商业财务投资极限，不占主权财预算。' },
        { stageIdx: 3, date: '2025-06-05', status: 'red', score: 40,
          desc: 'Funding frozen. Delayed 65 days due to shell query.',
          desc_zh: '严重高危：该BOT财团被穿透审计发现含有境外高风险秘密利益链，资金流遭司法临时冻结。',
          cost: '$18.5M', owner: 'Caspian Audit Partners', owner_zh: '第三方联合会计师事务所',
          riskSummary: 'Offshore shell intermediary found linked to MoE ex-deputy director; financial integrity compromise inquiry.',
          riskSummary_zh: '审计发现该BOT境外SPV公司背后，有一家处于塞浦路斯的空壳实体，其大股东与前任能部司长有重合利益关联，涉嫌利益侵漏。',
          attribution: 'Indirect audit failure, shell company round-tripping, corporate integrity failure.',
          attribution_zh: '审计报告中选择性过滤独立合规背景、离岸空壳空转和高额关联洗钱。',
          suggestedAction: 'Escalate investigation. Trigger KnowledgeGraph multi-hop tracking.',
          suggestedAction_zh: '提请法务监察介入。启动商业图谱系统多步穿透，彻底拉网式扣押SPV。' },
        { stageIdx: 4, date: '2025-10-01', status: 'green', score: 85, desc: 'Trustees replaced. Concession unblocked', desc_zh: '强力替换合伙人和受托管理人。剔除高危红墙关联，司法和解破封。' },
        { stageIdx: 5, date: '2026-01-10', status: 'green', score: 88, desc: 'Generator rotor delivery milestone met', desc_zh: '法部和监察首肯。第二节点发电机大型转子安全运抵口岸开装。' },
        { stageIdx: 6, date: '2026-04-15', status: 'green', score: 92, desc: 'Turbine core chamber assembly finished', desc_zh: '燃气发生器腔室高精度吊装完工，传感器自检合规。' },
        { stageIdx: 7, date: '2026-05-20', status: 'green', score: 94, desc: 'Hot commissioning test success', desc_zh: '成功启动热态试车高功率合规并网。各项工况数据优异。' }
      ]
    }
  ] as ProjectOperationItem[]
};
