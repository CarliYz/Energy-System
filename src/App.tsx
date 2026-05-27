import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { LanguageProvider } from './components/LanguageContext';

// Pages
import NationalGrid from './pages/NationalGrid';
import RegionalFacilities from './pages/RegionalFacilities';
import EquipmentProfile from './pages/EquipmentProfile';
import PipelineTimeSeries from './pages/PipelineTimeSeries';
import EnterpriseReporting from './pages/EnterpriseReporting';
import WorkflowAttribution from './pages/WorkflowAttribution';
import KnowledgeGraph from './pages/KnowledgeGraph';
import EventAudit from './pages/EventAudit';
import ReportGeneration from './pages/ReportGeneration';
import MinisterDashboard from './pages/MinisterDashboard';
import SentimentConsole from './pages/SentimentConsole';
import RegulatoryEffectiveness from './pages/RegulatoryEffectiveness';

export default function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/minister/dashboard" replace />} />
            
            <Route path="minister">
              <Route path="dashboard" element={<MinisterDashboard />} />
            </Route>

            <Route path="sensing">
              <Route path="national-grid" element={<NationalGrid />} />
              <Route path="regional/:regionId" element={<RegionalFacilities />} />
              {/* 1.3 is technically part of 1.2 drawer, but route helps for direct access */}
              <Route path="facility/:facilityId" element={<EquipmentProfile />} />
            </Route>

            <Route path="warning">
              <Route path="timeseries" element={<PipelineTimeSeries />} />
              <Route path="timeseries/:anomalyId" element={<PipelineTimeSeries />} />
              <Route path="enterprise" element={<EnterpriseReporting />} />
              <Route path="enterprise/:entId" element={<EnterpriseReporting />} />
              <Route path="sentiment" element={<SentimentConsole />} />
              <Route path="sentiment/:topicId" element={<SentimentConsole />} />
            </Route>

            <Route path="closure">
              <Route path="effectiveness" element={<RegulatoryEffectiveness />} />
              <Route path="effectiveness/:entityId" element={<RegulatoryEffectiveness />} />
            </Route>

            <Route path="attribution">
              <Route path="workflow" element={<WorkflowAttribution />} />
              <Route path="workflow/:caseId" element={<WorkflowAttribution />} />
              <Route path="graph" element={<KnowledgeGraph />} />
              <Route path="graph/:focusId" element={<KnowledgeGraph />} />
            </Route>

            <Route path="audit">
              <Route path="event/:caseId" element={<EventAudit />} />
              <Route path="report" element={<ReportGeneration />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </LanguageProvider>
  );
}

