const DATA = {
  "facility_id": "FAC-KZ-AKT-GCS-001",
  "device_count": 12,
  "devices": [
    {
      "id": "DEV-GCS001-PT-01",
      "type": "PRESSURE_TRANSMITTER",
      "name": "Discharge Pressure Sensor",
      "status": "CRITICAL",
      "reading": "8.95 MPa",
      "baseline": "6.50 MPa",
      "delta_pct": 38,
      "last_sync": "2026-05-28T14:32:00Z"
    },
    {
      "id": "DEV-GCS001-PT-02",
      "type": "PRESSURE_TRANSMITTER",
      "name": "Suction Pressure Sensor",
      "status": "WARNING",
      "reading": "4.20 MPa",
      "baseline": "3.80 MPa",
      "delta_pct": 11,
      "last_sync": "2026-05-28T14:32:00Z"
    },
    {
      "id": "DEV-GCS001-FM-01",
      "type": "FLOW_METER",
      "name": "Inlet Flow Meter",
      "status": "NORMAL",
      "reading": "2,340 m³/h",
      "last_sync": "2026-05-28T14:32:00Z"
    },
    {
      "id": "DEV-GCS001-FM-02",
      "type": "FLOW_METER",
      "name": "Outlet Flow Meter",
      "status": "NORMAL",
      "reading": "2,338 m³/h",
      "last_sync": "2026-05-28T14:32:00Z"
    },
    {
      "id": "DEV-GCS001-TC-01",
      "type": "TEMPERATURE_CONTROLLER",
      "name": "Inlet Temperature",
      "status": "NORMAL",
      "reading": "87.3 °C",
      "last_sync": "2026-05-28T14:32:00Z"
    },
    {
      "id": "DEV-GCS001-TC-02",
      "type": "TEMPERATURE_CONTROLLER",
      "name": "Outlet Temperature",
      "status": "WARNING",
      "reading": "142.7 °C",
      "baseline": "128.0 °C",
      "delta_pct": 11,
      "last_sync": "2026-05-28T14:32:00Z"
    },
    {
      "id": "DEV-GCS001-VB-01",
      "type": "VIBRATION_SENSOR",
      "name": "Compressor #1 Vibration",
      "status": "NORMAL",
      "reading": "8.2 mm/s",
      "last_sync": "2026-05-28T14:32:00Z"
    },
    {
      "id": "DEV-GCS001-CP-01",
      "type": "COMPRESSOR_UNIT",
      "name": "Compressor Unit #1",
      "status": "NORMAL",
      "rpm": 8420,
      "load_pct": 72,
      "last_sync": "2026-05-28T14:32:00Z"
    },
    {
      "id": "DEV-GCS001-CP-02",
      "type": "COMPRESSOR_UNIT",
      "name": "Compressor Unit #2",
      "status": "CRITICAL",
      "rpm": 9180,
      "load_pct": 94,
      "vibration": "18.4 mm/s",
      "last_sync": "2026-05-28T14:32:00Z"
    },
    {
      "id": "DEV-GCS001-CP-03",
      "type": "COMPRESSOR_UNIT",
      "name": "Compressor Unit #3 (standby)",
      "status": "NORMAL",
      "rpm": 0,
      "load_pct": 0,
      "last_sync": "2026-05-28T14:32:00Z"
    },
    {
      "id": "DEV-GCS001-SC-01",
      "type": "SCADA_NODE",
      "name": "Local SCADA Controller",
      "status": "NORMAL",
      "uptime_h": 8420,
      "last_sync": "2026-05-28T14:32:00Z"
    },
    {
      "id": "DEV-GCS001-PW-01",
      "type": "POWER_MODULE",
      "name": "Auxiliary Power Module",
      "status": "NORMAL",
      "voltage": "10.5 kV",
      "last_sync": "2026-05-28T14:32:00Z"
    }
  ]
};
export default DATA;
