import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../LanguageContext';
import { 
  Send, ShieldCheck, Mail, ShieldAlert, Check, 
  Settings, Loader, FileSpreadsheet, Lock, AlertCircle 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Topics to map with SentimentConsole (ENG-001 to ENG-10)
const BUBBLE_TOPICS = [
  { id: 'ENG-002', nameCn: '用电价格上涨 +35%', nameEn: 'Utility Bills +35%', r: 35, cx: 70, cy: 50, severity: 'critical', volume: '410K+' },
  { id: 'ENG-001', nameCn: '燃气价格上涨 +28%', nameEn: 'Gasoline Price +28%', r: 29, cx: 155, cy: 45, severity: 'critical', volume: '680K+' },
  { id: 'ENG-003', nameCn: '甲烷超限传闻发酵', nameEn: 'Methane Leak Case', r: 24, cx: 245, cy: 55, severity: 'warning', volume: '320K+' },
  { id: 'ENG-004', nameCn: '阿克套煤价上调', nameEn: 'Aktau Coal Price +18%', r: 26, cx: 110, cy: 115, severity: 'critical', volume: '230K+' },
  { id: 'ENG-005', nameCn: '巴甫洛达尔抢电事件', nameEn: 'Pavlodar Grid Grabbing', r: 25, cx: 195, cy: 110, severity: 'warning', volume: '180K+' },
  { id: 'ENG-010', nameCn: '里海稽查案发酵', nameEn: 'Caspian Probe Rumor', r: 22, cx: 285, cy: 105, severity: 'warning', volume: '52K+' },
  { id: 'ENG-008', nameCn: '田吉仪扩产环保抗议', nameEn: 'Tengiz ESG Protest', r: 18, cx: 45, cy: 110, severity: 'normal', volume: '78K+' },
  { id: 'ENG-006', nameCn: '扎瑙津话题升温', nameEn: 'Zhanaozen Unrest posts', r: 16, cx: 288, cy: 45, severity: 'normal', volume: '156K+' },
];

const LINE_TRENDS = [
  { topicId: 'ENG-001', color: '#D8454C', nameCn: '燃气价格', nameEn: 'Gas Price', points: [12, 18, 15, 22, 28, 35, 41, 48, 45, 42, 39, 36] },
  { topicId: 'ENG-002', color: '#8B5CF6', nameCn: '供热账单', nameEn: 'Heating Bill', points: [8, 12, 19, 21, 24, 28, 32, 38, 35, 30, 28, 26] },
  { topicId: 'ENG-003', color: '#2D6CDF', nameCn: '甲烷泄漏', nameEn: 'Methane Leak', points: [5, 9, 8, 11, 14, 18, 22, 25, 22, 19, 17, 15] },
  { topicId: 'ENG-004', color: '#E89518', nameCn: '阿克套煤价', nameEn: 'Aktau Coal', points: [20, 22, 21, 23, 22, 25, 26, 28, 27, 25, 24, 23] },
  { topicId: 'ENG-005', color: '#2FA862', nameCn: '抢电事件', nameEn: 'Grid Grab', points: [15, 14, 16, 18, 17, 20, 22, 24, 21, 19, 18, 17] },
  { topicId: 'ENG-010', color: '#EC4899', nameCn: '里海稽查案', nameEn: 'Caspian Probe', points: [4, 6, 8, 12, 15, 21, 28, 32, 29, 25, 22, 18] },
];

export default function CardSentimentOverview() {
  const { language } = useLanguage();
  const navigate = useNavigate();
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

  // View switch state
  const [viewMode, setViewMode] = useState<'bubble' | 'line'>('bubble');
  const [hoveredBubble, setHoveredBubble] = useState<string | null>(null);
  const [hoveredLineIndex, setHoveredLineIndex] = useState<number | null>(null);

  // CompactPostCard state
  const [postText, setPostText] = useState(
    '【特级指令 · 阿特劳物理压力平衡研判】里海管道Corridor周边侦听发生偏离。紧急提请属地合规外勤组启动15分钟滚动激光探嗅特检，同步开启对西里海主体（ENT-0091）账目关联与资金流限额。'
  );
  
  const [syncGrid, setSyncGrid] = useState(true);
  const [syncFieldTeam, setSyncFieldTeam] = useState(true);
  const [syncAttorney, setSyncAttorney] = useState(false);

  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleTransmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSending || isSent) return;

    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      setIsSent(true);
    }, 1500);
  };

  const getLineX = (index: number) => {
    return 35 + (index / 11) * 260;
  };
  const getLineY = (val: number) => {
    return 135 - (val / 50) * 110;
  };

  return (
    <div 
      className="bg-white border border-[#E2E7EF] rounded-[4px] p-5 shadow-sm h-[460px] flex flex-col justify-between overflow-hidden relative select-none font-sans"
      id="card-sentiment-overview"
    >
      {/* Title Header */}
      <div className="shrink-0 flex items-center justify-between pb-2 border-b border-slate-100 select-none">
        <div className="flex items-center gap-2">
          <ShieldAlert className="text-red-500 shrink-0" size={16} />
          <h2 className="text-[13px] font-black uppercase text-[#0F1722] tracking-wider">
            {t('Sentiment Monitor', '舆情监测')}
          </h2>
          <span className="text-[10px] text-slate-400 font-medium font-sans">
            • {t('Public opinion + social media · Dual view mode', 'Public opinion + social media · 双视图模式')}
          </span>
        </div>
        <span className="text-[9px] font-mono text-slate-400 font-bold uppercase tracking-widest bg-slate-100 px-2 py-0.5 rounded-[2px]">v1.4 VIEW ↗</span>
      </div>

      {/* 60/40 Split Content Area */}
      <div className="flex-1 my-3.5 flex items-stretch gap-4 min-h-0 overflow-hidden">
        
        {/* Left Side (60%): Bubble / Line interactive views */}
        <div className="w-[60%] flex flex-col justify-between overflow-hidden shrink-0 border border-slate-100 rounded-[2px] p-2.5 bg-[#FAFBFD]/70">
          {/* Internal switcher header */}
          <div className="flex items-center justify-between shrink-0 pb-2">
            <span className="text-[10px] font-extrabold uppercase text-slate-500 font-sans tracking-tight">
              {viewMode === 'bubble' ? t('Bubble View · Topic Volume map', '圆球视图 · 核心话题声量密度') : t('Line View · 24H Tracing paths', '折线视图 · 24小时声量趋势监测')}
            </span>

            {/* View selectors */}
            <div className="inline-flex border border-slate-200 rounded-[3px] overflow-hidden bg-white shrink-0 select-none">
              <button 
                className={`px-2.5 py-1 text-[9.5px] font-bold transition-all cursor-pointer ${viewMode === 'bubble' ? 'bg-[#0F1722] text-white' : 'text-slate-500 hover:text-slate-800'}`} 
                onClick={() => setViewMode('bubble')}
              >
                {t('Bubble', '圆球')}
              </button>
              <button 
                className={`px-2.5 py-1 text-[9.5px] font-bold transition-all cursor-pointer border-l border-slate-200 ${viewMode === 'line' ? 'bg-[#0F1722] text-white' : 'text-slate-500 hover:text-slate-800'}`} 
                onClick={() => setViewMode('line')}
              >
                {t('Line', '折线')}
              </button>
            </div>
          </div>

          {/* Core Graphic Viewport */}
          <div className="flex-1 relative overflow-visible mt-1 min-h-[150px] flex items-center justify-center">
            {viewMode === 'bubble' ? (
              // BUBBLE VIEW
              <div className="w-full h-full relative">
                <svg viewBox="0 0 320 160" className="w-full h-full overflow-visible font-sans">
                  {BUBBLE_TOPICS.map((b) => {
                    const isCrit = b.severity === 'critical';
                    const isWarn = b.severity === 'warning';
                    const color = isCrit ? '#D8454C' : isWarn ? '#E89518' : '#2FA862';
                    const isHovered = b.id === hoveredBubble;

                    return (
                      <g 
                        key={b.id} 
                        className="cursor-pointer group"
                        onMouseEnter={() => setHoveredBubble(b.id)}
                        onMouseLeave={() => setHoveredBubble(null)}
                        onClick={() => navigate('/sentiment/console', { state: { selectedTopicId: b.id } })}
                      >
                        <circle 
                          cx={b.cx} 
                          cy={b.cy} 
                          r={b.r} 
                          fill={color} 
                          fillOpacity={isHovered ? 0.25 : 0.12} 
                          stroke={color} 
                          strokeWidth={isHovered ? 2 : 1}
                          className="transition-all duration-150"
                        />
                        <circle cx={b.cx} cy={b.cy} r="2.5" fill={color} />
                        
                        {/* Short text labels mapped directly */}
                        <text
                          x={b.cx}
                          y={b.cy + 3}
                          textAnchor="middle"
                          fill="#1E293B"
                          className="text-[8.5px] font-extrabold select-none pointer-events-none"
                        >
                          {language === 'zh' ? b.nameCn : b.nameEn}
                        </text>
                        <text
                          x={b.cx}
                          y={b.cy + 11}
                          textAnchor="middle"
                          fill={color}
                          className="text-[7.5px] font-mono font-black select-none pointer-events-none"
                        >
                          {b.volume}
                        </text>
                      </g>
                    );
                  })}
                </svg>

                {/* Simulated Floating Tooltip */}
                {hoveredBubble && (() => {
                  const b = BUBBLE_TOPICS.find(bubble => bubble.id === hoveredBubble);
                  if (!b) return null;
                  return (
                    <div className="absolute top-1 left-2 bg-slate-900/95 text-white p-2 text-[8px] font-mono rounded border border-white/10 z-20 pointer-events-none leading-snug select-text">
                      <div>ID: {b.id} ({b.severity.toUpperCase()})</div>
                      <div className="text-sky-300 font-bold">{t('Volume: ', '声量大小: ')}{b.volume}</div>
                      <div className="text-slate-400 mt-0.5">{t('Click to inspect detailed dispatch flow.', '点击展开该场景下的全维度情报溯源')}</div>
                    </div>
                  );
                })()}
              </div>
            ) : (
              // LINE TRENDS VIEW
              <div className="w-full h-full relative"
                   onMouseMove={(e) => {
                     const rect = e.currentTarget.getBoundingClientRect();
                     const x = e.clientX - rect.left;
                     const pct = x / rect.width;
                     const i = Math.max(0, Math.min(11, Math.round(pct * 11)));
                     setHoveredLineIndex(i);
                   }}
                   onMouseLeave={() => setHoveredLineIndex(null)}
              >
                <svg viewBox="0 0 320 160" className="w-full h-full overflow-visible font-sans select-none">
                  {/* Grid Lines */}
                  {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
                    const y = getLineY(ratio * 50);
                    const labelVal = Math.round(ratio * 50);
                    return (
                      <g key={idx}>
                        <line x1="30" y1={y} x2="310" y2={y} stroke="#EEF2F6" strokeWidth="0.8" />
                        <text x="26" y={y + 2.5} textAnchor="end" fill="#94A3B8" className="text-[7.5px] font-mono font-bold">{labelVal}K</text>
                      </g>
                    );
                  })}

                  {/* Multiple Category Lines */}
                  {LINE_TRENDS.map((line) => {
                    const pathD = line.points.map((val, step) => {
                      return `${step === 0 ? 'M' : 'L'} ${getLineX(step).toFixed(1)} ${getLineY(val).toFixed(1)}`;
                    }).join(' ');

                    return (
                      <g key={line.topicId} className="group cursor-pointer" onClick={() => navigate('/sentiment/console', { state: { selectedTopicId: line.topicId } })}>
                        <path 
                          d={pathD} 
                          fill="none" 
                          stroke={line.color} 
                          strokeWidth={1.5}
                          className="transition-all group-hover:stroke-width-[2.5]"
                        />
                        {/* Dots */}
                        {line.points.map((val, i) => (
                          <circle 
                            key={i} 
                            cx={getLineX(i)} 
                            cy={getLineY(val)} 
                            r="1.8" 
                            fill={line.color} 
                            stroke="#FFF" 
                            strokeWidth="0.5" 
                          />
                        ))}
                      </g>
                    );
                  })}

                  {/* Hour labels */}
                  {[0, 2, 4, 6, 8, 10].map((step) => (
                    <text 
                      key={step} 
                      x={getLineX(step)} 
                      y="155" 
                      textAnchor="middle" 
                      fill="#94A3B8" 
                      className="text-[7.5px] font-mono font-bold"
                    >
                      {String(step * 2).padStart(2, '0')}:00
                    </text>
                  ))}

                  {/* Interactive tracking line */}
                  {hoveredLineIndex !== null && (
                    <line 
                      x1={getLineX(hoveredLineIndex)} 
                      y1="10" 
                      x2={getLineX(hoveredLineIndex)} 
                      y2="140" 
                      stroke="#475569" 
                      strokeWidth="0.6" 
                      strokeDasharray="2 2" 
                    />
                  )}
                </svg>

                {/* Floating crosshair details */}
                {hoveredLineIndex !== null && (
                  <div className="absolute top-1 left-2 bg-slate-900/95 text-white p-2 text-[8px] font-mono rounded border border-white/10 z-20 pointer-events-none leading-snug w-[130px] select-text">
                    <div className="text-white/50 border-b border-white/5 pb-0.5 mb-1">{String(hoveredLineIndex * 2).padStart(2, '0')}:00 Volume</div>
                    {LINE_TRENDS.slice(0, 3).map(line => (
                      <div key={line.topicId} className="flex justify-between">
                        <span style={{ color: line.color }}>• {language === 'zh' ? line.nameCn : line.nameEn}:</span>
                        <strong className="font-extrabold">{line.points[hoveredLineIndex]}K</strong>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Side (40%): CompactPostCard */}
        <div className="flex-1 bg-slate-50/65 border border-[#EDF1F6] rounded p-3 flex flex-col justify-between relative overflow-hidden select-text text-[11px]">
          
          <form onSubmit={handleTransmit} className="h-full flex flex-col justify-between space-y-2">
            <div className="space-y-2 flex-1 flex flex-col min-h-0">
              {/* Card Title */}
              <div className="flex items-center justify-between border-b border-slate-150 pb-1 shrink-0 select-none">
                <span className="font-extrabold text-[#0D1722] text-[10px] tracking-wider uppercase">
                  {t('POST DIRECT ADVISORY BRIEF', '特给政法督办公文即析传输')}
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              </div>

              {/* Text Area Input */}
              <div className="flex-1 min-h-[85px] flex flex-col">
                <label className="text-[8.5px] font-mono text-slate-400 font-black uppercase mb-1 block select-none">
                  {t('Advisory payload details', '部长令加签原文内容 (Bilingual Logged)')}
                </label>
                <textarea
                  value={postText}
                  onChange={(e) => setPostText(e.target.value)}
                  disabled={isSent || isSending}
                  className="w-full flex-1 p-2 bg-white border border-slate-200 focus:border-[#2D6CDF] rounded text-[10.5px] leading-relaxed font-sans font-semibold placeholder-slate-400 select-text resize-none focus:outline-none custom-scrollbar"
                />
              </div>

              {/* Secure Dispatch Outlets (Checkboxes) */}
              <div className="space-y-1.5 shrink-0 select-none">
                <div className="text-[8px] font-mono text-slate-400 font-black uppercase tracking-wider">
                  {t('Secure dispatch endpoints', '加密同步投递目标信道')}
                </div>
                
                <div className="space-y-1">
                  <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-700">
                    <input
                      type="checkbox"
                      checked={syncGrid}
                      onChange={(e) => setSyncGrid(e.target.checked)}
                      disabled={isSent || isSending}
                      className="rounded text-[#2D6CDF] focus:ring-0 w-3 h-3 cursor-pointer"
                    />
                    <span>{t('Sync KEGOC Grid Control', '同步KEGOC骨干网调度')}</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-700">
                    <input
                      type="checkbox"
                      checked={syncFieldTeam}
                      onChange={(e) => setSyncFieldTeam(e.target.checked)}
                      disabled={isSent || isSending}
                      className="rounded text-[#2D6CDF] focus:ring-0 w-3 h-3 cursor-pointer"
                    />
                    <span>{t('Mangystau field team dispatch', '立即增派曼吉斯套本域物理侦特')}</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-700">
                    <input
                      type="checkbox"
                      checked={syncAttorney}
                      onChange={(e) => setSyncAttorney(e.target.checked)}
                      disabled={isSent || isSending}
                      className="rounded text-[#2D6CDF] focus:ring-0 w-3 h-3 cursor-pointer"
                    />
                    <span>{t('Attorney joint-coordination', '司法部跨属地联合限额控制')}</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Submit Action Block */}
            <div className="shrink-0 pt-1 select-none">
              <button
                type="submit"
                disabled={isSending || isSent}
                className={`w-full py-2 rounded font-black text-[10px] uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all text-white cursor-pointer ${
                  isSent
                    ? 'bg-emerald-600 hover:bg-emerald-700'
                    : isSending
                    ? 'bg-indigo-600/70 cursor-wait'
                    : 'bg-indigo-600 hover:bg-indigo-700'
                }`}
              >
                {isSending ? (
                  <>
                    <Loader size={11} className="animate-spin" />
                    <span>{t('Encrypting Transport...', '高层密钥加密封口并同步...')}</span>
                  </>
                ) : isSent ? (
                  <>
                    <Check size={11} />
                    <span>{t('TRANSMITTED SUCCESS', '✓ 传输完成 (Transmitted)')}</span>
                  </>
                ) : (
                  <>
                    <Send size={11} />
                    <span>{t('TRANSMIT SECURE PROTOCOL', '安全特遣规画一键传签派遣')}</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Secure Transmission Overlay Indicator */}
          <AnimatePresence>
            {isSending && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-slate-900/65 backdrop-blur-xs flex flex-col items-center justify-center text-white p-4 text-center z-20 select-none font-mono"
              >
                <Loader size={32} className="text-[#2D6CDF] animate-spin mb-3" />
                <div className="text-[12px] font-bold uppercase tracking-widest text-[#FFF]">ENCRYPTING & DISPATCHING</div>
                <p className="text-[9px] text-slate-300 mt-1 leading-normal max-w-[180px]">
                  RSA-4096 crypt handshake established successfully. Emitting via satcom uplink...
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Floating Success Alert Banner */}
      <AnimatePresence>
        {isSent && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            className="absolute bottom-12 left-5 right-5 bg-emerald-950/95 text-emerald-100 px-4 py-2.5 rounded border border-emerald-500 shadow-2xl z-40 select-text text-[10px]"
          >
            <div className="flex items-start gap-2 leading-relaxed">
              <Check className="text-emerald-400 shrink-0 mt-0.5" size={13} />
              <div>
                <strong className="block text-white font-extrabold mb-0.5">
                  {t('Ministerial protocol #PROTOCOL-2026-993 dispatched successfully.', '哈国能源部特级公文2026-993号同步指令传输完成并受领 !')}
                </strong>
                <span>
                  {t('The telemetry tracing flow has successfully merged into SCADA limits for real-time monitoring.', '物理测点下钻遥测追偿流已硬性并入CPC里海主线阻尼监控包，锁定西里海主体资产限额。')}
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
