export const TRANSMISSION_LINES = [
  // 1150 kV Backbone (Purple/Magenta #9D4EDD, 2.8px)
  { id: 'TL-1150-1', type: '1150kV', status: 'ACTIVE', from: [53.22, 63.64], to: [51.17, 71.45], label: 'Kostanay-Astana 1150' },
  { id: 'TL-1150-2', type: '1150kV', status: 'ACTIVE', from: [51.17, 71.45], to: [51.72, 75.36], label: 'Astana-Ekibastuz 1150' },
  { id: 'TL-1150-3', type: '1150kV', status: 'ACTIVE', from: [51.72, 75.36], to: [52.29, 76.96], label: 'Ekibastuz-Pavlodar 1150' },

  // 500 kV Active (Red #E63946, 2.2px)
  { id: 'TL-500-1', type: '500kV', status: 'ACTIVE', from: [51.23, 51.37], to: [50.28, 57.17], label: 'Oral-Aktobe' },
  { id: 'TL-500-2', type: '500kV', status: 'ACTIVE', from: [50.28, 57.17], to: [53.22, 63.64], label: 'Aktobe-Kostanay' },
  { id: 'TL-500-3', type: '500kV', status: 'ACTIVE', from: [53.22, 63.64], to: [54.88, 69.15], label: 'Kostanay-Petropavl' },
  { id: 'TL-500-4', type: '500kV', status: 'ACTIVE', from: [54.88, 69.15], to: [53.28, 69.40], label: 'Petropavl-Kokshetau' },
  { id: 'TL-500-5', type: '500kV', status: 'ACTIVE', from: [53.28, 69.40], to: [51.17, 71.45], label: 'Kokshetau-Astana' },
  { id: 'TL-500-6', type: '500kV', status: 'ACTIVE', from: [51.17, 71.45], to: [52.29, 76.96], label: 'Astana-Pavlodar' },
  { id: 'TL-500-7', type: '500kV', status: 'ACTIVE', from: [52.29, 76.96], to: [49.95, 82.63], label: 'Pavlodar-Oskemen' },
  { id: 'TL-500-8', type: '500kV', status: 'ACTIVE', from: [52.29, 76.96], to: [49.80, 73.09], label: 'Pavlodar-Karaganda' },
  { id: 'TL-500-9', type: '500kV', status: 'ACTIVE', from: [51.17, 71.45], to: [49.80, 73.09], label: 'Astana-Karaganda' },
  { id: 'TL-500-10', type: '500kV', status: 'ACTIVE', from: [49.80, 73.09], to: [43.22, 76.93], label: 'Karaganda-Almaty' },
  { id: 'TL-500-11', type: '500kV', status: 'ACTIVE', from: [43.22, 76.93], to: [42.90, 71.37], label: 'Almaty-Taraz' },
  { id: 'TL-500-12', type: '500kV', status: 'ACTIVE', from: [42.90, 71.37], to: [42.30, 69.59], label: 'Taraz-Shymkent' },
  { id: 'TL-500-13', type: '500kV', status: 'ACTIVE', from: [47.09, 51.92], to: [43.65, 51.16], label: 'Atyrau-Aktau' },
  { id: 'TL-500-14', type: '500kV', status: 'ACTIVE', from: [50.28, 57.17], to: [47.09, 51.92], label: 'Aktobe-Atyrau' },
  { id: 'TL-500-15', type: '500kV', status: 'ACTIVE', from: [48.8, 68.8], to: [42.3, 69.6], label: 'Zhezqazgan-Shymkent' },
  { id: 'TL-500-16', type: '500kV', status: 'ACTIVE', from: [49.8, 73.1], to: [48.8, 68.8], label: 'Karaganda-Zhezqazgan' },
  { id: 'TL-500-17', type: '500kV', status: 'ACTIVE', from: [44.8, 65.5], to: [42.3, 69.6], label: 'Kyzylorda-Shymkent' },
  { id: 'TL-500-18', type: '500kV', status: 'ACTIVE', from: [50.28, 57.17], to: [44.8, 65.5], label: 'Aktobe-Kyzylorda Connector' },
  
  // 220kV Grid (Blue #4A90E2, 1.4px) - Mesh & Local Connections
  { id: 'TL-220-1', type: '220kV', status: 'ACTIVE', from: [51.17, 71.45], to: [50.5, 64.0], label: 'Astana-Turgay Cluster' },
  { id: 'TL-220-2', type: '220kV', status: 'ACTIVE', from: [47.10, 51.90], to: [45.3, 53.0], label: 'Atyrau-Beyneu' },
  { id: 'TL-220-3', type: '220kV', status: 'ACTIVE', from: [43.65, 51.16], to: [43.4, 52.8], label: 'Aktau-Uzen' },
  { id: 'TL-220-4', type: '220kV', status: 'ACTIVE', from: [50.28, 57.17], to: [50.0, 56.5], label: 'Aktobe-Zhanazhol' },
  { id: 'TL-220-5', type: '220kV', status: 'ACTIVE', from: [43.22, 76.93], to: [43.88, 77.08], label: 'Almaty-Kapchagay' },
  { id: 'TL-220-6', type: '220kV', status: 'ACTIVE', from: [49.95, 82.63], to: [50.3, 80.4], label: 'Oskemen-Semey' },
  { id: 'TL-220-7', type: '220kV', status: 'ACTIVE', from: [52.29, 76.96], to: [50.3, 80.4], label: 'Pavlodar-Semey' },
  { id: 'TL-220-8', type: '220kV', status: 'ACTIVE', from: [42.3, 69.6], to: [43.8, 70.5], label: 'Shymkent-Amangeldy' },
  { id: 'TL-220-9', type: '220kV', status: 'ACTIVE', from: [44.8, 65.5], to: [43.8, 70.5], label: 'Kyzylorda-Amangeldy' },
  { id: 'TL-220-10', type: '220kV', status: 'ACTIVE', from: [51.23, 51.37], to: [50.3, 57.2], label: 'Oral-Aktobe 220kV' },
  { id: 'TL-220-11', type: '220kV', status: 'ACTIVE', from: [53.22, 63.64], to: [53.3, 69.4], label: 'Kostanay-Kokshetau' },
  { id: 'TL-220-12', type: '220kV', status: 'ACTIVE', from: [53.3, 69.4], to: [54.9, 69.2], label: 'Kokshetau-Petropavl' },

  // International Interconnects (Gray Bold #555 - "Transit Lines")
  { id: 'TL-INT-1', type: 'INTER', status: 'ACTIVE', from: [51.23, 51.37], to: [53.5, 50.5], label: 'Oral to Samara (RU)' },
  { id: 'TL-INT-2', type: 'INTER', status: 'ACTIVE', from: [54.88, 69.15], to: [56.2, 70.0], label: 'Petropavl to Tyumen (RU)' },
  { id: 'TL-INT-3', type: 'INTER', status: 'ACTIVE', from: [52.29, 76.96], to: [55.5, 77.5], label: 'Pavlodar to Omsk (RU)' },
  { id: 'TL-INT-4', type: 'INTER', status: 'ACTIVE', from: [42.30, 69.59], to: [41.2, 69.2], label: 'Shymkent to Tashkent (UZ)' },
  { id: 'TL-INT-5', type: 'INTER', status: 'ACTIVE', from: [43.22, 76.93], to: [44.0, 83.0], label: 'Almaty to China (CN)' },
  { id: 'TL-INT-6', type: 'INTER', status: 'ACTIVE', from: [53.22, 63.64], to: [55.5, 61.3], label: 'Kostanay to Chelyabinsk (RU)' },
  { id: 'TL-INT-7', type: 'INTER', status: 'ACTIVE', from: [42.90, 71.37], to: [42.0, 73.0], label: 'Taraz to Bishkek (KG)' },
  { id: 'TL-INT-8', type: 'INTER', status: 'ACTIVE', from: [49.95, 82.63], to: [51.5, 84.5], label: 'Oskemen to Russia (RU)' },
  { id: 'TL-INT-9', type: 'INTER', status: 'ACTIVE', from: [47.1, 51.9], to: [46.5, 49.0], label: 'Atyrau to Astrakhan (RU)' },
];

