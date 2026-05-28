import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings } from 'lucide-react';
import { useLanguage } from '../components/LanguageContext';

// Import Modular Styled Cards
import CardGdpElasticity from '../components/cards/CardGdpElasticity';
import CardBollingerCapacity from '../components/cards/CardBollingerCapacity';
import CardLivelihoodRedline from '../components/cards/CardLivelihoodRedline';
import CardSentimentOverview from '../components/cards/CardSentimentOverview';
import CardMinisterCommandCenter from '../components/cards/CardMinisterCommandCenter';
import CardGlobalEnergyNews from '../components/cards/CardGlobalEnergyNews';

// Helper UI Components
function Pill({ children, variant = 'default' }: { children: React.ReactNode; variant?: 'default' | 'warning' | 'muted' }) {
  let classes = "bg-[#FAFBFD] border-[#E2E7EF] text-[#1A2330]";
  if (variant === 'warning') classes = "bg-[#E89518]/15 border-[#E89518]/30 text-[#E89518]";
  if (variant === 'muted') classes = "bg-[#6A7686]/10 border-[#E2E7EF] text-[#6A7686]";
  return (
    <div className={`px-2.5 py-0.5 rounded-[12px] text-[10px] font-bold border flex items-center gap-1 ${classes}`}>
      {children}
    </div>
  );
}

function GhostButton({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return (
    <button 
      onClick={onClick}
      className="px-2.5 py-1 text-[10px] font-mono font-bold text-[#1A2330] hover:bg-[#FAFBFD] border border-[#E2E7EF] rounded hover:shadow-sm transition-all cursor-pointer"
    >
      {children}
    </button>
  );
}

function ScenarioTab({ children, active, onClick }: { children: React.ReactNode; active?: boolean; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`text-[11px] font-bold px-3 py-1.5 transition-all outline-none border-b-2 shrink-0 cursor-pointer ${
        active 
          ? 'text-[#2AB3A6] border-[#2AB3A6]' 
          : 'text-[#6A7686] border-transparent hover:text-[#1A2330]'
      }`}
    >
      {children}
    </button>
  );
}

