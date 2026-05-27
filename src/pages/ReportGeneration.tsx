import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  Printer, 
  RotateCw, 
  ShieldCheck, 
  Layers, 
  Eye, 
  Save,
  CheckCircle2,
  ChevronRight,
  Edit3
} from 'lucide-react';
import { SectionTitle, Button, StatusChip } from '../components/UI';
import { useLanguage } from '../components/LanguageContext';

export default function ReportGeneration() {
  const [template, setTemplate] = useState('MINISTER BRIEFING');
  const { language, t } = useLanguage();

  const CHINESE_REPORT = {
    headerTitle: 'AI Statecraft 能源监督辅助决策系统',
    headerSubtitle: '国家主权与安全多智能体联合研判大屏',
    title: '部长安全审查呈阅专题公文报告说明书',
    period: '公文核算区间: 2026年4月1日 — 2026年4月30日',
    generated: '自动一键智能排版生成时间: 2026-05-28 15:42:00',
    executiveTitle: '1. 执行摘要与事实概述',
    executiveContent: '在 2026 年第二季度，国家能源监管自研遥测系统在 237 个重点监测的工业基础设施节点中，共捕获了 42 起物理量超偏离异常和未申报计量漏报异动，其中 12 例已被安全主智能体（Master Agent）分类为红色特高危级（超差偏离大于18%的行为）。当前的监管、物联穿透和数字联合审计核心仍高度聚焦于阿克套港口集群，该地区部分主力企业在生产油气吞吐自检数据、海关出口计量流速同财务实际利税申报上的矛盾已突破安全极值界线。建议立即启动跨部门外勤联合实地稽查执法行动。',
    executiveMuted: '基于 14 个物理遥测及业务系统交叉核实。大语言模型推理及审计逻辑置信率为 94%。',
    gridGridTitle: '2. 国家骨干电网运行基线及绿电接入',
    gridGridContent: '国家核心骨干电能输运及变配电承载力指数大体平稳，当前跨区峰值输出负荷稳定在 6.7 GW 累计容量。全国煤电产运依赖度稳定在 60% 左右。随着卡拉干达西部兆瓦级太阳能光伏基地二期工程的顺利竣工和成功并网，国家综合绿电并网消纳率环比提升了 2.4%，大幅缓解了南部沿里海重载负荷集中组团的压力。',
    heatmapLabel: '[空间地理数据联动：全国发电设施热力及跨区域潮流承载矩阵传感器图层]',
    anomalyTitle: '3. 物联异常归因与核心案件侦查（重点主体）',
    ent91Title: 'ENT-KZ-AKT-0091 (西里海能源 +20% 生产量无法合理解释背离):',
    ent91Content: '通过对多源物理量的交叉审计，发现在西里海能源夜间非法超容量生产的物理估算值，与企业大表纳税额、企业自我数据报送之间存在巨大且非对称的缺口。主判智能体判定存在严重隐瞒实际产量规避特别关税行为，建议对其采取升级现场实物资产调查指令。',
    ano12Title: 'ANO-2026-0512 (第一首站管线气压高频剧震异常):',
    ano12Content: '阿克套首站入流端 N04 主干气相管段监测到高频超限气压震荡。气压波动特征曲线与历史典型多级离心动力气泵发生突发机械抱轴或主轴承机械密封断裂泄漏的信号指纹重合率达 87％。',
    footerRestricted: '绝密特权呈送件 — 仅限部长本人及中央能源安全决策办公室呈阅 (未授权不得泄露)',
    footerPage: '第 1 / 18 页'
  };

  const templates_en = ['MINISTER BRIEFING', 'DAILY DIGEST', 'WEEKLY REGULATORY', 'EMERGENCY ALERT', 'ENVIRONMENTAL IMPACT'];
  const templates_zh = ['部长专属呈阅报告', '每日安全核查简报', '周度监管核准评估', '紧急红色告警事件单', '地缘环保排放评估'];
  const templates = language === 'zh' ? templates_zh : templates_en;

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-bg-page">
      {/* Top Status Bar */}
      <div className="h-10 bg-white border-b border-border-default flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-6">
          <span className="all-caps-label text-[10px]">{t('Context: Auto Regulatory Report Generation')}</span>
          <div className="flex items-center gap-4 border-l border-border-default pl-4 pb-0.5">
             <span className="all-caps-label text-[10px] text-text-primary px-2 bg-bg-secondary rounded-sm">{t('Template')}: {template}</span>
             <span className="all-caps-label text-[10px] text-text-tertiary">{language === 'zh' ? '当前版本草案: 2026.05.28-V1' : 'Draft Version: 2026.05.28-V1'}</span>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Template Selection */}
        <div className="w-[220px] border-r border-border-default bg-white p-5 flex flex-col shrink-0 overflow-y-auto">
           <SectionTitle>{language === 'zh' ? '报告模版选择' : 'Report Templates'}</SectionTitle>
           <div className="space-y-1 mb-8">
             {templates.map((t_item, idx) => (
               <button
                 key={t_item}
                 onClick={() => setTemplate(language === 'zh' ? templates_en[idx] : t_item)}
                 className={`w-full text-left px-3 py-2 rounded-sm text-[11px] font-bold transition-all
                   ${template === (language === 'zh' ? templates_en[idx] : t_item) ? 'bg-bg-dark text-white' : 'text-text-secondary hover:bg-bg-hover'}`}
               >
                 {template === (language === 'zh' ? templates_en[idx] : t_item) ? '●' : '○'} {t_item}
               </button>
             ))}
           </div>

           <SectionTitle>{language === 'zh' ? '最近生成的报告' : 'Recent Reports'}</SectionTitle>
           <div className="space-y-3">
             {[
               { id: 'REP-0524', date: '2026-05-24', type: language === 'zh' ? '日简报' : 'Daily' },
               { id: 'REP-0523', date: '2026-05-23', type: language === 'zh' ? '日简报' : 'Daily' },
               { id: 'REP-WEEK-20', date: '2026-05-21', type: language === 'zh' ? '周详报' : 'Weekly' }
             ].map(r => (
               <div key={r.id} className="p-3 border border-border-default hover:bg-bg-hover cursor-pointer group">
                  <div className="text-[10px] font-bold text-text-primary mb-1 uppercase tracking-tight">{r.id}</div>
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] text-text-tertiary">{r.date}</span>
                    <span className="text-[9px] text-text-secondary font-bold uppercase">{r.type}</span>
                  </div>
               </div>
             ))}
           </div>
        </div>

        {/* Center Report Preview Area */}
        <div className="flex-1 flex flex-col overflow-hidden bg-bg-secondary p-8 select-text">
           <div className="bg-white flex-1 max-w-[800px] mx-auto w-full shadow-lg border border-border-default flex flex-col overflow-hidden">
              {/* Document Header Controls */}
              <div className="h-10 border-b border-border-default flex items-center justify-between px-6 bg-white shrink-0">
                 <div className="flex items-center gap-4">
                    <button className="flex items-center gap-1.5 text-[10px] font-bold uppercase text-text-primary"><Edit3 size={12}/> {language === 'zh' ? '二次编辑' : 'Edit'}</button>
                    <button className="flex items-center gap-1.5 text-[10px] font-bold uppercase text-text-tertiary"><Eye size={12}/> {language === 'zh' ? '阅读视图' : 'Preview'}</button>
                    <button className="flex items-center gap-1.5 text-[10px] font-bold uppercase text-text-tertiary"><Printer size={12}/> {language === 'zh' ? '打印排版' : 'Print View'}</button>
                 </div>
                 <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-status-success" />
                    <span className="all-caps-label text-[9px] text-text-tertiary uppercase">{language === 'zh' ? '自动保存: 开启' : 'Auto-save: On'}</span>
                 </div>
              </div>

              {/* Document Content (Scrollable) */}
              <div className="flex-1 p-16 overflow-y-auto bg-white font-serif">
                 <div className="flex flex-col items-center mb-16 gap-2">
                    <div className="text-[16px] font-bold uppercase tracking-[0.2em] text-text-secondary font-sans">{language === 'zh' ? CHINESE_REPORT.headerTitle : 'AI Statecraft for Minister'}</div>
                    <div className="text-[12px] font-medium uppercase tracking-[0.1em] text-text-tertiary font-sans">{language === 'zh' ? CHINESE_REPORT.headerSubtitle : 'Energy Oversight Module'}</div>
                    <div className="w-16 h-px bg-border-strong my-4" />
                    <div className="text-[28px] font-bold text-text-primary tracking-tight font-sans uppercase text-center">{language === 'zh' ? CHINESE_REPORT.title : 'Minister Briefing Report'}</div>
                    <div className="text-[13px] text-text-secondary font-sans all-caps-label">{language === 'zh' ? CHINESE_REPORT.period : 'REPORT PERIOD: APRIL 1, 2026 — APRIL 30, 2026'}</div>
                    <div className="text-[11px] text-text-tertiary font-sans mt-1">{language === 'zh' ? CHINESE_REPORT.generated : 'Generated: 2026-05-28 15:42:00'}</div>
                 </div>

                 <div className="space-y-12 max-w-[600px] mx-auto text-[14px] leading-relaxed text-text-primary selection:bg-status-warning/20">
                    <section>
                       <h2 className="text-[14px] font-bold uppercase font-sans border-b border-border-default pb-2 mb-4">{language === 'zh' ? CHINESE_REPORT.executiveTitle : '1. Executive Summary'}</h2>
                       <div className="bg-status-warning/5 p-4 border-l-2 border-status-warning relative group cursor-pointer">
                          <p className="italic">
                            {language === 'zh' ? CHINESE_REPORT.executiveContent : 'During Q2 2026, the national energy oversight system detected 42 anomalies across 237 monitored facilities, of which 12 were classified as high-severity. Key focus remains on the Aktau regional cluster where production reporting discrepancies have reached critical thresholds...'}
                          </p>
                          <div className="absolute right-0 top-0 p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                             <RotateCw size={12} className="text-status-warning" />
                          </div>
                          <div className="hidden group-hover:block absolute -right-32 top-0 w-28 bg-bg-dark text-white text-[9px] p-2 rounded-sm shadow-xl z-20 font-sans">
                             {language === 'zh' ? CHINESE_REPORT.executiveMuted : 'Generated from 14 source data points. Confidence 94%.'}
                          </div>
                       </div>
                    </section>

                    <section>
                       <h2 className="text-[14px] font-bold uppercase font-sans border-b border-border-default pb-2 mb-4">{language === 'zh' ? CHINESE_REPORT.gridGridTitle : '2. National Grid Status'}</h2>
                       <p className="mb-4">
                         {language === 'zh' ? CHINESE_REPORT.gridGridContent : 'Primary power generation index remains within nominal boundaries at 6.7 GW aggregate capacity. Coal reliance stabilized at 60%, with renewable integration increasing by 2.4% following the completion of the Karaganda-West solar farm expansion.'}
                       </p>
                       <div className="h-40 bg-bg-secondary w-full flex items-center justify-center text-[11px] text-text-tertiary uppercase font-sans font-bold border border-border-default">
                          {language === 'zh' ? CHINESE_REPORT.heatmapLabel : '[Spatial Data Matrix: National Capacity Heatmap]'}
                       </div>
                    </section>

                    <section>
                       <h2 className="text-[14px] font-bold uppercase font-sans border-b border-border-default pb-2 mb-4">{language === 'zh' ? CHINESE_REPORT.anomalyTitle : '3. Regulatory Anomaly Detail'}</h2>
                       <div className="space-y-4">
                          <div className="flex gap-4">
                             <div className="w-1.5 h-1.5 rounded-full bg-status-critical mt-2 shrink-0" />
                             <div>
                                <span className="font-bold">{language === 'zh' ? CHINESE_REPORT.ent91Title : 'ENT-KZ-AKT-0091 (+20% Gap):'}</span>
                                <p className="text-text-secondary mt-1">{language === 'zh' ? CHINESE_REPORT.ent91Content : 'Cross-system audit triggered by Master Agent identified significant discrepancy between reported production and derived energy capacity. Referral to Joint Investigation Taskforce recommended.'}</p>
                             </div>
                          </div>
                          <div className="flex gap-4">
                             <div className="w-1.5 h-1.5 rounded-full bg-status-warning mt-2 shrink-0" />
                             <div>
                                <span className="font-bold">{language === 'zh' ? CHINESE_REPORT.ano12Title : 'ANO-2026-0512 (Pressure):'}</span>
                                <p className="text-text-secondary mt-1">{language === 'zh' ? CHINESE_REPORT.ano12Content : 'GCS-001 pipeline segment N04 showing sustained pressure oscillation. Pattern matches historical pump failure signature.'}</p>
                             </div>
                          </div>
                       </div>
                    </section>
                 </div>

                 <div className="mt-24 border-t border-border-default pt-8 text-[11px] text-text-tertiary flex justify-between items-center font-sans uppercase font-bold tracking-widest">
                    <span>{language === 'zh' ? CHINESE_REPORT.footerRestricted : 'Restricted Content — For Minister Use Only'}</span>
                    <span>{language === 'zh' ? CHINESE_REPORT.footerPage : 'Page 1 / 18'}</span>
                 </div>
              </div>
           </div>
        </div>

        {/* Right Data Sources Panel */}
        <div className="w-[340px] border-l border-border-default bg-white p-6 flex flex-col shrink-0 overflow-y-auto">
           <SectionTitle>{language === 'zh' ? '涉及核证数据源' : 'Data Sources Snapshot'}</SectionTitle>
           <div className="space-y-3 mb-8">
              {[
                { id: 'ANO-2026-0512', type: language === 'zh' ? '1Hz物联传感器高频遥测' : 'Telemetry Anomaly', date: '14:32 05-18' },
                { id: 'CASE-2026-001', type: language === 'zh' ? '多模型联合归因终审书' : 'Attribution Verdict', date: '16:00 05-18' },
                { id: 'SYS-GRID-CAP', type: language === 'zh' ? '国家电网峰值调度实时基线' : 'Static Capacity Data', date: 'Latest' },
                { id: 'ENT-DB-AKT', type: language === 'zh' ? '阿克套工商税务登记核心库' : 'Master Business Registry', date: 'Latest' }
              ].map(source => (
                <div key={source.id} className="border border-border-default p-3 flex flex-col gap-1 hover:border-text-tertiary cursor-pointer transition-colors">
                   <div className="flex justify-between items-center">
                      <span className="text-[10px] font-bold text-text-primary uppercase tracking-tight">{source.id}</span>
                      <ShieldCheck size={12} className="text-status-success" />
                   </div>
                   <div className="text-[9px] all-caps-label text-text-secondary">{source.type}</div>
                   <div className="text-[9px] text-text-tertiary font-mono">{language === 'zh' ? '数据版本' : 'Snapshot'}: {source.date}</div>
                </div>
              ))}
           </div>

           <SectionTitle>{language === 'zh' ? '公文审批流转状态' : 'Approval Workflow'}</SectionTitle>
           <div className="space-y-6 relative">
              <div className="absolute left-[13px] top-6 bottom-6 w-px bg-border-default" />
              {[
                { actor: language === 'zh' ? 'AI 综合决策大模型' : 'AI (Statecraft Core)', action: language === 'zh' ? '安全自审自动生成' : 'Drafted & Validated', status: 'COMPLETE', time: '15:42' },
                { actor: language === 'zh' ? '高级分析师及外勤组' : 'Senior Analyst (L2)', action: language === 'zh' ? '人工物证勘验证书' : 'Human Review & Edit', status: 'COMPLETE', time: '16:15' },
                { actor: language === 'zh' ? '中央能源安全办公室' : 'Regulatory Director', action: language === 'zh' ? '政策合规审查中' : 'Compliance Approval', status: 'PENDING', time: '--:--' },
                { actor: language === 'zh' ? '国家能源部（部长签字）' : 'Office of Minister', action: language === 'zh' ? '签字签发并一键归档' : 'Final Publication', status: 'LOCKED', time: '--:--' }
              ].map((step, i) => (
                <div key={i} className="flex gap-4 relative z-10">
                   <div className={`w-7 h-7 rounded-full border-2 border-white flex items-center justify-center text-white shrink-0 shadow-sm
                     ${step.status === 'COMPLETE' ? 'bg-status-success' : step.status === 'PENDING' ? 'bg-bg-dark border-bg-dark text-white' : 'bg-bg-secondary text-text-tertiary'}`}>
                      {step.status === 'COMPLETE' ? <CheckCircle2 size={14} /> : i+1}
                   </div>
                   <div className="flex flex-col gap-0.5">
                      <div className="text-[11px] font-bold uppercase text-text-primary leading-tight">{step.actor}</div>
                      <div className="text-[9px] text-text-secondary uppercase">{step.action}</div>
                      <div className="text-[9px] font-mono text-text-tertiary mt-1">{step.status} — {step.time}</div>
                   </div>
                </div>
              ))}
           </div>

           <div className="mt-auto pt-8 flex flex-col gap-2">
              <Button variant="secondary" className="w-full" icon={Download}>{t('DOWNLOAD PDF')}</Button>
              <Button variant="secondary" className="w-full" icon={RotateCw}>{t('RE-GENERATE STATEMENT')}</Button>
              <Button variant="primary" className="w-full" icon={ChevronRight}>{language === 'zh' ? '提报部内流转审核' : 'Submit for Approval'}</Button>
           </div>
        </div>
      </div>
    </div>
  );
}

