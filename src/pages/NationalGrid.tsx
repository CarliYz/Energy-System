import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, Circle, ZoomControl } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/src/lib/utils';
import { useLanguage } from '../components/LanguageContext';
import { 
  Info, AlertTriangle, ChevronRight, Activity, MapPin, Layers, 
  Settings, Award, FileText, CheckCircle, Flame, ShieldAlert, Zap
} from 'lucide-react';

// Custom icons using divIcon for absolute layout control and Palantir white compliance
const createDivIcon = (html: string, size: [number, number] = [16, 16]) => L.divIcon({
  className: 'custom-div-icon',
  html,
  iconSize: size,
  iconAnchor: [size[0] / 2, size[1] / 2]
});

const MAP_ICONS = {
  CITY_STAR: (name: string, highlighted = false) => createDivIcon(`
    <div class="flex flex-col items-center">
      <div class="w-3.5 h-3.5 rounded-full bg-white border-2 ${highlighted ? 'border-[#D4A845] scale-125' : 'border-[#2D6CDF]'} flex items-center justify-center shadow-lg relative">
        <div class="w-1.5 h-1.5 rounded-full ${highlighted ? 'bg-[#D4A845]' : 'bg-[#2D6CDF] animate-pulse'}"></div>
      </div>
      <div class="mt-1 text-[8.5px] font-black text-[#0F1722] bg-white/90 border border-[#E2E7EF] px-1 rounded uppercase tracking-wider whitespace-nowrap shadow-sm">
        ★ ${name}
      </div>
    </div>`, [60, 40]),
  
  CITY_NORMAL: (name: string) => createDivIcon(`
    <div class="flex flex-col items-center">
      <div class="w-2.5 h-2.5 bg-white border-2 border-[#6A7686] rounded-full shadow-md"></div>
      <div class="mt-0.5 text-[8px] font-bold text-[#6A7686] bg-white/75 px-1 rounded uppercase tracking-wider whitespace-nowrap">
        ${name}
      </div>
    </div>`, [50, 30]),

  THERMAL: createDivIcon('<div class="w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-b-[8px] border-b-[#0F1722]"></div>', [10, 10]),
  SUBSTATION: createDivIcon('<div class="w-2 h-2 bg-[#E89518] border border-white rounded-full shadow-sm"></div>', [8, 8]),
  OIL_HEX: createDivIcon('<div class="w-3 h-3 bg-[#FF6B35] polygon-hex border border-[#0F1722]/30"></div>', [12, 12]),
  GAS_HEX: createDivIcon('<div class="w-3 h-3 bg-[#00A6D6] polygon-hex border border-[#0F1722]/30"></div>', [12, 12]),
  COAL_SQUARE: createDivIcon('<div class="w-2.5 h-2.5 bg-black border border-white shadow-sm"></div>', [10, 10]),
  REFINERY_DIAMOND: createDivIcon('<div class="w-2.5 h-2.5 bg-[#8B4513] rotate-45 border border-white"></div>', [10, 10]),
  URANIUM: createDivIcon('<div class="w-2.5 h-2.5 bg-[#2FA862] border border-white rounded-full"></div>', [10, 10]),
  DATA_CENTER_RING: createDivIcon(`
    <div class="w-4 h-4 rounded-full border-2 border-[#D4A845] flex items-center justify-center bg-white/80 animate-spin" style="animation-duration: 3s">
      <div class="w-1 h-1 bg-[#D4A845] rounded-full"></div>
    </div>`, [16, 16]),

  // Crucial pulses for warning narrative
  RED_PULSE: (label: string) => createDivIcon(`
    <div class="flex flex-col items-center">
      <div class="relative flex h-5 w-5 justify-center items-center">
        <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D8454C] opacity-75"></span>
        <span class="relative inline-flex rounded-full h-3 w-3 bg-[#D8454C]"></span>
      </div>
      <div class="mt-1 text-[8.5px] font-black text-white bg-[#D8454C] px-1 px-1.5 rounded uppercase tracking-wider whitespace-nowrap shadow-md">
        ⚠️ ${label}
      </div>
    </div>`, [100, 50]),

  AMBER_PULSE: (label: string) => createDivIcon(`
    <div class="flex flex-col items-center">
      <div class="relative flex h-4 w-4 justify-center items-center">
        <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E89518] opacity-75"></span>
        <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#E89518]"></span>
      </div>
      <div class="mt-1 text-[8px] font-black text-white bg-[#E89518] px-1 py-0.2 rounded uppercase tracking-wider whitespace-nowrap shadow-md">
        ⚡ ${label}
      </div>
    </div>`, [100, 45]),
};

