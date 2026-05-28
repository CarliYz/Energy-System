import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X, Building2, Users, Activity, Network, Receipt, History, Gavel,
  ShieldCheck, Download, ExternalLink, Calendar, CreditCard, MapPin, Briefcase
} from 'lucide-react';
import { useLanguage } from './LanguageContext';
import { type EnterpriseRecord } from '../data/commercial/enterprise_kb';

interface Props {
  enterprise: EnterpriseRecord | null;
  onClose: () => void;
}

export function EnterpriseDetailDrawer({ enterprise, onClose }: Props) {
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

  if (!enterprise) return null;

  const flagBg = enterprise.scoreOverall >= 85 
    ? 'bg-[#2FA862]' 
    : enterprise.scoreOverall >= 60 
      ? 'bg-[#E89518]' 
      : 'bg-[#D8454C]';

  return (
    <AnimatePresence>
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 220 }}
        className="fixed right-0 top-0 bottom-0 w-[540px] bg-white border-l border-[#E2E7EF] shadow-2xl z-[250] flex flex-col overflow-hidden font-sans select-text"
      >
        {/* Sticky Header */}
        <div className={`${flagBg} px-5 py-4 pb-5 text-white shrink-0 relative select-none`}>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white transition-opacity cursor-pointer"
            id="btn-close-ent-drawer"
          >
            <X size={20} />
          </button>

          <div className="flex items-center gap-2 text-[9px] font-mono uppercase tracking-widest opacity-90">
            <Building2 size={12} className="shrink-0" />
            <span>{enterprise.id}</span>
            <span>•</span>
            <span>BIN: {enterprise.taxId}</span>
          </div>

          <h2 className="text-[19px] font-black mt-2 leading-tight tracking-tight">
            {language === 'zh' ? enterprise.nameCn : enterprise.nameEn}
          </h2>
          <p className="text-[11px] opacity-85 mt-0.5 font-mono">
            {language === 'zh' ? enterprise.nameEn : enterprise.nameCn}
          </p>

          <div className="flex items-center gap-3 mt-4">
            <div className="bg-white/15 backdrop-blur rounded-[3px] px-3 py-1.5 min-w-[76px]">
              <div className="text-[8px] uppercase opacity-80 font-mono tracking-wider">{t('Reg Score', '监管评分')}</div>
              <div className="text-[17px] font-black font-mono leading-none mt-1">
                {enterprise.scoreOverall}
                <span className="text-[10px] opacity-70"> /100</span>
              </div>
            </div>
            <div className="bg-white/15 backdrop-blur rounded-[3px] px-3 py-1.5 min-w-[76px]">
              <div className="text-[8px] uppercase opacity-80 font-mono tracking-wider">{t('Establishment', '成立年限')}</div>
              <div className="text-[12px] font-bold font-mono leading-none mt-1.5">
                {enterprise.established.substring(0, 4)}
              </div>
            </div>
            <div className="bg-white/15 backdrop-blur rounded-[3px] px-3 py-1.5 min-w-[76px]">
              <div className="text-[8px] uppercase opacity-80 font-mono tracking-wider">{t('Capital', '注册资本')}</div>
              <div className="text-[12px] font-bold font-mono leading-none mt-1.5 text-nowrap">
                {enterprise.registeredCapital}
              </div>
            </div>
          </div>
        </div>

        {/* Scrolling Panels */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5 custom-scrollbar bg-slate-50/50">
          
          {/* Section 1: Business Profile */}
          <Section title={t('1. Business Profile', '1. 基本工商信息')} icon={<Building2 size={13} />}>
            <Row label={t('Legal Representative', '法定代表人')} value={enterprise.legalRep} />
            <Row label={t('BIN Number', '统一社会税号')} value={enterprise.taxId} mono />
            <Row label={t('Establishment Date', '登记注册日期')} value={enterprise.established} mono />
            <Row label={t('Industry Sector', '行业分类标准')} value={enterprise.industry} />
            <Row label={t('Registered Capital', '登记核名资本')} value={enterprise.registeredCapital} mono />
            <Row label={t('Principal Address', '企业注册地址')} value={enterprise.hqAddress} />
          </Section>

          {/* Section 2: Shareholding Penetration */}
          <Section title={t('2. Shareholding & Ultimate Beneficiary', '2. 股权穿透与受益人')} icon={<Users size={13} />}>
            <div className="space-y-3 pt-1">
              {enterprise.shareholders.map((sh, idx) => (
                <div key={idx} className="flex flex-col gap-1 border-b border-slate-100 last:border-0 pb-2 last:pb-0">
                  <div className="flex items-center justify-between text-[11px] font-bold text-[#0F1722]">
                    <span className="truncate max-w-[280px]">{sh.name}</span>
                    <span className="font-mono text-[#2D6CDF]">{sh.pct}%</span>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden w-full relative">
                    <div 
                      className={`h-full rounded-full ${sh.type === 'state' ? 'bg-[#2D6CDF]' : sh.type === 'foreign' ? 'bg-[#9333EA]' : 'bg-[#10B981]'}`}
                      style={{ width: `${sh.pct}%` }} 
                    />
                  </div>
                  <div className="flex items-center justify-between text-[9px] text-[#6A7686] font-mono uppercase mt-0.5">
                    <span>Type: {sh.type}</span>
                    {sh.ultimateBeneficiary && (
                      <span className="text-amber-600 bg-amber-50 px-1 py-0.5 rounded-[2px] font-bold">
                        UBO: {sh.ultimateBeneficiary}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Section>

          {/* Section 3: Business Scope & Capacity */}
          <Section title={t('3. Operational Capacity & Yield', '3. 核定工艺大宗产能')} icon={<Activity size={13} />}>
            <div className="space-y-2.5 pt-1">
              {enterprise.capacity.map((cap, idx) => (
                <div key={idx} className="flex items-center justify-between text-[11px] border-b border-dashed border-slate-100 pb-2 last:border-0 last:pb-0">
                  <span className="font-bold text-slate-700">{cap.metric}</span>
                  <div className="text-right flex items-center gap-3">
                    <span className="font-mono font-bold text-[#0F1722]">{cap.value} {cap.unit}</span>
                    <span className={`font-mono font-black text-[10px] w-12 text-right ${cap.yoy > 0 ? 'text-[#2FA862]' : cap.yoy < 0 ? 'text-[#D8454C]' : 'text-slate-400'}`}>
                      {cap.yoy > 0 ? `+${cap.yoy}` : cap.yoy}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Section>

          {/* Section 4: Related Entities */}
          <Section title={t('4. Affiliated Networks (Graph)', '4. 关联利益网架节点')} icon={<Network size={13} />}>
            <div className="grid grid-cols-2 gap-2 pt-1">
              {enterprise.relatedEntities.map((ent, idx) => (
                <div key={idx} className="bg-slate-50 border border-slate-100 rounded-[3px] p-2 flex flex-col justify-between h-[56px] hover:border-slate-350 transition-colors">
                  <div className="text-[10px] font-black text-[#0F1722] truncate leading-tight">{ent.name}</div>
                  <div className="flex items-center justify-between text-[8px] font-mono text-slate-500 uppercase mt-1">
                    <span className="truncate max-w-[100px]">{ent.relation}</span>
                    <span className={`font-bold shrink-0 ${ent.riskLevel === 'high' ? 'text-[#D8454C]' : ent.riskLevel === 'mid' ? 'text-[#E89518]' : 'text-[#2FA862]'}`}>
                      ● {ent.riskLevel}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Section>

          {/* Section 5: Tax & Invoice Compliance */}
          <Section title={t('5. Tax & Financial Audit Info', '5. 涉税开票合规审查')} icon={<Receipt size={13} />}>
            <div className="space-y-1.5">
              <Row label={t('Fiscal Compliance Code', '纳税信用识别号')} value={enterprise.taxId} mono />
              <Row label={t('Registered Capital', '法定注册股资金')} value={enterprise.registeredCapital} mono />
              <Row label={t('Tax Compliance Rating', '涉案期间综合合规率')} value="Grade B" />
            </div>
          </Section>

          {/* Section 6: Compliance History Events */}
          <Section title={t('6. Regulatory Incidents & Audits', '6. 历次监管案卷与稽查日志')} icon={<History size={13} />}>
            <div className="space-y-2 pt-1">
              {enterprise.complianceHistory.map((hist, idx) => (
                <div key={idx} className="bg-white border border-slate-150 rounded-[3px] p-2.5 flex flex-col gap-1 hover:border-[#2D6CDF]/30 transition-all text-[10.5px]">
                  <div className="flex items-center justify-between text-[9px] font-mono text-slate-500 border-b border-slate-50 pb-1 flex-wrap gap-1">
                    <div className="flex items-center gap-1.5">
                      <span className="bg-[#2D6CDF]/10 text-[#2D6CDF] px-1 py-0.2 rounded font-black">{hist.category}</span>
                      <span>{hist.date}</span>
                    </div>
                    <span className={`px-1 rounded-[2px] font-black text-[8px] uppercase ${
                      hist.status === 'closed' ? 'bg-green-50 text-green-700' :
                      hist.status === 'open' ? 'bg-red-50 text-red-700' : 'bg-amber-50 text-amber-700'
                    }`}>
                      {hist.status}
                    </span>
                  </div>
                  <div className="text-slate-800 leading-normal font-sans font-medium mt-1">
                    {hist.summary}
                  </div>
                  <div className="text-[8.5px] font-mono uppercase text-right mt-0.5">
                    {t('Level: ', '危害级别: ')}
                    <span className={`font-black ${hist.severity === 'high' ? 'text-[#D8454C]' : hist.severity === 'mid' ? 'text-[#E89518]' : 'text-slate-500'}`}>
                      {hist.severity.toUpperCase()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Section>

          {/* Section 7: Risk Diagnostics & Overall Panel */}
          <Section title={t('7. Scorecard Radar Diagnostics', '7. 牌照分类画像综合评估')} icon={<ShieldCheck size={13} />}>
            <div className="space-y-2 pt-1 select-none">
              {[
                { label: t('Completeness Rating', '信息填报合规完整度'), score: enterprise.scoreBreakdown.compliance, color: '#2D6CDF' },
                { label: t('Industrial Safety Metric', '重特大工业安全工况'), score: enterprise.scoreBreakdown.safety, color: '#D8454C' },
                { label: t('VAT Invoice Authenticity', '开票真实性稽核指数'), score: enterprise.scoreBreakdown.financial, color: '#E89518' },
                { label: t('Environmental Regulation Score', '绿色低碳排温室气环评'), score: enterprise.scoreBreakdown.esg, color: '#10B981' },
              ].map((sub, idx) => (
                <div key={idx} className="flex items-center gap-3 text-[10.5px]">
                  <span className="text-slate-600 font-medium w-40 truncate">{sub.label}</span>
                  <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${sub.score}%`, backgroundColor: sub.color }} />
                  </div>
                  <span className="font-mono font-black text-[#0F1722] w-10 text-right">{sub.score}%</span>
                </div>
              ))}
            </div>
          </Section>
          
          {/* Section 8: Risk tags list */}
          {enterprise.riskTags.length > 0 && (
            <div className="p-3 bg-[#D8454C]/5 border border-[#D8454C]/15 rounded-[4px]">
              <span className="text-[10px] uppercase font-black tracking-wider text-[#D8454C] block font-mono">
                {t('CRITICAL COMPLIANCE TAGS', '智能预警异常画像特征挂签')}
              </span>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {enterprise.riskTags.map((tag, idx) => (
                  <span key={idx} className="bg-white border border-[#D8454C]/20 text-[#D8454C] font-bold text-[9.5px] px-2 py-0.5 rounded-[2px]">
                    # {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Bottom actions */}
          <button
            onClick={() => alert(t('Simulating raw PDF audit file synthesis export pipeline...', '正在调用后台PDF套模板排版引擎合成完整九维工商档案...'))}
            className="w-full h-10 border border-slate-300 hover:border-[#0F1722] text-[#0F1722] hover:bg-slate-55 rounded font-black text-[11px] uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <Download size={12} />
            <span>{t('Export Comprehensive PDF Dossier', '合并打包生成 9 大领域一企一档备存 PDF')}</span>
          </button>

        </div>
      </motion.div>
    </AnimatePresence>
  );
}

function Section({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-[#E2E7EF] rounded p-4 shadow-sm">
      <div className="flex items-center gap-1.5 mb-2.5 pb-2 border-b border-slate-100 select-none">
        <span className="text-[#2D6CDF]">{icon}</span>
        <h3 className="text-[11px] font-black uppercase tracking-wider text-[#0F1722]">{title}</h3>
      </div>
      <div className="space-y-1">{children}</div>
    </div>
  );
}

function Row({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-start justify-between gap-4 py-1 text-[11px] border-b border-slate-50 last:border-0 pb-1.5 last:pb-0">
      <span className="text-slate-500 shrink-0 select-none">{label}</span>
      <span className={`text-right max-w-[62%] text-[#0F1722] font-semibold break-words ${mono ? 'font-mono' : ''}`}>
        {value}
      </span>
    </div>
  );
}
