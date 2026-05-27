import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Polyline, GeoJSON, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  ChevronRight, 
  AlertCircle, 
  Activity, 
  Zap, 
  Droplets, 
  Flame, 
  AlertTriangle,
  ExternalLink,
  Map as MapIcon,
  Filter,
  RefreshCw,
  Search,
  Plus
} from 'lucide-react';
import { KpiCard, SectionTitle, StatusChip, Button, SummaryRow } from '../components/UI';
import { RightDrawer } from '../components/RightDrawer';
import { cn } from '@/src/lib/utils';
import { KAZAKHSTAN_BORDER as RawKAZAKHSTAN_BORDER } from '../data/geo';

// Data Imports
import RawMANGYSTAU_BOUNDS from '../data/aktau/mangystau_oblast';
import RawAKTAU_NODES from '../data/aktau/aktau_nodes';
import RawAKTAU_CONNECTIONS from '../data/aktau/aktau_connections';
import RawAKTAU_ALERTS from '../data/aktau/aktau_alerts';
import RawAKTAU_DEVICES from '../data/aktau/aktau_devices_GCS001';
import RawAKTAU_ENTERPRISE from '../data/aktau/aktau_enterprise_0091';
import { useLanguage } from '../components/LanguageContext';

const STATUS_COLORS: any = {
  NORMAL:   { fill: '#2FBF71', pulse: false },
  WARNING:  { fill: '#E7A53A', pulse: 'pulse-warning' },
  CRITICAL: { fill: '#E14B4B', pulse: 'pulse-critical' },
  OFFLINE:  { fill: '#98A1AA', pulse: false },
};

const LINE_STATUS_COLORS: any = {
  NORMAL:   { color: '#52B788', width: 1.4, style: 'solid' },
  WARNING:  { color: '#E7A53A', width: 1.6, style: 'solid' },
  CRITICAL: { color: '#E14B4B', width: 2.0, style: 'solid', flow: true },
  OFFLINE:  { color: '#98A1AA', width: 1.4, style: 'dashed' },
};

