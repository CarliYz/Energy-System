// src/data/consumption_topology.ts

export interface TopoNode {
  id: string;
  layer: 1 | 2 | 3 | 4;
  label: string;
  label_zh: string;
  metricLabel: string;
  metricLabel_zh: string;
  metricVal: string;
  percent?: number;
  secondaryInfo?: string;
  secondaryInfo_zh?: string;
}

export interface TopoLink {
  source: string;
  target: string;
  colorType: 'gray' | 'blue' | 'red';
  width: number;
}

export const topoData = {
  gdpTarget: 5.5,
  selfSufficiency: '92.4%',
  supplyDemand: '1,847 / 1,793 ktoe',
  gap7Days: '-3.2%',
  pendingCases: '4 cases',
  nodes: [
    // L1: Resources (Left)
    {
      id: 'res_tengiz', layer: 1,
      label: 'Tengiz Oilfield', label_zh: 'Tengiz 油田',
      metricLabel: 'Remaining Years', metricLabel_zh: '剩余开采年限', metricVal: '17.4y',
      percent: 68,
      secondaryInfo: 'Daily output: 562 kbpd', secondaryInfo_zh: '日产吞吐: 562 kbpd'
    },
    {
      id: 'res_kashagan', layer: 1,
      label: 'Kashagan Oilfield', label_zh: 'Kashagan 油田',
      metricLabel: 'Remaining Years', metricLabel_zh: '剩余开采年限', metricVal: '23.1y',
      percent: 45,
      secondaryInfo: 'Daily output: 384 kbpd', secondaryInfo_zh: '日产吞吐: 384 kbpd'
    },
    {
      id: 'res_karachaganak', layer: 1,
      label: 'Karachaganak Field', label_zh: 'Karachaganak 气田',
      metricLabel: 'Remaining Years', metricLabel_zh: '剩余开采年限', metricVal: '18.6y',
      percent: 54,
      secondaryInfo: 'Daily output: 1.42 bcfd', secondaryInfo_zh: '日产吞吐: 1.42 bcfd'
    },
    {
      id: 'res_coal_eki', layer: 1,
      label: 'Ekibastuz Coal', label_zh: '巴斯图兹煤矿',
      metricLabel: 'Remaining Years', metricLabel_zh: '剩余开采年限', metricVal: '32.0y',
      percent: 28,
      secondaryInfo: 'Daily capacity: 4.2 GW', secondaryInfo_zh: '设计出力: 4.2 GW'
    },
    {
      id: 'res_solar_saran', layer: 1,
      label: 'Saran Solar PV', label_zh: 'Saran 太阳能基地',
      metricLabel: 'Asset Lifetime', metricLabel_zh: '光伏资产寿命', metricVal: '18.0y',
      percent: 15,
      secondaryInfo: 'Daily output: 0.6 GW', secondaryInfo_zh: '日照容量: 0.6 GW'
    },
    {
      id: 'res_wind_zhana', layer: 1,
      label: 'Zhanatas Wind Power', label_zh: 'Zhanatas 风电场',
      metricLabel: 'Generator Lifetime', metricLabel_zh: '风机资产寿命', metricVal: '22.0y',
      percent: 20,
      secondaryInfo: 'Daily active: 0.4 GW', secondaryInfo_zh: '装机出力: 0.4 GW'
    },

    // L2: Computational/Intermediate
    {
      id: 'comp_refine', layer: 2,
      label: 'Petrochem Refinery Balance', label_zh: '油气炼化供需平衡',
      metricLabel: 'Process Efficacy', metricLabel_zh: '综合炼化负荷率', metricVal: '87.4%',
      secondaryInfo: 'Process limit: 280k bpd', secondaryInfo_zh: '精炼极限: 280k bpd'
    },
    {
      id: 'comp_gas', layer: 2,
      label: 'Regional Gas Dispatching', label_zh: '天然气管网区域调度',
      metricLabel: 'Throughput Load', metricLabel_zh: '日调度气吞吐量', metricVal: '1.31 bcfd',
      secondaryInfo: 'No leaks verified', secondaryInfo_zh: '未检测到泄漏报警'
    },
    {
      id: 'comp_grid', layer: 2,
      label: 'KEGOC National Grid', label_zh: '国家输配电网联合联调',
      metricLabel: 'Frequency Shift', metricLabel_zh: '交流赫兹频率偏差', metricVal: '±0.04 Hz',
      secondaryInfo: 'Dynamic active shunt', secondaryInfo_zh: '动态负荷补偿器激活'
    },
    {
      id: 'comp_heating', layer: 2,
      label: 'District Thermal Dispatch', label_zh: '区域热电集中供暖管网',
      metricLabel: 'Coverage Ratio', metricLabel_zh: '采暖网综合覆盖率', metricVal: '93.2%',
      secondaryInfo: 'Mean loss: 4.2%', secondaryInfo_zh: '平均热阻散失: 4.2%'
    },
    {
      id: 'comp_token', layer: 2,
      label: 'Tokenized Heavy Load Layer', label_zh: '算力与特耗Token经济转换',
      metricLabel: 'Conversion Price', metricLabel_zh: '电能→算力结算价格', metricVal: '$0.038/kWh',
      secondaryInfo: 'Load arbitrage: Active', secondaryInfo_zh: '智能体套利套利链激活'
    },
    {
      id: 'comp_export', layer: 2,
      label: 'Export Quota Pool', label_zh: '外贸配额池与出境关税额',
      metricLabel: 'Pool Usage', metricLabel_zh: '海关长协配额已用', metricVal: '94.1%',
      secondaryInfo: 'Under watch limits', secondaryInfo_zh: '高位限额安全排查'
    },

    // L3: Demand side
    {
      id: 'dem_oil', layer: 3,
      label: 'Civilian Vehicle Fuel Base', label_zh: '民用车用燃油基线',
      metricLabel: 'Baseline / Actual', metricLabel_zh: '基线流量 / 实际消耗', metricVal: '412 / 438',
      secondaryInfo: 'Deviation: +6.3%', secondaryInfo_zh: '较基线越限: +6.3%'
    },
    {
      id: 'dem_gas_resident', layer: 3,
      label: 'Residency Natural Gas', label_zh: '城镇居民炊用管线气',
      metricLabel: 'Baseline / Actual', metricLabel_zh: '基线流量 / 实际消耗', metricVal: '318 / 305',
      secondaryInfo: 'Deviation: -4.1%', secondaryInfo_zh: '较基线变化: -4.1%'
    },
    {
      id: 'dem_gas_ind', layer: 3,
      label: 'Industrial Pipe Supply', label_zh: '工业动力及炼重高炉气',
      metricLabel: 'Baseline / Actual', metricLabel_zh: '基线流量 / 实际消耗', metricVal: '644 / 681',
      secondaryInfo: 'Deviation: +5.7%', secondaryInfo_zh: '较基线偏离: +5.7%'
    },
    {
      id: 'dem_heating', layer: 3,
      label: 'Urban Thermal Network', label_zh: '区域采暖及辅助热补偿',
      metricLabel: 'Baseline / Actual', metricLabel_zh: '基线负荷 / 实际容量', metricVal: '0.18 / 0.22 GW',
      secondaryInfo: 'Deviation: +22.2%', secondaryInfo_zh: '季后供暖偏离值: +22.2%'
    },
    {
      id: 'dem_datacenter', layer: 3,
      label: 'AI Compute & Token Load', label_zh: 'AI 算力中心与高密能耗',
      metricLabel: 'Baseline / Actual', metricLabel_zh: '基线负载 / 实际电力', metricVal: '0.21 / 0.34 GW',
      secondaryInfo: 'Deviation: +61.9%', secondaryInfo_zh: '算力超温偏离: +61.9%'
    },
    {
      id: 'dem_export', layer: 3,
      label: 'Export Custody Delivery', label_zh: '出口长协口岸交付履约',
      metricLabel: 'Baseline / Actual', metricLabel_zh: '基线履约 / 实际交接', metricVal: '1.05 / 0.98 mb/d',
      secondaryInfo: 'Deviation: -6.7%', secondaryInfo_zh: '口岸实物短缺偏差: -6.7%'
    },

    // L4: Risk Warning Layer (RED Large Circle)
    {
      id: 'risk_main', layer: 4,
      label: 'Imbalance & Utility Price Risk', label_zh: '公用事业供需失衡与溢价风险',
      metricLabel: 'Attribution Verdict', metricLabel_zh: '智能体综合定性结论', metricVal: 'HIGH BREACH RISK',
      secondaryInfo: 'Outcry Probability: 73%', secondaryInfo_zh: '舆情恐慌上升概率: 73%'
    }
  ] as TopoNode[],
  
  links: [
    // L1 -> L2
    { source: 'res_tengiz', target: 'comp_refine', colorType: 'gray', width: 4 },
    { source: 'res_kashagan', target: 'comp_refine', colorType: 'gray', width: 3 },
    { source: 'res_karachaganak', target: 'comp_gas', colorType: 'gray', width: 4 },
    { source: 'res_coal_eki', target: 'comp_grid', colorType: 'gray', width: 5 },
    { source: 'res_solar_saran', target: 'comp_grid', colorType: 'gray', width: 2 },
    { source: 'res_wind_zhana', target: 'comp_grid', colorType: 'gray', width: 1.5 },

    { source: 'res_tengiz', target: 'comp_export', colorType: 'gray', width: 2 },
    { source: 'res_karachaganak', target: 'comp_export', colorType: 'gray', width: 3 },

    // L2 -> L3
    { source: 'comp_refine', target: 'dem_oil', colorType: 'blue', width: 4 },
    { source: 'comp_gas', target: 'dem_gas_resident', colorType: 'blue', width: 2 },
    { source: 'comp_gas', target: 'dem_gas_ind', colorType: 'blue', width: 3.5 },
    { source: 'comp_grid', target: 'dem_datacenter', colorType: 'blue', width: 5 },
    { source: 'comp_heating', target: 'dem_heating', colorType: 'blue', width: 2.5 },
    { source: 'comp_token', target: 'dem_datacenter', colorType: 'blue', width: 2 },
    { source: 'comp_export', target: 'dem_export', colorType: 'blue', width: 3 },

    // L3 -> L4
    { source: 'dem_oil', target: 'risk_main', colorType: 'red', width: 3 },
    { source: 'dem_gas_resident', target: 'risk_main', colorType: 'red', width: 1.5 },
    { source: 'dem_gas_ind', target: 'risk_main', colorType: 'red', width: 2.5 },
    { source: 'dem_heating', target: 'risk_main', colorType: 'red', width: 2 },
    { source: 'dem_datacenter', target: 'risk_main', colorType: 'red', width: 5 },
    { source: 'dem_export', target: 'risk_main', colorType: 'red', width: 2 }
  ] as TopoLink[],

  insight: {
    en: 'Based on multi-layer simulation model on 2026-05-28 06:00, national energy capacity analysis suggests: Tengiz oilfield remaining life is under 17.4 years, moving it into strategic reserve planning horizon. Concurrently, AI data centers & workloads have spiked +61.9% over national consumer base, mostly due to newly commissioned clusters in Almaty and Aktau. Future 7-day total net supply-demand shortfall is projected at -3.2%, creating a high probability risk of local electricity/heating price tariff escalations, potentially provoking widespread public unrest and sentiment fallout.',
    zh: '2026年5月28日 06:00 全国能源网络全景穿透显示：上游 Tengiz 主力油田累计已开采储量过高，剩余寿限降至 17.4 年，触碰战略防御储备红线；下游民用车用油和算力芯片高耗能（AI 算力与 Token 负载）较今日标准用电基度激增 61.9%，导致本地变压配电系统处于极限重载状态。未来 7 天全国边际能量差值偏置量预计达 -3.2%，极大概率迫使局部公用事业用汽与电价大幅溢开，若无平抑策略，可能引发高度关联的地方舆情恐慌和自发性抗议骚乱事件。'
  }
};
