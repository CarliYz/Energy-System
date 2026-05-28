import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, GeoJSON, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/src/lib/utils';
import { useLanguage } from '../components/LanguageContext';
import { COAL_BASINS } from '../data/coal';
import { 
  Info, AlertTriangle, ChevronRight, Activity, MapPin, Layers, 
  Settings, Award, FileText, CheckCircle, Flame, ShieldAlert, Zap,
  ArrowLeft, Map as MapIcon
} from 'lucide-react';
import { RegionalFacilitiesView } from './RegionalFacilities';

// Custom icons using divIcon for absolute layout control and Palantir white compliance
const createDivIcon = (html: string, size: [number, number] = [16, 16]) => L.divIcon({
  className: 'custom-div-icon',
  html,
  iconSize: size,
  iconAnchor: [size[0] / 2, size[1] / 2]
});

const MAP_ICONS = {
  CITY_STAR: (name: string, highlighted = false, extraLabel = '') => createDivIcon(`
    <div class="flex flex-col items-center" style="z-index: 10000 !important">
      <div class="w-4 h-4 rounded-full bg-white border-2 ${highlighted ? 'border-[#D4A845] scale-[1.3]' : 'border-[#2D6CDF]'} flex items-center justify-center shadow-lg relative">
        <span class="text-[12px] leading-none ${highlighted ? 'text-[#D4A845]' : 'text-[#2D6CDF]'}" style="transform: translateY(-0.5px)">★</span>
      </div>
      <div class="mt-1 text-[8.5px] font-black text-slate-900 bg-white border border-[#E2E7EF] px-1.5 py-0.5 rounded uppercase tracking-wider whitespace-nowrap shadow-md">
        ${name}
      </div>
      ${extraLabel ? `<div class="mt-0.5 text-[7px] font-extrabold text-[#D4A845] bg-[#FAF8F5] border border-[#D4A845]/40 px-1 rounded uppercase tracking-tighter whitespace-nowrap shadow-sm">★ ${extraLabel}</div>` : ''}
    </div>`, [160, 50]),
  
  CITY_NORMAL: (name: string) => createDivIcon(`
    <div class="flex flex-col items-center" style="z-index: 5000 !important">
      <div class="w-2.5 h-2.5 bg-white border-2 border-[#6A7686] rounded-full shadow-md"></div>
      <div class="mt-0.5 text-[8px] font-bold text-[#6A7686] bg-white/75 px-1 rounded uppercase tracking-wider whitespace-nowrap">
        ${name}
      </div>
    </div>`, [60, 30]),

  THERMAL: createDivIcon('<div class="w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-b-[8px] border-b-[#0F1722] drop-shadow-sm"></div>', [10, 10]),
  SUBSTATION: createDivIcon('<div class="w-2 h-2 bg-[#E89518] border border-white rounded-full shadow-md"></div>', [8, 8]),
  OIL_HEX: createDivIcon('<div class="w-2.5 h-2.5 bg-[#FF6B35] rotate-45 border border-[#0F1722]/30"></div>', [10, 10]),
  GAS_HEX: createDivIcon('<div class="w-2.5 h-2.5 bg-[#00A6D6] rotate-45 border border-[#0F1722]/30"></div>', [10, 10]),
  COAL_SQUARE: createDivIcon('<div class="w-2.5 h-2.5 bg-black border border-white shadow-md"></div>', [10, 10]),
  REFINERY_DIAMOND: createDivIcon('<div class="w-2.5 h-2.5 bg-[#8B4513] rotate-45 border border-white"></div>', [10, 10]),
  URANIUM: createDivIcon('<div class="w-2.5 h-2.5 bg-[#2FA862] border border-white rounded-full"></div>', [10, 10]),
  DATA_CENTER_RING: createDivIcon(`
    <div class="w-4 h-4 rounded-full border-2 border-[#D4A845] flex items-center justify-center bg-white/80 animate-spin" style="animation-duration: 3s">
      <div class="w-1.5 h-1.5 bg-[#D4A845] rounded-full"></div>
    </div>`, [16, 16]),

  // Crucial pulses for warning narrative
  RED_PULSE: (label: string) => createDivIcon(`
    <div class="flex flex-col items-center">
      <div class="relative flex h-5 w-5 justify-center items-center">
        <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D8454C] opacity-75"></span>
        <span class="relative inline-flex rounded-full h-3 w-3 bg-[#D8454C]"></span>
      </div>
      <div class="mt-1 text-[8.5px] font-black text-white bg-[#D8454C] px-1.5 py-0.5 rounded uppercase tracking-wider whitespace-nowrap shadow-md">
        ⚠️ ${label}
      </div>
    </div>`, [115, 50]),

  AMBER_PULSE: (label: string) => createDivIcon(`
    <div class="flex flex-col items-center">
      <div class="relative flex h-4 w-4 justify-center items-center">
        <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E89518] opacity-75"></span>
        <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#E89518]"></span>
      </div>
      <div class="mt-1 text-[8px] font-black text-white bg-[#E89518] px-1 py-0.5 rounded uppercase tracking-wider whitespace-nowrap shadow-md">
        ⚡ ${label}
      </div>
    </div>`, [110, 45]),
};

const ACTIVE_CASES = [
  { 
    id: 'CASE-2026-001', 
    anomalyId: 'ANO-2026-0512', 
    severity: 'CRITICAL',
    title_en: 'Western Caspian · GCS-001 · Unrep. Capacity Build',
    title_zh: '第一西里海能源 · GCS-001 · 体外擅自增设特种辅助设施案',
    exposure: '1.24B KZT',
    steps: { build: 'done', trigger: 'done', attribute: 'in_progress' } 
  },
  { 
    id: 'CASE-2026-002', 
    anomalyId: 'ANO-2026-0489', 
    severity: 'HIGH',
    title_en: 'Atyrau Refinery · Emissions Exceedance Pattern',
    title_zh: '阿特劳提纯精炼分裂化厂 · 二氧化硫黑烟超限事件案',
    exposure: '420M KZT',
    steps: { build: 'done', trigger: 'in_progress', attribute: 'pending' } 
  },
  { 
    id: 'CASE-2026-003', 
    anomalyId: 'ANO-2026-0501', 
    severity: 'HIGH',
    title_en: 'KEGOC 220kV · 3-Phase Imbalance Recurrence',
    title_zh: '国家电网 KEGOC · 双中回路平衡度违规运行事件案',
    exposure: '260M KZT',
    steps: { build: 'done', trigger: 'done', attribute: 'done' } 
  },
  { 
    id: 'CASE-2026-004', 
    anomalyId: 'ANO-2026-0476', 
    severity: 'MED',
    title_en: 'Pavlodar GRES-1 · Coal Consumption Drift +2.1σ',
    title_zh: '巴甫洛达尔 GRES-1 号 · 实测炉膛耗煤量异常跑高案',
    exposure: '175M KZT',
    steps: { build: 'in_progress', trigger: 'pending', attribute: 'pending' } 
  },
  { 
    id: 'CASE-2026-005', 
    anomalyId: 'ANO-2026-0445', 
    severity: 'MED',
    title_en: 'Mangystau SCADA · 3 sites delayed >30min',
    title_zh: '曼吉斯套地方遥测单元 · 心跳丢包与通信延迟过高案',
    exposure: '32M KZT',
    steps: { build: 'done', trigger: 'pending', attribute: 'pending' } 
  },
];