const createIcon = (status: string, nodeType: string) => {
  const config = STATUS_COLORS[status] || STATUS_COLORS.NORMAL;
  const isCritical = status === 'CRITICAL';
  
  return L.divIcon({
    className: 'custom-node-container',
    html: `
      <div class="relative flex items-center justify-center">
        ${isCritical ? `<div class="absolute w-6 h-6 bg-status-critical/20 rounded-full pulse-critical"></div>` : ''}
        ${status === 'WARNING' ? `<div class="absolute w-5 h-5 bg-status-warning/20 rounded-full pulse-warning"></div>` : ''}
        <div class="relative w-[14px] h-[14px] rounded-full border-2 border-white shadow-md flex items-center justify-center overflow-hidden" 
             style="background-color: ${config.fill}">
        </div>
      </div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12]
  });
};

export default function RegionalFacilities() {
  const { regionId } = useParams();
  const navigate = useNavigate();
  const { language, t, objT } = useLanguage();

  const KAZAKHSTAN_BORDER = useMemo(() => objT(RawKAZAKHSTAN_BORDER), [RawKAZAKHSTAN_BORDER, language, objT]);
  const MANGYSTAU_BOUNDS = useMemo(() => objT(RawMANGYSTAU_BOUNDS), [RawMANGYSTAU_BOUNDS, language, objT]);
  const AKTAU_NODES = useMemo(() => objT(RawAKTAU_NODES), [RawAKTAU_NODES, language, objT]);
  const AKTAU_CONNECTIONS = useMemo(() => objT(RawAKTAU_CONNECTIONS), [RawAKTAU_CONNECTIONS, language, objT]);
  const AKTAU_ALERTS = useMemo(() => objT(RawAKTAU_ALERTS), [RawAKTAU_ALERTS, language, objT]);
  const AKTAU_DEVICES = useMemo(() => objT(RawAKTAU_DEVICES), [RawAKTAU_DEVICES, language, objT]);
  const AKTAU_ENTERPRISE = useMemo(() => objT(RawAKTAU_ENTERPRISE), [RawAKTAU_ENTERPRISE, language, objT]);
  
  // State
  const [tab, setTab] = useState('LINK STATUS');
  const [layerFilter, setLayerFilter] = useState('OIL');
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [isSecondLayerOpen, setSecondLayerOpen] = useState(false);
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [nodeFilter, setNodeFilter] = useState('ALL');

  // Map settings
  const center: [number, number] = [44.20, 51.50];
  const zoom = 7.5;

  // Filtered Data
  const nodes = useMemo(() => {
    let baseNodes = AKTAU_NODES.features;
    
    if (tab === 'ANOMALY MAP') {
      return baseNodes; // We handle opacity in the render
    }
    
    if (tab === 'LAYER VIEW') {
      if (layerFilter === 'OIL') return baseNodes.filter(n => n.properties.type.includes('OIL') || n.properties.type.includes('WELLFIELD') || n.properties.type.includes('TERMINAL') || n.properties.type.includes('PUMP'));
      if (layerFilter === 'GAS') return baseNodes.filter(n => n.properties.type.includes('GAS') || n.properties.type.includes('COMPRESSOR') || n.properties.type.includes('STORAGE'));
      if (layerFilter === 'ELECTRICITY') return baseNodes.filter(n => n.properties.type.includes('SUBSTATION') || n.properties.type.includes('SOLAR') || n.properties.type.includes('WIND') || n.properties.type.includes('PLANT'));
      if (layerFilter === 'COAL') return [];
    }
    
    return baseNodes;
  }, [tab, layerFilter]);

  const connections = useMemo(() => {
    let baseLines = AKTAU_CONNECTIONS.features;
    if (tab === 'LAYER VIEW') {
      if (layerFilter === 'OIL') return baseLines.filter(l => l.properties.type.includes('OIL') || l.properties.type.includes('REFINERY'));
      if (layerFilter === 'GAS') return baseLines.filter(l => l.properties.type.includes('GAS'));
      if (layerFilter === 'ELECTRICITY') return baseLines.filter(l => l.properties.type.includes('TRANSMISSION') || l.properties.type.includes('PLANT'));
      if (layerFilter === 'COAL') return [];
    }
    return baseLines;
  }, [tab, layerFilter]);

  const filteredNodesList = useMemo(() => {
    let list = AKTAU_NODES.features.map(f => f.properties);
    if (nodeFilter !== 'ALL') {
      list = list.filter(n => n.status === nodeFilter);
    }
    if (searchTerm) {
      list = list.filter(n => n.name_en.toLowerCase().includes(searchTerm.toLowerCase()) || n.id.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    // Sort by severity
    const order: any = { CRITICAL: 0, OFFLINE: 1, WARNING: 2, NORMAL: 3 };
    return list.sort((a, b) => order[a.status] - order[b.status]);
  }, [nodeFilter, searchTerm]);

  const stats = useMemo(() => {
    const list = AKTAU_NODES.features.map(f => f.properties);
    return {
      all: list.length,
      normal: list.filter(n => n.status === 'NORMAL').length,
      warning: list.filter(n => n.status === 'WARNING').length,
      critical: list.filter(n => n.status === 'CRITICAL').length,
      offline: list.filter(n => n.status === 'OFFLINE').length,
    };
  }, []);

  const openNode = (nodeProperties: any) => {
    setSelectedNode(nodeProperties);
    setDrawerOpen(true);
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-bg-page font-sans">
      {/* Context Bar */}
      <div className="h-10 bg-white border-b border-border-default flex items-center justify-between px-6 shrink-0 z-20">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/sensing/national-grid')} className="text-[#6A7686] hover:text-[#0F1722] flex items-center gap-1.5 transition-colors">
            <ArrowLeft size={14} className="shrink-0" />
            <span className="text-[11px] font-bold">
              {language === 'zh' ? '返回国家一张网' : 'Back to National Grid'}
            </span>
          </button>
          <span className="text-border-default text-[12px]">|</span>
          <span className="text-[#6A7686] text-[11px] font-medium">
            {language === 'zh' ? '区域:' : 'Region:'} <strong className="text-[#0F1722] font-bold">{language === 'zh' ? '曼吉斯套 · 阿克套' : `Mangystau · ${regionId ? (regionId.charAt(0).toUpperCase() + regionId.slice(1)) : 'Aktau'}`}</strong>
          </span>
          <span className="text-[10px] font-mono text-text-tertiary">({regionId ? regionId.toUpperCase() : 'AKTAU'})</span>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-status-success animate-pulse" />
            <span className="text-[10px] font-mono text-text-secondary uppercase">
              {language === 'zh' ? '高频遥测物联信护流持续接通中' : 'Live Stream Connected'}
            </span>
          </div>
          <div className="text-[10px] tabular-nums text-text-tertiary font-mono">
             {language === 'zh' ? '上个周期同步：2026-05-28 14:32:18' : 'LAST SYNC: 2026-05-28 14:32:18'}
          </div>
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="h-10 border-b border-border-default bg-white flex shrink-0 z-10">
        {[
          { key: 'LINK STATUS', zh: '输运网线联通工况' },
          { key: 'LAYER VIEW', zh: '分类学科图层透视' },
          { key: 'ANOMALY MAP', zh: '离群异动空间热力' }
        ].map(t => (
          <button 
            key={t.key}
            onClick={() => setTab(t.key)}
            className={cn(
              "px-6 text-[10px] font-bold tracking-[0.12em] transition-all relative border-r border-border-default/50",
              tab === t.key ? "text-text-primary bg-bg-secondary/20" : "text-text-tertiary hover:text-text-secondary"
            )}
          >
            {language === 'zh' ? t.zh : t.key}
            {tab === t.key && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-text-primary" />}
          </button>
        ))}
      </div>

      {/* Layer Views Sub-tabs (only for LAYER VIEW) */}
      <AnimatePresence mode="wait">
        {tab === 'LAYER VIEW' && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 36, opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-bg-secondary/40 border-b border-border-default flex items-center px-6 gap-6 shrink-0 overflow-hidden"
          >
            {[
              { key: 'OIL', zh: '原油采掘与运输层' },
              { key: 'GAS', zh: '高压天然气供输层' },
              { key: 'ELECTRICITY', zh: '主干架空高电压电网层' },
              { key: 'COAL', zh: '露天与井下固体煤层' }
            ].map(l => (
              <button 
                key={l.key}
                onClick={() => setLayerFilter(l.key)}
                className={cn(
                  "text-[10px] font-bold uppercase tracking-wider transition-colors",
                  layerFilter === l.key ? "text-status-info border-b-2 border-status-info h-full px-2 mt-[2px]" : "text-text-tertiary hover:text-text-primary"
                )}
              >
                {language === 'zh' ? l.zh : l.key}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel: KPI + Node List */}
        <div className="w-[280px] bg-white border-r border-border-default flex flex-col shrink-0">
          <div className="p-4 space-y-3 overflow-y-auto custom-scrollbar flex-1 flex flex-col">
            <div className="grid grid-cols-2 gap-2">
              <KpiCard label={language === 'zh' ? "在籍物理节点总数" : "Total Nodes"} value="45" />
              <KpiCard label={language === 'zh' ? "综合健康评测" : "Health Score"} value="80%" subLabel={language === 'zh' ? "里海曼吉斯套省指数" : "Mangystau Index"} />
              <KpiCard label={language === 'zh' ? "在册预警异动" : "Anomalies"} value="09" color="text-status-warning" />
              <KpiCard label={language === 'zh' ? "心跳帧遥测时延" : "Ingest"} value="14ms" subLabel="1.22 GB/s" />
            </div>

            <div className="pt-4 pb-2">
              <SectionTitle className="text-[10px]">
                {language === 'zh' ? '本地区在册设施网点' : 'Regional Nodes'}
              </SectionTitle>
              <div className="flex items-center gap-1 mb-3">
                 <button onClick={() => setNodeFilter('ALL')} className={cn("px-2 py-1 text-[9px] font-bold rounded", nodeFilter === 'ALL' ? "bg-bg-dark text-white" : "bg-bg-secondary text-text-tertiary")}>
                   {language === 'zh' ? '全域' : 'ALL'} {stats.all}
                 </button>
                 <button onClick={() => setNodeFilter('NORMAL')} className={cn("px-2 py-1 text-[9px] font-bold rounded", nodeFilter === 'NORMAL' ? "bg-status-success text-white" : "bg-bg-secondary text-text-tertiary")}>
                   ● {language === 'zh' ? '正常' : 'NORMAL'}
                 </button>
                 <button onClick={() => setNodeFilter('WARNING')} className={cn("px-2 py-1 text-[9px] font-bold rounded", nodeFilter === 'WARNING' ? "bg-status-warning text-white" : "bg-bg-secondary text-text-tertiary")}>
                   ▲ {language === 'zh' ? '警示' : 'WARNING'}
                 </button>
                 <button onClick={() => setNodeFilter('CRITICAL')} className={cn("px-2 py-1 text-[9px] font-bold rounded", nodeFilter === 'CRITICAL' ? "bg-status-critical text-white" : "bg-bg-secondary text-text-tertiary")}>
                   ◆ {language === 'zh' ? '异常' : 'CRITICAL'}
                 </button>
                 <button onClick={() => setNodeFilter('OFFLINE')} className={cn("px-2 py-1 text-[9px] font-bold rounded", nodeFilter === 'OFFLINE' ? "bg-status-neutral text-white" : "bg-bg-secondary text-text-tertiary")}>
                   ⊗ {language === 'zh' ? '离线' : 'OFFLINE'}
                 </button>
              </div>
              <div className="relative mb-3">
                <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-text-tertiary" />
                <input 
                  type="text" 
                  placeholder={language === 'zh' ? "快速筛选目标网点代码/拼音..." : "Filter nodes..."} 
                  className="w-full h-8 pl-8 pr-3 bg-bg-secondary border border-border-default text-[11px] rounded-sm focus:outline-none focus:ring-1 focus:ring-text-tertiary"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1 overflow-y-auto custom-scrollbar flex-1 pb-4">
              {filteredNodesList.map(node => (
                <button 
                  key={node.id}
                  onClick={() => openNode(node)}
                  className={cn(
                    "w-full flex items-center justify-between p-2 rounded-sm transition-all text-left",
                    selectedNode?.id === node.id ? "bg-bg-secondary border-l-2 border-bg-dark" : "hover:bg-bg-hover"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <div className={cn(
                      "w-1.5 h-1.5 rounded-full shrink-0",
                      node.status === 'NORMAL' ? "bg-status-success" : 
                      node.status === 'WARNING' ? "bg-status-warning" : 
                      node.status === 'CRITICAL' ? "bg-status-critical animate-pulse" : 
                      "bg-status-neutral"
                    )} />
                    <div className="flex flex-col">
                      <span className="text-[11px] font-bold leading-none mb-0.5">{node.id.split('-').slice(3).join('-')}</span>
                      <span className="text-[9px] text-text-tertiary truncate max-w-[140px] uppercase font-mono">
                        {language === 'zh' ? (
                          node.id.includes('GCS') ? '阿克套一号联合配气主增压站' :
                          node.id.includes('FPSO') ? '近海一号多功能油气储卸防爆驳船' :
                          node.id.includes('OIL') ? '卡拉赞巴斯高粘稠原油热采群井' :
                          node.id.includes('SUB') ? '曼吉斯套东侧二次高降变电所' : node.name_en
                        ) : node.name_en}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className={cn(
                      "text-[8px] font-bold uppercase",
                      node.status === 'CRITICAL' ? "text-status-critical" : 
                      node.status === 'WARNING' ? "text-status-warning" : 
                      "text-text-tertiary"
                    )}>{language === 'zh' ? (node.status === 'NORMAL' ? '正常' : node.status === 'WARNING' ? '警报' : node.status === 'CRITICAL' ? '隐患' : '离线') : node.status[0]}</span>
                    <span className="text-[9px] font-mono font-medium text-text-secondary leading-none">{node.health_score}%</span>
                  </div>
                </button>
              ))}
              {filteredNodesList.length === 0 && (
                <div className="text-center py-8 text-[11px] text-text-tertiary italic">
                  {language === 'zh' ? '暂未检索到符合过滤设定的物理网点' : 'No facilities matches filter'}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Map Center */}
        <div className="flex-1 relative bg-[#F5F7FA]">
          {tab === 'LAYER VIEW' && layerFilter === 'COAL' ? (
             <div className="absolute inset-0 flex flex-col items-center justify-center p-8 z-[1000] bg-white/60 backdrop-blur-sm">
                <Flame size={48} className="text-text-tertiary mb-4 opacity-20" />
                <div className="text-[14px] font-bold text-text-primary uppercase tracking-widest mb-1">
                  {language === 'zh' ? '阿克套以及里海周边属地无固体煤开采在册设施' : 'NO COAL FACILITIES IN AKTAU REGION'}
                </div>
                <div className="text-[11px] text-text-secondary">
                  {language === 'zh' ? '该地区属典型荒漠，重点布局里海陆基高压输运深层油、高压伴生气与气轮机电力保障系统。' : 'Mangystau region focuses on Oil, Gas, and Power Generation only.'}
                </div>
             </div>
          ) : (
            <MapContainer center={center} zoom={zoom} className="h-full w-full" zoomControl={false} scrollWheelZoom={true}>
              <TileLayer url="https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png" />
              
              {/* Kazakhstan Border Line */}
              <Polyline positions={KAZAKHSTAN_BORDER} color="#E63946" weight={1.6} opacity={0.6} />

              {/* Mangystau Oblast Boundary */}
              <GeoJSON 
                data={MANGYSTAU_BOUNDS as any} 
                style={{
                  color: '#D4A72C',
                  weight: 1.2,
                  dashArray: '4, 3',
                  fillColor: 'transparent',
                  fillOpacity: 0
                }}
              />

              {/* Neighbors Labels (Mock positions for visual) */}
              <div className="absolute top-10 left-10 pointer-events-none opacity-30 select-none z-[1000]">
                <div className="all-caps-label text-[24px] tracking-[1em]">
                  {language === 'zh' ? '俄罗斯联邦联运接口' : 'RUSSIAN FEDERATION'}
                </div>
              </div>

              {/* Caspian Sea Label */}
              <div className="absolute bottom-24 left-24 pointer-events-none opacity-40 select-none z-[1000] text-status-info">
                <div className="font-bold text-[20px] tracking-[0.5em] italic">
                  {language === 'zh' ? '里海中西属深水航道' : 'CASPIAN SEA'}
                </div>
              </div>

              {/* Connections */}
              {connections.map((conn: any) => {
                const status = conn.properties.status;
                const config = LINE_STATUS_COLORS[status] || LINE_STATUS_COLORS.NORMAL;
                const isAnomalyTab = tab === 'ANOMALY MAP';
                const opacity = isAnomalyTab ? (status === 'NORMAL' ? 0.05 : 0.8) : 0.6;
                
                const getTranslatedType = (type_raw: string) => {
                  if (language !== 'zh') return type_raw;
                  if (type_raw.includes('OIL')) return '高压重原油外输中油管道';
                  if (type_raw.includes('GAS')) return '区域供气及二次气加压管道';
                  if (type_raw.includes('TRANSMISSION')) return '属地500千伏架空双回输电网络';
                  return type_raw;
                };

                return (
                  <Polyline 
                    key={conn.properties.id}
                    positions={conn.geometry.coordinates.map((p: any) => [p[1], p[0]])}
                    color={config.color}
                    weight={config.width}
                    dashArray={status === 'OFFLINE' ? '4, 3' : undefined}
                    opacity={opacity}
                    className={config.flowAnimation || (isAnomalyTab && status !== 'NORMAL') ? 'line-flow-animation' : ''}
                  >
                    <Tooltip sticky>
                       <div className="p-1">
                          <div className="text-[10px] font-bold text-text-primary uppercase mb-0.5">{conn.properties.id}</div>
                          <div className="text-[9px] text-text-secondary uppercase">
                            {getTranslatedType(conn.properties.type)}
                          </div>
                          <div className="flex items-center gap-1.5 mt-1 border-t border-border-default pt-1">
                             <div className={cn("w-1.5 h-1.5 rounded-full", conn.properties.status === 'NORMAL' ? "bg-status-success" : "bg-status-warning")} />
                             <span className="text-[9px] font-bold uppercase">
                               {language === 'zh' ? 
                                 (conn.properties.status === 'NORMAL' ? '运行正常' : conn.properties.status === 'WARNING' ? '偏离基准' : '断网离线') : 
                                 conn.properties.status}
                             </span>
                          </div>
                       </div>
                    </Tooltip>
                  </Polyline>
                );
              })}

              {/* Nodes */}
              {nodes.map((node: any) => {
                const status = node.properties.status;
                const isAnomalyTab = tab === 'ANOMALY MAP';
                const opacity = isAnomalyTab ? (status === 'NORMAL' ? 0.15 : 1) : 1;
                
                const getTranslatedNodeType = (t_type: string) => {
                  if (language !== 'zh') return t_type;
                  switch (t_type) {
                    case 'OIL_WELLFIELD': return '原油开采群井';
                    case 'OIL_PUMP': return '主泵站中转';
                    case 'OIL_TERMINAL': return '原油海运交付终端';
                    case 'GAS_COMPRESSOR': return '高压主增压压缩站';
                    case 'GAS_STORAGE': return '地下物理盐穴储气库';
                    case 'SUBSTATION_HUB': return '两级高降变电所中枢';
                    case 'SUBSTATION': return '本网级变电支所';
                    case 'SOLAR_PLANT': return '光伏矩阵并网发电站';
                    case 'WIND_PLANT': return '大叶轮风能发电机群';
                    default: return t_type;
                  }
                };

                const getChineseNodeName = (id: string, name_en: string) => {
                  if (language !== 'zh') return name_en;
                  if (id.includes('GCS')) return '阿克套一号联合配气主增压站';
                  if (id.includes('FPSO')) return '近海一号多功能油气储卸防爆驳船';
                  if (id.includes('KAZ')) return '卡拉赞巴斯高粘稠原油热采群井';
                  if (id.includes('ER')) return '曼吉斯套东侧二次高降变电所';
                  if (id.includes('ZH')) return '扎纳奥津热物理气水分离站';
                  if (id.includes('UZN')) return '乌津油藏两标联合注入泵组';
                  if (id.includes('KARY')) return '卡拉江巴斯精细烃分离站';
                  if (id.includes('WEST')) return '新哈萨克斯坦西部并网天然气管汇';
                  if (id.includes('SUB')) return '属地第 55号 降压辅助配电站';
                  return name_en;
                };

                return (
                  <Marker 
                    key={node.properties.id}
                    position={[node.geometry.coordinates[1], node.geometry.coordinates[0]]}
                    icon={createIcon(status, node.properties.type)}
                    opacity={opacity}
                    eventHandlers={{ click: () => openNode(node.properties) }}
                  >
                    <Tooltip sticky>
                      <div className="p-2 min-w-[120px]">
                        <div className="flex justify-between items-start mb-0.5">
                           <div className="text-[11px] font-bold text-text-primary uppercase leading-tight">
                             {getChineseNodeName(node.properties.id, node.properties.name_en)}
                           </div>
                           <StatusChip status={status === 'NORMAL' ? 'NORMAL' : status === 'WARNING' ? 'WARNING' : status === 'CRITICAL' ? 'CRITICAL' : 'OFFLINE'} />
                        </div>
                        <div className="text-[9px] text-text-secondary uppercase mb-2 font-mono">{node.properties.id}</div>
                        <div className="space-y-1 border-t border-[#E2E6EB] pt-2">
                           <div className="flex justify-between text-[10px]">
                              <span className="text-text-tertiary uppercase">
                                {language === 'zh' ? '主要测点类型' : 'Type'}
                              </span>
                              <span className="font-medium">
                                {getTranslatedNodeType(node.properties.type)}
                              </span>
                           </div>
                           <div className="flex justify-between text-[10px]">
                              <span className="text-text-tertiary uppercase">
                                {language === 'zh' ? '本周期生命评测' : 'Health'}
                              </span>
                              <span className="font-bold tabular-nums">{node.properties.health_score}%</span>
                           </div>
                        </div>
                        <div className="mt-2 text-[9px] font-bold text-status-info flex items-center justify-center gap-1 hover:underline cursor-pointer">
                           {language === 'zh' ? '进入远程物理设备深度探针' : 'inspect facility'} <ChevronRight size={10} />
                        </div>
                      </div>
                    </Tooltip>
                  </Marker>
                );
              })}
            </MapContainer>
          )}

          {/* Map Overlays */}
          <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-2">
            <div className="bg-white/80 backdrop-blur-md border border-border-default p-3 shadow-xl rounded-sm">
               <div className="text-[9px] font-bold text-text-primary uppercase tracking-wider mb-2 flex items-center gap-2">
                  <MapIcon size={12} />
                  {language === 'zh' ? '图幅图层配准说明' : 'Map Layers'}
               </div>
               <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                     <div className="w-5 h-[2px] bg-status-critical" />
                     <span className="text-[9px] text-text-secondary uppercase">
                       {language === 'zh' ? '国家陆界分界线' : 'National Border'}
                     </span>
                  </div>
                  <div className="flex items-center gap-2">
                     <div className="w-5 h-[2px] border-t border-dashed border-[#D4A72C]" />
                     <span className="text-[9px] text-text-secondary uppercase">
                       {language === 'zh' ? '曼吉斯套省属地分界' : 'Mangystau Limits'}
                     </span>
                  </div>
                  <div className="flex items-center gap-2">
                     <div className="w-2.5 h-2.5 rounded-full bg-status-success border border-white" />
                     <span className="text-[9px] text-text-secondary uppercase">
                       {language === 'zh' ? '在册安全物理网点' : 'Normal Node'}
                     </span>
                  </div>
                  <div className="flex items-center gap-2">
                     <div className="w-2.5 h-2.5 rounded-full bg-status-critical animate-pulse border border-white" />
                     <span className="text-[9px] text-text-secondary uppercase font-bold text-status-critical">
                       {language === 'zh' ? '两级合规离群风险异动' : 'Anomaly Risk'}
                     </span>
                  </div>
               </div>
            </div>
          </div>

          <div className="absolute bottom-6 left-6 z-[1000] bg-white/80 backdrop-blur-md border border-border-default px-4 py-2 shadow-sm rounded-sm">
             <div className="flex items-center gap-4">
                <div className="flex flex-col">
                   <span className="text-[9px] all-caps-label text-text-tertiary">
                     {language === 'zh' ? '测绘网两高坐标基准' : 'Coord Index'}
                   </span>
                   <span className="text-[12px] font-mono font-bold text-text-primary tabular-nums">43.653° , 51.161°</span>
                </div>
                <div className="w-px h-6 bg-border-default" />
                <div className="flex flex-col">
                   <span className="text-[9px] all-caps-label text-text-tertiary">
                     {language === 'zh' ? '地理透视中心' : 'View Focus'}
                   </span>
                   <span className="text-[11px] font-medium text-text-secondary uppercase tracking-tight">
                     {language === 'zh' ? '里海克拉赞巴斯-阿克套核心带' : 'Caspian Basin Central'}
                   </span>
                </div>
             </div>
          </div>
        </div>

        {/* Right Panel: Alerts + Feed */}
        <div className="w-[340px] bg-white border-l border-border-default flex flex-col shrink-0 overflow-y-auto custom-scrollbar">
          <div className="p-5 flex flex-col gap-6">
            <div>
              <SectionTitle className="text-[11px] flex items-center justify-between">
                {language === 'zh' ? '本省重点安全突发异动通知' : 'Regional Alerts'} 
                <span className="text-[9px] font-normal lowercase py-0.5 px-1.5 bg-status-critical/10 text-status-critical rounded-full">
                  {AKTAU_ALERTS.alerts.length} {language === 'zh' ? '条新警报' : 'New'}
                </span>
              </SectionTitle>
              <div className="space-y-3">
                {AKTAU_ALERTS.alerts.map(alert => {
                  const getTranslatedAlertTitle = (id: string, original: string) => {
                    if (language !== 'zh') return original;
                    switch (id) {
                      case 'ANO-2026-0512': return '主增压机组排出侧压力瞬间飙高/发生涌浪异常';
                      case 'ANO-2026-0498': return '咸水淡化核心净水流量呈现不正常折损性衰退';
                      case 'ANO-2026-0501': return '乌津二次增压回路气压传感器零点处于长期漂移状态';
                      case 'ANO-2026-0489': return '乌津贸易交接物理计量网与测采交叉校验发生失配';
                      case 'ANO-2026-0476': return '扎纳奥津老油藏高阻井群累计采收总量急速超常衰减';
                      case 'SYS-2026-0044': return '110kV输电变配电副网发生边缘型网络心跳帧丢失';
                      default: return original;
                    }
                  };

                  const getTranslatedAlertDesc = (id: string, original: string) => {
                    if (language !== 'zh') return original;
                    switch (id) {
                      case 'ANO-2026-0512': return '排出侧气压在72小时内超出正常工况基准 +38%。该波形与2025年历史违规超产案库中的 ANO-2025-0317 判定特征一致性达 87.2%，且2号离心机轴承异常摆震。';
                      case 'ANO-2026-0498': return '24小时内核心净水外输流量累计衰退达 -8%。预计滤膜产生严重钙化，已启用补水泵进行声纳高频遥测二级交叉比对校验。';
                      case 'ANO-2026-0501': return '物理气压检测偏离达 2-sigma 统计学置信上限，该异常可能会沿输气干线向阿克套 GCS-001 主增压站顺流传导。';
                      case 'ANO-2026-0489': return '关口贸易表交割口径与 SCADA 实物量消偏重算值偏差达 +6.2%，表明测点传感器存在人工作虚调校或有账外销售隐患。';
                      case 'ANO-2026-0476': return '过去7天累积采出折合标立暴跌 -12%，显著超过油藏自然衰退边界。疑似抽油机井下阻尼柱塞卡死或局部管阀渗漏。';
                      case 'SYS-2026-0044': return '自当前周期 09:18 时分起，微机总线通信闪断中断，未见后续遥测心跳帧。建议外勤紧急派单开展实物断线排查。';
                      default: return original;
                    }
                  };

                  return (
                    <div 
                      key={alert.id} 
                      className={cn(
                        "p-4 border-l-3 transition-colors group cursor-pointer",
                        alert.severity === 'CRITICAL' ? "bg-status-critical/5 border-status-critical" : 
                        alert.severity === 'WARNING' ? "bg-status-warning/5 border-status-warning" : 
                        "bg-bg-secondary border-status-neutral"
                      )}
                      onClick={() => navigate(`/warning/timeseries/${alert.id}`)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <StatusChip status={alert.severity} />
                        <span className="text-[10px] font-mono font-bold text-text-tertiary">{alert.id}</span>
                      </div>
                      <div className="text-[12px] font-bold text-text-primary leading-snug group-hover:underline mb-1 whitespace-nowrap overflow-hidden text-ellipsis">
                        {getTranslatedAlertTitle(alert.id, alert.title)}
                      </div>
                      <div className="text-[10px] text-text-secondary mb-3 leading-relaxed line-clamp-2">
                         {getTranslatedAlertDesc(alert.id, alert.description)}
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="text-[9px] font-mono text-text-tertiary">
                           {new Date(alert.detected_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                        <div className="text-status-info text-[9px] font-bold uppercase tracking-wider flex items-center gap-1">
                           {language === 'zh' ? '详情' : 'Detail'} <ChevronRight size={12} />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="border-t border-border-default pt-6">
              <SectionTitle className="text-[11px]">
                {language === 'zh' ? 'SCADA 高频遥测运行日志流' : 'Live Event Feed'}
              </SectionTitle>
              <div className="space-y-4">
                {[
                  { time: '14:32', event: language === 'zh' ? '机组 GCS-001 气压跨越动态阈值极限上限 (8.1 MPa)' : 'GCS-001 pressure crossing dynamic threshold (8.1 MPa)', type: 'ALGO' },
                  { time: '14:28', event: language === 'zh' ? 'SCADA 数据采集层对 L-AKT-18 高压输电线路交叉校验失效' : 'SCADA cross-validation fail on L-AKT-18', type: 'SYS' },
                  { time: '14:21', event: language === 'zh' ? '自然灾害应急中心：里海风暴大潮接近曼吉斯套省海岸线' : 'Weather alert: Regional storm approaching coast', type: 'ENV' },
                  { time: '14:15', event: language === 'zh' ? '重整配和配气运行报表已递交至 Uzen-Central 控制中心' : 'Daily production report submitted for Uzen-Central', type: 'OPS' },
                  { time: '14:02', event: language === 'zh' ? '扎纳奥津二次高位增压调载主站进入全系统冷态一键关停' : 'Zhanaozen Booster Station cold shutdown started', type: 'OPS' }
                ].map((ev, i) => (
                  <div key={i} className="flex gap-3 text-[11px] group opacity-70 hover:opacity-100 transition-opacity">
                    <span className="text-text-tertiary font-mono pt-0.5 shrink-0 tabular-nums">{ev.time}</span>
                    <div className="flex flex-col gap-0.5">
                       <span className="text-text-primary leading-normal">{ev.event}</span>
                       <span className="text-[9px] font-bold tracking-widest text-text-tertiary opacity-50 uppercase">
                         {language === 'zh' ? '来源：' : 'Origin: '}{ev.type}
                       </span>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="secondary" className="w-full mt-6 h-8 text-[9px]">
                {language === 'zh' ? '调阅属地历史物理运行日志' : 'Load Historical Feed'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Facility Detail Drawer (1st Layer) */}
      <RightDrawer
        isOpen={isDrawerOpen}
        onClose={() => setDrawerOpen(false)}
        title={selectedNode?.id || (language === 'zh' ? '设施物联探析' : 'FACILITY DETAIL')}
        subtitle={`${language === 'zh' ? '物理分类：' : ''}${selectedNode?.type?.replace('_', ' ')} / ${selectedNode?.subtype || 'STANDARD_NODE'}`}
        footer={
          <div className="flex gap-2 w-full">
            <Button variant="secondary" className="flex-1 shrink-0">
              {language === 'zh' ? '汇出合规分析书' : 'Export Report'}
            </Button>
            <Button onClick={() => setSecondLayerOpen(true)} className="flex-[2] shrink-0">
               {language === 'zh' ? '审计特许经营企业' : 'View Enterprise'} <ChevronRight size={14} className="ml-2" />
            </Button>
          </div>
        }
        secondLayer={{
          isOpen: isSecondLayerOpen,
          onClose: () => setSecondLayerOpen(false),
          title: AKTAU_ENTERPRISE.id,
          children: (
            <div className="space-y-6">
              <div className="bg-bg-dark p-6 text-white rounded-sm">
                 <div className="flex justify-between items-start mb-4">
                    <div className="w-12 h-12 bg-white/10 border border-white/20 flex items-center justify-center font-bold text-[18px]">WCE</div>
                    <StatusChip status="ACTIVE" />
                 </div>
                 <div className="text-[16px] font-bold mb-1 leading-tight">
                   {language === 'zh' ? '西里海能源合资有限责任公司' : AKTAU_ENTERPRISE.name_en}
                 </div>
                 <div className="text-[11px] opacity-60 mb-4">
                   {language === 'zh' ? '俄文名称: ТОО Западно-Каспийская Энергия' : AKTAU_ENTERPRISE.name_ru}
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                   <div>
                      <div className="text-[9px] opacity-50 uppercase tracking-widest">
                        {language === 'zh' ? '重工业分类' : 'Industry'}
                      </div>
                      <div className="text-[11px] font-bold">
                        {language === 'zh' ? '深部油气开采与高压运输' : AKTAU_ENTERPRISE.industry.replace('_', ' ')}
                      </div>
                   </div>
                   <div>
                      <div className="text-[9px] opacity-50 uppercase tracking-widest">
                        {language === 'zh' ? '并网开通年限' : 'Since'}
                      </div>
                      <div className="text-[11px] font-bold">{AKTAU_ENTERPRISE.registered}</div>
                   </div>
                 </div>
              </div>

              <SectionTitle className="text-[10px]">
                {language === 'zh' ? '企业治理与内部审计' : 'Governance & Risk'}
              </SectionTitle>
              <div className="space-y-1">
                 <SummaryRow label={language === 'zh' ? "企业法定合规代表人" : "Legal Representative"} value={language === 'zh' ? 'A. K. 别克图罗夫' : AKTAU_ENTERPRISE.legal_rep_name} />
                 <SummaryRow label={language === 'zh' ? "法人注册登记地址" : "Head Office"} value={language === 'zh' ? '哈萨克斯坦曼吉斯套省阿克套市' : AKTAU_ENTERPRISE.head_office} />
                 <SummaryRow label={language === 'zh' ? "在册技术职员工数" : "Employee Count"} value={AKTAU_ENTERPRISE.employees.toString()} />
                 <SummaryRow label={language === 'zh' ? "本季综合能耗指标" : "Current Load"} value="74%" color="text-status-warning" />
              </div>

              <SectionTitle className="text-[10px] mt-2">
                {language === 'zh' ? '国家特许准入证书合规情况' : 'Compliance Certificates'}
              </SectionTitle>
              <div className="space-y-2">
                 {AKTAU_ENTERPRISE.certificates.map(cert => (
                    <div key={cert.id} className="flex items-center justify-between p-2 border border-border-default hover:bg-bg-secondary transition-colors cursor-pointer group">
                       <div className="flex flex-col">
                          <span className="text-[11px] font-bold">
                            {language === 'zh' ? 
                              (cert.type.includes('LICENSE') ? '里海深海特许商业化原油采掘执照' : 
                               cert.type.includes('EMISSION') ? '二氧化碳废弃排放基质环评审核证' : '主干油气网高能耗消防准入许可') : 
                              cert.type.replace('_', ' ')}
                          </span>
                          <span className="text-[9px] text-text-tertiary tabular-nums">{cert.id}</span>
                       </div>
                       <div className="flex flex-col items-end">
                          <span className={cn("text-[9px] font-bold", cert.status === 'VALID' ? "text-status-success" : "text-status-critical")}>
                            {language === 'zh' ? (cert.status === 'VALID' ? '在册合规存续' : '警告/停机整改') : cert.status}
                          </span>
                          <span className="text-[9px] text-text-tertiary">
                            {language === 'zh' ? '有效期截止' : 'thru'} {cert.valid_until}
                          </span>
                       </div>
                    </div>
                 ))}
              </div>

              <div className="bg-bg-secondary p-4 border border-border-default">
                 <SectionTitle className="text-[10px] mb-2">
                   {language === 'zh' ? '过去12个月内政审与历史检查' : 'Inspection History (12M)'}
                 </SectionTitle>
                 <div className="space-y-1.5 text-[11px]">
                    <div className="flex justify-between">
                       <span className="text-text-secondary">{language === 'zh' ? '最近综合合规抽检深度审计' : 'Last Inspection'}</span>
                       <span className="font-bold tabular-nums">{AKTAU_ENTERPRISE.regulatory_history_12m.last_inspection}</span>
                    </div>
                    <div className="flex justify-between">
                       <span className="text-text-secondary">{language === 'zh' ? '国家自动检测异常笔数' : 'AI Flagged Anomalies'}</span>
                       <span className="font-bold tabular-nums text-status-warning">{AKTAU_ENTERPRISE.regulatory_history_12m.anomalies_count}</span>
                    </div>
                    <div className="flex justify-between">
                       <span className="text-text-secondary">{language === 'zh' ? '存续中的强制执行合规案' : 'Active Legal Cases'}</span>
                       <span className="font-bold tabular-nums">{AKTAU_ENTERPRISE.regulatory_history_12m.active_cases}</span>
                    </div>
                    <div className="flex justify-between">
                       <span className="text-text-secondary">{language === 'zh' ? '已闭环整改完毕条目数' : 'Completed Fixes'}</span>
                       <span className="font-bold tabular-nums text-status-success">{AKTAU_ENTERPRISE.regulatory_history_12m.completed_rectifications}</span>
                    </div>
                 </div>
              </div>

              <Button variant="primary" className="w-full h-10">
                 {language === 'zh' ? '下钻探查企业全景关联图谱' : 'Explore Enterprise Knowledge Graph'} <ChevronRight size={16} className="ml-2" />
              </Button>
            </div>
          )
        }}
      >
        <div className="space-y-6">
           <div className="flex justify-between items-center bg-bg-secondary/50 p-4 rounded-sm border border-border-default">
              <div className="flex flex-col">
                 <div className="all-caps-label text-[9px]">
                   {language === 'zh' ? '网点健康度瞬时评分' : 'Node Health'}
                 </div>
                 <div className={cn(
                    "text-[24px] font-bold tabular-nums",
                    selectedNode?.health_score < 40 ? "text-status-critical" : 
                    selectedNode?.health_score < 75 ? "text-status-warning" : 
                    "text-status-success"
                 )}>{selectedNode?.health_score}%</div>
              </div>
              <div className="h-10 w-24 flex items-end gap-1">
                 {Array.from({length: 6}).map((_, i) => (
                    <div key={i} className="flex-1 bg-text-tertiary/20 rounded-t-[1px]" style={{height: `${30 + Math.random() * 70}%`}} />
                 ))}
              </div>
           </div>

           {/* Facility Tabs */}
           <div className="border-b border-border-default flex gap-6 shrink-0 h-8">
              {[
                { key: 'PROFILE', zh: '设备基本信息' },
                { key: 'DEVICES', zh: '核心物理组件' },
                { key: 'TELEMETRY', zh: '硬探针遥测瞬时流' },
                { key: 'LINK', zh: '上下游拓扑联通' }
              ].map(ft => (
                 <button key={ft.key} className="text-[10px] font-bold uppercase tracking-wider relative h-full text-text-tertiary hover:text-text-primary px-1">
                    {language === 'zh' ? ft.zh : ft.key}
                    {ft.key === 'DEVICES' && selectedNode?.id === 'FAC-KZ-AKT-GCS-001' && <div className="absolute top-[-2px] right-[-6px] w-1.5 h-1.5 rounded-full bg-status-critical" />}
                    {ft.key === 'PROFILE' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-bg-dark" />}
                 </button>
              ))}
           </div>

           <div className="space-y-6">
              <div>
                 <SectionTitle className="text-[10px]">
                   {language === 'zh' ? '核心工业生产运行监控' : 'Operational Info'}
                 </SectionTitle>
                 <div className="space-y-1">
                    <SummaryRow 
                      label={language === 'zh' ? "运行总姿态" : "Status"} 
                      value={language === 'zh' ? (selectedNode?.status === 'NORMAL' ? '正常运行' : selectedNode?.status === 'WARNING' ? '偏离判定' : '离群异常警报') : selectedNode?.status} 
                      color={selectedNode?.status === 'NORMAL' ? 'text-status-success' : 'text-status-warning'} 
                    />
                    <SummaryRow label={language === 'zh' ? "首次点火/并网投运日" : "Commissioned"} value={selectedNode?.commissioned || '2016-08'} />
                    <SummaryRow label={language === 'zh' ? "所属合规企业经营号" : "Operator ID"} value={selectedNode?.operator || 'N/A'} color="text-status-info cursor-pointer underline" />
                    <SummaryRow label={language === 'zh' ? "额定设计最高负荷载" : "Design Cap"} value={selectedNode?.design_capacity || 'N/A'} />
                    <SummaryRow label={language === 'zh' ? "瞬时实测符合工况" : "Real-time Load"} value="82%" color="text-status-warning" />
                  </div>
                  <Button 
                    onClick={() => navigate('/sensing/facility/EQ-01')}
                    className="w-full mt-4 h-8 bg-[#2D6CDF] hover:bg-[#2051B2] text-white active:scale-[0.98] text-[9.5px]"
                  >
                    {language === 'zh' ? '进入 [EQ-01] 往复加压机 3D SCADA 自检' : 'Inspect [EQ-01] Compressor 3D SCADA Self-Check'} <ChevronRight size={12} className="ml-1" />
                  </Button>
                  <div className="hidden">
                 </div>
              </div>

              <div>
                 <SectionTitle className="text-[10px] flex justify-between">
                    {language === 'zh' ? '物联物理组件测点列表 (GCS-001)' : 'Device Inventory (GCS-001)'}
                    <span className="text-[9px] font-normal lowercase opacity-50">
                      {AKTAU_DEVICES.device_count} {language === 'zh' ? '个在册物理传感器' : 'registered'}
                    </span>
                 </SectionTitle>
                 <div className="border border-border-default overflow-hidden rounded-sm">
                    <div className="bg-bg-secondary h-7 flex items-center px-3 all-caps-label text-[8px] border-b border-border-default">
                       <span className="flex-1">{language === 'zh' ? '重资产组件/测位' : 'Asset Name'}</span>
                       <span className="w-16 text-right">{language === 'zh' ? '时钟实时值' : 'Value'}</span>
                       <span className="w-16 text-right">{language === 'zh' ? '设定偏移度' : 'Dev'}</span>
                    </div>
                    {AKTAU_DEVICES.devices.slice(0, 6).map(dev => {
                      const getChineseDeviceName = (n_en: string) => {
                        if (language !== 'zh') return n_en;
                        switch (n_en) {
                          case 'Main Inlet Valve': return '物理重力流总输入阀门';
                          case 'Discharge Compressor': return '往复式分级排出加压压缩泵';
                          case 'Cooling Water Flow': return '循环水冷微调流量计';
                          case 'Motor Bearing Temp': return '主驱动电机转轴滑动轴套测温计';
                          case 'Vibration Sensor Z-Axis': return '物理主轴微振幅三向波动感应仪';
                          case 'Inlet Gas Density': return '主输天然气湿饱和物理气相密度仪';
                          default: return n_en;
                        }
                      };

                      return (
                        <div key={dev.id} className="h-9 flex items-center px-3 border-b border-border-default last:border-0 hover:bg-bg-hover group transition-colors">
                           <div className="flex-1 flex flex-col">
                              <span className="text-[11px] font-bold leading-tight flex items-center gap-2">
                                 {getChineseDeviceName(dev.name)}
                                 {dev.status === 'CRITICAL' && <AlertCircle size={10} className="text-status-critical animate-pulse" />}
                              </span>
                              <span className="text-[9px] text-text-tertiary tabular-nums font-mono">{dev.id}</span>
                           </div>
                           <span className={cn("w-16 text-right text-[11px] font-mono font-bold", dev.status === 'CRITICAL' ? 'text-status-critical' : 'text-text-primary')}>{dev.reading}</span>
                           <span className={cn("w-16 text-right text-[10px] font-mono", dev.delta_pct && dev.delta_pct > 20 ? 'text-status-critical' : 'text-text-tertiary')}>
                              {dev.delta_pct ? `+${dev.delta_pct}%` : '--'}
                           </span>
                        </div>
                      );
                    })}
                    <div className="bg-bg-hover/30 p-2 text-center text-[9px] font-bold text-text-tertiary uppercase cursor-pointer hover:bg-bg-hover">
                       {language === 'zh' ? '全面查阅本台装备在册的 12 个遥测测点' : 'View All 12 Devices'}
                    </div>
                 </div>
              </div>

              <div className="bg-bg-dark p-4 text-white rounded-sm">
                 <div className="flex items-center gap-3 mb-4">
                    <Activity size={18} className="text-status-warning" />
                    <div>
                       <div className="text-[12px] font-bold tracking-tight">
                         {language === 'zh' ? '机载 AI 量化异动诊断分析引擎' : 'Active Anomaly Analysis'}
                       </div>
                       <div className="text-[9px] opacity-60">ANO-2026-0512 · {language === 'zh' ? '交叉解算 8/8 物联路' : 'Cross-checked 8/8 streams'}</div>
                    </div>
                 </div>
                 <div className="text-[11px] leading-relaxed opacity-90 mb-4 bg-white/5 p-3 border border-white/10 italic">
                    {language === 'zh' ? 
                      '“排出管道压力瞬间涌浪 (+38%)，该周期与 2号离心压缩机轴承高降异常物理摆震峰具有高度强时空相关性。分析证实主离心叶片已具有极高高频劳损和微裂纹断裂隐患。与系统历史事故特征波形谱的相关性解算判定值达 87.2%，属于强烈安全隐患。”' : 
                      '"Discharge pressure surge (+38%) correlated with Compressor #2 vibration spike. Suggests imminent blade fatigue risk. Pattern similarity 87.2% to historical loss case."'}
                 </div>
                 <Button variant="secondary" className="w-full h-8 bg-transparent border-white/20 text-white hover:bg-white/10">
                    {language === 'zh' ? '在数字孪生系统运行事故物理仿真' : 'Run Digital Twin Simulation'}
                 </Button>
              </div>
           </div>
        </div>
      </RightDrawer>
    </div>
  );
}
