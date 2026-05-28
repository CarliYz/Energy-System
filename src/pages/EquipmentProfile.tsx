import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, Clock, ShieldAlert, Award, FileText, Settings, Key, Zap, 
  Thermometer, BarChart, Compass, PenTool, Download, Mail, AlertTriangle, 
  ExternalLink, Maximize2, RotateCw, CheckCircle2, ChevronRight, RefreshCw, Layers,
  FolderOpen
} from 'lucide-react';
import { useLanguage } from '../components/LanguageContext';
import { cn } from '@/src/lib/utils';

// custom CSS for dashed border pulse and pseudo 3D rotations
const styles = `
@keyframes pulseBorderRed {
  0% { stroke-dashoffset: 0; box-shadow: 0 0 0px rgba(216, 69, 76, 0.4); border-color: rgba(216, 69, 76, 0.4); }
  50% { stroke-dashoffset: 8; box-shadow: 0 0 12px rgba(216, 69, 76, 0.82); border-color: rgba(216, 69, 76, 1); }
  100% { stroke-dashoffset: 16; box-shadow: 0 0 0px rgba(216, 69, 76, 0.4); border-color: rgba(216, 69, 76, 0.4); }
}
.red-dashed-pulse {
  border-style: dashed;
  animation: pulseBorderRed 2.2s infinite linear;
}
.3d-hover-card {
  perspective: 1000px;
}
.3d-hover-card-inner {
  transition: transform 0.25s cubic-bezier(0.25, 1, 0.5, 1);
}
.3d-hover-card:hover .3d-hover-card-inner {
  transform: rotateY(6deg) rotateX(-3deg) scale(1.03);
}
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
`;

// Types
type Level = 'L1' | 'L2' | 'L3';
type AssetCode = 'EQ-01' | 'EQ-02' | 'EQ-03' | 'EQ-04' | 'EQ-05' | 'EQ-06' | 'EQ-07' | 'EQ-08';

// Data Structures
interface Asset {
  code: AssetCode;
  name: string;
  name_zh: string;
  type: string;
  type_zh: string;
  role: string;
  role_zh: string;
  status: 'NORMAL' | 'WARNING' | 'CRITICAL';
  color: 'GREEN' | 'AMBER' | 'RED';
  health: number;
  hours: number;
  vendor: string;
  vendor_zh: string;
  model: string;
  thumbnailUrl: string;
}

const ASSET_CATALOG: Asset[] = [
  {
    code: 'EQ-01',
    name: 'GE ICL COMPRESSOR',
    name_zh: '通用电气集成压缩发电机总成',
    type: 'Integrated Compressor Line',
    type_zh: '高压主干输送集成压缩一体化管线',
    role: 'MAIN PACKAGE',
    role_zh: '主核心部件',
    status: 'WARNING',
    color: 'AMBER',
    health: 0.74,
    hours: 24560,
    vendor: 'GE Oil & Gas (Baker Hughes)',
    vendor_zh: '通用电气油气板块（贝克休斯）',
    model: 'ICL-2BCL608/A',
    thumbnailUrl: '/assets/scada/eq01_ge_icl_compressor.jpg'
  },
  {
    code: 'EQ-02',
    name: 'SUBSTATION TRANSFORMER',
    name_zh: '工业级主降压母线变压器',
    type: 'Step-down power transformer',
    type_zh: '高压输电段大功率降压供配电装置',
    role: 'POWER',
    role_zh: '电网动力系统',
    status: 'NORMAL',
    color: 'GREEN',
    health: 0.91,
    hours: 18230,
    vendor: 'Siemens Energy',
    vendor_zh: '西门子能源系统部',
    model: 'GEAFOL 25MVA / 110-6.6kV',
    thumbnailUrl: '/assets/scada/eq02_substation_transformer.jpg'
  },
  {
    code: 'EQ-03',
    name: 'VFD DRIVE',
    name_zh: '电机高低频无级变频驱动器',
    type: 'Variable Frequency Drive',
    type_zh: '智能变频整流逆变量调速驱动体',
    role: 'POWER',
    role_zh: '电网动力系统',
    status: 'NORMAL',
    color: 'GREEN',
    health: 0.88,
    hours: 18230,
    vendor: 'ABB',
    vendor_zh: '阿西亚·布朗·勃法里股份公司',
    model: 'ACS6080 / 18MW',
    thumbnailUrl: '/assets/scada/eq03_vfd_drive.jpg'
  },
  {
    code: 'EQ-04',
    name: 'LUBE OIL SYSTEM',
    name_zh: '强制式高压主轴滑套稀油润滑站',
    type: 'Forced-lubrication skid',
    type_zh: '气封往复高抗剪强制高压润滑滑撬柜',
    role: 'AUX',
    role_zh: '高危辅机辅件',
    status: 'CRITICAL',
    color: 'RED',
    health: 0.41,
    hours: 24560,
    vendor: 'Cameron (Schlumberger)',
    vendor_zh: '卡麦龙重工（斯伦贝谢）',
    model: 'LOS-450',
    thumbnailUrl: '/assets/scada/eq04_lube_oil_system.jpg'
  },
  {
    code: 'EQ-05',
    name: 'WATER COOLER BANK',
    name_zh: '封闭式闭环喷淋双回路水冷塔组',
    type: 'Closed-loop water cooler',
    type_zh: '机组大温差封闭循环水冷物理散热集群',
    role: 'COOLING',
    role_zh: '强压换热冷却',
    status: 'WARNING',
    color: 'AMBER',
    health: 0.68,
    hours: 24010,
    vendor: 'SPX Cooling',
    vendor_zh: '斯必克闭式物理冷却技术事业部',
    model: 'MARLEY-FX-6',
    thumbnailUrl: '/assets/scada/eq05_water_cooler.jpg'
  },
  {
    code: 'EQ-06',
    name: 'OIL COOLER',
    name_zh: '大流量翅片空气风冷式滑油换热器',
    type: 'Air-cooled oil heat exchanger',
    type_zh: '空冷型重介质滑润油循环阻流冷凝槽',
    role: 'COOLING',
    role_zh: '强压换热冷却',
    status: 'WARNING',
    color: 'AMBER',
    health: 0.70,
    hours: 24010,
    vendor: 'Alfa Laval',
    vendor_zh: '阿法拉伐精密板式换热工程',
    model: 'ACE-180',
    thumbnailUrl: '/assets/scada/eq06_oil_cooler.jpg'
  },
  {
    code: 'EQ-07',
    name: 'CONNECTING PIPING',
    name_zh: '高压隔离重负荷不锈钢站场管线',
    type: 'High-pressure gas piping skid',
    type_zh: '气动双向截止阀级阀后超厚壁重载钢轨',
    role: 'AUX',
    role_zh: '高危辅机辅件',
    status: 'NORMAL',
    color: 'GREEN',
    health: 0.85,
    hours: 24560,
    vendor: 'Vallourec',
    vendor_zh: '法国瓦卢瑞克重壁无缝特种钢轨',
    model: 'API-5L X65 / DN500',
    thumbnailUrl: '/assets/scada/eq07_connecting_piping.jpg'
  },
  {
    code: 'EQ-08',
    name: 'CONTROL PANEL',
    name_zh: '分布式DCS冗余微程序PLC主控集成柜',
    type: 'PLC + HMI cabinet',
    type_zh: '安全联锁集成触控集散工业级逻辑箱',
    role: 'CONTROL',
    role_zh: '中控数采核心',
    status: 'CRITICAL',
    color: 'RED',
    health: 0.52,
    hours: 22130,
    vendor: 'Emerson',
    vendor_zh: '艾默生自动化系统工程部',
    model: 'DeltaV SX',
    thumbnailUrl: '/assets/scada/eq08_control_panel.jpg'
  }
];

const STATION_HOTSPOTS = [
  { code: 'EQ-01', x: 46, y: 56, color: '#2D6CDF', label_en: 'EQ-01 GE COMPRESSOR', label_zh: 'EQ-01 通用加压机' },
  { code: 'EQ-02', x: 12, y: 28, color: '#2FA862', label_en: 'EQ-02 TRANS TX', label_zh: 'EQ-02 降压变压器' },
  { code: 'EQ-03', x: 11, y: 44, color: '#2FA862', label_en: 'EQ-03 VFD DRIVE', label_zh: 'EQ-03 无级变频器' },
  { code: 'EQ-04', x: 52, y: 78, color: '#D8454C', label_en: 'EQ-04 LUBE OIL', label_zh: 'EQ-04 核心稀油站' },
  { code: 'EQ-05', x: 74, y: 24, color: '#E89518', label_en: 'EQ-05 WATER COOLER', label_zh: 'EQ-05 闭环水冷塔' },
  { code: 'EQ-06', x: 88, y: 50, color: '#E89518', label_en: 'EQ-06 OIL COOLER', label_zh: 'EQ-06 滑油冷却机' },
  { code: 'EQ-07', x: 64, y: 38, color: '#2FA862', label_en: 'EQ-07 GAS PIPING', label_zh: 'EQ-07 主阀室管网' },
  { code: 'EQ-08', x: 34, y: 66, color: '#D8454C', label_en: 'EQ-08 CONTROL PANEL', label_zh: 'EQ-08 DCS控制柜' }
];

