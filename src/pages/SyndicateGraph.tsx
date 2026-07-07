import { useState, useEffect } from "react";
import NetworkGraph, { GraphNode, GraphEdge } from "../components/NetworkGraph";
import { toast } from "sonner";
import { Loader2, ShieldCheck, Download, AlertTriangle, Cpu } from "lucide-react";

export default function SyndicateGraph() {
  const [filter, setFilter] = useState("ALL NODES");
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);
  const [progress, setProgress] = useState(0);
  
  // Real-time graph data state
  const [graphData, setGraphData] = useState<{
    nodes: GraphNode[];
    edges: GraphEdge[];
    telemetry: {
      status: string;
      nodesCount: number;
      edgesCount: number;
    };
  } | null>(null);

  // Poll GET /api/syndicate every 5 seconds
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/syndicate");
        if (res.ok) {
          const data = await res.json();
          setGraphData(data);
        }
      } catch (err) {
        console.error("Failed to fetch syndicate network graph data:", err);
      }
    };

    fetchData(); // initial fetch
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  // Responsive progress wheel for exactly 1.2 seconds (120ms * 10 = 1200ms)
  const handleExport = () => {
    setExporting(true);
    setProgress(0);
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setExporting(false);
          toast.success("DOWNLOAD COMPLETE — EVIDENCE PACKAGE: SENTINEL-2026-IN492.zip (847 KB)", {
            style: { background: '#10B981', color: 'white', border: 'none', fontFamily: 'monospace' }
          });
          return 100;
        }
        return prev + 10;
      });
    }, 120);
  };

  // Find selected node details from active graphData
  const selectedNodeData = graphData && selectedNodeId
    ? graphData.nodes.find(n => n.id === selectedNodeId)
    : null;

  // Find associated edges and entities
  const associatedConnections = graphData && selectedNodeId
    ? graphData.edges.filter(e => e.from === selectedNodeId || e.to === selectedNodeId)
    : [];

  const getAssociatedNodeLabel = (nodeId: string) => {
    if (!graphData) return "";
    const node = graphData.nodes.find(n => n.id === nodeId);
    return node ? node.label : nodeId;
  };

  if (!graphData) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-[#030712] text-slate-400 font-mono gap-4">
        <Loader2 className="animate-spin w-10 h-10 text-[#38BDF8]" />
        <span className="text-[11px] tracking-[0.2em] font-bold text-[#38BDF8] animate-pulse">
          INITIALIZING SENTINEL SYNDICATE COGNITIVE MATRICES...
        </span>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col p-4 gap-4 bg-[#030712]">
      {/* Header bar with Louvain Filtering Filters and Live Telemetry */}
      <div className="bg-[#0D1321]/80 border border-slate-800 rounded p-2 flex items-center justify-between overflow-x-auto gap-4">
        <div className="flex gap-2">
          {["ALL NODES", "MEWAT EXTORTION CAMPAIGN 04", "CROSS-BORDER CRYPTO FOOTPRINTS", "JAMTARA TELECOM FRAUD RING"].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`whitespace-nowrap px-4 py-2 font-mono text-[10px] font-bold tracking-widest border transition-colors ${
                filter === f 
                  ? "bg-[#38BDF8]/10 text-[#38BDF8] border-[#38BDF8]/50" 
                  : "bg-transparent text-slate-400 border-slate-800 hover:text-white"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        
        {/* Dynamic Telemetry Status Counters */}
        <div className="flex items-center gap-2 font-mono text-[10px] font-bold text-[#38BDF8] bg-[#38BDF8]/10 px-3 py-2 border border-[#38BDF8]/30 rounded-sm whitespace-nowrap">
          <span className="w-2 h-2 rounded-full bg-[#38BDF8] animate-ping"></span>
          <span>{graphData.telemetry?.status || "11 NODES • 12 EDGES MAPPED"}</span>
        </div>
      </div>

      {/* Main split: Network Graph + Detail Panel */}
      <div className="flex-1 flex gap-4 overflow-hidden min-h-[450px]">
        <div className={`transition-all duration-300 ${selectedNodeId ? 'w-[70%]' : 'w-full'}`}>
          <NetworkGraph 
            nodes={graphData.nodes}
            edges={graphData.edges}
            selectedCampaign={filter}
            selectedNodeId={selectedNodeId} 
            onSelect={setSelectedNodeId} 
          />
        </div>
        
        {/* Detail Panel */}
        {selectedNodeId && selectedNodeData && (
          <div className="w-[30%] bg-[#0D1321]/90 border border-slate-800 rounded flex flex-col animate-in slide-in-from-right-4">
            <div className="px-4 py-3 border-b border-slate-800 bg-[#050A14] flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Cpu className="w-3.5 h-3.5 text-[#38BDF8]" />
                <h3 className="font-mono font-bold text-xs text-white tracking-widest">NODE INSPECTOR</h3>
              </div>
              <button onClick={() => setSelectedNodeId(null)} className="text-slate-500 hover:text-white text-sm font-bold">✕</button>
            </div>
            
            <div className="p-4 flex-1 overflow-y-auto flex flex-col gap-4">
              <div>
                <div className="text-[10px] text-slate-500 font-mono mb-1">NODE CLASSIFICATION</div>
                <div className={`font-mono font-bold text-sm tracking-wider ${
                  selectedNodeData.type.startsWith('CMD') 
                    ? 'text-[#EF4444]' 
                    : selectedNodeData.type === 'VOIP_GW' 
                      ? 'text-[#F59E0B]' 
                      : selectedNodeData.type === 'TARGET' 
                        ? 'text-slate-300' 
                        : 'text-[#38BDF8]'
                }`}>
                  {selectedNodeData.type.replace('_', ' ')}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-[10px] text-slate-500 font-mono mb-1">IDENTIFIER</div>
                  <div className="font-mono text-white text-xs font-semibold">{selectedNodeData.label}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 font-mono mb-1">STATUS</div>
                  <div className="font-mono text-[#10B981] text-xs font-semibold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse"></span>
                    ACTIVE TELEMETRY
                  </div>
                </div>
              </div>

              <div>
                <div className="text-[10px] text-slate-500 font-mono mb-1">TELEMETRY & ASSETS VALUE</div>
                <div className="font-mono text-[#38BDF8] text-xs font-bold bg-[#38BDF8]/10 p-2 rounded-sm border border-[#38BDF8]/20">
                  {selectedNodeData.sub}
                </div>
              </div>

              <div>
                <div className="text-[10px] text-slate-500 font-mono mb-2">CONNECTED SYNDICATE PIPELINES ({associatedConnections.length})</div>
                <div className="bg-[#050A14] border border-slate-800 rounded p-2 text-xs font-mono text-slate-300 max-h-[160px] overflow-y-auto">
                  {associatedConnections.map((e, idx) => {
                    const isOutgoing = e.from === selectedNodeId;
                    const connectedNodeId = isOutgoing ? e.to : e.from;
                    return (
                      <div key={idx} className="flex justify-between py-1.5 border-b border-slate-800/60 last:border-b-0 text-[10px]">
                        <span className="text-slate-400">
                          {isOutgoing ? "→ TO: " : "← FROM: "}
                          <span className="text-white font-medium">{getAssociatedNodeLabel(connectedNodeId)}</span>
                        </span>
                        <span className="text-[#38BDF8] font-bold text-[9px]">{e.label}</span>
                      </div>
                    );
                  })}
                  {associatedConnections.length === 0 && (
                    <div className="text-center text-slate-600 py-4 text-[10px]">NO ACTIVE CONNECTIONS DETECTED</div>
                  )}
                </div>
              </div>

              <div className="mt-auto space-y-2 pt-4 border-t border-slate-800/60">
                <button 
                  onClick={() => toast.success(`Node ${selectedNodeData.label} flagged for Court Docket inclusion`)}
                  className="w-full bg-[#050A14] border border-slate-800 hover:border-slate-600 text-white font-mono font-bold text-xs py-2 transition-colors uppercase tracking-wider"
                >
                  FLAG FOR COURT DOCKET
                </button>
                <button 
                  onClick={() => toast.error(`Initiating asset freeze sequence on ${selectedNodeData.label}...`)}
                  className="w-full bg-[#EF4444]/10 border border-[#EF4444]/30 text-[#EF4444] hover:bg-[#EF4444]/20 font-mono font-bold text-xs py-2 transition-colors uppercase tracking-wider"
                >
                  FREEZE LINKED ASSETS
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Evidence Vault Card */}
      <div className="bg-[#0D1321]/80 border border-slate-800 rounded p-4 flex items-center justify-between gap-4 flex-wrap md:flex-nowrap">
        <div className="font-mono text-[10px] space-y-1.5 flex-1 min-w-[280px]">
          <div className="flex items-center gap-1.5 text-white font-bold">
            <ShieldCheck className="w-4 h-4 text-[#10B981]" />
            <span>Court-Admissible Chain-of-Custody Repository</span>
          </div>
          <div className="text-slate-300">Incident Docket ID: <span className="text-white font-semibold">SENTINEL-2026-IN492</span></div>
          <div className="text-slate-400 break-all">
            Cryptographic Chain Hash: <span className="text-[#38BDF8]">SHA256: 4b89a1f2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8c392f4e</span>
          </div>
          <div className="text-slate-500">
            Evidence Integrity: <span className="text-[#10B981] font-bold">VERIFIED</span> · Custodian Nodes: <span className="text-slate-300">FIU-IND Node 7, I4C Hub Alpha</span>
          </div>
        </div>
        
        <button 
          onClick={handleExport}
          disabled={exporting}
          className="bg-white text-black font-mono font-bold text-xs px-6 py-3 rounded-sm hover:bg-slate-200 transition-colors uppercase tracking-widest min-w-[290px] flex justify-center items-center gap-2 disabled:opacity-50"
        >
          {exporting ? (
            <>
              <Loader2 className="animate-spin w-4 h-4 text-black" />
              PACKAGING EVIDENCE {progress}%
            </>
          ) : (
            <>
              <Download className="w-4 h-4" />
              EXPORT EVIDENCE ZIP
            </>
          )}
        </button>
      </div>
    </div>
  );
}
