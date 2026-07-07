import { Link, useLocation } from "wouter";
import { Shield, RadioTower, ScanLine, Network, SlidersHorizontal } from "lucide-react";

const navItems = [
  { path: "/", label: "COMMAND CENTER", icon: Shield },
  { path: "/intercept", label: "LIVE INTERCEPT", icon: RadioTower },
  { path: "/ficn", label: "FICN AUDIT", icon: ScanLine },
  { path: "/syndicate", label: "SYNDICATE GRAPH", icon: Network },
  { path: "/settings", label: "SYSTEM SETTINGS", icon: SlidersHorizontal },
];

export default function Sidebar() {
  const [location] = useLocation();

  return (
    <div className="w-[240px] h-full fixed left-0 top-[92px] bg-[#080D1A] border-r border-border flex flex-col py-6">
      <div className="px-6 mb-6">
        <h2 className="text-[10px] text-slate-500 font-bold tracking-widest">OPERATIONAL MODULES</h2>
      </div>
      <nav className="flex flex-col gap-2 px-3">
        {navItems.map((item) => {
          const active = location === item.path;
          return (
            <Link key={item.path} href={item.path} className={`flex items-center gap-3 px-3 py-2.5 rounded-sm transition-colors relative ${active ? "bg-[#111827] text-[#38BDF8]" : "text-slate-400 hover:text-white hover:bg-[#111827]"}`}>
              {active && <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-[#38BDF8] rounded-r"></div>}
              <item.icon size={18} strokeWidth={active ? 2.5 : 2} />
              <span className="text-xs font-semibold tracking-wider">{item.label}</span>
            </Link>
          );
        })}
      </nav>
      
      <div className="mt-auto px-6 pb-28">
        <div className="bg-[#0A0F1D] border border-border p-3 rounded text-[10px] font-mono space-y-1">
          <div className="flex justify-between">
            <span className="text-slate-500">NODE ID:</span>
            <span className="text-[#10B981]">OP-DEL-04</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">LATENCY:</span>
            <span className="text-[#38BDF8]">14ms</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">ENCRYPTION:</span>
            <span className="text-slate-300">ACTIVE</span>
          </div>
        </div>
      </div>
    </div>
  );
}
