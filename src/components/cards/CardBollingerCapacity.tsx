import React, { useState, useMemo } from 'react';
import { useLanguage } from '../LanguageContext';
import { bollingerData } from '../../data/bollinger_capacity';
import { TrendingUp } from 'lucide-react';

export default function CardBollingerCapacity() {
  const { language } = useLanguage();
  const t = (en: string, zh: string) => (language === 'zh' ? zh : en);

  // Card internal states
  const [activeHypothesisFilter, setActiveHypothesisFilter] = useState<'Strike' | 'AgingEquipment' | 'PipelineMaintenance' | 'Weather' | 'OilfieldRepair' | null>(null);
  const [hoveredKlineIndex, setHoveredKlineIndex] = useState<number | null>(null);

  // Computed K-Line path for the animating motion dot
  const klinePathD = useMemo(() => {
    return bollingerData.kline.map((d, i) => {
      const x = (i / 66) * 460;
      const y = 100 - ((d.value - 360) / 90) * 100;
      return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
    }).join(' ');
  }, []);

  return (
    <section 
      className="bg-white border border-[#E2E7EF] rounded-[4px] p-5 h-[460px] flex flex-col justify-between overflow-hidden relative shadow-sm"
      id="card-bollinger-capacity"
    >
      {/* Title block */}
      <div className="flex items-start justify-between border-b border-[#E2E7EF] pb-1.5 shrink-0 select-none">
        <div>
          <h2 className="text-[12.5px] font-black text-[#0F1722] uppercase tracking-wide flex items-center gap-1.5">
            <TrendingUp size={14} className="text-[#2D6CDF]" />
            {t('GDP × Capacity Bollinger Band Interval Monitoring', 'GDP × 产能 布林度区间监控')}
          </h2>
          <p className="text-[9px] text-[#6A7686] font-medium leading-none mt-1">
            {t('Process parameters wave packet solver · 7D decay forecast', '国家骨干用电及工艺参数波包解算 · 7D 衰退预测')}
          </p>
        </div>
        <div className="flex gap-1.5 text-[8.5px] font-mono">
          <span className="bg-[#D8454C]/5 border border-[#D8454C]/15 text-[#D8454C] px-1.5 py-0.5 rounded-[2px] font-bold">
            {t('BREACHED: ', '今日异常: ')}{bollingerData.todayCompliance.breach}
          </span>
          <span className="bg-[#FAFBFD] border border-[#E2E7EF] text-[#6A7686] px-1.5 py-0.5 rounded-[2px] font-bold">
            {t('COMPLIANCE: 91.2%', '合规率: 91.2%')}
          </span>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-3 gap-2 py-1.5 bg-slate-50/50 rounded-[2px] border border-slate-100 my-1 px-2.5 text-[9.5px] shrink-0 select-text">
        <div className="flex flex-col">
          <span className="text-[7.5px] font-bold uppercase text-[#6D7A8C]">{t('GDP TARGET 2026', '2026 年度 GDP 目标')}</span>
          <span className="font-bold text-[#2D6CDF] mt-0.5">{bollingerData.gdpTarget}% YoY</span>
        </div>
        <div className="flex flex-col border-l border-slate-150 pl-2.5">
          <span className="text-[7.5px] font-bold uppercase text-[#6D7A8C]">{t('OIL & GAS SHARE', '油气贡献占比')}</span>
          <span className="font-bold text-slate-800 mt-0.5">{bollingerData.oilGasShareTarget}%</span>
        </div>
        <div className="flex flex-col border-l border-slate-150 pl-2.5">
          <span className="text-[7.5px] font-bold uppercase text-[#6D7A8C]">{t('TODAY COMPLIANCE', '今日合规企业数')}</span>
          <span className="font-bold text-emerald-600 mt-0.5">{bollingerData.todayCompliance.ok} / {bollingerData.todayCompliance.total}</span>
        </div>
      </div>

      {/* K-Line Candlestick main chart area: taking full horizontal space */}
      <div className="flex-1 flex gap-3 my-1 overflow-hidden relative min-h-[145px] select-none">
        <div className="flex-1 h-full min-h-[140px] flex flex-col justify-between relative bg-[#FAFBFD]/80 p-2 rounded-[2px] border border-[#E2E7EF]">
          <div className="flex items-center justify-between text-[8px] font-mono text-[#6A7686] shrink-0">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-[#94A3B8]/20 block rounded-sm border border-[#94A3B8]/50" /> 
              {t('Bollinger Bands ±2σ', '布林带带宽 (Bollinger Bands ±2σ)')}
            </span>
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-[#D8454C] block rounded-full" /> 
              {t('Breach Warning', '跌出带宽 (BREACH)')}
            </span>
          </div>

          <div className="flex-1 relative overflow-visible mt-1 pr-1.5">
            <svg
              className="w-full h-full overflow-visible"
              viewBox="0 0 460 100"
              preserveAspectRatio="none"
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const pct = x / rect.width;
                const idx = Math.max(0, Math.min(bollingerData.kline.length - 1, Math.round(pct * (bollingerData.kline.length - 1))));
                setHoveredKlineIndex(idx);
              }}
              onMouseLeave={() => setHoveredKlineIndex(null)}
            >
              {/* Bands Area Poly-fill */}
              <path
                d={`M ${bollingerData.kline.map((d, i) => `${(i / 66) * 460},${100 - ((d.upper - 360) / 90) * 100}`).join(' L ')}
                    L ${[...bollingerData.kline].reverse().map((d, i) => `${((66 - i) / 66) * 460},${100 - ((d.lower - 360) / 90) * 100}`).join(' L ')} Z`}
                fill="#94A3B8"
                fillOpacity="0.12"
              />

              {/* Midline */}
              <path
                d={`M ${bollingerData.kline.map((d, i) => `${(i / 66) * 460},${100 - ((d.mid - 360) / 90) * 100}`).join(' L ')}`}
                fill="none"
                stroke="#D1D5DB"
                strokeWidth="0.8"
                strokeDasharray="2 3"
              />

              {/* Upper Line */}
              <path
                d={`M ${bollingerData.kline.map((d, i) => `${(i / 66) * 460},${100 - ((d.upper - 360) / 90) * 100}`).join(' L ')}`}
                fill="none"
                stroke="#94A3B8"
                strokeWidth="0.75"
                strokeOpacity="0.5"
              />

              {/* Lower line */}
              <path
                d={`M ${bollingerData.kline.map((d, i) => `${(i / 66) * 460},${100 - ((d.lower - 360) / 90) * 100}`).join(' L ')}`}
                fill="none"
                stroke="#94A3B8"
                strokeWidth="0.75"
                strokeOpacity="0.5"
              />

              {/* Value Line - splits historical (solid blue) and forecast (dashed orange) */}
              <path
                d={`M ${bollingerData.kline.slice(0, 61).map((d, i) => `${(i / 66) * 460},${100 - ((d.value - 360) / 90) * 100}`).join(' L ')}`}
                fill="none"
                stroke="#2D6CDF"
                strokeWidth="1.5"
              />
              
              <path
                d={`M ${bollingerData.kline.slice(60).map((d, i) => `${((i + 60) / 66) * 460},${100 - ((d.value - 360) / 90) * 100}`).join(' L ')}`}
                fill="none"
                stroke="#E89518"
                strokeWidth="1.5"
                strokeDasharray="3 3"
              />

              {/* Data stream sliding indicator along K-Line */}
              <path id="klinePath" d={klinePathD} fill="none" stroke="none" />
              <circle r="3.5" fill="#2D6CDF" opacity="0.9" className="drop-shadow-sm">
                <animateMotion dur="6s" repeatCount="indefinite">
                  <mpath href="#klinePath" />
                </animateMotion>
                <animate attributeName="opacity" values="0.1;0.9;0.9;0.1" dur="6s" repeatCount="indefinite" />
              </circle>

              {/* Breach dots */}
              {bollingerData.kline.map((d, i) => {
                if (!d.breach) return null;
                const cx = (i / 66) * 460;
                const cy = 100 - ((d.value - 360) / 90) * 100;
                return (
                  <g key={i}>
                    <circle cx={cx} cy={cy} r="3" fill="#D8454C">
                      <animate attributeName="opacity" values="0.4;1;0.4" dur="2s" repeatCount="indefinite" />
                    </circle>
                  </g>
                );
              })}

              {/* Forecast vertical limit indicator line */}
              <line x1={(60 / 66) * 460} y1="0" x2={(60 / 66) * 460} y2="100" stroke="#94A3B8" strokeWidth="0.75" strokeDasharray="3 3" />
              <text x={(60 / 66) * 460 - 32} y="10" fill="#E89518" className="text-[7.5px] font-mono font-bold scale-90">7D FORECAST ›</text>

              {/* Interactive Crosshair tracking */}
              {hoveredKlineIndex !== null && (
                <>
                  <line x1={(hoveredKlineIndex / 66) * 460} y1="0" x2={(hoveredKlineIndex / 66) * 460} y2="100" stroke="#1F2937" strokeWidth="0.5" />
                  <circle cx={(hoveredKlineIndex / 66) * 460} cy={100 - ((bollingerData.kline[hoveredKlineIndex].value - 360) / 90) * 100} r="4" fill="#2D6CDF" stroke="#fff" strokeWidth="1" />
                </>
              )}
            </svg>

            {/* Simulated interactive tooltip */}
            {hoveredKlineIndex !== null && (
              <div className="absolute top-1 left-1.5 bg-[#0F1722]/95 text-white p-2 text-[8px] font-mono rounded border border-white/15 z-30 leading-snug w-[150px] pointer-events-none select-text text-left">
                <div className="text-white/60 font-black border-b border-white/5 pb-0.5 mb-1 flex justify-between">
                  <span>{bollingerData.kline[hoveredKlineIndex].date}</span>
                  {bollingerData.kline[hoveredKlineIndex].forecast && <span className="text-amber-400 font-bold">FORECAST</span>}
                </div>
                <div className="flex justify-between">
                  <span>{t('Current Value', '真实产能值')}</span>
                  <strong className="text-sky-400 font-black">{bollingerData.kline[hoveredKlineIndex].value} GWh</strong>
                </div>
                <div className="flex justify-between text-white/80 mt-0.5">
                  <span>{t('Bollinger Mid', '布林中轨')}</span>
                  <span>{bollingerData.kline[hoveredKlineIndex].mid}</span>
                </div>
                {bollingerData.kline[hoveredKlineIndex].breach && (
                  <div className="text-[#D8454C] font-black border-t border-[#D8454C]/25 mt-1 pt-0.5 animate-pulse">
                    ⚠️ BREACH ALERT
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Bottom time axes dates */}
          <div className="flex justify-between text-[7px] text-[#A8B2C0] font-mono shrink-0 px-1 mt-0.5 select-text">
            <span>03-22</span>
            <span>04-12</span>
            <span>05-02</span>
            <span>05-22 (TODAY)</span>
            <span className="text-[#E89518] font-bold">05-29 (PROJ)</span>
          </div>
        </div>
      </div>

      {/* Expanded Bottom Compliance and Hypothesis details section taking full horizontal width */}
      <div className="flex gap-4 pt-2 border-t border-[#E2E7EF] shrink-0 h-[105px] overflow-hidden select-text text-[11px]">
        {/* LHS: 50% width - Hypothesis Filter */}
        <div className="w-[50%] flex flex-col justify-between overflow-hidden">
          <span className="text-[8.5px] font-black uppercase text-slate-450 mb-1 leading-none">
            {t('BREACH HYPOTHESIS & ROOT ATTRIBUTION', '跌出带宽原因归因定位')}
          </span>

          <div className="flex gap-1 overflow-x-auto pb-1 shrink-0 scrollbar-none select-none">
            {[
              { key: 'AgingEquipment', zh: '设备老化', en: 'Aging Eq.' },
              { key: 'Strike', zh: '员工罢工', en: 'Strike' },
              { key: 'PipelineMaintenance', zh: '管道维修', en: 'Pipe Maint.' },
              { key: 'Weather', zh: '天气因素', en: 'Weather' },
              { key: 'OilfieldRepair', zh: '油田维修', en: 'Oilfield Rep.' }
            ].map((item) => {
              const isActive = activeHypothesisFilter === item.key;
              return (
                <button
                  key={item.key}
                  onClick={() => setActiveHypothesisFilter(activeHypothesisFilter === item.key ? null : item.key as any)}
                  className={`px-1.5 py-0.5 rounded-[1.5px] text-[8px] font-mono whitespace-nowrap border transition-all cursor-pointer ${
                    isActive 
                    ? 'bg-[#D8454C] text-white border-[#D8454C]' 
                    : 'bg-[#FAFBFD] hover:bg-slate-100 text-slate-500 border-slate-200'
                  }`}
                >
                  {language === 'zh' ? item.zh : item.en}
                </button>
              );
            })}
          </div>

          <p className="text-[8px] text-slate-400 font-medium leading-normal mt-0.5 select-none">
            {t('Filters out corporate metrics conforming precisely to selected failure hypothesis thresholds.', '基于物理传感器反馈，自动对口归因异常限度内各级实体。')}
          </p>
        </div>

        {/* RHS: 50% width - Corporate list */}
        <div className="flex-1 overflow-y-auto space-y-1 bg-[#FAFBFD]/60 border border-slate-100 p-1.5 rounded-[2px] h-full">
          {bollingerData.enterprises
            .filter(ent => !activeHypothesisFilter || ent.hypothesis === activeHypothesisFilter)
            .map((ent) => {
              const isBreach = ent.status === 'breach';
              const isWarn = ent.status === 'warning';
              return (
                <div key={ent.id} className="flex justify-between items-center text-[8.5px] font-mono py-0.5 border-b border-dashed border-slate-100 last:border-0">
                  <span className="text-slate-800 font-extrabold truncate max-w-[100px]">{ent.name}</span>
                  <div className="flex items-center gap-1 shrink-0">
                    <span className="text-slate-400">σ={ent.sigma > 0 ? `+${ent.sigma}` : ent.sigma}</span>
                    <span className={`px-1 rounded-[1px] text-[7.5px] font-black uppercase ${
                      isBreach ? 'bg-red-50 text-red-650' : isWarn ? 'bg-amber-50 text-amber-650' : 'bg-green-50 text-emerald-650'
                    }`}>
                      {ent.status}
                    </span>
                  </div>
                </div>
              );
          })}
        </div>
      </div>
    </section>
  );
}
