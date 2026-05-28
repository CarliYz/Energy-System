import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, Activity, ChevronRight, Globe, Users, Flame, Zap, 
  BrainCircuit, AlertTriangle, Factory, Satellite, Hammer, Maximize2, Settings
} from 'lucide-react';
import { useLanguage } from '../components/LanguageContext';
import { bollingerData, EnterpriseCapacity, KlinePoint } from '../data/bollinger_capacity';
import { energyNews, NewsItem } from '../data/energy_news';
import { sankeyData } from '../data/sentiment_sankey';

// Helper UI Components Localized for Encapsulation
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
      className="px-2.5 py-1 text-[10px] font-mono font-bold text-[#1A2330] hover:bg-[#FAFBFD] border border-[#E2E7EF] rounded hover:shadow-sm transition-all"
    >
      {children}
    </button>
  );
}

function ScenarioTab({ children, active, onClick }: { children: React.ReactNode; active?: boolean; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`text-[11px] font-bold px-3 py-1.5 transition-all outline-none border-b-2 shrink-0 ${
        active 
          ? 'text-[#2AB3A6] border-[#2AB3A6]' 
          : 'text-[#6A7686] border-transparent hover:text-[#1A2330]'
      }`}
    >
      {children}
    </button>
  );
}

// Static Data Structures
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
  { month: 'Mar 26', export: 12.8, gdp: 4.8 }, // Head-wind zone starts
  { month: 'Apr 26', export: 12.5, gdp: 4.5 },
  { month: 'May 26', export: 12.1, gdp: 4.2 },
];

const COMMODITY_TILES = [
  { name_en: 'OIL', name_zh: '石油', val: '1.82 Mbbl/d', pct: '98.4%', trend: [95, 96, 98, 97, 99, 98, 98.4], color: '#2FA862' },
  { name_en: 'GAS', name_zh: '天然气', val: '145 Mm³/d', pct: '96.1%', trend: [98, 97, 95, 94, 95, 96, 96.1], color: '#E89518' },
  { name_en: 'COAL', name_zh: '煤炭', val: '312 Kt/d', pct: '99.2%', trend: [99, 99, 98, 99, 100, 99, 99.2], color: '#2FA862' },
  { name_en: 'POWER', name_zh: '总电能', val: '28.4 GWh', pct: '97.8%', trend: [96, 97, 97, 98, 98, 97.5, 97.8], color: '#2FA862' },
];

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

const INITIAL_SENTIMENT_TOPICS = [
  { id: 'ENG-001', topic_en: 'LPG / Gasoline Price', topic_zh: 'LPG零售价异动波峰', vol: '680K+', sentiment: -0.72, size: 104, color: '#D8454C' },
  { id: 'ENG-002', topic_en: 'Power Outage Karaganda', topic_zh: '卡拉干达民用电力跌落', vol: '510K+', sentiment: -0.68, size: 90, color: '#D8454C' },
  { id: 'ENG-003', topic_en: 'Heating Pipe Burst', topic_zh: '严寒冬季二次热网爆管', vol: '410K+', sentiment: -0.71, size: 84, color: '#E89518' },
  { id: 'coal-methane', topic_en: 'Coal Mine Methane', topic_zh: '安全矿区瓦斯指标超差', vol: '320K+', sentiment: -0.65, size: 80, color: '#E89518' },
  { id: 'export-cap', topic_en: '2026 Export Cap Review', topic_zh: '2026国家安全配额审计', vol: '230K+', sentiment: 0.05, size: 76, color: '#2FA862' },
  { id: 'chinese-inv', topic_en: 'Chinese Energy Inv', topic_zh: '中哈边境清洁网络投建', vol: '180K+', sentiment: 0.42, size: 74, color: '#2FA862' },
  { id: 'pipeline', topic_en: 'Cross-border Pipeline', topic_zh: '跨国燃气管道输送价格', vol: '95K+', sentiment: 0.15, size: 60, color: '#6A7686' },
  { id: 'carbon-tax', topic_en: 'Carbon Tax', topic_zh: '重污染纳税罚没追溯', vol: '62K+', sentiment: -0.05, size: 55, color: '#6A7686' },
  { id: 'pavlodar-dc', topic_en: 'Pavlodar DC Power', topic_zh: '算力中心大负荷偏置', vol: '48K+', sentiment: -0.9, size: 50, color: '#6A7686' },
  { id: 'nuclear-plant', topic_en: 'Nuclear Plant Plan', topic_zh: '首座核电站选址大探讨', vol: '34K+', sentiment: 0.25, size: 45, color: '#6A7686' },
];

const SYNTHETIC_POOL = [
  { id: 'SYN-001', topic_en: 'Tariff complaints Almaty', topic_zh: '阿拉木图热网价格投诉飙升', vol: '125K', sentiment: -0.58, size: 70, color: '#E89518' },
  { id: 'SYN-002', topic_en: 'Tengiz output drift', topic_zh: '田吉兹深海油井工艺检修', vol: '140K', sentiment: -0.45, size: 72, color: '#2FA862' },
  { id: 'SYN-003', topic_en: 'Aktau regional queue', topic_zh: '阿克套长途重车排队过境', vol: '115K', sentiment: -0.62, size: 68, color: '#E89518' },
  { id: 'SYN-004', topic_en: 'Uralsk electricity surge', topic_zh: '乌拉尔斯克配电系统微过载', vol: '90K', sentiment: -0.12, size: 60, color: '#6A7686' },
  { id: 'SYN-005', topic_en: 'Shimkent refinery maintenance', topic_zh: '奇姆肯特大型蒸馏装置清洗', vol: '85K', sentiment: -0.35, size: 65, color: '#6A7686' },
];

const TICKER_ITEMS = [
  { id: 'ENG-001', summary_en: 'LPG +28% wkly · 680K · TikTok+TG', summary_zh: 'LPG气零售价上涨28% · 68万关注 · TikTok+电报群' },
  { id: 'ENG-002', summary_en: 'Karaganda outage day 2 · 510K · VK', summary_zh: '卡拉干达民用局域停电次日 · 51万度 · VK社区' },
  { id: 'ENG-003', summary_en: 'Heating burst 8K households · 410K', summary_zh: '极寒下集中热力管断裂 · 影响8000户 · Telegram求助' },
  { id: 'ENG-004', summary_en: 'Ekibastuz methane · 320K · FB+X', summary_zh: '埃基巴斯图兹安全甲烷越限 · 32万热度 · 脸书+推特' },
  { id: 'ENG-005', summary_en: 'Export cap review · 230K · media', summary_zh: '国家能源战略安全出口重估 · 23万专家长篇讨论' },
];

