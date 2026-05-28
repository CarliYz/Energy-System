# AI STUDIO PROMPT · V6-05 · 能源重点企业知识库 — 抽屉复用 + 8 家企业 mock
# AI STUDIO PROMPT · V6-05 · Key Energy Enterprise Knowledge Base — Drawer Reuse + 8 Enterprise Mocking

## 任务 / Tasks
1. 从 `src/pages/WorkflowAttribution.tsx` 中**抽取**企业详情右抽屉组件，独立成可复用组件
   **Extract** the enterprise detail right-hand drawer component from `src/pages/WorkflowAttribution.tsx` and make it a standalone reusable component.
   - 新文件 / New File: `src/components/EnterpriseDetailDrawer.tsx`

2. 在 `src/pages/RegulatoryEffectiveness.tsx`（"能源重点企业知识库"页）中，让企业列表的**每一行**都可点击 → 弹出该抽屉
   In `src/pages/RegulatoryEffectiveness.tsx` ("Key Energy Enterprise Knowledge Base" page), make **every row** in the enterprise list clickable → triggering this detail drawer.

3. 造 8 家完整 mock 企业数据，写入 `src/data/commercial/enterprise_kb.ts`
   Construct 8 fully structured mock enterprise records and save them in `src/data/commercial/enterprise_kb.ts`.

---

## 第一步 · 抽取抽屉 / Step 1 · Extracting the Drawer

在 `WorkflowAttribution.tsx` 中找到企业详情抽屉相关的 JSX 块（包含工商信息 / 股权穿透 / 业务产能 / 关联企业 / 历史合规事件等 sections），整体迁移到：
Locate the JSX blocks corresponding to the enterprise details drawer (comprising registration info, shareholding structure, operational capacity, related units, compliance histories, etc.) in `WorkflowAttribution.tsx` and migrate them to:

