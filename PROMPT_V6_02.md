# AI STUDIO PROMPT · V6-02 · MinisterDashboard 新增第 6 张卡片「能源方向新闻」
# AI STUDIO PROMPT · V6-02 · MinisterDashboard Adding the 6th Card "Global Energy News"

## 任务 / Task
在 `src/pages/MinisterDashboard.tsx` 第三行右列，新增一张卡片 `<CardGlobalEnergyNews />`。
新建组件文件 `src/components/cards/CardGlobalEnergyNews.tsx`。
新建数据文件 `src/data/global_energy_news.ts`。

In `src/pages/MinisterDashboard.tsx`, add a new card `<CardGlobalEnergyNews />` in the third row, right column.
Create a new component file: `src/components/cards/CardGlobalEnergyNews.tsx`.
Create a new data file: `src/data/global_energy_news.ts`.

---

## 卡片外框（与其它 5 张同款） / Card Border (Same style as the other 5 cards)
```tsx
<section className="bg-white border border-border-default rounded-[4px] p-5" style={{ height: '460px' }}>
```

---

## 卡片内部结构（自上而下三段） / Card Internal Structure (Three segments from top to bottom)

### 段 1 · 标题 + 媒体源 + 分类筛选 (h-12) / Segment 1 · Title + Media Source + Category Filter (h-12)
```
┌─────────────────────────────────────────────────────────────┐
│ 能源方向新闻 GLOBAL ENERGY BRIEFING            🟢🟡🔴 [全部]│
│                                                              │
│ [CNN] [NBC] [Reuters] [Bloomberg] [央视] [新华社] [AJ] [Tass]│
└─────────────────────────────────────────────────────────────┘
```
- **中文**:
  - 左侧 H 标题 + 副标题
  - 右侧三色色块筛选器：
    - 🔴 红 `#D8454C` = 地缘冲突（战争 / 核设施 / 能源设施被袭）
    - 🟡 黄 `#E89518` = 大项目投入（中美欧能源投资）
    - 🟢 绿 `#2FA862` = 政策与市场（OPEC+ / CBAM / 价格）
  - 下方一行媒体源 chip（小灰 chip），点击 toggle 该媒体源过滤
- **English**:
  - Left side: H Title + Subtitle
  - Right side: Three-color filter block:
    - 🔴 Red `#D8454C` = Conflict (war / nuclear installations / energy facilities attacked)
    - 🟡 Yellow `#E89518` = Project / Investment (energy investment in China, US, EU)
    - 🟢 Green `#2FA862` = Policy & Market (OPEC+ / CBAM / prices)
  - Below: A row of media source chips (small gray chips), click to toggle filtering for that media source.

---

### 段 2 · 头条大卡 + 次条列表 (h-340，flex 横向 60/40) / Segment 2 · Headline Big Card + Sub- headline List (h-340, flex horizontal 60/40)

#### 左 60% · 头条大卡 / Left 60% · Headline Card
```tsx
<article className="flex-[3] border border-border-default rounded-[4px] overflow-hidden">
  <div className="h-[180px] bg-bg-hover" /* 头条配图，mock 占位 / Headline picture mock placeholder */ />
  <div className="p-3">
    <div className="flex items-center gap-2 text-[10px] text-text-tertiary mb-1">
      <span className="px-1.5 py-0.5 rounded-[2px] bg-[#D8454C] text-white">CONFLICT</span>
      <span>CNN · 28 min ago · USA / Iran</span>
    </div>
    <h4 className="text-[14px] font-bold leading-snug">
      美军确认对伊朗 Natanz 核能源设施进行精确打击
    </h4>
    <p className="text-[11px] text-text-secondary mt-1 line-clamp-2">
      五角大楼简报：本次行动针对地下铀浓缩离心机厂区，影响伊朗后续核能源生产能力 ...
    </p>
  </div>
</article>
```

#### 右 40% · 6-8 条次条列表 / Right 40% · 6-8 Sub-headlines List
```tsx
<div className="flex-[2] flex flex-col overflow-y-auto custom-scrollbar pl-4 border-l border-border-default">
  {items.map(n => (
    <article key={n.id} className="py-2 border-b border-border-default last:border-b-0 cursor-pointer hover:bg-bg-hover px-2 rounded-[2px]">
      <div className="flex items-center gap-2 text-[10px] text-text-tertiary mb-0.5">
        <span className={cn(
          "px-1.5 py-0.5 rounded-[2px] text-white",
          n.category === 'conflict' && 'bg-[#D8454C]',
          n.category === 'investment' && 'bg-[#E89518]',
          n.category === 'policy' && 'bg-[#2FA862]',
        )}>{n.categoryLabel}</span>
        <span>{n.source} · {n.timeAgo}</span>
      </div>
      <h5 className="text-[12px] font-semibold leading-tight line-clamp-2">{n.title}</h5>
    </article>
  ))}
</div>
```

