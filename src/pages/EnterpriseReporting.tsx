import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, AlertTriangle, ShieldAlert, Activity, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '@/src/lib/utils';
import { useLanguage } from '../components/LanguageContext';

const METRICS = [
  { key: 'phys_generation', label_en: 'Physics Theoretical Output', label_zh: '物理理论发电量',
    declared: '102 MW', actual: '102 MW', deviation: 0, status: 'green', timeline: 'all-green' },
  { key: 'gas_consumption', label_en: 'Gas Consumption',           label_zh: '天然气消耗量',
    declared: '111 MMCM', actual: '95 MMCM', deviation: -13.5, status: 'amber', timeline: 'mostly-amber' },
  { key: 'emissions',     label_en: 'Emissions Declared',         label_zh: '碳排放申报量',
    declared: '115 T', actual: '92 T', deviation: -20.0, status: 'red', timeline: 'red-spikes' },
  { key: 'scada',         label_en: 'SCADA Measured Output',      label_zh: 'SCADA 测定发电量',
    declared: '102 MW', actual: '118 MW', deviation: 15.7, status: 'red', timeline: 'red-spikes' },
  { key: 'grid',          label_en: 'Grid Receive Quantity',      label_zh: '电网消纳指令量',
    declared: '103 MW', actual: '121 MW', deviation: 17.5, status: 'red', timeline: 'red-spikes' },
  { key: 'tax',           label_en: 'Tax Settlement Volume',      label_zh: '财务结算发票量',
    declared: '104 BN', actual: '126 BN', deviation: 21.2, status: 'red', timeline: 'red-spikes' },
];

const MONTHS = ['Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May'];