export const POWER_PLANTS = [
  // Thermal (Triangle ▲, Black #222)
  { id: 'PP-EKB-1', name: 'Ekibastuz GRES-1', type: 'thermal', mw: 4000, coords: [51.72, 75.36], isMajor: true },
  { id: 'PP-EKB-2', name: 'Ekibastuz GRES-2', type: 'thermal', mw: 1000, coords: [51.70, 75.30], isMajor: true },
  { id: 'PP-AKS-1', name: 'Aksu', type: 'thermal', mw: 2450, coords: [52.00, 76.93], isMajor: true },
  { id: 'PP-AST-1', name: 'Astana CHP-1', type: 'thermal', mw: 360, coords: [51.16, 71.44] },
  { id: 'PP-ALM-1', name: 'Almaty CHP-2', type: 'thermal', mw: 510, coords: [43.25, 76.90] },
  { id: 'PP-KAR-1', name: 'Karaganda CHP', type: 'thermal', mw: 660, coords: [49.85, 73.10] },
  { id: 'PP-ATY-1', name: 'Atyrau CHP', type: 'thermal', mw: 450, coords: [47.10, 51.90] },
  
  // Hydro (Circle ●, Blue #1F77B4)
  { id: 'HP-UKG-1', name: 'Bukhtarma', type: 'hydro', mw: 675, coords: [49.75, 84.12] },
  { id: 'HP-UKG-2', name: 'Shulbinsk', type: 'hydro', mw: 702, coords: [50.31, 80.41] },
  { id: 'HP-UKG-3', name: 'Ust-Kamenogorsk', type: 'hydro', mw: 339, coords: [49.95, 82.63] },
  { id: 'HP-ALM-1', name: 'Kapchagay', type: 'hydro', mw: 364, coords: [43.88, 77.08] },
  
  // Solar (Diamond ◆, Yellow #F4B400)
  { id: 'SP-SHY-1', name: 'Shymkent Solar', type: 'solar', mw: 50, coords: [42.35, 69.65] },
  { id: 'SP-TAR-1', name: 'Taraz Solar', type: 'solar', mw: 100, coords: [42.95, 71.40] },
  
  // Wind (Star ✦, Green #2E8B57)
  { id: 'WP-AST-1', name: 'Astana Wind', type: 'wind', mw: 100, coords: [51.25, 71.30] },
  { id: 'WP-ATY-1', name: 'Atyrau Wind', type: 'wind', mw: 50, coords: [47.15, 51.95] },
];