```tsx
// src/components/EnterpriseDetailDrawer.tsx
import React from 'react';
import { X } from 'lucide-react';

export type EnterpriseRecord = {
  id: string;                        // e.g. 'ENT-KZ-AKT-0091'
  nameCn: string;                    // e.g. '西里海能源合资有限公司'
  nameEn: string;                    // e.g. 'Western Caspian Energy LLC'
  taxId: string;                     // BIN / Tax ID
  legalRep: string;
  registeredCapital: string;         // e.g. 'KZT 8.4B'
  established: string;               // e.g. '2008-03-12'
  industry: string;                  // e.g. '上游油气勘探与开采'
  hqAddress: string;
  
  // 股权穿透 / Ownership Structure
  shareholders: {
    name: string;
    pct: number;
    type: 'state' | 'foreign' | 'private';
    ultimateBeneficiary?: string;
  }[];

  // 业务产能 / Operational Capacity
  capacity: {
    metric: string;                  // e.g. '原油日产量' or '炼油加工能力'
    value: string;
    unit: string;
    yoy: number;                     // YoY %
  }[];

  // 关联企业 (图谱节点) / Related Entities
  relatedEntities: {
    id: string;
    name: string;
    relation: string;                // e.g. '上游设备供应', '股东方', '下游买家'
    riskLevel: 'low' | 'mid' | 'high';
  }[];

  // 历史合规事件 / Compliance History
  complianceHistory: {
    date: string;
    category: '环保' | '安全' | '财税' | '反垄断' | '审批';
    severity: 'low' | 'mid' | 'high';
    summary: string;
    status: 'closed' | 'open' | 'reviewing';
  }[];

  // 监管打分 / Regulatory Score
  scoreOverall: number;              // 0-100
  scoreBreakdown: {
    compliance: number;
    safety: number;
    financial: number;
    esg: number;
  };

  // 风险标签 / Risk Flags
  riskTags: string[];
};

type Props = {
  enterprise: EnterpriseRecord | null;
  onClose: () => void;
};

export const EnterpriseDetailDrawer = ({ enterprise, onClose }: Props) => {
  if (!enterprise) return null;
  return (
    <aside className="fixed top-0 right-0 h-full w-[520px] bg-white border-l border-border-default z-50 overflow-y-auto custom-scrollbar shadow-2xl">
      <header className="sticky top-0 bg-white border-b border-border-default p-5 flex items-start justify-between">
        <div>
          <h2 className="text-[18px] font-bold">{enterprise.nameCn}</h2>
          <p className="text-[11px] text-text-tertiary">{enterprise.nameEn} · {enterprise.id}</p>
        </div>
        <button onClick={onClose} className="p-1 hover:bg-bg-hover rounded">
          <X size={16} />
        </button>
      </header>

      <div className="p-5 space-y-6">
        {/* Section 1 · 工商信息 */}
        <Section title="工商信息 BUSINESS REGISTRY">
          <KV label="法定代表人" value={enterprise.legalRep} />
          <KV label="注册资本" value={enterprise.registeredCapital} />
          <KV label="成立时间" value={enterprise.established} />
          <KV label="行业分类" value={enterprise.industry} />
          <KV label="注册地址" value={enterprise.hqAddress} />
          <KV label="税号 / BIN" value={enterprise.taxId} />
        </Section>

        {/* Section 2 · 股权穿透 */}
        <Section title="股权穿透 OWNERSHIP STRUCTURE">
          {enterprise.shareholders.map((sh, i) => (
            <div key={i} className="flex items-center justify-between py-1 border-b border-border-default last:border-b-0">
              <div className="flex-1">
                <p className="text-[12px] font-semibold">{sh.name}</p>
                <p className="text-[10px] text-text-tertiary">
                  {sh.type === 'state' && '国资'}{sh.type === 'foreign' && '外资'}{sh.type === 'private' && '民营'}
                  {sh.ultimateBeneficiary && ` · UBO: ${sh.ultimateBeneficiary}`}
                </p>
              </div>
              <span className="text-[14px] font-bold tabular-nums">{sh.pct}%</span>
            </div>
          ))}
        </Section>

        {/* Section 3 · 业务产能 */}
        <Section title="业务产能 OPERATIONAL CAPACITY">
          <div className="grid grid-cols-2 gap-2">
            {enterprise.capacity.map((c, i) => (
              <div key={i} className="border border-border-default rounded-[4px] p-2">
                <p className="text-[10px] text-text-tertiary">{c.metric}</p>
                <p className="text-[14px] font-bold tabular-nums">{c.value} <span className="text-[10px] font-normal">{c.unit}</span></p>
                <p className={`text-[10px] ${c.yoy >= 0 ? 'text-[#2FA862]' : 'text-[#D8454C]'}`}>
                  {c.yoy >= 0 ? '↑' : '↓'} {Math.abs(c.yoy)}% YoY
                </p>
              </div>
            ))}
          </div>
        </Section>

        {/* Section 4 · 关联企业 */}
        <Section title="关联企业 RELATED ENTITIES">
          {enterprise.relatedEntities.map((re, i) => (
            <div key={i} className="flex items-center gap-2 py-1.5 border-b border-border-default last:border-b-0">
              <span className={`w-1.5 h-1.5 rounded-full ${
                re.riskLevel === 'high' ? 'bg-[#D8454C]' :
                re.riskLevel === 'mid'  ? 'bg-[#E89518]' : 'bg-[#2FA862]'
              }`} />
              <div className="flex-1">
                <p className="text-[12px]">{re.name}</p>
                <p className="text-[10px] text-text-tertiary">{re.relation}</p>
              </div>
              <button className="text-[10px] text-text-secondary hover:text-text-primary">→</button>
            </div>
          ))}
        </Section>

        {/* Section 5 · 历史合规事件 */}
        <Section title="历史合规事件 COMPLIANCE HISTORY">
          {enterprise.complianceHistory.map((ev, i) => (
            <div key={i} className="border-l-2 pl-3 mb-2" style={{
              borderColor: ev.severity === 'high' ? '#D8454C' : ev.severity === 'mid' ? '#E89518' : '#2FA862'
            }}>
              <div className="flex items-center gap-2 text-[10px] text-text-tertiary mb-0.5">
                <span>{ev.date}</span>
                <span>·</span>
                <span>{ev.category}</span>
                <span>·</span>
                <span>{ev.status === 'closed' ? '已结案' : ev.status === 'open' ? '处理中' : '复审中'}</span>
              </div>
              <p className="text-[11px]">{ev.summary}</p>
            </div>
          ))}
        </Section>

        {/* Section 6 · 监管打分 */}
        <Section title="监管综合打分 REGULATORY SCORE">
          <div className="flex items-end gap-4 mb-3">
            <p className="text-[36px] font-bold tabular-nums leading-none">{enterprise.scoreOverall}</p>
            <p className="text-[11px] text-text-tertiary mb-1">/ 100</p>
          </div>
          {Object.entries(enterprise.scoreBreakdown).map(([k, v]) => (
            <div key={k} className="mb-1.5">
              <div className="flex justify-between text-[10px] text-text-tertiary">
                <span>{({compliance:'合规',safety:'安全',financial:'财务',esg:'ESG'} as any)[k]}</span>
                <span className="tabular-nums">{v}</span>
              </div>
              <div className="h-1 bg-bg-hover rounded-full overflow-hidden">
                <div className="h-full bg-[#2D6CDF]" style={{ width: `${v}%` }} />
              </div>
            </div>
          ))}
        </Section>

        {/* Section 7 · 风险标签 */}
        <Section title="风险标签 RISK FLAGS">
          <div className="flex flex-wrap gap-1.5">
            {enterprise.riskTags.map((tag, i) => (
              <span key={i} className="text-[10px] px-2 py-0.5 rounded-[2px] border border-[#D8454C] text-[#D8454C]">{tag}</span>
            ))}
          </div>
        </Section>
      </div>
    </aside>
  );
};

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <section>
    <h3 className="text-[10px] font-bold tracking-wider text-text-tertiary mb-2">{title}</h3>
    <div className="space-y-1">{children}</div>
  </section>
);

const KV: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="flex justify-between py-0.5">
    <span className="text-[11px] text-text-tertiary">{label}</span>
    <span className="text-[11px] text-right">{value}</span>
  </div>
);
```

