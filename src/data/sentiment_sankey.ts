// src/data/sentiment_sankey.ts

export type SankeyColor = 'green' | 'yellow' | 'red';

export interface SankeyNode {
  id: string;
  col: 1 | 2 | 3 | 4;
  label: string;
  label_zh: string;
  color: SankeyColor;
  volume: number;
  isMain?: boolean;
}

export interface SankeyLink {
  source: string;
  target: string;
  value: number;
}

export const sankeyData: { nodes: SankeyNode[]; links: SankeyLink[] } = {
  nodes: [
    // Column 1 (sources, 5 items)
    { id: 'src_fb', col: 1, label: 'Facebook', label_zh: 'Facebook 社群', color: 'green', volume: 12000 },
    { id: 'src_tg', col: 1, label: 'Telegram', label_zh: 'Telegram 热门频道', color: 'green', volume: 8500 },
    { id: 'src_yt', col: 1, label: 'YouTube', label_zh: 'YouTube 特专点评', color: 'yellow', volume: 22000 },
    { id: 'src_tt', col: 1, label: 'TikTok', label_zh: 'TikTok 街拍快评', color: 'yellow', volume: 31000 },
    { id: 'src_news', col: 1, label: 'News Sites', label_zh: '地方主流媒介', color: 'green', volume: 6000 },

    // Column 2 (clusters, 4 items)
    { id: 'cl_price', col: 2, label: '价格涨跌', label_zh: '能效价格调涨', color: 'yellow', volume: 28000 },
    { id: 'cl_outage', col: 2, label: '停电停气', label_zh: '高频断热限能', color: 'red', volume: 21000 },
    { id: 'cl_safety', col: 2, label: '安全事故', label_zh: '设施泄漏隐患', color: 'red', volume: 19000 },
    { id: 'cl_policy', col: 2, label: '政策舆论', label_zh: '减排碳税政策', color: 'green', volume: 11500 },

    // Column 3 (themes, 3 items)
    { id: 'th_protest', col: 3, label: '抗议苗头', label_zh: '地方散发聚拢抗议风险', color: 'red', volume: 38000 },
    { id: 'th_livelihood', col: 3, label: '民生焦虑', label_zh: '冬季居民用能负荷焦虑', color: 'yellow', volume: 26000 },
    { id: 'th_intl', col: 3, label: '国际关注', label_zh: '里海输欧替代管线关注', color: 'green', volume: 15500 },

    // Column 4 (crisis, 1 item, RED, largest)
    { id: 'crisis_main', col: 4, label: 'Almaty Utility Price Spike Riot Signs', label_zh: '阿拉木图燃气涨价骚乱苗头', color: 'red', volume: 79500, isMain: true }
  ],
  links: [
    // Column 1 to Column 2
    { source: 'src_fb', target: 'cl_price', value: 4500 },
    { source: 'src_fb', target: 'cl_outage', value: 3500 },
    { source: 'src_fb', target: 'cl_safety', value: 2000 },
    { source: 'src_fb', target: 'cl_policy', value: 2000 },

    { source: 'src_tg', target: 'cl_price', value: 3000 },
    { source: 'src_tg', target: 'cl_outage', value: 2500 },
    { source: 'src_tg', target: 'cl_safety', value: 2000 },
    { source: 'src_tg', target: 'cl_policy', value: 1000 },

    { source: 'src_yt', target: 'cl_price', value: 8000 },
    { source: 'src_yt', target: 'cl_outage', value: 6000 },
    { source: 'src_yt', target: 'cl_safety', value: 5000 },
    { source: 'src_yt', target: 'cl_policy', value: 3000 },

    { source: 'src_tt', target: 'cl_price', value: 10000 },
    { source: 'src_tt', target: 'cl_outage', value: 8000 },
    { source: 'src_tt', target: 'cl_safety', value: 9000 },
    { source: 'src_tt', target: 'cl_policy', value: 4000 },

    { source: 'src_news', target: 'cl_price', value: 2500 },
    { source: 'src_news', target: 'cl_outage', value: 1000 },
    { source: 'src_news', target: 'cl_safety', value: 1000 },
    { source: 'src_news', target: 'cl_policy', value: 1500 },

    // Column 2 to Column 3
    { source: 'cl_price', target: 'th_protest', value: 15000 },
    { source: 'cl_price', target: 'th_livelihood', value: 10000 },
    { source: 'cl_price', target: 'th_intl', value: 3000 },

    { source: 'cl_outage', target: 'th_protest', value: 10000 },
    { source: 'cl_outage', target: 'th_livelihood', value: 9000 },
    { source: 'cl_outage', target: 'th_intl', value: 2000 },

    { source: 'cl_safety', target: 'th_protest', value: 11000 },
    { source: 'cl_safety', target: 'th_livelihood', value: 5000 },
    { source: 'cl_safety', target: 'th_intl', value: 3000 },

    { source: 'cl_policy', target: 'th_protest', value: 2000 },
    { source: 'cl_policy', target: 'th_livelihood', value: 2000 },
    { source: 'cl_policy', target: 'th_intl', value: 7500 },

    // Column 3 to Column 4
    { source: 'th_protest', target: 'crisis_main', value: 38000 },
    { source: 'th_livelihood', target: 'crisis_main', value: 26000 },
    { source: 'th_intl', target: 'crisis_main', value: 15500 }
  ]
};
