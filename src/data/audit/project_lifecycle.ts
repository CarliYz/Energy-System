// src/data/audit/project_lifecycle.ts

export type Stage = 'STAGE-01' | 'STAGE-02' | 'STAGE-03' | 'STAGE-04' | 'STAGE-05'
                  | 'STAGE-06' | 'STAGE-07' | 'STAGE-08' | 'STAGE-09'
                  | 'STAGE-10' | 'STAGE-11' | 'STAGE-12';

export type Lane = 'L1' | 'L2' | 'L3' | 'L4';

export interface TimelineEvent {
  time: string;
  action: string;
  owner: string;
}

export interface InvolvedEntity {
  id: string;
  nameCn: string;
  role: string;
}

export interface LinkedDocument {
  name: string;
  type: 'pdf' | 'doc' | 'docx' | 'xlsx' | 'csv' | 'json';
  hash: string;
}

export interface FundFlowStep {
  from: string;
  to: string;
  amount: string;
}

export interface Node {
  id: string;
  projectId: 'PPP-ALM' | 'EPC-AKT' | 'BOT-ATY';
  projectName: string;
  stageCode: Stage;
  lane: Lane;
  status: 'ok' | 'wip' | 'risk' | 'pending';
  title: string;
  date: string;
  timeline: TimelineEvent[];
  entities: InvolvedEntity[];
  documents: LinkedDocument[];
  fundFlow: FundFlowStep[];
  riskLevel: '低' | '中' | '高';
  slaRemaining: string;
  overdueDays: number;
  aiInsight: string;
}

export interface AiCrossLink {
  from: string;   // node id
  to: string;     // node id (or entity id)
  reason: string; // hover display
}

