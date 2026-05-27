import React from 'react';

export const Footer = () => {
  return (
    <footer className="h-[28px] bg-white border-t border-border-default flex items-center justify-between px-6 shrink-0 z-50">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 all-caps-label text-[9px]">
          <div className="w-2 h-2 rounded-full bg-status-success" />
          Ontology Engine: Nominal
        </div>
        <div className="flex items-center gap-2 all-caps-label text-[9px]">
          <div className="w-2 h-2 rounded-full bg-status-success" />
          AI Core: Connected
        </div>
        <div className="flex items-center gap-2 all-caps-label text-[9px]">
          <div className="w-2 h-2 rounded-full bg-status-success" />
          Data Ingest: Active
        </div>
      </div>

      <div className="all-caps-label text-[10px] text-text-tertiary">
        Region: KZ-Central (Astana)
      </div>

      <div className="flex items-center gap-4 all-caps-label text-[9px]">
        <span>Build: 2026.05.28.PRD-01</span>
        <span className="text-border-strong">|</span>
        <span>© 2026 KZ MOE AI AGENT</span>
      </div>
    </footer>
  );
};
