import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  ArrowLeft, BrainCircuit, ShieldAlert, Radio, User, 
  MessageSquare, TrendingUp, Video, Globe, ThumbsUp, 
  ExternalLink, Send, Zap, Clock, ShieldCheck, CheckCircle2, ChevronRight, MapPin
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import { cn } from '../lib/utils';
import { useLanguage } from '../components/LanguageContext';
import { 
  TabVolume30d, 
  TabPolarityAspects, 
  TabWordCloud, 
  TabAudienceFlow, 
  TabPlatformMonitor, 
  TabSpreadPathway 
} from '../components/sentiment/SentimentSixChartsTabs';
import { KOL_LIST, POST_LIST, SAMPLE_COMMENTS } from './SentimentTopicDetail';

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
  cityName: string;
  cityNameZh: string;
  coords: [number, number];
}

export const SENTIMENT_TOPICS: SentimentTopic[] = [
  { id: 'ENG-001', rank: 1, title_en: 'LPG / Gasoline Price Surge +28% This Week — Driver Strike Risk Escalating',
    title_zh: '燃气价格周涨 +28% — 出租车司机罢工风险升级',
    domain: 'ENERGY PRICE', risk: 'BREACHED', volume: '680K+', platforms: ['TIKTOK', 'TELEGRAM'],
    thumbnail: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=160',
    cityName: 'Aktau', cityNameZh: '阿克套', coords: [43.6480, 51.1720] },
  { id: 'ENG-002', rank: 2, title_en: 'Almaty Heating & Utility Bills Surge — Public Outcry on 35% Price Hike',
    title_zh: '阿拉木图供热与能效公用事业开支猛增 — 市民抗议 35% 账单上涨',
    domain: 'ENERGY PRICE', risk: 'BREACHED', volume: '410K+', platforms: ['FACEBOOK', 'X'],
    thumbnail: almatyEnergyBill,
    cityName: 'Almaty', cityNameZh: '阿拉木图', coords: [43.2220, 76.8512] },
  { id: 'ENG-003', rank: 3, title_en: 'Karaganda Methane Spike — Fatality Rumor Spreading',
    title_zh: '卡拉干达甲烷骤升事故 · 死亡人数传闻发酵',
    domain: 'ENERGY SAFETY', risk: 'ELEVATED', volume: '320K+', platforms: ['VK', 'TELEGRAM'],
    thumbnail: 'https://images.unsplash.com/photo-1606471191009-2c4d49d2b95f?w=120',
    cityName: 'Karaganda', cityNameZh: '卡拉干达', coords: [49.8020, 73.0880] },
  { id: 'ENG-004', rank: 4, title_en: 'Aktau Coal Price +18% — Residents Petition for Subsidy',
    title_zh: '阿克套煤价上调 +18% — 居民联名请愿政府补贴',
    domain: 'ENERGY PRICE', risk: 'BREACHED', volume: '230K+', platforms: ['INDEX', 'X'],
    thumbnail: 'https://images.unsplash.com/photo-1605007493699-af65834f8a02?w=120',
    cityName: 'Aktau Coal Hub', cityNameZh: '阿克套煤炭港', coords: [44.3000, 51.5000] },
  { id: 'ENG-005', rank: 5, title_en: 'Pavlodar Data Center Grabbing Grid Power — Households Forced Off-peak',
    title_zh: '巴甫洛达尔数据中心抢电 · 民用降负荷讨论',
    domain: 'POLICY', risk: 'ELEVATED', volume: '180K+', platforms: ['LINKEDIN', 'X'],
    thumbnail: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=120',
    cityName: 'Pavlodar', cityNameZh: '巴甫洛达尔', coords: [52.3000, 76.9500] },
  { id: 'ENG-006', rank: 6, title_en: '2022 Zhanaozen Unrest 4th Anniversary — Reflection Posts Trending',
    title_zh: '2022 扎瑙津骚乱 4 周年纪念话题升温',
    domain: 'POLICY', risk: 'ELEVATED', volume: '156K+', platforms: ['TELEGRAM', 'YOUTUBE'],
    thumbnail: 'https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=120',
    cityName: 'Zhanaozen', cityNameZh: '扎瑙津', coords: [43.3400, 52.8500] },
  { id: 'ENG-007', rank: 7, title_en: 'National Oil Export Quota Cut — Industry Discussion',
    title_zh: '国家油气出口配额削减政策讨论',
    domain: 'POLICY', risk: 'NOMINAL', volume: '92K+', platforms: ['LINKEDIN'],
    thumbnail: 'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=120',
    cityName: 'Atyrau', cityNameZh: '阿特劳码头', coords: [47.1167, 51.8833] },
  { id: 'ENG-008', rank: 8, title_en: 'Tengiz FGP Expansion — Environmental Protest in Atyrau',
    title_zh: '田吉仪 FGP 扩产 · 阿特劳环保抗议',
    domain: 'ENERGY SAFETY', risk: 'ELEVATED', volume: '78K+', platforms: ['FACEBOOK', 'TIKTOK'],
    thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=120',
    cityName: 'Tengiz Field', cityNameZh: '田吉仪油田', coords: [46.3000, 53.4000] },
  { id: 'ENG-009', rank: 9, title_en: 'Wind Farm Permit Delayed 273 Days — Investor Outrage',
    title_zh: '风电场审批拖延 273 天 · 投资者公开声讨',
    domain: 'POLICY', risk: 'NOMINAL', volume: '64K+', platforms: ['X', 'LINKEDIN'],
    thumbnail: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=120',
    cityName: 'Ereymentau', cityNameZh: '埃雷门套风电', coords: [51.6200, 73.1000] },
  { id: 'ENG-010', rank: 10, title_en: 'CASE-2026-001 Western Caspian Probe Rumor',
    title_zh: 'CASE-2026-001 西里海能源稽查案传闻发酵',
    domain: 'POLICY', risk: 'ELEVATED', volume: '52K+', platforms: ['TELEGRAM', 'INSTAGRAM'],
    thumbnail: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=120',
    cityName: 'Caspian Region', cityNameZh: '里海本地区域', coords: [45.5000, 50.0000] },
];

