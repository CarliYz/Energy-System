export const ATTRIBUTION_DATA = {
  case: {
    id: "CASE-2026-001",
    title: "Western Caspian — Suspected Unreported Capacity Expansion",
    status: "ATTRIBUTION_IN_PROGRESS",
    severity: "CRITICAL",
    priority: "HIGH",
    subject_enterprise: {
      id: "ENT-KZ-AKT-0091",
      name_en: "Western Caspian Energy LLC",
      industry: "OIL_AND_GAS",
      head_office: "Aktau, Mangistau Region",
      legal_rep: "PERSON-K-00214",
      legal_rep_name: "A. K. Bekturov"
    },
    subject_facility: {
      id: "FAC-KZ-AKT-GCS-001",
      name: "Aktau Main Compressor Station",
      type: "GAS_COMPRESSOR"
    },
    triggering_anomaly: {
      id: "ANO-2026-0512",
      headline: "Night-time gas throughput +40% over 6 working days"
    },
    initiated_at: "2026-05-28T14:32:00Z",
    initiated_by: "AI-CORE / Master Audit Agent",
    timeline_window: {
      start: "2025-05-28T14:32:00Z",
      end: "2026-05-28T14:32:00Z",
      duration_days: 365
    }
  },
  lanes: [
    {
      id: "LANE_APPROVAL",
      label_en: "APPROVAL",
      icon: "FileCheck",
      agent: {
        id: "AGENT_APPROVAL",
        name_en: "Approval Agent",
        specialization: "License/permit application & approval lifecycle analysis",
        verdict_status: "RED_FLAG",
        confidence: 0.82
      }
    },
    {
      id: "LANE_REPORTING",
      label_en: "REPORTING",
      icon: "FileText",
      agent: {
        id: "AGENT_REPORTING",
        name_en: "Reporting Agent",
        specialization: "Periodic enterprise self-report data cross-check",
        verdict_status: "RED_FLAG",
        confidence: 0.88
      }
    },
    {
      id: "LANE_INSPECTION",
      label_en: "INSPECTION",
      icon: "Search",
      agent: {
        id: "AGENT_INSPECTION",
        name_en: "Inspection Agent",
        specialization: "On-site & remote inspection record analysis",
        verdict_status: "YELLOW_FLAG",
        confidence: 0.74
      }
    },
    {
      id: "LANE_SANCTION",
      label_en: "SANCTION",
      icon: "Gavel",
      agent: {
        id: "AGENT_SANCTION",
        name_en: "Sanction Agent",
        specialization: "Historical violation & sanction pattern matching",
        verdict_status: "RED_FLAG",
        confidence: 0.91
      }
    },
    {
      id: "LANE_RECTIFICATION",
      label_en: "RECTIFICATION",
      icon: "Wrench",
      agent: {
        id: "AGENT_RECTIFICATION",
        name_en: "Rectification Agent",
        specialization: "Mandated rectification execution tracking",
        verdict_status: "YELLOW_FLAG",
        confidence: 0.76
      }
    },
    {
      id: "LANE_REVIEW",
      label_en: "REVIEW",
      icon: "ShieldCheck",
      agent: {
        id: "AGENT_REVIEW",
        name_en: "Review Agent",
        specialization: "Cross-departmental audit & multi-year pattern review",
        verdict_status: "RED_FLAG",
        confidence: 0.85
      }
    }
  ],
  master_agent: {
    id: "AGENT_MASTER",
    name_en: "Master Audit Agent",
    specialization: "Cross-lane evidence synthesis & root-cause attribution",
    model: "LLM-MASTER-V3.1 (foundation model)"
  },
  events: [
    {
      id: "APP-2025-0341",
      lane: "LANE_APPROVAL",
      ts: "2025-07-22T14:32:00Z",
      status: "NORMAL",
      title: "Routine permit renewal",
      subtitle: "Annual operating permit renewed",
      detail: "PERMIT-OP-2025 renewed for 12 months. Standard renewal cycle.",
      doc_ref: "PERMIT-OP-2025"
    },
    {
      id: "APP-2026-0078-SUBMIT",
      lane: "LANE_APPROVAL",
      ts: "2026-02-02T14:32:00Z",
      status: "INFO",
      title: "New compressor unit filing submitted",
      subtitle: "Application APP-2026-0078",
      detail: "Enterprise filed application to register new compressor Unit-2C (design throughput +6 MMcm/d). Filing materials incomplete — missing environmental impact assessment.",
      doc_ref: "APP-2026-0078",
      ai_flag: false
    },
    {
      id: "APP-2026-0078-REJECT",
      lane: "LANE_APPROVAL",
      ts: "2026-02-09T14:32:00Z",
      status: "WARNING",
      title: "Application returned for completion",
      subtitle: "APP-2026-0078 returned, missing EIA",
      detail: "Application returned with 30-day window to resubmit with full environmental impact assessment.",
      doc_ref: "APP-2026-0078"
    },
    {
      id: "APP-2026-0078-RESUBMIT",
      lane: "LANE_APPROVAL",
      ts: "2026-03-14T14:32:00Z",
      status: "INFO",
      title: "Application resubmitted",
      subtitle: "APP-2026-0078 v2 in review",
      detail: "Enterprise resubmitted with EIA. Standard review window 30 days.",
      doc_ref: "APP-2026-0078"
    },
    {
      id: "APP-2026-0078-OVERDUE",
      lane: "LANE_APPROVAL",
      ts: "2026-04-28T14:32:00Z",
      status: "CRITICAL",
      title: "Application overdue — pending 45+ days",
      subtitle: "APP-2026-0078 stuck in review",
      detail: "Review window exceeded by 15 days. No formal approval issued, yet AI inference suggests unit may already be operational.",
      doc_ref: "APP-2026-0078",
      ai_flag: true,
      ai_inference: "Pre-approval commissioning suspected"
    },
    {
      id: "REP-2025-Q3",
      lane: "LANE_REPORTING",
      ts: "2025-09-30T14:32:00Z",
      status: "NORMAL",
      title: "Q3 2025 quarterly report",
      subtitle: "Production volume reported",
      detail: "Quarterly self-report submitted on time. Reported throughput 12.1 MMcm/d. Matched SCADA telemetry (variance 0.3%).",
      doc_ref: "REP-Q3-2025"
    },
    {
      id: "REP-2025-M10",
      lane: "LANE_REPORTING",
      ts: "2025-10-30T14:32:00Z",
      status: "NORMAL",
      title: "Monthly report Oct 2025",
      detail: "Routine monthly submission. Variance 0.8%."
    },
    {
      id: "REP-2025-M11",
      lane: "LANE_REPORTING",
      ts: "2025-11-30T14:32:00Z",
      status: "NORMAL",
      title: "Monthly report Nov 2025",
      detail: "Variance 0.5%."
    },
    {
      id: "REP-2025-M12",
      lane: "LANE_REPORTING",
      ts: "2025-12-29T14:32:00Z",
      status: "NORMAL",
      title: "Monthly report Dec 2025",
      detail: "Variance 1.1%."
    },
    {
      id: "REP-2026-Q1",
      lane: "LANE_REPORTING",
      ts: "2026-01-28T14:32:00Z",
      status: "NORMAL",
      title: "Q1 2026 quarterly report",
      subtitle: "Reported 12.3 MMcm/d avg",
      detail: "Quarterly report on time. SCADA variance 1.4%. Within tolerance."
    },
    {
      id: "REP-2026-M03",
      lane: "LANE_REPORTING",
      ts: "2026-03-01T14:32:00Z",
      status: "WARNING",
      title: "Monthly report Mar 2020",
      subtitle: "Variance widening to 3.2%",
      detail: "Monthly report shows mild variance increase vs SCADA. Within tolerance but flagged for trend tracking."
    },
    {
      id: "REP-2026-M04",
      lane: "LANE_REPORTING",
      ts: "2026-03-31T14:32:00Z",
      status: "WARNING",
      title: "Monthly report Apr 2026",
      subtitle: "Variance 8.4% — flagged",
      detail: "Throughput reported 12.5 MMcm/d. SCADA shows 13.6 MMcm/d. Variance 8.4% — exceeds 5% threshold. Auto-flag raised."
    },
    {
      id: "REP-2026-M05",
      lane: "LANE_REPORTING",
      ts: "2026-05-20T14:32:00Z",
      status: "CRITICAL",
      title: "Monthly report May 2026",
      subtitle: "Variance +20.4% — CRITICAL",
      detail: "Reported 12.4 MMcm/d. SCADA shows 14.9 MMcm/d average, with night-time excursions to 16+ MMcm/d. Variance +20.4% vs reported.",
      ai_flag: true,
      ai_inference: "Systematic under-reporting of production"
    },
    {
      id: "INSP-2025-0203",
      lane: "LANE_INSPECTION",
      ts: "2025-08-12T14:32:00Z",
      status: "NORMAL",
      title: "Routine on-site inspection",
      subtitle: "Pre-violation baseline check",
      detail: "On-site inspection of GCS-001. 12 stations checked, all nominal.",
      doc_ref: "INSP-2025-0203"
    },
    {
      id: "INSP-2025-0291",
      lane: "LANE_INSPECTION",
      ts: "2025-10-15T14:32:00Z",
      status: "CRITICAL",
      title: "Triggered inspection — Sep 2025 anomaly",
      subtitle: "Confirmed unreported unit (ANO-2025-0317)",
      detail: "Post-detection inspection. Found unreported compressor unit. Confirmed violation. Triggered sanction process.",
      doc_ref: "INSP-2025-0291"
    },
    {
      id: "INSP-2026-0028",
      lane: "LANE_INSPECTION",
      ts: "2026-01-13T14:32:00Z",
      status: "NORMAL",
      title: "Post-rectification verification",
      subtitle: "Sanction follow-up inspection",
      detail: "Verified rectification of CASE-2025-088. Reported unit decommissioned. Compliant."
    },
    {
      id: "INSP-2026-0091",
      lane: "LANE_INSPECTION",
      ts: "2026-03-26T14:32:00Z",
      status: "WARNING",
      title: "Routine inspection — partial coverage",
      subtitle: "Only 3/12 sub-stations inspected",
      detail: "Routine inspection performed but only 3 of 12 sub-stations covered due to weather. No new equipment found in inspected areas. Coverage 25% — gap risk.",
      doc_ref: "INSP-2026-0091",
      ai_flag: true,
      ai_inference: "Inspection coverage insufficient — uninspected sub-stations may host unreported equipment"
    },
    {
      id: "SANC-2025-088",
      lane: "LANE_SANCTION",
      ts: "2025-11-05T14:32:00Z",
      status: "CRITICAL",
      title: "Fine issued — CASE-2025-088",
      subtitle: "240 M KZT for unreported night production",
      detail: "Fine of 240,000,000 KZT (~540K USD) issued for confirmed unreported capacity expansion. Closed with mandatory remediation.",
      doc_ref: "SANC-2025-088"
    },
    {
      id: "RECT-2025-088-PLAN",
      lane: "LANE_RECTIFICATION",
      ts: "2025-11-07T14:32:00Z",
      status: "INFO",
      title: "Rectification plan accepted",
      subtitle: "2-year quarterly audit mandate",
      detail: "Enterprise submitted rectification plan: decommission unit, submit to mandatory quarterly third-party audit for 2 years."
    },
    {
      id: "RECT-AUDIT-Q4-2025",
      lane: "LANE_RECTIFICATION",
      ts: "2025-12-20T14:32:00Z",
      status: "NORMAL",
      title: "Q4 2025 mandatory audit",
      subtitle: "Audit #1 of 8 — passed",
      detail: "Quarterly third-party audit. No anomalies. Compliant.",
      doc_ref: "AUDIT-Q4-2025"
    },
    {
      id: "RECT-AUDIT-Q1-2026",
      lane: "LANE_RECTIFICATION",
      ts: "2026-03-22T14:32:00Z",
      status: "NORMAL",
      title: "Q1 2026 mandatory audit",
      subtitle: "Audit #2 of 8 — passed",
      detail: "Quarterly third-party audit. Compliant."
    },
    {
      id: "RECT-AUDIT-Q2-2026",
      lane: "LANE_RECTIFICATION",
      ts: "2026-05-15T14:32:00Z",
      status: "WARNING",
      title: "Q2 2026 audit — yellow flags",
      subtitle: "Audit #3 — flagged but cleared",
      detail: "Quarterly audit noted +14% electricity step-jump since 2026-05-01. Auditor classified as 'seasonal variance', cleared.",
      doc_ref: "AUDIT-Q2-2026",
      ai_flag: true,
      ai_inference: "Audit yellow flag dismissed despite material evidence"
    },
    {
      id: "REV-ANNUAL-2025",
      lane: "LANE_REVIEW",
      ts: "2025-08-01T14:32:00Z",
      status: "NORMAL",
      title: "Annual cross-departmental review",
      subtitle: "2025 baseline established",
      detail: "Annual review confirms enterprise compliance baseline."
    },
    {
      id: "REV-CASE-2025-088-CLOSE",
      lane: "LANE_REVIEW",
      ts: "2025-12-29T14:32:00Z",
      status: "NORMAL",
      title: "CASE-2025-088 closed",
      subtitle: "Case closure review approved",
      detail: "Cross-department review approved closure of historical violation case."
    },
    {
      id: "REV-Q1-2026",
      lane: "LANE_REVIEW",
      ts: "2026-03-29T14:32:00Z",
      status: "NORMAL",
      title: "Q1 2026 cross-dept review",
      subtitle: "No flags raised",
      detail: "Cross-department quarterly review. No flags raised."
    },
    {
      id: "REV-FLAG-2026-04",
      lane: "LANE_REVIEW",
      ts: "2026-04-18T14:32:00Z",
      status: "WARNING",
      title: "Tax data inconsistency flag raised",
      subtitle: "Revenue 18% above declared production basis",
      detail: "Cross-check with tax authority revealed Q1 2026 declared revenue is 18% higher than production-implied revenue. Marked for follow-up but not escalated.",
      doc_ref: "REV-FLAG-2026-04",
      ai_flag: true,
      ai_inference: "Inconsistency suggests undeclared production"
    },
    {
      id: "REV-NOW",
      lane: "LANE_REVIEW",
      ts: "2026-05-28T14:32:00Z",
      status: "CRITICAL",
      title: "AI Master Agent attribution initiated",
      subtitle: "Triggered by ANO-2026-0512",
      detail: "Master Audit Agent initiated cross-lane attribution for the newly-triggered critical anomaly.",
      ai_flag: true
    }
  ],
  agent_reasoning: {
    "AGENT_APPROVAL": {
      "verdict": "RED_FLAG",
      "confidence": 0.82,
      "headline": "Pre-approval commissioning of new compressor unit suspected",
      "key_findings": [
        "APP-2026-0078 (Unit-2C registration) pending approval for 75+ days",
        "Review window exceeded by 15 days (Article 22)",
        "Unit-2C design throughput (+6 MMcm/d) matches observed +40% night surge",
        "Enterprise has financial incentive to start operations pre-approval"
      ],
      "supporting_events": [
        "APP-2026-0078-SUBMIT",
        "APP-2026-0078-REJECT",
        "APP-2026-0078-RESUBMIT",
        "APP-2026-0078-OVERDUE"
      ],
      "natural_language": "The enterprise filed APP-2026-0078 to register a new compressor unit (Unit-2C, design +6 MMcm/d) on 2026-02-02. The application was returned once for missing EIA, resubmitted 2026-03-14, and remains in review 75+ days later — exceeding the 30-day statutory window. The unit's design specifications align precisely with the observed +40% night-time throughput uplift in ANO-2026-0512. AI infers commissioning may have preceded approval."
    },
    "AGENT_REPORTING": {
      "verdict": "RED_FLAG",
      "confidence": 0.88,
      "headline": "Systematic under-reporting widening over 4 months",
      "key_findings": [
        "Mar 2026: reported variance 3.2% (within tolerance)",
        "Apr 2026: variance jumped to 8.4% — first auto-flag",
        "May 2026: variance reached +20.4% — sustained",
        "Pattern matches 2025 violation (CASE-2025-088) fingerprint"
      ],
      "supporting_events": [
        "REP-2026-M03",
        "REP-2026-M04",
        "REP-2026-M05"
      ],
      "natural_language": "Monthly self-reported throughput has progressively diverged from SCADA-measured actuals over the past 4 months: 3.2% → 8.4% → 20.4%. The widening pattern, the concentration in night-time hours, and the monotonic growth rule out random metering drift. Reporting pattern matches the 2025 violation fingerprint with 0.91 similarity."
    },
    "AGENT_INSPECTION": {
      "verdict": "YELLOW_FLAG",
      "confidence": 0.74,
      "headline": "Inspection coverage gap — 75% sub-stations uninspected",
      "key_findings": [
        "INSP-2026-0091 covered only 3 of 12 sub-stations (25%)",
        "Inspected stations showed no anomalies",
        "Unit-2C is registered to a non-inspected sub-station (Station 7)",
        "Coverage gap creates blind spot for unreported equipment"
      ],
      "supporting_events": [
        "INSP-2026-0091"
      ],
      "natural_language": "The most recent routine inspection (2026-03-26) covered only 3 of 12 sub-stations due to weather. Station 7, where Unit-2C is being registered, was NOT among the inspected sites. This coverage gap means the absence of findings cannot rule out unreported equipment."
    },
    "AGENT_SANCTION": {
      "verdict": "RED_FLAG",
      "confidence": 0.91,
      "headline": "Repeat-offender pattern — 0.87 similarity to 2025 violation",
      "key_findings": [
        "CASE-2025-088 closed only 6 months ago — short recidivism interval",
        "Current pattern matches 2025 case fingerprint at 0.87 similarity",
        "Same enterprise, same facility, same modus operandi (night production)",
        "Mandated quarterly audit failed to detect pre-emptively"
      ],
      "supporting_events": [
        "SANC-2025-088"
      ],
      "natural_language": "Enterprise was fined 240M KZT in 2025 for the same modus operandi: unreported night-time production. The 2025 case was closed 6 months ago. The current anomaly's morphology matches that historical case at 0.87 similarity. This constitutes a repeat-offender pattern, warranting escalated enforcement under Article 47."
    },
    "AGENT_RECTIFICATION": {
      "verdict": "YELLOW_FLAG",
      "confidence": 0.76,
      "headline": "Q2 2026 audit dismissed material evidence",
      "key_findings": [
        "Q4 2025 audit: passed (compliant)",
        "Q1 2026 audit: passed (compliant)",
        "Q2 2026 audit: noted +14% electricity step-jump, dismissed as seasonal",
        "Same auditor across all 3 audits — potential independence concern"
      ],
      "supporting_events": [
        "RECT-AUDIT-Q2-2026"
      ],
      "natural_language": "The mandatory Q2 2026 third-party audit detected a +14% electricity step-jump starting 2026-05-01 but classified it as 'seasonal variance' and cleared the enterprise. Given the timing aligns with the anomaly onset, this classification appears erroneous. The same auditor conducted all 3 post-CASE-2025-088 audits, raising independence concerns."
    },
    "AGENT_REVIEW": {
      "verdict": "RED_FLAG",
      "confidence": 0.85,
      "headline": "Tax-production inconsistency consistent with covert production",
      "key_findings": [
        "Q1 2026 declared revenue 18% above production-implied basis",
        "Cross-dept review flagged but did not escalate",
        "Inconsistency aligns with hypothesis of unreported production",
        "Pattern repeats across customs declarations (export volume +12%)"
      ],
      "supporting_events": [
        "REV-FLAG-2026-04"
      ],
      "natural_language": "Cross-departmental review identified that the enterprise's declared Q1 2026 tax revenue exceeds its production-implied basis by 18%. Customs export volumes also show +12% over reported production. Both inconsistencies are consistent with — and only with — the hypothesis of unreported production capacity."
    }
  },
  "master_verdict": {
    "primary_cause": {
      "title": "UNREPORTED CAPACITY EXPANSION",
      "probability": 0.85,
      "rationale": "Six independent agents converge on the same root cause from non-overlapping evidence streams. The probability is calculated from a weighted Bayesian ensemble of the six specialist agent verdicts, with the historical similarity case (ANO-2025-0317) providing a strong prior.",
      "evidence_chain": [
        {
          "from_lane": "LANE_APPROVAL",
          "evidence": "APP-2026-0078 (new compressor unit registration) overdue 45+ days; design specs match observed anomaly profile"
        },
        {
          "from_lane": "LANE_REPORTING",
          "evidence": "Reported-vs-SCADA variance widened 3.2% → 8.4% → 20.4% over Mar-Apr-May 2026"
        },
        {
          "from_lane": "LANE_INSPECTION",
          "evidence": "Most recent inspection covered only 25% of sub-stations; Unit-2C station NOT inspected"
        },
        {
          "from_lane": "LANE_SANCTION",
          "evidence": "Repeat-offender pattern; 0.87 morphology similarity to 2025 violation (CASE-2025-088)"
        },
        {
          "from_lane": "LANE_RECTIFICATION",
          "evidence": "Q2 2026 mandatory audit detected +14% electricity step-jump but dismissed it as seasonal"
        },
        {
          "from_lane": "LANE_REVIEW",
          "evidence": "Tax revenue 18% above production basis; customs export +12% over reported — both consistent only with unreported production"
        }
      ]
    },
    "secondary_cause": {
      "title": "INSPECTION SYSTEM COVERAGE GAP",
      "probability": 0.09,
      "rationale": "Independent contributing factor: the 25% inspection coverage rate creates structural blind spots that enable concealment."
    },
    "tertiary_cause": {
      "title": "AUDITOR INDEPENDENCE ISSUE",
      "probability": 0.06,
      "rationale": "Same third-party auditor across 3 post-violation audits raises independence concerns; may explain dismissal of material evidence."
    },
    "recommended_actions": [
      {
        "action_id": "ACT-001",
        "title": "TRIGGER ESCALATED ON-SITE INSPECTION",
        "priority": "IMMEDIATE",
        "owner": "INSPECTION_DEPT",
        "rationale": "Inspect all 12 sub-stations, focus on Station 7 (Unit-2C)"
      },
      {
        "action_id": "ACT-002",
        "title": "JOINT REVIEW WITH TAX & CUSTOMS",
        "priority": "HIGH",
        "owner": "REVIEW_DEPT",
        "rationale": "Reconcile production-tax-customs gaps with formal cross-agency review"
      },
      {
        "action_id": "ACT-003",
        "title": "INITIATE FORMAL VIOLATION CASE",
        "priority": "HIGH",
        "owner": "ENFORCEMENT_DEPT",
        "rationale": "Repeat-offender; Article 47 escalation applies"
      },
      {
        "action_id": "ACT-004",
        "title": "AUDITOR INDEPENDENCE REVIEW",
        "priority": "MEDIUM",
        "owner": "REVIEW_DEPT",
        "rationale": "Rotate audit firms; investigate Q2 2026 dismissal decision"
      }
    ],
    "confidence_breakdown": {
      "overall_confidence": 0.85,
      "model": "Bayesian ensemble of 6 specialist agents + historical prior",
      "lane_contributions": [
        {
          "lane": "LANE_APPROVAL",
          "weight": 0.18,
          "verdict_strength": 0.82
        },
        {
          "lane": "LANE_REPORTING",
          "weight": 0.22,
          "verdict_strength": 0.88
        },
        {
          "lane": "LANE_INSPECTION",
          "weight": 0.1,
          "verdict_strength": 0.74
        },
        {
          "lane": "LANE_SANCTION",
          "weight": 0.2,
          "verdict_strength": 0.91
        },
        {
          "lane": "LANE_RECTIFICATION",
          "weight": 0.12,
          "verdict_strength": 0.76
        },
        {
          "lane": "LANE_REVIEW",
          "weight": 0.18,
          "verdict_strength": 0.85
        }
      ]
    }
  }
};
