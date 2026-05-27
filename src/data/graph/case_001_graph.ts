const DATA = {
  "meta": {
    "id": "GRAPH-CASE-2026-001",
    "case_id": "CASE-2026-001",
    "title": "Hidden Network Analysis — Western Caspian Energy LLC",
    "anchor_node": "ENT-KZ-AKT-0091",
    "max_depth": 5,
    "generated_at": "2026-05-28T14:32:18Z",
    "ontology_engine": "ONTOLOGY-ENGINE-V2.1",
    "node_count": 27,
    "edge_count": 35,
    "discovered_risk_paths": 3
  },
  "ontology": {
    "node_types": [
      {
        "id": "ENTERPRISE",
        "label_en": "Enterprise",
        "shape": "rectangle",
        "icon": "Building2"
      },
      {
        "id": "FACILITY",
        "label_en": "Facility",
        "shape": "rectangle",
        "icon": "Factory"
      },
      {
        "id": "PERSON",
        "label_en": "Person",
        "shape": "circle",
        "icon": "User"
      },
      {
        "id": "EVENT",
        "label_en": "Event",
        "shape": "diamond",
        "icon": "Zap"
      },
      {
        "id": "CASE",
        "label_en": "Case",
        "shape": "diamond",
        "icon": "Briefcase"
      },
      {
        "id": "METER",
        "label_en": "Meter",
        "shape": "triangle",
        "icon": "Gauge"
      },
      {
        "id": "SHELL",
        "label_en": "Shell Company",
        "shape": "hexagon",
        "icon": "EyeOff"
      },
      {
        "id": "AUDIT_FIRM",
        "label_en": "Audit Firm",
        "shape": "hexagon",
        "icon": "ShieldCheck"
      },
      {
        "id": "APPLICATION",
        "label_en": "Application",
        "shape": "rectangle",
        "icon": "FileText"
      },
      {
        "id": "TRANSACTION",
        "label_en": "Transaction",
        "shape": "diamond",
        "icon": "ArrowRightLeft"
      }
    ],
    "edge_types": [
      {
        "id": "OWNS",
        "label_en": "Owns",
        "style": "solid"
      },
      {
        "id": "OPERATES",
        "label_en": "Operates",
        "style": "solid"
      },
      {
        "id": "LEGAL_REP_OF",
        "label_en": "Legal Rep of",
        "style": "solid"
      },
      {
        "id": "FINANCE_OFFICER_OF",
        "label_en": "Finance Officer of",
        "style": "solid"
      },
      {
        "id": "HIDDEN_SHAREHOLDER_OF",
        "label_en": "Hidden Shareholder of",
        "style": "dashed",
        "color": "#E14B4B"
      },
      {
        "id": "TRIGGERED_BY",
        "label_en": "Triggered by",
        "style": "solid"
      },
      {
        "id": "LINKED_TO",
        "label_en": "Linked to",
        "style": "dashed"
      },
      {
        "id": "VIOLATED",
        "label_en": "Violated",
        "style": "solid",
        "color": "#E14B4B"
      },
      {
        "id": "AUDITS",
        "label_en": "Audits",
        "style": "solid"
      },
      {
        "id": "TRANSFERS_TO",
        "label_en": "Transfers to",
        "style": "solid",
        "color": "#E7A53A"
      },
      {
        "id": "SHARES_METER_WITH",
        "label_en": "Shares Meter with",
        "style": "dashed",
        "color": "#E14B4B"
      },
      {
        "id": "SERVED_BY",
        "label_en": "Served by",
        "style": "solid"
      },
      {
        "id": "ISSUED_TO",
        "label_en": "Issued to",
        "style": "solid"
      },
      {
        "id": "FILED_BY",
        "label_en": "Filed by",
        "style": "solid"
      },
      {
        "id": "RELATES_TO",
        "label_en": "Relates to",
        "style": "dotted"
      }
    ]
  },
  "nodes": [
    {
      "id": "ENT-KZ-AKT-0091",
      "type": "ENTERPRISE",
      "label": "Western Caspian Energy LLC",
      "subtype": "OIL_AND_GAS",
      "layer": 0,
      "is_anchor": true,
      "is_focus": true,
      "risk_level": "CRITICAL",
      "properties": {
        "name_en": "Western Caspian Energy LLC",
        "registered": "2015-03-18",
        "head_office": "Aktau, Mangistau Region",
        "employees": 1240,
        "industry": "OIL_AND_GAS"
      }
    },
    {
      "id": "ANO-2026-0512",
      "type": "EVENT",
      "label": "Night-time throughput +40%",
      "subtype": "ANOMALY",
      "layer": 1,
      "risk_level": "CRITICAL",
      "properties": {
        "detected_at": "2026-05-28T14:32:00Z",
        "headline": "Gas throughput +40.4% over 6 working days",
        "severity": "CRITICAL"
      }
    },
    {
      "id": "CASE-2026-001",
      "type": "CASE",
      "label": "Active attribution case",
      "subtype": "ATTRIBUTION_IN_PROGRESS",
      "layer": 1,
      "risk_level": "CRITICAL",
      "properties": {
        "status": "ATTRIBUTION_IN_PROGRESS",
        "initiated_at": "2026-05-28T14:32:18Z",
        "primary_cause_probability": 0.85
      }
    },
    {
      "id": "FAC-KZ-AKT-GCS-001",
      "type": "FACILITY",
      "label": "Aktau Main Compressor",
      "subtype": "GAS_COMPRESSOR",
      "layer": 1,
      "risk_level": "CRITICAL",
      "properties": {
        "coords": [
          51.1605,
          43.6532
        ],
        "commissioned": "2018-04-15",
        "design_capacity": "18 MMcm/d"
      }
    },
    {
      "id": "FAC-KZ-AKT-OWF-001",
      "type": "FACILITY",
      "label": "Uzen Oilfield Central",
      "subtype": "OIL_WELLFIELD",
      "layer": 1,
      "risk_level": "NORMAL"
    },
    {
      "id": "FAC-KZ-AKT-GCS-002",
      "type": "FACILITY",
      "label": "Uzen Compressor",
      "subtype": "GAS_COMPRESSOR",
      "layer": 1,
      "risk_level": "WARNING"
    },
    {
      "id": "PERSON-K-00214",
      "type": "PERSON",
      "label": "A. K. Bekturov",
      "subtype": "LEGAL_REPRESENTATIVE",
      "layer": 1,
      "risk_level": "WARNING",
      "properties": {
        "role": "Legal Representative of ENT-KZ-AKT-0091",
        "tenure_since": "2019-06-01"
      }
    },
    {
      "id": "PERSON-K-00731",
      "type": "PERSON",
      "label": "S. R. Nazarov",
      "subtype": "FINANCE_OFFICER",
      "layer": 1,
      "risk_level": "WARNING",
      "properties": {
        "role": "Finance Officer of ENT-KZ-AKT-0091",
        "tenure_since": "2021-09-12"
      }
    },
    {
      "id": "APP-2026-0078",
      "type": "APPLICATION",
      "label": "Compressor Unit-2C filing",
      "subtype": "PERMIT_APPLICATION",
      "layer": 1,
      "risk_level": "WARNING",
      "properties": {
        "submitted": "2026-02-02",
        "status": "OVERDUE_45D",
        "throughput_kw": "+6 MMcm/d"
      }
    },
    {
      "id": "CASE-2025-088",
      "type": "CASE",
      "label": "2025 violation case",
      "subtype": "CLOSED_VIOLATION",
      "layer": 1,
      "risk_level": "WARNING",
      "properties": {
        "occurred": "2025-09-12",
        "closed": "2025-11-04",
        "fine_kzt": 240000000,
        "violation_type": "UNREPORTED_NIGHT_PRODUCTION"
      }
    },
    {
      "id": "SHELL-K-2103",
      "type": "SHELL",
      "label": "Caspi Holdings Ltd.",
      "subtype": "SHELL_COMPANY",
      "layer": 2,
      "risk_level": "CRITICAL",
      "properties": {
        "registered": "2020-08-04",
        "jurisdiction": "Kazakhstan (Almaty)",
        "declared_activity": "Consulting services",
        "ai_flag": "ZERO_OPERATIONAL_FOOTPRINT",
        "shareholder_disclosure": "INCOMPLETE"
      }
    },
    {
      "id": "ENT-KZ-ATY-0507",
      "type": "ENTERPRISE",
      "label": "Atyrau Trade & Logistics LLC",
      "subtype": "LOGISTICS",
      "layer": 2,
      "risk_level": "WARNING",
      "properties": {
        "registered": "2018-11-22",
        "head_office": "Atyrau",
        "ai_flag": "ABNORMAL_CASHFLOW_PATTERN"
      }
    },
    {
      "id": "AUDIT-FIRM-049",
      "type": "AUDIT_FIRM",
      "label": "Caspian Audit Partners",
      "subtype": "THIRD_PARTY_AUDITOR",
      "layer": 2,
      "risk_level": "WARNING",
      "properties": {
        "licensed": "2017",
        "ai_flag": "REPEAT_CLIENT_INDEPENDENCE_CONCERN",
        "audits_completed_for_anchor": 3
      }
    },
    {
      "id": "METER-AKT-001",
      "type": "METER",
      "label": "Aktau Custody Transfer",
      "subtype": "CUSTODY_TRANSFER_METER",
      "layer": 2,
      "risk_level": "NORMAL"
    },
    {
      "id": "TRANS-2026-1184",
      "type": "TRANSACTION",
      "label": "Cash transfer 480M KZT",
      "subtype": "ABNORMAL_TRANSFER",
      "layer": 2,
      "risk_level": "WARNING",
      "properties": {
        "date": "2026-04-22",
        "amount_kzt": 480000000,
        "currency": "KZT",
        "ai_flag": "AMOUNT_INCONSISTENT_WITH_DECLARED_SERVICES"
      }
    },
    {
      "id": "ENT-KZ-AKT-0203",
      "type": "ENTERPRISE",
      "label": "Mangistau Petrochemical JSC",
      "subtype": "PETROCHEMICAL",
      "layer": 3,
      "risk_level": "CRITICAL",
      "properties": {
        "registered": "2017-05-30",
        "head_office": "Aktau",
        "industry": "PETROCHEMICAL",
        "ai_flag": "HISTORICAL_VIOLATION_SAME_TYPE"
      }
    },
    {
      "id": "FAC-KZ-AKT-PCH-014",
      "type": "FACILITY",
      "label": "Mangistau Petrochem Plant",
      "subtype": "PETROCHEMICAL_PLANT",
      "layer": 3,
      "risk_level": "WARNING",
      "properties": {
        "coords": [
          51.185,
          43.711
        ],
        "operator": "ENT-KZ-AKT-0203"
      }
    },
    {
      "id": "PERSON-K-01548",
      "type": "PERSON",
      "label": "B. T. Iskakov",
      "subtype": "LEGAL_REPRESENTATIVE",
      "layer": 3,
      "risk_level": "NORMAL",
      "properties": {
        "role": "Legal Representative of ENT-KZ-AKT-0203"
      }
    },
    {
      "id": "CASE-2025-209",
      "type": "CASE",
      "label": "2025 petrochem violation",
      "subtype": "CLOSED_VIOLATION",
      "layer": 3,
      "risk_level": "CRITICAL",
      "properties": {
        "occurred": "2025-10-08",
        "closed": "2025-12-15",
        "fine_kzt": 185000000,
        "violation_type": "UNREPORTED_NIGHT_PRODUCTION",
        "ai_flag": "PATTERN_MATCH_TO_CURRENT_CASE"
      }
    },
    {
      "id": "WARN-2026-077",
      "type": "EVENT",
      "label": "Pending warning",
      "subtype": "REGULATORY_WARNING",
      "layer": 3,
      "risk_level": "WARNING",
      "properties": {
        "issued_to": "ENT-KZ-ATY-0507",
        "issued_at": "2026-03-11",
        "status": "UNRESOLVED"
      }
    },
    {
      "id": "AUDIT-OVERTURNED-088",
      "type": "EVENT",
      "label": "Overturned clean report",
      "subtype": "AUDIT_FAILURE",
      "layer": 3,
      "risk_level": "WARNING",
      "properties": {
        "issued_by": "AUDIT-FIRM-049",
        "occurred": "2023-09-04",
        "overturned_at": "2024-02-18",
        "context": "Originally issued clean audit; subsequent review found undisclosed liabilities"
      }
    },
    {
      "id": "SANC-2025-209",
      "type": "EVENT",
      "label": "Fine 185M KZT",
      "subtype": "SANCTION",
      "layer": 4,
      "risk_level": "CRITICAL",
      "properties": {
        "case": "CASE-2025-209",
        "amount_kzt": 185000000,
        "issued": "2025-12-15"
      }
    },
    {
      "id": "INSP-2025-411",
      "type": "EVENT",
      "label": "On-site inspection found unit",
      "subtype": "INSPECTION_FINDING",
      "layer": 4,
      "risk_level": "WARNING",
      "properties": {
        "case": "CASE-2025-209",
        "conducted_at": "2025-10-12",
        "finding": "Confirmed unreported compressor unit"
      }
    },
    {
      "id": "REPORT-Q1-2026-DISCREPANCY",
      "type": "EVENT",
      "label": "Tax-production discrepancy",
      "subtype": "CROSS_AGENCY_FLAG",
      "layer": 4,
      "risk_level": "WARNING",
      "properties": {
        "for_entity": "ENT-KZ-AKT-0091",
        "detected": "2026-04-18",
        "tax_revenue_overage_pct": 18
      }
    },
    {
      "id": "CUSTOMS-EXPORT-FLAG",
      "type": "EVENT",
      "label": "Customs export +12% gap",
      "subtype": "CROSS_AGENCY_FLAG",
      "layer": 4,
      "risk_level": "WARNING",
      "properties": {
        "for_entity": "ENT-KZ-AKT-0091",
        "detected": "2026-04-20",
        "export_overage_pct": 12
      }
    },
    {
      "id": "METER-AKT-044",
      "type": "METER",
      "label": "Shared metering node",
      "subtype": "INDUSTRIAL_LOAD_METER",
      "layer": 5,
      "risk_level": "CRITICAL",
      "is_smoking_gun": true,
      "properties": {
        "coords": [
          51.172,
          43.658
        ],
        "ai_flag": "DUAL_TENANT_REGISTRATION",
        "registered_to": [
          "ENT-KZ-AKT-0091",
          "ENT-KZ-AKT-0203"
        ],
        "discovery_method": "Cross-referenced customer registry with SCADA topology"
      }
    },
    {
      "id": "SHARE-PATTERN-METER044",
      "type": "EVENT",
      "label": "Load-splitting pattern",
      "subtype": "AI_INFERENCE",
      "layer": 5,
      "risk_level": "CRITICAL",
      "properties": {
        "detected_at": "2026-05-28T14:30:00Z",
        "headline": "Statistical evidence of cross-attribution of consumption",
        "ai_confidence": 0.79
      }
    },
    {
      "id": "FAC-KZ-AKT-PCH-014-SUB",
      "type": "FACILITY",
      "label": "Petrochem Sub-station 7",
      "subtype": "SUBSTATION",
      "layer": 5,
      "risk_level": "WARNING",
      "properties": {
        "served_by_meter": "METER-AKT-044"
      }
    }
  ],
  "edges": [
    {
      "id": "E001",
      "source": "ENT-KZ-AKT-0091",
      "target": "FAC-KZ-AKT-GCS-001",
      "type": "OPERATES",
      "weight": 1.0,
      "risk_level": "CRITICAL",
      "label": "operates"
    },
    {
      "id": "E002",
      "source": "ENT-KZ-AKT-0091",
      "target": "FAC-KZ-AKT-OWF-001",
      "type": "OPERATES",
      "weight": 1.0,
      "label": "operates"
    },
    {
      "id": "E003",
      "source": "ENT-KZ-AKT-0091",
      "target": "FAC-KZ-AKT-GCS-002",
      "type": "OPERATES",
      "weight": 1.0,
      "label": "operates"
    },
    {
      "id": "E004",
      "source": "PERSON-K-00214",
      "target": "ENT-KZ-AKT-0091",
      "type": "LEGAL_REP_OF",
      "weight": 1.0,
      "risk_level": "WARNING",
      "label": "legal rep"
    },
    {
      "id": "E005",
      "source": "PERSON-K-00731",
      "target": "ENT-KZ-AKT-0091",
      "type": "FINANCE_OFFICER_OF",
      "weight": 1.0,
      "risk_level": "WARNING",
      "label": "finance officer"
    },
    {
      "id": "E006",
      "source": "ENT-KZ-AKT-0091",
      "target": "APP-2026-0078",
      "type": "FILED_BY",
      "weight": 1.0,
      "risk_level": "WARNING",
      "label": "filed"
    },
    {
      "id": "E007",
      "source": "ENT-KZ-AKT-0091",
      "target": "CASE-2025-088",
      "type": "VIOLATED",
      "weight": 1.0,
      "risk_level": "WARNING",
      "label": "historical violation"
    },
    {
      "id": "E008",
      "source": "ANO-2026-0512",
      "target": "FAC-KZ-AKT-GCS-001",
      "type": "TRIGGERED_BY",
      "weight": 1.0,
      "risk_level": "CRITICAL",
      "label": "anomaly at"
    },
    {
      "id": "E009",
      "source": "CASE-2026-001",
      "target": "ANO-2026-0512",
      "type": "TRIGGERED_BY",
      "weight": 1.0,
      "risk_level": "CRITICAL",
      "label": "triggered by"
    },
    {
      "id": "E010",
      "source": "CASE-2026-001",
      "target": "ENT-KZ-AKT-0091",
      "type": "RELATES_TO",
      "weight": 1.0,
      "risk_level": "CRITICAL",
      "label": "subject"
    },
    {
      "id": "E011",
      "source": "PERSON-K-00214",
      "target": "SHELL-K-2103",
      "type": "HIDDEN_SHAREHOLDER_OF",
      "weight": 0.95,
      "risk_level": "CRITICAL",
      "label": "hidden shareholder 40%",
      "is_critical_path": true
    },
    {
      "id": "E012",
      "source": "PERSON-K-00731",
      "target": "ENT-KZ-ATY-0507",
      "type": "LEGAL_REP_OF",
      "weight": 1.0,
      "risk_level": "WARNING",
      "label": "legal rep of"
    },
    {
      "id": "E013",
      "source": "AUDIT-FIRM-049",
      "target": "ENT-KZ-AKT-0091",
      "type": "AUDITS",
      "weight": 1.0,
      "risk_level": "WARNING",
      "label": "audits (3 audits)"
    },
    {
      "id": "E014",
      "source": "ENT-KZ-AKT-0091",
      "target": "METER-AKT-001",
      "type": "SERVED_BY",
      "weight": 1.0,
      "label": "metered by"
    },
    {
      "id": "E015",
      "source": "ENT-KZ-ATY-0507",
      "target": "TRANS-2026-1184",
      "type": "TRANSFERS_TO",
      "weight": 0.85,
      "risk_level": "WARNING",
      "label": "abnormal cashflow"
    },
    {
      "id": "E016",
      "source": "TRANS-2026-1184",
      "target": "ENT-KZ-AKT-0091",
      "type": "TRANSFERS_TO",
      "weight": 0.85,
      "risk_level": "WARNING",
      "label": "received 480M KZT"
    },
    {
      "id": "E017",
      "source": "SHELL-K-2103",
      "target": "ENT-KZ-AKT-0203",
      "type": "OWNS",
      "weight": 0.92,
      "risk_level": "CRITICAL",
      "label": "owns 35%",
      "is_critical_path": true
    },
    {
      "id": "E018",
      "source": "ENT-KZ-AKT-0203",
      "target": "FAC-KZ-AKT-PCH-014",
      "type": "OPERATES",
      "weight": 1.0,
      "label": "operates"
    },
    {
      "id": "E019",
      "source": "PERSON-K-01548",
      "target": "ENT-KZ-AKT-0203",
      "type": "LEGAL_REP_OF",
      "weight": 1.0,
      "label": "legal rep"
    },
    {
      "id": "E020",
      "source": "ENT-KZ-AKT-0203",
      "target": "CASE-2025-209",
      "type": "VIOLATED",
      "weight": 1.0,
      "risk_level": "CRITICAL",
      "label": "violated",
      "is_critical_path": true
    },
    {
      "id": "E021",
      "source": "ENT-KZ-ATY-0507",
      "target": "WARN-2026-077",
      "type": "ISSUED_TO",
      "weight": 1.0,
      "risk_level": "WARNING",
      "label": "pending warning"
    },
    {
      "id": "E022",
      "source": "AUDIT-FIRM-049",
      "target": "ENT-KZ-ATY-0507",
      "type": "AUDITS",
      "weight": 1.0,
      "risk_level": "WARNING",
      "label": "also audits"
    },
    {
      "id": "E023",
      "source": "AUDIT-FIRM-049",
      "target": "AUDIT-OVERTURNED-088",
      "type": "RELATES_TO",
      "weight": 1.0,
      "risk_level": "WARNING",
      "label": "historical failure"
    },
    {
      "id": "E024",
      "source": "CASE-2025-209",
      "target": "SANC-2025-209",
      "type": "RELATES_TO",
      "weight": 1.0,
      "label": "sanction"
    },
    {
      "id": "E025",
      "source": "CASE-2025-209",
      "target": "INSP-2025-411",
      "type": "RELATES_TO",
      "weight": 1.0,
      "label": "inspection finding"
    },
    {
      "id": "E026",
      "source": "ENT-KZ-AKT-0091",
      "target": "REPORT-Q1-2026-DISCREPANCY",
      "type": "RELATES_TO",
      "weight": 1.0,
      "risk_level": "WARNING",
      "label": "tax flag"
    },
    {
      "id": "E027",
      "source": "ENT-KZ-AKT-0091",
      "target": "CUSTOMS-EXPORT-FLAG",
      "type": "RELATES_TO",
      "weight": 1.0,
      "risk_level": "WARNING",
      "label": "customs flag"
    },
    {
      "id": "E028",
      "source": "ENT-KZ-AKT-0091",
      "target": "METER-AKT-044",
      "type": "SERVED_BY",
      "weight": 1.0,
      "risk_level": "CRITICAL",
      "label": "shares meter",
      "is_critical_path": true
    },
    {
      "id": "E029",
      "source": "ENT-KZ-AKT-0203",
      "target": "METER-AKT-044",
      "type": "SERVED_BY",
      "weight": 1.0,
      "risk_level": "CRITICAL",
      "label": "shares meter",
      "is_critical_path": true
    },
    {
      "id": "E030",
      "source": "METER-AKT-044",
      "target": "SHARE-PATTERN-METER044",
      "type": "RELATES_TO",
      "weight": 1.0,
      "risk_level": "CRITICAL",
      "label": "load-splitting evidence",
      "is_critical_path": true
    },
    {
      "id": "E031",
      "source": "METER-AKT-044",
      "target": "FAC-KZ-AKT-PCH-014-SUB",
      "type": "SERVED_BY",
      "weight": 1.0,
      "label": "meters"
    },
    {
      "id": "E032",
      "source": "FAC-KZ-AKT-PCH-014-SUB",
      "target": "FAC-KZ-AKT-PCH-014",
      "type": "RELATES_TO",
      "weight": 1.0,
      "label": "part of"
    },
    {
      "id": "E033",
      "source": "ENT-KZ-AKT-0091",
      "target": "ENT-KZ-AKT-0203",
      "type": "SHARES_METER_WITH",
      "weight": 0.95,
      "risk_level": "CRITICAL",
      "label": "shares METER-AKT-044 with",
      "is_critical_path": true,
      "is_inferred": true
    },
    {
      "id": "E034",
      "source": "CASE-2025-088",
      "target": "CASE-2025-209",
      "type": "LINKED_TO",
      "weight": 0.87,
      "risk_level": "CRITICAL",
      "label": "0.87 pattern match",
      "is_critical_path": true,
      "is_inferred": true
    },
    {
      "id": "E035",
      "source": "PERSON-K-00214",
      "target": "ENT-KZ-AKT-0203",
      "type": "LINKED_TO",
      "weight": 0.75,
      "risk_level": "WARNING",
      "label": "indirect control (via shell)",
      "is_inferred": true
    }
  ],
  "critical_paths": [
    {
      "id": "PATH_1_HIDDEN_OWNERSHIP",
      "title": "Hidden Ownership Chain",
      "severity": "CRITICAL",
      "summary": "Legal rep of anchor enterprise is hidden shareholder of a shell company that owns 35% of another energy enterprise with the same violation type.",
      "node_sequence": [
        "ENT-KZ-AKT-0091",
        "PERSON-K-00214",
        "SHELL-K-2103",
        "ENT-KZ-AKT-0203",
        "CASE-2025-209"
      ],
      "edge_sequence": [
        "E004",
        "E011",
        "E017",
        "E020"
      ],
      "risk_score": 0.91
    },
    {
      "id": "PATH_2_FINANCIAL_FLOW",
      "title": "Abnormal Cashflow",
      "severity": "WARNING",
      "summary": "Finance officer of anchor enterprise is legal rep of a logistics firm that wired 480M KZT to the anchor with no matching declared service.",
      "node_sequence": [
        "ENT-KZ-AKT-0091",
        "PERSON-K-00731",
        "ENT-KZ-ATY-0507",
        "TRANS-2026-1184"
      ],
      "edge_sequence": [
        "E005",
        "E012",
        "E015",
        "E016"
      ],
      "risk_score": 0.78
    },
    {
      "id": "PATH_3_SHARED_METER",
      "title": "Shared Metering Node — Smoking Gun",
      "severity": "CRITICAL",
      "summary": "Two enterprises share a single metering node, creating opportunity for cross-attribution of consumption. AI confirms statistical load-splitting pattern.",
      "node_sequence": [
        "ENT-KZ-AKT-0091",
        "METER-AKT-044",
        "ENT-KZ-AKT-0203",
        "SHARE-PATTERN-METER044"
      ],
      "edge_sequence": [
        "E028",
        "E029",
        "E030"
      ],
      "risk_score": 0.95
    }
  ],
  "ai_report": {
    "investigation_id": "INV-CASE-2026-001",
    "generated_at": "2026-05-28T14:32:18Z",
    "model": "LLM-MASTER-V3.1 + ONTOLOGY-ENGINE-V2.1",
    "summary_headline": "Potential coordinated regulatory-evasion network detected",
    "narrative_sections": [
      {
        "heading": "STARTING POINT",
        "body": "Investigation initiated from ENT-KZ-AKT-0091 following anomaly ANO-2026-0512 (night-time gas throughput +40%). AI traversed the knowledge graph to a depth of 5 layers, identifying 27 connected entities across 35 relationships."
      },
      {
        "heading": "FINDING 1 — HIDDEN OWNERSHIP",
        "body": "Legal representative of the anchor enterprise (PERSON-K-00214 / A. K. Bekturov) is registered as hidden shareholder (40%) of shell company SHELL-K-2103 (Caspi Holdings Ltd.), which in turn owns 35% of ENT-KZ-AKT-0203 (Mangistau Petrochemical JSC). This is a two-hop hidden control structure with no operational footprint at the shell."
      },
      {
        "heading": "FINDING 2 — PATTERN MATCH ACROSS LINKED ENTITY",
        "body": "ENT-KZ-AKT-0203 was fined 185M KZT in 2025-12 for the same violation type (UNREPORTED_NIGHT_PRODUCTION). Pattern morphology matches the current anomaly at 0.87 similarity. This is the second occurrence within the same hidden network in 18 months."
      },
      {
        "heading": "FINDING 3 — ABNORMAL CASHFLOW",
        "body": "Finance officer of anchor (PERSON-K-00731 / S. R. Nazarov) is concurrently legal representative of ENT-KZ-ATY-0507 (Atyrau Trade & Logistics LLC). On 2026-04-22, ENT-KZ-ATY-0507 transferred 480M KZT to anchor with no matching declared service. AI flags the amount as inconsistent with disclosed business activity."
      },
      {
        "heading": "FINDING 4 — AUDIT INDEPENDENCE",
        "body": "AUDIT-FIRM-049 (Caspian Audit Partners) performs all post-violation mandatory audits for the anchor enterprise (3 audits, 2025-2026) AND audits ENT-KZ-ATY-0507. The firm previously issued an overturned clean report in 2023. This creates an independence concern that explains the dismissed Q2 2026 yellow flag."
      },
      {
        "heading": "FINDING 5 — SMOKING GUN: SHARED METER",
        "body": "Critical discovery: METER-AKT-044 is jointly registered to ENT-KZ-AKT-0091 AND ENT-KZ-AKT-0203. Industrial-load metering topology shows both entities can attribute consumption to this single node. AI statistical analysis of 12-month load profile confirms load-splitting pattern with 0.79 confidence — indicating deliberate cross-attribution of consumption for regulatory evasion."
      }
    ],
    "conclusion": {
      "verdict": "COORDINATED_EVASION_NETWORK_PROBABLE",
      "confidence": 0.82,
      "rationale": "Five independent findings (hidden ownership, repeated violation, abnormal cashflow, audit conflict, shared metering) converge on a single hypothesis: a coordinated network using shell company ownership and shared metering to redistribute production attribution and evade detection.",
      "estimated_unreported_volume_mmcm": 75.4,
      "estimated_fiscal_impact_kzt": 1240000000
    },
    "recommended_joint_investigation": {
      "title": "INITIATE JOINT INVESTIGATION",
      "priority": "IMMEDIATE",
      "participants": [
        "Ministry of Energy (lead)",
        "Tax Authority",
        "Customs Service",
        "Financial Monitoring Agency",
        "State Audit Committee"
      ],
      "primary_targets": [
        "ENT-KZ-AKT-0091",
        "ENT-KZ-AKT-0203",
        "ENT-KZ-ATY-0507",
        "SHELL-K-2103",
        "AUDIT-FIRM-049"
      ],
      "primary_individuals": [
        "PERSON-K-00214 (A. K. Bekturov)",
        "PERSON-K-00731 (S. R. Nazarov)"
      ],
      "rationale": "Network scope exceeds single-agency jurisdiction. Tax and customs flags require formal interagency case opening under Article 47 of Energy Code combined with Article 312 of Tax Code."
    }
  }
};
export default DATA;