const ASSET_HOTSPOTS_MAP: Record<AssetCode, Array<{
  id: string;
  label_en: string;
  label_zh: string;
  x: number;
  y: number;
  color: string;
  status_en: string;
  status_zh: string;
}>> = {
  'EQ-01': [
    { id: 'HS-A', label_en: 'IMPELLER STAGE 3', label_zh: '三级钛合金叶轮总成', x: 42, y: 56, color: '#D8454C', status_en: 'WEAR DETECTED (0.42)', status_zh: '自检警告：磨损度 0.42 超越报警阈抗' },
    { id: 'HS-B', label_en: 'DE BEARING', label_zh: '驱动端轴套径力阻瓦', x: 18, y: 38, color: '#E89518', status_en: 'VIB +18% LIMIT', status_zh: '自检微偏：高频振幅 +18% 临警' },
    { id: 'HS-C', label_en: 'NDE BEARING', label_zh: '非驱动端支撑瓦', x: 72, y: 38, color: '#E89518', status_en: 'TEMP +12°C DEV', status_zh: '自检微偏：非驱动轴瓦温升 12°C 溢载' },
    { id: 'HS-D', label_en: 'DRY GAS SEAL', label_zh: '高气隔膜密封', x: 76, y: 60, color: '#D8454C', status_en: 'LEAK ALERT (0.4 g/s)', status_zh: '泄漏预警：安全封漏率 0.4g/s 严重' },
    { id: 'HS-E', label_en: 'MOTOR ROTOR', label_zh: '电机防爆转子', x: 86, y: 50, color: '#2FA862', status_en: 'OK (ACTIVE)', status_zh: '自检正常：真空励磁及冷阻在轨满足' }
  ],
  'EQ-02': [
    { id: 'TX-A', label_en: 'HV BUSHING', label_zh: '高压绝缘防水瓷套管', x: 50, y: 30, color: '#2FA862', status_en: 'VOLTAGE STABLE (110kV)', status_zh: '自检正常：高压瓷瓶阻抗电学泄露测试合格' },
    { id: 'TX-B', label_en: 'COOLING FINS', label_zh: '散热波纹翅片组', x: 30, y: 58, color: '#2FA862', status_en: 'TEMP 48.5°C', status_zh: '自检正常：自然循环散热表面温度稳合 48.5°C' },
    { id: 'TX-C', label_en: 'WINDINGS', label_zh: '变压器绝缘铁芯绝缘绕组', x: 55, y: 62, color: '#2FA862', status_en: 'STABLE (1,200 MΩ)', status_zh: '自检正常：无氧铜线包极间电阻符合标准 1,200 MΩ' },
    { id: 'TX-D', label_en: 'EXPANSION TANK', label_zh: '补偿油流储枕温探针', x: 40, y: 38, color: '#E89518', status_en: 'TEMP 68°C (WARN)', status_zh: '中度偏差：主绝缘油位膨胀阀升温趋高 68°C' }
  ],
  'EQ-03': [
    { id: 'VF-A', label_en: 'HMI MODULE', label_zh: '人机工控触控总部件', x: 42, y: 44, color: '#2FA862', status_en: 'ACTIVE', status_zh: '自检正常：液晶背光与电位控制器指令响应合规' },
    { id: 'VF-B', label_en: 'EXHAUST FAN', label_zh: '顶盖强制冷流排风道', x: 51, y: 15, color: '#2E6CDF', status_en: 'SPEED 12.2m/s', status_zh: '自检正常：顶端强制对流出风速 12.2m/s 行轨' },
    { id: 'VF-C', label_en: 'DIODE GROUP', label_zh: '高能信号发光二极灯柱', x: 42, y: 32, color: '#2FA862', status_en: '14 LED STANDARD', status_zh: '自检正常：LED 发光工况阵列全亮无破损' },
    { id: 'VF-D', label_en: 'TERMINAL CAVITY', label_zh: '整流变频大功率母线柜', x: 44, y: 80, color: '#E89518', status_en: 'TEMP 54°C', status_zh: '中度偏离：铜排压接线耳有微阻温升 54°C 趋高' }
  ],
  'EQ-04': [
    { id: 'LO-A', label_en: 'RESERVOIR VALVE', label_zh: '大容量中介稀油储油气阀', x: 35, y: 45, color: '#2FA862', status_en: 'LEVEL 84%', status_zh: '自检正常：稀油站高能滑油底罐液位在轨 84%' },
    { id: 'LO-B', label_en: 'CIRC PUMP', label_zh: '滑油主动变频齿泵组', x: 52, y: 42, color: '#D8454C', status_en: 'VIB LIMIT EXCEED', status_zh: '高危故障：主离合传动轴物理切向振幅 9.8mm/s 超限' },
    { id: 'LO-C', label_en: 'STANDBY MOTOR', label_zh: '备用液动高压润动力泵', x: 58, y: 64, color: '#2FA862', status_en: 'READY (STANDBY)', status_zh: '自检正常：双联备泵联锁热备状态随时平滑重切' },
    { id: 'LO-D', label_en: 'DUPLEX FILTER', label_zh: '切换型重荷自密过滤器', x: 45, y: 35, color: '#D8454C', status_en: 'DP 0.18 MPa (ALRT)', status_zh: '重度堵塞：滑油多层微滤网两端压差已拉载 0.18 MPa' }
  ],
  'EQ-05': [
    { id: 'WC-A', label_en: 'AXIAL FAN', label_zh: '对流变频六叶轮风机', x: 54, y: 18, color: '#E89518', status_en: 'FAN #4 STALL', status_zh: '微偏告警：4号强力失速线圈低频微热' },
    { id: 'WC-B', label_en: 'SPRAY PUMP', label_zh: '闭回路多孔高能喷淋水泵', x: 26, y: 65, color: '#2FA862', status_en: 'PRESSURE 0.42 MPa', status_zh: '自检正常：闭式回冷给喷管道测压 0.42 MPa 均衡' },
    { id: 'WC-C', label_en: 'EXCHANGE COILS', label_zh: '不锈钢高效气换折冷却排管', x: 46, y: 48, color: '#E89518', status_en: 'FOULING ACTIVE', status_zh: '微偏告警：盘管表面层硬水垢阻偏 4% 温降微滞' },
    { id: 'WC-D', label_en: 'SUMP BASIN', label_zh: '集汇对流水底凝水层槽', x: 50, y: 80, color: '#2FA862', status_en: 'LEVEL STABLE', status_zh: '自检正常：收集下池体高度恒定，补排水阀响应' }
  ],
  'EQ-06': [
    { id: 'OC-A', label_en: 'UPPER FANS', label_zh: '冷却轴流三机群电部件', x: 45, y: 22, color: '#E89518', status_en: 'RPM DEVIANT', status_zh: '自检警告：1号风叶低频阻偏，动平衡略显虚位' },
    { id: 'OC-B', label_en: 'AL FINS', label_zh: '高效翅片强化空气流通槽', x: 45, y: 55, color: '#E89518', status_en: 'DIRT CLOGGED 8%', status_zh: '自检警告：翅片间积灰结尘略占 8% 流阻微变' },
    { id: 'OC-C', label_en: 'INLET VALVE', label_zh: '油路高温主循环电磁手阀', x: 24, y: 50, color: '#2FA862', status_en: 'TEMP 78.2°C', status_zh: '自检正常：主隔离高气压阀位开闭响应合格' }
  ],
  'EQ-07': [
    { id: 'PI-A', label_en: 'TRANS SENTINEL', label_zh: '大通法兰站外微差高敏变送器', x: 38, y: 30, color: '#2FA862', status_en: '5.62 MPa STABLE', status_zh: '自检正常：管输出介质高密度气动压力 5.62 MPa 稳定' },
    { id: 'PI-B', label_en: 'GATE VALVE', label_zh: '重型不锈钢双向截止高力主手阀', x: 55, y: 33, color: '#2FA862', status_en: '100% OPEN INDICATED', status_zh: '自检正常：执行器终点阻位一致，球阀完全开启' },
    { id: 'PI-C', label_en: 'TEMP SENSOR', label_zh: '内插法高负荷热电阻探针组', x: 48, y: 24, color: '#2FA862', status_en: '34.2°C NORMAL', status_zh: '自检正常：干路在途输介质温度 34.2°C 行程正常' },
    { id: 'PI-D', label_en: 'REGULATOR', label_zh: '高钢剪应主管道节流平衡管件', x: 68, y: 54, color: '#2FA862', status_en: 'HEALTHY', status_zh: '自检正常：应变片数采测阻合格，无形变过载变' }
  ],
  'EQ-08': [
    { id: 'CP-A', label_en: 'DCS UNIT', label_zh: '主CPU大机架现场微分布式卡件', x: 44, y: 38, color: '#2FA862', status_en: 'STABLE (LOAD 14%)', status_zh: '自检正常：主架构逻辑主频温阻合适，冷负荷率仅14%' },
    { id: 'CP-B', label_en: 'POWER CONVERTER', label_zh: '双路直流24V智能供配网电板', x: 38, y: 46, color: '#D8454C', status_en: 'RAIL B FAULT', status_zh: '高危自检：总控B侧直流开关电源总熔丝由于冲击熔断' },
    { id: 'CP-C', label_en: 'IO BUS CARD', label_zh: '高度现场HART变交置前前卡板', x: 42, y: 50, color: '#2FA862', status_en: 'ACTIVE', status_zh: '自检正常：多通道数采板校验帧速率及零偏良好' },
    { id: 'CP-D', label_en: 'HMI BACKLIGHT', label_zh: '防爆触摸控制背光高透阻组件', x: 44, y: 60, color: '#D8454C', status_en: 'COMM ERROR', status_zh: '高危自检：背光调节控制器高压板通讯校验超时报错' }
  ]
};

const getPartMaterials = (code: AssetCode) => {
  switch(code) {
    case 'EQ-01': return 'TC4 / Ti-6Al-4V Titanium Alloy';
    case 'EQ-02': return 'High-grade Silicon Steel, Mineral Insulation Oil';
    case 'EQ-03': return 'Solderless Busbars, FR4 Gold-plated Core';
    case 'EQ-04': return 'Synthetic Polyol Ester ISO VG 32 Lube Oil';
    case 'EQ-05': return 'ASTM A240 316L Stainless Steel Coils';
    case 'EQ-06': return 'Aluminum Fin Elements, Seamless Copper Tube';
    case 'EQ-07': return 'API-5L Grade X65 Carbon Steel';
    case 'EQ-08': return 'Cold-rolled Steel, Polycarbonate PC Sheet';
    default: return 'Alloy Casting Steel';
  }
};

const getLiveDiagnostics = (code: AssetCode, partId: string) => {
  const common = [
    { key: '大修后累计时长 / Hours Since OH', val: '18,230 h', delta: 'NORMAL', c: 'bg-[#E8F7EF] text-[#2FA862]' }
  ];
  switch(code) {
    case 'EQ-01':
      return [
        { key: '三级振动 (RMS) / Vibration (RMS)', val: '7.4 mm/s', delta: '+18% LIMIT', c: 'bg-[#FDECEC] text-[#D8454C]' },
        { key: '径向轴瓦温度 / Bearing Temp', val: '82 °C', delta: '+4°C LIMIT', c: 'bg-[#FCF3E0] text-[#E89518]' },
        { key: '三级进排气压比 / Stage P-ratio', val: '1.42', delta: '-3% DEV', c: 'bg-[#FCF3E0] text-[#E89518]' },
        { key: '离心级段热效能 / Efficiency', val: '82.1%', delta: '-4.2% BASE', c: 'bg-[#FDECEC] text-[#D8454C]' },
        { key: '转子疲劳度累计 / Wear Index', val: '0.42', delta: '+0.06 HIGH', c: 'bg-[#FDECEC] text-[#D8454C]' },
        ...common
      ];
    case 'EQ-02':
      return [
        { key: '高压相主电压 / HV Line Voltage', val: '110.2 kV', delta: 'STABLE', c: 'bg-[#E8F7EF] text-[#2FA862]' },
        { key: '绝缘绕带核心温度 / Winding Temp', val: '52 °C', delta: 'OK', c: 'bg-[#E8F7EF] text-[#2FA862]' },
        { key: '套管局放脉冲频率 / PD Leakage Rate', val: '12 pC', delta: 'LOW-RISK', c: 'bg-[#E8F7EF] text-[#2FA862]' },
        { key: '绝缘油中氢气占比 / DGA Hydrogen H₂', val: '85 ppm', delta: 'STABLE', c: 'bg-[#E8F7EF] text-[#2FA862]' },
        { key: '磁路空载损耗度 / Core Loss ratio', val: '0.08%', delta: 'MINIMUM', c: 'bg-[#E8F7EF] text-[#2FA862]' },
        ...common
      ];
    case 'EQ-03':
      return [
        { key: 'IGBT 极结温探针 / IGBT Junction T', val: '72 °C', delta: 'OK', c: 'bg-[#E8F7EF] text-[#2FA862]' },
        { key: '直流母线平波电容量 / DC Link Voltage', val: '978 V', delta: 'V-RIPPLE 0.5%', c: 'bg-[#E8F7EF] text-[#2FA862]' },
        { key: '输出变频谐波占比 / THD Harmonic %', val: '1.82%', delta: 'BELOW BASE', c: 'bg-[#E8F7EF] text-[#2FA862]' },
        { key: '变频冷却强制风速度 / Cooling Airspeed', val: '12.2 m/s', delta: 'ACTIVE', c: 'bg-[#E8F7EF] text-[#2FA862]' },
        { key: '门极驱动供电偏差度 / Gate Supply Dev', val: '15.02 V', delta: 'DEV <0.1V', c: 'bg-[#E8F7EF] text-[#2FA862]' },
        ...common
      ];
    case 'EQ-04':
      return [
        { key: '滑油出口工作油压力 / Lube discharge P', val: '0.42 MPa', delta: 'STABLE', c: 'bg-[#E8F7EF] text-[#2FA862]' },
        { key: '齿轮主油泵体振幅 / Pump Vibration', val: '9.8 mm/s', delta: 'EXCEEDED', c: 'bg-[#FDECEC] text-[#D8454C]' },
        { key: '双联过滤器进排压差 / Filter DP Status', val: '0.18 MPa', delta: 'CLOGGED', c: 'bg-[#FDECEC] text-[#D8454C]' },
        { key: '智能精密调节控油温 / Oil Temp Out', val: '43.5 °C', delta: 'OK', c: 'bg-[#E8F7EF] text-[#2FA862]' },
        { key: '储油枕瞬时工作位 / Reservoir Level', val: '84.2%', delta: 'STABLE', c: 'bg-[#E8F7EF] text-[#2FA862]' },
        ...common
      ];
    case 'EQ-05':
      return [
        { key: '四号风机空流失速比 / Fan #4 Stall %', val: '5.2%', delta: 'STALL WARN', c: 'bg-[#FCF3E0] text-[#E89518]' },
        { key: '给水喷淋回路压力值 / Spray Line Pres', val: '0.42 MPa', delta: 'OK', c: 'bg-[#E8F7EF] text-[#2FA862]' },
        { key: '板式换热循环对流温 / Delta-T Cooling', val: '14.2 °C', delta: 'EFF -4% BASE', c: 'bg-[#FCF3E0] text-[#E89518]' },
        { key: '底集水槽阻抗酸碱度 / Sump Fluid pH', val: '7.45', delta: 'NEUTRAL (OK)', c: 'bg-[#E8F7EF] text-[#2FA862]' },
        { key: '风机变频机械振动 / Vibration RMS', val: '3.2 mm/s', delta: 'STABLE', c: 'bg-[#E8F7EF] text-[#2FA862]' },
        ...common
      ];
    case 'EQ-06':
      return [
        { key: '轴对流强制对流气流 / Aviation Fan V', val: '14.5 m/s', delta: 'OK', c: 'bg-[#E8F7EF] text-[#2FA862]' },
        { key: '翅片表面风道阻塞比 / Fin Foliage Block', val: '8.2%', delta: 'DEV WARN', c: 'bg-[#FCF3E0] text-[#E89518]' },
        { key: '滑油进出换热前压力 / Oil Delta Temp', val: '11.8 °C', delta: 'STABLE', c: 'bg-[#E8F7EF] text-[#2FA862]' },
        { key: '循环油泵转子满载荷 / Pump Load Amp', val: '42 A', delta: 'OK', c: 'bg-[#E8F7EF] text-[#2FA862]' },
        { key: '溢流手阀执行位置回 / Bypass Valv Stat', val: 'CLOSED', delta: 'OK', c: 'bg-[#E8F7EF] text-[#2FA862]' },
        ...common
      ];
    case 'EQ-07':
      return [
        { key: '后端SCADA数字测压力 / Downstream Pres', val: '5.62 MPa', delta: 'STABLE', c: 'bg-[#E8F7EF] text-[#2FA862]' },
        { key: '双向高压截止截止开度 / Gate Valve Pos', val: '100.0% OPEN', delta: 'NO DRIFT', c: 'bg-[#E8F7EF] text-[#2FA862]' },
        { key: '管道内部插高敏电阻 / Medium Gas Temp', val: '34.2 °C', delta: 'STABLE', c: 'bg-[#E8F7EF] text-[#2FA862]' },
        { key: '高压法兰无极微泄漏 / Flange Sniff ppm', val: '2 ppm', delta: 'OK (SAFE)', c: 'bg-[#E8F7EF] text-[#2FA862]' },
        { key: '管道金属表面应应变 / Piping Strain ue', val: '112 ue', delta: 'STABLE', c: 'bg-[#E8F7EF] text-[#2FA862]' },
        ...common
      ];
    case 'EQ-08':
      return [
        { key: 'CPU逻辑主板总负荷 / CPU Master load', val: '14.2%', delta: 'STABLE', c: 'bg-[#E8F7EF] text-[#2FA862]' },
        { key: '中控直流分配主轨电 / System DC Rail B', val: '18.4 V', delta: 'FAULT (REDUN)', c: 'bg-[#FDECEC] text-[#D8454C]' },
        { key: '前置数采总线校验重 / Bus Frame Retry', val: '0.01%', delta: 'STABLE', c: 'bg-[#E8F7EF] text-[#2FA862]' },
        { key: '液晶触屏高亮高压板 / HMI Backlight', val: 'FAULT-T', delta: 'HW ERROR', c: 'bg-[#FDECEC] text-[#D8454C]' },
        { key: '冷气对流PLC风机温 / Panel Inside T', val: '31.5 °C', delta: 'OK', c: 'bg-[#E8F7EF] text-[#2FA862]' },
        ...common
      ];
  }
};