export default function NationalGrid() {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [view, setView] = useState<'national' | 'regional'>('national');
  const [activeRegion, setActiveRegion] = useState<string>('aktau');
  const [activeLayer, setActiveLayer] = useState<'ELEC' | 'OG' | 'COAL'>('ELEC');
  const [rightRailCollapsed, setRightRailCollapsed] = useState(false);
  const [geoData, setGeoData] = useState<any>(null);
  const [transitioning, setTransitioning] = useState(false);
  
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

  useEffect(() => {
    fetch('https://raw.githubusercontent.com/johan/world.geo.json/master/countries/KAZ.geo.json')
      .then(r => r.json())
      .then(setGeoData)
      .catch(err => console.error('KAZ boundary load failed:', err));
  }, []);

  useEffect(() => {
    setTransitioning(true);
    const t = setTimeout(() => setTransitioning(false), 150);
    return () => clearTimeout(t);
  }, [activeLayer]);

  const handleCityClick = (cityId: string) => {
    const idMap: any = {
      'astana': 'astana',
      'pavlodar': 'pavlodar',
      'almaty': 'almaty',
      'aktobe': 'aktobe',
      'karaganda': 'karaganda',
      'shymkent': 'shymkent',
      'atyrau': 'atyrau',
      'aktau': 'aktau',
      'ekibastuz': 'ekibastuz',
      'oskemen': 'oskemen',
      'kostanay': 'kostanay',
      'semey': 'semey',
      'taraz': 'taraz',
      'taldykorgan': 'taldykorgan',
      'kyzylorda': 'kyzylorda'
    };
    const routeId = idMap[cityId.toLowerCase()] || 'aktau';
    if (routeId === 'aktau') {
      setActiveRegion('aktau');
      setView('regional');
    } else {
      navigate(`/sensing/regional/${routeId}`);
    }
  };

  // Static always-on city assets
  const CITY_NODES = [
    { id: 'astana', name: tLabel('Astana', '阿斯塔纳'), coords: [51.1693, 71.4491], isCapital: true, isStar: true },
    { id: 'pavlodar', name: tLabel('Pavlodar', '巴甫洛达尔'), coords: [52.3000, 76.9500], isPavlodarStar: true, isStar: true },
    { id: 'almaty', name: tLabel('Almaty', '阿拉木图'), coords: [43.2389, 76.8897], isStar: false },
    { id: 'aktobe', name: tLabel('Aktobe', '阿克托别'), coords: [50.2833, 57.1667], isStar: false },
    { id: 'karaganda', name: tLabel('Karaganda', '卡拉干达'), coords: [49.8047, 73.0860], isStar: false },
    { id: 'shymkent', name: tLabel('Shymkent', '奇姆肯特'), coords: [42.3000, 69.6000], isStar: false },
    { id: 'atyrau', name: tLabel('Atyrau', '阿特劳'), coords: [47.0908, 51.9168], isStar: false },
    { id: 'aktau', name: tLabel('Aktau', '阿克套'), coords: [43.6480, 51.1720], isStar: false },
    { id: 'ekibastuz', name: tLabel('Ekibastuz', '埃基巴斯图兹'), coords: [51.7200, 75.3200], isStar: true, isEkibastuzStar: true },
    { id: 'oskemen', name: tLabel('Oskemen', '奥斯卡曼'), coords: [49.9500, 82.6167], isStar: false },
    { id: 'kostanay', name: tLabel('Kostanay', '科斯塔奈'), coords: [53.2167, 63.6333], isStar: false },
    { id: 'semey', name: tLabel('Semey', '塞梅伊'), coords: [50.4111, 80.2275], isStar: false },
    { id: 'taraz', name: tLabel('Taraz', '塔拉兹'), coords: [42.9000, 71.3667], isStar: false },
    { id: 'taldykorgan', name: tLabel('Taldykorgan', '塔尔迪库尔干'), coords: [45.0167, 78.3667], isStar: false },
    { id: 'kyzylorda', name: tLabel('Kyzylorda', '克孜勒奥尔达'), coords: [44.8500, 65.5000], isStar: false }
  ];

  const ELECTRICITY_NODES = [
    // Substation (orange dots, 14 nodes)
    { id: 'sub-pav', name: 'EKZ-500-PAV Substation', coords: [52.3500, 76.9800], icon: 'SUBSTATION' },
    { id: 'sub-ast', name: 'EKZ-500-AST Substation', coords: [51.2000, 71.5000], icon: 'SUBSTATION' },
    { id: 'sub-kar', name: 'EKZ-500-KAR Substation', coords: [49.8500, 73.1200], icon: 'SUBSTATION' },
    { id: 'sub-alm', name: 'EKZ-500-ALM Substation', coords: [43.3000, 76.9200], icon: 'SUBSTATION' },
    { id: 'sub-atb', name: 'EKZ-500-ATB Substation', coords: [50.3200, 57.2000], icon: 'SUBSTATION' },
    { id: 'sub-shy', name: 'EKZ-500-SHY Substation', coords: [42.3500, 69.6400], icon: 'SUBSTATION' },
    { id: 'sub-atr', name: 'EKZ-500-ATR Substation', coords: [47.1200, 51.9500], icon: 'SUBSTATION' },
    { id: 'sub-akt', name: 'EKZ-500-AKT Substation', coords: [43.6800, 51.2200], icon: 'SUBSTATION' },
    { id: 'sub-eki', name: 'EKZ-500-EKI Substation', coords: [51.7400, 75.3600], icon: 'SUBSTATION' },
    { id: 'sub-kos', name: 'EKZ-500-KOS Substation', coords: [53.2500, 63.6800], icon: 'SUBSTATION' },
    { id: 'sub-osk', name: 'EKZ-500-OSK Substation', coords: [49.9800, 82.6600], icon: 'SUBSTATION' },
    { id: 'sub-sem', name: 'EKZ-500-SEM Substation', coords: [50.4500, 80.2800], icon: 'SUBSTATION' },
    { id: 'sub-tar', name: 'EKZ-500-TAR Substation', coords: [42.9500, 71.4000], icon: 'SUBSTATION' },
    { id: 'sub-kyz', name: 'EKZ-500-KYZ Substation', coords: [44.8900, 65.5400], icon: 'SUBSTATION' },
    
    // Thermal Plants (black triangles)
    { id: 'plant-gres1', name: 'Ekibastuz GRES-1 (4000 MW)', coords: [51.7800, 75.3800], icon: 'THERMAL', cap: '4000 MW' },
    { id: 'plant-gres2', name: 'Ekibastuz GRES-2', coords: [51.8500, 75.4500], icon: 'THERMAL', cap: '1000 MW' },
    { id: 'plant-aksu', name: 'Aksu Power Station', coords: [52.0500, 76.9000], icon: 'THERMAL', cap: '2100 MW' },
    { id: 'plant-kar', name: 'Karaganda TPP', coords: [49.8200, 73.1500], icon: 'THERMAL', cap: '650 MW' },
    { id: 'plant-alm', name: 'Almaty CHP-2', coords: [43.2500, 76.8500], icon: 'THERMAL', cap: '510 MW' },
    { id: 'plant-atr', name: 'Atyrau CHP', coords: [47.1000, 51.9000], icon: 'THERMAL', cap: '415 MW' },
    
    // Renewable (green dots)
    { id: 'wind-sary', name: 'Saryarka Wind Farm', coords: [50.1000, 72.8000], icon: 'URANIUM' },
    { id: 'wind-erey', name: 'Ereymentau Wind', coords: [51.6000, 73.1000], icon: 'URANIUM' },
    { id: 'solar-burn', name: 'Burnoye Solar', coords: [42.8000, 70.9000], icon: 'URANIUM' },
    { id: 'solar-kap', name: 'Kapshagay Solar', coords: [43.8000, 77.1500], icon: 'URANIUM' }
  ];

  const OG_NODES = [
    // Oil Fields (orange hexagons)
    { id: 'oil-tengiz', name: 'Tengiz Oil Field', coords: [46.1200, 53.4000], icon: 'OIL_HEX' },
    { id: 'oil-kashagan', name: 'Kashagan Offshore Field', coords: [46.8500, 51.5500], icon: 'OIL_HEX' },
    { id: 'oil-karachaganak', name: 'Karachaganak Field', coords: [51.2000, 53.0000], icon: 'OIL_HEX' },
    { id: 'oil-uzen', name: 'Uzen Oil Complex', coords: [43.3000, 52.8300], icon: 'OIL_HEX' },
    { id: 'oil-kalamkas', name: 'Kalamkas Field', coords: [45.1800, 51.6500], icon: 'OIL_HEX' },
    { id: 'oil-buzachi', name: 'Buzachi Complex', coords: [45.4000, 52.1000], icon: 'OIL_HEX' },
    
    // Gas Fields (cyan hexagons)
    { id: 'gas-amangeldy', name: 'Amangeldy Gas Field', coords: [44.0500, 70.4000], icon: 'GAS_HEX' },
    { id: 'gas-pridor', name: 'Pridorozhnoye Gas Field', coords: [44.9000, 68.2000], icon: 'GAS_HEX' },
    { id: 'gas-uritau', name: 'Uritau Gas Site', coords: [49.1000, 57.5000], icon: 'GAS_HEX' },
    { id: 'gas-ima', name: 'Imashevskoye Gas Field', coords: [46.7000, 49.3000], icon: 'GAS_HEX' },
    { id: 'gas-aksha', name: 'Akshabulak Field', coords: [45.9000, 65.8000], icon: 'GAS_HEX' },
    
    // Compressor Stations
    { id: 'comp-atyr', name: 'GCS-002 Atyrau', coords: [47.1500, 51.8500], icon: 'SUBSTATION' },
    { id: 'comp-kyz', name: 'GCS-003 Kyzylorda', coords: [44.8800, 65.4500], icon: 'SUBSTATION' },
    { id: 'comp-bey', name: 'GCS-004 Beyneu', coords: [45.3200, 55.1800], icon: 'SUBSTATION' },
    { id: 'comp-teng', name: 'GCS-005 Tengiz', coords: [46.2000, 53.3500], icon: 'SUBSTATION' },
    { id: 'comp-kar', name: 'GCS-006 Karachaganak', coords: [51.2500, 53.0500], icon: 'SUBSTATION' },
    { id: 'comp-ima', name: 'GCS-007 Imashevskoye', coords: [46.7500, 49.3500], icon: 'SUBSTATION' },
    { id: 'comp-[#D4A845]', name: 'GCS-008 Astana Gas Ring', coords: [51.1500, 71.4000], icon: 'SUBSTATION' },
    
    // Refineries
    { id: 'ref-atyrau', name: 'Atyrau Refinery Complex', coords: [47.1100, 52.0200], icon: 'REFINERY_DIAMOND' },
    { id: 'ref-pav', name: 'Pavlodar Refinery Site', coords: [52.2800, 76.9200], icon: 'REFINERY_DIAMOND' },
    { id: 'ref-shym', name: 'Shymkent Refinery', coords: [42.3200, 69.6200], icon: 'REFINERY_DIAMOND' },
    
    // Terminals
    { id: 'term-aktau', name: 'Aktau Deep-Sea Terminal', coords: [43.6200, 51.1500], icon: 'REFINERY_DIAMOND' },
    { id: 'term-atyr', name: 'Atyrau Terminal Block', coords: [47.0500, 51.9800], icon: 'REFINERY_DIAMOND' },
    { id: 'term-kuryk', name: 'Kuryk Loading Port', coords: [43.1500, 51.6500], icon: 'REFINERY_DIAMOND' },
    { id: 'term-casp', name: 'Caspian Pipeline Marine Terminal', coords: [46.6000, 51.2000], icon: 'REFINERY_DIAMOND' }
  ];

  const COAL_NODES = [
    // Coal Mines (black squares)
    { id: 'coal-bogatyr', name: 'Bogatyr Open-Cast Mine', coords: [51.6800, 75.1000], icon: 'COAL_SQUARE' },
    { id: 'coal-vos', name: 'Vostochny Open-Cast Mine', coords: [51.6400, 75.2500], icon: 'COAL_SQUARE' },
    { id: 'coal-shub', name: 'Shubarkol Mine Basin', coords: [48.8000, 68.6000], icon: 'COAL_SQUARE' },
    { id: 'coal-shakh', name: 'Shakhtinsk Underground Complex', coords: [49.8000, 72.5800], icon: 'COAL_SQUARE' },
    { id: 'coal-maik', name: 'Maikuben Open-Cast Mine', coords: [51.2500, 75.8000], icon: 'COAL_SQUARE' },
    
    // Coal-fired Plants
    { id: 'coalplant-1', name: 'Ekibastuz GRES-1 (4000 MW)', coords: [51.7800, 75.3800], icon: 'THERMAL' },
    { id: 'coalplant-2', name: 'Ekibastuz GRES-2', coords: [51.8500, 75.4500], icon: 'THERMAL' },
    { id: 'coalplant-3', name: 'Aksu Power Station', coords: [52.0500, 76.9000], icon: 'THERMAL' },
    { id: 'coalplant-4', name: 'Karaganda TPP', coords: [49.8200, 73.1500], icon: 'THERMAL' },
    
    // Uranium Mines
    { id: 'uran-inkai', name: 'Inkai Uranium Site', coords: [45.1000, 67.8000], icon: 'URANIUM' },
    { id: 'uran-tort', name: 'Tortkuduk Exploration Block', coords: [45.3000, 67.2000], icon: 'URANIUM' },
    { id: 'uran-buden', name: 'Budenovskoye Mine Hub', coords: [44.7500, 67.4500], icon: 'URANIUM' },
    
    // Future Data Centers
    { id: 'dc-pav', name: 'Pavlodar AI Data Center Cluster', coords: [52.2800, 76.8500], icon: 'DATA_CENTER_RING' },
    { id: 'dc-eki', name: 'Ekibastuz Direct-Link Data Center', coords: [51.7300, 75.3500], icon: 'DATA_CENTER_RING' }
  ];

  // Transmission line vector sets in KZ
  const ELEC_LINES_1150 = [
    [[51.7200, 75.3200], [51.1693, 71.4491]], // Ekibastuz -> Astana
    [[51.1693, 71.4491], [53.2167, 63.6333]], // Astana -> Kostanay
    [[53.2167, 63.6333], [55.0000, 61.5000]], // Kostanay -> Russia border
  ];

  const ELEC_LINES_500 = [
    [[52.3000, 76.9500], [51.7200, 75.3200]], // Ekibastuz-Pavlodar
    [[51.7200, 75.3200], [49.8047, 73.0860]], // Ekibastuz-Karaganda
    [[49.8047, 73.0860], [43.2389, 76.8897]], // Karaganda-Almaty
    [[42.3000, 69.6000], [42.9000, 71.3667]], // Shymkent-Taraz
    [[42.9000, 71.3667], [43.2389, 76.8897]], // Taraz-Almaty
    [[44.8500, 65.5000], [42.3000, 69.6000]], // Kyzylorda-Shymkent
    [[50.2833, 57.1667], [47.0908, 51.9168]], // Aktobe-Atyrau
    [[47.0908, 51.9168], [43.6480, 51.1720]], // Atyrau-Aktau
  ];

  const ELEC_LINES_220 = [
    [[51.7800, 75.3800], [51.8500, 75.4500]],
    [[52.0500, 76.9000], [52.3000, 76.9500]],
    [[50.1000, 72.8000], [49.8047, 73.0860]],
    [[51.6000, 73.1000], [51.1693, 71.4491]],
    [[42.8000, 70.9000], [42.9000, 71.3667]],
    [[43.8000, 77.1500], [43.2389, 76.8897]],
  ];

  const PIPELINES_OIL = [
    [[47.0908, 51.9168], [51.0000, 48.0000]], // Atyrau-Samara
    [[47.0908, 51.9168], [49.1200, 57.6000], [46.0100, 65.5000], [48.7000, 71.7000], [45.2000, 82.5000]], // KCP pipeline
  ];

  const PIPELINES_GAS = [
    [[45.3200, 55.1800], [42.3000, 69.6000], [42.9000, 71.3667], [42.5000, 75.0000]], // Turkmenistan-China
    [[43.3000, 52.8300], [45.3200, 55.1800], [47.0908, 51.9168], [49.0000, 47.0000]], // CAC gas pipeline
    [[45.3200, 55.1800], [47.8000, 59.6000], [44.8500, 65.5000], [42.3000, 69.6000]]  // Domestic link
  ];

  const COAL_RAIL_LINES = [
    [[51.7200, 75.3200], [54.5000, 73.0000]],
    [[51.7200, 75.3200], [51.1693, 71.4491]],
    [[49.8047, 73.0860], [46.8500, 74.9800], [42.3000, 69.6000]],
    [[52.3000, 76.9500], [50.4111, 80.2275], [51.1000, 81.2000]],
    [[48.8000, 68.6000], [49.8047, 73.0860]],
  ];

  // Map layer-conditional custom warning pulses
  const activePulses = [
    {
      layer: 'OG',
      type: 'red',
      name: tLabel('Aktau GCS-001 Station', '曼吉斯套储配首站 GCS-001'),
      coords: [43.6480, 51.1720],
      alert: 'CASE-2026-001 · 92% breach 48H',
      route: '/warning/timeseries/ANO-2026-0512'
    },
    {
      layer: 'ELEC',
      type: 'red',
      name: tLabel('Aktau GCS-001 Station', '曼吉斯套储配首站 GCS-001'),
      coords: [43.6480, 51.1720],
      alert: 'CASE-2026-001 · 92% breach 48H',
      route: '/warning/timeseries/ANO-2026-0512'
    },
    {
      layer: 'ELEC',
      type: 'amber',
      name: tLabel('Pavlodar GRES-1 Complex', '巴甫洛达尔 GRES-1 化工电厂'),
      coords: [51.7800, 75.3800],
      alert: 'Coal consumption +2.1σ above baseline'
    },
    {
      layer: 'COAL',
      type: 'amber',
      name: tLabel('Pavlodar GRES-1 Complex', '巴甫洛达尔 GRES-1 化工电厂'),
      coords: [51.7800, 75.3800],
      alert: 'Coal consumption +2.1σ above baseline'
    },
    {
      layer: 'OG',
      type: 'amber',
      name: tLabel('Atyrau Refinery Site', '阿特劳烷基化炼油厂'),
      coords: [47.1100, 52.0200],
      alert: 'Emissions 3-day approach threshold'
    }
  ];

  const RISK_EVENTS = [
    {
      id: 'ANO-2026-0512',
      layer: 'OG',
      severity: 'CRITICAL',
      time: '14:28',
      title_en: 'Pipeline Throughput Deviating from adapt confidence band',
      title_zh: '燃气输运速率偏离自适应早期预警基线阀',
      desc_en: 'Aktau · GCS-001 · 92% breach risk 48H · Unreported Cap. Expansion',
      desc_zh: '阿克套一级增压分配首站体外违规增设特种辅助设施 · 48H超额超产风险92%',
      route: '/warning/timeseries/ANO-2026-0512'
    },
    {
      id: 'ENT-0091',
      layer: 'OG',
      severity: 'CRITICAL',
      time: '13:15',
      title_en: 'Western Caspian Energy — High-Risk Pattern Match',
      title_zh: '第一西里海能源合资有限责任公司 — 物理多维生产行为漏判警示',
      desc_en: 'Pattern similarity 0.87 to overproduction; financial anomalous flow',
      desc_zh: '西里海能源 · 阿克套一级站体外温控与地下流速模式相似度0.87',
      route: '/warning/enterprise/ENT-KZ-AKT-0091'
    },
    {
      id: 'GRES-1',
      layer: 'COAL',
      severity: 'WARNING',
      time: '11:42',
      title_en: 'Pavlodar GRES-1 Coal Consumption Drift',
      title_zh: '巴甫洛达尔 GRES-1 号国家发电机组耗煤异常飙偏',
      desc_en: '+2.1σ above 90-day baseline; risk of inferior mixed coal detected',
      desc_zh: '超出口基准上限+2.1σ；红外热成像光谱指纹扫描识别劣质混煤装炉迹象',
      route: null
    },
    {
      id: 'ATY-REF-01',
      layer: 'OG',
      severity: 'WARNING',
      time: '10:08',
      title_en: 'Atyrau Refinery Emissions Exceedance Warning',
      title_zh: '阿特劳提纯精炼裂化厂二氧化硫黑度超限预警',
      desc_en: '68% probability of permanent administrative fine within 72H',
      desc_zh: '红外遥感和烟气感知抓拍黑烟超标，72H内触发地方环保限纳性顶格扣款率达68%',
      route: null
    },
    {
      id: 'KEGOC-220',
      layer: 'ELEC',
      severity: 'WARNING',
      time: '09:30',
      title_en: 'KEGOC 220 kV Line Imbalance',
      title_zh: '国家电网 KEGOC 三相线相电压瞬时倾斜偏差',
      desc_en: 'Line imbalances detected corridor wide over peak margin',
      desc_zh: '双回路输能带架空线电压不平衡度超标。幅值及阻抗相位飘变超出规程允许值',
      route: null
    },
    {
      id: 'MANGYSTAU',
      layer: 'ELEC',
      severity: 'ELEC',
      time: '08:15',
      title_en: 'Mangystau SCADA Data Delay (3 sites)',
      title_zh: '曼吉斯套地方遥测传感器信道时钟延迟',
      desc_en: '3 SCADA terminal switches reporting lag >30min; routing check',
      desc_zh: '3个远地采集测控单元心跳丢包，部分关键环线瞬时SCADA信差时钟大于30分钟',
      route: null
    },
    {
      id: 'SYSTEM',
      layer: 'ALL',
      severity: 'INFO',
      time: '07:00',
      title_en: 'Routine Compliance Scan Complete',
      title_zh: '全疆 1,247 家持证能源主体拉网巡检索定完毕',
      desc_en: '1,247 enterprises scanned · 0 new high-risk anomalies detected',
      desc_zh: '已完成全天候1,247家煤电机组、增压首站、炼油厂、铀矿井多模态深度审计扫描',
      route: null
    }
  ];

  const filteredEvents = RISK_EVENTS.filter(e =>
    activeLayer === 'ELEC' ? e.layer === 'ELEC' || e.layer === 'ALL' :
    activeLayer === 'OG'   ? e.layer === 'OG'   || e.layer === 'ALL' :
                             e.layer === 'COAL' || e.layer === 'ALL'
  );

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-[#F4F6FA] text-[#1A2330]">
      
      {/* 2. TOP HEADER STRIP (all WHITE, 1px bottom border) */}
      <div className="h-14 bg-white border-b border-[#E2E7EF] px-5 flex items-center justify-between shrink-0 select-none shadow-sm z-10">
        
        {/* Left Side: Label & Breadcrumb Pill */}
        <div className="w-[260px] flex flex-col justify-center">
          <div className="text-[9px] font-extrabold uppercase text-[#6A7686] tracking-widest leading-none mb-1">
            {tLabel('AI STATECRAFT · ENERGY', '国家安全机能 · 决策内舱')}
          </div>
          <div className="flex items-center gap-1">
            <span 
              onClick={() => {
                setView('national');
                navigate('/minister/dashboard');
              }}
              className="text-[10px] font-bold text-[#2D6CDF] bg-[#2D6CDF]/5 hover:bg-[#2D6CDF]/10 border border-[#2D6CDF]/15 px-2 py-0.5 rounded cursor-pointer transition-all uppercase tracking-wider"
            >
              {view === 'national' ? tLabel('Sensing · National Grid', '首层面屏 · 国家大网') : tLabel('Sensing · Regional Drilldown', '下钻面屏 · 区域监控')}
            </span>
          </div>
        </div>

        {/* Center: Page Title and Metadata */}
        <div className="flex-1 text-center flex flex-col justify-center">
          <h1 className="text-[14px] font-black text-[#0F1722] uppercase tracking-wider leading-none mb-1">
            {view === 'national' 
              ? tLabel('NATIONAL ENERGY GRID · LIVE STATUS MONITOR', '国家能源一张网 · 实时状态监测与异常审计大屏')
              : tLabel('AKTAU REGIONAL FACILITY · LIVE STATUS MONITOR', '曼吉斯套 · 阿克套精密物联监测与异常审计大屏')
            }
          </h1>
          <p className="text-[10px] text-[#6A7686] font-mono leading-none flex items-center justify-center gap-3">
            <span>● {view === 'national' ? '12' : '45'} {tLabel('sources connected', '源设备物联接入')}</span>
            <span>•</span>
            <span>{tLabel('last sync 14:32:18', '上次高频安全同步: 今天 14:32:18')}</span>
            <span>•</span>
            <span className="text-[#2FA862] font-bold uppercase animate-pulse">live status</span>
          </p>
        </div>

        {/* Right Side: 3-layer toggle pills or drill-down status */}
        <div className="w-[360px] flex justify-end">
          {view === 'national' ? (
            <div className="flex items-center gap-1 bg-[#F4F6FA] border border-[#E2E7EF] rounded-full p-1 shadow-inner">
              <button
                onClick={() => setActiveLayer('ELEC')}
                className={cn(
                  "px-3 py-1 text-[10px] font-black uppercase tracking-wider rounded-full transition-all flex items-center gap-1.5",
                  activeLayer === 'ELEC'
                    ? "bg-[#2D6CDF] text-white shadow-sm"
                    : "text-[#6A7686] hover:bg-white"
                )}
              >
                <Zap size={10} className="shrink-0" />
                {tLabel('⚡ Electricity', '⚡ 主电网')}
              </button>
              <button
                onClick={() => setActiveLayer('OG')}
                className={cn(
                  "px-3 py-1 text-[10px] font-black uppercase tracking-wider rounded-full transition-all flex items-center gap-1.5",
                  activeLayer === 'OG'
                    ? "bg-[#FF6B35] text-white shadow-sm"
                    : "text-[#6A7686] hover:bg-white"
                )}
              >
                <Flame size={10} className="shrink-0" />
                {tLabel('🔥 Oil & Gas', '🔥 油气网')}
              </button>
              <button
                onClick={() => setActiveLayer('COAL')}
                className={cn(
                  "px-3 py-1 text-[10px] font-black uppercase tracking-wider rounded-full transition-all flex items-center gap-1.5",
                  activeLayer === 'COAL'
                    ? "bg-[#0F1722] text-white shadow-sm"
                    : "text-[#6A7686] hover:bg-white"
                )}
              >
                <ShieldAlert size={10} className="shrink-0" />
                {tLabel('⛏ Coal & Coupling', '⛏ 煤炭直供')}
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-[10.5px] bg-[#D8454C]/5 border border-[#D8454C]/15 px-3 py-1.5 rounded-md text-[#D8454C] font-bold font-mono uppercase shadow-sm">
               <Activity size={12} className="animate-pulse" />
               <span>{tLabel('Telemetry stream active', '里海高密物联遥测接通')}</span>
            </div>
          )}
        </div>

      </div>

      {/* 3. VIEW SWITCHER BAR */}
      <div className="h-10 bg-white border-b border-[#E2E7EF] px-5 flex items-center justify-between shrink-0 select-none z-10 transition-all">
        <div className="flex bg-[#F4F6FA] border border-[#E2E7EF] rounded-md p-0.5 shadow-inner">
          <button
            onClick={() => setView('national')}
            className={cn(
              "px-4 py-1 text-[10.5px] font-black uppercase tracking-wider rounded-md transition-all flex items-center gap-1.5",
              view === 'national' 
                ? "bg-white text-[#0F1722] shadow font-extrabold border border-[#E2E7EF]" 
                : "text-[#6A7686] hover:text-[#0f1722]"
            )}
          >
            <span className={cn("w-1.5 h-1.5 rounded-full bg-[#2D6CDF]", view === 'national' && "animate-pulse")} />
            {tLabel('National Overview', '全国一张网总览')}
          </button>
          
          <button
            onClick={() => {
              setActiveRegion('aktau');
              setView('regional');
            }}
            className={cn(
              "px-4 py-1 text-[10.5px] font-black uppercase tracking-wider rounded-md transition-all flex items-center gap-1.5",
              view === 'regional' 
                ? "bg-white text-[#0F1722] shadow font-extrabold border border-[#E2E7EF]" 
                : "text-[#6A7686] hover:text-[#0f1722]"
            )}
          >
            <span className={cn("w-1.5 h-1.5 rounded-full bg-[#D8454C]", view === 'regional' && "animate-pulse")} />
            {tLabel('Regional Drilldown (Aktau)', '阿克套区域下钻监控')}
          </button>
        </div>

        {view === 'regional' ? (
          <div className="flex items-center gap-3">
             <span className="text-[10px] text-[#A8B2C0] font-mono uppercase tracking-wider">drilldown lock: mangystau / {activeRegion.toUpperCase()}</span>
             <button
               onClick={() => setView('national')}
               className="text-[10px] font-black uppercase tracking-wider text-[#2D6CDF] hover:text-[#0F1722] flex items-center gap-1 font-mono border border-[#E2E7EF] bg-white px-2.5 py-1 rounded shadow-sm"
             >
               ← {tLabel('Back to Macro', '返回全国一张网')}
             </button>
          </div>
        ) : (
          <div className="text-[10px] text-[#6A7686] font-mono">
            {tLabel('Sensing Act III • Macro Energy Infrastructure', '大网态势研判 • 第三幕')}
          </div>
        )}
      </div>

      {view === 'national' ? (
        <>

      {/* 3. TOP KPI BAR — 4 SUPERVISORY TILES CARD */}
      <div className="h-[96px] bg-white border-b border-[#E2E7EF] grid grid-cols-4 gap-4 px-6 py-3.5 shrink-0 shadow-sm z-10">
        
        {/* Tile 1 */}
        <div className="bg-[#FAFBFD] border border-[#E2E7EF] rounded px-3.5 py-1.5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-[#6A7686] font-bold uppercase tracking-wider">
              {tLabel('SUPPLY STABILITY INDEX', '国家综合保供稳定度指数')}
            </span>
            <span className="text-[#2FA862] text-[10.5px] font-black uppercase">98.2 / 100</span>
          </div>
          <div className="flex items-baseline justify-between mt-0.5">
            <span className="text-[15px] font-black text-[#0F1722]">↑ +0.4% <span className="text-[10px] text-[#A8B2C0] font-normal font-mono">vs 24h</span></span>
            <span className="text-[9px] text-[#6A7686] font-mono text-right leading-none">
              Power 99.1% · Gas 97.3% · Coal 98.4%
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
            <span className="text-[15px] font-black text-[#2D6CDF]">75 MMcm <span className="text-[10px] font-normal">{tLabel('gas volume', '燃气等容体积')}</span></span>
            <span className="text-[8.5px] text-[#2D6CDF] font-mono font-bold uppercase">
              ⭐ Equiv ≈ 110M KZT Value
            </span>
          </div>
        </div>

      </div>

      <div className="flex-1 flex overflow-hidden">
        
        {/* LEFT PANEL — Dynamic Energy Mix / Pipeline Flow / Coal Capacity */}
        <div className="w-[300px] border-r border-[#E2E7EF] bg-white flex flex-col shrink-0 select-none z-10 transition-all duration-300">
          <div className="h-11 bg-[#FAFBFD] border-b border-[#E2E7EF] px-3.5 flex items-center shrink-0">
            <span className="text-[11px] font-black uppercase text-[#0F1722] tracking-wider flex items-center gap-1.5">
              <Layers size={12} className="text-[#2D6CDF]" />
              {activeLayer === 'ELEC' && tLabel('Electricity Infrastructure', '电力基础设施与供应比例')}
              {activeLayer === 'OG' && tLabel('Oil & Gas Core Flow', '油气总流通量与外输监控')}
              {activeLayer === 'COAL' && tLabel('Coal & Fuel Coupling', '煤炭储运与算力用能耦合')}
            </span>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
            {activeLayer === 'ELEC' && (
              <>
                <div>
                  <div className="text-[9.5px] font-extrabold uppercase text-[#6A7686] mb-2 tracking-wider">
                    {tLabel('INSTALLED GENERATION CAPACITY', '在册装电输出装机比例')}
                  </div>
                  <div className="bg-[#FAFBFD] p-2.5 rounded border border-[#E2E7EF] space-y-2">
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="text-[#6A7686]">{tLabel('Total Grid Ingress', '总计核定输入最高')}</span>
                      <span className="font-mono font-bold text-[#0F1722]">23.4 GW</span>
                    </div>
                    <div className="w-full bg-[#E2E7EF] h-1.5 rounded-full overflow-hidden flex">
                      <div className="bg-[#0F1722] h-full" style={{ width: '68%' }} title="Thermal" />
                      <div className="bg-[#2D6CDF] h-full" style={{ width: '18%' }} title="Hydro" />
                      <div className="bg-[#2FA862] h-full" style={{ width: '14%' }} title="Renewables" />
                    </div>
                    <div className="grid grid-cols-3 gap-1 text-[9px] text-[#6A7686]">
                      <div className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#0F1722]" />
                        <span>Coal: 68%</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#2D6CDF]" />
                        <span>Hydro: 18%</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#2FA862]" />
                        <span>RE: 14%</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="text-[9.5px] font-extrabold uppercase text-[#6A7686] mb-2 tracking-wider">
                    {tLabel('LIVE GENERATION MIX', '当下实时发电供应配比')}
                  </div>
                  <div className="bg-[#FAFBFD] p-2.5 rounded border border-[#E2E7EF] space-y-2">
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px]">
                        <span className="text-[#1A2330] font-medium">{tLabel('Coal-Fired Plants', '燃煤火力发电网自备机组')}</span>
                        <span className="font-mono font-bold">14,821 MW</span>
                      </div>
                      <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden">
                        <div className="bg-[#0F1722] h-full" style={{ width: '74%' }} />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px]">
                        <span className="text-[#1A2330] font-medium">{tLabel('Hydroelectric Hubs', '特大水电梯级枢纽库容')}</span>
                        <span className="font-mono font-bold">3,120 MW</span>
                      </div>
                      <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden">
                        <div className="bg-[#2D6CDF] h-full" style={{ width: '55%' }} />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px]">
                        <span className="text-[#1A2330] font-medium">{tLabel('Wind & Solar Farms', '新能源大叶轮风光集输带')}</span>
                        <span className="font-mono font-bold">2,118 MW</span>
                      </div>
                      <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden">
                        <div className="bg-[#2FA862] h-full" style={{ width: '42%' }} />
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="text-[9.5px] font-extrabold uppercase text-[#6A7686] mb-2 tracking-wider">
                    {tLabel('GRID SECURITY & RESERVE N-1', '电网N-1断路应急冗余裕度')}
                  </div>
                  <div className="bg-[#FAFBFD] p-2.5 rounded border border-[#E2E7EF] space-y-2">
                    <div className="flex justify-between items-center text-[10px]">
                      <span>{tLabel('KEGOC Northern Loop', 'KEGOC 北部联络主干环网')}</span>
                      <span className="text-[#2FA862] font-black font-mono">PASS (1.45)</span>
                    </div>
                    <div className="flex justify-between items-center text-[10px]">
                      <span>{tLabel('Southern Transit Corridor', '南部过境交直流混合大动脉')}</span>
                      <span className="text-[#2FA862] font-black font-mono">PASS (1.28)</span>
                    </div>
                    <div className="flex justify-between items-center text-[10px]">
                      <span>{tLabel('Western Isolated Ingress', '里海阿克套本地电源保障区')}</span>
                      <span className="text-[#E89518] font-black font-mono">WARN (1.04)</span>
                    </div>
                  </div>
                </div>
              </>
            )}

            {activeLayer === 'OG' && (
              <>
                <div>
                  <div className="text-[9.5px] font-extrabold uppercase text-[#6A7686] mb-2 tracking-wider">
                    {tLabel('OIL PRODUCTION & REFINERY', '原油平均开采效能及馏份提取')}
                  </div>
                  <div className="bg-[#FAFBFD] p-2.5 rounded border border-[#E2E7EF] space-y-2">
                    <div className="flex justify-between items-center text-[10px]">
                      <span>{tLabel('Tengiz Daily Output', '田吉兹油田日产总均级')}</span>
                      <span className="font-mono font-bold text-[#0F1722]">680,000 bpd</span>
                    </div>
                    <div className="flex justify-between items-center text-[10px]">
                      <span>{tLabel('Kashagan Offshore Inbound', '卡沙甘近海提炼输送率')}</span>
                      <span className="font-mono font-bold text-[#0F1722]">385,000 bpd</span>
                    </div>
                    <div className="flex justify-between items-center text-[10px]">
                      <span>{tLabel('Refinery Total Load', '全哈三座国家炼油厂负荷')}</span>
                      <span className="text-[#2FA862] font-bold font-mono">92.4% Optimal</span>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="text-[9.5px] font-extrabold uppercase text-[#6A7686] mb-2 tracking-wider">
                    {tLabel('CASPIAN EXPORT METRICS', '里海方向过境管道外输监测')}
                  </div>
                  <div className="bg-[#FAFBFD] p-2.5 rounded border border-[#E2E7EF] space-y-2.5">
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px]">
                        <span>{tLabel('CPC Pipeline (to Russia)', 'CPC里海过境北方管廊')}</span>
                        <span className="font-mono font-bold">1.25M bpd</span>
                      </div>
                      <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden">
                        <div className="bg-[#FF6B35] h-full" style={{ width: '82%' }} />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px]">
                        <span>{tLabel('Atyrau-Alashankou (to China)', '中哈一二号高压供油管道')}</span>
                        <span className="font-mono font-bold">420,000 bpd</span>
                      </div>
                      <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden">
                        <div className="bg-[#FF6B35] h-full" style={{ width: '65%' }} />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px]">
                        <span>{tLabel('Aktau Port Marine Loading', '阿克套深水特种海运口岸')}</span>
                        <span className="font-mono font-bold">180,000 bpd</span>
                      </div>
                      <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden">
                        <div className="bg-[#FF6B35] h-full" style={{ width: '45%' }} />
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="text-[9.5px] font-extrabold uppercase text-[#6A7686] mb-2 tracking-wider">
                    {tLabel('PIPELINE FLUID DYNAMICS', '国际级油气输干线压差安全值')}
                  </div>
                  <div className="bg-[#FAFBFD] p-2.5 rounded border border-[#E2E7EF] space-y-2 text-[10px]">
                    <div className="flex justify-between items-center">
                      <span>{tLabel('Central Asia-Center Gas', '中亚-俄罗斯主供干线气阀')}</span>
                      <span className="text-[#2FA862] font-black font-mono">5.20 MPa (±0.1)</span>
                    </div>
                    <div className="flex justify-between items-center text-[#D8454C] font-bold">
                      <span>{tLabel('Aktau GCS-001 Gas Branch', '阿克套 GCS-001 高压支配阀')}</span>
                      <span className="font-mono animate-pulse">2.88 MPa (Breached)</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>{tLabel('Beineu-Shymkent Gas Corridor', '贝内乌-奇姆肯特层级控制流')}</span>
                      <span className="text-[#2FA862] font-black font-mono">4.15 MPa (Nominal)</span>
                    </div>
                  </div>
                </div>
              </>
            )}

            {activeLayer === 'COAL' && (
              <>
                <div>
                  <div className="text-[9.5px] font-extrabold uppercase text-[#6A7686] mb-2 tracking-wider">
                    {tLabel('COAL RESERVES BY BASIN', '主要固体采区未开采资源核查')}
                  </div>
                  <div className="bg-[#FAFBFD] p-2.5 rounded border border-[#E2E7EF] space-y-2">
                    <div className="flex justify-between items-center text-[10px]">
                      <span>{tLabel('Ekibastuz (Bogatyr/Vostochny)', '埃基巴斯图兹大型露天带')}</span>
                      <span className="font-mono font-bold text-[#0F1722]">11.2 Billion Tons</span>
                    </div>
                    <div className="flex justify-between items-center text-[10px]">
                      <span>{tLabel('Karaganda Basal (Underground)', '卡拉干达重工业特种焦用矿')}</span>
                      <span className="font-mono font-bold text-[#0F1722]">8.4 Billion Tons</span>
                    </div>
                    <div className="flex justify-between items-center text-[10px]">
                      <span>{tLabel('Maikuben Sub-bituminous', '迈库本半硬优质长焰烟煤带')}</span>
                      <span className="font-mono font-bold text-[#0F1722]">1.5 Billion Tons</span>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="text-[9.5px] font-extrabold uppercase text-[#6A7686] mb-2 tracking-wider">
                    {tLabel('ANNUAL OUTFLOW (MTONS/YR)', '各采区年度实际发运出铁运输')}
                  </div>
                  <div className="bg-[#FAFBFD] p-2.5 rounded border border-[#E2E7EF] space-y-2.5">
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px]">
                        <span>{tLabel('Bogatyr Open-Cast Peak', '博加特尔多斗露天大车间')}</span>
                        <span className="font-mono font-bold">42.5 Mt/yr</span>
                      </div>
                      <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden">
                        <div className="bg-[#0F1722] h-full" style={{ width: '89%' }} />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px]">
                        <span>{tLabel('Vostochny Integrated Pit', '沃斯托尼联合选煤集疏场')}</span>
                        <span className="font-mono font-bold">18.2 Mt/yr</span>
                      </div>
                      <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden">
                        <div className="bg-[#0F1722] h-full" style={{ width: '60%' }} />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px]">
                        <span>{tLabel('Shubarkol Clean Coal', '舒巴尔科尔高卡清洁热能煤')}</span>
                        <span className="font-mono font-bold">12.0 Mt/yr</span>
                      </div>
                      <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden">
                        <div className="bg-[#0F1722] h-full" style={{ width: '48%' }} />
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="text-[9.5px] font-extrabold uppercase text-[#6A7686] mb-2 tracking-wider">
                    {tLabel('FUTURE COMPUTATION ENERGY', '算力热电高比例直供耦合负荷')}
                  </div>
                  <div className="bg-[#FAFBFD] p-2.5 rounded border border-[#E2E7EF] space-y-2 text-[10px]">
                    <div className="flex justify-between items-center">
                      <span>{tLabel('Pavlodar Planned 800MW', '巴甫洛达尔拟设 800MW 级算舱')}</span>
                      <span className="text-[#D4A845] font-black font-mono">120 MW Phase 1</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>{tLabel('Ekibastuz Planned 600MW', '埃基巴斯图兹拟设直联机组机架')}</span>
                      <span className="text-[#D4A845] font-black font-mono">85 MW Phase 1</span>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* CENTER MAP AREA — Palantir minimalist style (react-leaflet) */}
        <div className="flex-1 relative bg-[#FAFAF8] overflow-hidden">
          <MapContainer 
            center={[48.3, 67.5]} 
            zoom={4.3} 
            className="h-full w-full bg-[#FAFAF8]" 
            zoomControl={false}
            attributionControl={false}
            minZoom={3.8}
            maxZoom={7}
          >
            <TileLayer url="https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png" />

            {/* Render GeoJSON boundary of Kazakhstan */}
            {geoData && (
              <GeoJSON
                data={geoData}
                style={{
                  color: '#1A2330',
                  weight: 0.8,
                  fillColor: '#F1F3F5',
                  fillOpacity: 0.25,
                }}
              />
            )}

            {!transitioning && (
              <>
                {/* Layer A · Electricity lines */}
                {activeLayer === 'ELEC' && (
                  <>
                    {ELEC_LINES_1150.map((coords, i) => (
                      <Polyline key={`elec1150-${i}`} positions={coords as any} color="#2D6CDF" weight={2.5} opacity={0.8} />
                    ))}
                    {ELEC_LINES_500.map((coords, i) => (
                      <Polyline key={`elec500-${i}`} positions={coords as any} color="#2D6CDF" weight={1.6} opacity={0.6} />
                    ))}
                    {ELEC_LINES_220.map((coords, i) => (
                      <Polyline key={`elec220-${i}`} positions={coords as any} color="#2D6CDF" weight={1.0} opacity={0.4} dashArray="4, 4" />
                    ))}
                  </>
                )}

                {/* Layer B · Oil & Gas lines */}
                {activeLayer === 'OG' && (
                  <>
                    {PIPELINES_OIL.map((coords, i) => (
                      <Polyline key={`oil-${i}`} positions={coords as any} color="#FF6B35" weight={1.8} opacity={0.7} dashArray="2, 4" />
                    ))}
                    {PIPELINES_GAS.map((coords, i) => (
                      <Polyline key={`gas-${i}`} positions={coords as any} color="#00A6D6" weight={1.8} opacity={0.7} dashArray="1, 3" />
                    ))}
                  </>
                )}

                {/* Layer C · Coal rail transport lines */}
                {activeLayer === 'COAL' && (
                  <>
                    {COAL_RAIL_LINES.map((coords, i) => (
                      <Polyline key={`coalrail-${i}`} positions={coords as any} color="#000" weight={1.4} opacity={0.6} dashArray="5, 5" />
                    ))}
                  </>
                )}

                {/* Always-on static cities markers with z-index control */}
                {CITY_NODES.map((n) => {
                  let icon;
                  if (n.id === 'pavlodar') {
                    icon = MAP_ICONS.CITY_STAR(n.name, true, tLabel('FUTURE DATA CENTER HUB · ENERGY', '算力直供极核 · 枢纽巴甫洛达尔'));
                  } else if (n.id === 'ekibastuz') {
                    icon = MAP_ICONS.CITY_STAR(n.name, true, tLabel('BOGATYR BASIN · 4000MW GRES', '博加特尔煤产干廊 · 直发机组'));
                  } else if (n.isStar) {
                    icon = MAP_ICONS.CITY_STAR(n.name, false);
                  } else {
                    icon = MAP_ICONS.CITY_NORMAL(n.name);
                  }

                  return (
                    <Marker 
                      key={n.id} 
                      position={n.coords as any} 
                      icon={icon}
                      eventHandlers={{
                        click: () => handleCityClick(n.id)
                      }}
                    />
                  );
                })}

                {/* Layer-conditional infrastructural nodes */}
                {activeLayer === 'ELEC' && ELECTRICITY_NODES.map((n) => (
                  <Marker 
                    key={n.id} 
                    position={n.coords as any} 
                    icon={MAP_ICONS[n.icon]}
                  >
                    <Popup className="custom-popup">
                      <div className="p-3 min-w-[200px] font-sans">
                        <div className="text-[12px] font-black text-[#0F1722]">{n.name}</div>
                        <div className="text-[9px] text-[#2D6CDF] uppercase font-bold mt-0.5">
                          {tLabel('Grid Asset Loop', 'KEGOC在籍主网极电力单元')}
                        </div>
                        <div className="h-[1px] bg-[#E2E7EF] my-2" />
                        <div className="space-y-1 text-[11px] text-[#6A7686]">
                          {n.cap && <div>{tLabel('Nameplate Capacity:', '额定出力负载:')} <strong className="text-slate-800">{n.cap}</strong></div>}
                          <div>LAT: {n.coords[0]} · LNG: {n.coords[1]}</div>
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                ))}

                {activeLayer === 'OG' && OG_NODES.map((n) => (
                  <Marker 
                    key={n.id} 
                    position={n.coords as any} 
                    icon={MAP_ICONS[n.icon]}
                  >
                    <Popup className="custom-popup">
                      <div className="p-3 min-w-[200px] font-sans">
                        <div className="text-[12px] font-black text-[#0F1722]">{n.name}</div>
                        <div className="text-[9px] text-[#FF6B35] uppercase font-bold mt-0.5">
                          {tLabel('Petrochemical Critical Asset', '石油天然气物联主管控干线锚点')}
                        </div>
                        <div className="h-[1px] bg-[#E2E7EF] my-2" />
                        <div className="space-y-1 text-[11px] text-[#6A7686]">
                          <div>LAT: {n.coords[0]} · LNG: {n.coords[1]}</div>
                          <div className="text-[10px] text-[#FF6B35] bg-[#FF6B35]/5 p-1 rounded font-bold uppercase">
                            ✓ {tLabel('Telemetry stream active', '高频时钟遥测信号连接正常')}
                          </div>
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                ))}

                {activeLayer === 'COAL' && (
                  <>
                    {COAL_NODES.map((n) => (
                      <Marker 
                        key={n.id} 
                        position={n.coords as any} 
                        icon={MAP_ICONS[n.icon]}
                      >
                        <Popup className="custom-popup">
                          <div className="p-3 min-w-[200px] font-sans">
                            <div className="text-[12px] font-black text-[#0F1722]">{n.name}</div>
                            <div className="text-[9px] text-black uppercase font-bold mt-0.5">
                              {tLabel('Coal & Solid energy source', '哈国家级固体燃料源与耦合点')}
                            </div>
                            <div className="h-[1px] bg-[#E2E7EF] my-2" />
                            <div className="space-y-1 text-[11px] text-[#6A7686]">
                              <div>LAT: {n.coords[0]} · LNG: {n.coords[1]}</div>
                            </div>
                          </div>
                        </Popup>
                      </Marker>
                    ))}

                    {/* Rendering dynamic coal basins */}
                    {COAL_BASINS.map(basin => (
                      <Marker
                        key={basin.id}
                        position={basin.coords as any}
                        icon={basin.isLargest
                          ? createDivIcon(`
                              <div class="flex flex-col items-center">
                                <span class="text-[18px] leading-none text-[#D4A845] drop-shadow-md">★</span>
                                <div class="text-[8px] font-black bg-[#D4A845] text-white px-1.5 py-0.5 mt-0.5 whitespace-nowrap shadow-sm tracking-wider uppercase rounded-sm">
                                  ${basin.name.toUpperCase()}
                                </div>
                              </div>`, [120, 32])
                          : MAP_ICONS.COAL_SQUARE
                        }
                      >
                        <Popup className="custom-popup">
                          <div className="p-3 min-w-[200px] font-sans">
                            <div className="text-[12px] font-black text-[#0F1722]">{basin.name}</div>
                            <div className="text-[9px] text-[#D8454C] uppercase font-bold mt-0.5">
                              {basin.isLargest ? 'Largest Coal Basin' : 'Coal Basin'}
                            </div>
                            <div className="h-[1px] bg-[#E2E7EF] my-2" />
                            <div className="space-y-1 text-[11px] text-[#6A7686]">
                              <div>Reserves: <strong className="text-slate-800">{basin.reserves}</strong></div>
                              <div>Type: <strong>{basin.type}</strong></div>
                              {basin.note && <div className="text-[#D8454C] text-[10px] uppercase font-bold mt-1.5">{basin.note}</div>}
                            </div>
                          </div>
                        </Popup>
                      </Marker>
                    ))}
                  </>
                )}

                {/* Layer-conditional active early warning pulse overlay with popup and hover tooltip */}
                {activePulses
                  .filter(p => p.layer === activeLayer)
                  .map((p, idx) => {
                    const icon = p.type === 'red' ? MAP_ICONS.RED_PULSE(p.name) : MAP_ICONS.AMBER_PULSE(p.name);
                    const isAktau = p.coords[0] === 43.6480 && p.coords[1] === 51.1720;
                    return (
                      <Marker 
                        key={`pulse-${idx}`}
                        position={p.coords as any}
                        icon={icon}
                        eventHandlers={{
                          click: () => {
                            if (isAktau) {
                              setActiveRegion('aktau');
                              setView('regional');
                            } else if (p.route) {
                              navigate(p.route);
                            }
                          }
                        }}
                      >
                        {isAktau && (
                          <Tooltip direction="top" offset={[0, -10]} opacity={1}>
                            <div className="px-2 py-1 text-[10px] font-black bg-white text-[#D8454C] border border-[#D8454C]/25 shadow-lg rounded flex items-center gap-1 font-sans">
                              {tLabel('Click to drill down to Aktau Regional Monitoring ↗', '点击下钻到 Aktau 区域监控 ↗')}
                            </div>
                          </Tooltip>
                        )}
                        <Popup className="custom-popup">
                          <div className="p-2.5 min-w-[180px]">
                            <div className="text-[12px] font-bold text-[#D8454C]">{p.alert}</div>
                            <div className="text-[10px] text-[#0F1722] font-semibold mt-1">{p.name}</div>
                            <div className="text-[9.5px] text-[#6A7686] mt-1 leading-tight">
                              {isAktau ? (
                                <span className="text-[#2D6CDF] font-black flex items-center gap-1">
                                  {tLabel('Click to drill down to Aktau Regional Monitoring ↗', '点击下钻到 Aktau 区域监控 ↗')}
                                </span>
                              ) : (
                                tLabel('Click to drill into multivariable AI early warning console', '点击大地图红点一键下钻至四分段预测高频时序图（ACT II 早期预警）')
                              )}
                            </div>
                          </div>
                        </Popup>
                      </Marker>
                    );
                  })}
              </>
            )}
          </MapContainer>

          {/* Region drill-down Quick Link Overlay (Absolute bottom-left over Leaflet) */}
          <div className="absolute bottom-6 left-6 z-[1000] bg-white border border-[#E2E7EF] rounded-md p-3.5 shadow-lg w-[280px] select-none">
            <div className="flex items-center gap-2 mb-2">
              <MapPin size={12} className="text-[#2D6CDF]" />
              <span className="text-[10px] uppercase tracking-wider text-[#6A7686] font-extrabold">
                {tLabel('Region Drill-Down', '区域物联下钻')}
              </span>
            </div>
            <p className="text-[10px] text-[#6A7686] mb-3 leading-relaxed">
              {tLabel(
                'Click any city or facility marker to open regional industrial telemetry view.',
                '点击大地图任意城市或高密工业单元，一键下钻属地级遥测看板。'
              )}
            </p>
            <div>
              <div className="text-[9px] uppercase tracking-wider text-[#6A7686] font-black mb-1.5">
                {tLabel('QUICK ACCREDITED LINKS', '属地级快速安全认证链接:')}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { id: 'aktau', label: 'Aktau' },
                  { id: 'pavlodar', label: 'Pavlodar' },
                  { id: 'atyrau', label: 'Atyrau' },
                  { id: 'karaganda', label: 'Karaganda' },
                  { id: 'almaty', label: 'Almaty' }
                ].map(r => (
                  <button
                    key={r.id}
                    onClick={() => handleCityClick(r.id)}
                    className="px-2.5 py-1 text-[10px] uppercase tracking-wider border border-[#E2E7EF] hover:bg-[#2AB3A6]/10 hover:text-[#2AB3A6] hover:border-[#2AB3A6] transition-all rounded font-bold font-mono"
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Map Controls Floating Legend Panel */}
          <div className="absolute bottom-6 right-6 z-[1000] w-64 bg-white shadow-2xl rounded border border-[#E2E7EF] p-4 flex flex-col gap-3.5 select-none text-[11px] font-sans">
            <div className="text-[10px] font-black text-[#0F1722] border-b border-[#E2E7EF] pb-1.5 uppercase tracking-wider">
              {tLabel('MAP METADATA LEGEND', '高安全合规级地图图例说明')}
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2.5">
                <span className="text-[#0F1722] text-[12px] font-bold">▲</span>
                <span className="text-[#6A7686]">{tLabel('Thermal Power Station', '火力发电厂核心站房')}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="w-2 h-2 bg-[#E89518] rounded-full border border-white shadow-sm" />
                <span className="text-[#6A7686]">{tLabel('Substation (KEGOC Grid)', '超级高压枢纽变电站')}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="w-2.5 h-2.5 bg-[#FF6B35] rotate-45 border border-[#0F1722]/30" />
                <span className="text-[#6A7686]">{tLabel('High-output Oil Well', '高产油气井及采矿区')}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="w-2.5 h-2.5 bg-[#00A6D6] rotate-45 border border-[#0F1722]/30" />
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
                <span className="text-[#6A7686]">{tLabel('Renewables / Uranium', '新能源点 / 国家铀井口')}</span>
              </div>
              <div className="flex items-center gap-2.5 bg-[#FAF8F5] p-1 rounded border border-[#D4A845]/15">
                <div className="w-4 h-4 rounded-full border-2 border-[#D4A845] flex items-center justify-center bg-white/50">
                  <div className="w-1 h-1 bg-[#D4A845] rounded-full"></div>
                </div>
                <span className="text-[#D4A845] font-extrabold text-[10px]">{tLabel('Planned Data Center Hub', '直联高压算力集群用能点')}</span>
              </div>
            </div>

            <div className="border-t border-[#E2E7EF] pt-2 text-[10px] text-[#A8B2C0] leading-tight">
              {tLabel('★ National / Region Capital. High-density nodes shown around Pavlodar Coal Corridor.', '★ 黄金标表示国家重能矿区与规划数据中心。高敏聚集网覆盖巴甫洛达尔及埃基巴斯图兹。')}
            </div>
          </div>
        </div>

        {/* RIGHT RAIL — RISK EVENT FEED */}
        <div className={cn(
          "border-l border-[#E2E7EF] bg-white flex flex-col overflow-hidden shrink-0 transition-all duration-300 z-10",
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
              className="text-[#6A7686] hover:text-[#0F1722] ml-auto p-1 font-mono text-[10px]"
            >
              {rightRailCollapsed ? '◀' : '▶'}
            </button>
          </div>

          {!rightRailCollapsed && (
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5 custom-scrollbar bg-slate-50/10">
              {filteredEvents.map((e) => {
                const isCrit = e.severity === 'CRITICAL';
                return (
                  <div 
                    key={e.id}
                    className={cn(
                      "border p-3 rounded shadow-sm text-[11px] flex flex-col justify-between transition-all duration-200 hover:shadow-md",
                      isCrit 
                        ? "border-[#D8454C]/40 bg-[#D8454C]/5" 
                        : "border-[#E89518]/30 bg-[#E89518]/5"
                    )}
                  >
                    <div className="flex items-center justify-between font-mono font-bold text-[9px] mb-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className={cn(
                          "px-1.5 py-0.2 uppercase text-[7px] tracking-wider font-extrabold rounded-sm",
                          isCrit ? "bg-[#D8454C] text-white animate-pulse" : "bg-[#E89518] text-white"
                        )}>
                          {e.severity}
                        </span>
                        <span className="text-[#6A7686] font-extrabold">{e.time}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[8.5px] px-1 bg-[#FAFBFD] border text-slate-700 rounded-md font-mono font-bold uppercase">layer: {e.layer}</span>
                        <span className="text-[#6A7686]">{e.id}</span>
                      </div>
                    </div>

                    <div 
                      onClick={() => e.route && navigate(e.route)}
                      className={cn(
                        "font-black text-[#0F1722] text-[11px] uppercase leading-snug tracking-tight mb-2 select-text",
                        e.route && "hover:text-[#2D6CDF] cursor-pointer"
                      )}
                    >
                      {language === 'zh' ? e.title_zh : e.title_en}
                    </div>

                    <p className="text-[#6A7686] text-[10px] leading-relaxed select-text font-medium mb-1.5">
                      {language === 'zh' ? e.desc_zh : e.desc_en}
                    </p>

                    {e.route && (
                      <div className="flex justify-end border-t border-dashed border-[#E2E7EF] pt-2 mt-1">
                        <button 
                          onClick={() => navigate(e.route)} 
                          className="text-[#2D6CDF] hover:text-[#0F1722] font-mono text-[9px] font-bold flex items-center gap-0.5"
                        >
                          {tLabel('View Detail Analysis →', '追踪详细研判 →')}
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
        </>
      ) : (
        <div className="flex-1 flex overflow-hidden">
          <RegionalFacilitiesView regionId={activeRegion} />
        </div>
      )}

      {/* 5. ⭐ NEW · BOTTOM "ACTIVE CASE STRIP" — BUILD · TRIGGER · ATTRIBUTE */}
      <div className="h-[88px] bg-white border-t border-[#E2E7EF] flex shrink-0 items-center justify-between px-6 gap-4 select-none shadow-sm z-10 overflow-hidden">
        
        {/* Title */}
        <div className="shrink-0 pr-4 border-r border-[#E2E7EF] h-10 flex flex-col justify-center">
          <div className="text-[9px] uppercase tracking-widest text-[#6A7686] font-bold">
            {tLabel('ACTIVE CASE PIPELINE', '在线在办立案管线')}
          </div>
          <div className="text-[14px] font-mono font-black text-[#0F1722] leading-none mt-1">
            5 <span className="text-[10px] text-[#6A7686] font-normal uppercase tracking-wider">cases in flight</span>
          </div>
        </div>

        {/* Mini case cards track */}
        <div className="flex-1 flex items-center gap-4 overflow-x-auto py-1 custom-scrollbar scroll-smooth">
          {(ACTIVE_CASES as any).map((c: any) => (
            <div key={c.id}>
              <CaseStepCard 
                c={c} 
                tLabel={tLabel} 
                language={language} 
                navigate={navigate} 
              />
            </div>
          ))}
        </div>

        {/* CTA right edge */}
        <div className="shrink-0 pl-4 border-l border-[#E2E7EF] h-10 flex items-center">
          <button
            onClick={() => navigate('/closure/effectiveness')}
            className="text-[10px] uppercase tracking-wider text-[#2D6CDF] hover:text-[#0F1722] flex items-center gap-1 font-bold font-mono"
          >
            {tLabel('View all 33 active cases', '查看全部在办督办案件 (33)')}
            <ChevronRight size={11} className="shrink-0" />
          </button>
        </div>

      </div>

    </div>
  );
}

// Sub-component for case cards in bottom strip
function CaseStepCard({ c, tLabel, language, navigate }: { c: any, tLabel: any, language: string, navigate: any }) {
  const stepIcon = (s: 'done' | 'in_progress' | 'pending') => {
    if (s === 'done') return <CheckCircle size={10} className="text-[#2FA862] shrink-0" />;
    if (s === 'in_progress') return <Activity size={10} className="text-[#E89518] animate-spin shrink-0" style={{ animationDuration: '3s' }} />;
    return <div className="w-2.5 h-2.5 rounded-full border border-[#E2E7EF] shrink-0" />;
  };

  return (
    <div className="w-[280px] shrink-0 border border-[#E2E7EF] rounded p-2.5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 bg-white flex flex-col justify-between h-[72px]">
      
      {/* Upper line: case info and fiscal value */}
      <div className="flex items-center justify-between mb-0.5">
        <div className="flex items-center gap-1">
          <span className="text-[10px] font-mono font-bold text-[#0F1722]">{c.id}</span>
          <span className={cn(
            "text-[8.5px] font-extrabold uppercase px-1.5 py-0.2 rounded font-mono",
            c.severity === 'CRITICAL' && "bg-[#FDECEC] text-[#D8454C]",
            c.severity === 'HIGH' && "bg-[#FCF3E0] text-[#E89518]",
            c.severity === 'MED' && "bg-[#F4F6FA] text-[#6A7686]",
          )}>
            {c.severity}
          </span>
        </div>
        <span className="text-[10px] font-mono font-black text-[#0F1722] ml-auto">
          {c.exposure}
        </span>
      </div>

      {/* Middle line: title */}
      <div className="text-[10px] text-[#1A2330] font-black truncate max-w-full">
        {language === 'zh' ? c.title_zh : c.title_en}
      </div>

      {/* 3-step progress pipeline */}
      <div className="flex items-center justify-between gap-1 text-[8px] font-mono leading-none font-bold">
        <button 
          onClick={() => navigate(`/audit/event/${c.id}`)}
          className="flex items-center gap-1 hover:text-[#2D6CDF] transition-colors group shrink-0"
          title={tLabel('Step 1: BUILD (Case filing established)', '步骤一: 异常事件审计安全建档')}
        >
          {stepIcon(c.steps.build)}
          <span className="text-[#6A7686] group-hover:text-[#2D6CDF] tracking-tighter">BUILD</span>
        </button>
        <div className="flex-1 h-px bg-[#E2E7EF] border-t border-dashed" />
        <button 
          onClick={() => navigate(`/warning/timeseries/${c.anomalyId}`)}
          className="flex items-center gap-1 hover:text-[#2D6CDF] transition-colors group shrink-0"
          title={tLabel('Step 2: TRIGGER (Early warning anomalous time-series)', '步骤二: 算法离群监测与物理异动特征触发')}
        >
          {stepIcon(c.steps.trigger)}
          <span className="text-[#6A7686] group-hover:text-[#2D6CDF] tracking-tighter">TRIGGER</span>
        </button>
        <div className="flex-1 h-px bg-[#E2E7EF] border-t border-dashed" />
        <button 
          onClick={() => navigate(`/attribution/workflow/${c.id}`)}
          className="flex items-center gap-1 hover:text-[#2D6CDF] transition-colors group shrink-0"
          title={tLabel('Step 3: ATTRIBUTE (AI agent reasoning & closure)', '步骤三: 合规追责研判归因报告合成')}
        >
          {stepIcon(c.steps.attribute)}
          <span className="text-[#6A7686] group-hover:text-[#2D6CDF] tracking-tighter">ATTRIBUTE</span>
        </button>
      </div>
    </div>
  );
}
