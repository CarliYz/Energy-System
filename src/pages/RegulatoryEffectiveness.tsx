import React, { useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeft, Search, Filter, ShieldCheck, AlertTriangle, CheckCircle2, 
  ChevronRight, Sparkles, Building2, BellRing, Eye, BarChart3, TrendingDown,
  Clock, ShieldAlert, FileText, Ban
} from 'lucide-react';
import { useLanguage } from '../components/LanguageContext';

const ENTERPRISES = [
  { rank: 1, name: 'Western Caspian Energy LLC', id: 'ENT-KZ-AKT-0091', composite: 48, status: 'RED',
    scores: { completeness: 62, timeliness: 71, consistency: 41, hi: 89, sanctions: 20 },
    delta: -14, badge: 'UNDER INVESTIGATION', category: 'Upstream Gas' },
  { rank: 2, name: 'Atyrau Refinery Joint-Stock Company', id: 'ENT-KZ-ATY-0238', composite: 54, status: 'RED',
    scores: { completeness: 50, timeliness: 65, consistency: 48, hi: 82, sanctions: 35 },
    delta: -8, badge: 'OVERDUE REPORTING', category: 'Refined Oil' },
  { rank: 3, name: 'Pavlodar Energo Coal Trading', id: 'ENT-KZ-PAV-0491', composite: 61, status: 'AMBER',
    scores: { completeness: 75, timeliness: 80, consistency: 62, hi: 55, sanctions: 45 },
    delta: -3, badge: 'METALLURGY AUDIT', category: 'Mine Mouth' },
  { rank: 4, name: 'Eurasian Resources Group Kazakhstan', id: 'ENT-KZ-AST-0104', composite: 71, status: 'AMBER',
    scores: { completeness: 85, timeliness: 78, consistency: 72, hi: 60, sanctions: 55 },
    delta: +1, badge: 'DUE DILIGENCE ACTIVE', category: 'Power / Coal' },
  { rank: 5, name: 'Caspian Coal Supply & Logistics', id: 'ENT-KZ-AKT-1182', composite: 73, status: 'AMBER',
    scores: { completeness: 80, timeliness: 85, consistency: 70, hi: 65, sanctions: 60 },
    delta: -2, badge: 'COMPLIANCE AUDIT', category: 'Coal Logistics' },
  { rank: 6, name: 'Samruk-Energo Distribution JSC', id: 'ENT-KZ-ALA-0012', composite: 78, status: 'AMBER',
    scores: { completeness: 90, timeliness: 82, consistency: 80, hi: 50, sanctions: 70 },
    delta: +4, badge: 'STABLE SEGMENT', category: 'Grid Distributor' },
  { rank: 7, name: 'KEGOC State Grid Operation', id: 'ENT-KZ-AST-0001', composite: 89, status: 'GREEN',
    scores: { completeness: 95, timeliness: 94, consistency: 92, hi: 25, sanctions: 95 },
    delta: +2, badge: 'EXCELLENT DISPATCH', category: 'Transmission Provider' },
  { rank: 8, name: 'KazMunayGas Exploration', id: 'ENT-KZ-AST-0004', composite: 94, status: 'GREEN',
    scores: { completeness: 98, timeliness: 96, consistency: 95, hi: 15, sanctions: 98 },
    delta: +1, badge: 'TOP INHERENT', category: 'Upstream Gas / Oil' },
  { rank: 9, name: 'Tau-Ken Samruk Mining LLC', id: 'ENT-KZ-AST-0158', composite: 90, status: 'GREEN',
    scores: { completeness: 95, timeliness: 92, consistency: 90, hi: 30, sanctions: 90 },
    delta: -1, badge: 'STABLE RUNNING', category: 'Mine Extraction' },
  { rank: 10, name: 'KazTransGas Pipeline Group', id: 'ENT-KZ-ALA-0098', composite: 87, status: 'GREEN',
    scores: { completeness: 92, timeliness: 90, consistency: 88, hi: 40, sanctions: 88 },
    delta: +3, badge: 'NOMINAL RECORD', category: 'Pipeline Transmission' },
];

