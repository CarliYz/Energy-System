export const OIL_FIELDS = [
  { id: 'OF-KSH', name: 'Kashagan', coords: [46.5, 51.2], type: 'OIL', size: 'XXL', remark: 'Offshore' },
  { id: 'OF-TNG', name: 'Tengiz', coords: [46.0, 53.4], type: 'OIL', size: 'XXL' },
  { id: 'OF-KRC', name: 'Karachaganak', coords: [51.4, 51.8], type: 'OIL', size: 'XL' },
  { id: 'OF-UZN', name: 'Uzen', coords: [43.4, 52.8], type: 'OIL', size: 'L' },
  { id: 'OF-ZHN', name: 'Zhanazhol', coords: [50.0, 56.5], type: 'OIL', size: 'M' },
  { id: 'OF-KUM', name: 'Kumkol', coords: [45.8, 65.5], type: 'OIL', size: 'M' },
  { id: 'OF-KRZ', name: 'Karazhanbas', coords: [44.6, 51.2], type: 'OIL', size: 'M' },
  { id: 'OF-KLM', name: 'Kalamkas', coords: [45.5, 51.0], type: 'OIL', size: 'M' },
];

export const GAS_FIELDS = [
  { id: 'GF-KRC', name: 'Karachaganak', coords: [51.4, 51.8], type: 'GAS', size: 'XL' },
  { id: 'GF-AMN', name: 'Amangeldy', coords: [43.8, 70.5], type: 'GAS', size: 'M' },
  { id: 'GF-IMS', name: 'Imashevskoye', coords: [47.5, 52.0], type: 'GAS', size: 'M' },
];

export const REFINERIES = [
  { id: 'REF-ATY', name: 'Atyrau Refinery', coords: [47.10, 51.92], capacity: '5.5 Mt/y' },
  { id: 'REF-PAV', name: 'Pavlodar Refinery', coords: [52.30, 76.95], capacity: '6.0 Mt/y' },
  { id: 'REF-SHY', name: 'Shymkent (PKOP)', coords: [42.32, 69.60], capacity: '6.0 Mt/y' },
  { id: 'REF-AKT', name: 'Caspi Bitum', coords: [43.65, 51.16], capacity: '1.0 Mt/y' },
];

export const PIPELINES = [
  // Oil (Orange #FF6B35)
  { id: 'PL-CPC', type: 'OIL', from: [46.0, 53.4], to: [47.10, 51.92], label: 'CPC Pipeline', width: 2.8 },
  { id: 'PL-ATY-SAM', type: 'OIL', from: [47.10, 51.92], to: [51.3, 51.4], label: 'Atyrau-Samara Export', width: 2.4 },
  { id: 'PL-KZ-CN-1', type: 'OIL', from: [47.10, 51.92], to: [45.8, 65.5], label: 'Atyrau-Kumkol Oil', width: 2.2 },
  { id: 'PL-KZ-CN-2', type: 'OIL', from: [45.8, 65.5], to: [45.22, 82.97], label: 'Kumkol-China Oil', width: 2.2 },
  { id: 'PL-FLD-1', type: 'OIL', from: [46.5, 51.2], to: [47.10, 51.92], label: 'Kashagan-Refinery', width: 1.8 },
  { id: 'PL-FLD-2', type: 'OIL', from: [51.4, 51.8], to: [51.3, 51.4], label: 'Karachaganak-Samara', width: 1.8 },
  { id: 'PL-FLD-3', type: 'OIL', from: [43.4, 52.8], to: [46.0, 53.4], label: 'Uzen-Tengiz', width: 1.8 },
  { id: 'PL-FLD-4', type: 'OIL', from: [50.0, 56.5], to: [47.10, 51.92], label: 'Zhanazhol-Refinery', width: 1.8 },
  { id: 'PL-OMSK-PAV', type: 'OIL', from: [52.3, 76.95], to: [55.0, 77.0], label: 'Omsk-Pavlodar Line', width: 2.0 },
  
  // Gas (Cyan #00A6D6)
  { id: 'PL-CAC-1', type: 'GAS', from: [45.30, 53.00], to: [47.10, 51.92], label: 'Central Asia-Center (CAC)', width: 2.4 },
  { id: 'PL-CAC-2', type: 'GAS', from: [47.10, 51.92], to: [51.4, 51.8], label: 'CAC Northern Leg', width: 2.0 },
  { id: 'PL-KZ-CN-G', type: 'GAS', from: [42.30, 69.60], to: [45.22, 82.97], label: 'Kazakhstan-China Gas', width: 2.6 },
  { id: 'PL-BBS-1', type: 'GAS', from: [45.00, 53.00], to: [45.8, 65.5], label: 'Beyneu-Bozoy Gas', width: 2.0 },
  { id: 'PL-BBS-2', type: 'GAS', from: [45.8, 65.5], to: [42.30, 69.60], label: 'Bozoy-Shymkent Gas', width: 2.0 },
  { id: 'PL-FLD-G1', type: 'GAS', from: [51.4, 51.8], to: [47.10, 51.92], label: 'Karachaganak-Gas', width: 1.6 },
  { id: 'PL-SARYARKA', type: 'GAS', from: [42.3, 69.6], to: [51.17, 71.45], label: 'Saryarka Project (Shymkent-Astana)', width: 2.2 },
];
