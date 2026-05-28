import React, { useState } from 'react';
import { useLanguage } from '../LanguageContext';
import { Flame, AlertTriangle } from 'lucide-react';
import { motion } from 'motion/react';

const LIVELIHOOD_PRIMARY = [
  { label_en: 'Winter Heating Supply Rate', label_zh: '供暖锅炉系统保障率', current: 98.2, redline: 95, unit: '%', margin: '+3.2pp', status: 'GREEN' },
  { label_en: 'Grid Frequency Deviation', label_zh: '大电网物理频率偏差', current: 0.08, redline: 0.20, unit: 'Hz', margin: 'OK', status: 'GREEN' },
  { label_en: 'Household Gas Pressure Index', label_zh: '民用及加气站天然气气压', current: 94.7, redline: 95, unit: '%', margin: '-0.3pp', status: 'AMBER' },
  { label_en: 'Industrial Park Blackout Min(7d)', label_zh: '工业自贸区周内断电累计', current: 12, redline: 30, unit: 'm', margin: 'OK', status: 'GREEN' },
];

const LIVELIHOOD_SECONDARY = [
  { label_en: 'LPG Retail Price vs 30d Avg', label_zh: '加气站LPG零售价浮动', current: 8.4, redline: 15, unit: '%', margin: '+8.4%', status: 'AMBER' },
  { label_en: 'District Heating Boiler Uptime', label_zh: '城级集中供热辅机正常率', current: 99.1, redline: 98, unit: '%', margin: 'OK', status: 'GREEN' },
  { label_en: 'Diesel Supply Margin', label_zh: '柴油商业主储备可用天数', current: 6.2, redline: 4, unit: 'd', margin: '+2.2d', status: 'GREEN' },
  { label_en: 'Power Grid N-1 Reserve', label_zh: '高压电网N-1级动态物理裕度', current: 18.4, redline: 12, unit: '%', margin: '+6.4%', status: 'GREEN' },
];

const HISTORICAL_TIMELINE = [
  { year: '2022', date: '2022-01-04', type_en: 'LPG +100% (unrest)', type_zh: '曼吉斯套LPG暴增100%', outcome_en: 'Triggered unrest protocol', outcome_zh: '诱发严重治安反馈' },
  { year: '2023', date: '2023-12-12', type_en: 'Heating Outage Atyrau', type_zh: '阿特劳管道脱节断热', outcome_en: '18K households 24h', outcome_zh: '影响18000户民用供暖' },
  { year: '2024', date: '2024-02-08', type_en: 'Gas Pressure Drop Aktau', type_zh: '阿克套主管网失衡泄压', outcome_en: 'Resolved in 72h via peak gas', outcome_zh: '紧急调度气源72h内复位' },
  { year: '2025', date: '2025-01-22', type_en: 'Grid Frequency Dip Almaty', type_zh: '阿拉木图联络线瞬态跳闸', outcome_en: 'Secured backup reserve', outcome_zh: '切除大用电实体保障调频' },
  { year: '2026', date: '2026-05-25', type_en: 'Current Mangystau Gas Dip', type_zh: '极西地区常压辅泵渗漏(当下)', outcome_en: 'Sustained sentinel check', outcome_zh: '多重网联感应器正在对冲' },
];

