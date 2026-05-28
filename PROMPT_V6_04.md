# AI STUDIO PROMPT · V6-04 · 舆情卡片 6 个分析子图全部重做 + 造细数据
# AI STUDIO PROMPT · V6-04 · Sentiment Card Retooling: 6 Analytical Sub-charts Redevelopment + Fine-grained Mock Data

## 任务 / Task
为 V6-03 中预留的 `<SentimentSixChartsTabs />` 组件，实现 6 个高质量分析子图。
新建组件目录：`src/components/sentiment/`
新建数据文件：`src/data/sentiment_analytics.ts`

Implement 6 high-quality analytical sub-charts for the `<SentimentSixChartsTabs />` component as designated in V6-03.
Create a new component directory: `src/components/sentiment/`
Create a new data file: `src/data/sentiment_analytics.ts`

---

## 6 个 Tab 切换器 / 6-Tab Switcher
```tsx
const TABS = [
  { id: 'volume',    label: '声量 30 天' },
  { id: 'emotion',   label: '情感分布' },
  { id: 'keywords',  label: '高频词' },
  { id: 'audience',  label: '参与结构' },
  { id: 'platforms', label: '平台监控' },
  { id: 'spread',    label: '热力传播' },
];
```
Tab 样式与 EventAudit 双视图切换器一致（参考 V5 的 06_audit_dual_view.md）。
Tab design matches the EventAudit dual-view switcher (refer to V5's `06_audit_dual_view.md`).

---

## 子图 1 · 声量 30 天（K 线 + 折线） / Sub-chart 1 · Volume 30d (Candlesticks + Line)

### 视觉 / Visuals
- 横轴：过去 30 天每天 1 个点，共 30 个数据点
- 主体：OHLC K 线（绿涨红跌），宽度 6px，间距 4px
- 叠加：收盘价折线，2px 蓝色 `#2D6CDF`，连接所有点
- 异常点：当日声量 > μ+2σ 的点上方打红色三角 ▼
- Y 轴左：声量（K 单位，0 ~ 80K）
- 顶部 KPI 条：
  - 30 日均值 `28.4K/天`
  - 30 日峰值 `74.2K` (2026-05-26)
  - 异常天数 `4 天`

- X-axis: 1 point per day for the past 30 days (total 30 data points).
- Main Body: OHLC Candlestick charts (green for gain, red for loss), width 6px, spacing 4px.
- Overlay: Closing price line, 2px solid Blue `#2D6CDF` connecting all points.
- Anomalies: On days where volume exceeds μ+2σ, draw a solid Red Triangle (▼) above the point.
- Y-axis (Left): Volume (measured in Thousands 'K', range 0 ~ 80K).
- Top KPI banner:
  - 30-day Avg: `28.4K/day`
  - 30-day Peak: `74.2K` (2026-05-26)
  - Anomaly Days: `4 Days`

### 数据 mock / Data Mocking
```ts
export const volumeData30d = [
  // 30 天 OHLC，要有真实波动节奏 / 30-day OHLC data with natural fluctuation patterns
  { date: '2026-04-29', open: 21000, high: 24500, low: 19800, close: 23100, anomaly: false },
  { date: '2026-04-30', open: 23100, high: 25800, low: 22400, close: 25200, anomaly: false },
  // ... 30 条，至少 4 个 anomaly=true 的尖峰 / 30 records, with at least 4 critical peaks containing anomaly=true
  { date: '2026-05-26', open: 48200, high: 74200, low: 47800, close: 71500, anomaly: true },
  { date: '2026-05-28', open: 38400, high: 42100, low: 36800, close: 41200, anomaly: false },
];
```

### 实现 / Implementation
SVG 手绘，width=100% height=320px。
- 计算 yScale：domain [0, max*1.1]，range [innerHeight, 0]
- 每根 K 线：用 `<rect>` 画实体 + `<line>` 画上下影线
- 折线：`<polyline points="..." stroke="#2D6CDF" strokeWidth="2" fill="none" />`
- 异常三角：`<path d="M cx-5 cy-12 L cx+5 cy-12 L cx cy-3 Z" fill="#D8454C" />`

Handcrafted SVG layout, `width="100%"` `height="320px"`.
- Calculate `yScale`: domain `[0, max * 1.1]`, range `[innerHeight, 0]`.
- Each candlestick element: `<rect>` for solid body + `<line>` for upper and lower wicks.
- Line chart overlay: `<polyline points="..." stroke="#2D6CDF" strokeWidth="2" fill="none" />`.
- Anomaly triangle indicators: `<path d="M cx-5 cy-12 L cx+5 cy-12 L cx cy-3 Z" fill="#D8454C" />`.

---

## 子图 2 · 情感分布（左右对照气泡 + 比例条） / Sub-chart 2 · Sentiment Distribution (Contrast Bubbles + Aspect Proportions Bar)

### 视觉 / Visuals
```
┌────────────────────────┬────────────────────────┐
│ 负向 NEGATIVE  62%     │ 正向 POSITIVE  18%     │
│                        │                        │
│  ●大圆  ●大圆           │      ●中圆              │
│   涨价  停电            │      投资利好          │
│                        │                        │
│   ●中圆  ●中圆          │   ●小圆                │
│   罢工  污染            │   就业增长             │
└────────────────────────┴────────────────────────┘
        ←─ 中间比例条 (negative 62 | neutral 20 | positive 18) ─→
```

### 数据 / Data
```ts
export const emotionDistribution = {
  negative: {
    pct: 62,
    topics: [
      { id: 'price_hike', label: '涨价', volume: 18400, size: 'lg' },
      { id: 'outage',     label: '停电', volume: 12800, size: 'lg' },
      { id: 'strike',     label: '罢工', volume: 8200,  size: 'md' },
      { id: 'pollution',  label: '污染', volume: 6100,  size: 'md' },
      { id: 'corruption', label: '腐败', volume: 3400,  size: 'sm' },
    ]
  },
  neutral: { pct: 20, topics: [/* ... */] },
  positive: {
    pct: 18,
    topics: [
      { id: 'investment', label: '投资利好', volume: 4200, size: 'md' },
      { id: 'jobs',       label: '就业增长', volume: 2100, size: 'sm' },
    ]
  }
};
```

### 实现 / Implementation
- 左右两个气泡布局区，size→r 映射：lg=36, md=24, sm=14
- 气泡随机散布 + 用力导布局（简单实现：网格 + jitter）
- 气泡 fill 透明度 0.2，stroke 1.5px：
  - negative → `#D8454C`
  - neutral  → `#9CA3AF`
  - positive → `#2FA862`
- 中间一根水平比例条，3 段颜色
- 点击任意气泡 → emit `onDrilldown(topic.id)` 在卡片底部展开 30 天子声量趋势

- Left/Right dual bubble zones, maps sizes `lg=36`, `md=24`, `sm=14`.
- Bubbles randomly position with simple deterministic force simulation (Grid layout + positional jitter).
- Bubbles rendered with `fillOpacity="0.2"` and `strokeWidth="1.5px"`:
  - Negative → `#D8454C`
  - Neutral  → `#9CA3AF`
  - Positive → `#2FA862`
- Horizontal proportional bar spanning the middle divider with 3 colored sections.
- Clicking on a bubble emits `onDrilldown(topic.id)` expanding a mini 30-day trend chart at the bottom.

---

## 子图 3 · 高频词（词云） / Sub-chart 3 · Word Cloud

### 视觉 / Visuals
经典词云，约 40-60 个词，字号 = 频次（10px ~ 36px）；颜色 = 情感倾向：
- 负向词 → `#D8454C`
- 中性词 → `#6B7280`
- 正向词 → `#2FA862`

Classic word cloud, 40-60 words. Font-size corresponds directly to frequency (ranging from 10px to 36px). Colors represent sentiment bias:
- Negative Words → `#D8454C`
- Neutral Words → `#6B7280`
- Positive Words → `#2FA862`

### 数据 / Data
```ts
export const keywordCloud = [
  { text: 'тариф', freq: 9800, sentiment: 'neg' },           // 关税 / Tariff
  { text: 'газ',  freq: 8700, sentiment: 'neg' },            // 燃气 / Gas
  { text: 'свет', freq: 7400, sentiment: 'neg' },            // 电 / Electricity
  { text: 'KEGOC', freq: 6800, sentiment: 'neu' },
  { text: 'KMG', freq: 6400, sentiment: 'neu' },
  { text: 'дорого', freq: 6100, sentiment: 'neg' },          // 贵 / Expensive
  { text: 'отключение', freq: 5800, sentiment: 'neg' },      // 停电 / Outage
  { text: 'Almaty', freq: 5400, sentiment: 'neu' },
  // ... 至少 50 个词，混合俄文/哈萨克文/英文 / At least 50 mixed Russian/Kazakh/English terms
];
```

### 实现 / Implementation
- 用简化 spiral 布局：从中心向外螺旋放置，碰撞检测
- 或直接用现成轻量库：**禁止 d3-cloud**（包太大），自己用 `for` 循环 + 边界检测
- 字号 = `8 + Math.sqrt(freq / maxFreq) * 28`
- 旋转角度：随机 0 或 -30°
- hover：放大 1.2 倍 + tooltip 显示 `frequency: 9,800 · sentiment: negative`

- Use a lightweight radial spiral positioning algorithm (collision testing outwards from center).
- **Prohibited: `d3-cloud`** (file size overhead limits). Use a basic mathematical formula for distributing terms.
- Font sizing: `size = 8 + Math.sqrt(freq / maxFreq) * 28`.
- Random rotaion angles: 0 or -30°.
- Hover effect: Scale up by 1.2x and display a custom CSS tooltip: `frequency: 9,800 · sentiment: negative`.

---

## 子图 4 · 参与结构分析（桑基分层流） / Sub-chart 4 · Audience Structure (Multi-level Flow)

### 视觉 / Visuals
三层桑基（从左到右）：
Three-tier horizontal flows (from Left to Right):
```
层 1 用户身份        层 2 平台          层 3 内容类型
─────────────       ─────────────       ─────────────
普通用户  42% →     Telegram  31% →    抱怨/吐槽    38%
KOL/媒体  28% →     Facebook  24% →    深度评论     22%
官方账号  18% →     TikTok    19% →    新闻转发     18%
匿名      12% →     YouTube   14% →    呼吁行动     12%
                    X/Twitter  8% →    讽刺梗图     10%
                    News Site  4% →    
```

### 实现 / Implementation
- 4 + 6 + 5 = 15 个节点
- 节点用矩形 + label
- 连线用立方贝塞尔，宽度 = value
- 颜色：负向流量红、正向流量绿、中性灰，按目标节点的主情感色取色

- 4 + 6 + 5 = 15 nodes overall.
- Nodes represented by vertical blocks + label text.
- Connectors using cubic bezier styling, width reflecting raw value.
- Color Rules: Negative (Red), Positive (Green), Neutral (Gray). Colors mapped based on target nodes' primary sentiment context.

### 数据 / Data
```ts
export const audienceFlow = {
  nodes: [
    { id: 'role_user', col: 1, label: '普通用户', value: 42 },
    { id: 'role_kol',  col: 1, label: 'KOL/媒体', value: 28 },
    // ...
  ],
  links: [/* 至少 20 条 / Minimum 20 links */]
};
```

---

## 子图 5 · 平台监控（多平台 sparkline 列表） / Sub-chart 5 · Platform Monitoring Sparklines

### 视觉 / Visuals
```
┌─────────────────────────────────────────────────────────────┐
│ Telegram   ╱╲╱╲___╱╲    28.4K  +12%  ●负向占比 71%         │
│ Facebook   ___╱╲╱╲___   22.1K   +6%  ●负向占比 64%         │
│ TikTok     ╱╲___╱╲╱╲    18.9K  +28%  ●负向占比 58%         │
│ YouTube    ╱╲╱╲╱╲___    13.4K   +3%  ●负向占比 52%         │
│ X/Twitter  ___╱╲___╱╲    7.8K  -1%   ●负向占比 49%         │
│ News Sites _╱╲╱╲╱╲___    4.2K  +2%   ●负向占比 38%         │
└─────────────────────────────────────────────────────────────┘
```

### 实现 / Implementation
- 每行 flex：平台名 + sparkline + 当日声量 + 24h 增速 + 情感占比
- sparkline 用 `<polyline>` 画 24 小时 24 个点
- 颜色：增速 > 10% → 红，正常 → 灰，负 → 绿
- hover 行：背景 `bg-bg-hover`，并在下方临时展开该平台 TOP3 热门贴文标题

- Each row flex container: Platform name + sparkline path + Daily volume + 24h growth + Sentiment ratio.
- Sparklines drawn with `<polyline>` mapping 24 points for the preceding 24 hours.
- Growth color: Growth > 10% (Red highlight), normal (Gray/neutral), decline (Green/positive).
- Row Hover effect: Switch background to `bg-bg-hover` and temporarily slide expand the TOP 3 hot posting headlines under the cursor platform line.

### 数据 / Data
```ts
export const platformMonitor = [
  {
    platform: 'Telegram',
    volume24h: 28400,
    growth24h: 12,
    negShare: 71,
    sparkline: [/* 24 个数值，要有起伏 / 24 data points representing realistic drift */],
    topPosts: ['Цены ЖКХ Алматы +35%', 'KEGOC аварийный режим', 'Газ дорожает снова']
  },
  // ... 6 platforms
];
```

---

## 子图 6 · 热力传播（复用第一个 Dashboard 桑基扩线视觉风格） / Sub-chart 6 · Spread Propagation (Reuse Dashboard 1 Sankey Extension)

### 视觉 / Visuals
完全复用 V5-03 的桑基扩线样式，但语义换成"传播路径"：
Fully reuse the style of the Sankey extension in V5-03, but map new semantic context representing "spread flow pathways":
```
列 1 源平台 (5)    列 2 扩散中转层 (3)    列 3 受众群体 (3)    列 4 影响 (1)
○ Telegram        ○ 跨平台搬运         ○ 普通市民        ●(红, 最大)
○ TikTok          ○ KOL 二次创作       ○ 行业从业者       骚乱苗头 / Riot Catalysts
○ YouTube         ○ 媒体引用            ○ 政府关注          
○ News
○ Facebook
```

### 颜色规则 / Color Rules
仅 3 色：绿（正常）/ 黄（升温）/ 红（危机），与 V5-03 一致。
Exactly 3 colors: Green (normal/safe) / Yellow (rising) / Red (crisis threat), matching V5-03 config.

### 实现 / Implementation
直接复用 `src/data/sentiment_sankey.ts` 的渲染组件 `<SentimentSankey />`，但传入新的数据 `spreadSankeyData`，节点 label 和数值替换为传播相关。

Directly reuse the `<SentimentSankey />` rendering component from `src/data/sentiment_sankey.ts`, but feed it with newly customized dataset `spreadSankeyData` mapping spreading mechanics.

### 数据 / Data
```ts
export const spreadSankeyData = {
  nodes: [
    { id: 'src_tg', col: 1, label: 'Telegram', color: 'yellow', volume: 28400 },
    // ... 5 source platforms
    { id: 'mid_repost', col: 2, label: '跨平台搬运 / Multi-platform Crossposting', color: 'red', volume: 19200 },
    { id: 'mid_kol',    col: 2, label: 'KOL 二次创作 / KOL Creations', color: 'red', volume: 14800 },
    { id: 'mid_media',  col: 2, label: '媒体引用 / Media Citations', color: 'yellow', volume: 9600 },
    { id: 'aud_citizen', col: 3, label: '普通市民 / Average Citizenry', color: 'red', volume: 32100 },
    { id: 'aud_industry', col: 3, label: '行业从业者 / Industry Employees', color: 'yellow', volume: 12400 },
    { id: 'aud_gov', col: 3, label: '政府关注 / Government Attention', color: 'green', volume: 5800 },
    { id: 'crisis_main', col: 4, label: '骚乱苗头汇聚 / Social Unrest Hotbeds', color: 'red', volume: 79500, isMain: true },
  ],
  links: [/* At least 18 links */]
};
```

---

## 顶部公共 KPI 条（所有 6 个 tab 共享） / Global Top KPI Row (Shared by all 6 tabs)
在 SentimentMainArea 顶部固定一行 KPI（在 tabs 之上）：
- 今日总声量 `124.6K`
- 24h 增速 `+18%` (红)
- 负向占比 `62%`
- 危机阈值预警 `已触发`

Consolidated KPI strip displayed at the top of SentimentMainArea (above tabs):
- Today's Total Volume: `124.6K`
- 24h Velocity Rate: `+18%` (Red)
- Negative Sentiment Ratio: `62%`
- Threshold Warning: `TRIGGERED`

---

## 实现总入口 / Unified Entry Component
```tsx
// src/components/sentiment/SentimentSixChartsTabs.tsx
export const SentimentSixChartsTabs = () => {
  const [active, setActive] = useState<'volume'|'emotion'|'keywords'|'audience'|'platforms'|'spread'>('volume');
  return (
    <div className="h-full flex flex-col">
      <SentimentKpiBar />
      <TabSwitcher tabs={TABS} active={active} onChange={setActive} />
      <div className="flex-1 mt-3 min-h-0">
        {active === 'volume'    && <ChartVolume30d />}
        {active === 'emotion'   && <ChartEmotionDistribution />}
        {active === 'keywords'  && <ChartKeywordCloud />}
        {active === 'audience'  && <ChartAudienceFlow />}
        {active === 'platforms' && <ChartPlatformMonitor />}
        {active === 'spread'    && <ChartSpreadSankey />}
      </div>
    </div>
  );
};
```

---

## 多语言映射 / Multi-language Mapping
- '声量 30 天' → 'Volume 30d'
- '情感分布' → 'Emotion Distribution'
- '高频词' → 'Top Keywords'
- '参与结构' → 'Audience Structure'
- '平台监控' → 'Platform Monitor'
- '热力传播' → 'Spread Heatmap'

---

## 禁止事项 / Restricted Actions
- ❌ 不使用 echarts / d3-cloud / d3-sankey 等大体积库
  - ❌ Do not use bloated packages like echarts, d3-cloud, or d3-sankey.
- ❌ 不使用渐变 fill / 阴影 / emoji
  - ❌ Do not apply color gradient fills, extensive shadows, or decorative emojis.
- ❌ 颜色总数 ≤ 5（黑/蓝/绿/黄/红）
  - ❌ Limit the color usage strictly <= 5 colors (Black, Blue, Green, Yellow, Red).
- ❌ K 线图必须把所有 30 个点连成折线，不能只有散点
  - ❌ The aggregate closing price line inside the Volume 30d chart must run as an unbroken polyline connecting all 30 points.
- ❌ 词云不能用 ascii 字符堆叠，必须是 SVG 文本
  - ❌ Do not use monospace ASCII character walls for word cloud. Output SVG text elements properly localized.
- ❌ 6 个子图不能复用同一种可视化
  - ❌ Do not use same layout designs or duplicate charts across the 6 tabs ("The illustrations are too simplistic currently").
