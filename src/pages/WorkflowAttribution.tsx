import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldCheck, ArrowLeft, FileText, X, FileCheck, Search, Gavel, Wrench,
  Building2, Users, Receipt, History, Activity, Network, ExternalLink, Download
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { useLanguage } from '../components/LanguageContext';
import { ATTRIBUTION_DATA } from '../data/attribution/case_001_attribution';
import {
  COMMERCIAL_DB, searchEnterprises, findEnterpriseById,
  type CommercialRecord
} from '../data/commercial/enterprise_db';

export default function WorkflowAttribution() {
  const { language, t } = useLanguage();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'overview' | 'workflow'>('overview');
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);

  // commercial KB drawer + search
  const [drawerEnt, setDrawerEnt] = useState<CommercialRecord | null>(null);
  const [searchQ, setSearchQ] = useState('');
  const [showSuggest, setShowSuggest] = useState(false);

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

  const getAgentVerb = (agentId: string) => {
    switch (agentId) {
      case 'AGENT_APPROVAL':       return { color: 'text-[#D8454C] border-[#D8454C]', label: tLabel('Permit Breach Found', '发现批准红区漏洞') };
      case 'AGENT_REPORTING':      return { color: 'text-[#D8454C] border-[#D8454C]', label: tLabel('Invoice Discrepancy', '进油发票对比失等') };
      case 'AGENT_INSPECTION':     return { color: 'text-[#E89518] border-[#E89518]', label: tLabel('SCADA Drift Detected', 'SCADA 数据测点漂移') };
      case 'AGENT_SANCTION':       return { color: 'text-[#D8454C] border-[#D8454C]', label: tLabel('Prior Repetitive Offenses', '查出历史累犯违规记录') };
      case 'AGENT_RECTIFICATION':  return { color: 'text-[#E89518] border-[#E89518]', label: tLabel('Ineffective Remediation', '整改逾期阻尼') };
      case 'AGENT_REVIEW':         return { color: 'text-[#2FA862] border-[#2FA862]', label: tLabel('Under Review', '督办终审挂单') };
      default:                     return { color: 'text-[#2FA862] border-[#2FA862]', label: tLabel('Nominal', '常态') };
    }
  };

  const getIcon = (iconName: string, size = 18) => {
    switch (iconName) {
      case 'FileCheck':   return <FileCheck size={size} />;
      case 'FileText':    return <FileText size={size} />;
      case 'Search':      return <Search size={size} />;
      case 'Gavel':       return <Gavel size={size} />;
      case 'Wrench':      return <Wrench size={size} />;
      case 'ShieldCheck': return <ShieldCheck size={size} />;
      default:            return <FileText size={size} />;
    }
  };

  const openDrawerFor = (entId: string) => {
    const ent = findEnterpriseById(entId);
    if (ent) setDrawerEnt(ent);
  };

  return (
    <div className="flex-1 flex flex-col bg-[#F4F6FA] text-[#1A2330] font-sans overflow-hidden relative">

      {/* ===== TOP HEADER ===== */}
      <div className="h-14 border-b border-[#E2E7EF] bg-white flex items-center justify-between px-6 shrink-0 z-50 shadow-sm animate-fade-in">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/warning/timeseries')}
            className="flex items-center gap-1.5 text-[#6A7686] hover:text-[#0F1722] pr-3 border-r border-[#E2E7EF] text-[11px] font-bold">
            <ArrowLeft size={13} />
            <span>{tLabel('Back to Warning', '返回时序大模型')}</span>
          </button>
          <span className="text-[11.5px] font-black uppercase text-[#0F1722] tracking-wider">
            {tLabel('ACT II-C · MULTI-AGENT CROSS-LICENSE AUDIT & ATTRIBUTION CONSOLE', '第二幕丙 · 国家能源局跨牌照自组织智能体研判与物理追溯终端')}
          </span>
        </div>

        {/* === SEARCH BAR === */}
        <div className="flex-1 max-w-[320px] mx-6 relative">
          <div className="flex items-center bg-slate-50 border border-[#E2E7EF] rounded h-8 px-2.5 focus-within:border-[#2D6CDF] focus-within:bg-white transition-all">
            <Search size={13} className="text-[#A8B2C0] shrink-0" />
            <input
              value={searchQ}
              onChange={(e) => { setSearchQ(e.target.value); setShowSuggest(true); }}
              onFocus={() => setShowSuggest(true)}
              onBlur={() => setTimeout(() => setShowSuggest(false), 200)}
              placeholder={tLabel('Search enterprise / LLC / BIN / industry code', '搜索企业 / LLC / 商业识别号 / 行业')}
              className="flex-1 bg-transparent border-0 outline-none text-[11px] px-2 placeholder:text-[#A8B2C0]"
            />
            {searchQ && (
              <button onClick={() => setSearchQ('')} className="text-[#A8B2C0] hover:text-[#0F1722]">
                <X size={12} />
              </button>
            )}
          </div>
          {showSuggest && searchQ && searchResults.length > 0 && (
            <div className="absolute top-9 left-0 right-0 bg-white border border-[#E2E7EF] rounded shadow-lg z-[100] max-h-[320px] overflow-y-auto">
              <div className="px-3 py-1.5 text-[8.5px] font-black uppercase text-[#A8B2C0] tracking-wider border-b">
                {tLabel(`${searchResults.length} matches in 1,247-entity database`, `在 1,247 家监管企业中找到 ${searchResults.length} 条`)}
              </div>
              {searchResults.map(r => (
                <div key={r.id}
                  onMouseDown={() => { setDrawerEnt(r); setShowSuggest(false); setSearchQ(''); }}
                  className="px-3 py-2 hover:bg-slate-50 cursor-pointer border-b border-slate-50 last:border-0 flex items-center justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="text-[11px] font-bold text-[#0F1722] truncate">{language === 'zh' ? r.legal_name_zh : r.legal_name_en}</div>
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

        <div className="flex h-9 bg-slate-100 border border-border-default rounded p-0.5 select-none shrink-0 scale-95">
          <button onClick={() => handleTabChange('overview')}
            className={cn("px-4 py-1 text-[10.5px] font-black rounded uppercase transition-all",
              activeTab === 'overview' ? "bg-white text-[#2D6CDF] shadow" : "text-[#6A7686] hover:text-[#0F1722]")}>
            {tLabel('1. Overview Grid', '1. 贝叶斯证据链集成大图')}
          </button>
          <button onClick={() => handleTabChange('workflow')}
            className={cn("px-4 py-1 text-[10.5px] font-black rounded uppercase transition-all",
              activeTab === 'workflow' ? "bg-white text-[#2D6CDF] shadow" : "text-[#6A7686] hover:text-[#0F1722]")}>
            {tLabel('2. Intelligent Topology', '2. 智能拓扑图')}
          </button>
        </div>

        <div className="flex items-center gap-2 ml-3">
          <span className="px-2 py-0.5 bg-[#0F1722] text-white text-[8px] font-bold rounded-sm uppercase tracking-wider font-mono">CASE-2026-001</span>
          <span className="px-2 py-0.5 bg-[#D8454C] text-white text-[8px] font-bold rounded-sm uppercase tracking-wider font-mono">POSTERIOR 0.87</span>
        </div>
      </div>

      {activeTab === 'overview' ? (
        <div className="flex-1 flex flex-col overflow-hidden">

          {/* ===== CORE SUBJECT STRIP — 可点击弹商业抽屉 ===== */}
          <div className="h-20 bg-white border-b border-[#E2E7EF] px-6 py-2 grid grid-cols-4 gap-4 shrink-0 shadow-sm leading-tight select-none">
            <div onClick={() => openDrawerFor('ENT-KZ-AKT-0091')}
                 className="flex flex-col justify-center border-r border-slate-100 pr-4 cursor-pointer hover:bg-slate-50 -mx-2 px-2 rounded transition group">
              <span className="text-[8.5px] text-[#A8B2C0] uppercase font-black font-mono flex items-center gap-1">
                {tLabel('Subject Enterprise', '被罚主体公司')}
                <ExternalLink size={9} className="opacity-0 group-hover:opacity-100 text-[#2D6CDF]" />
              </span>
              <div className="font-bold text-[#0F1722] text-[12.5px] mt-0.5 truncate group-hover:text-[#2D6CDF]">
                {tLabel('Western Caspian Energy LLC', '西里海能源有限责任公司')}
              </div>
              <span className="text-[9.5px] text-[#6A7686] font-mono">ENT-KZ-AKT-0091 · {tLabel('Petrol Refinery / Upstream', '整顿炼化及上游气压首站')}</span>
            </div>
            <div onClick={() => openDrawerFor('ENT-KZ-AKT-0091')}
                 className="flex flex-col justify-center border-r border-slate-100 pr-4 pl-2 cursor-pointer hover:bg-slate-50 -mx-2 px-2 rounded transition group">
              <span className="text-[8.5px] text-[#A8B2C0] uppercase font-black font-mono">{tLabel('Triggering Anomaly Log', '触发源头警兆物证')}</span>
              <div className="font-bold text-[#0F1722] text-[12.5px] mt-0.5 truncate">
                ANO-2026-0512 (Aktau GCS-001)
              </div>
              <span className="text-[9.5px] text-[#D8454C] font-mono font-bold">Outlet pressure +3.7σ deviation above baseline</span>
            </div>
            <div onClick={() => openDrawerFor('ENT-KZ-AKT-0091')}
                 className="flex flex-col justify-center border-r border-slate-100 pr-4 pl-2 cursor-pointer hover:bg-slate-50 -mx-2 px-2 rounded transition group">
              <span className="text-[8.5px] text-[#A8B2C0] uppercase font-black font-mono">{tLabel('Subject Facility', '在册异常监管设施')}</span>
              <div className="font-bold text-[#1A2330] text-[12.5px] mt-0.5 truncate">
                {tLabel('Aktau Core Main Station', '阿克套物理首站一级压气站房')}
              </div>
              <span className="text-[9.5px] text-[#6A7686] font-mono">FAC-KZ-AKT-GCS-001 / GAS_COMPRESSOR</span>
            </div>
            <div className="flex flex-col justify-center pl-2">
              <span className="text-[8.5px] text-[#A8B2C0] uppercase font-black font-mono">{tLabel('Attribution Window', '回溯跨系统审计程区间')}</span>
              <div className="font-bold text-[#0F1722] text-[12.5px] mt-0.5">2025-06-01 至 2026-05-28</div>
              <span className="text-[9.5px] text-[#2D6CDF] font-mono">12 Months rolling · 27 high-dimension events matched</span>
            </div>
          </div>

          <div className="flex-1 flex overflow-hidden">
            {/* ===== LEFT · AGENT LANES ===== */}
            <div className="w-[580px] border-r border-[#E2E7EF] bg-white flex flex-col shrink-0 overflow-y-auto no-scrollbar">
              <div className="p-4 border-b border-[#E2E7EF] bg-slate-50/50 flex justify-between items-center text-[10px] font-black text-[#6A7686] uppercase tracking-wider shrink-0 select-none">
                <span>{tLabel('Active Agent Lanes', '在设多牌照多层智能体信息')}</span>
                <span>{tLabel('Verdict / Confidence', '研判性质与其贝叶斯概率')}</span>
              </div>
              {ATTRIBUTION_DATA.lanes.map((lane) => {
                const verbInfo = getAgentVerb(lane.agent.id);
                return (
                  <div key={lane.id}
                    onClick={() => setSelectedAgentId(lane.agent.id)}
                    className={cn(
                      "h-24 p-5 border-b border-[#E2E7EF] flex items-center justify-between hover:bg-[#FAFBFD] cursor-pointer transition-all relative select-none",
                      selectedAgentId === lane.agent.id ? "bg-[#2D6CDF]/5 border-r-4 border-r-[#2D6CDF]" : ""
                    )}>
                    <div className="flex items-center gap-4.5 flex-1 pr-4">
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-[#2D6CDF] shadow-inner font-mono">
                        {getIcon(lane.icon, 18)}
                      </div>
                      <div className="space-y-1">
                        <div className="font-black text-[#0F1722] text-[14.5px] tracking-tight uppercase">
                          {t(lane.label_en)}
                        </div>
                        <div className="text-[10px] text-[#6A7686] leading-tight max-w-[320px] truncate">
                          {tLabel(lane.agent.name_en, lane.agent.specialization)}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <span className={cn("px-2 py-0.5 rounded-[2px] text-[8.5px] font-black uppercase tracking-wider border", verbInfo.color)}>
                        {verbInfo.label}
                      </span>
                      <div className="text-right mt-1">
                        <div className="text-[11px] font-mono font-black text-[#0F1722]">
                          {(lane.agent.confidence * 100).toFixed(0)}% Match
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ===== CENTER · 12-MONTH TIMELINE ===== */}
            <div className="flex-1 overflow-x-auto relative bg-[#FCFDFE] p-6 shadow-inner">
              <div className="text-[10px] font-black text-[#A8B2C0] uppercase tracking-wider mb-4 select-none">
                {tLabel('12-Month Cross-License High-Density Audit Log Stream', '过去 12 个月内各模块已匹配记录之物理事件（点击点查看元数据详情）')}
              </div>
              <div className="relative border border-[#E2E7EF] rounded bg-white p-4 h-[400px]">
                <div className="absolute top-1/2 left-0 right-0 h-[1.5px] bg-[#E2E7EF] translate-y-[-50%]" />
                <div className="absolute inset-x-0 top-0 bottom-0 grid grid-cols-12 pointer-events-none">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <div key={i} className="border-r border-slate-100/60 h-full relative">
                      <span className="absolute bottom-2 left-2 text-[8px] font-mono font-bold text-[#A8B2C0]">
                        {2025 + Math.floor((5 + i) / 12)}-{String(((5 + i) % 12) + 1).padStart(2, '0')}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="absolute top-[25%] left-[20%] z-10">
                  <div onClick={() => setSelectedEventId('EV-01')} className="w-4 h-4 rounded-full bg-[#E89518] border-2 border-white shadow-md cursor-pointer hover:scale-125 transition-transform" />
                  <span className="text-[7.5px] font-mono text-[#6A7686] absolute top-5 -left-4 whitespace-nowrap">2025-08-12</span>
                </div>
                <div className="absolute top-[45%] left-[65%] z-10">
                  <div onClick={() => setSelectedEventId('EV-02')} className="w-5 h-5 rounded-full bg-[#D8454C] border-2 border-white shadow-md cursor-pointer hover:scale-125 transition-transform animate-pulse" />
                  <span className="text-[7.5px] font-mono text-[#6A7686] absolute top-6 -left-4 whitespace-nowrap">2026-02-18</span>
                </div>
                <div className="absolute top-[65%] left-[85%] z-10">
                  <div onClick={() => setSelectedEventId('EV-03')} className="w-4 h-4 rounded-full bg-[#D8454C] border-2 border-white shadow-md cursor-pointer hover:scale-125 transition-transform" />
                  <span className="text-[7.5px] font-mono text-[#6A7686] absolute top-5 -left-4 whitespace-nowrap">2026-04-22</span>
                </div>
                <div className="absolute top-6 left-6 text-[10.5px] font-bold text-[#2D6CDF] bg-[#2D6CDF]/5 px-3 py-1.5 rounded border border-[#2D6CDF]/20">
                  💡 {tLabel('Hover or click dot markers to inspect raw evidentiary documents & SCADA files.', '💡 提示：点击时间线上黄色口径点或粉色警示标记，直接查看对应数采、纳税或设备原始档案。')}
                </div>
              </div>
              {selectedEventId && (
                <div className="mt-4 bg-white border border-[#E2E7EF] p-4 rounded shadow-lg flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="bg-[#D8454C]/15 text-[#D8454C] text-[9px] font-black px-1.5 py-0.5 rounded uppercase">
                        {tLabel('EVIDENTIARY FILE LOCK', '哈国主税案证文')}
                      </span>
                      <h4 className="text-[13px] font-black text-[#0F1722] mt-1.5">
                        {selectedEventId === 'EV-01' ? 'Atyrau -> Almaty SCADA Sensor Drift' : 'Corporate Invoice Overproduction Mismatch (KZ-MC-0518)'}
                      </h4>
                      <p className="text-[#6A7686] text-[11px] mt-1 max-w-2xl">
                        {selectedEventId === 'EV-01'
                          ? tLabel('Unrecorded volumetric difference. SCADA flow rate reported lower while fuel logs indicated larger chemical throughput.', 'SCADA 上报流速与下游管阀气阻计算出现不守。疑似传感器零点存在长期负向漂移人工调拨。')
                          : tLabel('Company invoice reported raw volumes +17.5% over the registry limits defined in permit MoE-2401.', '该公司增值税纳税进销项进油量计算，反推其实际炼化大负荷通过已达名义极限 117.5%，超过环保准许限制。')}
                      </p>
                    </div>
                    <button onClick={() => setSelectedEventId(null)} className="text-[#6A7686] hover:text-[#0F1722] font-bold text-[11px]">
                      ✕ {tLabel('Close', '关闭元数据')}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* ===== RIGHT · VERDICT + 紧凑前置干预 ===== */}
            <div className="w-[320px] border-l border-[#E2E7EF] bg-[#FAFBFD] p-4 flex flex-col shrink-0 overflow-y-auto gap-3">
              <div className="border-b border-slate-200 pb-3">
                <span className="text-[10px] font-black text-[#A8B2C0] uppercase tracking-wider">{tLabel('Bayesian Root Cause', '贝叶斯综合终审主因判定')}</span>
                <h3 className="text-[15px] font-black text-[#D8454C] mt-1 leading-tight uppercase">
                  {tLabel('Covert Capacity Expansion', '蓄意瞒报产能、超规加压')}
                </h3>
                <p className="text-[10.5px] text-[#6A7686] mt-1.5 leading-snug">
                  {tLabel('AI evaluated 6 lanes of data. Physical drift alone <13%. Posterior P=0.87.',
                          '6 牌照智能体联合校验。仅靠物理漂移拟合度 <13%，后验概率 P=0.87。')}
                </p>
              </div>
              <div className="space-y-2">
                <div className="text-[9px] font-black text-[#6A7686] uppercase tracking-wider">{tLabel('Lanes Evidence', '各牌照证据特征链')}</div>
                <div className="bg-white border rounded p-2 text-[10.5px] space-y-0.5">
                  <div className="flex justify-between font-bold text-[#0F1722]"><span>1. Permit Registry</span><span className="text-[#D8454C]">RED</span></div>
                  <div className="text-[#6A7686] text-[9.5px]">{tLabel('Motor exceeds registered limit', '电机马力超工商登记')}</div>
                </div>
                <div className="bg-white border rounded p-2 text-[10.5px] space-y-0.5">
                  <div className="flex justify-between font-bold text-[#0F1722]"><span>2. Tax & Invoice</span><span className="text-[#D8454C]">RED</span></div>
                  <div className="text-[#6A7686] text-[9.5px]">{tLabel('Billing mismatch reported volumes', '财务进项 vs 月报物理冲突')}</div>
                </div>
                <div className="bg-white border rounded p-2 text-[10.5px] space-y-0.5">
                  <div className="flex justify-between font-bold text-[#0F1722]"><span>3. SCADA Sensor</span><span className="text-[#E89518]">AMBER</span></div>
                </div>
              </div>

              {/* === 紧凑前置干预处置预案 === */}
              <div className="bg-white border border-[#D8454C]/30 rounded p-3 mt-1">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[9px] font-black text-[#A8B2C0] uppercase tracking-wider">{tLabel('Preventive Intervention', '前置干预处置预案')}</span>
                  <span className="text-[8.5px] font-mono text-[#D8454C] bg-[#D8454C]/10 px-1.5 py-0.5 rounded">90D-RISK</span>
                </div>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-[28px] font-black font-mono text-[#D8454C] leading-none">68<span className="text-[14px]">%</span></span>
                  <span className="text-[9px] text-[#6A7686] leading-tight whitespace-pre-line">{tLabel('90-day incident probability\n95% CI: 62 – 74%', '90 天事故爆发概率\n95% 置信带: 62 – 74%')}</span>
                </div>
                <div className="border-t border-slate-100 pt-2 grid grid-cols-2 gap-2 text-[9.5px]">
                  <div>
                    <div className="text-[#A8B2C0] font-mono text-[8.5px] uppercase">{tLabel('Action Window', '处置窗口')}</div>
                    <div className="font-black text-[#0F1722] font-mono text-[13px]">36H</div>
                  </div>
                  <div>
                    <div className="text-[#A8B2C0] font-mono text-[8.5px] uppercase">{tLabel('Avoided Loss', '可避免损失')}</div>
                    <div className="font-black text-[#0F1722] font-mono text-[11.5px]">75 MMcm</div>
                  </div>
                </div>
                <button onClick={() => navigate('/audit/event/CASE-2026-001')}
                        className="w-full mt-2 py-1.5 bg-[#0F1722] hover:bg-[#1A2330] text-white text-[10px] font-black uppercase tracking-wider rounded">
                  ⚡ {tLabel('Dispatch Inspector · 36H', '一键派单 · 36H 内执行')}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* ===== TAB 2 · 智能拓扑图 (节点 + SVG 连线) ===== */
        <div className="flex-1 p-6 flex flex-col overflow-y-auto">
          <div className="bg-white rounded border border-[#E2E7EF] p-5 shadow-sm flex-1 flex flex-col min-h-[500px]">
            <div className="border-b border-[#E2E7EF] pb-3 mb-4 select-none shrink-0">
              <h3 className="text-[15px] font-black text-[#0F1722]">
                {tLabel('INTELLIGENT TOPOLOGY · MULTI-AGENT COMPUTE DAG', '智能拓扑图 · 跨系统多牌照智能体自组织拓扑联合计算网络')}
              </h3>
              <p className="text-[11px] text-[#6A7686] mt-1 font-sans">
                {tLabel('Data Ingest → Identity Resolvers → Master Agents → Verdict. Each line = evidence flow.',
                        '数据采集 → 物理对齐 → 智能体研判 → 终审决策。每条线 = 证据流。')}
              </p>
            </div>
            <div className="flex-1 relative bg-slate-50/50 rounded border border-[#E2E7EF] p-6 overflow-hidden">
              <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
                <defs>
                  <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                    <path d="M 0 0 L 10 5 L 0 10 z" fill="#2D6CDF" />
                  </marker>
                  <marker id="arrowred" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                    <path d="M 0 0 L 10 5 L 0 10 z" fill="#D8454C" />
                  </marker>
                </defs>
                <line x1="18%" y1="22%" x2="42%" y2="48%" stroke="#2D6CDF" strokeWidth="1.5" strokeDasharray="4 3" markerEnd="url(#arrow)" />
                <line x1="18%" y1="50%" x2="42%" y2="50%" stroke="#2D6CDF" strokeWidth="1.5" strokeDasharray="4 3" markerEnd="url(#arrow)" />
                <line x1="18%" y1="78%" x2="42%" y2="52%" stroke="#D8454C" strokeWidth="2" markerEnd="url(#arrowred)" />
                <line x1="50%" y1="50%" x2="72%" y2="18%" stroke="#2D6CDF" strokeWidth="1.5" markerEnd="url(#arrow)" />
                <line x1="50%" y1="50%" x2="72%" y2="30%" stroke="#2D6CDF" strokeWidth="1.5" markerEnd="url(#arrow)" />
                <line x1="50%" y1="50%" x2="72%" y2="42%" stroke="#2D6CDF" strokeWidth="1.5" markerEnd="url(#arrow)" />
                <line x1="50%" y1="50%" x2="72%" y2="58%" stroke="#2D6CDF" strokeWidth="1.5" markerEnd="url(#arrow)" />
                <line x1="50%" y1="50%" x2="72%" y2="70%" stroke="#2D6CDF" strokeWidth="1.5" markerEnd="url(#arrow)" />
                <line x1="50%" y1="50%" x2="72%" y2="82%" stroke="#2D6CDF" strokeWidth="1.5" markerEnd="url(#arrow)" />
                <line x1="80%" y1="18%" x2="90%" y2="50%" stroke="#D8454C" strokeWidth="1.5" markerEnd="url(#arrowred)" />
                <line x1="80%" y1="30%" x2="90%" y2="50%" stroke="#D8454C" strokeWidth="1.5" markerEnd="url(#arrowred)" />
                <line x1="80%" y1="42%" x2="90%" y2="50%" stroke="#E89518" strokeWidth="1.5" markerEnd="url(#arrow)" />
                <line x1="80%" y1="58%" x2="90%" y2="50%" stroke="#2FA862" strokeWidth="1.5" markerEnd="url(#arrow)" />
                <line x1="80%" y1="70%" x2="90%" y2="50%" stroke="#E89518" strokeWidth="1.5" markerEnd="url(#arrow)" />
                <line x1="80%" y1="82%" x2="90%" y2="50%" stroke="#2FA862" strokeWidth="1.5" markerEnd="url(#arrow)" />
              </svg>

              <div className="absolute top-[14%] left-[6%] w-[12%] z-10">
                <div className="text-[8.5px] font-black text-[#A8B2C0] uppercase font-mono mb-1.5">{tLabel('1. INGEST', '1. 特征数据入流')}</div>
                <div className="bg-white border rounded p-2 text-[10px] shadow-sm font-mono">
                  <strong className="text-[#0F1722] text-[10.5px] block">{tLabel('MoE Permit DB', '能源部准入牌照核心库')}</strong>
                  <div className="text-[8.5px] text-[#2FA862] mt-0.5">● 2,147 entries</div>
                </div>
              </div>
              <div className="absolute top-[44%] left-[6%] w-[12%] z-10">
                <div className="bg-white border rounded p-2 text-[10px] shadow-sm font-mono">
                  <strong className="text-[#0F1722] text-[10.5px] block">{tLabel('KEGOC MWh', 'KEGOC输配电网段')}</strong>
                  <div className="text-[8.5px] text-[#2FA862] mt-0.5">● Active</div>
                </div>
              </div>
              <div className="absolute top-[72%] left-[6%] w-[12%] z-10">
                <div className="bg-white border rounded p-2 text-[10px] shadow-sm font-mono border-[#D8454C]/40">
                  <strong className="text-[#0F1722] text-[10.5px] block">{tLabel('Refinery Billing', '虚构贸易发票链')}</strong>
                  <div className="text-[8.5px] text-[#D8454C] font-semibold mt-0.5">{tLabel('▲ Mismatch', '▲ 实物大表偏差')}</div>
                </div>
              </div>

              <div className="absolute top-[40%] left-[42%] w-[16%] z-10">
                <div className="text-[8.5px] font-black text-[#A8B2C0] uppercase font-mono mb-1.5">{tLabel('2. RESOLVER', '2. 多系统对齐解算')}</div>
                <div className="bg-[#0F1722] text-white p-3 rounded shadow-lg">
                  <div className="flex items-center gap-1.5">
                    <Network size={12} />
                    <span className="text-[11px] font-black font-mono">{tLabel('Heat-Rate Alignment', '热力物质量消偏重算')}</span>
                  </div>
                  <p className="text-[9px] text-white/70 mt-1.5 leading-snug">{tLabel('E1…E7 equations', '解算 E1–E7 时相波动差')}</p>
                  <div className="h-px bg-white/10 my-1.5" />
                  <span className="text-[8.5px] text-[#D8454C] font-black">● 5/7 equations breached</span>
                </div>
              </div>

              {[
                { y: 14, label: 'Permit Agent', labelZh: '许可初审智能体', flag: 'RED' },
                { y: 26, label: 'Tax Agent',    labelZh: '账务发票交叉体', flag: 'RED' },
                { y: 38, label: 'SCADA Agent',  labelZh: 'SCADA 物联稽核体', flag: 'AMBER' },
                { y: 54, label: 'Inspection',   labelZh: '外勤特遣研判体', flag: 'GREEN' },
                { y: 66, label: 'Sanction',     labelZh: '合规履历评估体', flag: 'AMBER' },
                { y: 78, label: 'Review',       labelZh: '多源终审复核体', flag: 'GREEN' },
              ].map((a, i) => (
                <div key={i} className="absolute w-[10%] z-10" style={{ top: `${a.y}%`, left: '72%' }}>
                  <div className={cn("bg-white border-2 rounded px-2 py-1.5 text-[10px] font-mono shadow-sm",
                    a.flag === 'RED'   ? 'border-[#D8454C]' :
                    a.flag === 'AMBER' ? 'border-[#E89518]' :
                                         'border-[#2FA862]')}>
                    <strong className="text-[#0F1722] text-[10px] block leading-tight">{tLabel(a.label, a.labelZh)}</strong>
                    <span className={cn("text-[8.5px] font-black",
                      a.flag === 'RED'   ? 'text-[#D8454C]' :
                      a.flag === 'AMBER' ? 'text-[#E89518]' :
                                           'text-[#2FA862]')}>● {a.flag}</span>
                  </div>
                </div>
              ))}

              <div className="absolute top-[42%] right-[3%] w-[12%] z-10">
                <div className="text-[8.5px] font-black text-[#A8B2C0] uppercase font-mono mb-1.5">{tLabel('3. VERDICT', '3. 终审及裁决')}</div>
                <div className="bg-[#D8454C]/5 border-2 border-[#D8454C] p-3 rounded">
                  <span className="text-[10.5px] font-black text-[#D8454C] block uppercase leading-tight">{tLabel('Master Audit', '终审研判定案')}</span>
                  <div className="text-[15px] font-mono font-black mt-1 text-[#0F1722]">P = 0.87</div>
                  <p className="text-[9px] text-[#6A7686] mt-1 leading-snug">Covert capacity leakage verified</p>
                </div>
              </div>

              <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur border border-[#E2E7EF] rounded px-2.5 py-1.5 text-[8.5px] font-mono text-[#6A7686] flex items-center gap-3">
                <span className="flex items-center gap-1"><span className="w-2.5 h-px bg-[#D8454C]" />{tLabel('Red flag', '红牌证据')}</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-px bg-[#E89518]" />{tLabel('Amber', '黄牌警报')}</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-px bg-[#2FA862]" />{tLabel('Clear', '绿区平稳')}</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-px bg-[#2D6CDF]" />{tLabel('Data flow', '交叉证据流')}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===== BOTTOM STATUS BAR ===== */}
      <div className="h-14 bg-white border-t border-[#E2E7EF] px-5 flex items-center justify-between shrink-0 select-none pb-2 pt-2">
        <div className="flex items-center gap-4 flex-1">
          <div className="text-[10px] font-black uppercase tracking-wider text-[#A8B2C0] w-[140px] shrink-0 font-mono">
            {tLabel('REGULATORY PIPELINE', '国家能源闭环督办流程泳道')}
          </div>
          <div className="flex-1 flex items-center justify-between gap-1 max-w-[1200px]">
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
                      className="flex items-center gap-2 cursor-pointer group bg-slate-50 border border-slate-100 hover:border-[#2D6CDF]/30 px-3 py-1 rounded-[4px] transition-all">
                   <span className={`w-1.5 h-1.5 rounded-full ${
                     p.status === 'RED' ? 'bg-[#D8454C] animate-pulse' :
                     p.status === 'AMBER' ? 'bg-[#E89518]' : 'bg-[#2FA862]'}`} />
                   <span className="text-[11px] font-black text-[#0F1722] font-mono group-hover:text-[#2D6CDF]">
                     {language === 'zh' ? p.label_zh : p.label_en}
                   </span>
                   <span className="text-[10px] text-[#6A7686] bg-[#FAFBFD] border border-border-default px-1 rounded">
                     {p.count.toString().padStart(2, '0')}
                   </span>
                 </div>
                 {idx < 5 && <div className="h-0.5 flex-1 bg-gradient-to-r from-slate-200 to-slate-200" />}
               </React.Fragment>
             ))}
          </div>
        </div>
        <div className="text-[10px] text-[#6A7686] font-mono ml-4 text-right shrink-0">
          <strong>33 active cases</strong> · 5 in preventive window · 0 today
        </div>
      </div>

      {/* ===== COMMERCIAL KB DRAWER ===== */}
      {drawerEnt && <CommercialDrawer ent={drawerEnt} onClose={() => setDrawerEnt(null)} tLabel={tLabel} language={language} />}
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
      <div onClick={onClose} className="fixed inset-0 bg-black/20 z-[200]" />
      <div className="fixed right-0 top-0 bottom-0 w-[520px] bg-white border-l border-[#E2E7EF] shadow-2xl z-[201] overflow-y-auto animate-slide-in">
        <div className={cn("sticky top-0 z-10 px-5 py-3.5 text-white", flagBg)}>
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
              <h2 className="text-[16px] font-black mt-1 leading-tight">{ent.legal_name_en}</h2>
              <p className="text-[11px] opacity-90 mt-0.5">{ent.legal_name_zh}</p>
            </div>
            <button onClick={onClose} className="text-white/80 hover:text-white shrink-0">
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
            <KV k={tLabel('BIN', '商业识别号')} v={ent.biz_profile.bin} mono />
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
              <div key={i} className="flex items-center justify-between py-1.5 border-b border-slate-50 last:border-0">
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
            <div className="text-[10px] text-[#6A7686] mb-2">{tLabel('Licensed Products', '许可产品')}</div>
            <div className="flex flex-wrap gap-1.5 mb-3">
              {ent.business_scope.licensed_products.map((p, i) => (
                <span key={i} className="bg-slate-100 text-[#0F1722] text-[9.5px] font-mono px-2 py-0.5 rounded">{p}</span>
              ))}
            </div>
            <div className="text-[10px] text-[#6A7686] mb-1.5">{tLabel('Nameplate vs Actual', '名义产能 vs 实际 2025')}</div>
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
              <span className="text-[#6A7686]">{tLabel('Primary Buyers', '主要买方')}</span>
              <span className="font-mono text-[#0F1722] text-right max-w-[60%] select-text">{ent.business_scope.primary_buyers.join(' · ')}</span>
            </div>
            <KV k={tLabel('Export Share', '出口比重')} v={`${ent.business_scope.export_share_pct}%`} mono />
          </Section>

          {ent.affiliates.length > 0 && (
            <Section title={tLabel('4. Affiliated Entities', '4. 关联实体网络')} icon={<Network size={12} />}>
              {ent.affiliates.map((a, i) => (
                <div key={i} className="flex items-center justify-between py-1.5 border-b border-slate-50 last:border-0">
                  <div>
                    <div className="text-[11px] font-bold text-[#0F1722]">{language === 'zh' ? a.name_zh : a.name_en}</div>
                    <div className="text-[9px] text-[#A8B2C0] font-mono">{a.relation}</div>
                  </div>
                  <span className={cn("px-1.5 py-0.5 rounded text-[8.5px] font-black font-mono border",
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
                <div key={i} className="flex items-start gap-2.5 py-1.5 border-b border-slate-50 last:border-0">
                  <span className={cn("w-1.5 h-1.5 rounded-full mt-1.5 shrink-0",
                    e.severity === 'RED' ? 'bg-[#D8454C]' :
                    e.severity === 'AMBER' ? 'bg-[#E89518]' : 'bg-[#2FA862]')} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-2">
                      <span className="text-[9.5px] font-mono text-[#A8B2C0]">{e.date}</span>
                      <span className="text-[8.5px] bg-slate-100 text-[#6A7686] px-1 rounded font-mono">{e.kind}</span>
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
                <div key={i} className="bg-slate-50 rounded p-2.5 mb-2 last:mb-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-mono font-black text-[#0F1722]">{p.case_id}</span>
                    <span className={cn("text-[8.5px] font-mono font-black px-1.5 py-0.5 rounded",
                      p.status === 'OPEN' ? 'bg-[#D8454C]/10 text-[#D8454C]' :
                      p.status === 'APPEALED' ? 'bg-[#E89518]/10 text-[#E89518]' :
                                                'bg-slate-200 text-[#6A7686]')}>{p.status}</span>
                  </div>
                  <div className="text-[10px] text-[#6A7686]">{p.date} · {p.issuing_body}</div>
                  <div className="text-[10.5px] text-[#0F1722] font-bold mt-1">{language === 'zh' ? p.reason_zh : p.reason_en}</div>
                  <div className="text-[11px] font-mono font-black text-[#D8454C] mt-0.5">{p.amount_kzt} KZT</div>
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

          <button className="w-full py-2.5 bg-[#0F1722] hover:bg-[#1A2330] text-white text-[11px] font-black uppercase tracking-wider rounded select-none">
            <Download size={11} className="inline mr-1.5" /> {tLabel('Export Full Profile (PDF)', '导出完整企业档案 (PDF)')}
          </button>
        </div>
      </div>
    </>
  );
}

function Section({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-[#E2E7EF] rounded p-3.5">
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
    <div className="flex items-start justify-between gap-3 py-0.5">
      <span className="text-[10px] text-[#6A7686] shrink-0 select-none">{k}</span>
      <span className={cn("text-[10.5px] text-right max-w-[60%] break-words select-all",
        mono ? 'font-mono' : '',
        danger ? 'text-[#D8454C] font-black' : 'text-[#0F1722] font-bold')}>{v}</span>
    </div>
  );
}
