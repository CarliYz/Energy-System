import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft,
  Info,
  AlertTriangle,
  CheckCircle2,
  Clock,
  X,
  History,
  ShieldCheck,
  ChevronRight,
  GitBranch,
  Search,
  Maximize,
  Minimize,
  Download,
  Zap,
  FileText,
  FileCheck,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { motion, AnimatePresence } from 'motion/react';

// Data imports
import { useLanguage } from '../components/LanguageContext';
import { projectLifecycle, Node, Stage, Lane, AiCrossLink } from '../data/audit/project_lifecycle';
import { EnterpriseDetailDrawer } from '../components/EnterpriseDetailDrawer';
import { enterpriseKB } from '../data/commercial/enterprise_kb';

// Status styling setup matching EventAudit
const STATUS_STYLING = {
  ok: { fill: '#E6F6EC', border: '#2FA862', text: '#2FA862', labelEn: 'NORMAL', labelZh: '常态平稳' },
  wip: { fill: '#FFF6E1', border: '#E89518', text: '#E89518', labelEn: 'WIP', labelZh: '进行中' },
  risk: { fill: '#FDE7E7', border: '#D8454C', text: '#D8454C', labelEn: 'RISK', labelZh: '重度异常' },
  pending: { fill: '#F1F4F8', border: '#9CA3AF', text: '#6B7280', labelEn: 'PENDING', labelZh: '等待中' }
};

// 12 columns stages translations helper
const STAGES_HEADER_INFO: Record<Stage, { nameCn: string; nameEn: string; code: string; isProcurement: boolean }> = {
  'STAGE-01': { nameCn: '立项审批', nameEn: 'Approval', code: 'STAGE-01', isProcurement: true },
  'STAGE-02': { nameCn: '招标公告', nameEn: 'Tender', code: 'STAGE-02', isProcurement: true },
  'STAGE-03': { nameCn: '投标报价', nameEn: 'Bidding', code: 'STAGE-03', isProcurement: true },
  'STAGE-04': { nameCn: '评标定标', nameEn: 'Evaluation', code: 'STAGE-04', isProcurement: true },
  'STAGE-05': { nameCn: '中标签约', nameEn: 'Award', code: 'STAGE-05', isProcurement: true },
  'STAGE-06': { nameCn: '投资落定', nameEn: 'Investment', code: 'STAGE-06', isProcurement: false },
  'STAGE-07': { nameCn: '预算批复', nameEn: 'Budget', code: 'STAGE-07', isProcurement: false },
  'STAGE-08': { nameCn: '资金到位', nameEn: 'Funding', code: 'STAGE-08', isProcurement: false },
  'STAGE-09': { nameCn: '建设履约', nameEn: 'Execution', code: 'STAGE-09', isProcurement: false },
  'STAGE-10': { nameCn: '付款节点', nameEn: 'Payment', code: 'STAGE-10', isProcurement: false },
  'STAGE-11': { nameCn: '变更管理', nameEn: 'Change', code: 'STAGE-11', isProcurement: false },
  'STAGE-12': { nameCn: '纠偏复核', nameEn: 'Remediation', code: 'STAGE-12', isProcurement: false }
};

// 4 lanes row headers setup
const LANES_HEADER_INFO: Record<Lane, { nameCn: string; nameEn: string; orgCn: string; orgEn: string }> = {
  'L1': { nameCn: 'L1 · 部长决策层', nameEn: 'MINISTER LEVEL', orgCn: '能源部 + 总理办', orgEn: 'Ministry & Premier Off.' },
  'L2': { nameCn: 'L2 · 采购监管司', nameEn: 'PROCUREMENT BUREAU', orgCn: '下属国资采购监管局', orgEn: 'Procurement Regulatory Bureau' },
  'L3': { nameCn: 'L3 · 业主 + EPC', nameEn: 'PROJECT OWNER & EPC', orgCn: '项目公司 + 总包承包商', orgEn: 'Project Owner & Main EPC' },
  'L4': { nameCn: 'L4 · 驻地巡查 + 审计', nameEn: 'FIELD RO & AUDITOR', orgCn: '省驻地办事处 / 第三方审计机构', orgEn: 'Regional Inspection Office & Deloitte Audit' }
};

// 12 columns array
const COLUMNS_LIST: Stage[] = [
  'STAGE-01', 'STAGE-02', 'STAGE-03', 'STAGE-04', 'STAGE-05',
  'STAGE-06', 'STAGE-07', 'STAGE-08', 'STAGE-09', 'STAGE-10',
  'STAGE-11', 'STAGE-12'
];

// 4 lanes list
const LANES_LIST: Lane[] = ['L1', 'L2', 'L3', 'L4'];

const translateNodeTitle = (title: string, isZh: boolean) => {
  if (isZh) return title;
  const mappings: Record<string, string> = {
    '战略立项批复': 'Strategic Charter Approval',
    '公开招标公告发布': 'Open Tender Announcement',
    '投标文件接收封存': 'Tender Submission Sealed',
    '专家委员会评分': 'Expert Evaluation & Scoring',
    '合同签署印发': 'Tender Award & Contract Signed',
    '股东资本金到位': 'Shareholder Capital Cleared',
    '国家年度项目预算审批': 'National Budget Allocation Approval',
    '国库补贴划拨到位': 'Treasury Subsidy Disbursed',
    'EPC主装设备施工履约': 'EPC Equipment Commissioning',
    '第三期工程款付款逾期': 'Milestone 3 Payment Overdue',
    '逾期还款补充机制谈判': 'Overdue Restructuring Negotiated',
    '督察与专项内控复核': 'Audit & Internal Control Review',
    '限制性竞招标公告': 'Restrictive Tender Announcement',
    '递交密闭方案及报价': 'Sealed Proposals & Quotes',
    '专家技术决议考选评分': 'Expert Panel Technical Scoring',
    '签署总承包合同': 'EPC Contract Execution',
    '大资配套落定': 'Capital Matching Finalized',
    '中央财政配套批复': 'Central Budget Matching Approval',
    '首期资金分派划拨': 'Tranche 1 Escrow Funding Released',
    '压缩机叶片裂纹预警': 'Compressor Blade Anomaly Alert',
    '第四期进度款暂缓审核': 'Tranche 4 Payment Put On Hold',
    '维修补偿及变更草审': 'Maintenance Compensation & Change Audit',
    '纠偏驻点外勤闭环待派': 'Remediation Dispatch Pending',
    '低排长效战略立项': 'Low-Emission Retrofit Charter Approval',
    '公开BOT公告发案': 'Open BOT Tender Announcement',
    '投标文件及保证金入库': 'Bid Documents & Escrow Deposited',
    '综合评标会合决议书': 'Comprehensive Panel Resolution',
    '正式中标签合签署于核准': 'BOT Award & Agreement Executed',
    '合资格资本金注入': 'Registered Capital Contribution',
    '财政贴金支持审定': 'Treasury Subsidy Endorsement',
    '过桥贴息首拨出库': 'Bridge Interest Subsidy Disbursed',
    'EPC总代排污升级动工': 'EPC Emission Upgrades Break Ground',
    '工程节点出账支付': 'EPC Milestone Payment Processed',
    'EPC 主分包商退出变更': 'EPC Lead Subcontractor Exit Change',
    '纠偏组现场进驻整改': 'Remediation Group On-Site Deployment'
  };
  return mappings[title] || title;
};

const translateProjectName = (name: string, isZh: boolean) => {
  if (isZh) return name;
  const mappings: Record<string, string> = {
    'Almaty 北部光伏 800MW PPP': 'Almaty Northern PV 800MW PPP',
    'Aktau 天然气中转枢纽 4*Compressor EPC': 'Aktau Gas Hub 4*Compressor EPC',
    'Atyrau 特大型火电联产改造 BOT': 'Atyrau Mega CHP Modernization BOT'
  };
  return mappings[name] || name;
};

const translateRiskLevel = (risk: string, isZh: boolean) => {
  if (isZh) return risk;
  if (risk === '高') return 'HIGH';
  if (risk === '中') return 'MEDIUM';
  if (risk === '低') return 'LOW';
  return risk;
};

const translateSlaRemaining = (sla: string, isZh: boolean) => {
  if (isZh) return sla;
  if (sla === '已完成') return 'Completed';
  return sla;
};

const translateEntityName = (name: string, isZh: boolean) => {
  if (isZh) return name;
  const mappings: Record<string, string> = {
    '哈萨克斯坦能源部规划司': 'Kazakhstan MoE Planning Dept',
    '能源部采购管理中心': 'MoE Procurement Center',
    '采购监管司评标审查席': 'Procurement Evaluation Panel',
    '哈能源部法律政策司': 'MoE Legal & Policy Dept',
    '能源部预算分配司': 'MoE Budget Allocation Dept',
    '哈萨克能源部督查司': 'MoE Audit & Inspection Dept',
    '哈萨克国家审计委员会驻部处': 'State Audit Commission (MoE office)',
    '哈萨克斯坦能源部': 'Kazakhstan Ministry of Energy',
    '采购局纪监委员席': 'Procurement Anti-Corr Comm.',
    '哈萨克斯坦能源部基础设施司': 'MoE Infrastructure Dept',
    '能源部驻地派稽巡办': 'MoE Regional Inspection Office',
    '州合规稽私外勤大队': 'State Compliance Dispatch Force',
    '哈萨克斯坦能源部电力司': 'MoE Power Dept',
    '能源部电力采购中心': 'MoE Power Procurement Center',
    '哈能源部电力配套科': 'MoE Power Facilities Section',
    'Almaty 光伏联合会商项目组': 'Almaty PV Joint Commission',
    'PowerChina (中国电建)': 'PowerChina',
    'Almaty 光伏项目公司': 'Almaty PV Project Company',
    'NCOC 境外合作行': 'NCOC International Bank',
    'Mangystau 州财政厅': 'Mangystau State Treasury Dept',
    'Samruk-Energy & 三一资本': 'Samruk-Energy & Sany Capital',
    'Atyrau 火电特许托管户': 'Atyrau Power Escrow Holder',
    '州安全监督稽查大队': 'State Safety Inspection Agency',
    'Deloitte (德勤特派审计组)': 'Deloitte Audit Team',
    'Aktau 天然气管道控股集团公司': 'Aktau Gas Pipeline Holding',
    '哈国家特大型气能管网监察支部': 'Kazakhstan Gas Pipeline Inspectorate'
  };
  return mappings[name] || name;
};