export default function NationalGrid() {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [rightRailCollapsed, setRightRailCollapsed] = useState(false);
  
  const tLabel = (en: string, zh: string) => {
    return language === 'zh' ? zh : en;
  };

  const MAP_NODES = [
    // Cities
    { type: 'city_star', name: tLabel('Astana', '阿斯塔纳'), coords: [51.1693, 71.4491], isCapital: true },
    { type: 'city_star', name: tLabel('Pavlodar', '巴甫洛达尔'), coords: [52.3000, 76.9500], isPavlodarStar: true },
    { type: 'city', name: tLabel('Almaty', '阿拉木图'), coords: [43.2389, 76.8897] },
    { type: 'city', name: tLabel('Aktobe', '阿克托别'), coords: [50.2833, 57.1667] },
    { type: 'city', name: tLabel('Karaganda', '卡拉干达'), coords: [49.8047, 73.0860] },
    { type: 'city', name: tLabel('Shymkent', '奇姆肯特'), coords: [42.3000, 69.6000] },
    { type: 'city', name: tLabel('Oskemen', '奥斯卡曼'), coords: [49.9500, 82.6167] },
    { type: 'city', name: tLabel('Kostanay', '科斯塔奈'), coords: [53.2167, 63.6333] },
    { type: 'city', name: tLabel('Taldykorgan', '塔尔迪库尔干'), coords: [45.0167, 78.3667] },
    { type: 'city', name: tLabel('Semey', '塞梅伊'), coords: [50.4111, 80.2275] },
    { type: 'city', name: tLabel('Kyzylorda', '克孜勒奥尔达'), coords: [44.8500, 65.5000] },
    { type: 'city', name: tLabel('Taraz', '塔拉兹'), coords: [42.9000, 71.3667] },
    { type: 'city', name: tLabel('Atyrau', '阿特劳'), coords: [47.0908, 51.9168] },
    { type: 'city', name: tLabel('Ekibastuz', '埃基巴斯图兹'), coords: [51.7200, 75.3200] },

    // Pavlodar / Ekibastuz Cluster Nodes (DENSE)
    { type: 'thermal', name: tLabel('Ekibastuz GRES-1 (4000 MW)', '埃基巴斯图兹 GRES-1 超大型电站'), coords: [51.7800, 75.3800], cap: '4000 MW', note: 'powers future data center cluster' },
    { type: 'thermal', name: tLabel('Ekibastuz GRES-2 (1000 MW)', '埃基巴斯图兹 GRES-2 电厂'), coords: [51.8500, 75.4500], cap: '1000 MW' },
    { type: 'thermal', name: tLabel('Aksu Power Station (2100 MW)', '阿克苏能源网厂'), coords: [52.0500, 76.9000], cap: '2100 MW' },
    { type: 'coal', name: tLabel('Bogatyr Open-Cast Mine', '博加特尔大型露天煤矿'), coords: [51.6800, 75.1000], cap: '45 Mt/a' },
    { type: 'coal', name: tLabel('Vostochny Open-Cast Mine', '沃斯托尼露天煤矿'), coords: [51.6400, 75.2500], cap: '20 Mt/a' },
    { type: 'coal', name: tLabel('Maikuben Basin Open-Cast', '迈库本盆地大露天矿场'), coords: [51.2500, 75.8000], cap: '8 Mt/a' },
    { type: 'datacenter', name: tLabel('📍 Future Data Center Cluster (Planned)', '巴甫洛达尔国家算力中心集聚区 (规划中)'), coords: [52.2800, 76.8500], cap: 'Planned 500 MW Capacity' },

    // Caspian Region Nodes
    { type: 'oil', name: tLabel('Tengiz Oil Field', '田吉兹油田'), coords: [46.1200, 53.4000] },
    { type: 'oil', name: tLabel('Kashagan Offshore Field', '卡沙甘海上巨型油气田'), coords: [46.8500, 51.5500] },
    { type: 'refinery', name: tLabel('Atyrau Refinery Complex', '阿特劳提炼精炼中心'), coords: [47.1100, 52.0200] },
    { type: 'uranium', name: tLabel('Inkai Uranium Extraction #3', '因凯第3号原位地浸铀矿井'), coords: [45.1000, 67.8000] },
  ];

  const PULSES = [
    { type: 'red', name: tLabel('Aktau GCS-001 Station', '曼吉斯套储配首站 GCS-001'), coords: [43.6480, 51.1720], alert: 'CASE-2026-001 · 92% breach 48H', route: '/warning/timeseries' },
    { type: 'amber', name: tLabel('Pavlodar GRES-1 Complex', '巴甫洛达尔 GRES-1 化工电厂'), coords: [51.7800, 75.3800], alert: 'Coal consumption +2.1σ above baseline' },
    { type: 'amber', name: tLabel('Atyrau Refinery Site', '阿特劳烷基化炼油厂'), coords: [47.1100, 52.0200], alert: 'Emissions 3-day approach threshold' },
  ];

  // Transmission line vector sets in KZ
  const DUAL_BACKBONE_LINES = [
    [[51.7800, 75.3800], [51.1693, 71.4491]], // Ekibastuz -> Astana
    [[51.1693, 71.4491], [53.2167, 63.6333]], // Astana -> Kostanay
    [[52.3000, 76.9500], [51.7200, 75.3200]], // Pavlodar -> Ekibastuz
    [[51.7200, 75.3200], [49.8047, 73.0860]], // Ekibastuz -> Karaganda
    [[49.8047, 73.0860], [43.2389, 76.8897]], // Karaganda -> Almaty
    [[47.0908, 51.9168], [43.6480, 51.1720]], // Atyrau -> Aktau (Western Link)
  ];

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-[#F4F6FA] text-[#1A2330]">
      {/* 2. BREADCRUDS WITH FRESHNESS CHIP */}
      <div className="h-14 bg-white border-b border-[#E2E7EF] px-5 flex items-center justify-between shrink-0 select-none shadow-sm z-10">
        <div className="flex items-center gap-3">
          <div className="text-[12px] font-black uppercase text-[#0F1722] tracking-wider">
            {tLabel('ACT I-B · NATIONAL ENERGY GRID — SITUATIONAL AWARENESS', '第一幕乙 · 全国骨干网络状态感知与安全合规态势地图')}
          </div>
          <div className="h-4 w-[1px] bg-[#E2E7EF]" />
          <div className="text-[11px] text-[#6A7686] flex items-center gap-1.5 font-medium">
            <span onClick={() => navigate('/minister/dashboard')} className="hover:text-[#2D6CDF] cursor-pointer">
              {tLabel('← Minister KPI Dashboard', '← 回到国家级安全 dashboard')}
            </span>
            <span>/</span>
            <span className="text-[#0F1722] font-semibold">{tLabel('Real-Time National Map', '全疆实时大地图')}</span>
          </div>
        </div>

        {/* 3-layer data freshness schema requested in prompt */}
        <div className="bg-[#FAFBFD] border border-[#2D6CDF]/20 text-[10px] rounded p-1 flex items-center gap-6 select-text max-w-[500px]">
          <div className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2FA862]" />
            <strong className="text-[#0F1722]">Telemetry:</strong> <span className="text-[#6A7686] font-mono">&lt;1s capable</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E89518]" />
            <strong className="text-[#0F1722]">SCADA:</strong> <span className="text-[#6A7686] font-mono">15-min cycle</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2D6CDF] animate-pulse" />
            <strong className="text-[#0F1722]">AI Infer:</strong> <span className="text-[#6A7686] font-mono">continuous (250ms / TimeGPT)</span>
          </div>
        </div>
      </div>

      {/* 3. TOP KPI BAR — 4 SUPERVISORY TILES CARD */}
      <div className="h-[96px] bg-white border-b border-[#E2E7EF] grid grid-cols-4 gap-4 px-6 py-3.5 shrink-0 shadow-sm">
        
        {/* Tile 1 */}
        <div className="bg-[#FAFBFD] border border-border-default rounded px-3.5 py-1.5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-[#6A7686] font-bold uppercase tracking-wider">
              {tLabel('SUPPLY STABILITY INDEX', '国家综合保供稳定度指数')}
            </span>
            <span className="text-[#2FA862] text-[10.5px] font-black uppercase">98.2 / 100</span>
          </div>
          <div className="flex items-baseline justify-between mt-0.5">
            <span className="text-[15px] font-black text-[#0F1722]">↑ +0.4% <span className="text-[10px] text-[#A8B2C0] font-normal font-mono">vs 24h</span></span>
            <span className="text-[9px] text-[#6A7686] font-mono text-right leading-none">
              Power 99.1% · Gas 97.3% · Coal 98.4% · Heating 98.0%
            </span>
          </div>
        </div>

        {/* Tile 2 */}
        <div className="bg-[#D8454C]/5 border border-[#D8454C]/25 rounded px-3.5 py-1.5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-[#D8454C] font-black uppercase tracking-wider">
              {tLabel('HIGH-RISK EVENTS MONITOR', '未决严重安全与物理异动警情')}
            </span>
            <span className="text-[#D8454C] text-[10.5px] font-black uppercase animate-pulse">2 ACTIVE</span>
          </div>
          <div className="flex items-baseline justify-between mt-0.5">
            <span className="text-[15px] font-black text-[#D8454C]">1 CRITICAL · 1 HIGH</span>
            <span className="text-[8.5px] text-[#D8454C] font-mono font-bold">
              Latest: ANO-2026-0512 · Aktau
            </span>
          </div>
        </div>

        {/* Tile 3 */}
        <div className="bg-[#E89518]/5 border border-[#E89518]/25 rounded px-3.5 py-1.5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-[#E89518] font-black uppercase tracking-wider">
              {tLabel('PENDING MINISTER DECISIONS', '待审特批一键干预政务件')}
            </span>
            <span className="text-[#E89518] text-[10.5px] font-black uppercase">5 PENDING</span>
          </div>
          <div className="flex items-baseline justify-between mt-0.5">
            <span className="text-[15px] font-black text-[#E89518]">1.24 BN KZT <span className="text-[10px] font-normal">{tLabel('exposure', '财政敞口')}</span></span>
            <span className="text-[8.5px] text-[#E89518] font-mono font-bold uppercase">
              ⏱ 36H SLA COUNTDOWN
            </span>
          </div>
        </div>

        {/* Tile 4 */}
        <div className="bg-[#2D6CDF]/5 border border-[#2D6CDF]/25 rounded px-3.5 py-1.5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-[#2D6CDF] font-black uppercase tracking-wider">
              {tLabel('AVOIDED LOSS EXPOSURE', 'AI研判提前拦截潜在漏失值')}
            </span>
            <span className="text-[#2D6CDF] text-[10.5px] font-black uppercase">{tLabel('30D ROLLING', '30天滚动估值')}</span>
          </div>
          <div className="flex items-baseline justify-between mt-0.5">
            <span className="text-[15px] font-black text-[#2D6CDF]">75 MMcm <span className="text-[10px] font-normal">{tLabel('gas volume', '天然气等容体积')}</span></span>
            <span className="text-[8.5px] text-[#2D6CDF] font-mono font-bold uppercase">
              ⭐ Equiv ≈ 110M KZT carbon value
            </span>
          </div>
        </div>

      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* CENTER MAP AREA — Palantir minimalist style (react-leaflet) */}
        <div className="flex-1 relative bg-[#FAFAF8] overflow-hidden">
          <MapContainer 
            center={[48.5, 68.0]} 
            zoom={4.3} 
            className="h-full w-full bg-[#FAFAF8]" 
            zoomControl={false}
            attributionControl={false}
            minZoom={3.8}
            maxZoom={7}
          >
            <TileLayer url="https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png" />

            {/* Render 1150kV/500kV electrical backbone */}
            {DUAL_BACKBONE_LINES.map((coords, index) => (
              <Polyline 
                key={index}
                positions={coords as any}
                color="#2D6CDF"
                weight={2.5}
                opacity={0.7}
              />
            ))}

            {/* Map standard nodes */}
            {MAP_NODES.map((n, idx) => {
              let icon = MAP_ICONS.CITY_NORMAL(n.name);
              if (n.type === 'city_star') {
                icon = MAP_ICONS.CITY_STAR(n.name, !!n.isPavlodarStar);
              } else if (n.type === 'thermal') {
                icon = MAP_ICONS.THERMAL;
              } else if (n.type === 'coal') {
                icon = MAP_ICONS.COAL_SQUARE;
              } else if (n.type === 'datacenter') {
                icon = MAP_ICONS.DATA_CENTER_RING;
              } else if (n.type === 'oil') {
                icon = MAP_ICONS.OIL_HEX;
              } else if (n.type === 'refinery') {
                icon = MAP_ICONS.REFINERY_DIAMOND;
              } else if (n.type === 'uranium') {
                icon = MAP_ICONS.URANIUM;
              }

              return (
                <Marker 
                  key={idx} 
                  position={n.coords as any} 
                  icon={icon}
                  eventHandlers={{
                    click: () => {
                      if (n.type === 'datacenter') return;
                      if (n.type === 'thermal') navigate('/warning/timeseries');
                    }
                  }}
                >
                  <Popup className="custom-popup">
                    <div className="p-3 min-w-[200px] font-sans">
                      <div className="text-[12px] font-black text-[#0F1722]">{n.name}</div>
                      <div className="text-[9px] text-[#6A7686] uppercase font-bold mt-0.5">
                        {n.type === 'datacenter' ? tLabel('Future Cluster Hub', '新晋国家电力数字云算力集聚区') : tLabel('National Critical Asset', '国家在册最高级监管资产层级')}
                      </div>
                      <div className="h-[1px] bg-[#E2E7EF] my-2" />
                      <div className="space-y-1.5 text-[11px]">
                        {n.cap && (
                          <div className="flex justify-between">
                            <span className="text-[#6A7686]">{tLabel('Output Capacity', '额定铭牌最大输出')}</span>
                            <span className="font-bold text-[#0F1722]">{n.cap}</span>
                          </div>
                        )}
                        {n.note && (
                          <div className="text-[#2D6CDF] text-[10px] bg-[#2D6CDF]/5 p-1 rounded font-bold">
                            ⚡ {n.note}
                          </div>
                        )}
                        <div className="flex justify-between text-[10px] text-[#A8B2C0] font-mono">
                          <span>LAT: {n.coords[0]}</span>
                          <span>LNG: {n.coords[1]}</span>
                        </div>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              );
            })}

            {/* Pulse overlays indicating Active Warning and Case linkages */}
            {PULSES.map((p, idx) => {
              const pulseIcon = p.type === 'red' ? MAP_ICONS.RED_PULSE(p.name) : MAP_ICONS.AMBER_PULSE(p.name);
              return (
                <Marker 
                  key={`pulse-${idx}`}
                  position={p.coords as any}
                  icon={pulseIcon}
                  eventHandlers={{
                    click: () => {
                      if (p.route) navigate(p.route);
                    }
                  }}
                >
                  <Popup className="custom-popup">
                    <div className="p-2.5 min-w-[180px]">
                      <div className="text-[12px] font-bold text-[#D8454C]">{p.alert}</div>
                      <div className="text-[10px] text-[#0F1722] font-semibold mt-1">{p.name}</div>
                      <div className="text-[9.5px] text-[#6A7686] mt-0.5 leading-tight">
                        {tLabel('Click to drill into multivariable AI early warning console', '点击大地图红点一键下钻至四分段预测高频时序图（ACT II 早期预警）')}
                      </div>
                    </div>
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>

          {/* Map Controls Floating Legend Panel */}
          <div className="absolute bottom-6 right-6 z-[1000] w-60 bg-white shadow-2xl rounded border border-[#E2E7EF] p-4 flex flex-col gap-3.5 select-none text-[11px] font-sans">
            <div className="text-[10px] font-black text-[#0F1722] border-b border-[#E2E7EF] pb-1.5 uppercase tracking-wider">
              {tLabel('MAP METADATA LEGEND', '高安全合规级地图图例说明')}
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2.5">
                <span className="text-[#0F1722] text-[12px] font-bold">▲</span>
                <span className="text-[#6A7686]">{tLabel('Thermal Power Station', '火力发电厂核心站房')}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="w-2.5 h-2.5 bg-[#E89518] rounded-full border border-white shadow-sm" />
                <span className="text-[#6A7686]">{tLabel('Substation (KEGOC Grid)', '超级高压枢纽变电站')}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="w-3 h-3 bg-[#FF6B35] polygon-hex" />
                <span className="text-[#6A7686]">{tLabel('High-output Oil Well', '高产油气井及采矿区')}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="w-3 h-3 bg-[#00A6D6] polygon-hex" />
                <span className="text-[#6A7686]">{tLabel('Gas Production Facility', '天然气集输加压站房')}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="w-2.5 h-2.5 bg-black border border-white shadow-sm" />
                <span className="text-[#6A7686]">{tLabel('Bogatyr/Vostochny Mine', '埃基巴斯图兹露天煤矿场')}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="w-2.5 h-2.5 bg-[#8B4513] rotate-45 border border-white" />
                <span className="text-[#6A7686]">{tLabel('Refinery / Downstream', '二级化学烃提炼催化厂')}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="w-2.5 h-2.5 bg-[#2FA862] border border-white rounded-full" />
                <span className="text-[#6A7686]">{tLabel('Uranium Mill Sites', '国家战略天然铀井口')}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="w-4 h-4 rounded-full border-2 border-[#D4A845] flex items-center justify-center bg-white/50">
                  <div className="w-1 h-1 bg-[#D4A845] rounded-full"></div>
                </div>
                <span className="text-[#D4A845] font-black">{tLabel('Planned Data Center Hub', '规划算力集群联动算机中心')}</span>
              </div>
            </div>

            <div className="border-t border-[#E2E7EF] pt-2 text-[10px] text-[#A8B2C0] leading-tight">
              {tLabel('★ National / Region Capital. High-density nodes shown around Pavlodar Coal Corridor.', '★ 首都及省府级战略锚标记。巴甫洛达尔及埃基巴斯图兹大型资源输运带高敏聚集网覆盖。')}
            </div>
          </div>
        </div>

        {/* RIGHT RAIL — RISK EVENT FEED */}
        <div className={cn(
          "border-l border-[#E2E7EF] bg-white flex flex-col overflow-hidden shrink-0 transition-all duration-300",
          rightRailCollapsed ? "w-11" : "w-[340px]"
        )}>
          {/* Collapse handle bar */}
          <div className="h-11 bg-[#FAFBFD] border-b border-[#E2E7EF] px-3.5 flex items-center justify-between shrink-0 select-none">
            {!rightRailCollapsed && (
              <span className="text-[11px] font-black uppercase text-[#0F1722] tracking-wider">
                {tLabel('RISK EVENT FEED · TODAY', '今日国家级风险事件告警列表')}
              </span>
            )}
            <button 
              onClick={() => setRightRailCollapsed(!rightRailCollapsed)}
              className="text-[#6A7686] hover:text-[#0F1722] ml-auto"
            >
              {rightRailCollapsed ? '◀' : '▶'}
            </button>
          </div>

          {!rightRailCollapsed && (
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5 custom-scrollbar bg-slate-50/30">
              
              {/* Event 1 (MAIN LINK) */}
              <div className="border border-[#D8454C]/40 bg-[#D8454C]/5 p-3 rounded shadow-sm text-[11px]">
                <div className="flex items-center justify-between font-mono font-bold text-[#D8454C] text-[9.5px]">
                  <span>🚨 CRITICAL · 14:28</span>
                  <span>ANO-2026-0512</span>
                </div>
                <div className="font-bold text-[#0F1722] mt-1.5 text-[11px] hover:text-[#2D6CDF] cursor-pointer" onClick={() => navigate('/warning/timeseries')}>
                  {tLabel('Pipeline Throughput Deviating from LLM Confidence Band', '燃气通过速率严重违规偏离大分子时序自适应基线带')}
                </div>
                <div className="text-[#6A7686] mt-1">
                  Aktau · GCS-001 · 92% breach risk 48H · Overproduction scenario
                </div>
                <div className="flex justify-end gap-2 mt-2 pt-1 border-t border-red-100 font-mono text-[9px]">
                  <span onClick={() => navigate('/warning/timeseries')} className="text-[#2D6CDF] font-bold cursor-pointer">
                    {tLabel('View Detail →', '详细分析数据链 →')}
                  </span>
                </div>
              </div>

              {/* Event 2 */}
              <div className="border border-[#D8454C]/20 bg-[#D8454C]/5 p-3 rounded text-[11px]">
                <div className="flex items-center justify-between font-mono text-[#D8454C] text-[9.5px]">
                  <span>🚨 CRITICAL · 13:15</span>
                  <span>ENT-0091</span>
                </div>
                <div className="font-bold text-[#0F1722] mt-1.5 cursor-pointer" onClick={() => navigate('/warning/enterprise/ENT-KZ-AKT-0091')}>
                  {tLabel('Western Caspian Energy — High-Risk Pattern Match', '西里海能源有限责任公司一物理多维合同漏判警示')}
                </div>
                <div className="text-[#6A7686] mt-1">
                  Pattern similarity 0.87 to overproduction; financial anomalous flow
                </div>
                <div className="flex justify-end gap-2 mt-2 pt-1 border-t border-red-100 font-mono text-[9px]">
                  <span onClick={() => navigate('/warning/enterprise/ENT-KZ-AKT-0091')} className="text-[#2D6CDF] font-bold cursor-pointer">
                    {tLabel('Commercial Graph →', '穿透关联穿件图 →')}
                  </span>
                </div>
              </div>

              {/* Event 3 */}
              <div className="border border-[#E89518]/30 bg-[#E89518]/5 p-3 rounded text-[11px]">
                <div className="flex items-center justify-between font-mono text-[#E89518] text-[9.5px]">
                  <span>⚠️ WARNING · 11:42</span>
                  <span>GRES-1</span>
                </div>
                <div className="font-bold text-[#0F1722] mt-1.5">
                  {tLabel('Pavlodar GRES-1 Coal Consumption Drift', '巴甫洛达尔 GRES-1 号火力发电机组耗煤异常飙偏')}
                </div>
                <div className="text-[#6A7686] mt-1">
                  +2.1σ above 90-day baseline; risk of inferior mixed coal detected
                </div>
              </div>

              {/* Event 4 */}
              <div className="border border-[#E89518]/30 bg-[#E89518]/5 p-3 rounded text-[11px]">
                <div className="flex items-center justify-between font-mono text-[#E89518] text-[9.5px]">
                  <span>⚠️ WARNING · 10:08</span>
                  <span>ATY-REF-01</span>
                </div>
                <div className="font-bold text-[#0F1722] mt-1.5">
                  {tLabel('Atyrau Refinery Emissions Exceedance Warning', '阿特劳提纯精炼裂化厂二氧化硫黑度超限警预')}
                </div>
                <div className="text-[#6A7686] mt-1">
                  68% probability of permanent administrative fine within 72H
                </div>
              </div>

              {/* Event 5 */}
              <div className="border border-border-default bg-[#FAFBFD] p-3 rounded text-[11px]">
                <div className="flex items-center justify-between font-mono text-[#6A7686] text-[9.5px]">
                  <span>⚠️ WARNING · 09:30</span>
                  <span>KEGOC-220</span>
                </div>
                <div className="font-bold text-[#0F1722] mt-1.5">
                  {tLabel('KEGOC 220 kV Line Imbalance', '国家电网 KEGOC 三相线相电压瞬时倾斜偏差')}
                </div>
                <div className="text-[#6A7686] mt-1">
                  Line imbalances detected corridor wide over peak margin
                </div>
              </div>

              {/* Event 6 */}
              <div className="border border-border-default bg-[#FAFBFD] p-3 rounded text-[11px]">
                <div className="flex items-center justify-between font-mono text-[#6A7686] text-[9.5px]">
                  <span>ℹ️ INFO · 08:15</span>
                  <span>MANGYSTAU</span>
                </div>
                <div className="font-bold text-[#0F1722] mt-1.5">
                  {tLabel('Mangystau SCADA Data Delay (3 sites)', '曼吉斯套地方遥测传感器信道时钟延迟')}
                </div>
                <div className="text-[#6A7686] mt-1">
                  3 SCADA terminal switches reporting lag &gt;30min; routing check
                </div>
              </div>

              {/* Event 7 */}
              <div className="border border-border-default bg-white p-3 rounded text-[11px]">
                <div className="flex items-center justify-between font-mono text-[#A8B2C0] text-[9.5px]">
                  <span>ℹ️ INFO · 07:00</span>
                  <span>SYSTEM</span>
                </div>
                <div className="font-bold text-[#6A7686] mt-1">
                  {tLabel('Routine Compliance Scan Complete', '全疆 1,247 家持证能源主体拉网巡检索定完毕')}
                </div>
                <div className="text-[#A8B2C0] mt-0.5">
                  1,247 enterprises scanned · 0 new high-risk anomalies detected
                </div>
              </div>

            </div>
          )}
        </div>
      </div>

      {/* 4. BOTTOM PIPELINE STATUS BAR */}
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