const PENDING_CASES = [
  {
    id: 'CASE-2026-001',
    severity: 'CRITICAL',
    sla: '36H 12M',
    exposure: '1.24 BN KZT',
    entity_en: 'Western Caspian Energy',
    entity_zh: '西里海能源合资有限责任公司',
    facility_en: 'Aktau GCS-001',
    facility_zh: '阿克套一级增压分配首站',
    cause_en: 'Unreported Capacity Expansion',
    cause_zh: '体外违规增设特种辅助',
    recommendation_en: 'Dispatch Preventive Inspection',
    recommendation_zh: '立即呈批现场强制物联实探性稽查',
    image: 'https://images.unsplash.com/photo-1542060748-10c28b629f6f?auto=format&fit=crop&q=80&w=100',
    fallbackIcon: Factory,
  },
  {
    id: 'CASE-2026-002',
    severity: 'HIGH',
    sla: '96H',
    exposure: '420M KZT',
    entity_en: 'Atyrau Refinery',
    entity_zh: '阿特劳烃类多相精炼厂房',
    facility_en: 'ATY-REF-01',
    facility_zh: '阿特劳裂解塔二级阀站',
    cause_en: 'Emissions Exceedance Pattern',
    cause_zh: '红外遥测感知隐秘夜间、烟气超载',
    recommendation_en: 'Site validation & formal citation',
    recommendation_zh: '下达省环保整改整改处罚预通知',
    image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=100',
    fallbackIcon: Factory,
  },
  {
    id: 'CASE-2026-003',
    severity: 'HIGH',
    sla: '168H',
    exposure: '260M KZT',
    entity_en: 'KEGOC Power Lines',
    entity_zh: '国家电网KEGOC骨干通道',
    facility_en: '220kV North-South Trunk',
    facility_zh: '220kV高精北部至南部变电站',
    cause_en: '3-phase Imbalance Recurrence',
    cause_zh: '物理频率负荷不平衡波动持续',
    recommendation_en: 'Engineering load profile review',
    recommendation_zh: '调取SCADA波形对冲异常负荷段',
    image: 'https://images.unsplash.com/photo-1626244795369-0bd7eeb1786f?auto=format&fit=crop&q=80&w=100',
    fallbackIcon: Zap,
  },
  {
    id: 'CASE-2026-004',
    severity: 'MEDIUM',
    sla: '240H',
    exposure: '175M KZT',
    entity_en: 'Pavlodar GRES-1',
    entity_zh: '巴甫洛达尔GRES-1火力站',
    facility_en: 'Unit-3 Coal Hopper',
    facility_zh: '3号核心锅炉辅煤储运轨道',
    cause_en: 'Coal Consumption Drift +2.1σ',
    cause_zh: '卡路里指标异常偏低疑似掺沙掺水',
    recommendation_en: 'Silo chemistry crosscheck audit',
    recommendation_zh: '指令第三方实测封样盲物理理化',
    image: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&q=80&w=100',
    fallbackIcon: Hammer,
  },
  {
    id: 'CASE-2026-005',
    severity: 'LOW',
    sla: '7d',
    exposure: '32M KZT',
    entity_en: 'Mangystau Grid Optic',
    entity_zh: '曼吉斯套信息光纤自建网',
    facility_en: 'Sensing Node G-44 Gateway',
    facility_zh: 'G-44计量级中继网关设备',
    cause_en: '3 sites delayed >30min telemetry',
    cause_zh: '信道串联中断多帧报文超时重传',
    recommendation_en: 'Trigger ping diagnostic loop',
    recommendation_zh: '拉取自检遥测信道诊断强稳校核',
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=100',
    fallbackIcon: Satellite,
  }
];

const BUBBLE_COORDS = [
  { left: '16%', top: '22%', dx: [0, 4, -4, 0], dy: [0, -5, 4, 0], dur: 12 },
  { left: '46%', top: '23%', dx: [0, -4, 5, 0], dy: [0, 6, -5, 0], dur: 10 },
  { left: '76%', top: '21%', dx: [0, 5, -3, 0], dy: [0, -4, 5, 0], dur: 14 },
  { left: '26%', top: '48%', dx: [0, -3, 4, 0], dy: [0, 5, -3, 0], dur: 11 },
  { left: '60%', top: '46%', dx: [0, 4, -5, 0], dy: [0, -5, 4, 0], dur: 13 },
  { left: '12%', top: '74%', dx: [0, -4, 3, 0], dy: [0, 4, -5, 0], dur: 9 },
  { left: '38%', top: '78%', dx: [0, 5, -4, 0], dy: [0, -4, 4, 0], dur: 15 },
  { left: '84%', top: '50%', dx: [0, -4, 4, 0], dy: [0, 5, -4, 0], dur: 12 },
  { left: '88%', top: '80%', dx: [0, 3, -4, 0], dy: [0, -3, 3, 0], dur: 11 },
  { left: '63%', top: '82%', dx: [0, -5, 4, 0], dy: [0, 4, -3, 0], dur: 10 },
];