const translateEntityRole = (role: string, isZh: boolean) => {
  if (isZh) return role;
  const mappings: Record<string, string> = {
    '行政主管': 'Administrative Chief',
    '招标执行方': 'Tender Operator',
    '参选项目代表': 'Bidder Representative',
    '投标备选人A': 'Eligible Bidder A',
    '过程监委会': 'Supervisory Committee',
    '中标项目方': 'Winning Bidder Entity',
    '契约核实处': 'Contract Verification Section',
    '资金代管主': 'Escrow Capital Trustee',
    '境外注资核查组': 'Foreign Capital Audit Group',
    '部内分发': 'Internal Allocation Unit',
    '地方专户接管方': 'Local Escrow Custodian',
    'EPC总承包总成商 (中国电建)': 'Main EPC Contractor',
    '地方网点代表 (Almaty 州电力)': 'Local Grid Representative (Almaty Power)',
    '资金流结算席': 'Financial Settlement Desk',
    '督查方': 'Supervisory Auditor',
    '内控委派': 'Internal Control Liaison',
    '最高层决策': 'Executive Leadership Office',
    '全流程审计': 'Full-Process Inspector',
    '规划分发者': 'Strategic Planning Allocator',
    '业主现场代表 (驻阿克套)': 'Owner Field Representative (Aktau)',
    '中国中化三管特派组': 'Sinochem Pipeline Subcontractor',
    '防损风控方': 'Loss Prevention & Risk Controller',
    '待出动特警': 'Dispatch Enforcement Team',
    '立项审发': 'Appraisal Draft Approver',
    '招标方': 'Tendering Authority',
    '中央部内审核': 'Central Ministry Evaluator'
  };
  return mappings[role] || role;
};

const translateTimelineAction = (action: string, isZh: boolean) => {
  if (isZh) return action;
  
  const mappings: Record<string, string> = {
    '向内阁提交立项可行性大纲': 'Submit Feasibility Outline to Cabinet',
    '部务会审通过投资配额草案': 'Pass Investment Allocation Draft',
    '正式签署立项公文 EM-PPP-2024-007': 'Sign Project Approved Charter EM-PPP-2024-007',
    '编制招标文件及发包指引书': 'Prepare Tender Specs & Directives',
    '三方监察委员会对标核准发发包': 'Tender Specifications Approved by Oversight Committee',
    '三方监察委员会对标核准发包': 'Tender Specifications Approved by Oversight Committee',
    '全网发布 TenderID PPP-ALM-SOLAR 招标简明': 'Publish Tender Summary PPP-ALM-SOLAR',
    '截止投标时间登记': 'Bid Submission Deadline Registration',
    '13家合格商务文件归档库房': 'Archive 13 Bids into Secure Vault',
    '双盲密匙上挂国家安全算力系统': 'Double-blind Key Upload to Security Computing System',
    '随机抽取15位高级工程专家现场隔离': 'Randomly Select 15 Senior Engineering Experts',
    '闭会完成一、二轮工程技术方案评议': 'Complete Technical Evaluation Round 1 & 2',
    '锁定最终各方排名综合评分案': 'Final Scored Ranking Certified',
    '起草政府合作合同 C-PPP-ALM-2024-007': 'Draft Contract C-PPP-ALM-2024-007',
    '与中标人Sembcorp财团进行履约条款澄定': 'Clarify Terms with Winner Sembcorp',
    '能源部长党组联审正式盖印落章': 'Minister Board Formally Signs Agreement',
    '境外股东向离岸监管信托户结汇': 'Foreign Shareholders Remit to Escrow Account',
    '境内合伙方KMG打入匹配资本款': 'Local Partner KMG Remits Matching Capital',
    '一期资本金账户核定完成 $320M': 'Final Audited Tranche 1 Capital: $320M',
    '向国会提交中央基建年度财政补贴申请': 'Submit Infrastructure Subsidy Request to Parliament',
    '财政部正式划定专项匹配资金规模': 'MoF Defines Match Funding Allocation',
    '签发国库财政专项拨款审核 $280M': 'Approve Special Budget Disbursal $280M',
    '向国库集中支付银行发划拨款指令': 'Issue Disbursal Command to Central Treasury Bank',
    '款项离岸核对、合规风控放行': 'Escrow Compliance & Audits Cleared',
    '资金过桥挂至地方州政府信托保障账户': 'Disburse Bridge Subsidy to Local State Escrow',
    'EPC总承包商启动主体桩基浇筑及组件集港': 'EPC Contractor Begins Foundation Casting',
    '国网电力阿克套站签署网点并协议': 'Aktau Substation Interconnection Agreement Executed',
    '出具季度合规支付资金穿透审计书': 'Quarterly Fund Compliance Audit Certified',
    '气化哈萨克斯坦西部主干网规划呈送': 'Submit West Kasakhstan Main Gas Grid Blueprint',
    '签发 EM-EPC-2023-019 战略重点立案': 'Issue Strategic Priority Approval EM-EPC-2023-019',
    '编制限低压特防密封领域资质要求条款': 'Formulate Sealed Pipeline Specifications',
    '正式公告对外定向定询竞招标清单': 'Announce Restrictive Direct-Query Tenders',
    '截止线上电子标接收': 'Online Electronic Bid Window Closed',
    '5家国际一等资质财团完整商务包封柜': 'Sealed 5 International Prime-Certified Bid Packages',
    '突袭盲抽11位高规格工业防爆审员组': 'Select 11 Industrial Explosion-Safety Reviewers',
    '判定CB&I联合体在综合方案设计得最高分': 'Rate CB&I Consortium as Top Proposal Score',
    '编制防重特大事故反受贿安全双签红界': 'Draft Safety Compliance Double-Sign Redline',
    '签署正式施工正本契约 C-EPC-AKT-2023-019': 'Sign Official EPC Agreement C-EPC-AKT-2023-019',
    'NCOC持股联合体核发大修预算': 'NCOC Shareholder Board Certifies Overhaul Budget',
    'KMG配合注资 $180M 正式入监管专户': 'KMG Remits Capital $180M to Escrow Account',
    '上报中央宏观资源配置支持预算规划': 'Submit Macro Budget Request to Central Cabinet',
    '财政部签署年度配套核字 [2024]12号专项批复': 'MoF Signs Annual Subsidy Decree #12',
    '国家开发银行向里海建设账户发支付凭证': 'CDB Issues Payment Certificate to Caspian Account',
    '阿克套海港项目专账正式结算到账 $150M': 'Aktau Port Account Formally Clears $150M Disbursal',
    'SCADA 系统报警 · 一级压缩站三极震动 0.42σ': 'SCADA Warning: Comp. Station vibration 0.42σ',
    '运维主管现场核查 · 确认叶片表面裂纹': 'Lead Maintenance Confirms Blade Microfracture',
    '设备制造商 GE 远程诊断介入': 'OEM GE Remote Engineering Diagnostics Activated',
    'AI 寿命预测模型评估 · 14 天内漏气概率 87%': 'AI Model: 87% Air Leak Probability in 14 Days',
    '能源部下发暂缓付款指令': 'MoE Issues Halt-Payment Command',
    '设备维修方案审定': 'Joint Technical Repair Program Approved',
    '叶片更换施工进行中': 'Blades Replacement Underway',
    '当前 · 维修完成 73% · 计划 6 月初恢复': 'In Progress · 73% Completed · Target Restoration Early June',
    '提交四期工程款请拨表 $42M': 'Submit Milestone 4 Payment Claim $42M',
    '鉴于压缩站SCADA三级预警，审计介入强制暂缓': 'Audit Intervenes: SCADA Warning Triggers Payment Freeze',
    '发出正式暂缓出账限期纠偏单': 'Formal Payment Freeze & Remediation Ordered',
    '发起高压压缩 system 缺陷损失测估': 'Initiate High-Pressure Comp System Loss Assessment',
    '发起高压压缩系统缺陷损失测估': 'Initiate High-Pressure Comp System Loss Assessment',
    '递交追加施工和GE更换部件变更签证 (+$2.4M)': 'Submit Change Order for GE Spare Parts (+$2.4M)',
    '合规外审认定不属于违约，进入绿色审批流': 'Audit: Event is Deemed Non-Breaching, Green Flow Activated',
    '调度一等执务督警巡派单拟定': 'Draft Regional Team Dispatch Directive',
    '西部主要火力网点超长役期低碳配改造批文起草': 'Draft Low-Carbon Retrofit Charter for Long-serving Power Grid',
    '正式印发 EM-BOT-2024-031 规划立案': 'Publish Approved Charter EM-BOT-2024-031',
    '订制特许专营权对标规则': 'Formulate Franchise Tendering Standards',
    '上线 TenderID BOT-ATY-POWER 邀标公告': 'Launch Tender ID BOT-ATY-POWER on Portal',
    '电子开标箱自动对码锁定': 'Tender Submission Box Digitally Locked',
    '8家财团保证资金划账并取得双盲钥匙': '8 Consortia Remit Deposits & Obtain Double-Blind Keys',
    '启动双盲交叉商务与技术多因素判定评分': 'Activate Technical & Commercial Double-Blind Grading',
    '确定三一动力联合中标签署草案': 'Announce Sany Dynamics Team as Winner & Sign Draft',
    '起草BOT运营期排他契约 C-BOT-ATY-2024-031': 'Draft BOT Exclusive Terms C-BOT-ATY-2024-031',
    '能源部长党组联席会议正式签署并授牌': 'Ministry Committee Formally Signs BOT and Awards License',
    '国企合资Samruk-Energy打入一期匹配资款数': 'State-JV Samruk-Energy Remits Tranche 1 Match Funding',
    '三一动力打入股本配套 $420M 进托管专账': 'Sany Dynamics Remits Capital $420M to Escrow',
    '能源部电力主管司发起低碳改造贴息申请书': 'MoE Power Department Initiates Interest Subsidy Request',
    '财政部签署贴息核拨准许命令 $80M': 'MoF Approves $80M Interest Subsidy Decree',
    '财政集中支付向阿特劳分账户放款首期款': 'Disburse Tranche 1 Interest Subsidy to Atyrau Account',
    '工程一期贴息 $16M 结算到账': 'Escrow cleared: $16M Interest Subsidy Received',
    '签署哈电站一期超低排放改造主炉包工程令': 'Sign Low-Emission Boiler Refurbishment Order',
    '现场旧变温锅炉管改造吊桩完成': 'Complete Old Boiler Piping Modification & Rigging',
    '三期建设结算工程款申请提交': 'Submit Milestone 3 Construction Payment Claim',
    '地方审计核结认定该期工程完成无虚多欺瞒': 'Audit: Milestone Complete and Budget Compliant',
    '正式出账支付 $30M': 'Direct Payment Cleared: $30M Approved',
    'KazMech (主分包商) 财务异常预警 · 商业图谱告警': 'KazMech (Subcontractor) Liquidity Hazard Warning',
    'KazMech 正式发函通知退出 · 母公司流动性问题': 'KazMech Submits Formal Exit Notice due to Parent Liquidity',
    '能源部启动应急变更程序': 'MoE Activates Emergency Change Protocol',
    '紧急评审：3 家备用分包商技术评估': 'Emergency Audit: Technical Evaluation of 3 Backup Subs',
    '锁定 Karaganda Industrial 作为新分包商': 'Select Karaganda Industrial as New Subcontractor',
    '变更金额测算 $48M · 财政部专项审议': 'Verify Change Amount $48M with MoF Audits',
    '纠偏工作组进场 · 组长 Kanat M.': 'Remediation Task Force Deploys on Site (Lead: Kanat M.)',
    '当前 · 待财政批复 · 预计 6 月底归位': 'Current: Pending MoF Approval · Target Complete late June',
    '部颁发委派特命纠偏工令单': 'Issue Ministerial Special Remediation Directive',
    '纠偏召集现场三方交底和锁工推进会': 'Convene Remediation Alignment and Execution Conference'
  };
  return mappings[action] || action;
};

