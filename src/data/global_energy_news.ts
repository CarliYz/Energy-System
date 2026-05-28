export type NewsCategory = 'conflict' | 'investment' | 'policy';

export type GlobalNewsItem = {
  id: string;
  scope: 'domestic' | 'overseas';
  source: string;       // CNN / NBC / Reuters / Bloomberg / CCTV / XinhuaNet / Kazinform / Tengrinews / ...
  sourceUrl: string;    // cnn.com / cctv.com / kazinform.kz
  severity: 'critical' | 'medium' | 'low';
  severityLabel: 'CRITICAL' | 'MED' | 'LOW';
  region: string;
  timeAgo: string;
  title: string;
  fullText: string;     // mock 400 字
  kpiImpact?: { kpi: string; deltaPct: number }[];
};

export const GLOBAL_ENERGY_NEWS: GlobalNewsItem[] = [
  // --- DOMESTIC NEWS ---
  {
    id: 'DOM-NEWS-001',
    scope: 'domestic',
    source: 'KazTAG',
    sourceUrl: 'kaztag.kz',
    severity: 'critical',
    severityLabel: 'CRITICAL',
    region: 'Pavlodar / KEGOC Control',
    timeAgo: '15 min ago',
    title: 'KEGOC State Grid System Detects Transient Frequency Deviation Beyond Safe Decimals',
    fullText: 'The State Grid Operational Control Center (KEGOC) has issued a yellow-grade technical bulletin after primary interconnectors near Pavlodar industrial zone registered transient cycle drops. Sudden loading spikes from unauthorized data mining farms are believed to have triggered the trip, requiring fast starter gas response and temporary residential peak shaving.',
    kpiImpact: [
      { kpi: 'Grid Frequency Stability (Hz)', deltaPct: -1.2 },
      { kpi: 'Starter Gas Reserve Usage', deltaPct: 8.4 }
    ]
  },
  {
    id: 'DOM-NEWS-002',
    scope: 'domestic',
    source: 'Tengrinews',
    sourceUrl: 'tengrinews.kz',
    severity: 'medium',
    severityLabel: 'MED',
    region: 'Almaty Municipality',
    timeAgo: '1 hour ago',
    title: 'Almaty Municipal Committee Concludes Public Hearing Over 35% Gas Heating Tariffs Adjustment',
    fullText: 'Public heating utilities of Almaty successfully delivered audit briefs defending the proposed 35% seasonal surcharge for commercial and residential buildings. Civil representatives petitioned for subsidized buffers, stating the price hikes violate basic winter life support lines. Security details remained high near the town hall during negotiations.',
    kpiImpact: [
      { kpi: 'Utility Bill Price Hike Metric', deltaPct: 35.0 },
      { kpi: 'Social Discontent Score', deltaPct: 12.8 }
    ]
  },
  {
    id: 'DOM-NEWS-003',
    scope: 'domestic',
    source: 'Kazinform',
    sourceUrl: 'inform.kz',
    severity: 'low',
    severityLabel: 'LOW',
    region: 'Atyrau Basin (Block E)',
    timeAgo: '3 hours ago',
    title: 'KMG Exploration Drills Prolific Sweet Oil Well Deeps, Confirming Massive Caspian Sub-salt Reservoirs',
    fullText: 'KazMunayGas (KMG) exploration rigs have completed an advanced sub-salt appraisal test in the Atyrau region. Core sampling confirms light sweet oil grades at high hydrostatic pressures, promising long-term recovery curves that outclass previous regional forecasts by 15% with zero additional H2S extraction penalties.',
    kpiImpact: [
      { kpi: 'Caspian Proven Reserves Index', deltaPct: 4.5 },
      { kpi: 'National Oil Export Potential', deltaPct: 1.8 }
    ]
  },
  {
    id: 'DOM-NEWS-004',
    scope: 'domestic',
    source: 'Astana Times',
    sourceUrl: 'astanatimes.com',
    severity: 'medium',
    severityLabel: 'MED',
    region: 'Astana Headquarters',
    timeAgo: '5 hours ago',
    title: 'KMG Re-signs Long-term Strategic Crude Export Supply Pact With China Sinopec Group',
    fullText: 'A high-level trade council in Astana finalized KMG’s strategic crude oil supply renewal with China’s Sinopec Group. The updated agreement secure firm allocation schedules for the next 48 months with premium pricing indexes tied to the Brent-to-WTI crack spread, ensuring absolute cash flow liquidity for KZ upstream pipelines.',
    kpiImpact: [
      { kpi: 'Strategic Export Long-Term Revenue', deltaPct: 5.2 },
      { kpi: 'China Pipeline Throughput Rate', deltaPct: 2.3 }
    ]
  },
  {
    id: 'DOM-NEWS-005',
    scope: 'domestic',
    source: 'Khabar 24',
    sourceUrl: '24.kz',
    severity: 'low',
    severityLabel: 'LOW',
    region: 'Aktau Port Terminal',
    timeAgo: '8 hours ago',
    title: 'Aktau Port LNG Re-gasification Monthly Throughput Exceeds Winter Peak Surcharges by 14.5%',
    fullText: 'The Port of Aktau LNG dispatch logs confirmed a strong mid-quarter throughput surge. Tanker scheduling software optimized turnaround delays down to 18 hours per vessel, driving record volume swaps to regional distribution rings. Increased dry gas supply lines effectively stabilized Mangystau’s local gas turbine grids.',
    kpiImpact: [
      { kpi: 'Aktau Port LNG Daily Throughput', deltaPct: 14.5 },
      { kpi: 'West-Grid Peak Supply Margin', deltaPct: 6.2 }
    ]
  },
  {
    id: 'DOM-NEWS-006',
    scope: 'domestic',
    source: 'Kazinform',
    sourceUrl: 'inform.kz',
    severity: 'low',
    severityLabel: 'LOW',
    region: 'Astana Policy Center',
    timeAgo: '12 hours ago',
    title: 'Ministry of National Economy Formally Registers 2030 Renewable Energy Roadmap Mandates',
    fullText: 'The Cabinet of Ministers officially adopted the 2030 Green Transition Roadmap. The decree establishes automatic tax concessions for modern heavy wind equipment imports while mandating traditional coal power plants in Karaganda and Ekibastuz to purchase a minimum 15% clean offset from Western solar/wind grids starting next season.',
    kpiImpact: [
      { kpi: 'Carbon Intensity Decapital', deltaPct: -3.8 },
      { kpi: 'Green Capex Investment Inflows', deltaPct: 15.0 }
    ]
  },

  // --- OVERSEAS NEWS ---
  {
    id: 'OVER-NEWS-001',
    scope: 'overseas',
    source: 'CNN',
    sourceUrl: 'cnn.com',
    severity: 'critical',
    severityLabel: 'CRITICAL',
    region: 'Natanz, Iran / Middle East',
    timeAgo: '28 min ago',
    title: 'US Joint Command Confirms Precision Air Strike Deployed on Iran Natanz Nuclear Facets',
    fullText: 'A sudden wave of stealth fighters completed high-altitude precision penetrations targeting underground power and heavy enrichment facilities near Natanz. Regional anti-air divisions responded with retaliatory battery dumps. Geopolitical crude futures spiked immediately over fears of wider Persian Gulf supply lane restrictions.',
    kpiImpact: [
      { kpi: 'Global Brent Spot Index', deltaPct: 4.2 },
      { kpi: 'Kazakh Export Price Negotiation Leverage', deltaPct: 1.8 }
    ]
  },
  {
    id: 'OVER-NEWS-002',
    scope: 'overseas',
    source: 'Reuters',
    sourceUrl: 'reuters.com',
    severity: 'medium',
    severityLabel: 'MED',
    region: 'Vienna / Austria',
    timeAgo: '2 hours ago',
    title: 'OPEC+ Ministerial Council Decides to Extend Existing 2.2M bpd Voluntary Production Cuts',
    fullText: 'The Vienna cartel session agreed to extend voluntary oil supply restrictions until the end of Q3. Leading fuel exporters cited mounting storage gains across East-Asia. The extension provides a strong base floor for medium-grade CPC blend prices despite slight commercial friction reported by several member state representatives.',
    kpiImpact: [
      { kpi: 'Global Supply Buffer Volatility', deltaPct: -2.1 },
      { kpi: 'KZ Oil Export Premium MoM', deltaPct: 1.5 }
    ]
  },
  {
    id: 'OVER-NEWS-003',
    scope: 'overseas',
    source: 'CCTV',
    sourceUrl: 'cctv.com',
    severity: 'low',
    severityLabel: 'LOW',
    region: 'Beijing / China',
    timeAgo: '4 hours ago',
    title: 'State Council of China Approves KZT 120B High-Voltage Smart Power Core Interconnection Belt',
    fullText: 'China finalized structural capital injections to construct ultra-high-voltage smart grid channels spanning northwestern provinces. The mega infrastructure facilitates clean wind delivery to coastal hubs while forming technical hookups with the central Asian energy grid system, optimizing cross-border power balance pools.',
    kpiImpact: [
      { kpi: 'UHV Interconnection Flow Peak', deltaPct: 11.2 },
      { kpi: 'KZ Clean Grid Off-take Rate', deltaPct: 4.5 }
    ]
  },
  {
    id: 'OVER-NEWS-004',
    scope: 'overseas',
    source: 'Bloomberg',
    sourceUrl: 'bloomberg.com',
    severity: 'medium',
    severityLabel: 'MED',
    region: 'Brussels / European Union',
    timeAgo: '5 hours ago',
    title: 'European Union Releases Q3 CBAM Carbon Tariff Draft Mandates For Metallurgical Imports',
    fullText: 'The European Commission published the final transition rules for the Carbon Border Adjustment Mechanism (CBAM). Non-reformed metallurgical and chemical production hubs face up to €82 per ton tariffs, forcing Eastern partners to accelerate laser emission audits and verification systems to avoid painful trade margin decay.',
    kpiImpact: [
      { kpi: 'CBAM Compliance Tech Expense', deltaPct: 18.2 },
      { kpi: 'European Export Profit Margins', deltaPct: -4.5 }
    ]
  },
  {
    id: 'OVER-NEWS-005',
    scope: 'overseas',
    source: 'Al Jazeera',
    sourceUrl: 'aljazeera.com',
    severity: 'critical',
    severityLabel: 'CRITICAL',
    region: 'Red Sea Straits',
    timeAgo: '8 hours ago',
    title: 'Armed Drone Fleet Targets Heavy Class LNG Tanker, Forcing Extended Maritime Route Diversions',
    fullText: 'A high-speed swarm of kamikaze drones successfully breached regional security rings, hitting a commercial liquefied natural gas carrier in deep-water straits. Most shipping alliances instantly halted direct passes, routing fuel carriers around Africa’s Cape of Good Hope, creating massive shipping premium overcharges.',
    kpiImpact: [
      { kpi: 'Ocean Freight Spot Surcharge Rate', deltaPct: 28.0 },
      { kpi: 'Regional LNG Spot Price Tick', deltaPct: 8.5 }
    ]
  },
  {
    id: 'OVER-NEWS-006',
    scope: 'overseas',
    source: 'Reuters',
    sourceUrl: 'reuters.com',
    severity: 'low',
    severityLabel: 'LOW',
    region: 'Beijing / Astana Pivot',
    timeAgo: '1 day ago',
    title: 'Central Asia-China Pipeline Route-D Starts Front-End EPC Bidding Cycles',
    fullText: 'Major pipeline EPC syndicates have formally opened front-end engineering design and procurement tenders for the long-awaited Route-D connector. Once built, this branch will add 30 billion cubic meters of natural gas throughput annually, feeding China’s main high-pressure industrial rings from fields across Kazakhstan and Turkmenistan.',
    kpiImpact: [
      { kpi: 'KZ-China Pipeline Capacity', deltaPct: 30.0 },
      { kpi: 'Samo-Gas Investment Volume', deltaPct: 12.0 }
    ]
  }
];
