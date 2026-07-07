import { useState, useEffect } from "react";
import IndiaMap, { Hotspot } from "../components/IndiaMap";
import { toast } from "sonner";

const INITIAL_LOGS = [
  { id: "INC-2026-04921", type: "DIGITAL ARREST SCAM", loc: "New Delhi, NCR", status: "ACTIVE", severity: "CRITICAL" },
  { id: "INC-2026-04920", type: "FICN CIRCULATION", loc: "SBI Connaught Place", status: "FLAGGED", severity: "HIGH" },
  { id: "FIR-2026-08841", type: "VOIP SPOOFING", loc: "Bengaluru, Karnataka", status: "INVESTIGATING", severity: "MEDIUM" },
  { id: "INC-2026-04918", type: "CRYPTO LAYERING", loc: "Ahmedabad, Gujarat", status: "MONITORING", severity: "HIGH" },
  { id: "INC-2026-04917", type: "MULE ACCOUNT SYNDICATE", loc: "Jamtara, Jharkhand", status: "ACTIVE", severity: "CRITICAL" },
  { id: "FIR-2026-08840", type: "HAWALA TRANSFER", loc: "Mumbai, Maharashtra", status: "FLAGGED", severity: "HIGH" },
  { id: "INC-2026-04915", type: "IDENTITY THEFT", loc: "Hyderabad, Telangana", status: "CLOSED", severity: "MEDIUM" },
  { id: "INC-2026-04914", type: "PHISHING CAMPAIGN", loc: "Pune, Maharashtra", status: "ACTIVE", severity: "HIGH" },
  { id: "FIR-2026-08838", type: "EXTORTION SMS", loc: "Mewat, Haryana", status: "INVESTIGATING", severity: "CRITICAL" },
  { id: "INC-2026-04912", type: "BANK FRAUD", loc: "Kolkata, WB", status: "FLAGGED", severity: "HIGH" },
  { id: "INC-2026-04911", type: "UPI SCAM", loc: "Chennai, TN", status: "MONITORING", severity: "MEDIUM" },
  { id: "FIR-2026-08835", type: "SIM SWAP", loc: "Jaipur, TN", status: "INVESTIGATING", severity: "HIGH" },
  { id: "INC-2026-04909", type: "LOAN APP FRAUD", loc: "Gurgaon, Rajasthan", status: "ACTIVE", severity: "CRITICAL" },
  { id: "INC-2026-04908", type: "JOB SCAM", loc: "Noida, Haryana", status: "CLOSED", severity: "MEDIUM" },
  { id: "FIR-2026-08832", type: "MATRIMONIAL FRAUD", loc: "Lucknow, Rajasthan", status: "MONITORING", severity: "HIGH" },
];

const NEW_LOG_TEMPLATES = [
  { type: "VOIP SPOOFING", loc: "Indore, Rajasthan", status: "ACTIVE", severity: "HIGH" },
  { type: "DIGITAL ARREST SCAM", loc: "Surat, Gujarat", status: "ACTIVE", severity: "CRITICAL" },
  { type: "FICN CIRCULATION", loc: "Nagpur, WB", status: "FLAGGED", severity: "HIGH" },
  { type: "MULE ACCOUNT CREATION", loc: "Bhopal, MP", status: "MONITORING", severity: "MEDIUM" },
];

const TICKER_MESSAGES = [
  "FICN ALERT: Counterfeit ₹500 note (Serial: 5AA 123456) flagged at SBI Connaught Place Branch, New Delhi.",
  "WIRE DISRUPTION: 74-minute extortion ring frozen in Mumbai. Local Cyber Cell dispatched for asset tracking.",
  "VOIP INTERCEPTION: International VoIP call (+1-829-XX) traced to Mewat grid node. IMSI captured.",
  "MHA DIRECTIVE: Heightened surveillance requested for Jamtara-based telecom nodes. Authorized by Dir. Sharma.",
  "CRYPTO TRACE: ₹4,50,000 routed through 3 mule accounts, converted to USDT via Binance P2P. Exchange notified."
];

