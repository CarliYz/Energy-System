export const CITIES = [
  { code: 'AST', name: 'ASTANA', coords: [51.1694, 71.4491], region: 'CENTRAL', population: '1.2M', facilities: 24, substations: 8, isCapital: true },
  { code: 'ALM', name: 'ALMATY', coords: [43.2220, 76.9286], region: 'SOUTHEAST', population: '2.1M', facilities: 32, substations: 12 },
  { code: 'AKT', name: 'AKTAU', coords: [43.6532, 51.1605], region: 'WEST', population: '180k', facilities: 12, substations: 4 },
  { code: 'ATY', name: 'ATYRAU', coords: [47.0945, 51.9237], region: 'WEST', population: '300k', facilities: 18, substations: 6 },
  { code: 'KAR', name: 'KARAGANDA', coords: [49.8047, 73.0875], region: 'CENTRAL', population: '500k', facilities: 20, substations: 10 },
  { code: 'SHY', name: 'SHYMKENT', coords: [42.3000, 69.5901], region: 'SOUTH', population: '1.1M', facilities: 15, substations: 7 },
  { code: 'AKB', name: 'AKTOBE', coords: [50.2839, 57.1664], region: 'WEST', population: '520k', facilities: 14, substations: 5 },
  { code: 'PAV', name: 'PAVLODAR', coords: [52.2873, 76.9595], region: 'NORTH', population: '330k', facilities: 22, substations: 9 },
  { code: 'UKG', name: 'OSKEMEN', coords: [49.9483, 82.6280], region: 'EAST', population: '350k', facilities: 16, substations: 8 },
  { code: 'KOS', name: 'KOSTANAY', coords: [53.2198, 63.6354], region: 'NORTH', population: '250k', facilities: 10, substations: 4 },
  { code: 'TAR', name: 'TARAZ', coords: [42.9000, 71.3667], region: 'SOUTH', population: '360k', facilities: 8, substations: 3 },
  { code: 'URL', name: 'ORAL', coords: [51.2333, 51.3700], region: 'WEST', population: '310k', facilities: 9, substations: 4 },
  { code: 'PET', name: 'PETROPAVL', coords: [54.8833, 69.1500], region: 'NORTH', population: '220k', facilities: 7, substations: 3 },
  { code: 'KOK', name: 'KOKSHETAU', coords: [53.2833, 69.4000], region: 'NORTH', population: '150k', facilities: 6, substations: 2 },
  { code: 'KYZ', name: 'KYZYLORDA', coords: [44.8488, 65.5333], region: 'SOUTH', population: '240k', facilities: 5, substations: 3 },
];

export const KAZAKHSTAN_BORDER: [number, number][] = [
  [51.2, 51.3], [54.8, 61.3], [55.4, 69.0], [54.4, 75.0], [53.5, 76.5], [51.0, 79.5], [51.5, 84.5], 
  [49.5, 87.5], [47.5, 85.0], [45.0, 82.5], [42.0, 80.0], [42.5, 71.0], [40.5, 68.0], [41.5, 59.0], 
  [44.5, 54.0], [46.5, 49.0], [49.5, 46.5], [51.0, 50.0], [51.2, 51.3]
];

export const NEIGHBORS = [
  { name: 'RUSSIA', coords: [56.0, 70.0], country: 'RU' },
  { name: 'CHINA', coords: [45.0, 83.0], country: 'CN' },
  { name: 'UZBEKISTAN', coords: [43.0, 60.0], country: 'UZ' },
  { name: 'KYRGYZSTAN', coords: [42.5, 75.0], country: 'KG' },
  { name: 'TURKMENISTAN', coords: [41.0, 55.0], country: 'TM' },
];