export default function MinisterDashboard() {
  const { language, setLanguage } = useLanguage();
  const navigate = useNavigate();

  const [activePipelineFilter, setActivePipelineFilter] = useState<string | null>(null);
  const [pipelineCountPulse, setPipelineCountPulse] = useState(0);

  const tLabel = (en: string, zh: string) => {
    return language === 'zh' ? zh : en;
  };

  // Pulse effect timer for closed loop pipeline in footer
  useEffect(() => {
    const pInterval = setInterval(() => {
      setPipelineCountPulse(prev => (prev + 1) % 6);
    }, 4000);
    return () => clearInterval(pInterval);
  }, []);

  return (
    <div className="bg-[#F4F6FA] min-h-screen text-[#1A2330] flex flex-col font-sans select-none antialiased max-h-screen overflow-hidden">
      
      {/* 1. TOP HEADER STRIP (V3 ALL WHITE Aesthetic) */}
      <header className="bg-white border-b border-[#E2E7EF] h-[48px] flex items-center px-6 shrink-0 relative z-[2000]">
        {/* Left Side branding */}
        <div className="flex items-center gap-2 w-[240px]">
          <span className="text-[14px]">🇰🇿</span>
          <span className="text-[10px] uppercase tracking-widest text-[#6A7686] font-bold font-mono">
            {tLabel('AI STATECRAFT · ENERGY', '国家能源决策智能态势大屏')}
          </span>
        </div>

        {/* Center Breadcrumb Pills */}
        <div className="flex-1 flex items-center gap-2 justify-center">
          <Pill>{tLabel('Minister Command View', '内阁部长专席总控屏')}</Pill>
          <span className="text-[#6A7686] text-[10px] font-mono">›</span>
          <Pill variant="warning">{tLabel('National Status: AMBER', '物理边界状态: 橙色警戒')}</Pill>
          <span className="text-[#6A7686] text-[10px] font-mono">›</span>
          <Pill variant="muted">GMT+5 · 2026-05-28 · WEEK 22</Pill>
        </div>

        {/* Right Action buttons with ZH toggle */}
        <div className="flex items-center gap-2 w-[320px] justify-end">
          <GhostButton onClick={() => setLanguage(language === 'zh' ? 'en' : 'zh')}>
            ZH ⇆ EN ({language === 'zh' ? '中文' : 'ENG'})
          </GhostButton>
          <GhostButton onClick={() => alert(tLabel('PDF briefing compiled and synced to Minister Office secure tablet.', '高密呈报主文PDF已离线同步发送至部长机密平板电脑。'))}>
            {tLabel('Brief PDF', 'PDF呈书')}
          </GhostButton>
          <GhostButton onClick={() => alert(tLabel('Configuration profile is managed server-side.', '系统微调控制台属于后端服务配置项。'))}>
            <Settings size={11} className="inline mr-1 animate-spin-slow" />
            {tLabel('Settings', '系统微调')}
          </GhostButton>
          <div className="w-6 h-6 rounded-full bg-slate-100 border border-[#E2E7EF] flex items-center justify-center text-[10px] font-bold text-[#6A7686] shrink-0 font-mono">
            M
          </div>
        </div>
      </header>

      {/* 2. SECONDARY NAV PANEL (Capsules) */}
      <div className="bg-[#FAFBFD] border-b border-[#E2E7EF] h-[40px] flex items-center px-6 justify-between shrink-0 relative z-[1500]">
        <div className="flex gap-2">
          <ScenarioTab active>{tLabel('Minister Dashboard ▼', '部长决策总控台 ▼')}</ScenarioTab>
          <ScenarioTab onClick={() => navigate('/sensing/national-grid')}>{tLabel('National Grid', '国家调度流拓扑')}</ScenarioTab>
          <ScenarioTab onClick={() => navigate('/sensing/regional-monitoring')}>{tLabel('Regional', '地方工业数采物联网')}</ScenarioTab>
          <ScenarioTab onClick={() => navigate('/sensing/regional-monitoring')}>{tLabel('Equipment', '重型辅泵机组组态')}</ScenarioTab>
        </div>

        <div className="flex items-center gap-2 text-[10px] font-mono text-[#6A7686]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#2AB3A6] animate-pulse" />
          <span>{tLabel('Live · 12 sources connected · last sync 14:32:18', '中央物理网联在线 · 12部源服务器直连 · 最后同步 14:32:18')}</span>
        </div>
      </div>

      {/* 3. PRIMARY 3x2 SCROLLABLE SCENE GRID */}
      <main 
        className="flex-1 p-6 overflow-y-auto max-w-[1920px] w-full mx-auto" 
        style={{ maxHeight: 'calc(100vh - 140px)' }}
      >
        <div className="grid grid-cols-2 gap-6 pb-6 select-none" style={{ minHeight: '1440px' }}>
          
          {/* Row 1 — Card 1: recovered National Strategic Energy Export × GDP Elasticity */}
          <CardGdpElasticity />

          {/* Row 1 — Card 2: GDP × Capacity Bollinger Band Monitor (repositioned here, expanded, no bottom news segment) */}
          <CardBollingerCapacity />

          {/* Row 2 — Card 3: Livelihood Gauge and Warning Timeline */}
          <CardLivelihoodRedline />

          {/* Row 2 — Card 4: Redesigned High Fidelity Sentiment Analytics tab bundle + Compact Posting card */}
          <CardSentimentOverview />

          {/* Row 3 — Card 5: Pending Minister Actions Command Center Case list */}
          <CardMinisterCommandCenter />

          {/* Row 3 — Card 6: Global Energy News (bilingual with categories + auto-refresh progress bar) */}
          <CardGlobalEnergyNews />

        </div>
      </main>

      {/* 4. BOTTOM CLOSED FEEDBACK LOOP PIPELINE STATUS STRIP */}
      <footer className="h-[52px] bg-white border-t border-[#E2E7EF] px-6 flex items-center justify-between shrink-0 select-none shadow-[0_-2px_8px_rgba(0,0,0,0.02)] z-10">
        <div className="flex items-center gap-4 flex-1">
          <div className="text-[10px] font-black uppercase tracking-widest text-[#6A7686] w-[140px] shrink-0 font-mono">
            {tLabel('REGULATORY PIPELINE', '国家能源闭环督办流程泳道')}
          </div>
          
          <div className="flex-1 flex items-center justify-between gap-1 max-w-[1240px]">
            {[
              { label_en: 'DETECT', label_zh: '阈值报警', count: 12, status: 'RED' },
              { label_en: 'ATTRIBUTE', label_zh: '多源归因', count: 8, status: 'AMBER' },
              { label_en: 'DISPATCH', label_zh: '特遣派单', count: 5, status: 'GREEN' },
              { label_en: 'RESOLVE', label_zh: '整改反馈', count: 3, status: 'GREEN' },
              { label_en: 'REVIEW', label_zh: '多维复核', count: 2, status: 'GREEN' },
              { label_en: 'ARCHIVE', label_zh: '结案归档', count: 1, status: 'GREEN' },
            ].map((p, idx) => {
              const isPulsedAt4s = pipelineCountPulse === idx;
              return (
                <React.Fragment key={idx}>
                  <div 
                    onClick={() => {
                      setActivePipelineFilter(activePipelineFilter === p.label_en ? null : p.label_en);
                    }}
                    className={`flex items-center gap-2 cursor-pointer group px-3 py-1 rounded-[3px] transition-all border ${
                      activePipelineFilter === p.label_en 
                        ? 'border-[#2D6CDF] bg-[#2D6CDF]/5 shadow-sm' 
                        : isPulsedAt4s 
                          ? 'border-[#2AB3A6]/40 bg-[#FAFBFD] shadow-sm animate-pulse'
                          : 'border-[#E2E7EF] hover:border-gray-300 bg-[#FAFBFD]'
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                      p.status === 'RED' ? 'bg-[#D8454C]' : p.status === 'AMBER' ? 'bg-[#E89518]' : 'bg-[#2FA862]'
                    }`} />
                    <span className="text-[10px] font-bold text-[#0F1722] font-mono group-hover:text-[#2D6CDF]">
                      {language === 'zh' ? p.label_zh : p.label_en}
                    </span>
                    <span className="text-[9.5px] font-mono font-bold text-[#6A7686] bg-[#FAFBFD] border border-[#E2E7EF] px-1 rounded-sm leading-none py-0.5">
                      {p.count.toString().padStart(2, '0')}
                    </span>
                  </div>
                  {idx < 5 && (
                    <div className="h-[1px] flex-1 bg-[#E2E7EF]" />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Dynamic bottom localized state counts */}
        <div className="text-[10px] text-[#6A7686] font-mono ml-4 text-right shrink-0">
          <strong>{tLabel('33 active cases', '33起处理中案件')}</strong> · <span>{tLabel('5 in preventive window', '5起处于前置督办期')}</span> · <span className="text-[#2FA862] font-bold">{tLabel('0 SLA-breached today', '今日0起逾期案件')}</span>
        </div>
      </footer>

    </div>
  );
}
