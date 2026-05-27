const DATA = {
  "main_case": {
    "id": "CASE-2026-001",
    "title": "Western Caspian — Suspected Coordinated Evasion Network",
    "subject_enterprise": "ENT-KZ-AKT-0091",
    "subject_enterprise_name": "Western Caspian Energy LLC",
    "triggering_anomaly": "ANO-2026-0512",
    "current_status": "ACTIVE",
    "current_escalation_level": "MINISTERIAL",
    "total_elapsed_time": "11d 6h",
    "longest_bottleneck": "DEPT HEAD APPROVAL",
    "longest_bottleneck_duration": "4d 6h",
    "return_count": 1,
    "approval_count": 9,
    "final_status": "Active",
    "initiated_at": "2026-05-28T14:32:00Z",
    "last_updated": "2026-06-08T20:46:00Z"
  },
  "ai_outputs": [
    {
      "id": "AIOUT-001",
      "source_agent": "LLM TIME-SERIES MODEL",
      "source_page": "2.1",
      "confidence_level": "HIGH",
      "confidence_score": 0.87,
      "headline": "ANO-2026-0512 — Gas throughput +40% night-time",
      "detected_at": "2026-05-28T14:32:00Z",
      "summary": "Pattern matches 2025-0317 historical case (similarity 0.87)",
      "status": "CONFIRMED",
      "human_action": "Confirmed without modification"
    },
    {
      "id": "AIOUT-002",
      "source_agent": "MASTER AUDIT AGENT",
      "source_page": "3.1",
      "confidence_level": "HIGH",
      "confidence_score": 0.85,
      "headline": "CASE-2026-001 — 85% Unreported Capacity Expansion",
      "detected_at": "2026-05-28T15:08:00Z",
      "summary": "6 specialist agents converge from non-overlapping evidence",
      "status": "CONFIRMED",
      "human_action": "Confirmed without modification"
    },
    {
      "id": "AIOUT-003",
      "source_agent": "ONTOLOGY ENGINE V2.1",
      "source_page": "3.2",
      "confidence_level": "HIGH",
      "confidence_score": 0.82,
      "headline": "GRAPH-CASE-2026-001 — Coordinated Evasion Network",
      "detected_at": "2026-05-28T16:24:00Z",
      "summary": "28 nodes / 5 layers / 3 critical paths / shared meter smoking gun",
      "status": "CONFIRMED",
      "human_action": "Confirmed without modification"
    },
    {
      "id": "AIOUT-004",
      "source_agent": "CROSS-SYSTEM VERIFIER",
      "source_page": "2.2",
      "confidence_level": "MEDIUM",
      "confidence_score": 0.74,
      "headline": "Tax +18% / Customs +12% vs production basis",
      "detected_at": "2026-05-29T09:14:00Z",
      "summary": "Physical-economic identity violation across 3 agencies",
      "status": "MODIFIED",
      "human_action": "Analyst adjusted tax-customs reconciliation method"
    },
    {
      "id": "AIOUT-005",
      "source_agent": "APPROVAL AGENT",
      "source_page": "3.1",
      "confidence_level": "HIGH",
      "confidence_score": 0.82,
      "headline": "APP-2026-0078 overdue 45+ days",
      "detected_at": "2026-05-28T15:08:00Z",
      "summary": "Pre-approval commissioning of Unit-2C suspected",
      "status": "CONFIRMED"
    },
    {
      "id": "AIOUT-006",
      "source_agent": "SANCTION AGENT",
      "source_page": "3.1",
      "confidence_level": "HIGH",
      "confidence_score": 0.91,
      "headline": "Repeat-offender pattern 0.87 similarity to 2025 case",
      "detected_at": "2026-05-28T15:08:00Z",
      "summary": "Article 47 escalation applies",
      "status": "CONFIRMED"
    },
    {
      "id": "AIOUT-007",
      "source_agent": "INSPECTION AGENT",
      "source_page": "3.1",
      "confidence_level": "MEDIUM",
      "confidence_score": 0.74,
      "headline": "Inspection coverage gap — 25% only",
      "detected_at": "2026-05-28T15:08:00Z",
      "summary": "Station 7 (Unit-2C location) NOT inspected",
      "status": "CONFIRMED"
    },
    {
      "id": "AIOUT-008",
      "source_agent": "REPORT GENERATOR",
      "source_page": "4.2",
      "confidence_level": "HIGH",
      "confidence_score": 0.93,
      "headline": "Minister briefing draft generated",
      "detected_at": "2026-06-02T11:08:00Z",
      "summary": "Auto-drafted from 6 evidence sources with data snapshot",
      "status": "MODIFIED",
      "human_action": "Director edited paragraphs 3 and 5"
    },
    {
      "id": "AIOUT-009",
      "source_agent": "JOINT INVESTIGATION COORDINATOR",
      "source_page": "3.2",
      "confidence_level": "MEDIUM",
      "confidence_score": 0.79,
      "headline": "Recommend interagency case opening",
      "detected_at": "2026-05-28T16:24:00Z",
      "summary": "5 participants: MoE / Tax / Customs / FinMon / Audit",
      "status": "CONFIRMED"
    }
  ],
  "workflow_nodes": [
    {
      "id": "NODE-01",
      "step_number": 1,
      "title": "AI DETECTED",
      "category": "AI_AUTO",
      "owner": "AI-CORE",
      "source_page": "2.1",
      "status": "COMPLETED",
      "start_time": "2026-05-28T14:32:00Z",
      "end_time": "2026-05-28T14:32:18Z",
      "duration": "18s",
      "ai_output_id": "AIOUT-001",
      "description": "LLM Time-Series model detected sustained night-time anomaly pattern.",
      "ai_output_snippet": "Pattern morphology matches historical case ANO-2025-0317 (similarity 0.87). Confidence 0.87."
    },
    {
      "id": "NODE-02",
      "step_number": 2,
      "title": "AI ATTRIBUTION",
      "category": "AI_AUTO",
      "owner": "AI-CORE",
      "source_page": "3.1",
      "status": "COMPLETED",
      "start_time": "2026-05-28T14:32:18Z",
      "end_time": "2026-05-28T15:08:00Z",
      "duration": "36m",
      "ai_output_id": "AIOUT-002",
      "description": "6 specialist agents + Master agent synthesized 85% unreported capacity verdict.",
      "ai_output_snippet": "Primary cause: UNREPORTED_CAPACITY_EXPANSION (probability 0.85). 6 lanes converge from non-overlapping evidence."
    },
    {
      "id": "NODE-03",
      "step_number": 3,
      "title": "CROSS-SYSTEM VERIFY",
      "category": "AI_AUTO",
      "owner": "AI-CORE",
      "source_page": "2.2",
      "status": "MODIFIED",
      "start_time": "2026-05-28T15:08:00Z",
      "end_time": "2026-05-29T09:14:00Z",
      "duration": "18h 6m",
      "ai_output_id": "AIOUT-004",
      "description": "Cross-system verifier identified physical-economic inconsistency across 3 agencies.",
      "ai_output_snippet": "Tax revenue +18% above production basis. Customs export +12% over reported.",
      "human_modification": {
        "modified_by": "ANALYST-K-0142",
        "modified_at": "2026-05-29T09:14:00Z",
        "modification": "Refined tax-customs reconciliation method to account for FX timing differences.",
        "reason": "Initial AI output overstated discrepancy by ~3% due to currency timing."
      }
    },
    {
      "id": "NODE-04",
      "step_number": 4,
      "title": "GRAPH ANALYSIS",
      "category": "AI_AUTO",
      "owner": "AI-CORE",
      "source_page": "3.2",
      "status": "COMPLETED",
      "start_time": "2026-05-29T09:14:00Z",
      "end_time": "2026-05-29T16:48:00Z",
      "duration": "7h 34m",
      "ai_output_id": "AIOUT-003",
      "description": "Ontology engine traversed 5 layers and identified coordinated evasion network.",
      "ai_output_snippet": "28 nodes / 35 edges / 3 critical paths. Shared meter METER-AKT-044 is smoking gun."
    },
    {
      "id": "NODE-05",
      "step_number": 5,
      "title": "ANALYST REVIEW",
      "category": "HUMAN",
      "owner": "ANALYST-K-0142",
      "owner_name": "D. M. Almagambetov",
      "status": "RETURNED_AND_RESUBMITTED",
      "start_time": "2026-05-29T16:48:00Z",
      "end_time": "2026-06-03T11:24:00Z",
      "duration": "4d 18h 36m",
      "description": "Initial review rejected by Dept Head; resubmitted with corrections.",
      "review_history": [
        {
          "version": 1,
          "submitted_at": "2026-05-29T16:48:00Z",
          "submitted_to_review_at": "2026-05-30T10:00:00Z",
          "verdict": "RETURNED",
          "feedback": "Evidence chain incomplete — Article 47 invocation requires explicit cross-referencing of CASE-2025-088 closure documents."
        },
        {
          "version": 2,
          "submitted_at": "2026-06-03T11:24:00Z",
          "verdict": "APPROVED",
          "feedback": "Evidence chain now complete. Ready for Dept Head approval."
        }
      ]
    },
    {
      "id": "NODE-06",
      "step_number": 6,
      "title": "DEPT HEAD APPROVAL",
      "category": "HUMAN",
      "owner": "DIRECTOR-K-0044",
      "owner_name": "K. T. Zhumagulov",
      "status": "REJECTED_THEN_APPROVED",
      "start_time": "2026-05-30T10:00:00Z",
      "end_time": "2026-06-04T16:12:00Z",
      "duration": "5d 6h 12m",
      "is_bottleneck": true,
      "bottleneck_rationale": "Returned analyst submission once for evidence completeness, then required 1d 12h re-review on resubmission.",
      "review_history": [
        {
          "round": 1,
          "received_at": "2026-05-30T10:00:00Z",
          "decided_at": "2026-06-01T14:22:00Z",
          "decision": "RETURNED",
          "feedback": "Article 47 escalation requires explicit linkage to prior closure docs.",
          "modified_ai_output": false
        },
        {
          "round": 2,
          "received_at": "2026-06-03T11:24:00Z",
          "decided_at": "2026-06-04T16:12:00Z",
          "decision": "APPROVED",
          "feedback": "Approved. Escalate to Cross-Agency Dispatch.",
          "modified_ai_output": false
        }
      ]
    },
    {
      "id": "NODE-07",
      "step_number": 7,
      "title": "CROSS-AGENCY DISPATCH",
      "category": "HUMAN_COORDINATION",
      "owner": "DIRECTOR-K-0044 → INTERAGENCY",
      "status": "IN_PROGRESS",
      "start_time": "2026-06-04T16:12:00Z",
      "end_time": null,
      "duration": "4d 4h (running)",
      "description": "Formal dispatch to Tax / Customs / Financial Monitoring / State Audit. Awaiting return signatures.",
      "participants": [
        {
          "agency": "Tax Authority",
          "status": "ACKNOWLEDGED",
          "ack_at": "2026-06-05T09:00:00Z"
        },
        {
          "agency": "Customs Service",
          "status": "ACKNOWLEDGED",
          "ack_at": "2026-06-05T11:18:00Z"
        },
        {
          "agency": "Financial Monitoring Agency",
          "status": "PENDING",
          "ack_at": null
        },
        {
          "agency": "State Audit Committee",
          "status": "PENDING",
          "ack_at": null
        }
      ]
    },
    {
      "id": "NODE-08",
      "step_number": 8,
      "title": "CASE INITIATED & ARCHIVED",
      "category": "AI_ASSISTED",
      "owner": "PMO + AI-CORE",
      "status": "PENDING",
      "start_time": null,
      "end_time": null,
      "duration": "—",
      "description": "Final case opening + archival to immutable audit ledger. Awaits all 4 agencies to sign."
    }
  ],
  "workflow_edges": [
    {
      "id": "E1",
      "from": "NODE-01",
      "to": "NODE-02",
      "type": "FORWARD",
      "status": "COMPLETED"
    },
    {
      "id": "E2",
      "from": "NODE-02",
      "to": "NODE-03",
      "type": "FORWARD",
      "status": "COMPLETED"
    },
    {
      "id": "E3",
      "from": "NODE-03",
      "to": "NODE-04",
      "type": "FORWARD",
      "status": "COMPLETED"
    },
    {
      "id": "E4",
      "from": "NODE-04",
      "to": "NODE-05",
      "type": "FORWARD",
      "status": "COMPLETED"
    },
    {
      "id": "E5",
      "from": "NODE-05",
      "to": "NODE-06",
      "type": "FORWARD",
      "status": "COMPLETED"
    },
    {
      "id": "E6",
      "from": "NODE-06",
      "to": "NODE-05",
      "type": "RETURN",
      "status": "RETURNED",
      "label": "RETURNED — evidence chain incomplete",
      "is_red_path": true,
      "occurred_at": "2026-06-01T14:22:00Z"
    },
    {
      "id": "E7",
      "from": "NODE-06",
      "to": "NODE-07",
      "type": "FORWARD",
      "status": "COMPLETED",
      "label": "APPROVED v2"
    },
    {
      "id": "E8",
      "from": "NODE-07",
      "to": "NODE-08",
      "type": "FORWARD",
      "status": "PENDING"
    }
  ],
  "bottlenecks": [
    {
      "rank": 1,
      "node_id": "NODE-06",
      "node_title": "DEPT HEAD APPROVAL",
      "duration": "5d 6h 12m",
      "rationale": "Returned once for evidence completeness, then required 1d 12h re-review on resubmission.",
      "est_savings": "4d 6h",
      "savings_method": "Pre-validate evidence completeness via AI before submission"
    },
    {
      "rank": 2,
      "node_id": "NODE-05",
      "node_title": "ANALYST REVIEW",
      "duration": "4d 18h 36m",
      "rationale": "Manual cross-comparison with SCADA logs and historical case archives.",
      "est_savings": "1d 12h",
      "savings_method": "AI auto-verification for high-confidence outputs"
    },
    {
      "rank": 3,
      "node_id": "NODE-07",
      "node_title": "CROSS-AGENCY DISPATCH",
      "duration": "4d 4h (running)",
      "rationale": "Serial dispatch to 4 agencies; 2 still pending acknowledgment.",
      "est_savings": "1d 18h",
      "savings_method": "Parallel dispatch with auto-escalation on 24h timeout"
    }
  ],
  "layer_timing": [
    {
      "layer": "Ministerial Level",
      "duration_hours": 32,
      "duration_label": "1d 8h"
    },
    {
      "layer": "Dept Head",
      "duration_hours": 102,
      "duration_label": "4d 6h"
    },
    {
      "layer": "Analyst",
      "duration_hours": 36,
      "duration_label": "1d 12h"
    },
    {
      "layer": "AI Auto",
      "duration_hours": 2,
      "duration_label": "0d 2h"
    },
    {
      "layer": "External Coordination",
      "duration_hours": 66,
      "duration_label": "2d 18h"
    }
  ],
  "compliance": {
    "overall_score": 100,
    "overall_status": "FULLY_COMPLIANT",
    "checks": [
      {
        "id": "HITL",
        "label": "Human-in-the-Loop",
        "status": "COMPLIANT",
        "detail": "All AI outputs reviewed by human analyst before approval."
      },
      {
        "id": "APPROVAL",
        "label": "Approval Chain",
        "status": "COMPLETE",
        "detail": "All required signatures present (9 of 9)."
      },
      {
        "id": "TRACE",
        "label": "Data Traceability",
        "status": "VERIFIED",
        "detail": "All data sources timestamped and snapshot-locked."
      },
      {
        "id": "INTEGRITY",
        "label": "Record Integrity",
        "status": "PROTECTED",
        "detail": "No unauthorized modifications detected."
      },
      {
        "id": "EXPLAIN",
        "label": "AI Explainability",
        "status": "VERIFIED",
        "detail": "Each AI output has full reasoning trace and confidence score."
      }
    ]
  },
  "optimization_strategies": [
    {
      "id": "OPT-001",
      "title": "AI AUTO VERIFICATION",
      "description": "High-confidence AI outputs (\u2265 0.85) automatically pass analyst layer.",
      "savings_label": "1d 12h",
      "savings_hours": 36,
      "impacted_nodes": [
        "NODE-05"
      ],
      "risk_level": "LOW",
      "risk_note": "Retains audit log; only bypasses manual touch-time."
    },
    {
      "id": "OPT-002",
      "title": "SINGLE-LEVEL APPROVAL",
      "description": "Eliminate Dept Head return-to-analyst loop for evidence completeness checks.",
      "savings_label": "4d 6h",
      "savings_hours": 102,
      "impacted_nodes": [
        "NODE-06"
      ],
      "risk_level": "MEDIUM",
      "risk_note": "Requires AI pre-validation of evidence completeness."
    },
    {
      "id": "OPT-003",
      "title": "DIRECT MINISTERIAL ESCALATION",
      "description": "Critical cases (severity HIGH + repeat offender) skip dept head approval entirely.",
      "savings_label": "2d 4h",
      "savings_hours": 52,
      "impacted_nodes": [
        "NODE-06"
      ],
      "risk_level": "MEDIUM",
      "risk_note": "Reserved for repeat-offender cases (Article 47)."
    },
    {
      "id": "OPT-004",
      "title": "PARALLEL CROSS-AGENCY DISPATCH",
      "description": "Send to all 4 agencies simultaneously with 24h auto-escalation timeout.",
      "savings_label": "1d 18h",
      "savings_hours": 42,
      "impacted_nodes": [
        "NODE-07"
      ],
      "risk_level": "LOW",
      "risk_note": "Standard practice in EU regulatory frameworks."
    }
  ],
  "optimization_summary": {
    "current_total_time": "11d 6h",
    "current_total_hours": 270,
    "optimized_total_time": "3d 14h",
    "optimized_total_hours": 86,
    "savings_label": "7d 16h",
    "savings_pct": 68
  },
  "historical_cases": [
    {
      "id": "CASE-2025-088",
      "title": "Western Caspian — Unreported night production",
      "subject_enterprise": "ENT-KZ-AKT-0091",
      "anomaly": "ANO-2025-0317",
      "final_status": "ARCHIVED",
      "outcome": "Fine 240M KZT + 2yr quarterly audit",
      "opened": "2025-09-12",
      "closed": "2025-11-04",
      "total_elapsed_time": "53d",
      "return_count": 2,
      "approval_count": 11,
      "is_active": false
    },
    {
      "id": "CASE-2025-209",
      "title": "Mangistau Petrochem — Unreported night production",
      "subject_enterprise": "ENT-KZ-AKT-0203",
      "anomaly": "ANO-2025-0588",
      "final_status": "ARCHIVED",
      "outcome": "Fine 185M KZT",
      "opened": "2025-10-08",
      "closed": "2025-12-15",
      "total_elapsed_time": "68d",
      "return_count": 1,
      "approval_count": 9,
      "is_active": false
    },
    {
      "id": "CASE-2024-441",
      "title": "Atyrau Refinery — Metering tampering",
      "subject_enterprise": "ENT-KZ-ATY-0033",
      "anomaly": "ANO-2024-1102",
      "final_status": "ARCHIVED",
      "outcome": "Fine 95M KZT + criminal referral",
      "opened": "2024-08-22",
      "closed": "2024-12-04",
      "total_elapsed_time": "104d",
      "return_count": 3,
      "approval_count": 14,
      "is_active": false
    }
  ]
};
export default DATA;
