import { useState, useEffect } from "react";
import RupeeNote from "../components/RupeeNote";
import { useSettings } from "../contexts/SettingsContext";

export default function FICNAudit() {
  const { aiConfidenceCutoff } = useSettings();
  const [checks, setChecks] = useState([
    { id: 1, name: "MICROPRINT TEXT OCR SCAN", status: "VERIFIED — 2400 DPI STRUCTURAL MATCH", pass: true, progress: 100, active: true },
    { id: 2, name: "SECURITY THREAD SPECTRAL DEVIATION", status: "FAIL — STATIC INK SIGNATURE DETECTED / NO VARIABLE SHIFT", pass: false, progress: 23, active: true },
    { id: 3, name: "GEOMETRIC SERIAL VALIDATION", status: "FAIL — NON-STANDARD ISSUE PATTERN DETECTED", pass: false, progress: 11, active: true },
    { id: 4, name: "UV FLUORESCENCE RESPONSE", status: "FAIL — FLUORESCENCE ABSENT ON SECURITY FIBRES", pass: false, progress: 5, active: true },
    { id: 5, name: "PAPER COMPOSITION ANALYSIS", status: "PASS — 100% COTTON SUBSTRATE DETECTED", pass: true, progress: 100, active: true }
  ]);
  const [scanningId, setScanningId] = useState<number | null>(null);

  const toggleCheck = (id: number) => {
    setScanningId(id);
    setTimeout(() => {
      setChecks(prev => prev.map(c => c.id === id ? { ...c, active: !c.active } : c));
      setScanningId(null);
    }, 800);
  };

  const confidence = Math.min(99.9, aiConfidenceCutoff + 12.8).toFixed(1);

  return (
    <div className="h-full flex flex-col p-4 gap-4">
      {/* Header */}
      <div className="bg-[#0D1321] border border-border rounded p-4 flex items-center justify-between">
        <h2 className="font-mono text-sm text-white font-bold tracking-widest">FICN FIELD AUDIT AGENT v3.1 — RESERVE BANK CERTIFIED</h2>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#10B981]"></div>
          <span className="text-[#10B981] font-mono text-[10px] tracking-wider">OPTICAL SCANNER SYNCED</span>
        </div>
      </div>

      {/* Main Split */}
      <div className="flex-1 flex gap-4 overflow-hidden">
        
        {/* Left Panel */}
        <div className="w-1/2 bg-[#0D1321] border border-border rounded flex flex-col">
          <div className="px-4 py-3 border-b border-border bg-[#050A14]">
            <h3 className="font-mono font-bold text-xs text-white tracking-widest">OPTICAL INPUT CAPTURE</h3>
          </div>
          <div className="flex-1 flex items-center justify-center p-8 bg-[#0A1628] relative">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)] z-10 pointer-events-none"></div>
            <div className="relative z-20 w-full max-w-lg">
              <RupeeNote />
            </div>
            {/* Animated scanning line overlay */}
            <div className="absolute inset-0 z-30 pointer-events-none overflow-hidden">
               <div className="w-full h-1 bg-[#EF4444] opacity-50 shadow-[0_0_15px_#EF4444] absolute left-0 top-0" style={{ animation: "scan 3s linear infinite" }}>
                 <style>{`@keyframes scan { 0% { top: 0; } 50% { top: 100%; } 100% { top: 0; } }`}</style>
               </div>
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="w-1/2 flex flex-col gap-4 overflow-hidden">
          <div className="flex-1 bg-[#0D1321] border border-border rounded flex flex-col overflow-hidden">
            <div className="px-4 py-3 border-b border-border bg-[#050A14]">
              <h3 className="font-mono font-bold text-xs text-white tracking-widest">SPECTRAL FEATURE INSET & DIAGNOSTICS</h3>
            </div>
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
              {checks.map(check => (
                <div key={check.id} className="bg-[#111827] border border-border rounded p-3 relative overflow-hidden">
                  {scanningId === check.id && (
                    <div className="absolute inset-0 bg-[#38BDF8]/10 animate-pulse"></div>
                  )}
                  <div className="flex justify-between items-center mb-2 relative z-10">
                    <span className="font-mono text-xs text-white font-bold">{check.name}</span>
                    <button 
                      onClick={() => toggleCheck(check.id)}
                      className={`w-10 h-5 rounded-full relative transition-colors ${check.active ? "bg-[#38BDF8]" : "bg-slate-700"}`}
                    >
                      <div className={`w-3 h-3 bg-white rounded-full absolute top-1 transition-all ${check.active ? "left-6" : "left-1"}`}></div>
                    </button>
                  </div>
                  
                  {check.active ? (
                    <>
                      <div className={`font-mono text-[10px] mb-2 ${check.pass ? "text-[#10B981]" : "text-[#EF4444]"}`}>
                        [{check.status}]
                      </div>
                      <div className="h-1.5 w-full bg-[#050A14] rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${check.pass ? "bg-[#10B981]" : "bg-[#EF4444]"}`} 
                          style={{ width: `${check.progress}%`, transition: "width 1s ease-in-out" }}
                        ></div>
                      </div>
                    </>
                  ) : (
                    <div className="font-mono text-[10px] text-slate-500">CHECK DISABLED</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Verdict Box */}
      <div className="bg-[#EF4444]/10 border-2 border-[#EF4444] rounded p-6">
        <h2 className="text-[#EF4444] font-mono font-bold text-xl mb-2 tracking-widest">VERDICT: CONFIRMED FORGED INDIAN CURRENCY NOTE (FICN TYPE-4)</h2>
        <div className="flex items-center gap-6">
          <p className="text-white font-mono text-sm">DETECTION CONFIDENCE: {confidence}% · RECOMMENDATION: <span className="text-[#EF4444] font-bold">IMMEDIATE SEIZURE AND FIR FILING</span></p>
          <div className="h-4 w-px bg-[#EF4444]/50"></div>
          <p className="text-slate-400 font-mono text-xs">REFERENCE: RBI CIRCULAR FICN-2026/442 · NCRB CASE: NCR-FICN-2026-1821</p>
        </div>
      </div>
    </div>
  );
}