export default function MinisterDashboard() {
  const { language, setLanguage } = useLanguage();
  const navigate = useNavigate();

  const [activePipelineFilter, setActivePipelineFilter] = useState<string | null>(null);
  const [pipelineCountPulse, setPipelineCountPulse] = useState(0);

  // Dynamic Chart State
  const [chartData, setChartData] = useState(EXPORT_GDP_BASE);
  const [chartUpdatePulse, setChartUpdatePulse] = useState(false);
  const [hoveredPointIndex, setHoveredPointIndex] = useState<number | null>(null);
  const [hoveredCoordinate, setHoveredCoordinate] = useState<{ x: number; y: number } | null>(null);

  // Sentiment Topics Auto-Swap State
  const [sentimentTopics, setSentimentTopics] = useState(INITIAL_SENTIMENT_TOPICS);
  const [randomSwapIdx, setRandomSwapIdx] = useState<number | null>(null);

  // Livelihood Gauge Hover State
  const [hoveredBar, setHoveredBar] = useState<string | null>(null);

  // New Bollinger Band & News States
  const [activeHypothesisFilter, setActiveHypothesisFilter] = useState<'Strike' | 'AgingEquipment' | 'PipelineMaintenance' | 'Weather' | 'OilfieldRepair' | null>(null);
  const [activeNewsTab, setActiveNewsTab] = useState<'DOMESTIC' | 'INTERNATIONAL'>('DOMESTIC');
  const [hoveredKlineIndex, setHoveredKlineIndex] = useState<number | null>(null);

  // View mode switcher for Quadrant C
  const [sentimentViewMode, setSentimentViewMode] = useState<'funnel' | 'bubbles'>('funnel');
  const [hoveredSankeyNodeId, setHoveredSankeyNodeId] = useState<string | null>(null);

  const tLabel = (en: string, zh: string) => {
    return language === 'zh' ? zh : en;
  };

  // Auto-update Dynamic GDP Chart every 4 seconds
  useEffect(() => {
    const chartInterval = setInterval(() => {
      setChartData(prev => {
        const next = [...prev];
        const last = next[next.length - 1];
        
        let monthName = last.month;
        const [mStr, yStr] = last.month.split(' ');
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        let idx = monthNames.indexOf(mStr);
        let yearDigit = parseInt(yStr);
        idx = (idx + 1) % 12;
        if (idx === 0) yearDigit += 1;
        const nextMonth = `${monthNames[idx]} ${yearDigit.toString().padStart(2, '0')}`;

        // Keep series under 15 length to fit screen beautiful
        if (next.length >= 14) {
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
      const timer = setTimeout(() => setChartUpdatePulse(false), 300);
      return () => clearTimeout(timer);
    }, 4000);

    return () => clearInterval(chartInterval);
  }, []);

  // Sentiment Cloud Auto-Swap every 6 seconds
  useEffect(() => {
    const swapInterval = setInterval(() => {
      // Pick indices 4 to 9 to preserve top Critical priorities (#1, #2)
      const targetIdx = Math.floor(Math.random() * 6) + 4; 
      const newTopic = SYNTHETIC_POOL[Math.floor(Math.random() * SYNTHETIC_POOL.length)];
      
      setRandomSwapIdx(targetIdx);
      setTimeout(() => {
        setSentimentTopics(prev => {
          const next = [...prev];
          next[targetIdx] = {
            ...newTopic,
            size: prev[targetIdx].size, // lock original size to prevent drift overflow
            color: newTopic.color
          };
          return next;
        });
        setRandomSwapIdx(null);
      }, 300);
    }, 6000);

    return () => clearInterval(swapInterval);
  }, []);

  // Flow pulse animation for bottom closed loop (every 4 seconds)
  useEffect(() => {
    const pulseInterval = setInterval(() => {
      setPipelineCountPulse(prev => (prev + 1) % 6);
    }, 4000);
    return () => clearInterval(pulseInterval);
  }, []);

  // SVG Calculation Helpers for Quadrant A Chart
  const getX = (index: number) => {
    return (index / (chartData.length - 1)) * 420 + 35; // left margin 35, width 420
  };
  const getExportY = (val: number) => {
    // Export value range: 10.5 to 15.5 (range delta = 5.0)
    // SVG plot box height: 130
    const h = 130;
    const padding = 20;
    const ratio = (val - 10.5) / 5.0;
    return h - ratio * h + padding;
  };
  const getGdpY = (val: number) => {
    // GDP YoY % range: 3.5 to 7.5 (range delta = 4.0)
    const h = 130;
    const padding = 20;
    const ratio = (val - 3.5) / 4.0;
    return h - ratio * h + padding;
  };

  // Generate smooth cubic SVG path for plot lines
  const generatePath = (valMap: (y: number) => number, key: 'export' | 'gdp') => {
    return `M ${chartData.map((d, i) => `${getX(i).toFixed(1)},${valMap(d[key]).toFixed(1)}`).join(' L ')}`;
  };

  // Render shaded polygon confidence interval band around export line
  const generateBandPath = () => {
    const topPoints = chartData.map((d, i) => `${getX(i).toFixed(1)},${getExportY(d.export + 0.35).toFixed(1)}`);
    const bottomPoints = [...chartData].reverse().map((d, i) => {
      const origIdx = chartData.length - 1 - i;
      return `${getX(origIdx).toFixed(1)},${getExportY(d.export - 0.35).toFixed(1)}`;
    });
    return `M ${topPoints.join(' L ')} L ${bottomPoints.join(' L ')} Z`;
  };

  // Generate random scatter spots daily around baseline to enrich chart visual density
  const dailySpotData = chartData.flatMap((d, monthIdx) => {
    return [
      { x: getX(monthIdx) - 12, y: getExportY(d.export) + (monthIdx % 3 - 1) * 8 },
      { x: getX(monthIdx) + 8, y: getExportY(d.export) + (monthIdx % 2 === 0 ? 9 : -9) }
    ];
  }).filter(pt => pt.x > 35 && pt.x < 455);

  const handleSvgMouseMove = (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    const svg = e.currentTarget;
    const rect = svg.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const svgWidth = rect.width;
    const pct = mouseX / svgWidth;
    const exactX = pct * 480; // match svg width

    let closestIdx = 0;
    let minDiff = Infinity;
    chartData.forEach((d, i) => {
      const diff = Math.abs(getX(i) - exactX);
      if (diff < minDiff) {
        minDiff = diff;
        closestIdx = i;
      }
    });

    setHoveredPointIndex(closestIdx);
    setHoveredCoordinate({ x: getX(closestIdx), y: getExportY(chartData[closestIdx].export) });
  };

  // Horizontal Gauge render helper
  const renderHBar = (bar: typeof LIVELIHOOD_PRIMARY[0], isLarge: boolean) => {
    const isAmber = bar.status === 'AMBER';
    const isGreen = bar.status === 'GREEN';
    const colorHex = isAmber ? '#E89518' : '#2FA862';

    // Track width spans to 115% of the redline to allow clear margin rendering
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
        <div className="flex justify-between items-center mb-0.5">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: colorHex }} />
            <span className="text-[10px] uppercase font-bold tracking-wider font-mono text-[#6A7686] truncate">
              {language === 'zh' ? bar.label_zh : bar.label_en}
            </span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[11px] font-mono font-bold text-[#0F1722] tabular-nums">
              {bar.current}{bar.unit}
            </span>
            <span className={`text-[8.5px] px-1 font-mono font-black ${
              isAmber ? 'bg-amber-50 text-[#E89518]' : 'bg-green-50 text-[#2FA862]'
            } rounded-[2px]`}>
              {bar.margin}
            </span>
          </div>
        </div>

        <div className={`relative bg-[#F4F6FA] border border-[#E2E7EF] rounded-[2px] overflow-hidden ${isLarge ? 'h-2.5' : 'h-1.5'}`}>
          <div 
            className="h-full opacity-85 transition-all duration-1000"
            style={{ width: `${ratio}%`, backgroundColor: colorHex }}
          />
          {/* Exact Red line boundary stroke */}
          <div 
            className="absolute top-0 bottom-0 w-[1.5px] bg-[#D8454C] z-10"
            style={{ left: `${redlineRatio}%` }}
          />
        </div>
        
        {hoveredBar === bar.label_en && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-[#0F1722] text-white p-2 rounded shadow-md z-[1100] text-[9.5px] font-mono leading-tight">
            <div>30D Average Trend Baseline Rate: 97.4% ({bar.unit})</div>
            <div>Alert triggers dynamically on crossing threshold val: {bar.redline}{bar.unit}</div>
            <div>Current regulatory classification status: {bar.status}</div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-[#F4F6FA] min-h-screen text-[#1A2330] flex flex-col font-sans select-none antialiased">
      
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
            <Settings size={11} className="inline mr-1" />
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

      {/* 3. PRIMARY 4-QUADRANT GRID */}
      <main className="flex-1 p-6 grid grid-cols-2 grid-rows-2 gap-6 overflow-hidden max-w-[1920px] w-full mx-auto" style={{ maxHeight: 'calc(100vh - 110px)' }}>
        
        {/* QUADRANT A: TOP-LEFT — GDP × Capacity Bollinger Band Monitor */}
        <div className="bg-white rounded-[4px] border border-[#E2E7EF] p-4 flex flex-col justify-between overflow-hidden shadow-sm relative group/qa">
          
          <div className="flex items-start justify-between border-b border-[#E2E7EF] pb-1.5 shrink-0">
            <div>
              <h2 className="text-[12px] font-black text-[#0F1722] uppercase tracking-wide flex items-center gap-1.5">
                <TrendingUp size={14} className="text-[#2D6CDF]" />
                {language === 'zh' ? 'GDP × 产能 布林度区间监控' : 'GDP × Capacity Bollinger Band Monitor'}
              </h2>
              <p className="text-[9.5px] text-[#6A7686] font-medium leading-none mt-1">
                {language === 'zh' ? '国家骨干用电及工艺参数波包解算 · 7D 衰退预测' : 'Process parameters wave packet solver · 7D decay forecast'}
              </p>
            </div>
            <div className="flex gap-1.5 text-[9px] font-mono">
              <span className="bg-[#2D6CDF]/5 border border-[#2D6CDF]/15 text-[#2D6CDF] px-1.5 py-0.5 rounded-[2px] font-bold">
                {language === 'zh' ? '今日异常' : 'BREACH'}: {bollingerData.todayCompliance.breach}
              </span>
              <span className="bg-[#FAFBFD] border border-[#E2E7EF] text-[#6A7686] px-1.5 py-0.5 rounded-[2px] font-bold">
                {language === 'zh' ? '合规率' : 'COMPLIANCE'}: 91.2%
              </span>
            </div>
          </div>

          {/* KPI Bar Local Row inside Card */}
          <div className="grid grid-cols-3 gap-2 py-1.5 bg-slate-50/50 rounded-[2px] border border-slate-100 my-1 px-2 text-[10px] shrink-0">
            <div className="flex flex-col">
              <span className="text-[8px] font-bold uppercase text-text-tertiary">{language === 'zh' ? '2026 年度 GDP 目标' : 'GDP TARGET 2026'}</span>
              <span className="font-bold text-[#2D6CDF] mt-0.5">{bollingerData.gdpTarget}% YoY</span>
            </div>
            <div className="flex flex-col border-l border-slate-100 pl-2">
              <span className="text-[8px] font-bold uppercase text-text-tertiary">{language === 'zh' ? '油气贡献占比' : 'OIL & GAS SHARE'}</span>
              <span className="font-bold text-text-primary mt-0.5">{bollingerData.oilGasShareTarget}%</span>
            </div>
            <div className="flex flex-col border-l border-slate-100 pl-2">
              <span className="text-[8px] font-bold uppercase text-text-tertiary">{language === 'zh' ? '今日合规企业数' : 'TODAY COMPLIANCE'}</span>
              <span className="font-bold text-[#2FA862] mt-0.5">{bollingerData.todayCompliance.ok} / {bollingerData.todayCompliance.total}</span>
            </div>
          </div>

          <div className="flex-1 flex gap-3 my-1 overflow-hidden relative min-h-[145px]">
            {/* Bollinger Band SVG Chart */}
            <div className="flex-1 h-full min-h-[140px] flex flex-col justify-between relative bg-[#FAFBFD]/80 p-1.5 rounded-[2px] border border-[#E2E7EF]">
              <div className="flex items-center justify-between text-[8px] font-mono text-[#6A7686] shrink-0">
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-[#E5E7EB] block rounded-sm" /> 
                  布林带带宽 (Bollinger Bands ±2σ)
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-[#D8454C] block rounded-full" /> 
                  {language === 'zh' ? '跌出带宽 (BREACH)' : 'Breach Warning'}
                </span>
              </div>

              <div className="flex-1 relative overflow-visible mt-1 pr-1">
                <svg
                  className="w-full h-full overflow-visible"
                  viewBox="0 0 440 100"
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
                    d={`M ${bollingerData.kline.map((d, i) => `${(i / 66) * 440},${100 - ((d.upper - 360) / 90) * 100}`).join(' L ')}
                        L ${[...bollingerData.kline].reverse().map((d, i) => `${((66 - i) / 66) * 440},${100 - ((d.lower - 360) / 90) * 100}`).join(' L ')} Z`}
                    fill="#94A3B8"
                    fillOpacity="0.12"
                  />

                  {/* Midline representation */}
                  <path
                    d={`M ${bollingerData.kline.map((d, i) => `${(i / 66) * 440},${100 - ((d.mid - 360) / 90) * 100}`).join(' L ')}`}
                    fill="none"
                    stroke="#D1D5DB"
                    strokeWidth="0.8"
                    strokeDasharray="2 3"
                  />

                  {/* Upper line */}
                  <path
                    d={`M ${bollingerData.kline.map((d, i) => `${(i / 66) * 440},${100 - ((d.upper - 360) / 90) * 100}`).join(' L ')}`}
                    fill="none"
                    stroke="#94A3B8"
                    strokeWidth="0.75"
                    strokeOpacity="0.5"
                  />

                  {/* Lower line */}
                  <path
                    d={`M ${bollingerData.kline.map((d, i) => `${(i / 66) * 440},${100 - ((d.lower - 360) / 90) * 100}`).join(' L ')}`}
                    fill="none"
                    stroke="#94A3B8"
                    strokeWidth="0.75"
                    strokeOpacity="0.5"
                  />

                  {/* Value Line - splits historical (solid) and forecast (dashed orange) */}
                  <path
                    d={`M ${bollingerData.kline.slice(0, 61).map((d, i) => `${(i / 66) * 440},${100 - ((d.value - 360) / 90) * 100}`).join(' L ')}`}
                    fill="none"
                    stroke="#2D6CDF"
                    strokeWidth="1.5"
                  />
                  
                  <path
                    d={`M ${bollingerData.kline.slice(60).map((d, i) => `${((i + 60) / 66) * 440},${100 - ((d.value - 360) / 90) * 100}`).join(' L ')}`}
                    fill="none"
                    stroke="#E89518"
                    strokeWidth="1.5"
                    strokeDasharray="3 3"
                  />

                  {/* Breach dots */}
                  {bollingerData.kline.map((d, i) => {
                    if (!d.breach) return null;
                    const cx = (i / 66) * 440;
                    const cy = 100 - ((d.value - 360) / 90) * 100;
                    return (
                      <g key={i}>
                        <circle cx={cx} cy={cy} r="3" fill="#D8454C" />
                        <circle cx={cx} cy={cy} r="6" fill="none" stroke="#D8454C" strokeWidth="0.7" className="animate-ping" style={{ animationDuration: '3s' }} />
                      </g>
                    );
                  })}

                  {/* Forecast splitting vertical line */}
                  <line x1={(60 / 66) * 440} y1="0" x2={(60 / 66) * 440} y2="100" stroke="#94A3B8" strokeWidth="0.75" strokeDasharray="3 3" />
                  <text x={(60 / 66) * 440 - 32} y="10" fill="#E89518" className="text-[7.5px] font-mono font-bold scale-90">7D FORECAST ›</text>

                  {/* Interactive Crosshair */}
                  {hoveredKlineIndex !== null && (
                    <>
                      <line x1={(hoveredKlineIndex / 66) * 440} y1="0" x2={(hoveredKlineIndex / 66) * 440} y2="100" stroke="#1F2937" strokeWidth="0.5" />
                      <circle cx={(hoveredKlineIndex / 66) * 440} cy={100 - ((bollingerData.kline[hoveredKlineIndex].value - 360) / 90) * 100} r="4" fill="#2D6CDF" stroke="#fff" strokeWidth="1" />
                    </>
                  )}
                </svg>

                {/* Interactive Tooltip Inside Chart */}
                {hoveredKlineIndex !== null && (
                  <div className="absolute top-2 left-2 bg-[#0F1722] text-white p-2 text-[8.5px] font-mono rounded border border-white/10 z-30 leading-snug w-[170px] pointer-events-none">
                    <div className="text-white/60 font-black border-b border-white/5 pb-0.5 mb-1 flex justify-between">
                      <span>{bollingerData.kline[hoveredKlineIndex].date}</span>
                      {bollingerData.kline[hoveredKlineIndex].forecast && <span className="text-amber-400 font-bold">FORECAST</span>}
                    </div>
                    <div className="flex justify-between">
                      <span>{language === 'zh' ? '真实产能指标' : 'Current Value'}</span>
                      <strong className="text-sky-400 font-black">{bollingerData.kline[hoveredKlineIndex].value} GWh</strong>
                    </div>
                    <div className="flex justify-between text-white/80">
                      <span>{language === 'zh' ? '布林中轨' : 'Bollinger Mid'}</span>
                      <span>{bollingerData.kline[hoveredKlineIndex].mid}</span>
                    </div>
                    <div className="flex justify-between text-white/50">
                      <span>BB Bounds</span>
                      <span>[{bollingerData.kline[hoveredKlineIndex].lower} - {bollingerData.kline[hoveredKlineIndex].upper}]</span>
                    </div>
                    {bollingerData.kline[hoveredKlineIndex].breach && (
                      <div className="text-[#D8454C] font-black border-t border-[#D8454C]/25 mt-1 pt-0.5 animate-pulse">
                        ⚠️ BREACH: OUT OF SAFETY BOUNDS
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Bottom axes */}
              <div className="flex justify-between text-[7px] text-[#A8B2C0] font-mono shrink-0 px-1 mt-0.5">
                <span>03-22</span>
                <span>04-12</span>
                <span>05-02</span>
                <span>05-22 (TODAY)</span>
                <span className="text-[#E89518] font-bold">05-29 (PROJ)</span>
              </div>
            </div>
          </div>

          {/* Bottom Side-by-Side Area */}
          <div className="grid grid-cols-5 gap-3 pt-2 border-t border-[#E2E7EF] shrink-0 h-[105px]">
            {/* L: 60% Width - Checklists and Enterprise filters */}
            <div className="col-span-3 flex flex-col justify-between overflow-hidden">
              <span className="text-[8.5px] font-black uppercase text-text-secondary mb-1">
                {language === 'zh' ? '跌出带宽原因归因定位' : 'BREACH HYPOTHESIS & ROOT ATTRIBUTION'}
              </span>

              {/* Quick Checklist Filter row */}
              <div className="flex gap-1 overflow-x-auto pb-1.5 scrollbar-none shrink-0">
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
                      className={`px-1.5 py-0.5 rounded-[2px] text-[8px] font-mono whitespace-nowrap border transition-all ${
                        isActive 
                        ? 'bg-[#D8454C] text-white border-[#D8454C]' 
                        : 'bg-[#FAFBFD] hover:bg-slate-100 text-text-secondary border-slate-200'
                      }`}
                    >
                      {language === 'zh' ? item.zh : item.en}
                    </button>
                  );
                })}
              </div>

              {/* Company Compliance Status Miniature table */}
              <div className="flex-1 overflow-y-auto space-y-1 bg-[#FAFBFD]/60 border border-slate-100 p-1.5 rounded-[2px]">
                {bollingerData.enterprises
                  .filter(ent => !activeHypothesisFilter || ent.hypothesis === activeHypothesisFilter)
                  .slice(0, 3)
                  .map((ent) => {
                    const isBreach = ent.status === 'breach';
                    const isWarn = ent.status === 'warning';
                    return (
                      <div key={ent.id} className="flex justify-between items-center text-[8.5px] font-mono">
                        <span className="text-text-primary font-bold">{ent.name}</span>
                        <div className="flex items-center gap-1.5">
                          <span className="text-text-tertiary">σ = {ent.sigma > 0 ? `+${ent.sigma}` : ent.sigma}</span>
                          <span className={`px-1 rounded-[1px] text-[7.5px] font-black uppercase ${
                            isBreach ? 'bg-red-50 text-red-600' : isWarn ? 'bg-amber-50 text-amber-600' : 'bg-green-50 text-green-600'
                          }`}>
                            {ent.status}
                          </span>
                        </div>
                      </div>
                    );
                })}
              </div>
            </div>

            {/* R: 40% Width - Tabbed News Feed Briefing */}
            <div className="col-span-2 flex flex-col justify-between overflow-hidden border-l border-[#E2E7EF] pl-3">
              <div className="flex justify-between items-center shrink-0 mb-1">
                <span className="text-[8.5px] font-black uppercase text-text-secondary">
                  {language === 'zh' ? '能源方向新闻滚动' : 'METRIC NEWS'}
                </span>
                
                {/* News feed small tab selector */}
                <div className="flex gap-1.5 text-[8px] font-black font-mono">
                  <button 
                    onClick={() => setActiveNewsTab('DOMESTIC')}
                    className={`pb-0.5 border-b ${activeNewsTab === 'DOMESTIC' ? 'text-[#2D6CDF] border-[#2D6CDF]' : 'text-text-tertiary border-transparent'}`}
                  >
                    {language === 'zh' ? '国内' : 'DOM'}
                  </button>
                  <button 
                    onClick={() => setActiveNewsTab('INTERNATIONAL')}
                    className={`pb-0.5 border-b ${activeNewsTab === 'INTERNATIONAL' ? 'text-[#2D6CDF] border-[#2D6CDF]' : 'text-text-tertiary border-transparent'}`}
                  >
                    {language === 'zh' ? '国际' : 'INT'}
                  </button>
                </div>
              </div>

              {/* Tabbed content displaying 2 items */}
              <div className="flex-1 overflow-y-auto space-y-1.5 pr-0.5">
                {(activeNewsTab === 'DOMESTIC' ? energyNews.domestic : energyNews.international)
                  .slice(0, 2)
                  .map((news) => {
                    return (
                      <div key={news.id} className="group/news border-b border-slate-100/60 pb-1 last:border-0">
                        <div className="flex items-center justify-between text-[8px] text-[#A8B2C0] font-mono leading-none">
                          <span className="font-bold text-text-secondary">{news.region} · {news.time}</span>
                          <span className={`scale-90 px-0.5 rounded-[1px] font-bold ${
                            news.severity === 'HIGH' ? 'bg-red-50 text-red-500' : news.severity === 'MED' ? 'bg-amber-50 text-amber-500' : 'bg-slate-150 text-text-tertiary'
                          }`}>{news.severity}</span>
                        </div>
                        <h4 className="text-[9.5px] font-bold text-text-primary mt-0.5 leading-snug line-clamp-1 group-hover/news:text-[#2D6CDF] group-hover/news:underline cursor-pointer">
                          {news.title}
                        </h4>
                      </div>
                    );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* QUADRANT B: TOP-RIGHT — LIVELIHOOD RED LINES */}
        <div className="bg-white rounded-[4px] border border-[#E2E7EF] p-4 flex flex-col justify-between overflow-hidden shadow-sm relative">
          
          <div className="flex items-start justify-between border-b border-[#E2E7EF] pb-1.5 shrink-0">
            <div>
              <h2 className="text-[12px] font-black text-[#0F1722] uppercase tracking-wide flex items-center gap-1.5">
                <Flame size={14} className="text-[#D8454C]" />
                {tLabel('LIVELIHOOD RED-LINE LIVE MONITOR · Cross-Ministry Trigger Band', '民生红线指标实时预警安全网 · 物理调度及物理解析跨部联防中心')}
              </h2>
              <p className="text-[9.5px] text-[#6A7686] font-medium leading-none mt-1">
                {tLabel('Real-time thresholds sync with Pricing Bureau & Internal Affairs', '联合警戒阀点：多部委联合实时物理对冲、零售限价干预监测')}
              </p>
            </div>
            <span className="text-[9px] font-mono bg-[#FAFBFD] border border-[#E2E7EF] text-[#6A7686] px-1.5 py-0.5 rounded-[2px] font-bold">
              {tLabel('audited · MIA-reviewed 2026-04', '内务局核验 · MIA-2026')}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 my-2.5 flex-1 overflow-hidden">
            
            {/* Left half: 8 Horizontal bars (4 large primary, 4 smaller secondary) */}
            <div className="space-y-2.5 overflow-y-auto pr-1">
              {LIVELIHOOD_PRIMARY.map(b => renderHBar(b, true))}
              <div className="h-px bg-[#E2E7EF] my-1.5" />
              {LIVELIHOOD_SECONDARY.map(b => renderHBar(b, false))}
            </div>

            {/* Right half: alert narrative + historical predictive timeline */}
            <div className="flex flex-col justify-between overflow-hidden gap-2">
              
              {/* Alert narrative Card */}
              <div className="bg-[#FFF8F8] border border-red-100 p-2.5 rounded-[2px] text-[10px] text-slate-800 leading-normal font-mono">
                <div className="flex items-center gap-1.5 text-[#D8454C] font-bold text-[10.5px]">
                  <AlertTriangle size={12} />
                  <span>{tLabel('⚠ AMBER — Mangystau Oblast Sentinel Active', '⚠️ 橙色警戒 — 曼吉斯套省区域偏置告警中')}</span>
                </div>
                <p className="text-[#1A2330] font-medium mt-1">
                  {tLabel('Household Gas Pressure Index has slipped BELOW livelihood red-line threshold for 14 consecutive hours.', '该区民用和商业加气站天然气物理输送压力指标已连续14小时跌穿特级红线（阈值95%）。')}
                </p>
                <div className="border-t border-[#E2E7EF]/50 my-1.5 pt-1 text-[9.5px] text-[#6A7686]">
                  <strong>Trigger parallel:</strong> 8% probability of rapid pressure-drop affecting 2,400 households in Aktau microgrid.<br />
                  <strong>Coordination links automatically triggered:</strong><br />
                  <span className="text-[#2D6CDF]">[ Pricing Bureau / 物价调节 ]</span> <span className="text-[#B23A6A]">[ Internal Affairs / 内政治安 ]</span>
                </div>
              </div>

              {/* Historical Predictive Timeline */}
              <div className="border border-[#E2E7EF] p-2 rounded-[2px] bg-[#FAFBFD]/60 flex flex-col justify-between h-[100px]">
                <div className="text-[8.5px] font-mono text-[#6A7686] font-bold flex justify-between uppercase">
                  <span>{tLabel('HISTORICAL EVENT PREDICTIVE TIMELINE', '历史暴恐及大震荡行为拟合评估')}</span>
                  <span className="text-[#E89518]">similarity: 0.81</span>
                </div>

                {/* Horizontal dotted line axis with custom triangular ticks */}
                <div className="relative h-6 mt-1 flex items-center">
                  <div className="absolute w-full h-px bg-dashed border-b border-[#D8454C]/45 border-dashed" />
                  
                  {HISTORICAL_TIMELINE.map((evt, idx) => {
                    const isLast = idx === HISTORICAL_TIMELINE.length - 1;
                    const xPct = (idx / (HISTORICAL_TIMELINE.length - 1)) * 90 + 5;
                    return (
                      <div 
                        key={evt.date} 
                        className="absolute -translate-x-1/2 group/evt"
                        style={{ left: `${xPct}%` }}
                      >
                        <div className={`w-3.5 h-3.5 flex items-center justify-center cursor-pointer transition-transform duration-200 hover:scale-[1.3] ${
                          isLast ? 'text-[#D8454C] animate-pulse scale-110' : 'text-[#FAFBFD] stroke-[#6A7686]'
                        }`}>
                          <motion.span 
                            className="block text-[12px] font-black drop-shadow-sm pointer-events-none"
                            style={{ color: isLast ? '#D8454C' : '#E89518' }}
                          >
                            ▲
                          </motion.span>
                        </div>
                        
                        {/* Event year label */}
                        <span className="absolute left-1/2 -translate-x-1/2 top-4.5 text-[8px] font-mono text-[#A8B2C0] font-bold">
                          {evt.year}
                        </span>

                        {/* Event detailed outcome hover tooltip */}
                        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 bg-[#0F1722] text-white p-2 rounded-[2px] text-[8.5px] font-mono shadow-md opacity-0 pointer-events-none group-hover/evt:opacity-100 group-hover/evt:pointer-events-auto transition-all leading-snug w-[180px] z-[1200]">
                          <strong className="text-amber-400 block">{evt.date}</strong>
                          <span className="block font-bold text-white uppercase">{language === 'zh' ? evt.type_zh : evt.type_en}</span>
                          <span className="text-white/60 block border-t border-white/5 mt-0.5 pt-0.5">{language === 'zh' ? evt.outcome_zh : evt.outcome_en}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="text-[8px] font-mono text-[#6A7686] mt-1 leading-none text-center italic">
                  {tLabel('Current deviation matches 2024-Feb pattern. Expected offline restoration: 48H.', '比对相似度指示匹配2024年2月模式。若及时外派稽查，自愈修复预期：48H-72H。')}
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* QUADRANT C: BOTTOM-LEFT — SENTIMENT DUAL VIEW COMPONENT */}
        <div className="bg-white rounded-[4px] border border-[#E2E7EF] p-4 flex flex-col justify-between overflow-hidden shadow-sm relative group/qc">
          
          <div className="flex items-start justify-between border-b border-[#E2E7EF] pb-1.5 shrink-0">
            <div>
              <h2 className="text-[12px] font-black text-[#0F1722] uppercase tracking-wide flex items-center gap-1.5">
                <Users size={14} className="text-[#B23A6A]" />
                {sentimentViewMode === 'funnel' 
                  ? (language === 'zh' ? '今日舆情漏斗' : 'Sentiment Funnel · Today')
                  : (language === 'zh' ? '社会学涉能耗舆论震荡信号' : 'ENERGY SENTIMENT SIGNAL · NLP MONITOR')}
              </h2>
              <p className="text-[9.5px] text-[#6A7686] font-medium leading-none mt-1">
                {language === 'zh' ? '涉能情绪层级收敛透视 · 跨平台 NLP 解析' : '収敛透视 · Multi-tier semantic NLP converged analytics'}
              </p>
            </div>
            
            {/* View switcher buttons styled like local pill options */}
            <div className="flex gap-1 bg-slate-100 p-0.5 rounded-[2px] text-[8.5px] font-bold font-mono">
              <button
                onClick={() => setSentimentViewMode('funnel')}
                className={`px-1.5 py-0.5 rounded-[1px] ${sentimentViewMode === 'funnel' ? 'bg-white text-[#2D6CDF] shadow-xs' : 'text-text-tertiary'}`}
              >
                {language === 'zh' ? '漏斗流' : 'Funnel'}
              </button>
              <button
                onClick={() => setSentimentViewMode('bubbles')}
                className={`px-1.5 py-0.5 rounded-[1px] ${sentimentViewMode === 'bubbles' ? 'bg-white text-[#2D6CDF] shadow-xs' : 'text-text-tertiary'}`}
              >
                {language === 'zh' ? '话题泡' : 'Cloud'}
              </button>
            </div>
          </div>

          {/* DUAL RENDER LOGIC */}
          <div className="flex-1 my-2 bg-slate-50/60 rounded-[2px] border border-[#E2E7EF] p-2 relative overflow-hidden h-[180px] flex items-center justify-center">
            {sentimentViewMode === 'funnel' ? (
              /* View A: Sankey Funnel Chart */
              <div className="w-full h-full relative" onClick={() => navigate('/warning/sentiment')}>
                {/* Connections (Links) SVG */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
                  {sankeyData.links.map((link, idx) => {
                    const fromNode = sankeyData.nodes.find(n => n.id === link.source);
                    const toNode = sankeyData.nodes.find(n => n.id === link.target);
                    if (!fromNode || !toNode) return null;

                    // Coordinates helper mapped directly
                    const getPos = (id: string, col: 1|2|3|4) => {
                      const colNodes = sankeyData.nodes.filter(n => n.col === col);
                      const i = colNodes.findIndex(n => n.id === id);
                      const t = colNodes.length;
                      
                      let x = 10;
                      if (col === 1) x = 15;
                      else if (col === 2) x = 135;
                      else if (col === 3) x = 255;
                      else if (col === 4) x = 365;

                      const spacing = 165 / (t + 1);
                      const y = spacing * (i + 1) + 8;
                      return { x, y };
                    };

                    const from = getPos(link.source, fromNode.col);
                    const to = getPos(link.target, toNode.col);

                    const startX = from.x + 65; // Source node card width offset
                    const startY = from.y;
                    const endX = to.x;
                    const endY = to.y;
                    const dx = endX - startX;

                    const d = `M ${startX} ${startY} C ${startX + dx * 0.4} ${startY}, ${startX + dx * 0.6} ${endY}, ${endX} ${endY}`;
                    
                    const isHovered = hoveredSankeyNodeId === link.source || hoveredSankeyNodeId === link.target;
                    const hasActiveHover = hoveredSankeyNodeId !== null;

                    let strokeColor = '#CBD5E1';
                    if (fromNode.color === 'red' || toNode.color === 'red') strokeColor = '#FCA5A5';
                    else if (fromNode.color === 'yellow' || toNode.color === 'yellow') strokeColor = '#FDE047';

                    return (
                      <path
                        key={idx}
                        d={d}
                        fill="none"
                        stroke={strokeColor}
                        strokeWidth={isHovered ? 2.5 : 1}
                        strokeOpacity={hasActiveHover ? (isHovered ? 0.8 : 0.05) : 0.28}
                        className="transition-all duration-300"
                      />
                    );
                  })}
                </svg>

                {/* Nodes Container */}
                <div className="absolute inset-0 z-20 pointer-events-none">
                  {sankeyData.nodes.map((node) => {
                    const colNodes = sankeyData.nodes.filter(n => n.col === node.col);
                    const i = colNodes.findIndex(n => n.id === node.id);
                    const t = colNodes.length;
                    
                    let x = 10;
                    if (node.col === 1) x = 15;
                    else if (node.col === 2) x = 135;
                    else if (node.col === 3) x = 255;
                    else if (node.col === 4) x = 365;

                    const spacing = 165 / (t + 1);
                    const y = spacing * (i + 1) + 8;

                    const isNodeHovered = hoveredSankeyNodeId === node.id;
                    const pillColorClass = node.color === 'red' ? 'border-red-350 bg-red-50 text-red-700' : node.color === 'yellow' ? 'border-amber-250 bg-amber-50 text-amber-700' : 'border-emerald-250 bg-emerald-50 text-emerald-700';

                    return (
                      <div
                        key={node.id}
                        onMouseEnter={() => setHoveredSankeyNodeId(node.id)}
                        onMouseLeave={() => setHoveredSankeyNodeId(null)}
                        className={`absolute pointer-events-auto cursor-pointer border rounded-[2px] px-1.5 py-0.5 shadow-sm transition-all duration-300 select-none flex flex-col justify-center ${pillColorClass} ${
                          isNodeHovered ? 'scale-105 shadow-md border-slate-400' : ''
                        }`}
                        style={{
                          left: `${x}px`,
                          top: `${y - 12}px`,
                          width: node.col === 4 ? '90px' : '65px',
                          height: '24px'
                        }}
                      >
                        <span className="text-[7.5px] font-black tracking-tight leading-none uppercase truncate">
                          {language === 'zh' ? node.label_zh : node.label}
                        </span>
                        <span className="text-[6.5px] font-mono leading-none mt-0.5 opacity-80 scale-95 origin-left">
                          {(node.volume / 1000).toFixed(1)}k signals
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              /* View B: Original Bubble Cloud */
              <div className="w-full h-full relative">
                <AnimatePresence mode="popLayout">
                  {sentimentTopics.map((topic, i) => {
                    const coord = BUBBLE_COORDS[i];
                    if (!coord) return null;
                    const isSelected = topic.id === 'ENG-001';
                    const isSwapTarget = randomSwapIdx === i;

                    return (
                      <motion.div
                        key={`${topic.id}-${i}`}
                        onClick={() => navigate('/warning/sentiment')}
                        className="absolute cursor-pointer hover:scale-[1.15] active:scale-[0.9] flex flex-col justify-center items-center text-center shadow transition-all duration-300 pointer-events-auto border border-black/5"
                        style={{
                          left: coord.left,
                          top: coord.top,
                          width: `${topic.size * 0.95}px`,
                          height: `${topic.size * 0.95}px`,
                          backgroundColor: topic.color,
                          borderRadius: '50%',
                          transform: 'translate(-50%, -50%)',
                          zIndex: isSelected ? 30 : 10,
                        }}
                        animate={isSwapTarget ? { scale: [1, 0.1, 1], opacity: [1, 0, 1] } : {
                          x: coord.dx,
                          y: coord.dy,
                        }}
                        transition={{
                          duration: coord.dur,
                          repeat: isSwapTarget ? 0 : Infinity,
                          ease: "easeInOut"
                        }}
                      >
                        <div className="flex flex-col items-center px-1 max-w-full">
                          <span className="text-[7px] font-mono text-white/85 leading-none font-bold">
                            {topic.vol}
                          </span>
                          <span className="text-[8px] font-black text-white leading-tight my-0.5 tracking-tight line-clamp-2 uppercase font-sans">
                            {language === 'zh' ? topic.topic_zh : topic.topic_en}
                          </span>
                          <span className="text-[6.5px] font-mono bg-black/20 text-white leading-none px-1 rounded-sm py-0.2">
                            {topic.sentiment.toFixed(2)}
                          </span>
                        </div>
                        {isSelected && (
                          <span className="absolute -inset-1.5 rounded-full border border-[#D8454C] animate-ping opacity-60 pointer-events-none" />
                        )}
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* Bottom Live Sentiment Strip — Infinite scroll CSS marquee with framer-motion */}
          <div className="h-9 overflow-hidden bg-[#FAFBFD] border-t border-[#E2E7EF] relative flex items-center shrink-0">
            <motion.div 
              className="flex gap-8 whitespace-nowrap absolute"
              animate={{ x: ['0%', '-50%'] }}
              transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
              style={{ width: '200%' }}
            >
              {[...TICKER_ITEMS, ...TICKER_ITEMS].map((tk, idx) => (
                <span className="text-[10px] text-[#6A7686] flex items-center gap-1 font-mono uppercase" key={`${tk.id}-${idx}`}>
                  <span className="text-[#D8454C] font-black">⟶</span>
                  <strong className="text-[#0F1722] font-black">{tk.id}</strong>
                  <span>{language === 'zh' ? tk.summary_zh : tk.summary_en}</span>
                </span>
              ))}
            </motion.div>
          </div>
        </div>

        {/* QUADRANT D: BOTTOM-RIGHT — MINISTER'S TOP 5 PENDING DECISIONS */}
        <div className="bg-white rounded-[4px] border border-[#E2E7EF] p-4 flex flex-col justify-between overflow-hidden shadow-sm relative">
          
          <div className="flex items-start justify-between border-b border-[#E2E7EF] pb-1.5 shrink-0">
            <div>
              <h2 className="text-[12px] font-black text-[#0F1722] uppercase tracking-wide flex items-center gap-1.5">
                <BrainCircuit size={14} className="text-[#E89518]" />
                {tLabel('PENDING MINISTER ACTIONS · TOP 5', '部长特别行政特提与一键干预指挥大厅 (TOP 5)')}
              </h2>
              <p className="text-[9.5px] text-[#6A7686] font-medium leading-none mt-1">
                {tLabel('Auto-prioritized by fiscal exposure × SLA countdown × sensor alignment', '智能矩阵精准权重对齐体系：财政流失风险敞口 × 物理传感器校验合流 24H 动态重排序')}
              </p>
            </div>
            <span className="text-[9px] font-mono bg-red-100 hover:bg-red-200 border border-red-200 text-red-700 px-1.5 py-0.5 rounded-[2px] font-black">
              {tLabel('3 ACTIVE ESCALATIONS', '3起骨干实体严重越限')}
            </span>
          </div>

          {/* Pending Cases List Stack — redesigned to highly emphasize current issues */}
          <div className="flex-1 my-2 overflow-y-auto space-y-2.5 pr-1 hover:pr-0 scrollbar-thin">
            {PENDING_CASES.map((c) => {
              const isCrit = c.severity === 'CRITICAL';
              const isHigh = c.severity === 'HIGH';
              const isMed = c.severity === 'MEDIUM';
              const labelColor = isCrit ? 'text-[#D8454C]' : isHigh ? 'text-[#E89518]' : 'text-[#2D6CDF]';
              const bgPill = isCrit ? 'bg-red-50 text-[#D8454C]' : isHigh ? 'bg-amber-50 text-[#E89518]' : 'bg-blue-50 text-[#2D6CDF]';

              return (
                <div 
                  key={c.id}
                  className="bg-white border border-[#E2E7EF] hover:shadow-md transition-shadow p-3 rounded-[3px] flex gap-3 min-h-[140px] justify-between items-center group/card"
                >
                  {/* Left 15% image Column - Left side stays unchanged as requested */}
                  <div className="w-[52px] h-[52px] rounded-[2px] bg-[#F4F6FA] border border-[#E2E7EF] flex items-center justify-center shrink-0 overflow-hidden relative">
                    <img 
                      src={c.image} 
                      className="w-full h-full object-cover grayscale group-hover/card:grayscale-0 transition-transform duration-500" 
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-black/5 opacity-40" />
                  </div>

                  {/* Right 85% data column */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between h-full py-0.5 space-y-1.5">
                    
                    {/* Line 1: severity tags + SLA + right fiscal exposure */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          isCrit ? 'bg-[#D8454C] animate-pulse' : isHigh ? 'bg-[#E89518]' : 'bg-[#2D6CDF]'
                        }`} />
                        <span className={`text-[8.5px] font-mono font-black uppercase px-1 rounded-[2.5px] scale-95 origin-left ${bgPill}`}>
                          {c.severity}
                        </span>
                        <span className="text-[9px] font-mono font-bold text-[#0F1722]">
                          {c.id}
                        </span>
                        <span className="text-[8.5px] font-mono text-[#D8454C] font-black animate-pulse">
                          ⏱ {c.sla}
                        </span>
                      </div>
                      
                      <span className="text-[11px] font-mono font-black text-[#0F1722] tabular-nums">
                        {c.exposure}
                      </span>
                    </div>

                    {/* Line 2 (Entity): Left doesn't change, entity is displayed normally */}
                    <div className="text-[11.5px] text-[#1A2330] font-medium leading-none truncate">
                      <strong>{language === 'zh' ? c.entity_zh : c.entity_en}</strong>
                    </div>

                    {/* REDESIGNED Highlighted Zone in center/top: Current issue text scaled 2x, bold and red */}
                    <div className="bg-red-50/50 border border-red-100/70 rounded-[3px] p-2 flex flex-col justify-center items-start">
                      <span className="text-[8px] font-black tracking-widest text-[#D8454C]/70 font-mono block mb-0.5 uppercase">
                        {tLabel('CURRENT ISSUE / 当前异常问题', '当前异常问题')}
                      </span>
                      <h3 className="text-[17px] md:text-[18px] lg:text-[20px] xl:text-[22px] font-extrabold text-[#D8454C] leading-tight tracking-tight font-sans">
                        {language === 'zh' 
                          ? `${c.facility_zh}${c.cause_zh}` 
                          : `${c.facility_en}: ${c.cause_en}`}
                      </h3>
                    </div>

                    {/* Line 4: mini action chip + 2 buttons */}
                    <div className="flex items-center justify-between text-[9.5px] pt-1 border-t border-dashed border-[#E2E7EF]">
                      <span className="text-[#2D6CDF] font-black flex items-center gap-0.5 truncate max-w-[65%]">
                        <ChevronRight size={10} className="shrink-0" />
                        <span className="truncate">{language === 'zh' ? c.recommendation_zh : c.recommendation_en}</span>
                      </span>

                      <div className="flex gap-1.5 shrink-0 opacity-80 group-hover/card:opacity-100 transition-opacity">
                        <button 
                          onClick={() => navigate(`/audit/event/${c.id}`)}
                          className="px-2 py-0.5 text-[8.5px] font-black border border-[#E2E7EF] hover:bg-[#F4F6FA] text-[#1A2330] rounded-[2px]"
                        >
                          {tLabel('Open', '打开卷宗')}
                        </button>
                        {isCrit && (
                          <button 
                            onClick={() => navigate(`/audit/report`)}
                            className="px-2 py-0.5 text-[8.5px] font-black bg-[#D8454C] text-white hover:bg-[#B23A6A] rounded-[2px]"
                          >
                            {tLabel('Brief Minister', '呈呈部长')}
                          </button>
                        )}
                      </div>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      {/* 4. BOTTOM PIPELINE STATUS BAR (Retained from V2 with refined IBM Plex look) */}
      <footer className="h-[52px] bg-white border-t border-[#E2E7EF] px-6 flex items-center justify-between shrink-0 select-none shadow-[0_-2px_8px_rgba(0,0,0,0.02)]">
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

        {/* Dynamic bottom telemetry states using Monospace numbers and localized texts */}
        <div className="text-[10px] text-[#6A7686] font-mono ml-4 text-right shrink-0">
          <strong>{tLabel('33 active cases', '33起处理中案件')}</strong> · <span>{tLabel('5 in preventive window', '5起处于前置督办期')}</span> · <span className="text-[#2FA862] font-bold">{tLabel('0 SLA-breached today', '今日0起逾期案件')}</span>
        </div>
      </footer>

    </div>
  );
}
