import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeft, BrainCircuit, Activity, ShieldAlert, AlertTriangle, CheckCircle2, 
  MapPin, TrendingUp, Info, ChevronRight, MessageSquare, Newspaper, 
  Search, Users, Sparkles, Filter, Database, BarChart3
} from 'lucide-react';
import { useLanguage } from '../components/LanguageContext';
import { MapContainer, TileLayer, Marker, GeoJSON } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface Topic {
  id: string;
  title: string;
  titleZh: string;
  type: string;
  sentiment: string;
  volume: string;
  sources: string;
  coords: { x: number; y: number };
  geoCoords: [number, number];
  regionName: string;
  regionNameZh: string;
  details: string;
  detailsZh: string;
  growth: string;
  alertLevel: string;
  similarity: number;
  imageUrl: string;
  tag: string;
  tagZh: string;
}

const TOPICS: Topic[] = [
  { id: 'ENG-001',
    title: 'LPG PRICE SURGE WEEKLY +28% — DRIVER PROTEST RISK',
    titleZh: 'LPG液化气零售价格周激增+28% — 局部卡车司机罢工风险越限',
    type: 'ENERGY PRICE',
    sentiment: 'NEGATIVE',
    volume: '680K+',
    sources: 'TikTok + Telegram',
    coords: { x: 120, y: 190 },
    geoCoords: [43.6481, 51.1714],
    regionName: 'Aktau / Mangystau',
    regionNameZh: '阿克套 / 曼吉斯套省',
    details: 'Urgent reports on social media show high dissatisfaction regarding LPG gas station pricing in western regions. Sentiment analysis indicators show driver strikes are highly probable.',
    detailsZh: '社交媒体和本地频道大量聚集对西部地区加气站LPG零售价格波动的强烈不满。语意和情绪量化特征表明，司机罢工及交通阻塞的演化概率极高。',
    growth: '+124% today',
    alertLevel: 'CRITICAL',
    similarity: 0.79,
    imageUrl: 'https://images.unsplash.com/photo-1542060748-10c28b629f6f?auto=format&fit=crop&q=80&w=150',
    tag: '#ENERGY_PRICE',
    tagZh: '#液化气涨价'
  },
  { id: 'ENG-002',
    title: 'EKIBASTUZ MINE METHANE INCIDENT',
    titleZh: '埃基巴斯图兹矿区瓦斯浓度安全异动超警戒',
    type: 'ENERGY SAFETY',
    sentiment: 'NEGATIVE',
    volume: '410K+',
    sources: 'Facebook + X',
    coords: { x: 580, y: 70 },
    geoCoords: [51.7248, 75.3228],
    regionName: 'Pavlodar / Ekibastuz',
    regionNameZh: '巴夫洛达尔 / 埃基巴斯图兹',
    details: 'Mine-mouth ventilation anomaly caused gaseous accumulation rumors. Safety compliance inspection requested by regional committees.',
    detailsZh: '井口通风系统出现短时故障，引发局部瓦斯堆积谣言扩散。地区监察委员会已指令特遣队伍前往进行实地物联核查。',
    growth: '+42% today',
    alertLevel: 'WARNING',
    similarity: 0.61,
    imageUrl: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&q=80&w=150',
    tag: '#ENERGY_SAFETY',
    tagZh: '#安全生产越限'
  },
  { id: 'ENG-003',
    title: 'KARAGANDA HEATING PIPE BURST DAY 3 — 8000 HOUSEHOLDS',
    titleZh: '卡拉干达民生供热管网连断3日 — 影响8000辖区住户',
    type: 'LIVELIHOOD',
    sentiment: 'NEGATIVE',
    volume: '510K+',
    sources: 'VK + Telegram',
    coords: { x: 490, y: 160 },
    geoCoords: [49.8019, 73.1021],
    regionName: 'Karaganda',
    regionNameZh: '卡拉干达',
    details: 'Sub-zero temperatures have impacted pipeline distribution integrity. 8,000 households are temporarily on auxiliary thermal loops. Heated online discussions on local forums.',
    detailsZh: '极寒暴雪天气导致次级输热网线部分焊口断裂。已有8,000户辖区居民临时被切流至备用低压循环热回路。本地论坛和社群内产生次生民生哀怨情绪。',
    growth: '+85% today',
    alertLevel: 'CRITICAL',
    similarity: 0.85,
    imageUrl: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=150',
    tag: '#LIVELIHOOD',
    tagZh: '#民生底线告警'
  },
  { id: 'ENG-004',
    title: '2026 ENERGY EXPORT CAP REVIEW',
    titleZh: '2026年度国家能源出口配额审查政策探讨',
    type: 'POLICY',
    sentiment: 'NEUTRAL',
    volume: '230K+',
    sources: 'X + Instagram',
    coords: { x: 440, y: 80 },
    geoCoords: [51.1694, 71.4491],
    regionName: 'Astana',
    regionNameZh: '阿斯塔纳 (首都)',
    details: 'Expert debates about shifting national production caps of natural gas and petrochemical products to prioritize domestic resilience over China exports.',
    detailsZh: '关于调减天然气及石化原材料出口配额、转而优先保障国内各州工业能耗及冬季供暖自足率的专家智库政策案卷引发热议。',
    growth: '+8% today',
    alertLevel: 'NOMINAL',
    similarity: 0.32,
    imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=150',
    tag: '#POLICY',
    tagZh: '#宏观政策中枢'
  },
  { id: 'ENG-005',
    title: 'CASPIAN PIPELINE TO CHINA — RENEGOTIATION RUMOR',
    titleZh: '中哈跨境天然气联网定价谈判不实传言厘清',
    type: 'GEOPOLITICS',
    sentiment: 'NEUTRAL',
    volume: '180K+',
    sources: 'Telegram',
    coords: { x: 200, y: 220 },
    geoCoords: [47.0945, 51.9197],
    regionName: 'Caspian / Atyrau',
    regionNameZh: '中哈边境 / 阿克纠宾',
    details: 'Rumors of revisions in volume pricing for gas flowing through Sino-Kazakhstan interconnections. Ministry of Energy issuing official denials.',
    detailsZh: '网传中哈天然气跨境大动脉传输口径计费和返点提价机制即将修改。能源部已发布官方说明，澄清价格仍在原定主协议框架内平顺履约。',
    growth: '+14% today',
    alertLevel: 'NOMINAL',
    similarity: 0.44,
    imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=150',
    tag: '#GEOPOLITICS',
    tagZh: '#地缘能源关系'
  },
  { id: 'ENG-006',
    title: 'GASOLINE AI-95 +12% MONTH — TAXI DRIVER STRIKE THREAT',
    titleZh: '高标号AI-95汽油单月上涨12% — 出租车同盟酝酿非法抗议',
    type: 'PRICE',
    sentiment: 'NEGATIVE',
    volume: '750K+',
    sources: 'TikTok',
    coords: { x: 550, y: 240 },
    geoCoords: [43.2389, 76.8897],
    regionName: 'Almaty',
    regionNameZh: '阿拉木图大区',
    details: 'Fuel retailers report localized logistical shortages for premium AI-95 fuel. Multi-platform taxi aggregators show organized online petitions.',
    detailsZh: '主要加油中继站报告AI-95高标号汽油到货延宕。网约车平台及城级出租车同盟出现多源串联联署，呼吁调低非税燃油价格。',
    growth: '+198% today',
    alertLevel: 'CRITICAL',
    similarity: 0.82,
    imageUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=150',
    tag: '#PRICE_ANOMALY',
    tagZh: '#燃油油溢价异常'
  },
  { id: 'ENG-007',
    title: 'BUKHTARMA HYDRO TURBINE TENDER CORRUPTION CLAIM',
    titleZh: '布赫塔尔玛水电站零备件招投标虚假违规举报调查',
    type: 'TECH',
    sentiment: 'NEGATIVE',
    volume: '95K+',
    sources: 'Facebook',
    coords: { x: 680, y: 150 },
    geoCoords: [49.9482, 82.6122],
    regionName: 'Ust-Kamenogorsk',
    regionNameZh: '东哈萨克斯坦 / 乌斯季卡缅诺戈尔斯克',
    details: 'Blogger posts surrounding the allocation of sub-grid spare part tenders for regional hydroelectric turbine maintenance. Under review.',
    detailsZh: '本地部分博客博主针对布赫塔尔玛水电站新轮水轮机机壳及轴承修复零配件招标合规性提出质疑。能监办已启动日常程序案卷核审。',
    growth: '+5% today',
    alertLevel: 'NOMINAL',
    similarity: 0.18,
    imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=150',
    tag: '#INFRASTRUCTURE',
    tagZh: '#电力骨干网巡检'
  },
  { id: 'ENG-008',
    title: 'KASHAGAN GAS FLARING EMISSION VIDEO VIRAL',
    titleZh: '卡沙甘特大海底油田黑烟火炬目击视频病毒式传播',
    type: 'ENVIRONMENT',
    sentiment: 'NEGATIVE',
    volume: '320K+',
    sources: 'Instagram + X',
    coords: { x: 140, y: 130 },
    geoCoords: [46.8000, 51.5000],
    regionName: 'Atyrau / Kashagan',
    regionNameZh: '阿特劳 / 卡沙甘海上油田',
    details: 'Viral drone footage of high flaring chimneys posted by local eco-activists. Environmental protection agency initiating physical emissions telemetry cross-check.',
    detailsZh: '环保组织流出无人机远摄喀沙甘深海集输站排放超量燃烧废气的火光影像。环保组与核物理检测局已启动现场及SCADA烟道数据交叉校核。',
    growth: '+56% today',
    alertLevel: 'WARNING',
    similarity: 0.53,
    imageUrl: 'https://images.unsplash.com/photo-1626244795369-0bd7eeb1786f?auto=format&fit=crop&q=80&w=150',
    tag: '#ENVIRONMENTAL_LIMIT',
    tagZh: '#环保排碳越红线'
  }
];

