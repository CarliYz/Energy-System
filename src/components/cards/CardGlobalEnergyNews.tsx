import React, { useState, useMemo } from 'react';
import { useLanguage } from '../LanguageContext';
import { GLOBAL_ENERGY_NEWS, type GlobalNewsItem } from '../../data/global_energy_news';
import { 
  Globe, Radio, ShieldAlert, Bookmark, Check, FileText, ChevronRight, Share2 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Live SAT-COM Screenshot Mockup component
const NewsScreenshotMock = ({ source, title }: { source: string; title: string }) => {
  return (
    <div className="w-full h-[95px] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 rounded border border-slate-700 relative overflow-hidden flex flex-col justify-between p-3.5 select-none shrink-0 shadow-lg">
      <div className="absolute top-0 right-0 left-0 h-[3px] bg-gradient-to-r from-[#D8454C] via-[#E89518] to-[#2FA862] opacity-70" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/10 via-transparent to-transparent opacity-50" />
      
      {/* Terminal grid lines overlay for simulation */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.06] bg-[linear-gradient(rgba(18,24,38,0)_95%,_rgba(255,255,255,1)_5%)] bg-[size:100%_4px]" />

      <div className="flex items-center justify-between text-[7px] font-mono text-slate-400 font-bold select-none leading-none z-10">
        <span className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping inline-block" />
          <span>SATELLITE INTEL BEAMS</span>
        </span>
        <span>CH-0{Math.floor(Math.random() * 8) + 1} LIVE</span>
      </div>

      <div className="space-y-1 z-10">
        <span className="text-[7.5px] uppercase font-mono tracking-widest text-[#D8454C] font-black">{source} FEED RESIDUAL //</span>
        <h4 className="text-[10px] font-black text-white leading-tight truncate tracking-tight">{title}</h4>
      </div>

      <div className="flex items-center justify-between text-slate-500 text-[6.5px] font-mono border-t border-slate-800/80 pt-1 z-10 select-none leading-none">
        <span>GEOCOORDS: LAT 43°15'N LONG 76°57'E</span>
        <span className="text-green-500 font-bold">SECURED_LINE</span>
      </div>
    </div>
  );
};

export default function CardGlobalEnergyNews() {
  const { language } = useLanguage();
  const t = (en: string, zh: string) => (language === 'zh' ? zh : en);

  // States
  const [activeScope, setActiveScope] = useState<'domestic' | 'overseas'>('domestic');
  const [selectedId, setSelectedId] = useState<string>('DOM-NEWS-001');
  const [addedBriefIds, setAddedBriefIds] = useState<string[]>([]);

  // Filter news according to Scope
  const scopeFilteredNews = useMemo(() => {
    return GLOBAL_ENERGY_NEWS.filter(item => item.scope === activeScope);
  }, [activeScope]);

  // If previous selectId becomes invalid due to tab switches, auto fall back to the first item
  const finalSelectedId = useMemo(() => {
    const exists = scopeFilteredNews.some(item => item.id === selectedId);
    return exists ? selectedId : (scopeFilteredNews[0]?.id || '');
  }, [scopeFilteredNews, selectedId]);

  const activeNewsObj = useMemo(() => {
    return GLOBAL_ENERGY_NEWS.find(item => item.id === finalSelectedId) || null;
  }, [finalSelectedId]);

  const toggleBrief = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setAddedBriefIds(prev => 
      prev.includes(id) ? prev.filter(bId => bId !== id) : [...prev, id]
    );
  };

  return (
    <div 
      className="bg-white border border-[#E2E7EF] rounded-[4px] p-5 shadow-sm h-[460px] flex flex-col justify-between overflow-hidden relative select-none font-sans"
      id="card-global-energy-news"
    >
      {/* Header section with Domestic/Overseas scope toggle */}
      <div className="shrink-0 flex items-center justify-between pb-2 border-b border-slate-100 select-none">
        <div className="flex items-center gap-2">
          <Globe className="text-[#2D6CDF] shrink-0" size={16} />
          <h2 className="text-[13.5px] font-black uppercase text-[#0F1722] tracking-wider">
            {t('Energy and Lifeline Geopolitical News', '能源方向新闻监测中心')}
          </h2>
        </div>

        {/* Scope Toggler */}
        <div className="inline-flex border border-slate-200 rounded-[3px] overflow-hidden bg-white shrink-0">
          <button 
            onClick={() => {
              setActiveScope('domestic');
              // Automatically auto-select first domestic item
              setSelectedId('DOM-NEWS-001');
            }}
            className={`px-3 py-1 text-[9.5px] font-bold transition-all cursor-pointer ${activeScope === 'domestic' ? 'bg-[#0F1722] text-white' : 'text-slate-500 hover:text-slate-850'}`}
          >
            {t('DOMESTIC / INTERNAL', '国内')}
          </button>
          <button 
            onClick={() => {
              setActiveScope('overseas');
              // Automatically auto-select first overseas item
              setSelectedId('OVER-NEWS-001');
            }}
            className={`px-3 py-1 text-[9.5px] font-bold transition-all cursor-pointer border-l border-slate-200 ${activeScope === 'overseas' ? 'bg-[#0F1722] text-white' : 'text-slate-500 hover:text-slate-850'}`}
          >
            {t('OVERSEAS / INT\'L', '海外')}
          </button>
        </div>
      </div>

      {/* Main Column area: Left List (38%), Right details (62%) */}
      <div className="flex-1 my-3.5 flex items-stretch gap-4 min-h-0 overflow-hidden">
        
        {/* Left Side: News List Column (38%) */}
        <div className="w-[38%] overflow-y-auto pr-1 space-y-2.5 scrollbar-thin shrink-0 select-text">
          {scopeFilteredNews.map(item => {
            const isSelected = item.id === finalSelectedId;
            const color = item.severity === 'critical' ? '#D8454C' : item.severity === 'medium' ? '#E89518' : '#2FA862';
            
            return (
              <div
                key={item.id}
                onClick={() => setSelectedId(item.id)}
                className={`p-2.5 rounded-[3px] border transition-all cursor-pointer flex flex-col gap-1.5 justify-between h-[80px] shrink-0 ${
                  isSelected 
                    ? 'border-[#2D6CDF] bg-blue-50/15 font-bold shadow-xs' 
                    : 'border-slate-100 bg-[#FAFBFD]/60 hover:bg-slate-50/50 hover:border-slate-205'
                }`}
              >
                <div className="flex items-center justify-between text-[8px] font-mono text-slate-400 select-none">
                  <span className="font-extrabold text-slate-800">{item.source}</span>
                  <span>{item.timeAgo}</span>
                </div>
                <h4 className="font-bold text-slate-800 leading-tight tracking-tight line-clamp-2 select-text text-[10.5px]">
                  {item.title}
                </h4>
                <div className="flex items-center justify-between mt-auto select-none leading-none pt-0.5">
                  <span className="text-[7.5px] text-slate-400 font-mono">CODE: {item.id}</span>
                  <span className="text-[7.5px] font-mono font-black scale-90 px-1 py-0.2 rounded" style={{ backgroundColor: `${color}10`, color: color }}>
                    {item.severityLabel}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Side: Detailed views (62%) */}
        {activeNewsObj ? (
          <div className="flex-1 border border-[#EDF1F6] bg-slate-50/20 rounded p-4 flex flex-col justify-between overflow-y-auto select-text custom-scrollbar">
            <div className="space-y-3 shrink-0">
              
              {/* Metadata tags */}
              <div className="flex items-center justify-between text-[8px] font-mono text-slate-400 select-none border-b border-slate-100 pb-1.5 leading-none">
                <span className="font-black text-[#2D6CDF]">{activeNewsObj.sourceUrl}</span>
                <span>{activeNewsObj.region}</span>
              </div>

              {/* Title display */}
              <h3 className="text-[12.5px] font-extrabold text-slate-900 leading-snug tracking-tight">
                {activeNewsObj.title}
              </h3>

              {/* Satellite Video Screenshot */}
              <NewsScreenshotMock source={activeNewsObj.source} title={activeNewsObj.title} />

              {/* Story summary full content */}
              <div className="space-y-1.5 text-[11px] leading-relaxed font-semibold text-slate-500">
                <p>{activeNewsObj.fullText}</p>
              </div>

              {/* KPI Impact Metrics table */}
              {activeNewsObj.kpiImpact && activeNewsObj.kpiImpact.length > 0 && (
                <div className="bg-white/80 border border-slate-150 rounded p-2.5 space-y-2 select-none shrink-0 text-left">
                  <div className="text-[8px] font-mono text-slate-400 font-black uppercase tracking-wider leading-none">
                    Telemetry Impact Parameters Estimate
                  </div>
                  <div className="space-y-1.5 font-bold text-[10px]">
                    {activeNewsObj.kpiImpact.map((k, idx) => (
                      <div key={idx} className="flex justify-between items-center py-0.5 border-b border-slate-50 last:border-0 leading-none">
                        <span className="text-slate-500 font-medium">• {k.kpi}</span>
                        <span className={`font-mono font-black ${k.deltaPct < 0 ? 'text-red-500' : 'text-[#2FA862]'}`}>
                          {k.deltaPct > 0 ? `+${k.deltaPct}%` : `${k.deltaPct}%`}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Bottom brief binding button */}
            <div className="pt-3 border-t border-slate-100 select-none shrink-0 mt-3">
              <button
                onClick={(e) => toggleBrief(activeNewsObj.id, e)}
                className={`w-full h-8.5 rounded font-black text-[9.5px] uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  addedBriefIds.includes(activeNewsObj.id)
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : 'bg-slate-905 text-white bg-slate-900 hover:bg-slate-850'
                }`}
              >
                {addedBriefIds.includes(activeNewsObj.id) ? (
                  <>
                    <Check size={11} />
                    <span>{t('✓ Saved under Daily Cabinet Brief', '✓ 已成功存入备忘简报 (Saved)')}</span>
                  </>
                ) : (
                  <>
                    <Bookmark size={11} />
                    <span>{t("File into Ministerial Daily Intelligence Briefing", "纳入今日部长舆情简报簿 ↗")}</span>
                  </>
                )}
              </button>
            </div>

          </div>
        ) : (
          <div className="flex-1 border border-dashed border-slate-200 rounded flex flex-col items-center justify-center text-slate-400 select-none shrink-0 font-mono text-[9px]">
            <span>NO_DETAILS_INDEXED</span>
          </div>
        )}

      </div>
    </div>
  );
}
