// src/data/bollinger_capacity.ts

export type BollingerStatus = 'ok' | 'warning' | 'breach';

export interface EnterpriseCapacity {
  id: string;
  name: string;
  sigma: number;
  status: BollingerStatus;
  hypothesis: 'Strike' | 'AgingEquipment' | 'PipelineMaintenance' | 'Weather' | 'OilfieldRepair' | null;
}

export interface KlinePoint {
  date: string;
  value: number;
  upper: number;
  lower: number;
  mid: number;
  breach: boolean;
  forecast?: boolean;
}

// Generate 60 historical days plus 7 forecast days
const generateKlineData = (): KlinePoint[] => {
  const data: KlinePoint[] = [];
  const baseValue = 410;
  const startDate = new Date('2026-03-22');

  for (let i = 0; i < 67; i++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + i);
    const dateStr = currentDate.toISOString().split('T')[0];

    const isForecast = i >= 60;
    
    // Smooth deterministic sinus wave + slight noise
    const wave = Math.sin(i * 0.25) * 8;
    const noise = Math.sin(i * 1.5) * 4;
    
    let value = baseValue + wave + noise;
    
    // For forecast data, create a downward trend (simulating the AI prediction of downward capacity)
    if (isForecast) {
      const forecastTrend = (i - 60) * -3.5;
      value = baseValue + wave + noise + forecastTrend - 5;
    }

    const mid = baseValue + wave + (isForecast ? (i - 60) * -2.5 : 0);
    const upper = mid + 12;
    const lower = mid - 12;

    // Introduce deliberate breaches on historical dates
    let breach = false;
    if (!isForecast) {
      if (i === 12 || i === 25 || i === 42 || i === 54 || i === 57) {
        value = lower - 4; // drops below lower boundary
        breach = true;
      }
    } else {
      // Forecast has some drop
      if (value < lower) {
        breach = true;
      }
    }

    data.push({
      date: dateStr,
      value: Math.round(value * 10) / 10,
      upper: Math.round(upper * 10) / 10,
      lower: Math.round(lower * 10) / 10,
      mid: Math.round(mid * 10) / 10,
      breach,
      forecast: isForecast
    });
  }

  return data;
};

export const bollingerData = {
  gdpTarget: 5.5,
  oilGasShareTarget: 40,
  todayCompliance: { ok: 83, total: 91, breach: 8 },
  kline: generateKlineData(),
  enterprises: [
    { id: 'KMG', name: 'KazMunayGas', sigma: -3.2, status: 'breach', hypothesis: 'Strike' },
    { id: 'Chevron', name: 'Chevron KZ', sigma: -2.1, status: 'warning', hypothesis: 'AgingEquipment' },
    { id: 'Tengiz', name: 'Tengizchevroil', sigma: 0.1, status: 'ok', hypothesis: null },
    { id: 'CNPC', name: 'CNPC Aktobe', sigma: 0.4, status: 'ok', hypothesis: null },
    { id: 'Karachaganak', name: 'Karachaganak Petroleum', sigma: -1.9, status: 'warning', hypothesis: 'PipelineMaintenance' },
    { id: 'Maek', name: 'MAEK Kazatomprom', sigma: -2.8, status: 'breach', hypothesis: 'Weather' },
    { id: 'Kaspian', name: 'Caspi Bitum', sigma: 0.2, status: 'ok', hypothesis: null },
    { id: 'Atyrau', name: 'Atyrau Refinery', sigma: -3.5, status: 'breach', hypothesis: 'OilfieldRepair' },
    { id: 'Pavlodar', name: 'Pavlodar Petrochemical', sigma: -0.5, status: 'ok', hypothesis: null },
    { id: 'Shymkent', name: 'Shymkent Refinery', sigma: -2.4, status: 'warning', hypothesis: 'AgingEquipment' },
    { id: 'Aktobe', name: 'Aktobemunaigas', sigma: 0.8, status: 'ok', hypothesis: null },
    { id: 'Mangistau', name: 'Mangistaumunaigaz', sigma: -3.1, status: 'breach', hypothesis: 'Strike' },
    { id: 'Zhanazhol', name: 'Zhanazhol Gas Plant', sigma: -0.2, status: 'ok', hypothesis: null }
  ] as EnterpriseCapacity[]
};