export const projectLifecycle = {
  kpi: {
    completionPct: 78,
    completedSteps: '9 / 12',
    delayedNodes: 2,
    aiInterventions: 7,
    fundRiskNodes: 3,
    slaRemaining: '36h',
  },
  
  // Nodes array with all 36 points of details
  nodes: [
    // ==========================================
    // 1. STORYLINE A: PPP-ALM - Almaty 北部光伏 800MW PPP
    // ==========================================
    {
      id: 'PPP-ALM-S01',
      projectId: 'PPP-ALM',
      projectName: 'Almaty 北部光伏 800MW PPP',
      stageCode: 'STAGE-01',
      lane: 'L1',
      status: 'ok',
      title: '战略立项批复',
      date: '2024-04-12',
      timeline: [
        { time: '2024-04-10 10:00', action: '向内阁提交立项可行性大纲', owner: '能源部规划司' },
        { time: '2024-04-11 15:30', action: '部务会审通过投资配额草案', owner: '能源部合规评议办' },
        { time: '2024-04-12 09:00', action: '正式签署立项公文 EM-PPP-2024-007', owner: '能源部司长办公室' }
      ],
      entities: [
        { id: 'ENT-KZ-AST-MOE', nameCn: '哈萨克斯坦能源部规划司', role: '行政主管' }
      ],
      documents: [
        { name: 'EM-PPP-2024-007_立项批复.pdf', type: 'pdf', hash: '0x3f2a5b1c9d8e7f' }
      ],
      fundFlow: [
        { from: '中央规划支出预算', to: '前置可行性评估储备', amount: '$1.2M' }
      ],
      riskLevel: '低',
      slaRemaining: '已完成',
      overdueDays: 0,
      aiInsight: '项目战略立案文件完备，满足阿拉木图省核心光伏配电枢纽的统配原则，已纳主干台账。'
    },
    {
      id: 'PPP-ALM-S02',
      projectId: 'PPP-ALM',
      projectName: 'Almaty 北部光伏 800MW PPP',
      stageCode: 'STAGE-02',
      lane: 'L2',
      status: 'ok',
      title: '公开招标公告发布',
      date: '2024-06-08',
      timeline: [
        { time: '2024-06-01 09:00', action: '编制招标文件及发包指引书', owner: '采购监督司' },
        { time: '2024-06-05 14:00', action: '三方监察委员会对标核准发包', owner: '国家采招监督委' },
        { time: '2024-06-08 10:00', action: '全网发布 TenderID PPP-ALM-SOLAR 招标简明', owner: '政府采购中心' }
      ],
      entities: [
        { id: 'ENT-KZ-AST-MOE', nameCn: '能源部采购管理中心', role: '招标执行方' }
      ],
      documents: [
        { name: 'PPP-ALM-SOLAR_招标技术书.docx', type: 'docx', hash: '0x9a8b7c6d5e4f3a2b1c' }
      ],
      fundFlow: [],
      riskLevel: '低',
      slaRemaining: '已完成',
      overdueDays: 0,
      aiInsight: '19家国际候选总包商参与初筛登记，合规穿透未见股权串联嫌疑，无围标风险。'
    },
    {
      id: 'PPP-ALM-S03',
      projectId: 'PPP-ALM',
      projectName: 'Almaty 北部光伏 800MW PPP',
      stageCode: 'STAGE-03',
      lane: 'L3',
      status: 'ok',
      title: '投标文件接收封存',
      date: '2024-07-22',
      timeline: [
        { time: '2024-07-20 17:00', action: '截止投标时间登记', owner: '采购执行工作组' },
        { time: '2024-07-21 11:00', action: '13家合格商务文件归档库房', owner: '档案馆高密科' },
        { time: '2024-07-22 15:30', action: '双盲密匙上挂国家安全算力系统', owner: '电子采招保障处' }
      ],
      entities: [
        { id: 'ENT-KZ-ALM-0901', nameCn: 'Almaty 光伏联合会商项目组', role: '参选项目代表' },
        { id: 'ENT-CN-BJ-PWC', nameCn: 'PowerChina (中国电建)', role: '投标备选人A' }
      ],
      documents: [
        { name: 'BID-2024_投标文件汇总名册.xlsx', type: 'xlsx', hash: '0x2d4e6f8a0c2e4g' }
      ],
      fundFlow: [],
      riskLevel: '低',
      slaRemaining: '已完成',
      overdueDays: 0,
      aiInsight: '收到包含Sembcorp及中国电建在内的13家集团投标包，技术方案完全封闭解密未触发偏振。'
    },
    {
      id: 'PPP-ALM-S04',
      projectId: 'PPP-ALM',
      projectName: 'Almaty 北部光伏 800MW PPP',
      stageCode: 'STAGE-04',
      lane: 'L2',
      status: 'ok',
      title: '专家委员会评分',
      date: '2024-08-15',
      timeline: [
        { time: '2024-08-12 09:00', action: '随机抽取15位高级工程专家现场隔离', owner: '专家抽配库' },
        { time: '2024-08-14 16:00', action: '闭会完成一、二轮工程技术方案评议', owner: '评标委员会主席 Aigerim K.' },
        { time: '2024-08-15 11:30', action: '锁定最终各方排名综合评分案', owner: '采购监督司纪检处' }
      ],
      entities: [
        { id: 'ENT-KZ-AST-MOE', nameCn: '采购监管司评标审查席', role: '过程监委会' }
      ],
      documents: [
        { name: 'EVAL-007_评分合议判定文本.pdf', type: 'pdf', hash: '0xbcdef1234567890a' }
      ],
      fundFlow: [],
      riskLevel: '低',
      slaRemaining: '已完成',
      overdueDays: 0,
      aiInsight: '评委打分曲线高斯分布，偏斜系数正常。三方专家与竞选财团穿透无关联关系。'
    },
    {
      id: 'PPP-ALM-S05',
      projectId: 'PPP-ALM',
      projectName: 'Almaty 北部光伏 800MW PPP',
      stageCode: 'STAGE-05',
      lane: 'L1',
      status: 'ok',
      title: '合同签署印发',
      date: '2024-09-10',
      timeline: [
        { time: '2024-09-01 10:00', action: '起草政府合作合同 C-PPP-ALM-2024-007', owner: '法制监察办公室' },
        { time: '2024-09-05 14:00', action: '与中标人Sembcorp财团进行履约条款澄定', owner: '主管司局代表' },
        { time: '2024-09-10 11:15', action: '能源部长党组联审正式盖印落章', owner: '能源部部党组签发室' }
      ],
      entities: [
        { id: 'ENT-KZ-ALM-0901', nameCn: 'Almaty 光伏项目公司', role: '中标项目方' },
        { id: 'ENT-KZ-AST-MOE', nameCn: '哈能源部法律政策司', role: '契约核实处' }
      ],
      documents: [
        { name: 'C-PPP-ALM-2024-007_合意正本.pdf', type: 'pdf', hash: '0x1234567890abcdef12' }
      ],
      fundFlow: [],
      riskLevel: '低',
      slaRemaining: '已完成',
      overdueDays: 0,
      aiInsight: '法律草拟符合中央政府采购反贪腐红线，项目特许运营期25年并网定价锁定合规。'
    },
    {
      id: 'PPP-ALM-S06',
      projectId: 'PPP-ALM',
      projectName: 'Almaty 北部光伏 800MW PPP',
      stageCode: 'STAGE-06',
      lane: 'L3',
      status: 'ok',
      title: '股东资本金到位',
      date: '2024-10-30',
      timeline: [
        { time: '2024-10-15 09:00', action: '境外股东向离岸监管信托户结汇', owner: 'Sembcorp财政司' },
        { time: '2024-10-25 11:30', action: '境内合伙方KMG打入匹配资本款', owner: 'KMG合规委员会' },
        { time: '2024-10-30 16:45', action: '一期资本金账户核定完成 $320M', owner: '托管银行 Halyk Bank' }
      ],
      entities: [
        { id: 'ENT-KZ-ALM-0901', nameCn: 'Almaty 光伏项目公司', role: '资金代管主' },
        { id: 'ENT-INTL-NCOC', nameCn: 'NCOC 境外合作行', role: '境外注资核查组' }
      ],
      documents: [
        { name: 'CAP-SOLAR_股东注资验资函.pdf', type: 'pdf', hash: '0xabcde12345fe6789' }
      ],
      fundFlow: [
        { from: 'Sembcorp & KMG 股东会', to: 'Almaty 光伏基本账户', amount: '$320M' }
      ],
      riskLevel: '低',
      slaRemaining: '已完成',
      overdueDays: 0,
      aiInsight: '一期资本到账（100%到位率），股东方穿透未见任何空壳或影子套汇迹象。'
    },
    {
      id: 'PPP-ALM-S07',
      projectId: 'PPP-ALM',
      projectName: 'Almaty 北部光伏 800MW PPP',
      stageCode: 'STAGE-07',
      lane: 'L1',
      status: 'ok',
      title: '国家年度项目预算审批',
      date: '2024-12-18',
      timeline: [
        { time: '2024-12-10 14:00', action: '向国会提交中央基建年度财政补贴申请', owner: '能源部预算司' },
        { time: '2024-12-15 10:30', action: '财政部正式划定专项匹配资金规模', owner: '财政部基建司' },
        { time: '2024-12-18 16:30', action: '签发国库财政专项拨款审核 $280M', owner: '财政部常务副部长' }
      ],
      entities: [
        { id: 'ENT-KZ-AST-MOE', nameCn: '能源部预算分配司', role: '部内分发' }
      ],
      documents: [
        { name: 'BUDGET-2025_中央批复书.pdf', type: 'pdf', hash: '0x9923884112afbdcc' }
      ],
      fundFlow: [
        { from: '国库预算司', to: '中央专项补贴拨款池', amount: '$280M' }
      ],
      riskLevel: '低',
      slaRemaining: '已完成',
      overdueDays: 0,
      aiInsight: '年度贴息配套通过，但AI测算历史财务盈余模型预警：有20%流动性冗余可能在2026年夏季面临吃紧。'
    },
    {
      id: 'PPP-ALM-S08',
      projectId: 'PPP-ALM',
      projectName: 'Almaty 北部光伏 800MW PPP',
      stageCode: 'STAGE-08',
      lane: 'L2',
      status: 'ok',
      title: '国库补贴划拨到位',
      date: '2025-02-08',
      timeline: [
        { time: '2025-01-20 09:30', action: '向国库集中支付银行发划拨款指令', owner: '中央预算执行处' },
        { time: '2025-01-28 15:00', action: '款项离岸核对、合规风控放行', owner: '国家外汇管理局' },
        { time: '2025-02-08 11:30', action: '资金过桥挂至地方州政府信托保障账户', owner: '国库集中行 Bank of Astana' }
      ],
      entities: [
        { id: 'ENT-KZ-MAN-FIN', nameCn: 'Mangystau 州财政厅', role: '地方专户接管方' }
      ],
      documents: [
        { name: 'BANK-TRANSFER_国库打款凭证.pdf', type: 'pdf', hash: '0x43d2c1e0f9b8a7c6' }
      ],
      fundFlow: [
        { from: '中央财政拨款专户', to: 'Mangystau 州财政托管户', amount: '$280M' }
      ],
      riskLevel: '低',
      slaRemaining: '已完成',
      overdueDays: 0,
      aiInsight: '首拨配给资金流，款项准确沉淀在州财政托管子专户内，已进行系统锁死不能挪作他用。'
    },
    {
      id: 'PPP-ALM-S09',
      projectId: 'PPP-ALM',
      projectName: 'Almaty 北部光伏 800MW PPP',
      stageCode: 'STAGE-09',
      lane: 'L3',
      status: 'ok',
      title: 'EPC主装设备施工履约',
      date: '2025-04-01',
      timeline: [
        { time: '2025-03-25 10:00', action: '与包工包料EPC总包中国电建签发指令', owner: '项目总经理' },
        { time: '2025-03-29 11:30', action: '首批组件自中国西安通关口岸到达项目地', owner: '霍尔果斯口岸突查办' },
        { time: '2025-04-01 08:30', action: '开始打桩及并网变配电地基动工', owner: 'PowerChina 哈萨克分公司' }
      ],
      entities: [
        { id: 'ENT-CN-BJ-PWC', nameCn: 'PowerChina (中国电建哈萨克工程部)', role: '建设EPC总包' },
        { id: 'ENT-KZ-ALM-0901', nameCn: 'Almaty 光伏项目公司', role: '监督业主' }
      ],
      documents: [
        { name: 'WEEKLY-EPC_现场监理日志.docx', type: 'docx', hash: '0x7e8d9c0a1b2c3d4e' }
      ],
      fundFlow: [
        { from: 'Almaty 建设资金专账', to: 'PowerChina 预付工程款账户', amount: '$56M' }
      ],
      riskLevel: '中',
      slaRemaining: '施工进行中',
      overdueDays: 0,
      aiInsight: '现场SCADA地里信息和遥测表明打桩并网已完成78%，工程指标大致处于良。'
    },
    {
      id: 'PPP-ALM-S10',
      projectId: 'PPP-ALM',
      projectName: 'Almaty 北部光伏 800MW PPP',
      stageCode: 'STAGE-10',
      lane: 'L4',
      status: 'risk',
      title: '第三期工程款付款逾期',
      date: '2026-04-15',
      timeline: [
        { time: '2026-04-15 09:00', action: '第三期付款申请提交', owner: '项目公司 财务部' },
        { time: '2026-04-16 14:20', action: '州财政厅签收付款申请', owner: 'Mangystau 州财政厅' },
        { time: '2026-04-22 11:30', action: '州财政流动性自查发现缺口 $8M', owner: '州财政厅财务司' },
        { time: '2026-04-30 17:00', action: '约定付款日 · 未到账', owner: '—' },
        { time: '2026-05-05 10:15', action: 'EPC 总包 PowerChina 发函催款', owner: 'PowerChina 哈萨克分公司' },
        { time: '2026-05-12 09:40', action: '能源部督查通报', owner: '能源部督查司' },
        { time: '2026-05-20 16:00', action: '总理办下达专项协调批示', owner: '总理办公室' },
        { time: '2026-05-28 06:00', action: '当前 · 逾期 47 天 · $12M', owner: '—' }
      ],
      entities: [
        { id: 'ENT-KZ-ALM-0901', nameCn: 'Almaty 光伏项目公司', role: '项目业主' },
        { id: 'ENT-CN-BJ-PWC', nameCn: 'PowerChina (中国电建)', role: 'EPC 总包' },
        { id: 'ENT-KZ-MAN-FIN', nameCn: 'Mangystau 州财政厅', role: '付款责任方' },
        { id: 'ENT-KZ-AST-MOE', nameCn: '哈萨克能源部督查司', role: '督查方' }
      ],
      documents: [
        { name: 'C-PPP-ALM-2024-007_合同文本.pdf', type: 'pdf', hash: '0x7f3a9c1e2d4b...' },
        { name: '第三期付款申请书.docx', type: 'docx', hash: '0xa1c8e2f0b3d9...' },
        { name: '州财政厅流动性自查报告.pdf', type: 'pdf', hash: '0x4d8e1c0f7b2a...' },
        { name: 'PowerChina_催款函_2026-05-05.pdf', type: 'pdf', hash: '0x9b3f6e2d1c8a...' },
        { name: '能源部督查通报_2026-05-12.pdf', type: 'pdf', hash: '0x2e7d4a8c0b1f...' },
        { name: '总理办专项批示_2026-05-20.pdf', type: 'pdf', hash: '0xc6f9e3a2b8d4...' }
      ],
      fundFlow: [
        { from: '哈国库财务总库', to: 'Mangystau 州财政厅', amount: '$280M' },
        { from: 'Mangystau 州财政厅', to: 'Almaty 光伏项目公司', amount: '$268M' },
        { from: 'Almaty 光伏项目公司', to: 'PowerChina 哈萨克分公司', amount: '$12M (逾期)' }
      ],
      riskLevel: '高',
      slaRemaining: '已超 SLA 47d',
      overdueDays: 47,
      aiInsight: '本节点付款逾期 47 天，根因可追溯至 STAGE-07 预算批复阶段：中央财政批复的州财政贴息额度仅覆盖 80% 项目周期资金需求，留下 20% 缺口在执行后期暴露。建议：① 启动州财政与中央财政的过桥贷款机制；② 在后续 PPP 项目预算批复阶段强制要求 110% 流动性覆盖；③ 将本案例纳入 EM-PPP-RISK-DB 高风险案例库。'
    },
    {
      id: 'PPP-ALM-S11',
      projectId: 'PPP-ALM',
      projectName: 'Almaty 北部光伏 800MW PPP',
      stageCode: 'STAGE-11',
      lane: 'L2',
      status: 'wip',
      title: '逾期还款补充机制谈判',
      date: '2026-05-12',
      timeline: [
        { time: '2026-05-10 10:00', action: '发起三方债权债务联合调停工作会', owner: '能源部采购监管司' },
        { time: '2026-05-12 14:00', action: '提出延付款项重组框架一稿（草签）', owner: '州财政厅事务协办' },
        { time: '2026-05-25 11:15', action: '补充协议二稿递交中介审计合议', owner: '德勤阿拉木图代表' }
      ],
      entities: [
        { id: 'ENT-KZ-MAN-FIN', nameCn: 'Mangystau 州财政厅办公室', role: '资金重组债务方' }
      ],
      documents: [
        { name: 'PPP-ALM_付款重组补充协议-初稿.docx', type: 'docx', hash: '0x2213778ff9d3eeac' }
      ],
      fundFlow: [],
      riskLevel: '中',
      slaRemaining: '谈判进行中',
      overdueDays: 0,
      aiInsight: '补充协议核心条款将承诺使用油田环保分红专项收益设立过桥监管专户锁死还款。'
    },
    {
      id: 'PPP-ALM-S12',
      projectId: 'PPP-ALM',
      projectName: 'Almaty 北部光伏 800MW PPP',
      stageCode: 'STAGE-12',
      lane: 'L4',
      status: 'wip',
      title: '督察与专项内控复核',
      date: '2026-05-20',
      timeline: [
        { time: '2026-05-15 09:00', action: '部长办公令派驻一等巡稽特派员', owner: '能源部督察司' },
        { time: '2026-05-18 14:20', action: '德勤法理现场审计组进入现场', owner: 'Deloitte Almaty Audit Team' },
        { time: '2026-05-20 10:00', action: '启动对州财政专用贴息款原封划转流向审查', owner: '专项合规稽核工作组' }
      ],
      entities: [
        { id: 'ENT-KZ-AST-MOE', nameCn: '哈萨克国家审计委员会驻部处', role: '内控委派' }
      ],
      documents: [
        { name: 'AUDIT-PLAN_阿拉木图光伏审计计划.pdf', type: 'pdf', hash: '0x948abdc9293848e02c' }
      ],
      fundFlow: [],
      riskLevel: '中',
      slaRemaining: '流转中',
      overdueDays: 0,
      aiInsight: '重点聚焦是否有截留政府统收资金之非法变相质押可能。待反馈正规备档卷。'
    },

    // ==========================================
    // 2. STORYLINE B: EPC-AKT - Aktau LNG 中转站 EPC
    // ==========================================
    {
      id: 'EPC-AKT-S01',
      projectId: 'EPC-AKT',
      projectName: 'Aktau LNG 中转站 EPC',
      stageCode: 'STAGE-01',
      lane: 'L1',
      status: 'ok',
      title: '战略立项批复',
      date: '2023-05-20',
      timeline: [
        { time: '2023-05-18 10:00', action: '气化哈萨克斯坦西部主干网规划呈送', owner: '国资油气安全司' },
        { time: '2023-05-20 15:30', action: '签发 EM-EPC-2023-019 战略重点立案', owner: '哈里海工业促进委员会' }
      ],
      entities: [
        { id: 'ENT-KZ-AST-MOE', nameCn: '哈萨克斯坦能源部', role: '最高层决策' }
      ],
      documents: [
        { name: 'EM-EPC-2023-019_核定批件.pdf', type: 'pdf', hash: '0x49e8a7164ff28dd' }
      ],
      fundFlow: [],
      riskLevel: '低',
      slaRemaining: '已完成',
      overdueDays: 0,
      aiInsight: 'Aktau二期战略定位液化天然气中转核心出海通道，属于部长级强统揽范畴。'
    },
    {
      id: 'EPC-AKT-S02',
      projectId: 'EPC-AKT',
      projectName: 'Aktau LNG 中转站 EPC',
      stageCode: 'STAGE-02',
      lane: 'L2',
      status: 'ok',
      title: '限制性竞招标公告',
      date: '2023-08-12',
      timeline: [
        { time: '2023-08-01 09:00', action: '编制限低压特防密封领域资质要求条款', owner: '特种采购局' },
        { time: '2023-08-12 11:30', action: '正式公告对外定向定询竞招标清单', owner: '哈国家油气委' }
      ],
      entities: [
        { id: 'ENT-INTL-NCOC', nameCn: 'NCOC 北里海作业商财团', role: '战略发起人' }
      ],
      documents: [
        { name: 'TENDER-SPEC_LNG阀室与低温管线规章.pdf', type: 'pdf', hash: '0xbf7a6c2e3d9a10fc' }
      ],
      fundFlow: [],
      riskLevel: '低',
      slaRemaining: '已完成',
      overdueDays: 0,
      aiInsight: '仅筛选有中高低温加压LNG成套装置承接先例的全球7家头部联合承包体登记。'
    },
    {
      id: 'EPC-AKT-S03',
      projectId: 'EPC-AKT',
      projectName: 'Aktau LNG 中转站 EPC',
      stageCode: 'STAGE-03',
      lane: 'L3',
      status: 'ok',
      title: '递交密闭方案及报价',
      date: '2023-10-05',
      timeline: [
        { time: '2023-10-01 17:000', action: '截止线上电子标接收', owner: '国资监管仓储办' },
        { time: '2023-10-05 14:00', action: '5家国际一等资质财团完整商务包封柜', owner: '国家外贸采招档案科' }
      ],
      entities: [
        { id: 'ENT-KZ-AKT-0091', nameCn: '西里海能源合资有限公司', role: '联合本地承揽代表' }
      ],
      documents: [
        { name: 'BID-PKG_五家投标包名录.xlsx', type: 'xlsx', hash: '0xbcde23415ef4168' }
      ],
      fundFlow: [],
      riskLevel: '低',
      slaRemaining: '已完成',
      overdueDays: 0,
      aiInsight: '投标人包含CB&I、Saipem等极高资质多边联体。方案名义符合承高爆载气密规。'
    },
    {
      id: 'EPC-AKT-S04',
      projectId: 'EPC-AKT',
      projectName: 'Aktau LNG 中转站 EPC',
      stageCode: 'STAGE-04',
      lane: 'L2',
      status: 'ok',
      title: '专家技术决议考选评分',
      date: '2023-11-18',
      timeline: [
        { time: '2023-11-10 09:00', action: '突袭盲抽11位高规格工业防爆审员组', owner: '部专家核选席' },
        { time: '2023-11-18 16:30', action: '判定CB&I联合体在综合方案设计得最高分', owner: '哈国家油气联合会商处' }
      ],
      entities: [
        { id: 'ENT-KZ-AST-MOE', nameCn: '采购局纪监委员席', role: '全流程审计' }
      ],
      documents: [
        { name: 'CB-I_技术评语及打分卷.pdf', type: 'pdf', hash: '0x99ea1c2b3d4f5e6a' }
      ],
      fundFlow: [],
      riskLevel: '低',
      slaRemaining: '已完成',
      overdueDays: 0,
      aiInsight: '打分一致程度在合理正态分布，AI对评审全流程行踪判定干净，无暗合勾连行为。'
    },
    {
      id: 'EPC-AKT-S05',
      projectId: 'EPC-AKT',
      projectName: 'Aktau LNG 中转站 EPC',
      stageCode: 'STAGE-05',
      lane: 'L1',
      status: 'ok',
      title: '签署总承包合同',
      date: '2023-12-22',
      timeline: [
        { time: '2023-12-15 11:00', action: '编制防重特大事故反受贿安全双签红界', owner: '国资监管总局' },
        { time: '2023-12-22 15:15', action: '签署正式施工正本契约 C-EPC-AKT-2023-019', owner: '哈气网总指挥办公室' }
      ],
      entities: [
        { id: 'ENT-INTL-NCOC', nameCn: 'NCOC 北里海作业商', role: '承签业主代表' },
        { id: 'ENT-KZ-AKT-0091', nameCn: '西里海能源合资有限公司', role: '本地联合总包承包商' }
      ],
      documents: [
        { name: 'C-EPC-AKT-2023-019_总包正文.pdf', type: 'pdf', hash: '0x2facd12b3e4f5a6b' }
      ],
      fundFlow: [],
      riskLevel: '低',
      slaRemaining: '已完成',
      overdueDays: 0,
      aiInsight: '确定总包EPC履约主体以KMG为主，合资形式绑定西里海能源与国际资质CB&I联合保障。'
    },
    {
      id: 'EPC-AKT-S06',
      projectId: 'EPC-AKT',
      projectName: 'Aktau LNG 中转站 EPC',
      stageCode: 'STAGE-06',
      lane: 'L3',
      status: 'ok',
      title: '大资配套落定',
      date: '2024-02-15',
      timeline: [
        { time: '2024-02-01 10:00', action: 'NCOC持股联合体核发大修预算', owner: 'NCOC董事会' },
        { time: '2024-02-15 16:30', action: 'KMG配合注资 $180M 正式入监管专户', owner: 'KMG自备资本金托管行' }
      ],
      entities: [
        { id: 'ENT-INTL-NCOC', nameCn: 'NCOC 北里海联合体', role: '发起注资' }
      ],
      documents: [
        { name: 'LNG-FINANCE_配套银行验资证明.pdf', type: 'pdf', hash: '0x88ea12db45fe6aec' }
      ],
      fundFlow: [
        { from: 'KMG 自筹专账', to: 'Aktau LNG 专项一期建设户', amount: '$180M' }
      ],
      riskLevel: '低',
      slaRemaining: '已完成',
      overdueDays: 0,
      aiInsight: '大宗首期自备项目配套资金全额到位。托管协议通过哈开发银行信批审核。'
    },
    {
      id: 'EPC-AKT-S07',
      projectId: 'EPC-AKT',
      projectName: 'Aktau LNG 中转站 EPC',
      stageCode: 'STAGE-07',
      lane: 'L1',
      status: 'ok',
      title: '中央财政配套批复',
      date: '2024-03-30',
      timeline: [
        { time: '2024-03-12 14:00', action: '上报中央宏观资源配置支持预算规划', owner: '国资局预算室' },
        { time: '2024-03-30 11:30', action: '财政部签署年度配套核字 [2024]12号专项批复', owner: '财政部基建分配署' }
      ],
      entities: [
        { id: 'ENT-KZ-AST-MOE', nameCn: '哈萨克斯坦能源部基础设施司', role: '规划分发者' }
      ],
      documents: [
        { name: 'GOV-BUDGET-LNG_中央年度批字.pdf', type: 'pdf', hash: '0x882a17f6bdcdcc' }
      ],
      fundFlow: [
        { from: '中央财政开发性预算', to: '里海港口一等专项过桥款', amount: '$150M' }
      ],
      riskLevel: '低',
      slaRemaining: '已完成',
      overdueDays: 0,
      aiInsight: '中央拨付资金名义通过预算总审，按工程各里程碑阶次分配发放防空饷。'
    },
    {
      id: 'EPC-AKT-S08',
      projectId: 'EPC-AKT',
      projectName: 'Aktau LNG 中转站 EPC',
      stageCode: 'STAGE-08',
      lane: 'L2',
      status: 'ok',
      title: '首期资金分派划拨',
      date: '2024-05-12',
      timeline: [
        { time: '2024-05-01 09:30', action: '国家开发银行向里海建设账户发支付凭证', owner: '开发行集中结算科' },
        { time: '2024-05-12 15:00', action: '阿克套海港项目专账正式结算到账 $150M', owner: '阿克套主管分行' }
      ],
      entities: [
        { id: 'ENT-KZ-AKT-0091', nameCn: '西里海能源合资公司结算科', role: '出账管理' }
      ],
      documents: [
        { name: 'KZT-LEDGER_国家银行扣款大表.pdf', type: 'pdf', hash: '0x1c3f2d4e5a9b8c0d' }
      ],
      fundFlow: [
        { from: '国家开发性信用账户', to: 'Aktau LNG 项目联账号', amount: '$150M' }
      ],
      riskLevel: '低',
      slaRemaining: '已完成',
      overdueDays: 0,
      aiInsight: '国库分拨到位，在财务稽查模型勾描下清白，没有检测出中间分流损耗违规。'
    },
    {
      id: 'EPC-AKT-S09',
      projectId: 'EPC-AKT',
      projectName: 'Aktau LNG 中转站 EPC',
      stageCode: 'STAGE-09',
      lane: 'L3',
      status: 'risk',
      title: '压缩机叶片裂纹预警',
      date: '2026-04-28',
      timeline: [
        { time: '2026-04-28 03:14', action: 'SCADA 系统报警 · 一级压缩站三极震动 0.42σ', owner: 'ENT-KZ-AKT-0091 运维班' },
        { time: '2026-04-28 06:30', action: '运维主管现场核查 · 确认叶片表面裂纹', owner: 'Bauyrzhan A.' },
        { time: '2026-04-28 09:00', action: '设备制造商 GE 远程诊断介入', owner: 'GE Oil & Gas 工程团队' },
        { time: '2026-04-29 15:20', action: 'AI 寿命预测模型评估 · 14 天内漏气概率 87%', owner: '能源部 AI 风险模型' },
        { time: '2026-05-02 10:00', action: '能源部下发暂缓付款指令', owner: '能源部督查司' },
        { time: '2026-05-08 14:00', action: '设备维修方案审定', owner: '联合技术评审组' },
        { time: '2026-05-15 09:00', action: '叶片更换施工进行中', owner: 'NCOC 维修班' },
        { time: '2026-05-28 06:00', action: '当前 · 维修完成 73% · 计划 6 月初恢复', owner: '—' }
      ],
      entities: [
        { id: 'ENT-KZ-AKT-0091', nameCn: '西里海能源合资有限公司', role: '设施运维方' },
        { id: 'ENT-US-GE-OG', nameCn: 'GE Oil & Gas', role: '设备原厂' },
        { id: 'ENT-INTL-NCOC', nameCn: 'NCOC 北里海作业商', role: 'EPC 业主代表' }
      ],
      documents: [
        { name: 'SCADA_报警日志_20260428.csv', type: 'csv', hash: '0x1f5d8e3a...' },
        { name: 'GE_远程诊断报告.pdf', type: 'pdf', hash: '0x6a2c9b7d...' },
        { name: 'AI_寿命预测模型输出.json', type: 'json', hash: '0x9e4f1a3b...' },
        { name: '能源部督查司暂缓付款指令_2026-05-02.pdf', type: 'pdf', hash: '0xd3c8b1e0...' },
        { name: '设备维修方案_v1.2.pdf', type: 'pdf', hash: '0x7b9f3e2c...' }
      ],
      fundFlow: [
        { from: '项目预算池', to: '维修紧急储备', amount: '$2.4M' },
        { from: '保险公司 (Aviva)', to: 'NCOC 维修结算账户', amount: '$1.8M (理赔预付)' }
      ],
      riskLevel: '高',
      slaRemaining: '维修剩余 8d',
      overdueDays: 0,
      aiInsight: '本节点 AI 风险模型基于 SCADA 时序数据（三级震动 + 油温偏差 + 出口压差）综合判断叶片裂纹发展速率，14 天漏气概率 87%。建议关联企业 ENT-KZ-AKT-0091 西里海能源运维数据进行设备生命周期全量复盘；同时核查其他 7 台同型号 GE ICL 压缩机的同步预警。点击下方"穿透至企业详情"打开 EnterpriseDetailDrawer。'
    },
    {
      id: 'EPC-AKT-S10',
      projectId: 'EPC-AKT',
      projectName: 'Aktau LNG 中转站 EPC',
      stageCode: 'STAGE-10',
      lane: 'L4',
      status: 'wip',
      title: '第四期进度款暂缓审核',
      date: '2026-05-10',
      timeline: [
        { time: '2026-05-01 09:00', action: '提交四期工程款请拨表 $42M', owner: 'EPC总包' },
        { time: '2026-05-02 14:00', action: '鉴于压缩站SCADA三级预警，审计介入强制暂缓', owner: '驻地稽司办公室' },
        { time: '2026-05-10 11:30', action: '发出正式暂缓出账限期纠偏单', owner: '能源部督查总局' }
      ],
      entities: [
        { id: 'ENT-KZ-AST-MOE', nameCn: '能源部驻地派稽巡办', role: '防损风控方' }
      ],
      documents: [
        { name: 'STOP-PAYMENT_暂缓支付核准书.pdf', type: 'pdf', hash: '0x9923884112fcdebc' }
      ],
      fundFlow: [
        { from: '哈开发结算行', to: '西里海能源专账', amount: '$42M (暂停截留)' }
      ],
      riskLevel: '中',
      slaRemaining: '暂缓待验',
      overdueDays: 0,
      aiInsight: '因叶片爆裂险情未归零，依据合规审查法强制阻断后续大宗付款流。'
    },
    {
      id: 'EPC-AKT-S11',
      projectId: 'EPC-AKT',
      projectName: 'Aktau LNG 中转站 EPC',
      stageCode: 'STAGE-11',
      lane: 'L2',
      status: 'wip',
      title: '维修补偿及变更草审',
      date: '2026-05-22',
      timeline: [
        { time: '2026-05-15 10:00', action: '发起高压压缩系统缺陷损失测估', owner: '三方保赔工估师' },
        { time: '2026-05-20 14:00', action: '递交追加施工和GE更换部件变更签证 (+$2.4M)', owner: 'EPC项目部' },
        { time: '2026-05-22 16:30', action: '合规外审认定不属于违约，进入绿色审批流', owner: '德勒阿拉木图特别代表' }
      ],
      entities: [
        { id: 'ENT-US-GE-OG', nameCn: 'GE 驻阿克套支持工程组', role: '三方认定设备商' }
      ],
      documents: [
        { name: 'REPAIR-CHANGE_紧急更换签证汇编.xlsx', type: 'xlsx', hash: '0xbcde44511facdcbe' }
      ],
      fundFlow: [],
      riskLevel: '中',
      slaRemaining: '草审中',
      overdueDays: 0,
      aiInsight: '变更追加测算符合现场高危阀室改造，防渗措施已随附到技术报告。'
    },
    {
      id: 'EPC-AKT-S12',
      projectId: 'EPC-AKT',
      projectName: 'Aktau LNG 中转站 EPC',
      stageCode: 'STAGE-12',
      lane: 'L4',
      status: 'pending',
      title: '纠偏驻点外勤闭环待派',
      date: '2026-06-01',
      timeline: [
        { time: '2026-05-25 09:00', action: '调度一等执务督警巡派单拟定', owner: '能源部规划监管办公室' }
      ],
      entities: [
        { id: 'ENT-KZ-AST-MOE', nameCn: '州合规稽私外勤大队', role: '待出动特警' }
      ],
      documents: [
        { name: 'DEPLOYMENT_阿克套外勤指令单.docx', type: 'docx', hash: '0x992388eabcdaaa12' }
      ],
      fundFlow: [],
      riskLevel: '中',
      slaRemaining: '待派发',
      overdueDays: 0,
      aiInsight: '预计在GE叶片整修施工落定期（6月初）正式进行外勤SCADA实感物理测绘合规核销。'
    },

    // ==========================================
    // 3. STORYLINE C: BOT-ATY - Atyrau 火电延寿 BOT
    // ==========================================
    {
      id: 'BOT-ATY-S01',
      projectId: 'BOT-ATY',
      projectName: 'Atyrau 火电延寿 BOT',
      stageCode: 'STAGE-01',
      lane: 'L1',
      status: 'ok',
      title: '低排长效战略立项',
      date: '2024-01-15',
      timeline: [
        { time: '2024-01-10 10:00', action: '西部主要火力网点超长役期低碳配改造批文起草', owner: '煤电与常备能源局' },
        { time: '2024-01-15 15:30', action: '正式印发 EM-BOT-2024-031 规划立案', owner: '副部长主管司长闭门会' }
      ],
      entities: [
        { id: 'ENT-KZ-AST-MOE', nameCn: '哈萨克斯坦能源部电力司', role: '立项审发' }
      ],
      documents: [
        { name: 'EM-BOT-2024-031_批复书.pdf', type: 'pdf', hash: '0x7e81ab92bcdeff' }
      ],
      fundFlow: [],
      riskLevel: '低',
      slaRemaining: '已完成',
      overdueDays: 0,
      aiInsight: '立项文件已将BOT特许运营期限核定为25年，排碳配额折减20%标准落位。'
    },
    {
      id: 'BOT-ATY-S02',
      projectId: 'BOT-ATY',
      projectName: 'Atyrau 火电延寿 BOT',
      stageCode: 'STAGE-02',
      lane: 'L2',
      status: 'ok',
      title: '公开BOT公告发案',
      date: '2024-03-20',
      timeline: [
        { time: '2024-03-05 09:00', action: '订制特许专营权对标规则', owner: '采招监督处' },
        { time: '2024-03-20 11:30', action: '上线 TenderID BOT-ATY-POWER 邀标公告', owner: '政府采购网' }
      ],
      entities: [
        { id: 'ENT-KZ-AST-MOE', nameCn: '能源部电力采购中心', role: '招标方' }
      ],
      documents: [
        { name: 'BOT-ATY-POWER_招标规则指引.docx', type: 'docx', hash: '0x948abdc929384e03bc' }
      ],
      fundFlow: [],
      riskLevel: '低',
      slaRemaining: '已完成',
      overdueDays: 0,
      aiInsight: '12家国际综合工程巨头取得首轮商洽，完成企业工商背景自筛过滤无黑名单。'
    },
    {
      id: 'BOT-ATY-S03',
      projectId: 'BOT-ATY',
      projectName: 'Atyrau 火电延寿 BOT',
      stageCode: 'STAGE-03',
      lane: 'L3',
      status: 'ok',
      title: '投标文件及保证金入库',
      date: '2024-05-08',
      timeline: [
        { time: '2024-05-01 17:00', action: '电子开标箱自动对码锁定', owner: '电子招商监督大厅' },
        { time: '2024-05-08 14:00', action: '8家财团保证资金划账并取得双盲钥匙', owner: '档案馆高管处' }
      ],
      entities: [
        { id: 'ENT-KZ-ATY-0203', nameCn: '三一动力 Atyrau Power JSC 联体', role: '投标项目代表' }
      ],
      documents: [
        { name: 'BID-LOG_参选人保证凭证.xlsx', type: 'xlsx', hash: '0x1c3d4e5f6a9b8c0d' }
      ],
      fundFlow: [
        { from: '三一动力等投标联合体', to: '国库代管保证金户', amount: '$10M (财务押金)' }
      ],
      riskLevel: '低',
      slaRemaining: '已完成',
      overdueDays: 0,
      aiInsight: '投标资本实力和信誉合规分核验通关，未出现跨境涉洗黑钱异常挂牌。'
    },
    {
      id: 'BOT-ATY-S04',
      projectId: 'BOT-ATY',
      projectName: 'Atyrau 火电延寿 BOT',
      stageCode: 'STAGE-04',
      lane: 'L2',
      status: 'ok',
      title: '综合评标会合决议书',
      date: '2024-06-25',
      timeline: [
        { time: '2024-06-15 09:00', action: '启动双盲交叉商务与技术多因素判定评分', owner: '三方评标处' },
        { time: '2024-06-25 15:00', action: '确定三一动力联合中标签署草案', owner: '综合评审主席团' }
      ],
      entities: [
        { id: 'ENT-CN-CSC-SANY', nameCn: '三一动力哈萨克能源部', role: '中选候选代表' }
      ],
      documents: [
        { name: 'BOT-EVAL_综合打分终合决议书.pdf', type: 'pdf', hash: '0xabcdeff1239aa8e3' }
      ],
      fundFlow: [],
      riskLevel: '低',
      slaRemaining: '已完成',
      overdueDays: 0,
      aiInsight: '打分一致程度优。中选企业三一动力与部级主管、地方财政无亲缘关联，防腐判定净。'
    },
    {
      id: 'BOT-ATY-S05',
      projectId: 'BOT-ATY',
      projectName: 'Atyrau 火电延寿 BOT',
      stageCode: 'STAGE-05',
      lane: 'L1',
      status: 'ok',
      title: '正式中标签合签署于核准',
      date: '2024-08-10',
      timeline: [
        { time: '2024-08-01 10:00', action: '起草BOT运营期排他契约 C-BOT-ATY-2024-031', owner: '能源部法律政策局' },
        { time: '2024-08-10 11:30', action: '能源部长党组联席会议正式签署并授牌', owner: '部党组签发办公室' }
      ],
      entities: [
        { id: 'ENT-KZ-ATY-0203', nameCn: '阿特劳综合贸易与仓储物流合作企业 Atyrau Power JSC', role: 'BOT特许经营项目公司' }
      ],
      documents: [
        { name: 'C-BOT-ATY-2024-031_BOT契约正本.pdf', type: 'pdf', hash: '0x99eaabf12cde4b6f' }
      ],
      fundFlow: [],
      riskLevel: '低',
      slaRemaining: '已完成',
      overdueDays: 0,
      aiInsight: '政府承诺配套电价在合理民生补贴浮动范围内，三方独立清算框架已完成锁死。'
    },
    {
      id: 'BOT-ATY-S06',
      projectId: 'BOT-ATY',
      projectName: 'Atyrau 火电延寿 BOT',
      stageCode: 'STAGE-06',
      lane: 'L3',
      status: 'ok',
      title: '合资格资本金注入',
      date: '2024-10-20',
      timeline: [
        { time: '2024-10-05 09:00', action: '国企合资Samruk-Energy打入一期匹配资款数', owner: '商发结算科' },
        { time: '2024-10-18 11:30', action: '三一动力打入股本配套 $420M 进托管专账', owner: '托管银行 Citibank Almaty' }
      ],
      entities: [
        { id: 'ENT-CN-CSC-SANY', nameCn: '三一动力驻阿特劳财务处', role: '共同股本方' }
      ],
      documents: [
        { name: 'KZT-BANK_股本验证核实单.pdf', type: 'pdf', hash: '0x1c3d2e5faa1bcde9' }
      ],
      fundFlow: [
        { from: 'Samruk-Energy & 三一资本', to: 'Atyrau 火电特许托管户', amount: '$420M' }
      ],
      riskLevel: '低',
      slaRemaining: '已完成',
      overdueDays: 0,
      aiInsight: '股本出资到位率 100%。 Citigroup 阿拉木图合规洗钱判定干净无异常。'
    },
    {
      id: 'BOT-ATY-S07',
      projectId: 'BOT-ATY',
      projectName: 'Atyrau 火电延寿 BOT',
      stageCode: 'STAGE-07',
      lane: 'L1',
      status: 'ok',
      title: '财政贴金支持审定',
      date: '2024-12-05',
      timeline: [
        { time: '2024-11-20 14:00', action: '能源部电力主管司发起低碳改造贴息申请书', owner: '电力综合司' },
        { time: '2024-12-05 10:30', action: '财政部签署贴息核拨准许命令 $80M', owner: '国家贴备管理司' }
      ],
      entities: [
        { id: 'ENT-KZ-AST-MOE', nameCn: '哈能源部电力配套科', role: '中央部内审核' }
      ],
      documents: [
        { name: 'GOV-SUBS_BOT贴息支持命令书.pdf', type: 'pdf', hash: '0x2facbdeff19bcdee' }
      ],
      fundFlow: [
        { from: '中央火政改造贴金池', to: 'BOT 补贴过桥户', amount: '$80M' }
      ],
      riskLevel: '低',
      slaRemaining: '已完成',
      overdueDays: 0,
      aiInsight: '匹配财政资金融合通过国会大宗低碳改税款扶持案。'
    },
    {
      id: 'BOT-ATY-S08',
      projectId: 'BOT-ATY',
      projectName: 'Atyrau 火电延寿 BOT',
      stageCode: 'STAGE-08',
      lane: 'L2',
      status: 'ok',
      title: '过桥贴息首拨出库',
      date: '2025-01-30',
      timeline: [
        { time: '2025-01-15 09:30', action: '财政集中支付向阿特劳分账户放款首期款', owner: '支付一科' },
        { time: '2025-01-30 15:00', action: '工程一期贴息 $16M 结算到账', owner: '托管行 Bank CenterCredit' }
      ],
      entities: [
        { id: 'ENT-KZ-ATY-0203', nameCn: 'Atyrau Power JSC 财务核算部', role: '收账方' }
      ],
      documents: [
        { name: 'SUBSDY-RECEIPT_财政首期过桥打款单.pdf', type: 'pdf', hash: '0xbb22ffaacde900cde' }
      ],
      fundFlow: [
        { from: '中央专项贴息池', to: 'Atyrau Power JSC 贴息结算主账号', amount: '$16M' }
      ],
      riskLevel: '低',
      slaRemaining: '已完成',
      overdueDays: 0,
      aiInsight: '国库过桥成功下发，自锁程序未见被贪污留置。'
    },
    {
      id: 'BOT-ATY-S09',
      projectId: 'BOT-ATY',
      projectName: 'Atyrau 火电延寿 BOT',
      stageCode: 'STAGE-09',
      lane: 'L3',
      status: 'ok',
      title: 'EPC总代排污升级动工',
      date: '2025-03-12',
      timeline: [
        { time: '2025-03-01 10:00', action: '签署哈电站一期超低排放改造主炉包工程令', owner: '项目总经理 Kanat M.' },
        { time: '2025-03-12 08:30', action: '现场旧变温锅炉管改造吊桩完成', owner: '三一动力工程承造组' }
      ],
      entities: [
        { id: 'ENT-CN-CSC-SANY', nameCn: '三一动力哈萨克分公司工程部', role: '总承造EPC' }
      ],
      documents: [
        { name: 'CONSTRUCTION_锅炉改造现场合照及核项.pdf', type: 'pdf', hash: '0x88ea3cd1e9fcbaab' }
      ],
      fundFlow: [
        { from: 'Atyrau BOT 基本建设账', to: '三一动力总承包商开票账', amount: '$30M' }
      ],
      riskLevel: '低',
      slaRemaining: '施工进行中',
      overdueDays: 0,
      aiInsight: '实感物理网反馈进度到达64%，改造尾烟气多组气体遥测表现干净。'
    },
    {
      id: 'BOT-ATY-S10',
      projectId: 'BOT-ATY',
      projectName: 'Atyrau 火电延寿 BOT',
      stageCode: 'STAGE-10',
      lane: 'L4',
      status: 'ok',
      title: '工程节点出账支付',
      date: '2026-05-15',
      timeline: [
        { time: '2026-05-10 09:00', action: '三期建设结算工程款申请提交', owner: '总承包商财务司' },
        { time: '2026-05-14 11:30', action: '地方审计核结认定该期工程完成无虚多欺瞒', owner: '阿特劳专项会审组' },
        { time: '2026-05-15 16:30', action: '正式出账支付 $30M', owner: '项目公司董事会' }
      ],
      entities: [
        { id: 'ENT-KZ-ATY-0203', nameCn: 'Atyrau Power JSC', role: '项目出账主体' }
      ],
      documents: [
        { name: 'PAYMENT_三期工程出金支付单.pdf', type: 'pdf', hash: '0x112233acbcde98' }
      ],
      fundFlow: [
        { from: 'Atyrau BOT 专用建设账户', to: '三一动力结算开户', amount: '$30M' }
      ],
      riskLevel: '低',
      slaRemaining: '已付款',
      overdueDays: 0,
      aiInsight: '三期工程款核销名义上是100%合规，财务三维对标数据均好。'
    },
    {
      id: 'BOT-ATY-S11',
      projectId: 'BOT-ATY',
      projectName: 'Atyrau 火电延寿 BOT',
      stageCode: 'STAGE-11',
      lane: 'L2',
      status: 'risk',
      title: 'EPC 主分包商退出变更',
      date: '2026-05-08',
      timeline: [
        { time: '2026-04-22 11:00', action: 'KazMech (主分包商) 财务异常预警 · 商业图谱告警', owner: '能源部 AI 风控' },
        { time: '2026-04-30 16:30', action: 'KazMech 正式发函通知退出 · 母公司流动性问题', owner: 'KazMech 法务部' },
        { time: '2026-05-08 09:00', action: '能源部启动应急变更程序', owner: '能源部采购监管司' },
        { time: '2026-05-12 14:00', action: '紧急评审：3 家备用分包商技术评估', owner: '应急评审组' },
        { time: '2026-05-18 10:00', action: '锁定 Karaganda Industrial 作为新分包商', owner: '采购监管司' },
        { time: '2026-05-22 15:30', action: '变更金额测算 $48M · 财政部专项审议', owner: '财政部预算司' },
        { time: '2026-05-25 09:00', action: '纠偏工作组进场 · 组长 Kanat M.', owner: 'L4 驻地巡查 + 审计' },
        { time: '2026-05-28 06:00', action: '当前 · 待财政批复 · 预计 6 月底归位', owner: '—' }
      ],
      entities: [
        { id: 'ENT-KZ-AST-KZMECH', nameCn: 'KazMech 工程联合体', role: '原 EPC 主分包商（退出）' },
        { id: 'ENT-KZ-KGD-KIND', nameCn: 'Karaganda Industrial', role: '新 EPC 主分包商（接手）' },
        { id: 'ENT-CN-CSC-SANY', nameCn: '三一动力哈萨克分公司', role: 'EPC 总包' }
      ],
      documents: [
        { name: 'KazMech_退出函_2026-04-30.pdf', type: 'pdf', hash: '0x4a8c2d...' },
        { name: '应急变更评审记录.pdf', type: 'pdf', hash: '0x8b3f1e...' },
        { name: '3家备用分包商技术评估对比.xlsx', type: 'xlsx', hash: '0x2c9d4a...' },
        { name: 'Karaganda_Industrial_中标确认.pdf', type: 'pdf', hash: '0x6f1b8e...' },
        { name: '变更金额测算_+$48M.pdf', type: 'pdf', hash: '0xa7d3c0...' }
      ],
      fundFlow: [
        { from: 'BOT 项目储备金', to: '变更应急资金池', amount: '$48M (测算中)' },
        { from: '财政部贴息', to: '项目公司', amount: '+$16M (年度第二批)' }
      ],
      riskLevel: '高',
      slaRemaining: '财政批复 SLA 5d',
      overdueDays: 0,
      aiInsight: '本变更触发可追溯至 STAGE-09 执行阶段未能及时识别分包商 KazMech 的财务异常。建议：① 把"分包商财务穿透"纳入执行阶段例行风控；② 将本案例反向链接到商业图谱模块，触发对其他在管项目中同关联方的扫描。'
    },
    {
      id: 'BOT-ATY-S12',
      projectId: 'BOT-ATY',
      projectName: 'Atyrau 火电延寿 BOT',
      stageCode: 'STAGE-12',
      lane: 'L4',
      status: 'wip',
      title: '纠偏组现场进驻整改',
      date: '2026-05-25',
      timeline: [
        { time: '2026-05-20 09:00', action: '部颁发委派特命纠偏工令单', owner: '能源监督总司' },
        { time: '2026-05-25 08:30', action: '纠偏召集现场三方交底和锁工推进会', owner: '纠偏工作组组长 Kanat M.' }
      ],
      entities: [
        { id: 'ENT-KZ-KGD-KIND', nameCn: '新备分承包 Karaganda 工作组', role: '现场备勤' }
      ],
      documents: [
        { name: 'REMEDY-PLAN_现场整改调度图章.pdf', type: 'pdf', hash: '0x2facebbbfaacdc99' }
      ],
      fundFlow: [],
      riskLevel: '中',
      slaRemaining: '整顿推进中',
      overdueDays: 0,
      aiInsight: '通过重新指派备用分包商 Karaganda 锁死现场滑片施工重合期，确保工期不大幅脱期。'
    }
  ],
  
  // Retro causal link lines representing AI causal tracing back paths
  aiCrossLinks: [
    { from: 'PPP-ALM-S10', to: 'PPP-ALM-S07', reason: '付款逾期根因 → 预算配套不足' },
    { from: 'EPC-AKT-S09', to: 'ENT-KZ-AKT-0091', reason: '设备异常 → 穿透至运维企业' },
    { from: 'BOT-ATY-S11', to: 'BOT-ATY-S09', reason: '变更触发 → 执行阶段未识别分包商财务异常' }
  ]
};
