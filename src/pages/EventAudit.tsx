import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeft,
  Info,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Clock,
  User,
  Star,
  Zap,
  X,
  History,
  ShieldCheck,
  TrendingDown,
  ChevronRight,
  GitBranch,
  Search,
  Maximize,
  Download,
  Filter,
  FileCheck,
  FileText
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { motion, AnimatePresence } from 'motion/react';

// Data import
import { case001LifecycleMatrix as RawDATA } from '../data/audit/case_001_lifecycle_matrix';
import { useLanguage } from '../components/LanguageContext';

// --- Types ---
type NodeStatus = 'NORMAL' | 'PROGRESS' | 'WARNING' | 'CRITICAL' | 'PENDING';

const STATUS_COLORS: Record<NodeStatus, { fill: string; border: string; text: string; label: string; label_zh: string }> = {
  NORMAL:   { fill: '#E6F6EC', border: '#1E9E54', text: '#1E9E54', label: 'NORMAL', label_zh: '正常运行' },
  PROGRESS: { fill: '#FFF6E1', border: '#D38B0A', text: '#D38B0A', label: 'PROGRESS', label_zh: '进行中' },
  WARNING:  { fill: '#FEEBC8', border: '#DD6B20', text: '#DD6B20', label: 'WARNING', label_zh: '合规偏差' },
  CRITICAL: { fill: '#FDE7E7', border: '#D92D20', text: '#D92D20', label: 'CRITICAL', label_zh: '严重违规' },
  PENDING:  { fill: '#F1F4F8', border: '#B5BFCC', text: '#64748B', label: 'PENDING', label_zh: '等待执行' },
};

// --- Translator helper for lifecycle matrices ---
const getNodeZh = (language: string, field: string, text: string) => {
  if (language !== 'zh' || !text) return text;

  // Custom high-accuracy dictionary overrides for lifecycle nodes in Chinese
  const nodeDict: Record<string, string> = {
    // Titles & nodes
    "Submit APP-2026-0078": "提交增产审批文本 APP-2026-0078",
    "Intake & formality check": "材料完整性形式初审",
    "Resubmit refreshed pack": "企业补充完全材料并重呈报",
    "Technical pre-review": "行业准入工程技术预审及立案",
    "Inter-agency technical review": "跨部门技术联合评审会",
    "Issue EXP-2026-D09": "正式签发扩产资质 EXP-2026-D09",
    "Monthly M03 report": "提交月度运行与能耗电子申报 M03",
    "Monthly M04 report": "提交月度运行与能耗电子申报 M04",
    "Monthly M05 report": "提交月度生产与物理吞吐申报 M05",
    "Reporting Division QC": "能耗申报处室数据逻辑核对",
    "Dept. data aggregation": "全省宏观汇总物理平衡性剖析",
    "Site inspection INSP-2026-0091": "属地现场派驻测勘及测绘取证",
    "Inspection Division review": "司督察室测绘覆盖深度逻辑重审",
    "Joint inspection order": "联合海关税局启动紧急实地联合勘外勤",
    "Ministerial dispatch authorization": "部长派发72小时现场紧急接管强核令",
    "Historical penalty paid": "企业全额缴纳并归档历史违规罚单",
    "Sanction order (historical)": "因设备违章私接大表开具第47号告诫函",
    "Dept. counter-signature": "处罚方案司局会签盖章送达程序",
    "Repeat sanction prep (draft)": "第48号加重顶格停业处罚书（草签起草）",
    "Quarterly audit Q4 2025": "企业上报 Q4 第三方财务审计报告",
    "Quarterly audit Q1 2026": "企业上报 Q1 第三方财务合规审计报告",
    "Quarterly audit Q2 2026": "企业上报 Q2 第三方环境与财务审计（案发期）",
    "Auditor independence flag": "判定第三方审计受贿不实并撤销清白绿牌",
    "Audit independence review": "启动第三方合规审计独立性穿透审查支队",
    "Audit oversight directive": "向涉事中介审计师所送达执业操守规诫提示函",
    "Cross-division consultation": "联合科室就物理超限召集法理判定核签会",
    "Review Committee verdict": "评议委员会最终违规事实法理合议裁定",
    "Vice-Minister escalation note": "分管副部长研判结论批阅呈送程序",
    "Minister official sign-off": "部长正式签署国家第105号终结强制令文件",
    "Issue regulatory directive": "向阿克套分输及外贸总站送达强制关停控气令",
    "Draft public announcement": "宣传处起草违规性质向全社会公开点名公开通告",
    "Formal public disclosure": "召开国家工业合规特大典型案件向社会通报会",
    "Formal directive serve": "司法警务大队突袭并现场贴条查封核心往复轴",

    // Owners
    "Approval Division": "准入审批处室",
    "Reporting Division": "申报稽核处室",
    "Inspection Division": "现场督察处室",
    "Sanction Division": "裁决处罚处室",
    "Audit Division": "合规审计监督处",
    "Approval + Inspection Divs.": "审批督察多科室联合专案组",
    "Energy Reg. Dept. Committee": "联合督察协调认定委员会",
    "Energy Reg. Dept. Director": "司长审签核准办公室",
    "Energy Reg. Dept.": "能源监管司局",
    "Mangystau Regional Insp.": "曼吉斯套驻地督察办",
    "Vice-Minister Office": "部党组、副部长办公室",
    "Minister Office": "部长党组签发室",
    "State Audit Committee": "国家审计委员会、合规督办署",
    "Information Division": "外宣信息发布处",
    "Enforcement Division": "司法联合执法署、督办大队",
    "Western Caspian Energy LLC": "西部里海能源合规执委会",

    // Summaries
    "Capacity expansion permit application submitted with 8 attachments.": "呈报里海西部2号核心设施负荷大修及小时增能气配额扩容申请，随附8册物理校验完备电子文件。",
    "Incomplete docs (2/8 missing). Returned to enterprise for refresh.": "形式要件审查发现缺失独立地质气密压力鉴定，予以限期3个工作日补件退回标记。",
    "Re-submission with 8/8 attachments.": "基层企业补充完备全部气密与变电机组高载测试报告，提交整改修正版大表。",
    "Pre-review passed. Forwarded to inter-agency coordination window.": "资质技术指标初审核准入绿，转呈能源委及涉事环境司联合会签窗口。",
    "Notice sent to tax/customs/security for joint evaluation setup.": "向税务署和海关口岸发出跨部门核减商洽密函，筹备启动联动联防物理查核。",
    "Permit expansion approved for +5,000 m3/h at Station 7.": "正式批复下达 Station 7 在常温下提升高压分气小时上限5000标方许可，结立M03案。",
    "Production & energy figures within nominal band.": "物联测算天然气输功负荷与用电总配比处于物理正态范围，予以线上免签通行合规标识。",
    "Night-time energy +18% vs. plan. Within tolerance but flagged.": "测点抄表在夜间出现用电尖峰高出理论计划18%，低于临界限制但触发智能浅黄合规偏置色。",
    "Throughput +40.4% above predicted band over 6 working days.": "测站物理日均超限达40.4%，且连续6个高产运转日脱敏。AI穿透诊断涉嫌重大偷油逃税罪证。点名督办。",
    "AI cross-system check flagged inconsistency vs tax/customs basis.": "时空神经网络联动海关出口吞吐实报数、税务总局财务报销凭证勾勒，穿破虚多瞒报事实，物理数据严重背离。",
    "Aggregated quarterly outlook degraded. Escalated to review lane.": "哈西部总网点流量多维测算均偏低而企业自申报大涨，系统性瞒报铁证形成，正式提请司局会合公审程序。",
    "Coverage 3/12 sites only. Station 7 / Unit-2C area NOT inspected.": "实地调阅证明：外勤小组因大雪封路等名义，对在Mangystau核心的第7变电往复机组进行真空核对时敷衍避让，属未检。",
    "AI flag: low-coverage inspection cannot rule out undeclared capacity.": "人工智能算法对该次驻地检测报告作废。指出逃避核验主往复设备是藏匿违规产能重大嫌疑，警告判定。",
    "Cross-agency field action ticket prepared (Tax + Customs + Regional).": "由联合督察司牵头，整合霍尔果斯口岸海关外勤、财政稽私队伍，联合配发紧急强突特勤工牌。",
    "Authorization for emergency joint inspection within 72h.": "副部长亲笔签署最高特行突袭令文件。联合调查工作组限令在 72 小时时标内突击封锁核对，实地接管流量测点。",
    "CASE-2025-088 fine 240M KZT paid in full.": "针对上一财年第88号偷漏配额案，在行期截止当日全额向国库上缴 2.4 亿坚戈，并销案归合规档。",
    "Article 47 violation, fine + corrective notice issued.": "因查实非法搭引辅设支线，国家对在Mangystau网点开具正式督办，行限没收处罚并通告。",
    "Approved by department director.": "本法处罚方案及会签批注通过内部法理法务审查，司局长办公室签属通过。",
    "New enforcement draft prepared pending field verification.": "拟订行政严加重罚第48号终结大表。已备关停查封关卡草签文案，外督外勤取证回传即刻生效。",
    "Q4 third-party audit submitted on time.": "按时限妥帖呈报由第三方会计所出具的Q4运营环境与物理能耗审计，在名义框架内获授合规状态。",
    "Q1 third-party audit submitted on time.": "一季度自检及中介监督常规审计核发材料名义完备，符合标准无预警触达。",
    "Q2 third-party audit submitted on time (subject period).": "二季度企业财务季度自审，由于电量物理偏离严重，底层波形及税表已处于 AI 专家模型深度扫描序列。",
    "Auditor registered clean result notwithstanding Q2 power anomaly.": "调查组查获底册：中介审计组对二季度变电计量异常大涨14%完全知晓并记录，最终却合谋包装成‘季节性温偏波动’不合规掩盖。",
    "Auditors did not inspect Station 7 physical modifications.": "经深度透视审计底稿档案：中介审计小组从未对企业核心的7号往复站机组扩建及物理线路做现场外勤勘测，玩忽职守、违背信赖原则。",
    "Audit supervision directive sent.": "部里及税局直发执业督导黑名单规诫，勒令该合伙人机构在30天限制期内停牌重审、接受廉洁审计。",
    "Reporting drift + low inspection coverage + audit independence all confirmed.": "司局多业务处室合议后结案判词：全面砸实申报数据缓漂偏置、属地监督玩忽失责、中介审计收贿隐瞒合谋不合规，三项黑产判定确认。",
    "Verdict: probability of undeclared capacity expansion = 0.85.": "专家联委会大数字评议、排除虚假概率后，判案得出最终事实确立级别：违法超额度超产量瞒产事实概率 85% 以上。",
    "Vice-Minister approves action recommendation packet.": "分管副部长在事实报告、听证决议及执法准备上加批：‘不留死角、不避特权，立即提交部长终结裁批，速去实地核准。’",
    "Minister signs final administrative decree.": "部长主持最高合规局联席党会，签发第[2026]105号针对该企业哈国西部一切黑产及特种设施的最高级终局查封令。",
    "Order served to metering station for immediate shutdown.": "通过内控自动化链路向阿克套口岸和输送自备阀站系统直发停止供汽供油断电物理远控，彻底中断一切物理物料供给。",
    "Atyrau and Aktau public disclosure packages sent.": "部新闻处向国家级网媒、里海财经、环球能源报纸印发曝光通报，完全解密 Western Caspian Energy 的作案手段与大表细节。",
    "Official publication in Ministry Gazette.": "正式在哈最高工业和资源规公报中整版刊登该大模型联动穿透反隐瞒避罚典型红牌案例，作为示范督导规戒行业。",
    "Enforcement units serve hard physical lockouts on site.": "综合执法署外勤分队挺进，对企业7号主往复箱主控电路挂红色查封封签、上法定气动阀链钢质大锁，杜绝其偷启私排。",
    "Formal dispatch to Tax / Customs / FinMon / Audit. Awaiting return signatures.": "正式向税务总署、口岸海关局、金监部及专项委员会派署强执行督办令，等四部返回核签。"
  };

  return nodeDict[text] || text;
};

