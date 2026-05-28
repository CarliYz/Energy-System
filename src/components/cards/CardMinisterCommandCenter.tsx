import React from 'react';
import { useLanguage } from '../LanguageContext';
import { useNavigate } from 'react-router-dom';
import { 
  BrainCircuit, ChevronRight, Factory, Zap, Hammer, Satellite 
} from 'lucide-react';

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

export default function CardMinisterCommandCenter() {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const t = (en: string, zh: string) => (language === 'zh' ? zh : en);

  return (
    <section 
      className="bg-white border border-[#E2E7EF] rounded-[4px] p-5 h-[460px] flex flex-col justify-between overflow-hidden shadow-sm relative"
      id="card-minister-command"
    >
      {/* Title Header */}
      <div className="flex items-start justify-between border-b border-[#E2E7EF] pb-1.5 shrink-0 select-none">
        <div>
          <h2 className="text-[12.5px] font-black text-[#0F1722] uppercase tracking-wide flex items-center gap-1.5">
            <BrainCircuit size={14} className="text-[#E89518]" />
            {t('PENDING MINISTER ACTIONS · TOP 5', '部长特别行政特提与一键干预指挥大厅 (TOP 5)')}
          </h2>
          <p className="text-[9px] text-[#6A7686] font-medium leading-none mt-1">
            {t('Auto-prioritized by fiscal exposure × SLA countdown × sensor alignment', '精准权重对齐体系：财政流失风险敞口 × 物理传感器校验合流 24H 动态重排序')}
          </p>
        </div>
        <span className="text-[9px] font-mono bg-red-100 border border-red-200 text-red-700 px-1.5 py-0.5 rounded-[2px] font-black shrink-0">
          {t('3 ACTIVE ESCALATIONS', '3起骨干实体严重越限')}
        </span>
      </div>

      {/* Case Logs List Stack */}
      <div className="flex-1 my-2 overflow-y-auto space-y-2.5 pr-1 select-text scrollbar-thin">
        {PENDING_CASES.map((c) => {
          const isCrit = c.severity === 'CRITICAL';
          const isHigh = c.severity === 'HIGH';
          const bgPill = isCrit ? 'bg-red-50 text-[#D8454C]' : isHigh ? 'bg-amber-50 text-[#E89518]' : 'bg-blue-50 text-[#2D6CDF]';

          return (
            <div 
              key={c.id}
              className="bg-white border border-[#E2E7EF] hover:shadow-md transition-shadow p-3 rounded-[3px] flex gap-3 min-h-[140px] justify-between items-center group/card"
            >
              {/* Thumbnail image column */}
              <div className="w-[52px] h-[52px] rounded-[2px] bg-[#F4F6FA] border border-[#E2E7EF] flex items-center justify-center shrink-0 overflow-hidden relative select-none">
                <img 
                  src={c.image} 
                  className="w-full h-full object-cover grayscale group-hover/card:grayscale-0 transition-transform duration-500" 
                  referrerPolicy="no-referrer"
                  alt=""
                />
                <div className="absolute inset-0 bg-black/5 opacity-40" />
              </div>

              {/* Data payload details column */}
              <div className="flex-1 min-w-0 flex flex-col justify-between h-full py-0.5 space-y-1.5">
                
                {/* Meta details header line */}
                <div className="flex items-center justify-between select-none">
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

                {/* Corporate entity */}
                <div className="text-[11.5px] text-[#1A2330] font-semibold leading-none truncate">
                  <strong>{language === 'zh' ? c.entity_zh : c.entity_en}</strong>
                </div>

                {/* Redesigned Highlighted critical issue statement */}
                <div className="bg-red-50/50 border border-red-100/70 rounded-[3px] p-2 flex flex-col justify-center items-start">
                  <span className="text-[8px] font-black tracking-widest text-[#D8454C]/70 font-mono block mb-0.5 uppercase select-none">
                    {t('CURRENT ISSUE / 当前异常问题', '当前异常问题')}
                  </span>
                  <h3 className="text-[13px] md:text-[14px] lg:text-[15px] font-extrabold text-[#D8454C] leading-tight tracking-tight font-sans">
                    {language === 'zh' 
                      ? `${c.facility_zh}${c.cause_zh}` 
                      : `${c.facility_en}: ${c.cause_en}`}
                  </h3>
                </div>

                {/* Quick actions bar */}
                <div className="flex items-center justify-between text-[9.5px] pt-1 border-t border-dashed border-[#E2E7EF] select-none">
                  <span className="text-[#2D6CDF] font-black flex items-center gap-0.5 truncate max-w-[65%]">
                    <ChevronRight size={10} className="shrink-0" />
                    <span className="truncate">{language === 'zh' ? c.recommendation_zh : c.recommendation_en}</span>
                  </span>

                  <div className="flex gap-1.5 shrink-0 opacity-80 group-hover/card:opacity-100 transition-opacity">
                    <button 
                      onClick={() => navigate(`/audit/event/${c.id}`)}
                      className="px-2 py-0.5 text-[8.5px] font-black border border-[#E2E7EF] hover:bg-[#F4F6FA] text-[#1A2330] rounded-[2px] cursor-pointer"
                    >
                      {t('Open', '打开卷宗')}
                    </button>
                    {isCrit && (
                      <button 
                        onClick={() => navigate(`/audit/report`)}
                        className="px-2 py-0.5 text-[8.5px] font-black bg-[#D8454C] text-white hover:bg-[#B23A6A] rounded-[2px] cursor-pointer"
                      >
                        {t('Brief Minister', '呈呈部长')}
                      </button>
                    )}
                  </div>
                </div>

              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