export default function SentimentConsole() {
  const { language } = useLanguage();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'global' | 'detail'>('global');
  const [selectedTopicId, setSelectedTopicId] = useState<string>('ENG-001');
  const [filterType, setFilterType] = useState<string>('ALL');
  const [geoData, setGeoData] = useState<any>(null);

  useEffect(() => {
    fetch('https://raw.githubusercontent.com/johan/world.geo.json/master/countries/KAZ.geo.json')
      .then(res => res.json())
      .then(data => setGeoData(data))
      .catch(err => console.error("边界加载异常: ", err));
  }, []);

  const tLabel = (en: string, zh: string) => {
    return language === 'zh' ? zh : en;
  };

  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#detail/')) {
        const id = hash.replace('#detail/', '');
        setSelectedTopicId(id);
        setActiveTab('detail');
      } else {
        setActiveTab('global');
      }
    };
    window.addEventListener('hashchange', handleHash);
    handleHash();
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const handleSelectTopic = (id: string) => {
    setSelectedTopicId(id);
    setActiveTab('detail');
    window.location.hash = `detail/${id}`;
  };

  const handleBackToGlobal = () => {
    setActiveTab('global');
    window.location.hash = 'global';
  };

  const filteredTopics = useMemo(() => {
    if (filterType === 'ALL') return TOPICS;
    if (filterType === 'CRITICAL') return TOPICS.filter(t => t.alertLevel === 'CRITICAL');
    return TOPICS.filter(t => t.type === filterType);
  }, [filterType]);

  const activeTopic = TOPICS.find(t => t.id === selectedTopicId) || TOPICS[0];

  return (
    <div className="flex-1 flex bg-[#F4F6FA] text-[#1A2330] font-sans overflow-hidden h-[calc(100vh-56px)]">
      
      {/* LEFT NAVIGATION COLUMN (PRE/DURING/POST STAGES) */}
      <div className="w-64 border-r border-[#E2E7EF] bg-white flex flex-col shrink-0 select-none">
        <div className="p-4 border-b border-[#E2E7EF] bg-slate-50/50">
          <span className="text-[10px] font-black uppercase text-[#6A7686] font-mono block">
            {tLabel('MONITORING CONTEXT', '决策与舆情研判上下文')}
          </span>
          <h3 className="text-[12.5px] font-black text-[#0F1722] uppercase mt-1">
            {tLabel('LIVELIHOOD PRESERVATION', '国家能源与民生平隐底线')}
          </h3>
        </div>
        
        {/* Stages list */}
        <div className="flex-1 p-3 space-y-4 overflow-y-auto">
          <div>
            <span className="text-[9px] font-black uppercase text-[#A8B2C0] font-mono px-2 block mb-1">
              {tLabel('STAGE 1: PRE-EVENT', '第一幕前：事前常态感知')}
            </span>
            <div className="space-y-0.5">
              <button 
                onClick={handleBackToGlobal}
                className={`w-full text-left px-3 py-2 rounded text-[11.5px] font-bold flex items-center justify-between ${
                  activeTab === 'global' ? 'bg-[#2D6CDF]/10 text-[#2D6CDF]' : 'text-[#6A7686] hover:bg-slate-50'
                }`}
              >
                <span className="flex items-center gap-2">
                  <Activity size={13} />
                  <span>{tLabel('Global Sentiment Map', '全球舆情热力分布图')}</span>
                </span>
                <span className="text-[9px] bg-red-100 text-red-600 px-1 rounded font-black">4 {tLabel('CRIT', '极危')}</span>
              </button>
            </div>
          </div>

          <div>
            <span className="text-[9px] font-black uppercase text-[#A8B2C0] font-mono px-2 block mb-1">
              {tLabel('STAGE 2: DURING-EVENT', '第二幕事：事中联动处置')}
            </span>
            <div className="space-y-0.5">
              <div className="px-3 py-2 border-l-2 border-[#D8454C] bg-red-50/40 text-[#D8454C] text-[11.5px] font-bold flex flex-col gap-1 rounded">
                <span className="flex items-center gap-1.5 font-black">
                  <ShieldAlert size={13} />
                  <span>{tLabel('ANO-2026 ACTIVE', '案号 ANO-2026 已呈提')}</span>
                </span>
                <span className="text-[9.5px] text-red-600/80 font-mono font-medium">
                  {tLabel('Aktau Compressor Anomalies', '阿克套物理站异动督运')}
                </span>
              </div>
            </div>
          </div>

          <div>
            <span className="text-[9px] font-black uppercase text-[#A8B2C0] font-mono px-2 block mb-1">
              {tLabel('STAGE 3: POST-EVENT', '第三幕后：事后穿透阻击')}
            </span>
            <div className="space-y-0.5 opacity-60">
              <div className="px-3 py-1.5 text-[#6A7686] text-[11.5px] font-medium italic">
                {tLabel('No active events in Stage 3.', '第三阶段当前无未决事件')}
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM METADATA INDEX */}
        <div className="p-4 border-t border-[#E2E7EF] bg-slate-50/50 space-y-2">
          <div className="flex justify-between items-center text-[10px] text-[#6A7686]">
            <span>{tLabel('SYSTEM POWER', '智能决策中枢算力')}</span>
            <span className="font-mono font-bold text-green-600">● {tLabel('NOMINAL', '正常物理负荷')}</span>
          </div>
          <div className="flex justify-between items-center text-[10px] text-[#6A7686]">
            <span>{tLabel('LIVELIHOOD LIMITS', '地方民生预警触网')}</span>
            <span className="font-mono font-bold text-red-600">▲ {tLabel('4 BREACHED', '4起触发警告')}</span>
          </div>
        </div>
      </div>

      {/* RIGHT WORKSPACE PANELS */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* COMPLIANCE ALERT TOP STRIP */}
        <div className="h-[52px] border-b border-[#E2E7EF] bg-white flex items-center justify-between px-6 shrink-0 z-10">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate('/minister/dashboard')}
              className="flex items-center gap-1 text-[11px] font-bold text-[#6A7686] hover:text-[#0F1722] pr-3 border-r border-[#E2E7EF]"
            >
              <ArrowLeft size={13} />
              <span>{tLabel('Back', '返回部长大屏')}</span>
            </button>
            <span className="text-[11px] font-black text-[#D8454C] uppercase tracking-wider bg-red-50 border border-red-200 px-2.5 py-0.5 rounded flex items-center gap-1.5 animate-pulse">
              <ShieldAlert size={12} className="text-[#D8454C]" />
              {tLabel('LINKED TO NATIONAL DASHBOARD · 4 ENERGY TOPICS BREACH LIVELIHOOD RED LINE', '联动国家能源大屏：4项核心能源话题已突破民生风险防范红线')}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-[#6A7686]">Engine Version: TimeGPT-S V2.3</span>
          </div>
        </div>

        {activeTab === 'global' ? (
          <div className="flex-1 flex overflow-hidden">
            {/* CENTRAL MAP & LIST CONTAINER */}
            <div className="flex-1 flex flex-col p-6 overflow-y-auto justify-between h-full">
              
              {/* TOP MAP CONTAINER */}
              <div className="bg-white rounded border border-[#E2E7EF] p-5 shadow-sm flex flex-col relative flex-1 min-h-[460px]">
                <div className="flex justify-between items-start mb-4 select-none">
                  <div>
                    <h2 className="text-[14.5px] font-black text-[#0F1722]">{tLabel('GLOBAL OPINION GEOLOCATION MATRIX', '全疆域能源舆情监控及民生传导拓扑图')}</h2>
                    <p className="text-[11px] text-[#6A7686] mt-0.5">{tLabel('Real-time tracking of 8 major public energy security topics in Kazakhstan.', '系统分钟级追踪全哈萨克斯坦8个重大公共与能源话题地缘分发及演化趋势')}</p>
                  </div>
                  
                  {/* Filter switches */}
                  <div className="flex gap-1.5 text-[10px] bg-slate-100 p-0.5 border rounded">
                    {['ALL', 'CRITICAL', 'ENERGY PRICE', 'ENERGY SAFETY', 'POLICY'].map(tp => (
                      <button 
                        key={tp}
                        onClick={() => setFilterType(tp)}
                        className={`px-2 py-0.5 font-bold rounded uppercase ${filterType === tp ? 'bg-white text-[#2D6CDF] shadow' : 'text-[#6A7686]'}`}
                      >
                        {tp}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Real high-fidelity Leaflet map card */}
                <div className="flex-1 bg-slate-50 border border-[#E2E7EF] rounded relative overflow-hidden min-h-[460px] h-[580px]" style={{ height: '580px' }}>
                  <style>{`
                    .custom-div-icon {
                      background: none !important;
                      border: none !important;
                    }
                    .leaflet-container {
                      background-color: #f8fafc !important;
                    }
                    .leaflet-pane {
                      z-index: 1 !important;
                    }
                    .leaflet-top, .leaflet-bottom {
                      z-index: 2 !important;
                    }
                  `}</style>

                  <MapContainer 
                    center={[48.0196, 66.9237]} 
                    zoom={5} 
                    style={{ height: '100%', width: '100%', position: 'absolute', inset: 0 }}
                    zoomControl={false}
                    attributionControl={false}
                  >
                    <TileLayer url="https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png" />

                    {geoData && (
                      <GeoJSON 
                        data={geoData} 
                        style={{
                          color: '#000000',
                          weight: 0.8,
                          fillColor: '#f1f5f9',
                          fillOpacity: 0.2
                        }}
                      />
                    )}

                    {filteredTopics.map((topic) => {
                      const isCrit = topic.alertLevel === 'CRITICAL';
                      const isWarn = topic.alertLevel === 'WARNING';
                      const isSelected = topic.id === selectedTopicId;
                      const titleText = language === 'zh' ? topic.titleZh : topic.title;
                      const tagText = language === 'zh' ? topic.tagZh : topic.tag;
                      
                      const markerHtml = `
                        <div class="flex items-stretch bg-white border ${isSelected ? 'border-2 border-[#D8454C] ring-2 ring-red-500/20 shadow-md' : 'border-[#1A2330]'} w-[240px] h-[60px] overflow-hidden pointer-events-auto transition-all rounded-none shadow-sm hover:shadow-md hover:scale-[1.03] transform duration-150">
                          <div class="w-[60px] shrink-0 border-r border-[#1A2330] overflow-hidden bg-slate-50 flex items-center justify-center">
                            <img src="${topic.imageUrl}" class="w-full h-full object-cover grayscale ${isSelected ? 'grayscale-0' : 'hover:grayscale-0'} transition-all duration-500" />
                          </div>
                          <div class="flex-1 p-1.5 flex flex-col justify-between min-w-0 bg-white">
                            <div class="text-[9.5px] font-black text-[#0F1722] leading-[1.2] line-clamp-2 uppercase tracking-tight font-sans">
                              ${titleText}
                            </div>
                            <div class="flex justify-between items-center mt-0.5">
                              <span class="text-[7.5px] font-mono text-[#6A7686] font-bold uppercase truncate max-w-[110px]">
                                ${tagText}
                              </span>
                              <span class="text-[8px] px-1 font-mono font-black ${
                                isCrit ? 'bg-red-100 text-[#D8454C]' : isWarn ? 'bg-amber-100 text-[#E89518]' : 'bg-green-100 text-[#2FA862]'
                              } rounded-[2px] leading-none py-0.5">
                                ${topic.id}
                              </span>
                            </div>
                          </div>
                        </div>
                      `;

                      return (
                        <Marker
                          key={`${topic.id}-${language}-${isSelected}`}
                          position={topic.geoCoords}
                          eventHandlers={{
                            click: () => handleSelectTopic(topic.id)
                          }}
                          icon={L.divIcon({
                            className: 'custom-div-icon',
                            html: markerHtml,
                            iconSize: [240, 60],
                            iconAnchor: [120, 30]
                          })}
                        />
                      );
                    })}
                  </MapContainer>

                  {/* Absolute positioning overlays rendered cleanly above Leaflet z-indexed pane */}
                  <div className="absolute bottom-3 left-3 bg-white/90 border border-slate-200 p-2.5 rounded text-[10px] space-y-1 shadow font-mono pointer-events-none z-[1000]">
                    <div className="flex items-center gap-1.5 font-bold text-slate-800">
                      <span className="w-2.5 h-2.5 bg-[#D8454C] rounded-full border border-white" />
                      <span>{tLabel('Critical Livelihood Breach', '突破地方民生稳定安全红线')}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 bg-[#E89518] rounded-full border border-white" />
                      <span>{tLabel('Security & Safety Anomaly', '国家安全及生产运行严重越限')}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 bg-[#2FA862] rounded-full border border-white" />
                      <span>{tLabel('Nominal / Policy Discussions', '常态舆情监测与宏观政策讨论')}</span>
                    </div>
                  </div>

                  <div className="absolute top-3 right-3 bg-[#0F1722] text-white border border-white/25 p-3 rounded font-mono text-[10px] z-[1000] max-w-xs">
                    <div className="flex items-center gap-2 text-red-400 font-bold border-b border-white/10 pb-1 mb-1.5 uppercase leading-none">
                      <BrainCircuit size={12} />
                      <span>{tLabel('2022-01 Unrest Parallel Monitor', '2022年1月极度暴恐并行动作并行拟合模型')}</span>
                    </div>
                    <div>
                      {tLabel('Unrest Pattern Matching Index:', '社会学非秩序行为扩散拟合指纹：')}
                      <strong className="text-red-400 text-[11px] ml-1">{tLabel('similarity 0.79', '相似度极高 0.79')}</strong>
                    </div>
                    <div className="text-white/60 text-[9px] mt-0.5 font-sans leading-tight">
                      {tLabel(
                        'Matched against 2021-12-20 pre-unrest fuel protests footprint. Lead time estimated: T-13 days.',
                        '拟合对标自 2021-12-20 全球LPG违规抬高溢价引发的舆情扩散轨迹，预估民生危机演化提前量为 T-13 天。'
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* BOTTOM LEDGER TABLE */}
              <div className="bg-white rounded border border-[#E2E7EF] mt-4 overflow-hidden shadow-sm shrink-0 flex flex-col">
                <div className="px-4 py-2.5 border-b bg-slate-50/50 flex justify-between items-center text-[10px] font-black text-[#6A7686] uppercase">
                  <span>{tLabel('Sentiment Ledger (Showing 4 critical priority anomalies)', '民生红线舆情与实体异动对照总表 (优先展示 4起 极高危违纪关联项)')}</span>
                  <span className="font-mono text-[9px]">{tLabel('SCADA REGION SYNCED', 'SCADA 地理网物联实时对照中')}</span>
                </div>
                <table className="w-full text-left border-collapse text-[11.5px]">
                  <thead>
                    <tr className="bg-slate-50 h-8 border-b border-[#E2E7EF] text-[10px] uppercase font-bold text-slate-500 font-mono">
                      <th className="px-4">Topic ID</th>
                      <th className="px-4">Topic Headline</th>
                      <th className="px-3">Domain</th>
                      <th className="px-3">Livelihood Risk</th>
                      <th className="px-3">Media Volume / Sources</th>
                      <th className="px-4 text-right">Inquiry Link</th>
                    </tr>
                  </thead>
                  <tbody>
                    {TOPICS.slice(0, 4).map((row) => (
                      <tr 
                        key={row.id} 
                        className="h-11 border-b border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer uppercase font-mono"
                        onClick={() => handleSelectTopic(row.id)}
                      >
                        <td className="px-4 font-bold text-slate-700">{row.id}</td>
                        <td className="px-4 font-sans font-extrabold text-[#0F1722] tracking-tight truncate max-w-[280px]">
                          {language === 'zh' ? row.titleZh : row.title}
                        </td>
                        <td className="px-3 text-[10px]"><span className="bg-slate-100 px-2 py-0.5 rounded font-black text-slate-600">{row.type}</span></td>
                        <td className="px-3">
                          <span className="text-[#D8454C] font-black">
                            {row.alertLevel === 'CRITICAL' ? '💥 BREACHED' : '▲ ELEVATED'}
                          </span>
                        </td>
                        <td className="px-3 text-slate-600 font-sans">{row.volume} index · <span className="font-mono text-[10px] font-bold text-slate-500">{row.sources}</span></td>
                        <td className="px-4 text-right">
                          <span className="text-[#2D6CDF] font-bold inline-flex items-center gap-0.5 hover:underline">
                            Inspect <ChevronRight size={11} />
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* SIDEBAR ANALYSIS (堆叠柱状图 & Stats) */}
            <div className="w-80 border-l border-[#E2E7EF] bg-white p-5 flex flex-col justify-between shrink-0 overflow-y-auto font-sans">
              <div className="space-y-5">
                <div className="border-b border-slate-100 pb-3">
                  <span className="text-[10px] font-black text-[#A8B2C0] uppercase font-mono block">QUANTITATIVE INDEX</span>
                  <h3 className="text-[14.5px] font-black text-[#0F1722] uppercase tracking-wider mt-1">{tLabel('8-WEEK ENERGY TOPICS TREND', '过去8周重大能源热点热度堆叠柱图')}</h3>
                </div>

                {/* Styled Mock Stacked Bar Chart for topics over 8 weeks */}
                <div className="space-y-4 font-mono text-[9px]">
                  <div className="flex justify-between text-[#6A7686] mb-1 font-bold">
                    <span>WEEKLY DATA</span>
                    <span>PRICE ⬜  SAFETY ⬛  POLICY ▨</span>
                  </div>

                  <div className="h-44 flex items-end justify-between border-b border-[#E2E7EF] pb-1 bg-slate-50 p-2.5 rounded">
                    {[
                      { wk: 'W1', price: 20, safety: 15, policy: 10 },
                      { wk: 'W2', price: 25, safety: 12, policy: 15 },
                      { wk: 'W3', price: 30, safety: 18, policy: 15 },
                      { wk: 'W4', price: 45, safety: 20, policy: 20 },
                      { wk: 'W5', price: 50, safety: 25, policy: 18 },
                      { wk: 'W6', price: 65, safety: 35, policy: 25 },
                      { wk: 'W7', price: 80, safety: 40, policy: 30 },
                      { wk: 'W8', price: 95, safety: 55, policy: 40 }, // Spike!
                    ].map((w, i) => {
                      const totalHeight = w.price + w.safety + w.policy;
                      const pricePct = (w.price / totalHeight) * 100;
                      const safetyPct = (w.safety / totalHeight) * 100;
                      const policyPct = (w.policy / totalHeight) * 100;

                      return (
                        <div key={i} className="flex flex-col items-center flex-1 h-full justify-end group cursor-help relative px-1">
                          {/* Stacked Bars */}
                          <div className="w-4.5 rounded-[1px] flex flex-col justify-end overflow-hidden" style={{ height: `${(totalHeight / 200) * 100}%` }}>
                            <div className="bg-[#D8454C]" style={{ height: `${pricePct}%` }} title={`Price focus: ${w.price}`} />
                            <div className="bg-[#0F1722]" style={{ height: `${safetyPct}%` }} title={`Safety focus: ${w.safety}`} />
                            <div className="bg-slate-400" style={{ height: `${policyPct}%` }} title={`Policy focus: ${w.policy}`} />
                          </div>
                          <span className="text-[8px] text-slate-400 mt-1">{w.wk}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-200.5 p-3.5 rounded">
                  <span className="text-[9px] font-bold text-[#6A7686] uppercase block">PREDICTIVE STRIKE MARGIN</span>
                  <div className="font-sans text-[22px] font-black text-[#D8454C] font-mono mt-1">12% / 30D</div>
                  <p className="text-[10px] text-slate-500 mt-1 font-sans leading-tight">Current probability that localized driving/transit grievances escalate into wider inter-regional unrest.</p>
                </div>
              </div>

              <div className="bg-[#0F1722] text-white p-4 rounded text-[11px] leading-snug mt-6">
                <strong>COMPLIANCE ENGAGEMENT:</strong>
                <p className="text-white/70 text-[10px] mt-1">
                  Social unrest probabilities are linked automatically to the Regional Dispatch & Inspection system. Warnings route directly to Aktau Energy Compliance.
                </p>
              </div>
            </div>
          </div>
        ) : (
          /* HASH-LINKED DETAILED TOPIC INSPECTOR */
          <div className="flex-1 p-6 flex flex-col justify-between overflow-y-auto">
            <div className="bg-white rounded border border-[#E2E7EF] p-6 shadow-sm flex flex-col max-w-4xl mx-auto w-full">
              <div className="flex items-center justify-between border-b pb-4 mb-4">
                <button 
                  onClick={handleBackToGlobal}
                  className="flex items-center gap-1.5 text-[11.5px] font-bold text-[#2D6CDF] hover:underline uppercase font-mono"
                >
                  ← Back to opinion map
                </button>
                <div className="flex gap-2">
                  <span className="px-2 py-0.5 bg-[#0F1722] text-white text-[9px] font-mono font-bold uppercase rounded-[2px]">{activeTopic.id}</span>
                  <span className={`px-2 py-0.5 text-[9px] font-black font-mono uppercase border rounded-[2px] ${
                    activeTopic.alertLevel === 'CRITICAL' ? 'bg-red-50 text-red-600 border-red-200' : 'bg-amber-50 text-amber-600 border-amber-200'
                  }`}>{activeTopic.alertLevel}</span>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <span className="text-[10px] font-black uppercase text-[#6A7686] font-mono">
                    {activeTopic.type} / REGION: {language === 'zh' ? activeTopic.regionNameZh : activeTopic.regionName}
                  </span>
                  <h2 className="text-[20px] font-black text-[#0F1722] uppercase tracking-tight mt-1 leading-snug">
                    {language === 'zh' ? activeTopic.titleZh : activeTopic.title}
                  </h2>
                </div>

                <div className="grid grid-cols-3 gap-4 border-y border-slate-100 py-4 font-mono text-[11px]">
                  <div>
                    <span className="text-[#6A7686] block">METRIC VOLUMES</span>
                    <strong className="text-[16px] text-slate-900">{activeTopic.volume} mentions</strong>
                  </div>
                  <div>
                    <span className="text-[#6A7686] block">VELOCITY DELTA</span>
                    <strong className="text-[16px] text-[#D8454C]">{activeTopic.growth}</strong>
                  </div>
                  <div>
                    <span className="text-[#6A7686] block">INDEXED PLATFORMS</span>
                    <strong className="text-[14px] text-slate-900">{activeTopic.sources}</strong>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-[11.5px] font-black text-slate-800 uppercase">
                    {tLabel('Incident Core Reasoning & Analysis', '事件核心成因与地缘影响研判')}
                  </h4>
                  <p className="text-[12.5px] text-slate-600 leading-relaxed font-sans">
                    {language === 'zh' ? activeTopic.detailsZh : activeTopic.details}
                  </p>
                </div>

                <div className="bg-slate-50 border rounded p-4 space-y-3.5">
                  <h4 className="text-[11px] font-black text-slate-700 uppercase font-mono leading-none">
                    {tLabel('AI Generative Assessment & Recommendations', '边缘智算治理决策引擎 · 异常自律预警建议')}
                  </h4>
                  <div className="space-y-2 text-[11.5px] leading-relaxed text-slate-600">
                    <p>✔ <strong>{tLabel('Coordinated inspection advised:', '协同监察建议：')}</strong> {tLabel('Crosscheck retail LPG fuel storage caps and tax billing accounts of regional suppliers under registry ENT-KZ-AKT-0091. Natural gas flow disparities suggest off-shelf stockpiling.', '核查该区域LPG（液化气）零售中继储罐储备上限，并对该区域骨干公营供应商的税务和SCADA流量异常开展侧写。流量异动疑似存在非法的场外囤积积压行为。')}</p>
                    <p>✔ <strong>{tLabel('Preventive Intervention Plan Triggered:', '前置预防性干预指令：')}</strong> {tLabel('Optimal dispatch window is 36H (Mangystau Regional Inspectorate). Uncontrolled 90-day exposure poses a direct fiscal/regulatory risk of 1.24 BN KZT.', '最优处置派遣窗口为未来 36 小时（拟派遣：曼吉斯套省区域能监稽查总队）。若放任90天无秩序溢出，该项异动将引发该区高达 12.4 亿坚戈的间接财政风险。')}</p>
                  </div>
                </div>

                <div className="flex gap-2 pt-4 border-t border-slate-100">
                  <button 
                    onClick={() => navigate('/warning/timeseries')}
                    className="h-10 px-5 bg-[#D8454C] hover:bg-red-700 text-white font-black uppercase text-[11px] tracking-wider rounded"
                  >
                    ⚠ Open Time-Series Audit
                  </button>
                  <button 
                    onClick={() => navigate('/audit/report')}
                    className="h-10 px-5 border border-border-default hover:bg-slate-50 text-slate-700 font-bold uppercase text-[11px] rounded"
                  >
                    Draft Incident Dispatch
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
