import { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { Network, Download, Lock, Fingerprint } from 'lucide-react';
import { useIncidentCase } from '@/contexts/IncidentCaseContext';
import { FEATURED_INCIDENT, GRAPH_INCIDENTS, type IncidentCase } from '@/data/incidentCases';

interface GraphNode {
  id: string;
  label: string;
  sublabel: string;
  x: number;
  y: number;
  type: 'command' | 'mule' | 'target' | 'voip' | 'crypto' | 'hawala';
  campaigns: string[];
  institution?: string;
  amount?: string;
  lastSeen?: string;
}

interface GraphEdge {
  from: string;
  to: string;
  label: string;
  campaigns: string[];
}

const NODES: GraphNode[] = [
  { id: 'cmd1', label: 'CMD NODE', sublabel: 'Mewat Sector B', x: 420, y: 220, type: 'command',
    campaigns: ['mewat', 'all'], institution: 'Mewat Extortion Hub — Haryana', lastSeen: '18:51:33 IST' },
  { id: 'ip1', label: 'CMD IP', sublabel: '103.22.XX.XX (Kolkata)', x: 280, y: 120, type: 'command',
    campaigns: ['mewat', 'all'], institution: 'VPS Server — Kolkata DC', lastSeen: '18:50:01 IST' },
  { id: 'voip1', label: 'VOIP GW', sublabel: '+1-829-XX (Bahrain)', x: 200, y: 300, type: 'voip',
    campaigns: ['mewat', 'all'], institution: 'Bahrain International VoIP Node', lastSeen: '18:52:10 IST' },
  { id: 'voip2', label: 'VOIP GW', sublabel: '+44-789-XX (UK VPN)', x: 600, y: 140, type: 'voip',
    campaigns: ['mewat', 'cross-border', 'all'], institution: 'UK VPN Endpoint — London', lastSeen: '18:48:44 IST' },
  { id: 'mule1', label: 'MULE ACC', sublabel: 'HDFC #9021', x: 580, y: 340, type: 'mule',
    campaigns: ['mewat', 'all'], amount: '₹4,50,000', institution: 'HDFC Bank — Rohini, Delhi', lastSeen: '18:46:22 IST' },
  { id: 'mule2', label: 'MULE ACC', sublabel: 'Paytm #3312', x: 720, y: 240, type: 'mule',
    campaigns: ['mewat', 'all'], amount: '₹1,20,000', institution: 'Paytm Payments — Noida', lastSeen: '18:44:10 IST' },
  { id: 'mule3', label: 'MULE ACC', sublabel: 'SBI #7741', x: 640, y: 420, type: 'mule',
    campaigns: ['jamtara', 'all'], amount: '₹2,80,000', institution: 'SBI — Jamtara Branch', lastSeen: '18:39:55 IST' },
  { id: 'target1', label: 'TARGET', sublabel: 'S. Iyer, Bengaluru', x: 180, y: 420, type: 'target',
    campaigns: ['mewat', 'all'], institution: 'Victim — Retired Govt Employee', amount: '₹2,50,000', lastSeen: '18:52:41 IST' },
  { id: 'target2', label: 'TARGET', sublabel: 'R. Patel, Ahmedabad', x: 80, y: 200, type: 'target',
    campaigns: ['mewat', 'all'], institution: 'Victim — Senior Citizen', amount: '₹3,20,000', lastSeen: '18:49:12 IST' },
  { id: 'crypto1', label: 'CRYPTO WALLET', sublabel: 'bc1qXX...4a2f', x: 760, y: 380, type: 'crypto',
    campaigns: ['cross-border', 'all'], institution: 'Binance P2P — Offshore', amount: '₹12,40,000', lastSeen: '18:41:30 IST' },
  { id: 'hawala1', label: 'HAWALA AGENT', sublabel: 'M. Khan, Dubai', x: 820, y: 200, type: 'hawala',
    campaigns: ['cross-border', 'all'], institution: 'Dubai Financial District', amount: '₹24,80,000', lastSeen: '18:38:00 IST' },
];

const EDGES: GraphEdge[] = [
  { from: 'ip1', to: 'cmd1', label: 'C2 CHANNEL', campaigns: ['mewat', 'all'] },
  { from: 'cmd1', to: 'voip1', label: 'DIRECTIVE', campaigns: ['mewat', 'all'] },
  { from: 'cmd1', to: 'voip2', label: 'DIRECTIVE', campaigns: ['mewat', 'cross-border', 'all'] },
  { from: 'voip1', to: 'target1', label: 'SCAM CALL', campaigns: ['mewat', 'all'] },
  { from: 'voip2', to: 'target2', label: 'SCAM CALL', campaigns: ['mewat', 'all'] },
  { from: 'target1', to: 'mule1', label: 'ROUTED: ₹2,50,000', campaigns: ['mewat', 'all'] },
  { from: 'target2', to: 'mule2', label: 'ROUTED: ₹1,20,000', campaigns: ['mewat', 'all'] },
  { from: 'target1', to: 'mule3', label: 'ROUTED: ₹2,80,000', campaigns: ['jamtara', 'all'] },
  { from: 'mule1', to: 'crypto1', label: 'LAYERING', campaigns: ['cross-border', 'all'] },
  { from: 'mule2', to: 'crypto1', label: 'LAYERING', campaigns: ['cross-border', 'all'] },
  { from: 'crypto1', to: 'hawala1', label: 'EXTRACTION', campaigns: ['cross-border', 'all'] },
  { from: 'voip2', to: 'hawala1', label: 'COORDINATION', campaigns: ['cross-border', 'all'] },
];

const NODE_COLORS: Record<string, string> = {
  command: 'var(--st-danger)',
  mule: 'var(--st-warning)',
  target: 'var(--st-text-muted)',
  voip: 'var(--st-warning)',
  crypto: 'var(--st-accent)',
  hawala: 'var(--st-danger)',
};

const FILTERS = [
  { id: 'all', label: 'ALL NODES' },
  { id: 'mewat', label: 'MEWAT EXTORTION CAMPAIGN 04' },
  { id: 'cross-border', label: 'CROSS-BORDER CRYPTO FOOTPRINTS' },
  { id: 'jamtara', label: 'JAMTARA TELECOM FRAUD RING' },
] as const;

export default function SyndicateGraph() {
  const { incident, openIncident } = useIncidentCase();
  const [activeFilter, setActiveFilter] = useState<IncidentCase['syndicateFilter']>(() => incident.syndicateFilter);
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [exportProgress, setExportProgress] = useState<number | null>(null);
  const [exportDone, setExportDone] = useState(false);
  const exportIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const isNodeActive = (node: GraphNode) => node.campaigns.includes(activeFilter);
  const isEdgeActive = (edge: GraphEdge) => edge.campaigns.includes(activeFilter);

  const resolveGraphIncident = (node?: GraphNode | null): IncidentCase => {
    if (!node && activeFilter === incident.syndicateFilter) return incident;
    if (activeFilter === 'jamtara' || (node?.campaigns.includes('jamtara') && !node.campaigns.includes('mewat'))) return GRAPH_INCIDENTS.jamtara;
    if (activeFilter === 'cross-border' || node?.type === 'crypto' || node?.type === 'hawala') return GRAPH_INCIDENTS['cross-border'];
    return FEATURED_INCIDENT;
  };

  const currentGraphIncident = resolveGraphIncident(selectedNode);

  const resetExport = () => {
    if (exportIntervalRef.current) {
      clearInterval(exportIntervalRef.current);
      exportIntervalRef.current = null;
    }
    setExportProgress(null);
    setExportDone(false);
  };

  const selectFilter = (filter: IncidentCase['syndicateFilter']) => {
    resetExport();
    setActiveFilter(filter);
    setSelectedNode(null);
  };

  const selectNode = (node: GraphNode | null) => {
    if (selectedNode?.id !== node?.id) resetExport();
    setSelectedNode(node);
  };

  const handleExport = () => {
    resetExport();
    setExportProgress(0);
    exportIntervalRef.current = setInterval(() => {
      setExportProgress(prev => {
        if (prev === null) return 0;
        if (prev >= 100) {
          if (exportIntervalRef.current) {
            clearInterval(exportIntervalRef.current);
            exportIntervalRef.current = null;
          }
          setExportDone(true);
          return 100;
        }
        return prev + Math.floor(Math.random() * 12) + 5;
      });
    }, 150);
  };

  useEffect(() => {
    return () => {
      if (exportIntervalRef.current) clearInterval(exportIntervalRef.current);
    };
  }, []);

  // Compute midpoints for edge labels
  const getEdgeMid = (from: GraphNode, to: GraphNode) => ({
    x: (from.x + to.x) / 2,
    y: (from.y + to.y) / 2,
  });

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b flex-shrink-0"
        style={{ borderColor: 'var(--st-border)', background: 'var(--st-header)' }}>
        <div className="flex items-center gap-3">
          <Network size={14} style={{ color: 'var(--st-accent)' }} />
          <span className="font-mono text-xs tracking-widest" style={{ color: 'var(--st-text-label)' }}>
            SYNDICATE NETWORK GRAPH · COURT-ADMISSIBLE TOPOLOGY ANALYSIS
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            data-testid="open-incident-360"
            onClick={() => openIncident('syndicate-graph', currentGraphIncident)}
            className="flex items-center gap-2 rounded px-3 py-1.5 font-mono text-[9px] tracking-widest transition-all hover:brightness-125"
            style={{ background: 'var(--st-accent-bg)', border: '1px solid var(--st-accent-border-mid)', color: 'var(--st-accent)' }}
          >
            <Fingerprint size={11} /> INCIDENT 360
          </button>
          <div className="font-mono text-[9px]" style={{ color: 'var(--st-text-faint)' }}>
            {NODES.length} NODES · {EDGES.length} EDGES MAPPED
          </div>
        </div>
      </div>

      {/* Filter bar */}
      <div className="flex items-center gap-2 px-3 py-2 border-b flex-shrink-0"
        style={{ borderColor: 'var(--st-border-subtle)', background: 'var(--st-ticker)' }}>
        {FILTERS.map(f => (
          <button
            key={f.id}
            onClick={() => selectFilter(f.id)}
            aria-pressed={activeFilter === f.id}
            className="px-3 py-1 rounded font-mono text-[9px] tracking-widest transition-all"
            style={{
              background: activeFilter === f.id ? 'var(--st-accent-bg-soft)' : 'transparent',
              color: activeFilter === f.id ? 'var(--st-accent)' : 'var(--st-text-dim)',
              border: `1px solid ${activeFilter === f.id ? 'var(--st-map-compass-line)' : 'var(--st-border-subtle)'}`,
            }}>
            {f.label}
          </button>
        ))}
      </div>

      {/* Main split */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* Graph canvas */}
        <div className="flex-1 overflow-hidden relative" style={{ background: 'var(--st-map-ocean)' }}>
          {/* Grid */}
          <svg className="absolute inset-0 w-full h-full" style={{ opacity: 0.08 }}>
            <defs>
              <pattern id="grid" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="var(--st-accent)" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>

          <svg className="w-full h-full" viewBox="0 0 900 520" preserveAspectRatio="xMidYMid meet">
            <defs>
              <marker id="arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                <path d="M0,0 L0,6 L6,3 z" fill="rgba(56,189,248,0.4)" />
              </marker>
              <marker id="arrow-red" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                <path d="M0,0 L0,6 L6,3 z" fill="rgba(239,68,68,0.4)" />
              </marker>
              <marker id="arrow-amber" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                <path d="M0,0 L0,6 L6,3 z" fill="rgba(245,158,11,0.4)" />
              </marker>
            </defs>

            {/* Edges */}
            {EDGES.map((edge, i) => {
              const from = NODES.find(n => n.id === edge.from)!;
              const to = NODES.find(n => n.id === edge.to)!;
              if (!from || !to) return null;
              const active = isEdgeActive(edge);
              const mid = getEdgeMid(from, to);
              const isRed = edge.label.includes('EXTRACT') || edge.label.includes('C2');
              const isAmber = edge.label.includes('ROUTED') || edge.label.includes('LAYER');
              const color = isRed ? 'rgba(239,68,68,0.35)' : isAmber ? 'rgba(245,158,11,0.3)' : 'var(--st-accent-border-mid)';
              const marker = isRed ? 'url(#arrow-red)' : isAmber ? 'url(#arrow-amber)' : 'url(#arrow)';
              return (
                <g key={i} opacity={active ? 1 : 0.06} style={{ transition: 'opacity 0.4s ease' }}>
                  <line
                    x1={from.x} y1={from.y} x2={to.x} y2={to.y}
                    stroke={color} strokeWidth="1.2"
                    strokeDasharray={edge.label.includes('C2') ? '6,3' : 'none'}
                    markerEnd={marker}
                  />
                  <text x={mid.x} y={mid.y - 4} textAnchor="middle"
                    fontSize="7" fill={active ? (isRed ? 'rgba(239,68,68,0.7)' : isAmber ? 'rgba(245,158,11,0.6)' : 'rgba(56,189,248,0.5)') : 'transparent'}
                    fontFamily="IBM Plex Mono" letterSpacing="0.5">
                    {edge.label}
                  </text>
                </g>
              );
            })}

            {/* Nodes */}
            {NODES.map(node => {
              const active = isNodeActive(node);
              const color = NODE_COLORS[node.type];
              const isSelected = selectedNode?.id === node.id;
              const r = node.type === 'command' ? 20 : node.type === 'target' ? 16 : 17;
              return (
                <g key={node.id}
                  opacity={active ? 1 : 0.08}
                  style={{ cursor: 'pointer', transition: 'opacity 0.4s ease' }}
                  onClick={() => active && selectNode(node)}
                  onKeyDown={event => {
                    if (active && (event.key === 'Enter' || event.key === ' ')) {
                      event.preventDefault();
                      selectNode(node);
                    }
                  }}
                  role="button"
                  tabIndex={active ? 0 : -1}
                  aria-label={`Open details for ${node.label} ${node.sublabel}`}>
                  {/* Glow ring if selected */}
                  {isSelected && active && (
                    <circle cx={node.x} cy={node.y} r={r + 8}
                      fill="none" stroke={color} strokeWidth="1" opacity="0.3"
                      strokeDasharray="4,4"
                      style={{ animation: 'pulse-ring 1.5s ease-out infinite', transformOrigin: `${node.x}px ${node.y}px` }} />
                  )}
                  {/* Pulse ring */}
                  {active && (node.type === 'command' || node.type === 'hawala') && (
                    <circle cx={node.x} cy={node.y} r={r * 1.8}
                      fill="none" stroke={color} strokeWidth="0.8" opacity="0"
                      style={{ animation: 'pulse-ring 2.5s ease-out infinite', transformOrigin: `${node.x}px ${node.y}px` }} />
                  )}
                  {/* Node fill */}
                  <circle cx={node.x} cy={node.y} r={r}
                    fill={`${color}18`}
                    stroke={color} strokeWidth={isSelected ? 2 : 1.2} />
                  {/* Inner dot */}
                  <circle cx={node.x} cy={node.y} r={4} fill={color} opacity="0.7" />
                  {/* Label */}
                  <text x={node.x} y={node.y - r - 6} textAnchor="middle"
                    fontSize="7.5" fill={active ? color : 'var(--st-text-ghost)'} fontFamily="IBM Plex Mono" fontWeight="500">
                    {node.label}
                  </text>
                  <text x={node.x} y={node.y + r + 10} textAnchor="middle"
                    fontSize="6.5" fill={active ? 'rgba(148,163,184,0.7)' : 'var(--st-text-ghost)'} fontFamily="IBM Plex Mono">
                    {node.sublabel}
                  </text>
                  {node.amount && active && (
                    <text x={node.x} y={node.y + r + 19} textAnchor="middle"
                      fontSize="6" fill={node.type === 'mule' ? 'rgba(245,158,11,0.6)' : 'rgba(56,189,248,0.5)'} fontFamily="IBM Plex Mono">
                      {node.amount}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>

          {/* Node detail panel */}
          {selectedNode && (
            <div className="absolute top-3 right-3 w-[220px] rounded p-3 space-y-2 fade-in"
              style={{ background: 'rgba(8,13,26,0.95)', border: `1px solid ${NODE_COLORS[selectedNode.type]}40` }}>
              <div className="flex items-center justify-between">
                <span className="font-mono text-[9px] font-semibold" style={{ color: NODE_COLORS[selectedNode.type] }}>
                  {selectedNode.label}: {selectedNode.sublabel}
                </span>
                <button onClick={() => selectNode(null)}
                  className="text-[10px] font-mono" style={{ color: 'var(--st-text-faint)' }}>✕</button>
              </div>
              <div className="space-y-1 font-mono text-[8px]">
                <div><span style={{ color: 'var(--st-text-faint)' }}>TYPE: </span><span style={{ color: 'var(--st-text-muted)' }}>{selectedNode.type.toUpperCase()}</span></div>
                <div><span style={{ color: 'var(--st-text-faint)' }}>INSTITUTION: </span><span style={{ color: 'var(--st-text-muted)' }}>{selectedNode.institution}</span></div>
                {selectedNode.amount && <div><span style={{ color: 'var(--st-text-faint)' }}>AMOUNT: </span><span style={{ color: 'var(--st-warning)' }}>{selectedNode.amount}</span></div>}
                <div><span style={{ color: 'var(--st-text-faint)' }}>LAST SEEN: </span><span style={{ color: 'var(--st-text-muted)' }}>{selectedNode.lastSeen}</span></div>
              </div>
              <div className="flex gap-1.5 pt-1">
                <button
                  onClick={() => { toast.success(`${selectedNode.label} (${selectedNode.sublabel}) flagged for Court Docket ${currentGraphIncident.id}. FIU-IND notified.`); selectNode(null); }}
                  className="flex-1 py-1 rounded font-mono text-[8px] tracking-widest"
                  style={{ background: 'var(--st-accent-bg-soft)', color: 'var(--st-accent)', border: '1px solid var(--st-accent-border-mid)' }}>
                  FLAG FOR DOCKET
                </button>
                <button
                  onClick={() => { toast.error(`Asset freeze order issued for ${selectedNode.sublabel}. ED Section 5 PMLA action initiated.`); selectNode(null); }}
                  className="flex-1 py-1 rounded font-mono text-[8px] tracking-widest"
                  style={{ background: 'rgba(239,68,68,0.1)', color: 'var(--st-danger)', border: '1px solid rgba(239,68,68,0.25)' }}>
                  FREEZE ASSET
                </button>
              </div>
              <button
                type="button"
                onClick={() => openIncident('syndicate-graph', currentGraphIncident)}
                className="flex w-full items-center justify-center gap-1.5 rounded py-1.5 font-mono text-[8px] tracking-widest"
                style={{ background: 'var(--st-accent-bg)', color: 'var(--st-accent)', border: '1px solid var(--st-accent-border-mid)' }}
              >
                <Fingerprint size={9} /> OPEN UNIFIED CASE
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Court-Admissible Evidence Vault */}
      <div className="border-t flex-shrink-0 p-3" style={{ borderColor: 'var(--st-border)', background: 'var(--st-header)' }}>
        <div className="flex items-center gap-2 mb-2">
          <Lock size={11} style={{ color: 'var(--st-accent)' }} />
          <span className="font-mono text-[9px] tracking-widest" style={{ color: 'var(--st-text-dim)' }}>
            COURT-ADMISSIBLE CHAIN-OF-CUSTODY REPOSITORY
          </span>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div className="col-span-2 space-y-1.5">
            {[
              { label: 'INCIDENT DOCKET ID', value: currentGraphIncident.id, color: 'var(--st-accent)' },
              { label: 'CRYPTOGRAPHIC CHAIN HASH', value: currentGraphIncident.evidenceHash.replace(' · ', ': '), color: 'var(--st-text-label)' },
              { label: 'EVIDENCE INTEGRITY', value: 'VERIFIED · 07-JUL-2026 18:42:10 IST', color: 'var(--st-success)' },
              { label: 'CUSTODIAN', value: 'FIU-IND NODE 7 · SR. ANALYST M.K. VERMA', color: 'var(--st-text-label)' },
            ].map(({ label, value, color }) => (
              <div key={label} className="flex items-center gap-2 font-mono text-[9px]">
                <span style={{ color: 'var(--st-text-faint)', minWidth: '180px' }}>{label}:</span>
                <span style={{ color }}>{value}</span>
              </div>
            ))}
          </div>
          <div className="flex flex-col items-center justify-center gap-2">
            {exportProgress !== null && exportProgress < 100 ? (
              <div className="text-center space-y-1.5 w-full">
                <div className="font-mono text-[8px]" style={{ color: 'var(--st-warning)' }}>PACKAGING EVIDENCE...</div>
                <div className="h-1.5 rounded-full overflow-hidden w-full" style={{ background: 'var(--st-border)' }}>
                  <div className="h-full rounded-full transition-all" style={{ width: `${exportProgress}%`, background: 'var(--st-accent)' }} />
                </div>
                <div className="font-mono text-[8px]" style={{ color: 'var(--st-accent)' }}>{Math.min(exportProgress, 100)}%</div>
              </div>
            ) : exportDone ? (
              <div className="text-center font-mono text-[8px] space-y-0.5">
                <div style={{ color: 'var(--st-success)' }}>DOWNLOAD COMPLETE</div>
                <div style={{ color: 'var(--st-text-muted)' }}>{currentGraphIncident.id}.zip</div>
                <div style={{ color: 'var(--st-text-faint)' }}>847 KB · AES-256 ENCRYPTED</div>
              </div>
            ) : (
              <button
                onClick={handleExport}
                className="w-full py-2 rounded font-mono text-[9px] tracking-wider flex items-center justify-center gap-1.5 transition-all"
                style={{ background: 'var(--st-accent-bg-soft)', color: 'var(--st-accent)', border: '1px solid var(--st-accent-border-mid)' }}>
                <Download size={10} />
                EXPORT EVIDENCE ZIP
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
