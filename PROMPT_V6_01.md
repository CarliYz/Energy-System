# AI STUDIO PROMPT · V6-01 · MinisterDashboard 找回原卡片 + 6 卡片三行两列重排
# AI STUDIO PROMPT · V6-01 · MinisterDashboard Card Recovery + 6-Card 3x2 Grid Reorganization

## 任务 / Tasks
修改 `src/pages/MinisterDashboard.tsx`，完成 4 件事：
Modify `src/pages/MinisterDashboard.tsx` to accomplish the following 4 tasks:

1. 找回被 v5 误删/覆盖的原卡片「国家战略能源出口与月度 GDP 弹性指数联动」并放回原位（第一行左列）
   Recover the original card "National Strategic Energy Export × Monthly GDP Elasticity Coupling" that was accidentally deleted/overwritten in v5 and restore it to its original position (First Row, Left Column).

2. 把现有「GDP × 产能 布林域区间监控」卡片从第一行左列移到第一行右列；同时**删除该卡片右下角的"能源新闻滚动条"子组件**，把腾出的空间让布林域 K 线主图横向拉满
   Move the existing "GDP × Capacity Bollinger Band Interval Monitoring" card from the First Row, Left Column to the First Row, Right Column; meanwhile, **delete the "Energy News Marquee" sub-component** in the bottom right corner of this card to expand the main Bollinger Band Candlestick chart to take up the full horizontal space.

3. 整个页面 layout 改为 3 行 × 2 列共 6 个卡片，每个卡片高度固定 460px，外层 container 加 `overflow-y-auto` 让鼠标滚轮可向下滚动
   Reorganize the entire page layout into a 3 Rows × 2 Columns grid containing 6 cards in total. Each card should have a fixed height of 460px, and the outer container must include `overflow-y-auto` to allow vertical scrolling with the mouse wheel.

4. 第 5 张卡片「部长特提与意见指挥大厅」保持现状内容不动，仅位置调整到第三行左列
   Keep the content of the fifth card "Ministerial Special Submissions & Opinion Command Center" completely unchanged, and only adjust its position to the Third Row, Left Column.

---

## 找回原卡片的方式 / Method for Recovering the Original Card
通过 git 历史回溯（或参考 INDEX.md 中 `01_original_handoff_prompts/page_0_1_inline_prompt.md` 与 `02_v3_redesign_prompts/page_0_1_inline_prompt_v3.md`）找到原始「国家战略能源出口与月度 GDP 弹性指数联动」卡片的完整 JSX，**1:1 还原**到第一行左列。如果找不到则按以下结构重建：
Trace back via git history (or refer to `01_original_handoff_prompts/page_0_1_inline_prompt.md` and `02_v3_redesign_prompts/page_0_1_inline_prompt_v3.md` in INDEX.md) to locate the complete JSX of the original "National Strategic Energy Export × Monthly GDP Elasticity Coupling" card and **restore it 1:1** to the First Row, Left Column. If it cannot be found, reconstruct it according to the following structure:

### 卡片标题 / Card Title
`国家战略能源出口与月度 GDP 弹性指数联动`（中文）/ `National Strategic Energy Export × Monthly GDP Elasticity Coupling`（英文）

### 卡片内容（重建版结构） / Card Content (Reconstructed Structure)
- 左半区：曲线图，X 轴 = 过去 24 个月，Y 轴双轴
  - 蓝色实线 = 月度能源出口量（kbpd）
  - 橙色实线 = 月度 GDP 同比增速（%）
  - 灰色虚线 = 拟合回归线
  - **Left Section**: Line chart. X-axis = past 24 months, with dual Y-axes.
    - Blue Solid Line = Monthly Energy Export Volume (kbpd)
    - Orange Solid Line = Monthly GDP YoY Growth Rate (%)
    - Grey Dashed Line = Fitted Regression Line
- 右半区：3 个 KPI 卡片纵向堆叠
  - 出口能耗弹性系数 α = `0.42` (a.u.)
  - 系数变化方差 σ = `0.04`
  - 滚动联动强度 = `20.2%` (R²-MoM)
  - **Right Section**: 3 vertically stacked KPI cards.
    - Export Energy Consumption Elasticity Coefficient α = `0.42` (a.u.)
    - Coefficient Variation Variance σ = `0.04`
    - Rolling Coupling Strength = `20.2%` (R²-MoM)
