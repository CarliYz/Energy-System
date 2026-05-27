// ============================================================================
// COMMERCIAL KNOWLEDGE BASE · 商业知识库
// 努尔评审定义的 9 大维度：工商/股权/业务/关联/财税/事件/处罚/运营/评分
// ============================================================================

export type EnterpriseTier = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'NORMAL';
export type FlagColor = 'RED' | 'AMBER' | 'GREEN';

export interface CommercialRecord {
  id: string;
  short_code: string;
  legal_name_en: string;
  legal_name_zh: string;
  tier: EnterpriseTier;
  flag: FlagColor;
  score: number;
  biz_profile: {
    legal_form: string;
    bin: string;
    registered_capital: string;
    incorporation_date: string;
    registered_address: string;
    operating_address: string;
    coords: [number, number];
    industry_code: string;
    employee_count: number;
    website?: string;
    contact_phone: string;
    legal_rep_en: string;
    legal_rep_zh: string;
  };
  shareholding: Array<{
    holder_en: string; holder_zh: string; ratio: number;
    ubo: boolean; nationality: string; note?: string;
  }>;
  business_scope: {
    licensed_products: string[];
    actual_outputs: Array<{ item: string; nameplate: string; actual_2025: string; deviation_pct: number }>;
    primary_buyers: string[];
    export_share_pct: number;
  };
  affiliates: Array<{
    name_en: string; name_zh: string; relation: string; risk_color: FlagColor;
  }>;
  tax_invoice: {
    annual_tax_kzt: string; vat_compliance_pct: number;
    invoice_anomaly_count_12m: number; transfer_pricing_flag: boolean;
    last_audit_date: string;
  };
  major_events: Array<{
    date: string;
    kind: 'PERMIT' | 'INCIDENT' | 'MERGER' | 'CAPEX' | 'EXPORT' | 'COMPLAINT';
    title_en: string; title_zh: string; severity: FlagColor;
  }>;
  penalties: Array<{
    case_id: string; date: string; issuing_body: string; amount_kzt: string;
    reason_en: string; reason_zh: string;
    status: 'OPEN' | 'CLOSED' | 'APPEALED';
  }>;
  realtime_ops: {
    today_throughput: string; nameplate_capacity: string;
    utilisation_pct: number; scada_lag_min: number;
    last_seen_utc: string; co2_intensity: string; power_draw_mw: number;
  };
  reg_scorecard: {
    approval_score: number; reporting_score: number; inspection_score: number;
    sanction_score: number; rectification_score: number; review_score: number;
    overall_rank_in_1247: number; color: FlagColor;
  };
}

