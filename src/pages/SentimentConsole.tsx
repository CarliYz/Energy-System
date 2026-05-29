import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Filter, AlertTriangle, ChevronRight, BrainCircuit } from 'lucide-react';
import { cn } from '../lib/utils';
import { useLanguage } from '../components/LanguageContext';
import { MapContainer, TileLayer, Marker, GeoJSON } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// @ts-ignore
import almatyEnergyBill from '../assets/images/almaty_energy_bill_1779900527988.png';

export interface SentimentTopic {
  id: string;
  rank: number;
  title_en: string;
  title_zh: string;
  domain: 'ENERGY PRICE' | 'ENERGY SAFETY' | 'LIVELIHOOD' | 'POLICY';
  risk: 'BREACHED' | 'ELEVATED' | 'NOMINAL';
  volume: string;
  platforms: string[];
  thumbnail: string;
  geoCoords: [number, number];
}

export const SENTIMENT_TOPICS: SentimentTopic[] = [
  { id: 'ENG-001', rank: 1, title_en: 'LPG / Gasoline Price Surge +28% This Week — Driver Strike Risk Escalating',
    title_zh: '突破民生底线 · LPG 燃气价格周涨 +28% — 出租车司机罢工风险升级',
    domain: 'ENERGY PRICE', risk: 'BREACHED', volume: '680K+', platforms: ['TIKTOK', 'TELEGRAM'],
    thumbnail: 'https://images.unsplash.com/photo-1602410439221-32a99c4d3a48?w=120', geoCoords: [43.6481, 51.1714] },
  { id: 'ENG-002', rank: 2, title_en: 'Almaty Heating & Utility Bills Surge — Public Outcry on 35% Price Hike',
    title_zh: '阿拉木图供热与能效公用事业开支猛增 — 市民抗议 35% 账单上涨',
    domain: 'ENERGY PRICE', risk: 'BREACHED', volume: '410K+', platforms: ['FACEBOOK', 'X'],
    thumbnail: almatyEnergyBill, geoCoords: [43.2389, 76.8897] },
  { id: 'ENG-003', rank: 3, title_en: 'Karaganda Methane Spike — Fatality Rumor Spreading',
    title_zh: '卡拉干达甲烷骤升事故 · 死亡人数传闻发酵',
    domain: 'ENERGY SAFETY', risk: 'ELEVATED', volume: '320K+', platforms: ['VK', 'TELEGRAM'],
    thumbnail: 'https://images.unsplash.com/photo-1606471191009-2c4d49d2b95f?w=120', geoCoords: [49.8019, 73.1021] },
  { id: 'ENG-004', rank: 4, title_en: 'Aktau Coal Price +18% — Residents Petition for Subsidy',
    title_zh: '阿克套煤价上调 +18% — 居民联名请愿政府补贴',
    domain: 'ENERGY PRICE', risk: 'BREACHED', volume: '230K+', platforms: ['INDEX', 'X'],
    thumbnail: 'https://images.unsplash.com/photo-1605007493699-af65834f8a02?w=120', geoCoords: [43.8, 51.3] },
  { id: 'ENG-005', rank: 5, title_en: 'Pavlodar Data Center Grabbing Grid Power — Households Forced Off-peak',
    title_zh: '巴甫洛达尔数据中心抢电 · 民用降负荷讨论',
    domain: 'POLICY', risk: 'ELEVATED', volume: '180K+', platforms: ['LINKEDIN', 'X'],
    thumbnail: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=120', geoCoords: [52.3, 76.95] },
  { id: 'ENG-006', rank: 6, title_en: '2022 Zhanaozen Unrest 4th Anniversary — Reflection Posts Trending',
    title_zh: '2022 扎瑙津骚乱 4 周年记念话题升温',
    domain: 'POLICY', risk: 'ELEVATED', volume: '156K+', platforms: ['TELEGRAM', 'YOUTUBE'],
    thumbnail: 'https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=120', geoCoords: [43.3408, 52.8582] },
  { id: 'ENG-007', rank: 7, title_en: 'National Oil Export Quota Cut — Industry Discussion',
    title_zh: '国家油气出口配额削减政策讨论',
    domain: 'POLICY', risk: 'NOMINAL', volume: '92K+', platforms: ['LINKEDIN'],
    thumbnail: 'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=120', geoCoords: [51.1694, 71.4491] },
  { id: 'ENG-008', rank: 8, title_en: 'Tengiz FGP Expansion — Environmental Protest in Atyrau',
    title_zh: '田吉仪 FGP 扩产 · 阿特劳环保抗议',
    domain: 'ENERGY SAFETY', risk: 'ELEVATED', volume: '78K+', platforms: ['FACEBOOK', 'TIKTOK'],
    thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=120', geoCoords: [47.0945, 51.9197] },
  { id: 'ENG-009', rank: 9, title_en: 'Wind Farm Permit Delayed 273 Days — Investor Outrage',
    title_zh: '风电场审批拖延 273 天 · 投资者公开声讨',
    domain: 'POLICY', risk: 'NOMINAL', volume: '64K+', platforms: ['X', 'LINKEDIN'],
    thumbnail: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=120', geoCoords: [49.9482, 82.6122] },
  { id: 'ENG-010', rank: 10, title_en: 'CASE-2026-001 Western Caspian Probe Rumor',
    title_zh: 'CASE-2026-001 西里海能源稽查案传闻发酵',
    domain: 'POLICY', risk: 'ELEVATED', volume: '52K+', platforms: ['TELEGRAM', 'INSTAGRAM'],
    thumbnail: 'https://images.unsplash.com/photo-1593986428220-deb2b9b1a6db?w=120', geoCoords: [44.5, 50.5] },
];

const riskBadge = (r: 'BREACHED' | 'ELEVATED' | 'NOMINAL') => {
  if (r === 'BREACHED') return 'bg-[#D8454C] text-white';
  if (r === 'ELEVATED') return 'bg-[#E89518] text-white';
  return 'bg-slate-200 text-[#6A7686]';
};

export default function SentimentConsole() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const tLabel = (en: string, zh: string) => (language === 'zh' ? zh : en);
  const [searchQ, setSearchQ] = useState('');
  const [geoData, setGeoData] = useState<any>(null);

  useEffect(() => {
    fetch('https://raw.githubusercontent.com/johan/world.geo.json/master/countries/KAZ.geo.json')
      .then(res => res.json())
      .then(data => setGeoData(data))
      .catch(err => console.error("边界加载异常: ", err));
  }, []);

  const filtered = useMemo(() => {
    return SENTIMENT_TOPICS.filter(t =>
      !searchQ ||
      t.title_en.toLowerCase().includes(searchQ.toLowerCase()) ||
      t.title_zh.includes(searchQ) ||
      t.domain.toLowerCase().includes(searchQ.toLowerCase())
    );
  }, [searchQ]);

  return (
    <div className="flex-1 flex flex-col bg-[#F4F6FA] overflow-hidden h-full">
      <div className="h-14 border-b border-[#E2E7EF] bg-white flex items-center justify-between px-6 shrink-0 z-50 shadow-sm">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 text-[#6A7686] hover:text-[#0F1722] pr-3 border-r border-[#E2E7EF] text-[11px] font-bold">
            <ArrowLeft size={13} /> {tLabel('Back', '返回')}
          </button>
          <span className="text-[11.5px] font-black uppercase text-[#0F1722] tracking-wider">
            {tLabel('SENTIMENT CONSOLE · ENERGY-RELATED PUBLIC OPINION',
                    '舆情场景 · 国家能源与民生底线舆情监测')}
          </span>
        </div>
        <span className="px-2 py-0.5 bg-[#D8454C] text-white text-[8px] font-bold rounded-sm uppercase font-mono">10 ACTIVE TOPICS</span>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="grid grid-cols-[1fr_520px] gap-5 items-start">

          {/* === LEFT · Global map === */}
          <div className="bg-white border border-[#E2E7EF] rounded-[6px] p-5 shadow-sm flex flex-col">
            <h3 className="text-[12.5px] font-black text-[#0F1722] uppercase tracking-wider mb-2">
              {tLabel('Global Energy Sentiment Map · Past 24H',
                      '全球能源舆情风云分布图 · 过去 24 小时')}
            </h3>
            <p className="text-[10.5px] text-[#6A7686] mb-3">
              {tLabel('System matches global sentiment streams to KZ energy concerns + livelihood risk lines.',
                      '系统分析全球舆情对哈萨克国家能源舆情超线临界分布及变化趋势')}
            </p>

            <div className="h-[550px] bg-slate-50 border border-[#E2E7EF] rounded relative overflow-hidden" style={{ minHeight: '480px' }}>
              <style>{`
                .custom-div-icon {
                  background: none !important;
                  border: none !important;
                }
                .leaflet-container {
                  background-color: #f8fafc !important;
                }
              `}</style>

              <MapContainer
                center={[48.0196, 66.9237]}
                zoom={5}
                style={{ height: '100%', width: '100%', position: 'absolute', inset: 0, zIndex: 1 }}
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

                {filtered.map((topic) => {
                  const isCrit = topic.risk === 'BREACHED';
                  const isElev = topic.risk === 'ELEVATED';
                  const isSelected = topic.rank === 1;
                  const titleText = language === 'zh' ? topic.title_zh : topic.title_en;

                  const markerHtml = `
                    <div class="flex items-stretch bg-white border ${isSelected ? 'border-2 border-[#D8454C]' : 'border-[#1A2330]'} w-[220px] h-[56px] overflow-hidden pointer-events-auto transition-all rounded-none shadow-sm hover:shadow-md hover:scale-[1.03] transform duration-150">
                      <div class="w-[50px] shrink-0 border-r border-[#1a2330] overflow-hidden bg-slate-50 flex items-center justify-center">
                        <img src="${topic.thumbnail}" class="w-full h-full object-cover" />
                      </div>
                      <div class="flex-1 p-1 flex flex-col justify-between min-w-0 bg-white">
                        <div class="text-[9px] font-black text-[#0F1722] leading-[1.2] line-clamp-2 uppercase tracking-tight font-sans">
                          ${titleText}
                        </div>
                        <div class="flex justify-between items-center mt-0.5">
                          <span class="text-[7.5px] font-mono text-[#6A7686] font-bold uppercase truncate max-w-[100px]">
                            #${topic.domain}
                          </span>
                          <span class="text-[7.5px] px-1 font-mono font-black ${
                            isCrit ? 'bg-red-100 text-[#D8454C]' : isElev ? 'bg-amber-100 text-[#E89518]' : 'bg-green-100 text-[#2FA862]'
                          } rounded-[2px] leading-none py-0.5">
                            ${topic.id}
                          </span>
                        </div>
                      </div>
                    </div>
                  `;

                  return (
                    <Marker
                      key={`${topic.id}-${language}`}
                      position={topic.geoCoords}
                      eventHandlers={{
                        click: () => navigate(`/sentiment/topic/${topic.id}`)
                      }}
                      icon={L.divIcon({
                        className: 'custom-div-icon',
                        html: markerHtml,
                        iconSize: [220, 56],
                        iconAnchor: [110, 28]
                      })}
                    />
                  );
                })}
              </MapContainer>

              {/* Legend overlay */}
              <div className="absolute bottom-3 left-3 bg-white/95 border border-slate-200 p-2.5 rounded text-[10px] space-y-1 shadow font-mono pointer-events-none z-[1000]">
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

              {/* 2022 unrest parallel monitor overlay */}
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

          {/* === RIGHT · 10 topics vertical list === */}
          <div className="flex flex-col gap-3">
            {/* search header */}
            <div className="bg-white border border-[#E2E7EF] rounded-[6px] p-3 shadow-sm">
              <div className="flex items-center gap-2">
                <Search size={13} className="text-[#A8B2C0]" />
                <input value={searchQ} onChange={e => setSearchQ(e.target.value)}
                  placeholder={tLabel('Search topic / domain / risk level', '搜索话题 / 域 / 风险等级')}
                  className="flex-1 bg-transparent border-0 outline-none text-[11px] placeholder:text-slate-400 text-slate-800" />
                <button className="text-[#6A7686]"><Filter size={13} /></button>
              </div>
            </div>

            {/* table header */}
            <div className="grid grid-cols-[40px_1fr_90px_70px_60px_60px] gap-2 px-3 py-1.5 text-[8.5px] font-black uppercase text-[#A8B2C0] font-mono tracking-wider">
              <span>ID</span>
              <span>{tLabel('Headline', '话题标题')}</span>
              <span>{tLabel('Domain', '域')}</span>
              <span>{tLabel('Risk', '民生风险')}</span>
              <span>{tLabel('Volume', '声量')}</span>
              <span className="text-right">{tLabel('Action', '操作')}</span>
            </div>

            {/* topics list */}
            <div className="bg-white border border-[#E2E7EF] rounded-[6px] divide-y divide-slate-100 overflow-y-auto max-h-[500px] shadow-sm">
              {filtered.map(t => (
                <div key={t.id}
                  className={cn("grid grid-cols-[40px_1fr_90px_70px_60px_60px] gap-2 px-3 py-2.5 items-center hover:bg-slate-50 cursor-pointer transition",
                    t.rank === 1 && 'bg-[#D8454C]/5 border-l-2 border-[#D8454C]')}
                  onClick={() => navigate(`/sentiment/topic/${t.id}`)}>
                  <span className={cn("text-[10.5px] font-mono font-black",
                    t.rank === 1 ? 'text-[#D8454C]' : 'text-[#0F1722]')}>
                    {t.id.split('-')[1]}
                  </span>
                  <div className="min-w-0 pr-1">
                    <div className={cn("text-[11px] font-bold truncate",
                      t.rank === 1 ? 'text-[#D8454C]' : 'text-[#0F1722]')}>
                      {tLabel(t.title_en, t.title_zh)}
                    </div>
                    <div className="text-[8.5px] text-[#A8B2C0] font-mono mt-0.5 space-x-1">
                      {t.platforms.map(p => <span key={p}>#{p}</span>)}
                    </div>
                  </div>
                  <span className="text-[8.5px] font-mono text-[#6A7686] truncate">{t.domain}</span>
                  <span className={cn("text-[8.5px] font-mono font-black px-1.5 py-0.5 rounded text-center whitespace-nowrap", riskBadge(t.risk))}>
                    {t.risk}
                  </span>
                  <span className="text-[10.5px] font-mono font-black text-[#0F1722]">{t.volume}</span>
                  <button className="text-[9px] font-black text-[#2D6CDF] hover:underline flex items-center justify-end gap-0.5">
                    INSPECT <ChevronRight size={10} />
                  </button>
                </div>
              ))}
            </div>

            {/* footer hint */}
            <div className="bg-[#FAFBFD] border border-[#E2E7EF] rounded p-2.5 text-[9.5px] text-[#6A7686] leading-snug">
              <strong className="text-[#D8454C]">{tLabel('Compliance Engagement:', '合规协同：')}</strong>{' '}
              {tLabel('Each topic is routed to Aktau Regional Dispatch + Inspection. ENG-001 already triggered protective audit.',
                      '舆情线索自动联动阿克套区域调度与稽查队伍。ENG-001 已自动触发保护性稽查。')}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
