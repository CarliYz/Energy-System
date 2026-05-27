const DATA = {
  "id": "ANO-2026-0489",
  "case_id": "CASE-2026-008",
  "facility_id": "FAC-KZ-KAR-SMR-014",
  "facility_name": "Karaganda Black-Metals Smelter",
  "facility_type": "INDUSTRIAL_LOAD",
  "enterprise_id": "ENT-KZ-KAR-0214",
  "enterprise_name": "Saryarka Steel & Alloys JSC",
  "severity": "WARNING",
  "priority": "MEDIUM",
  "metric": {
    "name": "ELECTRICITY",
    "unit": "MWh per 15-min",
    "display_unit": "MWh/h",
    "baseline_daily": 1840
  },
  "detected_at": "2026-05-26T10:48:00Z",
  "pattern_type": "NIGHT_COVERT_PRODUCTION",
  "kpis": {
    "deviation_duration_h": 96,
    "max_deviation_pct": 24.5,
    "morphology_similarity_score": 0.74,
    "ai_confidence": 0.79,
    "similar_historical_cases": 2
  },
  "ai_explanation": {
    "headline": "Night-time consumption +24.5% vs baseline; possible covert production.",
    "detail": "Smelter's electricity profile shows persistent night-time elevation over 4 days. Pattern matches industry 'unreported night-shift' fingerprint."
  },
  "hypotheses": [
    {
      "rank": 1,
      "title": "Unreported night shift",
      "probability": 0.58
    },
    {
      "rank": 2,
      "title": "Equipment efficiency loss",
      "probability": 0.28
    },
    {
      "rank": 3,
      "title": "Tariff arbitrage",
      "probability": 0.14
    }
  ]
};
export default DATA;