export default function SentimentConsole() {
  const navigate = useNavigate();
  const location = useLocation();
  const { language } = useLanguage();
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

  // Router-level synchronization
  const incomingTopicId = location.state?.selectedTopicId;
  const [selectedTopic, setSelectedTopic] = useState<string>('ENG-002');
  const [subTab, setSubTab] = useState<'macro' | 'specific'>('macro');
  const [selectedPostIdx, setSelectedPostIdx] = useState(0);

  useEffect(() => {
    if (incomingTopicId) {
      setSelectedTopic(incomingTopicId);
      setSubTab('specific'); // Auto-navigate to specific if triggered with state
    }
  }, [incomingTopicId]);

  const currentTopicObj = useMemo(() => {
    return SENTIMENT_TOPICS.find(t => t.id === selectedTopic) || SENTIMENT_TOPICS[1];
  }, [selectedTopic]);

  // Sync post index when chosen topic changes
  useEffect(() => {
    if (selectedTopic === 'ENG-002') {
      setSelectedPostIdx(0); // Almaty Heating Bills
    } else if (selectedTopic === 'ENG-001') {
      setSelectedPostIdx(1); // Aktau LPG strike
    } else if (selectedTopic === 'ENG-003') {
      setSelectedPostIdx(7); // Karaganda methane spike
    } else if (selectedTopic === 'ENG-005') {
      setSelectedPostIdx(4); // Pavlodar mining farm
    } else if (selectedTopic === 'ENG-004') {
      setSelectedPostIdx(8); // Aktau coal price
    } else {
      setSelectedPostIdx(2); // Default
    }
  }, [selectedTopic]);

  const activePost = POST_LIST[selectedPostIdx] || POST_LIST[0];

  // DISPOSAL DATA FOR SELECTED EVENT
  const aiSuggestions = useMemo(() => [
    {
      action: language === 'zh' ? '紧急召集物价局 + 民政部联席会议' : 'Emergency Joint Committee Meeting (Prices & Social Welfare)',
      rationale: language === 'zh' ? 'TG/FB 24h 内负向声量翻 3 倍，关键词"дорого/тариф"快速攀升，与 2022 年极高危模型特征吻合度 87%' : 'Negative sentiment spiked 3x on TG/FB over the last 24h; keywords match high-risk social unrest models by 87%.',
      confidence: 91,
      targetDept: language === 'zh' ? '总理办公室' : 'PM Office'
    },
    {
      action: language === 'zh' ? '推送官方价格构成解释稿件至 6 家主流平台' : 'Publish Transparency Leaflets to 6 Major Mass Outlets',
      rationale: language === 'zh' ? '当前负向评论中 62% 来源于对价格构成透明度的猜忌，一键公开成本构成可抑制 35-50% 负向发酵' : '62% of negative feedback rises from perceived gas rate opacity. Exposing core costs decreases hostility margins.',
      confidence: 78,
      targetDept: language === 'zh' ? '能源部宣传司' : 'Energy Press Dept'
    },
    {
      action: language === 'zh' ? '启动民政低收入家庭能源/电费补贴专项通道' : 'Activate Focused Power Subsidy Channels for Low-income Families',
      rationale: language === 'zh' ? '识别到 24 个社交圈群集中在低收入街区，提请市政厅定向跟进专项补贴' : 'Detected 24 social clusters localized in low-income blocks. Directed municipal subsidy contains unrest risks.',
      confidence: 84,
      targetDept: language === 'zh' ? '民政部福利司' : 'Social Bureau'
    },
  ], [language]);

  const dispatches = useMemo(() => [
    { id: 'D-001', dept: language === 'zh' ? '总理办公室' : 'PM Office', task: language === 'zh' ? '召集联席协调会' : 'Joint Conference Meeting', status: 'progress', statusLabel: language === 'zh' ? '督做进行中' : 'Progress' },
    { id: 'D-002', dept: language === 'zh' ? '能源部宣传司' : 'Energy Press', task: language === 'zh' ? '拟稿发布能价格公示' : 'Release Cost Structure', status: 'done', statusLabel: language === 'zh' ? '已办结' : 'Completed' },
    { id: 'D-003', dept: language === 'zh' ? '民政部福利司' : 'Social Bureau', task: language === 'zh' ? '下达定向能源补贴口径' : 'Launch Welfare Fund', status: 'pending', statusLabel: language === 'zh' ? '待指派' : 'Pending' },
    { id: 'D-004', dept: language === 'zh' ? '阿拉木图市政厅' : 'Almaty Mayor', task: language === 'zh' ? '街道面对面民情疏导' : 'Face-to-face Dialogue', status: 'progress', statusLabel: language === 'zh' ? '协调中' : 'Progress' },
    { id: 'D-005', dept: language === 'zh' ? '国家物价局' : 'Price Bureau', task: language === 'zh' ? '启动各能耗区间机制复核' : 'Re-verify Gas Tariff', status: 'overdue', statusLabel: language === 'zh' ? '超期 2 天' : 'Overdue 2d' },
    { id: 'D-006', dept: language === 'zh' ? '国家安全部' : 'Security Force', task: language === 'zh' ? '多网络言论引导与澄清' : 'Monitor Social Channels', status: 'done', statusLabel: language === 'zh' ? '已完成' : 'Completed' },
  ], [language]);

  // Leaflet marker icons generator using custom HTML for picture overlays
  const renderCustomMarkerIcon = (topicItem: SentimentTopic) => {
    const isSelected = selectedTopic === topicItem.id;
    return L.divIcon({
      html: `
        <div class="relative flex flex-col items-center">
          <div class="w-[52px] h-[38px] rounded-[3px] border-2 ${isSelected ? 'border-[#E11D48] scale-110' : 'border-[#3B82F6]'} overflow-hidden shadow-lg bg-white relative transition-all duration-200">
            <img src="${topicItem.thumbnail}" class="w-full h-full object-cover" />
            <div class="absolute inset-x-0 bottom-0 bg-black/60 text-white text-[6.5px] scale-90 font-black text-center truncate px-0.5">
              ${topicItem.volume}
            </div>
          </div>
          <div class="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-650 rounded-full border-2 border-white flex items-center justify-center text-white text-[7px] font-mono font-black animate-pulse">
            !
          </div>
          <div class="mt-1 bg-slate-900 text-white font-black text-[8px] px-1 py-0.5 rounded-[2px] whitespace-nowrap shadow tracking-tight uppercase">
            ${language === 'zh' ? topicItem.cityNameZh : topicItem.cityName}
          </div>
        </div>
      `,
      className: 'custom-div-icon',
      iconSize: [60, 60],
      iconAnchor: [30, 30]
    });
  };

  return (
    <div className="flex-1 flex flex-col bg-[#F3F5F9] select-none text-[11px] overflow-hidden max-h-screen">
      
      {/* 1. Header Navigation */}
      <header className="h-[48px] border-b border-[#E2E7EF] bg-white flex items-center justify-between px-6 shrink-0 z-50 shadow-xs">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate('/minister/dashboard')}
            className="flex items-center gap-1.5 text-[#6A7686] hover:text-[#0F1722] pr-3 border-r border-[#E2E7EF] text-[11px] font-bold cursor-pointer"
          >
            <ArrowLeft size={13} />
            <span>{t('返回', 'Back to Dashboard')}</span>
          </button>
          <span className="text-[12px] font-black uppercase text-[#0F1722] tracking-wider">
            {t('第三幕 能源舆情监测', 'ACT III: Energy Sentiment Monitoring')}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="px-2.5 py-0.5 bg-[#D8454C] text-white text-[8px] font-bold rounded-sm uppercase font-mono tracking-wider animate-pulse flex items-center gap-1">
            <Radio size={9} className="animate-ping" />
            <span>10 ACTIVE INTERCEPTIONS</span>
          </span>
        </div>
      </header>

      {/* Subpage switcher/Tabs */}
      <div className="bg-white border-b border-[#E2E7EF] px-6 h-11 flex items-center justify-between shrink-0 z-40 shadow-2xs">
        <div className="flex gap-1">
          <button
            onClick={() => setSubTab('macro')}
            className={cn(
              "px-4 h-11 text-[11px] font-black cursor-pointer border-b-2 transition-all flex items-center gap-2 uppercase tracking-wider",
              subTab === 'macro'
                ? "border-[#0F1722] text-[#0F1722]"
                : "border-transparent text-[#6A7686] hover:text-[#0F1722]"
            )}
          >
            <Globe size={12} />
            <span>{t('宏观舆情监测', 'Macro Sentiment Monitoring')}</span>
          </button>
          <button
            onClick={() => setSubTab('specific')}
            className={cn(
              "px-4 h-11 text-[11px] font-black cursor-pointer border-b-2 transition-all flex items-center gap-2 uppercase tracking-wider",
              subTab === 'specific'
                ? "border-[#0F1722] text-[#0F1722]"
                : "border-transparent text-[#6A7686] hover:text-[#0F1722]"
            )}
          >
            <BrainCircuit size={12} />
            <span>{t('具体舆情探查', 'Specific Sentiment Investigation')}</span>
          </button>
        </div>
        <div className="text-[9px] font-mono font-bold text-slate-450 uppercase flex items-center gap-1.5">
          <Clock size={10} />
          <span>Real-time Sync Active</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
        </div>
      </div>

      {/* Main viewport Container */}
      <div className="flex-1 overflow-hidden relative flex flex-col h-full bg-[#FAFBFD]">
        
        {/* =========================================
            SUB-PAGE A: MACRO SENTIMENT MONITORING (reverted map layout)
            ========================================= */}
        {subTab === 'macro' && (
          <div className="flex-1 flex overflow-hidden h-full">
            {/* Main Interactive Map area */}
            <div className="flex-1 relative bg-slate-100 flex flex-col border-r border-[#E2E7EF] h-full">
              {/* Map Title Header Indicator */}
              <div className="absolute top-4 left-4 z-20 bg-white/95 backdrop-blur-xs border border-slate-200/80 p-3 rounded shadow-md max-w-sm pointer-events-auto">
                <div className="text-[8px] font-mono font-black text-rose-500 uppercase tracking-widest mb-1 select-none flex items-center gap-1">
                  <span className="w-2 h-2 bg-red-600 rounded-full animate-ping"></span>
                  <span>NATIONAL MONITORING INTENDED MAP</span>
                </div>
                <h3 className="text-[11.5px] font-black text-[#0F1722] uppercase tracking-wider">
                  {t('国家重点能源项目地理舆情感知图', 'Kazakhstan National Energy Geopolitical Sentiment Map')}
                </h3>
                <p className="text-[9.5px] leading-snug text-[#6A7686] mt-1 text-slate-550 select-text">
                  {t('点击大地图红圈/贴纸卡片，触发协同督办联动下钻、分析全线。', 'Click any pinned sticker on the national map to inspect social posts, translate details, and drill down to dispatch controls.')}
                </p>
              </div>

              {/* Leaflet interactive map rendering */}
              <div className="w-full h-full relative" id="sentiment_map_stage">
                <MapContainer 
                  center={[48.6, 68.0]} 
                  zoom={4.5} 
                  className="h-full w-full" 
                  zoomControl={false}
                  scrollWheelZoom={true}
                >
                  <TileLayer url="https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png" />
                  
                  {SENTIMENT_TOPICS.map(topicItem => (
                    <Marker 
                      key={topicItem.id} 
                      position={topicItem.coords}
                      icon={renderCustomMarkerIcon(topicItem)}
                      eventHandlers={{
                        click: () => {
                          setSelectedTopic(topicItem.id);
                        }
                      }}
                    >
                      {/* Interactive click popup to preview */}
                      <Popup className="sentiment-custom-popup" maxWidth={310}>
                        <div className="p-3 select-text font-sans bg-white text-slate-900 rounded-[2.5px] shadow-sm max-w-[280px]">
                          <div className="flex items-center justify-between mb-2">
                            <span className="px-1.5 py-0.5 bg-rose-100 text-[#D8454C] text-[7.5px] font-mono font-black rounded uppercase tracking-wider select-none">
                              {topicItem.domain}
                            </span>
                            <span className="text-[8.5px] font-mono text-[#A8B2C0] select-none font-black text-right">
                              VOL: {topicItem.volume}
                            </span>
                          </div>
                          
                          <div className="aspect-video w-full rounded overflow-hidden border border-slate-100 mb-2 select-none bg-slate-100">
                            <img src={topicItem.thumbnail} className="w-full h-full object-cover" />
                          </div>

                          <h4 className="text-[10.5px] font-black leading-tight text-slate-900 mb-1 leading-snug uppercase">
                            {language === 'zh' ? topicItem.title_zh : topicItem.title_en}
                          </h4>

                          <p className="text-[9.5px] leading-relaxed text-slate-500 mb-3 font-semibold">
                            {language === 'zh' 
                              ? '已在阿特劳及关联泵站形成声量爆发，高低频发帖速率超出警告底线。请启动紧急督办预案。'
                              : 'Detected micro-influencer burst. Social comments rate breaches regulatory limit at this geological node.'}
                          </p>

                          <button
                            onClick={() => {
                              setSelectedTopic(topicItem.id);
                              setSubTab('specific'); // Drill down linkage!
                            }}
                            className="w-full bg-[#0F1722] text-white hover:bg-slate-800 text-[10px] font-black uppercase py-2.5 rounded-[1.5px] tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1 shadow-sm select-none"
                          >
                            <span>进入具体研判分析与督办</span>
                            <ChevronRight size={11} />
                          </button>
                        </div>
                      </Popup>
                    </Marker>
                  ))}
                </MapContainer>
              </div>
            </div>

            {/* RHS Map Detail side panel */}
            <aside className="w-[360px] bg-white overflow-y-auto shrink-0 select-text flex flex-col justify-between h-full p-5 border-l border-[#E2E7EF]">
              <div className="space-y-4">
                <div className="border-b border-[#E2E7EF] pb-3 select-none">
                  <div className="text-[8.5px] font-mono text-[#A8B2C0] font-black uppercase tracking-wider flex items-center gap-1.5">
                    <MapPin size={11} className="text-[#D8454C]" />
                    <span>{t('当前选择区域：', 'Selected Hotspot Location:')} {language === 'zh' ? currentTopicObj.cityNameZh : currentTopicObj.cityName}</span>
                  </div>
                  <h3 className="text-[14px] font-black text-slate-900 mt-1 uppercase tracking-tight">
                    {t('热点重点贴文速览', 'Hotspot Post Preview')}
                  </h3>
                </div>

                <div className="bg-slate-50 border border-slate-200/80 rounded-[4px] p-4 space-y-3 shadow-2xs relative">
                  <div className="flex items-center gap-2 select-none h-6">
                    <span className="px-1.5 py-0.5 bg-[#D8454C] text-white text-[7.5px] font-black rounded uppercase font-mono tracking-wider">{activePost.platform}</span>
                    <span className="text-[8.5px] font-mono text-slate-400 font-extrabold ml-auto">AUTHOR: @{activePost.author}</span>
                  </div>

                  <div className="aspect-video w-full rounded overflow-hidden border border-slate-200 select-none bg-slate-100">
                    <img src={activePost.img} className="w-full h-full object-cover" />
                  </div>

                  <div>
                    <h4 className="text-[11.5px] font-black text-slate-900 leading-snug uppercase">
                      {t(activePost.title, activePost.title_zh || activePost.title)}
                    </h4>
                    
                    {language === 'zh' ? (
                      <div className="mt-2.5 text-[10.5px] text-slate-800 leading-relaxed bg-white border border-slate-100 rounded p-2.5 select-text">
                        <span className="text-[7.5px] font-black font-mono text-blue-600 block mb-1">翻译 · 俄→中</span>
                        {activePost.content_zh || '暂无俄中人工翻译内容缓存，系统拟进行 AI 直译中控室。'}
                      </div>
                    ) : (
                      <div className="mt-2 text-[10.5px] text-slate-500 leading-relaxed bg-white border border-slate-100 rounded p-2 select-text italic">
                        <span className="text-[7.5px] font-black font-mono text-slate-400 block mb-0.5 select-none">Translated Draft (RU → EN)</span>
                        "{activePost.content_en}"
                      </div>
                    )}
                  </div>

                  <div className="flex justify-between items-center text-[9px] text-[#6A7686] pt-3 border-t border-slate-100 font-mono select-none">
                    <span>🔥 {activePost.interaction}</span>
                    <span>🕒 {activePost.date}</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <button
                  onClick={() => setSubTab('specific')}
                  className="w-full bg-[#0F1722] text-white hover:bg-slate-800 text-[10.5px] font-black uppercase py-3 rounded-[2.5px] tracking-wider transition-all select-none cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <BrainCircuit size={13} />
                  <span>{t('进入具体研判二级页下钻', 'Drill down to Specific Investigation')}</span>
                </button>
              </div>
            </aside>
          </div>
        )}

        {/* =========================================
            SUB-PAGE B: SPECIFIC SENTIMENT INVESTIGATION (top10 split details & 6 scenes & closed loop)
            ========================================= */}
        {subTab === 'specific' && (
          <div className="flex-1 overflow-y-auto p-6 space-y-6 select-text max-h-full">
            
            {/* 1. Header Hero section */}
            <div className="bg-white border border-[#E2E7EF] rounded-[6px] p-5 shadow-sm flex gap-5 shrink-0 select-text">
              <div className="w-24 h-24 bg-slate-100 rounded-[5px] overflow-hidden shrink-0 border border-slate-200 select-none">
                <img src={currentTopicObj.thumbnail} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5 select-none">
                  <span className="px-2 py-0.5 bg-[#D8454C] text-white text-[8px] font-black rounded uppercase tracking-wider animate-pulse flex items-center gap-0.5 leading-none">
                    <ShieldAlert size={9} />
                    <span>HIGH PRIORITY</span>
                  </span>
                  <span className="text-[9px] font-mono text-[#A8B2C0] font-bold">CASE: #{currentTopicObj.id}</span>
                  <span className="text-[9px] font-mono text-[#A8B2C0] font-bold">DOMAIN: {currentTopicObj.domain}</span>
                  <span className="text-[9px] font-mono text-[#A8B2C0] font-bold">STATION: {currentTopicObj.cityName}</span>
                </div>
                <h2 className="text-[17px] font-black text-[#0F1722] leading-tight mt-1">{t(currentTopicObj.title_en, currentTopicObj.title_zh)}</h2>
                <div className="flex flex-wrap gap-1 mt-2.5 select-none">
                  {['LPG', 'TARIFF BURST', 'CIVIC UNION', 'REGULATORY INVOLVED', 'JUSTICE'].map(kw => (
                    <span key={kw} className="text-[8px] font-mono font-black text-[#D8454C] bg-[#D8454C]/5 px-2 py-0.5 rounded-full border border-[#D8454C]/15">{kw}</span>
                  ))}
                </div>
                <p className="text-[10.5px] text-[#6A7686] mt-3 leading-snug font-semibold">
                  {t('Cumulative sentiment value', '全网累计舆情声量')}:&nbsp;
                  <span className="text-[#D8454C] font-black">{currentTopicObj.volume} index</span>&nbsp;·&nbsp;
                  {t('Participant groups: Domestic automobile owners, regional attorneys, labor force, analysts.',
                      '核心圈群主体：国内中产生力车主 / 社区民意代表 / 工盟常任常务 / 宏观能源分析师。')}
                </p>
              </div>
            </div>

            {/* 2. Top 10 users & Top 10 topics (reverted split layout) */}
            <div className="grid grid-cols-3 gap-6">
              
              {/* LHS A: TOP 10 Users / KOL */}
              <div className="bg-white border border-[#E2E7EF] rounded-[6px] p-4 shadow-sm flex flex-col justify-between h-[420px]">
                <div>
                  <h4 className="text-[10.5px] font-black text-[#0F1722] uppercase tracking-wider mb-3 flex items-center gap-1.5 select-none pb-2 border-b border-slate-100">
                    <User size={12} /> {t('TOP 10 KOL · Opinion Leaders', 'TOP 10 意见领袖监控')}
                  </h4>
                  <div className="space-y-2 max-h-[350px] overflow-y-auto pr-1">
                    {KOL_LIST.map((k, i) => (
                      <div key={i} className="flex items-start gap-2.5 p-1.5 hover:bg-slate-50 border border-transparent hover:border-slate-100 rounded-[3px] transition duration-150">
                        <div className="w-8 h-8 rounded-full bg-slate-100 overflow-hidden shrink-0 border border-slate-200 select-none">
                          <img src={k.avatar} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1 mb-0.5 select-none">
                            <span className="text-[10px] font-black text-[#0F1722] truncate">{k.name}</span>
                            <div className="flex items-center gap-1 shrink-0">
                              <span className="text-[7px] font-mono font-black bg-slate-100 text-[#6A7686] px-1 py-0.2 rounded uppercase">{k.platform}</span>
                              <span className="text-[8px] font-mono text-[#A8B2C0]">{k.subs}</span>
                            </div>
                          </div>
                          <p className="text-[9px] text-[#6A7686] leading-tight font-medium">{k.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* LHS B: TOP 10 Posts */}
              <div className="bg-white border border-[#E2E7EF] rounded-[6px] p-4 shadow-sm flex flex-col justify-between h-[420px]">
                <div>
                  <h4 className="text-[10.5px] font-black text-[#0F1722] uppercase tracking-wider mb-3 flex items-center gap-1.5 select-none pb-2 border-b border-slate-100">
                    <TrendingUp size={12} /> {t('TOP 10 Posts', 'TOP 10 监测热帖')}
                  </h4>
                  <div className="space-y-1.5 max-h-[350px] overflow-y-auto pr-1">
                    {POST_LIST.map((p, i) => (
                      <div key={i} onClick={() => setSelectedPostIdx(i)}
                        className={cn("flex gap-2.5 p-1.5 cursor-pointer border rounded-[3px] transition duration-150",
                          selectedPostIdx === i ? 'bg-[#0F1722] text-white border-[#0F1722]' : 'hover:bg-slate-50 border-transparent bg-white bg-slate-50/20')}>
                        <div className="w-11 h-8 rounded overflow-hidden shrink-0 border border-slate-100 select-none">
                          <img src={p.img} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-0.5 select-none">
                            <span className={cn("text-[7px] font-mono font-black px-1.5 py-0.2 rounded uppercase",
                              selectedPostIdx === i ? 'bg-white/20 text-white' : 'bg-slate-100 text-[#6A7686]')}>{p.platform}</span>
                            <span className="text-[8px] font-mono font-black text-[#D8454C]">{p.interaction}</span>
                          </div>
                          <div className={cn("text-[9px] font-black truncate uppercase tracking-tight",
                            selectedPostIdx === i ? 'text-white' : 'text-[#0F1722]')}>{t(p.title, p.title_zh || p.title)}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* RHS C: Post Deep Analysis block */}
              <div className="bg-white border border-[#E2E7EF] rounded-[6px] p-4 shadow-sm h-[420px] flex flex-col justify-between">
                <div className="flex flex-col h-full justify-between">
                  <div className="flex items-center justify-between pb-1 border-b border-slate-100 select-none">
                    <div className="flex items-center gap-1.5">
                      <Video size={12} className="text-[#0F1722]" />
                      <span className="text-[10px] font-black uppercase tracking-wider text-[#0F1722]">{t('Post Detail Analysis', '高频热帖详情分析')}</span>
                    </div>
                    <span className="text-[8px] font-mono text-[#6A7686]">ENTRY #{selectedPostIdx + 1}</span>
                  </div>

                  <div className="flex-1 overflow-y-auto py-3 space-y-3 pr-1">
                    <div className="bg-slate-50 border border-[#E2E7EF] rounded p-2.5 space-y-2">
                      <div className="flex items-center gap-2 select-none">
                        <div className="w-6 h-6 rounded-full bg-slate-200 shrink-0 text-slate-800 flex items-center justify-center font-black text-[9px]">U</div>
                        <div className="flex-1 min-w-0">
                          <div className="text-[9.5px] font-black text-[#0F1722] truncate">@{activePost.author}</div>
                          <div className="text-[7.5px] text-[#6A7686] font-mono select-none">{activePost.subs} · {activePost.date}</div>
                        </div>
                        <Globe size={11} className="text-[#A8B2C0] select-none" />
                      </div>
                      
                      <div className="aspect-video bg-slate-100 rounded overflow-hidden select-none">
                        <img src={activePost.img} className="w-full h-full object-cover" />
                      </div>

                      <h3 className="text-[10.5px] font-black text-[#0F1722] leading-tight uppercase">
                        {t(activePost.title, activePost.title_zh || activePost.title)}
                      </h3>

                      {activePost.content_ru && (
                        <p className="text-[9.5px] text-[#6A7686] leading-snug italic border-l pr-1 pl-1.5 selection:bg-rose-100/30">
                          {activePost.content_ru}
                        </p>
                      )}
                    </div>

                    {/* Translates */}
                    {activePost.content_zh && (
                      <div className="bg-blue-50/50 border border-blue-105 rounded p-2 text-[9.5px]">
                        <span className="text-[7.5px] font-black text-blue-500 font-mono block mb-1 uppercase select-none">AI 中译速递</span>
                        <p className="text-slate-900 leading-snug">{activePost.content_zh}</p>
                      </div>
                    )}

                    {/* Comments */}
                    <div className="space-y-1.5">
                      <span className="text-[8.5px] font-black text-[#0F1722] uppercase tracking-wider select-none">社交反响跟踪</span>
                      {SAMPLE_COMMENTS.map((c, i) => (
                        <div key={i} className="flex gap-2 bg-slate-50/30 border border-slate-100 p-2 rounded">
                          <div className="w-6 h-6 rounded-full bg-slate-200 shrink-0 flex items-center justify-center font-bold text-[8px] text-[#6A7686] select-none">{c.user.substring(0, 2)}</div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-0.5 select-none">
                              <span className="text-[8.5px] font-black text-[#0F1722]">{c.user}</span>
                              <span className="text-[8px] text-[#A8B2C0] font-mono">▲ {c.likes}</span>
                            </div>
                            <p className="text-[9px] text-[#6A7686] leading-tight font-medium">{t(c.text, c.text_zh)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* 3. The 6 high-fidelity analytics scenarios (3x2 grid layout) */}
            <div className="space-y-3">
              <h3 className="text-[12px] font-black text-[#0F1722] uppercase tracking-tight select-none">
                {t('📊 高频二维与流态解构监测', '📊 High-fidelity Analytical Monitoring Scenarios')}
              </h3>
              <div className="grid grid-cols-3 gap-4">
                
                {/* 1. Volume Trend (30D) */}
                <ScenarioCard title={t('30日热度时序', '1. 30D Heat Time Series')}>
                  <TabVolume30d t={t} />
                </ScenarioCard>

                {/* 2. Sentiment Distribution */}
                <ScenarioCard title={t('情感极性解构玫瑰', '2. Polarity Rose Aspect Breakdown')}>
                  <TabPolarityAspects t={t} language={language} />
                </ScenarioCard>

                {/* 3. Word Cloud Spiral */}
                <ScenarioCard title={t('词频引力极性螺旋', '3. Dynamic Word Gravity Spiral')}>
                  <TabWordCloud t={t} />
                </ScenarioCard>

                {/* 4. Demographics / Audience Flow */}
                <ScenarioCard title={t('大众传播流量流动', '4. Audience Flow Map (Sankey)')}>
                  <TabAudienceFlow t={t} />
                </ScenarioCard>

                {/* 5. Platform Share / Sparklines */}
                <ScenarioCard title={t('全网多信道发帖速率脉动', '5. Platform Activity Sparklines')}>
                  <TabPlatformMonitor t={t} />
                </ScenarioCard>

                {/* 6. Cross-platform propagation pathway */}
                <ScenarioCard title={t('级联媒体缩减时延路径', '6. Cascade Propagation Pathway')}>
                  <TabSpreadPathway t={t} />
                </ScenarioCard>

              </div>
            </div>

            {/* 4. Bottom Disposal & Closed Loop processes */}
            <section className="border-t border-slate-200 pt-5 text-slate-900 shrink-0 select-text">
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-[14.5px] font-black text-slate-900 uppercase tracking-tight flex items-center gap-1.5 select-none">
                  <span>🛠</span>
                  <span>{t('处置 · 督办闭环管理', 'DISPOSAL · CLOSED LOOP REGULATION')}</span>
                </h2>
              </div>
              <p className="text-[10.5px] text-slate-450 font-semibold mb-4 leading-none select-none">
                {t('AI 研判提议处置动作 • 各部门分发工作状态 • 履约响应时效跟踪', 'AI suggested containment tasks • Dept ticketing status • SLA escalation track')}
              </p>

              <div className="grid grid-cols-3 gap-5">
                
                {/* Left Column: AI Suggestions */}
                <div className="border border-slate-200 bg-white rounded-[4px] p-4 flex flex-col justify-between h-[360px]">
                  <div className="overflow-y-auto space-y-3 pr-1 flex flex-col justify-between h-full">
                    <div>
                      <h3 className="text-[10px] uppercase tracking-wider text-[#6D7A8C] font-black border-b border-slate-100 pb-2 mb-2 select-none">
                        {t('AI 提案级联处置建议', 'AI Suggested Actions')}
                      </h3>
                      {aiSuggestions.map((s, i) => (
                        <div key={i} className="border-l-2 border-[#2D6CDF] pl-3 py-1.5 text-[11px] leading-relaxed mb-3">
                          <div className="flex items-center justify-between mb-1 select-none">
                            <span className="text-[8px] font-mono text-slate-400 font-bold">SUGGESTION #{i+1}</span>
                            <span className="text-[8px] font-mono font-black bg-blue-50 text-[#2D6CDF] px-1.5 py-0.2 rounded">
                              CONFIDENCE {s.confidence}%
                            </span>
                          </div>
                          <p className="font-extrabold text-slate-900 text-[11.5px]">{s.action}</p>
                          <p className="text-[9.5px] text-slate-500 mt-0.5 leading-normal font-medium">{s.rationale}</p>
                          <button 
                            className="mt-1.5 text-[9.5px] text-[#2D6CDF] font-bold hover:underline flex items-center gap-0.5 cursor-pointer select-none" 
                            onClick={() => alert(language === 'zh' ? `指令已加密同步分发派单至: ${s.targetDept}` : `Task dispatched to ${s.targetDept} successfully.`)}
                          >
                            {language === 'zh' ? `派单分流到 ${s.targetDept} →` : `Dispatch to ${s.targetDept} →`}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Center Column: Dispatch Table */}
                <div className="border border-slate-200 bg-white rounded-[4px] p-4 flex flex-col justify-between h-[360px]">
                  <div className="overflow-y-auto pr-1 flex flex-col justify-between h-full">
                    <div>
                      <h3 className="text-[10px] uppercase tracking-wider text-[#6D7A8C] font-black border-b border-slate-100 pb-2 mb-2 select-none">
                        {t('各协作部门派单执行状态', 'Department Dispatch Status')}
                      </h3>
                      <table className="w-full text-[10.5px] text-left">
                        <thead>
                          <tr className="border-b border-slate-100 text-slate-400 font-bold text-[8px] uppercase select-none">
                            <th className="py-2 px-1">{t('协作部门', 'DEPARTMENT')}</th>
                            <th>{t('具体督办任务', 'COGNIZABLE TASK')}</th>
                            <th className="text-right px-1">{t('进度状态', 'STATUS')}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {dispatches.map(d => (
                            <tr key={d.id} className="border-b border-slate-50 border-dashed last:border-0 hover:bg-slate-50/50">
                              <td className="py-2.5 font-bold text-slate-800 px-1">{d.dept}</td>
                              <td className="text-slate-500 font-medium truncate max-w-[110px]">{d.task}</td>
                              <td className="text-right px-1">
                                <span className={cn(
                                  'text-[8px] font-mono font-black px-1.5 py-0.5 rounded-[1.5px] leading-none inline-block select-none',
                                  d.status === 'done'     && 'bg-emerald-50 text-emerald-600',
                                  d.status === 'progress' && 'bg-amber-50 text-amber-600',
                                  d.status === 'pending'  && 'bg-slate-100 text-slate-500',
                                  d.status === 'overdue'  && 'bg-red-50 text-[#D8454C] border border-red-100',
                                )}>
                                  {d.statusLabel}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* Right Column: SLA Metrics Panel */}
                <div className="border border-slate-200 bg-white rounded-[4px] p-4 flex flex-col justify-between h-[360px] text-[11px]">
                  <div>
                    <h3 className="text-[10px] uppercase tracking-wider text-[#6D7A8C] font-black border-b border-slate-100 pb-2 mb-4 select-none">
                      {t('履约时效 SLA 跟踪表', 'SLA Performance tracking')}
                    </h3>

                    {/* Metric 1 */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-[9.5px] font-mono mb-1 text-slate-600">
                        <span>{t('整体响应 SLA', 'Overall Response SLA')}</span>
                        <span className="font-extrabold text-[#0D1722]">4h 32m</span>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden select-none">
                        <div className="h-full bg-[#2FA862]" style={{ width: '72%' }} />
                      </div>
                      <p className="text-[8px] text-slate-400 font-mono mt-1 leading-none select-none">
                        {t('督办底限额 ≤ 6小时 · 保持受控', 'Target Limit ≤ 6h · Currently nominal')}
                      </p>
                    </div>

                    {/* Metric 2 */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-[9.5px] font-mono mb-1 text-slate-600">
                        <span>{t('处置督办完成率', 'Disposal Completion Rate')}</span>
                        <span className="font-extrabold text-[#0D1722]">3 / 6</span>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden select-none">
                        <div className="h-full bg-[#2D6CDF]" style={{ width: '50%' }} />
                      </div>
                    </div>

                    {/* Metric 3 */}
                    <div className="mt-4 border-t border-dashed border-slate-200 pt-3 space-y-1.5">
                      <div className="flex items-center justify-between text-[9.5px] font-mono text-slate-600 select-none">
                        <span>{t('严重逾期督办事宜', 'Overdue Tasks Count')}</span>
                        <span className="font-black text-[#D8454C]">1</span>
                      </div>
                      <p className="text-[9px] text-slate-500 font-sans leading-snug select-text">
                        <strong className="text-[#D8454C]">{t('逾期主要责任单位：', 'Overdue entity:')}</strong>{' '}
                        {t('国家物价局 · 针对各阶梯能耗区间复核（逾期 2d）', 'Price Control Bureau · Review Gas Price Mechanism (delay 2d)')}
                      </p>
                    </div>
                  </div>

                  <button 
                    className="w-full mt-3 bg-[#0F1722] text-white font-black text-[10px] uppercase py-2.5 rounded-[2px] tracking-wide hover:bg-slate-800 cursor-pointer select-none"
                    onClick={() => alert(language === 'zh' ? '舆情研判处置周报已加密一键打包复制至剪贴板 !' : 'Brief summary compiled and copied to clipboard successfully.')}
                  >
                    {t('生成舆情研判督办简报 ↗', 'Generate Briefing Summary ↗')}
                  </button>
                </div>

              </div>
            </section>

          </div>
        )}

      </div>
    </div>
  );
}

function ScenarioCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-[#E2E7EF] rounded-[6px] shadow-sm overflow-hidden flex flex-col justify-between p-4 h-[250px]">
      <div className="h-5 border-b border-slate-100 flex items-center mb-2.5 select-none">
        <span className="text-[9.5px] font-black uppercase tracking-wider text-[#0F1722]">{title}</span>
      </div>
      <div className="flex-1 min-h-0">
        {children}
      </div>
    </div>
  );
}
