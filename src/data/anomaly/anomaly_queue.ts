const DATA = [
  {
    "id": "ANO-2026-0512",
    "facility_id": "FAC-KZ-AKT-GCS-001",
    "facility_name": "Aktau Main Compressor Station",
    "severity": "CRITICAL",
    "detected_at": "2026-05-28T14:32:00Z",
    "headline": "Night-time gas throughput exceeds learned baseline by +38% over 6 working days.",
    "max_deviation_pct": 40.4,
    "ai_confidence": 0.87,
    "metric_name": "GAS_THROUGHPUT"
  },
  {
    "id": "ANO-2026-0489",
    "facility_id": "FAC-KZ-KAR-SMR-014",
    "facility_name": "Karaganda Black-Metals Smelter",
    "severity": "WARNING",
    "detected_at": "2026-05-26T10:48:00Z",
    "headline": "Night-time consumption +24.5% vs baseline; possible covert production.",
    "max_deviation_pct": 24.5,
    "ai_confidence": 0.79,
    "metric_name": "ELECTRICITY"
  },
  {
    "id": "ANO-2026-0501",
    "facility_id": "FAC-KZ-AKT-GCS-002",
    "facility_name": "Uzen Compressor Station",
    "severity": "WARNING",
    "metric_name": "PRESSURE",
    "detected_at": "2026-05-28T12:15:00Z",
    "headline": "Suction pressure drift exceeds 2σ baseline",
    "max_deviation_pct": 11.4,
    "ai_confidence": 0.71
  },
  {
    "id": "ANO-2026-0498",
    "facility_id": "FAC-KZ-AKT-DSL-001",
    "facility_name": "MAEK Desalination Plant",
    "severity": "WARNING",
    "metric_name": "FLOW_RATE",
    "detected_at": "2026-05-28T08:22:00Z",
    "headline": "Output flow degradation -8% over 24h window",
    "max_deviation_pct": 8.2,
    "ai_confidence": 0.68
  },
  {
    "id": "ANO-2026-0476",
    "facility_id": "FAC-KZ-AKT-OWF-006",
    "facility_name": "Zhetybai Mature Field",
    "severity": "WARNING",
    "metric_name": "OIL_OUTPUT",
    "detected_at": "2026-05-28T07:14:00Z",
    "headline": "Output decline -12% above natural depletion rate",
    "max_deviation_pct": 12.3,
    "ai_confidence": 0.66
  },
  {
    "id": "ANO-2026-0445",
    "facility_id": "FAC-KZ-PAV-EKB-001",
    "facility_name": "Ekibastuz GRES-1 Unit 3",
    "severity": "WARNING",
    "metric_name": "STEAM_PRESSURE",
    "detected_at": "2026-05-27T22:01:00Z",
    "headline": "Steam pressure morphology shift detected",
    "max_deviation_pct": 6.8,
    "ai_confidence": 0.62
  }
];
export default DATA;