export const COMMERCIAL_DB: CommercialRecord[] = [
  {
    id: 'ENT-KZ-AKT-0091', short_code: 'ENT-KZ-AKT-0091',
    legal_name_en: 'Western Caspian Energy LLC', legal_name_zh: '西里海能源有限责任公司',
    tier: 'CRITICAL', flag: 'RED', score: 32,
    biz_profile: {
      legal_form: 'LLC (TOO)', bin: '050240005182', registered_capital: '14.6 BN KZT',
      incorporation_date: '2004-03-18',
      registered_address: 'Mangystau Oblast, Aktau, 17 Microdistrict, Bldg 21',
      operating_address: 'Aktau Industrial Zone, Plot 8B, Petrol Refinery / Upstream Compressor Station GCS-001',
      coords: [43.6532, 51.2156], industry_code: 'OKED 19.20.1 / Petroleum Refining',
      employee_count: 1842, website: 'wce.kz', contact_phone: '+7 7292 50-12-00',
      legal_rep_en: 'Marat Z. Suleimenov', legal_rep_zh: '马拉特·苏列依梅诺夫',
    },
    shareholding: [
      { holder_en: 'Caspian Holding BV (Netherlands)', holder_zh: '里海控股 (荷兰)', ratio: 0.42, ubo: false, nationality: 'NL' },
      { holder_en: 'KazPetrol Trust JSC', holder_zh: '哈萨克石油信托股份公司', ratio: 0.35, ubo: false, nationality: 'KZ' },
      { holder_en: 'A. Berdibekov (UBO)', holder_zh: '别尔季别科夫 (最终受益人)', ratio: 0.18, ubo: true, nationality: 'KZ', note: '通过 3 家壳公司间接持有' },
      { holder_en: 'Public Float', holder_zh: '公众流通', ratio: 0.05, ubo: false, nationality: '—' },
    ],
    business_scope: {
      licensed_products: ['Crude oil refining', 'Natural gas compression', 'LPG bottling', 'Pipeline transport'],
      actual_outputs: [
        { item: 'Refined products', nameplate: '4.8 Mt/y', actual_2025: '5.62 Mt/y', deviation_pct: 17.1 },
        { item: 'Gas throughput',  nameplate: '12.4 MMcm/d', actual_2025: '17.4 MMcm/d', deviation_pct: 40.4 },
        { item: 'LPG', nameplate: '0.42 Mt/y', actual_2025: '0.45 Mt/y', deviation_pct: 7.1 },
      ],
      primary_buyers: ['KazTransGas', 'Gazprom Export', 'Sinopec Lubricants', 'Almaty City Heat'],
      export_share_pct: 64,
    },
    affiliates: [
      { name_en: 'Caspian Holding BV', name_zh: '里海控股(荷兰)', relation: 'PARENT', risk_color: 'AMBER' },
      { name_en: 'Atyrau Petro-Logistics LLC', name_zh: '阿特劳石油物流', relation: 'SUBSIDIARY', risk_color: 'AMBER' },
      { name_en: 'Mangystau Gas Trading LLC', name_zh: '曼吉斯套燃气贸易', relation: 'JV', risk_color: 'RED' },
      { name_en: 'TENGE Bank JSC', name_zh: '坚戈银行', relation: 'SUPPLIER', risk_color: 'GREEN' },
    ],
    tax_invoice: {
      annual_tax_kzt: '8.7 BN KZT', vat_compliance_pct: 71,
      invoice_anomaly_count_12m: 27, transfer_pricing_flag: true,
      last_audit_date: '2025-11-04',
    },
    major_events: [
      { date: '2025-08-12', kind: 'INCIDENT', title_en: 'SCADA sensor drift detected on GCS-001', title_zh: 'GCS-001 SCADA 传感器漂移', severity: 'AMBER' },
      { date: '2026-02-18', kind: 'COMPLAINT', title_en: 'VAT invoice mismatch flagged', title_zh: '增值税发票异常被预警', severity: 'RED' },
      { date: '2026-04-22', kind: 'INCIDENT', title_en: 'Capacity limit breach +40.4%', title_zh: '产能超限 +40.4%', severity: 'RED' },
      { date: '2026-05-28', kind: 'PERMIT', title_en: 'CASE-2026-001 attribution case opened', title_zh: '稽查案 CASE-2026-001 立案', severity: 'RED' },
    ],
    penalties: [
      { case_id: 'PEN-2024-1106', date: '2024-11-06', issuing_body: 'Ministry of Energy Inspectorate', amount_kzt: '420 M', reason_en: 'Late environmental disclosure', reason_zh: '环保数据迟报', status: 'CLOSED' },
      { case_id: 'PEN-2025-0317', date: '2025-03-17', issuing_body: 'Tax Committee', amount_kzt: '1.1 BN', reason_en: 'Underreported VAT', reason_zh: '增值税少报', status: 'APPEALED' },
      { case_id: 'CASE-2026-001', date: '2026-05-28', issuing_body: 'Ministry of Energy', amount_kzt: '1.24 BN (provisional)', reason_en: 'Unreported capacity expansion', reason_zh: '瞒报产能扩张', status: 'OPEN' },
    ],
    realtime_ops: {
      today_throughput: '17.4 MMcm', nameplate_capacity: '12.4 MMcm/d',
      utilisation_pct: 140, scada_lag_min: 15,
      last_seen_utc: '2026-05-28 14:32 UTC',
      co2_intensity: '0.81 tCO₂/MWh', power_draw_mw: 38.2,
    },
    reg_scorecard: {
      approval_score: 42, reporting_score: 28, inspection_score: 35,
      sanction_score: 18, rectification_score: 51, review_score: 40,
      overall_rank_in_1247: 1231, color: 'RED',
    },
  },
  {
    id: 'ENT-KZ-ATY-0142', short_code: 'ENT-KZ-ATY-0142',
    legal_name_en: 'Atyrau Petro-Logistics LLC', legal_name_zh: '阿特劳石油物流有限责任公司',
    tier: 'HIGH', flag: 'AMBER', score: 58,
    biz_profile: {
      legal_form: 'LLC (TOO)', bin: '060840002317', registered_capital: '5.4 BN KZT',
      incorporation_date: '2008-09-22', registered_address: 'Atyrau, Satpayev St 23',
      operating_address: 'Atyrau Port Terminal 4', coords: [47.0945, 51.9238],
      industry_code: 'OKED 49.50.2 / Pipeline transport', employee_count: 612,
      contact_phone: '+7 7122 30-44-21',
      legal_rep_en: 'Bauyrzhan T. Nurpeisov', legal_rep_zh: '巴乌尔詹·努尔佩索夫',
    },
    shareholding: [
      { holder_en: 'Western Caspian Energy LLC', holder_zh: '西里海能源', ratio: 0.51, ubo: false, nationality: 'KZ' },
      { holder_en: 'Public Float', holder_zh: '公众流通', ratio: 0.49, ubo: false, nationality: '—' },
    ],
    business_scope: {
      licensed_products: ['Pipeline operations', 'Crude storage', 'Marine loading'],
      actual_outputs: [{ item: 'Throughput', nameplate: '8 Mt/y', actual_2025: '8.4 Mt/y', deviation_pct: 5.0 }],
      primary_buyers: ['Tengizchevroil', 'CNPC Aktobe'], export_share_pct: 78,
    },
    affiliates: [
      { name_en: 'Western Caspian Energy LLC', name_zh: '西里海能源', relation: 'PARENT', risk_color: 'RED' },
      { name_en: 'KazMunayGas Trade JSC', name_zh: 'KMG 贸易', relation: 'BUYER', risk_color: 'GREEN' },
    ],
    tax_invoice: { annual_tax_kzt: '2.1 BN', vat_compliance_pct: 86, invoice_anomaly_count_12m: 4, transfer_pricing_flag: false, last_audit_date: '2025-09-12' },
    major_events: [{ date: '2025-12-04', kind: 'INCIDENT', title_en: 'Pipe rupture km-217', title_zh: '管线 217 公里破裂', severity: 'AMBER' }],
    penalties: [{ case_id: 'PEN-2024-0918', date: '2024-09-18', issuing_body: 'Env Committee', amount_kzt: '95 M', reason_en: 'Oil spill 17m³', reason_zh: '原油泄漏 17 立方', status: 'CLOSED' }],
    realtime_ops: { today_throughput: '23.1 kt', nameplate_capacity: '22 kt/d', utilisation_pct: 105, scada_lag_min: 3, last_seen_utc: '2026-05-28 14:30 UTC', co2_intensity: '0.18 tCO₂/MWh', power_draw_mw: 12.4 },
    reg_scorecard: { approval_score: 71, reporting_score: 64, inspection_score: 58, sanction_score: 62, rectification_score: 55, review_score: 60, overall_rank_in_1247: 712, color: 'AMBER' },
  },
  {
    id: 'ENT-KZ-MNG-0207', short_code: 'ENT-KZ-MNG-0207',
    legal_name_en: 'Mangystau Gas Trading LLC', legal_name_zh: '曼吉斯套燃气贸易有限责任公司',
    tier: 'CRITICAL', flag: 'RED', score: 38,
    biz_profile: {
      legal_form: 'LLC (TOO)', bin: '110540009823', registered_capital: '2.8 BN KZT',
      incorporation_date: '2011-05-14', registered_address: 'Aktau, 1 Mkr, Bldg 4',
      operating_address: 'Aktau Free Economic Zone, Office 7', coords: [43.6356, 51.1672],
      industry_code: 'OKED 46.71.2 / Gas wholesale', employee_count: 88,
      contact_phone: '+7 7292 78-90-15',
      legal_rep_en: 'D. Berdibekov', legal_rep_zh: '别尔季别科夫·达',
    },
    shareholding: [
      { holder_en: 'Western Caspian Energy LLC', holder_zh: '西里海能源', ratio: 0.50, ubo: false, nationality: 'KZ' },
      { holder_en: 'Cyprus Trade Trust', holder_zh: '塞浦路斯信托', ratio: 0.50, ubo: false, nationality: 'CY', note: '受益人未披露' },
    ],
    business_scope: {
      licensed_products: ['Wholesale gas trade', 'Export brokerage'],
      actual_outputs: [{ item: 'Gas resold', nameplate: '3.5 MMcm/d', actual_2025: '5.1 MMcm/d', deviation_pct: 45.7 }],
      primary_buyers: ['Gazprom Export', 'Sinopec Lubricants'], export_share_pct: 92,
    },
    affiliates: [
      { name_en: 'Western Caspian Energy LLC', name_zh: '西里海能源', relation: 'PARENT', risk_color: 'RED' },
      { name_en: 'Cyprus Trade Trust', name_zh: '塞浦路斯信托', relation: 'PARENT', risk_color: 'RED' },
    ],
    tax_invoice: { annual_tax_kzt: '180 M', vat_compliance_pct: 52, invoice_anomaly_count_12m: 19, transfer_pricing_flag: true, last_audit_date: '2025-06-30' },
    major_events: [
      { date: '2025-11-22', kind: 'COMPLAINT', title_en: 'KYC red flag · UBO unclear', title_zh: 'KYC 红旗 · 最终受益人不明', severity: 'RED' },
      { date: '2026-03-05', kind: 'EXPORT', title_en: 'Suspicious export route via 3rd country', title_zh: '可疑第三国转口路径', severity: 'RED' },
    ],
    penalties: [{ case_id: 'PEN-2025-0822', date: '2025-08-22', issuing_body: 'Financial Monitoring', amount_kzt: '320 M', reason_en: 'AML breach', reason_zh: '反洗钱违规', status: 'APPEALED' }],
    realtime_ops: { today_throughput: '5.1 MMcm', nameplate_capacity: '3.5 MMcm/d', utilisation_pct: 146, scada_lag_min: 15, last_seen_utc: '2026-05-28 14:32 UTC', co2_intensity: '—', power_draw_mw: 2.1 },
    reg_scorecard: { approval_score: 38, reporting_score: 25, inspection_score: 42, sanction_score: 31, rectification_score: 47, review_score: 44, overall_rank_in_1247: 1198, color: 'RED' },
  },
  {
    id: 'ENT-KZ-AST-0014', short_code: 'ENT-KZ-AST-0014',
    legal_name_en: 'KazMunayGas Trade JSC', legal_name_zh: 'KMG 贸易股份公司',
    tier: 'HIGH', flag: 'GREEN', score: 86,
    biz_profile: { legal_form: 'JSC (AO)', bin: '020140000451', registered_capital: '180 BN KZT', incorporation_date: '2002-01-15', registered_address: 'Astana, Kabanbai Batyr 19', operating_address: 'Astana HQ', coords: [51.1605, 71.4704], industry_code: 'OKED 46.71.1', employee_count: 4280, contact_phone: '+7 7172 78-61-00', legal_rep_en: 'A. Zhakupov', legal_rep_zh: '扎库波夫' },
    shareholding: [
      { holder_en: 'Samruk-Kazyna NWF', holder_zh: '萨姆鲁克-卡兹纳国家基金', ratio: 0.90, ubo: true, nationality: 'KZ' },
      { holder_en: 'Public Float', holder_zh: '公众', ratio: 0.10, ubo: false, nationality: '—' },
    ],
    business_scope: { licensed_products: ['Oil trading', 'Marketing'], actual_outputs: [{ item: 'Volumes', nameplate: '24 Mt/y', actual_2025: '24.1 Mt/y', deviation_pct: 0.4 }], primary_buyers: ['EU refiners', 'Sinopec'], export_share_pct: 96 },
    affiliates: [{ name_en: 'KazMunayGas NC', name_zh: 'KMG 国家公司', relation: 'PARENT', risk_color: 'GREEN' }],
    tax_invoice: { annual_tax_kzt: '212 BN', vat_compliance_pct: 99, invoice_anomaly_count_12m: 0, transfer_pricing_flag: false, last_audit_date: '2025-12-15' },
    major_events: [{ date: '2026-01-10', kind: 'CAPEX', title_en: 'Capex 2026 plan approved', title_zh: '2026 年资本开支获批', severity: 'GREEN' }],
    penalties: [],
    realtime_ops: { today_throughput: '66 kt', nameplate_capacity: '65 kt/d', utilisation_pct: 101, scada_lag_min: 1, last_seen_utc: '2026-05-28 14:32 UTC', co2_intensity: '0.12 tCO₂/MWh', power_draw_mw: 22 },
    reg_scorecard: { approval_score: 95, reporting_score: 92, inspection_score: 88, sanction_score: 90, rectification_score: 86, review_score: 85, overall_rank_in_1247: 12, color: 'GREEN' },
  },
  {
    id: 'ENT-KZ-PAV-0312', short_code: 'ENT-KZ-PAV-0312',
    legal_name_en: 'Ekibastuz Coal Mining LLC', legal_name_zh: '埃基巴斯图兹煤矿有限责任公司',
    tier: 'HIGH', flag: 'AMBER', score: 64,
    biz_profile: { legal_form: 'LLC (TOO)', bin: '030240007781', registered_capital: '12 BN KZT', incorporation_date: '2003-06-08', registered_address: 'Pavlodar Oblast, Ekibastuz, Industrial 12', operating_address: 'Bogatyr Open Pit', coords: [51.7234, 75.3542], industry_code: 'OKED 05.10.1', employee_count: 6420, contact_phone: '+7 7187 75-22-00', legal_rep_en: 'R. Omarov', legal_rep_zh: '奥马罗夫' },
    shareholding: [
      { holder_en: 'Eurasian Resources Group', holder_zh: '欧亚资源集团', ratio: 0.65, ubo: false, nationality: 'LU' },
      { holder_en: 'Samruk-Kazyna', holder_zh: '萨姆鲁克-卡兹纳', ratio: 0.35, ubo: false, nationality: 'KZ' },
    ],
    business_scope: { licensed_products: ['Coal extraction', 'Coal sales'], actual_outputs: [{ item: 'Coal', nameplate: '42 Mt/y', actual_2025: '44.3 Mt/y', deviation_pct: 5.5 }], primary_buyers: ['Ekibastuz GRES-1', 'Russia (export)'], export_share_pct: 38 },
    affiliates: [{ name_en: 'ERG Coal Trading', name_zh: 'ERG 煤炭贸易', relation: 'PARENT', risk_color: 'AMBER' }],
    tax_invoice: { annual_tax_kzt: '15 BN', vat_compliance_pct: 88, invoice_anomaly_count_12m: 6, transfer_pricing_flag: true, last_audit_date: '2025-10-20' },
    major_events: [{ date: '2026-02-12', kind: 'INCIDENT', title_en: 'Methane spike at pit 3', title_zh: '3 号坑甲烷铺设气压异常', severity: 'AMBER' }],
    penalties: [{ case_id: 'PEN-2025-1107', date: '2025-11-07', issuing_body: 'Mine Safety', amount_kzt: '180 M', reason_en: 'Ventilation log gap', reason_zh: '通风日志缺失', status: 'CLOSED' }],
    realtime_ops: { today_throughput: '121 kt', nameplate_capacity: '115 kt/d', utilisation_pct: 105, scada_lag_min: 15, last_seen_utc: '2026-05-28 14:30 UTC', co2_intensity: '0.92 tCO₂/MWh', power_draw_mw: 142 },
    reg_scorecard: { approval_score: 72, reporting_score: 68, inspection_score: 61, sanction_score: 65, rectification_score: 70, review_score: 64, overall_rank_in_1247: 624, color: 'AMBER' },
  },
  {
    id: 'ENT-KZ-PAV-0408', short_code: 'ENT-KZ-PAV-0408',
    legal_name_en: 'Pavlodar Data Center Operations LLC', legal_name_zh: '巴甫洛达尔数据中心运营有限责任公司',
    tier: 'MEDIUM', flag: 'GREEN', score: 78,
    biz_profile: { legal_form: 'LLC (TOO)', bin: '230540001148', registered_capital: '3.6 BN KZT', incorporation_date: '2023-05-04', registered_address: 'Pavlodar, IT Park 1', operating_address: 'Ekibastuz Mine-Mouth Data Center Cluster Phase 1', coords: [51.7012, 75.3210], industry_code: 'OKED 63.11.1', employee_count: 142, contact_phone: '+7 7187 50-88-00', legal_rep_en: 'N. Aliyev', legal_rep_zh: '阿利耶夫' },
    shareholding: [
      { holder_en: 'Astana DigitalPark JSC', holder_zh: '阿斯塔纳数字园区', ratio: 0.60, ubo: false, nationality: 'KZ' },
      { holder_en: 'Binance Capital (HK)', holder_zh: '币安资本 (香港)', ratio: 0.40, ubo: false, nationality: 'HK' },
    ],
    business_scope: { licensed_products: ['Data center hosting', 'Mining'], actual_outputs: [{ item: 'Compute', nameplate: '120 MW IT load', actual_2025: '108 MW', deviation_pct: -10 }], primary_buyers: ['Crypto miners', 'AI training providers'], export_share_pct: 70 },
    affiliates: [{ name_en: 'Astana DigitalPark JSC', name_zh: '阿斯塔纳数字园区', relation: 'PARENT', risk_color: 'GREEN' }],
    tax_invoice: { annual_tax_kzt: '480 M', vat_compliance_pct: 94, invoice_anomaly_count_12m: 1, transfer_pricing_flag: false, last_audit_date: '2025-12-02' },
    major_events: [{ date: '2026-04-01', kind: 'CAPEX', title_en: 'Phase 2 + 200MW announced', title_zh: '二期 +200MW 公告', severity: 'GREEN' }],
    penalties: [],
    realtime_ops: { today_throughput: '108 MW IT', nameplate_capacity: '120 MW', utilisation_pct: 90, scada_lag_min: 1, last_seen_utc: '2026-05-28 14:32 UTC', co2_intensity: '0.74 tCO₂/MWh', power_draw_mw: 142 },
    reg_scorecard: { approval_score: 82, reporting_score: 78, inspection_score: 80, sanction_score: 76, rectification_score: 74, review_score: 78, overall_rank_in_1247: 187, color: 'GREEN' },
  },
  {
    id: 'ENT-KZ-KAR-0501', short_code: 'ENT-KZ-KAR-0501',
    legal_name_en: 'Karaganda Coal Methane LLC', legal_name_zh: '卡拉干达煤层气有限责任公司',
    tier: 'MEDIUM', flag: 'AMBER', score: 61,
    biz_profile: { legal_form: 'LLC (TOO)', bin: '120540001902', registered_capital: '1.9 BN KZT', incorporation_date: '2012-08-20', registered_address: 'Karaganda, Mira Ave 41', operating_address: 'Shakhtinsk Pit, CBM extraction', coords: [49.8210, 72.5811], industry_code: 'OKED 06.20.1', employee_count: 320, contact_phone: '+7 7212 99-44-12', legal_rep_en: 'G. Tleugaliev', legal_rep_zh: '特列乌加利耶夫' },
    shareholding: [
      { holder_en: 'KazGeology JSC', holder_zh: '哈萨克地质', ratio: 0.55, ubo: false, nationality: 'KZ' },
      { holder_en: 'CBM Investments DMCC (UAE)', holder_zh: 'CBM 投资 (阿联酋)', ratio: 0.45, ubo: false, nationality: 'AE' },
    ],
    business_scope: { licensed_products: ['CBM extraction', 'Gas processing'], actual_outputs: [{ item: 'CBM', nameplate: '420 mcm/y', actual_2025: '395 mcm/y', deviation_pct: -6 }], primary_buyers: ['QazaqGaz', 'Local heat plants'], export_share_pct: 0 },
    affiliates: [{ name_en: 'KazGeology', name_zh: '哈萨克地质', relation: 'PARENT', risk_color: 'GREEN' }],
    tax_invoice: { annual_tax_kzt: '210 M', vat_compliance_pct: 81, invoice_anomaly_count_12m: 3, transfer_pricing_flag: false, last_audit_date: '2025-08-11' },
    major_events: [{ date: '2025-10-08', kind: 'INCIDENT', title_en: 'CBM well casing failure', title_zh: 'CBM 井套管失效', severity: 'AMBER' }],
    penalties: [],
    realtime_ops: { today_throughput: '1.08 mcm', nameplate_capacity: '1.15 mcm/d', utilisation_pct: 94, scada_lag_min: 15, last_seen_utc: '2026-05-28 14:30 UTC', co2_intensity: '—', power_draw_mw: 6.4 },
    reg_scorecard: { approval_score: 68, reporting_score: 60, inspection_score: 55, sanction_score: 64, rectification_score: 62, review_score: 58, overall_rank_in_1247: 731, color: 'AMBER' },
  },
  {
    id: 'ENT-KZ-AKT-0623', short_code: 'ENT-KZ-AKT-0623',
    legal_name_en: 'Caspian Marine Bunkering LLC', legal_name_zh: '里海海事燃油加注有限责任公司',
    tier: 'MEDIUM', flag: 'AMBER', score: 56,
    biz_profile: { legal_form: 'LLC (TOO)', bin: '170940003318', registered_capital: '850 M KZT', incorporation_date: '2017-09-12', registered_address: 'Aktau Port, Block 3', operating_address: 'Aktau Sea Port Marine Bunkering Berths 5-7', coords: [43.6128, 51.1421], industry_code: 'OKED 47.30.1', employee_count: 86, contact_phone: '+7 7292 22-11-08', legal_rep_en: 'I. Sarsenov', legal_rep_zh: '萨尔森诺夫' },
    shareholding: [{ holder_en: 'Aktau Marine Holdings', holder_zh: '阿克套海事控股', ratio: 1.0, ubo: false, nationality: 'KZ' }],
    business_scope: { licensed_products: ['Marine fuel oil', 'Bunkering'], actual_outputs: [{ item: 'MGO sales', nameplate: '180 kt/y', actual_2025: '174 kt/y', deviation_pct: -3.3 }], primary_buyers: ['Caspian Sea shipping'], export_share_pct: 88 },
    affiliates: [],
    tax_invoice: { annual_tax_kzt: '120 M', vat_compliance_pct: 79, invoice_anomaly_count_12m: 5, transfer_pricing_flag: true, last_audit_date: '2025-07-04' },
    major_events: [{ date: '2026-01-25', kind: 'COMPLAINT', title_en: 'Sulfur content out of MARPOL spec', title_zh: '硫含量超 MARPOL 上限', severity: 'AMBER' }],
    penalties: [{ case_id: 'PEN-2025-0228', date: '2025-02-28', issuing_body: 'Port Authority', amount_kzt: '42 M', reason_en: 'Discharge log inconsistency', reason_zh: '加注台账不一致', status: 'CLOSED' }],
    realtime_ops: { today_throughput: '480 t', nameplate_capacity: '500 t/d', utilisation_pct: 96, scada_lag_min: 15, last_seen_utc: '2026-05-28 13:55 UTC', co2_intensity: '—', power_draw_mw: 0.8 },
    reg_scorecard: { approval_score: 64, reporting_score: 58, inspection_score: 52, sanction_score: 56, rectification_score: 59, review_score: 54, overall_rank_in_1247: 812, color: 'AMBER' },
  },
  {
    id: 'ENT-KZ-SHY-0717', short_code: 'ENT-KZ-SHY-0717',
    legal_name_en: 'Shymkent PetroChem LLC', legal_name_zh: '奇姆肯特石化有限责任公司',
    tier: 'HIGH', flag: 'GREEN', score: 81,
    biz_profile: { legal_form: 'LLC (TOO)', bin: '050340002211', registered_capital: '24 BN KZT', incorporation_date: '2005-04-19', registered_address: 'Shymkent, Industrial Park 7', operating_address: 'Shymkent Refinery', coords: [42.3417, 69.5901], industry_code: 'OKED 19.20.1', employee_count: 2310, contact_phone: '+7 7252 41-90-00', legal_rep_en: 'B. Yessenov', legal_rep_zh: '叶森诺夫' },
    shareholding: [
      { holder_en: 'CNPC International (HK)', holder_zh: '中石油国际 (香港)', ratio: 0.50, ubo: false, nationality: 'CN' },
      { holder_en: 'KMG NC', holder_zh: 'KMG 国家', ratio: 0.50, ubo: false, nationality: 'KZ' },
    ],
    business_scope: { licensed_products: ['Refining', 'Petrochemicals'], actual_outputs: [{ item: 'Products', nameplate: '6 Mt/y', actual_2025: '5.92 Mt/y', deviation_pct: -1.3 }], primary_buyers: ['Sinopec', 'Local market'], export_share_pct: 55 },
    affiliates: [{ name_en: 'CNPC International', name_zh: '中石油国际', relation: 'PARENT', risk_color: 'GREEN' }],
    tax_invoice: { annual_tax_kzt: '38 BN', vat_compliance_pct: 96, invoice_anomaly_count_12m: 1, transfer_pricing_flag: false, last_audit_date: '2025-11-29' },
    major_events: [{ date: '2026-03-15', kind: 'CAPEX', title_en: 'PX expansion +500kt/y', title_zh: 'PX 扩产 +50 万吨', severity: 'GREEN' }],
    penalties: [],
    realtime_ops: { today_throughput: '16.2 kt', nameplate_capacity: '16.4 kt/d', utilisation_pct: 99, scada_lag_min: 1, last_seen_utc: '2026-05-28 14:32 UTC', co2_intensity: '0.42 tCO₂/MWh', power_draw_mw: 64 },
    reg_scorecard: { approval_score: 88, reporting_score: 84, inspection_score: 80, sanction_score: 82, rectification_score: 78, review_score: 80, overall_rank_in_1247: 92, color: 'GREEN' },
  },
  {
    id: 'ENT-KZ-AKT-0844', short_code: 'ENT-KZ-AKT-0844',
    legal_name_en: 'Aktau Wind Power Holding LLC', legal_name_zh: '阿克套风电控股有限责任公司',
    tier: 'MEDIUM', flag: 'GREEN', score: 74,
    biz_profile: { legal_form: 'LLC (TOO)', bin: '190440005512', registered_capital: '4.2 BN KZT', incorporation_date: '2019-04-08', registered_address: 'Aktau, Microdistrict 8 Bldg 12', operating_address: 'Aktau 80MW Wind Farm', coords: [43.7212, 50.9988], industry_code: 'OKED 35.11.1', employee_count: 64, contact_phone: '+7 7292 60-30-22', legal_rep_en: 'L. Karimova', legal_rep_zh: '卡里莫娃' },
    shareholding: [
      { holder_en: 'Masdar (UAE)', holder_zh: '马斯达尔 (阿联酋)', ratio: 0.49, ubo: false, nationality: 'AE' },
      { holder_en: 'Samruk-Kazyna', holder_zh: '萨姆鲁克-卡兹纳', ratio: 0.51, ubo: false, nationality: 'KZ' },
    ],
    business_scope: { licensed_products: ['Wind power generation'], actual_outputs: [{ item: 'Wind MWh', nameplate: '280 GWh/y', actual_2025: '244 GWh/y', deviation_pct: -12.9 }], primary_buyers: ['KEGOC'], export_share_pct: 0 },
    affiliates: [],
    tax_invoice: { annual_tax_kzt: '85 M', vat_compliance_pct: 92, invoice_anomaly_count_12m: 0, transfer_pricing_flag: false, last_audit_date: '2025-12-20' },
    major_events: [{ date: '2024-09-01', kind: 'PERMIT', title_en: 'Permit issued (delayed 273d)', title_zh: '审批获批 (拖延 273 天)', severity: 'AMBER' }],
    penalties: [],
    realtime_ops: { today_throughput: '0.7 GWh', nameplate_capacity: '1.9 GWh/d', utilisation_pct: 37, scada_lag_min: 1, last_seen_utc: '2026-05-28 14:32 UTC', co2_intensity: '0.00 tCO₂/MWh', power_draw_mw: 0 },
    reg_scorecard: { approval_score: 62, reporting_score: 80, inspection_score: 76, sanction_score: 82, rectification_score: 70, review_score: 74, overall_rank_in_1247: 285, color: 'GREEN' },
  },
  {
    id: 'ENT-KZ-ALA-0918', short_code: 'ENT-KZ-ALA-0918',
    legal_name_en: 'Almaty City Heat Network LLC', legal_name_zh: '阿拉木图城市供热网络有限责任公司',
    tier: 'CRITICAL', flag: 'AMBER', score: 67,
    biz_profile: { legal_form: 'LLC (TOO)', bin: '040640008812', registered_capital: '6.8 BN KZT', incorporation_date: '2004-06-22', registered_address: 'Almaty, Abay Ave 88', operating_address: 'Almaty CHP-2/3', coords: [43.2389, 76.8897], industry_code: 'OKED 35.30.1', employee_count: 4800, contact_phone: '+7 727 318-22-00', legal_rep_en: 'M. Sagintayev', legal_rep_zh: '萨京塔耶夫' },
    shareholding: [{ holder_en: 'Almaty Akimat', holder_zh: '阿拉木图市政府', ratio: 1.0, ubo: true, nationality: 'KZ' }],
    business_scope: { licensed_products: ['District heating', 'CHP'], actual_outputs: [{ item: 'Heat', nameplate: '6500 Gcal/h', actual_2025: '6480 Gcal/h', deviation_pct: -0.3 }], primary_buyers: ['Almaty households'], export_share_pct: 0 },
    affiliates: [],
    tax_invoice: { annual_tax_kzt: '4.2 BN', vat_compliance_pct: 91, invoice_anomaly_count_12m: 2, transfer_pricing_flag: false, last_audit_date: '2025-09-30' },
    major_events: [{ date: '2026-01-12', kind: 'INCIDENT', title_en: 'Pipe burst — 1,200 households cut off 14h', title_zh: '管线爆裂 — 1,200 户停热 14 小时', severity: 'AMBER' }],
    penalties: [],
    realtime_ops: { today_throughput: '5980 Gcal', nameplate_capacity: '6500 Gcal/h', utilisation_pct: 92, scada_lag_min: 15, last_seen_utc: '2026-05-28 14:30 UTC', co2_intensity: '0.68 tCO₂/MWh', power_draw_mw: 380 },
    reg_scorecard: { approval_score: 78, reporting_score: 74, inspection_score: 64, sanction_score: 72, rectification_score: 58, review_score: 70, overall_rank_in_1247: 412, color: 'AMBER' },
  },
  {
    id: 'ENT-KZ-AKT-1023', short_code: 'ENT-KZ-AKT-1023',
    legal_name_en: 'Mangystau LPG Distribution LLC', legal_name_zh: '曼吉斯套液化气分销有限责任公司',
    tier: 'HIGH', flag: 'RED', score: 41,
    biz_profile: { legal_form: 'LLC (TOO)', bin: '150240002274', registered_capital: '720 M KZT', incorporation_date: '2015-02-11', registered_address: 'Aktau, 14 Microdistrict, Bldg 9', operating_address: 'Aktau LPG Terminal + 38 retail stations', coords: [43.6612, 51.1933], industry_code: 'OKED 47.30.2', employee_count: 218, contact_phone: '+7 7292 33-22-11', legal_rep_en: 'A. Tlegenov', legal_rep_zh: '特列格诺夫' },
    shareholding: [
      { holder_en: 'Western Caspian Energy LLC', holder_zh: '西里海能源', ratio: 0.45, ubo: false, nationality: 'KZ' },
      { holder_en: 'Private investor (UBO)', holder_zh: '私人投资者 (UBO)', ratio: 0.55, ubo: true, nationality: 'KZ' },
    ],
    business_scope: { licensed_products: ['LPG retail', 'Cylinder filling'], actual_outputs: [{ item: 'LPG sold', nameplate: '120 kt/y', actual_2025: '134 kt/y', deviation_pct: 11.7 }], primary_buyers: ['Mangystau households', 'Taxi fleets'], export_share_pct: 0 },
    affiliates: [{ name_en: 'Western Caspian Energy LLC', name_zh: '西里海能源', relation: 'PARENT', risk_color: 'RED' }],
    tax_invoice: { annual_tax_kzt: '88 M', vat_compliance_pct: 64, invoice_anomaly_count_12m: 11, transfer_pricing_flag: true, last_audit_date: '2025-05-08' },
    major_events: [
      { date: '2022-01-04', kind: 'COMPLAINT', title_en: '2022 LPG price unrest (Zhanaozen)', title_zh: '2022 LPG 涨价骚乱 (扎瑙津)', severity: 'RED' },
      { date: '2025-12-20', kind: 'COMPLAINT', title_en: 'Retail price spike +28%', title_zh: '零售价飙升 +28%', severity: 'RED' },
    ],
    penalties: [{ case_id: 'PEN-2022-0108', date: '2022-01-08', issuing_body: 'Anti-Monopoly Agency', amount_kzt: '650 M', reason_en: 'Price coordination', reason_zh: '价格协同', status: 'CLOSED' }],
    realtime_ops: { today_throughput: '380 t', nameplate_capacity: '330 t/d', utilisation_pct: 115, scada_lag_min: 15, last_seen_utc: '2026-05-28 14:30 UTC', co2_intensity: '—', power_draw_mw: 1.2 },
    reg_scorecard: { approval_score: 48, reporting_score: 40, inspection_score: 45, sanction_score: 32, rectification_score: 50, review_score: 42, overall_rank_in_1247: 1156, color: 'RED' },
  },
  {
    id: 'ENT-KZ-ATY-1188', short_code: 'ENT-KZ-ATY-1188',
    legal_name_en: 'Tengiz Joint Operating LLC', legal_name_zh: '田吉兹联合运营有限责任公司',
    tier: 'CRITICAL', flag: 'GREEN', score: 89,
    biz_profile: { legal_form: 'LLC (TOO)', bin: '930340009987', registered_capital: '320 BN KZT', incorporation_date: '1993-04-06', registered_address: 'Atyrau, Tengiz Field', operating_address: 'Tengiz Mega Project', coords: [46.0234, 53.4521], industry_code: 'OKED 06.10.1', employee_count: 22000, contact_phone: '+7 7122 76-30-00', legal_rep_en: 'C. Stevens', legal_rep_zh: '史蒂文斯' },
    shareholding: [
      { holder_en: 'Chevron', holder_zh: '雪佛龙', ratio: 0.50, ubo: false, nationality: 'US' },
      { holder_en: 'ExxonMobil', holder_zh: '埃克森美孚', ratio: 0.25, ubo: false, nationality: 'US' },
      { holder_en: 'KazMunayGas', holder_zh: 'KMG 国家', ratio: 0.20, ubo: false, nationality: 'KZ' },
      { holder_en: 'LukArco', holder_zh: 'LukArco', ratio: 0.05, ubo: false, nationality: 'RU' },
    ],
    business_scope: { licensed_products: ['Crude production', 'Gas reinjection'], actual_outputs: [{ item: 'Crude', nameplate: '40 Mt/y', actual_2025: '39.4 Mt/y', deviation_pct: -1.5 }], primary_buyers: ['CPC pipeline'], export_share_pct: 98 },
    affiliates: [{ name_en: 'CPC Caspian Pipeline', name_zh: 'CPC 里海管道', relation: 'BUYER', risk_color: 'GREEN' }],
    tax_invoice: { annual_tax_kzt: '480 BN', vat_compliance_pct: 99, invoice_anomaly_count_12m: 0, transfer_pricing_flag: false, last_audit_date: '2026-01-15' },
    major_events: [{ date: '2026-04-20', kind: 'CAPEX', title_en: 'FGP expansion online', title_zh: 'FGP 扩产投产', severity: 'GREEN' }],
    penalties: [],
    realtime_ops: { today_throughput: '108 kt', nameplate_capacity: '110 kt/d', utilisation_pct: 98, scada_lag_min: 1, last_seen_utc: '2026-05-28 14:32 UTC', co2_intensity: '0.14 tCO₂/MWh', power_draw_mw: 280 },
    reg_scorecard: { approval_score: 96, reporting_score: 95, inspection_score: 92, sanction_score: 94, rectification_score: 88, review_score: 90, overall_rank_in_1247: 4, color: 'GREEN' },
  },
];

export function searchEnterprises(query: string): CommercialRecord[] {
  if (!query || query.trim() === '') return COMMERCIAL_DB;
  const q = query.trim().toLowerCase();
  return COMMERCIAL_DB.filter(r =>
    r.legal_name_en.toLowerCase().includes(q) ||
    r.legal_name_zh.includes(q) ||
    r.short_code.toLowerCase().includes(q) ||
    r.biz_profile.bin.includes(q) ||
    r.biz_profile.industry_code.toLowerCase().includes(q)
  );
}

export function findEnterpriseById(id: string): CommercialRecord | undefined {
  return COMMERCIAL_DB.find(r => r.id === id || r.short_code === id);
}
