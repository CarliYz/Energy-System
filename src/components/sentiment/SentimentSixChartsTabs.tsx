import React, { useState, useMemo } from 'react';
import { useLanguage } from '../LanguageContext';
import {
  SENTIMENT_VOLUME_30D,
  SENTIMENT_ASPECTS,
  WORD_CLOUD_LABELS,
  PLATFORM_MONITORING,
  AUDIENCE_FLOW_LINKS,
  SPREAD_PATHWAYS,
  type SentimentVolumePoint,
  type AspectDistribution,
  type WordCloudLabel,
  type SocialPlatformPoint,
  type FlowLink
} from '../../data/sentiment_analytics';
import { 
  BarChart3, PieChart, MessageSquare, Compass, Send, Radio,
  TrendingDown, ShieldAlert, Check, Plus, MessagesSquare, Flame
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

type TabId = 'volume' | 'polarity' | 'wordcloud' | 'audience' | 'platform' | 'pathway';

export function SentimentSixChartsTabs() {
  const { language } = useLanguage();
  const t = (en: string, zh: string) => (language === 'zh' ? zh : en);

  const [activeTab, setActiveTab] = useState<TabId>('volume');

  // Shared KPI Summary calculations
  const totalVolume24H = 20124;
  const negPct = 68.4;
  const posPct = 12.2;
  const neuPct = 19.4;

  const tabList: { id: TabId; labelEn: string; labelCn: string; icon: React.ReactNode }[] = [
    { id: 'volume', labelEn: 'Volume 30d', labelCn: '30日热度时序', icon: <BarChart3 size={12} /> },
    { id: 'polarity', labelEn: 'Aspect Polarity', labelCn: '情感分布', icon: <PieChart size={12} /> },
    { id: 'wordcloud', labelEn: 'Word Cloud', labelCn: '词云螺旋', icon: <Compass size={12} /> },
    { id: 'audience', labelEn: 'Audience Flow', labelCn: '流量解构', icon: <MessageSquare size={12} /> },
    { id: 'platform', labelEn: 'Platform Sparklines', labelCn: '全平台监测', icon: <MessagesSquare size={12} /> },
    { id: 'pathway', labelEn: 'Spread Pathway', labelCn: '层级传播链', icon: <Flame size={12} /> },
  ];

  return (
    <div className="flex flex-col h-full justify-between overflow-hidden text-[11px] select-none font-sans bg-white rounded">
      
      {/* 1. Shared top KPI bar */}
      <div className="bg-slate-50 border border-slate-100 rounded p-2.5 flex items-center justify-between gap-4 select-text">
        <div className="flex-1 grid grid-cols-3 gap-3">
          {/* Vol 24H */}
          <div>
            <div className="text-[8px] uppercase tracking-wider font-bold text-slate-400 font-mono leading-none">
              {t('Volume 24H (All Channels)', '24小时总发帖流量')}
            </div>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-[14px] font-black font-mono text-[#0F1722]">
                {totalVolume24H.toLocaleString()}
              </span>
              <span className="text-[9px] font-mono text-[#D8454C] font-black leading-none">+18.4%</span>
            </div>
          </div>

          {/* Polarity Contrast */}
          <div>
            <div className="text-[8px] uppercase tracking-wider font-bold text-slate-400 font-mono leading-none">
              {t('Polarity Proportions (24H)', '24小时极性占比')}
            </div>
            <div className="flex items-center gap-1.5 mt-1.5 h-3 text-[9px] font-mono font-black text-white text-center">
              <div className="bg-red-500 rounded-l-[1px] h-full flex items-center justify-center" style={{ width: `${negPct}%` }} title={`Negative ${negPct}%`}>
                {negPct > 20 && `${negPct}%`}
              </div>
              <div className="bg-slate-300 h-full flex items-center justify-center" style={{ width: `${neuPct}%` }} title={`Neutral ${neuPct}%`}>
                {neuPct > 20 && `${neuPct}%`}
              </div>
              <div className="bg-emerald-500 rounded-r-[1px] h-full flex items-center justify-center" style={{ width: `${posPct}%` }} title={`Positive ${posPct}%`}>
                {posPct > 20 && `${posPct}%`}
              </div>
            </div>
          </div>

          {/* Core Alert Line */}
          <div className="border-l border-slate-200 pl-3">
            <div className="text-[8px] uppercase tracking-wider font-bold text-red-500 font-mono leading-none flex items-center gap-1">
              <ShieldAlert size={9} className="animate-pulse" />
              <span>{t('Velocity Alert Level', '舆情陡增预警评级')}</span>
            </div>
            <div className="text-[10px] font-black text-rose-600 mt-1 uppercase line-clamp-1 truncate font-mono">
              {t('EXTREME THREAT (Atyrau Node)', '预警评级: 极度威胁 (阿特劳泵站脉冲)')}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Scrollable tab navigation bar */}
      <div className="flex items-center gap-1 border-b border-slate-100 py-1.5 overflow-x-auto select-none no-scrollbar shrink-0">
        {tabList.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-2.5 py-1 rounded-[2px] font-bold flex items-center gap-1 border text-[9.5px] transition-all cursor-pointer whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-[#0F1722] text-white border-[#0F1722]'
                : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
            }`}
          >
            {tab.icon}
            <span>{language === 'zh' ? tab.labelCn : tab.labelEn}</span>
          </button>
        ))}
      </div>

      {/* 3. Tab content viewport (strict fixed sizes) */}
      <div className="flex-1 relative overflow-hidden mt-2.5 min-h-0 bg-[#FAFBFD]/30 border border-slate-100 rounded-[2px] p-2.5">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 3 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -3 }}
            transition={{ duration: 0.15 }}
            className="w-full h-full"
          >
            {activeTab === 'volume' && <TabVolume30d t={t} />}
            {activeTab === 'polarity' && <TabPolarityAspects t={t} language={language} />}
            {activeTab === 'wordcloud' && <TabWordCloud t={t} />}
            {activeTab === 'audience' && <TabAudienceFlow t={t} />}
            {activeTab === 'platform' && <TabPlatformMonitor t={t} />}
            {activeTab === 'pathway' && <TabSpreadPathway t={t} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

// ============================================================================
// TAB 1: 30D VOLUME - SVG Candlesticks + Line Overlay
// ============================================================================
export function TabVolume30d({ t }: { t: (en: string, zh: string) => string }) {
  // Chart dimensions
  const width = 450;
  const height = 180;
  const paddingLeft = 32;
  const paddingRight = 32;
  const paddingTop = 12;
  const paddingBottom = 20;

  const data = SENTIMENT_VOLUME_30D;
  const length = data.length;

  // Min and max for values
  const minVol = 2500;
  const maxVol = 9000;
  const maxRate = 100;

  // Map to SVG Coordinates
  const getX = (index: number) => {
    return paddingLeft + (index / (length - 1)) * (width - paddingLeft - paddingRight);
  };

  const getYVol = (val: number) => {
    return height - paddingBottom - ((val - minVol) / (maxVol - minVol)) * (height - paddingTop - paddingBottom);
  };

  const getYRate = (val: number) => {
    return height - paddingBottom - (val / maxRate) * (height - paddingTop - paddingBottom);
  };

  // Build the line path for Negative Volume Percentage
  const linePath = useMemo(() => {
    return data.map((d, i) => {
      const x = getX(i);
      const y = getYRate(d.negativeVolumePct);
      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ');
  }, [data]);

  return (
    <div className="w-full h-full flex flex-col justify-between">
      <div className="flex items-center justify-between text-[9px] font-mono text-slate-400 mb-1">
        <span>{t('📊 Left axis: Total Posts Volume (Candlesticks) | Right: Negativity Ratio (Line)', '📊 左轴：总发帖数规画(大烛足) | 右轴：负面舆情率(红折线)')}</span>
        <span className="font-bold text-[#D8454C]">NEGATIVITY PEAK: 81.0%</span>
      </div>

      <div className="flex-1 bg-white border border-slate-100 rounded relative overflow-hidden flex items-center justify-center">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full font-mono text-[7.5px] font-black select-none">
          {/* Grid lines (horizontal) */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
            const y = paddingTop + ratio * (height - paddingTop - paddingBottom);
            const labelVol = Math.round(maxVol - ratio * (maxVol - minVol));
            const labelRate = Math.round(maxRate - ratio * maxRate);
            return (
              <g key={idx}>
                <line x1={paddingLeft} y1={y} x2={width - paddingRight} y2={y} stroke="#F1F5F9" strokeWidth={1} />
                <text x={paddingLeft - 4} y={y + 3} textAnchor="end" fill="#94A3B8">{labelVol}</text>
                <text x={width - paddingRight + 4} y={y + 3} textAnchor="start" fill="#E11D48">{labelRate}%</text>
              </g>
            );
          })}

          {/* Render Candlesticks for Volume */}
          {data.map((d, i) => {
            const x = getX(i);
            const yOpen = getYVol(d.open);
            const yClose = getYVol(d.close);
            const yHigh = getYVol(d.high);
            const yLow = getYVol(d.low);

            const isUp = d.close >= d.open;
            const strokeColor = isUp ? '#10B981' : '#EF4444';
            const fillColor = isUp ? '#10B981/15' : '#EF4444';

            return (
              <g key={i} className="group">
                <title>{`Date: ${d.date}\nOpen: ${d.open} | Close: ${d.close}\nHigh: ${d.high} | Low: ${d.low}\nNegPct: ${d.negativeVolumePct}%`}</title>
                {/* Thin Wick line */}
                <line x1={x} y1={yHigh} x2={x} y2={yLow} stroke={strokeColor} strokeWidth={1} />
                {/* Candle body */}
                <rect 
                  x={x - 3} 
                  y={Math.min(yOpen, yClose)} 
                  width={6} 
                  height={Math.max(1.5, Math.abs(yClose - yOpen))}
                  fill={isUp ? 'none' : strokeColor}
                  className="fill-current"
                  stroke={strokeColor}
                  strokeWidth={1}
                />
              </g>
            );
          })}

          {/* Render Negative Rate Overlay Line */}
          <path d={linePath} fill="none" stroke="#EF4444" strokeWidth={1.5} strokeDasharray="1 1" />
          {data.map((d, i) => (
            <circle 
              key={i} 
              cx={getX(i)} 
              cy={getYRate(d.negativeVolumePct)} 
              r={2} 
              fill="#E11D48" 
              stroke="#FFF" 
              strokeWidth={0.5} 
            />
          ))}

          {/* X axis labels (staggered) */}
          {data.map((d, i) => {
            if (i % 6 !== 0 && i !== length - 1) return null;
            return (
              <text key={i} x={getX(i)} y={height - 6} textAnchor="middle" fill="#94A3B8">
                {d.date}
              </text>
            );
          })}
        </svg>
      </div>
    </div>
  );
}

// ============================================================================
// TAB 2: POLARITY ASPECTS - Bubbles and Aspect proportional bar
// ============================================================================
export function TabPolarityAspects({ t, language }: { t: (en: string, zh: string) => string; language: string }) {
  const aspects = SENTIMENT_ASPECTS;

  return (
    <div className="w-full h-full flex flex-col justify-between space-y-2">
      {/* Upper 3 bubbles representation */}
      <div className="grid grid-cols-3 gap-3">
        {/* Negative Bubble */}
        <div className="bg-red-50 border border-red-100 rounded p-2 text-center flex flex-col items-center justify-center">
          <span className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center font-black text-red-650 text-[14px]">
            68.4%
          </span>
          <span className="text-[9.5px] font-bold text-[#D8454C] mt-1">{t('Negative Alarm', '🔴 批判性仇怨与质疑')}</span>
        </div>

        {/* Neutral Bubble */}
        <div className="bg-slate-50 border border-slate-100 rounded p-2 text-center flex flex-col items-center justify-center">
          <span className="w-8 h-8 rounded-full bg-[#A8B2C0]/15 flex items-center justify-center font-black text-slate-700 text-[12px]">
            19.4%
          </span>
          <span className="text-[9.5px] font-bold text-slate-500 mt-1.5">{t('Neutral Speculate', '⚪ 被动理性旁观与中立')}</span>
        </div>

        {/* Positive Bubble */}
        <div className="bg-emerald-50 border border-[#A7F3D0]/60 rounded p-2 text-center flex flex-col items-center justify-center">
          <span className="w-7 h-7 rounded-full bg-emerald-500/10 flex items-center justify-center font-black text-emerald-650 text-[11px]">
            12.2%
          </span>
          <span className="text-[9.5px] font-bold text-[#2FA862] mt-2">{t('Positive Appreciate', '🟢 清洁风能期待/正面赞许')}</span>
        </div>
      </div>

      {/* Aspects Bar Breakdown */}
      <div className="bg-white border border-slate-100 rounded p-3 space-y-1.5 shadow-sm">
        <div className="font-bold text-[#0F1722] text-[9px] uppercase tracking-wider font-mono">
          {t('Aspects Weight Demography (Topic Proportions)', '核心议题热度细拆与情感导向图拉')}
        </div>

        <div className="space-y-1.5 max-h-[90px] overflow-y-auto pr-1">
          {aspects.map((asp, idx) => {
            const colorClass = 
              asp.polarity === 'positive' ? 'text-emerald-600 bg-emerald-50' :
              asp.polarity === 'negative' ? 'text-rose-600 bg-rose-50' : 'text-slate-600 bg-slate-100';
            return (
              <div key={idx} className="flex items-center justify-between text-[9.5px] gap-2.5">
                <div className="flex-1 min-w-0 flex items-center gap-1.5">
                  <span className={`px-1 rounded-[1.5px] scale-90 font-mono font-bold leading-none select-none text-[8px] ${colorClass}`}>
                    {asp.polarity.substring(0, 3).toUpperCase()}
                  </span>
                  <span className="font-bold text-slate-800 truncate">
                    {language === 'zh' ? asp.aspectCn : asp.aspectEn}
                  </span>
                </div>
                
                <div className="flex items-center gap-2 w-24 shrink-0 justify-end">
                  <div className="w-12 h-1.5 bg-slate-100 rounded-full overflow-hidden select-none">
                    <div 
                      className={`h-full ${
                        asp.polarity === 'positive' ? 'bg-emerald-500' :
                        asp.polarity === 'negative' ? 'bg-rose-500' : 'bg-slate-400'
                      }`} 
                      style={{ width: `${asp.ratio}%` }} 
                    />
                  </div>
                  <span className="font-mono font-black text-[#0F1722] text-[10px] w-6 text-right">{asp.ratio}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// TAB 3: WORD CLOUD WITH DETAILED DETECTED COORDINATES SPIRAL
// ============================================================================
export function TabWordCloud({ t }: { t: (en: string, zh: string) => string }) {
  const words = WORD_CLOUD_LABELS;

  return (
    <div className="w-full h-full flex flex-col justify-between">
      <div className="text-[9px] font-mono text-slate-400 mb-1">
        {t('⚛ Spatially projected multi-frequency lexical spiral map', '⚛ 词频与偏流极性二维空间坐标螺旋聚合 (点击触发特侦检索)')}
      </div>

      <div className="flex-1 bg-[#1A1F26] border border-slate-900 rounded p-2 relative flex items-center justify-center overflow-hidden min-h-[160px]">
        {/* Dynamic coordinate arrangement simulating gravity without heavy runtime cloud engine */}
        <div className="relative w-full h-full max-w-[420px] max-h-[150px] select-text">
          {words.map((w, idx) => {
            const absoluteLeft = 50 + (w.x / 420) * 100;
            const absoluteTop = 50 + (w.y / 150) * 100;
            
            // Text Color based on polarity
            const colorClass =
              w.sentiment === 'positive' ? 'text-emerald-400 hover:text-emerald-300' :
              w.sentiment === 'negative' ? 'text-rose-450 hover:text-rose-350 font-black' : 'text-slate-400 hover:text-slate-200';

            // Font Sizes mapped to weights
            const fontSize = 7 + (w.weight / 48) * 13;

            return (
              <span
                key={idx}
                className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all hover:scale-110 font-bold ${colorClass}`}
                style={{
                  left: `${absoluteLeft}%`,
                  top: `${absoluteTop}%`,
                  fontSize: `${fontSize}px`,
                  transform: `translate(-50%, -50%) rotate(${w.angle}deg)`,
                  textShadow: '0 1px 4px rgba(0,0,0,0.45)',
                  whiteSpace: 'nowrap'
                }}
                onClick={() => alert(`触发针对"${w.text}"的自动化微观高频溯源侦巡？`)}
              >
                {w.text}
              </span>
            );
          })}
        </div>

        {/* Dynamic spiral decor rings */}
        <div className="absolute inset-0 pointer-events-none border border-slate-800/25 rounded-full scale-[0.3]" />
        <div className="absolute inset-0 pointer-events-none border border-slate-800/15 rounded-full scale-[0.6]" />
        <div className="absolute inset-0 pointer-events-none border border-slate-850/10 rounded-full scale-[0.85]" />
      </div>
    </div>
  );
}