---

### 段 3 · 底部刷新条 (h-8) / Segment 3 · Bottom Refresh Bar (h-8)
```tsx
<div className="flex items-center justify-between text-[10px] text-text-tertiary border-t border-border-default pt-2">
  <span>共 {totalCount} 条 · 8 个媒体源 · 自动每 60s 刷新</span>
  <button onClick={refresh} className="hover:text-text-primary">⟳ 立即刷新</button>
</div>
```
- **中文**: 每 60s mock 刷新时，弹出 banner `+3 条新动态 ↗`，3s 后自动消失。
- **English**: Every 60s when mocked to refresh, pop up a banner `+3 new dynamics ↗` and clear it after 3s.

---

## 数据 `src/data/global_energy_news.ts` / Data File `src/data/global_energy_news.ts`

```ts
export type NewsCategory = 'conflict' | 'investment' | 'policy';
export type NewsSource = 'CNN' | 'NBC' | 'Reuters' | 'Bloomberg' | 'CCTV' | 'XinhuaNet' | 'AlJazeera' | 'Tass';

export type GlobalNewsItem = {
  id: string;
  isHeadline?: boolean;
  source: NewsSource;
  category: NewsCategory;
  categoryLabel: string;     // 'CONFLICT' / 'INVESTMENT' / 'POLICY'
  region: string;
  timeAgo: string;
  title: string;
  summary: string;
  imageUrl?: string;          // 头条用 / Used for headline
  kpiImpact?: { kpi: string; deltaPct: number }[];
};

export const globalNews: GlobalNewsItem[] = [
  // 1 条头条 + 8 条次条，全部 mock 真实可信内容 / 1 headline + 8 sub-headlines, all with credible mock content
  {
    id: 'gn_001',
    isHeadline: true,
    source: 'CNN',
    category: 'conflict',
    categoryLabel: 'CONFLICT',
    region: 'USA / Iran',
    timeAgo: '28 min ago',
    title: '美军确认对伊朗 Natanz 核能源设施进行精确打击',
    summary: '五角大楼简报：本次行动针对地下铀浓缩离心机厂区，影响伊朗后续核能源生产能力，国际油价应声上涨 4.2%。',
    kpiImpact: [
      { kpi: 'Brent 原油', deltaPct: +4.2 },
      { kpi: '哈萨克出口议价', deltaPct: +1.8 },
    ]
  },
  // English translation for fallback/dictionary / 英文翻译字典对照：
  // "美军确认对伊朗 Natanz 核能源设施进行精确打击" -> "US military confirms precision strike on Iran's Natanz nuclear energy facility"
  // "五角大楼简报：本次行动针对地下铀浓缩离心机厂区，影响伊朗后续核能源生产能力，国际油价应声上涨 4.2%。" -> "Pentagon briefing: The operation targeted underground uranium enrichment centrifuge facilities, impacting Iran's subsequent nuclear production. Brent crude surged 4.2% in response."
  {
    id: 'gn_002',
    source: 'CCTV',
    category: 'investment',
    categoryLabel: 'INVESTMENT',
    region: 'China',
    timeAgo: '1h ago',
    title: '中国政府宣布 1,200 亿元投入新型电力系统建设',
    summary: '"十五五"开局新型电力系统三年行动方案启动，特高压直流 + 储能 + 虚拟电厂三轮驱动 ...',
    kpiImpact: [{ kpi: '亚太煤价', deltaPct: -1.1 }]
  },
  {
    id: 'gn_003',
    source: 'Reuters',
    category: 'policy',
    categoryLabel: 'POLICY',
    region: 'OPEC+',
    timeAgo: '2h ago',
    title: 'OPEC+ 维持现有减产计划至 2026 年 Q4',
    summary: '维也纳会议公报 ...',
    kpiImpact: [{ kpi: 'Brent 原油', deltaPct: +0.8 }]
  },
  {
    id: 'gn_004',
    source: 'NBC',
    category: 'conflict',
    categoryLabel: 'CONFLICT',
    region: 'USA / Venezuela',
    timeAgo: '3h ago',
    title: '美方升级对委内瑞拉海上能源设施监控',
    summary: '加勒比海方向部署 ...',
  },
  {
    id: 'gn_005',
    source: 'XinhuaNet',
    category: 'investment',
    categoryLabel: 'INVESTMENT',
    region: 'China-Kazakhstan',
    timeAgo: '4h ago',
    title: '中哈天然气管道 D 线启动 EPC 招标，总投资 78 亿美元',
    summary: '管道全长 1,250 km，年输气能力 250 亿方 ...',
    kpiImpact: [{ kpi: '哈萨克管道收入', deltaPct: +6.3 }]
  },
  {
    id: 'gn_006',
    source: 'Bloomberg',
    category: 'policy',
    categoryLabel: 'POLICY',
    region: 'EU',
    timeAgo: '5h ago',
    title: '欧盟 CBAM 第三季度报告：俄气替代品成本压力持续',
    summary: '布鲁塞尔披露 ...',
  },
  {
    id: 'gn_007',
    source: 'AlJazeera',
    category: 'conflict',
    categoryLabel: 'CONFLICT',
    region: 'Middle East',
    timeAgo: '6h ago',
    title: '红海无人机袭击导致 2 艘 LNG 运输船改道',
    summary: '苏伊士运河保险费率应声上调 ...',
    kpiImpact: [{ kpi: 'LNG 现货', deltaPct: +2.6 }]
  },
  {
    id: 'gn_008',
    source: 'Tass',
    category: 'policy',
    categoryLabel: 'POLICY',
    region: 'Russia',
    timeAgo: '8h ago',
    title: '俄罗斯能源部公布 2026 年油气出口配额',
    summary: '亚洲方向配额提升 12% ...',
  },
  {
    id: 'gn_009',
    source: 'CCTV',
    category: 'investment',
    categoryLabel: 'INVESTMENT',
    region: 'China',
    timeAgo: '10h ago',
    title: '中广核与哈萨克 KazAtomProm 续签 30 万吨铀长单',
    summary: '保障核电燃料 ...',
  },
];
```