export const SUBSTATIONS = [
  // 1150/500 kV Hubs (Orange Circle with Black Border)
  { id: 'SUB-AST-H', type: '1150/500kV', name: 'ASTANA HUB', coords: [51.17, 71.45], isHub: true },
  { id: 'SUB-KAR-H', type: '1150/500kV', name: 'KARAGANDA HUB', coords: [49.80, 73.09], isHub: true },
  { id: 'SUB-ALM-H', type: '1150/500kV', name: 'ALMATY HUB', coords: [43.22, 76.93], isHub: true },
  { id: 'SUB-SHY-H', type: '1150/500kV', name: 'SHYMKENT HUB', coords: [42.30, 69.59], isHub: true },
  { id: 'SUB-AKT-H', type: '1150/500kV', name: 'AKTOBE HUB', coords: [50.28, 57.17], isHub: true },
  { id: 'SUB-ATY-H', type: '1150/500kV', name: 'ATYRAU HUB', coords: [47.09, 51.92], isHub: true },
  
  // 500 kV Nodes (Orange Circle)
  { id: 'SUB-EKB-N', type: '500kV', name: 'EKIBASTUZ', coords: [51.72, 75.36] },
  { id: 'SUB-PAV-N', type: '500kV', name: 'PAVLODAR', coords: [52.29, 76.96] },
];
