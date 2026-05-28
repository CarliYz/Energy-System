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

export default function ProjectLifecycleAudit() {
  const navigate = useNavigate();
  const { language } = useLanguage();

  const isZh = language === 'zh';
  const t = (en: string, zh: string) => (isZh ? zh : en);

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
                        {colIdx + 1}. {info.nameCn}
                      </div>
                      <div className="text-[9px] text-text-tertiary uppercase truncate max-w-[100px] mt-0.5 tracking-tight">
                        {info.nameEn}
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
                        {laneInfo.nameCn}
                      </div>
                      <div className="text-[9.5px] text-text-tertiary font-bold tracking-tight uppercase font-mono mt-0.5">
                        {laneInfo.nameEn}
                      </div>

                      <div className="text-[9px] text-text-tertiary leading-normal mt-3 font-normal">
                        {laneInfo.orgCn}
                      </div>
                      <div className="text-[8px] text-text-tertiary font-mono italic leading-none mt-0.5">
                        {laneInfo.orgEn}
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
                                    {node.title}
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
                  {activeNode.title}
                </h2>
                <p className="text-[11px] text-text-secondary font-medium uppercase tracking-tight mt-1">
                  {activeNode.projectName} · {activeNode.date}
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
                          {ev.action}
                        </p>
                        <p className="text-[9.5px] text-text-tertiary tracking-tight font-mono">
                          {t('Operator: ', '操作归属方: ')}{ev.owner}
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
                            {ent.nameCn}
                          </p>
                          <p className="text-[9.5px] text-text-tertiary font-mono tracking-tight uppercase leading-none mt-1">
                            {ent.role} · {ent.id}
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
                    {activeNode.documents.map((doc, docIdx) => (
                      <div key={docIdx} className="flex items-center justify-between py-1.5 px-2 border-b last:border-0 border-slate-100 last:pb-0">
                        <div className="min-w-0">
                          <p className="text-[11px] font-bold text-bg-dark truncate max-w-[280px]">
                            📄 {doc.name}
                          </p>
                          <p className="text-[8.5px] text-text-tertiary font-mono uppercase tracking-[0.05em] leading-normal uppercase">
                            SHA-256: {doc.hash}
                          </p>
                        </div>
                        <button 
                          onClick={() => alert(t(`Simulating raw file transfer for: ${doc.name}`, `正在从中央电子资料库解密抓取文件: ${doc.name}`))}
                          className="text-[9.5px] text-violet-600 hover:text-violet-800 font-bold border border-violet-200 bg-violet-50 px-1.5 rounded"
                        >
                          {t('Preview', '查看')}
                        </button>
                      </div>
                    ))}
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
                            <span className="text-bg-dark font-semibold truncate" title={flow.from}>{flow.from}</span>
                            <span className="text-text-tertiary shrink-0">→</span>
                            <span className="text-bg-dark font-semibold truncate" title={flow.to}>{flow.to}</span>
                          </div>
                          <span className={cn(
                            "font-black tracking-tight shrink-0 text-right ml-2 text-[11px]",
                            flow.amount.includes('逾期') ? 'text-status-critical' : 'text-[#2FA862]'
                          )}>
                            {flow.amount}
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
                      <p className="text-[13px] font-black text-bg-dark leading-none mt-1.5">{activeNode.riskLevel}</p>
                    </div>
                    <div className="bg-slate-50 border border-[#D8DEE8] p-2 rounded">
                      <p className="text-[8px] text-text-tertiary uppercase font-black leading-none">{t('SLA WINDOW', 'SLA 剩余')}</p>
                      <p className="text-[10px] font-black text-bg-dark leading-none mt-1.5 truncate">{activeNode.slaRemaining}</p>
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
                    <p className="text-[11px] leading-relaxed text-slate-850 font-medium">
                      {activeNode.aiInsight}
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