const getTechSpecs = (code: AssetCode) => {
  switch(code) {
    case 'EQ-01':
      return [
        { k_zh: '流道构型规格', k_en: 'Type', v: '闭式离心双流叶轮' },
        { k_zh: '叶轮主配置级', k_en: 'Stage', v: '高压侧 3/8 级级联' },
        { k_zh: '叶嘴外切轮径', k_en: 'Outer Diameter', v: '410 mm' },
        { k_zh: '进口通径轴封', k_en: 'Inlet Diameter', v: '180 mm' },
        { k_zh: '流道叶片总组', k_en: 'Blade Count', v: '13主面 + 13分气流' },
        { k_zh: '旋转尖端线速', k_en: 'Tip Speed', v: '295 m/s' },
        { k_zh: '航空钛金材质', k_en: 'Material', v: 'Ti-6Al-4V Titanium' },
        { k_zh: '组装出厂净重', k_en: 'Mass', v: '16.4 kg' }
      ];
    case 'EQ-02':
      return [
        { k_zh: '额定满载容量', k_en: 'Capacity', v: '25 MVA' },
        { k_zh: '一次二次侧载', k_en: 'Voltages', v: '110 kV / 6.6 kV' },
        { k_zh: '接线向量组别', k_en: 'Vector Group', v: 'Dyn11' },
        { k_zh: '不饱和无载损', k_en: 'No-Load Loss', v: '14.2 kW' },
        { k_zh: '短路抗阻百分', k_en: 'Impedance Volt', v: '10.5%' },
        { k_zh: '整机绝缘等极', k_en: 'Insulation Class', v: 'Class H (Genset-Safe)' },
        { k_zh: '循环变温冷却', k_en: 'Oil Capacity', v: '8,400 Liter' },
        { k_zh: '设备安装总重', k_en: 'Total Weight', v: '32.5 metric ton' }
      ];
    case 'EQ-03':
      return [
        { k_zh: '整流逆变拓扑', k_en: 'IGBT Topology', v: '3-Level IGCT NPC' },
        { k_zh: '持续额定出力', k_en: 'Rated Capacity', v: '18 MW' },
        { k_zh: '持续输出电压', k_en: 'Output Voltage', v: '6.6 kV AC' },
        { k_zh: '输出频率范围', k_en: 'Freq Range', v: '0 - 120 Hz' },
        { k_zh: '变频变换效率', k_en: 'Drive Efficiency', v: '98.8%' },
        { k_zh: '输入电抗平滑', k_en: 'DC Smoothing L', v: '25 mH' },
        { k_zh: '整体防护机级', k_en: 'IP Enclosure', v: 'IP54 Water-Cooled' },
        { k_zh: '微处理器架构', k_en: 'Controller Core', v: 'FPGA SoC + ARM9' }
      ];
    case 'EQ-04':
      return [
        { k_zh: '滑油缓冲储罐', k_en: 'Sump Capacity', v: '4,500 L' },
        { k_zh: '设计出口压力', k_en: 'Supply Pressure', v: '0.45 MPa' },
        { k_zh: '主强制泵流量', k_en: 'Oil Flow Rate', v: '420 l/min' },
        { k_zh: '高能过滤器芯', k_en: 'Filter Mesh', v: '12 micron absolute' },
        { k_zh: '滑油散热负压', k_en: 'Cooling Duty', v: '180 kW' },
        { k_zh: '控温阀整定值', k_en: 'TCV Setting', v: '45 °C Nominal' },
        { k_zh: '应急储氮压力', k_en: 'Accumulator Cap', v: '3 x 50 L Nitrogen' },
        { k_zh: '厂防爆安全证', k_en: 'EX Certification', v: 'ATEX Zone 1 Ex d' }
      ];
    case 'EQ-05':
      return [
        { k_zh: '换热冷却能力', k_en: 'Cooling Capacity', v: '12.5 MW' },
        { k_zh: '变频轴机数目', k_en: 'Fan Configuration', v: '6 x 2.2m Axial Fans' },
        { k_zh: '闭回水物理重', k_en: 'Loop Water Volume', v: '14 metric ton' },
        { k_zh: '冷盘管耐腐径', k_en: 'Coil Tube', v: '316L Stainless DN25' },
        { k_zh: '高扬程给喷泵', k_en: 'Spray Pump Power', v: '2 x 22 kW VFD' },
        { k_zh: '最高耐受风载', k_en: 'Wind Load Rating', v: '1.8 kPa' },
        { k_zh: '噪声限制水平', k_en: 'Acoustic Rating', v: '78 dBA @ 10m' },
        { k_zh: '外体热锌防腐', k_en: 'Body Material', v: 'Heavy HDG Steel G235' }
      ];
    case 'EQ-06':
      return [
        { k_zh: '物理定值换热', k_en: 'Cooling Duty', v: '180 kW' },
        { k_zh: '换热散热材质', k_en: 'Tube Material', v: 'C12200 Copper' },
        { k_zh: '波纹高对流翅', k_en: 'Fin Type', v: 'Aluminum Tension Wounded' },
        { k_zh: '变频强风机组', k_en: 'Fan Rating', v: '3 x 7.5 kW Axial' },
        { k_zh: '阀前连接通径', k_en: 'Oil Connection', v: 'DN100 Flanged' },
        { k_zh: '外壳防锈厚度', k_en: 'Casing', v: 'Hot-dip Galvanized' },
        { k_zh: '最大设计温降', k_en: 'Max Service Temp', v: '120 °C' },
        { k_zh: '冷凝最高压力', k_en: 'Design Pressure', v: '1.6 MPa' }
      ];
    case 'EQ-07':
      return [
        { k_zh: '管壁物理外径', k_en: 'Outer Diameter', v: '508 mm' },
        { k_zh: '管壁安全厚度', k_en: 'Wall Thickness', v: '16.0 mm (Sch 40)' },
        { k_zh: '无缝碳特钢轨', k_en: 'Steel Grade', v: 'API 5L X65 PSL2' },
        { k_zh: '截止控制阀门', k_en: 'Valves', v: '20" Class 600 FB Ball' },
        { k_zh: '气动双作用阀', k_en: 'Actuator', v: 'Pneumatic Spring Return' },
        { k_zh: '外壁隔离防腐', k_en: 'Coating', v: '3-Layer PE anti-corrosive' },
        { k_zh: '网级最高耐压', k_en: 'Design Pressure', v: '10.0 MPa' },
        { k_zh: '三超无损检波', k_en: 'NDE Inspection', v: '100% UT + Radiography' }
      ];
    case 'EQ-08':
      return [
        { k_zh: '安全主控核心', k_en: 'DCS CPU Model', v: 'C-Core SX800' },
        { k_zh: '逻辑卡槽冗抗', k_en: 'Redundancy', v: '1:1 Hot-Standby Master' },
        { k_zh: '数模转换卡数', k_en: 'I/O Channels', v: '128 AI, 64 AO, 256 DI' },
        { k_zh: '双路滤波供电', k_en: 'Power Supply', v: 'Dual-feed 24VDC' },
        { k_zh: '中控防爆箱级', k_en: 'Panel Rating', v: 'Ex d ib IIB T4 (Atex)' },
        { k_zh: '分布式前通讯', k_en: 'Fieldbus Network', v: 'PROFINET / Modbus TCP' },
        { k_zh: '触控显示宽屏', k_en: 'HMI Screen Size', v: '15.6" Capacitive Touch' },
        { k_zh: '加密认证安全', k_en: 'Security Grade', v: 'IEC 62443 Certified' }
      ];
    default:
      return [];
  }
};

const getTimelineEvents = (code: AssetCode, language: string) => {
  const tL = (zh: string, en: string) => language === 'zh' ? zh : en;
  switch (code) {
    case 'EQ-01':
      return [
        { d: '2019-08', e: tL('机组初投运', 'Installed'), col: '#2FA862' },
        { d: '2021-03', e: tL('高压内视窥', 'Borescope'), col: '#2FA862' },
        { d: '2023-05', e: tL('L1级保养', 'Overhaul L1'), col: '#E89518' },
        { d: '2024-08', e: tL('质保出过期', 'Warranty Exp'), col: '#D8454C' },
        { d: '2025-11', e: tL('振幅微高警', 'Vib Alarm'), col: '#E89518' },
        { d: '2026-02', e: tL('上期巡修', 'Last Service'), col: '#E89518' },
        { d: '2026-05', e: tL('磨损超标警', 'Wear 0.42 Alert'), col: '#D8454C' }
      ];
    case 'EQ-02':
      return [
        { d: '2019-08', e: tL('设备初投运', 'Installed'), col: '#2FA862' },
        { d: '2020-12', e: tL('油化色谱分', 'DGA Test'), col: '#2FA862' },
        { d: '2022-04', e: tL('绝缘老化阻', 'Megger Test'), col: '#2FA862' },
        { d: '2023-09', e: tL('清扫更换油', 'Oil Reclaimed'), col: '#2FA862' },
        { d: '2024-11', e: tL('高穿套管试', 'Bushing Test'), col: '#2FA862' },
        { d: '2025-08', e: tL('局放红外扫', 'IR Inspection'), col: '#2FA862' },
        { d: '2026-05', e: tL('自检油温升', 'Oil Temp Rise'), col: '#E89518' }
      ];
    case 'EQ-03':
      return [
        { d: '2019-08', e: tL('整机调试运', 'Commissioned'), col: '#2FA862' },
        { d: '2021-02', e: tL('平波电容测', 'Capacitive Chk'), col: '#2FA862' },
        { d: '2022-10', e: tL('风道排灰洗', 'Air Duct Clean'), col: '#2FA862' },
        { d: '2023-11', e: tL('IGBT模块调', 'IGBT Tuning'), col: '#2FA862' },
        { d: '2024-12', e: tL('系统升版本', 'FW Upgrade'), col: '#2FA862' },
        { d: '2025-09', e: tL('连接阻紧固', 'Lug Tightening'), col: '#2FA862' },
        { d: '2026-05', e: tL('测点健康态', 'Healthy (OK)'), col: '#2FA862' }
      ];
    case 'EQ-04':
      return [
        { d: '2019-08', e: tL('滑油撬投运', 'Commissioned'), col: '#2FA862' },
        { d: '2021-01', e: tL('抗燃阀油滤', 'Filter Swapped'), col: '#2FA862' },
        { d: '2022-06', e: tL('主油罐除焦', 'Tank Desludge'), col: '#2FA862' },
        { d: '2023-08', e: tL('备泵自动投', 'Pump Auto Test'), col: '#2FA862' },
        { d: '2024-10', e: tL('油压传感器', 'Sensor Calib'), col: '#2FA862' },
        { d: '2025-11', e: tL('双滤压差警', 'DP Clog Alert'), col: '#D8454C' },
        { d: '2026-05', e: tL('主泵联轴振', 'Pump Vib High'), col: '#D8454C' }
      ];
    case 'EQ-05':
      return [
        { d: '2019-08', e: tL('对流塔投用', 'Commissioned'), col: '#2FA862' },
        { d: '2021-04', e: tL('冷却管壁刷', 'Coil Descaled'), col: '#2FA862' },
        { d: '2022-08', e: tL('风机叶片校', 'Blade balanced'), col: '#2FA862' },
        { d: '2023-10', e: tL('喷淋防爆泵', 'Spray OH'), col: '#2FA862' },
        { d: '2024-12', e: tL('水质自动检', 'Water Treatment'), col: '#2FA862' },
        { d: '2025-08', e: tL('四号机轻失', 'Fan Stall Warning'), col: '#E89518' },
        { d: '2026-05', e: tL('积垢换热微', 'Coil Fouling H'), col: '#E89518' }
      ];
    case 'EQ-06':
      return [
        { d: '2019-08', e: tL('散热撬投用', 'Commissioned'), col: '#2FA862' },
        { d: '2021-05', e: tL('外翅片高吹', 'Fin Blown-Air'), col: '#2FA862' },
        { d: '2022-12', e: tL('阀门动火试', 'Valve Cycling'), col: '#2FA862' },
        { d: '2023-09', e: tL('散热管换铜', 'Tube Inspected'), col: '#2FA862' },
        { d: '2025-01', e: tL('风道洗洁擦', 'Fin Washing'), col: '#2FA862' },
        { d: '2025-12', e: tL('指示灯复校', 'Temp Calibrated'), col: '#2FA862' },
        { d: '2026-05', e: tL('叶片平衡阻', 'Fin Block Warn'), col: '#E89518' }
      ];
    case 'EQ-07':
      return [
        { d: '2019-08', e: tL('管网通压试', 'Hydro Tested'), col: '#2FA862' },
        { d: '2020-10', e: tL('第一管道扫', 'Intelligent PIG'), col: '#2FA862' },
        { d: '2022-02', e: tL('法兰无破损', 'Flange NDE'), col: '#2FA862' },
        { d: '2023-04', e: tL('截止防漏检', 'Valve Seat NDE'), col: '#2FA862' },
        { d: '2024-06', e: tL('防腐阴极极', 'Cathodic Protection'), col: '#2FA862' },
        { d: '2025-05', e: tL('第2管道扫', 'PIG Scanning'), col: '#2FA862' },
        { d: '2026-05', e: tL('管网安全中', 'Piping OK'), col: '#2FA862' }
      ];
    case 'EQ-08':
      return [
        { d: '2019-08', e: tL('中控柜联调', 'DCS Startup'), col: '#2FA862' },
        { d: '2021-03', e: tL('I/O卡件校', 'Card Calibrated'), col: '#2FA862' },
        { d: '2022-09', e: tL('固件内版本', 'Firmware Flash'), col: '#2FA862' },
        { d: '2023-12', e: tL('双路路负载', 'Main Controller OH'), col: '#2FA862' },
        { d: '2024-11', e: tL('安全冗余投', 'Failover Test'), col: '#2FA862' },
        { d: '2025-10', e: tL('B路断路熔', 'Power Rail B Fault'), col: '#D8454C' },
        { d: '2026-05', e: tL('触幕自接通', 'HMI Comm Fault'), col: '#D8454C' }
      ];
  }
};

