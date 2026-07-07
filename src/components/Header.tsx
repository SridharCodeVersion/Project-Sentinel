import { Shield, Lock } from "lucide-react";
import { useEffect, useState } from "react";

export default function Header() {
  const [time, setTime] = useState("");
  const [intercepts, setIntercepts] = useState(14);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString("en-IN", { hour12: false, timeZone: "Asia/Kolkata" });
      const dateStr = now.toLocaleDateString("en-IN", { day: '2-digit', month: 'short', year: 'numeric', timeZone: "Asia/Kolkata" }).toUpperCase().replace(/ /g, '-');
      setTime(`${timeStr} IST ${dateStr}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setIntercepts(prev => prev + (Math.floor(Math.random() * 5) - 2));
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col w-full z-50 fixed top-0">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-4 h-[52px] bg-[#080D1A] border-b border-border">
        {/* Left */}
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center w-8 h-8 rounded bg-gradient-to-br from-[#2563EB] to-[#38BDF8] text-white">
            <Shield size={18} />
          </div>
          <div className="flex flex-col justify-center">
            <div className="flex items-center gap-2">
              <span className="text-white font-bold tracking-widest text-sm">PROJECT SENTINEL</span>
              <span className="flex items-center gap-1 bg-[#EF4444]/20 text-[#EF4444] text-[10px] px-1.5 py-0.5 rounded border border-[#EF4444]/30 font-semibold tracking-wider">
                <Lock size={10} /> v2.4.1 CLASSIFIED
              </span>
            </div>
            <span className="text-slate-400 text-[10px] uppercase tracking-wider">Ministry of Home Affairs · I4C Portal Integration</span>
          </div>
        </div>

        {/* Center */}
        <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2 bg-[#050A14] border border-[#1F2937] px-3 py-1 rounded-full">
          <div className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10B981]"></span>
          </div>
          <span className="text-[#10B981] font-mono text-xs tracking-wider">I4C UPLINK: ACTIVE · AES-256-GCM VERIFIED</span>
        </div>

        {/* Right */}
        <div className="flex items-center gap-6">
          <div className="text-white font-mono text-xs tracking-wider">{time}</div>
          <div className="flex items-center gap-2">
            <div className="h-6 w-px bg-[#1F2937]"></div>
            <span className="text-slate-400 text-xs font-medium tracking-wide">DIR. AMIT SHARMA · ADMIN · <span className="text-[#38BDF8]">AUTHORIZED</span></span>
          </div>
        </div>
      </div>

      {/* Telemetry Ticker Bar */}
      <div className="h-[40px] bg-[#050A14] border-b border-border flex items-center overflow-hidden relative">
        <div className="flex whitespace-nowrap animate-scroll-left w-max">
          <div className="flex items-center px-8 gap-8">
            <div className="flex items-center gap-2">
              <span className="text-[#38BDF8] font-mono text-xs">ACTIVE TELECOM INTERCEPTS: {intercepts} NODES RUNNING</span>
            </div>
            <div className="h-4 w-px bg-[#1F2937]"></div>
            <div className="flex items-center gap-2">
              <span className="text-[#10B981] font-mono text-xs">I4C CROSS-BORDER SYNDICATE SUPPRESSION: 98.4%</span>
            </div>
            <div className="h-4 w-px bg-[#1F2937]"></div>
            <div className="flex items-center gap-2">
              <span className="text-[#10B981] font-mono text-xs">HIGH-DENOMINATION FICN TRAJECTORY: -12.4% (Q2 INTERCEPTION)</span>
            </div>
            <div className="h-4 w-px bg-[#1F2937]"></div>
            <div className="flex items-center gap-2">
              <span className="text-[#38BDF8] font-mono text-xs">SECURE DATA LEDGER NODE: ACTIVE · AES-256-GCM CRYPTOGRAPHIC TUNNELING VERIFIED</span>
            </div>
            <div className="h-4 w-px bg-[#1F2937]"></div>
            {/* DUPLICATE FOR SEAMLESS SCROLL */}
            <div className="flex items-center gap-2">
              <span className="text-[#38BDF8] font-mono text-xs">ACTIVE TELECOM INTERCEPTS: {intercepts} NODES RUNNING</span>
            </div>
            <div className="h-4 w-px bg-[#1F2937]"></div>
            <div className="flex items-center gap-2">
              <span className="text-[#10B981] font-mono text-xs">I4C CROSS-BORDER SYNDICATE SUPPRESSION: 98.4%</span>
            </div>
            <div className="h-4 w-px bg-[#1F2937]"></div>
            <div className="flex items-center gap-2">
              <span className="text-[#10B981] font-mono text-xs">HIGH-DENOMINATION FICN TRAJECTORY: -12.4% (Q2 INTERCEPTION)</span>
            </div>
            <div className="h-4 w-px bg-[#1F2937]"></div>
            <div className="flex items-center gap-2">
              <span className="text-[#38BDF8] font-mono text-xs">SECURE DATA LEDGER NODE: ACTIVE · AES-256-GCM CRYPTOGRAPHIC TUNNELING VERIFIED</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
