import { useState } from "react";
import { useSettings } from "../contexts/SettingsContext";
import { toast } from "sonner";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";

export default function SystemSettings() {
  const { aiConfidenceCutoff, setAiConfidenceCutoff, deepfakeSensorWeight, setDeepfakeSensorWeight } = useSettings();
  
  const [nodes, setNodes] = useState([
    { id: 'i4c', name: 'I4C Primary Node', active: true, ip: '10.24.11.92' },
    { id: 'ncrb', name: 'NCRB Data Feed', active: true, ip: '10.24.11.93' },
    { id: 'rbi', name: 'RBI FICN Database', active: true, ip: '10.24.11.94' },
    { id: 'fiu', name: 'FIU-IND Financial Intelligence', active: false, ip: '10.24.11.95' },
  ]);

  const toggleNode = (id: string) => {
    setNodes(prev => prev.map(n => n.id === id ? { ...n, active: !n.active } : n));
    const node = nodes.find(n => n.id === id);
    if (node) {
      toast(`${node.name} uplink ${!node.active ? 'established' : 'severed'}`);
    }
  };

  return (
    <div className="h-full p-4 overflow-y-auto max-w-4xl mx-auto flex flex-col gap-6">
      
      <div className="bg-[#0D1321] border border-border rounded overflow-hidden">
        <div className="px-6 py-4 border-b border-border bg-[#050A14]">
          <h2 className="font-mono font-bold text-sm text-white tracking-widest">MACHINE LEARNING THRESHOLDS</h2>
          <p className="text-[10px] text-slate-500 font-mono mt-1">GLOBAL SENSOR CALIBRATION</p>
        </div>
        
        <div className="p-6 flex flex-col gap-8">
          <div className="space-y-4">
            <div className="flex justify-between items-end">
              <div>
                <div className="text-white font-mono text-xs font-bold tracking-wider">AI CLASSIFIER CONFIDENCE CUTOFF</div>
                <div className="text-slate-400 font-mono text-[10px] mt-1">Minimum probability required to auto-flag FICN anomalies.</div>
              </div>
              <div className="text-[#38BDF8] font-mono font-bold text-lg">{aiConfidenceCutoff}%</div>
            </div>
            <Slider 
              value={[aiConfidenceCutoff]} 
              onValueChange={([val]) => setAiConfidenceCutoff(val)} 
              max={100} 
              step={1} 
              className="py-2"
            />
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-end">
              <div>
                <div className="text-white font-mono text-xs font-bold tracking-wider">DEEPFAKE SENSOR WEIGHTING</div>
                <div className="text-slate-400 font-mono text-[10px] mt-1">Multiplier for spatial inconsistency detection in Live Intercepts.</div>
              </div>
              <div className="text-[#F59E0B] font-mono font-bold text-lg">{deepfakeSensorWeight}x</div>
            </div>
            <Slider 
              value={[deepfakeSensorWeight]} 
              onValueChange={([val]) => setDeepfakeSensorWeight(val)} 
              max={2.0} 
              min={0.1}
              step={0.1} 
              className="py-2"
            />
          </div>
        </div>
      </div>

      <div className="bg-[#0D1321] border border-border rounded overflow-hidden">
        <div className="px-6 py-4 border-b border-border bg-[#050A14]">
          <h2 className="font-mono font-bold text-sm text-white tracking-widest">NODE CONFIGURATION</h2>
          <p className="text-[10px] text-slate-500 font-mono mt-1">AGENCY UPLINK STATUS</p>
        </div>
        
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {nodes.map(node => (
            <div key={node.id} className="bg-[#111827] border border-border rounded p-4 flex items-center justify-between">
              <div>
                <div className="text-white font-mono text-xs font-bold">{node.name}</div>
                <div className="text-slate-500 font-mono text-[10px] mt-1">{node.ip}</div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`font-mono text-[10px] ${node.active ? 'text-[#10B981]' : 'text-slate-500'}`}>
                  {node.active ? 'ONLINE' : 'OFFLINE'}
                </span>
                <Switch 
                  checked={node.active} 
                  onCheckedChange={() => toggleNode(node.id)} 
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-[#0D1321] border border-border rounded overflow-hidden">
        <div className="px-6 py-4 border-b border-border bg-[#050A14]">
          <h2 className="font-mono font-bold text-sm text-white tracking-widest">SYSTEM MAINTENANCE</h2>
        </div>
        <div className="p-6">
          <button 
            onClick={() => toast("Audit log compilation started. The report will be emailed to your registered MHA address.", { style: { borderColor: '#38BDF8' }})}
            className="bg-[#38BDF8]/10 border border-[#38BDF8]/50 text-[#38BDF8] hover:bg-[#38BDF8]/20 font-mono font-bold text-xs py-3 px-6 transition-colors uppercase tracking-widest"
          >
            EXPORT FULL AUDIT LOG
          </button>
        </div>
      </div>

    </div>
  );
}