const translateTimelineOwner = (owner: string, isZh: boolean) => {
  if (isZh) return owner;
  const mappings: Record<string, string> = {
    '能源部规划司': 'MoE Planning Dept',
    '能源部合规评议办': 'MoE Compliance Review Office',
    '能源部司长办公室': 'MoE Director Office',
    '采购监督司': 'Procurement Bureau',
    '国家采招监督委': 'State Tender Oversight Commission',
    '政府采购中心': 'Public Procurement Center',
    '采购执行工作组': 'Procurement Steering Group',
    '档案馆高密科': 'Secure Archives Section',
    '电子采招保障处': 'Electronic Bidding Security',
    '专家抽配库': 'Expert Pool System',
    '评标委员会主席 Aigerim K.': 'Evaluation Chair Aigerim K.',
    '采购监督司纪检处': 'Procurement Inspectorate Office',
    '法制监察办公室': 'Legal Compliance Office',
    '主管司局代表': 'Directorate Representative',
    '能源部部党组签发室': 'MoE Board Sign-off Room',
    'Sembcorp财政司': 'Sembcorp Treasury Dept',
    'KMG合规委员会': 'KMG Compliance Committee',
    '托管银行 Halyk Bank': 'Escrow Custodian Halyk Bank',
    '能源部预算司': 'MoE Budget Dept',
    '财政部基建司': 'MoF Infrastructure Dept',
    '财政部常务副部长': 'Vice Minister of Finance',
    '中央预算执行处': 'Central Budget Execution Office',
    '国家外汇管理局': 'State Foreign Exchange Admin',
    '国库集中行 Bank of Astana': 'Treasury Agent Bank of Astana',
    'EPC总承包商项目部': 'EPC Contractor Project Dept',
    '地方电网公司': 'Local Grid Utility',
    '驻地采购联部': 'Local Procurement Liaison',
    '国资油气安全司': 'SOE Gas Security Dept',
    '哈里海工业促进委员会': 'Caspian Industrial Commission',
    '特种采购局': 'Special Procurement Unit',
    '哈国家油气委': 'State Oil & Gas Commission',
    '国资监管仓储办': 'SOE Warehouse Management',
    '国家外贸采招档案科': 'Trade & Public Bidding Archives',
    '部专家核选席': '专家核选席 MoE Specialist Appoint',
    '哈国家油气联合会商处': 'State Oil & Gas Joint Office',
    '国资监管总局': 'Central SOE Regulatory Authority',
    '哈气网总指挥办公室': 'Western Gas Grid Command Off.',
    'NCOC董事会': 'NCOC Board of Directors',
    'KMG自备资本金托管行': 'KMG Escrow Custodian Bank',
    '国资局预算室': 'State Assets Budget Div',
    '财政部基建分配署': 'MoF Infrastructure Allocations',
    '开发行集中结算科': 'CDB Settlement Office',
    '阿克套主管分行': 'Aktau Clearing Branch',
    'ENT-KZ-AKT-0091 运维班': 'ENT-KZ-AKT-0091 Maintenance Team',
    'Bauyrzhan A.': 'Bauyrzhan A.',
    'GE Oil & Gas 工程团队': 'GE Oil & Gas Engineering Team',
    '能源部 AI 风险模型': 'MoE AI Risk Evaluation Model',
    '能源部督查司': 'MoE Regulatory Audit Bureau',
    '联合技术评审组': 'Joint Tech Review Committee',
    'NCOC 维修班': 'NCOC Maintenance Crew',
    'EPC总包': 'Main EPC Contractor',
    '驻地稽司办公室': 'Regional Audit & Inspection Office',
    '能源部督查总局': 'MoE General Inspectorate',
    '三方保赔工估师': 'Third-Party Underwriter Surveyor',
    'EPC项目部': 'EPC Project Department',
    '德勒阿拉木图特别代表': 'Deloitte Almaty Rep.',
    '能源部规划监管办公室': 'MoE Planning & Regulatory Office',
    '煤电与常备能源局': 'Coal & Thermal Power Administration',
    '副部长主管司长闭门会': 'Vice Ministerial Executive Board',
    '采招监督处': 'Procurement Inspection Dept',
    '政府采购网': 'Public Procurement Portal',
    '电子招商监督大厅': 'Merchant Portal Oversight Hall',
    '档案馆高管处': 'Archives Administration',
    '三方评标处': 'Independent Tender Grading Panel',
    '综合评审主席团': 'Comprehensive Appraisal Board',
    '能源部法律政策局': 'MoE Legal Policy Dept',
    '部党组签发办公室': 'MoE Sign-off Office',
    '商发结算科': 'Commercial Settlement Section',
    '托管银行 Citibank Almaty': 'Citibank Almaty Escrow',
    '电力综合司': 'General Power Directorate',
    '国家贴备管理司': 'State Treasury Subsidies Office',
    '支付一科': 'Treasury Payments Div 1',
    '托管行 Bank CenterCredit': 'Escrow Bank CenterCredit',
    '项目总经理 Kanat M.': 'Project Director Kanat M.',
    '三一动力工程承造组': 'Sany Power Construction Unit',
    '总承包商财务司': 'Lead Contractor Treasury Div',
    '阿特劳专项会审组': 'Atyrau Specialized Panel',
    '项目公司董事会': 'Project Company Board',
    '能源部 AI 风控': 'MoE AI Risk Controller',
    'KazMech 法务部': 'KazMech Legal Counsel',
    '能源部采购监管司': 'MoE Procurement Regulator',
    '应急评审组': 'Emergency Appraisal Panel',
    '采购监管司': 'Procurement Inspection Bureau',
    '财政部预算司': 'MoF Budget Allocation Div',
    'L4 驻地巡查 + 审计': 'L4 Field Inspection & Audit',
    '能源监督总司': 'MoE State Power Inspectorate'
  };
  return mappings[owner] || owner;
};