export default function CommandCenter() {
  const [activeTab, setActiveTab] = useState<"MAP" | "LOG">("MAP");
  const [selectedHotspot, setSelectedHotspot] = useState<string>("mewat");
  const [logs, setLogs] = useState(INITIAL_LOGS.map((l, i) => ({ ...l, time: new Date(Date.now() - i * 60000).toLocaleTimeString("en-IN", { hour12: false }) })));
  const [filter, setFilter] = useState<"ALL" | "CRITICAL" | "HIGH" | "MEDIUM">("ALL");
  const [tickers, setTickers] = useState<string[]>(TICKER_MESSAGES.slice(0, 3).map((m, i) => `[${new Date(Date.now() - i * 120000).toLocaleTimeString("en-IN", { hour12: false })} IST] ${m}`));

  useEffect(() => {
    const logInterval = setInterval(() => {
      const template = NEW_LOG_TEMPLATES[Math.floor(Math.random() * NEW_LOG_TEMPLATES.length)];
      const newLog = {
        id: `INC-2026-0${Math.floor(4000 + Math.random() * 1000)}`,
        type: template.type,
        loc: template.loc,
        status: template.status,
        severity: template.severity,
        time: new Date().toLocaleTimeString("en-IN", { hour12: false })
      };
      setLogs(prev => [newLog, ...prev]);
    }, 12000);
    return () => clearInterval(logInterval);
  }, []);

  useEffect(() => {
    const tickerInterval = setInterval(() => {
      const msg = TICKER_MESSAGES[Math.floor(Math.random() * TICKER_MESSAGES.length)];
      const time = new Date().toLocaleTimeString("en-IN", { hour12: false });
      setTickers(prev => [`[${time} IST] ${msg}`, ...prev].slice(0, 10));
    }, 10000);
    return () => clearInterval(tickerInterval);
  }, []);

  const filteredLogs = logs.filter(l => filter === "ALL" || l.severity === filter);

  return (
    <div className="h-full flex flex-col p-4 gap-4">
      {/* Main Split */}
      <div className="flex-1 flex gap-4 overflow-hidden">
        {/* Left 65% */}
        <div className="w-[65%] flex flex-col gap-2">
          {/* Tabs */}
          <div className="flex items-center gap-2 mb-2">
            <button 
              onClick={() => setActiveTab("MAP")} 
              className={`px-4 py-2 font-mono text-xs font-bold tracking-widest border transition-colors ${activeTab === "MAP" ? "bg-[#38BDF8]/10 text-[#38BDF8] border-[#38BDF8]/50" : "bg-[#0D1321] text-slate-400 border-border hover:text-white"}`}
            >
              NATIONAL INCIDENT MAP
            </button>
            <button 
              onClick={() => setActiveTab("LOG")} 
              className={`px-4 py-2 font-mono text-xs font-bold tracking-widest border transition-colors ${activeTab === "LOG" ? "bg-[#38BDF8]/10 text-[#38BDF8] border-[#38BDF8]/50" : "bg-[#0D1321] text-slate-400 border-border hover:text-white"}`}
            >
              ACTIVE SYSTEM LOG
            </button>
          </div>

          <div className="flex-1 overflow-hidden relative">
            {activeTab === "MAP" && (
              <IndiaMap selectedId={selectedHotspot} onSelect={setSelectedHotspot} />
            )}
            
            {activeTab === "LOG" && (
              <div className="h-full bg-[#0D1321] border border-border rounded flex flex-col overflow-hidden">
                <div className="flex items-center gap-2 p-2 border-b border-border bg-[#050A14]">
                  {["ALL", "CRITICAL", "HIGH", "MEDIUM"].map((f) => (
                    <button 
                      key={f}
                      onClick={() => setFilter(f as any)}
                      className={`px-3 py-1 font-mono text-[10px] tracking-wider rounded ${filter === f ? "bg-white text-black" : "bg-transparent text-slate-400 border border-border hover:border-slate-500"}`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
                <div className="flex-1 overflow-y-auto">
                  <table className="w-full text-left border-collapse">
                    <thead className="sticky top-0 bg-[#050A14] text-[10px] font-mono text-slate-500 tracking-wider">
                      <tr>
                        <th className="p-3 border-b border-border">TIME</th>
                        <th className="p-3 border-b border-border">INCIDENT ID</th>
                        <th className="p-3 border-b border-border">TYPE</th>
                        <th className="p-3 border-b border-border">LOCATION</th>
                        <th className="p-3 border-b border-border">STATUS</th>
                        <th className="p-3 border-b border-border">SEVERITY</th>
                      </tr>
                    </thead>
                    <tbody className="text-xs font-mono text-slate-300">
                      {filteredLogs.map((log, i) => (
                        <tr key={i} className="border-b border-border/50 hover:bg-[#111827]">
                          <td className="p-3 whitespace-nowrap">{log.time}</td>
                          <td className="p-3 text-white">{log.id}</td>
                          <td className="p-3">{log.type}</td>
                          <td className="p-3">{log.loc}</td>
                          <td className="p-3">{log.status}</td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] ${
                              log.severity === "CRITICAL" ? "bg-[#EF4444]/20 text-[#EF4444] border border-[#EF4444]/30" :
                              log.severity === "HIGH" ? "bg-[#F59E0B]/20 text-[#F59E0B] border border-[#F59E0B]/30" :
                              "bg-[#38BDF8]/20 text-[#38BDF8] border border-[#38BDF8]/30"
                            }`}>
                              {log.severity}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right 35% */}
        <div className="w-[35%] bg-[#0D1321] border border-border rounded flex flex-col overflow-hidden mt-10">
          <div className="p-4 border-b border-border bg-[#050A14]">
            <h3 className="font-mono font-bold text-lg text-[#EF4444] uppercase tracking-widest">{selectedHotspot.toUpperCase()} GRID SECTOR Alpha</h3>
            <p className="text-xs text-slate-400 font-mono tracking-wider">CLASSIFIED OPERATIONAL BRIEFING</p>
          </div>
          
          <div className="p-4 flex flex-col gap-6 flex-1 overflow-y-auto">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#111827] p-3 border border-border rounded">
                <div className="text-[10px] text-slate-500 font-mono mb-1">ACTIVE VECTORS</div>
                <div className="text-xl font-mono text-white">1,492</div>
              </div>
              <div className="bg-[#111827] p-3 border border-border rounded">
                <div className="text-[10px] text-slate-500 font-mono mb-1">VOIP NODES MAPPED</div>
                <div className="text-xl font-mono text-white">47</div>
              </div>
              <div className="bg-[#111827] p-3 border border-border rounded">
                <div className="text-[10px] text-slate-500 font-mono mb-1">ARRESTS THIS QTR</div>
                <div className="text-xl font-mono text-white">215</div>
              </div>
              <div className="bg-[#111827] p-3 border border-border rounded">
                <div className="text-[10px] text-slate-500 font-mono mb-1">FIR FILED</div>
                <div className="text-xl font-mono text-white">8,341</div>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold text-white mb-2 uppercase">Operational Context</h4>
              <p className="text-sm text-slate-300 leading-relaxed font-sans">
                The {selectedHotspot} grid currently exhibits a severe concentration of synchronized cybercrime operations. Our NLP models indicate a 43% week-over-week increase in {selectedHotspot === 'mewat' || selectedHotspot === 'ncr' ? "Digital Arrest coercion" : "Financial phishing"} tactics originating from these geographic coordinates. MHA coordination is advised for physical raids.
              </p>
            </div>

            <div className="mt-auto space-y-3">
              <button 
                onClick={() => toast.success("Rapid Response unit deployed to " + selectedHotspot.toUpperCase())}
                className="w-full bg-[#F59E0B]/10 border border-[#F59E0B]/50 text-[#F59E0B] font-mono font-bold text-xs py-3 hover:bg-[#F59E0B]/20 transition-colors uppercase tracking-widest"
              >
                DEPLOY RAPID RESPONSE
              </button>
              <button 
                onClick={() => toast.success("Sector " + selectedHotspot.toUpperCase() + " flagged for MHA review")}
                className="w-full bg-[#38BDF8]/10 border border-[#38BDF8]/50 text-[#38BDF8] font-mono font-bold text-xs py-3 hover:bg-[#38BDF8]/20 transition-colors uppercase tracking-widest"
              >
                FLAG FOR MHA REVIEW
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Ticker */}
      <div className="h-32 bg-[#0D1321] border border-border rounded flex flex-col overflow-hidden">
        <div className="px-3 py-1.5 border-b border-border bg-[#050A14] flex items-center gap-2">
          <div className="w-1.5 h-1.5 bg-[#EF4444] rounded-full animate-pulse"></div>
          <span className="text-[10px] font-mono text-slate-400 font-bold tracking-widest">HIGH-VALUE LEDGER STREAM</span>
        </div>
        <div className="flex-1 p-3 overflow-y-auto font-mono text-xs text-slate-300 flex flex-col gap-2">
          {tickers.map((t, i) => (
            <div key={i} className="animate-in fade-in slide-in-from-top-2">
              <span className={t.includes("FICN") ? "text-[#EF4444]" : t.includes("MHA") ? "text-[#38BDF8]" : t.includes("VOIP") ? "text-[#F59E0B]" : "text-slate-300"}>
                {t}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