---

## 抽屉交互 / Drawer Interaction
点击任意新闻 → 触发 `RightDrawer` 显示：
1. 顶部：分类色块 + 标题 + 媒体源 + 时间 + 地区
2. 中部：全文（mock 200 字）
3. KPI 影响小卡（如果 kpiImpact 有值）：每个 KPI 一行 + 红绿小柱图
4. 底部按钮：`📋 纳入今日部长简报` （跳 ReportGeneration 并预填）

Clicking any news item → Triggers `RightDrawer` to display:
1. Top: Category color swatch + Title + Media source + Time + Region
2. Center: Full body text (mocked to 200 words)
3. KPI Impact module (if `kpiImpact` exists): One row for each KPI + Red/Green mini bar indicators
4. Bottom button: `📋 Add to Today's Ministerial Brief` (navigates to ReportGeneration and pre-fills)

---

## 自动刷新逻辑 / Auto Refresh Logic
```tsx
useEffect(() => {
  const timer = setInterval(() => {
    setShowRefreshBanner(true);
    setTimeout(() => setShowRefreshBanner(false), 3000);
  }, 60_000);
  return () => clearInterval(timer);
}, []);
```

---

## 多语言映射 / Language Localization Mapping
- 'Global Energy Briefing' → '能源方向新闻'
- 'CONFLICT' → '地缘冲突'
- 'INVESTMENT' → '大项目投入'
- 'POLICY' → '政策与市场'
- '纳入今日部长简报' → 'Add to Today Brief'
- '立即刷新' → 'Refresh Now'

---

## 禁止事项 / Restrictions & Prohibited Actions
- ❌ 不要用任何外部新闻 API / Do not use any external news APIs
- ❌ 不要在卡片里放视频 / Do not put video players inside cards
- ❌ 不要使用大于 5 种颜色 / Do not use more than 5 colors
- ❌ 不要 emoji 装饰（除分类色块小圆点） / Do not use emojis for decoration (excluding classification color indicator dots)
- ❌ 不要把头条配图用真实 url 引用，全部 mock 占位 / Do not reference headlining pictures with real external URLs, use mock placeholders exclusively