const translateFundEntity = (entity: string, isZh: boolean) => {
  if (isZh) return entity;
  const mappings: Record<string, string> = {
    '中央规划支出预算': 'Central Planning Budget',
    '前置可行性评估储备': 'Feasibility Reserve',
    'Sembcorp & KMG 股东会': 'Sembcorp & KMG Board',
    'Almaty 光伏基本账户': 'Almaty PV Main Account',
    '国库预算司': 'Central Treasury Div',
    '中央专项补贴拨款池': 'Capital Subsidy Pool',
    '中央财政拨款专户': 'Central Allocation Escrow',
    'Mangystau 州财政托管护': 'Mangystau Treasury Escrow',
    '国企合资Samruk-Energy打入一期匹配资款数': 'Samruk-Energy JV Escrow',
    'Samruk-Energy & 三一资本': 'Samruk-Energy & Sany Capital',
    'Atyrau 火电特许托管户': 'Atyrau Thermal Power Escrow',
    'Atyrau 光伏基本账户': 'Atyrau PV Escrow',
    'NCOC持股联合体核发大修预算': 'NCOC Shareholder Overhaul Fund',
    'KMG配合注资 $180M 正式入监管专户': 'KMG Capital Injection ($180M)',
    '国资局预算室': 'State Asset Budget Office',
    '财政部基建分配署': 'MoF Infrastructure Fund',
    '开发行集中结算科': 'CDB Bridge Funding pool',
    '阿克套海港项目专账正式结算到账 $150M': 'Aktau Port Account ($150M)',
    '国家开发银行向里海建设账户发支付凭证': 'CDB Allocation Certificate'
  };
  return mappings[entity] || entity;
};

const translateAiInsight = (insight: string, isZh: boolean) => {
  if (isZh) return insight;
  if (insight.includes('项目战略立案文件完备')) {
    return 'The strategic project charter is fully complete, satisfying the regional power distribution hubs for Almaty Province. Approved.';
  }
  if (insight.includes('19家国际候选总包商参与初筛登记')) {
    return '19 international contractors passed preliminary screening; compliance check shows no corporate collusion risk.';
  }
  if (insight.includes('收到包含Sembcorp及中国电建在内的13家')) {
    return 'Received 13 bid packages including Sembcorp and PowerChina; technical proposals are verified without anomalies.';
  }
  if (insight.includes('评委打分曲线高斯分布')) {
    return 'Expert evaluation scores follow a normal Gaussian distribution; the third-party experts show no conflicts of interest.';
  }
  if (insight.includes('法律草拟符合中央政府采购反贪腐红线')) {
    return 'The contract draft is fully compliant with anti-corruption regulations; the 25-year concession tariff is locked and compliant.';
  }
  if (insight.includes('一期资本到账')) {
    return 'Tranche 1 capital has cleared (100% funding rate). Verification confirms no shadow trading or shell entities.';
  }
  if (insight.includes('年度贴息配套通过')) {
    return 'Annual interest subsidy approved. Warning: AI financial forecasting detects a 20% systemic liquidity buffer hazard for Summer 2026.';
  }
  if (insight.includes('首拨配给资金流，款项准确沉淀')) {
    return 'First tranche settled in the regional trust account; funds have been digitally locked under strict compliance rules.';
  }
  if (insight.includes('项目已经进入核心设备主体建设阶段')) {
    return 'The project execution is underway on scheduled milestones; regional inspection has confirmed physical infrastructure progress.';
  }
  if (insight.includes('本节点 AI 风险模型基于 SCADA 时序数据')) {
    return 'SCADA core analysis predicts rotor blade fatigue with 87% leakage chance in 14 days. Recommending deep-dive review on Caspian Energy.';
  }
  if (insight.includes('第四期工程进度款审核由于下位 L4 级')) {
    return 'Tranche 4 milestone audit has been put on hold due to upstream compressor warning; payment frozen pending corrective actions.';
  }
  if (insight.includes('经审计评估，由于叶片故障系')) {
    return 'Audits confirm blade microfractures are non-breaching design flaws. Greenlit for emergency fast-track repair amendments (+$2.4M).';
  }
  if (insight.includes('由于设备事故在轨纠偏事件延迟')) {
    return 'Remediation is currently pending dispatch of regional specialist inspection units. Expected resumption delay estimated at T-12d.';
  }
  if (insight.includes('该立项旨在推动西部三大重点火电站')) {
    return 'The strategic charter targets lowering thermal emissions for Western region CHP plants. Clean tech transition parameters certified.';
  }
  if (insight.includes('公开邀标包含特许运营期利益分配')) {
    return 'Concession criteria include public revenue-sharing terms. 8 global consortia completed active credentials registration.';
  }
  if (insight.includes('8家合格竞标主体均足额汇入履约担保金')) {
    return '8 bidding entities deposited performance escrows successfully. Bid encryption keys are verified and secure.';
  }
  if (insight.includes('综合评分会决定三一动力财团在脱硫技术')) {
    return 'Evaluation confirms Sany Consortium ranks highest on modern desulfurization standards. Pricing models are nominal.';
  }
  if (insight.includes('BOT特许合同印发合意核准')) {
    return 'Concession agreement formally executed. 30-year operational tenure established with clean-grid tariff indices.';
  }
  if (insight.includes('合资款到位率100%')) {
    return 'JV Capital contribution reaches 100% completion. Bank tracking reports no off-shore currency extraction hazards.';
  }
  if (insight.includes('低碳煤电贴息配套通过审定')) {
    return 'Boiler retrofitting soft-interest subsidies approved. Finalized treasury budget matching ratios confirmed to be 100% solid.';
  }
  if (insight.includes('贴息专项资金出库划拨指令无异常')) {
    return 'Interest subsidies disbursed cleanly through state treasury routes. Escrow bank confirms receipt with zero processing delays.';
  }
  if (insight.includes('旧变温锅炉管及冷壁拆除顺利动工')) {
    return 'Boiler pipe dismantling successfully breaks ground. L4 field logs confirm active construction within standard limits.';
  }
  if (insight.includes('三期施工进度审核，地方核对无申报不实')) {
    return 'Construction milestone audit validated successfully. Zero fraudulent claims detected; direct payment of $30M cleared.';
  }
  if (insight.includes('由于核心主分包商 KazMech 突发财务危机')) {
    return 'Critical sub-contractor KazMech facing sudden systemic liquidity collapse. Transitioning to emergency backup lists.';
  }
  if (insight.includes('紧急派驻特命纠偏外勤工作组')) {
    return 'Ministerial dispatch order signed. Special remediation task force deployed on-site to lock subcontracts with Karaganda Industrial.';
  }
  
  return insight;
};