export default function EnterpriseReporting() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const tLabel = (en: string, zh: string) => (language === 'zh' ? zh : en);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 600);
    return () => clearInterval(id);
  }, []);

  const dotColor = (metric: typeof METRICS[0], monthIdx: number) => {
    if (metric.timeline === 'all-green') return '#2FA862';
    if (metric.timeline === 'mostly-amber') return monthIdx >= 6 ? '#E89518' : '#2FA862';
    // red-spikes
    if (monthIdx >= 9) return '#D8454C';
    if (monthIdx >= 6) return '#E89518';
    return '#2FA862';
  };

  return (
    <div className="flex-1 flex flex-col bg-[#F4F6FA] overflow-hidden h-full">

      {/* Top header */}
      <div className="h-14 border-b border-[#E2E7EF] bg-white flex items-center justify-between px-6 shrink-0 z-50 shadow-sm">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 text-[#6A7686] hover:text-[#0F1722] pr-3 border-r border-[#E2E7EF] text-[11px] font-bold">
            <ArrowLeft size={13} /> {tLabel('Back', '返回')}
          </button>
          <span className="text-[11.5px] font-black uppercase text-[#0F1722] tracking-wider">
            {tLabel('ACT II-B · 6-SYSTEM CROSS-RECONCILIATION MATRIX', '第二幕乙 · 跨口径数据自治核对与六方对等关系一致性验证')}
          </span>
        </div>
        <span className="px-2 py-0.5 bg-[#D8454C] text-white text-[8px] font-bold rounded-sm uppercase font-mono">ENT-KZ-AKT-0091</span>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-5">

        {/* === MAIN MATRIX · 6 systems × 12 months with pulsing dots === */}
        <div className="bg-white border border-[#E2E7EF] rounded-[6px] p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3.5">
            <h3 className="text-[12.5px] font-black text-[#0F1722] uppercase tracking-wider">
              <Activity className="inline w-3.5 h-3.5 mr-1 text-[#D8454C]" />
              {tLabel('6 Core Systems × 12-Month Reconciliation Matrix',
                      '6 大核心系统 12 个月度发电对齐一致性审计对齐矩阵')}
            </h3>
            <span className="text-[9px] font-mono text-[#A8B2C0] font-black">SCADA · TAX · METER · GRID · GAS · EMIS</span>
          </div>

          {/* table head */}
          <div className="grid grid-cols-[180px_110px_110px_60px_120px_1fr_130px] gap-2 p-2 bg-slate-50 rounded text-[8.5px] font-black uppercase text-[#64748B] font-mono tracking-wider">
            <span>{tLabel('Indicator', '核报项目')}</span>
            <span>{tLabel('Declared Expect', '物理自适应预期')}</span>
            <span>{tLabel('Actual Reported', '企业上报实际值')}</span>
            <span className="text-center">{tLabel('Δ%', '偏差')}</span>
            <span>{tLabel('Physics Compliance', '物理合规产能图')}</span>
            <span className="text-center">{tLabel('Past 12 Months Trend (animated)', '过去 12 月偏离波动趋势')}</span>
            <span className="text-right">{tLabel('Verdict', '合规判定结论')}</span>
          </div>

          {/* rows */}
          <div className="divide-y divide-slate-100">
            {METRICS.map((m, mi) => (
              <div key={m.key} className="grid grid-cols-[180px_110px_110px_60px_120px_1fr_130px] gap-2 px-2 py-3 items-center hover:bg-slate-50 transition-colors duration-150">
                <span className="text-[11.5px] font-black text-[#0F1722]">{tLabel(m.label_en, m.label_zh)}</span>
                <span className="text-[11px] font-mono text-[#475569]">{m.declared}</span>
                <span className="text-[11px] font-mono text-[#0F1722] font-semibold">{m.actual}</span>
                <span className={cn("text-[10.5px] font-mono font-black text-center",
                  m.status === 'red' ? 'text-[#D8454C]' : m.status === 'amber' ? 'text-[#E89518]' : 'text-[#2FA862]')}>
                  {m.deviation > 0 ? '+' : ''}{m.deviation}%
                </span>
                <div className="flex items-center gap-1.5">
                  <div className={cn("w-10 h-1 rounded-full",
                    m.status === 'red' ? 'bg-[#D8454C]' : m.status === 'amber' ? 'bg-[#E89518]' : 'bg-[#2FA862]')} />
                  <div className="flex gap-0.5">
                    <div className={cn("w-2 h-2 rounded-full", m.status === 'red' ? 'bg-[#D8454C]' : 'bg-slate-200')} />
                    <div className={cn("w-2 h-2 rounded-full", m.status === 'red' || m.status === 'amber' ? 'bg-[#E89518]' : 'bg-slate-200')} />
                  </div>
                </div>
                
                {/* 12-month pulse track */}
                <div className="flex items-center gap-1.5 justify-center px-1">
                  {MONTHS.map((_, i) => {
                    const c = dotColor(m, i);
                    const isRedDot = c === '#D8454C';
                    const isAmberDot = c === '#E89518';
                    const isPulse = (isRedDot && (i + tick) % 2 === 0) || (isAmberDot && (i + tick) % 4 === 0);
                    return (
                      <div key={i} className="flex flex-col items-center group relative cursor-help">
                        {/* Dot */}
                        <div className={cn("w-2.5 h-2.5 rounded-full transition-all duration-300", isPulse ? 'scale-110 shadow-md' : 'opacity-85')}
                             style={{ 
                               background: c, 
                               boxShadow: isPulse ? `0 0 6px ${c}` : 'none' 
                             }} />
                      </div>
                    );
                  })}
                </div>

                <span className={cn("text-[9px] font-black text-right tracking-wider uppercase font-mono px-1 py-0.5 rounded-sm inline-block",
                  m.status === 'red' ? 'text-[#D8454C]' : m.status === 'amber' ? 'text-[#E89518]' : 'text-[#2FA862]')}>
                  {m.status === 'red' ? tLabel('💥 SEVERE BREACH', '💥 一级红区越线') :
                   m.status === 'amber' ? tLabel('▲ SLIGHT DEVIATION', '▲ 轻度偏差') :
                                          tLabel('✓ OK NOMINAL', '✓ 正常放行')}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* === BOTTOM 2-column · 合规依据 + 四方指纹 === */}
        <div className="grid grid-cols-2 gap-5">
          {/* Audit basis (left) — 含融合后的"国家审计局合规条目依据"作为 footer */}
          <div className="bg-white border border-[#E2E7EF] rounded-[6px] p-5 shadow-sm flex flex-col justify-between">
            <div>
              <h4 className="text-[12px] font-black text-[#0F1722] uppercase tracking-wider mb-2">
                {tLabel('Audit Basis · Title III Energy Security Act',
                        '国家安全保供能流穿透强制披露法律监察依据')}
              </h4>
              <p className="text-[10.5px] text-[#6A7686] leading-relaxed mb-4">
                {tLabel('Per Title III §4.6 and §5.1, SCADA, dispatch, emissions, tax and grid records must reconcile within ±5%. Exceedances above 10% mandate full audit and asset freeze.',
                        '依据国家能源安全保供透传强制披露法案第 III 章第 4.6 和 5.1 节，任何并网能源机构其 SCADA 实测流、燃料消耗、财务完税发票流之间核算偏差超过 10% 即构成合规异常，依规需启动穿透对账、并冻结相关非法获利或机组。')}
              </p>
              
              {/* footer: 国家审计局合规条目依据 */}
              <div className="bg-slate-50 border-l-2 border-[#2D6CDF] rounded px-3 py-2.5 mb-4 shadow-inner">
                <div className="text-[8.5px] font-black uppercase text-[#A8B2C0] font-mono mb-1.5">{tLabel('Audit Bureau Compliance Reference', '中央审计局能耗穿透规范法规条文依据')}</div>
                <ul className="text-[9.5px] text-[#475569] space-y-1 list-disc list-inside font-mono">
                  <li>{tLabel('Audit Code §AK-2024-117 · cross-system reconciliation mandate', '审计行政条令 §AK-2024-117 · 跨部门多头对账条款')}</li>
                  <li>{tLabel('Energy Reporting Regulation §C-12 · monthly grid alignment', '能源报送规范细则 §C-12 · 电网月度物理自校正')}</li>
                  <li>{tLabel('Tax Act §VAT-3.2 · invoice physical alignment protocols', '发税连证条例 §VAT-3.2 · 增值税发票实体穿透防漏跑账')}</li>
                </ul>
              </div>
            </div>

            <button onClick={() => navigate('/audit/event/CASE-2026-001')}
              className="w-full py-2.5 bg-[#D8454C] hover:bg-red-700 text-white font-black text-[11px] uppercase tracking-wider rounded shadow transition duration-150">
              ⚡ {tLabel('Generate Administrative Dispatch Order',
                        '调阅并生成行政督办备案令')}
            </button>
          </div>

          {/* Four-way fingerprint (right) */}
          <div className="bg-white border border-[#E2E7EF] rounded-[6px] p-5 shadow-sm">
            <h4 className="text-[12px] font-black text-[#0F1722] uppercase tracking-wider mb-3">
              {tLabel('Four-Way Co-Settlement Locked Unreported Generator Fingerprint',
                      '四方自组织联合联合清算锁定未申报发电机组物理指纹证据')}
            </h4>
            <div className="space-y-2.5">
              <div className="border-l-2 border-[#D8454C] bg-[#D8454C]/5 p-2.5 rounded-sm shadow-sm">
                <div className="text-[10px] font-black text-[#D8454C] uppercase font-mono">A · Carbon Shield Bypass</div>
                <div className="text-[10px] text-[#6A7686] mt-1 pr-1">{tLabel('Declared carbon is 20% lower than actual theoretical expectations, indicating hidden boilers.', '掩盖碳排放指标：烟道气体成分比例提示煤耗在夜间突然剧增，烟气物理黑数与申报偏差 -20.0%。')}</div>
              </div>
              <div className="border-l-2 border-[#D8454C] bg-[#D8454C]/5 p-2.5 rounded-sm shadow-sm">
                <div className="text-[10px] font-black text-[#D8454C] uppercase font-mono">B · Electrical Active High</div>
                <div className="text-[10px] text-[#6A7686] mt-1 pr-1">{tLabel('Grid power flows higher than permit records by 17.5%, sustained over 6 consecutive months.', '并网输电口过充：KEGOC电网关口表实测流超额 17.5% 以上，财务套现隐瞒账目，持续长达 180 天。')}</div>
              </div>
              <div className="border-l-2 border-[#D8454C] bg-[#D8454C]/5 p-2.5 rounded-sm shadow-sm">
                <div className="text-[10px] font-black text-[#D8454C] uppercase font-mono">C · Decoupled Mass Ratio</div>
                <div className="text-[10px] text-[#6A7686] mt-1 pr-1">{tLabel('Heat-rate / mass-balance decoupled from peer regional parameters by +9.4%.', '能耗配额失洽：辅机冷凝机组热平衡值相比同类型公摊高出 +9.4% 异常异动，坐实未报机组存在。')}</div>
              </div>
            </div>
            <div className="text-[8.5px] font-mono text-[#A8B2C0] mt-3.5 text-right">
              {tLabel('Verified by: GEN-VIOLATION-ENT-72 · 2026-05-28 · Mapped to CASE-2026-001',
                      '证据识别：GEN-VIOLATION-ENT-72 · 2026-05-28 当前并转至中央案件库 CASE-2026-001')}
            </div>
          </div>
        </div>

      </div>

      {/* Bottom mini status (replacing 闭环督办流程泳道图) */}
      <div className="h-9 bg-white border-t border-[#E2E7EF] px-5 flex items-center justify-between shrink-0 text-[9.5px] font-mono text-[#6A7686]">
        <div className="flex items-center gap-3">
          <span className="text-[8.5px] font-black text-[#A8B2C0] uppercase tracking-wider">{tLabel('PIPELINE', '督办流程')}</span>
          {['DETECT 12', 'ATTRIBUTE 8', 'DISPATCH 5', 'RESOLVE 3', 'REVIEW 2', 'ARCHIVE 1'].map((s, i) => (
            <span key={i} className="flex items-center gap-1.5">
              <span className={cn("w-1.5 h-1.5 rounded-full", i === 0 ? 'bg-[#D8454C] animate-pulse' : i === 1 ? 'bg-[#E89518]' : 'bg-[#2FA862]')} />
              <span className="font-extrabold text-[#0F1722]">{s}</span>
            </span>
          ))}
        </div>
        <span>33 active · 5 in preventive window</span>
      </div>

    </div>
  );
}