---

## 第二步 · 在 WorkflowAttribution 替换原有 inline 抽屉 / Step 2 · Replace inline drawer inside WorkflowAttribution

在 `src/pages/WorkflowAttribution.tsx` 顶部引入：
At the top of `src/pages/WorkflowAttribution.tsx`, add the following imports:
```tsx
import { EnterpriseDetailDrawer } from '../components/EnterpriseDetailDrawer';
import { enterpriseKB } from '../data/commercial/enterprise_kb';
```
把原来 inline 实现的抽屉 JSX 删除，替换为：
Delete the original inline drawer JSX and replace it with:
```tsx
<EnterpriseDetailDrawer
  enterprise={selectedEnt ? enterpriseKB.find(e => e.id === selectedEnt) ?? null : null}
  onClose={() => setSelectedEnt(null)}
/>
```

---

## 第三步 · 挂到 RegulatoryEffectiveness 列表 / Step 3 · Bridge onto RegulatoryEffectiveness table rows

在 `src/pages/RegulatoryEffectiveness.tsx`：
Modify `src/pages/RegulatoryEffectiveness.tsx`:

```tsx
import { useState } from 'react';
import { EnterpriseDetailDrawer } from '../components/EnterpriseDetailDrawer';
import { enterpriseKB } from '../data/commercial/enterprise_kb';

const [selectedId, setSelectedId] = useState<string | null>(null);

// 列表里每一行 onClick / onClick handler on every row:
<tr onClick={() => setSelectedId(ent.id)} className="cursor-pointer hover:bg-bg-hover">
  ...
</tr>

// 页面底部 / Bottom of the page:
<EnterpriseDetailDrawer
  enterprise={selectedId ? enterpriseKB.find(e => e.id === selectedId) ?? null : null}
  onClose={() => setSelectedId(null)}
/>
```

