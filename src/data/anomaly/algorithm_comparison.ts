const DATA = {
  "for_anomaly": "ANO-2026-0512",
  "algorithms": [
    {
      "id": "THRESHOLD",
      "name": "Fixed Threshold",
      "description": "Industry-standard fixed upper/lower bounds (e.g. +50% over baseline).",
      "verdict": {
        "anomaly_detected": false,
        "reason": "Maximum point value never exceeds +50% absolute threshold. Method blind to morphological / persistent-pattern anomalies.",
        "false_negative_risk": "HIGH"
      },
      "limitations": [
        "Cannot detect persistent-pattern anomalies",
        "Cannot learn diurnal / weekly rhythms",
        "Static thresholds become stale as operations evolve"
      ]
    },
    {
      "id": "STATISTICAL",
      "name": "Statistical (Rolling Mean ± 2σ)",
      "description": "24-hour rolling mean ± 2 standard deviations.",
      "verdict": {
        "anomaly_detected": true,
        "reason": "Detects elevation but underestimates severity. Drift-blindness: as anomaly persists, the moving average rises and the band 'follows' the anomaly, hiding it.",
        "false_negative_risk": "MEDIUM",
        "false_positive_risk": "MEDIUM"
      },
      "limitations": [
        "Drift-blind to slow, persistent shifts",
        "Cannot distinguish operational from regulatory anomalies",
        "No natural-language explanation"
      ]
    },
    {
      "id": "LLM_TS",
      "name": "LLM Time-Series Model",
      "description": "Foundation model trained on 12 months of multi-modal facility data, with learned diurnal/weekly/seasonal patterns and cross-facility benchmarks.",
      "verdict": {
        "anomaly_detected": true,
        "reason": "Detects persistent night-time over-throughput pattern with high confidence. Provides natural-language explanation and candidate hypotheses. Cross-references historical similar cases.",
        "confidence": 0.87
      },
      "advantages": [
        "Captures morphological / persistent-pattern anomalies",
        "Learns facility-specific operational fingerprint",
        "Provides natural-language explanation + hypotheses",
        "Cross-references historical similar cases",
        "Forecasts future risk evolution"
      ]
    }
  ]
};
export default DATA;
