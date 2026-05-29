// src/pages/ConsumptionStructure.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Activity, 
  TrendingUp, 
  Layers, 
  PlusSquare, 
  Bell, 
  HelpCircle, 
  AlertTriangle,
  FileCheck,
  Send,
  Eye,
  Info,
  X
} from 'lucide-react';
import { useLanguage } from '../components/LanguageContext';
import { topoData, TopoNode, TopoLink } from '../data/consumption_topology';

export default function ConsumptionStructure() {
  const { t, language } = useLanguage();
  const navigate = useNavigate();

  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [showRightPanel, setShowRightPanel] = useState(false);

  // Setup vertical offsets dynamically to stagger nicely in 750px high canvas
  const getCoordinates = (node: TopoNode, index: number, total: number) => {
    // 4 Layers. Layout width is 1150px. Height is 720px.
    const canvasWidth = 1200;
    const canvasHeight = 680;
    
    let x = 80;
    if (node.layer === 1) x = 80;
    else if (node.layer === 2) x = 390;
    else if (node.layer === 3) x = 720;
    else if (node.layer === 4) x = 1030;

    // Center vertical spacing
    const spacing = canvasHeight / (total + 1);
    const y = spacing * (index + 1);

    return { x, y };
  };

  // Group nodes by layer to calculate index-based spacing
  const layer1Nodes = topoData.nodes.filter(n => n.layer === 1);
  const layer2Nodes = topoData.nodes.filter(n => n.layer === 2);
  const layer3Nodes = topoData.nodes.filter(n => n.layer === 3);
  const layer4Nodes = topoData.nodes.filter(n => n.layer === 4);

  const getNodePosAndInfo = (nodeId: string) => {
    const node = topoData.nodes.find(n => n.id === nodeId);
    if (!node) return { x: 0, y: 0, node: null };
    
    let idx = 0;
    let total = 1;
    if (node.layer === 1) {
      idx = layer1Nodes.findIndex(n => n.id === nodeId);
      total = layer1Nodes.length;
    } else if (node.layer === 2) {
      idx = layer2Nodes.findIndex(n => n.id === nodeId);
      total = layer2Nodes.length;
    } else if (node.layer === 3) {
      idx = layer3Nodes.findIndex(n => n.id === nodeId);
      total = layer3Nodes.length;
    } else if (node.layer === 4) {
      idx = layer4Nodes.findIndex(n => n.id === nodeId);
      total = layer4Nodes.length;
    }

    const coords = getCoordinates(node, idx, total);
    return { ...coords, node };
  };

  // Is link connected to hovered node?
  const isLinkHighlighted = (link: TopoLink) => {
    if (!hoveredNodeId) return false;
    return link.source === hoveredNodeId || link.target === hoveredNodeId;
  };

  // Handle drilldowns on click
  const handleNodeClick = (node: TopoNode) => {
    setSelectedNodeId(node.id);
    if (node.layer === 1) {
      navigate('/sensing/regional/aktau');
    } else if (node.layer === 3) {
      navigate('/warning/sentiment');
    } else if (node.layer === 4) {
      // jump into risk warning
      navigate('/audit/event/CASE-2026-NEW');
    }
  };

  // Analyze points structured elegantly as list bullets (without content alterations)
  const analysisPointsZh = [
    "2026年5月28日 06:00 全国能源网络全景穿透显示：",
    "上游 Tengiz 主力油田累计已开采储量过高，剩余寿限降至 17.4 年，触碰战略防御储备红线；",
    "下游民用车用油和算力芯片高耗能（AI 算力与 Token 负载）较今日标准用电基度激增 61.9%，导致本地变压配电系统处于极限重载状态；",
    "未来 7 天全国边际能量差值偏置量预计达 -3.2%；",
    "极大概率迫使局部公用事业用汽与电价大幅溢开，若无平抑策略，可能引发高度关联的地方舆情恐慌和自发性抗议骚乱事件。"
  ];

  const analysisPointsEn = [
    "Based on multi-layer simulation model on 2026-05-28 06:00:",
    "Tengiz oilfield remaining life is under 17.4 years, moving it into strategic reserve planning horizon;",
    "AI data centers & workloads have spiked +61.9% over national consumer base, mostly due to newly commissioned clusters in Almaty and Aktau;",
    "Future 7-day total net supply-demand shortfall is projected at -3.2%;",
    "Creating a high probability risk of local electricity/heating price tariff escalations, potentially provoking widespread public unrest and sentiment fallout."
  ];

  return (
    <div className="flex-1 bg-[#F9FAFB] p-6 space-y-6 flex flex-col min-h-screen">
      {/* 1. Header (Trigger is now moved to the chart card) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-border-default shrink-0">
        <div>
          <h1 className="text-3xl font-black text-[#1F2937] uppercase tracking-tight">
            {t('Consumption Structure')}
          </h1>
          <p className="text-xs text-text-secondary mt-1">
            {language === 'zh' 
              ? '4层透视：能源供给层（L1） ➔ 调度配置层（L2） ➔ 终端消费层（L3） ➔ 危机预警层（L4）' 
              : '4-Tier Deep Network: Resource Output (L1) ➔ Dispatch (L2) ➔ Demand Baselining (L3) ➔ Systemic Risk (L4)'}
          </p>
        </div>
      </div>

      {/* 2. Top KPI Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 shrink-0">
        {/* KPI 1: Energy Self Sufficiency */}
        <div className="bg-white border border-[#E5E7EB] rounded-[4px] p-4 flex flex-col justify-between h-[90px]">
          <span className="text-[10px] font-black uppercase text-text-secondary">{t('Energy Self-Sufficiency')}</span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-black text-[#2FA862] tabular-nums">{topoData.selfSufficiency}</span>
            <span className="text-[10px] text-text-tertiary font-mono">2026.Q2 TARGET</span>
          </div>
        </div>

        {/* KPI 2: Today Supply / Demand Balance */}
        <div className="bg-white border border-[#E5E7EB] rounded-[4px] p-4 flex flex-col justify-between h-[90px]">
          <span className="text-[10px] font-black uppercase text-text-secondary">{t('Today Supply / Demand')}</span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-black text-[#2D6CDF] tabular-nums">1,847<span className="text-xs font-normal text-text-tertiary"> / 1,793</span></span>
            <span className="text-[10px] text-[#2FA862] font-mono font-bold">+54 ktoe (Surplus)</span>
          </div>
        </div>

        {/* KPI 3: 7-Day Gap Forecast */}
        <div className="bg-white border border-[#E5E7EB] rounded-[4px] p-4 flex flex-col justify-between h-[90px]">
          <span className="text-[10px] font-black uppercase text-text-secondary">{t('7-Day Gap Forecast')}</span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-black text-[#D8454C] tabular-nums">{topoData.gap7Days}</span>
            <span className="text-[10px] text-[#D8454C] font-mono font-bold">Deficit Warning</span>
          </div>
        </div>

        {/* KPI 4: Pending Sentiment Case Count */}
        <div className="bg-white border border-[#E5E7EB] rounded-[4px] p-4 flex flex-col justify-between h-[90px]">
          <span className="text-[10px] font-black uppercase text-text-secondary">{t('Pending Sentiment Cases')}</span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-black text-[#E89518] tabular-nums">4 <span className="text-xs font-normal text-text-tertiary">Cases</span></span>
            <span className="text-[10px] text-text-tertiary font-mono">Unresolved</span>
          </div>
        </div>
      </div>

      {/* 3. Main Split Container (Adaptive layouts) */}
      <div className="flex flex-col lg:flex-row gap-6 flex-1 items-stretch min-h-0">
        
        {/* Left Side: Topology Container */}
        <div 
          className={`bg-white border border-[#E5E7EB] rounded-[4px] p-6 relative flex flex-col select-none overflow-x-auto transition-all duration-350 min-h-[720px] ${
            showRightPanel ? 'flex-1 lg:max-w-[calc(100%-430px)]' : 'w-full'
          }`}
        >
          {/* Legend indicator (aligned left) */}
          <div className="absolute top-4 left-6 flex gap-4 text-[10px] font-black text-text-secondary pb-4 z-30">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#1F2937]/10 border border-slate-300 inline-block" /> L1 · {language === 'zh' ? '能源供给' : 'Source'}</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#2D6CDF]/10 border border-[#2D6CDF]/30 inline-block" /> L2 · {language === 'zh' ? '转换与计算' : 'Compute'}</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#E89518]/10 border border-[#E89518]/30 inline-block" /> L3 · {language === 'zh' ? '民商用基线' : 'Demand'}</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#D8454C]/10 border border-[#D8454C]/30 inline-block" /> L4 · {language === 'zh' ? '预警控制点' : 'Risk'}</span>
          </div>

          {/* Trigger button placed in the top-right corner of the actual chart */}
          <div className="absolute top-4 right-6 flex items-center gap-4 z-45">
            <span className="text-[10px] text-text-tertiary font-mono hidden xl:inline">
              {language === 'zh' ? '* 点击资源/需求/控制节点可下钻联动分析' : '* Click nodes to initiate live analyses'}
            </span>
            <button 
              onClick={() => setShowRightPanel(!showRightPanel)}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-[4px] text-xs font-black tracking-wider uppercase shadow-sm transition-all cursor-pointer ${
                showRightPanel 
                  ? 'bg-[#2D6CDF] text-white hover:bg-opacity-95' 
                  : 'bg-bg-dark text-white hover:bg-opacity-90'
              }`}
            >
              <Layers size={12} />
              {t('AI Penetration Insight')}
            </button>
          </div>

          {/* Canvas Wrapper */}
          <div className="w-[1240px] h-[690px] mx-auto relative mt-8">
            {/* SVG Connection Paths */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
              {topoData.links.map((link, idx) => {
                const from = getNodePosAndInfo(link.source);
                const to = getNodePosAndInfo(link.target);
                
                if (!from.node || !to.node) return null;

                // Cubic bezier control point adjustment
                const dx = to.x - from.x;
                const startX = from.node.layer === 4 ? from.x : from.x + 190; // Add width of source card
                const startY = from.y;
                const endX = to.node.layer === 4 ? to.x - 48 : to.x; // Sub risk circle radius
                const endY = to.y;

                const c1x = startX + dx * 0.45;
                const c1y = startY;
                const c2x = startX + dx * 0.55;
                const c2y = endY;

                const pathD = `M ${startX} ${startY} C ${c1x} ${c1y}, ${c2x} ${c2y}, ${endX} ${endY}`;
                
                // Determine line colors
                let color = '#E5E7EB';
                if (link.colorType === 'blue') color = '#2D6CDF';
                else if (link.colorType === 'red') color = '#D8454C';
                else if (link.colorType === 'gray') color = '#9CA3AF';

                const isHighlighted = isLinkHighlighted(link);
                const hasHover = hoveredNodeId !== null;

                return (
                  <g key={idx}>
                    <path
                      d={pathD}
                      fill="none"
                      stroke={color}
                      strokeWidth={isHighlighted ? link.width + 2.5 : link.width}
                      strokeOpacity={hasHover ? (isHighlighted ? 0.95 : 0.04) : 0.38}
                      className="transition-all duration-300"
                    />
                    {isHighlighted && (
                      <circle r="4" fill={color}>
                        <animateMotion path={pathD} dur="2.2s" repeatCount="indefinite" />
                      </circle>
                    )}
                  </g>
                );
              })}
            </svg>

            {/* Interactive Nodes Layer */}
            <div className="absolute inset-0 z-20 pointer-events-none">
              {topoData.nodes.map((node) => {
                let idx = 0;
                let total = 1;
                if (node.layer === 1) {
                  idx = layer1Nodes.findIndex(n => n.id === node.id);
                  total = layer1Nodes.length;
                } else if (node.layer === 2) {
                  idx = layer2Nodes.findIndex(n => n.id === node.id);
                  total = layer2Nodes.length;
                } else if (node.layer === 3) {
                  idx = layer3Nodes.findIndex(n => n.id === node.id);
                  total = layer3Nodes.length;
                } else if (node.layer === 4) {
                  idx = layer4Nodes.findIndex(n => n.id === node.id);
                  total = layer4Nodes.length;
                }

                const { x, y } = getCoordinates(node, idx, total);
                const isHovered = hoveredNodeId === node.id;
                const hasHover = hoveredNodeId !== null;
                
                // Determine opacity scaling based on hovered state
                let opacityClass = "opacity-100";
                if (hasHover) {
                  const isConnected = topoData.links.some(
                    l => (l.source === node.id && l.target === hoveredNodeId) || 
                         (l.target === node.id && l.source === hoveredNodeId) ||
                         node.id === hoveredNodeId
                  );
                  opacityClass = isConnected ? "opacity-100" : "opacity-30";
                }

                // Normal Card Design or special Risk node design
                if (node.layer === 4) {
                  return (
                    <div
                      key={node.id}
                      className={`absolute pointer-events-auto cursor-pointer transition-all duration-300 ${opacityClass}`}
                      style={{ left: `${x - 110}px`, top: `${y - 110}px`, width: '220px', height: '220px' }}
                      onMouseEnter={() => setHoveredNodeId(node.id)}
                      onMouseLeave={() => setHoveredNodeId(null)}
                    >
                      {/* Pulsing Outer boundary */}
                      <div className="w-full h-full flex flex-col items-center justify-center rounded-full border border-[#D8454C] bg-white p-4 text-center select-none shadow-md hover:shadow-xl transition-all relative">
                        <div className="absolute inset-2 border border-dashed border-[#D8454C]/50 rounded-full animate-spin [animation-duration:30s]" />
                        
                        <AlertTriangle className="text-[#D8454C] animate-bounce mb-1" size={24} />
                        <span className="text-[10px] font-black uppercase tracking-wider text-[#D8454C]">{t('BREACH')}</span>
                        <h4 className="text-[11px] font-black text-text-primary mt-1 leading-tight px-1">
                          {language === 'zh' ? node.label_zh : node.label}
                        </h4>

                        {/* Detail points - Translated correctly now */}
                        <div className="mt-2 space-y-0.5 text-[9px] text-[#A8B2C0] font-mono leading-none">
                          <div>
                            {language === 'zh' ? '油价/Gas Limit' : 'Gas Limit/Tariff'}:{' '}
                            <span className="text-red-550 font-bold">+6.8%</span>
                          </div>
                          <div>
                            {language === 'zh' ? '电价/Power Limit' : 'Power Limit/Tariff'}:{' '}
                            <span className="text-red-555 font-bold">+4.2%</span>
                          </div>
                          <div>
                            {language === 'zh' ? '恐慌基度/Panic' : 'Panic Index'}:{' '}
                            <span className="text-red-560 font-bold">0.73</span>
                          </div>
                        </div>

                        {/* Action trigger buttons inside node */}
                        <div className="mt-3 flex gap-1 w-full justify-center z-30">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate('/audit/event/CASE-2026-NEW');
                            }}
                            className="px-2 py-1 text-[8.5px] border border-[#2D6CDF] text-[#2D6CDF] hover:bg-[#2D6CDF] hover:text-white rounded-[2px] cursor-pointer transition-colors"
                          >
                            {language === 'zh' ? '一键立案' : 'File Case'}
                          </button>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate('/warning/sentiment');
                            }}
                            className="px-2 py-1 text-[8.5px] border border-[#D8454C] text-[#D8454C] hover:bg-[#D8454C] hover:text-white rounded-[2px] cursor-pointer transition-colors"
                          >
                            {language === 'zh' ? '推送舆情' : 'Push Buzz'}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                }

                return (
                  <div
                    key={node.id}
                    className={`absolute pointer-events-auto cursor-pointer p-3 bg-white border rounded-[4px] shadow-sm select-none hover:shadow-md transition-all duration-300 ${opacityClass}`}
                    style={{ 
                      left: `${x}px`, 
                      top: `${y - 45}px`, 
                      width: '210px', 
                      height: '90px',
                      borderColor: isHovered 
                        ? '#2D6CDF' 
                        : (node.id === 'p_b_03' || node.id === 'p_e_03' ? '#D8454C' : '#E5E7EB'),
                      borderWidth: isHovered ? '2px' : '1px'
                    }}
                    onMouseEnter={() => setHoveredNodeId(node.id)}
                    onMouseLeave={() => setHoveredNodeId(null)}
                    onClick={() => handleNodeClick(node)}
                  >
                    <div className="flex flex-col h-full justify-between">
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold text-text-primary uppercase truncate max-w-[140px]">
                            {language === 'zh' ? node.label_zh : node.label}
                          </span>
                          
                          <span className={`w-2 h-2 rounded-full ${
                            node.id.startsWith('risk_') || node.secondaryInfo?.includes('+')
                              ? 'bg-[#D8454C]'
                              : (node.secondaryInfo?.includes('warning') || node.secondaryInfo?.includes('+5.7%') ? 'bg-[#E89518]' : 'bg-[#2FA862]')
                          }`} />
                        </div>
                        
                        <div className="text-[9px] text-text-tertiary mt-1 flex items-center justify-between font-mono">
                          <span>{language === 'zh' ? node.metricLabel_zh : node.metricLabel}</span>
                          <span className="font-bold text-text-primary text-[10.5px] tabular-nums">{node.metricVal}</span>
                        </div>
                      </div>

                      {/* L1 Progress bar indicator */}
                      {node.layer === 1 && node.percent !== undefined ? (
                        <div>
                          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                            <div 
                              className="bg-[#2D6CDF] h-full" 
                              style={{ width: `${node.percent}%` }}
                            />
                          </div>
                          <div className="flex items-center justify-between text-[8px] text-text-tertiary font-mono mt-0.5">
                            <span>{language === 'zh' ? '已开采 vs 储量' : 'Extracted vs Reserves'}</span>
                            <span>{node.percent}%</span>
                          </div>
                        </div>
                      ) : (
                        <div className="text-[8.5px] text-text-secondary truncate mt-1">
                          {language === 'zh' ? node.secondaryInfo_zh : node.secondaryInfo}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Side: AI Insight Vertical Card */}
        {showRightPanel && (
          <div className="w-full lg:w-[410px] shrink-0 animate-in slide-in-from-right duration-300">
            <div className="bg-white border border-[#E5E7EB] rounded-[4px] h-full flex flex-col shadow-sm select-text overflow-hidden">
              {/* Sticky Header of the card */}
              <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50 shrink-0">
                <span className="text-xs font-black uppercase text-[#0F1722] tracking-wider flex items-center gap-1.5 select-none">
                  <span className="w-2 h-2 rounded-full bg-[#2D6CDF] animate-pulse" />
                  {t('AI Penetration Insight')}
                </span>
                <button 
                  onClick={() => setShowRightPanel(false)}
                  className="text-[#6A7686] hover:text-[#0F1722] p-1 rounded hover:bg-slate-100 transition-colors cursor-pointer"
                  title="Close panel"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto p-5 space-y-5 custom-scrollbar bg-slate-50/30">
                
                {/* 1. Analysis Points with Blue Points */}
                <div className="space-y-3">
                  <div className="flex items-center gap-1.5 pb-1.5 border-b border-slate-100 select-none">
                    <span className="w-1.5 h-3 bg-[#2D6CDF] rounded-full" />
                    <span className="text-[11px] font-black uppercase tracking-wider text-text-primary">
                      {language === 'zh' ? '本期穿透定性分析（诊断要点）' : 'PENETRATION DIAGNOSTIC POINTS'}
                    </span>
                  </div>

                  <div className="space-y-3.5">
                    {(language === 'zh' ? analysisPointsZh : analysisPointsEn).map((pt, idx) => (
                      <div key={idx} className="flex gap-2.5 items-start">
                        {/* Blue Point / Bullet */}
                        <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#2D6CDF] shrink-0" />
                        <p className="text-[11.5px] leading-relaxed text-text-primary">
                          {pt}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 2. Disposition Section */}
                <div className="space-y-3">
                  <div className="flex items-center gap-1.5 pb-1.5 border-b border-slate-100 select-none">
                    <span className="w-1.5 h-3 bg-[#E89518] rounded-full" />
                    <span className="text-[11px] font-black uppercase tracking-wider text-text-primary">
                      {language === 'zh' ? '智能体预定处置建议' : 'AGENT DISPOSITION ACTIONS'}
                    </span>
                  </div>

                  <div className="bg-[#E89518]/5 border border-[#E89518]/25 rounded p-3.5 space-y-2.5">
                    {(language === 'zh' 
                      ? [
                          '引入 Almaty 应急微电网负荷切离机制；',
                          '针对超常使用非规特耗算力的实体进行反垄断合规核查；',
                          '联动 EventAudit 发起专项防范案卷审计跟踪。'
                        ]
                      : [
                          'Initiate Almaty municipal demand shunt;',
                          'Flag anomalous computing loads above baseline limits;',
                          'Trigger targeted EventAudit dossiers to trace energy leakage pathways.'
                        ]
                    ).map((disp, idx) => (
                      <div key={idx} className="flex gap-2 items-start text-[11px] text-text-secondary leading-normal">
                        <span className="text-[#E89518] font-black shrink-0 font-mono">{idx + 1}.</span>
                        <span>{disp}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 3. Special Compliance Audit Section */}
                <div className="space-y-3">
                  <div className="flex items-center gap-1.5 pb-1.5 border-b border-slate-100 select-none">
                    <span className="w-1.5 h-3 bg-emerald-500 rounded-full" />
                    <span className="text-[11px] font-black uppercase tracking-wider text-text-primary">
                      {language === 'zh' ? '专项合规审查与确认' : 'AUDIT ACTION & DEPLOYMENT'}
                    </span>
                  </div>

                  <div className="flex flex-col gap-2 pt-1">
                    <button 
                      onClick={() => {
                        navigate('/audit/event/CASE-2026-NEW');
                      }}
                      className="w-full py-2 bg-[#2D6CDF] text-white hover:bg-[#1D5CBE] rounded text-xs font-black uppercase tracking-wider transition-colors shadow-sm cursor-pointer text-center flex items-center justify-center gap-1"
                    >
                      <span>{language === 'zh' ? '开展专项合规审查 →' : 'Execute Compliance Audit →'}</span>
                    </button>
                    <button 
                      onClick={() => setShowRightPanel(false)}
                      className="w-full py-2 bg-text-primary text-white hover:bg-slate-800 rounded text-xs font-black uppercase tracking-wider transition-colors cursor-pointer text-center"
                    >
                      {language === 'zh' ? '确认' : 'Acknowledge'}
                    </button>
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
