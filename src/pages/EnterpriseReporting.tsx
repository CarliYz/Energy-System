import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, FileText, Zap, AlertTriangle, ShieldCheck, CheckCircle2, ChevronRight,
  TrendingDown, Globe, Layers, Settings, Database, Server
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { useLanguage } from '../components/LanguageContext';

export default function EnterpriseReporting() {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'simulation'>('overview');

  const tLabel = (en: string, zh: string) => {
    return language === 'zh' ? zh : en;
  };

  const MATRIX_ROWS = useMemo(() => [
    { 
      id: 'SYS-01', 
      name_en: 'PHYSICAL GENERATION', 
      name_zh: '物理理论发电量', 
      eq: 'eq-01', 
      expect: '102 MW', 
      report: '102 MW', 
      delta: '0.0%', 
      sev: 0.1, 
      status: 'OK',
      trace: [1,1,1,1,1,1,1,1,1,1,1,1] 
    },
    { 
      id: 'SYS-02', 
      name_en: 'FUEL GAS FEEDSTOCK', 
      name_zh: '天然气消耗量', 
      eq: 'eq-02', 
      expect: '111 MMcm', 
      report: '96 MMcm', 
      delta: '-13.5%', 
      sev: 0.65, 
      status: 'WARN',
      trace: [1,1,2,1,2,2,3,2,2,1,2,3] 
    },
    { 
      id: 'SYS-03', 
      name_en: 'CARBON EMISSIONS', 
      name_zh: '碳排放与排放计', 
      eq: 'eq-03', 
      expect: '115 T', 
      report: '92 T', 
      delta: '-20.0%', 
      sev: 0.9, 
      status: 'CRITICAL',
      trace: [1,1,2,2,2,2,3,2,2,3,2,3] 
    },
    { 
      id: 'SYS-04', 
      name_en: 'SCADA COMFIRM MWh', 
      name_zh: 'SCADA 测定发量', 
      eq: 'eq-04', 
      expect: '102 MW', 
      report: '118 MW', 
      delta: '+15.7%', 
      sev: 0.72, 
      status: 'WARN',
      trace: [1,2,2,1,2,2,2,1,3,2,3,3] 
    },
    { 
      id: 'SYS-05', 
      name_en: 'GRID DISPATCH COMM', 
      name_zh: '电网调度指令量', 
      eq: 'eq-05', 
      expect: '103 MW', 
      report: '121 MW', 
      delta: '+17.5%', 
      sev: 0.78, 
      status: 'WARN',
      trace: [1,1,1,2,2,2,2,1,3,2,3,3] 
    },
    { 
      id: 'SYS-06', 
      name_en: 'TAX INVOICES REVENUE', 
      name_zh: '财务结算发票量', 
      eq: 'eq-06', 
      expect: '104 BN', 
      report: '126 BN', 
      delta: '+21.2%', 
      sev: 0.95, 
      status: 'CRITICAL',
      trace: [0,0,1,1,2,2,3,3,2,3,3,3] 
    },
  ], []);

  return (
    <div className="flex-1 flex flex-col bg-[#F4F6FA] text-[#1A2330] font-sans overflow-hidden">
      
      {/* 1 · CONTEXT & HEADER CONTROL BAR */}
      <div className="h-14 border-b border-[#E2E7EF] bg-white flex items-center justify-between px-6 shrink-0 z-50 shadow-sm">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate('/minister/dashboard')}
            className="flex items-center gap-1.5 text-[#6A7686] hover:text-[#0F1722] pr-3 border-r border-[#E2E7EF] text-[11px] font-bold"
          >
            <ArrowLeft size={13} />
            <span>{tLabel('Minister Desk', '回到部长决策大屏')}</span>
          </button>
          <span className="text-[11.5px] font-black uppercase text-[#0F1722] tracking-wider">
            {tLabel('ACT II-B · THE 6-PORT INTEGRITY & COHERENCY MAP', '第二幕乙 · 跨口径数据自洽核对与六方对等关系一致性验证')}
          </span>
        </div>

        {/* Tab switcher */}
        <div className="flex h-9 bg-slate-100 border border-border-default rounded p-0.5 select-none shrink-0 scale-95">
          <button 
            onClick={() => setActiveTab('overview')}
            className={cn("px-4 py-1 text-[10.5px] font-black rounded uppercase transition-all", activeTab === 'overview' ? "bg-white text-[#2D6CDF] shadow" : "text-[#6A7686]")}
          >
            {tLabel('1. Cross-System Matrix', '1. 六向交叉对齐矩阵')}
          </button>
          <button 
            onClick={() => setActiveTab('simulation')}
            className={cn("px-4 py-1 text-[10.5px] font-black rounded uppercase transition-all", activeTab === 'simulation' ? "bg-white text-[#2D6CDF] shadow" : "text-[#6A7686]")}
          >
            {tLabel('2. Equation Identities', '2. 物理守恒等比校验')}
          </button>
        </div>

        <div className="flex items-center gap-2 font-mono text-[10px] bg-slate-100 border px-3 py-1 rounded">
          <span>{tLabel('Target Company:', '审计主体:')} <strong>ENT-KZ-AKT-0091</strong></span>
        </div>
      </div>

      {activeTab === 'overview' ? (
        <div className="flex-1 p-6 flex flex-col gap-6 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 56px)' }}>
          
          {/* TOP 12-MONTH TRACE MATRIX TABLE */}
          <div className="bg-white rounded-[6px] border border-[#E2E7EF] shadow-sm overflow-hidden flex flex-col">
            <div className="p-4 border-b border-[#E2E7EF] bg-slate-50/50 flex justify-between items-center text-[10.5px] font-black text-[#0F1722] uppercase tracking-wider select-none">
              <span>{tLabel('12-Month Coherency Crosscheck Matrix', '6大核心系统12个月度物理电热热熵/能流一致性对齐矩阵')}</span>
              <span className="text-[#6A7686] font-mono">SCADA · TAX METER · SO COMM</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-[#E2E7EF] h-9 text-[9px] font-black uppercase text-[#6A7686] tracking-wider font-mono">
                    <th className="px-5">{tLabel('Audit Segment Name', '校验申报系统级口径名称')}</th>
                    <th className="px-3 text-center">{tLabel('Expected Limit', '物理自适应上限预期')}</th>
                    <th className="px-3 text-center">{tLabel('Submitted Value', '企业实际上报表值')}</th>
                    <th className="px-3 text-center">{tLabel('Delta Divergence', '跨多边偏离幅度')}</th>
                    <th className="px-3 text-center">{tLabel('Severity Weight', '物理断裂严重等级')}</th>
                    <th className="px-4 text-center">{tLabel('12-Month Micro Trace', '过去12周期滚动波动形态')}</th>
                    <th className="px-5 text-right">{tLabel('Routing Directive', '合规判定走向指令')}</th>
                  </tr>
                </thead>
                <tbody>
                  {MATRIX_ROWS.map((row, idx) => {
                    const isCrit = row.status === 'CRITICAL';
                    const isWarn = row.status === 'WARN';
                    return (
                      <tr key={idx} className="border-b border-slate-100 h-14 hover:bg-slate-50 transition-colors uppercase text-[11px]">
                        <td className="px-5">
                          <div className="font-extrabold text-[#0F1722] leading-tight text-[12px]">{language === 'zh' ? row.name_zh : row.name_en}</div>
                          <div className="text-[9px] text-[#A8B2C0] font-mono font-medium mt-0.5">{row.id} · {row.eq}</div>
                        </td>
                        <td className="px-3 text-center font-semibold font-mono text-[#0F1722]">{row.expect}</td>
                        <td className="px-3 text-center font-black font-mono text-[#0F1722]">{row.report}</td>
                        <td className="px-3 text-center">
                          <span className={cn(
                            "px-2 py-0.5 rounded-[2px] font-mono font-black border text-[10px]",
                            isCrit ? 'bg-[#D8454C]/10 text-[#D8454C] border-[#D8454C]/20 animate-pulse' :
                            isWarn ? 'bg-[#E89518]/10 text-[#E89518] border-[#E89518]/20' : 'bg-[#2FA862]/10 text-[#2FA862] border-[#2FA862]/20'
                          )}>
                            {row.delta}
                          </span>
                        </td>
                        <td className="px-3">
                          <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden mx-auto">
                            <div className="h-full rounded-full" style={{ 
                              width: `${row.sev * 100}%`, 
                              backgroundColor: isCrit ? '#D8454C' : isWarn ? '#E89518' : '#2FA862' 
                            }} />
                          </div>
                        </td>
                        <td className="px-4">
                          <div className="flex gap-1 justify-center items-center">
                            {row.trace.map((item, tid) => (
                              <span 
                                key={tid} 
                                className={`w-1.5 h-1.5 rounded-full ${
                                  item === 3 ? 'bg-[#D8454C] animate-ping' : item === 2 ? 'bg-[#E89518]' : 'bg-[#2FA862]'
                                }`} 
                              />
                            ))}
                          </div>
                        </td>
                        <td className="px-5 text-right font-mono font-bold">
                          <span className={isCrit ? 'text-[#D8454C]' : isWarn ? 'text-[#E89518]' : 'text-[#2FA862]'}>
                            {isCrit ? tLabel('ESCALATE DETECTED', '一键极速建档') : isWarn ? tLabel('VERIFY ANOMALY', '待证核实') : tLabel('OK NOMINAL', '正常放行')}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* TWO BOTTOM CARDS: THE CASE ANALYST COLUMN AND INSIGHTS CARDS */}
          <div className="grid grid-cols-12 gap-6">
            
            <div className="col-span-4 bg-white rounded-[6px] border border-[#E2E7EF] p-5 shadow-sm">
              <span className="text-[10px] font-black uppercase text-[#6A7686] font-mono block mb-2">{tLabel('COMPLIANCE CONTEXT', '国家局审计合规条目依据')}</span>
              <h4 className="text-[13px] font-black text-[#0F1722] uppercase tracking-wider">{tLabel('Title III Energy Security Disclosure Act', '国家安全保供能流穿透强制披露法案依据')}</h4>
              
              <p className="text-[#6A7686] text-[11px] mt-2.5 leading-relaxed">
                {tLabel(
                  'According to Chapter 14 Section A, any active generation facility exceeding nominal permitted power output by more than 10% for consecutive 48H must trigger physical inspection. Covert capacity bypasses taxation protocols and compromises local grid frequency.',
                  '根据哈萨克斯坦国家保供及能流安全规约第14章甲段规定，任何并网运行之火力、燃气、核电等机组，若连续48H其SCADA回馈物理流过载名义准许限值10%以上，视为特大越产偏离，直属中央国家督办范畴。'
                )}
              </p>

              <div className="h-[1px] bg-[#E2E7EF] my-4" />
              
              <button 
                onClick={() => navigate('/audit/report')}
                className="w-full h-10 bg-[#D8454C] hover:bg-red-700 text-white font-black uppercase text-[11px] tracking-wider rounded-[3px] transition-colors"
              >
                {tLabel('⚠ Draft Enforcement Directive Document', '⚠ 调阅并生成行政督导派单书')}
              </button>
            </div>

            <div className="col-span-8 bg-white rounded-[6px] border border-[#E2E7EF] p-5 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-black uppercase text-[#6A7686] font-mono block mb-2">{tLabel('ANALYST SUMMARY REASONING', '物理性质自洽校验审计定论')}</span>
                <h4 className="text-[14px] font-black text-[#0F1722]">{tLabel('Multivariable Triangulation confirmed Overproduction Fingerprint', '四方自组织联合演算锁定未申报发电机组指纹')}</h4>
                
                <div className="grid grid-cols-3 gap-4 mt-4 text-[11px] leading-relaxed">
                  <div className="bg-slate-50 p-3 rounded">
                    <span className="font-extrabold text-[#D8454C] uppercase text-[9.5px]">A. CARBON SHIELD BYPASS</span>
                    <p className="text-[#6A7686] text-[10px] mt-1.5">
                      {tLabel('Emissions disclosed are 20% lower than expectations from power output limits. Carbon scrubbing factor is abnormal.', '虚假申报碳排放，以瞒报燃料配额。1-4号热力段回馈温差表明烟道过温，实际排放远超环保申报。')}
                    </p>
                  </div>

                  <div className="bg-slate-50 p-3 rounded">
                    <span className="font-extrabold text-[#E89518] uppercase text-[9.5px]">B. ELECTRICAL ACTIVE HIGH</span>
                    <p className="text-[#6A7686] text-[10px] mt-1.5">
                      {tLabel('SCADA logs show +15.7% active power flow consistently. Invoices with grid buyers match this high active flow.', '省局电费交易账目与电网上网SCADA测点完美一致，证实漏失用能已被就地套现，排除单纯仪表故障。')}
                    </p>
                  </div>

                  <div className="bg-slate-50 p-3 rounded">
                    <span className="font-extrabold text-[#2D6CDF] uppercase text-[9.5px]">C. DECOUPLED MASS RATIO</span>
                    <p className="text-[#6A7686] text-[10px] mt-1.5">
                      {tLabel('Combined Heat-Rate vs carbon output math fails physical identities. Model shows P=0.87 covert unit.', '能量守恒不等式最终断裂（P=0.87）。极高概率该设施于2025Q4违背法律擅自外嵌未经扩申登记的辅发电机。')}
                    </p>
                  </div>
                </div>
              </div>

              <div className="text-[10px] text-[#A8B2C0] font-mono border-t border-[#E2E7EF] pt-3 text-right">
                {tLabel('Audit System model: CORRELATION-ENT-V2.3 · Generated automatically via TimeGPT on 2026-05-28', '多边联合审计模型版本：CORRELATION-ENT-V2.3 · 2026-05-28 由中央智算引擎自动运算归集')}
              </div>
            </div>

          </div>

        </div>
      ) : (
        /* TAB 2 EQUATIONS VERDICT GRAPH */
        <div className="flex-1 p-6 flex flex-col justify-between overflow-y-auto">
          <div className="bg-white rounded-[6px] border border-[#E2E7EF] p-5 shadow-sm flex-1 flex flex-col select-none">
            <h3 className="text-[14px] font-black text-[#0F1722] mb-1.5 uppercase">
              {tLabel('ACT II-C · 7 CORE PHYSICAL ENERGY IDENTITY EQUATIONS', '守恒极点 · 物理守恒等式检验（7 CORE PHYSICAL ENERGY IDENTITIES）')}
            </h3>

            <div className="space-y-4 max-w-4xl mt-4">
              {[
                { eq: 'E1: Σ(gas in) × Thermal Efficiency η = Power MWh generation output', desc_en: 'Energy Input conservation check. Current status: Fails by -13.5% (Fuel too low for generated output).', status: 'CRITICAL', color: 'border-l-[#D8454C] bg-[#D8454C]/5 text-[#D8454C]' },
                { eq: 'E2: Active Power × Carbon Emission Factor = Volumetric CO₂ concentration', desc_en: 'Eco-environment cross-checking. Current status: Fails by -20.0% (Mismatched emissions reported to environmental protection department).', status: 'CRITICAL', color: 'border-l-[#D8454C] bg-[#D8454C]/5 text-[#D8454C]' },
                { eq: 'E3: Declared permit maximum capacity ≥ Actual rolling peak active flow', desc_en: 'Regulatory constraint threshold parity. Current status: Fails by 3.2 MW overrun at peak load period.', status: 'CRITICAL', color: 'border-l-[#D8454C] bg-[#D8454C]/5 text-[#D8454C]' },
                { eq: 'E4: Active Grid Billing MWh ⟷ KEGOC actual physical metering output', desc_en: 'Financial settlement parity log. Current status: Consistent & verified (reconciliation matches financial accounts).', status: 'OK', color: 'border-l-[#2FA862] bg-[#2FA862]/5 text-[#2FA862]' },
                { eq: 'E5: National enterprise registry permit status = Active operation licence', desc_en: 'Permit alignment. Current status: Overrun detected (Installed bypass is completely unlicensed for active billing).', status: 'CRITICAL', color: 'border-l-[#D8454C] bg-[#D8454C]/5 text-[#D8454C]' },
                { eq: 'E6: Fuel heat-rate output margin within ±5% of regional peers average', desc_en: 'Peer envelope baseline comparison. Current status: Fails by +9.4% excessive heat loss at fuel-compressor interface.', status: 'CRITICAL', color: 'border-l-[#D8454C] bg-[#D8454C]/5 text-[#D8454C]' },
                { eq: 'E7: Storage inventory change rate = Upstream velocity delta Δ', desc_en: 'Flow mass conservation. Current status: Volumetric inconsistency detected at GCS-001.', status: 'CRITICAL', color: 'border-l-[#D8454C] bg-[#D8454C]/5 text-[#D8454C]' },
              ].map((item, id) => (
                <div key={id} className={cn("p-4 border-l-4 rounded shadow-sm text-[12.5px] font-mono", item.color)}>
                  <span className="font-extrabold block text-[13.5px]">{item.eq}</span>
                  <p className="text-slate-600 font-sans text-[11.5px] mt-1">{language === 'zh' ? '在设物理守恒方程式对齐校验详情... 当前状态：违反该物理边界上限，失洽度极其严重。' : item.desc_en}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* BOTTOM PIPELINE STATUS BAR */}
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
