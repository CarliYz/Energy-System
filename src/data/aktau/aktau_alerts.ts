const DATA = {
  "alerts": [
    {
      "id": "ANO-2026-0512",
      "node_id": "FAC-KZ-AKT-GCS-001",
      "severity": "CRITICAL",
      "priority": "HIGH",
      "title": "Gas Compressor pressure surge detected",
      "description": "Discharge pressure +38% above baseline over 72h window. Pattern matches historical case ANO-2025-0317 (similarity 0.87). Vibration anomaly on Compressor Unit #2.",
      "detected_at": "2026-05-28T14:32:00Z",
      "case_id": "CASE-2026-001",
      "actions": [
        "VIEW_ANOMALY",
        "DISPATCH"
      ]
    },
    {
      "id": "ANO-2026-0498",
      "node_id": "FAC-KZ-AKT-DSL-001",
      "severity": "WARNING",
      "priority": "MEDIUM",
      "title": "Desalination plant flow degradation",
      "description": "Flow rate output -8% over 24h. Possible membrane fouling. Cross-checked against feed pump telemetry.",
      "detected_at": "2026-05-28T08:22:00Z",
      "actions": [
        "VIEW_ANOMALY"
      ]
    },
    {
      "id": "ANO-2026-0501",
      "node_id": "FAC-KZ-AKT-GCS-002",
      "severity": "WARNING",
      "priority": "MEDIUM",
      "title": "Uzen Compressor pressure drift",
      "description": "Pressure drift exceeds 2σ baseline. May propagate downstream to GCS-001 main station.",
      "detected_at": "2026-05-28T12:15:00Z",
      "actions": [
        "VIEW_ANOMALY"
      ]
    },
    {
      "id": "ANO-2026-0489",
      "node_id": "FAC-KZ-AKT-MTR-002",
      "severity": "WARNING",
      "priority": "LOW",
      "title": "Uzen metering cross-check discrepancy",
      "description": "Custody transfer reading +6.2% vs SCADA reconciled value. May indicate sensor drift or unreported production.",
      "detected_at": "2026-05-28T10:48:00Z",
      "actions": [
        "VIEW_ANOMALY"
      ]
    },
    {
      "id": "ANO-2026-0476",
      "node_id": "FAC-KZ-AKT-OWF-006",
      "severity": "WARNING",
      "priority": "LOW",
      "title": "Zhetybai mature field output decline",
      "description": "Output -12% over 7 days. Above natural depletion rate. Possible wellbore issue.",
      "detected_at": "2026-05-28T07:14:00Z",
      "actions": [
        "VIEW_ANOMALY"
      ]
    },
    {
      "id": "SYS-2026-0044",
      "node_id": "FAC-KZ-AKT-SUB-004",
      "severity": "OFFLINE",
      "priority": "MEDIUM",
      "title": "Substation 110kV heartbeat lost",
      "description": "No telemetry received since 09:18. Last reported state was nominal. Field team dispatch recommended.",
      "detected_at": "2026-05-28T09:18:00Z",
      "actions": [
        "VIEW_NODE",
        "REQUEST_CHECK"
      ]
    }
  ]
};
export default DATA;
