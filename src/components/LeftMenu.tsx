import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  BarChart3, 
  Map as MapIcon, 
  Activity, 
  ActivitySquare,
  AlertTriangle, 
  FileCheck, 
  GitBranch, 
  ShieldAlert, 
  FileText,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  BrainCircuit
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { useLanguage } from './LanguageContext';

const MENU_GROUPS = [
  {
    title: 'Act I · Panoramic Risk Sensing',
    color: '#2FA862',
    items: [
      { id: 'minister',    label: 'Minister Dashboard',     path: '/minister/dashboard',     icon: ShieldCheck,    count: null },
      { id: 'national',    label: 'National Energy Grid',   path: '/sensing/national-grid',  icon: MapIcon,        count: 42   },
      { id: 'consumption', label: 'Consumption Structure',  path: '/consumption/structure',  icon: ActivitySquare, count: null },
    ]
  },
  {
    title: 'Act II · Infrastructure Monitoring',
    color: '#D8454C',
    items: [
      { id: 'facility',    label: 'Facility Profile',           path: '/sensing/facility/default', icon: BarChart3,     count: 9  },
      { id: 'timeseries',  label: 'Facility Anomaly Analysis',  path: '/warning/timeseries',       icon: AlertTriangle, count: 12 },
    ]
  },
  {
    title: 'Act III · Macro Sentiment',
    color: '#2D6CDF',
    items: [
      { id: 'sentiment',               label: 'Macro Sentiment Monitoring',     path: '/warning/sentiment',          icon: Activity,    count: 99 },
      { id: 'sentiment-investigation', label: 'Specific Sentiment Investigation', path: '/sentiment/topic/ENG-001', icon: BrainCircuit, count: 10 },
    ]
  },
  {
    title: 'Act IV · Enterprise Anomaly Oversight',
    color: '#E89518',
    items: [
      { id: 'effectiveness', label: 'Enterprise Knowledge Base', path: '/closure/effectiveness',          icon: ShieldAlert, count: 1247 },
      { id: 'workflow',      label: 'Workflow Attribution',      path: '/attribution/workflow',           icon: GitBranch,   count: 8    },
      { id: 'graph',         label: 'Commercial Graph',          path: '/attribution/graph',              icon: BarChart3,   count: 15   },
    ]
  },
  {
    title: 'Act V · Audit & Brief',
    color: '#8B5CF6',
    items: [
      { id: 'audit-compliance', label: 'Compliance Audit Workflow', path: '/audit/event/CASE-2026-001', icon: FileCheck, count: 42 },
      { id: 'audit-project',    label: 'Project Lifecycle Audit',   path: '/audit/project',             icon: GitBranch, count: 36 },
      { id: 'report',           label: 'Minister Brief',            path: '/audit/report',              icon: FileText,  count: null },
    ]
  }
];

export const LeftMenu = () => {
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const { t } = useLanguage();

  return (
    <aside className={cn(
      "bg-white border-r border-border-default flex flex-col shrink-0 transition-all duration-300 relative",
      isCollapsed ? "w-[64px]" : "w-[260px]"
    )}>
      <div className={cn(
        "p-5 flex items-center justify-between",
        isCollapsed ? "flex-col gap-4" : ""
      )}>
        {!isCollapsed && <h2 className="all-caps-label text-[10px]">{t('Intelligence Modules')}</h2>}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1.5 hover:bg-bg-hover rounded-md transition-colors text-text-tertiary hover:text-text-primary"
        >
          {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>
      
      <nav className="flex-1 overflow-y-auto px-3 pb-6 custom-scrollbar">
        {MENU_GROUPS.map((group, idx) => (
          <div key={idx} className="mb-6 last:mb-0">
            {!isCollapsed && (
              <div className="flex flex-col mb-2">
                <div className="h-[4px] w-8 rounded mb-1.5" style={{ backgroundColor: group.color }} />
                <h3 className="px-2 text-[11px] font-bold uppercase text-text-primary truncate">
                  {t(group.title)}
                </h3>
              </div>
            )}
            {isCollapsed && <div className="h-px bg-border-default mx-2 mb-4" />}
            
            <div className="space-y-0.5">
              {group.items.map((item) => (
                <NavLink
                  key={item.id}
                  to={item.path}
                  className={({ isActive }) => cn(
                    "flex items-center px-3 py-2 rounded-[4px] transition-colors group relative",
                    isActive 
                      ? "bg-bg-dark text-white" 
                      : "text-text-primary hover:bg-bg-hover",
                    isCollapsed ? "justify-center" : "justify-between"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <item.icon size={16} className={cn(
                      "shrink-0",
                      "group-[.active]:text-white text-text-secondary"
                    )} />
                    {!isCollapsed && (
                      <span className="text-[12px] whitespace-nowrap overflow-hidden text-ellipsis max-w-[150px]">
                        {t(item.label)}
                      </span>
                    )}
                  </div>
                  
                  {!isCollapsed && item.count !== null && (
                    <span className={cn(
                      "text-[10px] tabular-nums font-mono opacity-60",
                    )}>[{item.count.toString().padStart(2, '0')}]</span>
                  )}

                  {isCollapsed && (
                    <div className="absolute left-full ml-2 px-2 py-1 bg-bg-dark text-white text-[10px] rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50 shadow-xl pointer-events-none">
                      {t(item.label)}
                    </div>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  );
};

