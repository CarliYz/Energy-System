import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeft, BrainCircuit, GitBranch, AlertTriangle, ShieldAlert, CheckCircle2, 
  History, TrendingUp, Activity, Info, ChevronRight, Play, Pause, RotateCcw, 
  Settings, Key, Layers, Award, Terminal
} from 'lucide-react';
import { useLanguage } from '../components/LanguageContext';

export default function PipelineTimeSeries() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'workflow'
  const [isPlaying, setIsPlaying] = useState(false);
  const [scrubIndex, setScrubIndex] = useState(100);
  const [viewMode, setViewMode] = useState('both'); // 'sensor' | 'ai' | 'both'

  const tLabel = (en: string, zh: string) => {
    return language === 'zh' ? zh : en;
  };

  // Timer loop for play comparison simulation
  useEffect(() => {
    let interval: any = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setScrubIndex(prev => {
          if (prev >= 150) {
            setIsPlaying(false);
            return 100; // Reset or stop
          }
          return prev + 1;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  return (
    <div className="bg-[#F4F6FA] min-h-screen text-[#1A2330] flex flex-col font-sans select-none">
      
      {/* BACKGROUND HERO STRIP (Dark, 132px tall) */}
      <div className="bg-[#0F1722] text-white px-6 py-4 flex justify-between items-center h-[132px] shrink-0 border-b border-white/15 select-none relative">
        <div className="w-[45%] flex flex-col justify-between h-full">
          <div>
            <div className="flex items-center gap-2 text-[#2AB3A6] text-[10px] uppercase font-black tracking-widest font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2AB3A6] animate-pulse" />
              {tLabel('ACT II · AI REGULATORY DECISION', '第二幕 · 监管决策AI中央研判中枢')}
            </div>
            <h1 className="text-[26px] font-black tracking-tight text-white mt-1 leading-none uppercase">
              {tLabel('92% BREACH RISK WITHIN 48H', '92% 突发气压越限破网概率 · T-48H 范围')}
            </h1>
          </div>
          <p className="text-[11.5px] text-white/70 max-w-xl font-medium leading-tight">
            {tLabel(
              'Start preventive inspection within 36H. Multi-source physical identity graph has confirmed overproduction fingerprint. SCADA flow rate contradicts fuel invoice metrics.',
              '请于36H内立即派发并强制离线预防性督办实勘。多口径物理认同图谱已穿透锁定未申报产能。现场数采流量与财务进油发票形成强烈物理违规反差。'
            )}
          </p>
        </div>

        {/* 4 KPI tiles on dark */}
        <div className="flex-1 max-w-[55%] grid grid-cols-4 gap-4 h-full pl-6">
          <div className="bg-white/5 border border-white/10 p-2.5 rounded flex flex-col justify-between">
            <span className="text-[9px] text-white/50 uppercase font-black font-mono">{tLabel('Action Deadline', '行动最终截止SLA')}</span>
            <div className="text-[18px] font-mono font-black text-[#E89518]">36 H</div>
            <span className="text-[8px] text-white/40 leading-none">{tLabel('optimal intervention window', '预防性阻击最佳窗口')}</span>
          </div>
          <div className="bg-white/5 border border-white/10 p-2.5 rounded flex flex-col justify-between">
            <span className="text-[9px] text-white/50 uppercase font-black font-mono">{tLabel('Avoided Exposure', '拦截保障能量气规模')}</span>
            <div className="text-[18px] font-mono font-black text-[#2AB3A6]">75 MMcm</div>
            <span className="text-[8px] text-white/40 leading-none">{tLabel('30D forecast estimated loss', '30天滚动防失额度')}</span>
          </div>
          <div className="bg-white/5 border border-white/10 p-2.5 rounded flex flex-col justify-between">
            <span className="text-[9px] text-white/50 uppercase font-black font-mono">{tLabel('Pattern Match', '畸变形态历史相似度')}</span>
            <div className="text-[18px] font-mono font-black text-[#2D6CDF]">0.87 <span className="text-[10px] text-white/60 font-normal">[95% CI]</span></div>
            <span className="text-[8px] text-white/40 leading-none">CI: 0.82 - 0.92 (ANO-2025)</span>
          </div>
          <div className="bg-white/5 border border-white/10 p-2.5 rounded flex flex-col justify-between">
            <span className="text-[9px] text-white/50 uppercase font-black font-mono">{tLabel('Confidence', '智算求解置信度模型')}</span>
            <div className="text-[18px] font-mono font-black text-[#2AB3A6]">0.87 <span className="text-[10px] text-white/60 font-normal">v2.3</span></div>
            <span className="text-[8px] text-white/40 leading-none">91.2% Backtest Accuracy</span>
          </div>
        </div>
      </div>

      {/* TAB BAR & SUBHEADER */}
      <div className="h-12 bg-white border-b border-[#E2E7EF] px-6 flex items-center justify-between shadow-sm shrink-0 z-20">
        <div className="flex items-center gap-2">
          <button 
            onClick={() => navigate('/minister/dashboard')}
            className="flex items-center gap-1.5 text-[#6A7686] hover:text-[#0F1722] pr-3 border-r border-[#E2E7EF] text-[11px] font-bold"
          >
            <ArrowLeft size={13} />
            <span>{tLabel('Minister Desk', '回到部长专线')}</span>
          </button>
          <div className="text-[11px] font-mono text-[#6A7686] pl-2">
            Asset Anchor: <strong className="text-[#0F1722]">GE ICL Compressor · 18 MW · ICL-2BCL608/A (Aktau)</strong>
          </div>
        </div>

        {/* Tab triggers */}
        <div className="flex h-full items-center">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-6 h-full text-[11.5px] font-black tracking-wider uppercase border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'overview' 
                ? 'border-[#2D6CDF] text-[#2D6CDF]' 
                : 'border-transparent text-[#6A7686] hover:text-[#0F1722]'
            }`}
          >
            <Activity size={14} />
            {tLabel('Pre-emptive Overview', '一核心预测、一致性硬核对')}
          </button>
          <button
            onClick={() => setActiveTab('workflow')}
            className={`px-6 h-full text-[11.5px] font-black tracking-wider uppercase border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'workflow' 
                ? 'border-[#2D6CDF] text-[#2D6CDF]' 
                : 'border-transparent text-[#6A7686] hover:text-[#0F1722]'
            }`}
          >
            <GitBranch size={14} />
            {tLabel('Multi-Agent Compute DAG', '多智能体物理链计算 DAG')}
          </button>
        </div>
      </div>

      {/* TAB CONTENTS */}
      {activeTab === 'overview' ? (
        <div className="flex-1 p-6 flex flex-col gap-6 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 192px)' }}>
          
          {/* SECTION A: 4-SEGMENT TIME-SERIES SVG CHART */}
          <div className="bg-white rounded-[6px] border border-[#E2E7EF] p-5 shadow-sm flex flex-col">
            <div className="flex items-center justify-between border-b border-[#E2E7EF] pb-3 mb-3 shrink-0">
              <div>
                <h2 className="text-[15px] font-black text-[#0F1722] flex items-center gap-2">
                  <Activity size={16} className="text-[#2AB3A6]" />
                  {tLabel('PRE-EMPTIVE WARNING TIME-SERIES · GE ICL Compressor · Outlet Pressure (bar)', '前置早期特高维物理时序分析 · 出口加压管流量波形 (bar)' )}
                </h2>
                <div className="flex gap-4 text-[9.5px] text-[#6A7686] font-semibold mt-1 font-mono uppercase">
                  <span>Sensor Cadence: <strong className="text-[#0F1722]">15 min/pt (96/day)</strong></span>
                  <span>AI Cadence: <strong className="text-[#2D6CDF]">250 ms/pt</strong></span>
                  <span>Speed-up factor: <strong className="text-[#2AB3A6]">3,456×</strong></span>
                  <span className="text-[#B23A6A]">Lead time established: <strong>T-197h</strong></span>
                </div>
              </div>

              {/* View options switcher */}
              <div className="flex gap-1 bg-slate-100 border border-border-default rounded p-0.5">
                <button 
                  onClick={() => setViewMode('sensor')}
                  className={`text-[9.5px] uppercase font-bold px-2 py-0.5 rounded ${viewMode === 'sensor' ? 'bg-white shadow text-[#0F1722]' : 'text-[#6A7686]'}`}
                >
                  {tLabel('SCADA Only', '常规SCADA')}
                </button>
                <button 
                  onClick={() => setViewMode('ai')}
                  className={`text-[9.5px] uppercase font-bold px-2 py-0.5 rounded ${viewMode === 'ai' ? 'bg-white shadow text-[#0F1722]' : 'text-[#6A7686]'}`}
                >
                  {tLabel('AI Continuous', 'AI极密采样')}
                </button>
                <button 
                  onClick={() => setViewMode('both')}
                  className={`text-[9.5px] uppercase font-bold px-2 py-0.5 rounded ${viewMode === 'both' ? 'bg-white shadow text-[#0F1722]' : 'text-[#6A7686]'}`}
                >
                  {tLabel('Overlay Beide', '双模强核对叠加')}
                </button>
              </div>
            </div>

            {/* SVG Plot space with 4 defined segments */}
            <div className="grid grid-cols-12 gap-4">
              {/* Playback Controls and metrics left rail */}
              <div className="col-span-1.5 border-r border-[#E2E7EF] pr-4 flex flex-col justify-between py-2">
                <div className="space-y-4">
                  <div className="text-[#6A7686] font-mono text-[9px] uppercase font-black leading-none">{tLabel('Playback Engine', '仿真回播')}</div>
                  <div className="flex flex-col gap-1.5">
                    <button 
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="h-8 bg-[#2D6CDF] hover:bg-[#1E57C4] text-white rounded font-bold text-[10px] flex items-center justify-center gap-1"
                    >
                      {isPlaying ? <Pause size={10} /> : <Play size={10} />}
                      {isPlaying ? tLabel('Pause', '暂停') : tLabel('Play Play', '回播对比')}
                    </button>
                    <button 
                      onClick={() => { setIsPlaying(false); setScrubIndex(100); }}
                      className="h-7 border border-[#E2E7EF] text-[#6A7686] hover:bg-slate-50 rounded text-[9px] font-bold flex items-center justify-center gap-1"
                    >
                      <RotateCcw size={10} />
                      {tLabel('Reset', '重置')}
                    </button>
                  </div>
                </div>

                <div className="border-t border-[#E2E7EF] pt-3 mt-3">
                  <span className="text-[10px] uppercase font-black text-text-secondary leading-none">Scrub Selector:</span>
                  <input 
                    type="range"
                    min="100"
                    max="150"
                    value={scrubIndex}
                    onChange={(e) => setScrubIndex(parseInt(e.target.value))}
                    className="w-full mt-2 accent-[#2D6CDF]"
                  />
                  <div className="text-center font-mono font-bold text-[#0F1722] text-[12px] mt-1">T-{150 - scrubIndex}h</div>
                </div>
              </div>

              {/* 4 segment canvas vector frame */}
              <div className="col-span-8 bg-slate-50/50 rounded border border-[#E2E7EF] p-4 relative h-[300px]">
                
                {/* Now line marker */}
                <div className="absolute top-0 bottom-0 w-[1.5px] bg-[#0F1722] left-[78%] z-10 flex flex-col justify-between items-center">
                  <span className="bg-[#0F1722] text-white text-[8px] px-1 font-bold mt-1 shadow rounded-[2px] whitespace-nowrap">NOW</span>
                  <span className="bg-[#0F1722] text-white text-[8px] px-1 font-mono font-bold mb-1 shadow rounded-[2px] whitespace-nowrap">2026-05-28</span>
                </div>

                {/* Grid horizontal guidelines */}
                <div className="absolute top-[25%] left-0 right-0 h-[1px] border-t border-[#E2E7EF] border-dashed" />
                <div className="absolute top-[50%] left-0 right-0 h-[1px] border-t border-[#E2E7EF] border-dashed" />
                <div className="absolute top-[75%] left-0 right-0 h-[1px] border-t border-[#E2E7EF] border-dashed" />

                {/* 4 Visual Box Segments delineations */}
                <div className="absolute inset-y-0 left-0 w-[25%] border-r border-[#E2E7EF] border-dashed bg-[#FAFBFD]/30 flex flex-col justify-end p-2 pointer-events-none">
                  <div className="text-[#6A7686] text-[9.5px] font-black uppercase font-mono leading-none">SEG 1: HISTORICAL</div>
                  <div className="text-[8.5px] text-[#A8B2C0] mt-1 leading-none">T-720h → T-336h</div>
                </div>
                <div className="absolute inset-y-0 left-[25%] w-[25%] border-r border-[#E2E7EF] border-dashed bg-[#FAFBFD]/30 flex flex-col justify-end p-2 pointer-events-none">
                  <div className="text-[#0F1722] text-[9.5px] font-black uppercase font-mono leading-none">SEG 2: SCADA FLOWS</div>
                  <div className="text-[8.5px] text-[#A8B2C0] mt-1 leading-none">T-336h → T-72h</div>
                </div>
                <div className="absolute inset-y-0 left-[50%] w-[28%] border-r border-[#E2E7EF] border-dashed bg-[#FAFBFD]/30 flex flex-col justify-end p-2 pointer-events-none">
                  <div className="text-[#2AB3A6] text-[9.5px] font-black uppercase font-mono leading-none">SEG 3: AI SAMPLE</div>
                  <div className="text-[8.5px] text-[#2AB3A6] mt-1 leading-none font-bold">T-72h → NOW (250ms)</div>
                </div>
                <div className="absolute inset-y-0 left-[78%] w-[22%] bg-[#2D6CDF]/5 flex flex-col justify-end p-2 pointer-events-none">
                  <div className="text-[#2D6CDF] text-[9.5px] font-black uppercase font-mono leading-none">SEG 4: 72H FCAST</div>
                  <div className="text-[8.5px] text-[#2D6CDF] mt-1 leading-none font-bold">NOW → T+72h 95% CI</div>
                </div>

                {/* Real-time SCADA Scatter (sparse) and AI Dense high-frequency points (Simulated SVG) */}
                <svg className="w-full h-full pr-[1px]" viewBox="0 0 800 300" preserveAspectRatio="none">
                  {/* Confidence target boundaries shaded band in forecast zone */}
                  <path 
                    d="M 624 160 L 670 145 H 720 L 800 130 L 800 240 L 720 230 L 670 215 L 624 160 Z" 
                    fill="#7CE7C4" 
                    fillOpacity="0.25" 
                  />

                  {/* Normal baseline curve faint */}
                  <path 
                    d="M 0 150 Q 100 140 200 160 T 400 150 T 600 170 T 800 150" 
                    fill="none" 
                    stroke="#A8B2C0" 
                    strokeWidth="1.5"
                    strokeDasharray="4 4"
                    opacity="0.5"
                  />

                  {/* Actual Pressure line overlay */}
                  {/* Segment 1 & Segment 2 */}
                  {(viewMode === 'sensor' || viewMode === 'both') && (
                    <path 
                      d="M 0 150 L 50 145 L 100 155 L 150 140 L 200 160 L 250 152 L 300 148 L 350 155 L 400 140 L 450 162 M 450 162 L 624 210" 
                      fill="none" 
                      stroke="#0F1722" 
                      strokeWidth="2.5" 
                    />
                  )}

                  {/* Segment 3: Dense AI High frequency dots & deviation spike */}
                  {(viewMode === 'ai' || viewMode === 'both') && (
                    <path 
                      d="M 400 140 C 450 162, 500 200, 560 215 C 585 220, 600 240, 624 245" 
                      fill="none" 
                      stroke="#2AB3A6" 
                      strokeWidth="3.5"
                      strokeDasharray="3 1.5"
                    />
                  )}

                  {/* Segment 4 Forecast solid path */}
                  <path 
                    d="M 624 245 L 660 255 L 700 262 L 750 270 L 800 272" 
                    fill="none" 
                    stroke="#D8454C" 
                    strokeWidth="3"
                  />

                  {/* Pulsing anomaly marker pin during sample spikes */}
                  <circle cx="580" cy="225" r="7" fill="#D8454C" className="animate-pulse" />
                  <circle cx="580" cy="225" r="3" fill="white" />
                </svg>

                {/* Floating summary bubble card */}
                <div className="absolute top-4 right-4 bg-white/95 border border-[#E2E7EF] p-3 rounded shadow-lg text-[11px] font-sans max-w-[210px] pointer-events-none">
                  <div className="text-[#D8454C] font-black uppercase text-[9.5px]">{tLabel('Predicted Event Profile', '边缘智算推演事件图景')}</div>
                  <p className="font-bold text-[#0F1722] mt-0.5">{tLabel('💥 Gas Leak Precursor', '💥 高阶物理气阱泄漏早期征兆')}</p>
                  <p className="text-[#6A7686] text-[10px] mt-1">{tLabel('Expected window: T+18h ~ T+42h. Posterior P=0.92', '预判越位窗口：T+18h 至 T+42h. 置信概率 92%')}</p>
                </div>
              </div>

              {/* SECTION F: vs CLIENT CURRENT COMPARATIVE BOX (Right 2.5 columns) */}
              <div className="col-span-2.5 bg-[#FAFBFD] border border-[#E2E7EF] rounded p-4 flex flex-col justify-between">
                <div>
                  <h3 className="text-[10px] font-black uppercase text-[#0F1722] tracking-wider border-b border-[#E2E7EF] pb-1.5 mb-2 flex items-center gap-1.5">
                    <Terminal size={12} className="text-[#2D6CDF]" />
                    {tLabel('VS CLIENT CURRENT', '对比常规客户监管体系优势')}
                  </h3>

                  <div className="space-y-2 text-[11px] font-mono leading-tight">
                    <div className="flex justify-between border-b border-slate-100 pb-1">
                      <span className="text-[#6A7686]">{tLabel('SCADA Sampling', '采样周期')}</span>
                      <span className="text-right font-bold text-text-primary">15 MIN</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-100 pb-1 text-[#2D6CDF] font-black">
                      <span>{tLabel('AI Cadence', 'AI求解周期')}</span>
                      <span>250 MS (3,456x)</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-100 pb-1">
                      <span className="text-[#6A7686]">{tLabel('Lead Time', '预警前置时常')}</span>
                      <span className="text-right font-bold text-text-primary">T+0H (Concurrent)</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-100 pb-1 text-[#B23A6A] font-black">
                      <span>{tLabel('AI Lead-Time', 'AI预发提前量')}</span>
                      <span>T-197H PRE</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-100 pb-1">
                      <span className="text-[#6A7686]">{tLabel('Threshold Method', '阈值算法门限')}</span>
                      <span className="text-right font-bold text-text-primary">Single Static</span>
                    </div>
                    <div className="flex justify-between text-[#2D6CDF] font-black">
                      <span>{tLabel('AI Ensemble', 'AI概率引擎')}</span>
                      <span>3-Prob Ensemble</span>
                    </div>
                  </div>
                </div>

                <div className="bg-[#0F1722] text-white p-2.5 rounded text-[9.5px] mt-2 leading-snug">
                  <strong>MODEL ATTRIBUTION:</strong><br />
                  LLM-TS-Foundation V2.3 weight 0.50.<br />
                  Backtest score: 91.2% accuracy across 247 registered historical templates.
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-12 gap-6">
            {/* SECTION B: THREE-PROBABILITY ENSEMBLE VERDICT CARD STACK (Left 7 columns) */}
            <div className="col-span-7 bg-white rounded-[6px] border border-[#E2E7EF] p-5 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="text-[13px] font-black text-[#0F1722] uppercase tracking-wider pb-2 border-b border-[#E2E7EF] mb-4">
                  {tLabel('ACT II-B · THREE-PROBABILITY ENSEMBLE VERDICT', '核对中枢 · 贝叶斯概率三合一融合研判模型')}
                </h3>

                <div className="space-y-2.5">
                  {/* Rule Card */}
                  <div className="border border-border-default hover:border-[#E89518]/50 p-3 rounded bg-[#FAFBFD] flex items-center justify-between transition-colors">
                    <div>
                      <span className="text-[9px] font-bold uppercase text-[#6A7686]">{tLabel('Engine Alpha: Rule-Based Logic', '甲模型：常规刚性业务硬指标过滤规则锁')}</span>
                      <div className="text-[12px] font-bold text-[#0F1722] mt-0.5">{tLabel('Pressure / Temperature static threshold check (3/5 breached)', '常规气压超限、轴承温升微偏等多参数交叉 (3/5项溢出)')}</div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-[14px] font-mono font-black text-[#E89518]">P = 45%</div>
                      <span className="text-[8.5px] text-[#A8B2C0] font-mono">[95% CI: 38-52%]</span>
                    </div>
                  </div>

                  {/* Statistical Card */}
                  <div className="border border-border-default hover:border-[#E89518]/50 p-3 rounded bg-[#FAFBFD] flex items-center justify-between transition-colors">
                    <div>
                      <span className="text-[9px] font-bold uppercase text-[#6A7686]">{tLabel('Engine Beta: Multivariate Statistical', '乙模型：全息多维时差统计相关性计算')}</span>
                      <div className="text-[12px] font-bold text-[#0F1722] mt-0.5">{tLabel('Hotelling T² + EWMA residuals modeling (deviation +3.7σ above baseline)', '霍特林多维残差模型 + 动态加权移动偏离 (+3.7σ 深度越界)')}</div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-[14px] font-mono font-black text-[#E89518]">P = 68%</div>
                      <span className="text-[8.5px] text-[#A8B2C0] font-mono">[95% CI: 61-75%]</span>
                    </div>
                  </div>

                  {/* LLM Tech Card */}
                  <div className="border-2 border-[#D8454C]/50 hover:border-[#D8454C] p-3 rounded bg-[#D8454C]/5 flex items-center justify-between transition-all">
                    <div>
                      <span className="text-[9px] font-black uppercase text-[#D8454C]">{tLabel('Engine Gamma: LLM TimeGPT-style Foundation Model', '丙模型：大语言时序基础神经网络 (TimeGPT)')}</span>
                      <div className="text-[12px] font-bold text-[#0F1722] mt-0.5">{tLabel('Contextual 720h multi-source vector fusion (Matches Atyrau 2024 Template)', '对流720h多维参数自关联注意力特征提取 (匹配2024阿特劳重大特种扩装图景)')}</div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-[14px] font-mono font-black text-[#D8454C]">P = 92%</div>
                      <span className="text-[8.5px] text-[#D8454C] font-mono font-bold">[95% CI: 88-95%]</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Integrated formula summary */}
              <div className="bg-[#0F1722] text-white p-4 rounded mt-4 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="text-[11px] font-mono font-black text-[#2AB3A6]">
                      P(posterior) = w₁·P_rule + w₂·P_stat + w₃·P_llm
                    </div>
                    <div className="text-[9.5px] text-white/60 font-mono">
                      Weights: w₁ = 0.20 · w₂ = 0.30 · w₃ = 0.50 (adjusted dynamically by historic hit-rate)
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[20px] font-mono font-black text-[#D8454C]">POSTERIOR = 0.87</div>
                    <div className="text-[9px] text-[#2AB3A6] font-mono font-black">95% CI: [0.82 - 0.92]</div>
                  </div>
                </div>

                <div className="h-[1px] bg-white/10 my-3" />
                
                <div className="flex justify-between items-center text-[10.5px]">
                  <span className="text-white/80 font-bold">
                    🚀 DECISION: HIGH PROBABILITY COVERT OVERPRODUCTION / ILLEGAL PRESSURE
                  </span>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => navigate('/audit/report')}
                      className="bg-[#D8454C] hover:bg-[#B23A6A] text-white px-3 py-1 rounded-[3px] font-black uppercase tracking-wider text-[9.5px] transition-all"
                    >
                      {tLabel('⚠ Dispatch Preventive Inspection', '⚠ 立刻下发预防性实勘指令')}
                    </button>
                    <button 
                      onClick={() => navigate('/sensing/facility/default')}
                      className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-3 py-1 rounded-[3px] text-[9.5px] font-bold transition-all"
                    >
                      {tLabel('Open Equip Profile →', '物理测点自检 →')}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION D: SIX SYSTEMS CROSS-LINKED IDENTITY GRAPH & IDENTITIES (Right 5 columns) */}
            <div className="col-span-5 bg-white rounded-[6px] border border-[#E2E7EF] p-5 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="text-[13px] font-black text-[#0F1722] uppercase tracking-wider pb-2 border-b border-[#E2E7EF] mb-3">
                  {tLabel('ACT II-D · CROSS-SYSTEM REAL-TIME INTEGRITY GRAPH', '核对中枢 · 跨系统联合审计与物理守恒守等校验图')}
                </h3>
                <p className="text-[10px] text-[#6A7686] mb-3 leading-tight">
                  {tLabel('System matches 6 disparate ministerial databases to confirm real capacity usage.', '联合并叠加：KEGOC电网、调度局、气田生产线、发改委、环保部及公司完税系统数据')}
                </p>

                {/* 6 badges */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {['SCADA Meter', 'Dispatch MWh', 'UNG Fuel Gas', 'Emissions MOE', 'Tax Revenue', 'Permit Registry'].map((b, idx) => (
                    <span key={idx} className="bg-[#2D6CDF]/10 text-[#2D6CDF] px-2 py-0.5 rounded-[2px] font-mono font-black tracking-wide text-[8.5px] uppercase">
                      ● {b}
                    </span>
                  ))}
                </div>

                {/* 7 identities */}
                <div className="space-y-1.5 text-[11px] font-mono">
                  <div className="flex items-center justify-between p-1.5 bg-[#D8454C]/5 border-l-2 border-[#D8454C] rounded-[2px]">
                    <span>E1 &nbsp; Σ(gas in) × η = power output</span>
                    <span className="font-bold text-[#D8454C]">FAILS BY 17.5%</span>
                  </div>
                  <div className="flex items-center justify-between p-1.5 bg-[#D8454C]/5 border-l-2 border-[#D8454C] rounded-[2px]">
                    <span>E2 &nbsp; power out × emission = CO₂</span>
                    <span className="font-bold text-[#D8454C]">FAILS BY 14.2%</span>
                  </div>
                  <div className="flex items-center justify-between p-1.5 bg-[#D8454C]/5 border-l-2 border-[#D8454C] rounded-[2px]">
                    <span>E3 &nbsp; declared capacity ≥ actual peak</span>
                    <span className="font-bold text-[#D8454C]">FAILS BY 3.2 MW</span>
                  </div>
                  <div className="flex items-center justify-between p-1.5 bg-[#2FA862]/10 border-l-2 border-[#2FA862] rounded-[2px]">
                    <span>E4 &nbsp; tariff billing ⟷ MWh export</span>
                    <span className="font-bold text-[#2FA862]">CONSISTENT</span>
                  </div>
                  <div className="flex items-center justify-between p-1.5 bg-[#D8454C]/5 border-l-2 border-[#D8454C] rounded-[2px]">
                    <span>E5 &nbsp; registry permit = installed MW</span>
                    <span className="font-bold text-[#D8454C]">FAILS BY ~16 MW</span>
                  </div>
                  <div className="flex items-center justify-between p-1.5 bg-[#D8454C]/5 border-l-2 border-[#D8454C] rounded-[2px]">
                    <span>E6 &nbsp; heat-rate within ±5% regional peer</span>
                    <span className="font-bold text-[#D8454C]">FAILS BY +9.4%</span>
                  </div>
                  <div className="flex items-center justify-between p-1.5 bg-[#D8454C]/5 border-l-2 border-[#D8454C] rounded-[2px]">
                    <span>E7 &nbsp; inventory delta = flow velocity Δ</span>
                    <span className="font-bold text-[#D8454C]">FAILS BY 8.1%</span>
                  </div>
                </div>
              </div>

              <div className="text-[10px] text-[#6A7686] bg-[#FAFBFD] p-2.5 rounded border border-[#E2E7EF] leading-snug mt-3">
                <strong>{tLabel('CONCLUSION:', '综合研判定论：')}</strong>{' '}
                {tLabel(
                  '5 of 7 physical-identity equations breached. Combined overproduction volume estimation: 75 MMcm / 30D. High credibility covert overproduction verified automatically.',
                  '7项特征物理守等方程中有5项触发断裂。根据多智能体系统反向反推，未申报管流量在30日内累计蓄意高充已达到约7500万标立级别。'
                )}
              </div>
            </div>
          </div>

          {/* SECTION C & E: TOP-3 HYPOTHESES & HISTORICAL PRECEDENT BAND */}
          <div className="grid grid-cols-12 gap-6">
            
            {/* Hypotheses column */}
            <div className="col-span-5 bg-white rounded-[6px] border border-[#E2E7EF] p-5 shadow-sm">
              <h3 className="text-[11px] font-black text-[#0F1722] uppercase tracking-wider pb-1.5 border-b border-[#E2E7EF] mb-3">
                {tLabel('TOP 3 ACTIVE HYPOTHESES', '模型主导概率排队 (TOP 3 HYPOTHESES)')}
              </h3>
              
              <div className="space-y-2.5 text-[11px]">
                <div className="border border-red-200 bg-red-50/50 p-2.5 rounded">
                  <div className="flex justify-between font-bold text-[#D8454C] text-[10px]">
                    <span>H1: UNREPORTED CAPACITY EXPANSION</span>
                    <span>P = 65% [CI 0.58-0.72]</span>
                  </div>
                  <p className="text-[#6A7686] text-[10px] mt-1 leading-snug">
                    {tLabel(
                      'Night-time throughput uplift too consistent for noise. Pattern matches covert overproduction. New compressor unit ordered 2026-Q1 without regulatory file.',
                      '夜间通过负荷上探幅度过于规整，超出合理工况波动。特征流强匹配黑产越产。经查该公司于2026Q1违规境外自购大流量压缩。'
                    )}
                  </p>
                </div>
                <div className="border border-[#E2E7EF] p-2.5 rounded">
                  <div className="flex justify-between font-bold text-[#0F1722]">
                    <span>H2: PEAK-VALLEY LOAD SHIFTING</span>
                    <span>P = 22% [CI 0.18-0.27]</span>
                  </div>
                </div>
                <div className="border border-[#E2E7EF] p-2.5 rounded">
                  <div className="flex justify-between font-bold text-[#0F1722]">
                    <span>H3: SENSOR DRIFT / METERING SEG</span>
                    <span>P = 13% [CI 0.09-0.18]</span>
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION E: HISTORICAL PRECEDENT SCROLL BAR */}
            <div className="col-span-7 bg-white rounded-[6px] border border-[#E2E7EF] p-5 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="text-[11px] font-black text-[#0F1722] uppercase tracking-wider pb-1.5 border-b border-[#E2E7EF] mb-3">
                  {tLabel('HISTORICAL PRECEDENT LIBRARY · 247 PATTERNS HIGH-SPEED INDEXED', '里海沿岸历史核对违规先例沉淀库 (247个索引特征包)' )}
                </h3>
                
                <div className="grid grid-cols-3 gap-3">
                  <div className="border border-border-default hover:border-[#2D6CDF]/30 bg-[#FAFBFD] p-2.5 rounded text-[11px] flex flex-col justify-between h-[110px]">
                    <div className="font-bold text-[#0F1722] text-[10.5px]">Atyrau Compressor #4</div>
                    <div className="text-[9.5px] text-[#A8B2C0] font-mono mt-0.5 leading-none">2024-08 · Sensor era: 15min</div>
                    <div className="text-[9px] text-[#D8454C] font-semibold mt-1 leading-snug">Warning T+0H (concurrent with disaster)</div>
                  </div>

                  <div className="border border-border-default hover:border-[#2D6CDF]/30 bg-[#FAFBFD] p-2.5 rounded text-[11px] flex flex-col justify-between h-[110px]">
                    <div className="font-bold text-[#0F1722] text-[10.5px]">Kashagan Overpressure</div>
                    <div className="text-[9.5px] text-[#A8B2C0] font-mono mt-0.5 leading-none">2023-11 · Rule-only mode</div>
                    <div className="text-[9px] text-[#E89518] font-semibold mt-1 leading-snug">Lead time: T-12h (narrow window)</div>
                  </div>

                  <div className="border border-border-default hover:border-[#2D6CDF]/30 bg-[#FAFBFD] p-2.5 rounded text-[11px] flex flex-col justify-between h-[110px]">
                    <div className="font-bold text-[#0F1722] text-[10.5px]">Pavlodar Mine Methane</div>
                    <div className="text-[9.5px] text-[#A8B2C0] font-mono mt-0.5 leading-none">2025-02 · Compliance trigger</div>
                    <div className="text-[9px] text-[#2FA862] font-semibold mt-1 leading-snug">License revoked · Registered as core case</div>
                  </div>
                </div>
              </div>

              <div className="text-[9px] text-right text-[#2D6CDF] font-bold mt-2 hover:underline cursor-pointer" onClick={() => navigate('/closure/effectiveness')}>
                {tLabel('Browse full historical precedent database (247 files indexed) →', '下钻调阅哈萨克斯坦历史上全部247个能源套利及安全先例数据仓库 →')}
              </div>
            </div>

          </div>

        </div>
      ) : (
        /* TAB 2 · AGENT WORKFLOW DAG (Unchanged structure) */
        <div className="flex-1 p-6 flex flex-col justify-between overflow-y-auto" style={{ maxHeight: 'calc(100vh - 192px)' }}>
          <div className="bg-white rounded-[6px] border border-[#E2E7EF] p-5 shadow-sm">
            <h3 className="text-[13px] font-black text-[#0F1722] uppercase tracking-wider pb-2 border-b border-[#E2E7EF] mb-4">
              {tLabel('MULTI-AGENT DECISION PIPELINE & EVIDENCE MATRICES', '多智能体自组织联合推算网络 (Multi-Agent Decision Graph)')}
            </h3>

            {/* DAG Diagram structure simulation */}
            <div className="grid grid-cols-5 gap-4 relative">
              {/* Col 1 */}
              <div className="space-y-3">
                <div className="text-[9px] uppercase font-black text-[#A8B2C0] font-mono pb-1 border-b border-slate-100">{tLabel('Phase 1: Ingest Agents', '第一阶段：遥测数据数采口径')}</div>
                {['SCADA Meter Ingest', 'KEGOC Current Ingest', 'Invoice Fuel Ingest', 'Emissions MOE Ingest', 'Corporate Tax Ingest'].map((name, i) => (
                  <div key={i} className="bg-[#FAFBFD] border border-border-default p-2 rounded text-[10px] font-mono">
                    <div className="font-bold text-[#0F1722]">{name}</div>
                    <div className="text-[8.5px] text-[#2FA862] mt-0.5">● RUNNING OK [1.2 GB/s]</div>
                  </div>
                ))}
              </div>

              {/* Col 2 */}
              <div className="space-y-3 flex flex-col justify-center">
                <div className="text-[9px] uppercase font-black text-[#A8B2C0] font-mono pb-1 border-b border-slate-100">{tLabel('Phase 2: Resolvers', '第二阶段：数据分类及解耦')}</div>
                <div className="bg-[#0F1722] text-white p-3 rounded">
                  <div className="text-[11px] font-bold font-mono">Identity Graph Resolver</div>
                  <div className="text-[9px] text-[#2AB3A6] font-mono mt-1">● Map matching assets</div>
                  <p className="text-[8.5px] text-white/60 mt-1 lines-clamp-2">Routes by chemical-physical identities: heat-rate, MWh invoice</p>
                </div>
              </div>

              {/* Col 3 */}
              <div className="space-y-3">
                <div className="text-[9px] uppercase font-black text-[#A8B2C0] font-mono pb-1 border-b border-slate-100">{tLabel('Phase 3: Computes', '第三阶段：物理流物理守恒')}</div>
                {['Heat-Rate Computer', 'Emission Matcher', 'Electrical Active Load', 'Declared Limit Profiler', 'Flow Velocity Delta'].map((name, i) => (
                  <div key={i} className="bg-[#FAFBFD] border border-border-default p-2 rounded text-[10px] font-mono">
                    <div className="font-bold text-[#0F1722]">{name}</div>
                    <div className="text-[8.5px] text-[#D8454C] mt-0.5">▲ Deviation Breached!</div>
                  </div>
                ))}
              </div>

              {/* Col 4 */}
              <div className="space-y-3 flex flex-col justify-center">
                <div className="text-[9px] uppercase font-black text-[#A8B2C0] font-mono pb-1 border-b border-slate-100">{tLabel('Phase 4: Ensemble Master Audit', '第四阶段：贝叶斯集成判定')}</div>
                <div className="bg-[#D8454C]/5 border-2 border-[#D8454C] p-3 rounded text-[11px] font-mono">
                  <div className="text-[12px] font-black text-[#D8454C] uppercase">Master Audit Agent</div>
                  <div className="text-[9.5px] text-[#0F1722] font-black mt-1">Posterior: 0.87</div>
                  <p className="text-[8.5px] text-[#6A7686] mt-1 line-clamp-3">Evaluated 3 probability branches. Verified overproduction signature footprint.</p>
                </div>
              </div>

              {/* Col 5 */}
              <div className="space-y-3 flex flex-col justify-center">
                <div className="text-[9px] uppercase font-black text-[#A8B2C0] font-mono pb-1 border-b border-slate-100">{tLabel('Phase 5: Actions Hub', '第五阶段：一键政务催办分发')}</div>
                <div className="border border-border-default p-2.5 rounded bg-[#FAFBFD] space-y-1.5 text-[10px]">
                  <button onClick={() => navigate('/audit/report')} className="w-full py-1 bg-[#D8454C] text-white font-bold rounded uppercase tracking-wider text-[8.5px]">
                    Dispatch Inspect 36H
                  </button>
                  <button onClick={() => navigate('/closure/effectiveness')} className="w-full py-1 border border-border-default hover:bg-slate-50 text-[#0F1722] font-bold rounded uppercase tracking-wider text-[8.5px]">
                    Autochase Recommendations
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 60-monthly result cards grid representation */}
          <div className="bg-white rounded-[6px] border border-[#E2E7EF] p-5 shadow-sm mt-6">
            <h4 className="text-[11px] font-black text-[#0F1722] uppercase tracking-wider mb-2">
              {tLabel('60 MONTHLY CROSS-SYSTEM CONSISTENCY EVIDENCE SEGMENTS (12 MONTHS × 5 BRANCHES)', '60个月度跨系统合规数据对比矩阵表 (12个月 × 5个审计分支)' )}
            </h4>
            <div className="grid grid-cols-12 gap-1 bg-slate-100 p-2 rounded">
              {Array.from({ length: 12 }).map((_, mIdx) => (
                <div key={mIdx} className="space-y-1">
                  <div className="text-[8px] font-mono font-bold text-[#6A7686] text-center mb-1">M-{mIdx+1}</div>
                  {Array.from({ length: 5 }).map((_, bIdx) => {
                    const isRed = (mIdx >= 9 && bIdx !== 3); // Simulated matching pattern
                    return (
                      <div 
                        key={bIdx}
                        className={`h-6 rounded-[2px] border ${isRed ? 'bg-[#D8454C] border-[#D8454C]' : 'bg-[#2FA862] border-[#2FA862]'} transition-all cursor-help flex items-center justify-center`}
                        title={`Month ${mIdx+1} Branch ${bIdx+1}: ${isRed ? 'Anomaly' : 'Nominal'}`}
                      >
                        <span className="text-[8.5px] font-bold text-white uppercase font-mono">{isRed ? '▲' : '✓'}</span>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-2 text-[9px] text-[#A8B2C0] font-mono uppercase tracking-widest">
              <span>Jun 2025 (Month 1)</span>
              <span>May 2026 (Month 12, Active Investigation)</span>
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
