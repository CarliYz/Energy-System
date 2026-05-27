import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  TrendingUp, Wifi, ShieldAlert, Award, FileText, Activity, AlertCircle, 
  Flame, HardDrive, Bolt, ChevronRight, Filter, Download, FileUp, Globe, Users
} from 'lucide-react';
import { useLanguage } from '../components/LanguageContext';

// Mock Data
const EXPORT_GDP_DATA = [
  { month: 'Jun 25', export: 14.2, gdp: 5.8 },
  { month: 'Jul 25', export: 14.5, gdp: 5.9 },
  { month: 'Aug 25', export: 14.1, gdp: 6.0 },
  { month: 'Sep 25', export: 13.8, gdp: 5.7 },
  { month: 'Oct 25', export: 14.6, gdp: 6.1 },
  { month: 'Nov 25', export: 14.3, gdp: 5.9 },
  { month: 'Dec 25', export: 13.9, gdp: 5.6 },
  { month: 'Jan 26', export: 13.7, gdp: 5.4 },
  { month: 'Feb 26', export: 13.2, gdp: 5.2 },
  { month: 'Mar 26', export: 12.8, gdp: 4.8 }, // Head-wind zone starts
  { month: 'Apr 26', export: 12.5, gdp: 4.5 },
  { month: 'May 26', export: 12.1, gdp: 4.2 },
];

const COMMODITY_TILES = [
  { name_en: 'OIL', name_zh: '石油', val: '1.82 Mbbl/d', pct: '98.4%', trend: [95, 96, 98, 97, 99, 98, 98.4], color: '#2FA862' },
  { name_en: 'GAS', name_zh: '天然气', val: '145 Mm³/d', pct: '96.1%', trend: [98, 97, 95, 94, 95, 96, 96.1], color: '#E89518' },
  { name_en: 'COAL', name_zh: '煤炭', val: '312 Kt/d', pct: '99.2%', trend: [99, 99, 98, 99, 100, 99, 99.2], color: '#2FA862' },
  { name_en: 'POWER', name_zh: '总电负荷', val: '28.4 GWh', pct: '97.8%', trend: [96, 97, 97, 98, 98, 97.5, 97.8], color: '#2FA862' },
];

const LIVELIHOOD_GAUGES = [
  { name_en: 'Winter Heating Supply Rate', name_zh: '冬季锅炉热力供水保障率', current: 98.2, redline: 95.0, unit: '%', margin: '+3.2pp', status: 'GREEN' },
  { name_en: 'Grid Frequency Deviation', name_zh: '国家骨干电网频率偏差度', current: 0.08, redline: 0.20, unit: ' Hz', margin: 'OK', status: 'GREEN' },
  { name_en: 'Household Gas Coverage', name_zh: '民用及加气站天然气气压指数', current: 94.7, redline: 95.0, unit: '%', margin: '-0.3pp', status: 'AMBER' },
  { name_en: 'Industrial Park Blackout Min (rolling 7d)', name_zh: '重点自贸工业区周停电累计时常', current: 12, redline: 30, unit: ' min', margin: 'OK', status: 'GREEN' },
];

