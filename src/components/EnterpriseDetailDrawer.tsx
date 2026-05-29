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

const EN_TRANSLATIONS: Record<string, string> = {
  // Legal reps
  'Bauyrzhan A. · 巴吾尔詹·阿曼诺夫': 'Bauyrzhan Amannov (Bauyrzhan A.)',
  'Askhat K. · 阿斯哈特·哈塞诺夫': 'Askhat Khasenov',
  'Galymzhan Z. · 加林江·朱桑巴耶夫': 'Galymzhan Zhusanbayev',
  'Mukhtar S. · 穆赫塔尔·萨杜瓦卡索夫': 'Mukhtar Saduakasov',
  'Nabi A. · 纳比·艾特扎诺夫': 'Nabi Aitzhanov',
  'Yerbolat T. · 叶尔波拉特·特列科夫': 'Yerbolat Telekov',
  'Kuanysh B. · 库阿尼什·别克别托夫': 'Kuanysh Bekbetov',
  'Giancarlo R. · 詹卡洛·鲁尤': 'Giancarlo Ruyu',

  // Industries
  '上游油气勘探与开采': 'Upstream Oil & Gas Exploration & Production',
  '国家核心石油与天然气综合体': 'National Core Oil & Gas Conglomerate',
  '下游油品冶炼与石油化工生产': 'Downstream Refining & Petrochemical Production',
  '中游主干天然气转驳与城市燃气供送': 'Midstream Pipeline Transit & Urban Gas Distribution',
  '全国骨干电网运营与联络跨国调度': 'National Backbone Grid Operation & Transnational Dispatch',
  '中小型油气田装备技术及实物维护服务': 'SME Oilfield Equipment Technology & Physical Maintenance Services',
  '国家统一发能机组投资与矿山开采组合': 'State Unified Power Generation & Mining Consortium',
  '境外超级大财团里海联合油田特许开采': 'International Consortium Caspian Oil Field Concession',

  // HQ Address
  '哈萨克斯坦曼吉斯套州 · 阿克套市 · Ozenmunaygas 工业园 BLK-12': 'Ozenmunaygas Industrial Park BLK-12, Aktau, Mangystau, Kazakhstan',
  '哈萨克斯坦阿斯塔纳市 · 努尔若尔大道 19 号国家能源中心大厦': 'National Energy Center, 19 Nurzhol Boulevard, Astana, Kazakhstan',
  '哈萨克斯坦阿特劳州 · 阿特劳市 · 加巴杜林街 1 号': '1 Gabadullin Street, Atyrau, Atyrau Region, Kazakhstan',
  '哈萨克斯坦曼吉斯套州 · 阿克套市 · 第四工业微区 24 号': '24 4th Industrial District, Aktau, Mangystau, Kazakhstan',
  '哈萨克斯坦阿斯塔纳市 · 陶克里克街 59 号': '59 Tauelsizdik Avenue, Astana, Kazakhstan',
  '哈萨克斯坦曼吉斯套州 · 扎瑙岑市 · 第一大街 104号': '104 1st Street, Zhanaozen, Mangystau, Kazakhstan',
  '哈萨克斯坦阿斯塔纳市 · 卡班拜巴特尔大道 17 号': '17 Kabanbay Batyr Avenue, Astana, Kazakhstan',
  '哈萨克斯坦阿特劳市 · 斯马古洛夫街 1号': '1 Smagulov Street, Atyrau, Kazakhstan',

  // Shareholders
  'KazMunayGas E&P': 'KazMunayGas E&P',
  'Sinopec International (中石化国际)': 'Sinopec International',
  'Caspian Holdings BV': 'Caspian Holdings BV',
  '管理层持股平台': 'Management Shareholding Platform',
  'Samruk-Kazyna 主权基金': 'Samruk-Kazyna Sovereign Fund',
  '中国国资委': 'SASAC (China)',
  '中国国家开发银行': 'CDB (China)',
  '国家外汇管理局储备': 'State Foreign Exchange Reserve',
  '哈国能 KMG': 'KMG (Kazakhstan)',
  '中煤能源': 'China Coal Energy',
  '三一装备新加坡': 'Sany Equipment Singapore',
  '哈萨克斯坦共和国政府': 'Government of the Republic of Kazakhstan',
  '哈萨克斯坦国家主权基金储备': 'Samruk-Kazyna Sovereign Wealth Reserve',
  '荷兰 NL-BV / 实控人未披露': 'Netherlands NL-BV / UBO Undisclosed',
  '海外避税群岛实控人 / 壳架构': 'Offshore Tax Haven UBO / Shell Structure',
  'Samruk-Kazyna National Welfare Fund': 'Samruk-Kazyna National Welfare Fund',
  'Samruk-Kazyna Sovereign Fund': 'Samruk-Kazyna Sovereign Fund',
  'National Bank of Kazakhstan (央行信托)': 'National Bank of Kazakhstan',
  '公众流通股 (KASE)': 'Public Float (KASE)',
  'KazMunayGas Refineries': 'KazMunayGas Refineries',
  '零散大众股权': 'Minority Public Equity',
  'KazTransGas Aimak': 'KazTransGas Aimak',
  'Mangystau Energy Private Capital': 'Mangystau Energy Private Capital',
  '小额流通证券 (KASE)': 'Minority Public Equity (KASE)',
  'Caspian Inter-Agencies Direct': 'Caspian Inter-Agencies Direct',
  '管理团队本地持股': 'Local Management Team',
  'KMG (哈萨克国家油)': 'KMG (Kazakhstan National Oil)',
  'Eni / Shell / Total / ExxonMobil 各': 'Eni / Shell / Total / ExxonMobil (each)',
  '中石油 CNPC': 'CNPC',
  '日本 Inpex': 'Inpex (Japan)',
  'Samruk-Kazyna': 'Samruk-Kazyna',
  '意大利/英荷/法国/美国跨国跨界巨擘': 'Eni/Shell/Total/ExxonMobil Multinational Brands',
  '日本 METI': 'METI (Japan)',

  // Capacity metrics
  '原油日产量': 'Daily Crude Oil Production',
  '天然气伴生产量': 'Associated Gas Output',
  '已探明储量': 'Proven Reserves',
  '采收率': 'Recovery Factor',
  '总油气产量': 'Total Oil & Gas Production',
  '原油加工能力': 'Crude Oil Processing Capacity',
  '长途管输周转量': 'Long-distance Pipeline Turnover',
  '新能源投建规模': 'Renewable Energy Portfolio Capacity',
  '原油一次加工能力': 'Primary Crude Processing Capacity',
  '高标准燃料产出率': 'High-standard Fuel Recovery Rate',
  '二氧化硫总排量': 'Total Sulfur Dioxide Emissions',
  '设备开工负荷率': 'Equipment Operating Load Factor',
  '长途输气接管能力': 'Long-distance Grid Receipt Capacity',
  '城市管道接客户数': 'Urban Pipe Connections',
  '冬季应急储运能力': 'Winter Emergency Storage Capacity',
  '天然气平均漏失率': 'Average Gas Loss Rate',
  '骨干输电线路总长': 'Backbone Transmission Line Length',
  '变压器总容量': 'Total Substation Capacity',
  '电网联络潮流负荷': 'Grid Interconnection Current Load',
  '网损率指标率': 'Transmission Loss Ratio',
  '井架实备配套装置': 'Active Drilling Rig Outfits',
  '主力泥浆清洗吞吐': 'Primary Mud Cleaning Throughput',
  '常规巡检技术总人数': 'On-site Certified Technicians',
  '装备老旧缺陷率': 'Equipment Degradation Rate',
  '总装机容量规模': 'Total Installed Power Capacity',
  '年实际发电量': 'Annual Actual Generation',
  '露天碎煤实际开采': 'Open-cast Coal Extraction',
  '绿电水风在投总量': 'Active Hydro/Wind Renewable Portfolio',
  '卡沙甘超巨井日产': 'Kashagan Giant Well Daily Output',
  '海流高压气回注量': 'Offshore High-pressure Gas Reinjection',
  '平台海洋防溢处理': 'Platform Marine Spill Processing',
  '硫磺高毒物堆存率': 'Toxic Sulfur Storage Rate',

  // Related entities
  '阿克套燃气配气公司': 'Aktau Gas Distribution Co.',
  '中石化国际服务北京': 'Sinopec International Services Beijing',
  '曼吉斯套油田服务': 'Mangystau Oilfield Services',
  '阿特劳裂解联合炼化厂': 'Atyrau Refinery JSC',
  '哈萨克国家石油天然气集团': 'KazMunayGas (KMG)',
  '国家电网 KEGOC': 'KEGOC State Grid Corp',
  '西里海能源合资有限公司': 'Western Caspian Energy LLC',
  '萨马鲁克能源股份公司': 'Samruk-Energy JSC',
  'KEGOC 国家电网公司': 'KEGOC State Grid Corp',

  // Relations
  '下游伴生气买家': 'Downstream Gas Buyer',
  '设备与技术服务': 'Equipment & Technical Services',
  '股东方·离岸架构': 'Shareholder (Offshore)',
  '主力油服承包商': 'Lead Oilfield Services Subcontractor',
  '控股子公司(重整炼油)': 'Subsidiary (Oil Refining)',
  '全资输配送网': 'Wholly-owned Transmission Network',
  '主力高压自备接入配合': 'High-voltage Substation Integration',
  '主要母公司 / 业务核定端': 'Parent Company / Business Approver',
  '外协维修作业商': 'External Maintenance Operator',
  '地方中游配气采购伙伴': 'Midstream Gas Procurement Partner',
  '母公司管理指导': 'Parent Directorate Supervision',
  '上网主干关电网关联': 'Grid Connection Provider',
  '联合物理供能配合方': 'Joint Physical Generation Operator',
  '核心承包业务甲流方': 'Core Contractor (Lead Tier-1)',
  '业务分包往来': 'Subcontractor Transactions',
  '主网入网电能供应商': 'Lead Input Generation Utility',
  '大工业购销供电主力对象': 'Primary Industrial Power Off-taker',
  '大股东方业务直托': 'Direct Shareholder Management',
  '上游重质高含硫原油供应': 'Upstream Heavy High-Sulfur Crude Supplier',

  // Categories
  '环保': 'Environmental',
  '安全': 'Safety',
  '财税': 'Financial',
  '反垄断': 'Anti-monopoly',
  '审批': 'Appraisal',

  // Compliance history summaries
  '油泥处置厂排污超标 12%，已限期整改': 'Oil sludge treatment plant emissions exceeded threshold by 12%; remediation implemented.',
  '关联交易转移定价异常，启动专项审计': 'Inter-company transfer pricing abnormality detected; special audit initiated.',
  '一级增压站离心叶片缺陷预警': 'First-stage compressor rotor blade microfracture warning issued.',
  '增产作业许可证延期申请': 'Production increment permit renewal request.',
  '克恩亚克大工业区常规排硫检查正常': 'Routine anti-sulfur emission audit at Kenkiyak industrial zone certified normal.',
  '批准田吉兹新井伴生气回注一期开发许可': 'Tengiz new well associated gas reinjection Phase 1 permit approved.',
  '里海管道 CPC 阀站定期设备安全巡检': 'Caspian Pipeline CPC valve station routine safety inspection.',
  '夜间违规超排非甲烷总烃，处以 1.2亿坚戈环保罚金': 'Excessive hydrocarbon emission at night; fined 120M KZT.',
  '重整二次蒸汽压力过大限压熔断故障': 'Excessive pressure in secondary steam circuit triggered automatic system shutdown.',
  '污泥污水二次处理净化站设备老化渗漏审查': 'Secondary sewage treatment unit leakage under investigation due to aging.',
  '城区高压减压站工艺压差异常报警波动': 'Urban high-pressure reduction unit pressure differential anomaly warning.',
  '加气站商业加价违规突破最高零位限价调查': 'Investigation on pricing cap violations at local retail gas stations.',
  '第三连接线新建核准变更登记': 'Permit change registration for the third delivery pipeline.',
  '南北联络主通道由于严寒发生瞬间闪络过电流': 'North-South grid interconnection flashover overcurrent event under subzero conditions.',
  '克孜勒奥尔达新建220kV双线开工核准': 'Construction permit approved for Kryzlorda 220kV transmission line.',
  '地方配电网大量自建非法矿机盗电致使网频负偏置': 'Unauthorized heavy mining operations causing systemic load deflection.',
  '开具无真实业务背景之虚假结算发票冲抵利得税': 'Tax evasion indictment: fabricated commercial transactions to offset corporate gains.',
  '扎瑙岑联合车间操作工起重机钢绳断裂重大亡人事故': 'Zhanaozen workshop tragedy: crane wire failure resulting in direct fatality.',
  '12个月内连续三次未能如期结汇及转让定价避税': 'Three consecutive failures to settle foreign funds & transfer tax evasion.',
  '埃基巴斯图兹第三火电厂粉尘高空逸出率超标2.1%': 'Ekibastuz CHP-3 high-altitude dust discharge rate exceeded standard by 2.1%.',
  '矿区重卡传送皮带机械铰链绞指安全责任故障': 'Heavy conveyor belt machinery malfunction causing hand injury.',
  '增值税出口退税延时自核清查': 'Export VAT refund check audit.',
  '卡沙甘特大海上油气溢散指纹自净处理迟滞罚息': 'Kashagan offshore leak fingerprinted and fined due to delay.',
  'D群特大海洋钢结构锚链物理力学振荡自修复合格': 'Group D ocean steel anchor mechanics test verified normal.',
  '二期深海气高压回收连接线新许可获生态部通过': 'Deepwater high-pressure gas collection line Phase 2 permit greenlit.',

  // Risk Tags
  '离岸股东穿透异常': 'Offshore Shareholding Anomaly',
  '关联交易高频': 'Frequent Inter-Company Transactions',
  '设备老化预警': 'Equipment Aging Warning',
  '国家级战略支柱': 'National Strategic Pillar',
  '合规状况极佳': 'Excellent Compliance Registry',
  '资产稳健型': 'Asset Robust Rating',
  '老旧化装置频发': 'Frequent Aging Asset Incidents',
  '有重度污染排放风险': 'Heavy Emission Leak Hazards',
  '环保高密度督办': 'Intense Environmental Audits',
  '民生价格限制强': 'Strict Public Price Controls',
  '管网高压监护': 'High-Pressure Pipeline Inspection',
  '配合平稳度佳': 'Robust Interagency Cooperation',
  '大网平衡主力': 'Transmission System Operator',
  '地缘联络高密': 'High-Density Cross-Border Feeds',
  '非干预智调度': 'Automated Smart Dispatching',
  '离岸股东失联': 'Unreachable Offshore Shareholder',
  '发票欺诈事件': 'Tax Invoice Fraud Record',
  '存在财务抽逃行为': 'Asset Siphoning Warning',
  '严重碳高排实能': 'Heavy Carbon Footprint',
  '重工业高危险度': 'High-Risk Heavy Industry',
  '煤炭联动敏感': 'Coal Linkage Sensitive',
  '国际顶级财团': 'World-Class Joint Venture',
  '开采工程技术极高': 'Advanced Deepwater E&P Tech',
  '环境特级监护面': 'Special Marine Sanctuary Protocol'
};

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

  const trans = (str: string) => {
    if (language === 'zh' || !str) return str;
    return EN_TRANSLATIONS[str] || str;
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
            <Row label={t('Legal Representative', '法定代表人')} value={trans(enterprise.legalRep)} />
            <Row label={t('BIN Number', '统一社会税号')} value={enterprise.taxId} mono />
            <Row label={t('Establishment Date', '登记注册日期')} value={enterprise.established} mono />
            <Row label={t('Industry Sector', '行业分类标准')} value={trans(enterprise.industry)} />
            <Row label={t('Registered Capital', '登记核名资本')} value={enterprise.registeredCapital} mono />
            <Row label={t('Principal Address', '企业注册地址')} value={trans(enterprise.hqAddress)} />
          </Section>

          {/* Section 2: Shareholding Penetration */}
          <Section title={t('2. Shareholding & Ultimate Beneficiary', '2. 股权穿透与受益人')} icon={<Users size={13} />}>
            <div className="space-y-3 pt-1">
              {enterprise.shareholders.map((sh, idx) => (
                <div key={idx} className="flex flex-col gap-1 border-b border-slate-100 last:border-0 pb-2 last:pb-0">
                  <div className="flex items-center justify-between text-[11px] font-bold text-[#0F1722]">
                    <span className="truncate max-w-[280px]">{trans(sh.name)}</span>
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
                        UBO: {trans(sh.ultimateBeneficiary)}
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
                  <span className="font-bold text-slate-700">{trans(cap.metric)}</span>
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
                  <div className="text-[10px] font-black text-[#0F1722] truncate leading-tight">{trans(ent.name)}</div>
                  <div className="flex items-center justify-between text-[8px] font-mono text-slate-500 uppercase mt-1">
                    <span className="truncate max-w-[100px]">{trans(ent.relation)}</span>
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
                      <span className="bg-[#2D6CDF]/10 text-[#2D6CDF] px-1 py-0.2 rounded font-black">{trans(hist.category)}</span>
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
                    {trans(hist.summary)}
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
                    # {trans(tag)}
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