---

## 第四步 · 造 8 家完整 mock 企业 / Step 4 · Mocking 8 comprehensive enterprise records

新建 `src/data/commercial/enterprise_kb.ts`，必须包含 **8 家完整数据**，每家所有字段填齐。建议组合：
Create a new file `src/data/commercial/enterprise_kb.ts` containing **8 fully developed records**, ensuring all fields are filled. Proposed organization structure:

1. **ENT-KZ-AKT-0091 · 西里海能源合资有限公司** (Western Caspian Energy LLC) — 中外合资上游油气，已有的主案例 / Sino-Foreign Joint Venture upstream oil/gas.
2. **ENT-KZ-AST-0102 · 哈萨克国家石油天然气集团** (KazMunayGas / KMG) — 国家主权企业 / National sovereign player.
3. **ENT-KZ-ATY-0118 · 阿特劳裂解联合炼化厂** (Atyrau Refinery JSC) — 下游炼化 / Downstream refining.
4. **ENT-KZ-AKT-0124 · 阿克套燃气配气公司** (Aktau Gas Distribution Co.) — 城市燃气 / Municipal gas.
5. **ENT-KZ-ALM-0156 · KEGOC 国家电网** (KEGOC) — 输配电网 / Transmission and grid operating.
6. **ENT-KZ-MAN-0173 · 曼吉斯套油田服务有限责任公司** (Mangystau Oilfield Services LLP) — 油服小型 / Smaller oilfield service provider.
7. **ENT-KZ-AST-0189 · 萨马鲁克能源股份公司** (Samruk-Energy JSC) — 主权基金下属发电 / Generation arm under state sovereign fund.
8. **ENT-KZ-AKT-0204 · 卡拉沙甘北油田作业商** (NCOC North Caspian Operating Co.) — 国际财团 / Big international consortium.

每家**至少** / Each record must contain at least:
- 3-5 个股东（含国资/外资/私募混合） / 3-5 shareholders (incorporating state, foreign, or private investors).
- 4 个产能 KPI（同比有正有负） / 4 operational capacity KPIs (with positive and negative YoY trends).
- 4-6 家关联企业（高/中/低风险混合） / 4-6 related entities (with low, mid, and high risks).
- 3-5 条历史合规事件（不同 category 与 severity） / 3-5 historic compliance events (across varied categories and severities).
- 完整打分（注意：高风险企业 scoreOverall 应低于 60；标杆企业 > 85） / Complete grading details (overall score < 60 for high-risk assets, and > 85 for benchmark companies).
- 2-5 个风险标签 / 2-5 risk flags.