const SENTIMENT_TOPICS = [
  { id: 'ENG-001', topic_en: 'LPG / Gasoline Price', topic_zh: 'LPG 液化气/油品零售价上涨', vol: '680K+', sentiment: -0.72, size: 110, color: '#D8454C' },
  { id: 'ENG-002', topic_en: 'Power Outage Karaganda', topic_zh: '卡拉干达民用区域突发断电舆论', vol: '510K+', sentiment: -0.68, size: 95, color: '#D8454C' },
  { id: 'ENG-003', topic_en: 'Heating Pipe Burst', topic_zh: '冬季供热主网管道锈蚀爆裂求助', vol: '410K+', sentiment: -0.71, size: 90, color: '#D8454C' },
  { id: 'coal-methane', topic_en: 'Coal Mine Methane Incident', topic_zh: '煤矿甲烷安全隐患及矿工安置', vol: '320K+', sentiment: -0.65, size: 85, color: '#D8454C' },
  { id: 'export-cap', topic_en: '2026 Export Cap Review', topic_zh: '2026 能源出口额度配额重估审计', vol: '230K+', sentiment: 0.05, size: 75, color: '#E89518' },
  { id: 'chinese-inv', topic_en: 'Chinese Energy Investment', topic_zh: '克斯中哈合资电力新能源注入舆论', vol: '180K+', sentiment: -0.42, size: 70, color: '#D8454C' },
  { id: 'pipeline', topic_en: 'Cross-border Pipeline', topic_zh: '跨国过境燃气管道关税及安全费', vol: '95K+', sentiment: 0.15, size: 55, color: '#2FA862' },
  { id: 'carbon-tax', topic_en: 'Carbon Tax', topic_zh: '高碳产业专项税与环保整顿', vol: '62K+', sentiment: -0.05, size: 50, color: '#E89518' },
  { id: 'pavlodar-dc', topic_en: 'Pavlodar Data Center Power', topic_zh: '巴甫洛达尔算力中心超额用电限负荷', vol: '48K+', sentiment: -1.0, size: 45, color: '#E89518' },
  { id: 'nuclear-plant', topic_en: 'Nuclear Plant Plan', topic_zh: '哈萨克斯坦首座核电站选址全民讨论', vol: '34K+', sentiment: 0.25, size: 42, color: '#2FA862' },
];

const PENDING_DECISIONS = [
  {
    id: 'CASE-2026-001',
    title_en: 'Western Caspian Energy LLC · Aktau GCS-001',
    title_zh: '西里海能源有限责任公司 · 曼吉斯套储配首站',
    exposure: '1.24 BN KZT',
    cause_en: 'Unreported Capacity Expansion (P=0.85)',
    cause_zh: '未申报特种扩装生产违法加压 (概率 P=0.85)',
    rec_en: 'Dispatch Preventive Inspection Immediately',
    rec_zh: '立刻签发派发36H现场紧急预防性实勘强制令',
    sla: '36 H 12 M',
    severity: 'CRITICAL',
    timeWindow: '72H WINDOW',
  },
  {
    id: 'CASE-2026-002',
    title_en: 'Atyrau Refinery Emissions Pattern',
    title_zh: '阿特劳烃类精炼厂夜间未申报废气超排特征',
    exposure: '420M KZT',
    cause_en: 'Nocturnal Flaring Pattern (P=0.78)',
    cause_zh: '夜间违规火炬二氧化硫排放 (概率 P=0.78)',
    rec_en: 'Issue emissions fine & order rectification',
    rec_zh: '根据第47条款下发行政处罚告知及限期整改限令',
    sla: '96 H',
    severity: 'HIGH',
    timeWindow: '96H WINDOW'
  },
  {
    id: 'CASE-2026-003',
    title_en: 'KEGOC 220kV Imbalance Recurrence',
    title_zh: '国家电网 KEGOC 北部-南部通道负荷异动',
    exposure: '280M KZT',
    cause_en: 'Grid Overload Shifting (P=0.82)',
    cause_zh: '大规模高能耗实体私接用电偏差 (概率 P=0.82)',
    rec_en: 'Initiate automated line power load profiling',
    rec_zh: '提请地方市经信会同电力稽查大队特遣拉网排查',
    sla: '168 H',
    severity: 'MEDIUM',
    timeWindow: '168H WINDOW'
  },
  {
    id: 'CASE-2026-004',
    title_en: 'Pavlodar GRES-1 Coal Consumption Drift',
    title_zh: '巴甫洛达尔 GRES-1 燃煤效率及非正常消耗',
    exposure: '180M KZT',
    cause_en: 'Operational Efficiency Decay (P=0.74)',
    cause_zh: '进口低品质劣质煤混烧欺诈 (概率 P=0.74)',
    rec_en: 'Dispatch laboratory auditing inspectors',
    rec_zh: '派驻国家能源燃料化验中心进行封样理化盲测',
    sla: '240 H',
    severity: 'MEDIUM',
    timeWindow: '240H WINDOW'
  },
  {
    id: 'CASE-2026-005',
    title_en: 'Mangystau SCADA Data Delay',
    title_zh: '曼吉斯套地方数采遥测网大面积超时挂起案',
    exposure: '95M KZT',
    cause_en: 'Operator Telemetry Withholding (P=0.68)',
    cause_zh: '私有气田蓄意串联屏蔽网管数据包 (概率 P=0.68)',
    rec_en: 'Mandate route validation of optical switches',
    rec_zh: '下达数采不间断信道强稳检测令和通讯安全罚书',
    sla: '7 Days',
    severity: 'LOW',
    timeWindow: '7D WINDOW'
  }
];

