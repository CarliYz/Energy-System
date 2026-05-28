// src/data/audit/project_execution.ts
export type ExecNode = {
  step: 'Contract' | 'Investment' | 'Budget' | 'Funding' | 'Execution' | 'Payment' | 'Change' | 'Remediation';
  status: 'ok' | 'wip' | 'risk';
  date: string;
  amount?: string;
  owner: string;
  riskDetail?: {
    summary: string;
    rootCause: string;
    responsibleParty: string;
    relatedContract: string;
    fundFlow: string[];
    suggestedActions: string[];
  };
};

export type ExecProject = {
  id: string;
  name: string;
  type: string;
  totalInvestment: string;
  nodes: ExecNode[];
};

export const projectExecution: ExecProject[] = [
  {
    id: 'PPP-ALM-SOLAR-2024-007',
    name: 'Almaty 北部光伏 800MW',
    type: 'PPP',
    totalInvestment: '$1.6B',
    nodes: [
      { step: 'Contract', status: 'ok', date: '2024-06-12', amount: '$1.6B', owner: '能源部 + Sembcorp' },
      { step: 'Investment', status: 'ok', date: '2024-09-30', amount: '$320M', owner: '股东注资额' },
      { step: 'Budget', status: 'ok', date: '2024-11-20', amount: '$280M', owner: '能源部预算司' },
      { step: 'Funding', status: 'ok', date: '2025-01-15', amount: '$280M', owner: '国库预算拨款' },
      { step: 'Execution', status: 'ok', date: '2025-04-01', amount: '—', owner: 'EPC总包 PowerChina' },
      { step: 'Payment', status: 'ok', date: '2025-12-20', amount: '$112M', owner: '各期结算完毕' },
      { 
        step: 'Change', 
        status: 'risk', 
        date: '2026-04-15', 
        amount: '$12M overdue', 
        owner: 'Mangystau 州财政厅',
        riskDetail: {
          summary: '付款严重逾期 47 天 ($12M)',
          rootCause: '地方基建过桥基金财政流动性紧张，回拔流程冗长',
          responsibleParty: 'Mangystau 州财政厅基建处',
          relatedContract: 'PPP-ALM-SOLAR-2024-007-REV4',
          fundFlow: ['① 中央财政统发下拨', '② 州财政过桥托管户', '③ 绿色光复项目建设账'],
          suggestedActions: ['提请总理办公室协调核批', '一键启动专项督查跟踪报告']
        }
      },
      { step: 'Remediation', status: 'wip', date: '2026-05-20', amount: '—', owner: '重大整改专案组' },
    ]
  },
  {
    id: 'EPC-AKT-LNG-2023-019',
    name: 'Aktau LNG 中转站二期',
    type: 'EPC',
    totalInvestment: '$890M',
    nodes: [
      { step: 'Contract', status: 'ok', date: '2023-03-12', amount: '$890M', owner: '哈国家油气委' },
      { step: 'Investment', status: 'ok', date: '2023-05-18', amount: '$180M', owner: 'KMG 自备主干资金' },
      { step: 'Budget', status: 'ok', date: '2023-08-11', amount: '$150M', owner: 'KMG 董事会审计' },
      { step: 'Funding', status: 'ok', date: '2023-11-04', amount: '$150M', owner: '哈萨克斯坦开发银行' },
      { 
        step: 'Execution', 
        status: 'risk', 
        date: '2025-06-12', 
        amount: '停工整顿', 
        owner: 'EPC主包 Atyrau Const',
        riskDetail: {
          summary: '高压阀室组安全评估真空泄漏不合规',
          rootCause: '承包商采购未批第三方低资质廉价阀门组件并提供伪造检测大数',
          responsibleParty: 'Atyrau Construction LLP 工程局',
          relatedContract: 'EPC-AKT-LNG-MAIN-2023',
          fundFlow: ['① 国家外汇开发专项贷', '② 包工包料采购结款', '③ 黑市阀件劣质原物料商'],
          suggestedActions: ['下达硬查封停工整改函', '没收其二期工程履约质量质保金']
        }
      },
      { step: 'Payment', status: 'ok', date: '2024-09-12', amount: '$45M', owner: '已结算' },
      { step: 'Change', status: 'ok', date: '2025-01-22', amount: '—', owner: '工程路线微调' },
      { step: 'Remediation', status: 'wip', date: '2026-05-15', amount: '—', owner: '质量部派特特遣组' },
    ]
  },
  {
    id: 'BOT-ATY-POWER-2024-031',
    name: 'Atyrau 火电厂超低排改造延寿',
    type: 'BOT',
    totalInvestment: '$2.1B',
    nodes: [
      { step: 'Contract', status: 'ok', date: '2024-01-15', amount: '$2.1B', owner: '阿特劳电力合伙大体' },
      { step: 'Investment', status: 'ok', date: '2024-04-10', amount: '$420M', owner: '特许设立专款' },
      { step: 'Budget', status: 'ok', date: '2024-07-20', amount: '$380M', owner: '国家工业复苏基金' },
      { 
        step: 'Funding', 
        status: 'risk', 
        date: '2024-10-18', 
        amount: '$50M 资本豁口', 
        owner: '特许受托行 Deloitte',
        riskDetail: {
          summary: '资本金过桥跨国流转违规冻结',
          rootCause: '境外金融中介由于涉嫌提供注水关联资产证明致使信托账户突遭国际合规处临时冻结',
          responsibleParty: 'Deloitte Almaty Audit Team 以及特聘法务所',
          relatedContract: 'BOT-ATY-POWER-BANK-LOCK',
          fundFlow: ['① 欧洲能源复兴开发投资', '② 离岸代管联合外币托管', '③ 境内火力发电项自备款'],
          suggestedActions: ['启动国家级司法救助强制接管', '封禁中介在该项特许资格授权']
        }
      },
      { step: 'Execution', status: 'ok', date: '2025-02-15', amount: '—', owner: '哈锅炉股份制造局' },
      { step: 'Payment', status: 'ok', date: '2025-08-30', amount: '$30M', owner: '已付一期主给水款' },
      { step: 'Change', status: 'ok', date: '2025-11-20', amount: '—', owner: '特许期权续签备考' },
      { step: 'Remediation', status: 'wip', date: '2026-05-25', amount: '—', owner: '部派合规稽查办' },
    ]
  }
];