具体示例（西里海能源）：
Detailed Example (Western Caspian Energy):
```ts
{
  id: 'ENT-KZ-AKT-0091',
  nameCn: '西里海能源合资有限公司',
  nameEn: 'Western Caspian Energy LLC',
  taxId: 'BIN 080340012345',
  legalRep: 'Bauyrzhan A. · 巴吾尔詹·阿曼诺夫',
  registeredCapital: 'KZT 8.4B',
  established: '2008-03-12',
  industry: '上游油气勘探与开采',
  hqAddress: '哈萨克斯坦曼吉斯套州 · 阿克套市 · Ozenmunaygas 工业园 BLK-12',
  shareholders: [
    { name: 'KazMunayGas E&P', pct: 51, type: 'state', ultimateBeneficiary: 'Samruk-Kazyna 主权基金' },
    { name: 'Sinopec International (中石化国际)', pct: 24, type: 'foreign', ultimateBeneficiary: '中国国资委' },
    { name: 'Caspian Holdings BV', pct: 18, type: 'foreign', ultimateBeneficiary: '荷兰 NL-BV / 实控人未披露' },
    { name: '管理层持股平台', pct: 7, type: 'private' },
  ],
  capacity: [
    { metric: '原油日产量',     value: '38.4', unit: 'kbpd',  yoy: -3.2 },
    { metric: '天然气伴生产量', value: '124',  unit: 'mmcfd', yoy: +1.4 },
    { metric: '已探明储量',     value: '482',  unit: 'Mbbl',  yoy:  0   },
    { metric: '采收率',         value: '38.6', unit: '%',     yoy: +0.4 },
  ],
  relatedEntities: [
    { id: 'ENT-KZ-AKT-0124', name: '阿克套燃气配气公司', relation: '下游伴生气买家', riskLevel: 'low' },
    { id: 'ENT-CN-BJ-7081',  name: '中石化国际服务北京',   relation: '设备与技术服务',     riskLevel: 'mid' },
    { id: 'ENT-NL-AMS-2210', name: 'Caspian Holdings BV', relation: '股东方·离岸架构', riskLevel: 'high' },
    { id: 'ENT-KZ-MAN-0173', name: '曼吉斯套油田服务',   relation: '主力油服承包商', riskLevel: 'mid' },
  ],
  complianceHistory: [
    { date: '2024-09-12', category: '环保', severity: 'mid', summary: '油泥处置厂排污超标 12%，已限期整改', status: 'closed' },
    { date: '2025-04-03', category: '财税', severity: 'high', summary: '关联交易转移定价异常，启动专项审计', status: 'open' },
    { date: '2025-11-28', category: '安全', severity: 'mid', summary: '一级增压站离心叶片缺陷预警', status: 'reviewing' },
    { date: '2026-03-15', category: '审批', severity: 'low', summary: '增产作业许可证延期申请', status: 'closed' },
  ],
  scoreOverall: 64,
  scoreBreakdown: { compliance: 58, safety: 71, financial: 52, esg: 75 },
  riskTags: ['离岸股东穿透异常', '关联交易高频', '设备老化预警'],
},
```

其它 7 家按同样结构造数据，每家都要有自己独立的故事线和风险特征：
The other 7 players should be modeled with the exact same structure but displaying unique storylines and risk traits:
- **KMG** is the solid benchmark operator, scores > 85, zero offshore entities.
- **Atyrau Refinery** JSC scores moderately (~70), main exposure in ESG/Environmental metrics.
- **Aktau Gas** Co. scores highly (~80) but holds regulatory compliance briefs re: utility price limits.
- **KEGOC** is 100% state-owned, scores ~88 but records technical safety concerns regarding grid voltage variations.
- **Mangystau Oilfield Services** LLP is small, scores ~55, exhibiting high transfer price actions & taxation/accounting alerts.
- **Samruk-Energy** is a state coal power generator holding low ESG ratings due to thermal structures.
- **NCOC** represents an international consortium of 4 foreign partners + KMG, exhibiting highly structured reporting and high transparency.

---

## 多语言映射 / Multi-language Mapping Reference
- '工商信息' → 'Business Registry'
- '股权穿透' → 'Ownership Structure'
- '业务产能' → 'Operational Capacity'
- '关联企业' → 'Related Entities'
- '历史合规事件' → 'Compliance History'
- '监管综合打分' → 'Regulatory Score'
- '风险标签' → 'Risk Flags'

---

## 禁止事项 / Restricted Actions
- ❌ 不要让 WorkflowAttribution 和 RegulatoryEffectiveness 分别维护两套抽屉代码（必须共享同一组件）
  - ❌ Do not allow WorkflowAttribution and RegulatoryEffectiveness to maintain disparate drawer structures. They must utilize the exact same component.
- ❌ 不要 fallback 到原 inline 抽屉
  - ❌ Do not default back to inline coding patterns for the detail drawer.
- ❌ 8 家企业数据不能复制粘贴雷同，每家必须有独特字段
  - ❌ Do not copy-paste identical records; each must represent genuine independent operating variables.
- ❌ 抽屉宽度固定 520px，不要响应式
  - ❌ Drawer width must be fixed strictly at 520px with no fluid responsive widths.
- ❌ 抽屉打开时不要遮罩整页（其它内容可见可点）
  - ❌ Do not place full-screen backdrops when the drawer is triggered. Underlaying contents must remain visible and interactable.