// ============================================================================
// TAB 4: AUDIENCE FLOW - Custom Bezier SVG mini-Sankey diagram
// ============================================================================
export function TabAudienceFlow({ t }: { t: (en: string, zh: string) => string }) {
  // Let's layout standard Flow Nodes. Left column has 3 sources, Middle has 3 concern aspects, Right has 3 core policies
  const sources = [
    { id: 'S1', label: 'Telegram Groups', y: 25, val: 62450 },
    { id: 'S2', label: 'VKontakte (VK)', y: 75, val: 38120 },
    { id: 'S3', label: 'X (Twitter)', y: 125, val: 15800 }
  ];

  const middle = [
    { id: 'M1', label: '电费上涨 +35%', y: 20, val: 54500 },
    { id: 'M2', label: '网关跳闸断能', y: 75, val: 40220 },
    { id: 'M3', label: '其他/伴生火炬', y: 130, val: 11700 }
  ];

  const target = [
    { id: 'T1', label: '民生负荷红线保障', y: 25, val: 54500 },
    { id: 'T2', label: '物理网络防务安全', y: 75, val: 34000 },
    { id: 'T3', label: '低碳与关联稽查员', y: 125, val: 27870 }
  ];

  // Map Bezier link paths
  // Left to Middle connections
  const linksLeft = [
    { sY: 25, tY: 20, val: '38.4k', color: '#D8454C', o: 0.4 },
    { sY: 25, tY: 75, val: '18.2k', color: '#E89518', o: 0.35 },
    { sY: 75, tY: 20, val: '16.1k', color: '#D8454C', o: 0.3 },
    { sY: 75, tY: 130, val: '22.0k', color: '#64748B', o: 0.3 },
    { sY: 125, tY: 75, val: '15.8k', color: '#E89518', o: 0.35 },
  ];

  // Middle to Right connections
  const linksRight = [
    { sY: 20, tY: 25, val: '54.5k', color: '#D8454C', o: 0.45 },
    { sY: 75, tY: 75, val: '18.2k', color: '#E89518', o: 0.35 },
    { sY: 75, tY: 25, val: '15.8k', color: '#D8454C', o: 0.3 },
    { sY: 130, tY: 125, val: '11.7k', color: '#64748B', o: 0.3 },
  ];

  return (
    <div className="w-full h-full flex flex-col justify-between">
      <div className="text-[9px] font-mono text-slate-400 mb-1 flex justify-between">
        <span>{t('🔗 Left (Source Platform) → Center (Topic Concern) → Right (National Risk Area)', '🔗 左（主要源平台） → 中（涉及负面话题） → 右（映射防务红线）')}</span>
        <span className="text-blue-500 font-bold font-mono">FLOW: 116,370 POSTS</span>
      </div>

      <div className="flex-1 bg-white border border-slate-100 rounded relative overflow-hidden p-1.5 min-h-[160px]">
        <svg viewBox="0 0 500 150" className="w-full h-full text-[8px] font-black select-none">
          {/* Bezier Links: Left to Middle */}
          {linksLeft.map((link, idx) => {
            const x1 = 110;
            const y1 = link.sY;
            const x2 = 240;
            const y2 = link.tY;
            const cx1 = x1 + 50;
            const cy1 = y1;
            const cx2 = x2 - 50;
            const cy2 = y2;
            const path = `M ${x1} ${y1} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${x2} ${y2}`;

            return (
              <path
                key={idx}
                d={path}
                fill="none"
                stroke={link.color}
                strokeWidth={5}
                opacity={link.o}
                className="hover:opacity-80 transition-opacity"
              />
            );
          })}

          {/* Bezier Links: Middle to Right */}
          {linksRight.map((link, idx) => {
            const x1 = 330;
            const y1 = link.sY;
            const x2 = 400;
            const y2 = link.tY;
            const cx1 = x1 + 35;
            const cy1 = y1;
            const cx2 = x2 - 35;
            const cy2 = y2;
            const path = `M ${x1} ${y1} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${x2} ${y2}`;

            return (
              <path
                key={idx}
                d={path}
                fill="none"
                stroke={link.color}
                strokeWidth={5}
                opacity={link.o || 0.3}
                className="hover:opacity-80 transition-opacity"
              />
            );
          })}

          {/* Nodes: Column 1 (Left Sources) */}
          {sources.map(src => (
            <g key={src.id}>
              <rect x="10" y={src.y - 10} width="100" height="20" rx="1.5" fill="#1E293B" />
              <text x="15" y={src.y + 3} fill="#FFF" fontWeight="700">{src.label}</text>
              <circle cx="110" cy={src.y} r="3.5" fill="#38BDF8" />
            </g>
          ))}

          {/* Nodes: Column 2 (Middle Concern Topics) */}
          {middle.map(mid => (
            <g key={mid.id}>
              <rect x="240" y={mid.y - 10} width="90" height="20" rx="1.5" fill="#475569" />
              <text x="245" y={mid.y + 3} fill="#FFF" fontWeight="700">{mid.label}</text>
              <circle cx="240" cy={mid.y} r="3.5" fill="#F59E0B" />
              <circle cx="330" cy={mid.y} r="3.5" fill="#10B981" />
            </g>
          ))}

          {/* Nodes: Column 3 (Right Key Policies) */}
          {target.map(tar => (
            <g key={tar.id}>
              <rect x="400" y={tar.y - 10} width="90" height="20" rx="1.5" fill="#0F1722" />
              <text x="405" y={tar.y + 3} fill="#FFF" fontWeight="700">{tar.label}</text>
              <circle cx="400" cy={tar.y} r="3.5" fill="#14B8A6" />
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
}

// ============================================================================
// TAB 5: PLATFORM MONITOR SPARKLINE AND ACCORDION DETAIL COMMENTS
// ============================================================================
export function TabPlatformMonitor({ t }: { t: (en: string, zh: string) => string }) {
  const platforms = PLATFORM_MONITORING;
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  return (
    <div className="w-full h-full flex flex-col justify-between space-y-1.5">
      <div className="text-[9px] font-mono text-slate-400">
        {t('⚛ Multi-platform stream frequency velocity tracker (Click row expansion)', '⚛ 全网多信道发帖速率脉动波动量 | 点击行展开高危发帖原语溯源')}
      </div>

      <div className="flex-1 space-y-1 overflow-y-auto max-h-[160px] pr-1 select-text">
        {platforms.map((plat, idx) => {
          const isExpanded = expandedIndex === idx;
          const isUp = plat.velocity > 0;
          
          // Generate polyline sparklink
          const sparkWidth = 100;
          const sparkHeight = 16;
          const maxVal = Math.max(...plat.sparkline);
          const minVal = Math.min(...plat.sparkline);
          const pointsStr = plat.sparkline.map((val, step) => {
            const x = (step / (plat.sparkline.length - 1)) * sparkWidth;
            const y = maxVal === minVal ? sparkHeight / 2 : sparkHeight - 2 - ((val - minVal) / (maxVal - minVal)) * (sparkHeight - 4);
            return `${x},${y}`;
          }).join(' ');

          return (
            <div key={idx} className="border border-slate-100 rounded bg-white overflow-hidden transition-all">
              {/* Row Header */}
              <div 
                onClick={() => setExpandedIndex(isExpanded ? null : idx)}
                className="px-3 py-1.5 flex items-center justify-between gap-3 cursor-pointer hover:bg-slate-50 transition-colors"
              >
                <div className="w-28 truncate select-none">
                  <div className="font-extrabold text-[#0F1722]">{plat.name}</div>
                  <div className="text-[8px] font-mono text-slate-400 mt-0.5">{plat.value.toLocaleString()} {t('posts', '条存档')}</div>
                </div>

                {/* Sparkline Visual */}
                <div className="w-24 h-5 flex items-center select-none" title="24 Hours Velocity Path">
                  <svg width={sparkWidth} height={sparkHeight} className="overflow-visible">
                    <polyline 
                      fill="none" 
                      stroke={isUp ? '#EF4444' : '#10B981'} 
                      strokeWidth={1.2} 
                      points={pointsStr} 
                    />
                  </svg>
                </div>

                {/* Velocity Rate */}
                <div className="text-right w-16 shrink-0 select-none">
                  <span className={`font-mono font-black text-[9.5px] ${isUp ? 'text-rose-600' : 'text-emerald-600'}`}>
                    {isUp ? `+${plat.velocity}` : plat.velocity}%
                  </span>
                  <div className="text-[7.5px] text-slate-400 font-mono tracking-wider font-extrabold">{t('VELOCITY', '爆发增速')}</div>
                </div>
              </div>

              {/* Accordion Expansion (Bilingual High Risk Comments log) */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-t border-slate-50 bg-slate-50/50 p-2.5 space-y-1.5 min-h-0 text-[10px]"
                  >
                    <div className="text-[8px] font-mono text-rose-500 font-extrabold tracking-wide uppercase select-none flex items-center gap-1">
                      <Flame size={10} className="animate-bounce" />
                      <span>{t('TOP INTERCEPTED SOCIAL COMMENTS FOR PRIORITY ACTIONS', '核心拦截高频涉物理泄气/限电原语日志')}</span>
                    </div>

                    <div className="space-y-1.5">
                      {plat.topPosts.map((post, pIdx) => (
                        <div key={pIdx} className="bg-white px-2 py-1.5 border border-slate-100 rounded shadow-2xs select-text">
                          <div className="flex items-center justify-between text-[8px] font-mono font-black text-slate-400 mb-0.5 select-none">
                            <span className="text-blue-600">@{post.user}</span>
                            <span className="text-slate-600">CRIT_WT: {post.weight}</span>
                          </div>
                          <p className="text-slate-700 leading-normal font-semibold font-sans">{post.text}</p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ============================================================================
// TAB 6: SPREAD PATHWAYS - Cascade propagation step sequence flow overlay
// ============================================================================
export function TabSpreadPathway({ t }: { t: (en: string, zh: string) => string }) {
  const pathItems = SPREAD_PATHWAYS;

  return (
    <div className="w-full h-full flex flex-col justify-between">
      <div className="text-[9px] font-mono text-slate-400 mb-1 flex justify-between">
        <span>{t('⚡ Inter-level Geopolitical Media Amplification Pathways', '⚡ 跨界跨层级地缘与大众媒体级联放大路径')}</span>
        <span className="text-rose-500 font-bold font-mono">DAMPING DELAY: &lt; 4M</span>
      </div>

      <div className="flex-1 bg-white border border-slate-100 rounded p-3 overflow-y-auto max-h-[160px] pr-1 space-y-2.5 shadow-2xs select-text">
        {pathItems.map((path, idx) => (
          <div key={idx} className="flex items-center gap-2 text-[10px] bg-slate-50 p-2 rounded border border-slate-100">
            {/* Step Block 1 */}
            <div className="bg-slate-700 text-white rounded px-2 py-1 w-28 shrink-0 font-extrabold truncate text-[9.5px]">
              {path.source}
            </div>

            {/* Bezier linking line segment with micro percentage tag */}
            <div className="flex-1 flex flex-col items-center justify-center relative min-w-[50px] select-none">
              <span className="text-[8.5px] font-mono font-black text-rose-500 bg-red-50 px-1 rounded-full border border-red-100 animate-pulse">
                {path.value}%
              </span>
              <div className="w-full h-0.5 bg-slate-200 mt-1 relative">
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 border-t border-r border-slate-400 transform rotate-45" />
              </div>
            </div>

            {/* Step Block 2 */}
            <div className="bg-slate-850 text-white rounded px-2 py-1 w-32 shrink-0 font-extrabold text-right truncate text-[9.5px]">
              {path.target}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
