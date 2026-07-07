import { useState, useEffect, useRef } from "react";
import { useSettings } from "../contexts/SettingsContext";
import { toast } from "sonner";

const SCAM_SCRIPT = [
  { actor: "ATTACKER", text: "This is Deputy Commissioner Rajesh Mehta, CBI Special Branch, Mumbai.", flag: "INFO: IDENTITY CLAIM - UNVERIFIED", color: "slate" },
  { actor: "ATTACKER", text: "You are under immediate Digital Arrest for money laundering worth ₹14,32,000.", flag: "CRITICAL FLAG: EXTORTION VIA COERCION / JURISDICTION OVERREACH", color: "crimson" },
  { actor: "ATTACKER", text: "Your Aadhaar number has been linked to a hawala account in Dubai.", flag: "CRITICAL FLAG: ILLEGAL AADHAAR MISUSE / SOCIAL ENGINEERING", color: "crimson" },
  { actor: "VICTIM", text: "I don't understand, please help me...", flag: "INFO: VICTIM DISTRESS SIGNAL DETECTED", color: "slate" },
  { actor: "ATTACKER", text: "Do not disconnect this video call or tell your family members.", flag: "CRITICAL FLAG: PSYCHOLOGICAL HOSTAGE PROTOCOL PATTERN", color: "crimson" },
  { actor: "ATTACKER", text: "Transfer ₹2,50,000 immediately to avoid arrest warrant.", flag: "CRITICAL FLAG: FINANCIAL COERCION / ILLEGAL DEMAND", color: "crimson" },
  { actor: "VICTIM", text: "Okay, how do I do it?", flag: "INFO: COMPLIANCE INDICATION", color: "slate" },
  { actor: "ATTACKER", text: "This is confidential. No lawyers. No family. Only compliance.", flag: "CRITICAL FLAG: ISOLATION TACTIC / COERCIVE CONTROL PATTERN", color: "crimson" },
  { actor: "I4C ENGINE", text: "Pattern match — Mewat Extortion Campaign #04. Confidence: 98.7%", flag: "SYSTEM FLAG: SYNDICATE IDENTIFIED", color: "amber" }
];