export default function MinisterDashboard() {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [selectedCase, setSelectedCase] = useState('CASE-2026-001');

  const tLabel = (en: string, zh: string) => {
    return language === 'zh' ? zh : en;
  };

  return (
    <div className="bg-[#F4F6FA] min-h-screen text-[#1A2330] flex flex-col font-sans">
      {/* 1. HEADER STRIP */}
      <div className="h-14 bg-[#0F1722] text-white px-6 flex items-center justify-between border-b border-white/10 shrink-0 select-none">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-white/10 px-2 py-1 rounded-[3px] border border-white/5">
            <span className="text-[12px]">🇰🇿</span>
            <span className="text-[10px] uppercase font-black tracking-wider text-white">
              {tLabel('MINISTRY OF ENERGY', '哈萨克斯坦共和国能源部')}
            </span>
          </div>
          <div className="h-4 w-[1px] bg-white/20" />
          <h1 className="text-[14px] font-bold tracking-wider text-white">
            {tLabel('DAILY COMMAND VIEW — CONSOLE v2', '日常监管安全监控司令台 · 极速决策专线 (v2)')}
          </h1>
        </div>
        
        <div className="text-[11px] font-mono text-white/60 tracking-widest bg-white/5 px-2.5 py-1 rounded border border-white/5 flex items-center gap-1">
          <Globe size={12} className="text-[#2AB3A6]" />
          <span>GMT+5 · 2026-05-28 · MON · WEEK 22</span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-[#E89518]/15 border border-[#E89518]/30 px-3 py-1 rounded-sm">
            <span className="w-2 h-2 rounded-full bg-[#E89518] animate-pulse" />
            <span className="text-[10px] font-black tracking-widest text-[#E89518] uppercase">
              {tLabel('NAT. STATE: AMBER', '安全状态: 橙色预警')}
            </span>
          </div>
          <div className="text-[10px] text-white/80 bg-[#D8454C]/25 border border-[#D8454C]/40 px-3 py-1 rounded-sm font-bold">
            {tLabel('3 RED LINES BREACHED · 2 HIGH-RISK OPEN', '3项民生红线触网 · 2起未决极危安全专案')}
          </div>
        </div>
      </div>

      {/* 2. TOP ACTION SWITCH DIRECTORY */}
      <div className="h-11 bg-white border-b border-[#E2E7EF] px-6 flex items-center justify-between shadow-sm shrink-0">
        <div className="flex items-center gap-1.5 text-[11px] font-medium text-[#6A7686]">
          <span>{tLabel('Oversight Stream:', '指挥主线:')}</span>
          <span className="bg-[#2D6CDF]/10 text-[#2D6CDF] px-1.5 py-0.5 rounded font-black">
            {tLabel('ACT I-A · MINISTER VIEW', '第一幕甲 · 部长全景视窗')}
          </span>
          <ChevronRight size={12} />
          <span>{tLabel('Macro-Coupling, Public Opinion and Pending Approvals', '宏观GDP联动、舆情震荡与红区审批权一键分发')}
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={() => navigate('/sensing/national-grid')}
            className="flex items-center gap-1.5 bg-[#2D6CDF] hover:bg-[#1E57C4] text-white text-[11px] font-bold px-4 py-1.5 rounded-[4px] shadow-sm transition-all"
          >
            <Activity size={14} />
            <span>{tLabel('View National Energy Grid Map →', '下钻调取全国能源骨干流物理网络地图 →')}</span>
          </button>
        </div>
      </div>

      {/* 3. 4-QUADRANT GRID */}
      <div className="flex-1 p-6 grid grid-cols-2 grid-rows-2 gap-6 overflow-hidden max-w-[1920px] w-full mx-auto" style={{ maxHeight: 'calc(100vh - 148px)' }}>
        
        {/* QUADRANT A: TOP-LEFT — GDP × ENERGY EXPORT COUPLING */}
        <div className="bg-white rounded-[6px] border border-[#E2E7EF] p-5 flex flex-col justify-between overflow-hidden shadow-sm relative">
          <div className="flex items-start justify-between border-b border-[#E2E7EF] pb-2 shrink-0">
            <div>
              <h2 className="text-[15px] font-black text-[#0F1722] flex items-center gap-2">
                <TrendingUp size={16} className="text-[#2D6CDF]" />
                {tLabel('ENERGY EXPORT × GDP COUPLING MONITOR', '能源战略出口与国家GDP弹性增长挂钩联动系统')}
              </h2>
              <p className="text-[10px] text-[#6A7686] font-medium leading-none mt-1">
                {tLabel('Updated 14:32 · Source: National Bank of Kazakhstan / Stat.gov.kz / S&P / ifo-WP-81', '实时更新 14:32 · 联核数据：哈萨克斯坦国家银行 / 统计局 / 标准普尔评级 / ifo Working Paper #81')}
              </p>
            </div>
            <span className="text-[9px] bg-[#2D6CDF]/10 text-[#2D6CDF] px-1.5 py-0.5 rounded font-black">
              {tLabel('METHODOLOGY v1.4', '测算方法论 v1.4')}
            </span>
          </div>

          <div className="flex-1 flex gap-4 my-2 overflow-hidden">
            {/* Chart Space */}
            <div className="flex-1 h-full flex flex-col justify-between relative bg-slate-50/50 p-2 rounded border border-[#E2E7EF]/70">
              <div className="flex items-center justify-between text-[10px] font-semibold text-[#6A7686]">
                <span>{tLabel('Primary: Fuel Export (USD bn, solid)', '主轴: 出口总额 (十亿美元, 实线)')}</span>
                <span>{tLabel('Secondary: Monthly GDP Growth (%, dashed)', '右轴: 月度GDP增速 (%, 虚线)')}</span>
              </div>
              
              {/* Dual-axis Custom Miniature SVG Chart */}
              <div className="flex-1 relative mt-2">
                <svg className="w-full h-full" viewBox="0 0 400 130" preserveAspectRatio="none">
                  {/* Grid Lines */}
                  <line x1="0" y1="40" x2="400" y2="40" stroke="#E2E7EF" strokeDasharray="3 3" />
                  <line x1="0" y1="80" x2="400" y2="80" stroke="#E2E7EF" strokeDasharray="3 3" />
                  
                  {/* Head-wind Zone shaded area */}
                  <rect x="290" y="0" width="110" height="130" fill="#D8454C" fillOpacity="0.05" />
                  <text x="300" y="15" fill="#D8454C" className="text-[8px] font-bold">
                    {tLabel('HEAD-WIND ZONE', '逆风阻力带')}
                  </text>

                  {/* Export Blue Line (Primary Y) */}
                  <path
                    d="M 10 90 L 45 80 L 80 85 L 115 95 L 150 75 L 185 80 L 220 92 L 255 95 L 290 102 L 325 108 L 360 112 L 390 120"
                    fill="none"
                    stroke="#2D6CDF"
                    strokeWidth="2.5"
                  />

                  {/* GDP Growth Amber Dashed Line (Secondary Y) */}
                  <path
                    d="M 10 40 L 45 35 L 80 32 L 115 42 L 150 28 L 185 35 L 220 45 L 255 52 L 290 60 L 325 72 L 360 81 L 390 88"
                    fill="none"
                    stroke="#E89518"
                    strokeWidth="2"
                    strokeDasharray="4 2"
                  />

                  {/* 6% Target line */}
                  <line x1="0" y1="30" x2="400" y2="30" stroke="#2FA862" strokeWidth="1" strokeDasharray="2 4" />
                  <text x="5" y="24" fill="#2FA862" className="text-[7.5px] font-black">
                    {tLabel('Annual GDP Target 6.0%', '国家年度GDP 6.0% 指标红线')}
                  </text>
                </svg>

                {/* X-axis indicators */}
                <div className="flex justify-between text-[8px] text-[#A8B2C0] font-mono mt-1">
                  <span>Jun 25</span>
                  <span>Sep 25</span>
                  <span>Dec 25</span>
                  <span className="text-[#D8454C] font-bold">Mar 26</span>
                  <span className="text-[#D8454C] font-bold">May 26 (Now)</span>
                </div>
              </div>
            </div>

            {/* Inference Formula Panel (Right 40%) */}
            <div className="w-[195px] bg-[#0F1722] text-white p-3 rounded flex flex-col justify-between text-[11px] font-mono leading-tight">
              <div className="border-b border-white/10 pb-1.5 mb-1.5">
                <div className="text-[#E89518] text-[9px] font-bold uppercase tracking-widest mb-1">
                  {tLabel('IFO WP-81 COUPLING FORMULA', 'IFO WP-81 宏观耦合方程')}
                </div>
                <div className="text-[13px] text-center font-black bg-white/5 py-1 rounded border border-white/5 text-[#2AB3A6]">
                  ΔGDP ≈ β × ΔP_oil × s_oil
                </div>
              </div>

              <div className="space-y-1 text-[9px] text-white/85">
                <div className="flex justify-between">
                  <span className="text-white/50">β (ifo sensitivity coefficient)</span>
                  <span className="font-bold text-white">0.04</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/50">s_oil (S&P Hydrocarbon GDP%)</span>
                  <span className="font-bold text-white">20%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/50">s_exp (UNCTAD Export Share)</span>
                  <span className="font-bold text-white">54.2%</span>
                </div>
              </div>

              <div className="bg-[#D8454C]/15 border border-[#D8454C]/45 rounded p-2 my-1 text-[9.5px]">
                <div className="text-[#D8454C] font-bold uppercase text-[8px]">
                  {tLabel('LIVE SIMULATION: EXPORT -3% MoM', '实案仿真: 出口环比偏离 -3%')}
                </div>
                <div className="text-white font-black text-[12px] mt-0.5">
                  -0.24% GDP Impact
                </div>
                <div className="text-white/60 text-[8px]">
                  95% CI: [-0.15%, -0.33%]
                </div>
              </div>

              <div className="text-[8px] bg-white/5 p-1 rounded border border-white/5 text-white/50 text-center uppercase tracking-wide">
                {tLabel('ACCOUNTABILITY RISK: HIGH', '国家综合问责风险: 严重')}
              </div>
            </div>
          </div>

          {/* Commodity sparklines bottom row */}
          <div className="grid grid-cols-4 gap-3 border-t border-[#E2E7EF] pt-2 shrink-0">
            {COMMODITY_TILES.map((t, idx) => (
              <div key={idx} className="bg-[#FAFBFD] border border-[#E2E7EF] p-1.5 rounded flex items-center justify-between">
                <div>
                  <div className="text-[9px] text-[#A8B2C0] font-black tracking-wider leading-none">
                    {language === 'zh' ? t.name_zh : t.name_en}
                  </div>
                  <div className="text-[11px] font-bold text-[#0F1722] mt-0.5 leading-none">{t.val}</div>
                  <div className="text-[8.5px] font-bold mt-1 leading-none" style={{ color: t.pct.startsWith('96') ? '#E89518' : '#2FA862' }}>
                    {t.pct} {tLabel('of plan', '计划保障率')}
                  </div>
                </div>
                {/* Micro sparkline */}
                <svg className="w-10 h-6" viewBox="0 0 40 20">
                  <path
                    d={`M ${t.trend.map((v, i) => `${(i * 40) / 6} ${20 - (v - 90) * 1.5}`).join(' L ')}`}
                    fill="none"
                    stroke={t.color}
                    strokeWidth="1.5"
                  />
                </svg>
              </div>
            ))}
          </div>
        </div>

        {/* QUADRANT B: TOP-RIGHT — LIVELIHOOD RED LINES */}
        <div className="bg-white rounded-[6px] border border-[#E2E7EF] p-5 flex flex-col justify-between overflow-hidden shadow-sm relative">
          <div className="flex items-start justify-between border-b border-[#E2E7EF] pb-2 shrink-0">
            <div>
              <h2 className="text-[15px] font-black text-[#0F1722] flex items-center gap-2">
                <Flame size={16} className="text-[#D8454C]" />
                {tLabel('LIVELIHOOD RED-LINE MONITOR', '民生红线实时防波屏与跨部委预警联动装置')}
              </h2>
              <p className="text-[10px] text-[#6A7686] font-medium leading-none mt-1">
                {tLabel('Cross-ministry trigger band · Energy ↔ Pricing ↔ Internal Affairs', '物理阀阻 ↔ 零售限价 ↔ 内政治安 · 联合警戒大屏')}
              </p>
            </div>
            <span className="text-[9px] bg-[#FAFBFD] border border-border-default text-[#6A7686] px-1.5 py-0.5 rounded font-black">
              {tLabel('MIA AUDITED v1.4', '内务部已核 methodology v1.4')}
            </span>
          </div>

          {/* 4 vertical gauges */}
          <div className="grid grid-cols-4 gap-4 my-3 items-center flex-1 overflow-hidden">
            {LIVELIHOOD_GAUGES.map((g, idx) => (
              <div key={idx} className="bg-[#FAFBFD] border border-border-default rounded p-2.5 h-full flex flex-col justify-between align-middle text-center">
                <div className="text-[9px] font-bold text-[#6A7686] leading-snug h-8 flex items-center justify-center">
                  {language === 'zh' ? g.name_zh : g.name_en}
                </div>
                
                {/* Dynamic Height Percentage Gauge Visual */}
                <div className="relative h-20 w-4 mx-auto bg-[#E2E7EF] rounded-full overflow-hidden my-1 shadow-inner">
                  <div 
                    className="absolute bottom-0 w-full rounded-full transition-all duration-1000"
                    style={{ 
                      height: `${g.current}%`,
                      backgroundColor: g.status === 'RED' ? '#D8454C' : g.status === 'AMBER' ? '#E89518' : '#2FA862' 
                    }}
                  />
                  {/* Red Line threshold */}
                  <div 
                    className="absolute left-0 w-full h-[2px] bg-[#D8454C] z-10"
                    style={{ bottom: `${g.redline}%` }}
                  />
                </div>

                <div>
                  <div className="text-[13px] font-black text-[#0F1722] leading-none">
                    {g.current}{g.unit}
                  </div>
                  <div className="text-[8px] text-[#A8B2C0] mt-0.5 leading-none">
                    {tLabel('Red-line', '红线值')}: {g.redline}{g.unit}
                  </div>
                  <span className={`text-[8.5px] px-1.5 py-0.2 rounded-full font-black uppercase tracking-wider inline-block mt-1 ${
                    g.status === 'AMBER' ? 'bg-[#E89518]/15 text-[#E89518]' : 'bg-[#2FA862]/15 text-[#2FA862]'
                  }`}>
                    {g.margin}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Warning text footnote banner */}
          <div className="bg-[#FDECEC] border border-[#FDECEC] rounded p-2.5 text-[10px] text-[#D8454C] leading-snug shrink-0">
            <strong>{tLabel('⚠️ HISTORICAL REFERENCE:', '⚠️ 2022年乌拉尔液化气社会演进历史防范锚点:')}</strong>{' '}
            {tLabel(
              '2022-01 unrest trigger stemmed directly from 100% LPG price surge in Mangystau Oblast. System monitors LPG, gasoline and utility pressure in real-time. Alerts automatically route to Pricing Bureau & Internal Affairs.',
              '2022年1月份阿克套及曼吉斯套因LPG加气价飙涨100%诱发严重治安。本系统对气价、汽油价、集中供热气压进行实时联动听。一旦冲决，直接呼拉 Pricing Bureau 发改委和 Internal Affairs 内务治安部门。'
            )}
          </div>
        </div>

        {/* QUADRANT C: BOTTOM-LEFT — SENTIMENT VOLUME × ENERGY TOPICS */}
        <div className="bg-white rounded-[6px] border border-[#E2E7EF] p-5 flex flex-col justify-between overflow-hidden shadow-sm relative">
          <div className="flex items-start justify-between border-b border-[#E2E7EF] pb-2 shrink-0">
            <div>
              <h2 className="text-[15px] font-black text-[#0F1722] flex items-center gap-2">
                <Users size={16} className="text-[#B23A6A]" />
                {tLabel('ENERGY SENTIMENT SIGNAL — 10 LEADING TOPICS', '社会舆论能量波动监控 — 10个国家高敏重点能耗话题舱')}
              </h2>
              <p className="text-[10px] text-[#6A7686] font-medium leading-none mt-1">
                {tLabel('Real-time NLP across 9 platforms · Click any topic to drill into detail map', '自然语言算法全天候对9大私域及主流公域自动监听 · 击任意气泡极速下钻至社会学舆情大屏 (page 2.3)')}
              </p>
            </div>
            <span className="text-[9px] text-[#B23A6A] bg-[#B23A6A]/10 px-1.5 py-0.5 rounded font-black animate-pulse">
              {tLabel('LIVE NLP DEPLOYED', '实时大语言本体神经网络已挂载')}
            </span>
          </div>

          {/* Semicircular bubble cloud container */}
          <div className="flex-1 my-2 relative bg-slate-50/50 rounded border border-[#E2E7EF]/70 p-1 overflow-hidden flex items-center justify-center">
            <div className="relative w-full h-full flex flex-wrap items-center justify-center gap-3 p-1">
              {SENTIMENT_TOPICS.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => navigate('/warning/sentiment')}
                  className="rounded-full shadow-sm text-center flex flex-col justify-center items-center cursor-pointer hover:scale-105 active:scale-95 transition-all text-white p-2 border border-black/5"
                  style={{
                    width: `${item.size}px`,
                    height: `${item.size}px`,
                    backgroundColor: item.color,
                    maxWidth: '120px',
                    maxHeight: '120px',
                  }}
                >
                  <span className="text-[7.5px] font-black tracking-tighter leading-none text-white/80 select-none">
                    {item.vol}
                  </span>
                  <span className="text-[8px] font-bold leading-tight my-0.5 select-none tracking-tight line-clamp-2">
                    {language === 'zh' ? item.topic_zh : item.topic_en}
                  </span>
                  <span className="text-[7.5px] font-mono select-none px-1 rounded bg-black/20 mt-0.5">
                    {item.sentiment}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 90-day sentiment timeline timeline */}
          <div className="border-t border-[#E2E7EF] pt-2 flex items-center justify-between text-[9px] font-mono text-[#6A7686] shrink-0">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-[#D8454C] rounded-full" />
              <span>{tLabel('2022-01 Unrest Reference Line', '2022年01月暴恐大游行红区边界')}</span>
            </div>
            <div className="bg-[#B23A6A]/10 text-[#B23A6A] font-bold px-2 py-0.5 rounded border border-[#B23A6A]/20">
              {tLabel('Current Alert Level: T-13 days pattern similarity matches 0.79 to pre-event signals', '当前预判：与2021年12月爆发前13日舆论升温形态重合度达 0.79 · 严重危预')}
            </div>
          </div>
        </div>

        {/* QUADRANT D: BOTTOM-RIGHT — MINISTER'S TOP 5 PENDING DECISIONS */}
        <div className="bg-white rounded-[6px] border border-[#E2E7EF] p-5 flex flex-col justify-between overflow-hidden shadow-sm relative">
          <div className="flex items-start justify-between border-b border-[#E2E7EF] pb-2 shrink-0">
            <div>
              <h2 className="text-[15px] font-black text-[#0F1722] flex items-center gap-2">
                <ShieldAlert size={16} className="text-[#E89518]" />
                {tLabel("MINISTER'S TOP PENDING ACTION DESK", '部长特别行政特批与一键干预分发中枢 (TOP 5)')}
              </h2>
              <p className="text-[10px] text-[#6A7686] font-medium leading-none mt-1">
                {tLabel('Auto-prioritized by fiscal exposure × SLA proximity × cross-system signal', '依：财政漏失敞口 × 一行政SLA倒计时 × 物理网交叉检验概率 · 智能精准推送排序')}
              </p>
            </div>
            <span className="text-[9px] bg-red-100 border border-red-200 text-red-700 px-1.5 py-0.5 rounded font-black font-mono">
              3 ACTIVE ESCALATIONS
            </span>
          </div>

          {/* Case Stack */}
          <div className="flex-1 my-2 overflow-y-auto space-y-1.5 pr-1 custom-scrollbar">
            {PENDING_DECISIONS.map((c) => {
              const isSelected = selectedCase === c.id;
              return (
                <div 
                  key={c.id}
                  onClick={() => setSelectedCase(c.id)}
                  className={`border rounded p-2 cursor-pointer transition-all ${
                    isSelected 
                      ? 'border-[#2D6CDF] bg-[#2D6CDF]/5 shadow-sm'
                      : 'border-[#E2E7EF] hover:bg-[#FAFBFD]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        c.severity === 'CRITICAL' ? 'bg-[#D8454C] animate-pulse' : c.severity === 'HIGH' ? 'bg-[#E89518]' : 'bg-[#2D6CDF]'
                      }`} />
                      <span className="text-[9.5px] font-mono font-bold text-[#0F1722]">{c.id}</span>
                      <span className={`text-[8px] px-1 rounded font-black ${
                        c.severity === 'CRITICAL' ? 'bg-[#D8454C]/10 text-[#D8454C]' : 'bg-[#E89518]/10 text-[#E89518]'
                      }`}>
                        {c.severity}
                      </span>
                      <span className="text-[8px] text-[#6A7686] font-mono bg-white border border-[#E2E7EF] px-1 rounded">
                        {c.timeWindow}
                      </span>
                    </div>
                    <span className="text-[10px] font-bold text-[#D8454C] bg-[#D8454C]/5 px-2 py-0.2 rounded font-mono">
                      {c.exposure}
                    </span>
                  </div>

                  <div className="text-[10.5px] font-bold text-text-primary mt-1">
                    {language === 'zh' ? c.title_zh : c.title_en}
                  </div>

                  {isSelected && (
                    <div className="mt-2 pt-1.5 border-t border-[#E2E7EF] grid grid-cols-2 gap-2 text-[9px] leading-tight">
                      <div>
                        <div className="text-text-tertiary font-medium uppercase font-mono">{tLabel('Root Cause Path', '系统根因核查:')}</div>
                        <div className="text-[#0F1722] font-semibold mt-0.5">{language === 'zh' ? c.cause_zh : c.cause_en}</div>
                      </div>
                      <div>
                        <div className="text-text-tertiary font-medium uppercase font-mono">{tLabel('Recommended Action', '督办建议指令:')}</div>
                        <div className="text-[#2D6CDF] font-black mt-0.5 flex items-center gap-1">
                          <span>⚡</span> {language === 'zh' ? c.rec_zh : c.rec_en}
                        </div>
                      </div>

                      <div className="col-span-2 pt-2 flex items-center justify-between border-t border-[#E2E7EF]/50">
                        <div className="text-text-tertiary font-mono">
                          {tLabel('SLA Proximity Count:', '临阵审批倒计时:')} <strong className="text-[#D8454C] tabular-nums">{c.sla}</strong>
                        </div>
                        <div className="flex gap-1.5">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/audit/event/${c.id}`);
                            }}
                            className="bg-white border border-border-default hover:bg-bg-hover text-text-primary px-2 py-0.5 rounded text-[8.5px] font-bold transition-colors"
                          >
                            {tLabel('View Case Lifecycle →', '打开案件流泳道 →')}
                          </button>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/audit/report`);
                            }}
                            className="bg-[#2D6CDF] text-white hover:bg-[#1E57C4] px-2 py-0.5 rounded text-[8.5px] font-black transition-colors"
                          >
                            {tLabel('Brief Minister', '呈阅部长简报集案')}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 4. BOTTOM PIPELINE STATUS BAR */}
      <div className="h-14 bg-white border-t border-[#E2E7EF] px-6 flex items-center justify-between shrink-0 select-none shadow-[0_-2px_12px_rgba(0,0,0,0.03)] pb-2 pt-2">
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
          <strong>33 active cases</strong> · 5 in preventive window · 0 SLA-breached today
        </div>
      </div>
    </div>
  );
}