const STAGES_CAPSULES = [
  { labelEn: 'Ingest Telemetry', labelZh: 'SCADA数采捕获', count: 1247 },
  { labelEn: 'Data Resolved', labelZh: '时序平衡消偏', count: 1140 },
  { labelEn: 'Integrity Check', labelZh: '多源包自检通过', count: 865 },
  { labelEn: 'Anomalies Detected', labelZh: '越限嫌疑黄挂旗', count: 33 },
  { labelEn: 'Attribution Done', labelZh: '智能研判定性', count: 21 },
  { labelEn: 'Enforced Actions', labelZh: '关停或罚单送达', count: 12 },
  { labelEn: 'Dunning Dispatched', labelZh: '下发督导催报令', count: 8 },
  { labelEn: 'Archived Cases', labelZh: '历史卷宗备存', count: 1211 },
];

export default function RegulatoryEffectiveness() {
  const { language } = useLanguage();
  const navigate = useNavigate();

  const [selectedEntId, setSelectedEntId] = useState<string>('ENT-KZ-AKT-0091');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [activeStageFilter, setActiveStageFilter] = useState<number | null>(null);

  const tLabel = (en: string, zh: string) => {
    return language === 'zh' ? zh : en;
  };

  const getTranslatedEntName = (name: string) => {
    if (language !== 'zh') return name;
    switch (name) {
      case 'Western Caspian Energy LLC': return '西里海能源合资有限责任公司';
      case 'Atyrau Refinery Joint-Stock Company': return '阿特劳炼油厂股份公司';
      case 'Pavlodar Energo Coal Trading': return '巴甫洛达尔电厂及煤炭经营公司';
      case 'Eurasian Resources Group Kazakhstan': return '哈萨克斯坦欧亚资源集团';
      case 'Caspian Coal Supply & Logistics': return '里海煤炭储运多式联运外贸公司';
      case 'Samruk-Energo Distribution JSC': return '萨姆鲁克-能源分配电力公司';
      case 'KEGOC State Grid Operation': return 'KEGOC 国家电网运营调度中心';
      case 'KazMunayGas Exploration': return '哈萨克斯坦国家石油天然气勘探';
      case 'Tau-Ken Samruk Mining LLC': return '陶肯-萨姆鲁克综合矿业开发公司';
      case 'KazTransGas Pipeline Group': return '哈萨克长途输气管网集团';
      default: return name;
    }
  };

  const getTranslatedCategory = (cat: string) => {
    if (language !== 'zh') return cat;
    switch (cat) {
      case 'Upstream Gas': return '上游天然气提取';
      case 'Refined Oil': return '下游成品油提炼';
      case 'Mine Mouth': return '大型坑口火力发电';
      case 'Power / Coal': return '自备发电厂及工程用煤';
      case 'Coal Logistics': return '煤炭货运及多式物流';
      case 'Grid Distributor': return '地方电能购买及网架配电';
      case 'Transmission Provider': return '高压跨区电网主调运营商';
      case 'Upstream Gas / Oil': return '原油与天然气高频混采';
      case 'Mine Extraction': return '露天矿藏井区开采';
      case 'Pipeline Transmission': return '长途气相高压管输';
      default: return cat;
    }
  };

  const filteredEnterprises = useMemo(() => {
    return ENTERPRISES.filter(ent => 
      ent.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      ent.id.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const selectedEnt = useMemo(() => {
    return ENTERPRISES.find(e => e.id === selectedEntId) || ENTERPRISES[0];
  }, [selectedEntId]);

  // SVG Coordinates helper for 5-axis Radar
  // Center: (100, 100), R = 75
  const radarPoints = useMemo(() => {
    const s = selectedEnt.scores;
    const items = [
      { key: 'completeness', val: s.completeness, angle: 0 },
      { key: 'timeliness', val: s.timeliness, angle: 72 },
      { key: 'consistency', val: s.consistency, angle: 144 },
      { key: 'hi', val: 100 - s.hi, angle: 216 }, // Lower human intervention represents HIGHER efficiency
      { key: 'sanctions', val: s.sanctions, angle: 288 },
    ];
    
    return items.map(item => {
      const rad = (item.angle - 90) * (Math.PI / 180);
      const factor = item.val / 100;
      const r = 75 * factor;
      const x = 100 + r * Math.cos(rad);
      const y = 100 + r * Math.sin(rad);
      return { x, y, label: item.key, score: item.val };
    });
  }, [selectedEnt]);

  const radarPath = useMemo(() => {
    return radarPoints.map(p => `${p.x},${p.y}`).join(' ') + ' ' + `${radarPoints[0].x},${radarPoints[0].y}`;
  }, [radarPoints]);

  return (
    <div className="flex-1 flex bg-[#F4F6FA] text-[#1A2330] font-sans overflow-hidden h-[calc(100vh-56px)]">
      
      {/* 4-Act STAGES UPPER HORIZONTAL BAR */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* COMPLIANCE HEADER CONTROLS */}
        <div className="h-14 border-b border-[#E2E7EF] bg-white flex items-center justify-between px-6 shrink-0 z-10 select-none">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate('/minister/dashboard')}
              className="flex items-center gap-1.5 text-[#6A7686] hover:text-[#0F1722] pr-3 border-r border-[#E2E7EF] text-[11px] font-bold"
            >
              <ArrowLeft size={13} />
              <span>{tLabel('Minister Desk', '部长大屏')}</span>
            </button>
            <span className="text-[11.5px] font-black uppercase text-[#0F1722] tracking-wider">
              {tLabel('ACT III-E · REGULATORY COMPLEX EFFECTIVENESS LEDGER', '第三幕戊 · 1,247家能源企业闭环穿透治理效能追踪与智催总账')}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-red-100 text-red-700 text-[9px] font-bold rounded font-mono uppercase">
              {tLabel('2 CASE REVOLVERS DISPATCHED', '2起案卷智催督导案已分发并对齐')}
            </span>
          </div>
        </div>

        {/* 8 STAGES CAPSULE FILTER SELECTOR */}
        <div className="bg-slate-50 border-b border-[#E2E7EF] px-6 py-2 flex gap-2 select-none shrink-0 overflow-x-auto no-scrollbar">
          {STAGES_CAPSULES.map((capsule, index) => (
            <button
              key={index}
              onClick={() => setActiveStageFilter(activeStageFilter === index ? null : index)}
              className={`px-3 py-1.5 rounded-[4px] border text-[11px] font-bold font-mono transition-all flex items-center gap-2 shrink-0 ${
                activeStageFilter === index
                  ? 'bg-[#2D6CDF] text-white border-[#2D6CDF]'
                  : 'bg-white text-slate-700 border-[#E2E7EF] hover:bg-slate-50'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${activeStageFilter === index ? 'bg-white' : 'bg-slate-400'}`} />
              <span>{language === 'zh' ? capsule.labelZh : capsule.labelEn}</span>
              <span className={`px-1 rounded text-[10px] ${activeStageFilter === index ? 'bg-white/20' : 'bg-slate-100'}`}>
                {capsule.count}
              </span>
            </button>
          ))}
        </div>

        <div className="flex-1 flex overflow-hidden">
          
          {/* LEFT 60%: 1,247 ENTERPRISES LISTS GRID (Width 60%) */}
          <div className="w-[62%] border-r border-[#E2E7EF] bg-white flex flex-col shrink-0 overflow-hidden">
            
            {/* SEARCH AND FILTERS MINI RAIL */}
            <div className="p-4 border-b border-[#E2E7EF] bg-slate-50/30 flex gap-4 shrink-0 select-none">
              <div className="relative flex-1">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A8B2C0]" />
                <input 
                  type="text" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={tLabel("Search 1,247 registered energy providers...", "输入检索 1,247家并册石油、天然气、煤炭、电网等治理主体...")}
                  className="w-full bg-white border border-[#E2E7EF] rounded pl-9 pr-4 h-9 text-[11.5px] font-sans placeholder:text-slate-400 focus:outline-none focus:border-[#2D6CDF]"
                />
              </div>
              <button className="h-9 px-4 border border-[#E2E7EF] text-[11px] font-bold text-slate-700 rounded flex items-center gap-1.5 hover:bg-slate-50">
                <Filter size={12} />
                <span>{tLabel('Filters', '高级筛选')}</span>
              </button>
            </div>

            {/* MAIN ENTERPRISES SCROLLING LIST GRID */}
            <div className="flex-1 overflow-y-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-[#E2E7EF] h-9 text-[9px] font-black uppercase text-[#6A7686] tracking-wider font-mono">
                    <th className="px-5 w-12 text-center">{tLabel('Rank', '名次')}</th>
                    <th className="px-3">{tLabel('Enterprise Detail', '被核主体与工艺分类细节')}</th>
                    <th className="px-3 text-center">{tLabel('Composite Score', '合规综合智评')}</th>
                    <th className="px-3 text-center">{tLabel('Trend Delta', '近季偏差趋势')}</th>
                    <th className="px-4 text-center">{tLabel('Regulatory Flag', '风控黄牌警示')}</th>
                    <th className="px-5 text-right">{tLabel('Investigation Level', '当前核案实勘标签')}</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEnterprises.map((ent, idx) => {
                    const isSelected = ent.id === selectedEntId;
                    const isRed = ent.status === 'RED';
                    const isAmber = ent.status === 'AMBER';
                    
                    return (
                      <tr 
                        key={ent.id}
                        onClick={() => setSelectedEntId(ent.id)}
                        className={`border-b border-slate-100 h-14 hover:bg-[#FAFBFD] cursor-pointer transition-all uppercase text-[11.5px] ${
                          isSelected ? 'bg-[#2D6CDF]/5' : ''
                        }`}
                      >
                        <td className="px-5 text-center font-bold font-mono text-slate-400">{ent.rank}</td>
                        <td className="px-3">
                          <div className="font-extrabold text-[#0F1722] leading-tight font-sans text-[12px]">{getTranslatedEntName(ent.name)}</div>
                          <div className="text-[9px] text-slate-400 font-mono mt-0.5">{ent.id} · {getTranslatedCategory(ent.category)}</div>
                        </td>
                        <td className="px-12 text-center font-black font-mono">
                          <span className={isRed ? 'text-[#D8454C]' : isAmber ? 'text-[#E89518]' : 'text-[#2FA862]'}>
                            {ent.composite}{tLabel(' pts', '分')}
                          </span>
                        </td>
                        <td className="px-3 text-center font-bold font-mono">
                          <span className={ent.delta < 0 ? 'text-[#D8454C]' : 'text-[#2FA862]'}>
                            {ent.delta > 0 ? `+${ent.delta}` : ent.delta}%
                          </span>
                        </td>
                        <td className="px-4 text-center">
                          <span className={`px-2 py-0.5 rounded-[2px] font-mono text-[8.5px] font-black uppercase border ${
                            isRed ? 'bg-red-50 text-red-600 border-red-200' :
                            isAmber ? 'bg-amber-50 text-amber-600 border-amber-200' : 'bg-green-50 text-green-600 border-green-200'
                          }`}>
                            {ent.status} {tLabel('FLAG', '警告')}
                          </span>
                        </td>
                        <td className="px-5 text-right font-mono font-bold text-slate-600 text-[10px]">
                          {tLabel(ent.badge, ent.badge === 'UNDER INVESTIGATION' ? '立案缉查中' : ent.badge === 'OVERDUE REPORTING' ? '瞒报催報中' : ent.badge === 'METALLURGY AUDIT' ? '煤冶异动核查' : ent.badge === 'DUE DILIGENCE ACTIVE' ? '正在尽调' : ent.badge === 'COMPLIANCE AUDIT' ? '常规性检查' : ent.badge === 'STABLE SEGMENT' ? '良性运行' : ent.badge === 'EXCELLENT DISPATCH' ? '模范单位' : ent.badge === 'TOP INHERENT' ? '优秀资质' : ent.badge === 'STABLE RUNNING' ? '运行平稳' : '名义正常')}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* AI AUTO DETECT DUNNING BOX (Bottom list) */}
            <div className="border-t border-[#E2E7EF] bg-slate-50/50 p-4 shrink-0 flex flex-col gap-3 select-none">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black uppercase text-[#6A7686] flex items-center gap-1">
                  <Sparkles size={12} className="text-[#2D6CDF]" />
                  {tLabel('AI AUTOMATED REAL-TIME DUNNING CHASE RECORDER', '边缘智算治理决策引擎 · 异常自律预警催報模块')}
                </span>
                <span className="text-[10px] font-mono font-bold text-[#2D6CDF]">
                  {tLabel('8 active chase queues', '当前有8条追缴催催警队列')}
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white border rounded p-3 text-[11px] hover:border-[#2D6CDF]/30 transition-colors">
                  <div className="flex justify-between items-start">
                    <strong className="text-slate-800">WESTERN CASPIAN (ENT-0091)</strong>
                    <span className="bg-red-100 text-red-700 text-[8px] font-bold px-1 rounded uppercase">
                      {tLabel('CRITICAL', '极危')}
                    </span>
                  </div>
                  <p className="text-slate-500 text-[10px] mt-1">
                    {tLabel(
                      'LPG bypass anomalies matching pattern index 0.79. Pre-emptive inspection advise issued.',
                      'SCADA系统夜间瞒产疑似波形相似度0.79，已自动呼唤外勤发出前置干预。'
                    )}
                  </p>
                  <div className="mt-2 text-right">
                    <button onClick={() => navigate('/audit/event/CASE-2026-001')} className="text-[#2D6CDF] hover:underline font-bold text-[9.5px]">
                      {tLabel('Open Case Matrix →', '查看全案审计蛛网图 →')}
                    </button>
                  </div>
                </div>

                <div className="bg-white border rounded p-3 text-[11px] hover:border-[#2D6CDF]/30 transition-colors">
                  <div className="flex justify-between items-start">
                    <strong className="text-slate-800">ATYRAU REFINERY (ENT-0238)</strong>
                    <span className="bg-amber-100 text-amber-700 text-[8px] font-bold px-1 rounded uppercase">
                      {tLabel('OVERDUE', '滞回')}
                    </span>
                  </div>
                  <p className="text-slate-500 text-[10px] mt-1">
                    {tLabel(
                      'Gasoline fuel logistical logs are overdue by consecutive 48H. System ping sent and acknowledged.',
                      '该精炼厂成品油多源物流单证已超时48H未对齐，系统已智脑弹窗呼唤催报'
                    )}
                  </p>
                  <div className="mt-2 text-right">
                    <button className="text-[#2D6CDF] hover:underline font-bold text-[9.5px]">
                      {tLabel('Dispatched Secure Telemetry ↺', '再次强稳检测中 ↺')}
                    </button>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT 38%: CORE INDIVIDUAL PERFORMANCE PROFILE & RADAR (Width 38%) */}
          <div className="flex-1 bg-slate-50/60 p-5 flex flex-col justify-between overflow-y-auto select-none font-sans">
            <div className="space-y-5">
              
              {/* CURRENT SELECTED HEADER CARD */}
              <div className="bg-white p-4 rounded border border-[#E2E7EF] shadow-sm">
                <span className="text-[9px] font-black uppercase text-slate-400 font-mono">
                  {tLabel('SELECTED PROFILE', '已选涉案核查大表对象')}
                </span>
                <h3 className="text-[15px] font-black text-[#0F1722] mt-0.5">
                  {getTranslatedEntName(selectedEnt.name)}
                </h3>
                <div className="flex justify-between items-center text-[10.5px] mt-2 font-mono text-slate-500">
                  <span>{tLabel('ID:', '主体代码:')} <strong>{selectedEnt.id}</strong></span>
                  <span>{tLabel('Composite Health:', '系统核算合规智评:')} <strong className={selectedEnt.status === 'RED' ? 'text-red-600' : 'text-amber-500'}>{selectedEnt.composite} {tLabel('pts', '分')}</strong></span>
                </div>
              </div>

              {/* 5-AXIS RADAR CHART (Interactive SVG) */}
              <div className="bg-white p-5 rounded border border-[#E2E7EF] shadow-sm flex flex-col items-center select-none">
                <span className="text-[10px] uppercase text-[#6A7686] font-bold self-start mb-3">{tLabel('5-AXIS AUDIT RADAR CHART', '横向下钻 · 五维治理核对合规偏离雷达图')}</span>
                
                <div className="relative w-[210px] h-[210px]">
                  <svg width="200" height="200" className="overflow-visible">
                    {/* Ring guidelines */}
                    <circle cx="100" cy="100" r="75" fill="none" stroke="#E2E8F0" strokeWidth="1" />
                    <circle cx="100" cy="100" r="50" fill="none" stroke="#E2E8F0" strokeWidth="1" strokeDasharray="3 3" />
                    <circle cx="100" cy="100" r="25" fill="none" stroke="#E2E8F0" strokeWidth="1" strokeDasharray="3 3" />
                    
                    {/* Axis Spoke lines */}
                    {radarPoints.map((p, i) => {
                      const rad = ((i * 72) - 90) * (Math.PI / 180);
                      const ax = 100 + 75 * Math.cos(rad);
                      const ay = 100 + 75 * Math.sin(rad);
                      return <line key={i} x1="100" y1="100" x2={ax} y2={ay} stroke="#E2E8F0" strokeWidth="1" />;
                    })}

                    {/* Polygon path representation */}
                    <polygon points={radarPath} fill="#2D6CDF" fillOpacity="0.15" stroke="#2D6CDF" strokeWidth="2" />

                    {/* Red marker points */}
                    {radarPoints.map((p, i) => (
                      <circle key={i} cx={p.x} cy={p.y} r="4.5" fill={selectedEnt.status === 'RED' ? '#D8454C' : '#E89518'} stroke="white" strokeWidth="1.5" />
                    ))}

                    {/* Metric labels */}
                    {radarPoints.map((p, i) => {
                      const rad = ((i * 72) - 90) * (Math.PI / 180);
                      const lx = 100 + 88 * Math.cos(rad);
                      const ly = 100 + 82 * Math.sin(rad);
                      
                      let labelVal = '';
                      if (p.label === 'completeness') labelVal = tLabel('COMPLETENESS', '申报完整度');
                      if (p.label === 'timeliness') labelVal = tLabel('TIMELINESS', '流程时效性');
                      if (p.label === 'consistency') labelVal = tLabel('CONSISTENCY', '口径一致性');
                      if (p.label === 'hi') labelVal = tLabel('AUTOMATION', '智算非干预');
                      if (p.label === 'sanctions') labelVal = tLabel('LAW HISTORY', '无前科记录');

                      return (
                        <text 
                          key={i} 
                          x={lx} 
                          y={ly} 
                          className="text-[8px] font-mono font-bold text-slate-500 uppercase fill-current" 
                          textAnchor="middle"
                        >
                          {labelVal} ({p.score}%)
                        </text>
                      );
                    })}
                  </svg>
                </div>
              </div>

              {/* INDIVIDUAL PERFORMANCE STAGE PROGRESS TRACKING */}
              <div className="bg-white p-4 rounded border border-[#E2E7EF] shadow-sm space-y-3">
                <span className="text-[10px] uppercase text-[#6A7686] font-bold block">
                  {tLabel('INDIVIDUAL RECTIFICATION STAGE TRACKING', '纵向追踪 · 合规纠错八大阶段督办通告纪律录')}
                </span>
                
                <div className="space-y-2">
                  {[
                    { label: tLabel('A1. System Registered Trigger', 'A1. 系统遥测异动捕获挂接'), status: tLabel('✓ PASSED', '✓ 已通过'), time: '2026-05-24' },
                    { label: tLabel('A2. Multi-Agent Fusion Match', 'A2. 跨口径联合消偏指纹比对'), status: tLabel('✓ PASSED', '✓ 已通过'), time: '2026-05-25' },
                    { label: tLabel('A3. Anomaly Warning Issued', 'A3. 合规黄挂旗督察告知送达'), status: tLabel('✓ PASSED', '✓ 已通过'), time: '2026-05-26' },
                    { label: tLabel('A4. Field Compliance Intervention Dispatch', 'A4. 特遣监察大队现场核试派遣'), status: selectedEnt.status === 'RED' ? tLabel('▲ DISPATCHED', '▲ 特遣已派遣') : tLabel('✓ COMPLETED', '✓ 协同已完毕'), time: '2026-05-27' },
                    { label: tLabel('A5. Entity Self-Audit Validation', 'A5. 被责令企业主动核备并自整'), status: selectedEnt.status === 'RED' ? tLabel('☐ IN PROCESS', '☐ 立案自纠中') : tLabel('✓ PASSED', '✓ 复自核通过'), time: tLabel('Pending', '待处理') },
                    { label: tLabel('A6. Posture Rectification Assessment', 'A6. 八大环节大闭环绩效考核'), status: tLabel('☐ INACTIVE', '☐ 待激活'), time: tLabel('Pending', '待处理') },
                  ].map((stg, i) => {
                    const pass = stg.status.includes('PASSED') || stg.status.includes('COMPLETED') || stg.status.includes('通过') || stg.status.includes('完毕');
                    const act = stg.status.includes('DISPATCHED') || stg.status.includes('PROCESS') || stg.status.includes('派遣') || stg.status.includes('自纠');
                    
                    return (
                      <div key={i} className="flex justify-between items-center text-[10.5px] border-b border-slate-50 pb-1.5 last:border-0 last:pb-0">
                        <span className="font-medium text-slate-700">{stg.label}</span>
                        <div className="text-right font-mono">
                          <span className={`text-[9px] font-bold ${
                            pass ? 'text-green-600' : act ? 'text-[#D8454C] animate-pulse' : 'text-slate-400'
                          }`}>{stg.status}</span>
                          <span className="text-[8.5px] text-slate-400 block">{stg.time}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* AI DECISION SUGGESTIONS FOR THE CHOSEN COMPANY */}
            <div className="bg-[#0F1722] text-white p-4 rounded text-[11px] leading-snug mt-4">
              <strong className="text-amber-400 flex items-center gap-1">
                <Sparkles size={11} />
                {tLabel('AI AUTOMATED DUNNING RECOMMENDATIONS', '智催督导案卷研判定论：')}
              </strong>
              <p className="text-white/85 text-[10px] mt-1.5 leading-relaxed">
                {selectedEnt.status === 'RED'
                  ? tLabel(
                      'RECOMMENDED SLA DISPATCH TIME-LIMIT IS 36H. System has identified a P=0.79 similarity with prior 2022 Caspian overpressure templates. Direct coordination with Mangystau prosecutors recommended to avoid 1.24 BN KZT liability.',
                      '建议派任外勤特遣组于36小时黄金时效窗口内对其实事实勘。系统辨识出该企业物理侧瞒产特征与247异常指纹库2022年里海某超压涉案包高度相似。推荐提请属地检察机关协同强制核对，降低国家分成折合12.4亿坚戈的流失风险。'
                    )
                  : tLabel(
                      'Compliance metrics are stable. No urgent field maneuvers required. Continue 15-min rolling SCADA telemetry passive tracking.',
                      '当前各项合规实物指标皆大体平稳存续，处于安全工况包络。无需启动任何物理特遣外勤指令。维持常态化每15分钟高频SCADA物联网物理测点被动流监察即可。'
                    )
                }
              </p>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