export default function LiveIntercept() {
  const { deepfakeSensorWeight } = useSettings();
  const [transcriptIdx, setTranscriptIdx] = useState(0);
  const [timer, setTimer] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const confidenceBase = 94.2;
  const currentConfidence = Math.min(99.9, confidenceBase * deepfakeSensorWeight).toFixed(1);

  useEffect(() => {
    if (transcriptIdx < SCAM_SCRIPT.length - 1) {
      const timeout = setTimeout(() => setTranscriptIdx(prev => prev + 1), 3000);
      return () => clearTimeout(timeout);
    }
  }, [transcriptIdx]);

  useEffect(() => {
    const interval = setInterval(() => setTimer(prev => prev + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [transcriptIdx]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div className="h-full flex flex-col p-4 gap-4">
      {/* Main Split */}
      <div className="flex-1 flex gap-4 overflow-hidden">
        
        {/* Left Panel */}
        <div className="w-1/2 flex flex-col gap-4">
          <div className="h-[300px] bg-[#030810] border border-border rounded relative overflow-hidden flex flex-col">
            <div className="scan-line absolute inset-0 z-10"></div>
            
            {/* Top Bar */}
            <div className="absolute top-0 w-full p-2 flex justify-between z-20 bg-gradient-to-b from-black/80 to-transparent">
              <div className="flex items-center gap-2 bg-[#EF4444]/20 px-2 py-1 border border-[#EF4444]/50 rounded">
                <div className="w-2 h-2 rounded-full bg-[#EF4444] animate-pulse"></div>
                <span className="text-[#EF4444] font-mono text-[10px] font-bold tracking-widest">LIVE FEED: SYNTHETIC AVATAR DETECTED</span>
              </div>
              <div className="font-mono text-xs text-white bg-black/50 px-2 py-1 rounded border border-border">REC {formatTime(timer)}</div>
            </div>

            {/* Video Placeholder (Waveform) */}
            <div className="flex-1 flex items-center justify-center">
              <div className="flex items-end justify-center gap-1 h-20">
                {Array.from({ length: 24 }).map((_, i) => (
                  <div 
                    key={i} 
                    className="w-2 bg-[#38BDF8] opacity-50"
                    style={{ 
                      height: `${Math.max(10, Math.random() * 100)}%`,
                      animation: `pulse-ring ${0.5 + Math.random()}s infinite alternate`
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Overlays bottom */}
            <div className="absolute bottom-4 left-4 z-20 flex flex-col gap-1">
              <span className="text-white text-[10px] font-mono">FACE-MESH SPATIAL INCONSISTENCY</span>
              <span className="text-[#EF4444] font-mono font-bold text-xs">{currentConfidence}% SYNTHETIC PROBABILITY</span>
            </div>

            <div className="absolute bottom-4 right-4 z-20 flex flex-col items-end gap-1">
              <span className="text-white text-[10px] font-mono">VOICE SPECTRAL WAVEFORM</span>
              <span className="text-[#F59E0B] font-mono font-bold text-xs">PHASE MISMATCH / AI CLONE VERIFIED</span>
            </div>
            
            {/* Progress bar */}
            <div className="absolute bottom-0 left-0 h-1 bg-[#EF4444] z-20" style={{ width: `${currentConfidence}%`, transition: 'width 0.5s' }}></div>
          </div>

          <div className="bg-[#0D1321] border border-border rounded p-4 flex-1">
            <h3 className="text-xs font-mono font-bold tracking-widest text-slate-400 mb-4 border-b border-border pb-2">SPECTRAL AUDIO ANALYSIS</h3>
            <div className="h-full flex items-center justify-center pb-8">
               <svg viewBox="0 0 100 20" className="w-full h-20 opacity-70">
                  <path d="M0,10 Q5,0 10,10 T20,10 T30,10 T40,2 T50,10 T60,18 T70,10 T80,10 T90,5 T100,10" fill="none" stroke="#F59E0B" strokeWidth="0.5">
                    <animate attributeName="d" values="M0,10 Q5,0 10,10 T20,10 T30,10 T40,2 T50,10 T60,18 T70,10 T80,10 T90,5 T100,10;M0,10 Q5,20 10,10 T20,10 T30,10 T40,18 T50,10 T60,2 T70,10 T80,10 T90,15 T100,10;M0,10 Q5,0 10,10 T20,10 T30,10 T40,2 T50,10 T60,18 T70,10 T80,10 T90,5 T100,10" dur="1s" repeatCount="indefinite" />
                  </path>
                  <path d="M0,10 Q5,5 10,10 T20,10 T30,10 T40,15 T50,10 T60,5 T70,10 T80,10 T90,2 T100,10" fill="none" stroke="#38BDF8" strokeWidth="0.5" opacity="0.5">
                    <animate attributeName="d" values="M0,10 Q5,5 10,10 T20,10 T30,10 T40,15 T50,10 T60,5 T70,10 T80,10 T90,2 T100,10;M0,10 Q5,15 10,10 T20,10 T30,10 T40,5 T50,10 T60,15 T70,10 T80,10 T90,18 T100,10;M0,10 Q5,5 10,10 T20,10 T30,10 T40,15 T50,10 T60,5 T70,10 T80,10 T90,2 T100,10" dur="1.5s" repeatCount="indefinite" />
                  </path>
               </svg>
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="w-1/2 bg-[#0D1321] border border-border rounded flex flex-col overflow-hidden">
          <div className="px-4 py-3 border-b border-border bg-[#050A14]">
            <h3 className="font-mono font-bold text-sm text-white tracking-widest">I4C NLP ANALYSIS PARSER</h3>
            <p className="text-[10px] text-slate-500 font-mono">REAL-TIME THREAT TRANSCRIPTION</p>
          </div>
          <div ref={scrollRef} className="flex-1 p-4 overflow-y-auto font-mono text-xs flex flex-col gap-3">
            {SCAM_SCRIPT.slice(0, transcriptIdx + 1).map((line, i) => (
              <div key={i} className="animate-in fade-in slide-in-from-bottom-2 flex flex-col gap-1">
                <div className="text-white">
                  <span className={line.actor === "VICTIM" ? "text-slate-400" : line.actor === "I4C ENGINE" ? "text-[#38BDF8]" : "text-[#EF4444]"}>[{line.actor}]</span> {line.text}
                </div>
                <div className={`text-[10px] font-bold px-2 py-0.5 rounded border self-start ${
                  line.color === 'crimson' ? "bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/30" :
                  line.color === 'amber' ? "bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/30" :
                  "bg-slate-800 text-slate-300 border-slate-700"
                }`}>
                  [{line.flag}]
                </div>
              </div>
            ))}
            {transcriptIdx < SCAM_SCRIPT.length - 1 && (
              <div className="text-slate-500 animate-pulse mt-2">_ LISTENING...</div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Drawer */}
      <div className="h-28 bg-[#0D1321] border border-border rounded flex items-center p-4 gap-6">
        <div className="flex flex-col justify-center gap-2 flex-1">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-[#EF4444] rounded-full animate-pulse"></div>
            <span className="text-white font-mono font-bold tracking-widest text-sm">INTERVENTION STATUS: ACTIVE</span>
          </div>
          <div className="text-slate-400 font-mono text-xs">AUTHORIZED ENGAGEMENT PROTOCOLS</div>
        </div>
        
        <div className="flex gap-4 w-[60%]">
          <button 
            onClick={() => toast("MHA Alert Packet #2026-04921 generated and transmitted to I4C Coordination Hub. Tracking ID: SENT-2026-MH-492.", { style: { borderColor: '#38BDF8' }})}
            className="flex-1 bg-[#38BDF8]/10 hover:bg-[#38BDF8]/20 border border-[#38BDF8]/50 text-[#38BDF8] font-mono font-bold text-[10px] p-3 transition-colors uppercase flex flex-col items-center justify-center gap-1 text-center"
          >
            <span>GENERATE AUTOMATED</span>
            <span>MHA ALERT PACKET</span>
          </button>
          <button 
            onClick={() => toast("Decoy audio loop injected on intercept channel. Attacker audio path disrupted for 3 minutes 42 seconds.", { style: { borderColor: '#F59E0B' }})}
            className="flex-1 bg-[#F59E0B]/10 hover:bg-[#F59E0B]/20 border border-[#F59E0B]/50 text-[#F59E0B] font-mono font-bold text-[10px] p-3 transition-colors uppercase flex flex-col items-center justify-center gap-1 text-center"
          >
            <span>INJECT DECOY</span>
            <span>AUDIO LOOP</span>
          </button>
          <button 
            onClick={() => toast("IMSI Node +91-XXXXXX-8821 isolated. Telecom provider notified. SIM card flagged for immediate deactivation.", { style: { borderColor: '#EF4444' }})}
            className="flex-1 bg-[#EF4444]/10 hover:bg-[#EF4444]/20 border border-[#EF4444]/50 text-[#EF4444] font-mono font-bold text-[10px] p-3 transition-colors uppercase flex flex-col items-center justify-center gap-1 text-center"
          >
            <span>ISOLATE TELECOM</span>
            <span>IMSI NODE</span>
          </button>
        </div>
      </div>
    </div>
  );
}