// --- Sub-components ---
const ProcessCard = ({ node, onClick, isSelected, language }: { node: any; onClick: () => void; isSelected: boolean; language: string }) => {
  const status = STATUS_COLORS[node.status as NodeStatus] || STATUS_COLORS.PENDING;
  
  return (
    <motion.div
      layoutId={node.id}
      onClick={onClick}
      className={cn(
        "relative w-[132px] h-[54px] rounded-md p-2 flex flex-col justify-between cursor-pointer transition-all border shrink-0",
        isSelected ? "ring-2 ring-bg-dark border-transparent z-10" : "border-[#D8DEE8] hover:border-text-tertiary",
        node.ai_flag && "ring-[1.4px] ring-[#1570EF] ring-offset-1"
      )}
      style={{ backgroundColor: status.fill }}
    >
      {node.id === 'N-S6-L3-01' && (
        <div className="absolute -top-14 -left-3 w-[150px] bg-[#D8454C] text-white text-[7.5px] p-1.5 rounded shadow-xl z-50 leading-normal border border-white/20 select-none animate-bounce">
          <div className="font-bold flex items-center gap-1 text-[8px]">
            <span className="text-[#E89518]">⚡</span>
            {language === 'zh' ? 'AI 审查倒流建议' : 'AI BOTTLENECK OVERLAY'}
          </div>
          <p className="opacity-95 mt-0.5 text-[7px] leading-tight font-black">
            {language === 'zh'
              ? '【常态泄漏拟合度<13%】高置信判定属瞒产超产违规！AI 算法强制拦截并倒退建议至【重报整改】状态。'
              : 'Leak fit <13%. High-confidence overproduction. Recommended return-flow to Rectification Stage.'}
          </p>
        </div>
      )}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-1">
           <div className={cn("w-1.5 h-1.5 rounded-full", node.status === 'CRITICAL' && "agent-dot-pulse")} style={{ backgroundColor: status.border }} />
           <span className="text-[7px] font-bold tracking-widest text-text-tertiary uppercase">
             {language === 'zh' ? status.label_zh : status.label}
           </span>
        </div>
        {node.ai_flag && (
           <span className="text-[7px] font-bold text-[#1570EF] bg-[#1570EF]/10 px-1 rounded-sm">AI</span>
        )}
      </div>
      <div className="text-[8.5px] font-bold text-bg-dark leading-tight line-clamp-1 truncate uppercase tracking-tight">
        {getNodeZh(language, 'title', node.title)}
      </div>
      <div className="flex justify-between items-end">
         <span className="text-[6.5px] text-text-tertiary font-mono truncate max-w-[60px]">
           {getNodeZh(language, 'owner', node.owner)}
         </span>
         {node.badges?.[0] && (
           <span className="text-[6px] font-bold bg-white/60 px-1 border border-black/5 rounded-[2px]">{node.badges[0]}</span>
         )}
      </div>
    </motion.div>
  );
};

