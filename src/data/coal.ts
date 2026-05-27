export const COAL_BASINS = [
  { id: 'B-EKB', name: 'Ekibastuz Basin', coords: [51.7, 75.3], type: 'Open-cast', reserves: '12.5 Gt', color: '#D8454C',
    isLargest: true,
    region: 'Pavlodar',
    note: 'KZ Largest Coal Basin · Future Data Center Cluster' },
  { id: 'B-KAR', name: 'Karaganda Basin', coords: [49.8, 73.1], type: 'Underground', reserves: '9.1 Gt', color: '#3A3A3A', region: 'Karaganda' },
  { id: 'B-MAI', name: 'Maikuben Basin', coords: [51.5, 78.2], type: 'Open-cast', reserves: '3.0 Gt', color: '#5A4A3A', region: 'Pavlodar' },
  { id: 'B-TUR', name: 'Turgay Basin', coords: [50.5, 64.0], type: 'Open-cast', reserves: '5.8 Gt', color: '#5A4A3A', region: 'Kostanay' },
];

export const COAL_MINES = [
  { id: 'M-BGT', name: 'Bogatyr', basin: 'Ekibastuz', coords: [51.72, 75.35], type: 'Open-cast' },
  { id: 'M-VST', name: 'Vostochny', basin: 'Ekibastuz', coords: [51.75, 75.45], type: 'Open-cast' },
  { id: 'M-SHK', name: 'Shakhtinsk', basin: 'Karaganda', coords: [49.82, 72.58], type: 'Underground' },
  { id: 'M-SHB', name: 'Shubarkol', basin: 'Central', coords: [48.75, 68.75], type: 'Open-cast' },
];

export const MINE_MOUTH_PLANTS = [
  { id: 'MMP-EKB-1', name: 'Ekibastuz GRES-1', mw: 4000, coords: [51.72, 75.36], isMajor: true, fuel: 'Coal',
    note: 'KZ Largest · Powers Pavlodar Data Center Cluster' },
  { id: 'MMP-EKB-2', name: 'Ekibastuz GRES-2', mw: 1000, coords: [51.70, 75.30], isMajor: true, fuel: 'Coal' },
  { id: 'MMP-AKS-1', name: 'Aksu Power Station', mw: 2100, coords: [52.00, 76.93], isMajor: true, fuel: 'Coal',
    note: 'Pavlodar Region — Critical Grid Node' },
];

export const URANIUM_MINES = [
  { id: 'U-INK', name: 'Inkai', coords: [44.5, 67.5], capacity: '2,200 tU/y' },
  { id: 'U-TRT', name: 'Tortkuduk', coords: [44.2, 67.0], capacity: '4,000 tU/y' },
  { id: 'U-BDN', name: 'Budenovskoye', coords: [44.8, 68.5], capacity: '2,000 tU/y' },
];

export const COAL_RAIL = [
  { id: 'R-EKB-RUS', from: [51.72, 75.36], to: [55.0, 75.0], label: 'Ekibastuz-Russia Export' },
  { id: 'R-EKB-AST', from: [51.72, 75.36], to: [51.17, 71.45], label: 'Ekibastuz-Astana' },
  { id: 'R-KAR-SHY', from: [49.80, 73.08], to: [42.30, 69.59], label: 'Karaganda-South' },
  { id: 'R-PAV-RUS', from: [52.28, 76.95], to: [55.0, 78.0], label: 'Pavlodar-Russia' },
  { id: 'R-UKG-RUS', from: [49.94, 82.62], to: [51.0, 84.0], label: 'UKG-Russia' },
  { id: 'R-SHB-KAR', from: [48.75, 68.75], to: [49.80, 73.08], label: 'Shubarkol-Karaganda' },
  { id: 'R-TUR-AST', from: [50.5, 64.0], to: [51.17, 71.45], label: 'Turgay-Astana' },
  { id: 'R-URA-SOUTH', from: [44.5, 67.5], to: [42.30, 69.59], label: 'Uranium-Shymkent' },
  { id: 'R-URA-CENT', from: [44.8, 68.5], to: [48.75, 68.75], label: 'Uranium-Central' },
];