export default function CardLivelihoodRedline() {
  const { language } = useLanguage();
  const t = (arg1: string, arg2?: string) => {
    if (!arg2) return arg1;
    const hasChinese = (s: string) => /[\u4E00-\u9FFF]/.test(s);
    if (hasChinese(arg1) && !hasChinese(arg2)) {
      return language === 'zh' ? arg1 : arg2;
    }
    if (hasChinese(arg2) && !hasChinese(arg1)) {
      return language === 'zh' ? arg2 : arg1;
    }
    return language === 'zh' ? arg2 : arg1;
  };

  const [hoveredBar, setHoveredBar] = useState<string | null>(null);

  // Horizontal gauge bar render helper
  const renderHBar = (bar: typeof LIVELIHOOD_PRIMARY[0], isLarge: boolean) => {
    const isAmber = bar.status === 'AMBER';
    const colorHex = isAmber ? '#E89518' : '#2CD27B';

    const maxVal = bar.redline * 1.15;
    const ratio = Math.min(100, (bar.current / maxVal) * 100);
    const redlineRatio = (bar.redline / maxVal) * 100;

    return (
      <div 
        key={bar.label_en} 
        className="group relative"
        onMouseEnter={() => setHoveredBar(bar.label_en)}
        onMouseLeave={() => setHoveredBar(null)}
      >
        <div className="flex justify-between items-center mb-0.5 select-text">
          <div className="flex items-center gap-1 min-w-0">
            <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: colorHex }} />
            <span className="text-[9.5px] uppercase font-bold tracking-wider font-mono text-slate-500 truncate">
              {language === 'zh' ? bar.label_zh : bar.label_en}
            </span>
          </div>
          <div className="flex items-center gap-1.5 shrink-0 font-mono text-[10px]">
            <span className="font-bold text-[#0D1722]">{bar.current}{bar.unit}</span>
            <span className={`text-[8.5px] px-1 font-black ${
              isAmber ? 'bg-amber-50 text-[#E89518]' : 'bg-green-50 text-emerald-600'
            } rounded-[1.5px]`}>
              {bar.margin}
            </span>
          </div>
        </div>

        {/* Trace progress track */}
        <div className={`relative bg-slate-100 border border-slate-200/55 rounded-[1.5px] overflow-hidden ${isLarge ? 'h-2' : 'h-1.5'}`}>
          <div 
            className="h-full opacity-90 transition-all duration-1000"
            style={{ width: `${ratio}%`, backgroundColor: colorHex }}
          />
          {/* Red line redline boundary limit marker */}
          <div 
            className="absolute top-0 bottom-0 w-[1.5px] bg-[#D8454C] z-10"
            style={{ left: `${redlineRatio}%` }}
          />
        </div>
        
        {hoveredBar === bar.label_en && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-[#0F1722] text-white p-2.5 rounded shadow-lg z-50 text-[8.5px] font-mono leading-relaxed pointer-events-none select-text">
            <div>{t('30D Average Trend Baseline Rate', '30天平准均值基线偏差率')}: 97.4% ({bar.unit})</div>
            <div>{t('Alert triggers dynamically on crossing threshold val', '越过以下物理阈值将动态触发全网警戒')}: {bar.redline}{bar.unit}</div>
            <div>{t('Current regulatory classification status', '当前监测及监管等级')}: {bar.status}</div>
          </div>
        )}
      </div>
    );
  };

  return (
    <section 
      className="bg-white border border-[#E2E7EF] rounded-[4px] p-5 h-[460px] flex flex-col justify-between overflow-hidden shadow-sm relative"
      id="card-livelihood-redline"
    >
      {/* Title */}
      <div className="flex items-start justify-between border-b border-[#E2E7EF] pb-1.5 shrink-0 select-none">
        <div>
          <h2 className="text-[12.5px] font-black text-[#0F1722] uppercase tracking-wide flex items-center gap-1.5">
            <Flame size={14} className="text-[#D8454C]" />
            {t('LIVELIHOOD RED-LINE LIVE MONITOR', '民生红线指标实时预警安全网')}
          </h2>
          <p className="text-[9px] text-[#6A7686] font-medium leading-none mt-1">
            {t('Real-time thresholds sync with Pricing Bureau & Internal Affairs', '联合警戒阀点：多部委联合实时物理对冲、零售限价干预监测')}
          </p>
        </div>
        <span className="text-[9px] font-mono bg-[#FAFBFD] border border-[#E2E7EF] text-[#6A7686] px-1.5 py-0.5 rounded-[2px] font-bold">
          {t('Atyrau Node Active', '特限调度合流')}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 my-2 flex-1 overflow-hidden">
        {/* Left column: 8 Horizontal bars (4 primary, 4 secondary) */}
        <div className="space-y-2 overflow-y-auto pr-1">
          {LIVELIHOOD_PRIMARY.map(b => renderHBar(b, true))}
          <div className="h-px bg-slate-100 my-1.5" />
          {LIVELIHOOD_SECONDARY.map(b => renderHBar(b, false))}
        </div>

        {/* Right column: Amber alarm narration + history interactive graph */}
        <div className="flex flex-col justify-between overflow-hidden gap-2 select-text">
          {/* Narratives alert box */}
          <div className="bg-red-50/50 border border-red-100/55 p-2.5 rounded text-[10px] text-slate-700 leading-normal font-mono">
            <div className="flex items-center gap-1.5 text-[#D8454C] font-extrabold text-[10.5px] select-none">
              <AlertTriangle size={11} className="animate-pulse" />
              <span>{t('⚠ AMBER — Mangystau Oblast Sentinel Active', '⚠️ 橙色警戒 — 极西区域物理失稳')}</span>
            </div>
            <p className="text-slate-800 font-semibold mt-1 font-sans">
              {t('Household Gas Pressure Index has slipped BELOW safety margins in Aktau microgrid for 14 hours.', '阿克套物理网天然气主输送压力连续14小时越过民生保障低限。')}
            </p>
            <div className="border-t border-slate-150 my-1 pt-1 text-[8.5px] text-[#6A7686] leading-relaxed">
              <strong>{t('Parallel actions triggered:', '已同步触发多部委联合响应:')}</strong> <br />
              <span className="text-[#2D6CDF]">{t('[ Pricing Regulation ]', '[ 物价调节管辖 ]')}</span> <span className="text-[#B23A6A]">{t('[ Joint Emergency Defense ]', '[ 应急联合防务 ]')}</span>
            </div>
          </div>

          {/* Historical timeline */}
          <div className="border border-slate-100 p-2 rounded bg-slate-50/70 flex flex-col justify-between h-[100px] select-none">
            <div className="text-[8px] font-mono text-slate-400 font-extrabold flex justify-between uppercase">
              <span>{t('HISTORICAL PATTERN MATCHING', '历次临界偏离应变比对')}</span>
              <span className="text-[#E89518]">similarity: 0.81</span>
            </div>

            {/* Dotted axis and triangular marker pins */}
            <div className="relative h-5 mt-1 flex items-center">
              <div className="absolute w-full h-px border-b border-[#D8454C]/30 border-dashed" />
              
              {HISTORICAL_TIMELINE.map((evt, idx) => {
                const isLast = idx === HISTORICAL_TIMELINE.length - 1;
                const xPct = (idx / (HISTORICAL_TIMELINE.length - 1)) * 90 + 5;
                return (
                  <div 
                    key={evt.date} 
                    className="absolute -translate-x-1/2 group/evt"
                    style={{ left: `${xPct}%` }}
                  >
                    <div className={`w-3.5 h-3.5 flex items-center justify-center cursor-pointer transition-transform duration-200 hover:scale-[1.25] ${
                      isLast ? 'text-[#D8454C] animate-pulse scale-110' : 'text-slate-400'
                    }`}>
                      <span className="block text-[11px] font-black pointer-events-none">▲</span>
                    </div>
                    
                    <span className="absolute left-1/2 -translate-x-1/2 top-4.5 text-[7.5px] font-mono text-slate-400 font-bold">
                      {evt.year}
                    </span>

                    {/* Detailed hover card */}
                    <div className="absolute bottom-5 left-1/2 -translate-x-1/2 bg-[#0F1722] text-white p-2.5 rounded text-[8.5px] font-mono shadow-xl opacity-0 pointer-events-none group-hover/evt:opacity-100 group-hover/evt:pointer-events-auto transition-all leading-relaxed w-[160px] z-50 select-text text-left">
                      <strong className="text-amber-400 block">{evt.date}</strong>
                      <span className="block font-bold text-white uppercase">{language === 'zh' ? evt.type_zh : evt.type_en}</span>
                      <span className="text-white/50 block border-t border-white/5 mt-0.5 pt-0.5">{language === 'zh' ? evt.outcome_zh : evt.outcome_en}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="text-[7.5px] font-mono text-[#6A7686] mt-1.5 leading-none text-center italic">
              {t('Expected timeline for automated self-healing: 48H.', '极相似偏离：2024年2月。物理自愈期望时限：48H-72H。')}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
