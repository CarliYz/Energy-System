import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ReactFlow, { 
  Background, 
  Controls, 
  MiniMap, 
  useNodesState, 
  useEdgesState, 
  MarkerType,
  Handle,
  Position,
  Panel
} from 'reactflow';
import 'reactflow/dist/style.css';
import { 
  Building2, 
  Factory, 
  User, 
  Zap, 
  Briefcase, 
  Gauge, 
  EyeOff, 
  ShieldCheck, 
  FileText, 
  ArrowRightLeft,
  ArrowLeft,
  Search,
  Plus,
  Minus,
  Maximize,
  Download,
  Info,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Play,
  GitBranch
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { motion, AnimatePresence } from 'motion/react';

// Data import
import RawGRAPH_DATA from '../data/graph/case_001_graph';
import { useLanguage } from '../components/LanguageContext';

const NODE_RISK_COLORS: Record<string, { fill: string; border: string; text: string }> = {
  CRITICAL: { fill: '#E14B4B', border: '#B53939', text: '#FFFFFF' },
  WARNING:  { fill: '#E7A53A', border: '#C28828', text: '#1A1E23' },
  NORMAL:   { fill: '#2FBF71', border: '#1E9D5A', text: '#FFFFFF' },
};

const ICON_MAP: Record<string, any> = {
  Building2, Factory, User, Zap, Briefcase, Gauge, EyeOff, ShieldCheck, FileText, ArrowRightLeft
};

// --- Custom Components ---

const CustomNode = ({ data }: any) => {
  const risk = NODE_RISK_COLORS[data.risk_level] || NODE_RISK_COLORS.NORMAL;
  const Icon = ICON_MAP[data.icon] || Building2;
  const isAnchor = data.is_anchor;
  const isSmokingGun = data.is_smoking_gun;

  return (
    <div 
      className={cn(
        "relative px-4 py-2 shadow-lg border rounded-sm transition-all",
        isAnchor ? "w-[140px] h-[64px] border-bg-dark border-2" : "w-[110px] h-[52px]",
        isSmokingGun && "animate-pulse shadow-status-critical/50"
      )}
      style={{ backgroundColor: risk.fill, borderColor: risk.border }}
    >
      <Handle type="target" position={Position.Top} className="opacity-0" />
      <div className="flex flex-col h-full justify-center">
        <div className="flex items-center justify-between mb-1">
          <Icon size={12} color={risk.text} />
          <span className="text-[7px] opacity-70" style={{ color: risk.text }}>L{data.layer}</span>
        </div>
        <div className="text-[8px] font-mono leading-none mb-1 opacity-60 truncate" style={{ color: risk.text }}>{data.id}</div>
        <div className="text-[9px] font-bold leading-tight truncate" style={{ color: risk.text }}>{data.label}</div>
      </div>
      <Handle type="source" position={Position.Bottom} className="opacity-0" />
      
      {isAnchor && (
        <div className="absolute -top-6 left-0 right-0 text-center">
           <span className="bg-bg-dark text-white text-[8px] font-bold px-1.5 py-0.5 rounded-sm uppercase tracking-widest">Target Anchor</span>
        </div>
      )}
    </div>
  );
};

const NODE_TYPES = {
  custom: CustomNode,
};

// --- Main Page Component ---

export default function KnowledgeGraph() {
  const navigate = useNavigate();
  const { caseId } = useParams();
  const { language, t, objT } = useLanguage();
  const rawData = useMemo(() => objT(RawGRAPH_DATA), [RawGRAPH_DATA, language, objT]);

  const [activeTab, setActiveTab] = useState<'AI_REPORT' | 'NODE_DETAIL' | 'RISK_PATHS'>('AI_REPORT');
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const [depth, setDepth] = useState(5);
  const [search, setSearch] = useState('');
  const [revealingPaths, setRevealingPaths] = useState(false);
  const [visibleNodeTypes, setVisibleNodeTypes] = useState<Set<string>>(new Set(rawData.ontology.node_types.map(t => t.id)));
  const [openFindings, setOpenFindings] = useState<Set<number>>(new Set([0]));

  // React Flow States
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  // Initialize Graph with Simple Layout (Circle/Layered)
  useEffect(() => {
    const newNodes = rawData.nodes.map((node, i) => {
      // Layered circular layout logic
      const radius = 180 * node.layer;
      const angle = (i * 137.5) * (Math.PI / 180); // Fibonacci spiral
      const x = radius * Math.cos(angle);
      const y = radius * Math.sin(angle);

      const typeMetadata = rawData.ontology.node_types.find(t => t.id === node.type);

      return {
        id: node.id,
        type: 'custom',
        position: { x, y },
        data: { 
          ...node, 
          icon: typeMetadata?.icon,
        },
        hidden: node.layer > depth || !visibleNodeTypes.has(node.type),
      };
    });

    const newEdges = rawData.edges.map(edge => ({
      id: edge.id,
      source: edge.source,
      target: edge.target,
      label: edge.label,
      labelStyle: { fontSize: 8, fill: '#66707A', fontStyle: 'italic' },
      labelBgPadding: [4, 2],
      labelBgBorderRadius: 2,
      labelBgStyle: { fill: '#fff', fillOpacity: 0.8 },
      style: { 
        stroke: edge.risk_level === 'CRITICAL' ? '#E14B4B' : (edge.risk_level === 'WARNING' ? '#E7A53A' : '#C9D0D8'),
        strokeWidth: edge.is_critical_path ? 2.5 : 1,
        strokeDasharray: edge.is_inferred ? '5,5' : 'none',
      },
      animated: false,
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: edge.risk_level === 'CRITICAL' ? '#E14B4B' : (edge.risk_level === 'WARNING' ? '#E7A53A' : '#C9D0D8'),
      },
      hidden: !visibleNodeTypes.has((rawData.nodes.find(n => n.id === edge.source) as any).type) || 
              !visibleNodeTypes.has((rawData.nodes.find(n => n.id === edge.target) as any).type)
    }));

    setNodes(newNodes);
    setEdges(newEdges);
  }, [depth, visibleNodeTypes]);

  const onNodeClick = useCallback((event: any, node: any) => {
    setSelectedNode(node.data);
    setActiveTab('NODE_DETAIL');
  }, []);

  const toggleNodeType = (typeId: string) => {
    const next = new Set(visibleNodeTypes);
    if (next.has(typeId)) next.delete(typeId);
    else next.add(typeId);
    setVisibleNodeTypes(next);
  };

  const toggleFinding = (idx: number) => {
    const next = new Set(openFindings);
    if (next.has(idx)) next.delete(idx);
    else next.add(idx);
    setOpenFindings(next);
  };

  const revealRiskPaths = () => {
    setRevealingPaths(true);
    setNodes(nds => nds.map(n => ({ ...n, style: { opacity: 0.1 } })));
    setEdges(eds => eds.map(e => ({ ...e, style: { ...e.style, opacity: 0.1 }, animated: false })));

    let pathIdx = 0;
    const playNextPath = () => {
      if (pathIdx >= rawData.critical_paths.length) {
        setRevealingPaths(false);
        // Reset after a delay or just keep them highlighted? Let's keep highlighted for a bit then reset
        setTimeout(() => {
          setNodes(nds => nds.map(n => ({ ...n, style: { opacity: 1 } })));
          setEdges(eds => {
            const pathEdges = new Set(rawData.edges.filter(e => e.is_critical_path).map(e => e.id));
            return eds.map(e => ({ 
              ...e, 
              style: { ...e.style, opacity: 1 }, 
              animated: false
            }));
          });
        }, 5000);
        return;
      }

      const path = rawData.critical_paths[pathIdx];
      const nodeSet = new Set(path.node_sequence);
      const edgeSet = new Set(path.edge_sequence);

      setNodes(nds => nds.map(n => nodeSet.has(n.id) ? { ...n, style: { opacity: 1 } } : n));
      setEdges(eds => eds.map(e => edgeSet.has(e.id) ? { ...e, style: { ...e.style, opacity: 1 }, animated: false } : e));

      pathIdx++;
      setTimeout(playNextPath, 2000);
    };

    playNextPath();
  };

  const visualizeSinglePath = (pathId: string) => {
    const path = rawData.critical_paths.find(p => p.id === pathId);
    if (!path) return;

    const nodeSet = new Set(path.node_sequence);
    const edgeSet = new Set(path.edge_sequence);

    setNodes(nds => nds.map(n => nodeSet.has(n.id) ? { ...n, style: { opacity: 1 } } : { ...n, style: { opacity: 0.1 } }));
    setEdges(eds => eds.map(e => edgeSet.has(e.id) ? { ...e, style: { ...e.style, opacity: 1 }, animated: false } : { ...e, style: { ...e.style, opacity: 0.1 }, animated: false }));
  };

  return (
    <div className="flex-1 flex flex-col bg-[#F5F7FA] overflow-hidden font-sans">
      {/* Context Bar */}
      <div className="h-10 bg-white border-b border-border-default flex items-center justify-between px-6 shrink-0 z-20">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 text-text-tertiary hover:text-text-primary transition-colors pr-4 border-r border-border-default h-full pb-0.5"
          >
            <ArrowLeft size={14} />
            <span className="all-caps-label text-[10px]">{language === 'zh' ? '返回' : 'Back'}</span>
          </button>
          <div className="flex items-center gap-6">
            <span className="all-caps-label text-[10px] text-text-secondary uppercase tracking-widest">{language === 'zh' ? '当前场景: 跨主体知识图谱关联挖掘溯源' : 'Context: Knowledge Graph Relation Mining'}</span>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 px-2 py-0.5 bg-bg-dark text-white rounded-sm pb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider">[{rawData.meta.id}]</span>
              </div>
              <span className="all-caps-label text-[10px] text-text-tertiary">{language === 'zh' ? `深度: ${rawData.meta.max_depth} 层` : `Depth: ${rawData.meta.max_depth} Layers`}</span>
              <span className="all-caps-label text-[10px] text-text-tertiary">{language === 'zh' ? `网点/实体数: ${rawData.meta.node_count}` : `Nodes: ${rawData.meta.node_count}`}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4 text-[10px] text-text-tertiary">
          <span className="font-mono uppercase">{language === 'zh' ? `图谱计算拓扑引擎: ${rawData.meta.ontology_engine}` : `Ontology Engine: ${rawData.meta.ontology_engine}`}</span>
          <span className="opacity-50">|</span>
          <span>{language === 'zh' ? `生成时间: ${new Date(rawData.meta.generated_at).toLocaleString('zh-CN')}` : `GENERATED: ${new Date(rawData.meta.generated_at).toLocaleString()}`}</span>
          <span className="opacity-50">|</span>
          <div className="flex items-center gap-1.5 text-status-success">
            <div className="w-1.5 h-1.5 rounded-full bg-status-success animate-pulse" />
            <span className="font-bold tracking-wider uppercase">{language === 'zh' ? '寻路计算: 完成' : 'Traversal: Complete'}</span>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Column: Ontology Filters */}
        <div className="w-[240px] border-r border-border-default bg-white flex flex-col shrink-0">
          <div className="flex-1 overflow-y-auto p-5 space-y-8 custom-scrollbar">
            {/* Node Types */}
            <div>
              <div className="all-caps-label text-[10px] text-[#98A1AA] mb-4">Node Types</div>
              <div className="space-y-2.5">
                {rawData.ontology.node_types.map(type => {
                  const Icon = ICON_MAP[type.icon];
                  const count = rawData.nodes.filter(n => n.type === type.id).length;
                  const isChecked = visibleNodeTypes.has(type.id);
                  return (
                    <button 
                      key={type.id}
                      onClick={() => toggleNodeType(type.id)}
                      className="w-full flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className={cn(
                          "w-3 h-3 flex items-center justify-center border transition-colors",
                          isChecked ? "bg-bg-dark border-bg-dark" : "bg-white border-border-default group-hover:border-text-tertiary"
                        )}>
                          {isChecked && <div className="w-1.5 h-1.5 bg-white" />}
                        </div>
                        <Icon size={14} className={isChecked ? "text-text-primary" : "text-text-tertiary"} />
                        <span className={cn(
                          "text-[10px] font-bold uppercase tracking-wider transition-colors",
                          isChecked ? "text-text-primary" : "text-[#98A1AA]"
                        )}>
                          {type.label_en}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-text-tertiary opacity-60">[{count}]</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Edge Types */}
            <div>
              <div className="all-caps-label text-[10px] text-[#98A1AA] mb-4">Risk Dimensions</div>
              <div className="space-y-2.5">
                <div className="flex items-center gap-2.5">
                  <div className="w-3 h-3 bg-status-critical" />
                  <span className="text-[10px] font-bold uppercase text-text-primary">Ownership Chain</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="w-3 h-3 bg-status-warning" />
                  <span className="text-[10px] font-bold uppercase text-text-primary">Financial Flow</span>
                </div>
                <div className="flex items-center gap-2.5 opacity-40">
                  <div className="w-3 h-3 bg-border-default" />
                  <span className="text-[10px] font-bold uppercase text-text-tertiary">Operational Link</span>
                </div>
              </div>
            </div>

            {/* Exploration Depth */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="all-caps-label text-[10px] text-[#98A1AA]">Exploration Depth</div>
                <span className="text-[11px] font-bold">{depth}</span>
              </div>
              <input 
                type="range" 
                min="1" 
                max="5" 
                value={depth} 
                onChange={(e) => setDepth(parseInt(e.target.value))}
                className="w-full h-1 bg-bg-secondary rounded-lg appearance-none cursor-pointer accent-bg-dark"
              />
              <div className="flex justify-between mt-1 text-[8px] text-text-tertiary font-mono">
                <span>1</span><span>2</span><span>3</span><span>4</span><span>5</span>
              </div>
            </div>

            {/* Graph Controls */}
            <div className="space-y-2">
              <button 
                onClick={revealRiskPaths}
                disabled={revealingPaths}
                className="w-full h-9 bg-bg-dark text-white text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-50 transition-all shadow-lg"
              >
                <Play size={14} /> {revealingPaths ? 'REVEALING...' : 'AUTO-REVEAL RISK PATHS'}
              </button>
              <div className="grid grid-cols-2 gap-2">
                <button className="h-8 border border-border-default bg-white text-[9px] font-bold uppercase hover:bg-bg-secondary">+ EXPAND ALL</button>
                <button className="h-8 border border-border-default bg-white text-[9px] font-bold uppercase hover:bg-bg-secondary">− COLLAPSE ALL</button>
              </div>
              <button 
                onClick={() => setDepth(5)}
                className="w-full h-8 border border-border-default bg-white text-[9px] font-bold uppercase hover:bg-bg-secondary"
              >
                ⟲ RESET LAYOUT
              </button>
            </div>
            
            <div className="relative mt-4">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-text-tertiary" size={14} />
              <input 
                placeholder="FIND NODE..." 
                className="w-full h-9 bg-bg-secondary border-none rounded-[2px] pl-9 text-[10px] font-bold placeholder:text-text-tertiary focus:ring-1 focus:ring-bg-dark"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Central Component: Graph Canvas */}
        <div className="flex-1 relative bg-[#F8FAFB]">
           <ReactFlow
             nodes={nodes}
             edges={edges}
             onNodesChange={onNodesChange}
             onEdgesChange={onEdgesChange}
             onNodeClick={onNodeClick}
             nodeTypes={NODE_TYPES}
             fitView
           >
             <Background color="#E2E6EB" gap={20} />
             <Controls showInteractive={false} className="bg-white border border-border-default shadow-lg" />
             <MiniMap 
               nodeColor={(n: any) => NODE_RISK_COLORS[n.data.risk_level]?.fill || '#C9D0D8'}
               maskColor="rgba(240, 242, 245, 0.6)"
               className="bg-white border border-border-default shadow-xl"
             />
             
             <Panel position="top-right" className="flex flex-col gap-2 m-4">
                <div className="bg-white border border-border-default shadow-lg p-1 flex flex-col gap-1 rounded-sm">
                   <button className="w-8 h-8 flex items-center justify-center text-text-tertiary hover:bg-bg-secondary transition-colors" title="Zoom In"><Plus size={16} /></button>
                   <button className="w-8 h-8 flex items-center justify-center text-text-tertiary hover:bg-bg-secondary transition-colors" title="Zoom Out"><Minus size={16} /></button>
                   <div className="h-px bg-border-default mx-1" />
                   <button className="w-8 h-8 flex items-center justify-center text-text-tertiary hover:bg-bg-secondary transition-colors" title="Fit to Screen"><Maximize size={16} /></button>
                   <button className="w-8 h-8 flex items-center justify-center text-text-tertiary hover:bg-bg-secondary transition-colors" title="Export PNG"><Download size={16} /></button>
                </div>
             </Panel>

             <Panel position="bottom-left" className="m-4">
                <div className="text-[9px] font-mono text-text-tertiary uppercase tracking-widest opacity-60">
                   React Flow · D3-Force Layout · Ontology Engine V2.1
                </div>
             </Panel>
           </ReactFlow>

           {/* AI Verdict Summary Overlay */}
           <AnimatePresence>
             {!revealingPaths && (
               <motion.div 
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50 pointer-events-none"
               >
                  <div className="bg-bg-dark/90 backdrop-blur shadow-2xl rounded-sm border border-white/10 px-6 py-4 flex flex-col gap-1 items-center min-w-[320px]">
                     <div className="text-status-critical text-[10px] font-bold uppercase tracking-[0.2em] mb-1">Investigation Verdict</div>
                     <div className="text-white text-[15px] font-bold uppercase tracking-tight">Coordinated Evasion Network Probable</div>
                     <div className="flex items-center gap-4 mt-2">
                        <div className="flex items-center gap-1.5">
                           <span className="text-[10px] text-white/40 uppercase">Confidence</span>
                           <span className="text-[14px] font-bold text-white">82%</span>
                        </div>
                        <div className="w-px h-6 bg-white/20" />
                        <div className="flex items-center gap-1.5">
                           <span className="text-[10px] text-white/40 uppercase">Fiscal Risk</span>
                           <span className="text-[14px] font-bold text-status-critical">1.24 BN KZT</span>
                        </div>
                     </div>
                  </div>
               </motion.div>
             )}
           </AnimatePresence>
        </div>

        {/* Right Column: AI Report / Node Detail / Risk Paths */}
        <div className="w-[360px] bg-white border-l border-border-default flex flex-col overflow-hidden shrink-0 z-10">
          {/* Tabs */}
          <div className="flex border-b border-border-default shrink-0">
            {['AI_REPORT', 'NODE_DETAIL', 'RISK_PATHS'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={cn(
                  "flex-1 h-12 text-[10px] font-bold uppercase tracking-wider transition-colors",
                  activeTab === tab ? "bg-bg-dark text-white" : "text-text-tertiary hover:bg-bg-hover"
                )}
              >
                {tab.replace(/_/g, ' ')}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {activeTab === 'AI_REPORT' && (
              <div className="p-6">
                 <div className="flex items-center justify-between mb-6">
                    <h3 className="section-title text-[13px] font-bold uppercase tracking-wide mb-0">AI Investigation Report</h3>
                    <div className="px-2 py-0.5 bg-status-critical/10 text-status-critical text-[10px] font-bold uppercase">Critical Flag</div>
                 </div>

                 <div className="mb-8">
                    <div className="all-caps-label text-[9px] text-[#98A1AA] mb-2">Headline Summary</div>
                    <p className="text-[14px] font-bold text-text-primary leading-tight uppercase">
                       {rawData.ai_report.summary_headline}
                    </p>
                    <div className="mt-4 flex items-center gap-4">
                       <div className="flex-1">
                          <div className="all-caps-label text-[8px] text-text-tertiary mb-1">Confidence Score</div>
                          <div className="h-1.5 bg-bg-secondary w-full rounded-full overflow-hidden">
                             <div className="h-full bg-bg-dark" style={{ width: '82%' }} />
                          </div>
                       </div>
                       <span className="text-[14px] font-bold tabular-nums">82%</span>
                    </div>
                 </div>

                 <div className="space-y-4">
                    <div className="all-caps-label text-[9px] text-[#98A1AA]">Narrative Analysis</div>
                    {rawData.ai_report.narrative_sections.map((section, idx) => {
                       const isOpen = openFindings.has(idx);
                       return (
                         <div key={idx} className="border border-border-default">
                            <button 
                              onClick={() => toggleFinding(idx)}
                              className="w-full p-3 flex items-center justify-between hover:bg-bg-secondary/30 transition-colors"
                            >
                               <span className="text-[11px] font-bold text-text-primary uppercase tracking-tight">{section.heading}</span>
                               {isOpen ? <ChevronUp size={14} className="text-text-tertiary" /> : <ChevronDown size={14} className="text-text-tertiary" />}
                            </button>
                            <AnimatePresence>
                               {isOpen && (
                                 <motion.div 
                                   initial={{ height: 0, opacity: 0 }}
                                   animate={{ height: 'auto', opacity: 1 }}
                                   exit={{ height: 0, opacity: 0 }}
                                   className="overflow-hidden"
                                 >
                                    <div className="p-3 pt-0 text-[11px] text-text-secondary leading-relaxed border-t border-border-default/50">
                                       {section.body}
                                    </div>
                                 </motion.div>
                               )}
                            </AnimatePresence>
                         </div>
                       );
                    })}
                 </div>

                 <div className="mt-8 p-4 border-l-4 border-status-critical bg-status-critical/[0.03]">
                    <div className="all-caps-label text-[10px] text-status-critical font-bold mb-2">NETWORK VERDICT</div>
                    <div className="text-[13px] font-bold text-text-primary uppercase mb-3">
                       Coordinated Evasion Probable
                    </div>
                    <div className="space-y-2">
                       <div className="flex justify-between items-center text-[11px]">
                          <span className="text-text-tertiary">Estimated Unreported Vol:</span>
                          <span className="font-bold">75.4 MMcm</span>
                       </div>
                       <div className="flex justify-between items-center text-[11px]">
                          <span className="text-text-tertiary">Estimated Fiscal Impact:</span>
                          <span className="font-bold text-status-critical">1.24 BN KZT</span>
                       </div>
                    </div>
                 </div>
              </div>
            )}

            {activeTab === 'NODE_DETAIL' && (
              <div className="p-6">
                {!selectedNode ? (
                  <div className="h-full flex flex-col items-center justify-center pt-20 text-text-tertiary text-center">
                     <Info size={40} className="mb-4 opacity-20" />
                     <p className="text-[12px] font-medium uppercase tracking-widest px-10">Select a node to view metadata and properties</p>
                  </div>
                ) : (
                  <div className="flex flex-col">
                     <div className="flex items-center gap-3 mb-6">
                        <div 
                          className="w-12 h-12 rounded-sm flex items-center justify-center shadow-lg"
                          style={{ backgroundColor: NODE_RISK_COLORS[selectedNode.risk_level]?.fill }}
                        >
                           {React.createElement(ICON_MAP[selectedNode.icon] || Building2, { size: 24, color: '#fff' })}
                        </div>
                        <div>
                           <div className="text-[15px] font-bold text-text-primary leading-tight uppercase tracking-tight">{selectedNode.label}</div>
                           <div className="text-[11px] font-mono text-text-tertiary">{selectedNode.id}</div>
                        </div>
                     </div>

                     <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                           <div className="p-3 bg-bg-secondary/30 border border-border-default">
                              <div className="all-caps-label text-[8px] text-text-tertiary mb-1">Entity Type</div>
                              <div className="text-[10px] font-bold uppercase">{selectedNode.type}</div>
                           </div>
                           <div className="p-3 bg-bg-secondary/30 border border-border-default">
                              <div className="all-caps-label text-[8px] text-text-tertiary mb-1">Risk Level</div>
                              <div className={cn(
                                "text-[10px] font-bold uppercase",
                                selectedNode.risk_level === 'CRITICAL' ? "text-status-critical" : (selectedNode.risk_level === 'WARNING' ? "text-status-warning" : "text-status-success")
                              )}>
                                {selectedNode.risk_level}
                              </div>
                           </div>
                        </div>

                        <div>
                           <div className="all-caps-label text-[9px] text-[#98A1AA] mb-4 border-b border-border-default pb-2">Properties</div>
                           <div className="space-y-4">
                              {Object.entries(selectedNode.properties || {}).map(([key, value]) => (
                                <div key={key} className="flex justify-between items-start gap-4">
                                   <span className="text-[10px] font-bold text-text-tertiary uppercase shrink-0 pt-0.5">{key.replace(/_/g, ' ')}</span>
                                   <span className="text-[11px] text-text-primary font-medium text-right leading-tight">
                                      {Array.isArray(value) ? value.join(', ') : (typeof value === 'object' ? JSON.stringify(value) : String(value))}
                                   </span>
                                </div>
                              ))}
                           </div>
                        </div>

                        {selectedNode.ai_flag && (
                          <div className="p-4 bg-bg-dark text-white rounded-sm mt-4">
                             <div className="flex items-center gap-2 mb-2">
                                <AlertTriangle size={14} className="text-status-warning" />
                                <span className="text-[9px] font-bold uppercase tracking-[0.2em]">AI Intelligence Flag</span>
                             </div>
                             <p className="text-[12px] font-medium leading-relaxed">
                                {selectedNode.ai_flag.replace(/_/g, ' ')}
                             </p>
                          </div>
                        )}
                        
                        <div className="pt-6 border-t border-border-default">
                           <button className="w-full h-10 border border-border-default text-[11px] font-bold uppercase tracking-widest hover:bg-bg-secondary transition-colors">
                              Explore Sub-Graph
                           </button>
                        </div>
                     </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'RISK_PATHS' && (
              <div className="p-6">
                 <h3 className="section-title text-[13px] font-bold uppercase tracking-wide mb-6">Discovered Risk Paths</h3>
                 <div className="space-y-4">
                    {rawData.critical_paths.map((path, idx) => (
                      <div key={path.id} className="p-4 border border-border-default hover:border-text-tertiary transition-all">
                         <div className="flex items-center justify-between mb-2">
                            <span className={cn(
                              "text-[8px] font-bold px-1.5 py-0.5 rounded-sm tracking-widest uppercase",
                              path.severity === 'CRITICAL' ? "bg-status-critical/10 text-status-critical" : "bg-status-warning/10 text-status-warning"
                            )}>
                               {path.severity}
                            </span>
                            <span className="text-[10px] font-mono font-bold text-text-tertiary">SCORE {path.risk_score.toFixed(2)}</span>
                         </div>
                         <div className="text-[13px] font-bold text-text-primary uppercase mb-2 leading-tight">{path.title}</div>
                         <p className="text-[10px] text-text-tertiary leading-relaxed mb-4 line-clamp-2">{path.summary}</p>
                         
                         <div className="flex items-center justify-between mt-auto">
                            <span className="text-[9px] font-bold uppercase text-[#98A1AA]">{path.node_sequence.length} Nodes / {path.edge_sequence.length} Edges</span>
                            <button 
                              onClick={() => visualizeSinglePath(path.id)}
                              className="text-[10px] font-bold text-status-info hover:underline uppercase tracking-wider"
                            >
                               Visualize →
                            </button>
                         </div>
                      </div>
                    ))}
                 </div>
              </div>
            )}
          </div>
          
          <div className="p-6 border-t border-border-default flex flex-col gap-2 shrink-0">
             <button 
                onClick={() => navigate(`/audit/event/${rawData.meta.case_id}`)}
                className="w-full h-12 bg-bg-dark text-white text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-bg-dark-2 transition-all flex items-center justify-center gap-2.5 shadow-xl relative overflow-hidden group"
             >
                <GitBranch size={16} className="group-hover:translate-x-1 transition-transform" />
                <span>Initiate Joint Investigation ▶</span>
             </button>
          </div>
        </div>
      </div>
    </div>
  );
}