export default function EquipmentProfile() {
  const { language } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const { facilityId } = useParams();

  // Configurable base URL for custom GitHub Raw Assets mapping
  const [assetBaseUrl, setAssetBaseUrl] = useState<string>(() => {
    return localStorage.getItem('STATECRAFT_SCADA_ASSET_BASE') || '';
  });
  const [showConfigPanel, setShowConfigPanel] = useState<boolean>(false);
  const [tempBaseUrl, setTempBaseUrl] = useState<string>(assetBaseUrl);

  const getFinalAssetUrl = (lhPath: string) => {
    if (!lhPath) return '';
    if (assetBaseUrl) {
      const base = assetBaseUrl.endsWith('/') ? assetBaseUrl.slice(0, -1) : assetBaseUrl;
      const cleanPath = lhPath.startsWith('/') ? lhPath : '/' + lhPath;
      return `${base}${cleanPath}`;
    }
    return lhPath;
  };

  const handleSaveAssetBase = (url: string) => {
    const cleanUrl = url.trim();
    setAssetBaseUrl(cleanUrl);
    localStorage.setItem('STATECRAFT_SCADA_ASSET_BASE', cleanUrl);
    setShowConfigPanel(false);
  };

  // Internal states derived from URL hashes
  const [level, setLevel] = useState<Level>('L1');
  const [selectedAssetCode, setSelectedAssetCode] = useState<AssetCode>('EQ-01');
  const [selectedPartId, setSelectedPartId] = useState<string | null>(null);

  // Simulation Feedback States
  const [maintenanceLogged, setMaintenanceLogged] = useState<string | null>(null);
  const [exportTriggered, setExportTriggered] = useState<boolean>(false);
  const [viewAngle, setViewAngle] = useState<number>(0);
  const [fullscreenPhoto, setFullscreenPhoto] = useState<boolean>(false);
  const [tasksCreated, setTasksCreated] = useState<boolean>(false);
  const [vendorNotified, setVendorNotified] = useState<boolean>(false);

  // Sync state with URL Hash
  // Schema: #L1, #L2?asset=EQ-01, #L3?asset=EQ-01&part=HS-A
  useEffect(() => {
    const hash = location.hash || '#L1';
    if (hash.startsWith('#L1')) {
      setLevel('L1');
      setSelectedPartId(null);
    } else if (hash.startsWith('#L2')) {
      setLevel('L2');
      const params = new URLSearchParams(hash.split('?')[1] || '');
      const assetParam = params.get('asset') as AssetCode;
      if (assetParam && ASSET_CATALOG.some(a => a.code === assetParam)) {
        setSelectedAssetCode(assetParam);
      } else {
        setSelectedAssetCode('EQ-01');
      }
      setSelectedPartId(null);
    } else if (hash.startsWith('#L3')) {
      setLevel('L3');
      const params = new URLSearchParams(hash.split('?')[1] || '');
      const assetParam = params.get('asset') as AssetCode;
      const partParam = params.get('part');
      
      let finalAsset = 'EQ-01' as AssetCode;
      if (assetParam && ASSET_CATALOG.some(a => a.code === assetParam)) {
        setSelectedAssetCode(assetParam);
        finalAsset = assetParam;
      } else {
        setSelectedAssetCode('EQ-01');
      }

      const activeHotspots = ASSET_HOTSPOTS_MAP[finalAsset] || ASSET_HOTSPOTS_MAP['EQ-01'];
      if (partParam && activeHotspots.some(h => h.id === partParam)) {
        setSelectedPartId(partParam);
      } else {
        setSelectedPartId(activeHotspots[0]?.id || 'HS-A');
      }
    }
  }, [location.hash]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (level === 'L3') {
          navigate(`#L2?asset=${selectedAssetCode}`);
        } else if (level === 'L2') {
          navigate('#L1');
        }
      } else if (e.key === 'ArrowRight' && level === 'L1') {
        const ids = ASSET_CATALOG.map(a => a.code);
        const idx = ids.indexOf(selectedAssetCode);
        const nextIdx = (idx + 1) % ids.length;
        setSelectedAssetCode(ids[nextIdx] as AssetCode);
      } else if (e.key === 'Enter' && level === 'L1') {
        navigate(`#L2?asset=${selectedAssetCode}`);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [level, selectedAssetCode, navigate]);

  const selectedAsset = ASSET_CATALOG.find(a => a.code === selectedAssetCode) || ASSET_CATALOG[0];
  const activeHotspots = ASSET_HOTSPOTS_MAP[selectedAssetCode] || ASSET_HOTSPOTS_MAP['EQ-01'];
  const selectedPart = activeHotspots.find(h => h.id === selectedPartId) || activeHotspots[0];

  // Language helper translations
  const tLabel = (zh: string, en: string) => {
    return language === 'zh' ? zh : en;
  };

  return (
    <div className="flex-1 flex flex-col bg-[#F4F6FA] text-[#1A2330] font-sans overflow-hidden h-screen select-none">
      <style>{styles}</style>

      {/* 1 · TOP CONTEXT BAR (40px high, static across all levels) */}
      <div className="h-10 bg-white border-b border-[#E2E7EF] flex items-center justify-between px-6 shrink-0 z-30">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => {
              if (level === 'L3') navigate(`#L2?asset=${selectedAssetCode}`);
              else if (level === 'L2') navigate('/warning/timeseries');
              else navigate('/sensing/regional/aktau');
            }} 
            className="text-[#0F1722] hover:text-[#2D6CDF] flex items-center gap-1.5 transition-colors"
          >
            <ArrowLeft size={14} />
            <span className="text-[10px] font-bold tracking-wider uppercase">
              {tLabel('上级工况诊断', 'Back')}
            </span>
          </button>
          <div className="w-px h-4 bg-[#E2E7EF]" />
          <div className="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap">
            <span className="text-[10px] font-mono text-[#6A7686] uppercase tracking-wider font-semibold">
              AKTAU SCADA REGULATORY CONSOLE
            </span>
            <span className="text-[10px] text-[#6A7686] font-medium">›</span>
            <span className="text-[10px] text-[#6A7686] uppercase font-bold tracking-tight">
              1.3 · EQUIPMENT PROFILE
            </span>
            <span className="text-[10px] text-[#6A7686] font-medium">›</span>
            <span className="text-[11px] font-bold text-[#0F1722] tracking-tight uppercase">
              {level === 'L1' && tLabel('大型监管资产类目清单', 'ASSET CATALOG')}
              {level === 'L2' && `${selectedAsset.code} ${tLabel(selectedAsset.name_zh, selectedAsset.name)} · ${tLabel('物理工艺布局与数采探针', 'STATION LAYOUT')}`}
              {level === 'L3' && `${selectedAsset.code} · ${selectedPartId} · ${tLabel('微纳米自检与气封诊断端', 'IMPELLER STAGE 3')}`}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4 font-mono text-[10px]">
          {/* GitHub Assets Config Trigger */}
          <button
            onClick={() => {
              setTempBaseUrl(assetBaseUrl);
              setShowConfigPanel(true);
            }}
            className={cn(
              "px-2 py-0.5 rounded border flex items-center gap-1.5 text-[9px] font-bold tracking-tight uppercase cursor-pointer transition-all",
              assetBaseUrl 
                ? "bg-amber-50 hover:bg-amber-100 border-amber-300 text-amber-700" 
                : "bg-slate-50 hover:bg-slate-100 border-slate-300 text-slate-700 hover:text-[#2D6CDF]"
            )}
            title={tLabel('配置 GitHub 远程数据源', 'Configure GitHub Remote Assets')}
          >
            <Settings size={11} className={cn(assetBaseUrl && "text-amber-600 animate-pulse")} />
            <span>{assetBaseUrl ? tLabel('图谱: 远程', 'ASSET: REMOTE') : tLabel('图谱: 本地', 'ASSET: LOCAL')}</span>
          </button>

          <span className="bg-[#FAFBFD] border border-[#E2E7EF] px-2 py-0.5 rounded-sm font-semibold text-[#1A2330]">
            ENT-KZ-AKT-0091
          </span>
          <span className="flex items-center gap-1 text-[#E89518] font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E89518] animate-pulse" />
            [HEALTH 0.72]
          </span>
          <span className="bg-[#E8F7EF] text-[#2FA862] px-2 py-0.5 rounded-sm font-bold uppercase tracking-widest text-[9px]">
            {tLabel('实时工况', 'LIVE')}
          </span>
        </div>
      </div>

      {/* MAIN CONTAINER */}
      <div className="flex-1 w-full flex overflow-hidden relative" style={{ height: 'calc(100vh - 40px)' }}>
        
        {/* ==================== LEVEL 1: ASSET CATALOG ==================== */}
        <AnimatePresence mode="wait">
          {level === 'L1' && (
            <motion.div 
              key="level1"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.22 }}
              className="absolute inset-0 p-3 flex flex-col overflow-hidden justify-between"
            >
              {/* Case Lock Strip (v2 page_1_3 update) */}
              <div className="bg-[#FAFBFD] border border-[#2D6CDF]/30 rounded-sm p-3 mb-2 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                  <span className="text-[#2D6CDF] animate-pulse">⚡</span>
                  <div>
                    <div className="text-[11px] font-bold text-[#0F1722] uppercase tracking-wider">
                      {tLabel('⚡ 案件锁定 CASE-2026-001 · 异常特征 ANO-2026-0512 · 进行中调查案', '⚡ CASE LOCK: CASE-2026-001 · ANOMALY: ANO-2026-0512 · Active Investigation')}
                    </div>
                    <div className="text-[9px] text-[#6A7686] font-medium leading-none mt-0.5">
                      {tLabel('归属实体: 西里海能源有限责任公司 (ENT-KZ-AKT-0091) · 设施编码: 曼吉斯套储配首站 (GCS-001)', 'Entity: Western Caspian Energy LLC (ENT-KZ-AKT-0091) · Facility: Aktau GCS-001')}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => navigate('/warning/timeseries')}
                    className="bg-white hover:bg-bg-hover border border-border-default text-text-primary px-3 py-1 text-[10px] rounded-[4px] font-bold shadow-sm transition-colors"
                  >
                    {tLabel('← 返回事前警研预警', '← Back to Pre-emptive Warning')}
                  </button>
                  <button 
                    onClick={() => navigate('/audit/event/CASE-2026-001')}
                    className="bg-[#2D6CDF] hover:bg-[#1E57C4] text-white px-3 py-1 text-[10px] rounded-[4px] font-bold shadow-sm transition-colors"
                  >
                    {tLabel('→ 案件生命周期矩阵', '→ Case Lifecycle Matrix')}
                  </button>
                </div>
              </div>
              {/* Header Strip & KPIs */}
              <div className="h-[92px] flex items-center justify-between border-b border-[#E2E7EF] pb-4 shrink-0">
                <div className="flex flex-col">
                  <h1 className="text-[12px] font-bold text-[#0F1722] uppercase tracking-wider">
                    {tLabel('气站SCADA工业物理自检中心 · 里海西部主力储输气高压往复加压站', 'ASSET CATALOG · WESTERN CASPIAN ENERGY COMPRESSOR STATION')}
                  </h1>
                  <p className="text-[9px] text-[#6A7686] mt-0.5 font-medium leading-none">
                    {tLabel('全站共计在册核心重整重资产8组 · 主成包机组1套，辅助动力控制水封油滤阀7组 · 轻击任何一卡片入驻3D工艺机组深度剖探台', '8 major assets · 1 main package · 7 auxiliary sub-systems · click any card to enter Station Layout')}
                  </p>
                </div>

                {/* 6 KPI tiles */}
                <div className="flex items-center gap-2.5">
                  {[
                    { label: tLabel('在册机组', 'ASSETS'), val: '8', color: 'text-[#2D6CDF] bg-[#E8F1FC]', border: 'border-[#2D6CDF]/20' },
                    { label: tLabel('紧急高警', 'CRITICAL'), val: '2', color: 'text-[#D8454C] bg-[#FDECEC]', border: 'border-[#D8454C]/20' },
                    { label: tLabel('偏离阈警', 'WARN'), val: '3', color: 'text-[#E89518] bg-[#FCF3E0]', border: 'border-[#E89518]/20' },
                    { label: tLabel('工况稳定', 'HEALTHY'), val: '3', color: 'text-[#2FA862] bg-[#E8F7EF]', border: 'border-[#2FA862]/20' },
                    { label: tLabel('平均健康', 'AVG HEALTH'), val: '0.72', color: 'text-[#E89518] bg-[#FCF3E0]', border: 'border-[#E89518]/20' },
                    { label: tLabel('30日运行率', 'UPTIME 30d'), val: '97.2%', color: 'text-[#2FA862] bg-[#E8F7EF]', border: 'border-[#2FA862]/20' },
                  ].map((kpi, idx) => (
                    <div key={idx} className={cn("px-4 py-2 w-[128px] h-[56px] border flex flex-col justify-center rounded-sm transition-all", kpi.color, kpi.border)}>
                      <span className="text-[8px] opacity-70 font-bold uppercase tracking-widest leading-none mb-1">{kpi.label}</span>
                      <span className="text-[15px] font-mono font-bold leading-none">{kpi.val}</span>
                    </div>
                  ))}
                  <div className="h-10 w-px bg-[#E2E7EF] mx-1" />
                  <span className="bg-[#0F1722] text-white px-2 py-1 rounded-[2px] text-[8px] font-mono font-bold tracking-widest">
                    LEVEL 1
                  </span>
                </div>
              </div>

              {/* 4x2 Grid */}
              <div className="flex-1 py-4 grid grid-cols-4 gap-4 overflow-y-auto no-scrollbar" style={{ contentVisibility: 'auto' }}>
                {ASSET_CATALOG.map((asset) => {
                  const statusColors = {
                    NORMAL: { text: 'text-[#2FA862]', bg: 'bg-[#E8F7EF]', bColor: '#2FA862', border: 'border-[#E2E7EF]' },
                    WARNING: { text: 'text-[#E89518]', bg: 'bg-[#FCF3E0]', bColor: '#E89518', border: 'border-[#E2E7EF]' },
                    CRITICAL: { text: 'text-[#D8454C]', bg: 'bg-[#FDECEC]', bColor: '#D8454C', border: 'border-[#D8454C]/40 red-dashed-pulse' }
                  };
                  const stylesConfig = statusColors[asset.status];
                  const healthColor = asset.health > 0.8 ? '#2FA862' : asset.health > 0.6 ? '#E89518' : '#D8454C';

                  return (
                    <div 
                      key={asset.code}
                      onClick={() => navigate(`#L2?asset=${asset.code}`)} 
                      className={cn(
                        "bg-white border p-4.5 rounded-[10px] cursor-pointer flex flex-col justify-between hover:translate-y-[-2px] hover:shadow-md transition-all relative overflow-hidden",
                        stylesConfig.border
                      )}
                      style={{ height: '360px' }}
                    >
                      {/* Left color Stripe */}
                      <div 
                        className="absolute left-0 top-0 bottom-0 w-[5px]" 
                        style={{ backgroundColor: stylesConfig.bColor }}
                      />

                      {/* Top status & tags */}
                      <div className="flex justify-between items-center mb-2 pl-2">
                        <span className="text-[12px] font-black text-[#0F1722] leading-none font-mono">
                          {asset.code}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <span className={cn("px-1.5 py-0.5 rounded-[2px] text-[8px] font-black font-mono tracking-wider", stylesConfig.bg, stylesConfig.text)}>
                            {asset.status}
                          </span>
                          <span className="bg-[#FAFBFD] border border-[#E2E7EF] text-[#0F1722] px-1.5 py-0.5 rounded-[2px] text-[8px] font-medium font-mono leading-none">
                            {tLabel(asset.role_zh, asset.role)}
                          </span>
                        </div>
                      </div>

                      {/* Image Thumbnail inside dot grid */}
                      <div className="3d-hover-card flex-1 h-[172px] bg-[#EEF2F8] rounded-[6px] relative overflow-hidden flex items-center justify-center p-4" style={{ backgroundImage: 'radial-gradient(#C5CCD9 1.5px, transparent 1.5px)', backgroundSize: '10px 10px' }}>
                        <div className="3d-hover-card-inner flex items-center justify-center w-full h-full">
                          <img 
                            src={asset.thumbnailUrl} 
                            alt={asset.name} 
                            referrerPolicy="no-referrer"
                            className="max-w-full max-h-full object-contain filter drop-shadow-[0_8px_16px_rgba(15,23,34,0.15)] transition-all"
                          />
                        </div>
                      </div>

                      {/* Text details */}
                      <div className="py-2.5 pl-2">
                        <h4 className="text-[12px] font-extrabold text-[#010811] leading-tight truncate">
                          {tLabel(asset.name_zh, asset.name)}
                        </h4>
                        <div className="flex items-center justify-between text-[9px] text-[#6A7686] font-medium mt-1">
                          <span>Model: {asset.model}</span>
                          <span>Vendor: {tLabel(asset.vendor_zh, asset.vendor)}</span>
                        </div>
                      </div>

                      {/* Health progress bar & bottom action */}
                      <div className="border-t border-[#E2E7EF] pt-2.5 flex items-center justify-between pl-2">
                        <div className="flex-1 flex flex-col gap-1 mr-4">
                          <div className="flex justify-between text-[8px] text-[#6A7686] uppercase font-bold tracking-wider leading-none">
                            <span>{tLabel('核心生命度评估 Health', 'HEALTH')}</span>
                            <span className="font-extrabold font-mono text-[#010811]">{(asset.health * 100).toFixed(0)}%</span>
                          </div>
                          <div className="w-full bg-[#E2E7EF] h-2 rounded-full overflow-hidden">
                            <div 
                              className="h-full rounded-full transition-all duration-500" 
                              style={{ width: `${asset.health * 100}%`, backgroundColor: healthColor }}
                            />
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <div className="flex items-center gap-1 text-[9px] font-bold text-[#6A7686] font-mono leading-none">
                            <Clock size={11} className="text-[#6A7686]" />
                            <span>{asset.hours.toLocaleString()} h</span>
                          </div>
                          <span className="bg-[#2D6CDF] text-white font-extrabold rounded-[3px] text-[8.5px] px-2 py-1 flex items-center gap-0.5 shadow-sm active:scale-95 leading-none tracking-widest shrink-0 transition-transform">
                            {tLabel('进入 ▸', 'OPEN ▸')}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Bottom Instructions Info */}
              <div className="h-6 border-t border-[#E2E7EF] pt-2 flex items-center shrink-0 justify-between text-[10px] text-[#6A7686] font-mono">
                <span>
                  🚀 {tLabel('底部小贴士：轻触任何组件卡组可进入 2.0 阶段的气站工艺连接总平面系统布线与测点自控。', 'Tip · click any card to open Station Layout (Level 2). From layout you can drill into any sub-system\'s photo + 3D cutaway.')}
                </span>
                <span>
                  {tLabel('按键方向键 [→] 切换类目或 [回车] 探查工艺', 'Use [→] to cycle catalog or [Enter] over highlights')}
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ==================== LEVEL 2: STATION LAYOUT + DRAWER ==================== */}
        <AnimatePresence mode="wait">
          {level === 'L2' && (
            <motion.div 
              key="level2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 p-6 flex gap-6 overflow-hidden"
            >
              
              {/* Left column: 3D station view */}
              <div className="w-[1080px] bg-white border border-[#E2E7EF] rounded-[10px] p-5 flex flex-col justify-between shrink-0 relative overflow-hidden">
                <div className="absolute top-4 right-4 z-10 flex items-center gap-1.5">
                  <span className="bg-[#2D6CDF] text-white px-2 py-1 rounded-[2px] text-[8px] font-mono font-bold tracking-widest">
                    LEVEL 2
                  </span>
                </div>

                <div className="flex flex-col mb-4">
                  <h2 className="text-[12px] font-black text-[#0F1722] uppercase tracking-wider">
                    {tLabel('曼吉斯套储输气首站 · 物理3D立体工艺布局图谱流', 'STATION LAYOUT · ISOMETRIC 3D VIEW')}
                  </h2>
                  <p className="text-[9px] text-[#6A7686] font-medium mt-0.5 leading-none">
                    {tLabel('轻触任意高亮工业阀泵自检测点可切换图谱包 · 拖拽图像进行旋转调整 · 滚轮或双指可微调远近焦距', 'Click any highlighted sub-system to view photo + 3D cutaway · drag to rotate · scroll to zoom')}
                  </p>
                </div>

                {/* Main isometric image representation & Hotspot layer */}
                <div className="flex-1 bg-[#F8FAFC] rounded-[8px] relative overflow-hidden border border-slate-200 flex items-center justify-center">
                  
                  {/* Web Image Container */}
                  <img 
                    src={getFinalAssetUrl('/assets/scada/station_overview_isometric.jpg')} 
                    alt="Caspian Energy Compressor Station Layout" 
                    className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none"
                    referrerPolicy="no-referrer"
                  />

                  {/* Faint dotted grid overlay */}
                  <div className="absolute inset-0 opacity-[0.06] select-none pointer-events-none bg-[radial-gradient(#0F1722_1.8px,transparent_1.8px)] bg-[size:16px_16px]" />

                  {/* SVG Hotspot overlays */}
                  <svg className="absolute inset-0 w-full h-full z-10 cursor-default">
                    {STATION_HOTSPOTS.map((hp) => {
                      const isSelected = selectedAssetCode === hp.code;
                      const size = isSelected ? 18 : 14;
                      // Convert percentage coordinates
                      const cx = `${hp.x}%`;
                      const cy = `${hp.y}%`;

                      let statusColor = '#2FA862'; // GREEN
                      if (hp.code === 'EQ-04' || hp.code === 'EQ-08') statusColor = '#D8454C'; // RED
                      if (hp.code === 'EQ-01') statusColor = '#2D6CDF'; // BLUE / pre-selected
                      if (hp.code === 'EQ-05' || hp.code === 'EQ-06') statusColor = '#E89518'; // AMBER

                      return (
                        <g 
                          key={hp.code}
                          onClick={() => {
                            setSelectedAssetCode(hp.code as AssetCode);
                            setSelectedPartId(null);
                          }}
                          className="cursor-pointer group"
                        >
                          {/* Pulsing Outer Ring */}
                          {isSelected && (
                            <circle 
                              cx={cx} 
                              cy={cy} 
                              r={24} 
                              fill="none" 
                              stroke={statusColor} 
                              strokeWidth={1.5} 
                              strokeDasharray="4,4" 
                              className="origin-center" 
                              style={{ animation: 'pulseBorderRed 2.2s infinite linear' }}
                            />
                          )}

                          {/* Hover outer glow radius */}
                          <circle 
                            cx={cx} 
                            cy={cy} 
                            r={isSelected ? 18 : 14} 
                            fill={isSelected ? `${statusColor}1c` : 'rgba(255,255,255,0.7)'} 
                            stroke={statusColor} 
                            strokeWidth={isSelected ? 2.5 : 2} 
                            className="transition-all duration-150 group-hover:scale-110 group-hover:stroke-[3px]"
                          />

                          {/* Center core */}
                          <circle 
                            cx={cx} 
                            cy={cy} 
                            r={5} 
                            fill={statusColor} 
                          />

                          {/* Pointer leader line and dynamic chip label */}
                          <foreignObject 
                            x={`calc(${hp.x}% - 70px)`} 
                            y={`calc(${hp.y}% - 42px)`} 
                            width={140} 
                            height={34}
                            className="pointer-events-none"
                          >
                            <div className={cn(
                              "flex flex-col items-center justify-center filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.1)] px-2 py-1 rounded-sm text-center border-l shadow-sm scale-90 select-none",
                              isSelected ? "bg-[#0F1722] text-white border-l-[#2D6CDF]" : "bg-white text-[#1A2330] border-l-[#6A7686]"
                            )}>
                              <div className="text-[7.8px] font-black leading-none font-mono tracking-tight shrink-0 uppercase">
                                {hp.code}
                              </div>
                              <div className="text-[6.5px] opacity-85 leading-tight truncate shrink-0 uppercase max-w-[124px] mt-0.5">
                                {tLabel(hp.label_zh, hp.label_en)}
                              </div>
                            </div>
                          </foreignObject>
                        </g>
                      );
                    })}
                  </svg>

                  {/* Hotspot legend inside Layout */}
                  <div className="absolute bottom-4 left-4 z-10 flex gap-2 font-mono text-[8px] font-extrabold uppercase bg-white/95 border border-[#E2E7EF] p-2 rounded-sm shadow-sm">
                    <div className="flex items-center gap-1">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#2FA862]" />
                      <span>{tLabel('无偏离正常 (OK)', 'OK')}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#E89518]" />
                      <span>{tLabel('中度偏离 (WARN)', 'WARN')}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#D8454C]" />
                      <span>{tLabel('高危过载 (CRITICAL)', 'CRITICAL')}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#2D6CDF]" />
                      <span>{tLabel('当前调阅机组 (SELECTED)', 'SELECTED')}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right column: Equipment drawer (674px wide) */}
              <div className="w-[674px] bg-white border border-[#E2E7EF] rounded-[10px] p-5 flex flex-col justify-between shrink-0 overflow-y-auto no-scrollbar relative">
                <div className="absolute top-4 right-4 z-10">
                  <span className="bg-[#B23A6A] text-white px-2 py-0.5 rounded-[2px] text-[8px] font-mono font-bold tracking-widest leading-none">
                    DRAWER
                  </span>
                </div>

                <div className="flex flex-col border-b border-[#E2E7EF] pb-3 mb-4 shrink-0">
                  <h3 className="text-[14px] font-black text-[#0F1722] tracking-tight uppercase">
                    {selectedAsset.code} · {tLabel(selectedAsset.name_zh, selectedAsset.name)}
                  </h3>
                  <p className="text-[9px] text-[#6A7686] font-medium mt-0.5 uppercase tracking-wide">
                    {tLabel('集成压缩管道输输特重级机房泵包线 · 曼吉斯套储配能建部监管', 'Integrated Compressor Line · Western Caspian Energy LLC · Aktau')}
                  </p>
                </div>

                <div className="flex-1 flex flex-col justify-between gap-6 overflow-y-auto no-scrollbar">
                  
                  {/* Section A — SPEC SUMMARY */}
                  <div className="bg-[#FAFBFD] border border-[#E2E7EF] rounded-[8px] p-4 shrink-0">
                    <h4 className="text-[9px] font-black uppercase text-[#0F1722] tracking-wider mb-3 leading-none flex items-center gap-1.5">
                      <Settings size={11} className="text-[#2D6CDF]" />
                      {tLabel('▣ 机群设计与运行装配参数纲要 (SPEC SUMMARY)', '▣ DESIGN & OPERATING SPEC SUMMARY')}
                    </h4>
                    
                    <div className="grid grid-cols-3 gap-y-3.5 gap-x-2 text-[10px]">
                      {[
                        { k: tLabel('工业承包商', 'Manufacturer'), v: tLabel(selectedAsset.vendor_zh, selectedAsset.vendor) },
                        { k: tLabel('物理机组型号', 'Model'), v: selectedAsset.model },
                        { k: tLabel('物联出厂编号', 'Serial No.'), v: 'ICL-2019-KZ-0042' },
                        { k: tLabel('额定设计马力', 'Rated Power'), v: '18 MW' },
                        { k: tLabel('额定空空转速', 'Speed'), v: '9,500 rpm (VFD)' },
                        { k: tLabel('进口工作气压', 'Suction P'), v: '5.6 MPa' },
                        { k: tLabel('出口设计耐压', 'Discharge P'), v: '9.2 MPa' },
                        { k: tLabel('输运中介质', 'Medium'), v: 'Natural gas (CH₄ 94%)' },
                        { k: tLabel('物理安装年份', 'Install Date'), v: '2019-08-14' },
                        { k: tLabel('SCADA总运行', 'Run Hours'), v: `${selectedAsset.hours.toLocaleString()} h` },
                        { k: tLabel('出厂大修履约', 'Last Service'), v: '2026-02-10' },
                        { k: tLabel('健康评分系数', 'Health Status'), v: `${(selectedAsset.health * 100).toFixed(0)}% · ${selectedAsset.status}` }
                      ].map((spec, sidx) => (
                        <div key={sidx} className="flex flex-col border-b border-[#E2E7EF]/60 pb-1.5">
                          <span className="text-[7.8px] text-[#6A7686] uppercase font-bold leading-none mb-1">{spec.k}</span>
                          <span className="font-extrabold text-[#0D141E] leading-tight truncate">{spec.v}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Section B — REAL EQUIPMENT PHOTO */}
                  <div className="bg-[#1A1F28] text-white rounded-[8px] p-4 relative shrink-0">
                    
                    {/* Floating top bar */}
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-[8px] font-black text-[#A8B4C4] uppercase tracking-widest leading-none flex items-center gap-1">
                        <Maximize2 size={11} className="text-[#2D6CDF]" />
                        {tLabel('▣ 全景物理工业实像遥测抓拍', '▣ REAL EQUIPMENT PHOTO')}
                      </span>
                      <div className="flex gap-1.5 z-10">
                        <button 
                          onClick={() => setFullscreenPhoto(!fullscreenPhoto)} 
                          className="bg-[#2D3139] hover:bg-[#3B414D] border border-white/10 text-[#C1CDDC] text-[7.5px] font-black font-mono uppercase px-1.5 py-1 rounded-[2px] tracking-wider active:scale-95 leading-none transition-all"
                        >
                          {tLabel('⤡ 扩满视角', '⤡ FULLSCREEN')}
                        </button>
                        <button 
                          onClick={() => setViewAngle((prev) => (prev + 90) % 360)} 
                          className="bg-[#2D3139] hover:bg-[#3B414D] border border-white/10 text-[#C1CDDC] text-[7.5px] font-black font-mono uppercase px-1.5 py-1 rounded-[2px] tracking-wider active:scale-95 leading-none transition-all"
                        >
                          {tLabel('↻ 调角', '↻ ROTATE')}
                        </button>
                      </div>
                    </div>

                    {/* Image Area */}
                    <div className="h-[180px] bg-[#11141B] rounded-[6px] border border-white/5 relative flex items-center justify-center p-3 overflow-hidden">
                      <img 
                        src={getFinalAssetUrl(selectedAssetCode === 'EQ-01' ? '/assets/scada/eq01_ge_icl_compressor.jpg' : selectedAsset.thumbnailUrl)} 
                        alt={`${selectedAsset.name} Active Real View`} 
                        className="max-h-full max-w-full object-contain filter drop-shadow-[0_12px_24px_rgba(0,0,0,0.4)] transition-transform duration-500"
                        referrerPolicy="no-referrer"
                        style={{ transform: `rotate(${viewAngle}deg)` }}
                      />
                      {/* Sub shadow ellipse asset design */}
                      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-40 h-2 bg-black/40 blur-md rounded-full pointer-events-none" />
                    </div>

                    {/* Overlay simulation of zoom if fullscreen */}
                    <AnimatePresence>
                      {fullscreenPhoto && (
                        <motion.div 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          onClick={() => setFullscreenPhoto(false)}
                          className="fixed inset-0 bg-black/95 z-[9999] flex items-center justify-center cursor-zoom-out p-12"
                        >
                          <img 
                            src={getFinalAssetUrl(selectedAssetCode === 'EQ-01' ? '/assets/scada/eq01_ge_icl_compressor.jpg' : selectedAsset.thumbnailUrl)} 
                            alt={`${selectedAsset.name} Full View`} 
                            className="max-h-full max-w-full object-contain"
                            referrerPolicy="no-referrer"
                          />
                          <span className="absolute bottom-6 text-[#A8B4C4] font-mono text-[10px] uppercase text-center w-full">
                            {tLabel('微击任意空白处退回 standard 面板', 'Click anywhere to return to profile dashboard')}
                          </span>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Section C — 3D RECONSTRUCTED CUTAWAY */}
                  <div className="bg-[#FAFBFD] border border-[#E2E7EF] rounded-[8px] p-4 shrink-0 relative">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="text-[9px] font-black uppercase text-[#0F1722] tracking-wider leading-none">
                        {tLabel('▣ 三维透视重建仿真剖面 · 探寻高危故障测点 (3D CUTAWAY)', '▣ 3D RECONSTRUCTED CUTAWAY · click red/amber hotspots')}
                      </h4>
                      <span className="bg-[#E8F1FC] text-[#2D6CDF] border border-[#2D6CDF]/10 px-1.5 py-0.5 rounded-[2px] text-[7px] font-mono font-black tracking-wider leading-none">
                        DRAG TO ROTATE
                      </span>
                    </div>

                    {/* Schematic Image with interactive hotspots */}
                    <div className="h-[210px] bg-[#EEF2F8] rounded-[6px] border border-[#E2E7EF] relative flex items-center justify-center overflow-hidden p-6" style={{ backgroundImage: 'radial-gradient(#C5CCD9 1px, transparent 1px)', backgroundSize: '8px 8px' }}>
                      <img 
                        src={getFinalAssetUrl(selectedAssetCode === 'EQ-01' ? '/assets/scada/eq01_ge_icl_compressor.jpg' : selectedAsset.thumbnailUrl)} 
                        alt={`${selectedAsset.name} SCADA Diagram`} 
                        className="max-h-full max-w-full object-contain filter drop-shadow-[0_12px_24px_rgba(0,0,0,0.12)] pointer-events-none select-none"
                        referrerPolicy="no-referrer"
                      />

                      {/* Hotspots layer of Cutaway */}
                      <svg className="absolute inset-0 w-full h-full z-10">
                        {activeHotspots.map((chp) => {
                          const cx = `${chp.x}%`;
                          const cy = `${chp.y}%`;

                          return (
                            <g 
                              key={chp.id}
                              onClick={() => {
                                navigate(`#L3?asset=${selectedAssetCode}&part=${chp.id}`);
                              }}
                              className="cursor-pointer group"
                            >
                              {/* Glowing ripple ring */}
                              <circle 
                                cx={cx} 
                                cy={cy} 
                                r={14} 
                                fill="none" 
                                stroke={chp.color} 
                                strokeWidth={1} 
                                className="scale-95 origin-center transition-all group-hover:scale-125 group-hover:stroke-[2px] opacity-80"
                                strokeDasharray="3,3"
                              />

                              {/* Target Outer circle border */}
                              <circle 
                                cx={cx} 
                                cy={cy} 
                                r={8} 
                                fill="white" 
                                stroke={chp.color} 
                                strokeWidth={2} 
                                className="transition-transform group-hover:scale-110"
                              />

                              {/* Center inner dot */}
                              <circle 
                                cx={cx} 
                                cy={cy} 
                                r={3} 
                                fill={chp.color} 
                              />

                              {/* Dynamic Text leader callouts inside cutaway schema */}
                              <foreignObject 
                                x={`calc(${chp.x}% - 65px)`} 
                                y={`calc(${chp.y}% - 34px)`} 
                                width={130} 
                                height={26}
                                className="pointer-events-none"
                              >
                                <div className={cn(
                                  "flex flex-col items-center justify-center text-center filter drop-shadow-[0_1px_3px_rgba(0,0,0,0.08)] scale-75 select-none bg-white border rounded-[3px] border-[#6A7686]/20 px-1 py-0.5",
                                )}>
                                  <span className="text-[7.5px] font-black text-[#0F1722] leading-none uppercase">{chp.id}</span>
                                  <span className="text-[6.2px] text-[#6A7686] leading-none truncate uppercase mt-0.5 max-w-[120px]">
                                    {tLabel(chp.label_zh, chp.label_en)}
                                  </span>
                                </div>
                              </foreignObject>
                            </g>
                          );
                        })}
                      </svg>
                    </div>

                    {/* Inline toast popup system feedback simulated */}
                    <AnimatePresence>
                      {maintenanceLogged && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="absolute bottom-4 left-4 right-4 bg-[#0F1722] text-[#A8B4C4] border border-white/10 p-2.5 rounded-[4px] z-50 text-[10px] text-center"
                        >
                          ⚙ {maintenanceLogged}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                </div>

                {/* Level 2 Footer sticky action bar inside Drawer */}
                <div className="h-10 border-t border-[#E2E7EF] pt-4 mt-4 flex items-center justify-between gap-3 shrink-0">
                  <button 
                    onClick={() => navigate(`#L3?asset=${selectedAssetCode}&part=${activeHotspots[0]?.id || 'HS-A'}`)} 
                    className="flex-1 h-8 bg-[#2D6CDF] text-white hover:bg-[#2051B2] active:scale-95 transition-all text-[10px] rounded-[3px] font-black uppercase tracking-wider flex items-center justify-center gap-1 shadow-sm font-mono"
                  >
                    ▶ {tLabel(`下钻自检分析 (${activeHotspots[0]?.id || 'HS-A'})`, `SCADA ANALYSIS (${activeHotspots[0]?.id || 'HS-A'})`)}
                  </button>
                  <button 
                    onClick={() => {
                      setExportTriggered(true);
                      setTimeout(() => setExportTriggered(false), 2400);
                    }} 
                    className="w-[150px] h-8 bg-[#0F1722] text-white hover:bg-black active:scale-95 transition-all text-[9.5px] rounded-[3px] font-black uppercase tracking-wider flex items-center justify-center gap-1.5 font-mono"
                  >
                    <Download size={12} />
                    {exportTriggered ? tLabel('汇出中...', 'EXPORTING...') : tLabel('物理卷宗 PDF', 'EXPORT PDF')}
                  </button>
                  <button 
                    onClick={() => {
                      setMaintenanceLogged(tLabel('维保系统日志已调取，本年已保养次数：3次。主要更换滤芯，润滑循环。', 'Maintenance event list accessed. Previous work: Filter replace, Lubricant purge.'));
                      setTimeout(() => setMaintenanceLogged(null), 3000);
                    }} 
                    className="w-[140px] h-8 bg-[#3A4658] text-white hover:bg-[#293240] active:scale-95 transition-all text-[9.5px] rounded-[3px] font-black uppercase tracking-wider flex items-center justify-center gap-1 font-mono"
                  >
                    <PenTool size={12} />
                    {tLabel('维保审计历年', 'HISTORY LOG')}
                  </button>
                  <button 
                    onClick={() => navigate('#L1')} 
                    className="w-[80px] h-8 bg-[#FAFBFD] border border-[#E2E7EF] text-[#6A7686] hover:bg-[#EEF2F8] active:scale-95 transition-all text-[9.5px] rounded-[3px] font-black uppercase tracking-wider flex items-center justify-center font-mono"
                  >
                    {tLabel('✕ 返回', '✕ CLOSE')}
                  </button>
                </div>

              </div>

            </motion.div>
          )}
        </AnimatePresence>

        {/* ==================== LEVEL 3: PART DETAIL ==================== */}
        <AnimatePresence mode="wait">
          {level === 'L3' && (
            <motion.div 
              key="level3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 p-6 flex gap-6 overflow-hidden"
            >
              
              {/* Left Context panel: Dimmed cutaway */}
              <div className="w-[780px] bg-white border border-[#E2E7EF] rounded-[10px] p-5 flex flex-col justify-between shrink-0 relative overflow-hidden">
                <div className="absolute top-4 right-4 z-10">
                  <span className="bg-[#2D6CDF] text-white px-2 py-1 rounded-[2px] text-[8px] font-mono font-bold tracking-widest leading-none">
                    LEVEL 2 OVERVIEW
                  </span>
                </div>

                <div className="flex flex-col mb-4">
                  <h2 className="text-[12px] font-black text-[#0F1722] uppercase tracking-wider">
                    {tLabel('自检测点位透视定位图 (二级上下文)', 'STATIC SCADA HOTSPOT (CONTEXT)')}
                  </h2>
                  <p className="text-[9px] text-[#6A7686] font-medium mt-0.5 leading-none">
                    {tLabel(`当前正锁定 [${selectedAsset.code} · ${selectedPart?.id}] 自检测点进行多维数据流分析`, `Active tracking on ${selectedAsset.code} - ${selectedPart?.id} self-check sensor`)}
                  </p>
                </div>

                {/* Show cutaway or profile image with the selected hotspot active */}
                <div className="flex-1 bg-[#EEF2F8]/70 rounded-[8px] border border-[#E2E7EF] relative flex items-center justify-center p-6" style={{ backgroundImage: 'radial-gradient(#C5CCD9 1.4px, transparent 1.4px)', backgroundSize: '12px 12px' }}>
                  <img 
                    src={getFinalAssetUrl(selectedAssetCode === 'EQ-01' ? '/assets/scada/eq01_ge_icl_compressor.jpg' : selectedAsset.thumbnailUrl)} 
                    alt="SCADA context diagram" 
                    className="max-h-full max-w-full object-contain filter drop-shadow-[0_12px_24px_rgba(0,0,0,0.06)] opacity-40 select-none pointer-events-none"
                    referrerPolicy="no-referrer"
                  />

                  {/* Red dashed pulsing circle on the active part */}
                  {selectedPart && (
                    <div 
                      className="absolute z-10 flex flex-col items-center" 
                      style={{ left: `${selectedPart.x}%`, top: `${selectedPart.y}%`, transform: 'translate(-50%, -50%)' }}
                    >
                      <div 
                        className="w-10 h-10 rounded-full border-2 border-dashed animate-spin mb-1 bg-opacity-10 flex items-center justify-center" 
                        style={{ 
                          animationDuration: '6s',
                          borderColor: selectedPart.color, 
                          backgroundColor: `${selectedPart.color}22` 
                        }}
                      >
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: selectedPart.color }} />
                      </div>
                      <span className="bg-[#0F1722] text-white px-1.5 py-0.5 border text-[8.5px] font-black font-mono tracking-wider rounded-[2px]" style={{ borderColor: `${selectedPart.color}55` }}>
                        {selectedPart.id} · {tLabel(selectedPart.label_zh, selectedPart.label_en)}
                      </span>
                    </div>
                  )}

                  {/* Absolute visual drill red arrow link on the right edge */}
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 z-20 flex flex-col items-center animate-pulse">
                    <span className="text-[#D8454C] font-black text-[22px] leading-none">-|&gt;</span>
                    <span className="text-[7.5px] font-black text-[#D8454C] uppercase tracking-wider bg-white border border-[#D8454C]/25 px-1 rounded-sm mt-1 shadow-sm leading-none">
                      DRILL IN
                    </span>
                  </div>
                </div>
              </div>


              {/* Right detail drawer: Complete specs and diagnostics (974 wide) */}
              <div className="w-[974px] bg-white border border-[#E2E7EF] rounded-[10px] p-5 flex flex-col justify-between shrink-0 overflow-y-auto no-scrollbar relative">
                <div className="absolute top-4 right-4 z-10">
                  <span className="bg-[#B23A6A] text-white px-2 py-0.5 rounded-[2px] text-[8px] font-mono font-bold tracking-widest leading-none">
                    LEVEL 3
                  </span>
                </div>

                {/* Section 1 — Part summary header */}
                <div className="bg-[#0F1722] text-white border rounded-[8px] p-4 mb-4 mt-1 flex justify-between items-center shrink-0" style={{ borderColor: selectedPart?.color || '#E2E7EF' }}>
                  <div className="flex flex-col">
                    <span className="text-[7.8px] text-[#A8B4C4] font-black uppercase tracking-widest leading-none mb-1">
                      PART · {tLabel('测点即时自检状态', 'SCADA MEASUREMENT SELF-CHECK')}
                    </span>
                    <h3 className="text-[17px] font-black text-white leading-tight uppercase font-mono tracking-tight flex items-center gap-2">
                      <Compass size={20} className="shrink-0" style={{ color: selectedPart?.color || '#2D6CDF' }} />
                      {selectedPart?.id} · {tLabel(selectedPart?.label_zh || '', selectedPart?.label_en || '')}
                    </h3>
                    <p className="text-[8.5px] text-[#C9D1DE] mt-1 font-semibold">
                      {tLabel('高灵敏度自检测定传感装置 · 设备安全在轨参数 · 指标线: ', 'High-precision active monitoring point - self-test telemetry profile: ')}
                      <span className="font-bold underline" style={{ color: selectedPart?.color }}>
                        {tLabel(selectedPart?.status_zh || '', selectedPart?.status_en || '')}
                      </span>
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-1.5 justify-end">
                    {/* Linked anomaly badge (page_1_3 update) */}
                    <span className="bg-[#B23A6A] hover:bg-[#962651] transition-colors text-white px-2 py-0.5 rounded-[2px] text-[8.5px] font-mono font-black uppercase tracking-wider flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                      {tLabel('关联异动: ANO-2026-0512 · 领先预警: T-197h', 'LINKED ANOMALY: ANO-2026-0512 · LEAD TIME: T-197h')}
                    </span>
                    <span className="px-2 py-1 rounded-[2px] text-[8px] font-mono font-black uppercase tracking-widest leading-none" style={{ backgroundColor: selectedPart?.color || '#3A4658', color: '#fff' }}>
                      {selectedPart?.color === '#D8454C' ? 'CRITICAL' : selectedPart?.color === '#E89518' ? 'WARN' : 'ACTIVE'}
                    </span>
                    <span className="bg-[#3A4658] text-white px-2 py-1 rounded-[2px] text-[8px] font-mono font-black uppercase tracking-widest leading-none">
                      {selectedPart?.id}
                    </span>
                    <span className="bg-[#2D6CDF] text-white px-2 py-1 rounded-[2px] text-[8px] font-mono font-black uppercase tracking-widest leading-none">
                      {selectedAssetCode}
                    </span>
                  </div>
                </div>

                {/* Drawer middle sections wrapped in 2 components or scroll area file */}
                <div className="flex-1 flex flex-col justify-between gap-6 overflow-y-auto no-scrollbar pr-1">
                  
                  {/* Row content: Split vendor specs and live diagnostics */}
                  <div className="grid grid-cols-2 gap-4 shrink-0">
                    
                    {/* Section 2 — VENDOR & SUPPLY CHAIN */}
                    <div className="bg-[#FAFBFD] border border-[#E2E7EF] rounded-[8px] p-4">
                      <h4 className="text-[9px] font-black uppercase text-[#0F1722] tracking-wider mb-2 leading-none flex items-center gap-1">
                        <Award size={12} className="text-[#2D6CDF]" />
                        {tLabel('▣ 出厂溯源契约及耗损供应链 (SUPPLY CHAIN)', '▣ VENDOR & SUPPLY CHAIN')}
                      </h4>

                      <div className="space-y-2 text-[10px]">
                        {[
                          { k: tLabel('工业铸造商', 'Manufacturer'), v: tLabel(selectedAsset.vendor_zh, selectedAsset.vendor), isRed: false },
                          { k: tLabel('供应大洲国境', 'OEM Country'), v: selectedAssetCode === 'EQ-01' ? '🇮🇹 Italy (Florence facility)' : '🇩🇪 Germany (Munich)', isRed: false },
                          { k: tLabel('装配部专用号', 'Part Number'), v: `${selectedAssetCode}-${selectedPart?.id}-410`, isRed: false },
                          { k: tLabel('特许设计材质', 'Material'), v: getPartMaterials(selectedAssetCode), isRed: false },
                          { k: tLabel('OEM总包认证', 'Supplier Code'), v: `BH-${selectedAssetCode}-IT-0042`, isRed: false },
                          { k: tLabel('本土备货服务商', 'Local Agent'), v: 'Western Caspian Logistics (Aktau)', isRed: false },
                          { k: tLabel('到货应急期 ( replacement )', 'Lead Time (replace)'), v: tLabel('45 天工期 · 2 备用货源调拨', '45 days · 2 backup sources'), isRed: false },
                          { k: tLabel('出厂保质期限', 'Warranty Expiry'), v: selectedAssetCode === 'EQ-01' ? '2024-08-14 (EXPIRED)' : '2028-12-31 (Active)', isRed: selectedAssetCode === 'EQ-01' }
                        ].map((item, idx) => (
                          <div key={idx} className="flex justify-between items-center py-1 border-b border-[#E2E7EF] last:border-0 font-medium">
                            <span className="text-[#6A7686] text-[8.2px] uppercase font-bold">{item.k}</span>
                            <span className={cn("font-black text-[9.5px]", item.isRed ? "text-[#D8454C] font-extrabold font-mono" : "text-[#1A2330]")}>
                              {item.v}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>


                    {/* Section 3 — LIVE DIAGNOSTICS */}
                    <div className="bg-[#FAFBFD] border border-[#E2E7EF] rounded-[8px] p-4">
                      <h4 className="text-[9px] font-black uppercase text-[#0F1722] tracking-wider mb-2.5 leading-none flex items-center gap-1">
                        <Zap size={11} className="text-[#D8454C]" />
                        {tLabel('▣ 核心高频测定传感器自检瞬时波动率 (DIAGNOSTICS)', '▣ LIVE DIAGNOSTICS - SENSOR SELF-CHECK')}
                      </h4>

                      <div className="grid grid-cols-2 gap-3.5">
                        {getLiveDiagnostics(selectedAssetCode, selectedPart?.id || 'HS-A').map((diag, idx) => (
                          <div key={idx} className="bg-white border border-[#E2E7EF] rounded-[5px] p-2.5 flex justify-between items-center shadow-sm">
                            <div className="flex flex-col">
                              <span className="text-[7.8px] text-[#6A7686] uppercase font-bold leading-none mb-1.5">{diag.key}</span>
                              <span className="text-[14px] font-mono font-bold text-[#0F1722] leading-none">{diag.val}</span>
                            </div>
                            <span className={cn("text-[7px] font-extrabold font-mono px-1 py-0.5 rounded-[2px] leading-none shrink-0 uppercase", diag.c)}>
                              {diag.delta}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>


                  {/* Section 4 — TECHNICAL SPECIFICATION */}
                  <div className="bg-[#FAFBFD] border border-[#E2E7EF] rounded-[8px] p-4 shrink-0">
                    <h4 className="text-[9px] font-black uppercase text-[#0F1722] tracking-wider mb-2.5 leading-none flex items-center gap-1.5">
                      <BarChart size={12} className="text-[#2D6CDF]" />
                      {tLabel('▣ 核心工艺结构与电调控制模块规格 (TECHNICAL SPECIFICATION)', '▣ TECHNICAL SPECIFICATION & CALIBRATION MATRIX')}
                    </h4>

                    <div className="grid grid-cols-4 gap-3">
                      {getTechSpecs(selectedAssetCode).map((tech, idx) => (
                        <div key={idx} className="bg-white border border-[#E2E7EF] rounded-[5px] p-2 flex flex-col justify-center">
                          <span className="text-[7.6px] text-[#6A7686] uppercase font-bold leading-none mb-1">{tLabel(tech.k_zh, tech.k_en)}</span>
                          <span className="text-[9px] font-extrabold text-[#0F1722] leading-tight truncate">{tech.v}</span>
                        </div>
                      ))}
                    </div>
                  </div>


                  {/* Split block: Maintenance History & Doc links */}
                  <div className="grid grid-cols-12 gap-4 shrink-0">
                    
                    {/* Section 5 — MAINTENANCE HISTORY */}
                    <div className="col-span-8 bg-[#FAFBFD] border border-[#E2E7EF] rounded-[8px] p-4 flex flex-col justify-between">
                      <h4 className="text-[9px] font-black uppercase text-[#0F1722] tracking-wider mb-3 leading-none flex items-center gap-1">
                        <Clock size={11} className="text-[#0F1722]" />
                        {tLabel('▣ 巡检自检与健康演进时序审计 (MAINTENANCE HISTORY)', '▣ HISTORY LINE - SENSOR AUDIT TRAIL')}
                      </h4>

                      {/* Custom Horizontal Timeline */}
                      <div className="relative py-4 pr-3 pl-2 sm:px-6">
                        {/* Connecting axis */}
                        <div className="absolute left-6 right-6 top-[28px] h-0.5 bg-[#A8B4C4]" />

                        <div className="flex justify-between relative z-10 w-full">
                          {getTimelineEvents(selectedAssetCode, language).map((ev, idx) => (
                            <div key={idx} className="flex flex-col items-center select-none w-16">
                              <span className="text-[7.5px] font-mono font-semibold text-[#6A7686] mb-1.5 leading-none">{ev.d}</span>
                              <div 
                                className="w-[10px] h-[10px] rounded-full border border-white flex items-center justify-center shadow-sm" 
                                style={{ backgroundColor: ev.col }}
                              />
                              <span className="text-[7px] font-extrabold text-[#0F1722] uppercase tracking-tighter text-center mt-2 leading-tight h-5 overflow-hidden">
                                {ev.e}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>


                    {/* Section 6 — DOCS & ACTIONS */}
                    <div className="col-span-4 bg-[#FAFBFD] border border-[#E2E7EF] rounded-[8px] p-4 flex flex-col">
                      <h4 className="text-[9px] font-black uppercase text-[#0F1722] tracking-wider mb-2 leading-none flex items-center gap-1.5">
                        <FileText size={11} className="text-[#2D6CDF]" />
                        {tLabel('▣ 自检审计蓝图与应急处置对策 (DOCS & ACTIONS)', '▣ COMPLIANCE DOCS & DISPATCH ACTIONS')}
                      </h4>

                      <div className="space-y-1.5 text-[9px] flex-1 overflow-y-auto no-scrollbar">
                        {[
                          { lbl: tLabel(`📄 自检指南 Datasheet-${selectedAssetCode}.pdf`, `📄 Datasheet ${selectedAssetCode}-SPEC.pdf`), col: 'text-[#2D6CDF]' },
                          { lbl: tLabel('📄 故障校准图纸与出厂接线模型', '📄 Calibration & Wiring Blueprint'), col: 'text-[#2D6CDF]' },
                          { lbl: tLabel('📄 上季度运维内审合格证书', '📄 Q1 Safety Compliance Cert'), col: 'text-[#2FA862]' },
                          { lbl: selectedAssetCode === 'EQ-01' ? tLabel('📄 进口部件保固报告 (超期警告)', '📄 Under Warranty Report (EXPIRED)') : tLabel('📄 维保条约与质保认证书', '📄 Certified active warranty docs'), col: selectedAssetCode === 'EQ-01' ? 'text-[#D8454C]' : 'text-[#2FA862]' },
                          { lbl: tLabel('⚙ 自检微调：执行重阻校正及除焦', '⚙ Self-check dispatch: run calibration'), col: 'text-[#D8454C] bg-[#FDECEC] font-bold px-1 rounded-sm' },
                          { lbl: tLabel('✉ 通报哈机委驻场调度组特派组', '✉ Notify Caspian dispatch team'), col: 'text-[#2D6CDF] bg-[#E8F1FC] font-bold px-1 rounded-sm' }
                        ].map((doc, idx) => (
                          <div key={idx} className="flex items-center justify-between p-1 hover:bg-[#EEF2F8] border border-[#E2E7EF]/50 rounded-[3px] cursor-pointer">
                            <span className={cn("truncate font-medium max-w-[214px]", doc.col)}>{doc.lbl}</span>
                            <ExternalLink size={9} className="text-[#6A7686] shrink-0" />
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>

                </div>

                {/* Sticky bottom Level 3 Footer action controls with feedback */}
                <div className="h-10 border-t border-[#E2E7EF] pt-4 mt-4 flex items-center justify-between gap-3 shrink-0">
                  <button 
                    onClick={() => navigate('/audit/case')} 
                    className="w-[185px] h-8 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white active:scale-95 transition-all text-[9.5px] rounded-[3px] font-black uppercase tracking-wider flex items-center justify-center gap-1 shadow-sm font-mono"
                  >
                    <FolderOpen size={12} />
                    {tLabel('⚡ 跨链历史先例库', '⚡ CROSS-LINK PRECEDENTS')}
                  </button>
                  <button 
                    onClick={() => {
                      setTasksCreated(true);
                      setTimeout(() => setTasksCreated(false), 2400);
                    }} 
                    className="flex-1 h-8 bg-[#2D6CDF] hover:bg-[#1E4FA8] text-white active:scale-95 transition-all text-[9.5px] rounded-[3px] font-black uppercase tracking-wider flex items-center justify-center gap-1 shadow-sm font-mono"
                  >
                    <Settings size={12} />
                    {tasksCreated ? tLabel('巡修工单拉起！信息直通大屏', 'TELEMETRY DISPATCHED!') : tLabel(`▶ 校验点自检重建工单 (${selectedPart?.id || 'HS-A'})`, `▶ REBUILD CALIBRATION WORK ORDER (${selectedPart?.id || 'HS-A'})`)}
                  </button>
                  <button 
                    onClick={() => {
                      setVendorNotified(true);
                      setTimeout(() => setVendorNotified(false), 2400);
                    }} 
                    className="w-[200px] h-8 bg-[#0F1722] hover:bg-black text-white active:scale-95 transition-all text-[9.5px] rounded-[3px] font-black uppercase tracking-wider flex items-center justify-center gap-1.5 font-mono"
                  >
                    <Mail size={12} />
                    {vendorNotified ? tLabel('邮件发出！厂家支持中', 'EMAIL DISPATCHED!') : tLabel('✉ 发起远程厂家联动会商', '✉ CONVENE VENDOR CO-DIAGNOSIS')}
                  </button>
                  <button 
                    onClick={() => {
                      setExportTriggered(true);
                      setTimeout(() => setExportTriggered(false), 2000);
                    }} 
                    className="w-[180px] h-8 bg-[#3A4658] hover:bg-[#2A3341] text-white active:scale-95 transition-all text-[9.5px] rounded-[3px] font-black uppercase tracking-wider flex items-center justify-center gap-1.5 font-mono"
                  >
                    <Download size={12} />
                    {exportTriggered ? tLabel('组装 PDF ...', 'COMPILING...') : tLabel('⤓ 汇出诊断卷宗档案', '⤓ EXPORT REPORT')}
                  </button>
                  <button 
                    onClick={() => navigate(`#L2?asset=${selectedAssetCode}`)} 
                    className="w-[110px] h-8 bg-[#FAFBFD] border border-[#E2E7EF] text-[#6A7686] hover:bg-[#EEF2F8] active:scale-95 transition-all text-[9.5px] rounded-[3px] font-black uppercase tracking-wider flex items-center justify-center font-mono"
                  >
                    {tLabel('✕ 关闭', '✕ CLOSE')}
                  </button>
                </div>

              </div>

            </motion.div>
          )}
        </AnimatePresence>

      </div>

      {/* Global GitHub Asset Source Configuration Modal */}
      <AnimatePresence>
        {showConfigPanel && (
          <div className="fixed inset-0 bg-[#0c0e14]/75 backdrop-blur-sm z-[99999] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white border border-[#E2E7EF] rounded-xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col font-sans"
            >
              {/* Header */}
              <div className="bg-[#0F1722] text-white px-5 py-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Settings size={14} className="text-[#2D6CDF] animate-spin-slow" />
                  <h3 className="text-xs font-black uppercase tracking-wider">
                    {tLabel('数位工况图谱数据源配置', 'SCADA ASSETS DIRECTORY PROXY')}
                  </h3>
                </div>
                <button
                  onClick={() => setShowConfigPanel(false)}
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer text-xs font-mono"
                >
                  ✕
                </button>
              </div>

              {/* Body */}
              <div className="p-5 flex flex-col gap-4 text-xs text-[#1A2330] leading-relaxed">
                <div>
                  <p className="font-semibold text-[#0F1722] mb-1">
                    {tLabel('1. 远程图谱原理', '1. Remote Asset Proxy Concept')}
                  </p>
                  <p className="text-[#6A7686] text-[11px] leading-normal">
                    {tLabel(
                      '如果本地沙箱环境的静态资源因浏览器 iframe 安全策略、沙箱证书限制或跨域冲突无法正常加载，您可以开启远程 GitHub 数据源。系统将向公开的 GitHub Raw 内容服务（raw.githubusercontent.com）直接发送高质量图像请求。',
                      'If native static files fail to render inside the sandbox iframe due to security constraints, you can bridge a GitHub Remote source. The app will fetch authentic images directly from your repository Raw URL.'
                    )}
                  </p>
                </div>

                <div>
                  <p className="font-semibold text-[#0F1722] mb-1">
                    {tLabel('2. 在您的 GitHub 托管资源', '2. Hosting files on GitHub')}
                  </p>
                  <p className="text-[#6A7686] text-[11px] leading-normal">
                    {tLabel(
                      '系统内的全部设备图谱与物理实机照片已由本助手完美打包完毕。您可以将本地的 `public/assets/scada/*` 资源文件克隆/克隆提交到您个人的任何公开 GitHub 仓库上。',
                      'We have compiled the 9 high-resolution graphics ready for display. Feel free to copy or push the files from `/public/assets/scada/*` directly into any public GitHub repository.'
                    )}
                  </p>
                </div>

                {/* Input Base URL */}
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5 flex flex-col gap-2">
                  <span className="font-bold text-[10px] text-[#0F1722] uppercase tracking-wider font-mono">
                    {tLabel('GitHub Raw 基准地址 (GitHub RAW Base URL)', 'GitHub RAW Access Base URL')}
                  </span>
                  
                  <input
                    type="text"
                    value={tempBaseUrl}
                    onChange={(e) => setTempBaseUrl(e.target.value)}
                    placeholder="https://raw.githubusercontent.com/username/repo/main/public"
                    className="w-full bg-white border border-[#C5CCD9] rounded px-3 py-1.5 text-[11px] font-mono focus:outline-none focus:ring-1 focus:ring-[#2D6CDF] placeholder:text-slate-300"
                  />
                  
                  <div className="text-[10px] text-slate-500 font-mono leading-tight flex flex-col gap-1 mt-1">
                    <span className="text-[#2D6CDF] font-semibold">{tLabel('【推荐地址模板】:', '[Pre-set URLs Templates]:')}</span>
                    <button 
                      onClick={() => setTempBaseUrl('https://raw.githubusercontent.com/karlee01/ai-statecraft/main/public')}
                      className="text-left hover:underline text-[#2D6CDF] truncate font-mono text-[9px]"
                    >
                      • https://raw.githubusercontent.com/karlee01/ai-statecraft/main/public
                    </button>
                    <button 
                      onClick={() => setTempBaseUrl('https://raw.githubusercontent.com/karlee01/AI-STATECRAFT/main/public')}
                      className="text-left hover:underline text-[#2D6CDF] truncate font-mono text-[9px]"
                    >
                      • https://raw.githubusercontent.com/karlee01/AI-STATECRAFT/main/public
                    </button>
                    <button 
                      onClick={() => setTempBaseUrl('')}
                      className="text-[#D8454C] text-left hover:underline font-bold text-[9px] mt-1"
                    >
                      • {tLabel('清除配置并重置为本地 Public 文件夹 (Reset to Sandboxed Public Directory)', 'Reset to use native sandbox public paths')}
                    </button>
                  </div>
                </div>

                <div className="text-[10px] text-slate-400 font-mono border-t border-slate-100 pt-2.5">
                  {tLabel('实时资产地址映射解析预览 : ', 'Resolved Path Mapping Preview:')}
                  <div className="mt-1 bg-slate-100 p-2 rounded text-[9px] font-mono break-all text-slate-600 leading-normal border border-slate-200">
                    {tempBaseUrl 
                      ? `${tempBaseUrl.endsWith('/') ? tempBaseUrl.slice(0, -1) : tempBaseUrl}/assets/scada/station_overview_isometric.jpg`
                      : '/assets/scada/station_overview_isometric.jpg'
                    }
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="bg-slate-50 border-t border-slate-200 px-5 py-3 flex justify-end gap-2 text-xs">
                <button
                  onClick={() => setShowConfigPanel(false)}
                  className="bg-white hover:bg-slate-50 border border-slate-300 px-3 py-1.5 text-[10px] font-bold text-slate-700 rounded transition-all active:scale-95 cursor-pointer"
                >
                  {tLabel('取消', 'Cancel')}
                </button>
                <button
                  onClick={() => handleSaveAssetBase(tempBaseUrl)}
                  className="bg-[#2D6CDF] hover:bg-[#1E52B6] text-white px-4 py-1.5 text-[10px] font-bold rounded transition-all shadow active:scale-95 cursor-pointer"
                >
                  {tLabel('应用更新', 'Save & Apply')}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
