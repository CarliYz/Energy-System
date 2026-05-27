// src/data/audit/case_001_lifecycle_matrix.ts
export const case001LifecycleMatrix = {
  "meta": {
    "page_id": "4.1",
    "page_title": "Lifecycle Audit Trail — 2D Process × Level Swimlane",
    "case_id": "CASE-2026-001",
    "anomaly_id": "ANO-2026-0512",
    "enterprise_id": "ENT-KZ-AKT-0091",
    "enterprise_name": "Western Caspian Energy LLC",
    "generated_at": "2026-06-08T21:30:00Z",
    "theme": "light-palantir"
  },
  "stages": [
    {
      "id": "S1",
      "key": "APPROVAL",
      "name_en": "APPROVAL"
    },
    {
      "id": "S2",
      "key": "REPORTING",
      "name_en": "REPORTING"
    },
    {
      "id": "S3",
      "key": "INSPECTION",
      "name_en": "INSPECTION"
    },
    {
      "id": "S4",
      "key": "SANCTION",
      "name_en": "SANCTION"
    },
    {
      "id": "S5",
      "key": "RECTIFICATION",
      "name_en": "RECTIFICATION"
    },
    {
      "id": "S6",
      "key": "REVIEW",
      "name_en": "REVIEW"
    },
    {
      "id": "S7",
      "key": "ACCEPTANCE",
      "name_en": "ACCEPTANCE"
    },
    {
      "id": "S8",
      "key": "AUDIT",
      "name_en": "AUDIT"
    },
    {
      "id": "S9",
      "key": "DISCLOSURE",
      "name_en": "DISCLOSURE"
    }
  ],
  "levels": [
    {
      "id": "L1",
      "key": "MINISTRY",
      "name_en": "MINISTRY",
      "org": "Minister / Vice-Minister Office"
    },
    {
      "id": "L2",
      "key": "DEPARTMENT",
      "name_en": "DEPARTMENT",
      "org": "Energy Regulation Dept."
    },
    {
      "id": "L3",
      "key": "DIVISION",
      "name_en": "DIVISION",
      "org": "Operations Divisions"
    },
    {
      "id": "L4",
      "key": "REGIONAL",
      "name_en": "REGIONAL",
      "org": "Mangystau Regional Inspectorate"
    },
    {
      "id": "L5",
      "key": "ENTERPRISE",
      "name_en": "ENTERPRISE",
      "org": "Western Caspian Energy LLC"
    }
  ],
  "nodes": [
    {
      "id": "N-S1-L5-01",
      "stage": "APPROVAL",
      "level": "ENTERPRISE",
      "title": "Submit APP-2026-0078",
      "owner": "ENT-KZ-AKT-0091",
      "timestamp": "2026-02-04 09:12",
      "status": "NORMAL",
      "summary": "Capacity expansion permit application submitted with 8 attachments.",
      "ai_flag": false,
      "evidence_refs": [],
      "badges": [
        "APP-2026-0078"
      ],
      "doc_ref": "APP-2026-0078",
      "duration": null
    },
    {
      "id": "N-S1-L3-01",
      "stage": "APPROVAL",
      "level": "DIVISION",
      "title": "Intake & formality check",
      "owner": "Approval Division",
      "timestamp": "2026-02-05 11:40",
      "status": "WARNING",
      "summary": "Incomplete docs (2/8 missing). Returned to enterprise for refresh.",
      "ai_flag": false,
      "evidence_refs": [],
      "badges": [
        "INCOMPLETE"
      ],
      "doc_ref": null,
      "duration": "1d 2h"
    },
    {
      "id": "N-S1-L5-02",
      "stage": "APPROVAL",
      "level": "ENTERPRISE",
      "title": "Resubmit refreshed pack",
      "owner": "ENT-KZ-AKT-0091",
      "timestamp": "2026-03-11 16:05",
      "status": "NORMAL",
      "summary": "Re-submission with 8/8 attachments.",
      "ai_flag": false,
      "evidence_refs": [],
      "badges": [
        "REV2"
      ],
      "doc_ref": null,
      "duration": null
    },
    {
      "id": "N-S1-L3-02",
      "stage": "APPROVAL",
      "level": "DIVISION",
      "title": "Technical pre-review",
      "owner": "Approval Division",
      "timestamp": "2026-03-13 10:20",
      "status": "PROGRESS",
      "summary": "Capacity calc and emission factor matched against benchmark. Waiting on dept sign-off.",
      "ai_flag": false,
      "evidence_refs": [],
      "badges": [],
      "doc_ref": null,
      "duration": "14d"
    },
    {
      "id": "N-S1-L2-01",
      "stage": "APPROVAL",
      "level": "DEPARTMENT",
      "title": "Dept. technical committee",
      "owner": "Energy Reg. Dept.",
      "timestamp": "2026-04-02 14:00",
      "status": "PROGRESS",
      "summary": "Committee placed APP-2026-0078 on hold pending site verification.",
      "ai_flag": true,
      "evidence_refs": [
        "SRC-31"
      ],
      "badges": [
        "ON HOLD"
      ],
      "doc_ref": null,
      "duration": "45d"
    },
    {
      "id": "N-S1-L1-01",
      "stage": "APPROVAL",
      "level": "MINISTRY",
      "title": "Ministerial approval",
      "owner": "Vice-Minister Office",
      "timestamp": null,
      "status": "PENDING",
      "summary": "Not yet reached. Will require dept sign-off first.",
      "ai_flag": false,
      "evidence_refs": [],
      "badges": [],
      "doc_ref": null,
      "duration": null
    },
    {
      "id": "N-S2-L5-01",
      "stage": "REPORTING",
      "level": "ENTERPRISE",
      "title": "Monthly M03 report",
      "owner": "ENT-KZ-AKT-0091",
      "timestamp": "2026-04-05 10:00",
      "status": "NORMAL",
      "summary": "Production & energy figures within nominal band.",
      "ai_flag": false,
      "evidence_refs": [],
      "badges": [
        "M03"
      ],
      "doc_ref": null,
      "duration": null
    },
    {
      "id": "N-S2-L5-02",
      "stage": "REPORTING",
      "level": "ENTERPRISE",
      "title": "Monthly M04 report",
      "owner": "ENT-KZ-AKT-0091",
      "timestamp": "2026-05-05 10:30",
      "status": "WARNING",
      "summary": "Night-time energy +18% vs. plan. Within tolerance but flagged.",
      "ai_flag": false,
      "evidence_refs": [],
      "badges": [
        "M04"
      ],
      "doc_ref": null,
      "duration": null
    },
    {
      "id": "N-S2-L5-03",
      "stage": "REPORTING",
      "level": "ENTERPRISE",
      "title": "Monthly M05 report",
      "owner": "ENT-KZ-AKT-0091",
      "timestamp": "2026-06-05 09:10",
      "status": "CRITICAL",
      "summary": "Throughput +40.4% above predicted band over 6 working days.",
      "ai_flag": true,
      "evidence_refs": [
        "SRC-21"
      ],
      "badges": [
        "M05",
        "ANO-2026-0512"
      ],
      "doc_ref": null,
      "duration": null
    },
    {
      "id": "N-S2-L3-01",
      "stage": "REPORTING",
      "level": "DIVISION",
      "title": "Reporting Division QC",
      "owner": "Reporting Division",
      "timestamp": "2026-06-06 11:00",
      "status": "CRITICAL",
      "summary": "AI cross-system check flagged inconsistency vs tax/customs basis.",
      "ai_flag": true,
      "evidence_refs": [
        "SRC-22"
      ],
      "badges": [],
      "doc_ref": null,
      "duration": null
    },
    {
      "id": "N-S2-L2-01",
      "stage": "REPORTING",
      "level": "DEPARTMENT",
      "title": "Dept. data aggregation",
      "owner": "Energy Reg. Dept.",
      "timestamp": "2026-06-07 09:30",
      "status": "WARNING",
      "summary": "Aggregated quarterly outlook degraded. Escalated to review lane.",
      "ai_flag": false,
      "evidence_refs": [
        "SRC-22"
      ],
      "badges": [],
      "doc_ref": null,
      "duration": null
    },
    {
      "id": "N-S3-L4-01",
      "stage": "INSPECTION",
      "level": "REGIONAL",
      "title": "Site inspection INSP-2026-0091",
      "owner": "Mangystau Regional Insp.",
      "timestamp": "2026-04-18 09:00",
      "status": "WARNING",
      "summary": "Coverage 3/12 sites only. Station 7 / Unit-2C area NOT inspected.",
      "ai_flag": true,
      "evidence_refs": [
        "SRC-31"
      ],
      "badges": [
        "INSP-2026-0091",
        "COVERAGE 25%"
      ],
      "doc_ref": null,
      "duration": null
    },
    {
      "id": "N-S3-L3-01",
      "stage": "INSPECTION",
      "level": "DIVISION",
      "title": "Inspection Division review",
      "owner": "Inspection Division",
      "timestamp": "2026-04-22 16:00",
      "status": "CRITICAL",
      "summary": "AI flag: low-coverage inspection cannot rule out undeclared capacity.",
      "ai_flag": true,
      "evidence_refs": [
        "SRC-31",
        "SRC-32"
      ],
      "badges": [],
      "doc_ref": null,
      "duration": null
    },
    {
      "id": "N-S3-L2-01",
      "stage": "INSPECTION",
      "level": "DEPARTMENT",
      "title": "Joint inspection order",
      "owner": "Energy Reg. Dept.",
      "timestamp": "2026-06-07 17:40",
      "status": "PROGRESS",
      "summary": "Cross-agency field action ticket prepared (Tax + Customs + Regional).",
      "ai_flag": false,
      "evidence_refs": [
        "SRC-32"
      ],
      "badges": [
        "JOINT"
      ],
      "doc_ref": null,
      "duration": null
    },
    {
      "id": "N-S3-L1-01",
      "stage": "INSPECTION",
      "level": "MINISTRY",
      "title": "Ministerial dispatch authorization",
      "owner": "Vice-Minister Office",
      "timestamp": "2026-06-08 09:00",
      "status": "PROGRESS",
      "summary": "Authorization for emergency joint inspection within 72h.",
      "ai_flag": false,
      "evidence_refs": [],
      "badges": [
        "72h WINDOW"
      ],
      "doc_ref": null,
      "duration": null
    },
    {
      "id": "N-S4-L5-01",
      "stage": "SANCTION",
      "level": "ENTERPRISE",
      "title": "Historical penalty paid",
      "owner": "ENT-KZ-AKT-0091",
      "timestamp": "2025-11-12 15:00",
      "status": "NORMAL",
      "summary": "CASE-2025-088 fine 240M KZT paid in full.",
      "ai_flag": false,
      "evidence_refs": [],
      "badges": [
        "CASE-2025-088",
        "240M KZT"
      ],
      "doc_ref": null,
      "duration": null
    },
    {
      "id": "N-S4-L3-01",
      "stage": "SANCTION",
      "level": "DIVISION",
      "title": "Sanction order (historical)",
      "owner": "Sanction Division",
      "timestamp": "2025-09-25 11:00",
      "status": "NORMAL",
      "summary": "Article 47 violation, fine + corrective notice issued.",
      "ai_flag": false,
      "evidence_refs": [],
      "badges": [
        "ART. 47"
      ],
      "doc_ref": null,
      "duration": null
    },
    {
      "id": "N-S4-L2-01",
      "stage": "SANCTION",
      "level": "DEPARTMENT",
      "title": "Dept. counter-signature",
      "owner": "Energy Reg. Dept.",
      "timestamp": "2025-09-28 10:00",
      "status": "NORMAL",
      "summary": "Approved by department director.",
      "ai_flag": false,
      "evidence_refs": [],
      "badges": [],
      "doc_ref": null,
      "duration": null
    },
    {
      "id": "N-S4-L3-02",
      "stage": "SANCTION",
      "level": "DIVISION",
      "title": "Repeat sanction prep (draft)",
      "owner": "Sanction Division",
      "timestamp": "2026-06-08 18:00",
      "status": "PROGRESS",
      "summary": "New enforcement draft prepared pending field verification.",
      "ai_flag": false,
      "evidence_refs": [],
      "badges": [
        "DRAFT"
      ],
      "doc_ref": "DOC-004",
      "duration": null
    },
    {
      "id": "N-S5-L5-01",
      "stage": "RECTIFICATION",
      "level": "ENTERPRISE",
      "title": "Quarterly audit Q4 2025",
      "owner": "ENT-KZ-AKT-0091",
      "timestamp": "2025-12-20 17:00",
      "status": "NORMAL",
      "summary": "Q4 third-party audit submitted on time.",
      "ai_flag": false,
      "evidence_refs": [],
      "badges": [],
      "doc_ref": null,
      "duration": null
    },
    {
      "id": "N-S5-L5-02",
      "stage": "RECTIFICATION",
      "level": "ENTERPRISE",
      "title": "Quarterly audit Q1 2026",
      "owner": "ENT-KZ-AKT-0091",
      "timestamp": "2026-01-25 16:10",
      "status": "NORMAL",
      "summary": "Q1 third-party audit submitted on time.",
      "ai_flag": false,
      "evidence_refs": [],
      "badges": [],
      "doc_ref": null,
      "duration": null
    },
    {
      "id": "N-S5-L5-03",
      "stage": "RECTIFICATION",
      "level": "ENTERPRISE",
      "title": "Quarterly audit Q2 2026",
      "owner": "ENT-KZ-AKT-0091",
      "timestamp": "2026-04-30 23:55",
      "status": "WARNING",
      "summary": "Q2 audit revealed +20% data gap and night-time pattern (sim 0.87 to ANO-2025-0317). Filed but flagged.",
      "ai_flag": true,
      "evidence_refs": [
        "SRC-21"
      ],
      "badges": [
        "SIM 0.87"
      ],
      "doc_ref": null,
      "duration": null
    },
    {
      "id": "N-S5-L3-01",
      "stage": "RECTIFICATION",
      "level": "DIVISION",
      "title": "Rectification Division tracking",
      "owner": "Rectification Division",
      "timestamp": "2026-05-05 09:30",
      "status": "WARNING",
      "summary": "Recommended additional follow-up audit. Action delayed.",
      "ai_flag": false,
      "evidence_refs": [],
      "badges": [],
      "doc_ref": null,
      "duration": "28d"
    },
    {
      "id": "N-S5-L4-01",
      "stage": "RECTIFICATION",
      "level": "REGIONAL",
      "title": "Auditor independence flag",
      "owner": "Mangystau Regional Insp.",
      "timestamp": "2026-05-22 14:00",
      "status": "CRITICAL",
      "summary": "Third-party audit firm shares partner with shell holding network.",
      "ai_flag": true,
      "evidence_refs": [
        "SRC-32"
      ],
      "badges": [
        "INDEPENDENCE RISK"
      ],
      "doc_ref": null,
      "duration": null
    },
    {
      "id": "N-S6-L3-01",
      "stage": "REVIEW",
      "level": "DIVISION",
      "title": "Cross-division consultation",
      "owner": "Approval + Inspection Divs.",
      "timestamp": "2026-06-07 13:20",
      "status": "WARNING",
      "summary": "Reporting drift + low inspection coverage + audit independence all confirmed.",
      "ai_flag": false,
      "evidence_refs": [
        "SRC-31",
        "SRC-32"
      ],
      "badges": [],
      "doc_ref": null,
      "duration": null
    },
    {
      "id": "N-S6-L2-01",
      "stage": "REVIEW",
      "level": "DEPARTMENT",
      "title": "Review Committee verdict",
      "owner": "Energy Reg. Dept. Committee",
      "timestamp": "2026-06-07 17:00",
      "status": "CRITICAL",
      "summary": "Verdict: probability of undeclared capacity expansion = 0.85.",
      "ai_flag": true,
      "evidence_refs": [
        "SRC-31",
        "SRC-32"
      ],
      "badges": [
        "P=0.85"
      ],
      "doc_ref": null,
      "duration": null
    },
    {
      "id": "N-S6-L1-01",
      "stage": "REVIEW",
      "level": "MINISTRY",
      "title": "Vice-Minister escalation note",
      "owner": "Vice-Minister Office",
      "timestamp": "2026-06-08 08:40",
      "status": "PROGRESS",
      "summary": "Endorsed escalation. Requested joint dispatch + briefing memo.",
      "ai_flag": false,
      "evidence_refs": [],
      "badges": [
        "ESCALATED"
      ],
      "doc_ref": null,
      "duration": null
    },
    {
      "id": "N-S7-L4-01",
      "stage": "ACCEPTANCE",
      "level": "REGIONAL",
      "title": "Field re-verification",
      "owner": "Mangystau Regional Insp.",
      "timestamp": null,
      "status": "PENDING",
      "summary": "Scheduled after joint inspection (Stage 3) completes.",
      "ai_flag": false,
      "evidence_refs": [],
      "badges": [],
      "doc_ref": null,
      "duration": null
    },
    {
      "id": "N-S7-L3-01",
      "stage": "ACCEPTANCE",
      "level": "DIVISION",
      "title": "Acceptance Division check",
      "owner": "Acceptance Division",
      "timestamp": null,
      "status": "PENDING",
      "summary": "Will validate corrective measures after field re-verification.",
      "ai_flag": false,
      "evidence_refs": [],
      "badges": [],
      "doc_ref": null,
      "duration": null
    },
    {
      "id": "N-S7-L2-01",
      "stage": "ACCEPTANCE",
      "level": "DEPARTMENT",
      "title": "Dept. acceptance sign-off",
      "owner": "Energy Reg. Dept.",
      "timestamp": null,
      "status": "PENDING",
      "summary": "Final acceptance only after audit (Stage 8) concludes.",
      "ai_flag": false,
      "evidence_refs": [],
      "badges": [],
      "doc_ref": null,
      "duration": null
    },
    {
      "id": "N-S8-L5-01",
      "stage": "AUDIT",
      "level": "ENTERPRISE",
      "title": "Enterprise audit cooperation",
      "owner": "ENT-KZ-AKT-0091",
      "timestamp": "2026-06-08 19:00",
      "status": "PROGRESS",
      "summary": "Notified to provide raw meter telemetry for METER-AKT-044 audit.",
      "ai_flag": false,
      "evidence_refs": [],
      "badges": [
        "METER-AKT-044"
      ],
      "doc_ref": null,
      "duration": null
    },
    {
      "id": "N-S8-L3-01",
      "stage": "AUDIT",
      "level": "DIVISION",
      "title": "Audit independence review",
      "owner": "Audit Division",
      "timestamp": "2026-06-08 16:00",
      "status": "CRITICAL",
      "summary": "AI flagged auditor independence breach. Recommended re-assignment.",
      "ai_flag": true,
      "evidence_refs": [
        "SRC-32"
      ],
      "badges": [],
      "doc_ref": null,
      "duration": null
    },
    {
      "id": "N-S8-L2-01",
      "stage": "AUDIT",
      "level": "DEPARTMENT",
      "title": "Special audit kickoff",
      "owner": "Energy Reg. Dept.",
      "timestamp": "2026-06-08 18:30",
      "status": "PROGRESS",
      "summary": "New audit team assembled with independence cross-check.",
      "ai_flag": false,
      "evidence_refs": [],
      "badges": [
        "NEW TEAM"
      ],
      "doc_ref": null,
      "duration": null
    },
    {
      "id": "N-S8-L1-01",
      "stage": "AUDIT",
      "level": "MINISTRY",
      "title": "Audit oversight directive",
      "owner": "Vice-Minister Office",
      "timestamp": "2026-06-08 19:45",
      "status": "PROGRESS",
      "summary": "Direct oversight requested due to systemic risk.",
      "ai_flag": false,
      "evidence_refs": [],
      "badges": [],
      "doc_ref": null,
      "duration": null
    },
    {
      "id": "N-S9-L1-01",
      "stage": "DISCLOSURE",
      "level": "MINISTRY",
      "title": "Minister briefing (signature)",
      "owner": "Minister Office",
      "timestamp": "2026-06-08 21:05",
      "status": "CRITICAL",
      "summary": "DOC-001 ready for signature. 72h action window engaged.",
      "ai_flag": false,
      "evidence_refs": [
        "SRC-21",
        "SRC-22",
        "SRC-31",
        "SRC-32",
        "SRC-41"
      ],
      "badges": [
        "READY FOR SIGNATURE",
        "72h"
      ],
      "doc_ref": "DOC-001",
      "duration": null
    },
    {
      "id": "N-S9-L2-01",
      "stage": "DISCLOSURE",
      "level": "DEPARTMENT",
      "title": "Public bulletin draft",
      "owner": "Energy Reg. Dept. Comms",
      "timestamp": null,
      "status": "PENDING",
      "summary": "Held until Minister signs DOC-001.",
      "ai_flag": false,
      "evidence_refs": [],
      "badges": [],
      "doc_ref": null,
      "duration": null
    },
    {
      "id": "N-S9-L3-01",
      "stage": "DISCLOSURE",
      "level": "DIVISION",
      "title": "Dispatch notice prep",
      "owner": "Operations Divisions",
      "timestamp": "2026-06-08 20:20",
      "status": "PROGRESS",
      "summary": "DOC-002 interagency dispatch queued. Awaiting Minister approval.",
      "ai_flag": false,
      "evidence_refs": [],
      "badges": [],
      "doc_ref": "DOC-002",
      "duration": null
    },
    {
      "id": "N-S9-L5-01",
      "stage": "DISCLOSURE",
      "level": "ENTERPRISE",
      "title": "Mandatory disclosure obligation",
      "owner": "ENT-KZ-AKT-0091",
      "timestamp": null,
      "status": "PENDING",
      "summary": "Required to publish disclosure once order issued.",
      "ai_flag": false,
      "evidence_refs": [],
      "badges": [],
      "doc_ref": null,
      "duration": null
    }
  ],
  "edges": [
    {
      "from": "N-S1-L5-01",
      "to": "N-S1-L3-01",
      "type": "UP",
      "label": "submit"
    },
    {
      "from": "N-S1-L3-01",
      "to": "N-S1-L5-02",
      "type": "DOWN",
      "label": "return for refresh"
    },
    {
      "from": "N-S1-L5-02",
      "to": "N-S1-L3-02",
      "type": "UP",
      "label": "resubmit"
    },
    {
      "from": "N-S1-L3-02",
      "to": "N-S1-L2-01",
      "type": "UP",
      "label": "tech sign-off"
    },
    {
      "from": "N-S1-L2-01",
      "to": "N-S1-L1-01",
      "type": "UP",
      "label": "pending approval"
    },
    {
      "from": "N-S2-L5-01",
      "to": "N-S2-L3-01",
      "type": "UP",
      "label": null
    },
    {
      "from": "N-S2-L5-02",
      "to": "N-S2-L3-01",
      "type": "UP",
      "label": null
    },
    {
      "from": "N-S2-L5-03",
      "to": "N-S2-L3-01",
      "type": "UP",
      "label": null
    },
    {
      "from": "N-S2-L3-01",
      "to": "N-S2-L2-01",
      "type": "UP",
      "label": null
    },
    {
      "from": "N-S3-L4-01",
      "to": "N-S3-L3-01",
      "type": "UP",
      "label": "report findings"
    },
    {
      "from": "N-S3-L3-01",
      "to": "N-S3-L2-01",
      "type": "UP",
      "label": "escalate"
    },
    {
      "from": "N-S3-L2-01",
      "to": "N-S3-L1-01",
      "type": "UP",
      "label": "request authorization"
    },
    {
      "from": "N-S4-L3-01",
      "to": "N-S4-L2-01",
      "type": "UP",
      "label": null
    },
    {
      "from": "N-S4-L2-01",
      "to": "N-S4-L5-01",
      "type": "DOWN",
      "label": "execute"
    },
    {
      "from": "N-S4-L3-02",
      "to": "N-S4-L2-01",
      "type": "UP",
      "label": "draft new"
    },
    {
      "from": "N-S5-L5-01",
      "to": "N-S5-L3-01",
      "type": "UP",
      "label": null
    },
    {
      "from": "N-S5-L5-02",
      "to": "N-S5-L3-01",
      "type": "UP",
      "label": null
    },
    {
      "from": "N-S5-L5-03",
      "to": "N-S5-L3-01",
      "type": "UP",
      "label": null
    },
    {
      "from": "N-S5-L3-01",
      "to": "N-S5-L4-01",
      "type": "LATERAL",
      "label": "check independence"
    },
    {
      "from": "N-S6-L3-01",
      "to": "N-S6-L2-01",
      "type": "UP",
      "label": null
    },
    {
      "from": "N-S6-L2-01",
      "to": "N-S6-L1-01",
      "type": "UP",
      "label": null
    },
    {
      "from": "N-S7-L4-01",
      "to": "N-S7-L3-01",
      "type": "UP",
      "label": null
    },
    {
      "from": "N-S7-L3-01",
      "to": "N-S7-L2-01",
      "type": "UP",
      "label": null
    },
    {
      "from": "N-S8-L5-01",
      "to": "N-S8-L3-01",
      "type": "UP",
      "label": null
    },
    {
      "from": "N-S8-L3-01",
      "to": "N-S8-L2-01",
      "type": "UP",
      "label": null
    },
    {
      "from": "N-S8-L2-01",
      "to": "N-S8-L1-01",
      "type": "UP",
      "label": null
    },
    {
      "from": "N-S9-L3-01",
      "to": "N-S9-L2-01",
      "type": "UP",
      "label": null
    },
    {
      "from": "N-S9-L2-01",
      "to": "N-S9-L1-01",
      "type": "UP",
      "label": null
    },
    {
      "from": "N-S9-L1-01",
      "to": "N-S9-L5-01",
      "type": "DOWN",
      "label": "mandatory disclosure"
    },
    {
      "from": "N-S1-L3-02",
      "to": "N-S2-L3-01",
      "type": "FORWARD",
      "label": "enter monitoring"
    },
    {
      "from": "N-S2-L3-01",
      "to": "N-S3-L3-01",
      "type": "FORWARD",
      "label": "trigger inspection"
    },
    {
      "from": "N-S3-L3-01",
      "to": "N-S6-L3-01",
      "type": "FORWARD",
      "label": "feed review"
    },
    {
      "from": "N-S2-L2-01",
      "to": "N-S6-L2-01",
      "type": "FORWARD",
      "label": "feed review"
    },
    {
      "from": "N-S5-L4-01",
      "to": "N-S6-L2-01",
      "type": "FORWARD",
      "label": "independence input"
    },
    {
      "from": "N-S4-L3-01",
      "to": "N-S5-L5-01",
      "type": "FORWARD",
      "label": "rectification mandate"
    },
    {
      "from": "N-S6-L1-01",
      "to": "N-S8-L1-01",
      "type": "FORWARD",
      "label": "order audit"
    },
    {
      "from": "N-S6-L1-01",
      "to": "N-S3-L1-01",
      "type": "FORWARD",
      "label": "order dispatch"
    },
    {
      "from": "N-S8-L3-01",
      "to": "N-S9-L3-01",
      "type": "FORWARD",
      "label": "audit-driven disclosure"
    },
    {
      "from": "N-S6-L1-01",
      "to": "N-S9-L1-01",
      "type": "FORWARD",
      "label": "request briefing"
    },
    {
      "from": "N-S3-L3-01",
      "to": "N-S1-L2-01",
      "type": "RETURN",
      "label": "approval on hold ◀"
    },
    {
      "from": "N-S8-L3-01",
      "to": "N-S5-L4-01",
      "type": "RETURN",
      "label": "redo independence ◀"
    },
    {
      "from": "N-S6-L2-01",
      "to": "N-S2-L5-03",
      "type": "RETURN",
      "label": "compel re-report ◀"
    }
  ],
  "optimization": {
    "current_total_time": "11d 6h",
    "optimized_total_time": "3d 14h",
    "saved_percent": 68,
    "strategies": [
      {
        "id": "OPT-01",
        "label": "AI AUTO VERIFICATION",
        "description": "Let AI consolidate Reporting + Inspection cross-checks at the Division layer.",
        "saves": "2d 4h",
        "applies_to_stages": [
          "REPORTING",
          "INSPECTION"
        ]
      },
      {
        "id": "OPT-02",
        "label": "SINGLE-LEVEL APPROVAL",
        "description": "Collapse Division + Department review into one committee for low-risk apps.",
        "saves": "4d 6h",
        "applies_to_stages": [
          "APPROVAL"
        ]
      },
      {
        "id": "OPT-03",
        "label": "DIRECT MINISTERIAL ESCALATION",
        "description": "For P >= 0.8 cases, jump straight to Ministry briefing.",
        "saves": "2d 0h",
        "applies_to_stages": [
          "REVIEW",
          "DISCLOSURE"
        ]
      },
      {
        "id": "OPT-04",
        "label": "PARALLEL JOINT INSPECTION",
        "description": "Run Tax, Customs, and Regional inspection in parallel instead of sequence.",
        "saves": "1d 18h",
        "applies_to_stages": [
          "INSPECTION",
          "AUDIT"
        ]
      }
    ]
  },
  "bottlenecks": [
    {
      "stage": "APPROVAL",
      "level": "DEPARTMENT",
      "duration": "45d 0h",
      "reason": "Tech committee on hold"
    },
    {
      "stage": "RECTIFICATION",
      "level": "DIVISION",
      "duration": "28d 0h",
      "reason": "Follow-up audit delayed"
    },
    {
      "stage": "APPROVAL",
      "level": "DIVISION",
      "duration": "14d 0h",
      "reason": "Tech pre-review backlog"
    },
    {
      "stage": "REVIEW",
      "level": "DEPARTMENT",
      "duration": "8h",
      "reason": "Committee convened same day"
    }
  ],
  "layer_timing": [
    {
      "level": "MINISTRY",
      "mean_hours": 6.0
    },
    {
      "level": "DEPARTMENT",
      "mean_hours": 110.0
    },
    {
      "level": "DIVISION",
      "mean_hours": 78.0
    },
    {
      "level": "REGIONAL",
      "mean_hours": 44.0
    },
    {
      "level": "ENTERPRISE",
      "mean_hours": 26.0
    }
  ],
  "kpis": {
    "stages_total": 9,
    "levels_total": 5,
    "nodes_total": 38,
    "edges_total": 42,
    "return_edges": 3,
    "ai_flagged_nodes": 9,
    "critical_nodes": 7,
    "overall_progress_percent": 78
  }
};