- 底部：4 个迷你 KPI（与设计稿一致）
  - 石油 `1.82 Mbbl/d`
  - 天然气 `145 m³/d`
  - 煤炭 `312 Kt/d`
  - 电力 `20.4 GWh`
  - **Bottom Section**: 4 mini KPIs (aligned with the design specs).
    - Oil `1.82 Mbbl/d`
    - Natural Gas `145 m³/d`
    - Coal `312 Kt/d`
    - Power `20.4 GWh`
- 卡片右上角小 chip：`视图版 v1.4 ↗`
  - Small chip in top right: `View v1.4 ↗`

---

## 6 卡片三行两列布局（核心改动） / 6-Card 3x2 Grid Layout (Core Changes)

替换现有 grid，使用以下结构：
Replace the existing grid using the following structure:

```tsx
<div className="h-full overflow-y-auto custom-scrollbar">
  <div className="grid grid-cols-2 gap-4 p-4" style={{ minHeight: '1500px' }}>
    {/* 第一行 */}
    <CardGdpElasticity />              {/* ① 找回的原卡片 */}
    <CardBollingerCapacity />          {/* ② 布林域（从左移到右，删新闻条） */}

    {/* 第二行 */}
    <CardLivelihoodRedline />          {/* ③ 民生红线 */}
    <CardSentimentSankey />            {/* ④ 舆情桑基 */}

    {/* 第三行 */}
    <CardMinisterCommandCenter />      {/* ⑤ 部长特提与意见指挥大厅（保持原样） */}
    <CardGlobalEnergyNews />           {/* ⑥ 能源方向新闻（由 V6-02 实现） */}
  </div>
</div>
```

每张卡片外框统一样式：
Each card wrapper should have unified styling:
```tsx
<section className="bg-white border border-border-default rounded-[4px] p-5"
         style={{ height: '460px' }}>
  ...
</section>
```

---

## CardBollingerCapacity 改造细节 / CardBollingerCapacity Customization Details
找到当前 BollingerBand 卡片，**删除以下内部子组件**：
Locate the current BollingerBand card and **delete the following nested sub-components**:
- 任何标题含 `News` / `新闻` / `滚动` 的子区块
  - Any sub-sections containing `News` / `新闻` / `Marquee` / `滚动` in their headings
- 任何 className 含 `animate-marquee` / `news-ticker` 的元素
  - Any elements whose className contains `animate-marquee` / `news-ticker`
- 文件 `src/data/energy_news.ts` 在本卡片内的引用全部删除
  - All references to the file `src/data/energy_news.ts` inside this card should be deleted

删除后，把 K 线主图 SVG 的 `viewBox` 横向扩展，占满 `flex-1`，三层结构变为：
After deletion, stretch the SVG `viewBox` of the main candlestick chart horizontally to occupy full `flex-1` space. The final three-layer structure becomes:
- 顶部 KPI 条（高 48px）— 保留
  - Top KPI bar (height: 48px) — Kept
- 中部 K 线主图（高 280px）— 拉满宽度
  - Middle Candlestick main chart (height: 280px) — Stretched to full-width
- 底部企业 breach chip 滚动条（高 92px）— 保留
  - Bottom corporate breach chip marquee (height: 92px) — Kept

---

## 顶部页面标题 / Top Page Header
保留现有页面顶部 H1（"部长决策大屏" 等），不改。
Keep the existing page top H1 ("Ministerial Decision Dashboard", etc.) unchanged.

---

## 多语言 / Localization & Multi-language
通过 t() 走 LanguageContext.tsx，新增映射：
Configure the translation via t() utilizing `LanguageContext.tsx`, and add the following mappings:
- 'National Strategic Energy Export × Monthly GDP Elasticity Coupling' → '国家战略能源出口与月度 GDP 弹性指数联动'

---

## 禁止事项 / Restricted Actions
- ❌ 不要动其它幕的页面
  - ❌ Do not touch pages in any other sections or tabs
- ❌ 不要删 LeftMenu / App.tsx 路由
  - ❌ Do not delete LeftMenu or routes in App.tsx
- ❌ 不要把 6 张卡片改成 3 列或 1 列布局
  - ❌ Do not change the 6 cards layout into a 3-column or 1-column layout
- ❌ 不要在 BollingerBand 卡片内保留任何新闻 / News 字样
  - ❌ Do not keep any reference to "News" or "新闻" within the BollingerBand card
- ❌ 卡片高度严格 460px，不要自适应（保证两两并排时视觉对齐）
  - ❌ Keep card height strictly at 460px with no auto-scaling (ensuring visual alignment in side-by-side view)