// --- Main Page Component ---
export default function EventAudit() {
  const navigate = useNavigate();
  const { caseId = 'CASE-2026-001' } = useParams();
  const { language, t, objT } = useLanguage();
  const DATA = useMemo(() => objT(RawDATA), [RawDATA, language, objT]);
  
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [activeStrategies, setActiveStrategies] = useState<Set<string>>(new Set(['OPT-01', 'OPT-02', 'OPT-04']));
  const [isApplying, setIsApplying] = useState(false);
  const [scale, setScale] = useState(1);
  const [isBottomExpanded, setIsBottomExpanded] = useState(true);
  const [minimizedPanels, setMinimizedPanels] = useState<Set<string>>(new Set());
  
  const matrixRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const [edgePaths, setEdgePaths] = useState<any[]>([]);

  // Calculate edges on mount and resize with real-time scaling correction
  const calculateEdges = useCallback(() => {
    if (!matrixRef.current || !canvasRef.current) return;
    
    const container = matrixRef.current;
    const canvas = canvasRef.current;
    const canvasRect = canvas.getBoundingClientRect();
    
    // Read actual real-time physical visual scale to cancel spring/animation lag effects
    const s = canvasRect.width / canvas.offsetWidth || scale;
    
    const paths = DATA.edges.map(edge => {
      const fromNode = nodeRefs.current[edge.from];
      const toNode = nodeRefs.current[edge.to];
      if (!fromNode || !toNode) return null;

      const fromRect = fromNode.getBoundingClientRect();
      const toRect = toNode.getBoundingClientRect();

      // Center points relative to scaled canvas top-left
      const x1_center = (fromRect.left + fromRect.width / 2 - canvasRect.left) / s;
      const y1_center = (fromRect.top + fromRect.height / 2 - canvasRect.top) / s;
      const x2_center = (toRect.left + toRect.width / 2 - canvasRect.left) / s;
      const y2_center = (toRect.top + toRect.height / 2 - canvasRect.top) / s;

      const fromWidth = fromRect.width / s;
      const fromHeight = fromRect.height / s;
      const toWidth = toRect.width / s;
      const toHeight = toRect.height / s;

      let x1 = x1_center;
      let y1 = y1_center;
      let x2 = x2_center;
      let y2 = y2_center;

      const dx = x2_center - x1_center;
      const dy = y2_center - y1_center;

      // Smart boundary offset positioning avoiding card overlaps
      if (Math.abs(dx) > Math.abs(dy)) {
        if (dx > 0) {
          x1 = x1_center + fromWidth / 2;
          x2 = x2_center - toWidth / 2;
        } else {
          x1 = x1_center - fromWidth / 2;
          x2 = x2_center + toWidth / 2;
        }
      } else {
        if (dy > 0) {
          y1 = y1_center + fromHeight / 2;
          y2 = y2_center - toHeight / 2;
        } else {
          y1 = y1_center - fromHeight / 2;
          y2 = y2_center + toHeight / 2;
        }
      }

      let d = "";
      const isReturn = edge.type === 'RETURN';
      
      if (isReturn) {
        // High-fidelity arc curve loops downwards for low y, upwards for high y
        const midX = (x1 + x2) / 2;
        const curveOffset = y1 < 250 ? 80 : -100;
        const midY = Math.min(y1, y2) + curveOffset;
        d = `M ${x1} ${y1} Q ${midX} ${midY} ${x2} ${y2}`;
      } else {
        // Continuous smooth S-curve
        if (Math.abs(dx) > Math.abs(dy)) {
          const midX = (x1 + x2) / 2;
          d = `M ${x1} ${y1} C ${midX} ${y1}, ${midX} ${y2}, ${x2} ${y2}`;
        } else {
          const midY = (y1 + y2) / 2;
          d = `M ${x1} ${y1} C ${x1} ${midY}, ${x2} ${midY}, ${x2} ${y2}`;
        }
      }

      return { ...edge, d, x1, y1, x2, y2 };
    }).filter(Boolean);

    setEdgePaths(paths);
  }, [scale, DATA.edges]);

  // Handle rapid frame-interval calculations during drawer slide and scale changes for 100% precision
  useEffect(() => {
    // Fire instantly on render trigger
    calculateEdges();
    
    // Set up high frequency tracking interval for physics animations (lasting 500ms after triggers)
    const interval = setInterval(calculateEdges, 40);
    const timeout = setTimeout(() => clearInterval(interval), 500);
    
    const handleResize = () => calculateEdges();
    window.addEventListener('resize', handleResize);
    
    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
      window.removeEventListener('resize', handleResize);
    };
  }, [calculateEdges, isDrawerOpen, scale, isBottomExpanded, minimizedPanels]);

  const onScroll = () => {
    // Relative positioning holds when scrolling, but can reinforce calculations
  };

  const applySimulation = () => {
    setIsApplying(true);
    setTimeout(() => setIsApplying(false), 2000);
  };

  const toggleStrategy = (id: string) => {
    const next = new Set(activeStrategies);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setActiveStrategies(next);
  };

  const optimizedStats = useMemo(() => {
    return { 
      time: DATA.optimization.optimized_total_time, 
      pct: DATA.optimization.saved_percent 
    };
  }, [DATA.optimization]);

  const togglePanel = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const next = new Set(minimizedPanels);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setMinimizedPanels(next);
    if (!isBottomExpanded) setIsBottomExpanded(true);
  };

  return (
    <div className="flex-1 flex flex-col bg-[#F6F8FB] overflow-hidden font-sans">
      {/* Context Bar */}
      <div className="h-10 bg-white border-b border-[#D8DEE8] flex items-center justify-between px-6 shrink-0 z-50">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 text-text-tertiary hover:text-text-primary transition-colors pr-4 border-r border-[#D8DEE8] uppercase tracking-widest text-[10px] font-bold"
          >
            <ArrowLeft size={14} />
            <span>{language === 'zh' ? '返回' : 'Back'}</span>
          </button>
          <div className="flex items-center gap-6">
            <span className="text-[10px] text-text-secondary uppercase tracking-[0.1em] font-bold">
              {language === 'zh' ? '全进程合规审查二维泳道图谱' : 'REGULATORY LIFECYCLE — PROCESS × LEVEL SWIMLANES'}
            </span>
            <div className="flex items-center gap-3">
              <span className="text-[10px] text-text-tertiary uppercase font-mono">{DATA.meta.case_id} | {DATA.meta.enterprise_id}</span>
            </div>
            <button 
              onClick={() => navigate('/audit/project')}
              className="flex items-center gap-1 px-2.5 py-0.5 bg-violet-50 text-[#8B5CF6] hover:bg-[#8B5CF6]/10 border border-[#8B5CF6]/20 transition-all text-[9.5px] font-black uppercase rounded font-mono shadow-xs"
            >
              <span>{language === 'zh' ? '📊 切换至项目全周期 ↗' : '📊 PROJECT AUDIT ↗'}</span>
            </button>
          </div>
        </div>
        <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-text-tertiary">
          <span className="text-bg-dark">{language === 'zh' ? '行动类别: 主动专案稽查' : 'MODE: ACTIVE PROBE'}</span>
          <span className="opacity-40">|</span>
          <span className="text-bg-dark">
            {language === 'zh' ? `行动进展 ${DATA.kpis.overall_progress_percent}%` : `PROGRESS ${DATA.kpis.overall_progress_percent}%`}
          </span>
          <span className="opacity-40">|</span>
          <span className="text-[#1570EF]">{language === 'zh' ? '云端模型联动审核中' : 'AI COLLABORATING'}</span>
          <span className="opacity-40">|</span>
          <span className="text-status-warning">{language === 'zh' ? '常态 72H 窗口' : '72H WINDOW'}</span>
        </div>
      </div>

      {/* Case Clock Stats Strip */}
      <div className="h-[88px] bg-white border-b border-[#D8DEE8] flex items-center px-8 shrink-0 relative overflow-hidden z-40">
         <div className="grid grid-cols-8 gap-6 w-full max-w-7xl items-center">
            <div className="flex flex-col">
               <span className="text-[9px] font-bold text-text-tertiary uppercase tracking-widest mb-1">{language === 'zh' ? '总审理进度' : 'Case Progress'}</span>
               <span className="text-[22px] font-bold leading-none text-bg-dark">{DATA.kpis.overall_progress_percent}%</span>
            </div>
            <div className="flex flex-col">
               <span className="text-[9px] font-bold text-text-tertiary uppercase tracking-widest mb-1">{language === 'zh' ? '流程阶段总数' : 'Stages'}</span>
               <span className="text-[18px] font-bold leading-none">{DATA.kpis.stages_total} / 9</span>
            </div>
            <div className="flex flex-col">
               <span className="text-[9px] font-bold text-text-tertiary uppercase tracking-widest mb-1">{language === 'zh' ? '涵盖合规层级' : 'Levels'}</span>
               <span className="text-[18px] font-bold leading-none">{DATA.kpis.levels_total}</span>
            </div>
            <div className="flex flex-col">
               <span className="text-[9px] font-bold text-text-tertiary uppercase tracking-widest mb-1">{language === 'zh' ? '被拦截严重异常' : 'Critical Nodes'}</span>
               <span className="text-[22px] font-bold leading-none text-status-critical">{DATA.kpis.critical_nodes}</span>
            </div>
            <div className="flex flex-col">
               <span className="text-[9px] font-bold text-text-tertiary uppercase tracking-widest mb-1">{language === 'zh' ? 'AI 穿刺判定节点' : 'AI Flagged'}</span>
               <span className="text-[22px] font-bold leading-none text-[#1570EF] font-mono">{DATA.kpis.ai_flagged_nodes}</span>
            </div>
            <div className="flex flex-col">
               <span className="text-[9px] font-bold text-text-tertiary uppercase tracking-widest mb-1">{language === 'zh' ? '流程倒退流转数' : 'Returns'}</span>
               <span className="text-[22px] font-bold leading-none text-status-critical font-mono">{DATA.kpis.return_edges}</span>
            </div>
            <div className="flex flex-col col-span-2 pl-4 border-l border-slate-200 justify-center">
               <div className="flex justify-between items-center mb-1">
                 <span className="text-[9px] font-bold text-[#D8454C] uppercase tracking-widest">{language === 'zh' ? '前置干预 SLA 倒计时' : 'PREVENTIVE SLA WINDOW'}</span>
                 <span className="text-[12px] font-mono font-black text-[#D8454C]">36h Remaining</span>
               </div>
               <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                 <div className="h-full bg-gradient-to-r from-[#D8454C] to-[#E89518]" style={{ width: '50%' }}></div>
               </div>
               <span className="text-[8.5px] text-[#6A7686] mt-1 font-mono uppercase">Lanes: 18h elapsed · 18h until breach</span>
            </div>
         </div>
         <div className="absolute top-0 right-0 h-full flex items-center opacity-5 select-none pointer-events-none pr-10">
            <ShieldCheck size={120} />
         </div>
      </div>

      <div className="flex-1 flex overflow-hidden relative">
        {/* Floating Scale Zoom Buttons */}
        <div className="absolute top-6 right-6 flex flex-col gap-2 z-[70]">
           <button 
             onClick={() => setScale(s => Math.min(s + 0.1, 1.5))}
             className="w-10 h-10 bg-white border border-[#D8DEE8] rounded-full shadow-lg flex items-center justify-center text-bg-dark hover:bg-bg-secondary transition-all"
           >
              <Maximize size={18} />
           </button>
           <button 
             onClick={() => setScale(s => Math.max(s - 0.1, 0.5))}
             className="w-10 h-10 bg-white border border-[#D8DEE8] rounded-full shadow-lg flex items-center justify-center text-bg-dark hover:bg-bg-secondary transition-all"
           >
              <Search size={18} />
           </button>
           <button 
             onClick={() => setScale(1)}
             className="w-10 h-10 bg-white border border-[#D8DEE8] rounded-full shadow-lg flex items-center justify-center text-[10px] font-bold text-bg-dark hover:bg-bg-secondary transition-all"
           >
              100%
           </button>
        </div>

        {/* Scalable Container Panning viewport */}
        <div 
          className="flex-1 overflow-auto custom-scrollbar bg-white relative p-12" 
          ref={matrixRef}
          onScroll={onScroll}
        >
          <motion.div 
            ref={canvasRef}
            animate={{ scale }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="origin-top-left relative"
            style={{ width: 'max-content' }}
          >
            {/* SVG Overlay containing direct interconnect paths */}
            <svg 
              className="absolute inset-0 pointer-events-none" 
              style={{ 
                zIndex: 5, 
                width: '100%', 
                height: '100%',
                overflow: 'visible' 
              }}
            >
              <defs>
                <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="currentColor" />
                </marker>
              </defs>
              {edgePaths.map((edge, i) => (
                <g key={i} className={cn(
                  "transition-all duration-300",
                  edge.type === 'RETURN' ? "text-status-critical" : "text-[#94A3B8]",
                  "hover:text-bg-dark"
                )}>
                  <path 
                    d={edge.d} 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth={edge.type === 'RETURN' ? 2 : 1} 
                    strokeDasharray={edge.type === 'RETURN' ? "5,3" : "none"}
                    markerEnd="url(#arrow)"
                  />
                  {edge.label && edge.type === 'RETURN' && (
                    <text 
                      x={(edge.x1 + edge.x2) / 2} 
                      y={Math.min(edge.y1, edge.y2) - 12} 
                      textAnchor="middle" 
                      className="text-[9px] font-bold fill-status-critical uppercase tracking-widest bg-white"
                    >
                      {language === 'zh' ? (
                        edge.label.includes('hold') ? '暂缓许可审批 ◀' :
                        edge.label.includes('report') ? '强制纠偏重报 ◀' :
                        edge.label.includes('independence') ? '独立性穿透重审 ◀' : edge.label
                      ) : edge.label}
                    </text>
                  )}
                </g>
              ))}
            </svg>

            <div className="grid grid-cols-[240px_repeat(9,minmax(180px,1fr))] w-full min-w-[max-content] border border-[#E5EAF1] shadow-2xl">
              {/* Vertical Row x Column headers */}
              <div className="h-14 bg-bg-secondary/20 border-b border-r border-[#E5EAF1] sticky top-0 left-0 z-30" />
              {DATA.stages.map((stage, colIdx) => (
                <div key={stage.id} className="h-14 bg-bg-secondary/20 border-b border-r border-[#E5EAF1] flex flex-col items-center justify-center p-2 sticky top-0 z-20">
                   <div className="text-[10px] font-bold text-bg-dark tracking-wider uppercase">
                     {language === 'zh' ? (
                       stage.key === 'APPROVAL' ? '1-许可初审在批' :
                       stage.key === 'REPORTING' ? '2-自主报送自检' :
                       stage.key === 'INSPECTION' ? '3-物理测绘与外勤' :
                       stage.key === 'SANCTION' ? '4-惩戒与合规履历' :
                       stage.key === 'RECTIFICATION' ? '5-治理整改阶段' :
                       stage.key === 'REVIEW' ? '6-多源交叉核对' :
                       stage.key === 'ACCEPTANCE' ? '7-合规终闭验收' :
                       stage.key === 'AUDIT' ? '8-专项合规审计' : '9-数字合规披露'
                     ) : stage.name_en}
                   </div>
                   <div className="text-[7px] text-text-tertiary uppercase truncate max-w-full font-bold">Stage {colIdx + 1}</div>
                </div>
              ))}

              {/* Rows matching with organization levels */}
              {DATA.levels.map((level, rowIdx) => (
                <React.Fragment key={level.id}>
                  {/* Row Swimlane Category Indicator */}
                  <div className={cn(
                    "h-[130px] p-4 flex flex-col justify-center border-b border-r border-[#E5EAF1] sticky left-0 z-10 shadow-sm transition-all",
                    rowIdx % 2 === 0 ? "bg-[#FAFBFD]" : "bg-[#F4F7FB]"
                  )}>
                     <div className="text-[12px] font-black text-bg-dark uppercase tracking-widest">
                       {language === 'zh' ? (
                         level.key === 'MINISTRY' ? '最高部委层级' :
                         level.key === 'DEPARTMENT' ? '部属监管司局' :
                         level.key === 'DIVISION' ? '司常设处室' :
                         level.key === 'REGIONAL' ? '驻地派巡督察办' : '基层重点企业'
                       ) : level.name_en}
                     </div>
                     <div className="text-[8px] text-text-tertiary leading-tight opacity-70 uppercase font-black mt-1">
                       {language === 'zh' ? (
                         level.key === 'MINISTRY' ? '分管副部长、联合工作会审' :
                         level.key === 'DEPARTMENT' ? '能源监督总司 / 环境合规审查局' :
                         level.key === 'DIVISION' ? '准入、现场物勘及惩治管理科室' :
                         level.key === 'REGIONAL' ? 'Mangystau省区域驻地执法支队' : 'Caspian-Energy 生产合规委员会'
                       ) : level.org}
                     </div>
                     <div className="mt-4 flex items-center gap-2">
                        <div className="px-2 py-0.5 bg-bg-dark text-white text-[8px] font-bold rounded-[2px]">{level.id}</div>
                        <div className="text-[8px] font-bold text-text-tertiary">LVL: {level.key}</div>
                     </div>
                  </div>

                  {/* Grid cells containing node lists */}
                  {DATA.stages.map(stage => {
                    const cellNodes = DATA.nodes.filter(n => n.stage === stage.key && n.level === level.key);
                    return (
                      <div 
                        key={`${level.id}-${stage.id}`} 
                        className={cn(
                          "h-[130px] p-2 border-b border-r border-[#E5EAF1] flex flex-col items-center gap-1.5 overflow-y-auto custom-scrollbar-hidden hover:custom-scrollbar justify-start pt-3",
                          rowIdx % 2 === 0 ? "bg-[#FAFBFD]" : "bg-[#F4F7FB]"
                        )}
                      >
                        {cellNodes.map(node => (
                          <div key={node.id} ref={el => nodeRefs.current[node.id] = el}>
                            <ProcessCard 
                              node={node} 
                              language={language}
                              onClick={() => {
                                setSelectedNode(node);
                                setIsDrawerOpen(true);
                              }}
                              isSelected={selectedNode?.id === node.id}
                            />
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </React.Fragment>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Legend Overlay */}
        <div className="absolute bottom-6 left-6 flex items-center gap-4 bg-white/90 backdrop-blur border border-[#D8DEE8] p-2 px-4 shadow-xl z-[60] rounded-full">
           <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-[#1E9E54]" /><span className="text-[9px] font-bold text-text-tertiary">{language === 'zh' ? '运行平稳正常' : 'NORMAL'}</span></div>
           <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-[#D38B0A]" /><span className="text-[9px] font-bold text-text-tertiary">{language === 'zh' ? '处理进行中' : 'PROGRESS'}</span></div>
           <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-[#DD6B20]" /><span className="text-[9px] font-bold text-text-tertiary">{language === 'zh' ? '发现中度异常' : 'WARNING'}</span></div>
           <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-[#D92D20]" /><span className="text-[9px] font-bold text-text-tertiary">{language === 'zh' ? '严重红线告警' : 'CRITICAL'}</span></div>
           <div className="w-px h-3 bg-border-default mx-1" />
           <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full ring-2 ring-[#1570EF] ring-offset-1" /><span className="text-[9px] font-bold text-[#1570EF]">{language === 'zh' ? 'AI 推断挂载' : 'AI'}</span></div>
           <div className="flex items-center gap-1.5"><div className="w-4 h-[1px] border-t-2 border-dashed border-status-critical" /><span className="text-[9px] font-bold text-status-critical">{language === 'zh' ? '回回流程倒转' : 'RETURN'}</span></div>
        </div>
      </div>

      {/* Analytics & Simulator panel */}
      <motion.div 
        animate={{ height: isBottomExpanded ? 180 : 32 }}
        className="bg-white border-t border-[#D8DEE8] flex flex-col overflow-hidden z-50 transition-all font-sans"
      >
         <div 
           onClick={() => setIsBottomExpanded(!isBottomExpanded)}
           className="h-8 w-full flex items-center justify-between px-6 bg-bg-secondary/10 hover:bg-bg-secondary/20 transition-colors border-b border-[#D8DEE8] shrink-0 group cursor-pointer"
         >
            <div className="flex items-center gap-2">
               <span className="text-[9px] font-bold text-text-tertiary uppercase tracking-[0.2em]">
                 {language === 'zh' ? '时限效率与重构路径自动仿真工作台' : 'ANALYTICS & OPTIMIZATION PANEL'}
               </span>
               
               <div className="flex items-center gap-4 ml-8">
                  {minimizedPanels.has('bottleneck') && (
                    <button onClick={(e) => togglePanel('bottleneck', e)} className="flex items-center gap-1 text-[8px] font-bold text-status-critical bg-status-critical/10 px-2 py-0.5 rounded-sm hover:bg-status-critical/20">
                      <AlertTriangle size={10} /> {language === 'zh' ? '瓶颈指标' : 'BOTTLENECK'}
                    </button>
                  )}
                  {minimizedPanels.has('timing') && (
                    <button onClick={(e) => togglePanel('timing', e)} className="flex items-center gap-1 text-[8px] font-bold text-bg-dark bg-bg-dark/10 px-2 py-0.5 rounded-sm hover:bg-bg-dark/20">
                      <Clock size={10} /> {language === 'zh' ? '层级时限' : 'TIMING'}
                    </button>
                  )}
                  {minimizedPanels.has('simulator') && (
                    <button onClick={(e) => togglePanel('simulator', e)} className="flex items-center gap-1 text-[8px] font-bold text-[#1570EF] bg-[#1570EF]/10 px-2 py-0.5 rounded-sm hover:bg-[#1570EF]/20 transition-all">
                      <Zap size={10} /> {language === 'zh' ? '模拟演习' : 'SIMULATOR'}
                    </button>
                  )}
               </div>

               {!isBottomExpanded && minimizedPanels.size === 0 && (
                 <div className="flex items-center gap-4 ml-4">
                    <span className="text-[9px] font-bold text-status-critical flex items-center gap-1">
                      <AlertTriangle size={10} /> {language === 'zh' ? '系统诊断出高耗时瓶颈段' : 'BOTTLENECKS FOUND'}
                    </span>
                    <span className="text-[9px] font-bold text-[#1570EF] flex items-center gap-1">
                      <Zap size={10} /> {language === 'zh' ? 'AI 仿真调度逻辑已就绪' : 'AI SIMULATOR READY'}
                    </span>
                 </div>
               )}
            </div>
            {isBottomExpanded ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
         </div>

         <div className="flex-1 flex overflow-hidden">
            {/* Bottleneck Ranking */}
            {!minimizedPanels.has('bottleneck') && (
              <div className="w-[300px] border-r border-[#D8DEE8] p-4 flex flex-col overflow-hidden bg-white">
                <div className="flex items-center justify-between mb-3 shrink-0">
                  <h3 className="text-[11px] font-bold uppercase tracking-wider text-bg-dark flex items-center gap-2">
                    <AlertTriangle size={14} className="text-status-critical" /> {language === 'zh' ? '时序审核瓶颈排行' : 'Bottleneck Ranking'}
                  </h3>
                  <button onClick={(e) => togglePanel('bottleneck', e)} className="text-text-tertiary hover:text-bg-dark"><X size={12} /></button>
                </div>
                <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2">
                   {DATA.bottlenecks.map((b, i) => (
                     <div key={i} className="flex gap-3 group cursor-pointer hover:bg-bg-secondary/30 p-2 border border-transparent hover:border-[#D8DEE8] rounded-sm transition-all">
                        <span className="text-[10px] font-bold text-status-critical shrink-0">#{i+1}</span>
                        <div className="flex-1 min-w-0">
                           <div className="flex justify-between items-baseline mb-0.5">
                              <span className="text-[10px] font-bold text-bg-dark uppercase truncate">
                                {language === 'zh' ? (
                                  b.stage.includes('APPROVAL') ? '审批许可' :
                                  b.stage.includes('INSPECTION') ? '现场测勘' :
                                  b.stage.includes('AUDIT') ? '合规调查审计' : b.stage
                                ) : b.stage} × {language === 'zh' ? (
                                  b.level.includes('DIVISION') ? '业务处室' :
                                  b.level.includes('REGIONAL') ? '驻地督察组' :
                                  b.level.includes('ENTERPRISE') ? '基层企业' : b.level
                                ) : b.level}
                              </span>
                              <span className="text-[11px] font-bold text-status-critical font-mono shrink-0 ml-2">{b.duration}</span>
                           </div>
                           <p className="text-[9px] text-text-tertiary leading-tight line-clamp-1">
                             {language === 'zh' ? (
                               b.reason.includes('Incomplete') ? '补正件往返核验造成二次排期积压' :
                               b.reason.includes('coverage') ? '属地督察测绘不完全且需要协调口岸海关' :
                               b.reason.includes('independence') ? '检测出财务审计机构涉嫌收贿包庇、被迫重审' : b.reason
                             ) : b.reason}
                           </p>
                        </div>
                     </div>
                   ))}
                </div>
              </div>
            )}

            {/* Layer Timing */}
            {!minimizedPanels.has('timing') && (
              <div className="w-[300px] border-r border-[#D8DEE8] p-4 flex flex-col bg-[#F9FAFB]">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest flex items-center gap-2">
                     <Clock size={14} /> {language === 'zh' ? '层级处理耗时均值 (小时)' : 'Layer Timing (Hrs)'}
                  </div>
                  <button onClick={(e) => togglePanel('timing', e)} className="text-text-tertiary hover:text-bg-dark"><X size={12} /></button>
                </div>
                <div className="flex-1 flex flex-col justify-between py-1">
                   {DATA.layer_timing.map((layer) => {
                     const pct = (layer.mean_hours / 110) * 100;
                     return (
                       <div key={layer.level} className="flex items-center gap-3">
                          <span className="w-16 text-[8px] font-bold text-text-tertiary truncate uppercase">
                            {language === 'zh' ? (
                              layer.level === 'MINISTRY' ? '部领导阁' :
                              layer.level === 'DEPARTMENT' ? '直属总司' :
                              layer.level === 'DIVISION' ? '业务处室' :
                              layer.level === 'REGIONAL' ? '驻地督察' : '基层重点企业'
                            ) : layer.level}
                          </span>
                          <div className="flex-1 h-2 bg-bg-secondary/60 relative rounded-full overflow-hidden">
                             <div 
                               className={cn("h-full transition-all", layer.mean_hours > 70 ? "bg-status-critical" : "bg-bg-dark")} 
                               style={{ width: `${pct}%` }} 
                             />
                          </div>
                          <span className="w-8 text-[9px] font-mono font-bold text-right text-bg-dark">{layer.mean_hours}</span>
                       </div>
                     );
                   })}
                </div>
              </div>
            )}

            {/* Optimization Simulator UI */}
            {!minimizedPanels.has('simulator') && (
              <div className="flex-1 bg-[#1A1E23] p-4 flex flex-col text-white relative">
                <button onClick={(e) => togglePanel('simulator', e)} className="absolute top-4 right-4 text-white/40 hover:text-white"><X size={14} /></button>
                <div className="flex items-center justify-between mb-2">
                   <div className="flex items-center gap-2">
                     <Zap size={14} className="text-status-warning" fill="currentColor" />
                     <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-status-warning">
                       {language === 'zh' ? '联合行动流程重新组合模型模拟器' : 'Optimization Simulator'}
                     </span>
                   </div>
                   <div className="flex items-center gap-8 pr-10">
                      <div className="flex flex-col items-end">
                        <span className="text-[8px] text-white/40 uppercase font-bold tracking-widest">{language === 'zh' ? '现有流程时耗' : 'Current State'}</span>
                        <span className="text-[14px] font-mono text-white/40 line-through">{DATA.optimization.current_total_time}</span>
                      </div>
                      <ChevronRight size={20} className="text-white/20" />
                      <div className="flex flex-col">
                        <span className="text-[8px] text-status-success uppercase font-bold tracking-widest flex items-center gap-1">
                          <TrendingDown size={10} /> {language === 'zh' ? '仿真方案时时耗' : 'Optimized'}
                        </span>
                        <div className="flex items-baseline gap-2">
                          <span className="text-[20px] font-bold text-status-success font-mono leading-none">{optimizedStats.time}</span>
                          <span className="text-[12px] font-bold text-status-success">-{optimizedStats.pct}%</span>
                        </div>
                      </div>
                      <button 
                        onClick={applySimulation}
                        disabled={isApplying}
                        className="h-9 px-6 bg-white text-bg-dark font-bold text-[10px] uppercase tracking-widest hover:bg-bg-secondary transition-all disabled:opacity-50 flex items-center gap-2 rounded-sm"
                      >
                        {isApplying ? (language === 'zh' ? '运算仿真中...' : 'Applying...') : (language === 'zh' ? '运行优化仿真参数' : 'Apply Strategy')}
                      </button>
                   </div>
                </div>
                
                <div className="flex-1 flex gap-2">
                   {DATA.optimization.strategies.map(strat => {
                     const isActive = activeStrategies.has(strat.id);
                     return (
                       <div 
                         key={strat.id}
                         onClick={() => toggleStrategy(strat.id)}
                         className={cn(
                           "flex-1 h-full rounded-sm p-2.5 flex flex-col justify-between border cursor-pointer transition-all",
                           isActive ? "bg-white/10 border-white/40" : "bg-white/5 border-white/5 opacity-40 hover:opacity-70"
                         )}
                       >
                         <div className="flex justify-between items-start">
                            <span className="text-[9px] font-bold uppercase tracking-tight leading-tight max-w-[120px]">
                              {language === 'zh' ? (
                                strat.id === 'OPT-01' ? '初审实行并联要件审核' :
                                strat.id === 'OPT-02' ? '启动三局联合突击外勤' :
                                strat.id === 'OPT-03' ? '惩办决定网上直抄送达' : '重设独立中介审计穿透库'
                              ) : strat.label}
                            </span>
                            <div className={cn(
                              "w-6 h-3 rounded-full relative transition-colors",
                              isActive ? "bg-status-success" : "bg-white/20"
                            )}>
                               <div className={cn("absolute top-0.5 w-2 h-2 rounded-full bg-white transition-all", isActive ? "right-0.5" : "left-0.5")} />
                            </div>
                         </div>
                         <span className="text-[9px] font-bold text-status-success">-{strat.saves}</span>
                       </div>
                     );
                   })}
                </div>
              </div>
            )}
         </div>
      </motion.div>

      {/* Right Drawer Inspector popup */}
      <AnimatePresence>
        {isDrawerOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDrawerOpen(false)}
              className="absolute inset-0 bg-bg-dark/20 backdrop-blur-[1px] z-[99]"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute right-0 top-0 bottom-0 w-[380px] bg-white border-l border-[#D8DEE8] z-[100] shadow-2xl flex flex-col"
            >
              <div className="h-16 border-b border-[#D8DEE8] flex items-center justify-between px-6 shrink-0">
                 <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                       <span className="text-[9px] font-mono text-text-tertiary">[{selectedNode?.id}]</span>
                       <div className={cn(
                         "px-1.5 py-0.5 text-[8px] font-bold rounded-sm uppercase",
                         STATUS_COLORS[selectedNode?.status as NodeStatus]?.fill === '#E6F6EC' ? "bg-status-success/10 text-status-success" : "bg-status-warning/10 text-status-warning"
                       )}>
                          {language === 'zh' ? STATUS_COLORS[selectedNode?.status as NodeStatus]?.label_zh : selectedNode?.status}
                       </div>
                    </div>
                    <h2 className="text-[14px] font-bold text-bg-dark leading-tight uppercase truncate">
                      {getNodeZh(language, 'title', selectedNode?.title)}
                    </h2>
                 </div>
                 <button onClick={() => setIsDrawerOpen(false)} className="text-text-tertiary hover:text-text-primary p-2">
                    <X size={20} />
                 </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 custom-scrollbar space-y-6">
                 <div className="grid grid-cols-2 gap-3">
                    <div className="p-2.5 bg-bg-secondary/30 rounded-sm border border-[#E5EAF1]">
                       <div className="text-[8px] text-text-tertiary mb-0.5 uppercase tracking-widest font-bold">
                         {language === 'zh' ? '行动阶段' : 'Stage'}
                       </div>
                       <div className="text-[10px] font-bold text-bg-dark uppercase">
                         {selectedNode?.stage && (
                           language === 'zh' ? (
                             selectedNode.stage === 'APPROVAL' ? '许可核准期' :
                             selectedNode.stage === 'REPORTING' ? '日常在报期' :
                             selectedNode.stage === 'INSPECTION' ? '实勘调查期' :
                             selectedNode.stage === 'SANCTION' ? '行政惩戒期' :
                             selectedNode.stage === 'RECTIFICATION' ? '改造整改期' :
                             selectedNode.stage === 'REVIEW' ? '多源合议审议期' :
                             selectedNode.stage === 'ACCEPTANCE' ? '联合验收期' :
                             selectedNode.stage === 'AUDIT' ? '专项内控审计' : '公开信息披露'
                           ) : selectedNode.stage
                         )}
                       </div>
                    </div>
                    <div className="p-2.5 bg-bg-secondary/30 rounded-sm border border-[#E5EAF1]">
                       <div className="text-[8px] text-text-tertiary mb-0.5 uppercase tracking-widest font-bold">
                         {language === 'zh' ? '权限制级' : 'Level'}
                       </div>
                       <div className="text-[10px] font-bold text-bg-dark uppercase">
                         {selectedNode?.level && (
                           language === 'zh' ? (
                             selectedNode.level === 'MINISTRY' ? '最高部委层' :
                             selectedNode.level === 'DEPARTMENT' ? '直属司局层' :
                             selectedNode.level === 'DIVISION' ? '主管处室层' :
                             selectedNode.level === 'REGIONAL' ? '地方督察层' : '基层重点企业'
                           ) : selectedNode.level
                         )}
                       </div>
                    </div>
                 </div>

                 <div className="space-y-4">
                    <div className="flex items-center gap-3">
                       <div className="w-10 h-10 rounded-full bg-bg-secondary flex items-center justify-center text-bg-dark"><User size={18} /></div>
                       <div>
                          <div className="text-[12px] font-bold text-bg-dark uppercase truncate max-w-[240px]">
                            {getNodeZh(language, 'owner', selectedNode?.owner)}
                          </div>
                          <div className="text-[9px] text-text-tertiary uppercase tracking-widest font-bold">
                            {language === 'zh' ? '行动执行主体责任方' : 'Primary Action Owner'}
                          </div>
                       </div>
                    </div>
                    <div className="flex items-center gap-6 p-1">
                       <div className="flex items-center gap-2">
                          <Clock size={14} className="text-text-tertiary" />
                          <div className="text-[10px] font-mono font-bold text-bg-dark">{selectedNode?.timestamp || (language === 'zh' ? '即将发生' : 'PENDING')}</div>
                       </div>
                       {selectedNode?.duration && (
                         <div className="flex items-center gap-2 text-status-warning">
                             <Clock size={14} />
                             <div className="text-[10px] font-bold uppercase tracking-widest">
                               {language === 'zh' ? '耗时' : 'Duration'}: {selectedNode.duration} 
                             </div>
                         </div>
                       )}
                    </div>
                 </div>

                 <div className="p-4 bg-[#F8FAFC] border-l-4 border-bg-dark rounded-sm">
                    <p className="text-[12px] text-text-primary leading-relaxed italic">
                      "{getNodeZh(language, 'summary', selectedNode?.summary)}"
                    </p>
                 </div>

                 <div className="space-y-4">
                    {selectedNode?.badges && selectedNode.badges.length > 0 && (
                      <div>
                        <div className="text-[9px] font-bold text-text-tertiary mb-2 uppercase tracking-widest">
                          {language === 'zh' ? '相关文号元数据' : 'Metadata Context'}
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                            {selectedNode.badges.map((b: string) => (
                              <span key={b} className="text-[9px] font-bold text-bg-dark bg-white border border-[#D8DEE8] px-2 py-0.5 rounded-sm">{b}</span>
                            ))}
                        </div>
                      </div>
                    )}
                    
                    {selectedNode?.evidence_refs && selectedNode.evidence_refs.length > 0 && (
                      <div>
                         <div className="text-[9px] font-bold text-text-tertiary mb-2 uppercase tracking-widest">
                           {language === 'zh' ? '关联合规审计证据链' : 'Evidence Linkage'}
                         </div>
                         <div className="space-y-2">
                            {selectedNode.evidence_refs.map((ref: string) => (
                              <button 
                                key={ref} 
                                onClick={() => {
                                  if (ref === 'SRC-31') navigate('/attribution/workflow');
                                  if (ref === 'SRC-21') navigate('/audit/report');
                                }}
                                className="w-full flex items-center justify-between p-2.5 bg-white border border-[#D8DEE8] hover:border-[#1570EF] hover:bg-[#1570EF]/5 transition-all group rounded-sm"
                              >
                                <div className="flex items-center gap-3">
                                   <Zap size={14} className="text-[#1570EF]" />
                                   <span className="text-[11px] font-bold text-bg-dark uppercase tracking-tight">{ref} {language === 'zh' ? '核定铁证物证大表' : 'Source Document'}</span>
                                </div>
                                <ChevronRight size={14} className="text-text-tertiary group-hover:text-[#1570EF] transition-colors" />
                              </button>
                            ))}
                         </div>
                      </div>
                    )}
                 </div>

                 {selectedNode?.ai_flag && (
                   <div className="p-4 bg-[#1570EF]/5 border border-[#1570EF]/20 rounded-sm">
                      <div className="flex items-center gap-2 mb-2 text-[#1570EF]">
                         <Zap size={16} fill="currentColor" />
                         <span className="text-[10px] font-bold uppercase tracking-[0.1em]">
                           {language === 'zh' ? '大模型高置信辅助认定' : 'AI-Inferred Verification'}
                         </span>
                      </div>
                      <p className="text-[11px] text-text-secondary leading-normal">
                         {language === 'zh' ? '由边缘联合大语言专家系统穿刺判定。结合了海关吞吐、电力阶跃跳涨及相似案例库逻辑，在去向拓扑上完全排斥了中介机构的虚假口径。' : 'Non-linear validation checked with deep reasoning matrix models. Flagged based on power deviations and export discrepancies.'}
                      </p>
                   </div>
                 )}
              </div>

              <div className="p-6 border-t border-[#D8DEE8] grid grid-cols-2 gap-3 shrink-0">
                 <button className="h-10 bg-white border border-[#D8DEE8] text-bg-dark text-[10px] font-bold uppercase tracking-widest hover:bg-bg-secondary flex items-center justify-center gap-2 rounded-sm transition-all">
                    <Download size={14} /> {language === 'zh' ? '导出凭证公文' : 'Export'}
                 </button>
                 <button 
                   onClick={() => navigate('/audit/report')}
                   className="h-10 bg-bg-dark text-white text-[10px] font-bold uppercase tracking-widest hover:opacity-90 flex items-center justify-center gap-2 rounded-sm transition-all"
                 >
                    <FileText size={14} /> {language === 'zh' ? '完整电子案卷' : 'Full Report'}
                 </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Calculating overlay */}
      <AnimatePresence>
         {isApplying && (
           <motion.div 
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             exit={{ opacity: 0 }}
             className="absolute inset-0 bg-white/40 backdrop-blur-[2px] pointer-events-none z-[110] flex items-center justify-center"
           >
              <motion.div 
                animate={{ scale: [0.95, 1.05, 1] }} 
                className="bg-bg-dark p-8 shadow-2xl rounded-lg border-2 border-status-success flex flex-col items-center gap-4"
              >
                 <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}>
                    <Zap size={40} className="text-status-success" fill="currentColor" />
                 </motion.div>
                 <div className="text-center">
                    <div className="text-[16px] font-bold text-white uppercase tracking-widest mb-1">
                      {language === 'zh' ? '重构仿真演练路线中' : 'Applying Strategy'}
                    </div>
                    <div className="text-[12px] text-status-success font-bold uppercase font-mono tracking-tighter">
                      {language === 'zh' ? '正在重构二维泳道流向矩阵...' : 'Recalculating Matrix Vectors...'}
                    </div>
                 </div>
              </motion.div>
           </motion.div>
         )}
      </AnimatePresence>
    </div>
  );
}