export default function ProjectLifecycleAudit() {
  const navigate = useNavigate();
  const { language } = useLanguage();

  const isZh = language === 'zh';
  const t = (arg1: string, arg2?: string) => {
    if (!arg2) return arg1;
    const hasChinese = (s: string) => /[\u4E00-\u9FFF]/.test(s);
    if (hasChinese(arg1) && !hasChinese(arg2)) {
      return isZh ? arg1 : arg2;
    }
    if (hasChinese(arg2) && !hasChinese(arg1)) {
      return isZh ? arg2 : arg1;
    }
    return isZh ? arg2 : arg1;
  };

  // States
  const [selectedProject, setSelectedProject] = useState<'ALL' | 'PPP-ALM' | 'EPC-AKT' | 'BOT-ATY'>('ALL');
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [enterpriseId, setEnterpriseId] = useState<string | null>(null);
  const [scale, setScale] = useState<number>(0.9);

  // Layout calculations matching high-fidelity SVG connections
  const matrixContainerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [edgePaths, setEdgePaths] = useState<any[]>([]);

  // Find selected audit node
  const activeNode = useMemo(() => {
    if (!selectedNodeId) return null;
    return projectLifecycle.nodes.find(n => n.id === selectedNodeId) || null;
  }, [selectedNodeId]);

  // Find selected enterprise for drilldown
  const selectedEnterprise = useMemo(() => {
    if (!enterpriseId) return null;
    return enterpriseKB.find(ent => ent.id === enterpriseId) || null;
  }, [enterpriseId]);

  // Render nodes based on selected filters
  const visibleNodes = useMemo(() => {
    if (selectedProject === 'ALL') {
      return projectLifecycle.nodes;
    }
    return projectLifecycle.nodes.filter(n => n.projectId === selectedProject);
  }, [selectedProject]);

  // Calculate lines between subsequent elements of the projects in parallel
  const calculateConnectedPaths = useCallback(() => {
    if (!matrixContainerRef.current || !canvasRef.current) return;

    const container = matrixContainerRef.current;
    const canvas = canvasRef.current;
    const canvasRect = canvas.getBoundingClientRect();

    // Standard scale adjustor
    const computedScale = canvasRect.width / canvas.offsetWidth || scale;

    const paths: any[] = [];

    // Projects list we want to wire up
    const projectIds: ('PPP-ALM' | 'EPC-AKT' | 'BOT-ATY')[] = ['PPP-ALM', 'EPC-AKT', 'BOT-ATY'];

    projectIds.forEach(pId => {
      // If we are profiling a single project, ignore others
      if (selectedProject !== 'ALL' && selectedProject !== pId) return;

      // Extract all 12 stages sorted consecutively
      const projectStageNodes = COLUMNS_LIST.map(st => {
        return projectLifecycle.nodes.find(n => n.projectId === pId && n.stageCode === st);
      }).filter((n): n is Node => !!n);

      for (let i = 0; i < projectStageNodes.length - 1; i++) {
        const from = projectStageNodes[i];
        const to = projectStageNodes[i+1];

        const fromNodeEl = nodeRefs.current[from.id];
        const toNodeEl = nodeRefs.current[to.id];

        if (fromNodeEl && toNodeEl) {
          const fromRect = fromNodeEl.getBoundingClientRect();
          const toRect = toNodeEl.getBoundingClientRect();

          // Calculate offset points starting from the right-mid of from-node, to left-mid of to-node
          const x1 = (fromRect.right - canvasRect.left) / computedScale;
          const y1 = (fromRect.top + fromRect.height / 2 - canvasRect.top) / computedScale;

          const x2 = (toRect.left - canvasRect.left) / computedScale;
          const y2 = (toRect.top + toRect.height / 2 - canvasRect.top) / computedScale;

          // Wire status styling logic
          let strokeColor = '#2FA862'; // compliant Green
          let isDashed = false;

          if (from.status === 'risk' || to.status === 'risk') {
            strokeColor = '#D8454C'; // Danger red dashed
            isDashed = true;
          } else if (from.status === 'wip' || to.status === 'wip') {
            strokeColor = '#E89518'; // WIP yellow/orange
          }

          // Build a smooth continuous cubic Bezier S-curve
          const ctrlX1 = x1 + (x2 - x1) * 0.45;
          const ctrlX2 = x1 + (x2 - x1) * 0.55;
          const d = `M ${x1} ${y1} C ${ctrlX1} ${y1}, ${ctrlX2} ${y2}, ${x2} ${y2}`;

          // Project specific visual theme overrides on comparison view so lines stay distinct
          let customStrokeColor = strokeColor;
          if (selectedProject === 'ALL') {
            if (pId === 'PPP-ALM') customStrokeColor = from.status === 'risk' || to.status === 'risk' ? '#D8454C' : '#8B5CF6'; // Purple for PPP
            else if (pId === 'EPC-AKT') customStrokeColor = from.status === 'risk' || to.status === 'risk' ? '#D8454C' : '#0284C7'; // Blue for EPC
            else customStrokeColor = from.status === 'risk' || to.status === 'risk' ? '#D8454C' : '#F97316'; // Orange for BOT
          }

          paths.push({
            d,
            stroke: customStrokeColor,
            isDashed,
            project: pId,
            type: 'FLOW'
          });
        }
      }
    });

    // Drawing the AI-retrospective causal lines backwards inside pipeline
    projectLifecycle.aiCrossLinks.forEach((link: AiCrossLink) => {
      const fromNode = projectLifecycle.nodes.find(n => n.id === link.from);
      const toNode = projectLifecycle.nodes.find(n => n.id === link.to);

      if (fromNode && toNode) {
        if (selectedProject !== 'ALL' && selectedProject !== fromNode.projectId) return;

        const fromEl = nodeRefs.current[fromNode.id];
        const toEl = nodeRefs.current[toNode.id];

        if (fromEl && toEl) {
          const fromRect = fromEl.getBoundingClientRect();
          const toRect = toEl.getBoundingClientRect();

          // Retrospective flows from left-center of risk node back to right-center of upstream root node
          const x1 = (fromRect.left - canvasRect.left) / computedScale;
          const y1 = (fromRect.top + fromRect.height / 2 - canvasRect.top) / computedScale;

          const x2 = (toRect.right - canvasRect.left) / computedScale;
          const y2 = (toRect.top + toRect.height / 2 - canvasRect.top) / computedScale;

          // Make looping curved path bending upwards to stay outside card meshes
          const midX = (x1 + x2) / 2;
          const midY = Math.min(y1, y2) - 90;
          const d = `M ${x1} ${y1} Q ${midX} ${midY} ${x2} ${y2}`;

          paths.push({
            d,
            stroke: '#D8454C',
            isDashed: true,
            label: link.reason,
            project: fromNode.projectId,
            type: 'AI_BACKTRACK',
            lane: fromNode.lane
          });
        }
      }
    });

    setEdgePaths(paths);
  }, [scale, selectedProject]);

  // Recalibrate paths dynamically on mount, resize, and zoom modifications
  useEffect(() => {
    calculateConnectedPaths();

    // Trigger high-frequency polling during rendering states to assure layout stability
    const pollInterval = setInterval(calculateConnectedPaths, 60);
    const timeout = setTimeout(() => clearInterval(pollInterval), 600);

    const handleResize = () => calculateConnectedPaths();
    window.addEventListener('resize', handleResize);

    return () => {
      clearInterval(pollInterval);
      clearTimeout(timeout);
      window.removeEventListener('resize', handleResize);
    };
  }, [calculateConnectedPaths, scale, selectedProject]);

  return (
    <div className="flex-grow flex flex-col bg-[#F6F8FB] overflow-hidden font-sans select-none antialiased min-h-screen">
      
      {/* Context Top Navigation Bar */}
      <div className="h-11 bg-white border-b border-[#D8DEE8] flex items-center justify-between px-6 shrink-0 z-40">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 text-text-tertiary hover:text-text-primary transition-colors pr-4 border-r border-[#D8DEE8] uppercase tracking-widest text-[10px] font-bold"
          >
            <ArrowLeft size={14} />
            <span>{t('Back', '返回')}</span>
          </button>
          <div className="flex items-center gap-5">
            <span className="text-[10px] text-text-secondary uppercase tracking-[0.1em] font-bold">
              {t('PROJECT LIFECYCLE AUDIT BOARD', '重大基建工程项目生命周期连线审计穿透大盘')}
            </span>
            <span className="text-[10.5px] bg-violet-100 text-violet-700 px-2.5 py-0.5 rounded border border-violet-200/30 text-[9px] font-mono font-bold tracking-tight">
              STAGE-AUDIT-ENGINE
            </span>
          </div>
        </div>
        
        {/* Top Right Switches */}
        <div className="flex items-center gap-2">
          <button 
            onClick={() => navigate('/audit/report?template=project_lifecycle_audit')}
            className="flex items-center gap-1.5 px-3 py-1 bg-white hover:bg-slate-50 border border-[#D8DEE8] hover:border-slate-400 text-bg-dark transition-all text-[10.5px] font-black uppercase rounded-[2px]"
          >
            <FileText size={13} />
            <span>{t('📋 EXPORT AUDIT REPORT ↗', '📋 导出审计报告 ↗')}</span>
          </button>
          
          <button 
            onClick={() => navigate('/audit/event/CASE-2026-001')}
            className="flex items-center gap-1.5 px-3 py-1 bg-bg-dark text-white hover:bg-slate-850 transition-all text-[10.5px] font-black uppercase rounded-[2px]"
          >
            <Search size={13} />
            <span>{t('🔍 SWITCH TO EVENT AUDIT ↗', '🔍 切换至合规审查 ↗')}</span>
          </button>
        </div>
      </div>

      {/* Replicating EventAudit Top 6 KPI Blocks Strip */}
      <div className="h-[88px] bg-white border-b border-[#D8DEE8] flex items-center px-8 shrink-0 relative overflow-hidden z-30 shadow-xs">
        <div className="grid grid-cols-6 gap-6 w-full max-w-7xl items-center">
          <div className="flex flex-col pl-4 border-l-2 border-[#2FA862]">
            <span className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest mb-1">
              {t('Process Completion', '流程完成度')}
            </span>
            <span className="text-[28px] font-bold leading-none text-bg-dark tabular-nums">
              {projectLifecycle.kpi.completionPct}%
            </span>
          </div>
          <div className="flex flex-col pl-4 border-l-2 border-slate-200">
            <span className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest mb-1">
              {t('Vetted Steps', '完成步骤')}
            </span>
            <span className="text-[24px] font-bold leading-none text-bg-dark tabular-nums">
              {projectLifecycle.kpi.completedSteps}
            </span>
          </div>
          <div className="flex flex-col pl-4 border-l-2 border-[#D8454C]">
            <span className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest mb-1">
              {t('Delayed Milestones', '延期节点')}
            </span>
            <span className="text-[28px] font-bold leading-none text-status-critical tabular-nums">
              {projectLifecycle.kpi.delayedNodes}
            </span>
          </div>
          <div className="flex flex-col pl-4 border-l-2 border-[#1570EF]">
            <span className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest mb-1">
              {t('AI Ingress Points', 'AI 模型介入')}
            </span>
            <span className="text-[28px] font-bold leading-none text-[#1570EF] tabular-nums font-mono">
              {projectLifecycle.kpi.aiInterventions}
            </span>
          </div>
          <div className="flex flex-col pl-4 border-l-2 border-[#E89518]">
            <span className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest mb-1">
              {t('At-Risk Capital Nodes', '资金风险节点')}
            </span>
            <span className="text-[28px] font-bold leading-none text-status-warning tabular-nums">
              {projectLifecycle.kpi.fundRiskNodes}
            </span>
          </div>
          <div className="flex flex-col pl-4 border-l border-slate-200 justify-center">
            <div className="flex justify-between items-center mb-1">
              <span className="text-[9px] font-bold text-[#D8454C] uppercase tracking-widest">
                {t('SLA DEADLINE', 'SLA 紧急窗口')}
              </span>
              <span className="text-[12px] font-mono font-black text-[#D8454C] tabular-nums">36h Remaining</span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-[#D8454C] to-[#E89518]" style={{ width: '45%' }} />
            </div>
            <span className="text-[8.5px] text-[#6A7686] mt-1 font-mono uppercase">
              72h window · 36h elapsed
            </span>
          </div>
        </div>
        <div className="absolute top-0 right-0 h-full flex items-center opacity-5 select-none pointer-events-none pr-10">
          <ShieldCheck size={120} />
        </div>
      </div>

      {/* Main Container Pan viewport area */}
      <div className="flex-1 flex overflow-hidden relative">

        {/* High-Fidelity Floating Scale Zoom Controls */}
        <div className="absolute top-6 right-6 flex flex-col gap-2 z-[60]">
          <button 
            onClick={() => setScale(s => Math.min(s + 0.1, 1.3))}
            className="w-10 h-10 bg-white border border-[#D8DEE8] rounded-full shadow-lg flex items-center justify-center text-bg-dark hover:bg-slate-50 active:scale-95 transition-all cursor-pointer"
            title={t('Zoom In', '放大')}
          >
            <Maximize size={18} />
          </button>
          <button 
            onClick={() => setScale(s => Math.max(s - 0.1, 0.6))}
            className="w-10 h-10 bg-white border border-[#D8DEE8] rounded-full shadow-lg flex items-center justify-center text-bg-dark hover:bg-slate-50 active:scale-95 transition-all cursor-pointer"
            title={t('Zoom Out', '缩小')}
          >
            <Minimize size={18} />
          </button>
          <button 
            onClick={() => setScale(0.9)}
            className="w-10 h-10 bg-white border border-[#D8DEE8] rounded-full shadow-lg flex items-center justify-center text-[10px] font-bold text-bg-dark hover:bg-slate-50 active:scale-95 transition-all cursor-pointer"
          >
            90%
          </button>
        </div>

        {/* Project filtering tab control strip right inside screen */}
        <div className="absolute top-6 left-6 flex items-center gap-1.5 bg-white border border-[#D8DEE8] p-1 shadow-lg z-50 rounded">
          <button 
            onClick={() => setSelectedProject('ALL')}
            className={cn(
              "px-3 py-1.5 text-[10.5px] font-bold uppercase transition-all rounded-[2px]",
              selectedProject === 'ALL' ? "bg-bg-dark text-white" : "text-text-tertiary hover:text-text-primary"
            )}
          >
            📊 {t('COMPARE ALL PROJECTS', '项目全景对照模式')}
          </button>
          <div className="w-px h-5 bg-slate-200" />
          <button 
            onClick={() => setSelectedProject('PPP-ALM')}
            className={cn(
              "px-3 py-1.5 text-[10.5px] font-bold uppercase transition-all rounded-[2px]",
              selectedProject === 'PPP-ALM' ? "bg-[#8B5CF6] text-white" : "text-text-tertiary hover:text-[#8B5CF6]"
            )}
          >
            🟣 {t('Almaty PV PPP', 'Almaty光伏 PPP')}
          </button>
          <button 
            onClick={() => setSelectedProject('EPC-AKT')}
            className={cn(
              "px-3 py-1.5 text-[10.5px] font-bold uppercase transition-all rounded-[2px]",
              selectedProject === 'EPC-AKT' ? "bg-[#0284C7] text-white" : "text-text-tertiary hover:text-[#0284C7]"
            )}
          >
            🔵 {t('Aktau LNG EPC', 'Aktau中转站 EPC')}
          </button>
          <button 
            onClick={() => setSelectedProject('BOT-ATY')}
            className={cn(
              "px-3 py-1.5 text-[10.5px] font-bold uppercase transition-all rounded-[2px]",
              selectedProject === 'BOT-ATY' ? "bg-[#F97316] text-white" : "text-text-tertiary hover:text-[#F97316]"
            )}
          >
            🟠 {t('Atyrau CHP BOT', 'Atyrau延寿 BOT')}
          </button>
        </div>

        {/* Matrix viewport content area */}
        <div 
          ref={matrixContainerRef}
          className="flex-1 overflow-auto custom-scrollbar bg-[#F6F8FB] relative p-12 pt-20"
        >
          <motion.div 
            ref={canvasRef}
            animate={{ scale }}
            transition={{ type: 'spring', damping: 22, stiffness: 260 }}
            className="origin-top-left relative"
            style={{ width: 'max-content' }}
          >
            
            {/* SVG Overlaid vector curve layers */}
            <svg 
              className="absolute inset-0 pointer-events-none" 
              style={{ 
                zIndex: 10, 
                width: '100%', 
                height: '100%',
                overflow: 'visible' 
              }}
            >
              <defs>
                <marker id="audit-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="currentColor" />
                </marker>
                <marker id="audit-ai-arrow" viewBox="0 0 10 10" refX="2" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 10 0 L 0 5 L 10 10 z" fill="#D8454C" />
                </marker>
              </defs>

              {edgePaths.map((edge, i) => {
                const isBacktrack = edge.type === 'AI_BACKTRACK';

                return (
                  <g key={i} className={cn(
                    "transition-all duration-305",
                    isBacktrack ? "text-status-critical" : "text-slate-400 opacity-60",
                    "hover:opacity-100"
                  )}>
                    <path 
                      d={edge.d} 
                      fill="none" 
                      stroke={edge.stroke} 
                      strokeWidth={isBacktrack ? 1.5 : 1.5} 
                      strokeDasharray={edge.isDashed ? "4,3" : "none"}
                      markerEnd={isBacktrack ? "url(#audit-ai-arrow)" : "url(#audit-arrow)"}
                    />
                    
                    {/* Render AI Causal Backtrack text markers labels */}
                    {isBacktrack && edge.label && (
                      <g>
                        <rect
                          x={600}
                          y={edge.lane === 'L1' ? 70 : 120}
                          width={240}
                          height={18}
                          rx={2}
                          fill="#FDE7E7"
                          stroke="#D8454C"
                          strokeWidth={0.5}
                          className="opacity-95"
                        />
                        <text 
                          x={720} 
                          y={edge.lane === 'L1' ? 82 : 132} 
                          textAnchor="middle" 
                          className="text-[9px] font-black fill-status-critical uppercase tracking-wider font-mono"
                        >
                          ⚡ {t('AI ROOT CAUSE DERIVATIVE: ', 'AI 根因穿透追溯: ')}{edge.label}
                        </text>
                      </g>
                    )}
                  </g>
                );
              })}
            </svg>

            {/* Fully Custom Redesigned Matrix Layout Grid */}
            <div className="grid grid-cols-[160px_repeat(12,minmax(110px,110px))] w-full border border-[#D8DEE8] bg-white shadow-2xl relative select-none" style={{ gap: '0px' }}>
              
              {/* Row 0 Cell Column Headers Spacer */}
              <div className="h-[75px] bg-[#FAFBFD] border-b border-r border-[#D8DEE8] sticky top-0 left-0 z-30 flex items-center justify-center p-3 select-none">
                <span className="text-[10px] font-black text-bg-dark tracking-widest font-mono text-center">
                  {t('TIMELINE AUDIT', '全流程核对网格')}
                </span>
              </div>

              {/* 12 Columns titles with stage name translations and split line */}
              {COLUMNS_LIST.map((st, colIdx) => {
                const info = STAGES_HEADER_INFO[st];

                return (
                  <div 
                    key={st} 
                    className={cn(
                      "h-[75px] bg-[#FAFBFD] border-b border-r border-[#D8DEE8] flex flex-col items-center justify-between py-2 text-center relative z-20",
                      colIdx === 4 && "border-r-2 border-r-slate-400" // Bold split line between st 5 and 6
                    )}
                  >
                    
                    {/* Two sections header badges indicators */}
                    {colIdx === 0 && (
                      <span className="absolute -top-3 left-3 px-1.5 py-0.2 bg-violet-100 text-[#8B5CF6] text-[7.5px] font-bold uppercase rounded border border-violet-200">
                        ║ {t('PROCUREMENT', '采购阶段')} ║
                      </span>
                    )}

                    {colIdx === 5 && (
                      <span className="absolute -top-3 left-3 px-1.5 py-0.2 bg-amber-50 text-[#D38B0A] text-[7.5px] font-bold uppercase rounded border border-[#E89518]/30">
                        ║ {t('EXECUTION', '执行阶段')} ║
                      </span>
                    )}

                    <div className="mt-2.5">
                      <div className="text-[11px] font-black text-bg-dark font-sans leading-tight">
                        {colIdx + 1}. {isZh ? info.nameCn : info.nameEn}
                      </div>
                      <div className="text-[9px] text-text-tertiary uppercase truncate max-w-[100px] mt-0.5 tracking-tight">
                        {isZh ? info.nameEn : info.nameCn}
                      </div>
                    </div>

                    <div className="text-[8px] text-text-tertiary uppercase font-mono tracking-widest mt-auto">
                      {info.code}
                    </div>
                  </div>
                );
              })}

              {/* 4 Swimlanes Rendering elements row-by-row */}
              {LANES_LIST.map((lane, rowIdx) => {
                const laneInfo = LANES_HEADER_INFO[lane];

                return (
                  <React.Fragment key={lane}>
                    
                    {/* Sticky Column Swimlane Label */}
                    <div className={cn(
                      "h-[180px] p-4 flex flex-col justify-center border-b border-r border-[#D8DEE8] sticky left-0 z-25 transition-all w-[160px] shadow-sm select-none",
                      rowIdx % 2 === 0 ? "bg-[#FAFBFD]" : "bg-[#F4F7FB]"
                    )}>
                      <div className="text-[11px] font-black text-bg-dark uppercase tracking-tight leading-tight">
                        {isZh ? laneInfo.nameCn : laneInfo.nameEn}
                      </div>
                      <div className="text-[9.5px] text-text-tertiary font-bold tracking-tight uppercase font-mono mt-0.5">
                        {isZh ? laneInfo.nameEn : laneInfo.nameCn}
                      </div>

                      <div className="text-[9px] text-text-tertiary leading-normal mt-3 font-normal">
                        {isZh ? laneInfo.orgCn : laneInfo.orgEn}
                      </div>
                      <div className="text-[8px] text-text-tertiary font-mono italic leading-none mt-0.5">
                        {isZh ? laneInfo.orgEn : laneInfo.orgCn}
                      </div>

                      <div className="mt-4 flex items-center gap-1.5">
                        <span className="px-1.5 py-0.2 bg-slate-900 text-white text-[8px] font-bold rounded-[2px] font-mono">
                          {lane}
                        </span>
                      </div>
                    </div>

                    {/* Columns nodes cells inside grid */}
                    {COLUMNS_LIST.map((st, colIdx) => {
                      
                      // Identify nodes matching this stage and this row lane
                      const cellNodes = visibleNodes.filter(n => n.stageCode === st && n.lane === lane);

                      return (
                        <div 
                          key={`${lane}-${st}`} 
                          className={cn(
                            "h-[180px] border-b border-r border-[#D8DEE8] flex flex-col items-center justify-center relative p-1.5 overflow-hidden",
                            rowIdx % 2 === 0 ? "bg-[#FAFBFD]/30" : "bg-[#F4F7FB]/30",
                            colIdx === 4 && "border-r-2 border-r-slate-400" // Bold vertical line divider continued
                          )}
                        >
                          
                          {/* Inner cards list layout */}
                          <div className="flex flex-col gap-2 w-full h-full justify-center items-center overflow-y-auto custom-scrollbar-hidden select-none">
                            {cellNodes.map((node: Node) => {
                              const style = STATUS_STYLING[node.status] || STATUS_STYLING.pending;
                              const isSelected = selectedNodeId === node.id;

                              // Project color tag matching compare mode
                              let tagBadgeColor = 'bg-slate-400 text-white';
                              if (node.projectId === 'PPP-ALM') tagBadgeColor = 'bg-[#8B5CF6]/90';
                              else if (node.projectId === 'EPC-AKT') tagBadgeColor = 'bg-[#0284C7]/90';
                              else if (node.projectId === 'BOT-ATY') tagBadgeColor = 'bg-[#F97316]/90';

                              return (
                                <article 
                                  key={node.id}
                                  ref={el => nodeRefs.current[node.id] = el}
                                  onClick={() => setSelectedNodeId(node.id)}
                                  className={cn(
                                    "border border-[#D8DEE8] rounded-[4px] bg-white px-2 py-1.5 w-[100px] h-[64px] cursor-pointer hover:border-text-primary transition-all flex flex-col justify-between shrink-0 relative select-none shadow-xs group",
                                    isSelected && "ring-2 ring-violet-500 border-transparent z-35 scale-102"
                                  )}
                                >
                                  {/* Top Status Bar indicator */}
                                  <div className="h-[3px] -mx-2 -mt-1.5 mb-1 bg-slate-200 rounded-t-[4px] overflow-hidden">
                                    <div className="h-full" style={{ backgroundColor: style.border }} />
                                  </div>

                                  {/* Small Header Stage Code + Status dot */}
                                  <div className="flex items-center justify-between text-[7px] font-mono text-text-tertiary">
                                    <span className="tracking-wide">{node.stageCode}</span>
                                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: style.border }} />
                                  </div>

                                  {/* Project Badge overlay under Compare Mode */}
                                  {selectedProject === 'ALL' && (
                                    <span className={cn(
                                      "absolute top-5 right-1.5 text-[6.5px] font-black  px-1 rounded font-mono text-white tracking-widest leading-none scale-85",
                                      tagBadgeColor
                                    )}>
                                      {node.projectId.split('-')[1]}
                                    </span>
                                  )}

                                  {/* Node title details with line clamping */}
                                  <p className="text-[10px] font-bold text-bg-dark leading-tight line-clamp-1 truncate group-hover:text-violet-600 transition-colors">
                                    {translateNodeTitle(node.title, isZh)}
                                  </p>

                                  {/* Footer showing validated dates */}
                                  <div className="flex items-center justify-between mt-auto">
                                    <span className="text-[8px] text-text-tertiary tracking-tight font-mono tabular-nums leading-none">
                                      {node.date}
                                    </span>
                                    {node.riskLevel === '高' && (
                                      <span className="w-2.5 h-2.5 rounded bg-[#D8454C] flex items-center justify-center text-[7px] font-bold text-white leading-none">
                                        !
                                      </span>
                                    )}
                                  </div>
                                </article>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </React.Fragment>
                );
              })}

            </div>
          </motion.div>
        </div>

        {/* Legend Overlay fixedly placed styled after EventAudit */}
        <div className="absolute bottom-6 left-6 flex items-center gap-4 bg-white/95 backdrop-blur-md border border-[#D8DEE8] px-5 py-2.5 shadow-xl z-30 rounded-full select-none">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-[#2FA862]" />
            <span className="text-[10px] font-black text-text-tertiary">{t('● ATTESTED NORMAL', '● 定时事件/常态')}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-[#E89518]" />
            <span className="text-[10px] font-black text-text-tertiary">{t('● ONGOING', '● 时延组件/流转')}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-[#D8454C]" />
            <span className="text-[10px] font-black text-text-tertiary">{t('● RISK CRITICAL', '● 严守审定要/风险')}</span>
          </div>
          <div className="w-px h-3 bg-slate-300 mx-1" />
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-[1px] border-t-2 border-dashed border-[#D8454C]" />
            <span className="text-[10px] font-black text-status-critical">{t('▸▸▸ AI CAUSAL RETROCEDING', '▸▸▸ AI 推断回流')}</span>
          </div>
        </div>
      </div>

      {/* Right side audit details drawer matching fullEvent spec */}
      <AnimatePresence>
        {activeNode && (
          <div className="fixed inset-0 bg-[#0F172A]/30 backdrop-blur-xs z-[180] flex justify-end">
            
            {/* Click backdrop to exit */}
            <div className="absolute inset-0" onClick={() => setSelectedNodeId(null)} />

            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="absolute right-0 top-0 bottom-0 w-[480px] bg-white border-l border-[#D8DEE8] shadow-2xl z-[190] flex flex-col overflow-hidden font-sans select-text"
            >
              
              {/* Drawer Sticky Header */}
              <header className="p-6 border-b border-[#D8DEE8] relative select-none bg-slate-50/50 shrink-0">
                <button 
                  onClick={() => setSelectedNodeId(null)}
                  className="absolute top-6 right-6 p-1 rounded-sm text-text-tertiary hover:text-text-primary hover:bg-slate-100 transition-colors cursor-pointer"
                  id="btn-close-lifecycle-drawer"
                >
                  <X size={18} />
                </button>

                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-[10px] font-bold tracking-wider text-text-tertiary uppercase font-mono">
                    {activeNode.stageCode}
                  </span>
                  <span className={cn(
                    "text-[8px] font-black uppercase text-white px-1.5 py-0.2 rounded-sm tracking-widest font-mono",
                    activeNode.status === 'ok' && 'bg-[#2FA862]',
                    activeNode.status === 'wip' && 'bg-[#E89518]',
                    activeNode.status === 'risk' && 'bg-[#D8454C]',
                    activeNode.status === 'pending' && 'bg-slate-400'
                  )}>
                    {STATUS_STYLING[activeNode.status]?.labelEn}
                  </span>
                </div>

                <h2 className="text-[19px] font-black text-bg-dark leading-tight tracking-tight">
                  {translateNodeTitle(activeNode.title, isZh)}
                </h2>
                <p className="text-[11px] text-text-secondary font-medium uppercase tracking-tight mt-1">
                  {translateProjectName(activeNode.projectName, isZh)} · {activeNode.date}
                </p>
              </header>

              {/* Scrolling Content containers */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-slate-50/10">
                
                {/* Timeline Events milestone points */}
                <section>
                  <div className="flex items-center gap-1.5 mb-3 select-none">
                    <History size={13} className="text-[#2D6CDF]" />
                    <h3 className="text-[10px] font-black uppercase tracking-wider text-bg-dark">
                      {t('1. EVENT TIMELINE', '1. 关键事件时间线 EVENT TIMELINE')}
                    </h3>
                  </div>

                  <div className="border-l border-slate-200 pl-4 space-y-3.5 mt-2">
                    {activeNode.timeline.map((ev, evIdx) => (
                      <div key={evIdx} className="relative">
                        {/* Dot indicator */}
                        <div className="absolute -left-[20.5px] top-1.5 w-2 h-2 rounded-full border border-white bg-slate-400 ring-4 ring-white" />
                        <span className="text-[9.5px] font-mono text-text-tertiary block leading-none tabular-nums">
                          {ev.time}
                        </span>
                        <p className="text-[11px] font-bold text-bg-dark leading-snug mt-1">
                          {translateTimelineAction(ev.action, isZh)}
                        </p>
                        <p className="text-[9.5px] text-text-tertiary tracking-tight font-mono">
                          {t('Operator: ', '操作归属方: ')}{translateTimelineOwner(ev.owner, isZh)}
                        </p>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Involved Entities featuring pierce secondary drill down */}
                <section>
                  <div className="flex items-center gap-1.5 mb-2.5 select-none">
                    <GitBranch size={13} className="text-[#2D6CDF]" />
                    <h3 className="text-[10px] font-black uppercase tracking-wider text-bg-dark">
                      {t('2. INVOLVED ENTITIES', '2. 涉及单位 INVOLVED ENTITIES')}
                    </h3>
                  </div>

                  <div className="space-y-1.5">
                    {activeNode.entities.map((ent, entIdx) => (
                      <button 
                        key={ent.id}
                        onClick={() => setEnterpriseId(ent.id)}
                        className="w-full text-left flex items-center justify-between p-3 border border-[#D8DEE8] hover:border-text-primary hover:bg-slate-50 transition-colors rounded-[2px]"
                      >
                        <div>
                          <p className="text-[11.5px] font-bold text-bg-dark leading-tight">
                            {translateEntityName(ent.nameCn, isZh)}
                          </p>
                          <p className="text-[9.5px] text-text-tertiary font-mono tracking-tight uppercase leading-none mt-1">
                            {translateEntityRole(ent.role, isZh)} · {ent.id}
                          </p>
                        </div>
                        <span className="text-[11px] text-text-tertiary hover:text-text-primary px-1.5 border border-[#D8DEE8] rounded bg-white text-[9.5px] font-bold leading-relaxed shadow-sm">
                          {t('Drill-down →', '级钻入 ↗')}
                        </span>
                      </button>
                    ))}
                  </div>
                </section>

                {/* Related audit papers linked documents */}
                <section>
                  <div className="flex items-center gap-1.5 mb-2.5 select-none">
                    <FileCheck size={13} className="text-[#2D6CDF]" />
                    <h3 className="text-[10px] font-black uppercase tracking-wider text-bg-dark">
                      {t('3. LINKED DOCUMENTS', '3. 关联文件 LINKED DOCUMENTS')}
                    </h3>
                  </div>

                  <div className="space-y-1 bg-white border border-[#D8DEE8] p-2 rounded-[2px]">
                    {activeNode.documents.map((doc, docIdx) => {
                      const transName = isZh ? doc.name : doc.name
                        .replace('_立项批复.pdf', '_Approval.pdf')
                        .replace('_限制性双盲立项.pdf', '_Restrictive_Approval.pdf')
                        .replace('_限制性竞招标公告.pdf', '_Restrictive_Tender_Notice.pdf')
                        .replace('_投标文件汇总名册.xlsx', '_Bids_Registry.xlsx')
                        .replace('_招标技术书.docx', '_Tender_Spec.docx')
                        .replace('_评分合议判定文本.pdf', '_Evaluation_Rep.pdf')
                        .replace('_合意正本.pdf', '_Agreement.pdf')
                        .replace('_股东注资验资函.pdf', '_Capital_Certificate.pdf')
                        .replace('_中央批复书.pdf', '_Budget_Decree.pdf')
                        .replace('_安全双签红界.docx', '_Safety_Redline.docx')
                        .replace('_国库打款凭证.pdf', '_Transfer_Bill.pdf')
                        .replace('_付款重组补充协议-初稿.docx', '_Payment_Restruct_Draft.docx')
                        .replace('_合资合同正本.pdf', '_JV_Agreement.pdf')
                        .replace('_付款重组补充协议-核印盖章本.pdf', '_Payment_Restruct_Signed.pdf')
                        .replace('_特种防腐油气钢管采购契约.pdf', '_Steel_Pipes_Contract.pdf')
                        .replace('_三一动力技术白皮书_主汽机.pdf', '_Sany_Turbine_Technical_Sheet.pdf')
                        .replace('_工程一期打款单.pdf', '_Disbursal_Receipt_Phase1.pdf')
                        .replace('_阿特劳贴息支持核本_2024.pdf', '_Atyrau_Subsidy_Decree_2024.pdf')
                        .replace('_主备拆换一期现场监理表.pdf', '_Boiler_Piping_Site_Log.pdf')
                        .replace('_三期施工综合验收单.pdf', '_Milestone3_Acceptance.pdf')
                        .replace('_紧急分包权责让渡书.pdf', '_Emergency_Subcontract_Transfer.pdf');
                      return (
                        <div key={docIdx} className="flex items-center justify-between py-1.5 px-2 border-b last:border-0 border-slate-100 last:pb-0">
                          <div className="min-w-0">
                            <p className="text-[11px] font-bold text-bg-dark truncate max-w-[280px]">
                              📄 {transName}
                            </p>
                            <p className="text-[8.5px] text-text-tertiary font-mono uppercase tracking-[0.05em] leading-normal">
                              SHA-256: {doc.hash}
                            </p>
                          </div>
                          <button 
                            onClick={() => alert(t(`Simulating raw file transfer for: ${transName}`, `正在从中央电子资料库解密抓取文件: ${doc.name}`))}
                            className="text-[9.5px] text-violet-600 hover:text-violet-800 font-bold border border-violet-200 bg-violet-50 px-1.5 rounded"
                          >
                            {t('Preview', '查看')}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </section>

                {/* Real-time money trail flows */}
                <section>
                  <div className="flex items-center gap-1.5 mb-2.5 select-none">
                    <Zap size={13} className="text-[#2D6CDF]" />
                    <h3 className="text-[10px] font-black uppercase tracking-wider text-bg-dark">
                      {t('4. FUND FLOWS', '4. 资金流追溯 FUND FLOW')}
                    </h3>
                  </div>

                  <div className="space-y-1.5 bg-slate-50 border border-[#D8DEE8] p-3 rounded-[2px] font-mono select-none">
                    {activeNode.fundFlow.length > 0 ? (
                      activeNode.fundFlow.map((flow, flowIdx) => (
                        <div key={flowIdx} className="flex items-center justify-between text-[10.5px]">
                          <div className="flex items-center gap-1 max-w-[65%] min-w-0">
                            <span className="text-text-tertiary shrink-0">{flowIdx+1}.</span>
                            <span className="text-bg-dark font-semibold truncate" title={translateFundEntity(flow.from, isZh)}>{translateFundEntity(flow.from, isZh)}</span>
                            <span className="text-text-tertiary shrink-0">→</span>
                            <span className="text-bg-dark font-semibold truncate" title={translateFundEntity(flow.to, isZh)}>{translateFundEntity(flow.to, isZh)}</span>
                          </div>
                          <span className={cn(
                            "font-black tracking-tight shrink-0 text-right ml-2 text-[11px]",
                            flow.amount.includes('逾期') ? 'text-status-critical' : 'text-[#2FA862]'
                          )}>
                            {isZh ? flow.amount : flow.amount.replace('逾期', 'Overdue')}
                          </span>
                        </div>
                      ))
                    ) : (
                      <p className="text-[10.5px] text-text-tertiary italic">
                        {t('No financial disbursements logged for this stage.', '本阶段核物理无计征直接大宗出账划扣记录。')}
                      </p>
                    )}
                  </div>
                </section>

                {/* Scorecard diagnostics risk values */}
                <section>
                  <div className="flex items-center gap-1.5 mb-2.5 select-none">
                    <ShieldCheck size={13} className="text-[#2D6CDF]" />
                    <h3 className="text-[10px] font-black uppercase tracking-wider text-bg-dark">
                      {t('5. RISK & AI INSIGHT', '5. 风险评级 + AI 解读 RISK & AI INSIGHT')}
                    </h3>
                  </div>

                  <div className="grid grid-cols-3 gap-2.5 mb-3.5 select-none font-mono text-center">
                    <div className="bg-slate-50 border border-[#D8DEE8] p-2 rounded">
                      <p className="text-[8px] text-text-tertiary uppercase font-black leading-none">{t('RISK LEVEL', '风险等级')}</p>
                      <p className="text-[13px] font-black text-bg-dark leading-none mt-1.5">{translateRiskLevel(activeNode.riskLevel, isZh)}</p>
                    </div>
                    <div className="bg-slate-50 border border-[#D8DEE8] p-2 rounded">
                      <p className="text-[8px] text-text-tertiary uppercase font-black leading-none">{t('SLA WINDOW', 'SLA 剩余')}</p>
                      <p className="text-[10px] font-black text-bg-dark leading-none mt-1.5 truncate">{translateSlaRemaining(activeNode.slaRemaining, isZh)}</p>
                    </div>
                    <div className="bg-slate-50 border border-[#D8DEE8] p-2 rounded">
                      <p className="text-[8px] text-text-tertiary uppercase font-black leading-none">{t('OVERDUE DAYS', '逾期天数')}</p>
                      <p className="text-[13px] font-black text-bg-dark leading-none mt-1.5">{activeNode.overdueDays}d</p>
                    </div>
                  </div>

                  <div className="bg-violet-50/50 rounded-[4px] p-4 border-l-2 border-[#8B5CF6] border border-violet-100">
                    <p className="text-[9px] text-[#8B5CF6] font-black uppercase tracking-wider mb-1 font-mono">
                      ⚡ AI RECOMMENDATION DIAGNOSIS
                    </p>
                    <p className="text-[11px] leading-relaxed text-slate-850 font-medium font-sans">
                      {translateAiInsight(activeNode.aiInsight, isZh)}
                    </p>
                  </div>
                </section>

              </div>

              {/* Sticky bottom buttons */}
              <footer className="sticky bottom-0 bg-white border-t border-[#D8DEE8] px-6 py-4 flex gap-2 shrink-0 select-none">
                <button 
                  onClick={() => {
                    alert(t('Simulating dispatch of official notification and formal file compile...', '案件已加入系统性审计工作底稿归档，同步抄送曼吉斯套州审计处常设领导小组。'));
                    setSelectedNodeId(null);
                  }}
                  className="flex-grow bg-bg-dark text-white text-[11px] font-black uppercase py-2.5 rounded-[2px] hover:bg-slate-850 transition-colors cursor-pointer"
                >
                  {t('Inject to Official Audit Dossier ↗', '纳入审计公文 ↗')}
                </button>
                <button 
                  onClick={() => setSelectedNodeId(null)}
                  className="px-4 border border-[#D8DEE8] hover:border-slate-400 text-[11px] font-bold py-2.5 rounded-[2px] text-text-secondary hover:text-text-primary transition-all cursor-pointer"
                >
                  {t('Close Panel', '回到流程图')}
                </button>
              </footer>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Level-2 Pierce Enterprise Detail Drawer */}
      <EnterpriseDetailDrawer 
        enterprise={selectedEnterprise} 
        onClose={() => setEnterpriseId(null)} 
      />

    </div>
  );
}
