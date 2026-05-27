export const CITIES = {
  Astana: { coords: [51.1694, 71.4491], code: 'AST' },
  Almaty: { coords: [43.2220, 76.9286], code: 'ALM' },
  Aktau: { coords: [43.6532, 51.1605], code: 'AKT' },
  Atyrau: { coords: [47.0945, 51.9237], code: 'ATY' },
  Karaganda: { coords: [49.8047, 73.0875], code: 'KAR' },
  Shymkent: { coords: [42.3000, 69.5901], code: 'SHY' },
  Aktobe: { coords: [50.2839, 57.1664], code: 'AKB' },
  Pavlodar: { coords: [52.2873, 76.9595], code: 'PAV' },
  UstKamenogorsk: { coords: [49.9483, 82.6280], code: 'UKG' },
  Kostanay: { coords: [53.2198, 63.6354], code: 'KOS' },
};

export const FACILITIES = [
  { id: 'FAC-KZ-AKT-GCS-001', name: 'Aktau Gas Compressor Station', type: 'GCS', region: 'Aktau', status: 'ACTIVE', coords: [43.6532, 51.1605], capacity: '8.5M m³/d' },
  { id: 'FAC-KZ-AST-PWR-001', name: 'Astana Thermal Power Plant 2', type: 'PWR', region: 'Astana', status: 'ACTIVE', coords: [51.1694, 71.4491], capacity: '1.2 GW' },
  { id: 'FAC-KZ-ALM-PWR-002', name: 'Almaty CHP-2', type: 'CHP', region: 'Almaty', status: 'ACTIVE', coords: [43.2220, 76.9286], capacity: '510 MW' },
  { id: 'FAC-KZ-KAR-MIN-004', name: 'Karaganda Central Coal Mine', type: 'MIN', region: 'Karaganda', status: 'WARNING', coords: [49.8047, 73.0875], capacity: '2.4M T/y' },
  { id: 'FAC-KZ-ATY-REF-001', name: 'Atyrau Refinery Complex', type: 'REF', region: 'Atyrau', status: 'ACTIVE', coords: [47.0945, 51.9237], capacity: '120k bpd' },
  { id: 'FAC-KZ-AKB-OWF-055', name: 'Zhanazhol Oil Wellfield', type: 'OWF', region: 'Aktobe', status: 'ACTIVE', coords: [50.2839, 57.1664], capacity: '45k bpd' },
  { id: 'FAC-KZ-UKG-PWR-003', name: 'Ust-Kamenogorsk Hydro Station', type: 'PWR', region: 'UstKamenogorsk', status: 'ACTIVE', coords: [49.9483, 82.6280], capacity: '330 MW' },
];

export const ANOMALIES = [
  { id: 'ANO-2026-0512', severity: 'HIGH', facilityId: 'FAC-KZ-AKT-GCS-001', type: 'PRESSURE', detected: '2026-05-18 14:32', description: 'Significant deviation from historical baseline recorded at main compressor outlet.' },
  { id: 'ANO-2026-0511', severity: 'MEDIUM', facilityId: 'FAC-KZ-ATY-REF-001', type: 'FLOW', detected: '2026-05-18 13:08', description: 'Unexplained flow rate drop in pipeline segment PL-KZ-ATY-N12.' },
];

export const ENTERPRISES = [
  { id: 'ENT-KZ-AKT-0091', name: 'KazMunayGas Aktau Division', type: 'Energy Production', registered: '2015-03', employees: 1240, status: 'HIGH RISK' },
  { id: 'ENT-KZ-AST-0402', name: 'Central Power Distribution', type: 'Grid Operations', registered: '2010-06', employees: 3500, status: 'NOMINAL' },
];
