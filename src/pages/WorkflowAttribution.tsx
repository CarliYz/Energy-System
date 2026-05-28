import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { select } from 'd3-selection';
import { zoom, zoomIdentity } from 'd3-zoom';
import { motion, AnimatePresence } from 'motion/react';
import {
  ShieldCheck, ArrowLeft, FileText, X, FileCheck, Search, Gavel, Wrench,
  Building2, Users, Receipt, History, Activity, Network, ExternalLink, Download,
  Check, Play, Layers, Cog, HelpCircle, ZoomIn, ZoomOut, Maximize, Lock, Unlock,
  ChevronRight, AlertTriangle, AlertCircle, Info, FileSpreadsheet, Send, HelpCircle as QuestionIcon
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { useLanguage } from '../components/LanguageContext';
import { ATTRIBUTION_DATA } from '../data/attribution/case_001_attribution';
import {
  COMMERCIAL_DB, searchEnterprises, findEnterpriseById,
  type CommercialRecord
} from '../data/commercial/enterprise_db';
import { EnterpriseDetailDrawer } from '../components/EnterpriseDetailDrawer';
import { enterpriseKB } from '../data/commercial/enterprise_kb';

export default function WorkflowAttribution() {
  const { language } = useLanguage();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'overview' | 'workflow'>('overview');
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);

  // Commercial KB drawer + Enterprise Search
  const [drawerEntId, setDrawerEntId] = useState<string | null>(null);
  const [searchQ, setSearchQ] = useState('');
  const [showSuggest, setShowSuggest] = useState(false);

  // Workflow canvas state
  const [zoomLock, setZoomLock] = useState(false);
  const [canvasMode, setCanvasMode] = useState<'pan' | 'select'>('select');
  const [historyPointer, setHistoryPointer] = useState(1); // Mock undo/redo

  const searchResults = useMemo(() => searchEnterprises(searchQ).slice(0, 10), [searchQ]);
  const tLabel = (en: string, zh: string) => (language === 'zh' ? zh : en);

  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    if (hash === 'overview' || hash === 'workflow') setActiveTab(hash as any);
  }, []);

  const handleTabChange = (tab: 'overview' | 'workflow') => {
    setActiveTab(tab);
    window.location.hash = tab;
  };

  const openDrawerFor = (entId: string) => {
    setDrawerEntId(entId);
  };

  // ============================================================================
  // TAB B — d3-zoom Setup
  // ============================================================================
  const containerRef = useRef<HTMLDivElement>(null);
  const zoomGRef = useRef<HTMLDivElement>(null);
  const [zoomState, setZoomState] = useState({ x: 0, y: 0, k: 0.85 });
  const zoomBehaviorRef = useRef<any>(null);

  useEffect(() => {
    if (activeTab !== 'workflow' || !containerRef.current || !zoomGRef.current) return;

    const container = select(containerRef.current);
    const zoomBeh = zoom<HTMLDivElement, unknown>()
      .scaleExtent([0.4, 3])
      .on('zoom', (event) => {
        if (zoomLock) return;
        setZoomState({
          x: event.transform.x,
          y: event.transform.y,
          k: event.transform.k,
        });
      });

    zoomBehaviorRef.current = zoomBeh;
    container.call(zoomBeh);

    // Initial positioning to center the DAG nicely
    container.call(zoomBeh.transform, zoomIdentity.translate(40, 20).scale(0.8));

    const handleKeyDown = (e: KeyboardEvent) => {
      if (document.activeElement?.tagName === 'INPUT') return;
      if (e.key === '=' || e.key === '+') {
        container.transition().duration(150).call(zoomBeh.scaleBy as any, 1.15);
      } else if (e.key === '-') {
        container.transition().duration(150).call(zoomBeh.scaleBy as any, 0.85);
      } else if (e.key === '0') {
        container.transition().duration(150).call(zoomBeh.transform, zoomIdentity.translate(40, 20).scale(0.8));
      } else if (e.key === 'f' || e.key === 'F') {
        container.transition().duration(150).call(zoomBeh.transform, zoomIdentity.translate(10, 10).scale(0.75));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      container.on('.zoom', null);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeTab, zoomLock]);

  const handleZoom = (direction: 'in' | 'out' | 'fit') => {
    if (!containerRef.current || !zoomBehaviorRef.current) return;
    const container = select(containerRef.current);
    if (direction === 'in') {
      container.transition().duration(200).call(zoomBehaviorRef.current.scaleBy, 1.25);
    } else if (direction === 'out') {
      container.transition().duration(200).call(zoomBehaviorRef.current.scaleBy, 0.8);
    } else {
      container.transition().duration(200).call(zoomBehaviorRef.current.transform, zoomIdentity.translate(40, 20).scale(0.8));
    }
  };

  // ============================================================================
  // TAB A — OVERVIEW Data Configurations
  // ============================================================================
  const identityNodes = [
    { id: 'GEN', title_en: "GENERATION TRUTH", title_zh: "发电机组出线核定端 (物理基线)", sub_en: "AI baseline · 102 MW", sub_zh: "自适应稳态物理基线 · 102 MW", val: "102", accent: "#2D6CDF", status_en: "CORE", status_zh: "主核准物理源", x: 404, y: 140, w: 180, h: 58 },
    { id: 'FUEL', title_en: "FUEL GAS · UNG", title_zh: "燃气输入口径 · 乌岑燃气", sub_en: "implied 111 / submitted 96", sub_zh: "实际消耗 111 / 申报 96万立方", val: "-13.5%", accent: "#E89518", status_en: "WARN", status_zh: "消耗低报偏离", x: 160, y: 255, w: 200, h: 58 },
    { id: 'EMIT', title_en: "EMISSIONS · MOE", title_zh: "碳流监控口径 · 生态部", sub_en: "expected 115 / disclosed 92", sub_zh: "测算排碳 115 / 申报 92 吨", val: "-20.0%", accent: "#D8454C", status_en: "CRITICAL", status_zh: "温室漏排高危", x: 640, y: 255, w: 200, h: 58 },
    { id: 'SCADA', title_en: "SCADA MWh · KEGOC", title_zh: "电网关口电表 · KEGOC", sub_en: "logged 118 / expected 102", sub_zh: "SCADA 实测 118 / 物理测定 102", val: "+15.7%", accent: "#E89518", status_en: "WARN", status_zh: "超限出力波动", x: 160, y: 22, w: 200, h: 58 },
    { id: 'DISP', title_en: "DISPATCH · SO", title_zh: "调峰调度口径 · 系统操作员", sub_en: "declared 121 / expected 103", sub_zh: "申调度量 121 / 核定生产 103", val: "+17.5%", accent: "#E89518", status_en: "WARN", status_zh: "超规划负荷", x: 640, y: 22, w: 200, h: 58 },
    { id: 'FIN', title_en: "FINANCE INV", title_zh: "财税及金税开票端 (销项单)", sub_en: "billed 126 / expected 104", sub_zh: "金税销售 126 / 生产核准 104", val: "+21.2%", accent: "#D8454C", status_en: "CRITICAL", status_zh: "财物实物严重倒挂", x: 840, y: 140, w: 154, h: 58 },
    { id: 'PERMIT', title_en: "PERMIT CAP", title_zh: "装机牌照额度 · 能源监察", sub_en: "cap 100 / util 118", sub_zh: "核准容量 100 / 实作 118 MW", val: "+18.0%", accent: "#D8454C", status_en: "CRITICAL", status_zh: "无照超出力违法", x: 18, y: 140, w: 154, h: 58 },
    { id: 'ENT', title_en: "ENT-KZ-AKT-0091 · Western Caspian Energy LLC", title_zh: "ENT-KZ-AKT-0091 · 里海西部能源动力责任有限公司", sub_en: "Subject Enterprise Entity", sub_zh: "主监管审计关联民营企业法人", val: "INFO", accent: "#0F1722", status_en: "TARGET", status_zh: "被诉高危主体", x: 360, y: 342, w: 290, h: 28 }
  ];

  const identityEdges = [
    { from: 'GEN', to: 'FUEL', label_en: 'Eq-1 heat-rate', label_zh: 'Eq-1 综合气耗基线', val: '-13.5%', color: '#E89518', weight: 1.8, dashed: false, curve: 0 },
    { from: 'FUEL', to: 'EMIT', label_en: 'Eq-2 carbon factor', label_zh: 'Eq-2 煤气比排碳系数', val: '-20.0%', color: '#D8454C', weight: 2.0, dashed: false, curve: 0 },
    { from: 'GEN', to: 'EMIT', label_en: 'Eq-3 expected CO₂', label_zh: 'Eq-3 机组能效期望排碳', val: '-20.0%', color: '#D8454C', weight: 2.0, dashed: true, curve: -0.22 },
    { from: 'GEN', to: 'SCADA', label_en: 'Eq-4 dispatch↔SCADA', label_zh: 'Eq-4 发电电网遥测残差', val: '+15.7%', color: '#E89518', weight: 1.6, dashed: false, curve: 0 },
    { from: 'GEN', to: 'DISP', label_en: 'Eq-5 dispatch parity', label_zh: 'Eq-5 调度发受端物理平衡', val: '+17.5%', color: '#E89518', weight: 1.6, dashed: false, curve: 0 },
    { from: 'GEN', to: 'FIN', label_en: 'Eq-6 tariff × MW', label_zh: 'Eq-6 金税售电单价稽算', val: '+21.2%', color: '#D8454C', weight: 2.0, dashed: false, curve: 0 },
    { from: 'GEN', to: 'PERMIT', label_en: 'Eq-7 cap vs util', label_zh: 'Eq-7 环评发证装机超负荷', val: '+18.0%', color: '#D8454C', weight: 1.9, dashed: false, curve: 0 },
    { from: 'ENT', to: 'GEN', label_en: 'reports to', label_zh: '名义隶属/财务合并关系', val: '100%', color: '#6A7686', weight: 1.0, dashed: true, curve: 0 }
  ];

  const matrixRows = [
    {
      id: "SYS-01",
      system_en: "PERMIT CAPACITY · eq-01",
      system_zh: "装机许可上限额度 · PERMIT",
      expect: "100.00 MW",
      report: "118.00 MW",
      delta: "+18.0%",
      severity: 0.9,
      route_en: "ESCALATE",
      route_zh: "严厉追责",
      trace: [1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3]
    },
    {
      id: "SYS-02",
      system_en: "SCADA MWh · eq-02",
      system_zh: "KEGOC关口电网计量 · SCADA",
      expect: "102.00 MW",
      report: "118.00 MW",
      delta: "+15.7%",
      severity: 0.8,
      route_en: "VERIFY",
      route_zh: "特巡稽查",
      trace: [1, 1, 1, 2, 2, 2, 2, 2, 3, 2, 2, 3]
    },
    {
      id: "SYS-03",
      system_en: "DISPATCH POWER · eq-03",
      system_zh: "国家电力调峰指令 · DISPATCH",
      expect: "103.00 MW",
      report: "121.00 MW",
      delta: "+17.5%",
      severity: 0.85,
      route_en: "VERIFY",
      route_zh: "特巡稽查",
      trace: [1, 1, 2, 2, 2, 2, 1, 2, 3, 2, 3, 3]
    },
    {
      id: "SYS-04",
      system_en: "FUEL GAS INPUT · eq-04",
      system_zh: "自然气输入流量测定 · FUEL-GAS",
      expect: "111.00 MMcm",
      report: "96.00 MMcm",
      delta: "-13.5%",
      severity: 0.7,
      route_en: "VERIFY",
      route_zh: "特巡稽查",
      trace: [1, 1, 2, 1, 1, 2, 2, 1, 2, 2, 2, 3]
    },
    {
      id: "SYS-05",
      system_en: "CARBON EMISSIONS · eq-05",
      system_zh: "在线连续烟气排碳监控 · EMISSIONS",
      expect: "115.00 T",
      report: "92.00 T",
      delta: "-20.0%",
      severity: 1.0,
      route_en: "ESCALATE",
      route_zh: "严厉追责",
      trace: [1, 1, 1, 1, 2, 2, 2, 2, 3, 2, 3, 3]
    },
    {
      id: "SYS-06",
      system_en: "FINANCE INVOICE · eq-06",
      system_zh: "外销合同与金税专票总额 · BILLINGS",
      expect: "104.00 BN KZT",
      report: "126.00 BN KZT",
      delta: "+21.2%",
      severity: 1.0,
      route_en: "ESCALATE",
      route_zh: "严厉追责",
      trace: [1, 1, 1, 2, 2, 2, 2, 3, 3, 2, 3, 3]
    }
  ];

  // TAB B — Workflow Sidebar items
  const sidebarCategories = [
    {
      title_en: "Core System Ingestors",
      title_zh: "数据捕获引擎",
      items: [
        { name_en: "SCADA Ingestion Node", name_zh: "SCADA 高频数据接入" },
        { name_en: "Audit Ledger Parser", name_zh: "发票账目审计解析" },
        { name_en: "Customs Decl Ingest", name_zh: "报关仓储吞吐接入" }
      ]
    },
    {
      title_en: "Validators & Filters",
      title_zh: "验证过滤算子",
      items: [
        { name_en: "Schema Structure Guard", name_zh: "格式边界安全性校验" },
        { name_en: "Outlayer Telemetry Filter", name_zh: "时序奇异点物理剔除" },
        { name_en: "Cross-Scale Dedup/Join", name_zh: "跨级异构多路去重关联" }
      ]
    },
    {
      title_en: "Inference Specialized Models",
      title_zh: "专业判定机",
      items: [
        { name_en: "Boiler Heat-rate Solver", name_zh: "锅炉气耗基值计算" },
        { name_en: "EM emission Predictor", name_zh: "烟道反排能耗评估" },
        { name_en: "Bayesian Belief Ensemble", name_zh: "贝叶斯多维度合流演进" }
      ]
    }
  ];

  // Tab B - Col D & E detailed month trace state
  const computeAgents = [
    { id: 'HR', name_en: 'Heat-rate Agent (SYS-04)', name_zh: '乌岑气耗智能判定体', severity: 'AMBER', status_en: 'WARN', status_zh: '轻度亏气', trace: [0,0,1,0,1,2,3,2,2,1,2,3] },
    { id: 'CB', name_en: 'Emissions Carbon Agent (SYS-05)', name_zh: '低碳烟度分析智能体', severity: 'RED', status_en: 'CRITICAL', status_zh: '高危漏排', trace: [0,0,1,1,2,2,2,2,3,2,2,3] },
    { id: 'TF', name_en: 'Tariff Billing Agent (SYS-06)', name_zh: '金税单价测算智能体', severity: 'RED', status_en: 'CRITICAL', status_zh: '倒挂红区', trace: [0,0,0,1,1,2,2,3,3,2,3,3] },
    { id: 'CP', name_en: 'Capacity Overload Agent (SYS-01)', name_zh: '装机超负荷研判智能体', severity: 'RED', status_en: 'CRITICAL', status_zh: '严重超规', trace: [0,0,0,0,1,1,1,1,1,1,1,1] },
    { id: 'DP', name_en: 'Dispatch Grid Agent (SYS-03)', name_zh: '网流多极物理反演智能体', severity: 'AMBER', status_en: 'WARN', status_zh: '越限负荷', trace: [0,1,1,1,2,2,2,1,3,2,3,3] }
  ];

  return (
    <div className="flex-1 flex flex-col bg-[#F4F6FA] text-[#1A2330] font-sans overflow-hidden relative select-none">
      
      {/* ===== TOP BAR (40px) ===== */}
      <div className="h-14 border-b border-[#E2E7EF] bg-white flex items-center justify-between px-6 shrink-0 z-50 shadow-sm">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/warning/timeseries')}
            className="flex items-center gap-1.5 text-[#6A7686] hover:text-[#0F1722] pr-3 border-r border-[#E2E7EF] text-[11px] font-bold transition-all">
            <ArrowLeft size={13} />
            <span>{tLabel('Back to Time-Series', '返回时序建模')}</span>
          </button>
          <span className="text-[12px] font-black uppercase text-[#0F1722] tracking-wider font-mono">
            {tLabel('PAGE 2.2 · CROSS-SYSTEM CONSISTENCY VERIFICATION', '大屏 2.2 · 多套异构系统实物量与财务核定值一致性比对')}
          </span>
        </div>

        {/* INTERACTIVE ENTERPRISE SEARCH SELECTOR */}
        <div className="flex-1 max-w-[340px] mx-6 relative">
          <div className="flex items-center bg-slate-50 border border-[#E2E7EF] rounded h-8 px-2.5 focus-within:border-[#2D6CDF] focus-within:bg-white transition-all shadow-inner">
            <Search size={13} className="text-[#A8B2C0] shrink-0" />
            <input
              value={searchQ}
              onChange={(e) => { setSearchQ(e.target.value); setShowSuggest(true); }}
              onFocus={() => setShowSuggest(true)}
              onBlur={() => setTimeout(() => setShowSuggest(false), 200)}
              placeholder={tLabel('Type LLC Name / BIN / Code to pop 9-dim KB', '搜 LLC 名、法人识别码、行业代码弹出 9 维档案')}
              className="flex-1 bg-transparent border-0 outline-none text-[11px] px-2 placeholder:text-[#A8B2C0] font-mono"
            />
            {searchQ && (
              <button onClick={() => setSearchQ('')} className="text-[#A8B2C0] hover:text-[#0F1722]">
                <X size={12} />
              </button>
            )}
          </div>
          {showSuggest && searchQ && searchResults.length > 0 && (
            <div className="absolute top-9 left-0 right-0 bg-white border border-[#E2E7EF] rounded shadow-2xl z-[100] max-h-[300px] overflow-y-auto animate-fade-in text-[11px]">
              <div className="px-3 py-1.5 text-[8.5px] font-black uppercase text-[#A8B2C0] tracking-wider border-b font-mono">
                {tLabel(`${searchResults.length} matches in 1,247-entity metadata`, `在 1,247 家监管实体数据库中匹配 ${searchResults.length} 条记录`)}
              </div>
              {searchResults.map(r => (
                <div key={r.id}
                  onMouseDown={() => { setDrawerEntId(r.id); setShowSuggest(false); setSearchQ(''); }}
                  className="px-3 py-2 hover:bg-slate-50 cursor-pointer border-b border-slate-50 last:border-0 flex items-center justify-between gap-3 transition-colors">
                  <div className="min-w-0 flex-1">
                    <div className="font-bold text-[#0F1722] truncate">{language === 'zh' ? r.legal_name_zh : r.legal_name_en}</div>
                    <div className="text-[9.5px] text-[#6A7686] font-mono truncate">{r.short_code} · {r.biz_profile.industry_code}</div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={cn("px-1.5 py-0.5 rounded-[2px] text-[8px] font-black font-mono",
                      r.flag === 'RED'   ? 'bg-[#D8454C]/10 text-[#D8454C]' :
                      r.flag === 'AMBER' ? 'bg-[#E89518]/10 text-[#E89518]' :
                                           'bg-[#2FA862]/10 text-[#2FA862]')}>{r.score}</span>
                    <span className="text-[9px] text-[#A8B2C0] font-mono">#{r.reg_scorecard.overall_rank_in_1247}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* TAB BUTTONS (OVERVIEW, AGENT WORKFLOW) */}
        <div className="flex h-9 bg-slate-100 border border-border-default rounded p-0.5 select-none shrink-0 scale-95 shadow-inner">
          <button onClick={() => handleTabChange('overview')}
            className={cn("px-4 py-1 text-[10.5px] font-black rounded uppercase transition-all duration-150 cursor-pointer",
              activeTab === 'overview' ? "bg-white text-[#2D6CDF] shadow-sm font-bold" : "text-[#6A7686] hover:text-[#0F1722]")}>
            {tLabel('Tab Overview', '1. 物理账目交叉验证')}
          </button>
          <button onClick={() => handleTabChange('workflow')}
            className={cn("px-4 py-1 text-[10.5px] font-black rounded uppercase transition-all duration-150 cursor-pointer",
              activeTab === 'workflow' ? "bg-white text-[#2D6CDF] shadow-sm font-bold" : "text-[#6A7686] hover:text-[#0F1722]")}>
            {tLabel('Tab Agent Workflow', '2. 多智能体联合研判拓扑')}
          </button>
        </div>

        {/* STATUS BADGES */}
        <div className="flex items-center gap-2 ml-4">
          <span className="px-2 py-0.5 bg-[#0F1722] text-white text-[8.5px] font-black rounded-sm uppercase tracking-wider font-mono">CASE-2026-001</span>
          <span className="px-2 py-0.5 bg-[#D8454C] text-white text-[8.5px] font-black rounded-sm uppercase tracking-wider font-mono animate-pulse">POSTERIOR 0.87</span>
          <span className="flex items-center gap-1.5 px-2 py-0.5 bg-slate-100 border border-slate-200 text-[#2FA862] text-[8.5px] font-black rounded-sm uppercase tracking-wider font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2FA862] animate-ping" />
            <span>LIVE</span>
          </span>
        </div>
      </div>

      {/* ===== MASTER CONTAINER WITH INLINE TABS ===== */}
      <div className="flex-1 flex overflow-hidden">
        
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div 
              key="overview"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="flex-1 p-5 overflow-y-auto space-y-5 custom-scrollbar"
            >
              {/* === LAYOUT ROW 1: IDENTITY GRAPH & RECONCILIATION MATRIX === */}
              <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-5 items-stretch min-h-[440px]">
                
                {/* --- 2.1 IDENTITY GRAPH PANEL --- */}
                <div className="bg-white border border-[#E2E7EF] rounded shadow-sm p-4 relative flex flex-col justify-between overflow-hidden">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 z-10">
                    <div>
                      <h2 className="text-[12px] font-black uppercase text-[#0F1722] tracking-wider font-mono">
                        {tLabel('IDENTITY GRAPH · PHYSICAL RECONCILIATION', '图谱层：物理流量自相矛盾多口径异常核准关系网图')}
                      </h2>
                      <p className="text-[9.5px] text-[#6A7686] font-mono mt-0.5">
                        {tLabel('6 source systems · 7 physical identities · breach edges weighted by deviation', '6重系统口径交叉核实 · 红色箭头代表偏差超过18%的违约漏报瞒报行为')}
                      </p>
                    </div>
                    <div className="flex gap-2 text-[8px] font-mono font-black shrink-0">
                      <span className="bg-[#D8454C]/10 text-[#D8454C] border border-[#D8454C]/25 px-1.5 py-0.5 rounded">CRITICAL</span>
                      <span className="bg-[#E89518]/10 text-[#E89518] border border-[#E89518]/25 px-1.5 py-0.5 rounded">WARN</span>
                    </div>
                  </div>

                  {/* SVG CONNECTORS MATRIX */}
                  <div className="flex-1 relative mt-3 select-none" style={{ height: '372px' }}>
                    <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
                      <defs>
                        <marker id="arrow" viewBox="0 0 10 10" refX="17.5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                          <path d="M 0 0 L 10 5 L 0 10 z" fill="#A8B2C0" />
                        </marker>
                        <marker id="arrowamber" viewBox="0 0 10 10" refX="17.5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                          <path d="M 0 0 L 10 5 L 0 10 z" fill="#E89518" />
                        </marker>
                        <marker id="arrowred" viewBox="0 0 10 10" refX="17.5" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto-start-reverse">
                          <path d="M 0 0 L 10 5 L 0 10 z" fill="#D8454C" />
                        </marker>
                      </defs>

                      {/* Render defined graph links */}
                      {identityEdges.map((edge, idx) => {
                        const fromNode = identityNodes.find(n => n.id === edge.from);
                        const toNode = identityNodes.find(n => n.id === edge.to);
                        if (!fromNode || !toNode) return null;

                        // Center offsets
                        const x1 = fromNode.x + fromNode.w / 2;
                        const y1 = fromNode.y + fromNode.h / 2;
                        const x2 = toNode.x + toNode.w / 2;
                        const y2 = toNode.y + toNode.h / 2;

                        // Draw path depending on curve flag
                        let pathD = `M ${x1} ${y1} L ${x2} ${y2}`;
                        let midX = (x1 + x2) / 2;
                        let midY = (y1 + y2) / 2;

                        if (edge.curve !== 0) {
                          const dx = x2 - x1;
                          const dy = y2 - y1;
                          const len = Math.sqrt(dx * dx + dy * dy);
                          const ux = -dy / len;
                          const uy = dx / len;
                          const offsetDist = len * edge.curve;
                          const cx = midX + ux * offsetDist;
                          const cy = midY + uy * offsetDist;
                          pathD = `M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`;
                          // Quadratic curve midpoint
                          midX = 0.25 * x1 + 0.5 * cx + 0.25 * x2;
                          midY = 0.25 * y1 + 0.5 * cy + 0.25 * y2;
                        }

                        // Determine marker based on color
                        const marker = edge.color === '#D8454C' ? 'url(#arrowred)' :
                                      edge.color === '#E89518' ? 'url(#arrowamber)' : 'url(#arrow)';

                        return (
                          <g key={idx}>
                            <path
                              d={pathD}
                              stroke={edge.color}
                              strokeWidth={edge.weight}
                              fill="none"
                              strokeDasharray={edge.dashed ? "4,4" : undefined}
                              markerEnd={marker}
                              className={cn(edge.color === '#D8454C' ? 'line-flow-animation' : '')}
                            />
                            {edge.val !== '—' && (
                              <g transform={`translate(${midX}, ${midY})`}>
                                <rect x="-24" y="-8.5" width="48" height="17" rx="3" fill="#FFFFFF" stroke={edge.color} strokeWidth="0.6" />
                                <text textAnchor="middle" y="3.2" className="text-[8.5px] font-black font-mono select-none" fill={edge.color}>{edge.val}</text>
                              </g>
                            )}
                          </g>
                        );
                      })}
                    </svg>

                    {/* Nodes Render absolute inside */}
                    {identityNodes.map((node) => (
                      <div
                        key={node.id}
                        onClick={() => openDrawerFor('ENT-KZ-AKT-0091')}
                        style={{ left: `${node.x}px`, top: `${node.y}px`, width: `${node.w}px`, height: `${node.h}px` }}
                        className="absolute bg-white rounded border border-[#E2E7EF] hover:border-[#2D6CDF] shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between p-1.5 z-10 select-none group"
                      >
                        {/* Accent top stripe */}
                        <div className="absolute top-0 left-0 bottom-0 w-1 rounded-l" style={{ backgroundColor: node.accent }} />
                        
                        <div className="flex items-start justify-between gap-1.5 pl-1.5">
                          <div className="min-w-0">
                            <div className="text-[8.5px] font-black text-[#0F1722] font-mono leading-none group-hover:text-[#2D6CDF] transition-colors truncate">
                              {language === 'zh' ? node.title_zh : node.title_en}
                            </div>
                            <div className="text-[7.5px] text-[#6A7686] font-mono mt-0.5 leading-none truncate">
                              {language === 'zh' ? node.sub_zh : node.sub_en}
                            </div>
                          </div>
                          {node.val && (
                            <span 
                              className="text-[9.5px] font-mono font-black shrink-0 px-1 rounded-[2px]" 
                              style={{ color: node.accent, backgroundColor: `${node.accent}12` }}
                            >
                              {node.val}
                            </span>
                          )}
                        </div>

                        {node.status_en && (
                          <div className="flex items-center gap-1 pl-1.5 text-[6.5px] font-black tracking-wider uppercase font-mono mt-1 select-none text-[#6A7686]">
                            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: node.accent }} />
                            <span>{language === 'zh' ? node.status_zh : node.status_en}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* LEGEND STRIP */}
                  <div className="h-7 border-t border-slate-100 flex items-center justify-around text-[8px] font-black uppercase tracking-wider font-mono text-[#6A7686] select-none bg-slate-50 mt-1 z-10 px-4 rounded-b">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-1 bg-[#D8454C] rounded-sm" />
                      {tLabel('CRITICAL ≥ 18%', '红色重大差异瞒报 (偏离 ≥ 18%)')}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-1 bg-[#E89518] rounded-sm" />
                      {tLabel('WARN 10–18%', '橙色偏离预警范围 (偏离 10-18%)')}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-1 bg-[#2AB3A6] rounded-sm" />
                      {tLabel('MILD 5-10%', '青色轻微实测漂移 (偏离 5-10%)')}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-1 bg-[#2FA862] rounded-sm" />
                      {tLabel('OK < 5%', '绿色物理测量公差 (偏离 < 5%)')}
                    </span>
                  </div>
                </div>

                {/* --- 2.2 RECONCILIATION MATRIX --- */}
                <div className="bg-white border border-[#E2E7EF] rounded shadow-sm p-4 flex flex-col justify-between">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div>
                      <h2 className="text-[12px] font-black uppercase text-[#0F1722] tracking-wider font-mono">
                        {tLabel('RECONCILIATION MATRIX', '口径差交叉审计矩阵 (SCADA 物理测点 ↔ 金税及海关系统审计线索)')}
                      </h2>
                      <p className="text-[9.5px] text-[#6A7686] font-mono mt-0.5">
                        {tLabel('6 columns · expected vs reported · dense analytics matching', '对齐核验：6大核心能源输送口径实测，对立系统发散残差与流转路由')}
                      </p>
                    </div>
                    <span className="px-1.5 py-0.5 bg-slate-100 border text-[#A8B2C0] text-[8.5px] font-black rounded font-mono uppercase tracking-wider scale-90 select-none">DENSE MATRIX</span>
                  </div>

                  {/* MATRIX LIST */}
                  <div className="flex-1 mt-3 space-y-2 select-none">
                    {matrixRows.map((row, idx) => {
                      const isCrit = row.severity >= 0.9;
                      const sevColor = isCrit ? '#D8454C' : row.severity >= 0.75 ? '#E89518' : '#2AB3A6';

                      return (
                        <div 
                          key={row.id} 
                          className={cn(
                            "h-[54px] rounded border px-3 py-1 flex items-center justify-between gap-3 text-[11px] hover:border-slate-300 transition-colors",
                            idx % 2 === 0 ? "bg-[#FAFBFD] border-[#EDF1F6]" : "bg-white border-slate-100"
                          )}
                        >
                          {/* Left System Info */}
                          <div className="w-[180px] shrink-0 min-w-0">
                            <div className="font-mono text-[8px] text-[#A8B2C0] font-black">{row.id}</div>
                            <h3 className="font-bold text-[#0F1722] truncate mt-0.5 leading-none">
                              {language === 'zh' ? row.system_zh.split(' · ')[0] : row.system_en.split(' · ')[0]}
                            </h3>
                            <span className="text-[7.5px] font-mono text-[#6A7686] uppercase tracking-wider block mt-1">
                              {language === 'zh' ? row.system_zh.split(' · ')[1] : row.system_en.split(' · ')[1]}
                            </span>
                          </div>

                          {/* Expect & Report Column */}
                          <div className="w-16 shrink-0 leading-none">
                            <div className="text-[7.5px] text-[#A8B2C0] uppercase tracking-wider font-mono">EXPECT</div>
                            <div className="font-mono font-bold text-[#0F1722] mt-0.5">{row.expect}</div>
                          </div>
                          
                          <div className="w-16 shrink-0 leading-none">
                            <div className="text-[7.5px] text-[#A8B2C0] uppercase tracking-wider font-mono">REPORTED</div>
                            <div className="font-mono font-black text-[#5C6E85] mt-0.5">{row.report}</div>
                          </div>

                          {/* DELTA CHIP */}
                          <div className="w-15 shrink-0 text-right">
                            <span 
                              className="px-1.5 py-0.5 rounded font-mono font-black text-[10.5px]"
                              style={{ color: sevColor, backgroundColor: `${sevColor}12` }}
                            >
                              {row.delta}
                            </span>
                          </div>

                          {/* SEVERITY METER BAR 70px */}
                          <div className="w-[66px] shrink-0">
                            <div className="text-[7px] text-[#A8B2C0] font-mono uppercase tracking-wider leading-none mb-1 text-center">SEVERITY</div>
                            <div className="h-2 bg-slate-150 rounded border border-slate-200 p-px flex items-center">
                              <div className="h-full rounded-sm transition-all" style={{ width: `${row.severity * 100}%`, backgroundColor: sevColor }} />
                            </div>
                          </div>

                          {/* 12-MONTH TRACE PLOTS */}
                          <div className="flex-1 flex items-center justify-around max-w-[210px] px-2 h-full border-l border-slate-100">
                            {row.trace.map((t, i) => {
                              const dotColor = t === 3 ? '#D8454C' : t === 2 ? '#E89518' : t === 1 ? '#2FA862' : '#E2E7EF';
                              return (
                                <div key={i} className="relative flex items-center justify-center shrink-0 w-3 h-3 group cursor-help">
                                  {t === 3 && (
                                    <div className="absolute w-[22px] h-[22px] rounded-full border border-dashed border-[#D8454C]/60 scale-75 animate-spin" style={{ animationDuration: '4s' }} />
                                  )}
                                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: dotColor }} />
                                  
                                  {/* Tooltip on Hover */}
                                  <div className="absolute bottom-5 hidden group-hover:block bg-[#0F1722] text-white text-[8px] font-mono p-1 rounded z-20 whitespace-nowrap leading-none select-none pointer-events-none">
                                    Month {i+1}: {t === 3 ? 'CRITICAL BREACH' : t === 2 ? 'MODERATE DEVIATION' : t === 1 ? 'NOMINAL' : 'UNREPORTED'}
                                  </div>
                                </div>
                              );
                            })}
                          </div>

                          {/* ROUTING ESCALATE CHIP */}
                          <div className="w-20 shrink-0 text-right flex flex-col justify-center">
                            <button 
                              onClick={() => {
                                handleTabChange('workflow');
                                window.scrollTo({ top: 300, behavior: 'smooth' });
                              }}
                              className={cn(
                                "px-2 py-1 text-[8.5px] font-black uppercase rounded tracking-wider transition-colors cursor-pointer text-center",
                                isCrit ? "bg-[#D8454C] hover:bg-[#B3343A] text-white font-mono shadow-sm" : "bg-slate-100 hover:bg-slate-200 text-[#6A7686] font-mono"
                              )}
                            >
                              {language === 'zh' ? row.route_zh : row.route_en}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* === LAYOUT ROW 2: AI CONSOLIDATED FINDINGS (4 CARDS) === */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                
                {/* CARD 1: ROOT CAUSE */}
                <div className="bg-white rounded border border-[#E2E7EF] p-4 flex flex-col justify-between relative shadow-sm card-pulse hover:border-[#D8454C] transition-colors" style={{ color: '#D8454C' }}>
                  <div className="flex items-center justify-between pb-2 border-b border-rose-50 select-none">
                    <span className="text-[9px] font-black uppercase tracking-wider font-mono text-[#6A7686]">{tLabel('PRIMARY ROOT CAUSE', '第一根本案由')}</span>
                    <AlertTriangle size={13} className="text-[#D8454C]" />
                  </div>
                  <div className="py-2.5">
                    <h3 className="text-[14px] font-black text-[#0F1722] font-sans leading-snug">
                      {tLabel('UNREPORTED CAPACITY EXPANSION', '未经审批私自扩建投产')}
                    </h3>
                    <p className="text-[9.5px] text-[#6A7686] font-mono mt-0.5 leading-snug">
                      {tLabel('Unapproved compressor unit actively commissioning', '阿克套往复气相动力二号机组擅建并网')}
                    </p>
                  </div>
                  <div className="text-[9px] font-mono font-black text-[#D8454C] select-none uppercase tracking-wider bg-[#D8454C]/10 py-1 px-2 rounded-sm text-center leading-none">
                    P = 0.87 ENSEMBLE CONFIDENCE
                  </div>
                </div>

                {/* CARD 2: MAGNITUDE */}
                <div className="bg-white rounded border border-[#E2E7EF] p-4 flex flex-col justify-between shadow-sm hover:border-[#E89518] transition-colors">
                  <div className="flex items-center justify-between pb-2 border-b border-amber-50 select-none">
                    <span className="text-[9px] font-black uppercase tracking-wider font-mono text-[#6A7686]">{tLabel('ANOMALOUS OVERLOAD', '超负荷波动强度')}</span>
                    <Activity size={13} className="text-[#E89518]" />
                  </div>
                  <div className="py-2.5">
                    <h3 className="text-[14px] font-black text-[#0F1722] font-sans leading-snug">
                      {tLabel('≈ 16.5% SUSTAINED OVER CLAMP', '实测持续超发违规 16.5%')}
                    </h3>
                    <p className="text-[9.5px] text-[#6A7686] font-mono mt-0.5 leading-snug">
                      {tLabel('+18 MW peak output exceedance detected', '超发 18 MW 出线负荷高频波峰已被锁证')}
                    </p>
                  </div>
                  <div className="text-[9px] font-mono font-black text-[#E89518] select-none uppercase tracking-wider bg-[#E89518]/10 py-1 px-2 rounded-sm text-center leading-none">
                    SEVERE PHYSICAL DEVIATION
                  </div>
                </div>

                {/* CARD 3: FISCAL IMPACT */}
                <div className="bg-white rounded border border-[#E2E7EF] p-4 flex flex-col justify-between relative shadow-sm card-pulse hover:border-[#D8454C] transition-colors" style={{ color: '#D8454C' }}>
                  <div className="flex items-center justify-between pb-2 border-b border-rose-50 select-none">
                    <span className="text-[9px] font-black uppercase tracking-wider font-mono text-[#6A7686]">{tLabel('IMPLIED FISCAL IMPACT', '估算财政逃税额度')}</span>
                    <Receipt size={13} className="text-[#D8454C]" />
                  </div>
                  <div className="py-2.5">
                    <h3 className="text-[14px] font-black text-[#0F1722] font-sans leading-snug">
                      {tLabel('1.24 BN KZT (12M LIABILITY)', '12.4 亿坚戈 (12个月滚动瞒报)')}
                    </h3>
                    <p className="text-[9.5px] text-[#6A7686] font-mono mt-0.5 leading-snug">
                      {tLabel('Estimated natural gas tax-evasion deficit', '对应乌岑气采税金漏缴与多头漏计倒挂差值')}
                    </p>
                  </div>
                  <div className="text-[9px] font-mono font-black text-[#D8454C] select-none uppercase tracking-wider bg-[#D8454C]/10 py-1 px-2 rounded-sm text-center leading-none">
                    HIGH CRITICAL LIABILITY
                  </div>
                </div>

                {/* CARD 4: ACTIONS */}
                <div className="bg-white rounded border border-[#2D6CDF] p-4 flex flex-col justify-between shadow-sm hover:bg-slate-50 transition-colors">
                  <div className="flex items-center justify-between pb-2 border-b border-blue-50 select-none">
                    <span className="text-[9px] font-black uppercase tracking-wider font-mono text-[#6A7686]">{tLabel('AUDIT ACTIONS ESCALATE', '最高安全督办行动')}</span>
                    <Wrench size={13} className="text-[#2D6CDF]" />
                  </div>
                  <div className="py-2.5">
                    <h3 className="text-[14px] font-black text-[#0F1722] font-sans leading-snug">
                      {tLabel('ACTIVATE ESCALATION ROUTE 47', '激活督办法案 47 号执法专线')}
                    </h3>
                    <p className="text-[9.5px] text-[#6A7686] font-mono mt-0.5 leading-snug">
                      {tLabel('Trigger formal multi-agency inquiry', '冻结西里海能源一切未申报容量出厂交易记录')}
                    </p>
                  </div>
                  <div className="text-[9px] font-mono font-black text-[#2D6CDF] select-none uppercase tracking-wider bg-[#2D6CDF]/10 py-1 px-2 rounded-sm text-center leading-none">
                    REQUIRED SLA WITHIN 72H
                  </div>
                </div>

              </div>

              {/* === LAYOUT ROW 3: ANALYST NARRATIVE & QUICK ACTIONS === */}
              <div className="grid grid-cols-1 lg:grid-cols-[1fr_276px] gap-5 items-stretch">
                
                {/* --- ANALYST NARRATIVE --- */}
                <div className="bg-white border border-[#E2E7EF] rounded p-4 flex flex-col justify-between shadow-sm">
                  <div className="flex items-center gap-1.5 pb-2 border-b border-slate-100 select-none sm:pb-3">
                    <FileCheck size={14} className="text-[#2D6CDF]" />
                    <h2 className="text-[12px] font-black uppercase text-[#0F1722] tracking-wider font-mono">
                      {tLabel('ANALYST NARRATIVE · CASE SUMMARY', '主审审计专家 · 案件审计证据线索全景综述')}
                    </h2>
                  </div>

                  <div className="flex-1 mt-4 space-y-4 text-[11px] leading-relaxed">
                    <div className="flex items-start gap-3">
                      <span className="w-16 shrink-0 font-mono font-black text-[#6A7686] uppercase select-none bg-slate-150 py-0.5 px-1.5 text-center text-[9px] rounded-sm">EVIDENCE</span>
                      <p className="text-[#1A2330]">
                        {tLabel(
                          'Primary SCADA power flow reads 118 MW against a strict 100 MW permit ceiling. Simultaneously, primary fuel gas input lags expectations by -13.5%, indicating a massive systemic heat-rate breach or hidden gas bypass pipelines.',
                          '核查关口SCADA发电量实录为 118 MW，严重击穿该企业持有的 100 MW 环评发证装机额度。与此同时，乌岑天然气计入表的读数却离物理能效期望低了 13.5%，表明现场极可能私设地下气阀旁路，形成重度实物漏低报事实。'
                        )}
                      </p>
                    </div>

                    <div className="flex items-start gap-3">
                      <span className="w-16 shrink-0 font-mono font-black text-[#6A7686] uppercase select-none bg-slate-150 py-0.5 px-1.5 text-center text-[9px] rounded-sm">INFERENCE</span>
                      <p className="text-[#1A2330]">
                        {tLabel(
                          'Multiple Bayesian lanes converge. The high-frequency physical anomalies cannot be explained by sensor drift. Covert capacity expansion holds a 0.87 posterior probability with identical repeat offender characteristics.',
                          '六道专家神经网络判定引擎多维度合流。此高频时序物理量的系统性常态越限根本无法由于测点漂移解释。私自未报投产及擅自发电归因置信度高达 0.87 后验贝叶斯算力加权，形态与 2025 年往期处罚记录指纹重合。'
                        )}
                      </p>
                    </div>

                    <div className="flex items-start gap-3">
                      <span className="w-16 shrink-0 font-mono font-black text-[#6A7686] uppercase select-none bg-slate-150 py-0.5 px-1.5 text-center text-[9px] rounded-sm">POLICY</span>
                      <p className="text-[#1A2330]">
                        {tLabel(
                          'Immediate escalation to Ministry of Energy is recommended. Article 47 enforcement should be triggered with an automatic assets audit freeze on Western Caspian Energy within 72 hours.',
                          '建议部长签批，立即启动跨系统联合惩戒。激活 47 号闭环法案指令，外勤执法介入。并抄送生态环保部、税务海关关口进行跨域联合锁定，冻结被诉企业在瞒报期内的售电结转金额。'
                        )}
                      </p>
                    </div>
                  </div>
                </div>

                {/* --- QUICK ACTIONS --- */}
                <div className="bg-white border border-[#E2E7EF] rounded p-4 flex flex-col justify-between shadow-sm">
                  <div className="pb-3 border-b border-slate-100 select-none">
                    <h2 className="text-[12px] font-black uppercase text-[#0F1722] tracking-wider font-mono">
                      {tLabel('AUDIT ACTIONS', '督办处置决策集')}
                    </h2>
                  </div>

                  <div className="flex-1 mt-4 flex flex-col gap-2.5">
                    
                    {/* INITIATE FORMAL CASE */}
                    <button 
                      onClick={() => handleTabChange('workflow')}
                      className="w-full bg-[#0F1722] hover:bg-[#202E3F] text-white border border-[#2D6CDF] rounded px-3 py-2 flex flex-col text-left transition-all shadow cursor-pointer relative overflow-hidden group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-black uppercase tracking-wider font-sans group-hover:text-[#2D6CDF] transition-colors">{tLabel('▶ INITIATE FORMAL CASE', '▶ 提交联合立案督办')}</span>
                        <Play size={10} className="text-[#2D6CDF] animate-pulse" />
                      </div>
                      <span className="text-[8px] font-mono text-[#A8B2C0] mt-0.5 uppercase tracking-wide block">
                        {tLabel('open Agent Workflow tab · CASE-2026-001', '切换至多智能体拓扑深入事实交叉审查')}
                      </span>
                    </button>

                    {/* EXPORT DOSSIER */}
                    <button 
                      onClick={() => alert(tLabel('PDF generation started for Western Caspian...', '西里海整盘证据链审计报告PDF开始生成中...'))}
                      className="w-full bg-white hover:bg-slate-50 border border-[#E2E7EF] rounded px-3 py-2 flex flex-col text-left transition-all cursor-pointer"
                    >
                      <span className="text-[11px] font-bold text-[#0F1722]">{tLabel('⤓ EXPORT EVIDENCE DOSSIER', '⤓ 导出全景定案督办公文')}</span>
                      <span className="text-[8px] font-mono text-[#6A7686] uppercase tracking-wide mt-0.5 block">
                        {tLabel('consolidates identity graphs & ledger matrix', '完整合流：包含SCADA、金税及多路模型推演书')}
                      </span>
                    </button>

                    {/* NOTIFY MoE & KEGOC */}
                    <button 
                      onClick={() => alert(tLabel('Encrypted channel notification pushed to Ministry of Energy + KEGOC System Operator', '加密信道指令已发送至国家能监委与KEGOC电力调度中心'))}
                      className="w-full bg-white hover:bg-slate-50 border border-[#E2E7EF] rounded px-3 py-2 flex flex-col text-left transition-all cursor-pointer"
                    >
                      <span className="text-[11px] font-bold text-[#0F1722]">{tLabel('☷ NOTIFY MoE + KEGOC SECURELY', '☷ 抄送国家环保与电网运营')}</span>
                      <span className="text-[8px] font-mono text-[#6A7686] uppercase tracking-wide mt-0.5 block">
                        {tLabel('secure push via encrypted telemetry bridge', '跨部门协同：直达阿克套属地外勤局及税务所自动建档')}
                      </span>
                    </button>

                    {/* DRAFT MINISTER MEMO */}
                    <button 
                      onClick={() => navigate('/audit/report')}
                      className="w-full bg-white hover:bg-slate-50 border border-[#E2E7EF] rounded px-3 py-2 flex flex-col text-left transition-all cursor-pointer"
                    >
                      <span className="text-[11px] font-bold text-[#0F1722]">{tLabel('✎ DRAFT MINISTER BRIEF', '✎ 起草呈阅公文及呈递报告')}</span>
                      <span className="text-[8px] font-mono text-[#6A7686] uppercase tracking-wide mt-0.5 block">
                        {tLabel('activate AI-assisted minister briefing template', '进入第四幕：由AI模版协助起草正式上呈呈阅书')}
                      </span>
                    </button>

                  </div>
                </div>

              </div>
            </motion.div>
          )}

          {activeTab === 'workflow' && (
            <motion.div 
              key="workflow"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex-1 flex overflow-hidden bg-[#F4F6FA] relative"
            >
              
              {/* --- TAB B SIDEBAR (188px palette) --- */}
              <div className="w-[188px] border-r border-[#E2E7EF] bg-white flex flex-col select-none shrink-0 p-3 overflow-y-auto z-10 custom-scrollbar">
                <div className="pb-2 border-b border-slate-100 flex items-center justify-between mb-3">
                  <span className="text-[9px] font-black uppercase tracking-wider font-mono text-[#6A7686]">{tLabel('OPERATOR TOOlKIT', '模型引擎与过滤算子')}</span>
                  <Layers size={11} className="text-[#A8B2C0]" />
                </div>
                
                <div className="space-y-4">
                  {sidebarCategories.map((cat, ci) => (
                    <div key={ci} className="space-y-1.5">
                      <h4 className="text-[8.5px] font-black text-[#A8B2C0] uppercase tracking-wider font-mono px-1">
                        {language === 'zh' ? cat.title_zh : cat.title_en}
                      </h4>
                      {cat.items.map((item, ii) => (
                        <div 
                          key={ii} 
                          title={tLabel('Drag and drop is simulated in preview model', '双击或拖拽可在此贝叶斯流拓扑上增加动态校正断口')}
                          className="px-2 py-1.5 bg-[#FAFBFD] border border-slate-100 hover:border-[#2D6CDF] rounded-[3px] text-[10px] font-bold text-[#1A2330] cursor-grab active:cursor-grabbing hover:bg-white transition-all flex items-center gap-1.5"
                        >
                          <Cog size={10} className="text-[#2D6CDF]" />
                          <span className="truncate">{language === 'zh' ? item.name_zh : item.name_en}</span>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>

                {/* HELP DOCS STICKY */}
                <div className="mt-8 bg-blue-50/50 border border-blue-100 p-2.5 rounded font-sans text-[10px] leading-relaxed">
                  <div className="flex items-center gap-1.5 font-bold text-[#2D6CDF] mb-1">
                    <Info size={11} />
                    <span>{tLabel('Active Graph Instruction', '操作员须知')}</span>
                  </div>
                  <p className="text-[#5C6E85] text-[9px]">
                    {tLabel('Mouse-wheel or drag-canvas to pan. Specific red connections represent active Bayesian evidence-convergences.', '鼠标滚轮缩放，左键拖拽平移画布。红色流向路线代表当前立案事件中被审计模型强核查锁定（红牌）的高度证据流路径。')}
                  </p>
                </div>
              </div>

              {/* --- TAB B MAIN INTERACTIVE CANVAS --- */}
              <div className="flex-1 flex flex-col overflow-hidden relative">
                
                {/* TOOLBAR FOR ZOOM & PAN MODE IN PORTRAIT BOTTOM-LEFT */}
                <div className="absolute left-4 bottom-4 bg-white/90 backdrop-blur-md border border-[#E2E7EF] p-1.5 rounded-lg shadow-lg z-20 flex flex-col gap-1 select-none">
                  <button onClick={() => handleZoom('in')} title="Zoom In (+)" className="p-1.5 hover:bg-slate-100 rounded text-[#1A2330] hover:text-[#2D6CDF] transition-colors cursor-pointer">
                    <ZoomIn size={14} />
                  </button>
                  <button onClick={() => handleZoom('out')} title="Zoom Out (-)" className="p-1.5 hover:bg-slate-100 rounded text-[#1A2330] hover:text-[#2D6CDF] transition-colors cursor-pointer">
                    <ZoomOut size={14} />
                  </button>
                  <button onClick={() => handleZoom('fit')} title="Center Fit (0)" className="p-1.5 hover:bg-slate-100 rounded text-[#1A2330] hover:text-[#2D6CDF] transition-colors cursor-pointer">
                    <Maximize size={14} />
                  </button>
                  <div className="h-px bg-slate-200 mx-1.5 my-1" />
                  <button 
                    onClick={() => setZoomLock(!zoomLock)} 
                    title={zoomLock ? "Unlock Panning" : "Lock Panning / Pin Coordinates"} 
                    className={cn(
                      "p-1.5 rounded transition-all cursor-pointer",
                      zoomLock ? "bg-[#D8454C]/10 text-[#D8454C] font-black" : "hover:bg-slate-100 text-[#1A2330] hover:text-amber-500"
                    )}
                  >
                    {zoomLock ? <Lock size={14} /> : <Unlock size={14} />}
                  </button>
                </div>

                {/* ZOOMABLE GRID CANVAS WORKSPACE */}
                <div 
                  ref={containerRef}
                  className={cn(
                    "flex-1 bg-[radial-gradient(#E2E7EF_1.1px,transparent_1.1px)] bg-[size:18px_18px] overflow-hidden relative outline-none",
                    canvasMode === 'pan' ? 'cursor-grab active:cursor-grabbing' : 'cursor-default'
                  )}
                >
                  
                  {/* TRANSFORM LAYER */}
                  <div 
                    ref={zoomGRef}
                    style={{ 
                      transform: `translate(${zoomState.x}px, ${zoomState.y}px) scale(${zoomState.k})`,
                      transformOrigin: '0 0'
                    }}
                    className="absolute inset-0 select-none"
                  >
                    
                    {/* SVG GRAPH EMBEDDED CONNECTOR LINES behind cards */}
                    <svg className="absolute top-0 left-0 w-[2000px] h-[900px] pointer-events-none z-0">
                      
                      {/* COLUMN A TO COLUMN B CONNECTIONS */}
                      {[
                        { y1: 52, y2: 206, color: '#A8B2C0', label: 'SCADA Telemetry' },
                        { y1: 118, y2: 206, color: '#A8B2C0', label: 'Dispatch Telemetry' },
                        { y1: 184, y2: 206, color: '#A8B2C0', label: 'Fuel Telemetry' },
                        { y1: 250, y2: 310, color: '#D8454C', label: 'Emission breach', pulse: true },
                        { y1: 316, y2: 310, color: '#D8454C', label: 'Billing discrepancy', pulse: true },
                        { y1: 382, y2: 414, color: '#D8454C', label: 'Permit compliance', pulse: true },
                        { y1: 448, y2: 414, color: '#A8B2C0', label: 'Gen baseline' },
                        { y1: 514, y2: 414, color: '#A8B2C0', label: 'Corp registry' }
                      ].map((link, idx) => (
                        <path 
                          key={`link-ab-${idx}`}
                          d={`M 176 ${link.y1} C 226 ${link.y1}, 226 ${link.y2}, 276 ${link.y2}`} 
                          stroke={link.color} 
                          strokeWidth={link.pulse ? "2.0" : "1.2"} 
                          fill="none" 
                          className={cn(link.pulse ? 'line-flow-animation' : '')}
                        />
                      ))}

                      {/* COLUMN B TO COLUMN C CONNECTIONS */}
                      {[
                        { y1: 206, y2: 430, color: '#2AB3A6', strokeW: '1.6', pulse: true },
                        { y1: 310, y2: 430, color: '#A8B2C0', strokeW: '1.2' },
                        { y1: 414, y2: 430, color: '#A8B2C0', strokeW: '1.2' }
                      ].map((link, idx) => (
                        <path 
                          key={`link-bc-${idx}`}
                          d={`M 416 ${link.y1} C 434 ${link.y1}, 434 ${link.y2}, 452 ${link.y2}`} 
                          stroke={link.color} 
                          strokeWidth={link.strokeW} 
                          fill="none" 
                          className={cn(link.pulse ? 'line-flow-animation' : '')}
                        />
                      ))}

                      {/* COLUMN C TO COLUMN D CONNECTIONS */}
                      {[
                        { y1: 380, y2: 57, color: '#E89518', weight: '1.6' },
                        { y1: 412, y2: 167, color: '#D8454C', weight: '2.0', pulse: true },
                        { y1: 444, y2: 277, color: '#D8454C', weight: '2.0', pulse: true },
                        { y1: 476, y2: 387, color: '#D8454C', weight: '2.0', pulse: true },
                        { y1: 508, y2: 497, color: '#E89518', weight: '1.6' }
                      ].map((link, idx) => (
                        <path 
                          key={`link-cd-${idx}`}
                          d={`M 908 ${link.y1} C 945 ${link.y1}, 945 ${link.y2}, 982 ${link.y2}`} 
                          stroke={link.color} 
                          strokeWidth={link.weight} 
                          fill="none" 
                          className={cn(link.pulse ? 'line-flow-animation' : '')}
                        />
                      ))}

                      {/* COLD AGENTS TO COLE FORWARD STREAMS */}
                      {[57, 167, 277, 387, 497].map((y, idx) => (
                        <g key={`fwd-${idx}`}>
                          {/* ColD right edge x=1152 -> ColE month strip left edge x=1180 */}
                          <line x1="1152" y1={y} x2="1180" y2={y} stroke={idx === 1 || idx === 2 || idx === 3 ? "#D8454C" : "#E89518"} strokeWidth={idx === 1 || idx === 2 || idx === 3 ? "2.0" : "1.3"} />
                        </g>
                      ))}

                      {/* COLE RIGHT EDGES TO COLF MASTER DEPRECIATION */}
                      {[57, 167, 277, 387, 497].map((y, idx) => {
                        const isPrimary = idx === 1 || idx === 2 || idx === 3;
                        return (
                          <g key={`synt-${idx}`}>
                            <path 
                              d={`M 1606 ${y} C 1643 ${y}, 1643 360, 1680 360`} 
                              stroke={isPrimary ? "#D8454C" : "#E89518"} 
                              strokeWidth={isPrimary ? "2.0" : "1.2"} 
                              fill="none"
                              className={cn(isPrimary ? 'line-flow-animation' : '')}
                            />
                          </g>
                        );
                      })}

                      {/* MASTER TO INSPECTOR APPROVAL & END CONSOLE */}
                      {/* Master and Inspector link */}
                      <line x1="1766" y1="270" x2="1766" y2="222" stroke="#D8454C" strokeWidth="2.0" strokeDasharray="4,4" className="line-flow-animation" />
                      
                      {/* Master outputs to final end nodes */}
                      <path d="M 1730 450 C 1730 470, 1710 475, 1710 498" stroke="#2FA862" strokeWidth="1.6" fill="none" />
                      <path d="M 1800 450 C 1800 500, 1820 530, 1820 570" stroke="#0F1722" strokeWidth="1.6" fill="none" />

                    </svg>

                    {/* === COLUMN A: AGENTS · SOURCE === */}
                    <div className="absolute left-[16px] top-[26px] space-y-[14px] select-none z-10 w-[160px]">
                      {[
                        { title: 'Ingest SCADA', system: 'KEGOC Telemetry', tag: 'MWh', status: 'SYS-02' },
                        { title: 'Ingest Dispatch', system: '调峰调度系统发受端', tag: 'MW', status: 'SYS-03' },
                        { title: 'Ingest Fuel Gas', system: '自然气输入压力流速', tag: 'm³', status: 'SYS-04' },
                        { title: 'Ingest Emission', system: '在线连续烟气温排碳', tag: 'CO₂', status: 'SYS-05' },
                        { title: 'Ingest Finance', system: '金税销项开票单', tag: 'KZT', status: 'SYS-06' },
                        { title: 'Ingest Permit', system: '装机环评牌照规定', tag: 'LICENSE', status: 'SYS-01' },
                        { title: 'Ingest Gen Baseline', system: '自适应物理负荷基线', tag: 'GEN', status: 'GEN-BASE' },
                        { title: 'Ingest Corp Profile', system: '穿透股权与UBO数据', tag: 'UBO', status: 'CORP-DB' }
                      ].map((item, idx) => (
                        <div key={idx} className="h-[52px] bg-white border border-[#E2E7EF] hover:border-[#2D6CDF] p-2 rounded shadow-sm flex flex-col justify-between transition-colors">
                          <div className="flex items-center justify-between">
                            <span className="text-[9.5px] font-black font-mono text-[#0F1722] truncate w-[100px]">{language === 'zh' ? (
                              item.title === 'Ingest Gen Baseline' ? '接入发电机组基线' :
                              item.title === 'Ingest Corp Profile' ? '接入客商背景库' :
                              item.title
                            ) : item.title}</span>
                            <span className="text-[7.5px] font-mono bg-slate-100 text-[#6A7686] px-1 rounded uppercase tracking-wider scale-90">{item.tag}</span>
                          </div>
                          <div className="flex items-baseline justify-between mt-1 text-[7.5px] font-mono text-[#A8B2C0]">
                            <span>{item.system}</span>
                            <span className="font-bold text-[#6A7686]">{item.status}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* === COLUMN B: VALIDATORS === */}
                    <div className="absolute left-[276px] top-[72px] space-y-12 select-none z-10 w-[140px]">
                      {/* Amber Note sticky above */}
                      <div className="bg-amber-50/90 border border-amber-200 p-2 text-[8px] leading-snug rounded-sm font-sans text-amber-800 shadow-sm">
                        <span className="font-black uppercase tracking-wider block mb-0.5 font-mono">1. PHYSICAL BASING</span>
                        {tLabel('Validate units, ranges, clock-skew & schema consistency.', '校正对齐多物理量单位、网流时钟偏移偏离与数据格式定义。')}
                      </div>

                      <div className="h-[56px] bg-slate-50 border-2 border-[#2AB3A6] p-2 rounded flex flex-col justify-between hover:bg-white transition-colors relative">
                        <span className="absolute -top-2 left-2 bg-[#2AB3A6] text-white text-[7px] font-black uppercase font-mono px-1.5 rounded-sm">PASS</span>
                        <div className="text-[10px] font-black font-sans text-[#0F1722] leading-tight select-none mt-1">{tLabel('Schema Guard', '多路结构自检')}</div>
                        <div className="text-[7.5px] font-mono text-[#6A7686] uppercase select-none">Units Alignment 100%</div>
                      </div>

                      <div className="h-[56px] bg-slate-50 border border-slate-200 p-2 rounded flex flex-col justify-between hover:border-slate-300 hover:bg-white transition-all">
                        <div className="text-[10px] font-black font-sans text-[#0F1722] leading-tight select-none">{tLabel('Range Check', '测值物理边界校验')}</div>
                        <div className="text-[7.5px] font-mono text-[#6A7686] uppercase select-none">Residual Limits 1Hz</div>
                      </div>

                      <div className="h-[56px] bg-slate-50 border border-slate-200 p-2 rounded flex flex-col justify-between hover:border-slate-300 hover:bg-white transition-all">
                        <div className="text-[10px] font-black font-sans text-[#0F1722] leading-tight select-none">{tLabel('Dedup & Join', '物理网流合并去重')}</div>
                        <div className="text-[7.5px] font-mono text-[#6A7686] uppercase select-none">Join Variance &lt; 0.2%</div>
                      </div>
                    </div>

                    {/* === COLUMN C: CLASSIFIER PANEL === */}
                    <div className="absolute left-[452px] top-[306px] z-10 w-[456px]">
                      {/* Blue Note sticky above */}
                      <div className="bg-blue-50 border border-blue-200 p-2 text-[8.5px] leading-snug rounded-sm font-sans text-blue-800 shadow-sm mb-3">
                        <span className="font-black uppercase tracking-wider block mb-0.5 font-mono">2. CLASSIFICATION & DISPATCH</span>
                        {tLabel('Route by physical identity: heat-rate / carbon / tariff / limit / dispatch.', '根据主审等式识别出的物理矛盾自动分发给其专业审计智能体核心节点。')}
                      </div>

                      {/* CLASSIFIER CONTAINER */}
                      <div className="bg-white border-2 border-[#2D6CDF] rounded shadow-md flex flex-col overflow-hidden">
                        <div className="bg-[#2D6CDF] px-3.5 py-1.5 text-white flex items-center justify-between">
                          <span className="text-[10px] font-black uppercase tracking-wider font-mono">PHYSICAL IDENTITY MATRIX DISPATCHER</span>
                          <Layers size={11} className="text-white/80 animate-pulse" />
                        </div>
                        
                        <div className="p-3.5 space-y-2 text-[10.5px]">
                          {[
                            { route: 'identity == heat_rate', map: 'Eq-1 / Fuel Gas Input', color: '#E89518' },
                            { route: 'identity == carbon_factor', map: 'Eq-2 / Smoke Emissions CO₂', color: '#D8454C' },
                            { route: 'identity == tariff', map: 'Eq-6 / Finance 金税发票开增量', color: '#D8454C' },
                            { route: 'identity == cap_vs_util', map: 'Eq-7 / Permit 装机超容验证', color: '#D8454C' },
                            { route: 'identity == dispatch_match', map: 'Eq-5 / System Operator Dispatch', color: '#E89518' }
                          ].map((b, bi) => (
                            <div key={bi} className="h-6 px-3 bg-slate-50 border border-slate-150 rounded flex items-center justify-between font-mono text-[8.5px] leading-none text-slate-700 hover:bg-slate-100/50 transition-colors">
                              <span className="font-black font-mono" style={{ color: b.color }}>{b.route}</span>
                              <span className="text-[11px] font-bold text-[#6A7686] relative pr-3">
                                <span className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full" style={{ backgroundColor: b.color }} />
                                {b.map}
                              </span>
                            </div>
                          ))}
                        </div>
                        <div className="bg-slate-50 border-t border-slate-150 px-3 py-1 flex justify-between text-[7px] font-black uppercase tracking-wider font-mono text-[#A8B2C0] select-none">
                          <span>CLASSIFICATION THRESHOLD: 100% SLA</span>
                          <span>ONLINE ROUTER ACTIVE</span>
                        </div>
                      </div>
                    </div>

                    {/* === COLUMN D & E: COMPUTE AGENTS & MONTHLY RESULTS === */}
                    <div className="absolute left-[982px] top-[26px] z-10 space-y-12">
                      {computeAgents.map((agent, ai) => {
                        const isPrimary = agent.severity === 'RED';
                        const statusColor = isPrimary ? '#D8454C' : '#E89518';

                        return (
                          <div key={agent.id} className="flex items-center select-none" style={{ height: '62px' }}>
                            
                            {/* Compute Agent Card 170px wide */}
                            <div 
                              onClick={() => setSelectedAgentId(agent.id)}
                              className={cn(
                                "w-[170px] h-full bg-white border rounded p-2 flex flex-col justify-between hover:shadow-md transition-all cursor-pointer",
                                selectedAgentId === agent.id ? "border-2 border-[#2D6CDF] bg-blue-50/10 shadow-sm" : isPrimary ? "border-[#D8454C] border-2 shadow-sm" : "border-[#E2E7EF]"
                              )}
                            >
                              <div className="flex items-center justify-between leading-none">
                                <span className="text-[10px] font-black font-sans text-[#0F1722] truncate w-[110px]">{language === 'zh' ? agent.name_zh : agent.name_en}</span>
                                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: statusColor }} />
                              </div>
                              <div className="flex items-baseline justify-between mt-1 select-none text-[8px] font-mono text-[#6A7686]">
                                <span>SOLVING ENTRANCE</span>
                                <span className="font-black font-mono leading-none rounded px-1" style={{ color: statusColor, backgroundColor: `${statusColor}12` }}>
                                  {language === 'zh' ? agent.status_zh : agent.status_en}
                                </span>
                              </div>
                            </div>

                            {/* Connected Month results strip x=28px gap */}
                            <div className="flex gap-1.5 px-3 py-1 border border-dashed border-slate-250 bg-slate-50/30 rounded ml-7 leading-none">
                              {agent.trace.map((m, mi) => {
                                const mColor = m === 3 ? '#D8454C' : m === 2 ? '#E89518' : m === 1 ? '#2FA862' : '#E2E7EF';
                                return (
                                  <div 
                                    key={mi} 
                                    style={{ backgroundColor: mColor }}
                                    className="w-8 h-8 rounded-sm hover:-translate-y-0.5 transition-transform cursor-help flex items-center justify-center text-[8.5px] font-black font-mono text-white select-none shadow-sm"
                                  >
                                    {(mi + 1).toString().padStart(2, '0')}
                                  </div>
                                );
                              })}
                            </div>

                          </div>
                        );
                      })}
                    </div>

                    {/* === COLUMN F: MASTER & VERDICT === */}
                    <div className="absolute left-[1680px] top-[146px] z-10 space-y-12 select-none w-[172px]">
                      
                      {/* INSPECTOR APPROVAL CARD */}
                      <div className="h-[76px] bg-white border border-[#E2E7EF] p-2.5 rounded shadow flex flex-col justify-between hover:border-slate-350 transition-colors">
                        <div>
                          <span className="text-[7.5px] font-black uppercase text-[#2FA862] font-mono select-none block leading-none">✓ DECISION NODE</span>
                          <h3 className="text-[10.5px] font-black text-[#0F1722] mt-0.5 leading-tight">{tLabel('Inspector Approval', '主管终审批准签章')}</h3>
                          <span className="text-[7px] text-[#6A7686] font-mono leading-none block mt-0.5">{tLabel('Confirm multi-agent audit verdict?', '签批确认各专业联合证据？')}</span>
                        </div>
                        <div className="flex gap-1.5 mt-1">
                          <button onClick={() => alert(tLabel('Joint-Audit case signed & closed.', '联合立案件已签署，正向下级外勤中转'))} className="flex-1 py-1 bg-[#2FA862] text-white text-[8px] font-black rounded uppercase text-center cursor-pointer hover:bg-green-700 transition-colors leading-none">
                            Approve
                          </button>
                          <button onClick={() => alert(tLabel('Verdict returned to Master Agent for recheck', '终审拒绝，退回复审专家神经流中...'))} className="flex-1 py-1 bg-[#D8454C] text-white text-[8px] font-black rounded uppercase text-center cursor-pointer hover:bg-rose-700 transition-colors leading-none">
                            Return
                          </button>
                        </div>
                      </div>

                      {/* MASTER CORE AUDIT CARD */}
                      <div className="bg-white border-2 border-dashed border-[#D8454C] p-3.5 rounded-lg shadow-xl relative animate-pulse" style={{ animationDuration: '3.5s' }}>
                        <span className="absolute -top-2 left-3 bg-[#D8454C] text-white text-[7.5px] font-black uppercase font-mono px-2 rounded-sm leading-none py-0.5 select-none text-center">
                          MASTER COMBINED
                        </span>
                        
                        <div className="text-center py-1 mt-0.5 select-none">
                          <div className="text-[34px] font-black font-mono text-[#D8454C] leading-none select-none">0.87</div>
                          <span className="text-[8px] text-[#6A7686] font-black font-mono tracking-widest block mt-0.5 select-none">POSTERIOR PROBABILITY</span>
                        </div>

                        <div className="border-t border-slate-100 pt-2.5 mt-2 text-[8px] font-mono text-slate-500 leading-snug select-none">
                          <div className="flex justify-between">
                            <span>PRIOR PRI:</span>
                            <span className="font-bold text-[#0F1722]">0.71</span>
                          </div>
                          <div className="flex justify-between mt-1">
                            <span>REVISION DELTA:</span>
                            <span className="font-bold text-[#D8454C]">+0.16 INFERRED</span>
                          </div>
                        </div>

                        <div className="mt-3 py-1 bg-[#FAFBFD] border border-slate-100 text-center font-sans font-black text-[9px] text-[#0F1722] uppercase tracking-wider rounded select-none shadow-inner leading-none">
                          {tLabel('UNREPORTED CAP. EXP', '立案嫌疑：无证擅建')}
                        </div>
                      </div>

                      {/* TWO END NODES */}
                      <div className="space-y-3.5 select-none">
                        <div className="bg-white border-2 border-[#2FA862] px-3.5 py-2.5 rounded shadow-sm text-center hover:bg-green-50/20 transition-colors cursor-pointer">
                          <span className="text-[8px] font-black font-mono text-[#2FA862] uppercase tracking-wider select-none leading-none">□ FINAL END NODE A</span>
                          <h3 className="text-[11px] font-black text-[#0F1722] mt-1 uppercase select-none leading-none">{tLabel('CASE FORMALIZED IN MoE', '立案存档 · 外勤逮捕')}</h3>
                        </div>

                        <div className="bg-white border border-[#0F1722] px-3.5 py-2.5 rounded shadow-sm text-center hover:bg-slate-50 transition-colors cursor-pointer">
                          <span className="text-[8px] font-black font-mono text-[#0F1722] uppercase tracking-wider select-none leading-none">□ FINAL END NODE B</span>
                          <h3 className="text-[11px] font-bold text-slate-600 mt-1 uppercase select-none leading-none">{tLabel('CASE RETRACTED', '漏报驳回 · 结案销档')}</h3>
                        </div>
                      </div>

                    </div>

                  </div>
                </div>

                {/* BOTTOM FLOATING TOOLBAR (centered, 4 icon buttons) */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-md border border-[#E2E7EF] h-12 px-4 rounded-full shadow-lg z-20 flex items-center gap-4 select-none animate-slide-in">
                  <div className="flex items-center gap-1">
                    <button 
                      onClick={() => setCanvasMode('pan')}
                      title="Pan/Hand Mode" 
                      className={cn(
                        "p-2 rounded-full cursor-pointer transition-colors",
                        canvasMode === 'pan' ? 'bg-[#2D6CDF] text-white' : 'hover:bg-slate-100 text-[#6A7686]'
                      )}
                    >
                      ✋
                    </button>
                    <button 
                      onClick={() => setCanvasMode('select')}
                      title="Select/Anchor Mode" 
                      className={cn(
                        "p-2 rounded-full cursor-pointer transition-colors",
                        canvasMode === 'select' ? 'bg-[#2D6CDF] text-white' : 'hover:bg-slate-100 text-[#6A7686]'
                      )}
                    >
                      ▷
                    </button>
                  </div>
                  <div className="w-px h-6 bg-slate-200" />
                  <div className="flex items-center gap-1.5 text-[#6A7686]">
                    <button 
                      onClick={() => historyPointer > 0 && setHistoryPointer(historyPointer-1)}
                      disabled={historyPointer === 0}
                      title="Undo State Revision (Ctrl+Z)" 
                      className="p-1.5 hover:bg-slate-100 hover:text-slate-900 rounded disabled:opacity-40 transition-colors cursor-pointer text-xs"
                    >
                      ↶ Undo
                    </button>
                    <button 
                      onClick={() => setHistoryPointer(historyPointer+1)}
                      title="Redo State Revision (Ctrl+Y)" 
                      className="p-1.5 hover:bg-slate-100 hover:text-slate-900 rounded disabled:opacity-40 transition-colors cursor-pointer text-xs"
                    >
                      Redo ↷
                    </button>
                  </div>
                </div>

                {/* TAB B CANVAS FOOTER */}
                <div className="h-10 border-t border-[#E2E7EF] bg-white text-[9.5px] font-mono font-black text-[#6A7686] uppercase tracking-wider px-4 flex items-center justify-between select-none shrink-0 z-10 p-2">
                  <div className="flex items-center gap-4">
                    <span>ACTIVE GRAPH NODE SELECTION: {selectedAgentId ? `[${selectedAgentId}] CURRENTLY TARGETED` : 'NONE'}</span>
                    <span className="opacity-40">|</span>
                    <span>COGNITIVE STEPS MODEL: LLM-MASTER-V3.1 SECURE PLATFORM</span>
                  </div>
                  <button 
                    onClick={() => {
                      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(ATTRIBUTION_DATA, null, 2));
                      const downloadAnchor = document.createElement('a');
                      downloadAnchor.setAttribute("href", dataStr);
                      downloadAnchor.setAttribute("download", "CASE_001_BAYES_ATTRIBUTION.json");
                      document.body.appendChild(downloadAnchor);
                      downloadAnchor.click();
                      downloadAnchor.remove();
                    }}
                    className="px-2 py-1 bg-slate-100 hover:bg-[#202E3F] hover:text-white border border-slate-300 hover:border-dark rounded font-bold transition-all uppercase tracking-normal"
                  >
                    Export Workflow JSON
                  </button>
                </div>

              </div>

            </motion.div>
          )}
        </AnimatePresence>

      </div>

      {/* ===== BOTTOM STATUS BAR (Global) ===== */}
      <div className="h-10 bg-white border-t border-[#E2E7EF] px-5 flex items-center justify-between shrink-0 select-none">
        <div className="flex items-center gap-3">
          <span className="text-[8.5px] font-mono font-black uppercase text-[#A8B2C0] w-[140px] shrink-0">
            {tLabel('REGULATORY PIPELINE', '国家能源闭环督办流程泳道')}
          </span>
          <div className="flex items-center justify-between gap-1 max-w-[1200px] text-[10px] font-sans font-black">
             {[
               { label_en: 'DETECT',    label_zh: '触发建档',     count: 12, status: 'RED' },
               { label_en: 'ATTRIBUTE', label_zh: '研判归因',     count: 8,  status: 'AMBER' },
               { label_en: 'DISPATCH',  label_zh: '极速外勤派单', count: 5,  status: 'GREEN' },
               { label_en: 'RESOLVE',   label_zh: '整改核算',     count: 3,  status: 'GREEN' },
               { label_en: 'REVIEW',    label_zh: '行政复核',     count: 2,  status: 'GREEN' },
               { label_en: 'ARCHIVE',   label_zh: '案件归档',     count: 1,  status: 'GREEN' },
             ].map((p, idx) => (
               <React.Fragment key={idx}>
                 <div onClick={() => navigate('/closure/effectiveness')}
                      className="flex items-center gap-1.5 cursor-pointer group bg-slate-50 border border-slate-100 hover:border-[#2D6CDF]/30 px-2 py-0.5 rounded-[3px] transition-all scale-95 shrink-0">
                   <span className={`w-1 h-1 rounded-full ${
                     p.status === 'RED' ? 'bg-[#D8454C] animate-pulse' :
                     p.status === 'AMBER' ? 'bg-[#E89518]' : 'bg-[#2FA862]'}`} />
                   <span className="text-[10px] text-[#0F1722] font-mono group-hover:text-[#2D6CDF]">
                     {language === 'zh' ? p.label_zh : p.label_en}
                   </span>
                   <span className="text-[8.5px] text-[#6A7686] bg-[#FAFBFD] border border-border-default px-1 rounded font-mono font-black">
                     {p.count.toString().padStart(2, '0')}
                   </span>
                 </div>
                 {idx < 5 && <span className="text-slate-200 text-xs px-1">→</span>}
               </React.Fragment>
             ))}
          </div>
        </div>
        <div className="text-[9px] text-[#6A7686] font-mono ml-4 text-right shrink-0">
          <strong>33 active cases</strong> · 5 in preventive window · 0 today
        </div>
      </div>

      {/* ===== COMMERCIAL KB DRAWER ===== */}
      <EnterpriseDetailDrawer
        enterprise={drawerEntId ? enterpriseKB.find(e => e.id === drawerEntId) ?? null : null}
        onClose={() => setDrawerEntId(null)}
      />
    </div>
  );
}

// ============================================================================
// COMMERCIAL DRAWER COMPONENT — 9 大维度
// ============================================================================
interface DrawerProps {
  ent: CommercialRecord;
  onClose: () => void;
  tLabel: (en: string, zh: string) => string;
  language: string;
}

function CommercialDrawer({ ent, onClose, tLabel, language }: DrawerProps) {
  const flagBg =
    ent.flag === 'RED' ? 'bg-[#D8454C]' : ent.flag === 'AMBER' ? 'bg-[#E89518]' : 'bg-[#2FA862]';

  return (
    <>
      <div onClick={onClose} className="fixed inset-0 bg-black/20 z-[200] animate-fade-in" />
      <div className="fixed right-0 top-0 bottom-0 w-[520px] bg-white border-l border-[#E2E7EF] shadow-2xl z-[201] overflow-y-auto animate-slide-in select-text">
        <div className={cn("sticky top-0 z-10 px-5 py-3.5 text-white shadow-sm select-none", flagBg)}>
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2 text-[8.5px] font-mono uppercase tracking-wider opacity-90">
                <Building2 size={11} />
                <span>{ent.short_code}</span>
                <span className="opacity-60">·</span>
                <span>{ent.biz_profile.legal_form}</span>
                <span className="opacity-60">·</span>
                <span>TIER {ent.tier}</span>
              </div>
              <h2 className="text-[17px] font-black mt-1 leading-tight">{ent.legal_name_en}</h2>
              <p className="text-[11px] opacity-90 mt-0.5">{ent.legal_name_zh}</p>
            </div>
            <button onClick={onClose} className="text-white/80 hover:text-white shrink-0 cursor-pointer">
              <X size={18} />
            </button>
          </div>
          <div className="flex items-center gap-3 mt-3">
            <div className="bg-white/15 backdrop-blur rounded px-2.5 py-1">
              <div className="text-[8px] uppercase opacity-70 font-mono">{tLabel('Reg Score', '监管评分')}</div>
              <div className="text-[15px] font-black font-mono leading-none">{ent.score}<span className="text-[10px] opacity-70">/100</span></div>
            </div>
            <div className="bg-white/15 backdrop-blur rounded px-2.5 py-1">
              <div className="text-[8px] uppercase opacity-70 font-mono">{tLabel('Rank', '排名')}</div>
              <div className="text-[15px] font-black font-mono leading-none">#{ent.reg_scorecard.overall_rank_in_1247}<span className="text-[10px] opacity-70">/1,247</span></div>
            </div>
            <div className="bg-white/15 backdrop-blur rounded px-2.5 py-1">
              <div className="text-[8px] uppercase opacity-70 font-mono">{tLabel('Utilisation', '产能利用')}</div>
              <div className="text-[15px] font-black font-mono leading-none">{ent.realtime_ops.utilisation_pct}<span className="text-[10px] opacity-70">%</span></div>
            </div>
          </div>
        </div>

        <div className="p-5 space-y-4">
          <Section title={tLabel('1. Business Profile', '1. 基本工商信息')} icon={<Building2 size={12} />}>
            <KV k={tLabel('Legal Form', '法人形式')} v={ent.biz_profile.legal_form} />
            <KV k={tLabel('BIN', '商业识别码')} v={ent.biz_profile.bin} mono />
            <KV k={tLabel('Capital', '注册资本')} v={ent.biz_profile.registered_capital} />
            <KV k={tLabel('Founded', '成立日期')} v={ent.biz_profile.incorporation_date} mono />
            <KV k={tLabel('Registered Address', '注册地址')} v={ent.biz_profile.registered_address} />
            <KV k={tLabel('Operating Site', '经营地址')} v={ent.biz_profile.operating_address} />
            <KV k={tLabel('Coords', '经纬度')} v={`${ent.biz_profile.coords[0]}, ${ent.biz_profile.coords[1]}`} mono />
            <KV k={tLabel('Industry', '行业代码')} v={ent.biz_profile.industry_code} mono />
            <KV k={tLabel('Employees', '员工数')} v={ent.biz_profile.employee_count.toLocaleString()} mono />
            <KV k={tLabel('Legal Rep', '法定代表人')} v={language === 'zh' ? ent.biz_profile.legal_rep_zh : ent.biz_profile.legal_rep_en} />
            <KV k={tLabel('Contact', '联系电话')} v={ent.biz_profile.contact_phone} mono />
          </Section>

          <Section title={tLabel('2. Shareholding & UBO', '2. 股权与最终受益人')} icon={<Users size={12} />}>
            {ent.shareholding.map((s, i) => (
              <div key={i} className="flex items-center justify-between py-1.5 border-b border-slate-50 last:border-0 select-text">
                <div className="flex-1 min-w-0">
                  <div className="text-[11px] font-bold text-[#0F1722] truncate">
                    {language === 'zh' ? s.holder_zh : s.holder_en}
                    {s.ubo && <span className="ml-1.5 text-[8.5px] bg-[#D8454C]/10 text-[#D8454C] px-1 py-0.5 rounded font-mono">UBO</span>}
                  </div>
                  {s.note && <div className="text-[9px] text-[#D8454C] italic mt-0.5">{s.note}</div>}
                  <div className="text-[9px] text-[#A8B2C0] font-mono">{s.nationality}</div>
                </div>
                <div className="text-right shrink-0 w-16">
                  <div className="text-[13px] font-black font-mono text-[#0F1722]">{(s.ratio * 100).toFixed(1)}%</div>
                  <div className="h-1 bg-slate-100 rounded-full mt-0.5 overflow-hidden">
                    <div className="h-full bg-[#2D6CDF]" style={{ width: `${s.ratio * 100}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </Section>

          <Section title={tLabel('3. Business Scope & Capacity', '3. 业务范围与产能')} icon={<Activity size={12} />}>
            <div className="text-[10px] text-[#6A7686] mb-2 select-none">{tLabel('Licensed Products', '许可产品')}</div>
            <div className="flex flex-wrap gap-1.5 mb-3 select-none">
              {ent.business_scope.licensed_products.map((p, i) => (
                <span key={i} className="bg-slate-100 text-[#0F1722] text-[9.5px] font-mono px-2 py-0.5 rounded">{p}</span>
              ))}
            </div>
            <div className="text-[10px] text-[#6A7686] mb-1.5 select-none">{tLabel('Nameplate vs Actual', '名义产能 vs 实际 2025')}</div>
            {ent.business_scope.actual_outputs.map((o, i) => (
              <div key={i} className="flex items-center justify-between py-1.5 border-b border-slate-50 last:border-0 text-[10.5px]">
                <span className="font-bold text-[#0F1722]">{o.item}</span>
                <span className="font-mono text-[#6A7686]">{o.nameplate} → {o.actual_2025}</span>
                <span className={cn("font-mono font-black text-[10.5px] w-14 text-right",
                  o.deviation_pct > 10 ? 'text-[#D8454C]' :
                  o.deviation_pct > 5  ? 'text-[#E89518]' :
                  o.deviation_pct < -5 ? 'text-[#6A7686]' : 'text-[#2FA862]')}>
                  {o.deviation_pct > 0 ? '+' : ''}{o.deviation_pct.toFixed(1)}%
                </span>
              </div>
            ))}
            <div className="flex justify-between mt-2 pt-2 border-t border-slate-100 text-[10px]">
              <span className="text-[#6A7686] select-none">{tLabel('Primary Buyers', '主要买方')}</span>
              <span className="font-mono text-[#0F1722] text-right max-w-[60%] select-text truncate">{ent.business_scope.primary_buyers.join(' · ')}</span>
            </div>
            <KV k={tLabel('Export Share', '出口比重')} v={`${ent.business_scope.export_share_pct}%`} mono />
          </Section>

          {ent.affiliates.length > 0 && (
            <Section title={tLabel('4. Affiliated Entities', '4. 关联实体网络')} icon={<Network size={12} />}>
              {ent.affiliates.map((a, i) => (
                <div key={i} className="flex items-center justify-between py-1.5 border-b border-slate-50 last:border-0 select-text">
                  <div>
                    <div className="text-[11px] font-bold text-[#0F1722]">{language === 'zh' ? a.name_zh : a.name_en}</div>
                    <div className="text-[9px] text-[#A8B2C0] font-mono">{a.relation}</div>
                  </div>
                  <span className={cn("px-1.5 py-0.5 rounded text-[8.5px] font-black font-mono border select-none",
                    a.risk_color === 'RED'   ? 'border-[#D8454C] text-[#D8454C] bg-[#D8454C]/5' :
                    a.risk_color === 'AMBER' ? 'border-[#E89518] text-[#E89518] bg-[#E89518]/5' :
                                               'border-[#2FA862] text-[#2FA862] bg-[#2FA862]/5')}>● {a.risk_color}</span>
                </div>
              ))}
            </Section>
          )}

          <Section title={tLabel('5. Tax & Invoice', '5. 财税与发票')} icon={<Receipt size={12} />}>
            <KV k={tLabel('Annual Tax (2025)', '年度纳税')} v={ent.tax_invoice.annual_tax_kzt} mono />
            <KV k={tLabel('VAT Compliance', '增值税合规率')} v={`${ent.tax_invoice.vat_compliance_pct}%`} mono />
            <KV k={tLabel('Invoice Anomalies 12M', '12 月发票异常次数')} v={ent.tax_invoice.invoice_anomaly_count_12m.toString()} mono danger={ent.tax_invoice.invoice_anomaly_count_12m > 10} />
            <KV k={tLabel('Transfer Pricing Flag', '关联交易转让定价标')} v={ent.tax_invoice.transfer_pricing_flag ? tLabel('FLAGGED', '已标记') : tLabel('Clean', '清白')} danger={ent.tax_invoice.transfer_pricing_flag} />
            <KV k={tLabel('Last Audit', '上次稽查')} v={ent.tax_invoice.last_audit_date} mono />
          </Section>

          {ent.major_events.length > 0 && (
            <Section title={tLabel('6. Major Events Timeline', '6. 重大事件时间线')} icon={<History size={12} />}>
              {ent.major_events.map((e, i) => (
                <div key={i} className="flex items-start gap-2.5 py-1.5 border-b border-slate-50 last:border-0 select-text">
                  <span className={cn("w-1.5 h-1.5 rounded-full mt-1.5 shrink-0",
                    e.severity === 'RED' ? 'bg-[#D8454C]' :
                    e.severity === 'AMBER' ? 'bg-[#E89518]' : 'bg-[#2FA862]')} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-2">
                       <span className="text-[9.5px] font-mono text-[#A8B2C0] select-none">{e.date}</span>
                       <span className="text-[8.5px] bg-slate-100 text-[#6A7686] px-1 rounded font-mono select-none">{e.kind}</span>
                    </div>
                    <div className="text-[11px] text-[#0F1722] mt-0.5">{language === 'zh' ? e.title_zh : e.title_en}</div>
                  </div>
                </div>
              ))}
            </Section>
          )}

          {ent.penalties.length > 0 ? (
            <Section title={tLabel('7. Penalties & Litigation', '7. 处罚与诉讼记录')} icon={<Gavel size={12} />}>
              {ent.penalties.map((p, i) => (
                <div key={i} className="bg-slate-50 rounded p-2.5 mb-2 last:mb-0 select-text">
                  <div className="flex items-center justify-between mb-1 select-none">
                    <span className="text-[10px] font-mono font-black text-[#0F1722]">{p.case_id}</span>
                    <span className={cn("text-[8.5px] font-mono font-black px-1.5 py-0.5 rounded",
                      p.status === 'OPEN' ? 'bg-[#D8454C]/10 text-[#D8454C]' :
                      p.status === 'APPEALED' ? 'bg-[#E89518]/10 text-[#E89518]' :
                                                 'bg-slate-200 text-[#6A7686]')}>{p.status}</span>
                  </div>
                  <div className="text-[10px] text-[#6A7686] select-none">{p.date} · {p.issuing_body}</div>
                  <div className="text-[10.5px] text-[#0F1722] font-bold mt-1">{language === 'zh' ? p.reason_zh : p.reason_en}</div>
                  <div className="text-[11px] font-mono font-black text-[#D8454C] mt-0.5 select-none">{p.amount_kzt} KZT</div>
                </div>
              ))}
            </Section>
          ) : (
            <Section title={tLabel('7. Penalties & Litigation', '7. 处罚与诉讼记录')} icon={<Gavel size={12} />}>
              <div className="text-[10.5px] text-[#2FA862] font-bold py-2">✓ {tLabel('No penalty records', '无处罚记录')}</div>
            </Section>
          )}

          <Section title={tLabel('8. Real-Time Operations', '8. 实时运营指标')} icon={<Activity size={12} />}>
            <KV k={tLabel('Today Throughput', '今日产出')} v={ent.realtime_ops.today_throughput} mono />
            <KV k={tLabel('Nameplate', '名义产能')} v={ent.realtime_ops.nameplate_capacity} mono />
            <KV k={tLabel('Utilisation', '产能利用率')} v={`${ent.realtime_ops.utilisation_pct}%`} mono danger={ent.realtime_ops.utilisation_pct > 110} />
            <KV k={tLabel('SCADA Lag', 'SCADA 延迟')} v={`${ent.realtime_ops.scada_lag_min} min`} mono danger={ent.realtime_ops.scada_lag_min > 5} />
            <KV k={tLabel('Last Seen', '最后上报')} v={ent.realtime_ops.last_seen_utc} mono />
            <KV k={tLabel('CO₂ Intensity', '碳强度')} v={ent.realtime_ops.co2_intensity} mono />
            <KV k={tLabel('Power Draw', '当前用电')} v={`${ent.realtime_ops.power_draw_mw} MW`} mono />
          </Section>

          <Section title={tLabel('9. Regulatory Scorecard (6 lanes)', '9. 监管画像 · 6 牌照评分')} icon={<ShieldCheck size={12} />}>
            {[
              ['Approval',      '审批', ent.reg_scorecard.approval_score],
              ['Reporting',     '报送', ent.reg_scorecard.reporting_score],
              ['Inspection',    '稽查', ent.reg_scorecard.inspection_score],
              ['Sanction',      '处罚', ent.reg_scorecard.sanction_score],
              ['Rectification', '整改', ent.reg_scorecard.rectification_score],
              ['Review',        '复核', ent.reg_scorecard.review_score],
            ].map((row, i) => {
              const v = row[2] as number;
              const color = v >= 75 ? '#2FA862' : v >= 50 ? '#E89518' : '#D8454C';
              return (
                <div key={i} className="flex items-center gap-2 py-1 select-none">
                  <span className="text-[10px] text-[#6A7686] w-20">{tLabel(row[0] as string, row[1] as string)}</span>
                  <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full" style={{ width: `${v}%`, background: color }} />
                  </div>
                  <span className="text-[10.5px] font-mono font-black w-10 text-right" style={{ color }}>{v}</span>
                </div>
              );
            })}
          </Section>

          <button 
            onClick={() => alert(tLabel('Exporting full company profile PDF files is simulated.', '合并 PDF 导出进程启动，正在聚合 9 大方面档案细节图画...'))}
            className="w-full py-2.5 bg-[#0F1722] hover:bg-[#1A2330] text-white text-[11px] font-black uppercase tracking-wider rounded select-none cursor-pointer mt-2"
          >
            <Download size={11} className="inline mr-1.5" /> {tLabel('Export Full Profile (PDF)', '导出完整企业档案 (PDF)')}
          </button>
        </div>
      </div>
    </>
  );
}

function Section({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-[#E2E7EF] rounded p-3.5 shadow-sm">
      <div className="flex items-center gap-1.5 mb-2.5 pb-2 border-b border-slate-100 select-none">
        <span className="text-[#2D6CDF]">{icon}</span>
        <h3 className="text-[10.5px] font-black uppercase tracking-wider text-[#0F1722]">{title}</h3>
      </div>
      <div className="space-y-1">{children}</div>
    </div>
  );
}

function KV({ k, v, mono, danger }: { k: string; v: string; mono?: boolean; danger?: boolean }) {
  return (
    <div className="flex items-start justify-between gap-3 py-0.5 select-text">
      <span className="text-[10px] text-[#6A7686] shrink-0 select-none">{k}</span>
      <span className={cn("text-[10.5px] text-right max-w-[60%] break-words",
        mono ? 'font-mono' : '',
        danger ? 'text-[#D8454C] font-black' : 'text-[#0F1722] font-bold')}>{v}</span>
    </div>
  );
}
