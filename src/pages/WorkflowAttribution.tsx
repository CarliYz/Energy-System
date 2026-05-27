import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, ArrowLeft, FileText, Zap, AlertTriangle, Clock, Download,
  CheckCircle2, TrendingDown, ExternalLink, X, FileCheck, Search, Gavel, Wrench
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { useLanguage } from '../components/LanguageContext';
import { ATTRIBUTION_DATA } from '../data/attribution/case_001_attribution';

export default function WorkflowAttribution() {
  const { language } = useLanguage();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'overview' | 'workflow'>('overview');
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);

  const tLabel = (en: string, zh: string) => {
    return language === 'zh' ? zh : en;
  };

  // Pre-load hash setting from URL
  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    if (hash === 'overview' || hash === 'workflow') {
      setActiveTab(hash as any);
    }
  }, []);

  const handleTabChange = (tab: 'overview' | 'workflow') => {
    setActiveTab(tab);
    window.location.hash = tab;
  };

  const getAgentVerb = (agentId: string) => {
    switch (agentId) {
      case 'AGENT_APPROVAL': return { status: 'RED_FLAG', color: 'text-[#D8454C] border-[#D8454C]', label: tLabel('Permit Breach Found', '发现批准红区漏洞') };
      case 'AGENT_REPORTING': return { status: 'RED_FLAG', color: 'text-[#D8454C] border-[#D8454C]', label: tLabel('Invoice Discrepancy', '进油发票对比失等') };
      case 'AGENT_INSPECTION': return { status: 'YELLOW_FLAG', color: 'text-[#E89518] border-[#E89518]', label: tLabel('SCADA Drift Detected', 'SCADA 数据测点漂移') };
      case 'AGENT_SANCTION': return { status: 'RED_FLAG', color: 'text-[#D8454C] border-[#D8454C]', label: tLabel('Prior Repetitive Offenses', '查出历史累犯违规记录') };
      case 'AGENT_RECTIFICATION': return { status: 'YELLOW_FLAG', color: 'text-[#E89518] border-[#E89518]', label: tLabel('Ineffective Remediation', '整改逾期阻尼') };
      case 'AGENT_REVIEW': return { status: 'CLEAR', color: 'text-[#2FA862] border-[#2FA862]', label: tLabel('Under Review', '督办终审挂单') };
      default: return { status: 'CLEAR', color: 'text-[#2FA862] border-[#2FA862]', label: tLabel('Nominal', '常态') };
    }
  };

  const getIcon = (iconName: string, size = 18) => {
    switch (iconName) {
      case 'FileCheck': return <FileCheck size={size} />;
      case 'FileText': return <FileText size={size} />;
      case 'Search': return <Search size={size} />;
      case 'Gavel': return <Gavel size={size} />;
      case 'Wrench': return <Wrench size={size} />;
      case 'ShieldCheck': return <ShieldCheck size={size} />;
      default: return <FileText size={size} />;
    }
  };

  const selectedEvent = ATTRIBUTION_DATA.events.find(e => e.id === selectedEventId);
  const selectedAgent = ATTRIBUTION_DATA.lanes.find(l => l.agent.id === selectedAgentId)?.agent;
  const selectedAgentReasoning = selectedAgentId ? (ATTRIBUTION_DATA.agent_reasoning as any)[selectedAgentId] : null;

  return (
    <div className="flex-1 flex flex-col bg-[#F4F6FA] text-[#1A2330] font-sans overflow-hidden">
      
      {/* TOP HEADER CONTROLS (Palantir white compliance) */}
      <div className="h-14 border-b border-[#E2E7EF] bg-white flex items-center justify-between px-6 shrink-0 z-50 shadow-sm">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate('/warning/timeseries')}
            className="flex items-center gap-1.5 text-[#6A7686] hover:text-[#0F1722] pr-3 border-r border-[#E2E7EF] text-[11px] font-bold"
          >
            <ArrowLeft size={13} />
            <span>{tLabel('Back to Warning', '返回时序大模型')}</span>
          </button>
          <span className="text-[11.5px] font-black uppercase text-[#0F1722] tracking-wider">
            {tLabel('ACT II-C · MULTI-AGENT CROSS-LICENSE AUDIT & ATTRIBUTION CONSOLE', '第二幕丙 · 国家能源局跨牌照自组织智能体研判与物理追溯终端')}
          </span>
        </div>

        {/* Dynamic Hash Swapper Tabs */}
        <div className="flex h-9 bg-slate-100 border border-border-default rounded p-0.5 select-none shrink-0 scale-95">
          <button 
            onClick={() => handleTabChange('overview')}
            className={cn("px-4 py-1 text-[10.5px] font-black rounded uppercase transition-all", activeTab === 'overview' ? "bg-white text-[#2D6CDF] shadow" : "text-[#6A7686] hover:text-[#0F1722]")}
          >
            {tLabel('1. Overview Grid', '1. 贝叶斯证据链集成大图')}
          </button>
          <button 
            onClick={() => handleTabChange('workflow')}
            className={cn("px-4 py-1 text-[10.5px] font-black rounded uppercase transition-all", activeTab === 'workflow' ? "bg-white text-[#2D6CDF] shadow" : "text-[#6A7686] hover:text-[#0F1722]")}
          >
            {tLabel('2. Multi-Agent DAG Simulator', '2. 自愈流多智能计算拓扑图')}
          </button>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 bg-[#0F1722] text-white text-[8px] font-bold rounded-sm uppercase tracking-wider font-mono">CASE-2026-001</span>
          <span className="px-2 py-0.5 bg-[#D8454C] text-white text-[8px] font-bold rounded-sm uppercase tracking-wider font-mono">POSTERIOR 0.87</span>
        </div>
      </div>

      {activeTab === 'overview' ? (
        <div className="flex-1 flex flex-col overflow-hidden">
          
          {/* CORE SUBJECT STRIP (Palantir style, 76px tall) */}
          <div className="h-20 bg-white border-b border-[#E2E7EF] px-6 py-2 grid grid-cols-4 gap-4 shrink-0 shadow-sm leading-tight select-none">
            <div className="flex flex-col justify-center border-r border-slate-100 pr-4">
              <span className="text-[8.5px] text-[#A8B2C0] uppercase font-black font-mono">{tLabel('Subject Enterprise', '被罚主体公司')}</span>
              <div className="font-bold text-[#0F1722] text-[12.5px] mt-0.5 truncate">Western Caspian Energy LLC</div>
              <span className="text-[9.5px] text-[#6A7686] font-mono">ENT-KZ-AKT-0091 · Petrol Refinery / Upstream</span>
            </div>
            <div className="flex flex-col justify-center border-r border-slate-100 pr-4 pl-2">
              <span className="text-[8.5px] text-[#A8B2C0] uppercase font-black font-mono">{tLabel('Triggering Anomaly Log', '触发源头警兆物证')}</span>
              <div className="font-bold text-[#0F1722] text-[12.5px] mt-0.5 truncate">ANO-2026-0512 (Aktau GCS-001)</div>
              <span className="text-[9.5px] text-[#D8454C] font-mono font-bold">Outlet pressure +3.7σ deviation above baseline</span>
            </div>
            <div className="flex flex-col justify-center border-r border-slate-100 pr-4 pl-2">
              <span className="text-[8.5px] text-[#A8B2C0] uppercase font-black font-mono">{tLabel('Subject Facility', '在册异常监管设施')}</span>
              <div className="font-bold text-[#1A2330] text-[12.5px] mt-0.5 truncate">Aktau Core Main Station</div>
              <span className="text-[9.5px] text-[#6A7686] font-mono">FAC-KZ-AKT-GCS-001 / GAS_COMPRESSOR</span>
            </div>
            <div className="flex flex-col justify-center pl-2">
              <span className="text-[8.5px] text-[#A8B2C0] uppercase font-black font-mono">{tLabel('Attribution Window', '回溯跨系统审计程区间')}</span>
              <div className="font-bold text-[#0F1722] text-[12.5px] mt-0.5">2025-06-01 至 2026-05-28</div>
              <span className="text-[9.5px] text-[#2D6CDF] font-mono">12 Months rolling · 27 high-dimension events matched</span>
            </div>
          </div>

          <div className="flex-1 flex overflow-hidden">
            {/* 1. AGENTS LEFT BAR (Width 580px, strictly readable labels) */}
            <div className="w-[580px] border-r border-[#E2E7EF] bg-white flex flex-col shrink-0 overflow-y-auto no-scrollbar">
              <div className="p-4 border-b border-[#E2E7EF] bg-slate-50/50 flex justify-between items-center text-[10px] font-black text-[#6A7686] uppercase tracking-wider shrink-0 select-none">
                <span>{tLabel('Active Agent Lanes', '在设多牌照多层智能体信息')}</span>
                <span>{tLabel('Verdict / Confidence', '研判性质与其贝叶斯概率')}</span>
              </div>

              {ATTRIBUTION_DATA.lanes.map((lane, idx) => {
                const verbInfo = getAgentVerb(lane.agent.id);
                return (
                  <div 
                    key={lane.id}
                    onClick={() => setSelectedAgentId(lane.agent.id)}
                    className={cn(
                      "h-24 p-5 border-b border-[#E2E7EF] flex items-center justify-between hover:bg-[#FAFBFD] cursor-pointer transition-all relative select-none",
                      selectedAgentId === lane.agent.id ? "bg-[#2D6CDF]/5 border-r-4 border-r-[#2D6CDF]" : ""
                    )}
                  >
                    <div className="flex items-center gap-4.5 flex-1 pr-4">
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-[#2D6CDF] shadow-inner font-mono">
                        {getIcon(lane.icon, 18)}
                      </div>
                      <div className="space-y-1">
                        <div className="font-black text-[#0F1722] text-[14.5px] tracking-tight uppercase">
                          {tLabel(lane.label_en, lane.label_en)}
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

            {/* 2. REGULATORY TIMELINE (SVG representation of past occurrences) */}
            <div className="flex-1 overflow-x-auto relative bg-[#FCFDFE] p-6 shadow-inner">
              <div className="text-[10px] font-black text-[#A8B2C0] uppercase tracking-wider mb-4 select-none">
                {tLabel('12-Month Cross-License High-Density Audit Log Stream', '过去 12 个月内各模块已匹配记录之物理事件（点击点查看元数据详情）')}
              </div>

              {/* Vector SVG timeline map */}
              <div className="relative border border-[#E2E7EF] rounded bg-white p-4 h-[400px]">
                <div className="absolute top-1/2 left-0 right-0 h-[1.5px] bg-[#E2E7EF] translate-y-[-50%]" />
                
                {/* 12 pillars for months */}
                <div className="absolute inset-x-0 top-0 bottom-0 grid grid-cols-12 pointer-events-none">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <div key={i} className="border-r border-slate-100/60 h-full relative">
                      <span className="absolute bottom-2 left-2 text-[8px] font-mono font-bold text-[#A8B2C0]">
                        {2025 + Math.floor((5 + i) / 12)}-{String(((5 + i) % 12) + 1).padStart(2, '0')}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Simulated events */}
                <div className="absolute top-[25%] left-[20%] z-10">
                  <div 
                    onClick={() => setSelectedEventId('EV-01')}
                    className="w-4 h-4 rounded-full bg-[#E89518] border-2 border-white shadow-md cursor-pointer hover:scale-125 transition-transform"
                    title="SCADA Drift"
                  />
                  <span className="text-[7.5px] font-mono text-[#6A7686] absolute top-5 -left-4 whitespace-nowrap">2025-08-12</span>
                </div>

                <div className="absolute top-[45%] left-[65%] z-10">
                  <div 
                    onClick={() => setSelectedEventId('EV-02')}
                    className="w-5 h-5 rounded-full bg-[#D8454C] border-2 border-white shadow-md cursor-pointer hover:scale-125 transition-transform animate-pulse"
                    title="Invoice Mismatch"
                  />
                  <span className="text-[7.5px] font-mono text-[#6A7686] absolute top-6 -left-4 whitespace-nowrap">2026-02-18</span>
                </div>

                <div className="absolute top-[65%] left-[85%] z-10">
                  <div 
                    onClick={() => setSelectedEventId('EV-03')}
                    className="w-4 h-4 rounded-full bg-[#D8454C] border-2 border-white shadow-md cursor-pointer hover:scale-125 transition-transform"
                    title="Capacity limit breached"
                  />
                  <span className="text-[7.5px] font-mono text-[#6A7686] absolute top-5 -left-4 whitespace-nowrap">2026-04-22</span>
                </div>

                {/* Middle hover indicator note */}
                <div className="absolute top-6 left-6 text-[10.5px] font-bold text-[#2D6CDF] bg-[#2D6CDF]/5 px-3 py-1.5 rounded border border-[#2D6CDF]/20">
                  💡 {tLabel('Hover or click dot markers to inspect raw evidentiary documents & SCADA files.', '💡 提示：点击时间线上黄色口径点或粉色警示标记，直接查看对应数采、纳税或设备原始档案。')}
                </div>
              </div>

              {/* Output Drawer when click event occurs */}
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
                          : tLabel('Company invoice reported raw volumes +17.5% over the registry limits defined in permit MoE-2401.', '该公司增值税纳税进销项进油量计算，反推其实际炼化大负荷通过已达名义极限 117.5%，超过环保准许限制。')
                        }
                      </p>
                    </div>

                    <button onClick={() => setSelectedEventId(null)} className="text-[#6A7686] hover:text-[#0F1722] font-bold text-[11px]">
                      ✕ {tLabel('Close Close', '关闭元数据')}
                    </button>
                  </div>
                </div>
              )}

            </div>

            {/* 3. MASTER DECISION RATIONALE PANEL */}
            <div className="w-[320px] border-l border-[#E2E7EF] bg-[#FAFBFD] p-5 flex flex-col justify-between shrink-0 overflow-y-auto">
              <div className="space-y-5">
                <div className="border-b border-slate-200 pb-3">
                  <span className="text-[10px] font-black text-[#A8B2C0] uppercase tracking-wider">{tLabel('Bayesian Root Cause', '贝叶斯综合终审主因判定')}</span>
                  <h3 className="text-[16px] font-black text-[#D8454C] mt-1 leading-tight uppercase">
                    {tLabel('Covert Capacity Expansion', '蓄意瞒报产能、超规加压')}
                  </h3>
                  <p className="text-[11px] text-[#6A7686] mt-1.5 leading-snug">
                    {tLabel(
                      'AI evaluated 6 lanes of data. The likelihood of physical sensor drift alone is insufficient (<13%). Overproduction has posterior probability P=0.87.',
                      '经边缘审计智能体联合校验，物理常态泄漏及仪表单向漂移的拟合度不足13%，高置信判定属实质性越位超产超规运营。'
                    )}
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="text-[9.5px] font-bold text-[#6A7686] uppercase tracking-wider">{tLabel('Lanes Evidence Breakdown', '各牌照分析特征链一览')}</div>
                  
                  <div className="bg-white border rounded p-3 text-[11px] space-y-1">
                    <div className="flex justify-between font-bold text-[#0F1722]">
                      <span>1. Permit Registry Agent</span>
                      <span className="text-[#D8454C]">RED FLAG</span>
                    </div>
                    <div className="text-[#6A7686] text-[10px]">{tLabel('Installed motor size exceeds registered limit.', '核定压缩机电枢额定电机马力与工商登记严重穿透失等')}</div>
                  </div>

                  <div className="bg-white border rounded p-3 text-[11px] space-y-1">
                    <div className="flex justify-between font-bold text-[#0F1722]">
                      <span>2. Tax & Invoice Agent</span>
                      <span className="text-[#D8454C]">RED FLAG</span>
                    </div>
                    <div className="text-[#6A7686] text-[10px]">{tLabel('Billing items mismatch reported volumes.', '财务进项用电、用能与月报环保量发生物理冲突偏离')}</div>
                  </div>

                  <div className="bg-white border rounded p-3 text-[11px] space-y-1">
                    <div className="flex justify-between font-bold text-[#0F1722]">
                      <span>3. SCADA Sensor Audit</span>
                      <span className="text-[#E89518]">AMBER FLAG</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-[#0F1722] text-white p-3.5 rounded text-[11.5px] leading-snug mt-4">
                <strong>{tLabel('REGULATORY CLOSURE DIRECTIVE', '国家闭环大一统行动指令')}</strong>
                <p className="text-white/75 text-[10.5px] mt-1.5">
                  {tLabel(
                    'Triggered automatic audit tracking. Request field intervention with 36H. Forward to regional prosecutors Office of Aktau.',
                    '行政督办案号已一键生成，并自动呈递巴甫洛达尔及阿克套地方督察检察院，36H内执行限制加压检查。'
                  )}
                </p>
              </div>
            </div>

          </div>

        </div>
      ) : (
        /* WORKFLOW DIAGRAM SIMULATOR TAB */
        <div className="flex-1 p-6 flex flex-col justify-between overflow-y-auto">
          <div className="bg-white rounded border border-[#E2E7EF] p-5 shadow-sm flex-1 flex flex-col min-h-[500px]">
            <div className="border-b border-[#E2E7EF] pb-3 mb-4 select-none shrink-0">
              <h3 className="text-[15px] font-black text-[#0F1722]">
                {tLabel('ACT II-D · AGENT AUDIT TOPOLOGY GRAPH SIMULATOR', '核对中枢 · 跨系统多牌照智能体自组织拓扑联合计算网络 (Compute DAG)')}
              </h3>
              <p className="text-[11px] text-[#6A7686] mt-1">
                {tLabel('Illustrating the directional evidence flows between database, resolvers, and master agents.', '还原被审计企业全景：数采流入 ➔ 物理对齐 ➔ 贝叶斯概率推理 ➔ 主管部门决策一键通达')}
              </p>
            </div>

            {/* Simulated interactive DAG */}
            <div className="flex-1 relative bg-slate-50/50 rounded border border-[#E2E7EF] p-4 flex flex-col justify-center">
              <div className="grid grid-cols-5 gap-4 relative select-none">
                
                {/* Stage 1 */}
                <div className="space-y-3.5">
                  <div className="text-[9.5px] font-black text-[#A8B2C0] uppercase font-mono border-b pb-1.5">1. DATA INGESTS</div>
                  <div className="bg-white border p-2.5 rounded text-[10.5px] shadow-sm font-mono text-[#6A7686] hover:border-[#2D6CDF] cursor-pointer">
                    <strong className="text-[#0F1722]">MoE Permit Database</strong>
                    <div className="text-[9px] text-[#2FA862] mt-0.5">● Active / Clean [2,147 entries]</div>
                  </div>
                  <div className="bg-white border p-2.5 rounded text-[10.5px] shadow-sm font-mono text-[#6A7686] hover:border-[#2D6CDF] cursor-pointer">
                    <strong className="text-[#0F1722]">KEGOC MWh Dispatch</strong>
                    <div className="text-[9px] text-[#2FA862] mt-0.5">● Active [12kV Sub grid]</div>
                  </div>
                  <div className="bg-white border p-2.5 rounded text-[10.5px] shadow-sm font-mono text-[#6A7686] hover:border-[#2D6CDF] cursor-pointer">
                    <strong className="text-[#0F1722]">Refinery Billing logs</strong>
                    <div className="text-[9px] text-[#D8454C] font-semibold mt-0.5">▲ Invoice discrepancy matched</div>
                  </div>
                </div>

                {/* Arrow dummy connector */}
                <div className="flex items-center justify-center">
                  <div className="text-slate-300 text-2xl">➔</div>
                </div>

                {/* Stage 2 */}
                <div className="space-y-4 flex flex-col justify-center">
                  <div className="text-[9.5px] font-black text-[#A8B2C0] uppercase font-mono border-b pb-1.5">2. IDENTRESOLVERS</div>
                  <div className="bg-[#0F1722] text-white p-4 rounded shadow">
                    <span className="text-[12px] font-black font-mono">Heat-Rate Alignment</span>
                    <p className="text-[10px] text-white/70 mt-1">Computes cross-system equations: E1, E2, E3, E4, E5, E6, E7</p>
                    <div className="h-[1px] bg-white/10 my-2" />
                    <span className="text-[9px] text-[#D8454C] font-black">● 5 of 7 Equations breached</span>
                  </div>
                </div>

                {/* Arrow dummy connector */}
                <div className="flex items-center justify-center">
                  <div className="text-slate-300 text-2xl">➔</div>
                </div>

                {/* Stage 3 */}
                <div className="space-y-4 flex flex-col justify-center">
                  <div className="text-[9.5px] font-black text-[#A8B2C0] uppercase font-mono border-b pb-1.5">3. MASTER VERDICT</div>
                  <div className="bg-[#D8454C]/5 border-2 border-[#D8454C] p-4 rounded text-[#1A2330]">
                    <span className="text-[12.5px] font-black text-[#D8454C] block uppercase">MASTER AUDIT DECISION</span>
                    <div className="text-[14px] font-mono font-black mt-1">Posterior Prob = 0.87</div>
                    <p className="text-[10.5px] text-[#6A7686] mt-1 leading-snug">Confidence score high. Covert capacity leakage fingerprint verified. Initiating closing dispatch.</p>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      )}

      {/* BOTTOM PIPELINE STATUS BAR */}
      <div className="h-14 bg-white border-t border-[#E2E7EF] px-5 flex items-center justify-between shrink-0 select-none pb-2 pt-2">
        <div className="flex items-center gap-4 flex-1">
          <div className="text-[10px] font-black uppercase tracking-wider text-[#A8B2C0] w-[140px] shrink-0 font-mono">
            {tLabel('REGULATORY PIPELINE', '国家能源闭环督办流程泳道')}
          </div>
          
          <div className="flex-1 flex items-center justify-between gap-1 max-w-[1200px]">
             {/* 6 Stage list */}
             {[
               { label_en: 'DETECT', label_zh: '触发建档', count: 12, status: 'RED' },
               { label_en: 'ATTRIBUTE', label_zh: '研判归因', count: 8, status: 'AMBER' },
               { label_en: 'DISPATCH', label_zh: '极速外勤派单', count: 5, status: 'GREEN' },
               { label_en: 'RESOLVE', label_zh: '整改核算', count: 3, status: 'GREEN' },
               { label_en: 'REVIEW', label_zh: '行政复核', count: 2, status: 'GREEN' },
               { label_en: 'ARCHIVE', label_zh: '案件归档', count: 1, status: 'GREEN' },
             ].map((p, idx) => (
               <React.Fragment key={idx}>
                 <div 
                   onClick={() => navigate('/closure/effectiveness')}
                   className="flex items-center gap-2 cursor-pointer group bg-slate-50 border border-slate-100 hover:border-[#2D6CDF]/30 px-3 py-1 rounded-[4px] transition-all"
                 >
                   <span className={`w-1.5 h-1.5 rounded-full ${
                     p.status === 'RED' ? 'bg-[#D8454C] animate-pulse' : p.status === 'AMBER' ? 'bg-[#E89518]' : 'bg-[#2FA862]'
                   }`} />
                   <span className="text-[11px] font-black text-[#0F1722] font-mono group-hover:text-[#2D6CDF]">
                     {language === 'zh' ? p.label_zh : p.label_en}
                   </span>
                   <span className="text-[10px] text-[#6A7686] bg-[#FAFBFD] border border-border-default px-1 rounded">
                     {p.count.toString().padStart(2, '0')}
                   </span>
                 </div>
                 {idx < 5 && (
                   <div className="h-0.5 flex-1 bg-gradient-to-r from-slate-200 to-slate-200" />
                 )}
               </React.Fragment>
             ))}
          </div>
        </div>

        <div className="text-[10px] text-[#6A7686] font-mono ml-4 text-right shrink-0">
          <strong>33 active cases</strong> · 5 in preventive window · 0 today
        </div>
      </div>

    </div>
  );
}
