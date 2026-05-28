# AI STUDIO PROMPT · V6-03 · 部长大屏 ④ 舆情卡片 — 贴文移右 + 紧凑排版
# AI STUDIO PROMPT · V6-03 · Ministerial Dashboard Card ④ Sentiment Card — Relocate Posting Left-to-Right + Compact Layout

## 任务 / Task
仅修改 `src/pages/MinisterDashboard.tsx` 中的 ④ 舆情卡片（即第二行右列「社会舆情·网络涉能耗舆论预警信号」），不动其它任何卡片。

Only modify the ④ Sentiment Card (which is in the second row, right column, named "Social Sentiment & Public Opinion Risk Warning") in `src/pages/MinisterDashboard.tsx`. Leave all other cards untouched.

---

## 当前问题 / Current Issues
- 左侧的"阿拉木图公用事业费猛增"贴文卡占比过大
- 右侧大片留白
- 原文 + 翻译两栏上下间距过松
- 整体节奏不紧凑

- The "Almaty public utility bill spike" posting card on the left is taking too much horizontal space.
- Excessive empty white space on the right of the card.
- High margin/padding between original text and translated sections.
- Overall content density is loose and lacks modern design compactness.

---

## 改造目标 / Redesign Goals
把贴文卡从左移到右，原文 + 翻译合并为紧凑上下结构，左侧空间释放给主桑基/事件流主视觉。

Move the posting card from left to right. Fold the original text and Chinese translation into a dense top-down vertical structure. Free up the left section space entirely for the main Sankey / Event flow visualization.

---

## 新版卡片内部 layout / New Card Internal Layout

```
┌────────────────────────────────────────────────────────────┐
│ 社会舆情·网络涉能耗舆论预警信号             [v1.4 视图版 ↗]│ ← 标题栏 h-10 / Header h-10
├────────────────────────────────────────────────────────────┤
│                                          │ ┌──────────────┐│
│                                          │ │ 阿拉木图     ││ ← 贴文卡 (右) / Post Card (Right)
│ 左 60% 主视觉                            │ │ 公用事业费   ││   紧凑版 / Compact Version
│ (桑基扩线 / 6 子图 tab 容器)             │ │ 猛增 35%     ││
│ Left 60% Main Visual Area                │ │ ────────────ⵏ│
│ (Sankey Expansion / 6 Tabs Container)    │ │ Цены на ЖКХ ││
│                                          │ │ 翻译: 公共   ││
│                                          │ │ 事业费在 ... ││
│                                          │ │ ━━━━━━━━━ⵏ│
│                                          │ │ 12.4K 转发   ││
│                                          │ │ 严重度 ●●●●○ ││
│                                          │ └──────────────┘│
│                                          │                 │
│                                          │ [展开全部 ↓]    │
└────────────────────────────────────────────────────────────┘
```

---

## 实现要点 / Implementation Details

### 1. 容器改成 flex 60/40 / Change Container to flex 60/40
```tsx
<section className="... h-[460px]">
  <header className="h-10 flex items-center justify-between">
    <h3>社会舆情·网络涉能耗舆论预警信号</h3>
    <span className="text-[10px] text-text-tertiary">v1.4 视图版 ↗</span>
  </header>
  <div className="flex gap-4 mt-3" style={{ height: 'calc(100% - 48px)' }}>
    <div className="flex-[3] min-w-0"><SentimentMainArea /></div>
    <div className="flex-[2] min-w-0"><CompactPostCard /></div>
  </div>
</section>
```

### 2. CompactPostCard（贴文卡紧凑版） / CompactPostCard (Compact Posting Card)
```tsx
<article className="h-full flex flex-col border border-border-default rounded-[4px] p-3 overflow-hidden">
  {/* 严重度色条 */}
  <div className="h-1 w-full bg-[#D8454C] rounded-full mb-2" />

  {/* 标题（中英合并、压缩间距） */}
  <h4 className="text-[13px] font-bold leading-tight mb-1">
    阿拉木图公用事业费猛增 35%
  </h4>
  <p className="text-[10px] text-text-tertiary mb-2">
    Almaty utility bill spike +35% · Telegram · 6h ago
  </p>

  {/* 原文 + 翻译 上下紧凑 */}
  <div className="border-t border-border-default pt-2 mb-2">
    <p className="text-[11px] text-text-secondary leading-snug mb-1">
      Цены на ЖКХ в Алматы выросли на 35% за один месяц. Это удар по семейному бюджету ...
    </p>
    <p className="text-[11px] text-text-primary leading-snug border-l-2 border-border-default pl-2">
      译：阿拉木图公共事业费单月上涨 35%，对家庭预算形成冲击 ...
    </p>
  </div>

  {/* 互动数据条 / Interactions Bar */}
  <div className="grid grid-cols-3 gap-2 mb-2 text-[10px]">
    <div><span className="font-bold text-[12px] tabular-nums">12.4K</span><br/><span className="text-text-tertiary">转发 / Reposts</span></div>
    <div><span className="font-bold text-[12px] tabular-nums">8.7K</span><br/><span className="text-text-tertiary">评论 / Comments</span></div>
    <div><span className="font-bold text-[12px] tabular-nums">62%</span><br/><span className="text-text-tertiary">负向 / Negative</span></div>
  </div>

  {/* 严重度评级 / Severity rating */}
  <div className="text-[10px] text-text-tertiary mb-2">
    严重度 / Severity <span className="text-[#D8454C] tracking-widest">●●●●○</span>
  </div>

  {/* 底部展开按钮（推到底部） / Read more button aligned to the bottom */}
  <button className="mt-auto text-[11px] text-[#555] hover:text-text-primary border border-border-default rounded-[2px] py-1.5">
    展开全部 4 条相关贴文 ↓ / Expand All 4 Related Posts ↓
  </button>
</article>
```

### 3. SentimentMainArea（左侧主区） / SentimentMainArea (Left-hand Main Area)
- **结构占位**：内部由 `<SentimentSixChartsTabs />` 渲染（见 V6-04 完整实现）
- 顶部 6 个 tab 切换（声量/情感/词云/参与/平台/传播）
- 主视觉区高度自动撑满
- 默认显示 tab 1（声量 30 天）

- **Structure Placeholder**: Rendered internally by `<SentimentSixChartsTabs />` (detailed in the V6-04 spec).
- Top 6 tabs for switching (Volume, Sentiment, Keywords, Audience, Platform, Spread).
- Main visual area expands vertically to take full remaining height.
- Default view is Tab 1 (Volume 30d).

---

## 禁止事项 / Restricted Actions
- ❌ 不要再把贴文卡保留在左侧 / Do not keep the posting card on the left side
- ❌ 不要改 ④ 之外的任何卡片 / Do not edit any card other than Card ④
- ❌ 不要让贴文卡溢出 460px 高度 / Do not allow the posting card to overflow the 460px height boundary
- ❌ 原文+翻译不要左右并排，必须上下 / Do not display original text and translation side-by-side; they must stack vertically
- ❌ 不要给贴文卡加阴影或圆角 > 4px / Do not add shadows or border-radii greater than 4px to the posting card
