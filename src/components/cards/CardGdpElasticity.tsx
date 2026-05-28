import React, { useState, useEffect, useMemo } from 'react';
import { useLanguage } from '../LanguageContext';
import { Activity } from 'lucide-react';

const EXPORT_GDP_BASE = [
  { month: 'Jun 25', export: 14.2, gdp: 5.8 },
  { month: 'Jul 25', export: 14.5, gdp: 5.9 },
  { month: 'Aug 25', export: 14.1, gdp: 6.0 },
  { month: 'Sep 25', export: 13.8, gdp: 5.7 },
  { month: 'Oct 25', export: 14.6, gdp: 6.1 },
  { month: 'Nov 25', export: 14.3, gdp: 5.9 },
  { month: 'Dec 25', export: 13.9, gdp: 5.6 },
  { month: 'Jan 26', export: 13.7, gdp: 5.4 },
  { month: 'Feb 26', export: 13.2, gdp: 5.2 },
  { month: 'Mar 26', export: 12.8, gdp: 4.8 },
  { month: 'Apr 26', export: 12.5, gdp: 4.5 },
  { month: 'May 26', export: 12.1, gdp: 4.2 },
];

export default function CardGdpElasticity() {
  const { language } = useLanguage();
  const t = (en: string, zh: string) => (language === 'zh' ? zh : en);

  // Card internal states
  const [chartData, setChartData] = useState(EXPORT_GDP_BASE);
  const [chartUpdatePulse, setChartUpdatePulse] = useState(false);
  const [hoveredPointIndex, setHoveredPointIndex] = useState<number | null>(null);

  // Auto-update Dynamic GDP Chart every 4 seconds
  useEffect(() => {
    const chartInterval = setInterval(() => {
      setChartData(prev => {
        const next = [...prev];
        const last = next[next.length - 1];
        
        const [mStr, yStr] = last.month.split(' ');
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        let idx = monthNames.indexOf(mStr);
        let yearDigit = parseInt(yStr);
        idx = (idx + 1) % 12;
        if (idx === 0) yearDigit += 1;
        const nextMonth = `${monthNames[idx]} ${yearDigit.toString().padStart(2, '0')}`;

        if (next.length >= 13) {
          next.shift();
        }

        const randExp = +(last.export + (Math.random() - 0.5) * 0.4).toFixed(1);
        const randGdp = +(last.gdp + (Math.random() - 0.5) * 0.3).toFixed(1);
        
        next.push({
          month: nextMonth,
          export: Math.max(10.5, Math.min(15.5, randExp)),
          gdp: Math.max(3.5, Math.min(7.5, randGdp))
        });
        return next;
      });

      setChartUpdatePulse(true);
      const timer = setTimeout(() => setChartUpdatePulse(false), 200);
      return () => clearTimeout(timer);
    }, 4000);

    return () => clearInterval(chartInterval);
  }, []);

  // Coordinate Calculations
  const getX = (index: number) => {
    return (index / (chartData.length - 1)) * 260 + 35; // margin offset
  };

  const getExportY = (val: number) => {
    // Export range: 10.5 to 15.5
    const h = 75;
    const padding = 15;
    const ratio = (val - 10.5) / 5.0;
    return h - ratio * h + padding;
  };

  const getGdpY = (val: number) => {
    // GDP range: 3.5 to 7.5
    const h = 75;
    const padding = 15;
    const ratio = (val - 3.5) / 4.0;
    return h - ratio * h + padding;
  };

  const linePathExport = useMemo(() => {
    return chartData.map((d, i) => `${getX(i).toFixed(1)},${getExportY(d.export).toFixed(1)}`).join(' L ');
  }, [chartData]);

  const linePathGdp = useMemo(() => {
    return chartData.map((d, i) => `${getX(i).toFixed(1)},${getGdpY(d.gdp).toFixed(1)}`).join(' L ');
  }, [chartData]);

  const bandPath = useMemo(() => {
    const topPoints = chartData.map((d, i) => `${getX(i).toFixed(1)},${getExportY(d.export + 0.3).toFixed(1)}`);
    const bottomPoints = [...chartData].reverse().map((d, i) => {
      const origIdx = chartData.length - 1 - i;
      return `${getX(origIdx).toFixed(1)},${getExportY(d.export - 0.3).toFixed(1)}`;
    });
    return `M ${topPoints.join(' L ')} L ${bottomPoints.join(' L ')} Z`;
  }, [chartData]);

  const scatterSpots = useMemo(() => {
    return chartData.flatMap((d, i) => {
      return [
        { x: getX(i) - 5, y: getExportY(d.export) + (i % 3 - 1) * 4 },
        { x: getX(i) + 4, y: getExportY(d.export) + (i % 2 === 0 ? 5 : -5) }
      ];
    }).filter(pt => pt.x > 35 && pt.x < 300);
  }, [chartData]);

  return (
    <section 
      className="bg-white border border-[#E2E7EF] rounded-[4px] p-5 h-[460px] flex flex-col justify-between overflow-hidden relative shadow-sm select-none"
      id="card-gdp-elasticity"
    >
      {/* Header */}
      <div className="shrink-0 flex items-center justify-between pb-2 border-b border-slate-100 select-none">
        <div className="flex items-center gap-1.5">
          <Activity size={14} className="text-[#2D6CDF]" />
          <h2 className="text-[12.5px] font-black text-[#0F1722] uppercase tracking-wide">
            {t('National Strategic Energy Export × Monthly GDP Elasticity Coupling', '国家战略能源出口与月度 GDP 弹性指数联动')}
          </h2>
        </div>
        <span className="text-[9px] font-mono text-slate-400 font-bold uppercase tracking-wider">
          {t('View v1.4 ↗', '视图版 v1.4 ↗')}
        </span>
      </div>

      {/* Main split */}
      <div className="flex-1 my-3 flex items-stretch gap-4 min-h-0 overflow-hidden">
        {/* Left SVG Line (60% width) */}
        <div className={`w-[60%] flex flex-col justify-between overflow-hidden relative bg-[#FAFBFD]/80 p-2.5 rounded-[2px] border border-slate-100 transition-transform ${chartUpdatePulse ? 'scale-[0.995]' : ''}`}>
          <div className="flex items-center justify-between text-[8px] font-mono text-[#6A7686] shrink-0">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-[#2D6CDF] block rounded-2xs" /> 
              {t('Energy Export (kbpd)', '月度能源出口量 (kbpd)')}
            </span>
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-[#E89518] block rounded-2xs" /> 
              {t('GDP Growth YoY (%)', '月度 GDP 同比增速 (%)')}
            </span>
          </div>

          <div className="flex-1 relative overflow-visible mt-2">
            <svg
              className="w-full h-full overflow-visible"
              viewBox="0 0 320 100"
              preserveAspectRatio="none"
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const mouseX = e.clientX - rect.left;
                const ratio = mouseX / rect.width;
                const idx = Math.max(0, Math.min(chartData.length - 1, Math.round(ratio * (chartData.length - 1))));
                setHoveredPointIndex(idx);
              }}
              onMouseLeave={() => setHoveredPointIndex(null)}
            >
              {/* Confidence interval fill */}
              <path d={bandPath} fill="#2D6CDF" fillOpacity="0.07" />

              {/* Horizontal grid lines */}
              {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
                const y = 15 + ratio * 75;
                const labelExport = (15.5 - ratio * 5.0).toFixed(1);
                const labelGdp = (7.5 - ratio * 4.0).toFixed(1);
                return (
                  <g key={idx}>
                    <line x1="35" y1={y} x2="300" y2={y} stroke="#EEF2F6" strokeWidth="0.8" />
                    <text x="31" y={y + 2.5} textAnchor="end" fill="#94A3B8" className="text-[7.5px] font-mono font-black">{labelExport}</text>
                    <text x="304" y={y + 2.5} textAnchor="start" fill="#E89518" className="text-[7.5px] font-mono font-black">{labelGdp}%</text>
                  </g>
                );
              })}

              {/* Trend Fitted Regression line */}
              <line x1={getX(0)} y1={getExportY(14.4)} x2={getX(chartData.length - 1)} y2={getExportY(12.0)} stroke="#A8B2C0" strokeWidth="0.75" strokeDasharray="2 3" strokeOpacity="0.5" />

              {/* Export path line */}
              <path d={`M ${linePathExport}`} fill="none" stroke="#2D6CDF" strokeWidth="1.5" />
              
              {/* GDP path line */}
              <path d={`M ${linePathGdp}`} fill="none" stroke="#E89518" strokeWidth="1.5" />

              {/* Scattered spot circles */}
              {scatterSpots.map((pt, idx) => (
                <circle key={idx} cx={pt.x} cy={pt.y} r="1" fill="#2D6CDF" opacity="0.3" />
              ))}

              {/* Interactive Tooltip tracking line */}
              {hoveredPointIndex !== null && (
                <>
                  <line x1={getX(hoveredPointIndex)} y1="15" x2={getX(hoveredPointIndex)} y2="90" stroke="#64748B" strokeWidth="0.5" strokeDasharray="1 1" />
                  <circle cx={getX(hoveredPointIndex)} cy={getExportY(chartData[hoveredPointIndex].export)} r="3" fill="#2D6CDF" stroke="#FFF" strokeWidth="0.5" />
                  <circle cx={getX(hoveredPointIndex)} cy={getGdpY(chartData[hoveredPointIndex].gdp)} r="3" fill="#E89518" stroke="#FFF" strokeWidth="0.5" />
                </>
              )}
            </svg>

            {/* Hover details floating card */}
            {hoveredPointIndex !== null && (
              <div className="absolute top-1 left-9 bg-[#0F1722] text-white p-2 text-[8px] font-mono rounded border border-white/5 z-30 leading-snug w-[125px] pointer-events-none text-left select-text">
                <div className="text-white/50 pb-0.5 mb-1 border-b border-white/5">{chartData[hoveredPointIndex].month}</div>
                <div className="flex justify-between">
                  <span>Export:</span>
                  <strong className="text-sky-300 font-extrabold">{chartData[hoveredPointIndex].export} kb/d</strong>
                </div>
                <div className="flex justify-between mt-0.5">
                  <span>GDP Growth:</span>
                  <strong className="text-amber-400 font-extrabold">{chartData[hoveredPointIndex].gdp}%</strong>
                </div>
              </div>
            )}
          </div>

          {/* Time axis x label */}
          <div className="flex justify-between text-[7px] text-[#A8B2C0] font-mono shrink-0 px-1 mt-1">
            {chartData.map((d, i) => {
              if (i % 3 !== 0 && i !== chartData.length - 1) return null;
              return <span key={i}>{d.month}</span>;
            })}
          </div>
        </div>

        {/* Right stacked KPI cards (40% width) with Formula Solver */}
        <div className="w-[38%] flex flex-col justify-between gap-2.5 shrink-0 select-text">
          {/* Top 3 compact horizontal blocks */}
          <div className="space-y-1.5 shrink-0 text-[10.5px]">
            <div className="border border-slate-100 bg-slate-50/70 py-1.5 px-2.5 rounded-[2px] flex items-center justify-between">
              <span className="text-[8px] font-bold text-slate-500 font-mono tracking-tight uppercase">
                {t('Coupling Elas α', '出口能耗弹性系数 α')}
              </span>
              <span className="text-[12.5px] font-black font-mono text-slate-900">0.42 <span className="text-[7.5px] font-normal text-slate-400 font-sans">a.u.</span></span>
            </div>

            <div className="border border-slate-100 bg-slate-50/70 py-1.5 px-2.5 rounded-[2px] flex items-center justify-between">
              <span className="text-[8px] font-bold text-slate-500 font-mono tracking-tight uppercase">
                {t('Coupling Var σ', '系数变化方差 σ')}
              </span>
              <span className="text-[12.5px] font-black font-mono text-slate-900">0.04</span>
            </div>

            <div className="border border-slate-100 bg-slate-50/70 py-1.5 px-2.5 rounded-[2px] flex items-center justify-between">
              <span className="text-[8px] font-bold text-slate-400 font-mono tracking-tight uppercase">
                {t('Rolling strength', '滚动弹性联动强度')}
              </span>
              <span className="text-[12.5px] font-black font-mono text-emerald-600">20.2% <span className="text-[7.5px] font-normal font-mono text-slate-400">R²</span></span>
            </div>
          </div>

          {/* Core Formulas and parameters block */}
          <div className="border border-slate-100 bg-[#FAFBFD]/90 p-2.5 rounded-[2px] font-mono text-[9.5px] text-[#2FA862] leading-[1.35] tabular-nums select-text flex-1 flex flex-col justify-center gap-1">
            <div className="text-[7px] text-slate-450 uppercase font-bold tracking-wider mb-0.5 border-b border-slate-100 pb-1 select-none">Coupling Solver Equation</div>
            <div>σ = 0.42</div>
            <div className="break-all">σ_GDP_annual = β · AP_oil + β · ε_oil + (model · ε) · GDP · 1010 0150</div>
            <div>E_export   = 0.84  (RMSE)</div>
            <div>scenario   = 96  (high export)</div>
            <div className="mt-0.5 text-emerald-700/80">α · GDP forecast = -0.24 pp annual (low export) [-0.15, -0.33]</div>
          </div>
        </div>
      </div>

      {/* Bottom mini KPIs */}
      <div className="grid grid-cols-4 gap-2 border-t border-slate-100 pt-3 shrink-0 text-center select-text">
        <div>
          <div className="text-[7.5px] font-mono text-[#6A7686] font-bold uppercase leading-none">{t('OIL EXPORT', '原油输出')}</div>
          <div className="text-[10px] font-black font-mono mt-1 text-[#0F1722]">1.82 Mbbl/d</div>
        </div>
        <div className="border-l border-slate-100">
          <div className="text-[7.5px] font-mono text-[#6A7686] font-bold uppercase leading-none">{t('GAS FLOW', '天燃分配')}</div>
          <div className="text-[10px] font-black font-mono mt-1 text-[#0F1722]">145 m³/d</div>
        </div>
        <div className="border-l border-slate-100">
          <div className="text-[7.5px] font-mono text-[#6A7686] font-bold uppercase leading-none">{t('COAL DELIV', '煤炭发煤')}</div>
          <div className="text-[10px] font-black font-mono mt-1 text-[#0F1722]">312 Kt/d</div>
        </div>
        <div className="border-l border-slate-100">
          <div className="text-[7.5px] font-mono text-[#6A7686] font-bold uppercase leading-none">{t('POWER CAP', '总电能网')}</div>
          <div className="text-[10px] font-black font-mono mt-1 text-[#0F1722]">20.4 GWh</div>
        </div>
      </div>
    </section>
  );
}
