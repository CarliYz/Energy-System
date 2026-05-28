import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, AlertTriangle, BrainCircuit, Activity, TrendingUp,
  Cpu, GitMerge, Sigma, ShieldCheck, Clock, Play, Pause, ChevronRight, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/src/lib/utils';
import { useLanguage } from '../components/LanguageContext';

export default function PipelineTimeSeries() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const tLabel = (arg1: string, arg2?: string) => {
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

  // === Time Scrub state ===
  const ANCHORS = [
    { id: 'M12', label_en: 'T-12M', label_zh: 'T-12月', value: 0 },
    { id: 'D7',  label_en: 'T-7D',  label_zh: 'T-7天',  value: 30 },
    { id: 'H30', label_en: 'T-30H', label_zh: 'T-30时', value: 70 },
    { id: 'H58', label_en: 'T-58H Now', label_zh: 'T-58时 现', value: 100 },
  ];
  const [scrubValue, setScrubValue] = useState(100);
  const [activeEngine, setActiveEngine] = useState<'rule' | 'stat' | 'llm'>('llm');

  // Dynamic probabilities based on scrub index to prove learning is active
  const ruleProb = useMemo(() => {
    return Math.round(45 + (scrubValue - 100) * 0.1);
  }, [scrubValue]);

  const statProb = useMemo(() => {
    return Math.round(68 + (scrubValue - 100) * 0.15);
  }, [scrubValue]);

  const llmProb = useMemo(() => {
    return Math.round(92 + (scrubValue - 100) * 0.2);
  }, [scrubValue]);

  const fusedProb = useMemo(() => {
    const sum = 0.2 * ruleProb + 0.3 * statProb + 0.5 * llmProb;
    return (sum / 100).toFixed(2);
  }, [ruleProb, statProb, llmProb]);

  // === Generated dense waveform ===
  // Total 100 points
  const waveform = useMemo(() => {
    const pts: Array<{ x: number; y: number; seg: number }> = [];
    const baseline = 58;
    for (let i = 0; i <= 100; i++) {
      const x = i;
      let y = baseline;
      let seg = 1;
      
      // Calculate active base noise
      const noise = Math.sin(i / 1.5) * 5 + Math.cos(i / 0.8) * 3;
      
      if (i < 30) {
        seg = 1;
        y = baseline + noise * 0.5;
      } else if (i < 50) {
        seg = 2; // SCADA overcurrent
        y = baseline + Math.sin(i / 2) * 6 + noise * 0.8;
      } else if (i < 75) {
        seg = 3; // AI High Frequency dense
        y = baseline + Math.sin(i / 1.2) * 8 + (i - 50) * 0.4 + noise * 1.2;
      } else {
        seg = 4; // T+72H forecast
        y = baseline + 10 + (i - 75) * 0.8 + Math.sin(i / 1.5) * 4;
      }
      pts.push({ x, y, seg });
    }
    return pts;
  }, [scrubValue]);

  const getX = (index: number) => {
    return (index / 100) * 1000;
  };

  const getY = (yVal: number) => {
    const minVal = 30;
    const maxVal = 100;
    const height = 240;
    const ratio = (yVal - minVal) / (maxVal - minVal);
    return 270 - ratio * height;
  };

  const candlesticks = useMemo(() => {
    return waveform.map((p, i) => {
      const close = p.y;
      const open = p.y - Math.sin(i * 1.5) * 3;
      const high = Math.max(open, close) + Math.abs(Math.sin(i * 2.2) * 5) + 1;
      const low = Math.min(open, close) - Math.abs(Math.cos(i * 1.8) * 4) - 1;
      return {
        x: getX(i),
        open: getY(open),
        close: getY(close),
        high: getY(high),
        low: getY(low),
        isUp: close >= open,
        seg: p.seg
      };
    });
  }, [waveform]);

  const connectedPath = useMemo(() => {
    const pts = candlesticks.slice(0, 75);
    if (pts.length === 0) return '';
    return pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.close}`).join(' ');
  }, [candlesticks]);

  const forecastPath = useMemo(() => {
    const pts = candlesticks.slice(74); // continuous from now
    if (pts.length === 0) return '';
    return pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.close}`).join(' ');
  }, [candlesticks]);

  const confidenceBandPath = useMemo(() => {
    const pts = candlesticks;
    if (pts.length === 0) return '';
    const topPoints = pts.map(p => `${p.x} ${p.close - 15}`).join(' L ');
    const bottomPoints = [...pts].reverse().map(p => `${p.x} ${p.close + 15}`).join(' L ');
    return `M ${pts[0].x} ${pts[0].close - 15} L ${topPoints} L ${bottomPoints} Z`;
  }, [candlesticks]);

  return (
    <div className="flex-1 flex flex-col bg-[#F4F6FA] text-[#1A2330] overflow-hidden h-full">

      {/* ==== TOP HEADER (Palantir white, NO black banner) ==== */}
      <div className="h-14 border-b border-[#E2E7EF] bg-white flex items-center justify-between px-6 shrink-0 z-50 shadow-sm">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 text-[#6A7686] hover:text-[#0F1722] pr-3 border-r border-[#E2E7EF] text-[11px] font-bold">
            <ArrowLeft size={13} />
            <span>{tLabel('Back', '返回')}</span>
          </button>
          <span className="text-[11.5px] font-black uppercase text-[#0F1722] tracking-wider">
            {tLabel('ACT II-A · GAS PIPELINE HIGH-FREQUENCY TIME-SERIES FORECAST',
                    '第二幕甲 · 气体输送管线高频时序分析')}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 bg-[#D8454C] text-white text-[8px] font-bold rounded-sm uppercase font-mono">ANO-2026-0512</span>
          <span className="px-2 py-0.5 bg-[#0F1722] text-white text-[8px] font-bold rounded-sm uppercase font-mono">P={fusedProb}</span>
        </div>
      </div>

      {/* ==== WHITE KPI STRIP (replacing black banner) ==== */}
      <div className="h-20 bg-white border-b border-[#E2E7EF] px-6 grid grid-cols-5 gap-4 shrink-0 shadow-sm items-center">
        <div className="flex flex-col justify-center border-r border-slate-100 pr-4">
          <span className="text-[8.5px] text-[#A8B2C0] uppercase font-black font-mono">{tLabel('Breach Probability', '突发气压超限概率')}</span>
          <div className="font-black text-[#D8454C] text-[22px] mt-0.5 leading-none">92%<span className="text-[10px] text-[#6A7686] ml-1.5 font-normal">/ T-48H</span></div>
          <span className="text-[8.5px] text-[#6A7686] font-mono mt-0.5">95% CI: 87 – 95%</span>
        </div>
        <div className="flex flex-col justify-center border-r border-slate-100 pr-4">
          <span className="text-[8.5px] text-[#A8B2C0] uppercase font-black font-mono">{tLabel('Action Window', '处置窗口')}</span>
          <div className="font-black text-[#0F1722] text-[22px] mt-0.5 leading-none font-mono">36 H</div>
          <span className="text-[8.5px] text-[#6A7686] font-mono mt-0.5">{tLabel('Until enforcement breach', '至强制处置临界点')}</span>
        </div>
        <div className="flex flex-col justify-center border-r border-slate-100 pr-4">
          <span className="text-[8.5px] text-[#A8B2C0] uppercase font-black font-mono">{tLabel('Avoidable Loss', '可避免损失')}</span>
          <div className="font-black text-[#0F1722] text-[22px] mt-0.5 leading-none font-mono">75 MMcm</div>
          <span className="text-[8.5px] text-[#6A7686] font-mono mt-0.5">{tLabel('Cumulative 30D', '30 天累计')}</span>
        </div>
        <div className="flex flex-col justify-center border-r border-slate-100 pr-4">
          <span className="text-[8.5px] text-[#A8B2C0] uppercase font-black font-mono">{tLabel('Pattern Match Score', '历史先例匹配度')}</span>
          <div className="font-black text-[#0F1722] text-[22px] mt-0.5 leading-none font-mono">{fusedProb}</div>
          <span className="text-[8.5px] text-[#6A7686] font-mono mt-0.5">{tLabel('1,247 cases · 27 dim', '基于 1,247 案例库')}</span>
        </div>
        <div className="flex flex-col justify-center pl-2">
          <span className="text-[8.5px] text-[#A8B2C0] uppercase font-black font-mono">{tLabel('AI Engine', '推理引擎')}</span>
          <div className="font-black text-[#0F1722] text-[15px] mt-0.5 leading-none">{fusedProb} <span className="text-[9px] text-[#6A7686]">v2.3</span></div>
          <span className="text-[8.5px] text-[#2FA862] font-mono mt-0.5 font-bold">LLM-TS-Foundation</span>
        </div>
      </div>

      {/* === Asset anchor strip === */}
      <div className="h-9 bg-slate-50 border-b border-[#E2E7EF] px-6 flex items-center text-[10.5px] shrink-0">
        <span className="text-[#A8B2C0] font-mono mr-3">{tLabel('Asset Anchor:', '资产锚定:')}</span>
        <span className="font-black text-[#0F1722]">GE ICL Compressor · 18 MW · ICL-2BCL608/A (Aktau)</span>
        <div className="ml-auto flex items-center gap-3">
          <button className="text-[#2D6CDF] font-black flex items-center gap-1 text-[9.5px]">
            <Cpu size={11} /> {tLabel('One-Click Dispatch', '一键派单和追溯归因')}
          </button>
          <button className="text-[#6A7686] font-black flex items-center gap-1 text-[9.5px]">
            <BrainCircuit size={11} /> {tLabel('Multi-Agent Topology', '多智能体物理拓扑图')}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-5">

        {/* ==================================================== */}
        {/* SECTION A · MAIN WAVEFORM (denser, animated forecast) */}
        {/* ==================================================== */}
        <div className="bg-white border border-[#E2E7EF] rounded-[6px] p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[12px] font-black text-[#0F1722] uppercase tracking-wider">
              <Activity className="inline w-3.5 h-3.5 mr-1 text-[#D8454C]" />
              {tLabel('Pre-Warning Time-Series · Outlet Pressure (bar)', '前置早期特高维物理时序分析 · 出口加压管波形 (bar)')}
            </h3>
            <div className="flex items-center gap-3 text-[9px] font-mono text-[#6A7686]">
              <span>SENSOR CADENCE 15 MIN/PT (96/DAY)</span>
              <span className="text-[#A8B2C0]">·</span>
              <span>AI CADENCE 250 MS/PT</span>
              <span className="text-[#A8B2C0]">·</span>
              <span className="text-[#D8454C] font-black">SPEED-UP FACTOR 3,456×</span>
            </div>
          </div>

          <div className="flex gap-5">
            {/* Left: Scrub controller */}
            <div className="w-[180px] shrink-0 flex flex-col gap-3">
              <button className="bg-[#2D6CDF] text-white px-3 py-2 rounded text-[10px] font-black uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-sm">
                <Play size={11} /> {tLabel('Replay Comparison', '波形比照')}
              </button>
              
              {/* Scrub selector */}
              <div className="bg-slate-50 border border-[#E2E7EF] rounded p-2.5">
                <div className="text-[8.5px] font-black uppercase text-[#A8B2C0] mb-1 font-mono">{tLabel('Time Scrub · Historic Learning', 'Time Scrub · 历史回拨学习')}</div>
                <div className="text-[8.5px] text-[#6A7686] mb-2.5 leading-snug">
                  {tLabel('Drag slider to rewind time. Model dynamically re-trains on historic SCADA + tax billing data to forecast T+72h.',
                          '拖动滑块把时间回拨：模型自动用过去这段时期的物联、调度与财务发票等数据重新校正训练，从而预测 T+72h 物理外推情况。')}
                </div>
                <input type="range" min="0" max="100" value={scrubValue}
                  onChange={(e) => setScrubValue(Number(e.target.value))}
                  className="w-full accent-[#2D6CDF] cursor-pointer" />
                <div className="flex justify-between mt-1 text-[7.5px] font-mono text-[#A8B2C0] font-black">
                  {ANCHORS.map(a => (
                    <button key={a.id} onClick={() => setScrubValue(a.value)}
                      className={cn("hover:text-[#0F1722] py-0.5 px-1 rounded", scrubValue === a.value && 'text-[#D8454C] bg-[#D8454C]/5')}>
                      {tLabel(a.label_en, a.label_zh)}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Center: SVG dynamic high-fidelity waveform chart */}
            <div className="flex-1 relative h-[280px] border border-[#E2E7EF] rounded bg-[#FCFDFE]">
              <svg viewBox="0 0 1000 300" className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="ciGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2D6CDF" stopOpacity="0.14" />
                    <stop offset="100%" stopColor="#2D6CDF" stopOpacity="0.01" />
                  </linearGradient>
                </defs>

                {/* Grid horizontal lines */}
                {[0.2, 0.4, 0.6, 0.8].map((g, gi) => (
                  <line key={gi} x1="0" x2="1000" y1={g * 300} y2={g * 300}
                    stroke="#E2E7EF" strokeWidth="0.5" strokeDasharray="3 3" />
                ))}

                {/* Shifting background colors for different segments */}
                <rect x="0" y="0" width="300" height="300" fill="#F8FAFC" opacity="0.3" />
                <rect x="300" y="0" width="200" height="300" fill="#FFFFFF" opacity="0.5" />
                <rect x="500" y="0" width="250" height="300" fill="#FAFBFD" opacity="0.5" />
                <rect x="750" y="0" width="250" height="300" fill="#FFF5F5" opacity="0.3" />

                {/* 1. Normal Baseline curve (dashed gray reference line) */}
                <line x1="0" x2="1000" y1={getY(58)} y2={getY(58)} stroke="#A8B2C0" strokeWidth="0.8" strokeDasharray="4 3" />
                <text x="20" y={getY(58) - 5} fontSize="8.5" fill="#A8B2C0" fontFamily="monospace" fontWeight="bold">BASELINE μ</text>

                {/* 2. 95% Confidence Interval Band ribbon */}
                <path d={confidenceBandPath} fill="url(#ciGrad)" />

                {/* 3. Connected Curve Line for the data points */}
                <path d={connectedPath} stroke="#2D6CDF" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />

                {/* 3b. Scatter points on top of the connected line */}
                {candlesticks.slice(0, 75).map((cand, idx) => {
                  let fillCol = '#64748B';
                  if (cand.seg === 2) fillCol = '#2D6CDF';
                  if (cand.seg === 3) fillCol = '#0F1722';
                  if (idx % 2 === 0) {
                    return (
                      <circle key={`pt-${idx}`} cx={cand.x} cy={cand.close} r="2.5" fill={fillCol} />
                    );
                  }
                  return null;
                })}

                {/* 4. Candlestick Bars representing K-line detailed movements */}
                {candlesticks.slice(0, 75).map((cand, idx) => {
                  const width = 5;
                  const isUpColor = cand.isUp ? '#10B981' : '#EF4444';
                  const isUpFill = cand.isUp ? '#ECFDF5' : '#FEF2F2';
                  return (
                    <g key={`cand-${idx}`}>
                      <line x1={cand.x} x2={cand.x} y1={cand.low} y2={cand.high} stroke={isUpColor} strokeWidth="0.8" />
                      <rect
                        x={cand.x - width / 2}
                        y={Math.min(cand.open, cand.close)}
                        width={width}
                        height={Math.max(Math.abs(cand.open - cand.close), 2.5)}
                        fill={isUpFill}
                        stroke={isUpColor}
                        strokeWidth="1"
                        className="transition-all duration-300"
                      />
                    </g>
                  );
                })}

                {/* 5. SEG 4: Forecaster Fitted Bold Crimson Line (Connecting future forecast points) */}
                <path d={forecastPath} stroke="#D8454C" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                
                {/* Secondary predictive dashed glow line for forecasting visual flair */}
                <path d={forecastPath} stroke="#EF4444" strokeWidth="1.2" fill="none" strokeDasharray="3 3" opacity="0.8" />

                {/* Anomaly trigger marker on Seg 3 (around x=58%) */}
                {candlesticks[58] && (
                  <g>
                    <circle cx={candlesticks[58].x} cy={candlesticks[58].close} r="7" fill="none" stroke="#D8454C" strokeWidth="2.5">
                      <animate attributeName="r" from="4" to="14" dur="1.2s" repeatCount="indefinite" />
                      <animate attributeName="opacity" from="1" to="0" dur="1.2s" repeatCount="indefinite" />
                    </circle>
                    <circle cx={candlesticks[58].x} cy={candlesticks[58].close} r="3" fill="#D8454C" />
                  </g>
                )}

                {/* NOW Vertical delineation Line */}
                <line x1="750" x2="750" y1="0" y2="300" stroke="#D8454C" strokeWidth="1.5" strokeDasharray="3 2" />
                <text x="755" y="16" fontSize="9" fontWeight="bold" fill="#D8454C" fontFamily="monospace">NOW</text>

                {/* Zone Labels */}
                <text x="25" y="285" fontSize="8.5" fontWeight="bold" fill="#94A3B8" fontFamily="monospace">SEG 1: HISTORICAL (K-LINE)</text>
                <text x="325" y="285" fontSize="8.5" fontWeight="bold" fill="#2D6CDF" fontFamily="monospace">SEG 2: SCADA FLOWS</text>
                <text x="525" y="285" fontSize="8.5" fontWeight="bold" fill="#0F1722" fontFamily="monospace">SEG 3: AI SAMPLES (250MS)</text>
                <text x="775" y="285" fontSize="8.5" fontWeight="bold" fill="#D8454C" fontFamily="monospace">SEG 4: T+72H FORECAST</text>
              </svg>

              {/* Float pop assessment */}
              <div className="absolute top-[20%] left-[54%] bg-[#D8454C]/5 border border-[#D8454C]/20 rounded p-2 text-[9.5px] font-mono pointer-events-none">
                <div className="text-[#D8454C] font-black">{tLabel('Pressure Anomaly Hotspot (T-58H)', '管压超阈值极危异常点 (T-58时)')}</div>
                <div className="text-[#6A7686] mt-0.5">Deviation of +3.7σ mapped dynamically.</div>
              </div>
            </div>

            {/* Right: 3-engine ensemble panel */}
            <div className="w-[280px] shrink-0 flex flex-col gap-2">
              <div className="text-[9px] font-black uppercase text-[#A8B2C0] font-mono tracking-wider">
                {tLabel('3-Engine Fused Ensemble Logic', '三概率自洽集成研判引擎')}
              </div>

              {/* Engine α */}
              <div onClick={() => setActiveEngine('rule')}
                className={cn("bg-white border rounded p-2.5 cursor-pointer transition-all duration-150",
                  activeEngine === 'rule' ? 'border-[#2D6CDF] ring-1 ring-[#2D6CDF]/30 shadow' : 'border-[#E2E7EF]')}>
                <div className="flex items-center justify-between">
                  <span className="text-[9.5px] font-black text-[#0F1722]">Engine α · {tLabel('Rule-Based Logic', '刚性规则锁')}</span>
                  <span className="text-[8.5px] font-mono text-[#6A7686]">w=0.20</span>
                </div>
                <p className="text-[8.5px] text-[#6A7686] mt-0.5 mb-1.5">{tLabel('Pressure / Temp static threshold rules', '气压、温升、流速静态阈值刚性规则过滤')}</p>
                <div className="flex items-center gap-1.5">
                  <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-[#E89518] transition-all duration-500" style={{ width: `${ruleProb}%` }} />
                  </div>
                  <span className="text-[9.5px] font-mono font-black text-[#E89518]">P={ruleProb}%</span>
                </div>
              </div>

              {/* Engine β */}
              <div onClick={() => setActiveEngine('stat')}
                className={cn("bg-white border rounded p-2.5 cursor-pointer transition-all duration-150",
                  activeEngine === 'stat' ? 'border-[#2D6CDF] ring-1 ring-[#2D6CDF]/30 shadow' : 'border-[#E2E7EF]')}>
                <div className="flex items-center justify-between">
                  <span className="text-[9.5px] font-black text-[#0F1722]">Engine β · {tLabel('Multivariate SPC', '过程统计控制')}</span>
                  <span className="text-[8.5px] font-mono text-[#6A7686]">w=0.30</span>
                </div>
                <p className="text-[8.5px] text-[#6A7686] mt-0.5 mb-1.5">{tLabel('Hotelling T² + EWMA multivariate residuals', '霍特林多维残差模型 + 加权偏离指数')}</p>
                <div className="flex items-center gap-1.5">
                  <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-[#E89518] transition-all duration-500" style={{ width: `${statProb}%` }} />
                  </div>
                  <span className="text-[9.5px] font-mono font-black text-[#E89518]">P={statProb}%</span>
                </div>
              </div>

              {/* Engine γ */}
              <div onClick={() => setActiveEngine('llm')}
                className={cn("bg-white border-2 rounded p-2.5 cursor-pointer transition-all duration-150",
                  activeEngine === 'llm' ? 'border-[#D8454C] ring-2 ring-[#D8454C]/20 shadow' : 'border-[#E2E7EF]')}>
                <div className="flex items-center justify-between">
                  <span className="text-[9.5px] font-black text-[#0F1722]">Engine γ · {tLabel('LLM Foundation', '大模型时序流')}</span>
                  <span className="text-[8.5px] font-mono text-[#D8454C] font-black">w=0.50</span>
                </div>
                <p className="text-[8.5px] text-[#6A7686] mt-0.5 mb-1.5">{tLabel('LLM-TS-Foundation-V2.3 contextual attention', '大语言时序神经网络多模式自关联算力求解')}</p>
                <div className="flex items-center gap-1.5">
                  <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-[#D8454C] transition-all duration-500" style={{ width: `${llmProb}%` }} />
                  </div>
                  <span className="text-[9.5px] font-mono font-black text-[#D8454C]">P={llmProb}%</span>
                </div>
              </div>

              {/* Fused Posterior Box */}
              <div className="bg-[#0F1722] text-white rounded p-3 mt-1.5 flex justify-between items-center">
                <div className="space-y-0.5">
                  <span className="text-[8px] font-black uppercase text-slate-400 font-mono tracking-wider">{tLabel('Fused Posterior Verdict', '三模自洽融合后验')}</span>
                  <div className="text-[8px] font-mono text-slate-400">P = 0.20·P_α + 0.30·P_β + 0.50·P_γ</div>
                </div>
                <div className="text-right">
                  <div className="text-[18px] font-mono font-black text-[#D8454C] leading-none">P = {fusedProb}</div>
                  <span className="text-[8px] text-slate-400 font-mono">95% CI: 0.87 - 0.95</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ================================================================ */}
        {/* SECTION B · MERGED COMPUTATION GRAPH (左→右一层一层算到 P=0.87)   */}
        {/* ================================================================ */}
        <div className="bg-white border border-[#E2E7EF] rounded-[6px] p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
            <h3 className="text-[12.5px] font-black text-[#0F1722] uppercase tracking-wider">
              <GitMerge className="inline w-3.5 h-3.5 mr-1 text-[#2D6CDF]" />
              {tLabel('Cross-System Layered Compute Graph · Unified Physical Verification Chain',
                      '核对中枢 · 跨系统联合多层计算图：6 来源 → 7 守恒方程 → 3 概率模型 → 终审')}
            </h3>
            <span className="text-[9px] font-mono text-[#A8B2C0]">{tLabel('Fully traceable directed graph computation', '核对拓扑：有向物理方程演算推导')}</span>
          </div>

          <div className="relative h-[320px] border border-[#E2E7EF] rounded bg-slate-50/20 p-4 overflow-hidden">
            <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 0 }}>
              <defs>
                <marker id="arrowGreen" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#2FA862" />
                </marker>
                <marker id="arrowRed" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#D8454C" />
                </marker>
              </defs>

              {/* Step 1 to Step 2 Lines */}
              {[46, 82, 118, 154, 190, 226].map((yVal, i) => (
                <line key={`line1-${i}`} x1="12%" y1={`${yVal}px`} x2="35%" y2={`${yVal + 10}px`} 
                  stroke={i === 3 ? '#2FA862' : '#D8454C'} strokeWidth="1.2" 
                  markerEnd={i === 3 ? 'url(#arrowGreen)' : 'url(#arrowRed)'} />
              ))}

              {/* Step 2 to Step 3 Lines */}
              {[56, 92, 128, 164, 200, 236, 272].map((y1Val, idx) => (
                <React.Fragment key={idx}>
                  <line x1="47%" y1={`${y1Val}px`} x2="68%" y2="76px" stroke="#D8454C" strokeWidth="0.8" opacity="0.6" />
                  <line x1="47%" y1={`${y1Val}px`} x2="68%" y2="148px" stroke="#D8454C" strokeWidth="0.8" opacity="0.6" fill="none" />
                  <line x1="47%" y1={`${y1Val}px`} x2="68%" y2="220px" stroke="#D8454C" strokeWidth="1.1" opacity="0.8" fill="none" />
                </React.Fragment>
              ))}

              {/* Step 3 to Step 4 Lines */}
              <line x1="78%" y1="76px" x2="88%" y2="150px" stroke="#E89518" strokeWidth="1.5" markerEnd="url(#arrowRed)" />
              <line x1="78%" y1="148px" x2="88%" y2="150px" stroke="#E89518" strokeWidth="1.5" markerEnd="url(#arrowRed)" />
              <line x1="78%" y1="220px" x2="88%" y2="150px" stroke="#D8454C" strokeWidth="2.2" markerEnd="url(#arrowRed)" />
            </svg>

            {/* Column 1 · High-density Data sources */}
            <div className="absolute top-3 left-[2%] w-[10%] space-y-2">
              <div className="text-[8.5px] font-black uppercase text-[#A8B2C0] font-mono leading-none border-b border-slate-200 pb-1">1 · Data Sources</div>
              {['SCADA Meter', 'KEGOC MWh', 'UNG Fuel Gas', 'Emissions MOE', 'Tax Revenue', 'Permit Registry'].map((source, i) => (
                <div key={i} className="bg-white border border-[#E2E7EF] rounded px-1.5 py-1 text-[8px] font-mono truncate shadow-sm font-bold text-slate-700">{source}</div>
              ))}
            </div>

            {/* Column 2 · 7 Physical constraints and equations */}
            <div className="absolute top-3 left-[35%] w-[12%] space-y-1.5">
              <div className="text-[8.5px] font-black uppercase text-[#A8B2C0] font-mono leading-none border-b border-slate-200 pb-1">2 · 7 Physics Equations</div>
              {[
                { eq: 'E1 Σ(gas in)·η = P_out', res: 'fail 17.5%', err: true },
                { eq: 'E2 power·emiss = CO₂', res: 'fail 14.2%', err: true },
                { eq: 'E3 declared ≥ actual', res: 'fail 3.2 MW', err: true },
                { eq: 'E4 tariff ⟷ MWh', res: 'consistent', err: false },
                { eq: 'E5 registry = installed', res: 'fail 16 MW', err: true },
                { eq: 'E6 heat-rate ±5%', res: 'fail +9.4%', err: true },
                { eq: 'E7 inv delta = velocity', res: 'fail 8.1%', err: true }
              ].map((row, idx) => (
                <div key={idx} className={cn("border-l-2 rounded px-1.5 py-0.5 text-[8.5px] font-mono shadow-sm",
                  row.err ? 'bg-[#D8454C]/5 border-[#D8454C]' : 'bg-[#2FA862]/5 border-[#2FA862]')}>
                  <div className="font-extrabold text-[#0F1722] truncate">{row.eq}</div>
                  <div className={cn("text-[7.5px] font-black uppercase", row.err ? 'text-[#D8454C]' : 'text-[#2FA862]')}>{row.res}</div>
                </div>
              ))}
            </div>

            {/* Column 3 · 3 Unified Bayesian Estimators */}
            <div className="absolute top-3 left-[68%] w-[10%] space-y-4 pt-10">
              <div className="text-[8.5px] font-black uppercase text-[#A8B2C0] font-mono leading-none border-b border-slate-200 pb-1 absolute top-3 left-0 right-0">3 · 3 Model Estimators</div>
              <div className="bg-white border border-[#E89518] rounded p-1.5 text-[8px] font-mono shadow-sm">
                <div className="font-bold text-[#6A7686]">α · Rule-Based</div>
                <div className="text-[#E89518] font-black text-[9.5px] mt-0.5">P={ruleProb}%</div>
              </div>
              <div className="bg-white border border-[#E89518] rounded p-1.5 text-[8px] font-mono shadow-sm">
                <div className="font-bold text-[#6A7686]">β · Statistical</div>
                <div className="text-[#E89518] font-black text-[9.5px] mt-0.5">P={statProb}%</div>
              </div>
              <div className="bg-white border-2 border-[#D8454C] rounded p-1.5 text-[8px] font-mono shadow-md">
                <div className="font-black text-[#0F1722]">γ · LLM Found</div>
                <div className="text-[#D8454C] font-black text-[9.5px] mt-0.5">P={llmProb}%</div>
              </div>
            </div>

            {/* Column 4 · Unified Fused Verdict */}
            <div className="absolute top-[32%] right-[2%] w-[10%]">
              <div className="text-[8.5px] font-black uppercase text-[#A8B2C0] font-mono leading-none border-b border-slate-200 pb-1 mb-2">4 · Final Verdict</div>
              <div className="bg-[#D8454C]/5 border-2 border-[#D8454C] rounded p-2 text-center shadow">
                <span className="text-[7.5px] font-black text-[#D8454C] font-mono">POSTERIOR</span>
                <div className="text-[22px] font-black font-mono text-[#0F1722] leading-none mt-1">{fusedProb}</div>
                <div className="text-[7px] text-[#6A7686] font-mono mt-1 font-black uppercase">{tLabel('Verify Breach', '确证偷漏瞒报成立')}</div>
              </div>
            </div>
          </div>

          <div className="text-[9.5px] text-[#6A7686] bg-[#FAFBFD] p-2 rounded border border-[#E2E7EF] leading-snug mt-3">
            <strong className="text-[#0F1722]">{tLabel('COMPUTATION VERDICT:', '计算节点定论：')}</strong>{' '}
            {tLabel('5 out of 7 physics-identity constraints failed. Combined logic has locked anomaly signature path. Predicted unreported gas through volume reaches 75 MMcm / 30D.',
                    '7 组联合物理约束守恒方程中有 5 组触发断裂性跑账，多智能体已自动联动阿克套稽查大队，锁定未申报产能 7500 万标立。')}
          </div>
        </div>

        {/* ================================================================ */}
        {/* SECTION C · TOP-3 HYPOTHESES (压缩成 1/4 屏高 · 横向平铺)            */}
        {/* ================================================================ */}
        <div className="bg-white border border-[#E2E7EF] rounded-[6px] p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-[11px] font-black text-[#0F1722] uppercase tracking-wider">
              {tLabel('TOP 3 Candidate Hypotheses · Dominant Probability Model Grid',
                      'TOP 3 候选假设 · 概率排序 (主导概率 = 所有可能成因中排第一名的先例合规概率)')}
            </h3>
            <span className="text-[8px] font-mono text-[#A8B2C0]">
              {tLabel('Source: Caspian 12-month precedent library · 1,247 historical patterns · 27 match dimensions',
                      '算法分析依据：里海沿岸历史违规先例沉淀库 · 1,247 案例 · 27 个高维自相似维度匹配')}
            </span>
          </div>
          
          <div className="grid grid-cols-3 gap-3">
            <div className="border border-[#D8454C] bg-[#D8454C]/5 rounded p-2.5 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[9.5px] font-black text-[#D8454C] uppercase">H1 · {tLabel('Covert Capacity Expansion', '蓄意瞒报增产')}</span>
                <span className="text-[11px] font-mono font-black text-[#D8454C]">P={llmProb}%</span>
              </div>
              <p className="text-[9px] text-[#6A7686] mt-1 leading-normal">{tLabel('Night-time profile is highly organized. Match with Almaty 2025 precedent. New auxiliary pump bought in secret.', '夜间流量过于规整，匹配阿克套历史蓄意未申报增加压缩机偷逃规费行为模式。')}</p>
            </div>
            <div className="border border-[#E2E7EF] rounded p-2.5 bg-white flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[9.5px] font-black text-[#0F1722] uppercase">H2 · {tLabel('Demand-Response Shifting', '峰谷调峰响应')}</span>
                <span className="text-[11px] font-mono font-black text-slate-800">P=22%</span>
              </div>
              <p className="text-[9px] text-[#6A7686] mt-1 leading-normal">{tLabel('Grid response pattern. Disproved by lack of local permit filings in system databases.', '电网反向尖峰响应。对账提示缺乏对应调峰备案，行政上判定违规。')}</p>
            </div>
            <div className="border border-[#E2E7EF] rounded p-2.5 bg-white flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[9.5px] font-black text-[#0F1722] uppercase">H3 · {tLabel('Sensor Drift / Leak', '仪表偏置或泄漏')}</span>
                <span className="text-[11px] font-mono font-black text-slate-800">P=13%</span>
              </div>
              <p className="text-[9px] text-[#6A7686] mt-1 leading-normal">{tLabel('Pipeline sensor mechanical decay. Redundant meter check has rejected coordinate drift.', '物理管网传动微差。红线校验提示流速互差不符，仪表漂移假说被拒。')}</p>
            </div>
          </div>
        </div>

      </div>

      {/* ==== BOTTOM mini status bar (replacing the 闭环督办流程泳道图)  ==== */}
      <div className="h-9 bg-white border-t border-[#E2E7EF] px-5 flex items-center justify-between shrink-0 text-[9.5px] font-mono text-[#6A7686]">
        <div className="flex items-center gap-3">
          <span className="text-[8.5px] font-black text-[#A8B2C0] uppercase tracking-wider">{tLabel('PIPELINE', '督办流程')}</span>
          {['DETECT 12', 'ATTRIBUTE 8', 'DISPATCH 5', 'RESOLVE 3', 'REVIEW 2', 'ARCHIVE 1'].map((s, i) => (
            <span key={i} className="flex items-center gap-2">
              <span className={cn("w-1.5 h-1.5 rounded-full", i === 0 ? 'bg-[#D8454C] animate-pulse' : i === 1 ? 'bg-[#E89518]' : 'bg-[#2FA862]')} />
              <span className="font-extrabold text-[#0F1722]">{s}</span>
            </span>
          ))}
        </div>
        <span>33 active · 5 in preventive window</span>
      </div>

    </div>
  );
}
